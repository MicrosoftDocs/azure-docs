---
title: Cross service query between Azure Monitor and Azure Data Explorer
description: Query Azure Data Explorer data through Azure Log Analytics tools vice versa to join and analyze all your data in one place.
author: guywi-ms
ms.author: guywild
ms.topic: conceptual
ms.date: 03/28/2022
ms.reviewer: osalzberg
---

# Cross service query - Azure Monitor and Azure Data Explorer
Create cross service queries between [Azure Data Explorer](/azure/data-explorer/), [Application Insights](../app/app-insights-overview.md), and [Log Analytics](../logs/data-platform-logs.md).
## Azure Monitor and Azure Data Explorer cross-service querying
This experience enables you to [create cross service queries between Azure Data Explorer and Azure Monitor](/azure/data-explorer/query-monitor-data) and to [create cross service queries between Azure Monitor and Azure Data Explorer](./azure-monitor-data-explorer-proxy.md).

For example, (querying Azure Data Explorer from Log Analytics):
```kusto
CustomEvents | where aField == 1
| join (adx("Help/Samples").TableName | where secondField == 3) on $left.Key == $right.key
```
Where the outer query is querying a table in the workspace, and then joining with another table in an Azure Data Explorer cluster (in this case, clustername=help, databasename=samples) by using a new "adx()" function, like how you can do the same to query another workspace from inside query text.

## Query exported Log Analytics data from Azure Blob storage account

Exporting data from Azure Monitor to an Azure storage account enables low-cost retention and the ability to reallocate logs to different regions.

Use Azure Data Explorer to query data that was exported from your Log Analytics workspaces. Once configured, supported tables that are sent from your workspaces to an Azure storage account will be available as a data source for Azure Data Explorer. [Query exported data from Azure Monitor using Azure Data Explorer](../logs/azure-data-explorer-query-storage.md).

[Azure Data Explorer query from storage flow](media\azure-data-explorer-query-storage\exported-data-query.png)

>[!tip] 
> * To export all data from your Log Analytics workspace to an Azure storage account or event hub, use the Log Analytics workspace data export feature of Azure Monitor Logs. [See Log Analytics workspace data export in Azure Monitor](/azure/data-explorer/query-monitor-data).

## Next steps
Learn more about:
* [create cross service queries between Azure Data Explorer and Azure Monitor](/azure/data-explorer/query-monitor-data). Query Azure Monitor data from Azure Data Explorer
* [create cross service queries between Azure Monitor and Azure Data Explorer](./azure-monitor-data-explorer-proxy.md). Query Azure Data Explorer data from Azure Monitor
* [Log Analytics workspace data export in Azure Monitor](/azure/data-explorer/query-monitor-data). Link and query Azure Blob storage account with Log Analytics Exported data.
