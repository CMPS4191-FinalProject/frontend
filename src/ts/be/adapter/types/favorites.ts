// Node favorites related types

export interface NodeFavoriteCreateRequest {
	device_id: number;
}

export interface NodeFavoriteItem {
	device_id: number;
}

export interface NodeFavoritesResponse {
	data: NodeFavoriteItem[];
}