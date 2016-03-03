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
	ms.date="03/01/2016" 
	ms.author="awills"/>




# Application Analytics: Language Overview


[Application Analytics](app-analytics.md) is a powerful search engine for your 
[Application Insights](app-insights-overview.md) telemetry. These pages describe the
Application Analytics query lanuage, CSL.

[AZURE.INCLUDE [app-analytics-top-index](../../includes/app-analytics-top-index.md)]

 
A typical CSL query is a *source* table followed by a series of *operators* each prefixed by `|`. For example:

```
requests 
| where timestamp > datetime(2016-02-01) 
| where location_City == "Hyderabad"  
| count 
```

Result:

|Count|
|---|
|280|

*From the table 'requests', find all the data points in which the timestamp is after midnight UTC at the beginning of Feb 1, 2016, and where the client location (derived from the IP address) is Hyderabad. Count those data points and show the result.*

## Connect to your Application Insights data

**For now,** open Application Analytics by navigating to a URL in this form:

`https://loganalytics.applicationinsights.io/subscriptions/{subscription-id}/resourcegroups/{resource-group}/components/{app-insights-name}`

You can copy the parameters from the Essentials tab on your Application Insights overview blade: 

![Copy Subscription Id, Resource group and Name from the Essentials tab.](./media/app-analytics/001.png)

Sign in with the same credentials.



[AZURE.INCLUDE [app-analytics-footer](../../includes/app-analytics-footer.md)]

