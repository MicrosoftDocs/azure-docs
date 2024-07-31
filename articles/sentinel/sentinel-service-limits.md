---
title: Microsoft Sentinel service limits
description: This article provides a list of service limits for Microsoft Sentinel.
author: yelevin
ms.topic: conceptual
ms.date: 05/21/2024
ms.author: yelevin
ms.service: microsoft-sentinel
---

# Service limits for Microsoft Sentinel

This article lists the most common service limits you might encounter as you use Microsoft Sentinel. For other limits that might impact services or features you use, like Azure Monitor, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).

## Analytics rule limits

The following limit applies to analytics rules in Microsoft Sentinel.

| Description | Limit  | Dependency |
| --------- | --------- | --------- |
| Number of *enabled* rules     | 512 rules       | None |
| Number of near-real-time (NRT) rules | 50 NRT rules | None |
| [Entity mappings](map-data-fields-to-entities.md) | 10 mappings per rule | None |
| [Entities](map-data-fields-to-entities.md) identified per alert<br>(Divided equally among the mapped entities) | 500 entities per alert | None |
| [Entities](map-data-fields-to-entities.md) cumulative size limit | 64 KB | None |
| [Custom details](surface-custom-details-in-alerts.md) | 20 details per rule<br>50 values per detail<br>2 KB cumulative size | None |
| [Alert details](customize-alert-details.md) | 50 values per overridden field<br>5 KB per field for `Description` and collections<br>256 bytes per field for `AlertName` and non-collections | None |
| Alerts per rule<br>Applicable when *Event grouping* is set to *Trigger an alert for each event* | 150 alerts | None |
| Alerts per rule for NRT rules | 30 alerts | None |

## Hunts limits

The following limits apply to Hunts in Microsoft Sentinel.

| Description | Limit | Dependency |
| --------- | --------- | ------- |
|Number of Hunts | 100 | None |

## Incident limits

The following limits apply to incidents in Microsoft Sentinel.

| Description | Limit | Dependency |
| --------- | --------- | ------- |
| Investigation experience availability | 90 days from the incident last update time | None |
| Number of alerts | 150 alerts  | None |
| Number of automation rules     | 512 rules | None |
| Number of automation rule actions  | 20 actions  | None |
| Number of automation rule conditions  | 50 conditions | None |
| Number of bookmarks  | 20 bookmarks  | None |
| Number of characters for automation rule name  | 500 characters  | None |
| Number of characters for description  | 5,000 characters | None |
| Number of characters per comment   | 30,000 characters  | None |
| Number of comments per incident   | 100 comments  | None |
| Number of tasks  | 40 tasks | None |
| Number of incidents returned by API to *list* request | 1,000 incidents maximum | None |
| Number of incidents per day (per workspace) | See explanation after table | Database capacity |

**Number of incidents per day:** There isn't a formal, hard limit on the number of incidents that can be created per day. A workspace's actual capacity for incidents depends on the storage capacity of the incident database, so the size of the incidents is as much a factor as their number.

However, a SOC that experiences the creation of more than *around* 3,000 new incidents per day will most likely find itself unable to keep up, and the database capacity will quickly be reached. In this situation, the SOC needs to find and fix any rules that create large numbers of incidents, to get the count of daily new incidents to manageable levels.

## Machine learning-based limits

The following limits apply to machine learning-based features in Microsoft Sentinel like customizable anomalies and Fusion.

| Description                                                         | Limit                                           |Dependency|
|---------------------------------------------------------------|-------------------------------------------------|-------|
| Number of anomalies published per anomaly type                | Top 3000 ranked by anomaly score                |None|
| Number of alerts and/or anomalies in a single Fusion incident | 100 alerts and/or anomalies |None|


## Multi workspace limits

The following limit applies to multiple workspaces in Microsoft Sentinel. Limits here are applied when working with Sentinel features across more than workspace at a time.

