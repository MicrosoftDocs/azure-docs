---
title: Azure Cosmos DB Database Questions - Frequently Asked Questions | Microsoft Docs
description: Get answers to frequently asked questions about Azure Cosmos DB a NoSQL document database service for JSON. Answer database questions about capacity, performance levels, and scaling.
keywords: Database questions, frequently asked questions, documentdb, azure, Microsoft azure
services: cosmosdb
author: mimig1
manager: jhubbard
editor: monicar
documentationcenter: ''

ms.assetid: b68d1831-35f9-443d-a0ac-dad0c89f245b
ms.service: documentdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/10/2017
ms.author: mimig

---
# Frequently asked questions about Azure Cosmos DB
## Database questions about Microsoft Azure Cosmos DB fundamentals
### What is Microsoft Azure Cosmos DB?
Microsoft Azure Cosmos DB is a blazing fast, planet-scale NoSQL document database-as-a-service that offers rich querying over schema-free data, helps deliver configurable and reliable performance, and enables rapid development, all through a managed platform backed by the power and reach of Microsoft Azure. Azure Cosmos DB is the right solution for web, mobile, gaming, and IoT applications when predictable throughput, high availability, low latency, and a schema-free data model are key requirements. Azure Cosmos DB delivers schema flexibility and rich indexing via a native JSON data model, and includes multi-document transactional support with integrated JavaScript.  

