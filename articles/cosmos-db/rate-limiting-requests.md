---
title: Rate Limiting Azure Cosmos DB requests in your custom application
description: This article provides developers with a methodology to rate limit requests to Cosmos to reduce errors and improve throughput.
author: plasne
ms.service: cosmos-db
ms.topic: how-to
ms.date: 4/16/2021
ms.author: pelasne
---

# Rate limiting Azure Cosmos DB requests in your custom application

This article provides developers with a methodology to rate limit requests to Cosmos to reduce errors and improve overall performance for workloads that exceed the provisioned throughput of the target database or container.

Requests that exceed your provisioned throughput in Azure Cosmos DB can result in transient faults like [TooManyRequests](troubleshoot-request-rate-too-large.md), [Timeout](troubleshoot-request-timeout.md), and [ServiceUnavailable](troubleshoot-service-unavailable.md). Typically you would retry these requests when capacity is available and be successful. However, this approach can result in a very large number of requests following the error path in your code and typically results in reduced throughput.

Optimal system performance, as measured by cost and time, can be achieved by matching the client-side workload traffic to the server-side provisioned throughput.

Consider the following scenario:

* You provision Azure Cosmos DB with 20K RU. This implies that your target database will expect a maximum of no more than 20K RUs per second.
* Your application processes an ingestion job that contains 10K records, each of which
costs 10 RU. Thus, the total capacity required to complete this job is 100K RU.
* If you simply send the entire job to Cosmos DB, you should expect a large number of transient faults and a large buffer of requests that you must retry. This is because the total number of RUs needed for the job (100K) is much greater than the provisioned maximum (20K). ~2K of the records will be accepted into the database, but ~8K will be rejected. You will send ~8K records to Cosmos on retry, of which ~2K will be accepted, and so on. You should expect this pattern would send ~30K records instead of 10K records.
* Instead if you send those requests evenly across 5 seconds, you should expect no faults and overall faster throughput as each batch would be at or under the provisioned 20K.

Spreading the requests across a period of time can be accomplished by introducing a rate limiting mechanism in your code.

Its important to keep in mind that RU throughput characteristics are affected by the number of physical partitions in a given container. In the example above, that 20K RU provisioned throughput would be evenly shared across the number of partitions in the target container. For example, if Cosmos DB provisioned 2 physical partitions, each would have 10K RU.

