---
title: Monitoring Public IP address data reference
description: Important reference material needed when you monitor Public IP address 
author: asudbring
ms.topic: reference
ms.author: allensu
ms.service: virtual-network
ms.custom: subject-monitoring
ms.date: 09/01/2021
---

<!-- VERSION 2.3
Template for monitoring data reference article for Azure services. This article is support for the main "Monitoring [servicename]" article for the service. -->

<!-- IMPORTANT STEP 1.  Do a search and replace of [TODO-replace-with-service-name] with the name of your service. That will make the template easier to read -->

# Monitoring [TODO-replace-with-service-name] data reference

See [Monitoring [TODO-replace-with-service-name]](monitor-service.md) for details on collecting and analyzing monitoring data for [TODO-replace-with-service-name].

## Metrics

<!-- REQUIRED if you support Metrics. If you don't, keep the section but call that out. Some services are only onboarded to logs.
<!-- Please keep headings in this order -->

<!-- 2 options here depending on the level of extra content you have. -->

------------**OPTION 1 EXAMPLE** ---------------------

<!-- OPTION 1 - Minimum -  Link to relevant bookmarks in https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported, which is auto generated from underlying systems.  Not all metrics are published depending on whether your product group wants them to be.  If the metric is published, but descriptions are wrong of missing, contact your PM and tell them to update them  in the Azure Monitor "shoebox" manifest.  If this article is missing metrics that you and the PM know are available, both of you contact azmondocs@microsoft.com.  
-->

<!-- Example format. There should be AT LEAST one Resource Provider/Resource Type here. -->

