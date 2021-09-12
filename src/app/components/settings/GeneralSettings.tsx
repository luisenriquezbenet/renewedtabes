import React, { ChangeEvent, useState } from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import Button, { ButtonVariant } from "../Button";
import { Form } from "../forms";
import LanguageSelector from "../LanguageSelector";
import { gridSettingsSchema, WidgetGridSettings } from "../WidgetGrid";


const messages = defineMessages({
	privacyPolicy: {
		defaultMessage: "Privacy Policy",
		description: "General settings: privacy policy button",
	},
})


export interface GeneralSettingsProps {
	locale: string;
	setLocale: (locale: string) => void;

	grid?: WidgetGridSettings;
	setGrid: (grid: WidgetGridSettings) => void;
}


export default function GeneralSettings(props: GeneralSettingsProps) {
	const [sentryEnabled, setSentryEnabled] =
		useState(localStorage.getItem("_sentry-opt-out") != "yes");

	function onLocaleChange(e: ChangeEvent<HTMLSelectElement>) {
		const selectedIndex = e.target.options.selectedIndex;
		const locale = e.target.options[selectedIndex].getAttribute("value");
		if (locale) {
			props.setLocale(locale);
		}
	}

	function onSentryEnabledChanged(e: ChangeEvent<HTMLInputElement>) {
		if (e.target.checked) {
			localStorage.removeItem("_sentry-opt-out");
		} else {
			localStorage.setItem("_sentry-opt-out", "yes");
		}
		setSentryEnabled(e.target.checked);
	}

	function handleSetGridValue(key: keyof WidgetGridSettings, val: any) {
		props.grid![key] = val;
		props.setGrid({ ...props.grid! });
	}

	return (
		<div className="modal-body">
			<LanguageSelector
				locale={props.locale}
				setLocale={props.setLocale} />

			<Form
				values={props.grid!}
				schema={gridSettingsSchema}
				onChange={handleSetGridValue} />

			<h3 className="label mt-6">
				<FormattedMessage
					defaultMessage="Privacy"
					description="General settings: privacy" />
			</h3>

			<div className="field">
				<label className="inline" htmlFor="sentry-enabled">
					<input name="sentry-enabled" className="mr-2"
						type="checkbox" checked={sentryEnabled}
						onChange={onSentryEnabledChanged} />
					<FormattedMessage
						defaultMessage="Enable crash reporting (using Sentry)"
						description="General settings: enable sentry" />
				</label>
				<p className="mt-4">
					<Button label={messages.privacyPolicy}
						variant={ButtonVariant.Secondary} target="_blank"
						href="https://renewedtab.com/privacy_policy/" />
				</p>
			</div>
		</div>);
}
