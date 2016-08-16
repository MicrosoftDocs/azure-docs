<properties 
	pageTitle="Analytics - the powerful search tool of Application Insights | Microsoft Azure" 
	description="Overview of Analytics, 
	             the powerful diagnostic search tool of Application Insights. " 
	services="application-insights" 
    documentationCenter=""
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/25/2016" 
	ms.author="awills"/>


# Analytics in Application Insights


[Analytics](app-insights-analytics.md) is the powerful search feature of 
[Application Insights](app-insights-overview.md). These pages describe the
 Analytics query lanquage. 

* **[Watch the introductory video](https://applicationanalytics-media.azureedge.net/home_page_video.mp4)**.
* **[Test drive Analytics on our simulated data](https://analytics.applicationinsights.io/demo)** if your app isn't sending data to Application Insights yet.

## Queries in Analytics
 
A typical query is a *source* table followed by a series of *operators* separated by `|`. 

For example, let's find out what time of day the citizens of Hyderabad try our web app. And while we're there, let's see what result codes are returned to their HTTP requests. 

```AIQL

    requests      // Table of events that log HTTP requests.
    | where timestamp > ago(7d) and client_City == "Hyderabad"
    | summarize clients = dcount(client_IP) 
      by tod_UTC=bin(timestamp % 1d, 1h), resultCode
    | extend local_hour = (tod_UTC + 5h + 30min) % 24h + datetime("2001-01-01") 
```

We count distinct client IP addresses, grouping them by the hour of the day over the past 7 days. 

Let's display the results with the bar chart presentation, choosing to stack the results from different response codes:

![Choose bar chart, x and y axes, then segmentation](./media/app-insights-analytics/020.png)

Looks like our app is most popular at lunchtime and bed-time in Hyderabad. (And we should investigate those 500 codes.)


There are also powerful statistical operations:

![](./media/app-insights-analytics/025.png)


The language has many attractive features:

* [Filter](app-insights-analytics-reference.md#where-operator) your raw app telemetry by any fields, including your custom properties and metrics.
* [Join](app-insights-analytics-reference.md#join-operator) multiple tables – correlate requests with page views, dependency calls, exceptions and log traces.
* Powerful statistical [aggregations](app-insights-analytics-reference.md#aggregations).
* Just as powerful as SQL, but much easier for complex queries: instead of nesting statements, you pipe the data from one elementary operation to the next.
* Immediate and powerful visualizations.



>[AZURE.NOTE] We recommend you start with the [language tour](app-insights-analytics-tour.md).




## Connect to your Application Insights data


Open Analytics from your app's [overview blade](app-insights-dashboards.md) in Application Insights: 

![Open portal.azure.com, open your Application Insights resource, and click Analytics.](./media/app-insights-analytics/001.png)


## Limits

At present, query results are limited to just over a week of past data.



[AZURE.INCLUDE [app-insights-analytics-footer](../../includes/app-insights-analytics-footer.md)]

