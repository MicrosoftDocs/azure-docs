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

Current pricing tiers (introduced April 2018)

| Tier | Limit per day | Data retention | Comment |
|:---|:---|:---|:---|
| Per GB 2018 | No limit | 30 - 730 days | Data retention beyond 31 days is available for additional charges. Learn more about Azure Monitor pricing. |


Legacy tiers (introduced April 2016) 

| | | | |
|:---|:---|:---|:---|
| Free | 500 MB | 7 days | When your workspace reaches the 500-MB daily data transfer limit, data analysis stops and resumes at the start of the next day. A day is based on UTC. |
| Standalone (Per GB)<br>Per Node (OMS) | No limit | 30 to 730 days | Data retention beyond 31 days is available for additional charges. Learn more about Azure Monitor pricing. |

Legacy original pricing tiers 

| | | | |
|:---|:---|:---|:---|
| Standard| No limit | 30 days  | Retention can't be adjusted |
| Premium | No limit | 365 days  | Retention can't be adjusted |

**Number of workspaces per subscription.**

| Pricing tier    | Workspace limit | Comments
|:---|:---|:---|
| Free tier  | 10 | This limit can't be increased. |
| All other tiers | N/A | You're limited by the number of resources within a resource group and the number of resource groups per subscription. | 

**Region capacity**

| Region | Explanation |
|:---|:---|
| West Central US | You cannot currently create a new workspace in this region since it is at temporary capacity limit. This limit is planned to be addressed by end of September, 2019. |

**Azure portal**

| Category | Limits | Comments |
|:---|:---|:---|
| Maximum records returned by a log query | 10,000 | Reduce results using query scope, time range, and filters in the query. |

**Log Analytics APIs**

| Category | Limits | Comments |
|:---|:---|:---|
| Data Collector API | Maximum size for a single post is 30 MB.<br>Maximum size for field values is 32 KB. | Split larger volumes into multiple posts.<br>Fields longer than 32 KB are truncated. |
| Search API | 5,000 records returned for non-aggregated data.<br>500,000 records for aggregated data.<br>64,000,000 bytes (~61 MiB)<br>Query cannot run longer than 10 minutes. | Aggregated data is a search that includes the `summarize` command.<br>See [Timeouts](https://dev.loganalytics.io/documentation/Using-the-API/Timeouts) for details on query timeouts.  |


>[!NOTE]
>Depending on how long you've been using Log Analytics, you might have access to legacy pricing tiers. Learn more about [Log Analytics legacy pricing tiers](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#legacy-pricing-tiers). 