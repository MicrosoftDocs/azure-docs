---
title: Monitoring Azure Container Registry data reference 
description: Important reference material needed when you monitor your Azure container registry 
author: dlepow
ms.author: danlep
ms.topic: reference
ms.custom: subject-monitoring
ms.service: container-registry
ms.date: 03/10/2021
---
<!-- VERSION 2
Template for monitoring data reference article for Azure services. This article is support for the main "Monitor [servicename]" article for the service. -->

<!-- IMPORTANT STEP 1.  Do a search and replace of [TODO-replace-with-service-name] with the name of your service. That will make the template easier to read -->

# Monitoring Azure Container Registry data reference

See [Monitor Azure Container Registry](monitor-service.md) for details on collecting and analyzing monitoring data for Azure Container Registry.

## Metrics

<!-- REQUIRED if you support Metrics. If you don't, keep the section but call that out. Some services are only onboarded to logs.
<!-- Please keep headings in this order -->

<!-- 2 options here depending on the level of extra content you have. -->

<!-- OPTION 1 - Minimum -  Link to relevant bookmarks in https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported, which is auto generated from the metrics REST API.  Not all metrics are published depending on whether your product group wants them to be.  If the metric is published, but descriptions are wrong of missing, contact your PM and tell them to update them  in the Azure Monitor "shoebox" manifest.  If this article is missing metrics that you and the PM know are available, both of you contact azmondocs@microsoft.com.  
-->

<!-- Example format. There should be AT LEAST one Resource Provider/Resource Type here. 

