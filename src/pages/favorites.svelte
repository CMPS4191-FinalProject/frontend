<script lang="ts">
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
	import { Heart } from '@lucide/svelte';

	import { APIInstance } from '@/ts/api-service';
	import * as API from '@/ts/be/adapter';
	import { onMount } from 'svelte';

	let allNodes: API.NodeResponse[] | null = $state(null);
	let favoriteNodes: Set<number> = $state(new Set());
	let isLoading = $state(true);
	let isDemoMode = $state(false);

	// Demo data for when backend is not available
	const demoNodes: API.NodeResponse[] = [
		{ device_id: 101, status: 'ONLINE', status_details: 'Operating normally' },
		{ device_id: 102, status: 'ONLINE', status_details: 'All systems go' },
		{ device_id: 103, status: 'OFFLINE', status_details: 'Maintenance mode' },
		{ device_id: 104, status: 'ONLINE', status_details: 'Recently updated' },
		{ device_id: 105, status: 'ERROR', status_details: 'Sensor malfunction' }
	];

	onMount(async () => {
		const isAuthenticated = await APIInstance.isAuthenticated();
		if (isAuthenticated === false) {
			console.warn('User is not authenticated. Using demo mode.');
			isDemoMode = true;
			allNodes = demoNodes;
			favoriteNodes = new Set([101, 104]); // Demo favorites
			isLoading = false;
			return;
		}
		
		// Fetch all nodes
		const nodesResponse = await APIInstance.getAllNodes();
		if (nodesResponse !== null) {
			allNodes = nodesResponse.data;
		} else {
			// Fallback to demo mode if API fails
			isDemoMode = true;
			allNodes = demoNodes;
		}

		// Fetch user's favorite nodes
		const favoritesResponse = await APIInstance.getFavoriteNodes();
		if (favoritesResponse !== null) {
			favoriteNodes = new Set(favoritesResponse.map((fav) => fav.device_id));
		} else if (isDemoMode) {
			favoriteNodes = new Set([101, 104]);
		}

		isLoading = false;
	});

	async function toggleFavorite(deviceId: number) {
		if (isDemoMode) {
			// Demo mode - just toggle locally
			const isFavorite = favoriteNodes.has(deviceId);
			const newFavorites = new Set(favoriteNodes);
			if (isFavorite) {
				newFavorites.delete(deviceId);
			} else {
				newFavorites.add(deviceId);
			}
			favoriteNodes = newFavorites;
			return;
		}

		const isFavorite = favoriteNodes.has(deviceId);

		if (isFavorite) {
			// Remove from favorites
			const success = await APIInstance.removeFavoriteNode(deviceId);
			if (success) {
				const newFavorites = new Set(favoriteNodes);
				newFavorites.delete(deviceId);
				favoriteNodes = newFavorites;
			}
		} else {
			// Add to favorites
			const success = await APIInstance.addFavoriteNode({ device_id: deviceId });
			if (success) {
				const newFavorites = new Set(favoriteNodes);
				newFavorites.add(deviceId);
				favoriteNodes = newFavorites;
			}
		}
	}
</script>

<Page name="favorites">
	<!-- Top Navbar -->
	<Navbar sliding={false}>
		<!-- Nav Title -- When scrolling -->
		<NavTitle sliding>{import.meta.env.VITE_APP_NAME}</NavTitle>
		<!-- Large Nav Title -- When at the top -->
		<NavTitleLarge>{import.meta.env.VITE_APP_NAME}</NavTitleLarge>
	</Navbar>

	<!-- Page content -->
	<BlockTitle>All Nodes</BlockTitle>
	{#if isDemoMode}
		<Block class="demo-notice">
			<p><strong>Demo Mode:</strong> Backend not available. Showing demo data.</p>
		</Block>
	{/if}
	{#if isLoading}
		<Block>
			<p>Loading nodes...</p>
		</Block>
	{:else if allNodes !== null && allNodes.length === 0}
		<Block>
			<p>No nodes found. Register nodes in the backend to see them here.</p>
		</Block>
	{:else if allNodes === null}
		<Block>
			<p>Failed to load nodes. Please try again.</p>
		</Block>
	{/if}
	<List strong inset dividersIos>
		{#if allNodes !== null && allNodes.length > 0}
			{#each allNodes as node}
				<ListItem
					link={isDemoMode ? '#' : `/node/${node.device_id}`}
					title={`Node ${node.device_id}`}
					text={`Status: ${node.status}${node.status_details ? ' - ' + node.status_details : ''}`}
				>
					<button
						slot="after"
						class="favorite-button"
						onclick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							toggleFavorite(node.device_id);
						}}
						aria-label={favoriteNodes.has(node.device_id)
							? 'Remove from favorites'
							: 'Add to favorites'}
					>
						<Heart
							size={24}
							fill={favoriteNodes.has(node.device_id) ? 'currentColor' : 'none'}
							class={favoriteNodes.has(node.device_id) ? 'favorite-active' : 'favorite-inactive'}
						/>
					</button>
				</ListItem>
			{/each}
		{/if}
	</List>
</Page>

<style>
	.favorite-button {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--f7-theme-color);
		transition: transform 0.2s ease;
	}

	.favorite-button:hover {
		transform: scale(1.1);
	}

	.favorite-button:active {
		transform: scale(0.95);
	}

	:global(.favorite-active) {
		color: var(--f7-theme-color-red, #ff3b30);
	}

	:global(.favorite-inactive) {
		color: var(--f7-text-color);
		opacity: 0.5;
	}

	.demo-notice {
		background-color: rgba(255, 193, 7, 0.1);
		border-left: 4px solid #ffc107;
		padding: 12px;
		margin: 16px;
	}

	.demo-notice p {
		margin: 0;
		color: #856404;
	}
</style>
