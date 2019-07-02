---
title: Optimizing the cost of reads and writes in Azure Cosmos DB
description: This article explains explains how to reduce Azure Cosmos DB costs when performing read and write operations on the data.
author: rimman
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/21/2019
ms.author: rimman
---

# Optimize reads and writes cost in Azure Cosmos DB

This article describes how the cost required to read and write data from Azure Cosmos DB is calculated. Read operations include get operations on items and write operations include insert, replace, delete, and upsert of items.  

## Cost of reads and writes

Azure Cosmos DB guarantees predictable performance in terms of throughput and latency by using a provisioned throughput model. The throughput provisioned is represented in terms of [Request Units](request-units.md) per second, or RU/s. A Request Unit (RU) is a logical abstraction over compute resources such as CPU, memory, IO, etc. that are required to perform a request. The provisioned throughput (RUs) is set aside and dedicated to your container or database to provide predictable throughput and latency. Provisioned throughput enables Azure Cosmos DB to provide predictable and consistent performance, guaranteed low latency, and high availability at any scale. Request units represent the normalized currency that simplifies the reasoning about how many resources an application needs. 

You don't have to think about differentiating request units between reads and writes. The unified currency model of request units creates efficiencies to interchangeably use the same throughput capacity for both reads and writes. The following table shows the cost of reads and writes in terms of RU/s for items that are 1 KB and 100 KB in size.

|**Item Size**  |**Cost of one read** |**Cost of one write**|
|---------|---------|---------|
|1 KB |1 RU |5 RUs |
|100 KB |10 RUs |50 RUs |

Reading an item that is 1 KB in size costs one RU. Writing an item that is 1-KB costs five RUs. The read and write costs are applicable when using the default session [consistency level](consistency-levels.md).  The considerations around RUs include: item size, property count, data consistency, indexed properties, indexing, and query patterns.

## Normalized cost for 1 million reads and writes

Provisioning 1,000 RU/s translates to 3.6 million RU/hour and will cost $0.08 for the hour (in the US and Europe). For a 1-KB item, you can perform 3.6 million reads or 0.72 million writes, (this value is calculated as: `3.6 million RU / 5`) per hour with this provisioned throughput. Normalized to a million reads and writes, the cost would be $0.022 for 1 million reads (this value is calculated as: $0.08/3.6 million) and $0.111 for 1 million writes (this value is calculated as: $0.08/0.72 million).

## Number of regions and the request units cost

The cost of writes is constant irrespective of the number of regions associated with the Azure Cosmos account. In other words, a 1 KB write will cost five RUs independent of the number of regions that are associated with the account. There's a non-trivial amount of resources spent in replicating, accepting, and processing the replication traffic on every region. For details about multi-region cost optimization, see [Optimizing the cost of multi-region Cosmos accounts](optimize-cost-regions.md) article.

## Optimize the cost of writes and reads

When you perform write operations, you should provision enough capacity to support the number of  writes needed per second. You can increase the provisioned throughput by using SDK, portal, CLI before performing the writes and then reduce the throughput after the writes are completed. Your throughput for the write period is the minimum throughput needed for the given data, plus the throughput required for insert workload assuming no other workloads are running. 

If you are running other workloads concurrently, for example, query/read/update/delete, you should add the additional request units required for those operations too. If the write operations are rate-limited, you can customize the retry/backoff policy by using Azure Cosmos DB SDKs. For instance, you can increase the load until a small rate of requests gets rate-limited. If rate-limit occurs, the client application should back off on rate-limiting requests for the specified retry interval. Before retrying writes, you should have a minimal amount of time gap between retries. Retry policy support is included in SQL .NET, Java, Node.js, and Python SDKs and all the supported versions of the .NET Core SDKs. 

You can also bulk insert data into Azure Cosmos DB or copy data from any supported source data store to Azure Cosmos DB by using [Azure Data Factory](../data-factory/connector-azure-cosmos-db.md). Azure Data Factory natively integrates with the Azure Cosmos DB Bulk API to provide the best performance, when you write data.

## Next steps

Next you can proceed to learn more about cost optimization in Azure Cosmos DB with the following articles:

* Learn more about [Optimizing for development and testing](optimize-dev-test.md)
* Learn more about [Understanding your Azure Cosmos DB bill](understand-your-bill.md)
* Learn more about [Optimizing throughput cost](optimize-cost-throughput.md)
* Learn more about [Optimizing storage cost](optimize-cost-storage.md)
* Learn more about [Optimizing the cost of queries](optimize-cost-queries.md)
* Learn more about [Optimizing the cost of multi-region Azure Cosmos accounts](optimize-cost-regions.md)
