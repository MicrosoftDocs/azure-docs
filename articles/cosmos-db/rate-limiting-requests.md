---
title: Optimize your Azure Cosmos DB application using rate limiting
description: This article provides developers with a methodology to rate limit requests to Azure Cosmos DB. Implementing this pattern can reduce errors and improve overall performance for workloads that exceed the provisioned throughput of the target database or container.
author: plasne
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 08/26/2021
ms.author: pelasne
---

# Optimize your Azure Cosmos DB application using rate limiting
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

This article provides developers with a methodology to rate limit requests to Azure Cosmos DB. Implementing this pattern can reduce errors and improve overall performance for workloads that exceed the provisioned throughput of the target database or container.

Requests that exceed your provisioned throughput in Azure Cosmos DB can result in transient faults like [TooManyRequests](troubleshoot-request-rate-too-large.md), [Timeout](troubleshoot-request-timeout.md), and [ServiceUnavailable](troubleshoot-service-unavailable.md). Typically you would retry these requests when capacity is available and be successful. However, this approach can result in a large number of requests following the error path in your code and typically results in reduced throughput.

Optimal system performance, as measured by cost and time, can be achieved by matching the client-side workload traffic to the server-side provisioned throughput.

Consider the following scenario:

* You provision Azure Cosmos DB with 20 K RU/second.
* Your application processes an ingestion job that contains 10 K records, each of which
costs 10 RU. The total capacity required to complete this job is 100 K RU.
* If you send the entire job to Azure Cosmos DB, you should expect a large number of transient faults and a large buffer of requests that you must retry. This condition is because the total number of RUs needed for the job (100 K) is much greater than the provisioned maximum (20 K). ~2 K of the records will be accepted into the database, but ~8 K will be rejected. You will send ~8 K records to Azure Cosmos DB on retry, of which ~2 K will be accepted, and so on. You should expect this pattern would send ~30 K records instead of 10 K records.
* Instead if you send those requests evenly across 5 seconds, you should expect no faults and overall faster throughput as each batch would be at or under the provisioned 20 K.

Spreading the requests across a period of time can be accomplished by introducing a rate limiting mechanism in your code.

The RUs provisioned for a container will be evenly shared across the number of physical partitions. In the above example, if Azure Cosmos DB provisioned two physical partitions, each would have 10 K RU.

