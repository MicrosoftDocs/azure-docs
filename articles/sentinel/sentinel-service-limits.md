---
title: Microsoft Sentinel service limits
description: This article provides a list of service limits for Microsoft Sentinel.
author: yelevin
ms.topic: concepts
ms.date: 04/12/2022
ms.author: yelevin
---

# Service limits for Microsoft Sentinel

To do: intro that leads with a sentence in the form, "X is a (type of) Y that does Z".
Answer question: why would I want to learn this knowledge?

## Analytics


|Name  |Limit  |
|---------|---------|
|Number of rules     | 512 rules       |

## Data collection



## Incident IR

|Name  |Limit  |
|---------|---------|
|Investigation     | The investigation experience is available for 90 days from the incident last update time       |
|Number of automation rules     | 512        |
|Number of actions    | 20      |
|Number of characters per comment   | 30K   |
|Number of comments per incident   | 100    |
|Number of conditions    | 50    |



## Machine learning

| Name                                                          | Limit                                           | Dependency |
|---------------------------------------------------------------|-------------------------------------------------|------------|
| Number of anomalies published per anomaly type                | Top 3000 ranked by anomaly score                | None       |
| Number of alerts and/or anomalies in a single Fusion incident | 100 alerts and/or anomalies per Fusion incident | None       |

## Notebooks

|Limit | Dependency|
|-------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Total count of these assets per Azure ML workspace is limited to 10 million: datasets, runs, models, and artifacts |Azure Machine Learning  |
| Total compute clusters per region have a default limit of 200. These are shared between a training cluster and a compute instance. (A compute instance is considered a single-node cluster for quota purposes.) | Azure Machine Learning |
|Azure Storage has a limit of 250 storage accounts per region per subscription|Azure Storage|
|Maximum size of a file share is 5TB by default, and 100TB with large file share feature enabled|Azure Storage|
|Maximum throughput (ingress + egress) for a single file share is 60 MB/sec by default, and 300MB/sec with large file share feature enabled|Azure Storage|

## Threat hunting

## Threat intelligence

|Limit                   | Dependency         |
-------------------------|--------------------|
| 100 indicators per call that use Graph Security API | Graph Security API |

## Watchlists

| Limit                   | Dependency         |
|-------------------------|--------------------|
|Upload for local file is limited to 3.8Mb per file| Azure Resource Manager |
|A line entry in the CSV file must not exceed 10,240 characters per line|Azure Resource Manager|
|Upload for files in Azure Storage is limited to 500 MB per file|Azure Storage|
|Total number of active watchlist items per workspace is limited to 10 million. When the max count is reached, customers cannot add a new watchlist, until they delete some existing items.|Log Analytics|
|Status of a large watchlist upload is only refreshed every 15 seconds, so customers may not see the latest progress of an upload until the next refresh.|Azure Cosmos DB|
|Can upload one large watchlist per workspace at a given time|Azure Cosmos DB|
|Can delete one large watchlist per workspace at a given time|Azure Cosmos DB|

## UEBA


|Limit    |Dependency  |
|---------|---------|
|All data stored on Identity information table in Log Analytics is refreshed every 14 days. So you can’t configure retention for the identity information table which is lower than 14 days.  | Log Analytics        |

## Next steps

[Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md)