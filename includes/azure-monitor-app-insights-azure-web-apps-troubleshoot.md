---
ms.topic: include
ms.date: 09/03/2021
ms.author: lagayhar
author: lgayhardt
services: azure-monitor
ms.subservice: application-insights
---

### Connection string and instrumentation key

When codeless monitoring is being used, only the connection string is required. However, we still recommend setting the instrumentation key to preserve backwards compatibility with older versions of the SDK when manual instrumentation is being performed.

### Difference between Standard Metrics from Application Insights vs Azure App Service metrics?

Application Insights collects telemetry for those requests which made it to the application. If the failure occurred in WebApps/WebServer, and the request did not reach the user application, then Application Insights will not have any telemetry about it.

The duration for `serverresponsetime` calculated by Application Insights is not necessarily matching the server response time observed by Web Apps. This is because Application Insights only counts the duration when the request actual reaches user application. If the request is stuck/queued in WebServer, that waiting time will be included in the Web App metrics, but not in Application Insights metrics.


