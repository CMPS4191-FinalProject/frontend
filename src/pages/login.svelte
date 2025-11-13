<script lang="ts">
	import {
		BlockTitle,
		Button,
		List,
		ListInput,
		Navbar,
		NavTitle,
		NavTitleLarge,
		Page,
		Preloader
	} from 'framework7-svelte';

	import { APIInstance } from '@/ts/api-service';
	import type { LoginRequest } from '@/ts/be/adapter';
	import { Lock, User } from '@lucide/svelte';
	import type { Router } from 'framework7/types';
	import { onMount } from 'svelte';

	interface F7Router {
		f7router: Router.Router;
	}

	const { f7router }: F7Router = $props();

	// Form state
	let username = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');

	// Form validation
	const isFormValid = $derived(() => {
		return username.trim() !== '' && password.trim() !== '';
	});

	onMount(async () => {
		const isAuthenticated = await APIInstance.isAuthenticated();
		if (isAuthenticated === true) {
			console.info('User is authenticated. Redirecting to home page.');
			setTimeout(() => {
				f7router.navigate('/home');
			}, 500);
		}
	});

	async function handleLogin() {
		if (!isFormValid) {
			errorMessage = 'Please fill in all fields with valid information.';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			const loginRequest: LoginRequest = {
				username: username,
				password: password
			};

			const token = await APIInstance.getAuthToken(loginRequest);

			if (token) {
				console.info('Login successful. Redirecting to home page.');
				f7router.navigate('/home');
			} else {
				errorMessage = 'Invalid username or password. Please try again.';
			}
		} catch (error) {
			console.error('Login error:', error);
			errorMessage = 'Login failed. Please check your connection and try again.';
		} finally {
			isLoading = false;
		}
	}
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
	<BlockTitle>Login to {import.meta.env.VITE_APP_NAME}</BlockTitle>
	<List strongIos dividersIos insetIos>
		<ListInput
			outline
			label="Username"
			floatingLabel
			type="text"
			placeholder="Your username"
			clearButton
			bind:value={username}
			disabled={isLoading}
		>
			<User slot="media" />
		</ListInput>
		<ListInput
			outline
			label="Password"
			floatingLabel
			type="password"
			placeholder="Your password"
			clearButton
			bind:value={password}
			disabled={isLoading}
		>
			<Lock slot="media" />
		</ListInput>
	</List>

	<!-- Error message -->
	{#if errorMessage}
		<BlockTitle class="text-color-red">{errorMessage}</BlockTitle>
	{/if}

	<!-- Login button -->
	<div class="block">
		<Button
			fill
			large
			disabled={!isFormValid || isLoading}
			onClick={handleLogin}
			class="login-button"
		>
			{#if isLoading}
				<Preloader size={16} class="margin-right" />
				Logging in...
			{:else}
				Login
			{/if}
		</Button>
	</div>
</Page>

<style>
	:global(.login-button) {
		margin: 16px;
	}

	:global(.text-color-red) {
		color: var(--f7-theme-color-red) !important;
		text-align: center;
		margin: 16px;
	}

	:global(.margin-right) {
		margin-inline-end: 8px;
	}
</style>
