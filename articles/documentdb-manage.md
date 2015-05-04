<properties 
	pageTitle="Manage DocumentDB capacity | Azure" 
	description="Learn how you can scale DocumentDB to meet the capacity needs of your application." 
	services="documentdb" 
	authors="mimig1" 
	manager="jhubbard" 
	editor="cgronlun" 
	documentationCenter=""/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/29/2015" 
	ms.author="mimig"/>

#Manage DocumentDB capacity needs
DocumentDB is a fully managed, scalable document oriented NoSQL database service.  With DocumentDB, you don’t have to rent virtual machines, deploy software, monitor databases or worry about disaster recovery. DocumentDB is operated and continuously monitored by Microsoft engineers to deliver world class availability, performance, and data protection.  

You can get started with DocumentDB by creating a database account through the [Azure Preview portal](https://portal.azure.com/). DocumentDB is offered in units of solid-state drive (SSD) backed storage and throughput. These units are provisioned by creating database collections within your database account. Each collection includes 10GB of database storage with reserved throughput. If the throughput requirements of your application change, you dynamically change this by setting the [performance level](documentdb-performance-levels.md) for each collection.  

When your application exceeds performance levels for one or multiple collections, requests will be throttled on a per collection basis. This means that some application requests may succeed while others may be throttled.

##<a name="DBaccount"></a>Database account and administrative resources
As an Azure subscriber, you can provision one or more DocumentDB database accounts. Each database account comes with a quota of administrative resources including databases, users and permissions. These resources are subject to [limits and quotas](documentdb-limits.md). If you need additional administrative resources, please contact support.   

##<a name="DBstorage"></a> Databases with unlimited document storage
A single DocumentDB database can contain practically an unlimited amount of document storage partitioned by collections. Collections form the transaction domains for the documents contained within them. A DocumentDB database is elastic in size – ranging from a few GB to potentially terabytes of SSD backed document storage and provisioned throughput. Unlike a traditional RDBMS database, a database in DocumentDB is not scoped to a single machine.   

With DocumentDB, as you need to scale your applications, you can create more collections or databases or both. Various first party applications within Microsoft are using DocumentDB at consumer scale by creating extremely large DocumentDB databases each containing hundreds or thousands of collections with terabytes of document storage. You can grow or shrink a database by adding or removing collections to meet your application’s scale requirements. 

##<a name="DBCollections"></a>Database collections
Each DocumentDB database can contain one or more collections. Collections act as highly available data partitions for document storage and processing. Each collection can store documents with heterogeneous schema. DocumentDB's automatic indexing and query capabilities allow you to easily filter and retrieve documents. A collection provides the scope for document storage and query execution. A collection is also a transaction domain for all the documents contained within it. Collections are allocated throughput based on their specified performance level.  This can be adjusted dynamically through the Azure Preview portal or one of the SDKs. 

You can create any number of collections to meet the storage and throughput scale requirements of your applications. Collections can be created through the Azure Preview portal or through any one of the DocumentDB SDKs.   

>[AZURE.NOTE] Each collection supports storage for up to 10GB of document data. 
 
##<a name="ProvThroughput"></a>Request units and database operations
DocumentDB allows for a rich set of database operations including relational and hierarchical queries with UDFs, stored procedures and triggers – all operating on the documents within a database collection. The processing cost associated with each of these operations will vary based on the CPU, IO and memory required to complete the operation. Instead of thinking about and managing hardware resources, you can think of a request unit (RU) as a single measure for the resources required to perform various database operations and service an application request.

Request units are provisioned and assigned based on the performance level set for a collection. Each collection is designated a performance level upon creation. This performance level determines the processing capacity of a collection in request units per second. Performance levels can be adjusted throughout the life of a collection to adapt to the changing processing needs and access patterns of your application. For more information refer to [DocumentDB Performance Levels](documentdb-performance-levels.md). 

>[AZURE.IMPORTANT] Collections are billable entities. The cost is determined by the performance level assigned to the collection. 

Request unit consumption is evaluated as a rate per second. For applications that exceed the provisioned request unit rate for a collection, requests to that collection will be throttled until the rate drops below the reserved level. If your application requires a higher level of throughput, you can adjust the performance level of existing collections or spread the applications requests across new collections.

A request unit is a normalized measure of request processing cost. A single request unit represents the processing capacity required to read (via self link) a single 1KB JSON document consisting of 10 unique property values. The request unit charge assumes a consistency level set to the default “Session” and all of documents automatically indexed. A request to insert, replace or delete the same document will consume more processing from the service and thereby more request units. Each response from the service includes a custom header (x-ms-request-charge) that measures the request units consumed for the request. This header is also accessible through the [SDKs](https://msdn.microsoft.com/library/azure/dn781482.aspx). In the .NET SDK, RequestCharge is a property of the ResourceResponse object.

>[AZURE.NOTE] The baseline of 1 request unit for a 1KB document corresponds to a simple GET by self link of the document. 

There are several factors that impact the request units consumed for an operation against a DocumentDB Database Account. These factors include:

- Document size – as document sizes increase the units consumed to read or write the data will also increase.
- Property count – assuming default indexing of all properties, the units consumed to write a document will increase as the property count increases
- Data consistency – when using data consistency levels of Strong or Bounded Staleness, additional units will be consumed to read documents
- Indexed properties – an index policy on each collection determines which properties are indexed by default. You can reduce your request unit consumption by limiting the number of indexed properties
- Document indexing – by default each document is automatically indexed, you will consume fewer request units if you choose not to index some of your documents

Queries, stored procedures and triggers will consume request units based on the complexity of the operations being performed. As you develop your application, inspect the request charge header to better understand how each operation is consuming request unit capacity.  

##<a name="Consistency"></a>Choice of consistency level and throughput
The choice of default consistency level has an impact on the throughput and latency. You can set the default consistency level both programmatically and through the Azure Preview portal. You can also override the consistency level on a per request basis. By default, the consistency level is that of session which provides monotonic read/writes and read your write guarantees. Session consistency is great for user-centric applications and provides an ideal balance of consistency and performance trade-offs.    

For instructions on changing your consistency level on the Azure Preview portal, see How to: Manage DocumentDB Consistency Settings in [How to Manage a DocumentDB Account](documentdb-manage-account.md).

##<a name="IndexOverhead"></a>Provisioned document storage and index overhead
With each collection created you are provisioned with 10GB of SSD backed document storage. The 10GB of document storage includes the documents plus storage for the index. By default, a DocumentDB collection is configured to automatically index all of the documents without explicitly requiring any secondary indices or schema. Based on applications using DocumentDB, the typical index overhead is between 2-20%. The indexing technology used by DocumentDB ensures that regardless of the values of the properties, the index overhead does not exceed more than 80% of the size of the documents with default settings. 

By default all documents are indexed by DocumentDB automatically. However, in case you want to fine tune the index overhead, you can chose to remove certain documents from being indexed at the time of inserting or replacing a document. You can configure a DocumentDB collection to exclude all documents within the collection from being indexed. You can also configure a DocumentDB collection to selectively index only a certain properties or paths with wildcards of your JSON documents.  Excluding properties or documents also improves the write throughput – which means you will consume fewer request units.   
 
##<a name="NextSteps"></a>Next steps
For instructions on managing your DocumentDB account in the Azure Preview portal, see How to: Manage DocumentDB Consistency Settings in [How to Manage a DocumentDB Account](documentdb-manage-account.md/#consistency).

For instructions on monitoring performance levels on the Azure Preview portal, see [Monitor a DocumentDB account](documentdb-monitor-accounts.md).

For more information on choosing performance levels for collections, see [Performance Levels in DocumentDB](documentdb-performance-levels).
