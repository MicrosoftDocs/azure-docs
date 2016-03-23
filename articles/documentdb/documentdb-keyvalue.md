<properties 
	pageTitle="DocumentDB for high performance key-value database workloads | Microsoft Azure" 
	description="Learn how you can use DocumentDB for key-value storage for low latency and high throughput scenarios" 
	services="documentdb" 
	authors="arramac" 
	manager="jhubbard" 
	editor="cgronlun" 
	documentationCenter=""/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/23/2016" 
	ms.author="arramac"/>

#DocumentDB as a high-performance key-value database
Azure DocumentDB is commonly used as a document database, but its data model and functionality can be easily adapted to support key value workloads. In fact, document databases can be thought of as a subclass of key value databases with additional functionality like indexing and query. This article walks through how you can best use DocumentDB for key-value scenarios. After reading this article, you'll be able to answer the following questions:

* What are key-value and document databases?
* Why is DocumentDB ideal for high-performance key-value scenarios?
* How do I design a high-performance key-value database on DocumentDB?

## A brief introduction to key-value databases
Key-value databases (also known as key-value stores) are NoSQL databases which are designed to manage data organized in the form of associative arrays, also known as dictionaries. They support simple access methods like reads (by key) and writes, and partition data across one or multiple servers for scalability and high-availability. Key-value stores are used in a variety of use cases like log storage, managing user and session data, and shopping cart data.

