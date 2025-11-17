<script lang="ts">
	const { device_id }: { device_id: string } = $props();
	import LeafGauge from '@/components/app/leaf_gauge.svelte';
	import { APIInstance } from '@/ts/api-service';
	import * as API from '@/ts/be/adapter';
	import type { ISocketMessage } from '@/ts/be/adapter/types';
	import { Chart, registerables } from 'chart.js';
	import {
		Block,
		BlockTitle,
		List,
		ListItem,
		Navbar,
		NavTitle,
		NavTitleLarge,
		Page
	} from 'framework7-svelte';
	import { onMount } from 'svelte';

	Chart.register(...registerables);

	let nodeDetails: API.NodeResponse | null = $state(null);
	let nodeData: API.NodeDataItem2[] = $state([]);
	let socketMessages: ISocketMessage[] = $state([]);
	let isSocketConnected = $state(false);
	let connectionStatus = $state('Disconnected');
	let latestData: ISocketMessage['data'] | null = $state(null);
	let chartCanvas: HTMLCanvasElement | null = $state(null);
	let chart: Chart | null = null;

	const MAX_CHART_POINTS = 32;
	const MIN_MOISTURE_DELTA = 0.75;
	const MIN_TIME_GAP_MS = 5 * 60 * 1000;

	function toTimestampMs(sample: API.NodeDataItem2): number {
		return new Date(sample.timestamp).getTime();
	}

	function moistureValue(sample: API.NodeDataItem2): number {
		return sample.moisture_content ?? 0;
	}

	function extractKeyframes(data: API.NodeDataItem2[]): API.NodeDataItem2[] {
		if (data.length === 0) {
			return [];
		}

		const sorted = [...data].sort((a, b) => toTimestampMs(a) - toTimestampMs(b));
		const seenTimestamps = new Set<number>();
		const uniqueSamples: API.NodeDataItem2[] = [];

		for (const sample of sorted) {
			const timestamp = toTimestampMs(sample);
			if (!seenTimestamps.has(timestamp)) {
				seenTimestamps.add(timestamp);
				uniqueSamples.push(sample);
			}
		}

		if (uniqueSamples.length <= 2) {
			return uniqueSamples;
		}

		const keyframes: API.NodeDataItem2[] = [];
		const addSample = (sample: API.NodeDataItem2) => {
			if (keyframes.length === 0 || keyframes[keyframes.length - 1] !== sample) {
				keyframes.push(sample);
			}
		};

		addSample(uniqueSamples[0]);
		let lastKept = uniqueSamples[0];

		for (let i = 1; i < uniqueSamples.length - 1; i++) {
			const sample = uniqueSamples[i];
			const delta = Math.abs(moistureValue(sample) - moistureValue(lastKept));
			const timeGap = toTimestampMs(sample) - toTimestampMs(lastKept);

			if (delta >= MIN_MOISTURE_DELTA || timeGap >= MIN_TIME_GAP_MS) {
				addSample(sample);
				lastKept = sample;
			}
		}

		addSample(uniqueSamples[uniqueSamples.length - 1]);

		const desiredPoints = Math.min(MAX_CHART_POINTS, uniqueSamples.length);

		if (keyframes.length < desiredPoints) {
			const step = desiredPoints > 1 ? (uniqueSamples.length - 1) / (desiredPoints - 1) : 0;
			for (let i = 0; i < desiredPoints; i++) {
				const index = desiredPoints > 1 ? Math.floor(i * step) : 0;
				addSample(uniqueSamples[index]);
			}
		}

		if (keyframes.length > MAX_CHART_POINTS) {
			const step = Math.ceil(keyframes.length / MAX_CHART_POINTS);
			const sampled: API.NodeDataItem2[] = [];

			for (let i = 0; i < keyframes.length; i += step) {
				sampled.push(keyframes[i]);
			}

			const lastSample = keyframes[keyframes.length - 1];
			if (sampled[sampled.length - 1] !== lastSample) {
				sampled.push(lastSample);
			}

			return sampled;
		}

		return keyframes;
	}

	function renderIfReady() {
		if (nodeData.length > 0 && chartCanvas) {
			renderChart();
		}
	}

	onMount(async () => {
		// Fetch node details
		if (!nodeDetails) {
			nodeDetails = await APIInstance.getSingleNode(device_id);
		}

		if (nodeData.length === 0) {
			// Fetch historical node data
			const historicalData = await APIInstance.getNodeData(device_id);
			if (historicalData !== null) {
				nodeData = historicalData;
			}
		}

		setTimeout(() => {
			renderIfReady();
		}, 1500);
		setInterval(() => {
			renderIfReady();
		}, 3000);

		// Start socket connection and monitor
		await initializeSocketMonitor();
	});

	// onDestroy(() => {
	// 	// Clean up socket connection
	// 	if (APIInstance.socket) {
	// 		APIInstance.socket.close();
	// 	}
	// });

	function renderChart() {
		if (!nodeData || !chartCanvas) return;

		// Destroy existing chart if any
		if (chart) {
			chart.destroy();
		}

		// Prepare data for the chart
		const keyframes = extractKeyframes(nodeData);
		if (keyframes.length === 0) {
			return;
		}

		const labels = keyframes.map((item) => new Date(item.timestamp).toLocaleString());
		const moistureValues = keyframes.map((item) => item.moisture_content ?? 0);

		// Create the chart
		chart = new Chart(chartCanvas, {
			type: 'line',
			data: {
				labels: labels,
				
				datasets: [
					{
						label: 'Moisture Content (%)',
						data: moistureValues,
						borderColor: 'rgb(34, 197, 94)',
						backgroundColor: 'rgba(34, 197, 94, 0.1)',
						tension: 0.3,
						fill: true
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: true,
						position: 'top'
					},
					title: {
						display: false,
						text: 'Moisture Content Over Time'
					}
				},
				scales: {
					y: {
						beginAtZero: true,
						max: 100,
						title: {
							display: false,
							text: 'Moisture (%)'
						}
					},
					x: {
						title: {
							display: false,
							text: 'Time'
						},
						ticks: {
							maxRotation: 70,
							minRotation: 70
						}
					}
				}
			}
		});
	}

	async function initializeSocketMonitor() {
		console.log('Initializing socket monitor for device:', device_id);
		try {
			// Start socket connection using APIInstance
			let socket = APIInstance.socket;

			if (!socket) {
				// connectionStatus = 'Failed to connect';
				// return;
				socket = await APIInstance.startSocketConnection();
				if (!socket) {
					connectionStatus = 'Failed to connect';
					return;
				}
			}

			// Set up socket event handlers
			socket.onopen = () => {
				isSocketConnected = true;
				connectionStatus = 'Connected';
				console.info('Socket connected successfully');
			};

			socket.onclose = () => {
				isSocketConnected = false;
				connectionStatus = 'Disconnected';
				APIInstance.socket = null;
				console.info('Socket disconnected');
			};

			socket.onerror = (error) => {
				isSocketConnected = false;
				connectionStatus = 'Error';
				console.error('Socket error:', error);
			};

			socket.onmessage = (event) => {
				try {
					const message: ISocketMessage = JSON.parse(event.data);
					// Filter messages for this specific device
					if (message.device_id === parseInt(device_id)) {
						nodeData.push(message.data as API.NodeDataItem2);
						// Add to messages array (keep only last 50 messages)
						socketMessages = [message, ...socketMessages].slice(0, 50);

						// Update latest data
						if (message.data) {
							latestData = message.data;
						}

						renderIfReady();

						console.info('Received socket message for device:', device_id, message);
					}
				} catch (error) {
					console.error('Error parsing socket message:', error);
				}
			};
		} catch (error) {
			console.error('Error initializing socket monitor:', error);
			connectionStatus = 'Failed to initialize';
		}
	}

	function reconnectSocket() {
		if (APIInstance.socket) {
			APIInstance.socket.close();
		}
		connectionStatus = 'Connecting...';
		initializeSocketMonitor();
	}

	function clearMessages() {
		socketMessages = [];
	}

	function formatTimestamp(timestamp: string): string {
		return new Date(timestamp).toLocaleString();
	}
