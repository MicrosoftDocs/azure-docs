---
title: Dashboards and navigation in the Azure Application Insights | Microsoft Docs
description: Create views of your key APM charts and queries.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm

ms.assetid: 39b0701b-2fec-4683-842a-8a19424f67bd
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: conceptual
ms.date: 03/14/2017
ms.author: mbullwin

---
# Navigation and Dashboards in the Application Insights portal
After you have [set up Application Insights on your project](app-insights-overview.md), telemetry data about your app's performance and usage will appear in your project's Application Insights resource in the [Azure portal](https://portal.azure.com).

## Find your telemetry
Sign in to the [Azure portal](https://portal.azure.com) and navigate to the Application Insights resource that you created for your app.

![Click Browse, select Application Insights, then your app.](./media/app-insights-dashboards/00-start.png)

The overview blade (page) for your app shows a summary of the key diagnostic metrics of your app, and is a gateway to the other features of the portal.

![Major routes to view your telemetry](./media/app-insights-dashboards/010-oview.png)

You can customize any of the charts and grids and pin them to a dashboard. That way, you can bring together the key telemetry from different apps on a central dashboard.

## Dashboards
The first thing you see after you sign in to the [Microsoft Azure portal](https://portal.azure.com) is a dashboard. Here you can bring together the charts that are most important to you across all your Azure resources, including telemetry from [Azure Application Insights](app-insights-overview.md).

![A customized dashboard.](./media/app-insights-dashboards/31.png)

1. **Navigate to specific resources** such as your app in Application Insights: Use the left bar.
2. **Return to the current dashboard**, or switch to other recent views: Use the drop-down menu at top left.
3. **Switch dashboards**: Use the drop-down menu on the dashboard title
4. **Create, edit, and share dashboards** in the dashboard toolbar.
5. **Edit the dashboard**: Hover over a tile and then use its top bar to move, customize, or remove it.

## Add to a dashboard
When you're looking at a blade or set of charts that's particularly interesting, you can pin a copy of it to the dashboard. You'll see it next time you return there.

![To pin a chart, hover over it and then click "..." in the header.](./media/app-insights-dashboards/33.png)

1. Pin chart to dashboard. A copy of the chart appears on the dashboard.
2. Pin the whole blade to the dashboard - it appears on the dashboard as a tile that you can click through.
3. Click the top left corner to return to the current dashboard. Then you can use the drop-down menu to return to the current view.

Notice that charts are grouped into tiles: a tile can contain more than one chart. You pin the whole tile to the dashboard.

The chart is automatically refreshed with a frequency that depends on the chart's time range:

* Time range up to 1 hour: Refresh every 5 minutes
* Time range 1 - 24 hours: Refresh every 15 minutes
* Time range above 24 hours: (Time range)/60.

### Pin any query in Analytics
You can also [pin Analytics](../log-analytics/query-language/get-started-analytics-portal.md) charts to a [shared](#share-dashboards-with-your-team) dashboard. This allows you to add charts of any arbitrary query alongside the standard metrics. 

Results are automatically recalculated every hour. Click the Refresh icon on the chart to recalculate immediately. (Browser refresh doesn't recalculate.)

## Adjust a tile on the dashboard
Once a tile is on the dashboard, you can adjust it.

![Hover over a chart in order to edit it.](./media/app-insights-dashboards/36.png)

1. Add a chart to the tile.
2. Set the metric, group-by dimension and style (table, graph) of a chart.
3. Drag across the diagram to zoom in; click the undo button to reset the timespan; set filter properties for the charts on the tile.
4. Set tile title.

Tiles pinned from metric explorer blades have more editing options than tiles pinned from an Overview blade.

The original tile that you pinned isn't affected by your edits.

## Switch between dashboards
You can save more than one dashboard and switch between them. When you pin a chart or blade, they're added to the current dashboard.

![To switch between dashboards, click Dashboard and select a saved dashboard. To create and save a new dashboard, click New. To rearrange, click Edit.](./media/app-insights-dashboards/32.png)

For example, you might have one dashboard for displaying full screen in the team room, and another for general development.

On the dashboard, a blade appears as a tile: click it to go to the blade. A chart replicates the chart in its original location.

![Click a tile to open the blade it represents](./media/app-insights-dashboards/35.png)

## Share dashboards
When you've created a dashboard, you can share it with other users.

![In the dashboard header, click Share](./media/app-insights-dashboards/41.png)

Learn about [Roles and access control](app-insights-resources-roles-access-control.md).

## Create dashboards programmatically
You can automate dashboard creation using [Azure Resource Manager](https://docs.microsoft.com/azure/azure-portal/azure-portal-dashboards-create-programmatically) and a simple JSON editor.

## App navigation
The overview blade is the gateway to more information about your app.

* **Any chart or tile** - Click any tile or chart to see more detail about what it displays.

### Overview blade buttons
![Overview blade top navigation bar](./media/app-insights-dashboards/app-overview-top-nav.png)

* [**Metrics Explorer**](app-insights-metrics-explorer.md) - Create your own charts of performance and usage.
* [**Search**](app-insights-diagnostic-search.md) - Investigate specific instances of events such as requests, exceptions, or log traces.
* [**Analytics**](app-insights-analytics.md) - Powerful queries over your telemetry.
* **Time range** - Adjust the range displayed by all the charts on the blade.
* **Delete** - Delete the Application Insights resource for this app. You should also either remove the Application Insights packages from your app code, or edit the [instrumentation key](app-insights-create-new-resource.md#copy-the-instrumentation-key) in your app to direct telemetry to a different Application Insights resource.

### Essentials tab
* [Instrumentation key](app-insights-create-new-resource.md#copy-the-instrumentation-key) - Identifies this app resource.

### App navigation bar
![Left navigation bar](./media/app-insights-dashboards/app-left-nav-bar.png)

* **Overview** - Return to the app overview blade.
* **Activity log** - Alerts and Azure administrative events.
* [**Access control**](app-insights-resources-roles-access-control.md) - Provide access to team members and others.
* [**Tags**](../azure-resource-manager/resource-group-using-tags.md) - Use tags to group your app with others.

INVESTIGATE

* [**Application map**](app-insights-app-map.md) - Active map showing the components of your application, derived from the dependency information.
* [**Smart Detection**](app-insights-proactive-diagnostics.md) - Review recent performance alerts.
* [**Live Stream**](app-insights-live-stream.md) - A fixed set of near-instant metrics, useful when deploying a new build or debugging.
* [**Availability / Web tests**](app-insights-monitor-web-app-availability.md) - Send regular requests to your web app from around the world.*
* [**Failures, Performance**](app-insights-web-monitor-performance.md) - Exceptions, failure rates and response times for requests to your app and for requests from your app to [dependencies](app-insights-asp-net-dependencies.md).
* [**Performance**](app-insights-web-monitor-performance.md) - Response time, dependency response times.
* [Servers](app-insights-web-monitor-performance.md) - Performance counters. Available if you [install Status Monitor](app-insights-monitor-performance-live-website-now.md).
* **Browser** - Page view and AJAX performance. Available if you [instrument your web pages](app-insights-javascript.md).
* **Usage** - Page view, user, and session counts. Available if you [instrument your web pages](app-insights-javascript.md).

CONFIGURE

* **Getting started** - inline tutorial.
* **Properties** - instrumentation key, subscription and resource id.
* [Alerts](app-insights-alerts.md) - metric alert configuration.
* [Continuous export](app-insights-export-telemetry.md) - configure export of telemetry to Azure storage.
* [Performance testing](app-insights-monitor-web-app-availability.md#performance-tests) - set up a synthetic load on your website.
* [Quota and pricing](app-insights-pricing.md) and [ingestion sampling](app-insights-sampling.md).
* **API Access** - Create [release annotations](app-insights-annotations.md) and for the Data Access API.
* [**Work Items**](app-insights-diagnostic-search.md#create-work-item) - Connect to a work tracking system so that you can create bugs while inspecting telemetry.

SETTINGS

* [**Locks**](../azure-resource-manager/resource-group-lock-resources.md) - lock Azure resources
* [**Automation script**](app-insights-powershell.md) - export a definition of the Azure resource so that you can use it as a template to create new resources.


## Video

> [!VIDEO https://channel9.msdn.com/events/Connect/2016/112/player]

## Next steps

|  |  |
| --- | --- |
| [Metrics explorer](app-insights-metrics-explorer.md)<br/>Filter and segment metrics |![Search example](./media/app-insights-dashboards/64.png) |
| [Diagnostic search](app-insights-diagnostic-search.md)<br/>Find and inspect events, related events, and create bugs |![Search example](./media/app-insights-dashboards/61.png) |
| [Analytics](app-insights-analytics.md)<br/>Powerful query language |![Search example](./media/app-insights-dashboards/63.png) |