For more information about Resource Units, see [Request Units in Azure Cosmos DB
](request-units.md).
For more information about estimating the number of RUs consumed by your workload, see [Request Unit considerations](request-units.md#request-unit-considerations)
For more information about partitioning Cosmos DB, see [Partitioning and horizontal scaling in Azure Cosmos DB](partitioning-overview.md)

## Workflow

An approach to implementing rate limiting might look like this:

1. Profile your application so you have data about what writes and read requests are used.
1. Define all indexes in Cosmos DB.
1. Populate the collection with a reasonable amount of data (could be sample data). If you expect your application to normally have millions of records, populate it with millions of records.
1. Write your representative documents and record the RU cost.
1. Run your representative queries and record the RU cost.
1. Implement a function in your application to determine the cost of any given request based on your findings.
1. Implement a rate limiting mechanism in your code to ensure that the sum of all operations sent to Cosmos DB in a second do not exceed your provisioned throughput.
1. Load test your application and verify that you don't exceed the provisioned throughput.
1. Re-test the RU costs periodically and update your cost function as needed.

## Indexing

Unlike other SQL and NoSQL databases you may be familiar with, Cosmos DB's default indexing policy for newly created containers indexes **every** property. This will affect the number of RUs that a write operation consumes, and that is naturally related to the number of properties in such records.

The default indexing policy helps foster lower latency in read-heavy systems where query filter conditions are well distributed across all of the stored fields. For example, systems where Cosmos DB is spending most of its time serving end-user crafted ad-hoc searches, like searching retail order history for a hyper-targeted market segment a researcher is interested in.

This could be an opportunity to improve overall system performance (cost and time) for systems that are more write-heavy, and where record retrieval patterns are more constrained and/or well known. This is especially applicable where records have many properties but are only ever fetched by only a few properties. Put another way, you might want to exclude properties that are never searched against from being indexed.

Before measuring any costs, you should intentionally consider and configure indexes. Also, if you later change indexes, you will need to re-run all cost calculations. 

Where possible, testing a system under development with a load reflecting typical queries at normal and peak demand conditions will help reveal what indexing policy to use.

For more information about indexes, see [Indexing policies in Azure Cosmos DB](index-policy.md).

## Measuring Cost

There are some key concepts when measuring cost:

* Consider all factors that affect RU usage, as described in [request unit considerations](request-units.md#request-unit-considerations).
* Keep in mind that all simultaneous read and write operations across all client connections for a given database or container will be held to the single provisioned throughput set for that target.
* RU consumption is incurred, regardless of the Cosmos DB APIs being used.
* The partition strategy for a collection can have a significant impact on the cost of a system. For more information, see [Partitioning and horizontal scaling in Azure Cosmos DB](partitioning-overview.md#choose-partitionkey).
* Use representative documents and representative queries.
  * These are documents and queries that you think are close to what the operational system will encounter.
  * The best way to get these representative documents and queries is to instrument the usage of your application. It is always better to make this a data-driven decision.
* Measure cost periodically.
  * Index changes, the size of indexes can affect the cost. 
  * It will be helpful to create some repeatable (maybe even automated) test of the representative documents and queries.
  * Ensure your representative documents and queries are still representative.

The method to determine the cost of a request, is different for each API:

* [Core API](find-request-unit-charge.md)
* [Cassandra API](find-request-unit-charge-cassandra.md)
* [Gremlin API](find-request-unit-charge-gremlin.md)
* [Mongo DB API](find-request-unit-charge-mongodb.md)
* [Table API](find-request-unit-charge-table.md)

## Write requests

The cost of write operations tends to be easy to predict. You will insert records and document the cost that Cosmos reported.

If you have documents of different size and/or documents that will use different indexes, it is important to measure all of them.
You may find that all your representative documents are close enough in cost that you can assign a single value across all writes.
For example, if you found costs of 13.14 RU, 16.01 RU, and 12.63 RU, you might average those to a cost of 14 RU.

## Read requests

The cost of query operations can be much harder to predict for the following reasons:

* If your system supports user-defined queries, you will need to map the incoming queries to the representative queries to help determine the cost. There are various forms this might take:
  * It may be possible to match the queries exactly. If there is no direct match, you may have to find the representative query that it is closest to.
  * You may find that you can calculate a cost based on characteristics of the query. For example, you may find that each clause of the query has a certain cost,
  or that indexed properties cost "x" while those not indexed cost "y", etc.
* The number of results can vary and unless you have statistics on this, you won't be able to predict the RU impact from the return payload.

It is likely you will not have a single cost of query operations, but rather some function that evaluates the query and calculates a cost.
If you are using the Core API, you could then evaluate the actual cost of the operation and determine how accurate your estimation was
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

For more information on autoscaling, see [Create Azure Cosmos containers and databases with autoscale throughput
](provision-throughput-autoscale.md).

### Queue-Based Load Leveling pattern

You could employ a queue that acts as a buffer between a client and Cosmos DB in order to smooth intermittent heavy loads that can cause the service to fail or the task to time out.

This pattern is useful to any application that uses services that are subject to overloading. However, this pattern isn't useful if the application expects a response from the service with minimal latency.

This pattern is often very well suited to ingest operations.

For more information about this pattern, see [Queue-Based Load Leveling pattern](https://docs.microsoft.com/azure/architecture/patterns/queue-based-load-leveling.md).

### Cache-Aside pattern

You might consider loading data on demand into a cache instead of querying Cosmos DB every time. This can improve performance and also helps to maintain consistency between data held in the cache and data in the underlying data store.

For more information, see: [Cache-Aside pattern](https://docs.microsoft.com/azure/architecture/patterns/cache-aside).

### Materialized View pattern

You might pre-populated views into other collections after storing the data in Cosmos DB when the data isn't ideally formatted for required query operations. This can help support efficient querying and data extraction, and improve application performance.

For more information, see [Materialized View pattern](architecture/patterns/materialized-view.md).
