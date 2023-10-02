---
title: Performance for the serverless account type
titleSuffix: Azure Cosmos DB
description: Learn more about performance for the Azure Cosmos DB serverless account type.
author: richagaur
ms.author: richagaur
ms.service: cosmos-db
ms.custom: build-2023
ms.topic: conceptual
ms.date: 12/01/2022
ms.reviewer: dech
---

# Azure Cosmos DB serverless account performance

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Azure Cosmos DB serverless resources have performance characteristics that are different than the characteristics of provisioned throughput resources. Serverless containers don't offer any guarantees of predictable throughput or latency. The maximum capacity of a serverless container is determined by the data that stored within it. The capacity varies by storage size.

## Request unit changes

An Azure Cosmos DB serverless account offers 5,000 request units per second (RU/s) for a container. But if your workload increases to more than 250 GB or by more than five physical partitions, whichever occurs first, the request units (RUs) grow linearly with the number of underlying physical partitions that were created in the container. With the addition of each new physical partition beyond the original five physical partitions, 1,000 RU/s are added to the container's maximum throughput capacity.

The following table lists RU growth with increased storage size:

| Maximum storage | Minimum physical partitions | RU/s per container | RU/s per physical partition  
|:---:|:---:|:---:|:---:|
|<=50 GB | 1 | 5,000 | 5,000 |
|<=100 GB | 2 | 5,000 | 2,500 |
|<=150 GB | 3 | 5,000 | 1,666 |
|<=200 GB | 4 | 5,000 | 1,250 |
|<=250 GB | 5 | 5,000 | 1,000 |
|<=300 GB | 6 | 6,000 | 1,000 |
|<=350 GB | 7 | 7,000 | 1,000 |
|<=400 GB | 8 | 8,000 | 1,000 |
|.........|...|......|......|
|<= 1 TB  | 20 | 20,000| 1,000 |

RUs can increase beyond 20,000 RU/s for a serverless container if more than 20 partitions are created in the container. The RU/s rate depends on the distribution of logical partition keys that are in your serverless container.

> [!NOTE]
> The numbers that are described in this article represent the maximum RU/s capacity that's available to a serverless container. However, it's important to note that if you choose a serverless account type, you have no assurances of predictable throughput or latency. If your container requires these types of guarantees, we recommend that you choose to create a provisioned throughput account type instead of a serverless account.

## Next steps

- Learn more about the Azure Cosmos DB [serverless](serverless.md) option.
- Learn more about [request units](request-units.md).
- Review how to [choose between provisioned throughput and serverless](throughput-serverless.md).
