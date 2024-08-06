---
ms.topic: include
ms.date: 08/04/2023
ms.author: AaronMaxwell
author: AaronMaxwell
services: azure-monitor
ms.subservice: application-insights
---

### What's the difference between standard metrics from Application Insights vs. Azure App Service metrics?

Application Insights collects telemetry for the requests that made it to the application. If the failure occurs in WebApps/WebServer, and the request didn't reach the user application, Application Insights doesn't have any telemetry about it.

The duration for `serverresponsetime` calculated by Application Insights doesn't necessarily match the server response time observed by Web Apps. This behavior is because Application Insights only counts the duration when the request actually reaches the user application. If the request is stuck or queued in WebServer, the waiting time is included in the Web Apps metrics but not in Application Insights metrics.
