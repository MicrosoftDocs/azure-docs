---
title: Azure Cosmos DB Database Questions - Frequently Asked Questions | Microsoft Docs
description: Get answers to frequently asked questions about Azure Cosmos DB a globally distributed, mutli-model database service. Answer database questions about capacity, performance levels, and scaling.
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
ms.date: 05/23/2017
ms.author: mimig

---
# Frequently asked questions about Azure Cosmos DB
## Database questions about Azure Cosmos DB fundamentals
### What is Azure Cosmos DB?
Azure Cosmos DB is a globally replicated, multi-model database service that that offers rich querying over schema-free data, helps deliver configurable and reliable performance, and enables rapid development, all through a managed platform backed by the power and reach of Microsoft Azure. Azure Cosmos DB is the right solution for web, mobile, gaming, and IoT applications when predictable throughput, high availability, low latency, and a schema-free data model are key requirements. Azure Cosmos DB delivers schema flexibility and rich indexing, and includes multi-document transactional support with integrated JavaScript.  

Azure Cosmos DB started in late 2010 to address developer pain-points that are faced by large-scale applications inside Microsoft. Since building globally distributed applications is not a problem unique to just to Microsoft, we made the service available externally to all Azure Developers in the form of Azure DocumentDB. Azure Cosmos DB is the next big leap in the evolution of DocumentDB and we are now making it available for you to use. As a part of this release of Azure Cosmos DB, DocumentDB customers (with their data) are automatically Azure Cosmos DB customers. The transition is seamless and they now have access to a broader range of new capabilities offered by Azure Cosmos DB. 

