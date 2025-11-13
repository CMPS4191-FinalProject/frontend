<script lang="ts">
	const { device_id }: { device_id: string } = $props();
	import { APIInstance } from '@/ts/api-service';
	import * as API from '@/ts/be/adapter';
	import type { ISocketMessage } from '@/ts/be/adapter/types';
	import { Block, BlockTitle, List, ListItem, Navbar, NavTitle, NavTitleLarge, Page } from 'framework7-svelte';
	import { onMount } from 'svelte';
	
	let nodeDetails: API.NodeResponse | null = $state(null);
	let socketMessages: ISocketMessage[] = $state([]);
	let isSocketConnected = $state(false);
	let connectionStatus = $state('Disconnected');
	let latestData: ISocketMessage['data'] | null = $state(null);

	onMount(async () => {
		// Fetch node details
		if (!nodeDetails) {
			nodeDetails = await APIInstance.getSingleNode(device_id);
		}

		// Start socket connection and monitor
		await initializeSocketMonitor();
	});

	// onDestroy(() => {
	// 	// Clean up socket connection
	// 	if (APIInstance.socket) {
	// 		APIInstance.socket.close();
	// 	}
	// });

	async function initializeSocketMonitor() {
        console.log("Initializing socket monitor for device:", device_id);
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
						// Add to messages array (keep only last 50 messages)
						socketMessages = [message, ...socketMessages].slice(0, 50);
						
						// Update latest data
						if (message.data) {
							latestData = message.data;
						}
						
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
			<!-- <LeafGauge value={nodeDetails.status} /> -->
		</Block>
	{:else}
		<Block>
			<p>Loading node details...</p>
		</Block>
	{/if}

	<!-- Socket Monitor Section -->
	<BlockTitle>Real-time Monitor</BlockTitle>
	<Block>
		<p><strong>Connection Status:</strong> 
			<span class={isSocketConnected ? 'status-connected' : 'status-disconnected'}>
				{connectionStatus}
			</span>
		</p>
		
		{#if !isSocketConnected}
			<p>
				<button class="button button-fill" onclick={reconnectSocket}>
					Reconnect
				</button>
			</p>
		{/if}
	</Block>

	<!-- Latest Data -->
	{#if latestData}
		<BlockTitle>Latest Reading</BlockTitle>
		<Block>
			<p><strong>Moisture Content:</strong> {latestData.moisture_content}%</p>
			<p><strong>Device ID:</strong> {latestData.device_id}</p>
			<p><strong>User ID:</strong> {latestData.user_id}</p>
		</Block>
	{/if}

	<!-- Socket Messages -->
	<BlockTitle>
		Recent Messages ({socketMessages.length})
		{#if socketMessages.length > 0}
			<button class="button button-small button-outline" onclick={clearMessages}>
				Clear
			</button>
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
									<strong>Type:</strong> {message.type}
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
				{isSocketConnected ? 'No messages received yet for this device.' : 'Connect to start receiving messages.'}
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
</style>
