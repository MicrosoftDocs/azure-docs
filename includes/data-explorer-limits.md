---
author: ilayrn
ms.service: azure-data-explorer
ms.topic: include
ms.date: 11/25/2026
ms.author: ilayr
---

The following table describes the maximum limits for Azure Data Explorer clusters.

| Resource | Limit |
| --- | --- |
| Clusters per region per subscription | 20 |
| Instances per cluster | 1,000 | 
| Number of databases in a cluster | 10,000 |
| Number of follower clusters (data share consumers) per leader cluster (data share producer) | 100 |
| Recommended maximum extents per cluster | 10,000,000 |

> [!NOTE]
> You can request higher limits for *Number of databases in a cluster* and *Clusters per region per subscription*. To request an increase, contact [Azure Support](https://azure.microsoft.com/support/legal/faq/).

The following table describes the minimum throttling thresholds for management operations performed on Azure Data Explorer clusters and subscriptions. Actual thresholds can be higher. Customers can't request an increase to these limits.

| Scope | Operation | Limit |
| --- | --- | --- |
| Cluster | read (for example, get a cluster) | 600 per 5 minutes |
| Cluster | write (for example, create a database) | 40 per 5 minutes |
| Subscription | read (for example, list clusters) | 10,000 per 5 minutes |
| Subscription | write (for example, create a cluster) | 100 per 5 minutes |

