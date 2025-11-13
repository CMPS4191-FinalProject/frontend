<script lang="ts">
	import {
		Block,
		Navbar,
		NavTitle,
		NavTitleLarge,
		Page
	} from 'framework7-svelte';

	import * as API from '@/ts/be/adapter';
	import type { Router } from 'framework7/types';
	import { onMount } from 'svelte';
	const APIInstance = new API.New(API.New.newEndpoint(), import.meta.env.VITE_BE_VERSION);

    interface F7Router {
        f7router: Router.Router;
    }

    const { f7router }: F7Router = $props();

	onMount(async () => {
		const isAuthenticated = await APIInstance.isAuthenticated();
		if(isAuthenticated === true) 
        {
            console.info('User is authenticated. Redirecting to home page.');
            f7router.navigate('/home');
			// window.location.href = '/';
		}
	
	});
</script>

<Page>
    <!-- Top Navbar -->
    <Navbar sliding={false}>
        <!-- Nav Title -- When scrolling -->
        <NavTitle sliding>Login - {import.meta.env.VITE_APP_NAME}</NavTitle>
        <!-- Large Nav Title -- When at the top -->
        <NavTitleLarge>Login - {import.meta.env.VITE_APP_NAME}</NavTitleLarge>
    </Navbar>

    <!-- Page content -->
    <Block>
        <p>This is the login page. Implement login functionality here.</p>
    </Block>
</Page>