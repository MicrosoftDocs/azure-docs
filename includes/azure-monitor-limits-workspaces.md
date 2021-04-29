---
title: "include file" 
description: "include file" 
services: azure-monitor
author: rboucher
tags: azure-service-management
ms.topic: "include"
ms.date: 02/07/2019
ms.author: robb
ms.custom: "include file"
---


**Data collection volume and retention** 

| Tier | Limit per day | Data retention | Comment |
|:---|:---|:---|:---|
| Current Per GB pricing tier<br>(introduced April 2018) | No limit | 30 - 730 days | Data retention beyond 31 days is available for additional charges. Learn more about Azure Monitor pricing. |
| Legacy Free tiers<br>(introduced April 2016) | 500 MB | 7 days | When your workspace reaches the 500 MB per day limit, data ingestion stops and resumes at the start of the next day. A day is based on UTC. Note that data collected by Azure Security Center is not included in this 500 MB per day limit and will continue to be collected above this limit.  |
| Legacy Standalone Per GB tier<br>(introduced April 2016) | No limit | 30 to 730 days | Data retention beyond 31 days is available for additional charges. Learn more about Azure Monitor pricing. |
| Legacy Per Node (OMS)<br>(introduced April 2016) | No limit | 30 to 730 days | Data retention beyond 31 days is available for additional charges. Learn more about Azure Monitor pricing. |
| Legacy Standard tier | No limit | 30 days  | Retention can't be adjusted |
| Legacy Premium tier | No limit | 365 days  | Retention can't be adjusted |

**Number of workspaces per subscription.**

| Pricing tier    | Workspace limit | Comments
|:---|:---|:---|
| Free tier  | 10 | This limit can't be increased. |
| All other tiers | No limit | You're limited by the number of resources within a resource group and the number of resource groups per subscription. |

**Azure portal**

| Category | Limit | Comments |
|:---|:---|:---|
| Maximum records returned by a log query | 10,000 | Reduce results using query scope, time range, and filters in the query. |


**Data Collector API**

| Category | Limit | Comments |
|:---|:---|:---|
| Maximum size for a single post | 30 MB | Split larger volumes into multiple posts. |
| Maximum size for field values  | 32 KB | Fields longer than 32 KB are truncated. |

**Search API**

| Category | Limit | Comments |
|:---|:---|:---|
| Maximum records returned in a single query | 500,000 | |
| Maximum size of data returned | 64,000,000 bytes (~61 MiB)| |
| Maximum query running time | 10 minutes | See [Timeouts](https://dev.loganalytics.io/documentation/Using-the-API/Timeouts) for details.  |
| Maximum request rate | 200 requests per 30 seconds per Azure AD user or client IP address | See [Rate limits](https://dev.loganalytics.io/documentation/Using-the-API/Limits) for details. |

**Azure Monitor Logs connector**

| Category | Limit | Comments |
|:---|:---|:---|
| Max number of records | 500,000 | |
| Max query timeout | 110 second | |
| Charts | | Visualization in Logs page and the connector are using different charting libraries and some functionality isn't available in the connector currently. |

**General workspace limits**

| Category | Limit | Comments |
|:---|:---|:---|
| Maximum columns in a table         | 500 | |
| Maximum characters for column name | 500 | |

**<a name="data-ingestion-volume-rate">Data ingestion volume rate</a>**

Azure Monitor is a high scale data service that serves thousands of customers sending terabytes of data each month at a growing pace. The volume rate limit intends to isolate Azure Monitor customers from sudden ingestion spikes in multitenancy environment. A default ingestion volume rate threshold of 500 MB (compressed) is defined in workspaces, this is translated to approximately **6 GB/min** uncompressed -- the actual size can vary between data types depending on the log length and its compression ratio. The volume rate limit applies to data ingested from Azure resources via [Diagnostic settings](../articles/azure-monitor/essentials/diagnostic-settings.md). When volume rate limit is reached, a retry mechanism attempts to ingest the data 4 times in a period of 30 minutes and drop it if operation fails. It doesn't apply to data ingested from [agents](../articles/azure-monitor/agents/agents-overview.md) or [Data Collector API](../articles/azure-monitor/logs/data-collector-api.md).

When data sent to your workspace is at a volume rate higher than 80% of the threshold configured in your workspace, an event is sent to the *Operation* table in your workspace every 6 hours while the threshold continues to be exceeded. When ingested volume rate is higher than threshold, some data is dropped and an event is sent to the *Operation* table in your workspace every 6 hours while the threshold continues to be exceeded. If your ingestion volume rate continues to exceed the threshold or you are expecting to reach it sometime soon, you can request to increase it in by opening a support request. 

See [Monitor health of Log Analytics workspace in Azure Monitor](../articles/azure-monitor/logs/monitor-workspace.md) to create alert rules to be proactively notified when you reach any ingestion limits.

>[!NOTE]
>Depending on how long you've been using Log Analytics, you might have access to legacy pricing tiers. Learn more about [Log Analytics legacy pricing tiers](../articles/azure-monitor/logs/manage-cost-storage.md#legacy-pricing-tiers).