For more information about Request Units, see [Request Units in Azure Cosmos DB
](request-units.md).
For more information about estimating the number of RUs consumed by your workload, see [Request Unit considerations](request-units.md#request-unit-considerations).
For more information about partitioning Azure Cosmos DB, see [Partitioning and horizontal scaling in Azure Cosmos DB](partitioning-overview.md).

## Methodology

An approach to implementing rate limiting might look like this:

1. Profile your application so that you have data about the writes and read requests that are used.
1. Define all indexes.
1. Populate the collection with a reasonable amount of data (could be sample data). If you expect your application to normally have millions of records, populate it with millions of records.
1. Write your representative documents and record the RU cost.
1. Run your representative queries and record the RU cost.
1. Implement a function in your application to determine the cost of any given request based on your findings.
1. Implement a rate limiting mechanism in your code to ensure that the sum of all operations sent to Azure Cosmos DB in a second do not exceed your provisioned throughput.
1. Load test your application and verify that you don't exceed the provisioned throughput.
1. Retest the RU costs periodically and update your cost function as needed.

## Indexing

Unlike other SQL and NoSQL databases you may be familiar with, Azure Cosmos DB's default indexing policy for newly created containers indexes **every** property. Each property indexed increases the RU cost of writes.

The default indexing policy can lower latency in read-heavy systems where query filter conditions are well distributed across all of the stored fields. For example, systems where Azure Cosmos DB is spending most of its time serving end-user crafted ad-hoc searches might benefit.

You might want to exclude properties that are never searched against from being indexed. Removing properties from the index could improve overall system performance (cost and time) for systems that are write-heavy and record retrieval patterns are more constrained.

Before measuring any costs, you should intentionally configure an appropriate index policy for your use-cases. Also, if you later change indexes, you will need to rerun all cost calculations. 

Where possible, testing a system under development with a load reflecting typical queries at normal and peak demand conditions will help reveal what indexing policy to use.

For more information about indexes, see [Indexing policies in Azure Cosmos DB](index-policy.md).

## Measuring cost

There are some key concepts when measuring cost:

* Consider all factors that affect RU usage, as described in [request unit considerations](request-units.md#request-unit-considerations).
* All reads and writes in your database or container will share the same provisioned throughput.
* RU consumption is incurred regardless of the Azure Cosmos DB APIs being used.
* The partition strategy for a collection can have a significant impact on the cost of a system. For more information, see [Partitioning and horizontal scaling in Azure Cosmos DB](partitioning-overview.md#choose-partitionkey).
* Use representative documents and representative queries.
  * These are documents and queries that you think are close to what the operational system will come across.
  * The best way to get these representative documents and queries is to instrument the usage of your application. It is always better to make a data-driven decision.
* Measure costs periodically.
  * Index changes, the size of indexes can affect the cost. 
  * It will be helpful to create some repeatable (maybe even automated) test of the representative documents and queries.
  * Ensure your representative documents and queries are still representative.

The method to determine the cost of a request, is different for each API:

* [API for NoSQL](find-request-unit-charge.md)
* [API for Cassandra](cassandra/find-request-unit-charge.md)
* [API for Gremlin](gremlin/find-request-unit-charge.md)
* [API for MongoDB](mongodb/find-request-unit-charge.md)
* [API for Table](table/find-request-unit-charge.md)

## Write requests

The cost of write operations tends to be easy to predict. You will insert records and document the cost that Azure Cosmos DB reported.

If you have documents of different size and/or documents that will use different indexes, it is important to measure all of them.
You may find that your representative documents are close enough in cost that you can assign a single value across all writes.
For example, if you found costs of 13.14 RU, 16.01 RU, and 12.63 RU, you might average those costs to 14 RU.

## Read requests

The cost of query operations can be much harder to predict for the following reasons:

* If your system supports user-defined queries, you will need to map the incoming queries to the representative queries to help determine the cost. There are various forms this process might take:
  * It may be possible to match the queries exactly. If there is no direct match, you may have to find the representative query that it is closest to.
  * You may find that you can calculate a cost based on characteristics of the query. For example, you may find that each clause of the query has a certain cost,
  or that an indexed property costs "x" while one not indexed costs "y", etc.
* The number of results can vary and unless you have statistics, you cannot predict the RU impact from the return payload.

It is likely you will not have a single cost of query operations, but rather some function that evaluates the query and calculates a cost.
If you are using the API for NoSQL, you could then evaluate the actual cost of the operation and determine how accurate your estimation was
(tuning of this estimation could even happen automatically within the code).

## Transient fault handling

Your application will still need transient fault handling even if you implement a rate limiting mechanism for the following reasons:

* The actual cost of a request may be different than your projected cost.
* Transient faults can occur for reasons other than TooManyRequests.

However, properly implementing a rate limiting mechanism in your application will substantially reduce the number of transient faults.

## Alternate and related techniques

While this article describes client-side coordination and batching of workloads, there are other techniques that can be employed to manage overall system throughput.

### Autoscaling

Autoscale provisioned throughput in Azure Cosmos DB allows you to scale the throughput (RU/s) of your database or container automatically and instantly. The throughput is scaled based on the usage, without impacting the availability, latency, throughput, or performance of the workload.

Autoscale provisioned throughput is well suited for mission-critical workloads that have variable or unpredictable traffic patterns, and require SLAs on high performance and scale.

For more information on autoscaling, see [Create Azure Cosmos DB containers and databases with autoscale throughput
](provision-throughput-autoscale.md).

### Queue-Based Load Leveling pattern

You could employ a queue that acts as a buffer between a client and Azure Cosmos DB in order to smooth intermittent heavy loads that can cause the service to fail or the task to time out.

This pattern is useful to any application that uses services that are subject to overloading. However, this pattern isn't useful if the application expects a response from the service with minimal latency.

This pattern is often well suited to ingest operations.

For more information about this pattern, see [Queue-Based Load Leveling pattern](/azure/architecture/patterns/queue-based-load-leveling).

### Cache-Aside pattern

You might consider loading data on demand into a cache instead of querying Azure Cosmos DB every time. Using a cache can improve performance and also helps to maintain consistency between data held in the cache and data in the underlying data store.

For more information, see: [Cache-Aside pattern](/azure/architecture/patterns/cache-aside).

### Materialized View pattern

You might prepopulate views into other collections after storing the data in Azure Cosmos DB when the data isn't ideally formatted for required query operations. This pattern can help support efficient querying and data extraction, and improve application performance.

For more information, see [Materialized View pattern](/azure/architecture/patterns/materialized-view).

## Next steps

* Explore an example implemented in Go, available on [GitHub](https://github.com/mspnp/go-batcher).
* Learn more about the [Rate Limiting pattern](/azure/architecture/patterns/rate-limiting-pattern) in the Azure Architecture Center.
* Learn how to [troubleshoot TooManyRequests errors](troubleshoot-request-rate-too-large.md) in Azure Cosmos DB.
* Learn how to [troubleshoot Timeout errors](troubleshoot-request-timeout.md) in Azure Cosmos DB.
* Learn how to [troubleshoot ServiceUnavailable errors](troubleshoot-service-unavailable.md) in Azure Cosmos DB.
* Learn more about [Request Units](request-units.md) in Azure Cosmos DB.
* Learn more about [Partitioning and horizontal scaling](partitioning-overview.md) in Azure Cosmos DB.
* Learn about [Indexing policies](index-policy.md) in Azure Cosmos DB.
* Learn about [Autoscaling](provision-throughput-autoscale.md) in Azure Cosmos DB.
* Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    * If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](convert-vcore-to-request-unit.md) 
    * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
