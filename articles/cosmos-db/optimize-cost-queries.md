---
title: Optimizing cost for queries in Azure Cosmos DB
description: This article explains how to manage query related costs of Azure Cosmos DB.
author: rimman

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/30/2018
ms.author: rimman
---

# Optimizing cost for queries

Azure Cosmos DB offers a rich set of database operations including relational and hierarchical queries– all operating on the items within a database container. The cost associated with each of these operations varies based on the CPU, IO, and memory required to complete the operation. Instead of thinking about and managing hardware resources, you can think of a request unit (RU) as a single measure for the resources required to perform various database operations and service an application request.

With Azure Cosmos DB, queries typically can be ordered from fastest/most efficient to slower/less efficient in terms of throughput as follows:  

* GET on a single partition key and item key 

* Query with a filter clause within a single partition key 

* Query without an equality or range filter clause on any property 

* Query without filters

Queries that need to consult more than one, or all partitions, will incur higher latency and consume higher number of RUs. Since each partition has automatic indexing against all properties, the query can be served efficiently from the index. You can make queries that span partitions faster by using the parallelism options. To learn more about partitioning and partition keys, see [Partitioning in Azure Cosmos DB](partitioning-overview).

## Evaluating query RU cost

Once you have stored some data in your Cosmos DB containers and databases, you can use the Cosmos/Data Explorer in the Azure portal to not only construct and run your queries, but also get the real cost of the queries:

![Obtain cost of a query in Data Explorer](./media/optimize-cost-queries/request-charge.png)

This method will give you a sense of the actual charge involved with typical queries and operations that your system will have to support.

You can also get the cost of queries programmatically. To measure the overhead of any operation (create, update, or delete), inspect the x-ms-request-charge header (or the equivalent RequestCharge property in ResourceResponse or FeedResponse in the .NET and  Java SDK) to measure the number of request units consumed by these operations.

```csharp
// Measure the performance (request units) of writes 

ResourceResponse<Document> response = await client.CreateDocumentAsync(collectionSelfLink, myDocument); 

Console.WriteLine("Insert of an item consumed {0} request units", response.RequestCharge); 

// Measure the performance (request units) of queries 

IDocumentQuery<dynamic> queryable = client.CreateDocumentQuery(collectionSelfLink, queryString).AsDocumentQuery(); 

while (queryable.HasMoreResults) 

     { 

          FeedResponse<dynamic> queryResponse = await queryable.ExecuteNextAsync<dynamic>(); 

          Console.WriteLine("Query batch consumed {0} request units", queryResponse.RequestCharge); 

     }
```

## Factors influencing Query RU cost

Query RUs are dependent on a number of factors, for example, the number of Cosmos items loaded/returned, the number of lookups against the index, the query compilation time, etc. The service guarantees that the same query on the same data will always return the same RUs on repeat executions. If you profile the query using Query Execution metrics, you will get a good idea of where the RUs are spent.  

You may see sometime the sequence of 200 and 429 responses, and variable RUs in paged execution of queries, because queries will run as fast as possible based on the available RUs. You may see a  query execution break into multiple pages/round trips between server and client. For example, 10,000 items may be returned as multiple pages, each charged based on the computation performed for that page. In sum, across these pages, you should get the same number of RUs for the entire query.  

## Metrics for troubleshooting

The performance and the throughput consumed by queries, user-defined functions (UDFs) mostly depends on the function body. The easiest way to find out how much of the query execution is spent in the UDF and how much is being consumed in terms of RUs, is by enabling the Query Metrics.  

Here are sample query metrics returned by .Net SDK:

```html
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

## Best practices for cost optimizations for queries 

**Colocate multiple entity types**

Try to colocate multiple entity types within a single (or reduced # of containers). This would yield benefits not only from a pricing perspective, but also regarding queries and transactions. Queries are scoped to a single container; and atomic transactions over multiple records via stored procedures/triggers are scoped to a partition key within a single container. Colocating entities within the same container can reduce the # of network round trips for resolving relationships across records (thus speeding up end-to-end performance), as well help enable atomic transactions over multiple records for a larger dataset and as a result lower costs. If above is difficult – usually this is because this is a migration of an existing application and you do not want to make any code changes - you should then consider provisioning throughput at a database level.  

**Measure and tune for lower request units/second usage**

The complexity of a query impacts how many Request Units (RUs) are consumed for an operation. The number of predicates, nature of the predicates, number of UDFs, and the size of the source data set all influence the cost of query operations. 

Request charge returned in the request header will indicate the cost of a given query. For example, if a query returns 1000 1KB items, the cost of the operation is 1000. As such, within one second, the server honors only two such requests before rate limiting subsequent requests. For more information, see [Request Units](request-units.md) and the request unit calculator. 

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
* Learn more about [Optimizing the cost of reads and writes](optimize-cost-reads-writes.md)
* Learn more about [Optimizing the cost of multi-region Cosmos accounts](optimize-cost-regions.md)
* Learn more about [Cosmos DB reserved capacity](cosmos-db-reserved-capacity.md)
* Learn more about [Cosmos DB pricing page](https://azure.microsoft.com/en-us/pricing/details/cosmos-db/)
* Learn more about [Cosmos DB Emulator](local-emulator.md)
* Learn more about [Azure Free account](https://azure.microsoft.com/free/)
* Learn more about [Try Cosmos DB for free](https://azure.microsoft.com/en-us/try/cosmosdb/)
