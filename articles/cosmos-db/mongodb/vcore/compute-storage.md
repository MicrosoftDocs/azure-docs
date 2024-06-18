---
title: Compute and storage
titleSuffix: Supported compute and storage configurations on Azure Cosmos DB for MongoDB vCore
description: Supported compute and storage configurations for Azure Cosmos DB for MongoDB vCore clusters
author: niklarin
ms.author: nlarin
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 06/13/2024
---

# Compute and storage configurations for Azure Cosmos DB for MongoDB vCore clusters

[!INCLUDE[MongoDB vCore](~/reusable-content/ce-skilling/azure/includes/cosmos-db/includes/appliesto-mongodb-vcore.md)]

Compute resources are provided as vCores, which represent the logical CPU of
the underlying hardware. The storage size for provisioning refers to the
capacity available to the shards in your cluster. The storage is used for database files, temporary files, transaction logs, and the
database server logs. You can select the compute and storage settings independently. The selected compute and storage values apply to each shard in the cluster.

## Compute in Azure Cosmos DB for MongoDB vCore

The total amount of RAM in a single shard is based on the
selected number of vCores.

| Cluster tier | vCores        | One shard, GiB RAM |
|--------------|-------------- |--------------------|
| M25          | 2 (burstable) | 8                  |
| M30          | 2             | 8                  |
| M40          | 4             | 16                 |
| M50          | 8             | 32                 |
| M60          | 16            | 64                 |
| M80          | 32            | 128                |

## Storage in Azure Cosmos DB for MongoDB vCore

The total amount of storage you provision also defines the I/O capacity
available to each shard in the cluster.

| Storage size, GiB | Maximum IOPS |
|-------------------|--------------|
| 32                | 3,500†       |
| 64                | 3,500†       |
| 128               | 3,500†       |
| 256               | 3,500†       |
| 512               | 3,500†       |
| 1,024             | 5,000        |
| 2,048             | 7,500        |
| 4,096             | 7,500        |
| 8,192*            | 16,000       |
| 16,384*           | 18,000       |
| 32,768*           | 20,000       |

† Max IOPS with free disk bursting. Storage up to 512 GiB inclusive come with free disk bursting enabled.

\* Available in preview.

## Maximizing IOPS for your compute / storage configuration
Each compute configuration has an IOPS limit that depends on the number of vCores. Make sure you select compute configuration for your cluster to fully utilize IOPS in the selected storage.

| Compute tier  | vCores     | Max storage size    | IOPS with the max recommended storage size, up to |
|---------------|----------------------------------|---------------------------------------------------|
| M30           | 2 vCores   | 0.5 TiB             | 3,500†                                            |
| M40           | 4 vCores   | 1 TiB               | 5,000                                             |
| M50           | 8 vCores   | 4 TiB               | 7,500                                             |
| M60           | 16 vCores  | 32 TiB              | 20,000                                            |
| M80           | 32 vCores  | 32 TiB              | 20,000                                            |

† Max IOPS with free disk bursting. Storage up to 512 GiB inclusive come with free disk bursting enabled.

To put it another way, if you need 8 TiB of storage per shard or more, make sure you select 16 vCores or more for the node's compute configuration. That selection would allow you to maximize IOPS usage provided by the selected storage.

## Next steps

- [See more information about burstable compute](./burstable-tier.md)
- [Learn how to scale Azure Cosmos DB for MongoDB vCore cluster](./how-to-scale-cluster.md)

> [!div class="nextstepaction"]
> [Migration options for Azure Cosmos DB for MongoDB vCore](migration-options.md)
