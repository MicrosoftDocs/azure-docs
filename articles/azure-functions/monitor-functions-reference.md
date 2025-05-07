---
title: Monitoring data reference for Azure Functions
description: This article contains important reference material you need when you monitor Azure Functions.
ms.date: 03/08/2024
ms.custom: horz-monitor, build-2024
ms.topic: reference
ms.service: azure-functions
---


# Azure Functions monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Functions](monitor-functions.md) for details on the data you can collect for Azure Functions and how to use it.

See [Monitor executions in Azure Functions](functions-monitoring.md) for details on using Application Insights to collect and analyze log data from individual functions in your function app.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

Hosting plans that allow your apps to scale dynamically support extra Functions-specific metrics: 

#### [Consumption plan](#tab/consumption-plan)

These metrics are used specifically when [estimating Consumption plan costs](functions-consumption-costs.md). 

| Metric | Description |
| ---- | ---- |
| **FunctionExecutionCount** | Function execution count indicates the number of times your function app executed. This value correlates to the number of times a function runs in your app. This metric isn't currently supported for Premium and Dedicated (App Service) plans running on Linux.|
| **FunctionExecutionUnits** | Function execution units are a combination of execution time and your memory usage. Memory data isn't a metric currently available through Azure Monitor. However, if you want to optimize the memory usage of your app, can use the performance counter data collected by Application Insights. This metric isn't currently supported for Premium and Dedicated (App Service) plans running on Linux.|

#### [Flex Consumption plan](#tab/flex-consumption-plan)

These metrics are used to estimate the costs associated with _on demand_ and _always ready_ meters used for billing in a [Flex Consumption plan]:

| Metric | Description | Meter calculation |
| ------ | ---------- | ----------------- |
| **OnDemandFunctionExecutionCount**    | Total number of function executions in on demand instances.  | `OnDemandFunctionExecutionCount / 10` is the **On Demand Total Executions** meter, for which the unit of measurement is in tens.  |
| **AlwaysReadyFunctionExecutionCount** | Total number of function executions in always ready instances. | `AlwaysReadyFunctionExecutionCount / 10` is the **Always Ready Total Executions** meter, for which the unit of measurement is in tens. |
| **OnDemandFunctionExecutionUnits**  | Total MB-milliseconds from on demand instances while actively executing functions. | `OnDemandFunctionExecutionUnits / 1,024,000` is the On Demand Execution Time meter, in GB-seconds. |
| **AlwaysReadyFunctionExecutionUnits** | Total MB-milliseconds from always ready instances while actively executing functions. | `AlwaysReadyFunctionExecutionUnits / 1,024,000` is the Always Ready Execution Time meter, in GB-seconds. |
| **AlwaysReadyUnits** | The total MB-milliseconds of always ready instances assigned to the app, whether or not functions are actively executing. | `AlwaysReadyUnits / 1,024,000` is the Always Ready Baseline meter, in GB-seconds. |

In this table, all execution units are calculated by multiplying the fixed instance memory size, such as 2,048 MB or 4,096 MB, by total execution times, in milliseconds.

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
