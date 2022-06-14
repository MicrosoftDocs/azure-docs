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

See [Monitoring Azure Functions](monitor-functions.md) for details on collecting and analyzing monitoring data for Azure Functions.

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

[TODO-replace-with-service-name] has the following dimensions associated with
its metrics.

## Resource logs

This section lists the types of resource logs you can collect for Azure Functions.

<!-- List all the resource log types you can have and what they are for -->
<!-- TODO:glenn Since this leverages up on the resource log types for App Service, should we just add a link to them here? If so, should we clearly mention FunctionAppLogs? -->

For reference, see a list of [all resource logs category types supported in Azure Monitor](../azure-monitor/essentials/resource-logs-schema.md).

## Azure Monitor Logs tables

This section refers to all of the Azure Monitor Logs Kusto tables relevant to Azure Functions and available for query by Log Analytics.

<!-- TODO:glenn Same as above -->

For a reference of all Azure Monitor Logs / Log Analytics tables, see the [Azure Monitor Log Table Reference](../azure-monitor/reference/tables/tables-resourcetype).

<!-- TODO:glenn the reference above doesn't exist in the repo -->

### Diagnostics tables

<!-- TODO:glenn do we really need this section? -->

<!-- REQUIRED. Please keep heading in this order -->
<!-- If your service uses the AzureDiagnostics table in Azure Monitor Logs /
Log Analytics, list what fields you use and what they are for. Azure
Diagnostics is over 566 columns wide with all services using the fields that
are consistent across Azure Monitor and then adding extra ones just for them-
selves. If it uses service specific diagnostic table, refers to that table. If
it uses both, put both types of information in. Most services in the future
will have their own specific table. If you have questions, contact
azmondocs@microsoft.com -->

[TODO-replace-with-service-name] uses the [Azure Diagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table and the [TODO whatever addi-tional] table to store resource log information. The following columns are relevant.

**Azure Diagnostics**

Property I Description I
c'___ o'___

**[TODO Service-specific table]**

I Property I Description I
-'___ o°___


## Activity log

The following table lists the operations related to Azure Functions that may be created in the Activity log.

<!-- Fill in the table with the operations that can be created in the Activity log for the service. -->
| Operation | Description |
|:---|:---|
| | |
| | |

<!-- TODO:glenn do you have a complete list of the operation and their "official" meaning? -->

<!-- NOTE: This information may be hard to find or not listed anywhere. Please
ask your PM for at least an incomplete list of what type of messages could be
written here. If you can't locate this, contact azmondocs@microsoft.com for
help -->

For more information on the schema of Activity Log entries, see [Activity Log schema](../azure-monitor/essentials/activity-log-schema.md).

## Schemas

<!-- TODO:glenn don't think we have anything to add here, but the template says it's required -->

The following schemas are in use by Azure Functions

<!-- List the schema and their usage. This can be for resource logs, alerts,
event hub formats, etc depending on what you think is important. -->

## See Also

<!-- replace below with the proper link to your main monitoring service article
-->
- See [Monitoring Azure Functions](monitor-functions.md) for a description of monitoring Azure Functions.
- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.