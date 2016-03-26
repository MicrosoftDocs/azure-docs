<properties 
	pageTitle="DocumentDB Database Questions - Frequently Asked Questions | Microsoft Azure" 
	description="Get answers to frequently asked questions about Azure DocumentDB a NoSQL document database service for JSON. Answer database questions about capacity, performance levels, and scaling." 
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
	ms.date="03/30/2016" 
	ms.author="mimig"/>


#Frequently asked questions about DocumentDB

## Database questions about Microsoft Azure DocumentDB fundamentals

### What is Microsoft Azure DocumentDB? 
Microsoft Azure DocumentDB is a highly-scalable NoSQL document database-as-a-service that offers rich querying over schema-free data, helps deliver configurable and reliable performance, and enables rapid development, all through a managed platform backed by the power and reach of Microsoft Azure. DocumentDB is the right solution for web, mobile, gaming and IoT applications when predictable throughput, low latency, and a schema-free data model are key requirements. DocumentDB delivers schema flexibility and rich indexing via a native JSON data model, and includes multi-document transactional support with integrated JavaScript.  
  
For more database questions, answers, and instructions on deploying and using this service, see the [DocumentDB documentation page](https://azure.microsoft.com/documentation/services/documentdb/).

### What kind of database is DocumentDB?
DocumentDB is a NoSQL document oriented database that stores data in JSON format.  DocumentDB supports nested, self-contained-data structures that can be queried through a rich DocumentDB [SQL query grammar](documentdb-sql-query.md). DocumentDB provides high performance transactional processing of server side JavaScript through [stored procedures, triggers, and user defined functions](documentdb-programming.md). The database also supports developer tunable consistency levels with associated [performance levels](documentdb-performance-levels.md).
 
### Do DocumentDB databases have tables like a relational database (RDBMS)?
No, DocumentDB  stores data in collections of JSON documents.  For information on DocumentDB resources, see [DocumentDB resource model and concepts](documentdb-resources.md). 

### Do DocumentDB databases support schema-free data?
Yes, DocumentDB allows applications to store arbitrary JSON documents without schema definition or hints. Data is immediately available for query through the DocumentDB SQL query interface.   

### Does DocumentDB support ACID transactions?
Yes, DocumentDB supports cross-document transactions expressed as JavaScript stored procedures and triggers. Transactions are scoped to a single partition within each collection and executed with ACID semantics as all or nothing isolated from other concurrently executing code and user requests.  If exceptions are thrown through the server side execution of JavaScript application code, the entire transaction is rolled back. 

### What are the typical use cases for DocumentDB?  
DocumentDB is a good choice for new web, mobile, gaming and IoT applications where automatic scale, predictable performance, fast order of millisecond response times, and the ability to query over schema-free data is important. DocumentDB lends itself to rapid development and supporting the continuous iteration of application data models. Applications that manage user generated content and data are [common use cases for DocumentDB](documentdb-use-cases.md).  

### How does DocumentDB offer predictable performance?
When you create a collection, you reserve throughput in terms of request units (RU) per second. Each request is assigned a request unit charge that is proportionate to the amount of system resources like CPU and IO consumed by the operation.  The simplest operation - a read of a 1KB operation with eventual consistency consumes 1 request unit. 

A read consumes the same 1 RU regardless of the number of items stored or the number of concurrent requests running at the same. Larger documents require higher request units depending on the size. All operations against DocumentDB, including complex operations like SQL queries have a predictable RU value which can be determined at development time. If you know the size of your documents and the count of each operation (reads, writes and queries) to support for your application, you can provision the exact amount of throughput required for your application's needs. 

For example, here's a table that shows how many request units to provision at three different document sizes (1KB, 4KB, and 64KB) and at two different performance levels (500 reads/second + 100 writes/second and 500 reads/second + 500 writes/second). 

<table border="0" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td valign="top"><p><strong>Document size</strong></p></td>
            <td valign="top"><p><strong>Reads/second</strong></p></td>
            <td valign="top"><p><strong>Writes/second</strong></p></td>
            <td valign="top"><p><strong>Request units</strong></p></td>
        </tr>
        <tr>
            <td valign="top"><p>1 KB</p></td>
            <td valign="top"><p>500</p></td>
            <td valign="top"><p>100</p></td>
            <td valign="top"><p>(500 * 1) + (100 * 5) = 1,000 RU/s</p></td>
        </tr>
        <tr>
            <td valign="top"><p>1 KB</p></td>
            <td valign="top"><p>500</p></td>
            <td valign="top"><p>500</p></td>
            <td valign="top"><p>(500 * 5) + (100 * 5) = 3,000 RU/s</p></td>
        </tr>
        <tr>
            <td valign="top"><p>4 KB</p></td>
            <td valign="top"><p>500</p></td>
            <td valign="top"><p>100</p></td>
            <td valign="top"><p>(500 * 1.3) + (100 * 7) = 1,350 RU/s</p></td>
        </tr>
        <tr>
            <td valign="top"><p>4 KB</p></td>
            <td valign="top"><p>500</p></td>
            <td valign="top"><p>500</p></td>
            <td valign="top"><p>(500 * 1.3) + (500 * 7) = 4,150 RU/s</p></td>
        </tr>
        <tr>
            <td valign="top"><p>64 KB</p></td>
            <td valign="top"><p>500</p></td>
            <td valign="top"><p>100</p></td>
            <td valign="top"><p>(500 * 10) + (100 * 48) = 9,800 RU/s</p></td>
        </tr>
        <tr>
            <td valign="top"><p>64 KB</p></td>
            <td valign="top"><p>500</p></td>
            <td valign="top"><p>500</p></td>
            <td valign="top"><p>(500 * 10) + (500 * 48) = 29,000 RU/s</p></td>
        </tr>
    </tbody>
</table>

Learn more about request units [here](documentdb-performance-levels.md).

### Is DocumentDB HIPAA compliant?
Yes, DocumentDB is HIPAA compliant. HIPAA establishes requirements for the use, disclosure, and safeguarding of individually identifiable health information. For more information, see the [Microsoft Trust Center](https://www.microsoft.com/en-us/TrustCenter/Compliance/HIPAA).

### What are the storage limits of DocumentDB? 
There is no theoretical limit to the total amount of data that a collection can store in DocumentDB. If you would like to store over 250 GB of data within a single collection, please [contact support](documentdb-increase-limits.md) to to have your account quota increased. 

### What are the throughput limits of DocumentDB? 
There is no theoretical limit to the total amount of throughput that a collection can support in DocumentDB, if your workload can be distributed roughly evenly among a sufficiently large number of partition keys. If you wish to exceed 250,000 request units/second per collection or account, please [contact support](documentdb-increase-limits.md) to to have your account quota increased. 

### How much does Microsoft Azure DocumentDB cost?
Please refer to the [DocumentDB pricing details](https://azure.microsoft.com/pricing/details/documentdb/) page for details. DocumentDB usage charges are determined by the number of collections in use, the number of hours the collections were online, and the consumed storage and provisioned throughput for each collection. 

### Is there a free account available?
If you are new to Azure, you can sign up for an [Azure free account](https://azure.microsoft.com/pricing/free-trial/), which gives you 30 days and $200 to try all the Azure services. Or, if you have an Visual Studio subscription, you are eligible for [$150 in free Azure credits per month](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) to use on any Azure service.  

### How can I get additional help with DocumentDB?
If you need any help, please reach out to us on [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-documentdb), the [Azure DocumentDB MSDN Developer Forums](https://social.msdn.microsoft.com/forums/azure/home?forum=AzureDocumentDB), or schedule a [1:1 chat with the DocumentDB engineering team](http://www.askdocdb.com/). To stay up to date on the latest DocumentDB news and features, follow us on [Twitter](https://twitter.com/DocumentDB).

## Set up Microsoft Azure DocumentDB

### How do I sign-up for Microsoft Azure DocumentDB?
Microsoft Azure DocumentDB is available in the [Azure Portal][azure-portal].  First you must sign up for a Microsoft Azure subscription.  Once you sign up for a Microsoft Azure subscription, you can add a DocumentDB account to your Azure subscription. For instructions on adding a DocumentDB account, see [Create a DocumentDB database account](documentdb-create-account.md).   

### What is a master key?
A master key is a security token to access all resources for an account. Individuals with the key have read and write access to the all resources in the database account. Use caution when distributing master keys. The primary master key and secondary master key are available in the **Keys **blade of the [Azure Portal][azure-portal]. For more information about keys, see [View, copy, and regenerate access keys](documentdb-manage-account.md#keys).

### How do I create a database?
You can create databases using the [Azure Portal]() as described in [Create a DocumentDB database](documentdb-create-database.md), one of the [DocumentDB SDKs](documentdb-sdk-dotnet.md), or through the [REST APIs](https://msdn.microsoft.com/library/azure/dn781481.aspx).  

### What is a collection?
A collection is a container of JSON documents and the associated JavaScript application logic. A collection is a billable entity, where the [cost](documentdb-performance-levels.md) is determined by the performance level associated with the collection. Collections can span one or more partitions/servers and can scale to handle practically unlimited volumes of storage or throughput.

Collections are also the billing entities for DocumentDB. Each collection is billed hourly based on the provisioned throughput and the storage space used. For more information, see [DocumentDB pricing](https://azure.microsoft.com/pricing/details/documentdb/).  

### How do I set up users and permissions?
You can create users and permissions using one of the [DocumentDB SDKs](documentdb-sdk-dotnet.md) or through the [REST APIs](https://msdn.microsoft.com/library/azure/dn781481.aspx).   

## Database questions about developing against Microsoft Azure DocumentDB

### How to do I start developing against DocumentDB?
[SDKs](documentdb-sdk-dotnet.md) are available for .NET, Python, Node.js, JavaScript, and Java.  Developers can also leverage the [RESTful HTTP APIs](https://msdn.microsoft.com/library/azure/dn781481.aspx) to interact with DocumentDB resources from a variety of platforms and languages. 

Samples for the DocumentDB [.NET](documentdb-dotnet-samples.md), [Java](https://github.com/Azure/azure-documentdb-java), [Node.js](documentdb-nodejs-samples.md), and [Python](documentdb-python-samples.md) SDKs are available on GitHub.

### Does DocumentDB support SQL?
The DocumentDB SQL query language is an enhanced subset of the query functionality supported by SQL. The DocumentDB SQL query language provides rich hierarchical and relational operators and extensibility via JavaScript based user defined functions (UDFs). JSON grammar allows for modeling JSON documents as trees with labels as the tree nodes, which is used by both the DocumentDB automatic indexing techniques as well as the SQL query dialect of DocumentDB.  For details on how to use the SQL grammar, please see the [Query DocumentDB][query] article.

### What are the data types supported by DocumentDB?
The primitive data types supported in DocumentDB are the same as JSON. JSON has a simple type system that consists of Strings, Numbers (IEEE754 double precision), and Booleans - true, false, and Nulls.  More complex data types like DateTime, Guid, Int64, and Geometry can be represented both in JSON and DocumentDB through the creation of nested objects using the { } operator and arrays using the [ ] operator. 

### How does DocumentDB provide concurrency?
DocumentDB supports optimistic concurrency control (OCC) through HTTP entity tags or ETags. Every DocumentDB resource has an ETag, and DocumentDB clients include their latest read version in write requests. If the ETag is current, the change is committed. If the value has been changed externally, the server rejects the write with a "HTTP 412 Precondition failure" response code. Clients must read the latest version of the resource and retry the request. 

### How do I perform transactions in DocumentDB?
DocumentDB supports language-integrated transactions via JavaScript stored procedures and triggers. All database operations inside scripts are executed under snapshot isolation scoped to the collection if it is a single-partition collection, or documents with the same partition key value within a collection, if the collection is partitioned. A snapshot of the document versions (ETags) is taken at the start of the transaction and committed only if the script succeeds. If the JavaScript throws an error, the transaction is rolled back. See [DocumentDB server-side programming](documentdb-programming.md) for more details.

### How can I bulk insert documents into DocumentDB? 
There are three ways to bulk insert documents into DocumentDB:

- The data migration tool, as described in [Import data to DocumentDB](documentdb-import-data.md).
- Document Explorer in the Azure Portal, as described in [Bulk add documents with Document Explorer](documentdb-view-json-document-explorer.md#BulkAdd).
- Stored procedures, as described in [DocumentDB server-side programming](documentdb-programming.md).

### Does DocumentDB support resource link caching?
Yes, because DocumentDB is a RESTful service, resource links are immutable and can be cached. DocumentDB clients can specify an "If-None-Match" header for reads against any resource like document or collection and update their local copies only when the server version has change. 




[azure-portal]: https://portal.azure.com
[query]: documentdb-sql-query.md
 