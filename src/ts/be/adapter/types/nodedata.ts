// Node data (sensor readings) related types

import { PaginationResponse } from './common';

export interface NodeDataCreateRequest {
	user_id: number;
	device_id: number;
	moisture_content?: number | null;
}

export interface NodeDataItem {
	id: number;
	user_id: number;
	device_id: number;
	moisture_content?: number | null;
	timestamp: string; // ISO 8601 datetime string
}

export interface NodeDataResponse {
	data: NodeDataItem[];
	meta?: PaginationResponse;
}