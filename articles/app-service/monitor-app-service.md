---
title: Monitor Azure App Service
description: Start here to learn how to monitor Azure App Service.
ms.date: 03/05/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: msangapu-msft
ms.author: msangapu
ms.service: app-service
---

# Monitor Azure App Service

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

## App Service monitoring

On the Azure portal page for your web app, you can select **Diagnose and solve problems** from the left navigation to access complete App Service diagnostics for your app. For more information about the App Service diagnostics tool, see [Azure App Service diagnostics overview](overview-diagnostics.md).

App Service provides built-in diagnostics logging to assist with debugging apps. For more information about the built-in logs, see [Stream diagnostics logs](troubleshoot-diagnostic-logs.md#stream-logs).

You can also use Azure Health check to monitor App Service instances. For more information, see [Monitor App Service instances using Health check](monitor-instances-health-check.md).

For a complete overview and summary of App Service monitoring options, see [Azure App Service monitoring overview](overview-monitoring.md).

[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

### Application Insights

Application Insights uses the powerful data analysis platform in Azure Monitor to provide you with deep insights into your application's operations. Application Insights monitors the availability, performance, and usage of your web applications, so you can identify and diagnose errors without waiting for a user to report them.

Application Insights includes connection points to various development tools and integrates with Visual Studio to support your DevOps processes. For more information, see [Application monitoring for App Service](/azure/azure-monitor/app/azure-web-apps).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for App Service, see [App Service monitoring data reference](monitor-app-service-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]
For a list of available metrics for App Service, see [App Service monitoring data reference](monitor-app-service-reference.md#metrics).

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]
For the available resource log categories, their associated Log Analytics tables, and the logs schemas for App Service, see [App Service monitoring data reference](monitor-app-service-reference.md#resource-logs).

[!INCLUDE [audit log categories tip](../azure-monitor/includes/azure-monitor-log-category-groups-tip.md)]

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

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

### App Service alert rules

The following table lists common and recommended alert rules for App Service.

| Alert type | Condition | Examples  |
|:---|:---|:---|
| Metric | Average connections| When number of connections exceed a set value|
| Metric | HTTP 404| When HTTP 404 responses exceed a set value|
| Metric | HTTP Server Errors| When HTTP 5xx errors exceed a set value|
| Activity Log | Create or Update Web App | When app is created or updated|
| Activity Log | Delete Web App | When app is deleted|
| Activity Log | Restart Web App| When app is restarted|
| Activity Log | Stop Web App| When app is stopped|

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [App Service monitoring data reference](monitor-app-service-reference.md) for a reference of the metrics, logs, and other important values created for App Service.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.