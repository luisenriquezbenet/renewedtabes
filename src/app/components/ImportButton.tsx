import { storage } from "app/storage";
import React, { useRef } from "react";
import Button, { ButtonProps } from "./Button";
import { miscMessages } from "app/locale/common";


async function handleImport(file: File) {
	const json = new TextDecoder("utf-8").decode(await file.arrayBuffer());
	const data = JSON.parse(json);
	for (const [key, value] of Object.entries(data)) {
		await storage.set(key, value);
	}

	location.reload();
}


export default function ImportButton(props: ButtonProps) {
	const ref = useRef<HTMLInputElement>(null);
	return (<>
		<input ref={ref} type="file" className="display-none"
			accept=".json,application/json" name="import-file"
			onChange={(e) => handleImport(e.target.files![0]).catch(console.error)} />
		<Button id="import" onClick={() => ref.current?.click()} label={miscMessages.import} {...props} />
	</>);
}
