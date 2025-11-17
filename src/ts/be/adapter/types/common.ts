// Common types used across multiple endpoints

export interface ErrorResponse {
	error: string | boolean;
	message?: string;
}

export interface PaginationResponse {
	page: number;
	per_page: number;
	total: number;
	total_pages: number;
}