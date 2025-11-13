<script lang="ts">
	const { device_id }: { device_id: string } = $props();
	import { APIInstance } from '@/ts/api-service';
	import * as API from '@/ts/be/adapter';
	import { Block, BlockTitle, Navbar, NavTitle, NavTitleLarge, Page } from 'framework7-svelte';
	import { onMount } from 'svelte';
	let nodeDetails: API.NodeResponse | null = $state(null);
	onMount(async () => {
		if (!nodeDetails) {
			nodeDetails = await APIInstance.getSingleNode(device_id);
		}
	});
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
</Page>
