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

Azure Operator Insights uses the tables listed in [Azure Monitor Logs tables](#azure-monitor-logs-tables) to store resource log information. It doesn't store resource log information in the Azure Diagnostics table.

## Activity log

The following table lists the operations that Azure Operator Insights might record in the Activity log. This table is a subset of the possible entries you might find in the activity log.

| Namespace | Description |
|:---|:---|
|`Microsoft.NetworkAnalytics`|Logs relating to creating, modifying and deleting Data Product resources|
|`Microsoft.OperationalInsights/workspaces/query/AOI*`|Logs relating to querying Azure Operator Insights data in Azure Monitor|

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

- See [Monitoring Azure Operator Insights](monitor-operator-insights.md) for a description of monitoring Azure Operator Insights.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.