---
title: Optimizing the cost of your requests in Azure Cosmos DB
description: This article explains how to optimize costs when issuing requests on Azure Cosmos DB.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 08/26/2021
---

# Optimize request cost in Azure Cosmos DB
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

This article describes how read and write requests translate into [Request Units](request-units.md) and how to optimize the cost of these requests. Read operations include point reads and queries. Write operations include insert, replace, delete, and upsert of items.

Azure Cosmos DB offers a rich set of database operations that operate on the items within a container. The cost associated with each of these operations varies based on the CPU, IO, and memory required to complete the operation. Instead of thinking about and managing hardware resources, you can think of a Request Unit (RU) as a single measure for the resources required to perform various database operations to serve a request.

## Measuring the RU charge of a request

It is important to measure the RU charge of your requests to understand their actual cost and also evaluate the effectiveness of your optimizations. You can fetch this cost by using the Azure portal or inspecting the response sent back from Azure Cosmos DB through one of the SDKs. See [Find the request unit charge in Azure Cosmos DB](find-request-unit-charge.md) for detailed instructions on how to achieve that.

## Reading data: point reads and queries

Read operations in Azure Cosmos DB are typically ordered from fastest/most efficient to slower/less efficient in terms of RU consumption as follows:  

* Point reads (key/value lookup on a single item ID and partition key).
* Query with a filter clause within a single partition key.
* Query without an equality or range filter clause on any property.
* Query without filters.

### Role of the consistency level

When using either the **strong** or **bounded staleness** [consistency levels](consistency-levels.md), the RU cost of any read operation (point read or query) is doubled.

### Point reads

The only factor affecting the RU charge of a point read (besides the consistency level used) is the size of the item retrieved. The following table shows the RU cost of point reads for items that are 1 KB and 100 KB in size.

| **Item Size** | **Cost of one point read** |
| --- | --- |
| 1 KB | 1 RU |
| 100 KB | 10 RUs |

Because point reads (key/value lookups on the item ID and partition key) are the most efficient kind of read, you should make sure your item ID has a meaningful value so you can fetch your items with a point read (instead of a query) when possible. 

> [!NOTE]
> In the API for NoSQL, point reads can only be made using the REST API or SDKs. Queries that filter on one item's ID and partition key aren't considered a point read. To see an example using the .NET SDK, see [read an item in Azure Cosmos DB for NoSQL.](./nosql/how-to-dotnet-read-item.md)

### Queries

Request units for queries are dependent on a number of factors. For example, the number of Azure Cosmos DB items loaded/returned, the number of lookups against the index, the query compilation time etc. details. Azure Cosmos DB guarantees that the same query when executed on the same data will always consume the same number of request units even with repeat executions. The query profile using query execution metrics gives you a good idea of how the request units are spent.  

In some cases you may see a sequence of 200 and 429 responses, and variable request units in a paged execution of queries, that is because queries will run as fast as possible based on the available RUs. You may see a query execution break into multiple pages/round trips between server and client. For example, 10,000 items may be returned as multiple pages, each charged based on the computation performed for that page. When you sum across these pages, you should get the same number of RUs as you would get for the entire query.

#### Metrics for troubleshooting queries

The performance and the throughput consumed by queries (including user-defined functions) mostly depend on the function body. The easiest way to find out how much time the query execution is spent in the UDF and the number of RUs consumed, is by enabling the query metrics. If you use the .NET SDK, here are sample query metrics returned by the SDK:

```bash
Retrieved Document Count                 :               1              
Retrieved Document Size                  :           9,963 bytes        
Output Document Count                    :               1              
Output Document Size                     :          10,012 bytes        
Index Utilization                        :          100.00 %            
Total Query Execution Time               :            0.48 milliseconds 
  Query Preparation Times 
    Query Compilation Time               :            0.07 milliseconds 
    Logical Plan Build Time              :            0.03 milliseconds 
    Physical Plan Build Time             :            0.05 milliseconds 
    Query Optimization Time              :            0.00 milliseconds 
  Index Lookup Time                      :            0.06 milliseconds 
  Document Load Time                     :            0.03 milliseconds 
  Runtime Execution Times 
    Query Engine Execution Time          :            0.03 milliseconds 
    System Function Execution Time       :            0.00 milliseconds 
    User-defined Function Execution Time :            0.00 milliseconds 
  Document Write Time                    :            0.00 milliseconds 
  Client Side Metrics 
    Retry Count                          :               1              
    Request Charge                       :            3.19 RUs  
```

