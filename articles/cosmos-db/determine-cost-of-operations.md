---
title: Determine cost of operations in Azure Cosmos DB
description: This article explains how to determine the cost of operations in Azure Cosmos DB.
author: pelasne

---

# Determining the cost of operations in Azure Cosmos DB

This article describes how to determine the [Request Unit](request-units.md) cost of your operations (read and write requests), and how it is counted against your provisioned throughput. 
It is important to determine this cost early, as if you exceed your allotment, you will receive `429 Too many requests` errors and eventually `503 Service Unavailable` errors.

> [!NOTE]
> Different protocols in Cosmos behave differently, in some cases you will immediately get TooManyRequests errors and in some cases the Cosmos gateway will buffer some requests for a short period of time. However, sustaining costs above your capacity will in every case result in TooManyRequests errors.

## An approach to determining cost

An approach to determining cost is the following:

1. Profile your application so you have data about what writes and read requests are used.
1. Define all indexes in Cosmos DB.
1. Populate the collection with a reasonable amount of data (could be sample data). If you expect your application to normally have millions of records, populate it with millions of records.
1. Write your representative documents and record the RU cost.
1. Run your representative queries and record the RU cost.
1. Implement a function in your application to determine the cost based on your findings.
1. Load test your application and verify that you don't exceed the provisioned capacity.
1. Re-test the RU costs periodically.

## Indexing

Before measuring any costs, you should configure all indexes. If you change indexes, you will need to re-run all cost calculations.

Depending on protocol, Cosmos will index all properties. You should avoid running a system in this mode - always specifically choose the properties to index.

## Measuring Cost

There are some key concepts when measuring cost:

- Consider all factors that affect RU usage, as described in [request unit considerations](request-units.md#request-unit-considerations).
- Use representative documents and representative queries
  - These are documents and queries that you think are close to what the operational system will encounter.
  - The best way to get these representative documents and queries is to instrument the usage of your application. It is always better to make this a data-driven decision.
- Measure cost periodically
  - Index changes, the size of indexes, and the number of partitions can affect the cost. The volume of data can also have an affect in some cases, for example, if you pack lots of documents into a single logical partition.
  - It will be helpful to create some repeatable (maybe even automated) test of the representative documents and queries.
  - Ensure your representative documents and queries are still representative.

### Measuring cost using the Core API

Every operation executed under the Core API returns the cost of the operation. Specifics on how to access that property on the return are documented in 
[find request unit charge](find-request-unit-charge.md).

Unfortunately, some APIs like the Mongo API do not return the cost of the operation. You can run a database command of "getLastRequestStatistics" to get the 
cost of the last operation in this session as documented in [find request unit charge mongodb](find-request-unit-charge-mongodb). There is no RU cost for running the 
"getLastRequestStatistics" command. In a system that supports asynchronous operations, the last operation is not guaranteed to be the operation you wanted to measure.
Typically you will need your measurement tests to be synchronous in a different session from your operational session. 

## Write requests

The cost of write operations tends to be easy to predict. You will insert records and document the cost that Cosmos reported.

If you have documents of different size and/or documents that will use different indexes, it is important to measure all of them. 
You may find that all your representative documents are close enough in cost that you can assign a single value across all writes. 
For example, if you found costs of 13.14 RU, 16.01 RU, and 12.63 RU, you might average those to a cost of 14 RU.

## Read requests

Unfortunately, the cost of query operations tends to be much harder to predict for the following reasons:

- If your system supports user-defined queries, you will need to map the incoming queries to the representative queries to help determine the cost. There are various forms this might take:
  - It may be possible to match the queries exactly. If there is no direct match, you may have to find the representative query that it is closest to.
  - You may find that you can calculate a cost based on characteristics of the query. For example, you may find that each clause of the query has a certain cost, 
  or that indexed properties cost "x" while those not indexed cost "y", etc.
- The number of results can vary and unless you have statistics on this, you won't be able to predict the RU impact from the return payload.

It is likely you will not have a single cost of query operations, but rather some function that evaluates the query and calculates a cost. 
If you are using the Core API, you could then evaluate the actual cost of the operation and determine how accurate your estimation was 
(tuning of this estimation could even happen automatically within the code). 
