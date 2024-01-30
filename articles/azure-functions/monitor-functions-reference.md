---
title: Monitoring Azure Functions data reference
description: Important reference material needed when you monitor Azure Functions
ms.topic: reference
ms.service: azure-functions
ms.custom: subject-monitoring
ms.date: 07/05/2022
---

# Monitoring Azure Functions data reference

This reference applies to the use of Azure Monitor for monitoring function apps hosted in Azure Functions. See [Monitoring function app with Azure Monitor](monitor-functions.md) for details on using Azure Monitor to collect and analyze monitoring data from your function apps. 

See [Monitor Azure Functions](functions-monitoring.md) for details on using Application Insights to collect and analyze log data from individual functions in your function app.

## Metrics

This section lists all the automatically collected platform metrics collected for Azure Functions.

### Azure Functions specific metrics

There are two metrics specific to Functions that are of interest:

| Metric | Description |
| ---- | ---- |
| **FunctionExecutionCount** | Function execution count indicates the number of times your function app has executed. This value correlates to the number of times a function runs in your app. This metric isn't currently supported for Premium and Dedicated (App Service) plans running on Linux.|
| **FunctionExecutionUnits** | Function execution units are a combination of execution time and your memory usage.  Memory data isn't a metric currently available through Azure Monitor. However, if you want to optimize the memory usage of your app, can use the performance counter data collected by Application Insights. This metric isn't currently supported for Premium and Dedicated (App Service) plans running on Linux.|

These metrics are used specifically when [estimating Consumption plan costs](functions-consumption-costs.md). 

### General App Service metrics

Aside from Azure Functions specific metrics, the App Service platform implements more metrics, which you can use to monitor function apps. For the complete list, see [metrics available to App Service apps](../app-service/web-sites-monitor.md#understand-metrics) and [Monitoring App Service data reference](../app-service/monitor-app-service-reference.md#metrics).

## Metric Dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](../azure-monitor/essentials/data-platform-metrics.md#multi-dimensional-metrics).

Azure Functions doesn't have any metrics that contain dimensions.

## Resource logs

This section lists the types of resource logs you can collect for your function apps.

| Log type | Description |
|-|-|
| FunctionAppLogs | Function app logs |

For more information, see [Monitoring App Service data reference](../app-service/monitor-app-service-reference.md#resource-logs).

For reference, see a list of [all resource logs category types supported in Azure Monitor](../azure-monitor/essentials/resource-logs-schema.md).

## Azure Monitor Logs tables

Azure Functions uses Kusto tables from Azure Monitor Logs. You can query the [FunctionAppLogs table](/azure/azure-monitor/reference/tables/functionapplogs) with Log Analytics. For more information, see the [Azure Monitor Log Table Reference](/azure/azure-monitor/reference/tables/tables-resourcetype#app-services).

## Activity log

The following table lists the operations related to Azure Functions that may be created in the Activity log. 

| Operation | Description |
|:---|:---|
|Microsoft.web/sites/functions/listkeys/action | Return the [keys for the function](functions-bindings-http-webhook-trigger.md#authorization-keys).|
|Microsoft.Web/sites/host/listkeys/action | Return the [host keys for the function app](functions-bindings-http-webhook-trigger.md#authorization-keys).|
|Microsoft.Web/sites/host/sync/action | [Sync triggers](functions-deployment-technologies.md#trigger-syncing) operation.|
|Microsoft.Web/sites/start/action| Function app started. |
|Microsoft.Web/sites/stop/action| Function app stopped.|
|Microsoft.Web/sites/write| Change a function app setting, such as runtime version or enable remote debugging.|

You may also find logged operations that relate to the underlying App Service behaviors. For a more complete list, see [Resource Provider Operations](../role-based-access-control/resource-provider-operations.md#microsoftweb).

For more information on the schema of Activity Log entries, see [Activity Log schema](../azure-monitor/essentials/activity-log-schema.md).

## See Also

* See [Monitoring Azure Functions](monitor-functions.md) for a description of monitoring Azure Functions.
* See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.
