---
ms.topic: include
ms.date: 08/06/2021
---

### Connection string and instrumentation key

When codeless monitoring is being used, only the connection string is required. However, we still recommend setting the instrumentation key to preserve backwards compatibility with older versions of the SDK when manual instrumentation is being performed.

### Difference between Standard Metrics from Application Insights vs Azure App Service metrics?

Application Insights collects telemetry for those requests which made it to the application. If the failure occurred in WebApps/WebServer, and the request did not reach the user application, then Application Insights will not have any telemetry about it.

The duration for `serverresponsetime` calculated by Application Insights is not necessarily matching the server response time observed by Web Apps. This is because Application Insights only counts the duration when the request actual reaches user application. If the request is stuck/queued in WebServer, that waiting time will be included in the Web App metrics, but not in Application Insights metrics.

## Release notes

For the latest updates and bug fixes [consult the release notes](../web-app-extension-release-notes.md).

## Next steps
* [Run the profiler on your live app](../profiler.md).
* [Azure Functions](https://github.com/christopheranderson/azure-functions-app-insights-sample) - monitor Azure Functions with Application Insights
* [Enable Azure diagnostics](../../agents/diagnostics-extension-to-application-insights.md) to be sent to Application Insights.
* [Monitor service health metrics](../data-platform.md) to make sure your service is available and responsive.
* [Receive alert notifications](../../alerts/alerts-overview.md) whenever operational events happen or metrics cross a threshold.
* Use [Application Insights for JavaScript apps and web pages](../javascript.md) to get client telemetry from the browsers that visit a web page.
* [Set up Availability web tests](../monitor-web-app-availability.md) to be alerted if your site is down.