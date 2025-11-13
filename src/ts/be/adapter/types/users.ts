// User management related types

import { PaginationResponse } from './common';

export interface UserUpdateRequest {
	username?: string;
	password?: string;
}

export interface UserResponse {
	user_id: number;
	username: string;
}

export interface UsersResponse {
	data: UserResponse[];
	meta?: PaginationResponse;
}