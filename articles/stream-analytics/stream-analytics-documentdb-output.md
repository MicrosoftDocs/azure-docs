---
title: Azure Stream Analytics output to Cosmos DB
description: This article describes how to use Azure Stream Analytics to save output to Azure Cosmos DB for JSON output, for data archiving and low-latency queries on unstructured JSON data.
services: stream-analytics
author: mamccrea
ms.author: mamccrea
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 01/11/2019
ms.custom: seodec18
---
# Azure Stream Analytics output to Azure Cosmos DB  
Stream Analytics can target [Azure Cosmos DB](https://azure.microsoft.com/services/documentdb/) for JSON output, enabling data archiving and low-latency queries on unstructured JSON data. This document covers some best practices for implementing this configuration.

For those who are unfamiliar with Cosmos DB, take a look at [Azure Cosmos DB’s learning path](https://azure.microsoft.com/documentation/learning-paths/documentdb/) to get started. 

> [!Note]
> At this time, Azure Stream Analytics only supports connection to Azure Cosmos DB using **SQL API**.
> Other Azure Cosmos DB APIs are not yet supported. If you point Azure Stream Analytics to the Azure Cosmos DB accounts created with other APIs, the data might not be properly stored. 

## Basics of Cosmos DB as an output target
The Azure Cosmos DB output in Stream Analytics enables writing your stream processing results as JSON output into your Cosmos DB container(s). Stream Analytics doesn't create containers in your database, instead requiring you to create them upfront. This is so that the billing costs of Cosmos DB containers are controlled by you, and so that you can tune the performance, consistency, and capacity of your containers directly using the [Cosmos DB APIs](https://msdn.microsoft.com/library/azure/dn781481.aspx).

> [!Note]
> You must add 0.0.0.0 to the list of allowed IPs from your Azure Cosmos DB firewall.

Some of the Cosmos DB container options are detailed below.

## Tune consistency, availability, and latency
To match your application requirements, Azure Cosmos DB allows you to fine-tune the database and containers and make trade-offs between consistency, availability, latency and throughput. Depending on what levels of read consistency your scenario needs against read and write latency, you can choose a consistency level on your database account. Throughput can be improved by scaling up Request Units(RUs) on the container. Also by default, Azure Cosmos DB enables synchronous indexing on each CRUD operation to your container. This is another useful option to control the write/read performance in Azure Cosmos DB. For more information, review the [change your database and query consistency levels](../cosmos-db/consistency-levels.md) article.

## Upserts from Stream Analytics
Stream Analytics integration with Azure Cosmos DB allows you to insert or update records in your container based on a given Document ID column. This is also referred to as an *Upsert*.

Stream Analytics uses an optimistic upsert approach, where updates are only done when insert fails with a Document ID conflict. With Compatibility Level 1.0, this update is performed as a PATCH, so it enables partial updates to the document, that is, addition of new properties or replacing an existing property is performed incrementally. However, changes in the values of array properties in your JSON document result in the entire array getting overwritten, that is, the array isn't merged. With 1.2, upsert behavior is modified to insert or replace the document. This is described further in the Compatibility Level 1.2 section below.

If the incoming JSON document has an existing ID field, that field is automatically used as the Document ID column in Cosmos DB and any subsequent writes are handled as such, leading to one of these situations:
- unique IDs lead to insert
- duplicate IDs and 'Document ID' set to 'ID' leads to upsert
- duplicate IDs and 'Document ID' not set leads to error, after the first document

If you want to save <i>all</i> documents including the ones with a duplicate ID, rename the ID field in your query (with the AS keyword) and let Cosmos DB create the ID field or replace the ID with another column's value (using the AS keyword or by using the 'Document ID' setting).

## Data partitioning in Cosmos DB
Azure Cosmos DB [unlimited](../cosmos-db/partition-data.md) containers are the recommended approach for partitioning your data, as Azure Cosmos DB automatically scales partitions based on your workload. When writing to unlimited containers, Stream Analytics uses as many parallel writers as the previous query step or input partitioning scheme.
> [!NOTE]
> At this time, Azure Stream Analytics only supports unlimited containers with partition keys at the top level. For example, `/region` is supported. Nested partition keys (e.g. `/region/name`) are not supported. 

Depending on your choice of partition key you might receive this _warning_:

`CosmosDB Output contains multiple rows and just one row per partition key. If the output latency is higher than expected, consider choosing a partition key that contains at least several hundred records per partition key.`

It is important to choose a partition key property that has a number of distinct values, and lets you distribute your workload evenly across these values. As a natural artifact of partitioning, requests involving the same partition key are limited by the maximum throughput of a single partition. Additionally, the storage size for documents belonging to the same partition key is limited to 10GB. An ideal partition key is one that appears frequently as a filter in your queries and has sufficient cardinality to ensure your solution is scalable.

A partition key is also the boundary for transactions in DocumentDB's stored procedures and triggers. You should choose the partition key so that documents that occur together in transactions share the same partition key value. The article [Partitioning in Cosmos DB](../cosmos-db/partitioning-overview.md) gives more details on choosing a partition key.

For fixed Azure Cosmos DB containers, Stream Analytics allows no way to scale up or out once they're full. They have an upper limit of 10 GB and 10,000 RU/s throughput.  To migrate the data from a fixed container to an unlimited container (for example, one with at least 1,000 RU/s and a partition key), you need to use the [data migration tool](../cosmos-db/import-data.md) or the [change feed library](../cosmos-db/change-feed.md).

The ability to write to multiple fixed containers is being deprecated and is not recommended for scaling out your Stream Analytics job.

## Improved throughput with Compatibility Level 1.2
With Compatibility level 1.2, Stream Analytics supports native integration to bulk write into Cosmos DB. This enables writing effectively to Cosmos DB with maximizing throughput and efficiently handle throttling requests. The improved writing mechanism is available under a new compatibility level due to an upsert behavior difference.  Prior to 1.2, the upsert behavior is to insert or merge the document. With 1.2, upserts behavior is modified to insert or replace the document. 

Before 1.2, uses a custom stored procedure to bulk upsert documents per partition key into Cosmos DB, where a batch is written as a transaction. Even when a single record hits a transient error (throttling), the whole batch must be retried. This made scenarios with even reasonable throttling relatively slower. Following comparison shows how such jobs would behave with 1.2.

The following example shows two identical Stream Analytics jobs reading from same Event Hub input. Both Stream Analytics jobs are [fully partitioned](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-parallelization#embarrassingly-parallel-jobs) with a passthrough query and write to identical CosmosDB containers. Metrics on the left are from the job configured with compatibility level 1.0 and the ones on the right are configured with 1.2. A Cosmos DB container's partition key is a unique GUID coming from the input event.

![stream analytics metrics comparison](media/stream-analytics-documentdb-output/stream-analytics-documentdb-output-3.png)

Incoming event rate in Event Hub is 2x higher than Cosmos DB containers (20K RUs) are configured to intake, so throttling is expected in Cosmos DB. However, the job with 1.2, is consistently writing at a higher throughput (Output Events/minute) and with a lower average SU% utilization. In your environment, this difference will depend on few more factors such as choice of event format, input event/message size, partition keys, query etc.

![cosmos db metrics comparison](media/stream-analytics-documentdb-output/stream-analytics-documentdb-output-2.png)

With 1.2, Stream Analytics is more intelligent in utilizing 100% of the available throughput in Cosmos DB with very few resubmissions from throttling/rate limiting. This provides a better experience for other workloads like queries running on the container at the same time. In case you need to try out how ASA scales out with Cosmos DB as a sink for 1k to 10k messages/second, here is an [azure samples project](https://github.com/Azure-Samples/streaming-at-scale/tree/master/eventhubs-streamanalytics-cosmosdb) that lets you do that.
Please note that Cosmos DB output throughput is identical with 1.0 and 1.1. Since 1.2 is currently not the default, you can [set compatibility level](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-compatibility-level) for a Stream Analytics job by using portal or by using the [create job REST API call](https://docs.microsoft.com/rest/api/streamanalytics/stream-analytics-job). It’s *strongly recommended* to use Compatibility Level 1.2 in ASA with Cosmos DB. 



## Cosmos DB settings for JSON output

Creating Cosmos DB as an output in Stream Analytics generates a prompt for information as seen below. This section provides an explanation of the properties definition.

![documentdb stream analytics output screen](media/stream-analytics-documentdb-output/stream-analytics-documentdb-output-1.png)

|Field           | Description|
|-------------   | -------------|
|Output alias    | An alias to refer this output in your ASA query.|
|Subscription    | Choose the Azure subscription.|
|Account ID      | The name or endpoint URI of the Azure Cosmos DB account.|
|Account key     | The shared access key for the Azure Cosmos DB account.|
|Database        | The Azure Cosmos DB database name.|
|Container name | The container name to be used. `MyContainer` is a sample valid input - one container named `MyContainer` must exist.  |
|Document ID     | Optional. The column name in output events used as the unique key on which insert or update operations must be based. If left empty, all events will be inserted, with no update option.|
