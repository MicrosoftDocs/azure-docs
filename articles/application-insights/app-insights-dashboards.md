<properties
	pageTitle="Dashboards in the Application Insights portal"
	description="Display telemetry from multiple components of your application in a dashboard."
	services="application-insights"
    documentationCenter=""
	authors="alancameronwills"
	manager="douge"/>

<tags
	ms.service="application-insights"
	ms.workload="tbd"
	ms.tgt_pltfrm="ibiza"
	ms.devlang="multiple"
	ms.topic="article" 
	ms.date="04/25/2016"
	ms.author="awills"/>

# Navigation and Dashboards in the Application Insights portal

After you have [set up Application Insights on your project](app-insights-overview.md), telemetry data about your app's performance and usage will appear in your project's Application Insights resource in the [Azure portal](https://portal.azure.com).

## Find your telemetry

Sign in to the [Azure portal](https://portal.azure.com) and browse to the Application Insights resource that you created for your app.

![Click Browse, select Application Insights, then your app.](./media/app-insights-dashboards/00-start.png)

The overview page gives you some basic telemetry, plus links to more.
The contents depend on the type of your app, and can be customized.


## The app overview blade

The overview blade (page) for your app shows a summary of the key diagnostic metrics of your app, and is a gateway to the other features of the portal.

Click:

* **Any chart or tile** to see more detail.
* **Settings** to get to predefined pages of other metrics.
* [**Metrics Explorer**](app-insights-metrics-explorer.md) to create metrics pages of your own choice.
* [**Search**](app-insights-diagnostic-search.md) to investigate specific instances of events such as requests, exceptions or log traces.
* [**Analytics**](app-insights-analytics.md) for powerful queries over your telemetry.


![Major routes to view your telemetry](./media/app-insights-dashboards/010-oview.png)


### Customize the overview blade 

Choose what you want to see on the overview. In Customize, you can insert section titles, drag tiles and charts around, remove items, and add new tiles and charts from the gallery.

![Click Edit. Drag tiles and charts. Add tiles from the gallery. Then click Done.](./media/app-insights-dashboards/020-customize.png)

## Dashboards

The first thing you see after you sign in to the [Microsoft Azure portal](https://portal.azure.com) is a dashboard. Here you can bring together the charts that are most important to you across all your Azure resources, including telemetry from [Visual Studio Application Insights](app-insights-overview.md).
 

![A customized dashboard.](./media/app-insights-dashboards/30.png)

1. Click the top corner at any time to get back to the dashboard.
2. Click a chart or tile on the dashboard to see more detail about its data.
3. Use the navigation bar for a complete view of all your resources.
4. Edit, create and share dashboards using the dashboard toolbar.

## Add to a dashboard

When you're looking at a blade or set of charts that's particularly interesting, you can pin a copy of it to the dashboard. You'll see it next time you return there.

![To pin a chart, hover over it and then click "..." in the header.](./media/app-insights-dashboards/33.png)

Notice that charts are grouped into tiles: a tile can contain more than one chart. You pin the whole tile to the dashboard.

## Adjust a tile on the dashboard

Once a tile is on the dashboard, you can adjust it.

![Hover over a chart to edit it.](./media/app-insights-dashboards/36.png)

1. Add a chart to the tile. 
2. Set the metric, group-by dimension and style (table, graph) of a chart.
3. Set the timespan and filter properties for the charts on the tile.
4. Set tile title.

Tiles pinned from metric explorer blades have more editing options than tiles pinned from an  Overview blade.

The original tile that you pinned isn't affected by your edits.


## Switch between dashboards

You can save more than one dashboard and switch between them. When you pin a chart or blade, they're added to the current dashboard.

![To switch between dashboards, click Dashboard and select a saved dashboard. To create and save a new dashboard, click New. To rearrange, click Edit.](./media/app-insights-dashboards/32.png)

For example, you might have one dashboard for displaying full screen in the team room, and another for general development.


On the dashboard, a blade appears as a tile: click it to go to the blade. A chart replicates the chart in its original location.

![Click a tile to open the blade it represents](./media/app-insights-dashboards/35.png)


## Share dashboards with your team

When you've created a dashboard, you can share it with other users. 


![In the dashboard header, click Share](./media/app-insights-dashboards/41.png)

Learn about [Roles and access control](app-insights-resources-roles-access-control.md).





