import Schema, { type } from "./utils/Schema";
import { fromTypedJSON, toTypedJSON } from "./utils/TypedJSON";


export enum BackgroundMode {
	Auto,
	Color,
	ImageUrl,
	// ImageUpload,
	// Reddit
}

export declare type BackgroundModeType = keyof typeof BackgroundMode;

function getSchemaForMode(mode: BackgroundMode): Schema {
	switch (mode) {
	case BackgroundMode.Auto:
		return {};
	case BackgroundMode.Color:
		return {
			color: type.color("Color")
		};
	case BackgroundMode.ImageUrl:
		return {
			url: type.url("Image URL"),
			position: type.string("Position", "center, top, or bottom"),
		};
	}
}

function getDefaultsForMode(mode: BackgroundMode): { [key: string]: any } {
	switch (mode) {
	case BackgroundMode.Auto:
		return {};
	case BackgroundMode.Color:
		return {
			color: "#336699"
		};
	case BackgroundMode.ImageUrl:
		return {
			url: "",
			position: "bottom",
		};
	}
}

export function getDescriptionForMode(mode: BackgroundMode): string {
	switch (mode) {
	case BackgroundMode.Auto:
		return "Random backgrounds";
	case BackgroundMode.Color:
		return "A single color";
	case BackgroundMode.ImageUrl:
		return "An image from a URL";
	}
}


/**
 * Stores Background information, and applies it to document.body.
 */
export default class BackgroundStore {
	getMode(): BackgroundMode {
		const type = (localStorage.getItem("bg_mode")) as BackgroundModeType;
		return BackgroundMode[type] ?? BackgroundMode.Auto
	}

	getSchema(): Schema {
		return getSchemaForMode(this.getMode());
	}

	getValues(): ({ [key: string]: any }) {
		const ret: ({ [key: string]: any }) = {};

		Object.keys(this.getSchema()).forEach(key => {
			ret[key] = this.getValue(key);
		});

		return ret;
	}

	getValue(key: string): (any | undefined) {
		const str = localStorage.getItem("bg_" + key);
		return str ? fromTypedJSON(JSON.parse(str)) : getDefaultsForMode(this.getMode())[key];
	}

	setValue(key: string, v: any) {
		const str = toTypedJSON(v);
		localStorage.setItem("bg_" + key, JSON.stringify(str));
	}
}
