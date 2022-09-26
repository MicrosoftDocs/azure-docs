---
title: Azure Application Insights Data Model - PageView Telemetry
description: Application Insights data model for page view telemetry
ms.topic: conceptual
ms.date: 09/07/2022
ms.reviewer: mmcc
---

# PageView telemetry: Application Insights data model

PageView telemetry (in [Application Insights](./app-insights-overview.md)) is logged when an application user opens a new page of a monitored application. The `Page` in this context is a logical unit that is defined by the developer to be an application tab or a screen and isn't necessarily correlated to a browser webpage load or refresh action. This distinction can be further understood in the context of single-page applications (SPA) where the switch between pages isn't tied to browser page actions. [`pageViews.duration`](/azure/azure-monitor/reference/tables/pageviews) is the time it takes for the application to present the page to the user.

> [!NOTE]
> * By default, Application Insights SDKs log single PageView events on each browser webpage load action, with [`pageViews.duration`](/azure/azure-monitor/reference/tables/pageviews) populated by [browser timing](#measuring-browsertiming-in-application-insights). Developers can extend additional tracking of PageView events by using the [trackPageView API call](./api-custom-events-metrics.md#page-views).
> * The default logs retention is 30 days and needs to be adjusted if you want to view page view statistics over a longer period of time.

## Measuring browserTiming in Application Insights

Modern browsers expose measurements for page load actions with the [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API). Application Insights simplifies these measurements by consolidating related timings into [standard browser metrics](../essentials/metrics-supported.md#microsoftinsightscomponents) as defined by these processing time definitions:

1. Client <--> DNS: Client reaches out to DNS to resolve website hostname, DNS responds with IP address.
1. Client <--> Web Server: Client creates TCP then TLS handshakes with web server.
1. Client <--> Web Server: Client sends request payload, waits for server to execute request, and receives first response packet.
1. Client <--Web Server: Client receives the rest of the response payload bytes from the web server.
1. Client: Client now has full response payload and has to render contents into browser and load the DOM.
 
* `browserTimings/networkDuration` = #1 + #2
* `browserTimings/sendDuration` = #3
* `browserTimings/receiveDuration` = #4
* `browserTimings/processingDuration` = #5
* `browsertimings/totalDuration` = #1 + #2 + #3 + #4 + #5
* `pageViews/duration`
   * The PageView duration is from the browser’s performance timing interface, [`PerformanceNavigationTiming.duration`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry/duration).
    * If `PerformanceNavigationTiming` is available that duration is used.
    * If it’s not, then the *deprecated* [`PerformanceTiming`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming) interface is used and the delta between [`NavigationStart`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming/navigationStart) and [`LoadEventEnd`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming/loadEventEnd) is calculated.
    * The developer specifies a duration value when logging custom PageView events using the [trackPageView API call](./api-custom-events-metrics.md#page-views).

![Screenshot of the Metrics page in Application Insights showing graphic displays of metrics data for a web application.](./media/javascript/page-view-load-time.png)