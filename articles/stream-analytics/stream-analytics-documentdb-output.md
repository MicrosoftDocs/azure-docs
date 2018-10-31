---
title: Azure Stream Analytics output to Cosmos DB 
description: This article describes how to use Azure Stream Analytics to save output to Azure Cosmos DB for JSON output, for data archiving and low-latency queries on unstructured JSON data.
services: stream-analytics
author: jseb225
ms.author: jeanb
manager: kfile
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 03/28/2017
---
# Azure Stream Analytics output to Azure Cosmos DB  
Stream Analytics can target [Azure Cosmos DB](https://azure.microsoft.com/services/documentdb/) for JSON output, enabling data archiving and low-latency queries on unstructured JSON data. This document covers some best practices for implementing this configuration.

For those who are unfamiliar with Cosmos DB, take a look at [Azure Cosmos DB’s learning path](https://azure.microsoft.com/documentation/learning-paths/documentdb/) to get started. 

> [!Note]
> At this time, Azure Stream Analytics only supports connection to Azure Cosmos DB using **SQL API**.
> Other Azure Cosmos DB APIs are not yet supported. If you point Azure Stream Analytics to the Azure Cosmos DB accounts created with other APIs, the data might not be properly stored. 

## Basics of Cosmos DB as an output target
The Azure Cosmos DB output in Stream Analytics enables writing your stream processing results as JSON output into your Cosmos DB collection(s). Stream Analytics doesn't create collections in your database, instead requiring you to create them upfront. This is so that the billing costs of Cosmos DB collections are controlled by you, and so that you can tune the performance, consistency, and capacity of your collections directly using the [Cosmos DB APIs](https://msdn.microsoft.com/library/azure/dn781481.aspx). 

Some of the Cosmos DB collection options are detailed below.

## Tune consistency, availability, and latency
To match your application requirements, Azure Cosmos DB allows you to fine tune the database and collections and make trade-offs between consistency, availability, and latency. Depending on what levels of read consistency your scenario needs against read and write latency, you can choose a consistency level on your database account. Also by default, Azure Cosmos DB enables synchronous indexing on each CRUD operation to your collection. This is another useful option to control the write/read performance in Azure Cosmos DB. For more information, review the [change your database and query consistency levels](../cosmos-db/consistency-levels.md) article.

## Upserts from Stream Analytics
Stream Analytics integration with Azure Cosmos DB allows you to insert or update records in your collection based on a given Document ID column. This is also referred to as an *Upsert*.

Stream Analytics uses an optimistic upsert approach, where updates are only done when insert fails with a Document ID conflict. This update is performed as a PATCH, so it enables partial updates to the document, that is, addition of new properties or replacing an existing property is performed incrementally. However, changes in the values of array properties in your JSON document result in the entire array getting overwritten, that is, the array isn't merged.

## Data partitioning in Cosmos DB
Azure Cosmos DB [unlimited](../cosmos-db/partition-data.md) are the recommended approach for partitioning your data, as Azure Cosmos DB automatically scales partitions based on your workload. When writing to unlimited containers, Stream Analytics uses as many parallel writers as previous query step or input partitioning scheme.
> [!Note]
> At this time, Azure Stream Analytics only supports unlimited collections with partition keys at the top level. For example, `/region` is supported. Nested partition keys (e.g. `/region/name`) are not supported. 

For fixed Azure Cosmos DB collections, Stream Analytics allows no way to scale up or out once they're full. They have an upper limit of 10 GB and 10,000 RU/s throughput.  To migrate the data from a fixed container to an unlimited container (for example, one with at least 1,000 RU/s and a partition key), you need to use the [data migration tool](../cosmos-db/import-data.md) or the [change feed library](../cosmos-db/change-feed.md).

Writing to multiple fixed containers is being deprecated and is not the recommended approach for scaling out your Stream Analytics job. The article [Partitioning and scaling in Cosmos DB](../cosmos-db/sql-api-partition-data.md) provides further details.

## Cosmos DB settings for JSON output
Creating Cosmos DB as an output in Stream Analytics generates a prompt for information as seen below. This section provides an explanation of the properties definition.


![documentdb stream analytics output screen](media/stream-analytics-documentdb-output/stream-analytics-documentdb-output-1.png)

Field           | Description 
-------------   | -------------
Output Alias    | An alias to refer this output in your ASA query   
Account Name    | The name or endpoint URI of the Azure Cosmos DB account 
Account Key     | The shared access key for the Azure Cosmos DB account
Database        | The Azure Cosmos DB database name
Collection Name | The collection name for the collection to be used. `MyCollection` is a sample valid input - one collection named `MyCollection` must exist.  
Document ID     | Optional. The column name in output events used as the unique key on which insert or update operations must be based. If left empty, all events will be inserted, with no update option.
