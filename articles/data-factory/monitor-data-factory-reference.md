---
title: Monitoring data reference for Azure Data Factory
description: This article contains important reference material you need when you monitor Azure Data Factory.
ms.date: 02/26/2024
ms.custom: horz-monitor
ms.topic: reference
author: jonburchel
ms.author: jburchel
ms.service: data-factory
---

# Azure Data Factory monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Data Factory](monitor-data-factory.md) for details on the data you can collect for Azure Data Factory and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.DataFactory/datafactories
The following table lists the metrics available for the Microsoft.DataFactory/datafactories resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.DataFactory/datafactories](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-datafactory-datafactories-metrics-include.md)]

### Supported metrics for Microsoft.DataFactory/factories
The following table lists the metrics available for the Microsoft.DataFactory/factories resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.DataFactory/factories](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-datafactory-factories-metrics-include.md)]

> [!NOTE]
> Except for _PipelineElapsedTimeRuns_, only events from completed, triggered activity and pipeline runs are emitted. In-progress and debug runs aren't emitted. However, events from all SSIS package executions are emitted, including those that are completed and in progress, regardless of their invocation methods. For example, you can invoke package executions on Azure-enabled SQL Server Data Tools, via T-SQL on SQL Server Management Studio, SQL Server Agent, or other designated tools, and as triggered or debug runs of Execute SSIS Package activities in Data Factory pipelines.

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]
[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

### Microsoft.DataFactory/datafactories

- pipelineName
- activityName

### Microsoft.DataFactory/factories
- ActivityType
- PipelineName
- FailureType
- Name
- IntegrationRuntimeName
- ContainerName
- DagFile
- DagId
- ComputeNodeSize
- Job
- Operator
- Pool
- TaskId
- State
- NodeName
- CancelledBy
- RunId

[!INCLUDE [horz-monitor-ref-resource-logs](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.DataFactory/factories
[!INCLUDE [Microsoft.DataFactory/factories](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-datafactory-factories-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]
### Data factories

Microsoft.DataFactory/factories

- [AzureActivity](/azure/azure-monitor/reference/tables/AzureActivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/AzureMetrics#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/AzureDiagnostics#columns)
- [ADFActivityRun](/azure/azure-monitor/reference/tables/ADFActivityRun#columns)
- [ADFPipelineRun](/azure/azure-monitor/reference/tables/ADFPipelineRun#columns)
- [ADFTriggerRun](/azure/azure-monitor/reference/tables/ADFTriggerRun#columns)
- [ADFSandboxActivityRun](/azure/azure-monitor/reference/tables/ADFSandboxActivityRun#columns)
- [ADFSandboxPipelineRun](/azure/azure-monitor/reference/tables/ADFSandboxPipelineRun#columns)
- [ADFSSISIntegrationRuntimeLogs](/azure/azure-monitor/reference/tables/ADFSSISIntegrationRuntimeLogs#columns)
- [ADFSSISPackageEventMessageContext](/azure/azure-monitor/reference/tables/ADFSSISPackageEventMessageContext#columns)
- [ADFSSISPackageEventMessages](/azure/azure-monitor/reference/tables/ADFSSISPackageEventMessages#columns)
- [ADFSSISPackageExecutableStatistics](/azure/azure-monitor/reference/tables/ADFSSISPackageExecutableStatistics#columns)
- [ADFSSISPackageExecutionComponentPhases](/azure/azure-monitor/reference/tables/ADFSSISPackageExecutionComponentPhases#columns)
- [ADFSSISPackageExecutionDataStatistics](/azure/azure-monitor/reference/tables/ADFSSISPackageExecutionDataStatistics#columns)

For detailed information about the attributes used by the Azure Monitor and Log Analytics schemas, see [Schema of logs and events](monitor-schema-logs-events.md).

[!INCLUDE [horz-monitor-ref-activity-log](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.DataFactory resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftdatafactory)

## Related content

- See [Monitor Data Factory](monitor-data-factory.md) for a description of monitoring Data Factory.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
