import { WidgetType } from "../Widget";

import Age from "./Age";
import Bookmarks from "./Bookmarks";
import Button from "./Button";
import Clock from "./Clock";
import DailyGoal from "./DailyGoal";
import Feed from "./Feed";
import Greeting from "./Greeting";
import HelpAbout from "./HelpAbout";
import IFrame from "./IFrame";
import Image from "./Image";
import Invisible from "./Invisible";
import Links from "./Links";
import Notes from "./Notes";
import Quotes from "./Quotes";
import Search from "./Search";
import SpaceFlights from "./SpaceFlights";
import Text from "./Text";
import TodoList from "./TodoList";
import TopSites from "./TopSites";
import Weather from "./Weather";
import WebComic from "./WebComic";

export const WidgetTypes: { [name: string]: WidgetType<any> } = {
	Age,
	Bookmarks,
	Button,
	Clock,
	DailyGoal,
	Feed,
	Greeting,
	HelpAbout,
	IFrame,
	Image,
	Invisible,
	Links,
	Notes,
	Quotes,
	Search,
	SpaceFlights,
	Text,
	TodoList,
	TopSites,
	Weather,
	WebComic,
};