Some popular key-value stores are [Azure Table Storage](storage-dotnet-how-to-use-tables/) and [Amazon DynamoDB](https://aws.amazon.com/dynamodb/). 

## DocumentDB as a high performance key-value store
Azure DocumentDB is commonly used as a document database, but its data model and functionality can be easily adapted to support key value workloads. In fact, document databases can be thought of as a subclass of key value databases with additional functionality like indexing and query.

* The JSON data model is a superset of the key-value model 
* DocumentDB supports read and write operations on JSON entities through a REST API
* DocumentDB natively partitions your data for high availability and scalability using a partition key property (since [API version 2015-12-16](https://msdn.microsoft.com/library/azure/dn781481.aspx))
* DocumentDB's SSD backed storage allows low latency order-of-millisecond response times
* DocumentDB's reserved throughput model allows you to think in terms of number of reads/writes instead of CPU/memory/IOPs of the underlying hardware
* DocumentDB's design lets you scale to massive request volumes in the order of billions of requests per day

If you have a use case that involves storing a large amount of data with low request rates, then Azure DocumentDB may not be right for you. We recommend that you use Azure Table Storage for such use cases.

## Getting started
While designing your key-value data storage tier on DcoumentDB, you must consider the following factors:

* What is the ideal primary key for your data?
* What are your throughput requirements (for reads and writes)?
* What are the consistency needs of your application?
* Do you need indexing and query capabilities?

Let's take a look at these in detail.

## Configuring your Primary Key
In DocumentDB, data is stored within collections which are practically unlimited in terms of storage and throughput. At collection creation time, you must configure a **partition key** property name for your collection. The value of this property within each JSON document or request will be used by DocumentDB to distribute documents among the available partitions. Documents must also have an **"id"** property that must be unique within all documents that have the same partition key value. In other terms, the primary key of an entity stored in DocumentDB is the compound key of (Partition Key Value, ID value). 

For a key-value scenario, a single key can be used to uniquely identify a document, i.e. the partition key and the "id" are one and the same. DocumentDB supports creation of a collection with "id" as the partition key property, e.g. as shown below in this code snippet:

    DocumentCollection myCollection = new DocumentCollection();
    myCollection.Id = "coll";
    myCollection.PartitionKey.Paths.Add("/id");

    await client.CreateDocumentCollectionAsync(
        UriFactory.CreateDatabaseUri("db"),
        myCollection,
        new RequestOptions { OfferThroughput = 10000 });
      
In the snippet above, we created a collection with OfferThroughput of 10,000 request units per second. In the next section, we take a deeper look at what this means and how to configure this for your application.

Some key-value databases support a hash key for partitioning and a range key within that partition. For example, Azure Table Storage has a fixed property called "PartitionKey". If you have data that can be represented hierarchically in this form, you configure your DocumentDB collection to have a fixed name like "/partitionKey" path as the partition key. DocumentDB does not require designating a property as your range key, since all JSON properties are automatically indexed within each partition. 

Here's a code sample of how you can create a collection with a partition key that's different from the document ID.

    DocumentCollection myCollection = new DocumentCollection();
    myCollection.Id = "coll";
    myCollection.PartitionKey.Paths.Add("/partitionKey");

    await client.CreateDocumentCollectionAsync(
        UriFactory.CreateDatabaseUri("db"),
        myCollection,
        new RequestOptions { OfferThroughput = 10000 });

Note that if you want to additional functionality like cross-document transactions within a partition, or query within or across partition keys, you can do that in addition to reads and writes.

## Configuring Performance

DocumentDB supports single-digit latency "point reads" or GETs on documents by supplying the partition key and ID. For example, the code snippet below shows how to read a document using the .NET SDK:

    ResourceResponse<Document> response = await client.ReadDocumentAsync(
      UriFactory.CreateDocumentUri("db", "coll", "XMS-001-FE24C"),
      new RequestOptions { PartitionKey = new PartitionKeyValue("XMS-0001")});

    DeviceReading reading = (DeviceReading)(dynamic)response.Resource;
    Console.WriteLine("Read document consumed {0} request units", response.RequestCharge);

In this, note the RequestCharge property that's returned from the operation. This represents the throughput consumed by the operation. This is an important metric to monitor while designing and working with DocumentDB. 

DocumentDB is designed for predictable performance. When you create a collection, you reserve throughput in terms of request units (RU) per second. Each request is assigned a request unit charge that is proportionate to the amount of system resources like CPU and IO consumed by the operation.  The simplest operation - a read of a 1KB operation with eventual consistency consumes 1 request unit. This is the same 1 RU regardless of the number of items stored or the number of concurrent requests running at the same. Larger documents require higher request units depending on the size. If you know the size of your entities and the number of reads you need to support for your application, you can provision the exact amount of throughput required for your application's read needs. 

DocumentDB supports create, replace, delete and upsert (insert or replace) operations also by partition key and ID. For example, the following snippet shows how to create an entity. Note that the partition key is optional, the DocumentDB SDK will automatically extract the partition key using the document content and the collection's metadata. 

    ResourceResponse<Document> response = await client.CreateDocumentAsync(
        UriFactory.CreateDocumentCollectionUri("db", "coll"),
        new DeviceReading
        {
            Id = "XMS-001-FE24C",
            DeviceId = "XMS-0001",
            MetricType = "Temperature",
            MetricValue = 105.00,
            Unit = "Fahrenheit",
            ReadingTime = DateTime.UtcNow
        });

    Console.WriteLine("Create document consumed {0} request units", response.RequestCharge);

Estimating the throughput you need for write operations is similar. A write of a 1 KB document takes 5 request units, plus an additional fractional overhead depending on the number of properties that need to be indexed. You can again determine the number of request units you need to provision based on the frequency of writes and the size of your documents.

For example, here's a table that shows how many request units to provision at three different document sizes (1KB, 4KB, and 64KB) and at two different performance levels (500 reads/second + 100 writes/second and 500 reads/second + 500 writes/second). 

Document size|Reads/second|Writes/second|Request units
---|---|---|---
1 KB|500|100|(500 * 1) + (100 * 5) = 1,000 RU/s
1 KB|500|500|(500 * 5) + (100 * 5) = 3,000 RU/s
4 KB|500|100|(500 * 1.3) + (100 * 7) = 1,350 RU/s
4 KB|500|500|(500 * 1.3) + (500 * 7) = 4,150 RU/s
64 KB|500|100|(500 * 10) + (100 * 48) = 9,800 RU/s
64 KB|500|500|(500 * 10) + (500 * 48) = 29,000 RU/s

Learn more about request units [here](documentdb-performance-levels.md).

## Configuring Consistency
DocumentDB supports a tunable consistency model - it supports strong consistency, eventual consistency, and two levels in-between (session and bounded staleness). The choice of consistency impacts the latency of your writes, as well as the throughput for read operations. Learn more about consistency levels [here](documentdb-consistency-levels.md).

## Configuring Indexing
If you do not need querying aside from key based access, you should consider configuring your collection's indexing policy to set indexing off. This will reduce the request unit overhead of indexing, and let you achieve higher ingestion rates. If your workload has spikes/bursts, then you might benefit from configuring your indexing mode to Lazy instead of turning it off completely. In this case, indexing will be performed only when the collection is running below maximum throughput capacity.

Learn more about indexing policies [here](documentdb-indexing-policies.md).

## Summary and Next steps
In this article, we looked at how to best use Azure DocumentDB for key-value scenarios. You can learn more about  programming with DocumentDB in the Develop section of the [DocumentDB documentation page](https://azure.microsoft.com/documentation/services/documentdb/). To learn more about pricing and managing data with Azure DocumentDB, explore these resources:

- [DocumentDB pricing](https://azure.microsoft.com/pricing/details/documentdb/)
- [Managing DocumentDB capacity](documentdb-manage.md) 
- [Modeling data in DocumentDB](documentdb-modeling-data.md)
- [Partitioning data in DocumentDB](documentdb-partition-data.md)
