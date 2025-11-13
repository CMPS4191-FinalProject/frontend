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
	<BlockTitle>About the app</BlockTitle>
	<Block>
		<p>
			A demo app connecting a frontend to a Go backend that delivers random quotes. Currently
			includes a basic healthcheck endpoint.
		</p>
	</Block>

	<BlockTitle>Navigation</BlockTitle>
	<List strong inset dividersIos>
		<ListItem link="healthcheck_ping" title="HealthCheck Endpoint" />
	</List>
</Page>
