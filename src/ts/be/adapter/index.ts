import { Capacitor } from '@capacitor/core';
import { AuthResponse, LoginRequest, NodeFavoritesResponse, NodesResponse } from './types';
import { UserCreateRequest } from './types/auth';
import { NodeFavoriteCreateRequest } from './types/favorites';
import HealthCheckResponse from './types/healthcheck';
import { NodeCreateRequest, NodeResponse, NodeUpdateRequest } from './types/nodes';
export type {
	AuthResponse, HealthCheckResponse, LoginRequest, NodeCreateRequest, NodeFavoriteCreateRequest, NodeFavoritesResponse, NodeResponse, NodesResponse, NodeUpdateRequest,
	UserCreateRequest
};

class API {
	base: string;
	version: string;
	auth: AuthResponse | null = null;

	constructor(base: string, version: string) {
		this.base = base;
		this.version = version;
	}

	private async fetchJSON<T>(
		url: string,
		body?: any,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
	): Promise<T> {
		const response = await fetch(this.base + this.version + url, {
			method: method,
			headers: {
				'Content-Type': 'application/json',
				...(this.auth ? { Authorization: `Bearer ${this.auth.token}` } : {})
			},
			body: body ? JSON.stringify(body) : undefined
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	/***************** AUTH */
	/**
	 * Ping the healthcheck endpoint.
	 * @returns API.fetchJSON<HealthCheckResponse>
	 */
	async healthcheckPing(): Promise<HealthCheckResponse | null> {
		try {
			return await this.fetchJSON<HealthCheckResponse>('/healthcheck/');
		} catch (error) {
			console.error('Error fetching healthcheck:', error);
			return null;
		}
	}

	/**
	 * Get an authentication token using login credentials.
	 * @param loginRequest - The login request containing user credentials.
	 * @returns A promise that resolves to the authentication token or null if authentication fails.
	 */
	async getAuthToken(loginRequest: LoginRequest): Promise<string | null> {
		try {
			const response = await this.fetchJSON<AuthResponse>('/auth/login', loginRequest, 'POST');
			this.auth = response;
			return response.token;
		} catch (error) {
			console.error('Error fetching auth token:', error);
			return null;
		}
	}

	/**
	 * Clear the current authentication token.
	 */
	async clearAuthToken(): Promise<void> {
		this.auth = null;
	}

	/**
	 * Check if the user is currently authenticated.
	 * @returns A promise that resolves to true if authenticated, false otherwise.
	 */
	async isAuthenticated(): Promise<boolean> {
		return this.auth !== null;
	}

	/**
	 * Get the currently authenticated user.
	 * @returns A promise that resolves to the authenticated user or null if not authenticated.
	 */
	async getAuthenticatedUser(): Promise<AuthResponse | null> {
		return this.auth?.user ? this.auth : null;
	}

	/***************** USERS */
	/**
	 * Register a new user.
	 * @param userCreateRequest - The user creation request containing user details.
	 * @returns A promise that resolves to true if registration is successful, false otherwise.
	 */
	async registerUser(userCreateRequest: UserCreateRequest): Promise<boolean> {
		try {
			await this.fetchJSON<AuthResponse>('/auth/register', userCreateRequest, 'POST');
			return true;
		} catch (error) {
			console.error('Error registering user:', error);
			return false;
		}
	}

	/**
	 * Delete the currently authenticated user.
	 * @returns A promise that resolves to true if deletion is successful, false otherwise.
	 */
	async deleteUser(): Promise<boolean> {
		if (!this.auth) {
			console.error('No authenticated user to delete.');
			return false;
		}
		try {
			await this.fetchJSON<null>(`/users/${this.auth.user.user_id}`, null, 'DELETE');
			this.auth = null;
			return true;
		} catch (error) {
			console.error('Error deleting user:', error);
			return false;
		}
	}

	/***************** NODES */

	/**
	 * Fetch all monitoring nodes.
	 * @returns A promise that resolves to the nodes response or null if fetching fails.
	 */
	async getAllNodes(): Promise<NodesResponse | null> {
		try {
			return await this.fetchJSON<NodesResponse>('/nodes/');
		} catch (error) {
			console.error('Error fetching nodes:', error);
			return null;
		}
	}

	/**
	 * Create a new monitoring node.
	 * @param nodeCreateRequest - The node creation request containing node details.
	 * @returns A promise that resolves to true if creation is successful, false otherwise.
	 */
	async createNode(nodeCreateRequest: NodeCreateRequest): Promise<boolean> {
		try {
			await this.fetchJSON<NodeCreateRequest>('/nodes/', nodeCreateRequest, 'POST');
			return true;
		} catch (error) {
			console.error('Error creating node:', error);
			return false;
		}
	}

	/**
	 * Delete a monitoring node by its ID.
	 * @param nodeId - The ID of the node to delete.
	 * @returns A promise that resolves to true if deletion is successful, false otherwise.
	 */
	async deleteNode(nodeId: string): Promise<boolean> {
		try {
			await this.fetchJSON<null>(`/nodes/${nodeId}`, null, 'DELETE');
			return true;
		} catch (error) {
			console.error('Error deleting node:', error);
			return false;
		}
	}

	/**
	 * Fetch a single monitoring node by its ID.
	 * @param nodeId - The ID of the node to fetch.
	 * @returns A promise that resolves to the node response or null if fetching fails.
	 */
	async getSingleNode(nodeId: string): Promise<NodeResponse | null> {
		try {
			return await this.fetchJSON<NodeResponse>(`/nodes/${nodeId}`);
		} catch (error) {
			console.error('Error fetching single node:', error);
			return null;
		}
	}

	/**
	 * Update a monitoring node by its ID.
	 * @param nodeId - The ID of the node to update.
	 * @param nodeUpdateRequest - The node update request containing updated node details.
	 * @returns A promise that resolves to true if update is successful, false otherwise.
	 */
	async updateNode(nodeId: string, nodeUpdateRequest: NodeUpdateRequest): Promise<boolean> {
		try {
			await this.fetchJSON<NodeUpdateRequest>(`/nodes/${nodeId}`, nodeUpdateRequest, 'PUT');
			return true;
		} catch (error) {
			console.error('Error updating node:', error);
			return false;
		}
	}

	/***************** FAVORITES */

	/**
	 * Fetch favorite nodes for the authenticated user.
	 * @returns A promise that resolves to the node favorites response or null if fetching fails.
	 */
	async getFavoriteNodes(): Promise<NodeFavoritesResponse | null> {
		if (!this.auth) {
			console.error('No authenticated user for fetching favorite nodes.');
			return null;
		}
		try {
			return await this.fetchJSON<NodeFavoritesResponse>(
				`/favorites/user/${this.auth.user.user_id}/`
			);
		} catch (error) {
			console.error('Error fetching favorite nodes:', error);
			return null;
		}
	}

	/**
	 * Add a favorite node for the authenticated user.
	 * @param nodeFavoriteCreateRequest - The node favorite creation request containing device ID.
	 * @returns A promise that resolves to true if addition is successful, false otherwise.
	 */
	async addFavoriteNode(nodeFavoriteCreateRequest: NodeFavoriteCreateRequest): Promise<boolean> {
		if (!this.auth) {
			console.error('No authenticated user for adding favorite node.');
			return false;
		}
		try {
			await this.fetchJSON<NodeResponse>(`/favorites`, nodeFavoriteCreateRequest, 'POST');
			return true;
		} catch (error) {
			console.error('Error adding favorite node:', error);
			return false;
		}
	}

	/**
	 * Remove a favorite node for the authenticated user by device ID.
	 * @param deviceId - The device ID of the favorite node to remove.
	 * @returns A promise that resolves to true if removal is successful, false otherwise.
	 */
	async removeFavoriteNode(deviceId: number): Promise<boolean> {
		if (!this.auth) {
			console.error('No authenticated user for removing favorite node.');
			return false;
		}
		try {
			await this.fetchJSON<null>(`/favorites/${deviceId}`, null, 'DELETE');
			return true;
		} catch (error) {
			console.error('Error removing favorite node:', error);
			return false;
		}
	}

	/***************** SOCKET */

	async startSocketConnection(): Promise<WebSocket | null> {
		if (!this.auth) {
			console.error('No authenticated user for socket connection.');
			return null;
		}
		try {
			const socketUrl = this.base.replace(/^http/, 'ws') + this.version + `/faucet`;
			const socket = new WebSocket(socketUrl);
			return socket;
		} catch (error) {
			console.error('Error starting socket connection:', error);
			return null;
		}
	}

	/***************** STATICS */

	static newEndpoint(): string {
		if (Capacitor.isNativePlatform()) {
			return import.meta.env.VITE_BE_BASE_T;
		} else {
			return import.meta.env.VITE_BE_BASE;
		}
	}
}

export { API as New };
