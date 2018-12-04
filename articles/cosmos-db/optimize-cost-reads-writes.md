---
title: Optimizing the cost of reads and writes
description: This article explains explains how to reduce Azure Cosmos DB costs for read and write operations
author: rimman

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/30/2018
ms.author: rimman
---

# Optimizing the cost of reads and writes

This article describes the cost of Azure Cosmos DB for simple write and read operations. Read operations include get of items. Write operations include inserts, replaces, deletes, and upserts of items.  

## The cost of reads and writes

Cosmos DB guarantees predictable performance (in terms of both throughput and latency) by using a provisioned throughput model. The model is represented in terms of [Request Units](request-units.md) per second, or RU/s. A Request Unit (RU) is simply a logical abstraction over compute resources (CPU, memory, IO, etc.) that it takes to perform a request. These provisioned RUs are set aside and dedicated to you to provide predictable throughput and latency. Provisioned throughput enables Cosmos DB to provide predictable and consistent performance, guaranteed low latency, and high availability at any scale. Request units (RUs) represent the normalized currency that simplifies the reasoning about how many resources an application needs. You do not have to think of differentiating between read and write capacity units. The unified currency model of RUs creates efficiencies to interchangeably use the same throughput capacity for both reads and writes.

The following table shows the cost of reads and writes (in the number of RUs) for items that are 1 KB and 100 KB in size.

|Item Size  |Cost of one read |Cost of one write|
|---------|---------|---------|
|1 KB |1 RU |5 RUs |
|100 KB |10 RUs |50 RUs |

Reading an item that is 1 KB in size costs one RU.  Writing an item that is 1 KB costs five RUs. These are the costs when using the default session [consistency level](consistency-levels.md).  The considerations around RUs include: item size, property count, data consistency, [indexed properties](indexing-policies.md), indexing, and query patterns.

## Normalized cost for 1 million reads and writes

Provisioning 1,000 RU/s translates to 3.6 million RU/hour and will cost $0.08 for the hour (in the US and Europe). For a 1 KB item, you can perform 3.6 million reads or 0.72 million writes (3.6 million RU / 5) per hour with this provisioned throughput. Normalized to a million reads and writes, the cost would be $0.022 for 1 million reads ($0.08/3.6 million) and $0.111 for 1 million writes ($0.08/0.72 million).

## RU cost and the number of regions 

The cost of writes is constant no matter the number of regions associated with the Cosmos account. In other words, a 1 KB write will cost five RUs no matter the number of regions that are associated with Cosmos account. There's a non-trivial amount of resources spent in replicating, accepting, and processing the replication traffic on every region. For details on multi-region cost optimization, see [Optimizing the cost of multi-region Cosmos accounts](optimize-cost-regions.md).

## How you can optimize for the cost of writes (and reads) 

When you perform many writes, you should provision enough capacity to support the number of needed writes per second. You can increase the provisioned throughput using SDK, portal, CLI before performing the writes and then reduce the number of RU/s after the writes are done. Your throughput for that heavy write period will be the minimum throughput needed for the given data, plus the throughput required for insert workload assuming nothing else is happening. If you are running other workloads concurrently, for example, query/read/update/delete, you will need to add additional RUs for those operations too. To limit the burstiness of writes, you can customize the retry/backoff policy using Cosmos SDKs. For instance,  you can increase load until a small rate of requests gets rate-limited. If rate-limited, the client application should back off on rate-limiting for the server-specified retry interval. Respecting the backoff ensures that you spend minimal amount of time waiting between retries. Retry policy support is included in SQL .NET and Java, Node.js, and Python and all supported versions of the .NET Core SDKs. For more information, see RetryAfter.

You can also do bulk inserts into Cosmos DB or copy data from any supported source data store to Cosmos DB using [Azure Data Factory](https://docs.microsoft.com/en-us/azure/data-factory/connector-azure-cosmos-db).  Azure Data Factory natively integrates with the Cosmos DB Bulk API to provide the best performance, when you write to Cosmos DB.

## Next steps

* Learn more about [How Cosmos pricing works](how-pricing-works.md)
* Learn more about [Request Units](request-units.md) in Azure Cosmos DB
* Learn to [provision throughput on a database or a container](set-throughput.md)
* Learn more about [logical partitions](partition-data.md)
* Learn [how to provision throughput on a Cosmos container](how-to-provision-container-throughput.md)
* Learn [how to provision throughput on a Cosmos database](how-to-provision-database-throughput.md)
* Learn more about [How Cosmos DB pricing model is cost-effective for customers](total-cost-of-ownership.md)
* Learn more about [Optimizing for development and testing](optimize-dev-test.md)
* Learn more about [Understanding your Cosmos DB bill](understand-your-bill.md)
* Learn more about [Optimizing throughput cost](optimize-cost-throughput.md)
* Learn more about [Optimizing storage cost](optimize-cost-storage.md)
* Learn more about [Optimizing the cost of queries](optimize-cost-queries)
* Learn more about [Optimizing the cost of multi-region Cosmos accounts](optimize-cost-regions.md)
* Learn more about [Cosmos DB reserved capacity](cosmos-db-reserved-capacity.md)
* Learn more about [Cosmos DB pricing page](https://azure.microsoft.com/en-us/pricing/details/cosmos-db/)
* Learn more about [Cosmos DB Emulator](local-emulator.md)
* Learn more about [Azure Free account](https://azure.microsoft.com/free/)
* Learn more about [Try Cosmos DB for free](https://azure.microsoft.com/en-us/try/cosmosdb/)
