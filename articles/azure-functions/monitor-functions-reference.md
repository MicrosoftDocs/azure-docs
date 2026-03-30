---
title: Monitoring data reference for Azure Functions
description: This article contains important reference material you need when you monitor Azure Functions.
ms.date: 10/27/2025
ms.custom:
  - horz-monitor
  - build-2024
  - build-2025
ms.topic: reference
ms.service: azure-functions
---


# Azure Functions monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Functions](monitor-functions.md) for details on the data you can collect for Azure Functions and how to use it.

See [Monitor executions in Azure Functions](functions-monitoring.md) for details on using Application Insights to collect and analyze log data from individual functions in your function app.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

Hosting plans that allow your apps to scale dynamically support extra Functions-specific metrics: 

#### [Flex Consumption plan](#tab/flex-consumption-plan)

These metrics are used to estimate the costs associated with _on demand_ and _always ready_ meters used for billing in a [Flex Consumption plan](./flex-consumption-plan.md):

[!INCLUDE [functions-flex-consumption-metrics-table](../../includes/functions-flex-consumption-metrics-table.md)]

In this table, all execution units are calculated by multiplying the fixed instance memory size, such as 512 MB or 2,048 MB, by total execution times, in milliseconds.

These metrics are used to monitor the performance and scaling behavior of your function app in a Flex Consumption plan:

| Metric | Description |
| ------ | ----------- |
| **Automatic Scaling Instance Count** | The number of instances on which this app is running. Note that this is emitted every 30 seconds, and given Flex Consumption scales out and in fast, the number will be an aggregate of all new instances the app used in this time period. Make sure to change the aggregation to the minimum possible in the graph and the aggregation to "count". |
| **Memory working set** | The current amount of memory used by the app, in MB. Can be further filtered for each instance of the app. |
| **Average memory working set** | The average amount of memory used by the app, in megabytes (MB). Can be further filtered for each instance of the app. |
| **CPU Percentage** | The average percentage of CPU being used. Can be further filtered for each instance of the app. This is currently rolling out and might not be available for apps in all regions yet. |

These performance metrics help you understand resource utilization and scaling patterns in your Flex Consumption function app. The instance count metric is particularly useful for monitoring the dynamic scaling behavior, while memory and CPU metrics provide insights into resource consumption patterns.

#### [Consumption plan](#tab/consumption-plan)

These metrics are used specifically when [estimating Consumption plan costs](functions-consumption-costs.md). 

[!INCLUDE [functions-consumption-metrics-table](../../includes/functions-consumption-metrics-table.md)]

---

### Supported metrics for Microsoft.Web/sites

The following table lists the metrics available for the Microsoft.Web/sites resource type. Most of these metrics apply to both function app and web apps, which both run on App Service.

>[!NOTE]  
>These metrics aren't available when your function app runs on Linux in a [Consumption plan](./consumption-plan.md).

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Web/sites](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-web-sites-metrics-include.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-no-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-no-metrics-dimensions.md)]

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Web/sites
[!INCLUDE [Microsoft.Web/sites](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-web-sites-logs-include.md)]

The log specific to Azure Functions is **FunctionAppLogs**.

For more information, see the [App Service monitoring data reference](/azure/app-service/monitor-app-service-reference#metrics).

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### App Services
Microsoft.Web/sites
- [FunctionAppLogs](/azure/azure-monitor/reference/tables/functionapplogs)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

The following table lists operations related to Azure Functions that might be created in the activity log.

| Operation | Description |
|:---|:---|
|Microsoft.web/sites/functions/listkeys/action | Return the [keys for the function](function-keys-how-to.md).|
|Microsoft.Web/sites/host/listkeys/action | Return the [host keys for the function app](function-keys-how-to.md).|
|Microsoft.Web/sites/host/sync/action | [Sync triggers](functions-deployment-technologies.md#trigger-syncing) operation.|
|Microsoft.Web/sites/start/action| Function app started. |
|Microsoft.Web/sites/stop/action| Function app stopped.|
|Microsoft.Web/sites/write| Change a function app setting, such as runtime version or enable remote debugging.|

You may also find logged operations that relate to the underlying App Service behaviors. For a more complete list, see [Microsoft.Web resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftweb).

## Related content

- See [Monitor Azure Functions](monitor-functions.md) for a description of monitoring Azure Functions.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
