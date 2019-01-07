---
title: Scaling throughput in Azure Cosmos DB 
description: This article describes how Azure Cosmos DB scales throughput elastically
author: dharmas-cosmos
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 10/15/2018
ms.author: dharmas
ms.reviewer: sngun

---

# Scaling throughput in Azure Cosmos DB

In Azure Cosmos DB, provisioned throughput is represented as request units/second (RU/s, plural: RUs). RUs measure the cost of both read and write operations against your Cosmos container as shown in the following image:

![Request Units](./media/scaling-throughput/request-unit-charge-of-read-and-write-operations.png)

You can provision RUs on a Cosmos container or a Cosmos database. RUs provisioned on a container are exclusively available for operations performed on that container. RUs provisioned on a database are shared among all the containers within that database (except for any containers with exclusively assigned RUs).

For elastically scaling throughput, you can increase or decrease the provisioned RU/s at any time. For more information, see [How-to provision throughput](set-throughput.md) and elastically scale Cosmos containers and databases. For globally scaling throughput, you can add or remove regions on your Cosmos account at any time. For more information, see [Add/remove regions from your database account](how-to-manage-database-account.md#addremove-regions-from-your-database-account). Associating multiple regions with a Cosmos account is important in many scenarios to achieve low latency and [high availability](high-availability.md) around the world.

## How provisioned throughput is distributed across regions

If you provision 'R' RUs on a Cosmos container (or database), Cosmos DB ensures that 'R' RUs are available in *each* region associated with your Cosmos account. Each time you add a new region to your account, Cosmos DB automatically provisions 'R' RUs in the newly added region. The operations performed against your Cosmos container are guaranteed to get 'R' RUs in each region. You can't selectively assign RUs to a specific region. The RUs provisioned for a Cosmos container (or database) are provisioned for all the regions associated with your Cosmos account.

Assuming that a Cosmos container is configured with 'R' RUs and there are 'N' regions associated with the Cosmos account, then:

- If the Cosmos account is configured with a single write region, the total RUs available globally on the container = R x N.

- If the Cosmos account is configured with multiple write regions, the total RUs available globally on the container = R x (N+1). The additional R RUs are automatically provisioned to process update conflicts and anti-entropy traffic across the regions.

Your choice of [consistency model](consistency-levels.md) also affects throughput. You can get approximately 2x read throughput for session, consistent prefix, and eventual consistency compared to bounded staleness or strong consistency.

## Next steps

Next you can learn how to configure throughput with the help of the following article:

* [Get and set throughput for containers and databases](set-throughput.md) 

