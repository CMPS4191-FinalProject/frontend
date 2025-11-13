export default interface HealthCheckResponse {
	status: 'alive' | 'dead';
	system_info: {
		environment: 'production' | 'development' | 'staging';
		version: `v${string}`;
	};
}
