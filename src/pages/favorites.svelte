<script lang="ts">
	import { Heart } from '@lucide/svelte';
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

	import { APIInstance } from '@/ts/api-service';
	import * as API from '@/ts/be/adapter';
	import type { Router } from 'framework7/types';
	import { onMount } from 'svelte';

	let allNodes: API.NodeResponse[] | null = $state(null);
	let favoriteNodes: Set<number> = $state(new Set());
	let isLoading = $state(true);

	interface F7Router {
		f7router: Router.Router;
	}

	const { f7router }: F7Router = $props();

	onMount(async () => {
		const isAuthenticated = await APIInstance.isAuthenticated();
		if (isAuthenticated === false) {
			console.warn('User is not authenticated. Redirecting to login.');

			isLoading = false;
			setTimeout(() => {
				f7router.navigate('/login');
			}, 850);
			return;
		}

		// Fetch all nodes
		const nodesResponse = await APIInstance.getAllNodes();
		if (nodesResponse !== null) {
			allNodes = nodesResponse;
		}

		// Fetch user's favorite nodes
		const favoritesResponse = await APIInstance.getFavoriteNodes();
		if (favoritesResponse !== null) {
			favoriteNodes = new Set(favoritesResponse.map((fav) => fav.device_id));
		}

		isLoading = false;
	});

	async function toggleFavorite(deviceId: number) {
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
</style>
