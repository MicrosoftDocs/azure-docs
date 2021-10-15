---
author: ilayrn
ms.service: data-explorer
ms.topic: include
ms.date: 01/20/2020
ms.author: ilayr
---

The following table describes the maximum limits for Azure Data Explorer clusters.

| Resource | Limit |
| --- | --- |
| Clusters per region per subscription | 20 |
| Instances per cluster | 1000 | 
| Number of databases in a cluster | 10,000 |
| Number of follower clusters (data share consumers) per leader cluster (data share producer) | 100 |

The following table describes the limits on management operations performed on Azure Data Explorer clusters.

| Scope | Operation | Limit |
| --- | --- | --- |
| Cluster | read (for example, get a cluster) | 500 per 5 minutes |
| Cluster | write (for example, create a database) | 1000 per hour |

