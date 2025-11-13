// Import Framework7
import Framework7 from 'framework7/lite/bundle';

// Import Framework7-Svelte Plugin
import Framework7Svelte from 'framework7-svelte';

// Import Framework7 Styles
import 'framework7/css/bundle';

// Import Icons and App Custom Styles

import '@/css/app.css';

// Import App Component
import App from '@/components/app.svelte';
import { mount } from 'svelte';

// Import and initialize API service
import { initializeAPIInstance } from '@/ts/api-service';

// Init F7 Svelte Plugin
Framework7.use(Framework7Svelte);

// Initialize API Instance early
initializeAPIInstance();

// Mount Svelte App
mount(App, {
	target: document.getElementById('app')!
});
