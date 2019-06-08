---
title: Optimize request units and cost to run queries in Azure Cosmos DB
description: Learn how to evaluate request unit charges for a query and optimize the query in terms of performance and cost. 
author: rimman
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/21/2019
ms.author: rimman
---

# Optimize query cost in Azure Cosmos DB

Azure Cosmos DB offers a rich set of database operations including relational and hierarchical queries that operate on the items within a container. The cost associated with each of these operations varies based on the CPU, IO, and memory required to complete the operation. Instead of thinking about and managing hardware resources, you can think of a request unit (RU) as a single measure for the resources required to perform various database operations to serve a request. This article describes how to evaluate request unit charges for a query and optimize the query in terms of performance and cost. 

Queries in Azure Cosmos DB are typically ordered from fastest/most efficient to slower/less efficient in terms of throughput as follows:  

* GET operation on a single partition key and item key.

* Query with a filter clause within a single partition key.

* Query without an equality or range filter clause on any property.

* Query without filters.

Queries that read data from one or more partitions incur higher latency and consume higher number of request units. Since each partition has automatic indexing for all properties, the query can be served efficiently from the index. You can make queries that use multiple partitions faster by using the parallelism options. To learn more about partitioning and partition keys, see [Partitioning in Azure Cosmos DB](partitioning-overview.md).

## Evaluate request unit charge for a query

Once you have stored some data in your Azure Cosmos containers, you can use the Data Explorer in the Azure portal to construct and run your queries. You can also get the cost of the queries by using the data explorer. This method will give you a sense of the actual charges involved with typical queries and operations that your system supports.

You can also get the cost of queries programmatically by using the SDKs. To measure the overhead of any operation such as create, update, or delete inspect the `x-ms-request-charge` header when using REST API. If you are using the .NET or the Java SDK, the `RequestCharge` property is the equivalent property to get the request charge and this property is present within the ResourceResponse or FeedResponse.

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

## Factors influencing request unit charge for a query

Request units for queries are dependent on a number of factors. For example, the number of Azure Cosmos items loaded/returned, the number of lookups against the index, the query compilation time etc. details. Azure Cosmos DB guarantees that the same query when executed on the same data will always consume the same number of request units even with repeat executions. The query profile using query execution metrics gives you a good idea of how the request units are spent.  

In some cases you may see a sequence of 200 and 429 responses, and variable request units in a paged execution of queries, that is because queries will run as fast as possible based on the available RUs. You may see a query execution break into multiple pages/round trips between server and client. For example, 10,000 items may be returned as multiple pages, each charged based on the computation performed for that page. When you sum across these pages, you should get the same number of RUs as you would get for the entire query.  

## Metrics for troubleshooting

The performance and the throughput consumed by queries, user-defined functions (UDFs) mostly depends on the function body. The easiest way to find out how much time the query execution is spent in the UDF and the number of RUs consumed, is by enabling the Query Metrics. If you use the .NET SDK, here are sample query metrics returned by the SDK:

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

## Best practices to cost optimize queries 

Consider the following best practices when optimizing queries for cost:

* **Colocate multiple entity types**

   Try to colocate multiple entity types within a single or smaller number of containers. This method yields benefits not only from a pricing perspective, but also for query execution and transactions. Queries are scoped to a single container; and atomic transactions over multiple records via stored procedures/triggers are scoped to a partition key within a single container. Colocating entities within the same container can reduce the number of network round trips to resolve relationships across records. So it increases the end-to-end performance, enables atomic transactions over multiple records for a larger dataset, and as a result lowers costs. If colocating multiple entity types within a single or smaller number of containers is difficult for your scenario, usually because you are migrating an existing application and you do not want to make any code changes - you should then consider provisioning throughput at the database level.  

* **Measure and tune for lower request units/second usage**

   The complexity of a query impacts how many request units (RUs) are consumed for an operation. The number of predicates, nature of the predicates, number of UDFs, and the size of the source data set. All these factors influence the cost of query operations. 

   Request charge returned in the request header indicates the cost of a given query. For example, if a query returns 1000 1-KB items, the cost of the operation is 1000. As such, within one second, the server honors only two such requests before rate limiting subsequent requests. For more information, see [request units](request-units.md) article and the request unit calculator. 

## Next steps

Next you can proceed to learn more about cost optimization in Azure Cosmos DB with the following articles:

* Learn more about [How Azure Cosmos pricing works](how-pricing-works.md)
* Learn more about [Optimizing for development and testing](optimize-dev-test.md)
* Learn more about [Understanding your Azure Cosmos DB bill](understand-your-bill.md)
* Learn more about [Optimizing throughput cost](optimize-cost-throughput.md)
* Learn more about [Optimizing storage cost](optimize-cost-storage.md)
* Learn more about [Optimizing the cost of reads and writes](optimize-cost-reads-writes.md)
* Learn more about [Optimizing the cost of multi-region Azure Cosmos accounts](optimize-cost-regions.md)
* Learn more about [Azure Cosmos DB reserved capacity](cosmos-db-reserved-capacity.md)

