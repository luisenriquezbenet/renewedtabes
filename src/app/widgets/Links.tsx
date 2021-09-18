import LinkBox, { LinkSchema, LinkBoxProps, FullLinkSchema } from 'app/components/LinkBox';
import { schemaMessages } from 'app/locale/common';
import { type } from 'app/utils/Schema';
import uuid from 'app/utils/uuid';
import { Vector2 } from 'app/utils/Vector2';
import { defaultLinksThemeSchema, Widget, WidgetProps, WidgetType } from 'app/Widget';
import React from 'react';
import { defineMessages } from 'react-intl';


const messages = defineMessages({
	title: {
		defaultMessage: "Links",
		description: "Links Widget",
	},

	description: {
		defaultMessage: "Links, with support for headings and icons",
		description: "Links widget description",
	},

	links: {
		defaultMessage: "Links",
		description: "Links widget: form field label",
	},

	enableCustomIcons: {
		defaultMessage: "Enable custom icons",
		description: "Links widget: form field label",
	},
});


function Links(props: WidgetProps<LinkBoxProps>)  {
	return (<LinkBox {...props.props} widgetTheme={props.theme} />);
}


const initialProps: LinkBoxProps = {
	links: [
		{
			id: uuid(),
			title: "Renewed Tab",
			icon: "",
			url: "",
		},
		{
			id: uuid(),
			title: "Website",
			icon: "",
			url: "https://renewedtab.com/"
		},
		{
			id: uuid(),
			title: "Donate",
			icon: "",
			url: "https://renewedtab.com/donate/"
		},
		{
			id: uuid(),
			title: "@RenewedTab on Twitter",
			icon: "",
			url: "https://twitter.com/RenewedTab/"
		},
		{
			id: uuid(),
			title: "rubenwardy",
			icon: "",
			url: "",
		},
		{
			id: uuid(),
			title: "rubenwardy.com",
			icon: "",
			url: "https://rubenwardy.com/"
		},
		{
			id: uuid(),
			title: "@rubenwardy on Twitter",
			icon: "",
			url: "https://twitter.com/rubenwardy/"
		},
	],
};


const widget: WidgetType<LinkBoxProps> = {
	Component: Links,
	title: messages.title,
	description: messages.description,
	defaultSize: new Vector2(5, 5),
	initialProps: initialProps,
	themeSchema: defaultLinksThemeSchema,

	async schema(widget) {
		const linkSchema = widget.props.enableCustomIcons ? FullLinkSchema : LinkSchema;
		if (typeof browser !== "undefined") {
			return {
				links: type.array(linkSchema, messages.links),
				enableCustomIcons: type.boolean(messages.enableCustomIcons),
				useWebsiteIcons: type.booleanHostPerm(schemaMessages.useWebsiteIcons),
			};
		} else {
			return {
				links: type.array(linkSchema, messages.links),
				enableCustomIcons: type.boolean(messages.enableCustomIcons),
			};
		}
	},

	async onLoaded(widget: Widget<any>) {
		if (widget.props.sections && !widget.props.links) {
			widget.props.links = widget.props.sections.map((section: any) => [
				{ title: section.title, url: "" },
				section.links
			]).flat(10).map((link: any) => {
				link.id = uuid();
				return link;
			});
		}

		if (typeof widget.props.useIconBar !== "undefined") {
			widget.theme.useIconBar = widget.props.useIconBar;
			widget.theme.showPanelBG = !widget.props.useIconBar;
			delete widget.props.useIconBar;
		}
	},
};
export default widget;
