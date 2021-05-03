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
* If you simply send the entire job to Cosmos DB, you should expect a large number of transient faults and a large buffer of requests that you must retry. This is because the total number of RUs needed for the job (100k) is much greater than the provisioned maximum (20k). Some of the records will be excepted into the database, but more will be rejected, and the rejected records will need to be retried.
* Instead if you parcel the job into 5 batches, and send those requests evenly across 5 seconds, you should expect no faults and overall faster throughput as each batch would be at or under the provisioned 20K.

Spreading the requests across a period of time can be accomplished by introducing a rate limiting mechanism in your code.

Its important to keep in mind that RU throughout characteristics are effected to the number of partitions in a given container. In the example above, that 20k RU provisioned throughput would actually be evenly shared across the number of partitions in the target container. This could further inform the way you'd want to parcel the overall workload.

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

Before measuring any costs, you should configure all indexes. If you change indexes, you will need to re-run all cost calculations.

Depending on protocol, Cosmos will index all properties. You should avoid running a system in this mode as the number of RUs consumed to write an item increases as the item property count increases - always specifically choose the properties to index.

## Measuring Cost

There are some key concepts when measuring cost:

* Consider all factors that affect RU usage, as described in [request unit considerations](request-units.md#request-unit-considerations).
* Keep in mind that all simultaneous read and write operations across all client connections for given database or container will be held to the single provision throughput set for that target.
* RU consumption is incurred, regardless of the Cosmos DB APIs being used.
* Use representative documents and representative queries
  * These are documents and queries that you think are close to what the operational system will encounter.
  * The best way to get these representative documents and queries is to instrument the usage of your application. It is always better to make this a data-driven decision.
* Measure cost periodically
  * Index changes, the size of indexes, and the number of partitions can affect the cost. The volume of data can also have an affect in some cases, for example, if you pack lots of documents into a single logical partition.
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

For more information about this pattern, see [Queue-Based Load Leveling pattern](architecture/patterns/queue-based-load-leveling).
