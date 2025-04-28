---
title: Monitor Azure App Service
description: Learn about options in Azure App Service for monitoring resources for availability, performance, and operation.
ms.date: 04/18/2025
ms.custom: horz-monitor
ms.topic: conceptual
author: msangapu-msft
ms.author: msangapu
ms.service: azure-app-service
---

# Monitor Azure App Service

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

## App Service monitoring

Azure App Service provides several options for monitoring resources for availability, performance, and operation. Options include diagnostic settings, Application Insights, log stream, metrics, quotas and alerts, and activity logs.

On the Azure portal page for your web app, you can select **Diagnose and solve problems** from the left navigation to access complete App Service diagnostics for your app. For more information about the App Service diagnostics tool, see [Azure App Service diagnostics overview](overview-diagnostics.md).

App Service provides built-in diagnostics logging to assist with debugging apps. For more information about the built-in logs, see [Stream diagnostics logs](troubleshoot-diagnostic-logs.md#stream-logs).

You can also use Azure Health check to monitor App Service instances. For more information, see [Monitor App Service instances using Health check](monitor-instances-health-check.md).

If you're using ASP.NET Core, ASP.NET, Java, Node.js, or Python, we recommend [enabling observability with Application Insights](/azure/azure-monitor/app/opentelemetry-enable). To learn more about observability experiences offered by Application Insights, see [Application Insights overview](/azure/azure-monitor/app/app-insights-overview).

### Monitoring scenarios

The following table lists monitoring methods to use for different scenarios.

|Scenario|Monitoring method |
|----------|-----------|
|I want to monitor platform metrics and logs | [Azure Monitor platform metrics](#platform-metrics)|
|I want to monitor application performance and usage | (Azure Monitor) [Application Insights](#application-insights)|
|I want to monitor built-in logs for testing and development|[Log stream](troubleshoot-diagnostic-logs.md#stream-logs)|
|I want to monitor resource limits and configure alerts|[Quotas and alerts](web-sites-monitor.md)|
|I want to monitor web app resource events|[Activity logs](#activity-log)|
|I want to monitor metrics visually|[Metrics](web-sites-monitor.md#metrics-granularity-and-retention-policy)|

[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

### Application Insights

Application Insights uses the powerful data analysis platform in Azure Monitor to provide you with deep insights into your application's operations. Application Insights monitors the availability, performance, and usage of your web applications, so you can identify and diagnose errors without waiting for a user to report them.

Application Insights includes connection points to various development tools and integrates with Visual Studio to support your DevOps processes. For more information, see [Application monitoring for App Service](/azure/azure-monitor/app/azure-web-apps).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for App Service, see [App Service monitoring data reference](monitor-app-service-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

<a name="platform-metrics"></a>
[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]
For a list of available metrics for App Service, see [App Service monitoring data reference](monitor-app-service-reference.md#metrics).

For help understanding metrics in App Service, see [Metrics](web-sites-monitor.md#understand-metrics). Metrics can be viewed by aggregates on data (such as average, max, min), instances, time range, and other filters. Metrics can monitor performance, memory, CPU, and other attributes.

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]
For the available resource log categories, their associated Log Analytics tables, and the logs schemas for App Service, see [App Service monitoring data reference](monitor-app-service-reference.md#resource-logs).

[!INCLUDE [audit log categories tip](./includes/azure-monitor-log-category-groups-tip.md)]

<a name="activity-log"></a>
[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

### Azure activity logs for App Service

Azure activity logs for App Service include details such as:

- What operations were taken on the resources (for example, App Service plans)
- Who started the operation
- When the operation occurred
- Status of the operation
- Property values to help you research the operation

Azure activity logs can be queried using the Azure portal, PowerShell, REST API, or CLI.

### Ship activity logs to Event Grid

While activity logs are user-based, there's a new [Azure Event Grid](../event-grid/index.yml) integration with App Service (preview) that logs both user actions and automated events. With Event Grid, you can configure a handler to react to the said events. For example, use Event Grid to instantly trigger a serverless function to run image analysis each time a new photo is added to a blob storage container.

Alternatively, you can use Event Grid with Logic Apps to process data anywhere, without writing code. Event Grid connects data sources and event handlers.

To view the properties and schema for App Service events, see [Azure App Service as an Event Grid source](../event-grid/event-schema-app-service.md).

## Log stream (via App Service Logs)

Azure provides built-in diagnostics to assist during testing and development to debug an App Service app. [Log stream](troubleshoot-diagnostic-logs.md#stream-logs) can be used to get quick access to output and errors written by your application, and logs from the web server. These are standard output/error logs in addition to web server logs.

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

The following sample query can help you monitor app logs using `AppServiceAppLogs`:

```Kusto
AppServiceAppLogs 
| project CustomLevel, _ResourceId
| summarize count() by CustomLevel, _ResourceId
```

The following sample query can help you monitor HTTP logs using `AppServiceHTTPLogs` where the `HTTP response code` is `500` or higher:

```Kusto
AppServiceHTTPLogs 
//| where ResourceId = "MyResourceId" // Uncomment to get results for a specific resource Id when querying over a group of Apps
| where ScStatus >= 500
| reduce by strcat(CsMethod, ':\\', CsUriStem)
```

The following sample query can help you monitor HTTP 500 errors by joining `AppServiceConsoleLogs` and `AppserviceHTTPLogs`:

```Kusto
let myHttp = AppServiceHTTPLogs | where  ScStatus == 500 | project TimeGen=substring(TimeGenerated, 0, 19), CsUriStem, ScStatus;  

let myConsole = AppServiceConsoleLogs | project TimeGen=substring(TimeGenerated, 0, 19), ResultDescription;

myHttp | join myConsole on TimeGen | project TimeGen, CsUriStem, ScStatus, ResultDescription;   
```

See [Azure Monitor queries for App Service](https://github.com/microsoft/AzureMonitorCommunity/tree/master/Azure%20Services/App%20Services/Queries) for more sample queries.

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]

### Quotas and alerts

Apps that are hosted in App Service are subject to certain limits on the resources they can use. The limits are defined by the App Service plan that's associated with the app. Metrics for an app or an App Service plan can be hooked up to alerts. To learn more, see [Quotas](web-sites-monitor.md#understand-quotas).

### App Service alert rules

The following table lists common and recommended alert rules for App Service.

| Alert type | Condition | Examples  |
|:---|:---|:---|
| Metric | Average connections| When number of connections exceed a set value|
| Metric | HTTP 404| When HTTP 404 responses exceed a set value|
| Metric | HTTP server errors| When HTTP 5xx errors exceed a set value|
| Activity log | Create or update web app | When app is created or updated|
| Activity log | Delete web app | When app is deleted|
| Activity log | Restart web app| When app is restarted|
| Activity log | Stop web app| When app is stopped|

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- [Azure App Service monitoring data reference](monitor-app-service-reference.md)
- [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource)