<script>
	import { LucideLogOut } from '@lucide/svelte';
	import { Block, Navbar, Page } from 'framework7-svelte';

	import { APIInstance } from '@/ts/api-service';
</script>

<Page>
	<Navbar title="Settings" backLink="Back" />
	<Block strong inset>
		<p>Settings</p>
		
					<button
						class="logout-button"
						onclick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							APIInstance.logout();
						}}
						aria-label="Logout"
					>
						<LucideLogOut
							size={24}
							class="logout-inactive"
						/>
					</button>
			
	</Block>
</Page>
