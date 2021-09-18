import React, { useEffect, useMemo, useState } from 'react';
import { Vector2 } from 'app/utils/Vector2';
import Schema, { AutocompleteItem, type } from 'app/utils/Schema';
import { WidgetProps, WidgetType } from 'app/Widget';
import { defineMessages } from 'react-intl';
import { schemaMessages } from 'app/locale/common';
import Panel from 'app/components/Panel';
import { getAPI, useFeed, useForceUpdateValue } from 'app/hooks';
import ErrorView from 'app/components/ErrorView';
import uuid from 'app/utils/uuid';
import { Tabs } from 'app/components/Tabs';


const messages = defineMessages({
	title: {
		defaultMessage: "Feed",
		description: "Feed Widget",
	},

	description: {
		defaultMessage: "Shows an Atom or RSS feed, useful for following the news, websites, and blogs",
		description: "Feed widget description",
	},

	titleHint: {
		defaultMessage: "Leave blank to use feed's title",
		description: "Feed widget: form field hint (Title)",
	},

	sources: {
		defaultMessage: "Sources",
		description: "Feed widget: form field label",
	},

	filters: {
		defaultMessage: "Filter Articles",
		description: "Feed widget: form field label",
	},

	filtersHint: {
		defaultMessage: "An article will be shown if it matches at least one 'Show' filter (if any), and no 'Hide' filters.",
		description: "Feed widget: form field hint (Filters)",
	},

	isAllowed: {
		defaultMessage: "Show / Hide",
		description: "Feed widget filter allow label",
	},

	show: {
		defaultMessage: "Show",
		description: "Feed widget: filter allow checkbox label",
	},

	hide: {
		defaultMessage: "Hide",
		description: "Feed widget: filter show checkbox label",
	}
});


interface Filter {
	id: string; //< required for React
	isAllowed: (boolean | string);
	text: string;
}

interface FeedSource {
	id: string;
	title: string;
	url: string;
}

interface FeedProps {
	sources: FeedSource[];
	filters: Filter[];
	useWebsiteIcons: boolean;
}


interface FeedPanelProps extends FeedProps {
	onGotTitle: (title: string) => void;
}


function FeedPanel(props: FeedPanelProps) {
	const source = props.sources[0];
	const [feed, error] = useFeed(source.url, [source.url]);

	if (!feed) {
		useEffect(() => {}, [""]);
		return (<ErrorView error={error} loading={true} />);
	}

	useEffect(() => {
		if (source.title == "" && feed.title) {
			props.onGotTitle(feed.title);
		}
	}, [feed.title ?? ""]);

	const allowFilters = props.filters
		.filter(filter => filter.isAllowed === true || filter.isAllowed == "true")
		.map(filter => filter.text.toLowerCase());

	const blockFilters = props.filters
		.filter(filter => !(filter.isAllowed === true || filter.isAllowed == "true"))
		.map(filter => filter.text.toLowerCase());

	const rows = feed.articles
		.filter(article => {
			const title = article.title.toLowerCase();
			return article.link &&
					(allowFilters.length == 0 ||
						allowFilters.some(filter => title.includes(filter))) &&
					!blockFilters.some(filter => title.includes(filter));
		})
		.map(article => (
			<li key={article.link}><a href={article.link}>{article.title}</a></li>));

	return (
		<ul className="links">
			{rows}
		</ul>);
}


function Feed(widget: WidgetProps<FeedProps>) {
	const props = widget.props;
	const [selectedId, setSelectedId] = useState(props.sources[0]?.id ?? "");
	const selected = props.sources.find(x => x.id == selectedId) ?? props.sources[0];
	const [force, forceUpdate] = useForceUpdateValue();

	const options = useMemo(() => props.sources.map(x => ({
		id: x.id,
		title: x.title || new URL(x.url).hostname,
		url: x.url,
	})), [force, props.sources, props.sources.length]);

	return (
		<Panel {...widget.theme} flush={true}>
			<Tabs value={selectedId} options={options} onChanged={setSelectedId}
				useWebsiteIcons={props.useWebsiteIcons} />
			<FeedPanel {...props} sources={[selected]}
				onGotTitle={title => {
					selected.title = title;
					widget.save();
					forceUpdate();
				}} />
		</Panel>);
}


const filterSchema: Schema<Filter> = {
	isAllowed: type.select({ false: "Hide", true: "Allow" },
		{ false: messages.hide, true: messages.show }, messages.isAllowed),
	text: type.string(schemaMessages.text),
};


const sourceSchema: Schema<FeedSource> = {
	title: type.string(schemaMessages.title, messages.titleHint),
	url: type.urlFeed(schemaMessages.url, schemaMessages.rssUrlHint,
		() => getAPI<AutocompleteItem[]>("feeds/", {})),
};


const widget: WidgetType<FeedProps> = {
	Component: Feed,
	title: messages.title,
	description: messages.description,
	defaultSize: new Vector2(5, 4),
	initialProps: {
		sources: [
			{
				id: uuid(),
				title: "BBC News",
				url: "https://feeds.bbci.co.uk/news/rss.xml",
			},
			{
				id: uuid(),
				title: "The Register",
				url: "https://www.theregister.com/headlines.atom",
			},
		],
		filters: [],
		useWebsiteIcons: false,
	},

	async schema(_widget) {
		if (typeof browser !== "undefined") {
			return {
				sources: type.array(sourceSchema, messages.sources),
				filters: type.unorderedArray(filterSchema, messages.filters, messages.filtersHint),
				useWebsiteIcons: type.booleanHostPerm(schemaMessages.useWebsiteIcons),
			};
		} else {
			return {
				sources: type.array(sourceSchema, messages.sources),
				filters: type.unorderedArray(filterSchema, messages.filters, messages.filtersHint),
			};
		}
	},

	async onLoaded(widget) {
		widget.props.filters = widget.props.filters ?? [];
		if ((widget.props as any).url) {
			widget.props.sources = [
				{
					id: uuid(),
					title: (widget.props as any).title ?? "",
					url: (widget.props as any).url,
				}
			];
			delete (widget.props as any).title;
			delete (widget.props as any).url;
		}
	},
};
export default widget;
