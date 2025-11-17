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

	import { APIInstance } from '@/ts/api-service';
	import * as API from '@/ts/be/adapter';
	import { onMount } from 'svelte';

	let userFavorites: API.NodeFavoritesResponse | null = $state(null);

	onMount(async () => {
		const isAuthenticated = await APIInstance.isAuthenticated();
		if (isAuthenticated === false) {
			console.warn('User is not authenticated. Redirecting to login page.');
			// window.location.href = '/login';
		}
		if (!userFavorites) {
			userFavorites = await APIInstance.getFavoriteNodes();
		}
	});
</script>

<Page name="home">
	<!-- Top Navbar -->
	<Navbar sliding={false}>
		<!-- Nav Title -- When scrolling -->
		<NavTitle sliding>{import.meta.env.VITE_APP_NAME}</NavTitle>
		<!-- Large Nav Title -- When at the top -->
		<NavTitleLarge>{import.meta.env.VITE_APP_NAME}</NavTitleLarge>
	</Navbar>

	<!-- Page content -->
	<BlockTitle>Favorite Nodes</BlockTitle>
	{#if userFavorites != null && userFavorites.length === 0}
		<Block>
			<p>No favorite nodes found. Add some nodes to your favorites to see them here.</p>
		</Block>
	{/if}
	{#if userFavorites === null}
		<Block>
			<p>Loading favorite nodes...</p>
		</Block>
	{/if}
	<List strong inset dividersIos>
		{#if userFavorites != null}
			{#each userFavorites as favorite}
				<ListItem
					link={`/node/${favorite.device_id}`}
					title={favorite.device_id}
					text="View details and metrics"
				/>
			{/each}
		{/if}
	</List>

	<BlockTitle>Navigation</BlockTitle>
	<List strong inset dividersIos>
		<ListItem link="/healthcheck_ping" title="HealthCheck Endpoint" />
	</List>
</Page>
