---
title: Microsoft Sentinel service limits
description: This article provides a list of service limits for Microsoft Sentinel.
author: yelevin
ms.topic: conceptual
ms.date: 04/27/2022
ms.author: yelevin
---

# Service limits for Microsoft Sentinel

This article lists the most common service limits you might encounter as you use Microsoft Sentinel. For other limits that might impact services or features you use, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).

## Analytics rule limits

The following limit applies to analytics rules in Microsoft Sentinel.

|Description |Limit  |Dependency|
|---------|---------|---------|
|Number of rules     | 512 rules       |None|

## Incident limits

The following limits apply to incidents in Microsoft Sentinel.

|Description  |Limit  |Dependency|
|---------|---------|-------|
|Investigation experience availablility     | 90 days from the incident last update time       |None|
|Number of automation rules     | 512  rules      |None|
|Number of actions    | 20  actions    |None|
|Number of characters per comment   | 30K characters  |None|
|Number of comments per incident   | 100  comments  |None|
|Number of conditions    | 50 conditions   |None|

## Machine learning-based limits

The following limits apply to Machine learning-based features in Microsoft Sentinel like customizable anomalies and Fusion.

| Description                                                         | Limit                                           |Dependency|
|---------------------------------------------------------------|-------------------------------------------------|-------|
| Number of anomalies published per anomaly type                | Top 3000 ranked by anomaly score                |None|
| Number of alerts and/or anomalies in a single Fusion incident | 100 alerts and/or anomalies |None|

## Notebook limits

The following limits apply to notebooks in Microsoft Sentinel. The limits are related to the dependencies on other services used by notebooks.

|Description|Limit |Dependency|
|-------|-------|-------|
| Total count of these assets per machine learning workspace: datasets, runs, models, and artifacts |10 million assets |Azure Machine Learning|
| Default limit for total compute clusters per region. Limit is shared between a training cluster and a compute instance. A compute instance is considered a single-node cluster for quota purposes. | 200 compute clusters per region|Azure Machine Learning|
|Storage accounts per region per subscription|250 storage accounts|Azure Storage|
|Maximum size of a file share by default|5TB|Azure Storage|
|Maximum size of a file share with large file share feature enabled|100TB|Azure Storage|
|Maximum throughput (ingress + egress) for a single file share by default|60 MB/sec|Azure Storage|
|Maximum throughput (ingress + egress) for a single file share  with large file share feature enabled|300 MB/sec|Azure Storage|

## Threat intelligence limits

The following limit applies to threat intelligence in Microsoft Sentinel. The limit is related to the dependency on an API used by threat intelligence.

|Description                   | Limit        |Dependency|
-------------------------|--------------------|--------------------|
| Indicators per call that use Graph security API | 100 indicators |Microsoft Graph security API|

## Watchlist limits

The following limits apply to watchlists in Microsoft Sentinel. The limits are related to the dependencies on other services used by watchlists.

|Description                   | Limit        |Dependency|
|--|-------------------------|--------------------|
|Upload size for local file| 3.8 MB per file |Azure Resource Manager
|Line entry in the CSV file |10,240 characters per line|Azure Resource Manager|
|Upload size for files in Azure Storage |500 MB per file|Azure Storage|
|Total number of active watchlist items per workspace. When the max count is reached, delete some existing items to add a new watchlist.|10 million active watchlist items|Log Analytics|
|Refresh of the status for a large watchlist in seconds. Customers won't see the latest progress of an upload until the next refresh.|15 seconds|Azure Cosmos DB|
|Number of large watchlist uploads per workspace at a time|One large watchlist|Azure Cosmos DB|
|Number of large watchlist deletions per workspace at a time|One large watchlist|Azure Cosmos DB|

## User and Entity Behavior Analytics (UEBA) limits

The following limit applies to UEBA in Microsoft Sentinel. The limit for UEBA in Microsoft Sentinel is related to dependencies on another service.

|Description   |Limit |Dependency|
|---------|---------|---------|
|Lowest retention configuration in days for the identity information table. All data stored on Identity information table in Log Analytics is refreshed every 14 days. | 14 days  |Log Analytics|

## Next steps

[Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).