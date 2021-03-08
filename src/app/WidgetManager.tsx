import Schema from "./utils/Schema";
import { fromTypedJSON, toTypedJSON } from "./utils/TypedJSON";
import { Vector2 } from "./utils/Vector2";
import { WidgetTypes } from "./widgets";


type ReactFactory<T> = ((props: T) => JSX.Element) ;
export interface WidgetFactory<T> extends ReactFactory<T> {
	initialProps: T;
	defaultSize: Vector2;
	schema: Schema;
	description: string;
	onCreated?: (widget: WidgetRaw<T>) => void;
}

export interface WidgetRaw<T> {
	id: number;
	type: string;
	props: T;

	position?: Vector2;
	size: Vector2;
}

export interface WidgetProps<T> extends WidgetRaw<T> {
	child: WidgetFactory<T>;
	save(): void;
	remove(): void;
}


/**
 * Model to store and save widgets.
 */
export class WidgetManager {
	private id_counter = 0;

	widgets: (WidgetRaw<any>)[] = [];

	constructor() {
		const json = localStorage.getItem("widgets");
		if (json) {
			this.widgets = fromTypedJSON(JSON.parse(json))
				.filter((widget: WidgetRaw<any>) => WidgetTypes[widget.type]);
			this.id_counter =
				this.widgets.reduce((max, widget) => Math.max(widget.id, max), 0);

			this.widgets.forEach(widget => {
				widget.position = widget.position ? new Vector2(widget.position.x, widget.position.y) : undefined;
				widget.size = widget.size || WidgetTypes[widget.type].defaultSize;
			})
		} else {
			this.resetToDefault();
		}
	}

	save() {
		console.log("Saving");
		localStorage.setItem("widgets", JSON.stringify(toTypedJSON(this.widgets)));
	}

	resetToDefault() {
		this.widgets = [];
		["Clock", "Search", "Age", "Links", "Notes", "Weather",
			"HelpAbout", "RSS", "SpaceFlights"].forEach(this.createWidget.bind(this));
	}

	createWidget(type: string) {
		this.id_counter++;

		const widget_type = WidgetTypes[type];
		const widget = {
			id: this.id_counter,
			type: type,
			position: undefined,
			size: widget_type.defaultSize,
			props:  Object.assign({}, widget_type.initialProps),
		};
		this.widgets.push(widget);

		if (widget_type.onCreated) {
			widget_type.onCreated(widget);
		}

		this.save();
	}

	removeWidget(id: number) {
		console.log("Remove widget by id ", id);
		var i = this.widgets.length;
		while (i--) {
			if (this.widgets[i].id == id) {
				console.log("- found and deleted ", this.widgets[i]);
				this.widgets.splice(i, 1);
			}
		}
		this.save();
	}
}
