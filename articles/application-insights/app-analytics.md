<properties 
	pageTitle="Application Analytics - the powerful search tool for Application Insights" 
	description="Overview of Application Analytics, 
	             the powerful search tool for Application Insights. " 
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
	ms.date="03/05/2016" 
	ms.author="awills"/>




# Application Analytics: Language Overview


[Application Analytics](app-analytics.md) is a powerful search engine for your 
[Application Insights](app-insights-overview.md) telemetry. These pages describe the
Application Analytics query lanuage, CSL.

[AZURE.INCLUDE [app-analytics-top-index](../../includes/app-analytics-top-index.md)]

 
A typical CSL query is a *source* table followed by a series of *operators* separated by `|`. 

For example, let's find out what time of day the citizens of Hyderabad try our web app. And while we're there, let's see what result codes are returned to their HTTP requests. 

```CSL

    requests 
    | where timestamp > ago(30d) and location_City == "Hyderabad"
    | summarize clients = dcount(location_ClientIP) 
      by tod_UTC=bin(timestamp % 1d, 1h), responseCode
    | extend local_hour = (tod_UTC + 5h + 30min) % 24h 
```

We count distinct client IP addresses, grouping them by the hour of the day over the past 30 days. 

Let's display the results with the bar chart presentation, choosing to stack the results from different response codes:

![Choose bar chart, x and y axes, then segmentation](./media/app-analytics/020.png)

Looks like our app is most popular at lunchtime and bed-time in Hyderabad. (And we should investigate those 500 codes.)

The language has many of the capabilities of SQL, and more. Just as in SQL, you can filter data, group records, sort and join tables. You can also perform computations on the fields. Unlike SQL, these functions are separated into different operations, and instead of nesting queries, you pipe the data from one operation to the next in a very intuitive way. This makes it easy to write quite complex queries.


>[AZURE.NOTE] We recommend starting with the [language tour](app-analytics-tour.md).


## Connect to your Application Insights data


Open Application Analytics from your app's [overview blade](app-insights-dashboards.md) in Application Insights: 

![Open portal.azure.com, open your Application Insights resource, and click Analytics.](./media/app-analytics/001.png)


*Early adopter? If the button isn't working yet, open Application Analytics by navigating to this URL:*

`https://analytics.applicationinsights.io/subscriptions/{subscription-id}/resourcegroups/{resource-group}/components/{app-insights-name}`



[AZURE.INCLUDE [app-analytics-footer](../../includes/app-analytics-footer.md)]

