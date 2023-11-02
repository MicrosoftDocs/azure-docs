---
title: Compute and storage – Azure Cosmos DB for PostgreSQL
description: Options for a cluster, including node compute and storage
ms.author: nlarin
author: niklarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 09/18/2023
---

# Azure Cosmos DB for PostgreSQL compute and storage

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

> [!IMPORTANT]
> 32 TiB storage in Azure Cosmos DB for PostgreSQL is currently in preview.
> This preview is provided without a service level agreement, and it's not recommended
> for production workloads. Certain features might not be supported or might have constrained 
> capabilities.

Compute resources are provided as vCores, which represent the logical CPU of
the underlying hardware. The storage size for provisioning refers to the
capacity available to the coordinator and worker nodes in your cluster. The
storage includes database files, temporary files, transaction logs, and the
Postgres server logs.

## Multi-node cluster
 
You can select the compute and storage settings independently for worker nodes
and the coordinator node in a multi-node cluster.
 
| Resource              | Worker node                        | Coordinator node                               |
|-----------------------|------------------------------------|------------------------------------------------|
| Compute, vCores       | 4, 8, 16, 32, 64, 96, 104          | 4, 8, 16, 32, 64, 96                           |
| Memory per vCore, GiB | 8                                  | 4                                              |
| Storage size, TiB     | 0.5, 1, 2, 4, 8, 16, 32 (preview)  | 0.128, 0.25, 0.5, 1, 2, 4, 8, 16, 32 (preview) |
| Storage type          | General purpose (SSD)              | General purpose (SSD)                          |

The total amount of RAM in a single node is based on the
selected number of vCores.

| vCores | One worker node, GiB RAM | Coordinator node, GiB RAM |
|--------|--------------------------|---------------------------|
| 4      | 32                       | 16                        |
| 8      | 64                       | 32                        |
| 16     | 128                      | 64                        |
| 32     | 256                      | 128                       |
| 64     | 512                      | 256                       |
| 96     | 672                      | 384                       |
| 104    | 672                      | n/a                       |

The total amount of storage you provision also defines the I/O capacity
available to each worker and coordinator node.

| Storage size, TiB | Maximum IOPS |
|-------------------|--------------|
| 0.5               | 2,300        |
| 1                 | 5,000        |
| 2                 | 7,500        |
| 4                 | 7,500        |
| 8                 | 16,000       |
| 16                | 18,000       |
| 32 (preview)      | 20,000       |

For the entire cluster, the aggregated IOPS work out to the
following values:

| Worker nodes | 0.5 TiB, total IOPS | 1 TiB, total IOPS | 2 or 4 TiB, total IOPS | 8 TiB, total IOPS | 16 TiB, total IOPS | 32 TiB, total IOPS |
|--------------|---------------------|-------------------|------------------------|-------------------|--------------------|--------------------|
| 2            | 4,600               | 10,000            | 15,000                 | 32,000            | 36,000             | 40,000             |
| 3            | 6,900               | 15,000            | 22,500                 | 48,000            | 54,000             | 60,000             |
| 4            | 9,200               | 20,000            | 30,000                 | 64,000            | 72,000             | 80,000             |
| 5            | 11,500              | 25,000            | 37,500                 | 80,000            | 90,000             | 100,000            |
| 6            | 13,800              | 30,000            | 45,000                 | 96,000            | 108,000            | 120,000            |
| 7            | 16,100              | 35,000            | 52,500                 | 112,000           | 126,000            | 140,000            |
| 8            | 18,400              | 40,000            | 60,000                 | 128,000           | 144,000            | 160,000            |
| 9            | 20,700              | 45,000            | 67,500                 | 144,000           | 162,000            | 180,000            |
| 10           | 23,000              | 50,000            | 75,000                 | 160,000           | 180,000            | 200,000            |
| 11           | 25,300              | 55,000            | 82,500                 | 176,000           | 198,000            | 220,000            |
| 12           | 27,600              | 60,000            | 90,000                 | 192,000           | 216,000            | 240,000            |
| 13           | 29,900              | 65,000            | 97,500                 | 208,000           | 234,000            | 260,000            |
| 14           | 32,200              | 70,000            | 105,000                | 224,000           | 252,000            | 280,000            |
| 15           | 34,500              | 75,000            | 112,500                | 240,000           | 270,000            | 300,000            |
| 16           | 36,800              | 80,000            | 120,000                | 256,000           | 288,000            | 320,000            |
| 17           | 39,100              | 85,000            | 127,500                | 272,000           | 306,000            | 340,000            |
| 18           | 41,400              | 90,000            | 135,000                | 288,000           | 324,000            | 360,000            |
| 19           | 43,700              | 95,000            | 142,500                | 304,000           | 342,000            | 380,000            |
| 20           | 46,000              | 100,000           | 150,000                | 320,000           | 360,000            | 400,000            |

