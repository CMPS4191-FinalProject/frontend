import NotFoundPage from '@/pages/404.svelte';
import HealthcheckPing from '@/pages/healthcheck_ping.svelte';
import HomePage from '@/pages/home.svelte';
import LoginPage from '@/pages/login.svelte';
import SettingsPage from '@/pages/settings.svelte';
import { Router } from 'framework7/types';

const routes: Router.RouteParameters[] = [
	{
		path: '/',
		component: LoginPage
	},
	{
		path: '/home',
		component: HomePage
	},
	{
		path: '/settings',
		component: SettingsPage
	},
	{
		path: '/login',
		component: LoginPage
	},
	{
		path: '/healthcheck_ping',
		component: HealthcheckPing
	},
	{
		path: '(.*)',
		component: NotFoundPage
	}
];

export default routes;
