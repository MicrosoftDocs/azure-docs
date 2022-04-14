---
title: Microsoft Sentinel service limits
description: This article provides a list of service limits for Microsoft Sentinel.
author: yelevin
ms.topic: conceptual
ms.date: 04/12/2022
ms.author: yelevin
---

# Service limits for Microsoft Sentinel

This article lists the service limits for several features in Microsoft Sentinel.

## Analytics rule limits

The following limit applies to Analytics rules in Microsoft Sentinel.

|Description |Limit  |
|---------|---------|
|Number of rules     | 512 rules       |

## Incident limits

The following limits apply to incidents in Microsoft Sentinel.

|Description  |Limit  |
|---------|---------|
|Investigation     | The investigation experience is available for 90 days from the incident last update time       |
|Number of automation rules     | 512        |
|Number of actions    | 20      |
|Number of characters per comment   | 30K   |
|Number of comments per incident   | 100    |
|Number of conditions    | 50    |

## Machine learning-based limits

The following limits apply to Machine learning-based features in Microsoft Sentinel like customizable anomalies and Fusion.

| Description                                                         | Limit                                           | 
|---------------------------------------------------------------|-------------------------------------------------|
| Number of anomalies published per anomaly type                | Top 3000 ranked by anomaly score                |
| Number of alerts and/or anomalies in a single Fusion incident | 100  |

## Notebook limits

The following limits apply to notebooks in Microsoft Sentinel. The limits are related to the limits for Azure Machine Learning and Azure Storage.

### Machine learning-based feature dependencies
|Description|Limit |
|-------|-------|
| Total count of these assets per machine learning workspace: datasets, runs, models, and artifacts |10 million assets |
| Default limit for total compute clusters per region. Limit is shared between a training cluster and a compute instance. A compute instance is considered a single-node cluster for quota purposes. | 200 compute clusters per region|

### Azure Storage dependencies

|Description|Limit|
|---|---|
|Storage accounts per region per subscription|250 storage accounts|
|Maximum size of a file share by default|5TB|
|Maximum size of a file share with large file share feature enabled|100TB|
|Maximum throughput (ingress + egress) for a single file share by default|60 MB/sec|
|Maximum throughput (ingress + egress) for a single file share  with large file share feature enabled|300 MB/sec|

## Threat intelligence limits

The following limit applies to threat intelligence in Microsoft Sentinel. The limit for threat intelligence in Microsoft Sentinel is related to Microsoft Graph security API.

|Description                   | Limit        |
-------------------------|--------------------|
| Indicators per call that use Graph security API | 100 indicators |

## Watchlist limits

The following limit applies to watchlists in Microsoft Sentinel.
Limits for watchlists in Microsoft Sentinel are related to the limits for Azure Resource Manager, Azure Storage, Log Analytics, and Azure Cosmos DB.

### Azure Resource Manager dependencies
| Description                   | Limit        |
|-------------------------|--------------------|
|Upload size for local file| 3.8 MB per file |
|Line entry in the CSV file |10,240 characters per line|

### Azure Storage dependencies
| Description                   | Limit        |
|-------------------------|--------------------|
|Upload size for files in Azure Storage |500 MB per file|

### Log Analytics dependencies

| Description                   | Limit        |
|-------------------------|--------------------|
|Total number of active watchlist items per workspace. When the max count is reached, delete some existing items to add a new watchlist.|10 million active watchlist items|

### Azure Cosmos DB dependencies

| Description                   | Limit        |
|-------------------------|--------------------|
|Refresh of the status for a large watchlist in seconds. Customers won't see the latest progress of an upload until the next refresh.|15 seconds|
|Number of large watchlist uploads per workspace at a time|One large watchlist|
|Number of large watchlist deletions per workspace at a time|One large watchlist|

## User and Entity Behavior Analytics (UEBA) limits

The following limit applies to UEBA in Microsoft Sentinel.Limits for UEBA in Microsoft Sentinel are related to the limits for Log Analytics.

|Description   |Limit |
|---------|---------|
|Lowest retention configuration in days for the identity information table. All data stored on Identity information table in Log Analytics is refreshed every 14 days. | 14 days  |

## Next steps

[Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md)