<properties
	pageTitle="Using the Application Insights portal"
	description="After you've configured your app to send telemetry to Application Insights, this guide shows you how to find your way around the portal."
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
	ms.date="11/23/2015"
	ms.author="awills"/>

# Using the Application Insights portal

After you have [set up Application Insights on your project](app-insights-overview.md), telemetry data about your app's performance and usage will appear in your project's Application Insights resource in the [Azure portal](https://portal.azure.com).

## Find your telemetry

Sign in to the [Azure portal](https://portal.azure.com) and browse to the Application Insights resource that you created for your app.

![Click Browse, select Application Insights, then your app.](./media/app-insights-portal/00-start.png)

The overview page gives you some basic telemetry, plus links to more.
The contents depend on the type of your app, and can be customized.



## Time range

You can change the Time range covered by the charts or grids on any blade.

![Open the overview blade of your application in the Azure portal](./media/app-insights-portal/03-range.png)


If you're expecting some data that hasn't appeared yet, click Refresh. Charts refresh themselves at intervals, but the intervals are longer for larger time ranges. In release mode, it can take a while for data to come through the analysis pipeline onto a chart.

To zoom into part of a chart, drag over it and then click the magnifier symbol:

![Drag across part of a chart.](./media/app-insights-portal/12-drag.png)



## Granularity and point values

Hover your mouse over the chart to display the values of the metrics at that point.

![Hover the mouse over a chart](./media/app-insights-portal/02-focus.png)

The value of the metric at a particular point is aggregated over the preceding sampling interval. 

The sampling interval or "granularity" is shown at the top of the blade. 

![The header of a blade.](./media/app-insights-portal/11-grain.png)

You can adjust the granularity in the Time range blade:

![The header of a blade.](./media/app-insights-portal/grain.png)

The granularities available depend on the time range you select. The explicit granularities are alternatives to the "automatic" granularity for the time range. 

## The app overview blade

The overview blade (page) for your app shows a summary of the key diagnostic metrics of your app, and is a gateway to the other features of the portal.

Click:

* **Any chart or tile** to see more detail.
* **Diagnostics** to get to predefined pages of other metrics.
* **Metrics Explorer** to create metrics pages of your own choice.
* **Search** to investigate specific instances of events such as requests, exceptions or log traces.


![Major routes to view your telemetry](./media/app-insights-portal/010-oview.png)


### Customize the overview blade 

Choose what you want to see on the overview. In Customize, you can insert section titles, drag tiles and charts around, remove items, and add new tiles and charts from the gallery.

![Click Edit. Drag tiles and charts. Add tiles from the gallery. Then click Done.](./media/app-insights-portal/020-customize.png)

### Customize the Azure dashboard


The Azure portal dashboard is the home page you see when you first sign in to the portal. On it, you can bring together tiles (groups of charts) from multiple resources. 

To pin a tile from the Application Insights overview blade to the portal dashboard, select the header of the tile and then "...".

For a more comprehensive dashboard, use [Power BI](https://azure.microsoft.com/blog/application-insights-content-pack-for-power-bi/) to display your telemetry.

## Metrics blades

When you click through from the overview blade to get more detail, you're in Metrics Explorer (even if it has a more specific title).

You can also use the Metrics Explorer button to create a new blade, which you can edit and then save.


![On the Overview blade, click Metrics](./media/app-insights-portal/16-metrics.png)

### Editing charts and grids

To add a new chart to the blade:

![In Metrics Explorer, choose Add Chart](./media/app-insights-portal/04-add.png)

Select an existing or new chart to edit what it shows:

![Select one or more metrics](./media/app-insights-portal/08-select.png)

You can display more than one metric on a chart, though there are restrictions about the combinations that can be displayed together. As soon as you choose one metric, some of the others are disabled. 

If you coded [custom metrics](app-insights-api-custom-events-metrics.md#track-metric) into your app (calls to TrackMetric, and metrics attached to TrackEvent calls) they will be listed here.

### Segment your data

Select a chart or grid, switch on grouping and pick a property to group by:

![Select Grouping On, then set select a property in Group By](./media/app-insights-portal/15-segment.png)

If you coded custom metrics into your app and they include [property values](app-insights-api-custom-events-metrics.md#properties), you'll be able to select the property in the list.

Is the chart too small for segmented data? Adjust its height:

![Adjust the slider](./media/app-insights-portal/18-height.png)

### Filter your data

To see just the metrics for a selected set of property values:

![Click Filter, expand a property, and check some values](./media/app-insights-portal/19-filter.png)

If you don't select any values for a particular property, it's the same as selecting them all: there is no filter on that property.

Notice the counts of events alongside each property value. When you select values of one property, the counts alongside other property values are adjusted.

### Save your metrics blade

When you've created some charts, save them as a favorite. You can choose whether to share it with other team members, if you use an organizational account.

![Choose Favorite](./media/app-insights-portal/21-favorite-save.png)

To see the blade again, **go to the overview blade** and open Favorites:

![In the Overview blade, choose Favorites](./media/app-insights-portal/22-favorite-get.png)

If you chose Relative time range when you saved, the blade will be updated with the latest metrics. If you chose Absolute time range, it will show the same data every time.

### Reset the blade

If you edit a blade but then you'd like to get back to the original saved set, just click Reset.

![In the buttons at the top of Metric Explorer](./media/app-insights-portal/17-reset.png)

## Search

Search displays individual events such as page views, requests, exceptions, log traces, and custom events.  It doesn't show aggregated metrics or instances of the TrackMetric() call.

> [AZURE.NOTE] If your app generates a lot of telemetry (and you are using the ASP.NET SDK version 2.0.0-beta3 or later), the adaptive sampling module will automatically reduce the volume that is sent to the portal by sending only a representative fraction of events. However, events that are related to the same request will be selected or deselected as a group, so that you can navigate between related events. [Learn about sampling](app-insights-sampling.md).

Open diagnostic search:

![Open diagnostic search](./media/app-insights-portal/01-open-Diagnostic.png)

Open the Filter blade and choose the event types you want to see. (If, later, you want to restore the filters with which you opened the blade, click Reset.)

![Choose Filter and select telemetry types](./media/app-insights-portal/02-filter-req.png)

### Filter on property values

You can filter events on the values of their properties. The available properties depend on the event types you selected. 

For example, pick out requests with a specific response code.

![Expand a property and choose a value](./media/app-insights-portal/03-response500.png)

Choosing no values of a particular property has the same effect as choosing all values; it switches off filtering on that property.

> [AZURE.NOTE] If your app generates a lot of telemetry, the adaptive sampling module will automatically reduce the volume that is sent to the portal by sending only a representative fraction of events. Events that are part of the same operation will be selected or deselected as a group, so that you can navigate between related events. [Learn about sampling.](app-insights-sampling.md)


### Narrow your search

Notice that the counts to the right of the filter values show how many occurrences there are in the current filtered set. 

In this example, it's clear that the `Reports/Employees` request results in the majority of the 500 errors:

![Expand a property and choose a value](./media/app-insights-portal/04-failingReq.png)

Additionally if you want to also see what other events were happening during this time, you can check **Include events with undefined properties**.

### Save your search

When you've set all the filters you want, you can save the search as a favorite. If you work in an organizational account, you can choose whether to share it with other team members.

![Click Favorite, set the name, and click Save](./media/app-insights-portal/08-favorite-save.png)


To see the search again, **go to the overview blade** and open Favorites:

![Favorites tile](./media/app-insights-portal/22-favorite-get.png)

If you saved with Relative time range, the re-opened blade has the latest data. If you saved with Absolute time range, you see the same data every time.


