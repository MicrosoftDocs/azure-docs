---
title: Learn more about Azure Cosmos DB Serverless performance
description: Learn more about Azure Cosmos DB Serverless performance.
author: richagaur
ms.author: richagaur
ms.service: cosmos-db
ms.custom: build-2023
ms.topic: conceptual
ms.date: 12/01/2022
ms.reviewer: dech
---

# Serverless performance 

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Azure Cosmos DB Serverless resources have distinct performance characteristics that differ from those provided by provisioned throughput resources. Specifically, serverless containers do not offer any guarantees of predictable throughput or latency. However, the maximum capacity of a serverless container is determined by the data stored within it. We'll explore how this capacity varies with storage in the following section.

## Changes in request units

Azure Cosmos DB Serverless offers 5000 RU/s for a container. However, if your workload increases beyond 250 GB or more than five physical partitions, whichever is earlier, then the request units grow linearly with number of underlying physical partitions created in the container. Beyond 5 physical partitions, with every addition of a new physical partition, 1000 RU/s are added to the container's maximum throughput capacity.

To understand request unit growth with storage, lets look at the table below.

| Maximum storage | Minimum physical partitions | RU/s per container | RU/s per physical partition  
|:---:|:---:|:---:|:---:| 
|<=50 GB | 1 | 5000 | 5000 |
|<=100 GB | 2 | 5000 | 2500 | 
|<=150 GB | 3 | 5000 | 1666 |
|<=200 GB | 4 | 5000 | 1250 |
|<=250 GB | 5 | 5000 | 1000 |
|<=300 GB | 6 | 6000 | 1000 |
|<=350 GB | 7 | 7000 | 1000 |
|<=400 GB | 8 | 8000 | 1000 |
|.........|...|......|......|
|<= 1 TB  | 20 | 20000| 1000 | 

The request units can increase beyond 20000 RU/s for a serverless container if more than 20 partitions are created in the container. It depends on the distribution of logical partition keys in your serverless container.

> [!NOTE]
> These numbers represent the maximum RU/sec capacity available to a serverless container. However, it's important to note that there are no assurances of predictable throughput or latency. If your container requires such guarantees, it's recommended to use provisioned throughput.

## Next steps

- Learn more about [serverless](serverless.md)
- Learn more about [request units.](request-units.md)
- Trying to decide between provisioned throughput and serverless? See [choose between provisioned throughput and serverless.](throughput-serverless.md)
