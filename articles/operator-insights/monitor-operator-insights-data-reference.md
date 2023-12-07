---
title: Monitoring Azure Operator Insights data reference #Required; *your official service name*  
description: Important reference material needed when you monitor Azure Operator Insights 
author: rcdun
ms.author: rdunstan
ms.reviewer: rathishr
ms.topic: reference
ms.service: operator-insights
ms.custom: horz-monitor
ms.date: 12/15/2023
---
<!-- VERSION 2.3
Template for monitoring data reference article for Azure services. This article is support for the main "Monitoring Azure Operator Insights" article for the service. -->

# Monitoring Azure Operator Insights data reference

See [Monitoring Azure Operator Insights](monitor-operator-insights.md) for details on collecting and analyzing monitoring data for Azure Operator Insights.

## Metrics

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> REQUIRED if you support Metrics. If you don't, keep the section but call that out. Some services are only onboarded to logs.
> Please keep headings in this order.

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> 2 options here depending on the level of extra content you have. -->

------------**OPTION 1 EXAMPLE** ---------------------

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> OPTION 1 - Minimum -  Link to relevant bookmarks in https://learn.microsoft.com/azure/azure-monitor/platform/metrics-supported, which is auto generated from underlying systems.  Not all metrics are published depending on whether your product group wants them to be.  If the metric is published, but descriptions are wrong of missing, contact your PM and tell them to update them  in the Azure Monitor "shoebox" manifest.  If this article is missing metrics that you and the PM know are available, both of you contact azmondocs@microsoft.com.
>
> Example format. There should be AT LEAST one Resource Provider/Resource Type here.

