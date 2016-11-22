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
DocumentDB provides the ability to incrementally read updates made to a DocumentDB collection. This change log has the following properties:

* Changes to documents within a collection will be available immediately in real-time in the change log with no lag.
* Changes to documents will appear only once in the change log.
* Changes will be ordered by time within each partition key value. There is no guaranteed order across partition-key values.
* Changes can be synchronized from any point-in-time, i.e. there is no time limit/window for which changes are available.
* Only the most recent change for a given document is guaranteed to be included in the change log. Intermediate changes may not be available.
* Changes are available in chunks of partition key ranges. This allows change logs from large collections to be processed in parallel by multiple consumers/servers.
* Changes include inserts and updates to documents. To capture deletes, you must use [TTL expiration for documents](documentb-expire-data.md).

DocumentDB's change log is enabled by default for all accounts, and does not incure any additional costs on your account. You can use your [provisioned throughput](documentdb-request-units.md) in your write region or any [read region](documentdb-distribute-data-globally.md) to read from the change log, just like any other operation from DocumentDB. In the following section, we describe how to acess the change log using the DocumentDB REST API and SDKs.

## Working with the REST API and SDK
DocumentDB provides elastic containers or storage and throughput called **collections**. Data within collections is logically grouped using [partition keys](documentdb-partition-data.md) for scalability and performance. DocumentDB provides various APIs for accessing this data, including lookup by ID (Read/Get), query, and read-feeds (scans). The change log can be obtained by populating two new request headers to DocumentDB's `ReadDocumentFeed` API. 

### ReadFeed
Let's take a brief look at how ReadFeed works. DocumentDB supports reading a feed of documents within a collection via the `ReadDocumentFeed` API. For example, the following request returns a page of documents inside the `serverlogs` collection. 

	GET https://mydocumentdb.documents.azure.com/dbs/smalldb/colls/smallcoll HTTP/1.1
	x-ms-date: Tue, 22 Nov 2016 17:05:14 GMT
	authorization: type%3dmaster%26ver%3d1.0%26sig%3dgo7JEogZDn6ritWhwc5hX%2fNTV4wwM1u9V2Is1H4%2bDRg%3d
	Cache-Control: no-cache
	x-ms-consistency-level: Strong
	User-Agent: Microsoft.Azure.Documents.Client/1.10.27.5
	x-ms-version: 2016-07-11
	Accept: application/json
	Host: mydocumentdb.documents.azure.com

Results can be limited by using the `x-ms-max-item-count` header, and reads can be resumed by resubmitting the request with a `x-ms-continuation` header returned in the previous response.

Let's take a brief look at how ReadFeed works. DocumentDB supports reading a feed of documents within a collection via the `ReadDocumentFeed` API. For example, the following request returns a page of documents inside the `serverlogs` collection. 

	GET https://mydocumentdb.documents.azure.com/dbs/smalldb/colls/smallcoll HTTP/1.1
	x-ms-date: Tue, 22 Nov 2016 17:05:14 GMT
	authorization: type%3dmaster%26ver%3d1.0%26sig%3dgo7JEogZDn6ritWhwc5hX%2fNTV4wwM1u9V2Is1H4%2bDRg%3d
	Cache-Control: no-cache
	x-ms-consistency-level: Strong
	User-Agent: Microsoft.Azure.Documents.Client/1.10.27.5
	x-ms-version: 2016-07-11
	Accept: application/json
	Host: mydocumentdb.documents.azure.com

Results can be limited by using the `x-ms-max-item-count` header, and reads can be resumed by resubmitting the request with a `x-ms-continuation` header returned in the previous response. When performed from a single client, `ReadDocumentFeed` iterates through results across partitions serially.

**ReadDocumentFeed**
![DocumentDB ReadFeed serial execution](./media/documentdb-change-feed/readfeedserial.png)

### Distributed Execution of ReadFeed
For collections that contain terabytes of data or more, or ingest a large volume of updates, serial execution of read feed from a single client machine might not be a practical solution. In order to support these big data scenarios, DocumentDB provides APIs to distribute `ReadDocumentFeed` calls transparently across a number of client readers/consumers. 

**Distributed ReadDocumentFeed**
![DocumentDB ReadFeed serial execution](./media/documentdb-change-feed/readfeedparallel.png)

### Performing an Incremental ReadFeed
With the new REST API version `2016-07-11` we introduce the following headers for performing incremental reads using ReadFeed. 

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