## Single node cluster

Single-node cluster resource options differ between [burstable
compute](concepts-burstable-compute.md) and regular compute.

**Burstable compute**

| Resource | Resource value |
|----------|----------------|
| Burstable compute, vCores | 1, 2 |
| Burstable compute memory per vCore, GiB | 2 |
| Storage size, GiB (IOPS, up to) | 32 (120), 64 (240), 128 (500) |
| Storage type | General purpose (SSD) |

**Regular compute**

| Resource | Resource value |
|----------|----------------|
| Compute, vCores | 2, 4, 8, 16, 32, 64 |
| Compute memory per vCore, GiB | 4 |
| Storage size, GiB (IOPS, up to) | 128 (500), 256 (1,100), 512 (2,300), 1024† (5,000), 2048† (7,500) |
| Storage type | General purpose (SSD) |

† 1024 GiB and 2048 GiB are supported with 8 vCores or greater.

## Maximum IOPS for your compute / storage configuration
Each compute configuration has an IOPS limit that depends on the number of vCores in a node. Make sure you select compute configuration for the coordinator and worker nodes in your cluster to fully utilize IOPS in the selected storage.

**Worker nodes, per node**

| Compute    | Storage size to maximize IOPS usage, up to | IOPS with the max recommended storage size, up to |
|------------|--------------------------------------------|---------------------------------------------------|
| 4 vCores   | 1 TiB                                      | 5,000                                             |
| 8 vCores   | 4 TiB                                      | 7,500                                             |
| 16 vCores  | 32 TiB                                     | 20,000                                            |
| 32 vCores  | 32 TiB                                     | 20,000                                            |
| 64 vCores  | 32 TiB                                     | 20,000                                            |
| 96 vCores  | 32 TiB                                     | 20,000                                            |
| 104 vCores | 32 TiB                                     | 20,000                                            |

**Coordinator and single node with regular compute**

| Compute    | Storage size to maximize IOPS usage, up to | IOPS with the max recommended storage size, up to |
|------------|--------------------------------------------|---------------------------------------------------|
| 2 vCores   | 0.5 TiB                                    | 2,300                                             |
| 4 vCores   | 1 TiB                                      | 5,000                                             |
| 8 vCores   | 4 TiB                                      | 7,500                                             |
| 16 vCores  | 32 TiB                                     | 20,000                                            |
| 32 vCores  | 32 TiB                                     | 20,000                                            |
| 64 vCores  | 32 TiB                                     | 20,000                                            |
| 96 vCores  | 32 TiB                                     | 20,000                                            |

To put it another way, if you need 8 TiB of storage per node or more, make sure you select 16 vCores or more for the node's compute configuration. That would allow you to maximize IOPS usage provided by the selected storage.

## Next steps

* Learn how to [create a cluster in the portal](quickstart-create-portal.md)
* Change [compute quotas](howto-compute-quota.md) for a subscription and region
