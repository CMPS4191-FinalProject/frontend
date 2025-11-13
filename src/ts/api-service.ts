import * as API from '@/ts/be/adapter';

// Extend the global window interface
declare global {
    interface Window {
        APIInstance?: API.New;
    }
}

// Create a singleton APIInstance that can be imported anywhere
let apiInstance: API.New | null = null;

export function getAPIInstance(): API.New {
    if (!apiInstance) {
        apiInstance = new API.New(API.New.newEndpoint(), import.meta.env.VITE_BE_VERSION);
    }
    return apiInstance;
}

// Initialize the API instance (call this early in app lifecycle)
export function initializeAPIInstance(): API.New {
    if (!apiInstance) {
        apiInstance = new API.New(API.New.newEndpoint(), import.meta.env.VITE_BE_VERSION);
        
        // Also set it on window for backwards compatibility
        if (typeof window !== 'undefined') {
            window.APIInstance = apiInstance;
            apiInstance.startSocketConnection();
        }
    }
    return apiInstance;
}

// Export the instance directly for convenience
export const APIInstance = getAPIInstance();