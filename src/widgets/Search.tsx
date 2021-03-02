import React from "react";

interface SearchProps {
	searchTitle: string;
	searchURL: string;
}

export function Search(props: SearchProps) {
	return (
		<div className="panel flush">
			<form method="get" action={props.searchURL}>
				<input autoFocus={true} type="text" name="q" placeholder={`Search on ${props.searchTitle}`} className="large invisible" />
			</form>
		</div>);
}
