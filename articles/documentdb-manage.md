<properties 
	pageTitle="Manage DocumentDB capacity and performance | Azure" 
	description="Learn how you can elastically scale DocumentDB to meet the capacity needs of your application." 
	services="documentdb" 
	authors="mimig1, johnfmacintyre" 
	manager="jhubbard" 
	editor="cgronlun" 
	documentationCenter=""/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/17/2015" 
	ms.author="mimig"/>

#Manage DocumentDB capacity and performance
DocumentDB is a fully managed, scalable document oriented NoSQL database service.  With DocumentDB, you don’t have to rent virtual machines, deploy software, monitor databases or worry about disaster recovery. DocumentDB is operated and continuously monitored by Microsoft engineers to deliver world class availability, performance, and data protection.  

You can get started with DocumentDB by creating a database account through the [Microsoft Azure Preview Management Portal](https://portal.azure.com/). DocumentDB is offered in stackable capacity units (CUs) of solid-state drive (SSD) backed storage and throughput. You can elastically scale DocumentDB to meet the performance and storage needs of your application. 

Each capacity unit comes with a quota of collections for storing document data, provisioned document storage and provisioned throughput as request units per second. If the capacity requirements of your application change, you can scale up or scale down the amount of provisioned capacity in your database account. Capacity provisioned under a database account is available for all databases and collections that exist or are created within the account.

> [AZURE.NOTE] Each collection can scale in both storage and throughput up to the maximum supported [limit](documentdb-limits.md). Throughput will be evenly distributed to all collections up to the maximum limit per collection.

When your application exceeds performance levels for one or multiple collections, requests will be throttled on a per collection basis. This means that some application requests may succeed while others may be throttled.

##<a name="DBaccount"></a>Database account and administrative resources
As an Azure subscriber, you can provision one or more DocumentDB database accounts. Each database account comes with a quota of administrative resources including databases, users and permissions. These resources are subject to [limits and quotas](documentdb-limits.md). If you need additional administrative resources, please contact support.   

##<a name="DBstorage"></a> Databases with unlimited document storage
A single DocumentDB database can contain practically an unlimited amount of document storage partitioned by collections. Collections form the transaction domains for the documents contained within them. A DocumentDB database is elastic by default – ranging from a few GB to potentially terabytes of SSD backed document storage and provisioned throughput. Unlike a traditional RDBMS database, a database in DocumentDB is not scoped to a single machine.   

With DocumentDB, as your application’s scale needs grow you can create more collections or databases or both. Indeed, various first party applications within Microsoft have been using DocumentDB at consumer scale by creating extremely large DocumentDB databases each containing thousands of collections with terabytes of document storage. You can grow or shrink a database by adding or removing collections to meet your application’s scale requirements. You can create any number of collections within a database subject to offer availability and the amount of capacity units you purchase. The SSD backed storage and throughput provisioned for you can be spread across the collections under the databases in your database account. 

##<a name="DBCollections"></a>Database collections
Each DocumentDB database can contain one or more collections. A collection provides the scope for document storage and query execution. A collection is also a transaction domain for all the documents contained within it. You can create any number of collections to meet the scale requirements of your applications. In order to create collections, you first need to buy one or more capacity units (CU). Each capacity unit includes a quota of collections, if you reach the collection quota for your account you can purchase additional capacity units.  

>[AZURE.NOTE] Each collection supports storage for up to 10GB of document data. 

##<a name="ProvStorage"></a>Provisioned storage and throughput as capacity units
You can provision stackable units of SSD backed document storage and throughput as capacity units (CU). You can elastically scale DocumentDB with predictable performance by purchasing more capacity units, to meet your application’s needs for read scale, storage and throughput.  
 
Each CU comes with 3 elastic collections, 10GB of SSD backed provisioned document storage and 2000 request units (RU) worth of provisioned throughput. The provisioned storage and the throughput capacity associated with a CU is distributed across the DocumentDB collections you create.   

##<a name="ProvThroughput"></a>Request units and database operations
DocumentDB allows for a rich set of database operations including relational and hierarchical queries with UDFs, stored procedures and triggers – all operating on the documents within a database collection. The processing cost associated with each of these operations will vary based on the CPU, IO and memory required to complete the operation. Instead of thinking about and managing hardware resources, you can think of a request unit (RU) as a single measure for the resources required to perform various database operations and service an application request.

Request units are provisioned for each Database Account based on the number of capacity units that you purchase. In the Preview of DocumentDB, each collection created is assigned a request unit limit. The allocation is calculated by evenly allocating all request units from the purchased capacity units to the number of collections created within an Account. For example, for an Account with 2 capacity units purchased and 4 collections created, each collection is assign 2 capacity units x 2,000 request units / 4 collections for an allocation of 1,000 request units per collection. When Azure DocumentDB is generally available, the service will no longer spread request units across collections within an Account. Request units will be purchased and assigned to specific collections based on performance levels. For more information refer to [DocumentDB Performance Levels](documentdb-performance-levels.md). 

>[AZURE.NOTE] During the Preview of Azure DocumentDB, each collection cannot be allocated more than 2,000 request units. 

Request unit consumption is evaluated as a rate per second. Applications that exceed the provisioned request unit rate for their account will be throttled until the rate drops below the reserved level for each collection. If your application requires a higher level of throughput, you can purchase additional capacity units.

A request unit is a normalized measure of request processing cost. A single request unit represents the processing capacity required to read a single 1KB JSON document consisting of 10 unique property values. The request unit charge assumes a consistency level set to the default “Session” and all of documents automatically indexed. A request to insert, replace or delete the same document will consume more processing from the service and thereby more request units. Each request response from the service includes a custom header (x-ms-request-charge) that measures the request units consumed for the request. This header is also accessible through the SDKs. In the .Net SDK, RequestCharge is a property of the ResourceResponse object.

There are several factors that impact the request units consumed for an operation against a DocumentDB Database Account. These factors include:

- Document size – as document sizes increase the units consumed to read or write the data will also increase.
- Property count – assuming default indexing of all properties, the units consumed to write a document will increase as the property count increases
- Data consistency – when using data consistency levels of Strong or Bounded Staleness, additional units will be consumed to read documents
- Indexed properties – an index policy on each collection determines which properties are indexed by default. You can reduce your request unit consumption by limiting the number of indexed properties
- Document indexing – by default each document is automatically indexed, you will consume fewer request units if you choose not to index some of your documents

Queries, stored procedures and triggers will consume request units based on the complexity of the operations being performed. As you develop your application, inspect the request charge header to better understand how each operation is consuming request unit capacity.

##<a name="Collections"></a>Collections and provisioned throughput
Provisioned throughput for your database account is allocated uniformly across all collections up to the maximum throughput level (Request Units) for a single collection. For example, if you purchase a single capacity unit and create a single collection, all of the provisioned throughput for the CU will be available to the collection. If an additional collection is created the provisioned throughput will be allocated evenly with each collection receiving half of all provisioned throughput.  

##<a name="Consistency"></a>Choice of consistency level and throughput
The choice of default consistency level has an impact on the throughput and latency.  You can set the default consistency level both programmatically and through the Azure portal. You can also override the consistency level on a per request basis. By default, the consistency level is that of session which provides monotonic read/writes and read your write guarantees. Session consistency is great for user-centric applications and provides an ideal balance of consistency and performance trade-offs.   

For instructions on changing your consistency level on the Azure Preview Management Portal, see How to: Manage DocumentDB Consistency Settings in [How to Manage a DocumentDB Account](documentdb-manage-account.md).

##<a name="IndexOverhead"></a>Provisioned document storage and index overhead
With each CU purchased your account is provisioned with 10GB of SSD backed document storage. The 10GB of document storage includes the documents plus storage for the index. By default, a DocumentDB collection is configured to automatically index all of the documents without explicitly requiring any secondary indices or schema. Based production usage in consumer scale first party applications using DocumentDB, the typical index overhead is between 2-20%. The indexing technology used by DocumentDB ensures that regardless of the values of the properties, the index overhead does not exceed more than 80% of the size of the documents with default settings.  

By default all documents are indexed by DocumentDB automatically. However, in case you want to fine tune the index overhead, you can chose to remove certain documents from being indexed at the time of inserting or replacing a document. You can configure a DocumentDB collection to exclude all documents within the collection from being indexed. You can also configure a DocumentDB collection to selectively index only a certain properties or paths with wildcards of your JSON documents.  Excluding properties or documents also improves the write throughput – which means you will consume fewer request units.   
 
##<a name="NextSteps"></a>Next steps
For instructions on managing your DocumentDB account in the Azure Preview portal, see How to: Manage DocumentDB Consistency Settings in [How to Manage a DocumentDB Account](documentdb-manage-account.md).

For instructions on monitoring performance levels on the Azure Preview portal, see [Monitor a DocumentDB account](documentdb-monitor-accounts.md).
