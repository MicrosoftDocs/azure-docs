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
ms.service: cosmosdb
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
Microsoft Azure Cosmos DB is a globally replicated, multi-model database service that that offers rich querying over schema-free data, helps deliver configurable and reliable performance, and enables rapid development, all through a managed platform backed by the power and reach of Microsoft Azure. Azure Cosmos DB is the right solution for web, mobile, gaming, and IoT applications when predictable throughput, high availability, low latency, and a schema-free data model are key requirements. Azure Cosmos DB delivers schema flexibility and rich indexing, and includes multi-document transactional support with integrated JavaScript.  

The Cosmos DB project started in 2011 as “Project Florence” to address developer pain-points that are faced by large Internet-scale applications inside Microsoft. Observing that these problems are not unique to Microsoft’s applications, we decided to make Cosmos DB generally available to external developers in 2015 in the form of Azure DocumentDB. The exponential growth of the service has validated our design choices and the unique tradeoffs we have made. The service is used ubiquitously internally within Microsoft, and is one of the fastest-growing services used by Azure developers externally. 

For more database questions, answers, and instructions on deploying and using this service, see the [Azure Cosmos DB documentation page](https://azure.microsoft.com/documentation/services/documentdb/).

### Where did DocumentDB go?

The DocumentDB API is one of the supported APIs and data models for Azure Cosmos DB. In addition, Azure Cosmos DB enables you to create graph, table, and key-value databases.

### How do I get to my DocumentDB account in the Azure portal?

Just click the Azure Cosmos DB icon in the menu on the left side of the Azure portal. If you had a DocumentDB account before, you now have an Azure Cosmos DB account, with no change to your billing.

### Do Azure Cosmos DB databases support schema-free data?
Yes, Azure Cosmos DB allows applications to store arbitrary JSON documents without schema definition or hints. Data is immediately available for query through the Azure Cosmos DB SQL query interface.   

### Does Azure Cosmos DB support ACID transactions?
Yes, Azure Cosmos DB supports cross-document transactions expressed as JavaScript stored procedures and triggers. Transactions are scoped to a single partition within each collection and executed with ACID semantics as all or nothing isolated from other concurrently executing code and user requests.  If exceptions are thrown through the server-side execution of JavaScript application code, the entire transaction is rolled back. For more information about transactions, see [Database program transactions](documentdb-programming.md#database-program-transactions).

### What are the typical use cases for Azure Cosmos DB?
Azure Cosmos DB is a good choice for new web, mobile, gaming and IoT applications where automatic scale, predictable performance, fast order of millisecond response times, and the ability to query over schema-free data is important. Azure Cosmos DB lends itself to rapid development and supporting the continuous iteration of application data models. Applications that manage user generated content and data are [common use cases for Azure Cosmos DB](documentdb-use-cases.md).  

### How does Azure Cosmos DB offer predictable performance?
A [request unit](documentdb-request-units.md) is the measure of throughput in Azure Cosmos DB. 1 RU corresponds to the throughput of the GET of a 1KB document. Every operation in Azure Cosmos DB, including reads, writes, SQL queries, and stored procedure executions has a deterministic RU value based on the throughput required to complete the operation. Instead of thinking about CPU, IO and memory and how they each impact your application throughput, you can think in terms of a single RU measure.

Each Azure Cosmos DB collection can be reserved with provisioned throughput in terms of RUs of throughput per second. For applications of any scale, you can benchmark individual requests to measure their RU values, and provision collections to handle the sum total of request units across all requests. You can also scale up or scale down your collection’s throughput as the needs of your application evolve. For more information about request units and for help determining your collection needs, read [Estimating throughput needs](documentdb-request-units.md#estimating-throughput-needs) and try the [throughput calculator](https://www.documentdb.com/capacityplanner).

### What compliance certifications does Azure Cosmos DB have?
Azure Cosmos DB is ISO 27001, ISO 27018, EUMC, HIPAA, and PCI compliant, with additional compliance certifications in progress. For more information, see the [Microsoft Trust Center](https://www.microsoft.com/en-us/TrustCenter/Compliance/HIPAA).

### What are the storage limits of Azure Cosmos DB?
There is no limit to the total amount of data that a collection can store in Azure Cosmos DB.

### What are the throughput limits of Azure Cosmos DB?
There is no limit to the total amount of throughput that a collection can support in Azure Cosmos DB, if your workload can be distributed roughly evenly among a sufficiently large number of partition keys.

### How much does Microsoft Azure Cosmos DB cost?
Refer to the [Azure Cosmos DB pricing details](https://azure.microsoft.com/pricing/details/documentdb/) page for details. Azure Cosmos DB usage charges are determined by the number of containers (collections/tables/graphs) provisioned, the number of hours the containers were online, and the consumed storage and provisioned throughput for each collection.

### Is there a free account available?
If you are new to Azure, you can sign up for an [Azure free account](https://azure.microsoft.com/free/), which gives you 30 days and $200 to try all the Azure services. Or, if you have a Visual Studio subscription, you are eligible for [$150 in free Azure credits per month](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) to use on any Azure service.  

You can also use the [Azure Cosmos DB Emulator](documentdb-nosql-local-emulator.md) to develop and test your application locally for free, without creating an Azure subscription. When you're satisfied with how your application is working in the Azure Cosmos DB Emulator, you can switch to using an Azure Cosmos DB account in the cloud.

### How can I get additional help with Azure Cosmos DB?
If you need any help, reach out to us on [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-documentdb), or schedule a 1:1 chat with the Azure Cosmos DB engineering team by sending mail to [askdocdb@microsoft.com](mailto:askdocdb@microsoft.com). 

## Set up Microsoft Azure Cosmos DB
### How do I sign up for Microsoft Azure Cosmos DB?
Microsoft Azure Cosmos DB is available in the [Azure Portal][azure-portal].  First you must sign up for a Microsoft Azure subscription.  Once you sign up for a Microsoft Azure subscription, you can add an Azure Cosmos DB account to your Azure subscription. For instructions on adding an Azure Cosmos DB account, see [Create an Azure Cosmos DB database account](documentdb-create-account.md). If you had a DocumentDB account in the past, you now have an Azure Cosmos DB account.  

### What is a master key?
A master key is a security token to access all resources for an account. Individuals with the key have read and write access to the all resources in the database account. Use caution when distributing master keys. The primary master key and secondary master key are available in the **Keys **blade of the [Azure Portal][azure-portal]. For more information about keys, see [View, copy, and regenerate access keys](documentdb-manage-account.md#keys).

### How do I create a database?
You can create databases using the [Azure Portal]() as described in [Create an Azure Cosmos DB collection and database](documentdb-create-collection.md), one of the [Azure Cosmos DB SDKs](documentdb-sdk-dotnet.md), or through the [REST APIs](https://msdn.microsoft.com/library/azure/dn781481.aspx).  

### What is a container?
A container is a group of documents, key/value entities and graph items, and their associated JavaScript application logic. A collection is a billable entity, where the [cost](documentdb-request-units.md) is determined by the throughput and storage used. Collections can span one or more partitions/servers and can scale to handle practically unlimited volumes of storage or throughput.

Collections are also the billing entities for Azure Cosmos DB. Each collection is billed hourly based on the provisioned throughput and the storage space used. For more information, see [Azure Cosmos DB pricing](https://azure.microsoft.com/pricing/details/documentdb/).  

### How do I set up users and permissions?
You can create users and permissions using one of the [Azure Cosmos DB SDKs](documentdb-sdk-dotnet.md) or through the [REST APIs](https://msdn.microsoft.com/library/azure/dn781481.aspx).   

## <a id="documentdb-api"></a>Database questions about developing with the DocumentDB API
### How to do I start developing with the DocumentDB API?
[SDKs](documentdb-sdk-dotnet.md) are available for .NET, Python, Node.js, JavaScript, and Java.  Developers can also use the [RESTful HTTP APIs](https://msdn.microsoft.com/library/azure/dn781481.aspx) to interact with Azure Cosmos DB resources from various platforms and languages.

Samples for the Azure Cosmos DB [.NET](documentdb-dotnet-samples.md), [Java](https://github.com/Azure/azure-documentdb-java), [Node.js](documentdb-nodejs-samples.md), and [Python](documentdb-python-samples.md) SDKs are available on GitHub.

### Can I query with SQL?
Yes, DocumentDB API supports SQL (an enhanced subset of SQL). It supports hierarchical and relational operators and extensibility via JavaScript based user-defined functions (UDFs). JSON grammar allows for modeling JSON documents as trees with labels as the tree nodes, which is used by both the Azure Cosmos DB automatic indexing techniques and the SQL query dialect of Azure Cosmos DB. For details on how to use the SQL grammar, see the [QueryDocumentDB][query] article.

### Can I perform aggregation queries?
Azure Cosmos DB supports low latency aggregation at any scale via aggregate functions `COUNT`, `MIN`, `MAX`, `AVG`, and `SUM` via the SQL grammar. For more information, see [Aggregate functions](documentdb-sql-query.md#Aggregates).

### How does the DocumentDB API provide concurrency?
Azure Cosmos DB supports optimistic concurrency control (OCC) through HTTP entity tags or etags. Every Azure Cosmos DB resource has an etag, and the etag is set on the server every time a document is updated. The etag header and the current value are included in all response messages. Etags can be used with the If-Match header to allow the server to decide if a resource should be updated. The If-Match value is the etag value to be checked against. 

* If the etag value matches the server etag value, the resource will be updated. 
* If the etag is no longer current, the server rejects the operation with an "HTTP 412 Precondition failure" response code. The client will then have to refetch the resource to acquire the current etag value for the resource. 

In addition, etags can be used with If-None-Match header to determine if a re-fetch of a resource is needed.

To use optimistic concurrency in .NET, use the [AccessCondition](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.accesscondition.aspx) class. For a .NET sample, see [Program.cs](https://github.com/Azure/azure-documentdb-dotnet/blob/master/samples/code-samples/DocumentManagement/Program.cs) in the DocumentManagement sample on github.

### How do I perform transactions?
The DocumentDB API supports language-integrated transactions via JavaScript stored procedures and triggers. All database operations inside scripts are executed under snapshot isolation scoped to the collection if it is a single-partition collection, or documents with the same partition key value within a collection, if the collection is partitioned. A snapshot of the document versions (ETags) is taken at the start of the transaction and committed only if the script succeeds. If the JavaScript throws an error, the transaction is rolled back. See [Azure Cosmos DB server-side programming](documentdb-programming.md) for more details.

### How can I bulk insert documents?
There are three ways to bulk insert documents using the DocumentDB API:

* The data migration tool, as described in [Import data to Azure Cosmos DB](documentdb-import-data.md).
* Document Explorer in the Azure Portal, as described in [Bulk add documents with Document Explorer](documentdb-view-json-document-explorer.md#bulk-add-documents).
* Stored procedures, as described in [Azure Cosmos DB server-side programming](documentdb-programming.md).

### Does the REST API support resource link caching?
Yes, because Azure Cosmos DB is a RESTful service, resource links are immutable and can be cached. Azure Cosmos DB clients can specify an "If-None-Match" header for reads against any resource like document or collection and update their local copies only when the server version has change.

## <a id="mongodb-api"></a>Database questions about developing with the MongoDB API

### How to do run MongoDB applications with Azure Cosmos DB?
The quickest way to connect to Azure Cosmos DB's API for MongoDB is to head over to the [Azure portal](https://portal.azure.com). Navigate your way to your account. In the account's *Left Navigation*, click on *Quick Start*. *Quick Start* is the best way to get code snippets to connect to your database. 

Azure Cosmos DB enforces strict security requirements and standards. Azure Cosmos DB accounts require authentication and secure communication via SSL, so you must use SSL/TLSv1.2 within your tools/drivers.

For more details, see [Connect to your API for MongoDB database](documentdb-connect-mongodb-account.md).

### Are error codes for Azure Cosmos DB same as MongoDB?
In addition to the common MongoDB error codes, Azure Cosmos DB returns the following error codes to help you debug certain problems.


| Error               | Code  | Description  | Solution  |
|---------------------|-------|--------------|-----------|
| TooManyRequests     | 16500 | The total number of request units consumed has exceeded the provisioned request unit rate for the collection and has been throttled. | Consider scaling the throughput of the collection from the Azure Portal or retrying again. |
| ExceededMemoryLimit | 16501 | As a multi-tenant service, the operation has exceeded the client's memory allotment. | Reduce the scope of the operation through a more restrictive query criteria or contact support from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). <br><br>*Ex:  &nbsp;&nbsp;&nbsp;&nbsp;db.getCollection('users').aggregate([<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{$match: {name: "Andy"}}, <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{$sort: {age: -1}}<br>&nbsp;&nbsp;&nbsp;&nbsp;])*) |

## <a id="table-api"></a>Database questions about developing with the Table API (preview)

We use Azure Cosmos DB: Table API (preview) to refer to the premium offering by Azure Cosmos DB for table support announced at Build 2017, and standard Table SDK to refer to Azure Table storage accounts. 

### How can I use the new Table API offering? 
Complete the [Table API](../cosmos-db/create-table-dotnet.md) quickstart to get started.

### Do I need a new SDK to use the Table API (preview)? 
Yes, during the preview, Azure Cosmos DB supports the Table API using the .NET SDK. You can download the [Azure Storage Preview SDK](https://aka.ms/premiumtablenuget) from NuGet, that has the same classes and method signatures as the [Azure Storage SDK](https://www.nuget.org/packages/WindowsAzure.Storage), but also can connect to Azure Cosmos DB accounts using the Table API.

### How do I provide the feedback about the SDK, bugs?
Please share your feedback using one of these methods:

* [On Uservoice](https://feedback.azure.com/forums/263030-documentdb)
* [MSDN forum](https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=AzureDocumentDB)
* [Stackoverflow](http://stackoverflow.com/questions/tagged/azure-documentdb)

### What is the connection string that I need to use to connect to the Table API (preview)?
The connection string is `DefaultEndpointsProtocol=https;AccountName=<AccountNamefromCosmos DB;AccountKey=<FromKeysPaneofCosmosDB>;TableEndpoint=https://<AccountNameFromDocumentDB>.documents.azure.com`. You can get the connection string from the Keys page in the Azure portal. 

### How do I override the config settings for the request options in the new Tables API(Preview)?
These settings are documented [Azure Cosmos DB capabilities](../cosmos-db/tutorial-develop-table-dotnet.md#azure-cosmos-db-capabilities). You can change the settings by adding them to app.config in the appsettings section in client application.
<appSettings>
	<add key="TableConsistencyLevel" value="Eventual|Strong|Session|BoundedStaleness|ConsistentPrefix"/>
	<add key="TableThroughput" value="<PositiveIntegerValue"/>
	<add key="TableIndexingPolicy" value="<jsonindexdefn>"/>
	<add key="TableUseGatewayMode" value="True|False"/>
	<add key="TablePreferredLocations" value="Location1|Location2|Location3|Location4>"/>
</appSettings>


### Is there any change to existing customers that use the existing Standard Table SDK?
No, there are no changes for existing or new customers using existing Standard Table SDK. 

### How do I view table data that is stored in Azure Cosmos DB for use with the Tables API (review)? 
You can use the Azure portal to browse the data. You can also use the Tables API (preview) code or the tools mentioned below. 

### Which tools will work with Tables API (preview)? 
Older version of Azure Explorer (0.8.9).

Tools that have flexibility to take a connection string in the format specified earlier can support the new Table API (preview). A list of table tools is provided on the [Azure Storage Client Tools](../storage/storage-explorers.md) page. 

### Does PowerShell/CLI work with the new Tables API (preview) ?
Not at this time.

### Is the concurrency on operations controlled?
Yes, optimistic concurrency is provided via the use of the ETag mechanism as expected in Standard Table API. 

### Is OData query model supported for entities? 
Yes, the Table API (preview) supports OData query and Linq query. 

### Can I connect to standard Azure Table and the new premium Table API at side by side in same application ? 
Yes this can be achieved by creating two different instances of the CloudTableClient.

### How do I migrate existing Table Storage application to this new offering?
Please contact askdocdb@microsoft.com if you'd like to take advantage of the new Table API offering on your existing Table storage data. 

### What is the roadmap for this service, when will other functionality of Standard Table API be offered?
We plan to add support for SAS tokens, ServiceContext, Stats, Encryption, Analytics and other features as we proceed towards GA.  Please provide us feedback on [Uservoice](https://feedback.azure.com/forums/263030-documentdb). 

### How is expansion of the storage size done for this service, say I start with N GBs of data and my data will grow to 1 TB overtime?  
Cosmos DB is designed to provide unlimited storage via use of horizontal scaling. Our service will monitor and effectively increase your storage. 

### How do I monitor the Cosmos DB offering?
You can use the Cosmos DB Metrics pane to monitor requests and storage usage. 

### How do I calculate throughput I require?
You can use the Capacity estimator to calculate the TableThroughput required for the operations, as documented here [Estimate Request Units and Data Storage](https://www.documentdb.com/capacityplanner). 

### Can I use the new Table API (preview) SDK locally with the emulator?
Yes, you can use the Cosmos DB Tables API (preview) on the local emulator when you use the new SDK. Please download new emulator from the [here](documentdb-nosql-local-emulator.md).  

### Can my existing application work with the Table API (preview)? 
The surface area of the new Table API (preview) is compatible with existing Azure Standard Table SDK across the create, delete, update, query operations with the .NET API. 

### Do I need to migrate existing Azure Table based application to new SDK if I do not want to use Table API (preview) features?
No, existing customers can create and use present Standard Table assets without interruption of any kind. However, if you do not use the new Table API (preview), you cannot benefit from the automatic index, additional consistency option, or global distribution. 

### How do I add replication for this data in Premium Table API (Preview) across multiple regions of Azure?
You can use the Cosmos DB portal’s [global replication settings](documentdb-portal-global-replication.md) for adding regions. 

### How do I change the primary write region Premium Table API(preview)?
You can use Cosmos DB’s global replication portal pane to add a region and then failover to it. For instructions see [Developing with multi-region Azure Cosmos DB accounts](documentdb-developing-with-multiple-regions.md).

### How do I configure my preferred read regions for low latency when I distribute my data? 
Cosmos DB Consistency settings in the portal help in providing options for low latency when application is distributed. Consistency options can be set for the container for distribution. Cosmos DB also allows client to choose a consistency level on individual operation.  
When client connects, it can specify a consistency level – this can be changed via the app.config setting for the value of TableConsistencyLevel key. 
By default, Premium Tables API(Preview) provides low latency reads with Read your own writes with session consistency as default. For more information, see [Consistency levels](documentdb-consistency-levels.md). 

### Does this mean compared to eventual & strong consistency that is possible with standard Table  – we now have more choices ?
Yes, you can choose between five well-defined consistency levels. These choices are documented in the [Consistency levels](documentdb-consistency-levels.md) article to help application developers leverage the distributed nature of Cosmos DB. 

### When global distribution is enabled – how long does it take to replicate the data?
We commit the data durably in local region and push the data to other regions immediately in matter of milliseconds and this replication is only dependent on the RTT of the datacenter. Please read up on the global distribution abilities of Cosmos DB in [Azure Cosmos DB: A globally distributed database service on Azure](documentdb-distribute-data-globally.md).

### Can the request consistency be changed?
Yes, by providing the value for TableConsistencyLevel key in the app.config file. Theses are the possible values - Session|Eventual|Strong|Bounded Staleness|ConsistentPrefix. This is documented in the [consistency levels](documentdb-consistency-levels.md) article. 

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

### When should I change TableThroughput for the Table API (preview)?
You should change the TableThroughput  when you do the ETL of data or want to upload lot of data in short amount of time. 

OR

You need more throughput from the container at the backend as you see Used Throughput is more than Provisioned throughput on the metrics and you are getting throttled. This is documented in the [Set throughput](documentdb-set-throughput.md) article.

### Is there a Default TableThroughput which is set for newly provisioned Tables?
Yes,  If you do not override the TableThroughput via app.config and do not use a pre-created container in Cosmos DB - the service creates a Table with throughput of 400.

### Is there any change of pricing for existing customers of Standard Table API?
None. There is no change in price for existing Standard Table API customers. 

### How is the price calculated for the Table API(Preview)? 
It depends on the allocated TableThroughput. 

### Do you plan to provide more price options in the future?
Yes, Cosmos DB supports throughput-optimized tables. We will introduce storage-optimized offers that provide the cost-effectiveness of the current Azure Table storage tables.

### Can I scale up or down the throughput of my Tables API (Preview) Table? 
Yes, you can use the Cosmos DB portal's scale pane to do the same. This is documented in the [Set throughput](documentdb-set-throughput.md) topic.

### Will I experience the throttling on the tables? 
If request rate exceed the capacity of the provisioned throughput for the underlying container, you will get an error and the SDK will retry the call using the retry policy.

### If I develop an application today – what should I choose -  the new Tables API (Preview) and the Azure Storage table API?
You should always choose a platform that provides the closest match to your requirements. The new Tables API (preview) leverages the Azure Cosmos DB stack to provide low latency, automatic indexing, global distribution, and well-defined consistency levels.  

### Why do I need to choose a throughput apart from PartitionKey and RowKey?
Cosmos DB will set a default throughput for your container if you do not provide one in the app.config. 

Cosmos DB provides guarantees for performance, latency with upper bounds on operation. This is possible when engine can enforce governance on tenants. Setting TableThroughput is basically ensuring you get guaranteed throughput, latency as now platform will reserve this capacity and guarantee operation success.  

The specification of throughput also allows you to elastically change it to leverage the seasonality of your application and meet the throughput needs and save costs.

### So PartitionKey and RowKey are still required with the new Table API ? 
Yes. Because the surface area of Table API is similar to Azure Table storage SDK, the partition key provides great way to distribute the data. Row key is unique within that partition. 

[azure-portal]: https://portal.azure.com
[query]: documentdb-sql-query.md