This section lists all the automatically collected platform metrics collected for [TODO-replace-with-service-name].  

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Virtual Machine | [Microsoft.Compute/virtualMachine](/azure/azure-monitor/platform/metrics-supported#microsoftcomputevirtualmachines) |
| Virtual machine scale set | [Microsoft.Compute/virtualMachinescaleset](/azure/azure-monitor/platform/metrics-supported#microsoftcomputevirtualmachinescaleset) 



--------------**OPTION 2 EXAMPLE** -------------

<!--  OPTION 2 -  Link to the metrics as above, but work in extra information not found in the automated metric-supported reference article.  NOTE: YOU WILL NOW HAVE TO MANUALLY MAINTAIN THIS SECTION to make sure it stays in sync with the metrics-supported link. For highly customized example, see [CosmosDB](https://docs.microsoft.com/azure/cosmos-db/monitor-cosmos-db-reference#metrics). They even regroup the metrics into usage type vs. resource provider and type.
-->

<!-- Example format. Mimic the setup of metrics supported, but add extra information -->

### Virtual Machine metrics

Resource Provider and Type: [Microsoft.Compute/virtualMachines](/azure/azure-monitor/platform/metrics-supported#microsoftcomputevirtualmachines)

| Metric | Unit | Description | *TODO replace this label with other information*  |
|:-------|:-----|:------------|:------------------|
|        |      |             | Use this metric for <!-- put your specific information in here -->  |
|        |      |             |  |

### Virtual machine scale set metrics

Namespace- [Microsoft.Compute/virtualMachinesscaleset](/azure/azure-monitor/platform/metrics-supported#microsoftcomputevirtualmachinescalesets) 

| Metric | Unit | Description | *TODO replace this label with other information*  |
|:-------|:-----|:------------|:------------------|
|        |      |             | Use this metric for <!-- put your specific information in here -->  |
|        |      |             |  |


<!-- Add additional explanation of reference information as needed here. Link to other articles such as your Monitor [servicename] article as appropriate. -->

<!-- Keep this text as-is -->
For more information, see a list of [all platform metrics supported in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported).



## Metric Dimensions

<!-- REQUIRED. Please  keep headings in this order -->
<!-- If you have metrics with dimensions, outline it here. If you have no dimensions, say so.  Questions email azmondocs@microsoft.com -->

For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).


[TODO-replace-with-service-name] does not have any metrics that contain dimensions.

*OR*

[TODO-replace-with-service-name] has the following dimensions associated with its metrics.

<!-- See https://docs.microsoft.com/azure/storage/common/monitor-storage-reference#metrics-dimensions for an example. Part is copied below. -->

**--------------EXAMPLE format when you have dimensions------------------**

Azure Storage supports following dimensions for metrics in Azure Monitor.

| Dimension Name | Description |
| ------------------- | ----------------- |
| **BlobType** | The type of blob for Blob metrics only. The supported values are **BlockBlob**, **PageBlob**, and **Azure Data Lake Storage**. Append blobs are included in **BlockBlob**. |
| **BlobTier** | Azure storage offers different access tiers, which allow you to store blob object data in the most cost-effective manner. See more in [Azure Storage blob tier](/azure/storage/blobs/storage-blob-storage-tiers). The supported values include: <br/> <li>**Hot**: Hot tier</li> <li>**Cool**: Cool tier</li> <li>**Archive**: Archive tier</li> <li>**Premium**: Premium tier for block blob</li> <li>**P4/P6/P10/P15/P20/P30/P40/P50/P60**: Tier types for premium page blob</li> <li>**Standard**: Tier type for standard page Blob</li> <li>**Untiered**: Tier type for general purpose v1 storage account</li> |
| **GeoType** | Transaction from Primary or Secondary cluster. The available values include **Primary** and **Secondary**. It applies to Read Access Geo Redundant Storage(RA-GRS) when reading objects from secondary tenant. |

## Resource logs
<!-- REQUIRED. Please  keep headings in this order -->

This section lists the types of resource logs you can collect for [TODO-replace-with-service-name]. 

<!-- List all the resource log types you can have and what they are for -->  

For reference, see a list of [all resource logs category types supported in Azure Monitor](/azure/azure-monitor/platform/resource-logs-schema).

------------**OPTION 1 EXAMPLE** ---------------------

<!-- OPTION 1 - Minimum -  Link to relevant bookmarks in https://docs.microsoft.com/azure/azure-monitor/platform/resource-logs-categories, which is auto generated from the REST API.  Not all resource log types metrics are published depending on whether your product group wants them to be.  If the resource log is published, but category display names are wrong or missing, contact your PM and tell them to update them in the Azure Monitor "shoebox" manifest.  If this article is missing resource logs that you and the PM know are available, both of you contact azmondocs@microsoft.com.  
-->

<!-- Example format. There should be AT LEAST one Resource Provider/Resource Type here. -->

This section lists all the resource log category types collected for [TODO-replace-with-service-name].  

|Resource Log Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Web Sites | [Microsoft.web/sites](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsites) |
| Web Site Slots | [Microsoft.web/sites/slots](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsitesslots) 

--------------**OPTION 2 EXAMPLE** -------------

<!--  OPTION 2 -  Link to the resource logs as above, but work in extra information not found in the automated metric-supported reference article.  NOTE: YOU WILL NOW HAVE TO MANUALLY MAINTAIN THIS SECTION to make sure it stays in sync with the resource-log-categories link. You can group these sections however you want provided you include the proper links back to resource-log-categories article. 
-->

<!-- Example format. Add extra information -->

### Web Sites

Resource Provider and Type: [Microsoft.web/sites](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsites)

| Category | Display Name | *TODO replace this label with other information*  |
|:---------|:-------------|------------------|
| AppServiceAppLogs   | App Service Application Logs | *TODO other important information about this type* |
| AppServiceAuditLogs | Access Audit Logs            | *TODO other important information about this type* |
|  etc.               |                              |                                                   |  

### Web Site Slots

Resource Provider and Type: [Microsoft.web/sites/slots](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsitesslots)

| Category | Display Name | *TODO replace this label with other information*  |
|:---------|:-------------|------------------|
| AppServiceAppLogs   | App Service Application Logs | *TODO other important information about this type* |
| AppServiceAuditLogs | Access Audit Logs            | *TODO other important information about this type* |
|  etc.               |                              |                                                   |  

--------------**END Examples** -------------

## Azure Monitor Logs tables
<!-- REQUIRED. Please keep heading in this order -->

This section refers to all of the Azure Monitor Logs Kusto tables relevant to [TODO-replace-with-service-name] and available for query by Log Analytics. 

<!--  Link to relevant bookmark in https://docs.microsoft.com/azure/azure-monitor/reference/tables/tables-resourcetype where your service tables are listed. These files are auto generated from the REST API.   If this article is missing tables that you and the PM know are available, both of you contact azmondocs@microsoft.com.  
-->

### Diagnostics tables
<!-- REQUIRED. Please keep heading in this order -->
<!-- If your service uses the AzureDiagnostics table in Azure Monitor Logs / Log Analytics, list what fields you use and what they are for. Azure Diagnostics is over 500 columns wide with all services using the fields that are consistent across Azure Monitor and then adding extra ones just for themselves.  If it uses service specific diagnostic table, refers to that table. If it uses both, put both types of information in. Most services in the future will have their own specific table. If you have questions, contact azmondocs@microsoft.com -->

[TODO-replace-with-service-name] uses the [Azure Diagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table and the [TODO whatever additional] table to store resource log information. The following columns are relevant.

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

## Activity log
<!-- REQUIRED. Please keep heading in this order -->

The following table lists the operations that [TODO-replace-with-service-name] may record in the Activity log. This is a subset of the possible entries your might find in the activity log.

<!-- Fill in the table with the operations that can be created in the Activity log for the service by gathering the links for your namespaces or otherwise explaning what's available. For example, see the bookmark https://docs.microsoft.com/en-us/azure/role-based-access-control/resource-provider-operations#microsoftbatch -->
| Namespace | Description |
|:---|:---|
| | |
| | |

<!-- NOTE: Any additional operations may be hard to find or not listed anywhere.  Please ask your PM for at least any additional list of what messages could be written to the activity log. You can contact azmondocs@microsoft.com for help if needed. -->

See [all the possible resource provider operations in the activity log](/azure/role-based-access-control/resource-provider-operations).  

For more information on the schema of Activity Log entries, see [Activity  Log schema](/azure/azure-monitor/essentials/activity-log-schema). 

## Schemas
<!-- OPTIONAL. Please keep heading in this order -->

The following schemas are in use by [TODO-replace-with-service-name]

<!-- List the schema and their usage. This can be for resource logs, alerts, event hub formats, etc depending on what you think is important. JSON messages, API responses not listed in the REST API docs and other similar types of info can be put here.  -->

## See Also

<!-- replace below with the proper link to your main monitoring service article -->
- See [Monitoring Azure [TODO-replace-with-service-name]](monitor-service-name.md) for a description of monitoring Azure [TODO-replace-with-service-name].
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resources) for details on monitoring Azure resources.