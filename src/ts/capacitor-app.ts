import { getAPIInstance } from '@/ts/api-service';
import * as API from '@/ts/be/adapter';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { CapacitorApp, CapacitorGlobal, Framework7Instance } from './types';

declare global {
	interface Window {
		Capacitor?: CapacitorGlobal;
		APIInstance?: API.New; // Restore proper typing
	}
}

const capacitorApp: CapacitorApp = {
	f7: null,

	/**
	 * This method hides splashscreen after 2 seconds
	 */
	handleSplashscreen(): void {
		if (!window.Capacitor) return;

		setTimeout(() => {
			if (window.Capacitor?.Plugins?.SplashScreen) {
				window.Capacitor.Plugins.SplashScreen.hide();
			}
		}, 2000);
	},

	/**
	 * This method prevents back button tap to exit from app on android.
	 * In case there is an opened modal it will close that modal instead.
	 * In case there is a current view with navigation history, it will go back instead.
	 */
	handleAndroidBackButton(): void {
		const f7 = capacitorApp.f7;
		if (!f7) return;

		const $ = f7.$;
		if (!window.Capacitor?.Plugins?.App) return;

		window.Capacitor.Plugins.App.addListener(
			'backButton',
			(): void => {
				if ($('.actions-modal.modal-in').length) {
					f7.actions.close('.actions-modal.modal-in');
					return;
				}
				if ($('.dialog.modal-in').length) {
					f7.dialog.close('.dialog.modal-in');
					return;
				}
				if ($('.sheet-modal.modal-in').length) {
					f7.sheet.close('.sheet-modal.modal-in');
					return;
				}
				if ($('.popover.modal-in').length) {
					f7.popover.close('.popover.modal-in');
					return;
				}
				if ($('.popup.modal-in').length) {
					if ($('.popup.modal-in>.view').length) {
						const currentView = f7.views.get('.popup.modal-in>.view');
						if (currentView?.router?.history?.length > 1) {
							currentView.router.back();
							return;
						}
					}
					f7.popup.close('.popup.modal-in');
					return;
				}
				if ($('.login-screen.modal-in').length) {
					f7.loginScreen.close('.login-screen.modal-in');
					return;
				}

				if ($('.page-current .searchbar-enabled').length) {
					f7.searchbar.disable('.page-current .searchbar-enabled');
					return;
				}

				if ($('.page-current .card-expandable.card-opened').length) {
					f7.card.close('.page-current .card-expandable.card-opened');
					return;
				}

				const currentView = f7.views.current;
				if (currentView?.router?.history?.length > 1) {
					currentView.router.back();
					return;
				}

				if ($('.panel.panel-in').length) {
					f7.panel.close('.panel.panel-in');
					return;
				}
			},
			false
		);
	},

	/**
	 * This method does the following:
	 * - provides cross-platform view "shrinking" on keyboard open/close
	 * - hides keyboard accessory bar for all inputs except where it required
	 */
	handleKeyboard(): void {
		const f7 = capacitorApp.f7;
		if (!f7) return;

		if (!window.Capacitor?.Plugins?.Keyboard) return;

		const $ = f7.$;
		const Keyboard = window.Capacitor.Plugins.Keyboard;

		Keyboard.setResizeMode({ mode: 'native' });
		Keyboard.setScroll({ isDisabled: true });
		Keyboard.setAccessoryBarVisible({ isVisible: false });

		window.addEventListener('keyboardWillShow', (): void => {
			if (document.activeElement) {
				f7.input.scrollIntoView(document.activeElement as HTMLElement, 0, true, true);
			}
		});

		window.addEventListener('keyboardDidShow', (): void => {
			if (document.activeElement) {
				f7.input.scrollIntoView(document.activeElement as HTMLElement, 0, true, true);
			}
		});

		window.addEventListener('keyboardDidHide', (): void => {
			if (document.activeElement && $(document.activeElement).parents('.messagebar').length) {
				return;
			}
			Keyboard.setAccessoryBarVisible({ isVisible: true });
		});

		$(document).on(
			'touchstart',
			'input, textarea, select',
			(e: Event): void => {
				const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
				const nodeName = target.nodeName.toLowerCase();
				const type = (target as HTMLInputElement).type;
				const showForTypes: string[] = ['datetime-local', 'time', 'date', 'datetime'];

				if (nodeName === 'select' || showForTypes.includes(type)) {
					Keyboard.setAccessoryBarVisible({ isVisible: true });
				} else {
					Keyboard.setAccessoryBarVisible({ isVisible: false });
				}
			},
			true
		);
	},

	/**
	 * Initialize the capacitor app with Framework7 instance
	 */
	init(f7: Framework7Instance): void {
		// Get the shared API Instance and set it on window for backwards compatibility
		window.APIInstance = getAPIInstance();

		// Save f7 instance
		capacitorApp.f7 = f7;

		// Handle Android back button
		capacitorApp.handleAndroidBackButton();

		// Handle Splash Screen
		capacitorApp.handleSplashscreen();

		// Handle Keyboard
		capacitorApp.handleKeyboard();

		if (Capacitor.isNativePlatform()) {
			// Optionally, set a style
			StatusBar.setStyle({
				style: import.meta.env.VITE_APP_THEME === 'light' ? Style.Light : Style.Dark
			});
		}
	}
};

export default capacitorApp;
