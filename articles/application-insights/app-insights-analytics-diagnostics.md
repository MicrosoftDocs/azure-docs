---
title: Smart diagnostics of web app performance changes in Azure Application Insights| Microsoft Docs
description: Automatic diagnosis of spikes or steps in performance telemetry from your web app.
services: application-insights
documentationcenter: ''
author: alancameronwills
manager: carmonm

ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 04/06/2017
ms.author: awills

---
# Diagnose sudden changes in your app telemetry

*This feature is in preview.*

Diagnose sudden changes in your web app’s performance or usage with a single click! The Analytics Diagnostics feature is available whenever you create a time chart in [Analytics](app-insights-analytics.md) in [Application Insights](app-insights-overview.md). Wherever there is an unusual change from the trend of your results, such as a spike or a dip, Analytics Diagnostics identifies a pattern of dimensions that might explain the change. This helps you diagnose the problem quickly. 

In this example, Analytics Diagnostics has identified a pattern of property values associated with the change, and highlights the difference between results with and without that pattern:

![example analytics diagnostics result](./media/app-insights-analytics-diagnostics/analytics-result.png)
 

## Diagnose discontinuities

1.	Run a query in Analytics, and render it as a time chart. 
2.	Click any highlighted peak point, if there is one.
 
    ![peak point](./media/app-insights-analytics-diagnostics/peak.png)

    Diagnostics takes a few seconds to discover a pattern.

3. The Diagnostics Results tab shows a pattern which may explain your data discontinuity.

    ![result](./media/app-insights-analytics-diagnostics/result.png)
 
    The text shows the dimension values that appear to correlate with the shift. In this example, it’s associated with a particular request and a particular browser version.

    Notice also the two components of the chart, with the filter true and false. The false component shows an unchanged trend. In other words, there is no change in the telemetry results, if we exclude the problematic combination of dimensions that Diagnostics has identified. By contrast, the results within that combination do show a dramatic change within the highlighted area of investigation. This shows that Diagnostics has found a combination of properties that explains the change.

4.	If the pattern is complex, you need to hover over **Show all** to see the dimensions.

    ![show all](./media/app-insights-analytics-diagnostics/show-all.png)
 
5.	In case Diagnostics finds no significant pattern to notify about, the ‘no results’ page will be presented. At this point, you may change your query. For example, you could change the time binning in Analytics query, for a further analysis and potentially better results.

Armed with the knowledge that a particular page of your website has a problem on a particular browser, you can now go straight to the problem page, and investigate recent changes.

## How it works

Diagnostics uses an advanced algorithm based on the [DiffPatterns](app-insights-analytics-reference.md#evaluate-diffpatterns) operation.

## No diagnostic points?

Smart Diagnostics only works when the following criteria are satisfied:

 * Line chart: Diagnostics only works on a line chart. Either use `| render timechart` at the end of your query, or select Line Chart from the drop-down selector.
 * Time axis: The X-axis of the chart must be of type `datetime`.
 * Discontinuity: There must be a significant discontinuity in the data.
 * Sufficient points to analyze.
 * No more than one summarize clause in the query.
 * No project clause that contains a definition.

 
 ## Related articles

 * [Smart diagnostics](app-insights-proactive-diagnostics.md) automatically alert you to performance issues.
 * [Analytics tutorial](app-insights-analytics-tour.md)
