<script lang="ts">
	import { LucideLogOut } from '@lucide/svelte';
	import { BlockTitle, List, ListItem, Navbar, Page } from 'framework7-svelte';

	import type { Router } from 'framework7/types';
		interface F7Router {
		f7router: Router.Router;
	}


	const { f7router }: F7Router = $props();



	import { APIInstance } from '@/ts/api-service';
</script>

<Page>
	<Navbar title="Settings" backLink="Back" />

	<BlockTitle>Settings</BlockTitle>

	<List strong inset dividersIos>
		<ListItem
			title="Logout"
			text="Sign out of your account"
			class="cursor-pointer"
			on:click={async () => {
				console.log('Logging out...');
				await APIInstance.logout();
				f7router.navigate('/login');
			}}
		>
			<button
				slot="after"
				class="logout-button cursor-pointer"
				aria-label="Logout"
			>
				<LucideLogOut size={24} color="#d67280" />
			</button>
		</ListItem>
	</List>
</Page>

<style>
	.logout-button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}
</style>
