// Type definitions for Capacitor and Framework7
export interface CapacitorGlobal {
	Plugins?: {
		SplashScreen?: {
			hide(): Promise<void>;
		};
		App?: {
			addListener(eventName: string, callback: () => void, useCapture?: boolean): Promise<any>;
		};
		Keyboard?: {
			setResizeMode(options: { mode: string }): Promise<void>;
			setScroll(options: { isDisabled: boolean }): Promise<void>;
			setAccessoryBarVisible(options: { isVisible: boolean }): Promise<void>;
		};
	};
}

export interface Framework7Instance {
	$: any;
	device: any;
	actions: {
		close(selector: string): void;
	};
	dialog: {
		close(selector: string): void;
	};
	sheet: {
		close(selector: string): void;
	};
	popover: {
		close(selector: string): void;
	};
	popup: {
		close(selector: string): void;
	};
	loginScreen: {
		close(selector: string): void;
	};
	searchbar: {
		disable(selector: string): void;
	};
	card: {
		close(selector: string): void;
	};
	panel: {
		close(selector: string): void;
	};
	views: {
		get(selector: string): any;
		current: any;
	};
	input: {
		scrollIntoView(
			inputEl: HTMLElement | string,
			durationMS?: number,
			centered?: boolean,
			force?: boolean
		): void;
	};
}

export interface CapacitorApp {
	f7: Framework7Instance | null;
	handleSplashscreen(): void;
	handleAndroidBackButton(): void;
	handleKeyboard(): void;
	init(f7: Framework7Instance): void;
}
