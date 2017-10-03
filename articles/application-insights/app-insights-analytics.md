---
title: Analytics - the powerful search and query tool of Azure Application Insights | Microsoft Docs
description: 'Overview of Analytics, the powerful diagnostic search tool of Application Insights. '
services: application-insights
documentationcenter: ''
author: CFreemanwa
manager: carmonm

ms.assetid: 0a2f6011-5bcf-47b7-8450-40f284274b24
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 03/14/2017
ms.author: bwren

---
# Analytics in Application Insights
Analytics is the powerful search and query tool of [Application Insights](app-insights-overview.md). Analytics is a web tool, no setup is required. 
If you've already configured Application Insights for one of your apps, you can easily analyze your app's data - simply open Analytics from your 
app's [overview blade](app-insights-dashboards.md):
![Open portal.azure.com, open your Application Insights resource, and click Analytics.](./media/app-insights-analytics-tour/001.png)

You can also use the Analytics [playground](https://go.microsoft.com/fwlink/?linkid=859557) - is a free demo environment with a lot of data.


> [!VIDEO https://channel9.msdn.com/events/Connect/2016/123/player] 

## Query data in Analytics
A typical query started with is a table name, followed by a series of *operators* separated by `|`.
For example, let's find out what how many requests our app received from different countries, during the last 3 hours:
```AIQL
requests
| where timestamp > ago(3h)
| summarize count() by client_CountryOrRegion
| render piechart
```

We start with the table name - *requests*, and add piped elements as need - first we define a time filter, to review only records from the last 3 hours.
Next we count the number of records per country (that data is found in the column *client_CountryOrRegion*). To display the results clearly, we render a pie-chart.

Looks like our app has been most popular in the United States during these 3 hours.

The language has many attractive features:

* [Filter](https://docs.loganalytics.io/queryLanguage/query_language_whereoperator.html) your raw app telemetry by any fields, including your custom properties and metrics.
* [Join](https://docs.loganalytics.io/queryLanguage/query_language_joinoperator.html) multiple tables – correlate requests with page views, dependency calls, exceptions and log traces.
* Powerful statistical [aggregations](https://docs.loganalytics.io/learn/tutorials/aggregations.html).
* Immediate and powerful visualizations.
* There's a [REST API](https://dev.applicationinsights.io/) that you can use to run queries programmatically, for example from Powershell.

The [full language referece](https://go.microsoft.com/fwlink/?linkid=856079) details every command supported, and updates regularly.

## Next steps
* [get started with the Analytics portal](https://go.microsoft.com/fwlink/?linkid=856587)
* [get started with queries](https://go.microsoft.com/fwlink/?linkid=856078)
* review the [SQL-users' cheat sheet](https://aka.ms/sql-analytics) for translations of the most common idioms.
* Test drive Analytics on our [playground](https://analytics.applicationinsights.io/demo) if your app isn't sending data to Application Insights yet.
* Watch the [introductory video](https://applicationanalytics-media.azureedge.net/home_page_video.mp4)