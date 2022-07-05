---
title: Monitoring Azure Functions data reference
description: Important reference material needed when you monitor Azure Functions
author: vraposo
ms.topic: reference
ms.author: #Required; Microsoft alias of author; optional team alias.
ms.service: Azure Functions
ms.custom: subject-monitoring
ms.date: #Required; mm/dd/yyyy format.
---

# Monitoring Azure Functions data reference

See [Monitoring Azure Functions](monitor-functions.md) for details on collecting and analyzing monitoring data for Azure Functions at the **application** level.

See [Monitor Azure Functions](functions-monitoring.md) for details on collecting and analysing monitoring data for Azure Functions at the **function** level.

## Metrics

This section lists all the automatically collected platform metrics collected for Azure Functions.

### Azure Functions specific metrics

There are two metrics specific to Functions that are of interest:

| Metric | Description |
| ---- | ---- |
| **FunctionExecutionCount** | Function execution count indicates the number of times your function app has executed. This value correlates to the number of times a function runs in your app. |
| **FunctionExecutionUnits** | Function execution units are a combination of execution time and your memory usage.  Memory data isn't a metric currently available through Azure Monitor. However, if you want to optimize the memory usage of your app, can use the performance counter data collected by Application Insights. This metric isn't currently supported for Premium and Dedicated (App Service) plans running on Linux.|

These metrics are used specifically when [estimating Consumption plan costs](functions-consumption-costs.md).

### General App Service metrics

Aside from Azure Functions specific metrics, the App Service platform implements more metrics, which you can use to monitor function apps. For the complete list, see [metrics available to App Service apps](../app-service/web-sites-monitor.md#understand-metrics) and [Monitoring *App Service* data reference](../app-service/monitor-app-service-reference.md#metrics).

## Metric Dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](../azure-monitor/essentials/data-platform-metrics.md#multi-dimensional-metrics).

Azure Functions does not have any metrics that contain dimensions.

## Resource logs

This section lists the types of resource logs you can collect for your function apps.

| Log type | Description |
|-|-|
| FunctionAppLogs | Function app logs |

For the complete list of resource logs you can collect for your function app considering the App Service platform, see [Monitoring *App Service* data reference](../app-service/monitor-app-service-reference.md#resource-logs).

For reference, see a list of [all resource logs category types supported in Azure Monitor](../azure-monitor/essentials/resource-logs-schema.md).

## Azure Monitor Logs tables

This section refers to all of the Azure Monitor Logs Kusto tables relevant to Azure Functions and available for query by Log Analytics.

<!-- TODO:glenn Same as above -->

For a reference of all Azure Monitor Logs / Log Analytics tables, see the [Azure Monitor Log Table Reference](../azure-monitor/reference/tables/tables-resourcetype). <!-- TODO:glenn the reference above doesn't exist in the repo -->

## Activity log

The following table lists the operations related to Azure Functions that may be created in the Activity log.

| Operation | Description |
|:---|:---|
|Create or Update Web App| App was created or updated|
|Delete Web App| App was deleted |
|Create Web App Backup| Backup of app|
|Get Web App Publishing Profile| Download of publishing profile |
|Publish Web App| App deployed |
|Restart Web App| App restarted|
|Start Web App| App started |
|Stop Web App| App stopped|
|Swap Web App Slots| Slots were swapped|
|Get Web App Slots Differences| Slot differences|
|Apply Web App Configuration| Applied configuration changes|
|Reset Web App Configuration| Configuration changes reset|
|Approve Private Endpoint Connections| Approved private endpoint connections|
|Network Trace Web Apps| Started network trace|
|Newpassword Web Apps| New password created |
|Get Zipped Container Logs for Web App| Get container logs |
|Restore Web App From Backup Blob| App restored from backup|

For more information on the schema of Activity Log entries, see [Activity Log schema](../azure-monitor/essentials/activity-log-schema.md).

## See Also

- See [Monitoring Azure Functions](monitor-functions.md) for a description of monitoring Azure Functions.
- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.