This section lists all the automatically collected platform metrics collected for Azure Operator Insights.  

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Virtual Machine | [Microsoft.Compute/virtualMachine](/azure/azure-monitor/platform/metrics-supported#microsoftcomputevirtualmachines) |
| Virtual machine scale set | [Microsoft.Compute/virtualMachinescaleset](/azure/azure-monitor/platform/metrics-supported#microsoftcomputevirtualmachinescaleset) 



--------------**OPTION 2 EXAMPLE** -------------

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> OPTION 2 -  Link to the metrics as above, but work in extra information not found in the automated metric-supported reference article.  NOTE: YOU WILL NOW HAVE TO MANUALLY MAINTAIN THIS SECTION to make sure it stays in sync with the metrics-supported link. For highly customized example, see [CosmosDB](https://learn.microsoft.com/azure/cosmos-db/monitor-cosmos-db-reference#metrics). They even regroup the metrics into usage type vs. resource provider and type.
> 
> Example format. Mimic the setup of metrics supported, but add extra information -->

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


> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
>  Add additional explanation of reference information as needed here. Link to other articles such as your Monitor [servicename] article as appropriate. -->

For more information, see a list of [all platform metrics supported in Azure Monitor](/azure/azure-monitor/platform/metrics-supported).

## Metric Dimensions

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> REQUIRED. Please  keep headings in this order -->
> If you have metrics with dimensions, outline it here. If you have no dimensions, say so.  Questions email azmondocs@microsoft.com

For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).


Azure Operator Insights does not have any metrics that contain dimensions.

*OR*

Azure Operator Insights has the following dimensions associated with its metrics.

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> See https://learn.microsoft.com/azure/storage/common/monitor-storage-reference#metrics-dimensions for an example. Part is copied below. -->

**--------------EXAMPLE format when you have dimensions------------------**

Azure Storage supports following dimensions for metrics in Azure Monitor.

| Dimension Name | Description |
| ------------------- | ----------------- |
| **BlobType** | The type of blob for Blob metrics only. The supported values are **BlockBlob**, **PageBlob**, and **Azure Data Lake Storage**. Append blobs are included in **BlockBlob**. |
| **BlobTier** | Azure storage offers different access tiers, which allow you to store blob object data in the most cost-effective manner. See more in [Azure Storage blob tier](/azure/storage/blobs/storage-blob-storage-tiers). The supported values include: <br/> <li>**Hot**: Hot tier</li> <li>**Cool**: Cool tier</li> <li>**Archive**: Archive tier</li> <li>**Premium**: Premium tier for block blob</li> <li>**P4/P6/P10/P15/P20/P30/P40/P50/P60**: Tier types for premium page blob</li> <li>**Standard**: Tier type for standard page Blob</li> <li>**Untiered**: Tier type for general purpose v1 storage account</li> |
| **GeoType** | Transaction from Primary or Secondary cluster. The available values include **Primary** and **Secondary**. It applies to Read Access Geo Redundant Storage(RA-GRS) when reading objects from secondary tenant. |

## Resource logs

This section lists the types of resource logs you can collect for Azure Operator Insights.   

|Resource Log Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| DataProducts| [Microsoft.NetworkAnalytics/DataProducts](/azure/azure-monitor/platform/resource-logs-categories#microsoftnetworkanalyticsdataproducts) |

The DataProducts logs include information about:

- `Digestion` (for processing the data available to a Data Product)
- `Ingestion` (for adding or changing data in the input storage account for a Data Product)
- `IngestionDelete` (for deleting data from the input storage account for a Data Product)
- `ReadStorage` (for read access to the output storage account for a Data Product)
- `DatabaseQuery` (for query operations performed on the database of a dataproduct)

For reference, see a list of [all resource logs category types supported in Azure Monitor](/azure/azure-monitor/platform/resource-logs-schema).

## Azure Monitor Logs tables

This section lists all of the Azure Monitor Logs Kusto tables relevant to Azure Operator Insights and available for query by Log Analytics.

|Log type|Table name|
|--------|----------|
|Digestion logs|[AOIDigestion](/azure/azure-monitor/reference/tables/aoidigestion)|
|Storage logs|[AOIStorage](/azure/azure-monitor/reference/tables/aoistorage)|
|Database query logs|[AOIStorage](/azure/azure-monitor/reference/tables/aoistorage)|

### Diagnostics tables

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> REQUIRED. Please keep heading in this order
> 
> If your service uses the AzureDiagnostics table in Azure Monitor Logs / Log Analytics, list what fields you use and what they are for. Azure Diagnostics is over 500 columns wide with all services using the fields that are consistent across Azure Monitor and then adding extra ones just for themselves.  If it uses service specific diagnostic table, refers to that table. If it uses both, put both types of information in. Most services in the future will have their own specific table. If you have questions, contact azmondocs@microsoft.com -->

Azure Operator Insights uses the [Azure Diagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table and the [TODO whatever additional] table to store resource log information. The following columns are relevant.

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

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> REQUIRED. Please keep heading in this order -->

The following table lists the operations that Azure Operator Insights may record in the Activity log. This is a subset of the possible entries your might find in the activity log.

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> Fill in the table with the operations that can be created in the Activity log for the service by gathering the links for your namespaces or otherwise explaning what's available. For example, see the bookmark https://learn.microsoft.com/azure/role-based-access-control/resource-provider-operations#microsoftbatch

| Namespace | Description |
|:---|:---|
| | |
| | |

> [!WARNING]
> INTERNAL INSTRUCTIONS: remove this note before publishing
> NOTE: Any additional operations may be hard to find or not listed anywhere.  Please ask your PM for at least any additional list of what messages could be written to the activity log. You can contact azmondocs@microsoft.com for help if needed. -->

See [all the possible resource provider operations in the activity log](/azure/role-based-access-control/resource-provider-operations).  

For more information on the schema of Activity Log entries, see [Activity  Log schema](/azure/azure-monitor/essentials/activity-log-schema). 

## Schemas

Azure Operator Insights uses multiple schemas for logs.

|Log type|Relates to|Schema link|
|--------|----------|
|Digestion logs|Processing (digestion) of data|[AOIDigestion](/azure/azure-monitor/reference/tables/aoidigestion)|
|Storage logs|Operations on the Data Product's storage|[AOIStorage](/azure/azure-monitor/reference/tables/aoistorage)|
|Database query logs|Queries run on the Data Product's database|[AOIStorage](/azure/azure-monitor/reference/tables/aoistorage)|

## See Also

- See [Monitoring Azure Azure Operator Insights](monitor-operator-insights.md) for a description of monitoring Azure Azure Operator Insights.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resources) for details on monitoring Azure resources.