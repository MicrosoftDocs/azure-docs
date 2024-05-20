---
title: Failures and Performance views in Application Insights | Microsoft Docs
description: Monitor application performance and failures with Application Insights.
author: KennedyDenMSFT
ms.author: aaronmax
ms.topic: conceptual
ms.date: 02/15/2024
ms.reviewer: cogoodson 
---

# Failures and Performance views

[Application Insights](./app-insights-overview.md) features two key tools: the Failures view and the Performance view. The Failures view tracks errors, exceptions, and faults, offering clear insights for fast problem-solving and enhanced stability. The Performance view quickly identifies and helps resolve application bottlenecks by displaying response times and operation counts. Together, they ensure the ongoing health and efficiency of web applications.

## [Failures view](#tab/failures-view)

Application Insights comes with a curated Application Performance Management (APM) experience to help you diagnose failures in your monitored applications. Select the **Failures** option in the Application Insights resource menu on the left, under **Investigate**, to get a list of all failures collected for your application and drill into each one. 

:::image type="content" source="media/failures-and-performance-views/4-application-insights-02.png" lightbox="media/failures-and-performance-views/4-application-insights-02.png" alt-text="Screenshot of analyzing failures." :::

To continue your investigation into the root cause of the error or exception, you can drill into the problematic transaction for a detailed end-to-end transaction view that includes dependencies and exception details.

:::image type="content" source="media/failures-and-performance-views/4-application-insights-03.png" lightbox="media/failures-and-performance-views/4-application-insights-03.png" alt-text="Screenshot of analyzing failure with end-to-end view.":::

You can also diagnose failures in your application or its components from the application map, by selecting **Investigate failures** from the triage pane of [Application Map](app-map.md).

## [Performance view](#tab/performance-view)

You can further investigate slow transactions to identify slow requests and server-side dependencies. Select the **Performance** option in the Application Insights resource menu on the left, under **Investigate**, to get a list of operations collected for your application and drill into each one.

:::image type="content" source="media/failures-and-performance-views/4-application-insights-05.png" alt-text="Screenshot of analyzing performance." lightbox="media/failures-and-performance-views/4-application-insights-05.png":::

You can also analyze performance in your application or its components from the application map, by selecting **Investigate performance** from the triage pane of [Application Map](app-map.md).

On the **Performance** page, you can isolate slow transactions by selecting the time range, operation name, and durations of interest. You're also prompted with automatically identified anomalies and commonalities across transactions. From this page, you can drill into an individual transaction for an end-to-end view of transaction details with a Gantt chart of dependencies.

If you instrument your web pages with Application Insights, you can also gain visibility into page views, browser operations, and dependencies. Collecting this browser data requires adding a script to your web pages. After you add the script, you can access page views and their associated performance metrics by selecting the **Browser** toggle.

---

## Next steps

* Learn more about using [Application Map](app-map.md) to spot performance bottlenecks and failure hotspots across all components of your application.
* Learn more about using the [Availability view](availability-overview.md) to set up recurring tests to monitor availability and responsiveness for your application.
