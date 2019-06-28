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

| Category | Limits | Comments |
|:---|:---|:---|
| Maximum records returned by a log query | 10,000 | Reduce results using query scope, time range, and filters in the query. |


**Data Collector API**

| Category | Limits | Comments |
|:---|:---|:---|
| Maximum size for a single post | 30 MB | Split larger volumes into multiple posts. |
| Maximum size for field values  | 32 KB | Fields longer than 32 KB are truncated. |

**Search API**

| Category | Limits | Comments |
|:---|:---|:---|
| Maximum records returned for non-aggregated data | 5,000 | |
| Maximum records for aggregated data | 500,000 | Aggregated data is a search that includes the `summarize` command. |
| Maximum size of data returned | 64,000,000 bytes (~61 MiB)| |
| Maximum query running time | 10 minutes | See [Timeouts](https://dev.loganalytics.io/documentation/Using-the-API/Timeouts) for details.  |
| Maximum request rate | 200 requests per 30 seconds per AAD user or client IP address | See [Rate limits](https://dev.loganalytics.io/documentation/Using-the-API/Limits) for details. |

**General workspace limits**

| Category | Limits | Comments |
|:---|:---|:---|
| Maximum columns in a table         | 500 | |
| Maximum characters for column name | 500 | |
| Regions at capacity | West Central US | You cannot currently create a new workspace in this region since it is at temporary capacity limit. This limit is planned to be addressed by end of September, 2019. |
| Data export | Not currently available | Use Azure Function or Logic App to aggregate and export data. | 

>[!NOTE]
>Depending on how long you've been using Log Analytics, you might have access to legacy pricing tiers. Learn more about [Log Analytics legacy pricing tiers](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#legacy-pricing-tiers). 