---
title: Compute and storage – Azure Cosmos DB for PostgreSQL
description: Options for a cluster, including node compute and storage
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 07/08/2022
---

# Azure Cosmos DB for PostgreSQL compute and storage

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]
 
You can select the compute and storage settings independently for
worker nodes and the coordinator node in a cluster.
Compute resources are provided as vCores, which represent
the logical CPU of the underlying hardware. The storage size for
provisioning refers to the capacity available to the coordinator
and worker nodes in your cluster. The storage
includes  database files, temporary files, transaction logs, and
the Postgres server logs.
 
| Resource              | Worker node                    | Coordinator node         |
|-----------------------|--------------------------------|--------------------------|
| Compute, vCores       | 4, 8, 16, 32, 64, 96, 104      | 4, 8, 16, 32, 64, 96     |
| Memory per vCore, GiB | 8                              | 4                        |
| Storage size, TiB     | 0.5, 1, 2                      | 0.5, 1, 2                |
| Storage type          | General purpose (SSD)          | General purpose (SSD)    |
| IOPS                  | Up to 3 IOPS/GiB               | Up to 3 IOPS/GiB         |

The total amount of RAM in a single node is based on the
selected number of vCores.

| vCores | One worker node, GiB RAM | Coordinator node, GiB RAM |
|--------|--------------------------|---------------------------|
| 4      | 32                       | 16                        |
| 8      | 64                       | 32                        |
| 16     | 128                      | 64                        |
| 32     | 256                      | 128                       |
| 64     | 432 or 512               | 256                       |
| 96     | 672                      | 384                       |
| 104    | 672                      | n/a                       |

The total amount of storage you provision also defines the I/O capacity
available to each worker and coordinator node.

| Storage size, TiB | Maximum IOPS |
|-------------------|--------------|
| 0.5               | 1,536        |
| 1                 | 3,072        |
| 2                 | 6,148        |

For the entire cluster, the aggregated IOPS work out to the
following values:

| Worker nodes | 0.5 TiB, total IOPS | 1 TiB, total IOPS | 2 TiB, total IOPS |
|--------------|---------------------|-------------------|-------------------|
| 2            | 3,072               | 6,144             | 12,296            |
| 3            | 4,608               | 9,216             | 18,444            |
| 4            | 6,144               | 12,288            | 24,592            |
| 5            | 7,680               | 15,360            | 30,740            |
| 6            | 9,216               | 18,432            | 36,888            |
| 7            | 10,752              | 21,504            | 43,036            |
| 8            | 12,288              | 24,576            | 49,184            |
| 9            | 13,824              | 27,648            | 55,332            |
| 10           | 15,360              | 30,720            | 61,480            |
| 11           | 16,896              | 33,792            | 67,628            |
| 12           | 18,432              | 36,864            | 73,776            |
| 13           | 19,968              | 39,936            | 79,924            |
| 14           | 21,504              | 43,008            | 86,072            |
| 15           | 23,040              | 46,080            | 92,220            |
| 16           | 24,576              | 49,152            | 98,368            |
| 17           | 26,112              | 52,224            | 104,516           |
| 18           | 27,648              | 55,296            | 110,664           |
| 19           | 29,184              | 58,368            | 116,812           |
| 20           | 30,720              | 61,440            | 122,960           |

**Next steps**

* Learn how to [create a cluster in the portal](quickstart-create-portal.md)
* Change [compute quotas](howto-compute-quota.md) for a subscription and region
