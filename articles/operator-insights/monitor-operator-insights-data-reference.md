---
title: Monitoring Azure Operator Insights data reference
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

This article describes the data you can collect in Azure Monitor for Azure Operator Insights. See [Monitoring Azure Operator Insights](monitor-operator-insights.md) for details on how to collect and analyze this monitoring data.

## Metrics

Azure Operator Insights doesn't provide metrics in Azure Monitor.

## Resource logs

This section lists the types of resource logs you can collect for Azure Operator Insights.   

|Resource Log Type | Resource Provider / Type Namespace<br/> and link to individual logs |
|-------|-----|
| DataProducts| [Microsoft.NetworkAnalytics/DataProducts](/azure/azure-monitor/platform/resource-logs-categories#microsoftnetworkanalyticsdataproducts) |

The DataProducts logs include information about:

- `Digestion` (for processing the data available to a Data Product)
- `Ingestion` (for adding or changing data in the input storage account for a Data Product)
- `IngestionDelete` (for deleting data from the input storage account for a Data Product)
- `ReadStorage` (for read access to the output storage account for a Data Product)
- `DatabaseQuery` (for query operations performed on the database of a Data Product)

For reference, see a list of [all resource logs category types supported in Azure Monitor](/azure/azure-monitor/platform/resource-logs-schema).

## Azure Monitor Logs tables

This section lists all of the Azure Monitor Logs Kusto tables relevant to Azure Operator Insights and available for query by Log Analytics.

|Log type|Table name|
|--------|----------|
|Digestion logs|[AOIDigestion](/azure/azure-monitor/reference/tables/aoidigestion)|
|Storage logs|[AOIStorage](/azure/azure-monitor/reference/tables/aoistorage)|
|Database query logs|[AOIDatabaseQuery](/azure/azure-monitor/reference/tables/aoidatabasequery)|

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
|--------|----------|-----------|
|Digestion logs|Processing (digestion) of data|[AOIDigestion](/azure/azure-monitor/reference/tables/aoidigestion)|
|Storage logs|Operations on the Data Product's storage|[AOIStorage](/azure/azure-monitor/reference/tables/aoistorage)|
|Database query logs|Queries run on the Data Product's database|[AOIDatabaseQuery](/azure/azure-monitor/reference/tables/aoidatabasequery)|

## See Also

- See [Monitoring Azure Operator Insights](monitor-operator-insights.md) for a description of monitoring Azure Azure Operator Insights.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resources) for details on monitoring Azure resources.