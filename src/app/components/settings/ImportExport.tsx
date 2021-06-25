import { usePromise } from "app/hooks";
import { miscMessages } from "app/locale/common";
import { storage } from "app/Storage";
import { toTypedJSON } from "app/utils/TypedJSON";
import React, { useRef } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import Button, { ButtonVariant } from "../Button";
import { tabTitles, SettingsTab } from "./SettingsDialog";


const messages = defineMessages({
	reset: {
		defaultMessage: "Reset everything",
		description: "Import / export settings, reset",
	},

	import: {
		defaultMessage: "Import",
		description: "Import / export settings, import",
	},

	export: {
		defaultMessage: "Export",
		description: "Import / export settings, export",
	},
})


export default function ImportExport() {
	async function handleReset() {
		await storage.clear();
		location.reload();
	}

	async function getStoredData(): Promise<string> {
		const data = toTypedJSON(await storage.getAll()) as { [name: string]: any };
		for (const key in data) {
			if (key.startsWith("large-")) {
				delete data[key];
			}
		}

		return JSON.stringify(data);
	}

	async function handleImport(file: File) {
		const json = new TextDecoder("utf-8").decode(await file.arrayBuffer());
		const data = JSON.parse(json);
		for (const [key, value] of Object.entries(data)) {
			await storage.set(key, value);
		}

		location.reload();
	}

	function encode(str: string) {
		// Escapes needed to fix `#` in data.
		return btoa(unescape(encodeURIComponent(str)));
	}

	const ref = useRef<HTMLInputElement>(null);
	const [data, error] = usePromise(() => getStoredData(), []);
	const intl = useIntl();

	return (
		<div className="modal-body">
			<h3>
				<FormattedMessage {...tabTitles[SettingsTab.ImportExport]} />
			</h3>
			<p>
				<FormattedMessage
						defaultMessage="Warning: this may contain personal data,
							if any was entered into widget settings." />
			</p>
			<textarea className="fullwidth" readOnly
				value={data ?? (error ? error.toString() : intl.formatMessage(miscMessages.loading))} />
			<input ref={ref} type="file" className="display-none"
				onChange={(e) => handleImport(e.target.files![0]).catch(console.error)} />
			<p className="button-set">
				<Button variant={ButtonVariant.Danger} onClick={handleReset} label={messages.reset} />
				<Button onClick={() => ref.current?.click()} label={messages.import} />
				<Button href={`data:text/plain;base64,${encode(data ?? "")}`}
						download="renewedtab.json" label={messages.export} />
			</p>
		</div>);
}
