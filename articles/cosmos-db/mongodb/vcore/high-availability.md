---
title: High availability 
titleSuffix: Azure Cosmos DB for MongoDB (vCore)
description: Learn about high availability in Azure Cosmos DB for MongoDB vCore.
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: conceptual
author: gahl-levy
ms.author: gahllevy
ms.date: 02/07/2023
---

# High availability in Azure Cosmos DB for MongoDB vCore

High availability (HA) avoids database downtime by maintaining standby replicas of every node in a cluster. If a node goes down, Azure Cosmos DB for MongoDB vCore switches incoming connections from the failed node to its standby replica.

## How it works

When HA is enabled, all primary nodes in a cluster are provisioned in one availability zone for better latency between nodes. The HA replica nodes, which do not receive requests, are provisioned in a different zone, if the region supports multiple zones and has available capacity.

Even without HA enabled, each node has its own locally redundant storage (LRS) with three synchronous replicas maintained by Azure Storage service. If there's a single replica failure, it’s detected by Azure Storage service and is transparently re-created. For LRS storage durability, see metrics on [this page](../../../storage/common/storage-redundancy.md#summary-of-redundancy-options).

When HA is enabled, Azure Cosmos DB for MongoDB vCore runs one replica node for each primary node in the cluster. The primary and its replica use synchronous replication. The services detects failures on primary nodes and fails over to the replica nodes with zero data loss. The MongoDB connection string remains the same. 

## Configure high availability

High availability (HA) can be specified when creating the cluster or in the Scale section in the Azure Portal.

## Next steps

> [!div class="nextstepaction"]
> [TODO: Link to another topic](about:blank)
