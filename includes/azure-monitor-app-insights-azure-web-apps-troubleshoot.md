---
ms.topic: include
ms.date: 09/03/2021
ms.author: lagayhar
author: lgayhardt
services: azure-monitor
ms.subservice: application-insights
---

### Connection string and instrumentation key

When codeless monitoring is being used, only the connection string is required. We still recommend that you set the instrumentation key to preserve backward compatibility with older versions of the SDK when manual instrumentation is being performed.

### What's the difference between standard metrics from Application Insights vs. Azure App Service metrics?

Application Insights collects telemetry for the requests that made it to the application. If the failure occurred in WebApps/WebServer, and the request didn't reach the user application, Application Insights won't have any telemetry about it.

The duration for `serverresponsetime` calculated by Application Insights won't necessarily match the server response time observed by Web Apps. This behavior is because Application Insights only counts the duration when the request actually reaches the user application. If the request is stuck or queued in WebServer, the waiting time will be included in the Web Apps metrics but not in Application Insights metrics.


