---
 title: include file
 description: include file
 services: azure data explorer
 author: ilayr
 ms.service: azure-data-explorer
 ms.topic: include
 ms.date: 01/20/2020
 ms.author: ilayr
 ms.custom: include file
---

The following table describes the maximum limits for Azure Data Explorer clusters.

| Resource | Limit |
| --- | --- |
| Clusters per region per subscription | 20 |
| Instances per cluster | 1000 | 
| Number of databases in a cluster | 10,000 |
| Number of attached database configurations in a cluster | 70 |

The following table describes the limits on management operations performed by Azure Resource Manager on Azure Data Explorer clusters.

| Scope | Operation | Limit |
| --- | --- | --- |
| Cluster | read (e.g. get a cluster) | 500 per 5 minutes |
| Cluster | write (e.g. create a database) | 1000 per hour |