For more database questions, answers, and instructions on deploying and using this service, see the [Azure Cosmos DB documentation page](https://azure.microsoft.com/documentation/services/documentdb/).

### What happened to DocumentDB?
The DocumentDB API is one of the supported APIs and data models for Azure Cosmos DB. In addition, Azure Cosmos DB supports you with Graph API (preview), Table API (preview) and MongoDB API. For more information, see [Answers to frequent questions from DocumentDB customers](#moving-to-cosmos-db).

### How do I get to my DocumentDB account in the Azure portal?
Just click the Azure Cosmos DB icon in the menu on the left side of the Azure portal. If you had a DocumentDB account before, you now have an Azure Cosmos DB account, with no change to your billing.

### What are the typical use cases for Azure Cosmos DB?
Azure Cosmos DB is a good choice for new web, mobile, gaming and IoT applications where automatic scale, predictable performance, fast order of millisecond response times, and the ability to query over schema-free data is important. Azure Cosmos DB lends itself to rapid development and supporting the continuous iteration of application data models.  Applications that manage user generated content and data are [common use cases for Azure Cosmos DB](documentdb-use-cases.md).  

### How does Azure Cosmos DB offer predictable performance?
A [request unit](documentdb-request-units.md) is the measure of throughput in Azure Cosmos DB. 1 RU corresponds to the throughput of the GET of a 1KB document. Every operation in Azure Cosmos DB, including reads, writes, SQL queries, and stored procedure executions has a deterministic RU value based on the throughput required to complete the operation. Instead of thinking about CPU, IO and memory and how they each impact your application throughput, you can think in terms of a single RU measure.

Each Azure Cosmos DB container can be reserved with provisioned throughput in terms of RUs of throughput per second. For applications of any scale, you can benchmark individual requests to measure their RU values, and provision container to handle the sum total of request units across all requests. You can also scale up or scale down your container's throughput as the needs of your application evolve. For more information about request units and for help determining your container needs, read [Estimating throughput needs](documentdb-request-units.md#estimating-throughput-needs) and try the [throughput calculator](https://www.documentdb.com/capacityplanner). Containers here refer to DocumentDB API's collection, Graph API's graphs, MongoDB API's collection and Table API's Tables.  

### Is Azure Cosmos DB HIPAA compliant?
Yes, Azure Cosmos DB is HIPAA-compliant. HIPAA establishes requirements for the use, disclosure, and safeguarding of individually identifiable health information. For more information, see the [Microsoft Trust Center](https://www.microsoft.com/en-us/TrustCenter/Compliance/HIPAA).

### What are the storage limits of Azure Cosmos DB?
There is no limit to the total amount of data that a container can store in Azure Cosmos DB.

### What are the throughput limits of Azure Cosmos DB?
There is no limit to the total amount of throughput that a container can support in Azure Cosmos DB, the key here is that your workload needs to be distributed roughly evenly among a sufficiently large number of partition keys.

### How much does Azure Cosmos DB cost?
Refer to the [Azure Cosmos DB pricing details](https://azure.microsoft.com/pricing/details/documentdb/) page for details. Azure Cosmos DB usage charges are determined by the number of containers provisioned, the number of hours the containers were online, and the provisioned throughput for each container. Containers here refer to DocumentDB API's collection, Graph API's graph, MongoDB API's collection, and Table API's tables. 

### Is there a free account available?
If you are new to Azure, you can sign up for an [Azure free account](https://azure.microsoft.com/free/), which gives you 30 days and $200 to try all the Azure services. Or, if you have a Visual Studio subscription, you are eligible for [$150 in free Azure credits per month](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) to use on any Azure service.  

You can also use the [Azure Cosmos DB Emulator](documentdb-nosql-local-emulator.md) to develop and test your application locally for free, without creating an Azure subscription. When you're satisfied with how your application is working in the Azure Cosmos DB Emulator, you can switch to using an Azure Cosmos DB account in the cloud.

### How can I get additional help with Azure Cosmos DB?
If you need any help, reach out to us on [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-documentdb), [MSDN forum](https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=AzureDocumentDB) or schedule a 1:1 chat with the Azure Cosmos DB engineering team by sending mail to [askdocdb@microsoft.com](mailto:askdocdb@microsoft.com). 

## Set up Azure Cosmos DB
### How do I sign up for Azure Cosmos DB?
Azure Cosmos DB is available in the Azure portal. First you must sign up for an Azure subscription. Once you sign up for an Azure subscription, you can add a DocumentDB API, Graph API (preview), Table API (preview) or MongoDB API account to your Azure subscription.

### What is a master key?
A master key is a security token to access all resources for an account. Individuals with the key have read and write access to the all resources in the database account. Use caution when distributing master keys. The primary master key and secondary master key are available in the **Keys **blade of the [Azure portal][azure-portal]. For more information about keys, see [View, copy, and regenerate access keys](documentdb-manage-account.md#keys).

### What are the regions to which PreferredLocations be set to? 
The present valid region for PrefferredLocations are - "West US", "West Central US", "West US 2", "East US","East US 2", "Central US", "South Central US", "North Central US", "West Europe", "North Europe", "East Asia", "Southeast Asia", "Japan West", "Japan East", "Australia Southeast", "Australia East", "Central India", "South India", "West India", "Canada East", "Canada Central", "Germany Central", "Germany Northeast","China North", "China East", "Korea South", "Korea Central","UK West", "UK South", "Brazil South", "USGov Arizona", "USGov Texas".

### Is there something I should be aware of when distributing data across the world via Azure's data centers? 
Cosmos DB is present across all the regions. Since it is the core service every new Datacenter will have a Cosmos DB presence. This list is documented above as of now. When setting these - you have to remember Cosmos DB respects sovereign and government clouds. Which implies if you create an account there and want to replicate out  - you are not allowed to, similarly you cannot reach into those locations for enabling replication there from outside account. 

### Do you plan to provide more price options in the future?
Yes, Cosmos DB today's  provides a throughput optimized model. We plan to provide more optimal pricing models in near future. 
 
## Questions about developing against the DocumentDB API

### How to do I start developing against DocumentDB API?
Microsoft DocumentDB API is available in the [Azure portal][azure-portal].  First you must sign up for an  Azure subscription.  Once you sign up for an Azure subscription, you can add DocumentDB API container to your Azure subscription. For instructions on adding an Azure Cosmos DB account, see [Create an Azure Cosmos DB database account](documentdb-create-account.md). If you had a DocumentDB account in the past, you now have an Azure Cosmos DB account.  

[SDKs](documentdb-sdk-dotnet.md) are available for .NET, Python, Node.js, JavaScript, and Java.  Developers can also use the [RESTful HTTP APIs](https://msdn.microsoft.com/library/azure/dn781481.aspx) to interact with Azure Cosmos DB resources from various platforms and languages.

### Can I access some ready made samples for getting headstart?
Samples for the DocumentDB API [.NET](documentdb-dotnet-samples.md), [Java](https://github.com/Azure/azure-documentdb-java), [Node.js](documentdb-nodejs-samples.md), and [Python](documentdb-python-samples.md) SDKs are available on GitHub.


### Does DocumentDB API  database support schema-free data?
Yes, DocumentDB API allows applications to store arbitrary JSON documents without schema definition or hints. Data is immediately available for query through the Azure Cosmos DB SQL query interface.   

### Does DocumentDB API support ACID transactions?
Yes, DocumentDB API supports cross-document transactions expressed as JavaScript stored procedures and triggers. Transactions are scoped to a single partition within each collection and executed with ACID semantics as all or nothing isolated from other concurrently executing code and user requests.  If exceptions are thrown through the server-side execution of JavaScript application code, the entire transaction is rolled back. For more information about transactions, see [Database program transactions](documentdb-programming.md#database-program-transactions).

### What is a collection?
A collection is a group of documents and their associated JavaScript application logic. A collection is a billable entity, where the [cost](documentdb-performance-levels.md) is determined by the throughput and storage used. Collections can span one or more partitions/servers and can scale to handle practically unlimited volumes of storage or throughput.

Collections are also the billing entities for Azure Cosmos DB. Each collection is billed hourly based on the provisioned throughput and the storage space used. For more information, see [DocumentDB API  pricing](https://azure.microsoft.com/pricing/details/documentdb/).  

### How do I create a database?
You can create databases using the [Azure portal]() as described in [Create an Azure Cosmos DB collection and database](documentdb-create-collection.md), one of the [Azure Cosmos DB SDKs](documentdb-sdk-dotnet.md), or through the [REST APIs](https://msdn.microsoft.com/library/azure/dn781481.aspx).  

### How do I set up users and permissions?
You can create users and permissions using one of the [DocumentDB API SDKs](documentdb-sdk-dotnet.md) or through the [REST APIs](https://msdn.microsoft.com/library/azure/dn781481.aspx).   

### Does DocumentDB API support SQL?
The SQL query language is an enhanced subset of the query functionality supported by SQL. The Azure Cosmos DB SQL query language provides rich hierarchical and relational operators and extensibility via JavaScript based user-defined functions (UDFs). JSON grammar allows for modeling JSON documents as trees with labels as the tree nodes, which are used by both the Azure Cosmos DB automatic indexing techniques and the SQL query dialect of Azure Cosmos DB.  For details on how to use the SQL grammar, see the [QueryDocumentDB][query] article.

### Does DocumentDB API  support SQL aggregation functions?
DocumentDB API supports low latency aggregation at any scale via aggregate functions `COUNT`, `MIN`, `MAX`, `AVG`, and `SUM` via the SQL grammar. For more information, see [Aggregate functions](documentdb-sql-query.md#Aggregates).

### How does DocumentDB API  provide concurrency?
DocumentDB API supports optimistic concurrency control (OCC) through HTTP entity tags or etags. Every DocumentDB API resource has an etag, and the etag is set on the server every time a document is updated. The etag header and the current value are included in all response messages. Etags can be used with the If-Match header to allow the server to decide if a resource should be updated. The If-Match value is the etag value to be checked against. If the etag value matches the server etag value, the resource will be updated. If the etag is no longer current, the server rejects the operation with an "HTTP 412 Precondition failure" response code. The client will then have to refetch the resource to acquire the current etag value for the resource. In addition, etags can be used with If-None-Match header to determine if a re-fetch of a resource is needed.

To use optimistic concurrency in .NET, use the [AccessCondition](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.accesscondition.aspx) class. For a .NET sample, see [Program.cs](https://github.com/Azure/azure-documentdb-dotnet/blob/master/samples/code-samples/DocumentManagement/Program.cs) in the DocumentManagement sample on github.

### How do I perform transactions in DocumentDB API?
DocumentDB API supports language-integrated transactions via JavaScript stored procedures and triggers. All database operations inside scripts are executed under snapshot isolation scoped to the collection if it is a single-partition collection, or documents with the same partition key value within a collection, if the collection is partitioned. A snapshot of the document versions (ETags) is taken at the start of the transaction and committed only if the script succeeds. If the JavaScript throws an error, the transaction is rolled back. See [DocumentDB API server-side programming](documentdb-programming.md) for more details.

### How can I bulk insert documents into DocumentDB API?
There are three ways to bulk insert documents into Azure Cosmos DB:

* The data migration tool, as described in [Import data to DocumentDB API](documentdb-import-data.md).
* Document Explorer in the Azure portal, as described in [Bulk add documents with Document Explorer](documentdb-view-json-document-explorer.md#bulk-add-documents).
* Stored procedures, as described in [ DocumentDB API server-side programming](documentdb-programming.md).

### Does DocumentDB API support resource link caching?
Yes, because Cosmos DB is a RESTful service, resource links are immutable and can be cached. DocumentDB API clients can specify an "If-None-Match" header for reads against any resource like document or collection and update their local copies only when the server version has change.

### Is a local instance of DocumentDB API available?
Yes. The [Azure Cosmos DB Emulator](documentdb-nosql-local-emulator.md) provides a high-fidelity emulation of the DocumentDB API service. It supports identical functionality as Azure Cosmos DB, including support for creating and querying JSON documents, provisioning and scaling collections, and executing stored procedures and triggers. You can develop and test applications using the Azure Cosmos DB Emulator, and deploy them to Azure at global scale by just making a single configuration change to the connection endpoint for Azure Cosmos DB.

## Questions about developing against the API for MongoDB
### What is Azure Cosmos DB's API for MongoDB?
Azure Cosmos DB's API for MongoDB is a compatability layer that allows applications to easily and transparently communicate with the native Azure Cosmos DB database engine using existing, community supported Apache MongoDB APIs and drivers. Developers can now use existing MongoDB tool chains and skills to build applications that leverage Azure Cosmos DB, benefitting from Azure Cosmos DB's unique capabilities, which include auto-indexing, backup maintenance, financially backed service level agreements (SLAs), etc.

### How to do I connect to my API for MongoDB database?
The quickest way to connect to Azure Cosmos DB's API for MongoDB is to head over to the [Azure portal](https://portal.azure.com). Navigate your way to your account. In the account's *Left Navigation*, click on *Quick Start*. *Quick Start* is the best way   to get code snippets to connect to your database. 

Azure Cosmos DB enforces strict security requirements and standards. Azure Cosmos DB accounts require authentication and secure communication via *SSL*, so make sure to use TLSv1.2.

For more details, see [Connect to your API for MongoDB database](documentdb-connect-mongodb-account.md).

### Are there additional error codes for an API for MongoDB database?
API for MongoDB has its own specific error codes in addition to the common MongoDB error codes.


| Error               | Code  | Description  | Solution  |
|---------------------|-------|--------------|-----------|
| TooManyRequests     | 16500 | The total number of request units consumed has exceeded the provisioned request unit rate for the collection and has been throttled. | Consider scaling the throughput of the collection from the Azure portal or retrying again. |
| ExceededMemoryLimit | 16501 | As a multi-tenant service, the operation has exceeded the client's memory allotment. | Reduce the scope of the operation through a more restrictive query criteria or contact support from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). <br><br>*Ex:  &nbsp;&nbsp;&nbsp;&nbsp;db.getCollection('users').aggregate([<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{$match: {name: "Andy"}}, <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{$sort: {age: -1}}<br>&nbsp;&nbsp;&nbsp;&nbsp;])*) |

## Questions about developing with the Table API (preview)

### Terms 
The Azure Cosmos DB: Table API (preview) refers to premium offering by Azure Cosmos DB for table support announced at Build 2017. 

The standard Table SDK is the pre-existing Azure storage Table SDK. 

### How can I use the new Table API (preview) offering? 
Microsoft Table API is available in the [Azure portal][azure-portal].  First you must sign up for an Azure subscription.  Once you sign up for an Azure subscription, you can add Table API container to your Azure subscription.  
In the preview period [SDKs](../cosmos-db/table-sdk-dotnet.md) are available for .NET, you can complete the [Table API](../cosmos-db/create-table-dotnet.md) quickstart to get started.

### Do I need a new SDK to use the Table API (preview)? 
Yes – a new SDK in form of a NuGet package is available here [Table API](../cosmos-db/table-sdk-dotnet.md). It is called SDK for Windows Azure Storage 8.1.2 with Premium Table API (preview).  

### How do I provide the feedback about the SDK, bugs?
Please share your feedback using one of these methods:

* [On Uservoice](https://feedback.azure.com/forums/263030-documentdb)
* [MSDN forum](https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=AzureDocumentDB)
* [Stackoverflow](http://stackoverflow.com/questions/tagged/azure-documentdb)

### What is the connection string that I need to use to connect to the Table API (preview)?
The connection string is `DefaultEndpointsProtocol=https;AccountName=<AccountNamefromCosmos DB;AccountKey=<FromKeysPaneofCosmosDB>;TableEndpoint=https://<AccountNameFromDocumentDB>.documents.azure.com`. You can get the connection string from the Keys page in the Azure portal. 

### How do I override the config settings for the request options in the new Table API(Preview)?
These settings are documented [Azure Cosmos DB capabilities](../cosmos-db/tutorial-develop-table-dotnet.md#azure-cosmos-db-capabilities). You can change the settings by adding them to app.config in the appsettings section in client application.
<appSettings>
	<add key="TableConsistencyLevel" value="Eventual|Strong|Session|BoundedStaleness|ConsistentPrefix"/>
	<add key="TableThroughput" value="<PositiveIntegerValue"/>
	<add key="TableIndexingPolicy" value="<jsonindexdefn>"/>
	<add key="TableUseGatewayMode" value="True|False"/>
	<add key="TablePreferredLocations" value="Location1|Location2|Location3|Location4>"/>....
</appSettings>


### Is there any change to existing customers that use the existing Standard Table SDK?
None. There are no changes for existing or new customers using existing Standard Table SDK. 

### How do I view table data that is stored in Azure Cosmos DB for use with the Table API (review)? 
You can use the Azure portal to browse the data. You can also use the Table API (preview) code or the tools mentioned below. 

### Which tools will work with Table API (preview)? 
Older version of Azure Explorer (0.8.9).

Tools that have flexibility to take a connection string in the format specified earlier can support the new Table API (preview). A list of table tools is provided on the [Azure Storage Client Tools](../storage/storage-explorers.md) page. 

### Does PowerShell/CLI work with the new Table API (preview)?
We plan to add support for PowerShell/CLI for Table API (preview). 

### Is the concurrency on operations controlled?
Yes, optimistic concurrency is provided via the use of the ETag mechanism as expected in Standard Table API. 

### Is OData query model supported for entities? 
Yes, the Table API (preview) supports OData query and Linq query. 

### Can I connect to standard Azure Table and the new premium Table API (preview) at side by side in same application? 
Yes this can be achieved by creating two different instances of the CloudTableClient pointing to their own URIs via the connectionstring.

### How do I migrate existing Table Storage application to this new offering?
Please contact askdocdb@microsoft.com if you'd like to take advantage of the new Table API offering on your existing Table storage data. 

### What is the roadmap for this service, when will other functionality of Standard Table API be offered?
We plan to add support for SAS Tokens, ServiceContext, Stats, Encryption, Analytics and other features as we proceed towards GA.  Please provide us feedback on [Uservoice](https://feedback.azure.com/forums/263030-documentdb). 

### How is expansion of the storage size done for this service, say I start with N GBs of data and my data will grow to 1 TB overtime?  
Cosmos DB is designed to provide unlimited storage via use of horizontal scaling. Our service will monitor and effectively increase your storage. 

### How do I monitor the Table API (preview) offering?
You can use the Table API (preview) Metrics pane to monitor requests and storage usage. 

### How do I calculate throughput I require?
You can use the Capacity estimator to calculate the TableThroughput required for the operations, as documented here [Estimate Request Units and Data Storage](https://www.documentdb.com/capacityplanner). In general you can represent your entity as a json and provide the numbers for your operations. 

### Can I use the new Table API (preview) SDK locally with the emulator?
Yes, you can use the  Table API (preview) on the local emulator when you use the new SDK. Please download new emulator from the [here](documentdb-nosql-local-emulator.md). The StorageConnectionString value in the app.config needs to be "DefaultEndpointsProtocol=https;AccountName=localhost;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==;TableEndpoint=https://localhost:8081". 

### Can my existing application work with the Table API (preview)? 
The surface area of the new Table API (preview) is compatible with existing Azure Standard Table SDK across the create, delete, update, query operations with the .NET API. You need to ensure you have row key as Table API (preview) requires both partition key and row key. We also plan to add other SDK support as we proceed towards GA of this service offering.

### Do I need to migrate existing Azure Table based application to new SDK if I do not want to use Table API (preview) features?
No, existing customers can create and use present Standard Table assets without interruption of any kind. However, if you do not use the new Table API (preview), you cannot benefit from the automatic index, additional consistency option, or global distribution. 

### How do I add replication for the data in Premium Table API (Preview) across multiple regions of Azure?
You can use the Cosmos DB portal’s [global replication settings](documentdb-portal-global-replication.md) for adding regions which are suitable for your application. To develop a globally distributed application - you should also add your application with PreferredLocation information set to local region for providing low read latency. 

### How do I change the primary write region for the account in  Premium Table API(preview)?
You can use Cosmos DB’s global replication portal pane to add a region and then failover to required region. For instructions see [Developing with multi-region Azure Cosmos DB accounts](documentdb-regional-failovers.md). 

### How do I configure my preferred read regions for low latency when I distribute my data? 
You need to leverage PreferredLocation key in the app.config to help you do the reads from local location. For existing application Table API (preview) will throw an error if LocationMode is set, please remove that code as Premium Table API(preview) will pick up this information from the app.config file.  These settings are documented [Azure Cosmos DB capabilities](../cosmos-db/tutorial-develop-table-dotnet.md#azure-cosmos-db-capabilities)


### How do I think of consistency in Table API (preview)? 
Cosmos DB provides well-reasoned trade-offs between consistency, availability, and latency. As of this release it provides 5 consistency levels to choose from. These consistency levels are available to Table API (preview) developer. This allows developers to choose right consistency model at the Table level and individual request while querying the data.  When a client connects, it can specify a consistency level – this can be changed via the app.config setting for the value of TableConsistencyLevel key. 
Table API(Preview) provides low latency reads with Read your own writes with session consistency as default. For more information, see [Consistency levels](documentdb-consistency-levels.md). 
By default  Standard Table today provides strong consistency within a region and eventual in the secondary locations.  

### Does this mean compared to eventual & strong consistency that is possible with standard Table  – we now have more choices?
Yes, these choices are documented in the [Consistency levels](documentdb-consistency-levels.md) article to help application developers leverage the distributed nature of Cosmos DB. Since guarantees are provided for consistency too - you can leverage these with confidence today. These settings are documented [Azure Cosmos DB capabilities](../cosmos-db/tutorial-develop-table-dotnet.md#azure-cosmos-db-capabilities)

### When global distribution is enabled – how long does it take to replicate the data?
We commit the data durably in local region and push the data to other regions immediately in matter of milliseconds and this replication is only dependent on the RTT of the datacenter. Please read up on the global distribution abilities of Cosmos DB in [Azure Cosmos DB: A globally distributed database service on Azure](documentdb-distribute-data-globally.md).

### Can the read request consistency be changed?
Cosmos DB allows setting the consistency at the container level (on the table). The SDK also enables you to change the level by providing the value for TableConsistencyLevel key in the app.config file. Theses are the possible values - Strong|Bounded Staleness|Session|ConsistentPrefix|Eventual. This is documented in the [consistency levels](documentdb-consistency-levels.md) article. Key here is to remember that request consistency can't be more than what is set for the Table. For example - if you have setup consistency for the Table at eventual and set consistency level of strong on request, that will not work. 

### How does Premium Table API (preview) account take care of failover in case a region goes down? 
Premium Table API (preview) leverages the globally distributed platform of Cosmos DB. To ensure your application can tolerate datacenter downtime - you need to enable at least one more region for the account in the Cosmos DB portal [Developing with multi-region Azure Cosmos DB accounts](documentdb-regional-failovers.md). You can set the priority of the region by using the portal [Developing with multi-region Azure Cosmos DB accounts](documentdb-regional-failovers.md). You can add as many regions for the account and control where it can failover to by providing priority. Of course it goes without saying you need to provide an application there too to leverage the database. This way your customers will not see downtime. The client SDK is auto homing - it can detect the region being down and automatically failover to the new region.

### Is Premium Table API (preview) enabled for backups?
Yes, Premium Table API (preview) leverages the platform of Cosmos DB for backups. Backups are taken automatically. Cosmos DB backup is documented here [Online backup and restore with Azure Cosmos DB](C:\Users\govindk\azure-docs-pr\articles\documentdb\documentdb-online-backup-and-restore.md)

 
### Does the Table API (preview) index all attributes of entities by default?
Yes, by default all attributes of the entity are indexed. The indexing details are documented in the [Azure Cosmos DB: Indexing policies](documentdb-indexing-policies.md) article. 

### Does this mean I do not have to create different indexes to satisfy the queries? 
Yes, Cosmos DB provides automatic indexing of all attributes without any schema definition. This frees up developer to focus on the application rather than worry about index creation and management. The indexing details are documented in the [Azure Cosmos DB: Indexing policies](documentdb-indexing-policies.md) article.

### Can the indexing policy be changed?
Yes, you can change the index by providing the index definition. The meaning of these settings is documented in the [Azure Cosmos DB capabilities](../cosmos-db/tutorial-develop-table-dotnet.md#azure-cosmos-db-capabilities) article. You need to properly encode and escape these settings.  

In string json format in the app.config file.
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

### Cosmos DB as a platform seems to have lot of capabilities like sorting, aggregates, hierarchy and other functionality - will this be added to the Table API? 
In preview, Azure Cosmos DB supports the same query functionality as Azure Table storage for the Table API. Azure Cosmos DB also supports sorting, aggregates, geospatial query, hierarchy, and a wide range of built-in functions. The additional functionality will be provided in the Table API in a future service update. See [Azure Cosmos DB query](../documentdb/documentdb-sql-query.md) for an overview of these capabilities.
 
### When should I change TableThroughput for the Table API (preview)?
You should change the TableThroughput  when you do the ETL of data or want to upload lot of data in short amount of time. 

OR

You need more throughput from the container at the backend as you see Used Throughput is more than Provisioned throughput on the metrics and you are getting throttled. This is documented in the [Set throughput](documentdb-set-throughput.md) article.

### Can I scale up or down the throughput of my Table API (preview) Table? 
Yes, you can use the Cosmos DB portal’s scale pane to do the same. This is documented in the [Set throughput](documentdb-set-throughput.md) topic.

### Can Premium Table API (preview) leverage RU per minute offering? 
Yes, Premium Table (preview) leverages capabilities of Cosmos DB to provide SLAs for Performance, Latency, Availability and Consistency. This ensures it can leverage the RU per minute offering as documented in [Request Units](documentdb-request-units.md). This capability allows customer to not provision for the peak and smooth out the spikes in the workload.

### Is there a Default TableThroughput which is set for newly provisioned Tables?
Yes,  If you do not override the TableThroughput via app.config and do not use a pre-created container in Cosmos DB - the service creates a Table with throughput of 400.
 
### Is there any change of pricing for existing customers of Standard Table API?
None. There is no change in price for existing Standard Table API customers. 

### How is the price calculated for the Table API(Preview)? 
It depends on the allocated TableThroughput. 

### How do I handle any throttling on the Tables in Table API (preview) offering? 
If request rate exceeds the capacity of the provisioned throughput for the underlying container, you will get an error and the SDK will retry the call using the retry policy.

### Why do I need to choose a throughput apart from PartitionKey and RowKey to leverage Premium Table (preview) offering of Cosmos DB?
Cosmos DB will set a default throughput for your container if you do not provide one in the app.config. 

Cosmos DB provides guarantees for performance, latency with upper bounds on operation. This is possible when engine can enforce governance on tenant's operations. Setting TableThroughput is basically ensuring you get guaranteed throughput, latency as now platform will reserve this capacity and guarantee operation success.  
The specification of throughput also allows you to elastically change it to leverage the seasonality of your application and meet the throughput needs and save costs.

### Azure Storage SDK has been very cheap for me as I only pay to store the data, and I rarely query. Cosmos DB’s new offering seems to be charging me even though I have not performed single transaction or stored anything. What's going on here?

Cosmos DB has been designed to be a globally distributed, SLA-based system with guarantees for availability, latency, and throughput. When you reserve throughput in Cosmos DB – it is guaranteed unlike other systems. Cosmos DB also provides additional capabilities which customers have been asking for long time – like secondary indices, global distribution, etc. During the preview period we provide the throughput optimized model and in the long run we plan to provide a storage optimized model to meet our customer needs.  

### I never get “quota” full (indicating a partition is full) when I keep ingesting data into Azure Table storage. With the Table API(preview),  I can get this error. Is this offering limiting me and forcing me to change my present application?

Cosmos DB is SLA-based system which provides unlimited scale with guarantees for latency, throughput, availability, consistency. To ensure you get guaranteed premium performance – you need to ensure that your data size and index are manageable and scalable. The 10 GB limit on the number of entities/items per partition key is to ensure we provide great lookup, query performance. To ensure your application scales well even for Azure Storage we request you not to create a hot partition by storing all information for one partition and querying it.  

### So PartitionKey and RowKey are still required with the new Table API (preview)? 
Yes. Because the surface area of Table API (preview) is similar to Azure Table storage SDK, the partition key provides great way to distribute the data. Row key is unique within that partition. Yes Row key needs to be present and can't be null as in Standard SDK. As of Build Preview - length of RowKey is 255 bytes  and PartitionKey is 100 bytes (soon to be increased to 1 KB). 

### What are the error messages for the Table API (preview)?
Since this preview is compatible with Standard Table - a majority of the errors will map to the errors from Standard Table. 

### Why do I get throttled when I try to create lot of tables one after another  in Tables API (preview)?
Cosmos DB is SLA-based system which provides latency, throughput, availability and consistency guarantee. Since it is a provisioned system - it reserves resources to guarantee these requirements. Rate of creation of Tables in rapid fashion  is detected and throttled. We would advise you to look at the rate of creation of tables and moderate it down below 5 per minute. Remember that Table API (preview) is a provisioned system so the moment you provision it - you have to have pay for it.  

## Questions about developing against the Graph API (preview)
### How can I leverage Graph API (preview) with Cosmos DB?
The functionality of Graph API (preview) can be leveraged from an extension library. It is called Microsoft Azure Graphs and available in NuGet. 

### It looks like you support gremlin as traversal language, do you plan to add some more forms of query?
Yes in future we have plans to add other mechanisms for query. 

### How can I use the new Graph API(preview) offering? 
Complete the [Graph API](../cosmos-db/create-graph-dotnet.md) quickstart to get started.

<a id="moving-to-cosmos-db"></a>
## Answers to frequent questions from DocumentDB customers
### Why the move to Azure Cosmos DB? 

Azure Cosmos DB is the next big leap in globally distributed, at scale, cloud databases. As a DocumentDB customer, you now have access to the new breakthrough system and capabilities offered by Azure Cosmos DB.

Azure Cosmos DB started as “Project Florence” in 2010 to address developer the pain-points faced by large-scale applications inside Microsoft. Observing that the challenges of building globally distributed apps are not a problem unique to Microsoft, in 2015 we made the first generation of this technology available to Azure developers in the form of Azure DocumentDB. 

Since that time, we’ve added new features and introduced significant new capabilities.  Azure Cosmos DB is the result.  As a part of this release of Azure Cosmos DB, DocumentDB customers, with their data, are automatically Azure Cosmos DB customers. The transition is seamless and you now have access to the new breakthrough system and capabilities offered by Azure Cosmos DB. These capabilities are in the areas of the core database engine as well as global distribution, elastic scalability, and industry-leading, comprehensive SLAs. Specifically, we have evolved the Azure Cosmos DB database engine to be able to efficiently map all popular data models, type systems, and APIs to the underlying data model of Azure Cosmos DB. 

The current developer facing manifestation of this work is the new support for [Gremlin](../cosmos-db/graph-introduction.md) and [Table Storage APIs](../cosmos-db/table-introduction.md). And this is just the beginning… We will be adding other popular APIs and newer data models over time with more advances towards performance and storage at global scale. 

It is important to point out that DocumentDB’s [SQL dialect](../documentdb/documentdb-sql-query.md) has always been just one of the many APIs that the underlying Cosmos DB was capable of supporting. As a developer using a fully managed service like Azure Cosmos DB, the only interface to the service is the APIs exposed by the service. To that end, nothing really changes for you as an existing DocumentDB customer. Azure Cosmos DB offers exactly the same SQL API that DocumentDB did. However, now (and in the future) you can get access to other capabilities, which were previously not accessible. 

Another manifestation of our continued work is the extended foundation for global and elastic scalability of throughput and storage. One of the very first manifestations of it is the [RU/m](../cosmos-db/request-units-per-minute.md) but we have more capabilities that we will be announcing in these areas. These new capabilities help reduce costs for our customers for various workloads. We have made several foundational enhancements to the global distribution subsystem. One of the many developer facing manifestations of this work is the consistent prefix consistency model (making in total five well-defined consistency models). However, there are many more interesting capabilities we will release as they mature. 

### What do I need to do to ensure my DocumentDB resources continue to run on Azure Cosmos DB?

Nothing. There are no changes you need to make. Your DocumentDB resources are now Azure Cosmos DB resources and there was no interruption in the service when this move occurred.

### What changes do I need to make for my app to work with Azure Cosmos DB?

There are no changes to make. Classes, namespaces, and NuGet package names have not changed. As always, we recommend that you keep your SDKs up to date to take advantage of the latest features and improvements. 

### What's changed in the Azure portal?

Azure DocumentDB no longer appears in the portal as an Azure service. Instead Azure Cosmos DB appears with a new icon, as shown in the following image. All your collections are available just as they were before, and you can still scale throughput, change consistency, and monitor SLAs. The capabilities of **Data Explorer (preview)** have been enhanced. You can now view and edit documents, create and run queries, and work with stored procedures, triggers, and UDF from one page, as shown in the following image. 

![View and copy an access key in the Azure portal, Keys blade](./media/documentdb-faq/cosmos-db-data-explorer.png)

### Are there changes to pricing?

No, the cost of running your app on Azure Cosmos DB is the same as it was before. However, you may benefit from the new **request unit per minute feature** we announced. For more information, see the [Scale throughput per minute](../cosmos-db/request-units-per-minute.md) article.

### Are there changes to the Service Level Agreements (SLAs)?

No, the SLAs for availability, consistency, latency, and throughput are unchanged and are still displayed in the portal. For details about the SLAs, see [SLA for Azure Cosmos DB](https://azure.microsoft.com/support/legal/sla/cosmos-db/).
   
![Todo app with sample data](./media/documentdb-faq/azure-cosmosdb-portal-metrics-slas.png)


[azure-portal]: https://portal.azure.com
[query]: documentdb-sql-query.md
