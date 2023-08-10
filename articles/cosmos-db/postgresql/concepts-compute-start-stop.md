---
title: Start and stop cluster compute - Azure Cosmos DB for PostgreSQL
description: Learn about how to start and stop compute on the cluster nodes
ms.author: nlarin
author: niklarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: conceptual
ms.date: 3/22/2023
---
# Start and stop compute on cluster nodes

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Azure Cosmos DB for PostgreSQL allows you to stop compute on all nodes in a cluster. Compute billing is paused when cluster is stopped and continues when computer is started again.

> [!NOTE]
> Billing for provisioned storage on all cluster nodes continues when cluster's compute is stopped.

## Managing compute state on cluster nodes

You can stop compute on a cluster for as long as you need.

You can perform management operations such as compute or storage scaling, adding a worker node, or updating networking settings only on clusters with started compute. 

If cluster has [high availability (HA)](./concepts-high-availability.md) enabled, compute start and stop operations would start and stop compute on all primary and standby nodes in the cluster. You can start and stop compute on the primary cluster and any of its [read replicas](./concepts-read-replicas.md) independently.

## Next steps

- Learn how to start and stop [cluster compute in Azure Cosmos DB for PostgreSQL](./how-to-start-stop-cluster.md)
- Learn about [pricing options in Azure Cosmos DB for PostgreSQL](./resources-pricing.md) 

