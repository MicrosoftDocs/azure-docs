---
title: Check the health of an Azure Data Explorer cluster
description: This article describes steps to determine if your Azure Data Explorer cluster is healthy.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
services: data-explorer
ms.topic: conceptual
ms.date: 09/24/2018
---

# Check the health of an Azure Data Explorer cluster

There are several factors that impact the health of an Azure Data Explorer cluster, including CPU, memory, and the disk subsystem. This article shows some basic steps you can take to gauge the health of a cluster.

1.  

1. Using Kusto Query Explorer connect to your Kusto cluster and run the
    diagnostics command on the cluster as shown below. A return value of 1 (or
    yes) for *IsHealthy* column suggests the cluster is healthy

.show diagnostics*

>>  *\| project IsHealthy*

|   | IsHealthy |
|---|-----------|
|   | 1         |

>   Output:

>   1 = Healthy

>   0 = Unhealthy

2.  Navigate to your cluster in the [Azure portal](https://ms.portal.azure.com)
    and under the **Monitoring** section select *Metrics* and select Keep Alive
    as shown below. A value of 1 suggests healthy state

    *Further you can also add additional metrics like CPU, Memory Caching etc. to view individual resource utilization for the cluster*

>   Please see following reference clipping

![](media/check-cluster-health/portal-metrics.png)


3. In case you need further assistance with your cluster's health, please open a [support request ](<https://ms.portal.azure.com/#>) 