For more database questions, answers, and instructions on deploying and using this service, see the [Azure Cosmos DB documentation page](https://azure.microsoft.com/documentation/services/documentdb/).

### What kind of database is Azure Cosmos DB?
Azure Cosmos DB is a NoSQL document oriented database that stores data in JSON format.  Azure Cosmos DB supports nested, self-contained-data structures that can be queried through a rich Azure Cosmos DB [SQL query grammar](documentdb-sql-query.md). Azure Cosmos DB provides high-performance transactional processing of server-side JavaScript through [stored procedures, triggers, and user defined functions](documentdb-programming.md). The database also supports developer tunable consistency levels with associated [performance levels](documentdb-performance-levels.md).

### Do Azure Cosmos DB databases have tables like a relational database (RDBMS)?
No, Azure Cosmos DB  stores data in collections of JSON documents.  For information on Azure Cosmos DB resources, see [Azure Cosmos DB resource model and concepts](documentdb-resources.md). For more information about how NoSQL solutions such as Azure Cosmos DB differ from relational solutions, see [NoSQL vs SQL](documentdb-nosql-vs-sql.md).

### Do Azure Cosmos DB databases support schema-free data?
Yes, Azure Cosmos DB allows applications to store arbitrary JSON documents without schema definition or hints. Data is immediately available for query through the Azure Cosmos DB SQL query interface.   

### Does Azure Cosmos DB support ACID transactions?
Yes, Azure Cosmos DB supports cross-document transactions expressed as JavaScript stored procedures and triggers. Transactions are scoped to a single partition within each collection and executed with ACID semantics as all or nothing isolated from other concurrently executing code and user requests.  If exceptions are thrown through the server-side execution of JavaScript application code, the entire transaction is rolled back. For more information about transactions, see [Database program transactions](documentdb-programming.md#database-program-transactions).

### What are the typical use cases for Azure Cosmos DB?
Azure Cosmos DB is a good choice for new web, mobile, gaming and IoT applications where automatic scale, predictable performance, fast order of millisecond response times, and the ability to query over schema-free data is important. Azure Cosmos DB lends itself to rapid development and supporting the continuous iteration of application data models. Applications that manage user generated content and data are [common use cases for Azure Cosmos DB](documentdb-use-cases.md).  

### How does Azure Cosmos DB offer predictable performance?
A [request unit](documentdb-request-units.md) is the measure of throughput in DocumentDB. 1 RU corresponds to the throughput of the GET of a 1KB document. Every operation in DocumentDB, including reads, writes, SQL queries, and stored procedure executions has a deterministic RU value based on the throughput required to complete the operation. Instead of thinking about CPU, IO and memory and how they each impact your application throughput, you can think in terms of a single RU measure.

Each Azure Cosmos DB collection can be reserved with provisioned throughput in terms of RUs of throughput per second. For applications of any scale, you can benchmark individual requests to measure their RU values, and provision collections to handle the sum total of request units across all requests. You can also scale up or scale down your collection’s throughput as the needs of your application evolve. For more information about request units and for help determining your collection needs, read [Estimating throughput needs](documentdb-request-units.md#estimating-throughput-needs) and try the [throughput calculator](https://www.documentdb.com/capacityplanner).

### Is Azure Cosmos DB HIPAA compliant?
Yes, Azure Cosmos DB is HIPAA-compliant. HIPAA establishes requirements for the use, disclosure, and safeguarding of individually identifiable health information. For more information, see the [Microsoft Trust Center](https://www.microsoft.com/en-us/TrustCenter/Compliance/HIPAA).

### What are the storage limits of Azure Cosmos DB?
There is no limit to the total amount of data that a collection can store in Azure Cosmos DB.

### What are the throughput limits of Azure Cosmos DB?
There is no limit to the total amount of throughput that a collection can support in Azure Cosmos DB, if your workload can be distributed roughly evenly among a sufficiently large number of partition keys.

### How much does Microsoft Azure Cosmos DB cost?
Refer to the [Azure Cosmos DB pricing details](https://azure.microsoft.com/pricing/details/documentdb/) page for details. Azure Cosmos DB usage charges are determined by the number of collections provisioned, the number of hours the collections were online, and the provisioned throughput for each collection.

### Is there a free account available?
If you are new to Azure, you can sign up for an [Azure free account](https://azure.microsoft.com/free/), which gives you 30 days and $200 to try all the Azure services. Or, if you have a Visual Studio subscription, you are eligible for [$150 in free Azure credits per month](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) to use on any Azure service.  

You can also use the [Azure Cosmos DB Emulator](documentdb-nosql-local-emulator.md) to develop and test your application locally for free, without creating an Azure subscription. When you're satisfied with how your application is working in the Azure Cosmos DB Emulator, you can switch to using an Azure Cosmos DB account in the cloud.

### How can I get additional help with Azure Cosmos DB?
If you need any help, reach out to us on [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-documentdb), or schedule a 1:1 chat with the DocumentDB engineering team by sending mail to [askdocdb@microsoft.com](mailto:askdocdb@microsoft.com). To stay up to date on the latest DocumentDB news and features, follow us on [Twitter](https://twitter.com/DocumentDB).

## Set up Microsoft Azure Cosmos DB
### How do I sign up for Microsoft Azure Cosmos DB?
Microsoft Azure Cosmos DB is available in the [Azure Portal][azure-portal].  First you must sign up for a Microsoft Azure subscription.  Once you sign up for a Microsoft Azure subscription, you can add an Azure Cosmos DB account to your Azure subscription. For instructions on adding an Azure Cosmos DB account, see [Create an Azure Cosmos DB database account](documentdb-create-account.md).   

### What is a master key?
A master key is a security token to access all resources for an account. Individuals with the key have read and write access to the all resources in the database account. Use caution when distributing master keys. The primary master key and secondary master key are available in the **Keys **blade of the [Azure Portal][azure-portal]. For more information about keys, see [View, copy, and regenerate access keys](documentdb-manage-account.md#keys).

### How do I create a database?
You can create databases using the [Azure Portal]() as described in [Create an Azure Cosmos DB collection and database](documentdb-create-collection.md), one of the [Azure Cosmos DB SDKs](documentdb-sdk-dotnet.md), or through the [REST APIs](https://msdn.microsoft.com/library/azure/dn781481.aspx).  

### What is a collection?
A collection is a container of JSON documents and the associated JavaScript application logic. A collection is a billable entity, where the [cost](documentdb-performance-levels.md) is determined by the throughput and storage used. Collections can span one or more partitions/servers and can scale to handle practically unlimited volumes of storage or throughput.

Collections are also the billing entities for Azure Cosmos DB. Each collection is billed hourly based on the provisioned throughput and the storage space used. For more information, see [Azure Cosmos DB pricing](https://azure.microsoft.com/pricing/details/documentdb/).  

### How do I set up users and permissions?
You can create users and permissions using one of the [Azure Cosmos DB SDKs](documentdb-sdk-dotnet.md) or through the [REST APIs](https://msdn.microsoft.com/library/azure/dn781481.aspx).   

## Database questions about developing against Microsoft Azure Cosmos DB
### How to do I start developing against Azure Cosmos DB?
[SDKs](documentdb-sdk-dotnet.md) are available for .NET, Python, Node.js, JavaScript, and Java.  Developers can also use the [RESTful HTTP APIs](https://msdn.microsoft.com/library/azure/dn781481.aspx) to interact with DocumentDB resources from various platforms and languages.

Samples for the Azure Cosmos DB [.NET](documentdb-dotnet-samples.md), [Java](https://github.com/Azure/azure-documentdb-java), [Node.js](documentdb-nodejs-samples.md), and [Python](documentdb-python-samples.md) SDKs are available on GitHub.

### Does Azure Cosmos DB support SQL?
The Azure Cosmos DB SQL query language is an enhanced subset of the query functionality supported by SQL. The Azure Cosmos DB SQL query language provides rich hierarchical and relational operators and extensibility via JavaScript based user-defined functions (UDFs). JSON grammar allows for modeling JSON documents as trees with labels as the tree nodes, which is used by both the Azure Cosmos DB automatic indexing techniques and the SQL query dialect of Azure Cosmos DB.  For details on how to use the SQL grammar, see the [QueryDocumentDB][query] article.

### Does Azure Cosmos DB support SQL aggregation functions?
Azure Cosmos DB supports low latency aggregation at any scale via aggregate functions `COUNT`, `MIN`, `MAX`, `AVG`, and `SUM` via the SQL grammar. For more information, see [Aggregate functions](documentdb-sql-query.md#Aggregates).

### What are the data types supported by Azure Cosmos DB?
The primitive data types supported in Azure Cosmos DB are the same as JSON. JSON has a simple type system that consists of Strings, Numbers (IEEE754 double precision), and Booleans - true, false, and Nulls. Azure Cosmos DB natively supports spatial types Point, Polygon, and LineString expressed as GeoJSON. More complex data types like DateTime, Guid, Int64, and Geometry can be represented both in JSON and Azure Cosmos DB through the creation of nested objects using the { } operator and arrays using the [ ] operator.

### How does Azure Cosmos DB provide concurrency?
Azure Cosmos DB supports optimistic concurrency control (OCC) through HTTP entity tags or etags. Every Azure Cosmos DB resource has an etag, and the etag is set on the server every time a document is updated. The etag header and the current value are included in all response messages. Etags can be used with the If-Match header to allow the server to decide if a resource should be updated. The If-Match value is the etag value to be checked against. If the etag value matches the server etag value, the resource will be updated. If the etag is no longer current, the server rejects the operation with an "HTTP 412 Precondition failure" response code. The client will then have to refetch the resource to acquire the current etag value for the resource. In addition, etags can be used with If-None-Match header to determine if a re-fetch of a resource is needed.

To use optimistic concurrency in .NET, use the [AccessCondition](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.accesscondition.aspx) class. For a .NET sample, see [Program.cs](https://github.com/Azure/azure-documentdb-dotnet/blob/master/samples/code-samples/DocumentManagement/Program.cs) in the DocumentManagement sample on github.

### How do I perform transactions in Azure Cosmos DB?
Azure Cosmos DB supports language-integrated transactions via JavaScript stored procedures and triggers. All database operations inside scripts are executed under snapshot isolation scoped to the collection if it is a single-partition collection, or documents with the same partition key value within a collection, if the collection is partitioned. A snapshot of the document versions (ETags) is taken at the start of the transaction and committed only if the script succeeds. If the JavaScript throws an error, the transaction is rolled back. See [Azure Cosmos DB server-side programming](documentdb-programming.md) for more details.

### How can I bulk insert documents into Azure Cosmos DB?
There are three ways to bulk insert documents into Azure Cosmos DB:

* The data migration tool, as described in [Import data to Azure Cosmos DB](documentdb-import-data.md).
* Document Explorer in the Azure Portal, as described in [Bulk add documents with Document Explorer](documentdb-view-json-document-explorer.md#bulk-add-documents).
* Stored procedures, as described in [Azure Cosmos DB server-side programming](documentdb-programming.md).

### Does Azure Cosmos DB support resource link caching?
Yes, because Azure Cosmos DB is a RESTful service, resource links are immutable and can be cached. Azure Cosmos DB clients can specify an "If-None-Match" header for reads against any resource like document or collection and update their local copies only when the server version has change.

### Is a local instance of Azure Cosmos DB available?
Yes. The [Azure Cosmos DB Emulator](documentdb-nosql-local-emulator.md) provides a high-fidelity emulation of the Azure Cosmos DB service. It supports identical functionality as Azure Cosmos DB, including support for creating and querying JSON documents, provisioning and scaling collections, and executing stored procedures and triggers. You can develop and test applications using the Azure Cosmos DB Emulator, and deploy them to Azure at global scale by just making a single configuration change to the connection endpoint for Azure Cosmos DB.

## Database questions about developing against API for MongoDB
### What is Azure Cosmos DB's API for MongoDB?
Microsoft Azure Cosmos DB's API for MongoDB is a compatability layer that allows applications to easily and transparently communicate with the native Azure Cosmos DB database engine using existing, community supported Apache MongoDB APIs and drivers. Developers can now use existing MongoDB tool chains and skills to build applications that leverage Azure Cosmos DB, benefitting from Azure Cosmos DB's unique capabilities, which include auto-indexing, backup maintenance, financially backed service level agreements (SLAs), etc.

### How to do I connect to my API for MongoDB database?
The quickest way to connect to Azure Cosmos DB's API for MongoDB is to head over to the [Azure portal](https://portal.azure.com). Navigate your way to your account. In the account's *Left Navigation*, click on *Quick Start*. *Quick Start* is the best way to get code snippets to connect to your database. 

Azure Cosmos DB enforces strict security requirements and standards. Azure Cosmos DB accounts require authentication and secure communication via *SSL*, so make sure to use TLSv1.2.

For more details, see [Connect to your API for MongoDB database](documentdb-connect-mongodb-account.md).

### Are there additional error codes for an API for MongoDB database?
API for MongoDB has its own specific error codes in addition to the common MongoDB error codes.


| Error               | Code  | Description  | Solution  |
|---------------------|-------|--------------|-----------|
| TooManyRequests     | 16500 | The total number of request units consumed has exceeded the provisioned request unit rate for the collection and has been throttled. | Consider scaling the throughput of the collection from the Azure Portal or retrying again. |
| ExceededMemoryLimit | 16501 | As a multi-tenant service, the operation has exceeded the client's memory allotment. | Reduce the scope of the operation through a more restrictive query criteria or contact support from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). <br><br>*Ex:  &nbsp;&nbsp;&nbsp;&nbsp;db.getCollection('users').aggregate([<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{$match: {name: "Andy"}}, <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{$sort: {age: -1}}<br>&nbsp;&nbsp;&nbsp;&nbsp;])*) |
## Database questions about developing against Premium Table API (Preview)

### Terms 
Premium Tables API (Preview) offered by Cosmos DB refers to Preview release of Premium Table API announced at Build 2017. 
<br>Standard Table SDK is the existing Azure Storage Table SDK. 


### How can I use this new offering? 
This process is documented here <azure-pr-link>.
1. You need to create Cosmos DB account.
2. Get the connection string (endpoint/key) from the keys pane.
3. Download the new preview SDK for Windows Azure Storage 8.1.2 with Premium Tables API (Preview)
3. Use Azure Table SDK code for normal table creation, entity creation, listing of entities, deletion etc. 

### Do I require a new SDK to use the Premium Tables API (Preview)? 
Yes – a new SDK in form of Nuget package is available here - https://www.nuget.org/packages/WindowsAzure.Storage/. It is called SDK for Windows Azure Storage 8.1.2 with Premium Tables API (Preview).  

### How do I provide the feedback about the SDK, bugs?
Please share the feedback at uservoice - https://feedback.azure.com/forums/263030-documentdb 
<br>You can send mail to askdocdb@microsoft.com 
<br>You can post question at MSDN forum - https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=AzureDocumentDB , 
<br>You can leverage the community at stackoverflow - http://stackoverflow.com/questions/tagged/azure-documentdb.

### What is the connection string that I need to use to connect to Premium Tables API (Preview)?
DefaultEndpointsProtocol=https;AccountName=<AccountNamefromCosmos DB;AccountKey=<FromKeysPaneofCosmosDB>;TableEndpoint=https://<AccountNameFromDocumentDB>.documents.azure.com . You can pick this from the ConnectionString panel of the Cosmos DB. 

### How do I override the config settings for the request options in the new Premium Tables API(Preview)?
These settings are documented here. Yes you can change the settings by adding them to app.config in the appsettings section in client application.[
<appSettings>
	<add key="TableConsistencyLevel" value="Eventual|Strong|Session|BoundedStaleness|ConsistentPrefix"/>
	<add key="TableThroughput" value="<PositiveIntegerValue"/>
	<add key="TableIndexingPolicy" value="<jsonindexdefn>"/>
	<add key="TableUseGatewayMode" value="True|False"/>
	<add key="TablePreferredLocations" value="Location1|Location2|Location3|Location4>"/>
</appSettings>


### Is there any change for existing customers for existing Standard Table SDK?
None. There are no changes for existing or new customers using existing Standard Table SDK. 

### How do I view my data which is stored in Cosmos DB Premium Tables API (Preview)? 
You can use the portal of Cosmos DB to browse the data. You can use the Premium Tables API (Preview) code or the tools mentioned below. 

### Which Tools will work with Premium Tables API (Preview)? 
Older version of Azure Explorer (0.8.9) to begin with. 
Tools which have flexibility to take a connection string in the format specified earlier can support the new Premium Tables API (Preview). By General Availability(GA) we plan to support most of the tools. The tools are mentioned here - https://docs.microsoft.com/en-us/azure/storage/storage-explorers 

### Does PowerShell/CLI work with this new release of Azure Storage Premium Tables API (Preview) ?
This is planned for later release as we proceed towards GA. 

### How is the concurrency on operations controlled?
Yes, Optimistic concurrency is provided via use of ETag mechanism as expected in Standard Table API. 

### Is OData query model supported for entities? 
Yes, the Premium Table API(Preview) support OData query, Linq query. The support for many features will continue to be added as we proceed towards GA.

### Can I connect to Standard Azure Table and Premium Table API at side by side in same application ? 
Yes this can be achieved by creating 2 different instances of CloudTableClient.

### How do I migrate existing Table Storage application to this new offering?
At present this following process: 
1. Create an account in Cosmos DB. 
2. Download using nuget, add reference and use the new Premium Table API(preview) SDK to provision a new table with requisite throughput
3. Migrate data by using code. Or exporting data from Standard Azure Table using Azcopy to blob or and then either use migration tool or code utilizing new SDK to push the data.
4. Change the connection string and Use existing code. 
You can refer to Throughput to size mapping <here>.


### What is the roadmap for this service, when will other functionality of Standard Table API be offered?
We plan to add support for SAS tokens, ServiceContext, Stats, Encryption, Analytics and other features as we proceed towards GA.  Please provide us feedback on uservoice <location>. 

### How is expansion of the storage size done for this service, say I start with x amounts of GB and my data will grow to 1 TB overtime?  
Cosmos DB is designed to provide unlimited storage via use of horizontal scaling. Our service will monitor and effectively increase your storage. 

### How do I monitor this Cosmos DB offering?
You can use the Cosmos DB Metrics pane to monitor requests, storage. 

### How do I calculate throughput I require?
Yes, you can use the Capacity estimator to calculate the TableThroughput required for the operations.Cosmos DB is provisioned system so estimation of these TableThroughput. This is documented here .  

### Can I use  Premium Tables API (Preview) SDK locally with the emulator?
Yes, you can use the Cosmos DB Premium Tables API (Preview) on the local emulator when you use the new SDK. Please download new emulator from here.  

### Can my existing application work with Premium Tables API (Preview)? 
The surface area of the Premium Tables API (Preview) is compatible with existing Azure Standard Table SDK across the create, delete, update, query operations with .Net API.  We document below other constructs which we plan to add support for by GA.

### Do I need to migrate existing Azure Table based application to new SDK if I do not want to use Premium Table API(preview) features?
No, Existing customers, new customers can create and use present Standard Table assets without interruption of any kind.<p> We are providing a preview for Standard Table customers who have always requested for these kind of features. This preview provides automatic index, more consistency levels to leverage global distribution.  If you want to try out this offering you need to download a new SDK and follow the procedure as outlined <here> in the documentation.



## Global Replication 
### How do I add replication for this data in Premium Table API (Preview) across multiple regions of Azure?
You can use the Cosmos DB portal’s global replication settings for adding regions. This is documented <here>.

### How do I change the primary write region Premium Table API(preview)?
You can use <Cosmos DB>’s global replication portal pane to add a region and then failover to it. This is documented <here>.

### How do I configure my preferred read regions for low latency when I distribute my data? 
Cosmos DB Consistency settings in the portal help in providing options for low latency when application is distributed. Consistency options can be set for the container for distribution and documented <here>. Cosmos DB also allows client to choose a consistency level on individual operation.  
When client connects, it can specify a consistency level – this can be changed via the app.config setting for the value of TableConsistencyLevel key. 
By default, Premium Tables API(Preview) provides low latency reads with Read your own writes with session consistency as default.  

### Does this mean compared to eventual & strong consistency that is possible with Standard Table  – we now have more choices ?
Yes, these choices are documented <here> to help application developers leverage the distributed nature of Cosmos DB. 

### When global distribution is enabled – how long does it take to replicate the data?
We commit the data durably in local region and push the data to other regions immediately in matter of milliseconds and this replication is only dependent on the RTT of the datacenter. Please read up on the global distribution abilities of Cosmos DB <here>.


### Can the request consistency be changed?
Yes, by providing the value for TableConsistencyLevel key in the app.config file. Theses are the possible values - Session|Eventual|Strong|Bounded Staleness|ConsistentPrefix. This is documented <here>. 

# Indexing
### Does the Premium Tables API (Preview) index all attributes of entities by default?
Yes, by default all attributes of the entity are indexed. The indexing details are documented <here>. 

### Does this mean I do not have to create different indexes to satisfy the queries? 
Yes, Cosmos DB provides automatic indexing of all attributes without any schema definition. This frees up developer to focus on the application rather than worry about index creation and management. The indexing details are documented <here>. 

### Can the indexing policy be changed?
Yes - you can change the index by providing the index definition. The meaning of these settings is documented <here>. You need to properly encode and escape these settings.  We have an example <here>.
in string json format in the app.config file.
{
  "indexingMode": "consistent",
  "automatic": true,
  "includedPaths": [
    {
      "path": "/somepath",
      "indexes": [
        {
          "kind": "Range",
          "dataType": "Number",
          "precision": -1
        },
        {
          "kind": "Range",
          "dataType": "String",
          "precision": -1
        } 
      ]
    }
  ],
  "excludedPaths": 
[
 {
      "path": "/anotherpath"
 }
]
}




## Elasticity 
### When should I change TableThroughput for Azure Premium Tables API (Preview)?
You should change the TableThroughput  when you do the ETL of data or want to upload lot of data in short amount of time. 
OR
You need more throughput from the container at the backend as you see Used Throughput is more than Provisioned throughput on the metrics and you are getting throttled. This is documented <here>.

### Is there a Default TableThroughput which is set for newly provisioned Table?
Yes,  If you do not override the TableThroughput via app.config and do not use a pre-created container in Cosmos DB - we will create Table with throughput of 400.



## Pricing
### Is there any change of pricing for existing customers of Standard Table API?
None. There is no change in price for existing Standard Table API customers. 

### How is the price calculated for this Premium Table API(Preview)? 
It depends on the TableThroughput which have been allocated. The concept of throughput is documented <here>. 

### Do you plan to provide more price options in the future?
Yes, Cosmos DB today provides Throughput optimized model. In the near future we have plans to provide Storage optimized pricing. 

### Can I scale up or down the throughput of my Tables API (Preview) Table? 
Yes, you can use the Cosmos DB portal’s scale pane to do the same. This is documented here.

### Will I experience the throttles on the Cosmos DB Table? 
Yes, in case your request rates exceed the capacity of the underlying container, you will get an error and SDK will retry for using the retry policy.

## Generic Questions
### If I develop an application today – what should I choose -  between Premium Tables API (Preview) and SQL API?
You should always choose a platform that provides the closest match to your requirements. Premium Tables API (Preview) leverages the underlying platform to provide an efficient path for existing Table customers who need low latency, automatic indexing, global distribution, multiple consistency settings.  
Our SQL API based platform remains trusted platform for customers who are comfortable with SQL language as query mechanism to retrieve schema less entities.      


### Why do I need to choose a throughput apart from PartitionKey and RowKey?
Cosmos DB will set a default throughput for your container if you do not provide one in the app.config. 

Cosmos DB provides guarantees for performance, latency with upper bounds on operation. This is possible when engine can enforce governance on tenants. Setting TableThroughput is basically ensuring you get guaranteed throughput, latency as now platform will reserve this capacity and guarantee operation success.  
The specification of throughput also allows you to elastically change it to leverage the seasonality of your application and meet the throughput needs and save costs.


[azure-portal]: https://portal.azure.com
[query]: documentdb-sql-query.md
