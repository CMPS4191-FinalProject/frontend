<script lang="ts">
	import { APIInstance } from '@/ts/api-service';
	import * as API from '@/ts/be/adapter';
	import { Block, BlockTitle, Button, Navbar, Page } from 'framework7-svelte';

	let pingResponse: API.HealthCheckResponse | null = $state(null);
	let didPing: boolean = $state(false);
</script>

<Page>
	<!-- Top Navbar -->
	<Navbar title="Healthcheck Endpoint" backLink="Back" />

	<!-- Page content -->
	<BlockTitle>About the functionality</BlockTitle>
	<Block>
		<p>
			You can ping the API by clicking the button below. The API will respond with a simple JSON
			object indicating the status of the API.
		</p>
	</Block>

	<BlockTitle>Demo</BlockTitle>
	<Block>
		<Button
			fill
			on:click={async () => {
				const res = await APIInstance.healthcheckPing();
				if (res) {
					pingResponse = res;
					didPing = true;
				} else {
					pingResponse = null;
					didPing = true;
				}
			}}
		>
			Ping API
		</Button>
	</Block>

	{#if pingResponse}
		<BlockTitle>API Response</BlockTitle>
		<Block>
			<pre>{JSON.stringify(pingResponse, null, 2)}</pre>
		</Block>
	{:else if didPing}
		<BlockTitle>No API Response</BlockTitle>
		<Block>
			<p>The API did not respond or an error occurred.</p>
		</Block>
	{/if}
</Page>
