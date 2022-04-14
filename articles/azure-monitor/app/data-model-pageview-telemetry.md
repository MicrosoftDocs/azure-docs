
---
title: Azure Application Insights Data Model - PageView Telemetry
description: Application Insights data model for page view telemetry
ms.topic: conceptual
ms.date: 03/24/2022
ms.reviewer: vgorbenko

---

# PageView telemetry: Application Insights data model

## Common question of Page View Timing vs. Browser Timing (logical vs. physical)

browser timing as physical by browser performance api (link to it) page timing is logical
and can be provided by user and not the same as physical timing 

https://teams.microsoft.com/l/message/19:2f92f8e50ec9473ba546d12a8a4cf4b0@thread.tacv2/1639570290196?tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47&groupId=2fb9049b-bc9c-4cca-a900-84f22c86116c&parentMessageId=1639570290196&teamName=AzMon%20POD%20Swarming&channelName=Application%20Insights&createdTime=1639570290196 **Potential Graphic**

**Question**
 https://docs.microsoft.com/en-us/azure/azure-monitor/essentials/metrics-supported#microsoftinsightscomponents. the difference between some of the BrowserTimings metrics versus this “pageview/duration” metric. Let me walk through a typical client browser request sequence and what I believe our docs describe for the browserTiming metrics…..


Steps : Processing

1: Client <--> DNS : Client reaches out to DNS to resolve website hostname, DNS responds with IP address

2: Client <--> Web Server : Client creates TCP then TLS handshakes with web server

3: Client <--> Web Server : Client sends request payload, waits for server to execute request, and receives first response packet

4: Client <--   Web Server : Client receives the rest of the response payload bytes from the web server

5: Client         Web Server : Client now has full response payload and has to render contents into browser and load the DOM

 

Given the above sequence of events between a client browser and DNS/Web servers then it appears our browserTiming metrics would line up to these processing times…

 

browserTimings/networkDuration = #1 + #2
browserTimings/sendDuration = #3
browserTimings/receiveDuration = #4
browserTimings/processingDuration = #5
browsertimings/totalDuration = #1 + #2 + #3 + #4 + #5
 

what exactly is the time computed for “pageViews/duration” which is also another metric we describe on the same page in our docs here: https://docs.microsoft.com/en-us/azure/azure-monitor/essentials/metrics-supported#microsoftinsightscomponents? The docs stat  it’s an “average” calculation in milliseconds, so I assume “Average Page View Load Time”, but can you clarify what page view load time means? Is that basically just #5 step in our sequence above, meaning how long the browser takes to fully load the response payload into the UI? Or is the pageViews/duration some JavaScript client side timer that runs and figures out how long the customer stayed on that page within the browser before navigating away or closing the browser?

**Answer**

The PageView duration is generally from the browser’s performance timing interface: [PerformanceNavigationTiming.duration](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry/duration).  We have a bit of complex logic for various cases.  Here it goes the simplified logic:

 

If PerformanceNavigationTiming is available use its duration
If it’s not (when an older browser is encountered), then use (the now deprecated) [PerformanceTiming](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming) interface and find the delta between [NavigationStart](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming/navigationStart) and [LoadEventEnd](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming/loadEventEnd).
There are also cases when the users can send their own duration which will override any of the calculated values.
 

We tell the customers how to use the duration datapoint: [Azure Application Insights for JavaScript web apps - Azure Monitor | Microsoft Docs](https://docs.microsoft.com/en-us/azure/azure-monitor/app/javascript#analytics)