</script>

<Page>
	<!-- Top Navbar -->
	<Navbar sliding={false}>
		<!-- Nav Title -- When scrolling -->
		<NavTitle sliding>{import.meta.env.VITE_APP_NAME}</NavTitle>
		<!-- Large Nav Title -- When at the top -->
		<NavTitleLarge>{import.meta.env.VITE_APP_NAME}</NavTitleLarge>
	</Navbar>

	<!-- Page content -->
	<BlockTitle>Node Details: {device_id}</BlockTitle>

	<!-- Node Information -->
	{#if nodeDetails != null}
		<Block>
			<p><strong>Device ID:</strong> {nodeDetails.device_id}</p>
			<p><strong>Status:</strong> {nodeDetails.status}</p>
			{#if nodeDetails.status_details}
				<p><strong>Status Details:</strong> {nodeDetails.status_details}</p>
			{/if}
		</Block>
	{:else}
		<Block>
			<p>Loading node details...</p>
		</Block>
	{/if}

	<!-- Latest Data with Leaf Gauge -->
	{#if latestData}
		<BlockTitle>Latest Reading</BlockTitle>
		<Block>
			<p><strong>Moisture Content:</strong> {latestData.moisture_content}%</p>
			<div class="margin-top">
				<LeafGauge value={Math.floor((latestData.moisture_content || 0) / 20)} />
			</div>
			<p class="margin-top"><strong>Device ID:</strong> {latestData.device_id}</p>
			<p><strong>User ID:</strong> {latestData.user_id}</p>
		</Block>
	{/if}

	<!-- Moisture Content Chart -->
	{#if nodeData !== null && nodeData.length > 0}
		<BlockTitle>Moisture Content History</BlockTitle>
		<Block>
			<div class="chart-container">
				<canvas bind:this={chartCanvas}></canvas>
			</div>
		</Block>
	{/if}

	<!-- Socket Monitor Section -->
	<BlockTitle>Real-time Monitor</BlockTitle>
	<Block>
		<p>
			<strong>Connection Status:</strong>
			<span class={isSocketConnected ? 'status-connected' : 'status-disconnected'}>
				{connectionStatus}
			</span>
		</p>

		{#if !isSocketConnected}
			<p>
				<button class="button button-fill" onclick={reconnectSocket}> Reconnect </button>
			</p>
		{/if}
	</Block>

	<!-- Socket Messages -->
	<BlockTitle>
		Recent Messages ({socketMessages.length})
		{#if socketMessages.length > 0}
			<button class="button button-small button-outline" onclick={clearMessages}> Clear </button>
		{/if}
	</BlockTitle>

	{#if socketMessages.length > 0}
		<List>
			{#each socketMessages as message (message.timestamp)}
				<ListItem>
					<div class="item-content">
						<div class="item-inner">
							<div class="item-title">
								<div class="message-header">
									<strong>Type:</strong>
									{message.type}
									<small class="timestamp">{formatTimestamp(message.timestamp)}</small>
								</div>
								<div class="message-content">
									<p><strong>Message:</strong> {message.message}</p>
									{#if message.data}
										<p><strong>Moisture:</strong> {message.data.moisture_content}%</p>
									{/if}
								</div>
							</div>
						</div>
					</div>
				</ListItem>
			{/each}
		</List>
	{:else}
		<Block>
			<p class="text-color-gray">
				{isSocketConnected
					? 'No messages received yet for this device.'
					: 'Connect to start receiving messages.'}
			</p>
		</Block>
	{/if}
</Page>

<style>
	.status-connected {
		color: var(--f7-theme-color-green);
		font-weight: bold;
	}

	.status-disconnected {
		color: var(--f7-theme-color-red);
		font-weight: bold;
	}

	.message-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-block-end: 8px;
	}

	.timestamp {
		font-size: 12px;
		color: var(--f7-text-color);
		opacity: 0.7;
	}

	.message-content p {
		margin: 4px 0;
		font-size: 14px;
	}

	.button-small {
		margin-inline-start: 10px;
	}

	.text-color-gray {
		color: var(--f7-text-color);
		opacity: 0.6;
		text-align: center;
		font-style: italic;
	}

	.chart-container {
		position: relative;
		block-size: 300px;
		inline-size: 100%;
	}

	.margin-top {
		margin-block-start: 12px;
	}
</style>
