// Node management related types

import { PaginationResponse } from './common';

export type NodeStatus = 'ONLINE' | 'OFFLINE' | 'ERROR';

export interface NodeCreateRequest {
	status: NodeStatus;
}

export interface NodeUpdateRequest {
	status?: NodeStatus;
}

export interface NodeResponse {
	device_id: number;
	status: NodeStatus;
}

export interface NodesResponse {
	data: NodeResponse[];
	meta?: PaginationResponse;
}