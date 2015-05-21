<properties 
	pageTitle="Exploring Metrics in Application Insights" 
	description="Analyze usage, availability and performance of your on-premises or Microsoft Azure web application with Application Insights." 
	services="application-insights" 
    documentationCenter=""
	authors="alancameronwills" 
	manager="ronmart"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/07/2015" 
	ms.author="awills"/>
 
# Exploring Metrics in Application Insights

Metrics in [Application Insights][start] are measured values and counts of events that are sent in telemetry from your application. They help you detect performance issues and watch trends in how your application is being used. There's a wide range of standard metrics, and you can also create your own custom metrics and events.

Metrics and event counts are displayed in charts of aggregated values such as sums, averages, or counts.

For example, if you add Application Insights to a web application, here's what you see near the top of the overview:

![Open the overview blade of your application in the Azure portal](./media/app-insights-metrics-explorer/01-overview.png)

Some charts are segmented: the total height of the chart at any point is the sum of the metrics displayed. The legend by default shows the largest quantities.

Dotted lines show the value of the metric one week previously.

## Point values

Hover your mouse over the chart to display the values of the metrics at that point.


![Hover the mouse over a chart](./media/app-insights-metrics-explorer/02-focus.png)

The value of the metric at a particular point is aggregated over the preceding sampling interval. This can vary depending on the time range of the whole chart.

The sampling interval or "grain" is shown at the top of the blade. 

![The header of a blade.](./media/app-insights-metrics-explorer/11-grain.png)

## Time range

You can change the Time range covered by most of the charts or grids on any blade.

![Open the overview blade of your application in the Azure portal](./media/app-insights-metrics-explorer/03-range.png)


Click Refresh if you're expecting some data that hasn't appeared yet. Charts don't update automatically. In release mode, it can take a while for data to come through the analysis pipeline onto a chart.

In the Overview blade, drag over a part of the chart to zoom into it in a new chart.


![Drag across part of a chart.](./media/app-insights-metrics-explorer/12-drag.png)


## Metrics Explorer

Click through any chart on the overview blade to see a more detailed set of related charts and grids. You can edit these charts and grids to focus on the details you're interested in.

For example, click through the web app's Failed Requests chart:

![On the overview blade, click a chart](./media/app-insights-metrics-explorer/14-trix.png)


## What do the figures mean?

The legend at the side by default shows the aggregated value over the period of the chart.

Each data point on the chart is also an aggregate of the data values received in the preceding sampling interval or "grain". The grain is shown at the top of the blade, and varies with the overall timescale of the chart.

Different metrics are aggregated in different ways: 

 * For a metric such as response time, values are **averaged** over the period of the chart.
 * For counts of events such as failed requests, the aggregate is the **sum** of counts over the period.
 * For counts of users, the aggregate is the number of **unique** users over the period. (If a user is tracked more than once in the period, they are counted only once.)

To find out whether the value is a sum, average, or unique click the chart and scroll down to the selected value. You can also get a short description of the metric.

![Hover over (i)](./media/app-insights-metrics-explorer/06-total.png)
 


## Editing charts and grids

To add a new chart to the blade:

![In Metrics Explorer, choose Add Chart](./media/app-insights-metrics-explorer/04-add.png)

Select an existing or new chart to edit what it shows:

![Select one or more metrics](./media/app-insights-metrics-explorer/08-select.png)

You can display more than one metric on a chart, though there are restrictions about the combinations that can be displayed together. As soon as you choose one metric, some of the others are disabled. 

If you coded [custom metrics][track] into your app (calls to TrackMetric and TrackEvent) they will be listed here.

## Segment your data

Select a chart or grid, switch on grouping and pick a property to group by:

![Select Grouping On, then set select a property in Group By](./media/app-insights-metrics-explorer/15-segment.png)

If you coded [custom metrics][track] into your app and they include property values, you'll be able to select the property in the list.

Is the chart too small for segmented data? Adjust its height:


![Adjust the slider](./media/app-insights-metrics-explorer/18-height.png)


## Filter your data

To see just the metrics for a selected set of property values:

![Click Filter, expand a property, and check some values](./media/app-insights-metrics-explorer/19-filter.png)

If you don't select any values for a particular property, it's the same as selecting them all: there is no filter on that property.

Notice the counts of events alongside each property value. When you select values of one property, the counts alongside other property values are adjusted.

## Remove bot and web test traffic

Use the filter **Real or synthetic traffic** and check **Real**.

You can also filter by **Source of synthetic traffic**.

## Edit the chart type

In particular, notice that you can switch between grids and graphs:

![Select a grid or graph, then choose a chart type](./media/app-insights-metrics-explorer/16-chart-grid.png)

## Save your metrics blade

When you've created some charts, save them as a favorite. You can choose whether to share it with other team members, if you use an organizational account.

![Choose Favorite](./media/app-insights-metrics-explorer/21-favorite-save.png)

To see the blade again, **go to the overview blade** and open Favorites:

![In the Overview blade, choose Favorites](./media/app-insights-metrics-explorer/22-favorite-get.png)

If you chose Relative time range when you saved, the blade will be updated with the latest metrics. If you chose Absolute time range, it will show the same data every time.

## Reset the blade

If you edit a blade but then you'd like to get back to the original saved set, just click Reset.

![In the buttons at the top of Metric Explorer](./media/app-insights-metrics-explorer/17-reset.png)

## Set alerts

To be notified by email of unusual values of any metric, add an alert. You can choose either to send the email to the account administrators, or to specific email addresses.

![In Metrics Explorer, choose Alert rules, Add Alert](./media/appinsights/appinsights-413setMetricAlert.png)

[Learn more][alerts].


<!--Link references-->

[alerts]: app-insights-alerts.md
[start]: app-insights-get-started.md
[track]: app-insights-custom-events-metrics-api.md

