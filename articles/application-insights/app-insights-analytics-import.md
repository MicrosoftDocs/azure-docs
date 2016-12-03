---
title: Import your data to Analytics in Azure Application Insights | Microsoft Docs
description: Import static data to join with app telemetry, or import a separate data stream to query with Analytics.
services: application-insights
documentationcenter: ''
author: alancameronwills
manager: carmonm

ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 12/03/2016
ms.author: awills

---
# Import data into Analytics

Import any tabular data into [Analytics](app-insights-analytics.md), either to join it with [Application Insights](app-insights-overview.md) telemetry from your app, or so that you can analyze it as a separate stream.

You can import data into Analytics using your own schema. It doesn't have to use the standard Application Insights schemas such as request or trace.

There are three situations where importing to Analytics is useful:

* **Join with app telemetry.** For example, you could import a table that maps URLs from your website to more readable page titles. In Analytics you can create a dashboard chart report that shows the ten most popular pages in your website. Now it can show the page titles instead of the URLs.
* **Correlate your application telemetry** with other sources such as network traffic, server data, or CDN log files.
* **Apply Analytics to a separate data stream.** Application Insights Analytics is a very powerful tool, that works well with sparse, timestamped streams - much better than SQL in many cases. If you have such a stream from some other source, you can analyze it with Analytics.

Sending data to your data source is very easy. Periodically upload the log file to Azure storage, and call the REST API to notify us that new data is waiting for ingestion. Within a few minutes the data is available for query in Analytics.

