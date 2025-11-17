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
	import type { LoginRequest, UserCreateRequest } from '@/ts/be/adapter';
	import { Lock, Mail, User } from '@lucide/svelte';
	import type { Router } from 'framework7/types';
	import { onMount } from 'svelte';

	interface F7Router {
		f7router: Router.Router;
	}

	const { f7router }: F7Router = $props();

	// Form state
	let email = $state('');
	let username = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');
	let isRegisterMode = $state(false);

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

			const res = await APIInstance.getAuthToken(loginRequest);

			console.log(res)

			if (res && res instanceof Object && !('error' in res)) {
				console.info('Login successful. Redirecting to home page.');
				f7router.navigate('/home');
			} 
			
			if (res && res instanceof Object && 'error' in res) {
				errorMessage = res.message || 'Invalid username or password.';
			}
		} catch (error) {
			console.error('Login error:', error);
			errorMessage = 'Login failed. Please check your connection and try again.';
		} finally {
			isLoading = false;
		}
	}

	async function handleRegister() {
		if (!isFormValid) {
			errorMessage = 'Please fill in all fields with valid information.';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			const registerRequest: UserCreateRequest = {
				email: email,
				username: username,
				password: password
			};

			const success = await APIInstance.registerUser(registerRequest);

			if (success && success instanceof Object && 'message' in success) {
				console.info('Registration successful. Please check your email for verification.');
				errorMessage = success.message;
			} else {
				errorMessage = 'Registration failed. Username may already exist.';
			}
		} catch (error) {
			console.error('Registration error:', error);
			errorMessage = 'Registration failed. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	function toggleMode() {
		isRegisterMode = !isRegisterMode;
		errorMessage = '';
		email = '';
		username = '';
		password = '';
	}
</script>

<Page>
	<!-- Top Navbar -->
	<Navbar sliding={false}>
		<!-- Nav Title -- When scrolling -->
		<NavTitle sliding
			>{isRegisterMode ? 'Register' : 'Login'} - {import.meta.env.VITE_APP_NAME}</NavTitle
		>
		<!-- Large Nav Title -- When at the top -->
		<NavTitleLarge
			>{isRegisterMode ? 'Register' : 'Login'} - {import.meta.env.VITE_APP_NAME}</NavTitleLarge
		>
	</Navbar>

	<!-- Page content -->
	<BlockTitle
		>{isRegisterMode
			? 'Create an Account'
			: `Login to ${import.meta.env.VITE_APP_NAME}`}</BlockTitle
	>
	<List strongIos dividersIos insetIos>
		{#if isRegisterMode}
			<ListInput
				outline
				label="Email"
				floatingLabel
				type="email"
				placeholder="Your email"
				clearButton
				bind:value={email}
				disabled={isLoading}
			>
				<Mail slot="media" />
			</ListInput>
		{/if}
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

	<!-- Login/Register button -->
	<div class="block">
		<Button
			fill
			large
			disabled={!isFormValid || isLoading}
			onClick={isRegisterMode ? handleRegister : handleLogin}
			class="login-button"
		>
			{#if isLoading}
				<Preloader size={16} class="margin-right" />
				{isRegisterMode ? 'Creating Account...' : 'Logging in...'}
			{:else}
				{isRegisterMode ? 'Register' : 'Login'}
			{/if}
		</Button>
	</div>

	<!-- Toggle between login and register -->
	<div class="block text-center">
		<p class="toggle-text">
			{isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
			<button type="button" onclick={toggleMode} class="link-button">
				{isRegisterMode ? 'Login here' : 'Register here'}
			</button>
		</p>
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

	.text-center {
		text-align: center;
	}

	.toggle-text {
		color: var(--f7-text-color);
	}

	.link-button {
		background: none;
		border: none;
		color: var(--f7-theme-color);
		text-decoration: none;
		font-weight: 500;
		cursor: pointer;
		padding: 0;
		font-size: inherit;
	}

	.link-button:hover {
		text-decoration: underline;
	}
</style>
