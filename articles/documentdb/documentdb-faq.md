<properties 
	pageTitle="DocumentDB Database Questions - Frequently Asked Questions | Microsoft Azure" 
	description="Get answers to frequently asked questions about Azure DocumentDB NoSql document database service. Answer database questions about capacity, performance levels, and scaling." 
	keywords="Database questions, frequently asked questions, documentdb, azure, Microsoft azure"
	services="documentdb" 
	authors="mimig1" 
	manager="jhubbard" 
	editor="monicar" 
	documentationCenter=""/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/01/2015" 
	ms.author="mimig"/>


#Frequently asked questions about DocumentDB

## Database questions about Microsoft Azure DocumentDB fundamentals

### What is Microsoft Azure DocumentDB? 
Microsoft Azure DocumentDB is a highly-scalable NoSQL document database-as-a-service that offers rich querying over schema-free data, helps deliver configurable and reliable performance, and enables rapid development, all through a managed platform backed by the power and reach of Microsoft Azure. DocumentDB is the right solution for web and mobile applications when predictable throughput, low latency, and a schema-free data model are key requirements. DocumentDB delivers schema flexibility and rich indexing via a native JSON data model, and includes multi-document transactional support with integrated JavaScript.  
  
For more database questions, answers, and instructions on deploying and using this service, see the [DocumentDB documentation page](http://azure.microsoft.com/documentation/services/documentdb/).

### What kind of database is DocumentDB?
DocumentDB is a NoSQL document oriented database that stores data in JSON format.  DocumentDB supports nested, self-contained-data structures that can be queried through a rich DocumentDB [SQL query grammar](documentdb-sql-query.md). DocumentDB provides high performance transactional processing of server side JavaScript through [stored procedures, triggers, and user defined functions](documentdb-programming.md). The database also supports developer tunable consistency levels with associated [performance levels](documentdb-performance-levels.md).
 
### Do DocumentDB databases have tables like a relational database (RDBMS)?
No, DocumentDB  stores data in collections of JSON documents.  For information on DocumentDB resources, see [DocumentDB resource model and concepts](documentdb-resources.md). 

### Do DocumentDB databases support schema-free data?
Yes, DocumentDB allows applications to store arbitrary JSON documents without schema definition or hints. Data is immediately available for query through the DocumentDB SQL query interface.   

### Does DocumentDB support ACID transactions?
Yes, DocumentDB supports cross-document transactions expressed as JavaScript stored procedures and triggers. Transactions are scoped to a single collection and executed with ACID semantics as all or nothing isolated from other concurrently executing code and user requests.  If exceptions are thrown through the server side execution of JavaScript application code, the entire transaction is rolled back. 

### What are the typical use cases for DocumentDB?  
DocumentDB is a good choice for new web and mobile applications where scale, performance, and the ability to query over schema-free data is important. DocumentDB lends itself to rapid development and supporting the continuous iteration of application data models. Applications that manage user generated content and data are [common use cases for DocumentDB](documentdb-use-cases.md).  

### What are the scale limits of DocumentDB?
DocumentDB accounts can be scaled in terms of storage and throughput by adding collections. Please see [DocumentDB limits](documentdb-limits.md) for the service quotas for the number of collections. If you require additional collections, please [contact support](documentdb-increase-limits.md) to have your account quota increased. 

### How much does Microsoft Azure DocumentDB cost?
Please refer to the [DocumentDB pricing details](http://go.microsoft.com/fwlink/p/?LinkID=402317) page for details. DocumentDB usage charges are determined by the number of collections in use, the number of hours the collections were online, and the [performance level](documentdb-performance-levels.md) of each collection. 

### Is there a free trial available?
If you are new to Azure, you can sign up for an [Azure free trial](https://azure.microsoft.com/pricing/free-trial/), which gives you 30 days and $200 to try all the Azure services. Or, if you have an MSDN subscription, you are eligible for [$150 in free Azure credits per month](http://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) to use on any Azure service.  

### How can I get additional help with DocumentDB?
If you need any help, please reach out to us on [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-documentdb), the [Azure DocumentDB MSDN Developer Forums](https://social.msdn.microsoft.com/forums/azure/home?forum=AzureDocumentDB), or schedule a [1:1 chat with the DocumentDB engineering team](http://www.askdocdb.com/). To stay up to date on the latest DocumentDB news and features, follow us on [Twitter](https://twitter.com/DocumentDB).

## Set up Microsoft Azure DocumentDB

### How do I sign-up for Microsoft Azure DocumentDB?
Microsoft Azure DocumentDB is available in the [Azure Preview portal][azure-portal].  First you must sign up for a Microsoft Azure subscription.  Once you sign up for a Microsoft Azure subscription, you can add a DocumentDB account to your Azure subscription. For instructions on adding a DocumentDB account, see [Create a DocumentDB database account](documentdb-create-account.md).   

### What is a master key?
A master key is a security token to access all resources for an account. Individuals with the key have read and write access to the all resources in the database account. Use caution when distributing master keys. The primary master key and secondary master key are available in the **Keys **blade of the [Azure Preview portal][azure-portal]. For more information about keys, see [View, copy, and regenerate access keys](documentdb-manage-account.md#keys).

### How do I create a database?
You can create databases using the [Azure Preview portal]() as described in [Create a DocumentDB database ](documentdb-create-database.md), one of the [DocumentDB SDKs](https://msdn.microsoft.com/library/azure/dn781482.aspx), or through the [REST APIs](https://msdn.microsoft.com/library/azure/dn781481.aspx).  

### What is a collection?
A collection is a container of JSON documents and the associated JavaScript application logic. Queries and transactions are scoped to collections. You can store a set of heterogeneous JSON documents within a single collection, all which are automatically indexed. 

Collections are also the billing entities for DocumentDB. Your monthly DocumentDB usage charges are determined by the number of collections in use, the number of hours the collections were online, and the [performance level](documentdb-performance-levels.md) of each collection. For more information, see [DocumentDB pricing](https://azure.microsoft.com/pricing/details/documentdb/).  

### Are there any limits on databases and collections?
Each collection comes with an allocation of database storage and provisioned throughput at one of the supported [performance levels](documentdb-performance-levels.md).  Quotas are also in place for each resource managed by the service. For a list of all limits, see [DocumentDB limits](documentdb-limits.md). To request a change to your account limits, see [Request increased DocumentDB account limits](documentdb-increase-limits.md).  

### How do I set up users and permissions?
You can create users and permissions using one of the [DocumentDB SDKs](https://msdn.microsoft.com/library/azure/dn781482.aspx) or through the [REST APIs](https://msdn.microsoft.com/library/azure/dn781481.aspx).   

## Database questions about developing against Microsoft Azure DocumentDB

### How to do I start developing against DocumentDB?
[SDKs](https://msdn.microsoft.com/library/azure/dn781482.aspx) are available for .NET, Python, Node.js, JavaScript, and Java.  Developers can also leverage the [RESTful HTTP APIs](https://msdn.microsoft.com/library/azure/dn781481.aspx) to interact with DocumentDB resources from a variety of platforms and languages. 

Samples for the DocumentDB [.NET](https://github.com/Azure/azure-documentdb-net/tree/master/samples/code-samples), [Java](https://github.com/Azure/azure-documentdb-java), [Node.js](https://github.com/Azure/azure-documentdb-node/tree/master/samples), and [Python](https://github.com/Azure/azure-documentdb-python) SDKs are available on GitHub.

### Does DocumentDB support SQL?
The DocumentDB SQL query language provides rich hierarchical and relational operators and extensibility via JavaScript based user defined functions (UDFs). JSON grammar allows for modeling JSON documents as trees with labels as the tree nodes, which is used by both the DocumentDB automatic indexing techniques as well as the SQL query dialect of DocumentDB.  For details on how to use the SQL grammar, please see the [Query DocumentDB][query] article.

### What are the data types supported by DocumentDB?
The primitive data types supported in DocumentDB are the same as JSON. JSON has a simple type system that consists of Strings, Numbers (IEEE754 double precision), and Booleans - true, false, and Nulls.  More complex data types like DateTime, Guid, Int64, and Geometry can be represented both in JSON and DocumentDB through the creation of nested objects using the { } operator and arrays using the [ ] operator. 

### How does DocumentDB provide concurrency?
DocumentDB supports optimistic concurrency control (OCC) through HTTP entity tags or ETags. Every DocumentDB resource has an ETag, and DocumentDB clients include their latest read version in write requests. If the ETag is current, the change is committed. If the value has been changed externally, the server rejects the write with a "HTTP 412 Precondition failure" response code. Clients must read the latest version of the resource and retry the request. 

### How do I perform transactions in DocumentDB?
DocumentDB supports language-integrated transactions via JavaScript stored procedures and triggers. All database operations inside scripts are executed under snapshot isolation scoped to the collection. A snapshot of the document versions (ETags) is taken at the start of the transaction and committed only if the script succeeds. If the JavaScript throws an error, the transaction is rolled back. See [DocumentDB server-side programming](documentdb-programming.md) for more details.

### How can I bulk insert documents into DocumentDB? 
There are three ways to bulk insert documents into DocumentDB:

- The data migration tool, as described in [Import data to DocumentDB](documentdb-import-data.md).
- Document Explorer in the Azure preview portal, as described in [Bulk add documents with Document Explorer](documentdb-view-json-document-explorer.md#BulkAdd).
- Stored procedures, as described in [DocumentDB server-side programming](documentdb-programming.md).

### Does DocumentDB support resource link caching?
Yes, because DocumentDB is a RESTful service, resource links are immutable and can be cached. DocumentDB clients can specify an "If-None-Match" header for reads against any resource like document or collection and update their local copies only when the server version has change. 




[azure-portal]: https://portal.azure.com
[query]: documentdb-sql-query.md
 