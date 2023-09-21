---
title: Burstable compute - Azure Cosmos DB for PostgreSQL
description: Definition and workloads of burstable compute.
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: conceptual
ms.date: 01/30/2023
---

# Burstable compute in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Burstable compute on a single node cluster is ideal for workloads like
development environments or small databases that don't need the full
performance of the node's CPU continuously. These workloads typically have
burstable performance requirements.

The Azure burstable compute options allow you to configure a single node with
baseline performance that can build up credits when it's using less than its
baseline. When the node has accumulated credits, the node can burst above the
baseline when your workload requires higher CPU performance. You can use the
**CPU credits remaining** and **CPU credits consumed** metrics to track
accumulated and used credits respectively.

> [!IMPORTANT]
>
> Scaling for burstable compute is available, but only in certain combinations:
>
> * You can change 1 vCore burstable to 2 vCore burstable, and the other way
>   around.
> * You can convert a burstable (1 or 2 vCores) single node configuration to
>   either
>   1. a single node cluster with regular (non-burstable) compute; or
>   2. a multi-node cluster.
>
> You also can't go back from a regular (non-burstable) single node to
> burstable compute.

**Next steps**

* See the [limits and limitations](reference-limits.md#burstable-compute) of
  burstable compute.
* Review available [cluster metrics](concepts-monitoring.md#metrics).
