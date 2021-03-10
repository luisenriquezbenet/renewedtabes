import React, { ChangeEvent, useState } from "react";
import { FieldProps } from ".";
import RequestHostPermission from "../RequestHostPermission";

export function TextField(props: FieldProps<string>) {
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (props.onChange) {
			props.onChange(e.target.value);
		}
	}

	const hint = props.hint ? (<p className="text-muted">{props.hint}</p>) : null;
	return (
		<div className="field">
			<label htmlFor={props.name}>{props.label ?? props.name}</label>
			<input type="text" name={props.name} defaultValue={props.value}
					onChange={handleChange} />
					{hint}
		</div>);
}

export function PermURLField(props: FieldProps<string>) {
	const [value, setValue] = useState<string>(props.value);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (props.onChange) {
			props.onChange(e.target.value);
		}
		setValue(e.target.value);
	}

	let host = "";
	try {
		host = new URL(value).host;
	} catch (e) {
		// ignore
	}

	const hint = props.hint ? (<p className="text-muted">{props.hint}</p>) : null;
	return (
		<div className="field">
			<label htmlFor={props.name}>{props.label ?? props.name}</label>
			<input type="text" name={props.name} defaultValue={props.value}
					onChange={handleChange} />
			{hint}
			<RequestHostPermission host={host} />
		</div>);
}

export function DateField(props: FieldProps<Date>) {
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (props.onChange) {
			const ms = Date.parse(e.target.value);
			if (!Number.isNaN(ms)) {
				props.onChange(new Date(ms));
			}
		}
	}

	const hint = props.hint ? (<p className="text-muted">{props.hint}</p>) : null;
	return (
		<div className="field">
			<label htmlFor={props.name}>{props.label ?? props.name}</label>
			<input type="date" name={props.name}
					defaultValue={props.value.toISOString().slice(0, 10)}
					onChange={handleChange} />
			{hint}
		</div>);
}