|Description                   | Limit        |Dependency|
-------------------------|--------------------|--------------------|
| Incident view | 100 concurrently displayed workspaces | |
| Log query | 100 Sentinel workspaces | [Log Analytics](../azure-monitor/logs/cross-workspace-query.md#limitations) |
| Analytics rules | 20 Sentinel workspaces per query | |

## Notebook limits

The following limits apply to notebooks in Microsoft Sentinel. The limits are related to the dependencies on other services used by notebooks.

|Description|Limit |Dependency|
|-------|-------|-------|
| Total count of these assets per machine learning workspace: datasets, runs, models, and artifacts |10 million assets |Azure Machine Learning|
| Default limit for total compute clusters per region. Limit is shared between a training cluster and a compute instance. A compute instance is considered a single-node cluster for quota purposes. | 200 compute clusters per region|Azure Machine Learning|
|Storage accounts per region per subscription|250 storage accounts|Azure Storage|
|Maximum size of a file share by default|5 TB|Azure Storage|
|Maximum size of a file share with large file share feature enabled|100 TB|Azure Storage|
|Maximum throughput (ingress + egress) for a single file share by default|60 MB/sec|Azure Storage|
|Maximum throughput (ingress + egress) for a single file share  with large file share feature enabled|300 MB/sec|Azure Storage|

## Repositories limits

The following limits apply to repositories in Microsoft Sentinel.

|Description |Limit  |Dependency|
|---------|---------|---------|
|Number of repositories | 5 | Sentinel Workspace|
|Deployment history | 800 | Azure Resource Group |

## Threat intelligence limits

The following limit applies to threat intelligence in Microsoft Sentinel. The limit is related to the dependency on an API used by threat intelligence.

|Description                   | Limit        |Dependency|
-------------------------|--------------------|--------------------|
| Indicators per call that use Graph security API | 100 indicators |Microsoft Graph security API|
| CSV indicator file import size | 50MB | none|
| JSON indicator file import size | 250MB | none|

## TI upload indicators API limits

The following limit applies to the threat intelligence upload indicators API in Microsoft Sentinel.

|Description                   | Limit        |Dependency|
-------------------------|--------------------|--------------------|
| Indicators per request | 100 indicators | |
| Requests per minute | 100 | |

## User and Entity Behavior Analytics (UEBA) limits

The following limit applies to UEBA in Microsoft Sentinel. The limit for UEBA in Microsoft Sentinel is related to dependencies on another service.

|Description   |Limit |Dependency|
|---------|---------|---------|
|Lowest retention configuration in days for the [IdentityInfo](/azure/azure-monitor/reference/tables/identityinfo) table. All data stored on the IdentityInfo table in Log Analytics is refreshed every 14 days. | 14 days  |Log Analytics|

## Watchlist limits

The following limits apply to watchlists in Microsoft Sentinel. The limits are related to the dependencies on other services used by watchlists.

|Description                   | Limit        |Dependency|
|--|-------------------------|--------------------|
|Upload size for local file| 3.8 MB per file |Azure Resource Manager
|Line entry in the CSV file |10,240 characters per line|Azure Resource Manager|
|Total size of a single row | 10 Kb | Log Analytics|
|Upload size for files in Azure Storage |500 MB per file|Azure Storage|
|Total number of active watchlist items per workspace. When the max count is reached, delete some existing items to add a new watchlist.|10 million active watchlist items|Log Analytics|
|Total rate of change of all watchlist items per workspace|1% rate of change per month|Log Analytics|
|Number of large watchlist uploads per workspace at a time|One large watchlist|Azure Cosmos DB|
|Number of large watchlist deletions per workspace at a time|One large watchlist|Azure Cosmos DB|

## Workbook limits

Workbook limits for Sentinel are the same result limits found in Azure Monitor. For more information, see [Workbooks result limits](../azure-monitor/visualize/workbooks-limits.md).

## Workspace manager limits

The following limits apply to workspace manager in Microsoft Sentinel.

|Description                   | Limit        |Dependency|
|--|-------------------------|--------------------|
|Number of published operations in a group<br>*Published operations* = (*member workspaces*) * (*content items*)| 2000 published operations |None|

## Next steps

- [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md)
- [Azure Monitor service limits](../azure-monitor/service-limits.md)
