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

<!-- 
IMPORTANT 
To make this template easier to use, first:
1. Search and replace Data Factory with the official name of your service.
2. Search and replace data-factory with the service name to use in GitHub filenames.-->

<!-- VERSION 3.0 2024_01_01
For background about this template, see https://review.learn.microsoft.com/en-us/help/contribute/contribute-monitoring?branch=main -->

<!-- Most services can use the following sections unchanged. All headings are required unless otherwise noted.
The sections use #included text you don't have to maintain, which changes when Azure Monitor functionality changes. Add info into the designated service-specific places if necessary. Remove #includes or template content that aren't relevant to your service.

At a minimum your service should have the following two articles:

1. The primary monitoring article (based on the template monitor-service-template.md)
   - Title: "Monitor Data Factory"
   - TOC title: "Monitor"
   - Filename: "monitor-data-factory.md"

2. A reference article that lists all the metrics and logs for your service (based on this template).
   - Title: "Data Factory monitoring data reference"
   - TOC title: "Monitoring data reference"
   - Filename: "monitor-data-factory-reference.md".
-->

# Azure Data Factory monitoring data reference

<!-- Intro. Required. -->
[!INCLUDE [horz-monitor-ref-intro](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Data Factory](monitor-data-factory.md) for details on the data you can collect for Azure Data Factory and how to use it.

<!-- ## Metrics. Required section. -->
[!INCLUDE [horz-monitor-ref-metrics-intro](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]
<!-- Repeat the following section for each resource type/namespace in your service. -->
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

<!-- ## Metric dimensions. Required section. -->
[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]
<!-- Use one of the following includes, depending on whether you have metrics with dimensions.
- If you have metrics with dimensions, use the following include and list the metrics with dimensions after the include. For an example, see https://learn.microsoft.com/azure/storage/common/monitor-storage-reference#metrics-dimensions. Questions: email azmondocs@microsoft.com. -->
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

<!-- If you DON'T have metrics with dimensions, use the following include: 
[!INCLUDE [horz-monitor-ref-no-metrics-dimensions](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-no-metrics-dimensions.md)] -->

<!-- ## Resource logs. Required section. -->
[!INCLUDE [horz-monitor-ref-resource-logs](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

<!-- Add at least one resource provider/resource type here. Repeat this section for each resource type/namespace in your service. Example: ### Supported resource logs for Microsoft.Storage/storageAccounts/blobServices -->
### Supported resource logs for Microsoft.DataFactory/factories
[!INCLUDE [Microsoft.DataFactory/factories](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-datafactory-factories-logs-include.md)]

<!-- ## Azure Monitor Logs tables. Required section. -->
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

<!-- Example:
### Storage Accounts
Microsoft.Storage/storageAccounts
- [StorageBlobLogs](/azure/azure-monitor/reference/tables/storagebloblogs#columns)

Find the table(s) for your service at https://learn.microsoft.com/azure/azure-monitor/reference/tables/tables-resourcetype. These files are auto generated from the REST API. 
Also refer to https://learn.microsoft.com/azure/azure-monitor/reference/tables/azurediagnostics#azure-diagnostics-mode to see whether your service uses the AzureDiagnostics table in Azure Monitor Logs / Log Analytics. 
Link to the service-specific tables. If your service uses the AzureDiagnostics table, list the fields you use and what they're for. If your service uses both tables, list both types of information. Add any further information after each table link, such as descriptions and usage, or information not found in the tables. 

IMPORTANT: Field names for Log Analytics may vary from the same field names for Storage. Many services need a mapping table to map the two sets of fields. -->

<!-- ## Activity log. Required section. -->
[!INCLUDE [horz-monitor-ref-activity-log](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.DataFactory resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftdatafactory)

<!-- ## Other schemas. Optional section. Please keep heading in this order. If your service uses other schemas, add the following include and information. 
[!INCLUDE [horz-monitor-ref-other-schemas](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-other-schemas.md)]
List other schemas and their usage here. These can be resource logs, alerts, event hub formats, etc. depending on what you think is important. You can put JSON messages, API responses not listed in the REST API docs, and other similar types of info here.  -->

## Related content

- See [Monitor Data Factory](monitor-data-factory.md) for a description of monitoring Data Factory.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
