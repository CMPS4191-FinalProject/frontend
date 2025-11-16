// Authentication related types

export interface LoginRequest {
	username: string;
	password: string;
}

export interface UserCreateRequest {
	username: string;
	password: string;
}

export interface AuthUser {
	user_id: number;
	username: string;
}

export interface AuthResponse {
	user: AuthUser;
	token: string;
}

export interface VerifyResponse {
	message: string;
}