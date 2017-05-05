---
title: Azure Cosmos DB Database Questions - Frequently Asked Questions | Microsoft Docs
description: Get answers to frequently asked questions about Azure Cosmos DB a NoSQL document database service for JSON. Answer database questions about capacity, performance levels, and scaling.
keywords: Database questions, frequently asked questions, documentdb, azure, Microsoft azure
services: documentdb
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
ms.date: 03/08/2017
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
### What is DocumentDB's API for MongoDB?
Microsoft Azure DocumentDB's API for MongoDB is a compatability layer that allows applications to easily and transparently communicate with the native DocumentDB database engine using existing, community supported Apache MongoDB APIs and drivers. Developers can now use existing MongoDB tool chains and skills to build applications that leverage DocumentDB, benefitting from DocumentDB's unique capabilities, which include auto-indexing, backup maintenance, financially backed service level agreements (SLAs), etc.

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

[azure-portal]: https://portal.azure.com
[query]: documentdb-sql-query.md