This section lists all the automatically collected platform metrics collected for Azure Container Registry.  

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Container Registry | [Microsoft.ContainerRegistry/registries](/azure/azure-monitor/essentials/metrics-supported#microsoftcontainerregistryregistries) |




<!--  OPTION 2 -  Link to the metrics as above, but work in extra information not found in the automated metric-supported reference article.  NOTE: YOU WILL NOW HAVE TO MANUALLY MAINTAIN THIS SECTION to make sure it stays in sync with the metrics-supported link. For highly customized example, see [CosmosDB](https://docs.microsoft.com/azure/cosmos-db/monitor-cosmos-db-reference#metrics). They even regroup the metrics into usage type vs. resource provider and type.
-->

<!-- Example format. 

Mimic the setup of metrics supported, but add extra information 
Question: What is the granularity of the metrics - 1 min?
Question: Do we want to add quick usage blurbs?
 
-->
### Container Registry metrics

Resource Provider and Type: [Microsoft.ContainerRegistry/registries](/azure/azure-monitor/platform/metrics-supported#microsoftcontainerregistryregistries)

| Metric | Exportable via Diagnostic Settings? | Unit | Aggregation Type | Description | Dimensions  | Usage | 
|:-------|:-----|:-----|:-----|:------------|:------------------|:----- |
|     AgentPoolCPUTime   | Yes |   Seconds   | Total |   Total CPU time in seconds used by [ACR tasks](container-registry-tasks-overview.md) running on dedicated [agent pools](tasks-agent-pools.md)	         | None | |
|     RunDuration   | Yes |  Milliseconds   |  Total |  Total duration in milliseconds of [ACR tasks](container-registry-tasks-overview.md) runs       | None | |
|     StorageUsed   |  No | Bytes   |   Average | Storage used by the container registry: sum of capacity used by shared layers, manifest files, and replica copies in all repositories.	         | Geo-location | |
|     SuccessfulPullCount | Yes  |   Count   | Total | Number of successful pulls of container images and other artifacts from the registry	           | None | |
|     SuccessfulPushCount   | Yes |   Count   | Total | Number of successful pushes of container images and other artifacts to the registry          | None | |
|     TotalPullCount   |   Yes | Count   |     Total |  Total number of pulls of container images and other artifacts from the registry	      | None | |
|     TotalPushCount   | Yes |  Seconds   |   Total |  Total number of pushes of container images and other artifacts to the registry	        | None | |



<!-- Add additional explanation of reference information as needed here. Link to other articles such as your Monitor [servicename] article as appropriate. -->

<!-- Keep this text as-is -->
For more information, see a list of [all platform metrics supported in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported).



## Metric Dimensions

<!-- REQUIRED. Please  keep headings in this order -->
<!-- If you have metrics with dimensions, outline it here. If you have no dimensions, say so. 
Questions email azmondocs@microsoft.com -->

For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).

<!--
[TODO-replace-with-service-name] does not have any metrics that contain dimensions.

*OR*
-->
Azure Container Registry has the following dimensions associated with its metrics.

<!-- See https://docs.microsoft.com/azure/storage/common/monitor-storage-reference#metrics-dimensions for an example. Part is copied below.

**--------------EXAMPLE format when you have dimensions------------------**

Azure Storage supports following dimensions for metrics in Azure Monitor. -->

| Dimension Name | Description |
| ------------------- | ----------------- |
| **Geo-location** | The Azure region for a registry or [geo-replica](container-registry-geo-replication.md). |


## Resource logs
<!-- REQUIRED. Please  keep headings in this order -->

This section lists the types of resource logs you can collect for Azure Container Registry. 

<!-- List all the resource log types you can have and what they are for -->  

For reference, see a list of [all resource logs category types supported in Azure Monitor](/azure/azure-monitor/platform/resource-logs-schema).



<!-- OPTION 1 - Minimum -  Link to relevant bookmarks in https://docs.microsoft.com/azure/azure-monitor/platform/resource-logs-categories, which is auto generated from the REST API.  Not all resource log types metrics are published depending on whether your product group wants them to be.  If the resource log is published, but category display names are wrong or missing, contact your PM and tell them to update them in the Azure Monitor "shoebox" manifest.  If this article is missing resource logs that you and the PM know are available, both of you contact azmondocs@microsoft.com.  
-->

<!-- Example format. There should be AT LEAST one Resource Provider/Resource Type here. -->





<!--  OPTION 2 -  Link to the resource logs as above, but work in extra information not found in the automated metric-supported reference article.  NOTE: YOU WILL NOW HAVE TO MANUALLY MAINTAIN THIS SECTION to make sure it stays in sync with the resource-log-categories link. You can group these sections however you want provided you include the proper links back to resource-log-categories article. 
-->

<!-- Example format. Add extra information -->

### Container Registries

Resource Provider and Type: [Microsoft.ContainerRegistry/registries](/azure/azure-monitor/essentials/resource-logs-categories#microsoftcontainerregistryregistries)

| Category | Display Name | Details  |
|:---------|:-------------|------------------|
| ContainerRegistryLoginEvents  | Login Events | Registry authentication events and status, including the incoming identity and IP address |
| ContainerRegistryRepositoryEvents | Repository Events           | Operations on images and other artifacts in registry repositories: push, pull, untag, delete (including repository delete), purge tag, and purge manifest |
|

## Azure Monitor Logs tables
<!-- REQUIRED. Please keep heading in this order -->

This section refers to all of the Azure Monitor Logs Kusto tables relevant to Azure Container Registry and available for query by Log Analytics. 

<!--
------------**OPTION 1 EXAMPLE** --------------------->

<!-- OPTION 1 - Minimum -  Link to relevant bookmarks in https://docs.microsoft.com/azure/azure-monitor/reference/tables/tables-resourcetype where your service tables are listed. These files are auto generated from the REST API.   If this article is missing tables that you and the PM know are available, both of you contact azmondocs@microsoft.com.  
-->

<!-- Example format. There should be AT LEAST one Resource Provider/Resource Type here. 

|Resource Type | Notes |
|-------|-----|
| [Virtual Machines](/azure/azure-monitor/reference/tables/tables-resourcetype#virtual-machines) | |
| [Virtual machine scale sets](/azure/azure-monitor/reference/tables/tables-resourcetype#virtual-machine-scale-sets) | |

-->

<!--  OPTION 2 -  List out your tables adding additional information on what each table is for. Individually link to each table using the table name.  For example, link to [AzureMetrics](https://docs.microsoft.com/azure/azure-monitor/reference/tables/azuremetrics).  

NOTE: YOU WILL NOW HAVE TO MANUALLY MAINTAIN THIS SECTION to make sure it stays in sync with the automatically generated list. You can group these sections however you want provided you include the proper links back to the proper tables. 
-->

### Container Registry

| Table |  Description | 
|:---------|:-------------|
| [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity)   | <!-- description copied from previous link --> Entries from the Azure Activity log that provides insight into any subscription-level or management group level events that have occurred in Azure. | 
| [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics) | <!-- description copied from previous link --> Metric data emitted by Azure services that measure their health and performance.    |  
|  [ContainerRegistryLoginEvents](/azure/azure-monitor/reference/tables/containerregistryloginevents)               | Azure Container Registry Login Auditing Logs                             |                                                     
|  [ContainerRegistryRepositoryEvents](/azure/azure-monitor/reference/tables/containerregistryloginevents)               | Azure Container Registry Repository Auditing Logs                         |                                                    


For a reference of all Azure Monitor Logs / Log Analytics tables, see the [Azure Monitor Log Table Reference](/azure/azure-monitor/reference/tables/tables-resourcetype).


To enable diagnostic settings for log collection, see [Collection and routing](monitor-service.md#collection-and-routing).



<!-- If your service uses the AzureDiagnostics table in Azure Monitor Logs / Log Analytics, list what fields you use and what they are for. Azure Diagnostics is over 500 columns wide with all services using the fields that are consistent across Azure Monitor and then adding extra ones just for themselves.  If it uses service specific diagnostic table, refers to that table. If it uses both, put both types of information in. Most services in the future will have their own specific table. If you have questions, contact azmondocs@microsoft.com --

### Diagnostics tables

Q: Pretty sure this doesn't apply to ACR
-->
<!--
[TODO-replace-with-service-name] uses the [Azure Diagnostics](https://docs.microsoft.com/azure/azure-monitor/reference/tables/azurediagnostics) table and the [TODO whatever additional] table to store resource log information. The following columns are relevant.

**Azure Diagnostics**

| Property | Description |
|:--- |:---|
|  |  |
|  |  |

**[TODO Service-specific table]**

| Property | Description |
|:--- |:---|
|  |  |
|  |  |

-->
## Activity log
<!-- REQUIRED. Please keep heading in this order 
Need PM input
-->

The following table lists the operations related to Azure Container Registry that may be created in the Activity log.

<!-- Fill in the table with the operations that can be created in the Activity log for the service. -->
| Operation | Description |
|:---|:---|
| | |
| | |

<!-- NOTE: This information may be hard to find or not listed anywhere.  Please ask your PM for at least an incomplete list of what type of messages could be written here. If you can't locate this, contact azmondocs@microsoft.com for help -->

## Schemas
<!-- REQUIRED. Please keep heading in this order -->

The following schemas are in use by Azure Container Registry's resource logs.

<!-- List the schema and their usage. This can be for resource logs, alerts, event hub formats, etc depending on what you think is important. 
Q: How to get the schema descriptions added/improved.
-->
| Schema | Description |
|:--- |:---|
| [ContainerRegistryLoginEvents](/azure/azure-monitor/reference/tables/ContainerRegistryLoginEvents)  | Schema for registry authentication events and status, including the incoming identity and IP address |
| [ContainerRegistryRepositoryEvents](/azure/azure-monitor/reference/tables/ContainerRegistryRepositoryEvents) | Schema for operations on images and other artifacts in registry repositories |
## See Also

<!-- replace below with the proper link to your main monitoring service article -->
- See [Monitor Azure Container Registry](monitor-service.md) for a description of monitoring an Azure container registry.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resources) for details on monitoring Azure resources.