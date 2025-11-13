/// <reference types="vite/client" />

interface ViteTypeOptions {
	// By adding this line, you can make the type of ImportMetaEnv strict
	// to disallow unknown keys.
	// strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
	readonly VITE_APP_NAME: string;
	readonly VITE_APP_THEME: string;
	readonly VITE_BE_BASE: string;
	readonly VITE_BE_VERSION: string;
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