#### Best practices to cost optimize queries 

Consider the following best practices when optimizing queries for cost:

* **Colocate multiple entity types**

   Try to colocate multiple entity types within a single or smaller number of containers. This method yields benefits not only from a pricing perspective, but also for query execution and transactions. Queries are scoped to a single container; and atomic transactions over multiple records via stored procedures/triggers are scoped to a partition key within a single container. Colocating entities within the same container can reduce the number of network round trips to resolve relationships across records. So it increases the end-to-end performance, enables atomic transactions over multiple records for a larger dataset, and as a result lowers costs. If colocating multiple entity types within a single or smaller number of containers is difficult for your scenario, usually because you are migrating an existing application and you do not want to make any code changes - you should then consider provisioning throughput at the database level.  

* **Measure and tune for lower request units/second usage**

   The complexity of a query impacts how many request units (RUs) are consumed for an operation. The number of predicates, nature of the predicates, number of UDFs, and the size of the source data set. All these factors influence the cost of query operations. 

Azure Cosmos DB provides predictable performance in terms of throughput and latency by using a provisioned throughput model. The throughput provisioned is represented in terms of [Request Units](request-units.md) per second, or RU/s. A Request Unit (RU) is a logical abstraction over compute resources such as CPU, memory, IO, etc. that are required to perform a request. The provisioned throughput (RUs) is set aside and dedicated to your container or database to provide predictable throughput and latency. Provisioned throughput enables Azure Cosmos DB to provide predictable and consistent performance, guaranteed low latency, and high availability at any scale. Request units represent the normalized currency that simplifies the reasoning about how many resources an application needs.

Request charge returned in the request header indicates the cost of a given query. For example, if a query returns 1000 1-KB items, the cost of the operation is 1000. As such, within one second, the server honors only two such requests before rate limiting subsequent requests. For more information, see [request units](request-units.md) article and the request unit calculator.

## Writing data

The RU cost of writing an item depends on:

- The item size.
- The number of properties covered by the [indexing policy](index-policy.md) and needed to be indexed.

Inserting a 1 KB item without indexing costs around ~5.5 RUs. Replacing an item costs two times the charge required to insert the same item.

### Optimizing writes

The best way to optimize the RU cost of write operations is to rightsize your items and the number of properties that get indexed.

- Storing very large items in Azure Cosmos DB results in high RU charges and can be considered as an anti-pattern. In particular, don't store binary content or large chunks of text that you don't need to query on. A best practice is to put this kind of data in [Azure Blob Storage](../storage/blobs/storage-blobs-introduction.md) and store a reference (or link) to the blob in the item you write to Azure Cosmos DB.
- Optimizing your indexing policy to only index the properties that your queries filter on can make a huge difference in the RUs consumed by your write operations. When creating a new container, the default indexing policy indexes each and every property found in your items. While this is a good default for development activities, it is highly recommended to re-evaluate and [customize your indexing policy](how-to-manage-indexing-policy.md) when going to production or when your workload begins to receive significant traffic.

When performing bulk ingestion of data, it is also recommended to use the [Azure Cosmos DB bulk executor library](bulk-executor-overview.md) as it is designed to optimize the RU consumption of such operations. Optionally, you can also use [Azure Data Factory](../data-factory/introduction.md) which is built on that same library.

## Next steps

Next you can proceed to learn more about cost optimization in Azure Cosmos DB with the following articles:

* Learn more about [Optimizing for development and testing](optimize-dev-test.md)
* Learn more about [Understanding your Azure Cosmos DB bill](understand-your-bill.md)
* Learn more about [Optimizing throughput cost](optimize-cost-throughput.md)
* Learn more about [Optimizing storage cost](optimize-cost-storage.md)
* Learn more about [Optimizing the cost of multi-region Azure Cosmos DB accounts](optimize-cost-regions.md)
* Learn more about [Azure Cosmos DB reserved capacity](reserved-capacity.md)
* Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    * If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](convert-vcore-to-request-unit.md) 
    * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
