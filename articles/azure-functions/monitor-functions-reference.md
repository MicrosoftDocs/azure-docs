---
title: Monitoring data reference for Azure Functions
description: This article contains important reference material you need when you monitor Azure Functions.
ms.date: 02/15/2024
ms.custom: horz-monitor
ms.topic: reference
ms.service: azure-functions
---

<!-- 
IMPORTANT 
To make this template easier to use, first:
1. Search and replace Azure Functions with the official name of your service.
2. Search and replace functions with the service name to use in GitHub filenames.-->

<!-- VERSION 3.0 2024_01_01
For background about this template, see https://review.learn.microsoft.com/en-us/help/contribute/contribute-monitoring?branch=main -->

<!-- Most services can use the following sections unchanged. All headings are required unless otherwise noted.
The sections use #included text you don't have to maintain, which changes when Azure Monitor functionality changes. Add info into the designated service-specific places if necessary. Remove #includes or template content that aren't relevant to your service.

At a minimum your service should have the following two articles:

1. The primary monitoring article (based on the template monitor-service-template.md)
   - Title: "Monitor Azure Functions"
   - TOC title: "Monitor"
   - Filename: "monitor-functions.md"

2. A reference article that lists all the metrics and logs for your service (based on this template).
   - Title: "Azure Functions monitoring data reference"
   - TOC title: "Monitoring data reference"
   - Filename: "monitor-functions-reference.md".
-->

# Azure Functions monitoring data reference

<!-- Intro. Required. -->
[!INCLUDE [horz-monitor-ref-intro](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Functions](monitor-functions.md) for details on the data you can collect for Azure Functions and how to use it.

See [Monitor executions in Azure Functions](functions-monitoring.md) for details on using Application Insights to collect and analyze log data from individual functions in your function app.

<!-- ## Metrics. Required section. -->
[!INCLUDE [horz-monitor-ref-metrics-intro](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

<!-- Repeat the following section for each resource type/namespace in your service. -->
### Supported metrics for Microsoft.Web/sites
The following table lists the metrics available for the Microsoft.Web/sites resource type. Most of these metrics apply to both FunctionApps and WebApps.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Web/sites](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-web-sites-metrics-include.md)]

### Azure Functions specific metrics

There are two metrics specific to Functions that are of interest:

| Metric | Description |
| ---- | ---- |
| **FunctionExecutionCount** | Function execution count indicates the number of times your function app has executed. This value correlates to the number of times a function runs in your app. This metric isn't currently supported for Premium and Dedicated (App Service) plans running on Linux.|
| **FunctionExecutionUnits** | Function execution units are a combination of execution time and your memory usage.  Memory data isn't a metric currently available through Azure Monitor. However, if you want to optimize the memory usage of your app, can use the performance counter data collected by Application Insights. This metric isn't currently supported for Premium and Dedicated (App Service) plans running on Linux.|

These metrics are used specifically when [estimating Consumption plan costs](functions-consumption-costs.md). 

### App Service metrics

Aside from Azure Functions specific metrics, the App Service platform implements more metrics, which you can use to monitor function apps. For the complete list, see the [App Service monitoring data reference](/azure/app-service/monitor-app-service-reference#metrics).

<!-- ## Metric dimensions. Required section. -->
[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]
[!INCLUDE [horz-monitor-ref-no-metrics-dimensions](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-no-metrics-dimensions.md)]

<!-- ## Resource logs. Required section. -->
[!INCLUDE [horz-monitor-ref-resource-logs](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

<!-- Add at least one resource provider/resource type here. Example: ### Supported resource logs for Microsoft.Storage/storageAccounts/blobServices
Repeat this section for each resource type/namespace in your service. -->
### Supported resource logs for Microsoft.Web/sites
[!INCLUDE [Microsoft.Web/sites](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-web-sites-logs-include.md)]

The log specific to Azure Functions is **FunctionAppLogs**.

For more information, see the [App Service monitoring data reference](/azure/app-service/monitor-app-service-reference#metrics).

<!-- ## Azure Monitor Logs tables. Required section. -->
[!INCLUDE [horz-monitor-ref-logs-tables](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]
### App Services
Microsoft.Web/sites
- [FunctionAppLogs](/azure/azure-monitor/reference/tables/functionapplogs)

<!-- ## Activity log. Required section. -->
[!INCLUDE [horz-monitor-ref-activity-log](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
<!-- Refer to https://learn.microsoft.com/azure/role-based-access-control/resource-provider-operations and link to the possible operations for your service, using the format - [<Namespace> resource provider operations](/azure/role-based-access-control/resource-provider-operations#<namespace>).
Example: - [Microsoft.Storage resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftstorage).
If there are other operations not in the link, list them here in table form. -->
The following table lists operations related to Azure Functions that may be created in the activity log.

| Operation | Description |
|:---|:---|
|Microsoft.web/sites/functions/listkeys/action | Return the [keys for the function](functions-bindings-http-webhook-trigger.md#authorization-keys).|
|Microsoft.Web/sites/host/listkeys/action | Return the [host keys for the function app](functions-bindings-http-webhook-trigger.md#authorization-keys).|
|Microsoft.Web/sites/host/sync/action | [Sync triggers](functions-deployment-technologies.md#trigger-syncing) operation.|
|Microsoft.Web/sites/start/action| Function app started. |
|Microsoft.Web/sites/stop/action| Function app stopped.|
|Microsoft.Web/sites/write| Change a function app setting, such as runtime version or enable remote debugging.|

You may also find logged operations that relate to the underlying App Service behaviors. For a more complete list, see [Microsoft.Web resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftweb).

<!-- ## Other schemas. Optional section. Please keep heading in this order. If your service uses other schemas, add the following include and information. 
[!INCLUDE [horz-monitor-ref-other-schemas](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-other-schemas.md)]
<!-- List other schemas and their usage here. These can be resource logs, alerts, event hub formats, etc. depending on what you think is important. You can put JSON messages, API responses not listed in the REST API docs, and other similar types of info here.  -->

## Related content

- See [Monitor Azure Functions](monitor-functions.md) for a description of monitoring Azure Functions.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
