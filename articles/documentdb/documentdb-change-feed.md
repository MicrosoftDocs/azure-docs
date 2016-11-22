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
[Azure DocumentDB](documentdb-introduction.com) is a fast and flexible NoSQL database service that is used for storing high-volume transactional and operational data with predictable single-digit millsecond latency for reads and writes. This makes it well-suited for IoT, gaming, retail, and operational logging applications. A common design pattern in these applications is to track changes made to DocumentDB data, and update materialized views, perform real-time analytics, archive data to cold storage, and trigger notifications on certain events based on these changes. DocumentDB's **ChangeFeed support** allows you to build efficient and scalable solutions for each of these patterns.

With ChangeFeed support, DocumentDB provides a real-time sorted list of changes made to documents within a DocumentDB collection in the order in which it was applied. These changes can be read and processed by a single consumer, or distributed across a number of consumers. Let's take a look at the APIs for ChangeFeed and how you can use this to scale your applications.

![Using DocumentDB Change Feed to power real-time analytics and event-driven computing scenarios](./media/documentdb-change-feed/changefeed.png)

# How ChangeFeed works in Azure DocumentDB
DocumentDB provides the ability to incrementally read updates made to a DocumentDB collection. The change log can be obtained by populating two new request headers to DocumentDB's `ReadDocumentFeed` API. This change log has the following properties:

* Changes to documents within a collection will be available immediately in real-time in the change log with no lag.
* Changes to documents will appear only once in the change log.
* Changes will be ordered by time within each partition key value. There is no guaranteed order across partition-key values.
* Changes can be synchronized from any point-in-time, i.e. there is no time limit/window for which changes are available.
* Only the most recent change for a given document is guaranteed to be included in the change log. Intermediate changes may not be available.
* Changes are available in chunks of partition key ranges. This allows change logs from large collections to be processed in parallel by multiple consumers/servers.
* Changes include inserts and updates to documents. To capture deletes, you must use [TTL expiration for documents](documentb-expire-data.md).

DocumentDB's change log is enabled by default for all accounts, and does not incure any additional costs on your account. You can use your [provisioned throughput](documentdb-request-units.md) in your write region or any [read region](documentdb-distribute-data-globally.md) to read from the change log, just like any other operation from DocumentDB.

## Working with the REST API

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

ChangeFeed support offers a scalable and efficient way of integrating DocumentDB with stream processing solutions like [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/) and [Apache Spark](http://spark.apache.org/), batch analytics like [Apache Hadoop](https://azure.microsoft.com/services/hdinsight/) and [Azure Data Lake](https://azure.microsoft.com/services/data-lake-analytics/), and compute services like [Azure Functions](https://azure.microsoft.com/services/functions/). This makes it easy to implement Lambda architectures with DocumentDB as the write-optimized store. 