// Node data (sensor readings) related types

export interface NodeDataCreateRequest {
	user_id: number;
	device_id: number;
	moisture_content?: number | null;
}

export interface NodeDataItemPrimitive {
	user_id: number;
	device_id: number;
	moisture_content?: number | null;
}

export interface NodeDataItem extends NodeDataItemPrimitive {
	id: number;
	timestamp: string; // ISO 8601 datetime string
}
export interface NodeDataWebsocketItem {
	device_id: number;
	message: string;
	timestamp: string; // ISO 8601 datetime string
	data: NodeDataItemPrimitive;
}

export type NodeDataResponse = NodeDataItem[];
