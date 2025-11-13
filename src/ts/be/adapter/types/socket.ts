export interface ISocketMessage {
    type: string;
    message: string;
    timestamp: string;
    device_id: number;
    data: {
        device_id: number;
        moisture_content: number;
        user_id: number;
    };
}