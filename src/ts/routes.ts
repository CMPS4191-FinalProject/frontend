import NotFoundPage from '@/pages/404.svelte';
import HealthcheckPing from '@/pages/healthcheck_ping.svelte';
import HomePage from '@/pages/home.svelte';
import SettingsPage from '@/pages/settings.svelte';

const routes = [
	{
		path: '/',
		component: HomePage
	},
	{
		path: '/settings',
		component: SettingsPage
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
