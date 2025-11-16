// Node management related types

import { PaginationResponse } from './common';

export type NodeStatus = 'ONLINE' | 'OFFLINE' | 'ERROR';

export interface NodeCreateRequest {
	status: NodeStatus;
	status_details?: string;
}

export interface NodeUpdateRequest {
	status?: NodeStatus;
	status_details?: string;
}

export interface NodeResponse {
	device_id: number;
	status: NodeStatus;
	status_details?: string;
}

export interface NodesResponse {
	data: NodeResponse[];
	meta?: PaginationResponse;
}