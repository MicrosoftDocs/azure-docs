---
title: Working with the ChangeFeed support in Azure DocumentDB | Microsoft Docs
description: Use Azure DocumentDB's ChangeFeed support to track changes in DocumentDB documents and perform event-based processing like triggers and keeping caches and analytics systems up-to-date. 
keywords: change feed
services: documentdb
author: arramac
manager: jhubbard
editor: mimig
documentationcenter: ''

ms.assetid: 58925d95-dde8-441b-8142-482b487e4bdd
ms.service: documentdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: rest-api
ms.topic: article
ms.date: 11/13/2016
ms.author: b-hoedid

---
# Working with the ChangeFeed support in Azure DocumentDB
Modern applications need to ingest large volumes of data at rapid rates, and perform actions on changes in the data in real-time. This pattern is common in IoT, gaming, mobile, and social applications. For example, a social media app might need to notify all friends of a person who updates their profile photo. Or consider a multi-player game might need to update its "leaderboard" when a player beats the previous high-score in the game. The traditional pattern for these applications has been to store data within a database, then poll the database by running a query. For many applications, this approach doesn't provide the required scalability to handle the volume and velocity of changes. DocumentDB's **ChangeFeed support** provides a simple and scalable solution to this problem.Using the ChangeFeed API, your applications to get real-time notifications to updates in your documents instead of having to poll for changes.

ChangeFeed support offers a scalable and efficient way of integrating DocumentDB with stream processing solutions like [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/) and [Apache Spark](http://spark.apache.org/), batch analytics like [Apache Hadoop](https://azure.microsoft.com/services/hdinsight/) and [Azure Data Lake](https://azure.microsoft.com/services/data-lake-analytics/), and compute services like [Azure Functions](https://azure.microsoft.com/services/functions/). This makes it easy to implement Lambda architectures with DocumentDB as the write-optimized store. 
''
## Working with the REST API

> [!NOTE]
> DocumentDB ChangeFeed Support is in preview. Please email askdocdb@microsoft.com for access to the preview REST API version and corresponding SDKs.

### ReadFeed
Let's first take a look at the typical way to read documents from a DocumentDB collection. DocumentDB supports reading a feed of documents within a collection via the `ReadFeed` API. For example, the following API request returns a page of documents inside the `serverlogs` collection. Results can be paginated by echoing the `x-ms-continuation` header returned in the previous response.

	GET https://querydemo.documents.azure.com/dbs/bigdb/colls/serverlogs/docs
	x-ms-max-item-count: -1
	x-ms-date: Tue, 15 Nov 2016 07:26:52 GMT
	authorization: type%3dmaster%26ver%3d1.0%26sig%3dpcM7iWGJthlDVY3V1gqi5ku%2bWH5%2fFUkiMPP%2fU0Xl3O0%3d
	x-ms-consistency-level: Session
	x-ms-version: 2016-07-11
	Accept: application/json
	Host: querydemo.documents.azure.com

### Performing an Incremental ReadFeed
With the new REST API version `2016-07-11` we introduce the following  headers for performing incremental reads using ReadFeed. 

Recall that DocumentDB collections use partitioning to scale-out data for higher storage and throughput. You can specify a partition key property for your collection, and data is organized within the physical partitions based on the values set for the partition key. In order to provides scalable processing of incremental changes, DocumentDB supports a scale-out model for the ReadFeed API based on ranges of partition keys.

By performing a `ReadPartitionKeyRanges` call on the collection, you can obtain a list of Partition Key Ranges for a collection. Updates to the documents within the collection are grouped into these partition key ranges, and you can read updates on a per-Partition Key Range basis.

**Headers for incremental ReadFeed**:
<table>
	<tr>
		<th>Header name</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>A-IM</td>
		<td>Must be set to "Incremental feed", or omitted otherwise</td>
	</tr>
	<tr>
		<td>If-None-Match</td>
		<td>Must be set to "*" to subscribe to new changes</td>
	</tr>
	<tr>
		<td>x-ms-documentdb-partitionkeyrangeid</td>
		<td>The partition key range ID for reading data.</td>
	</tr>
</table>

### Retrieving Partition Key Ranges for a Collection
You can retrive the Partition Key Ranges by requesting the `pkranges` resource. For example the following request:

	GET https://querydemo.documents.azure.com/dbs/bigdb/colls/serverlogs/pkranges HTTP/1.1
	x-ms-date: Tue, 15 Nov 2016 07:26:51 GMT
	authorization: type%3dmaster%26ver%3d1.0%26sig%3dEConYmRgDExu6q%2bZ8GjfUGOH0AcOx%2behkancw3LsGQ8%3d
	x-ms-consistency-level: Session
	x-ms-version: 2016-07-11
	Accept: application/json
	Host: querydemo.documents.azure.com

Returns the following response containing metadata about the partition key ranges:

	HTTP/1.1 200 Ok
	Content-Type: application/json
	x-ms-item-count: 4
	x-ms-schemaversion: 1.1
	Date: Tue, 15 Nov 2016 07:26:51 GMT

	{
	   "_rid":"qYcAAPEvJBQ=",
	   "PartitionKeyRanges":[
	      {
	         "_rid":"qYcAAPEvJBQCAAAAAAAAUA==",
	         "id":"0",
	         "_etag":"\"00002800-0000-0000-0000-580ac4ea0000\"",
	         "minInclusive":"",
	         "maxExclusive":"05C1CFFFFFFFF8",
	         "_self":"dbs\/qYcAAA==\/colls\/qYcAAPEvJBQ=\/pkranges\/qYcAAPEvJBQCAAAAAAAAUA==\/",
	         "throughputFraction":0.25,
	         "_ts":1477100776
	      },
	      ...
	   ],
	   "_count":4
	}

