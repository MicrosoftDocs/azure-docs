---
title: 'Azure Cosmos DB: Introduction to the SQL API | Microsoft Docs'
description: Learn how you can use Azure Cosmos DB to store and query massive volumes of JSON documents with low latency using SQL and JavaScript. 
keywords: json database, document database
services: cosmos-db
author: rafats
manager: kfile

ms.service: cosmos-db
ms.component: cosmosdb-sql
ms.devlang: na
ms.topic: overview
ms.date: 05/22/2017
ms.author: rafats

---
# Introduction to Azure Cosmos DB: SQL API

[Azure Cosmos DB](introduction.md) is Microsoft's globally distributed, multi-model database service for mission-critical applications. Azure Cosmos DB provides [turn-key global distribution](distribute-data-globally.md), [elastic scaling of throughput and storage](partition-data.md) worldwide, single-digit millisecond latencies at the 99th percentile, [five well-defined consistency levels](consistency-levels.md), and guaranteed high availability, all backed by [industry-leading SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db/). Azure Cosmos DB [automatically indexes data](http://www.vldb.org/pvldb/vol8/p1668-shukla.pdf) without requiring you to deal with schema and index management. It is multi-model and supports document, key-value, graph, and columnar data models.

![Azure SQL API](./media/sql-api-introduction/cosmosdb-sql-api.png) 

With the SQL API, Azure Cosmos DB provides rich and familiar [SQL query capabilities](sql-api-sql-query.md) with consistent low latencies over schema-less JSON data. In this article, we provide an overview of the Azure Cosmos DB's SQL API, and how you can use it to store massive volumes of JSON data, query them within order of milliseconds latency, and evolve the schema easily. 

## What capabilities and key features does Azure Cosmos DB offer?
Azure Cosmos DB, via the SQL API, offers the following key capabilities and benefits:

* **Elastically scalable throughput and storage:** Easily scale up or scale down your JSON database to meet your application needs. Your data is stored on solid-state disks (SSD) for low predictable latencies. Azure Cosmos DB supports containers for storing JSON data called collections that can scale to virtually unlimited storage sizes and provisioned throughput. You can elastically scale Azure Cosmos DB with predictable performance seamlessly as your application grows. 


* **Multi-region replication:** Azure Cosmos DB transparently replicates your data to all regions you've associated with your Azure Cosmos DB account, enabling you to develop applications that require global access to data while providing tradeoffs between consistency, availability, and performance, all with corresponding guarantees. Azure Cosmos DB provides transparent regional failover with multi-homing APIs, and the ability to elastically scale throughput and storage across the globe. Learn more in [Distribute data globally with Azure Cosmos DB](distribute-data-globally.md).

* **Ad hoc queries with familiar SQL syntax:** Store heterogeneous JSON documents and query these documents through a familiar SQL syntax. Azure Cosmos DB utilizes a highly concurrent, lock free, log structured indexing technology to automatically index all document content. This enables rich real-time queries without the need to specify schema hints, secondary indexes, or views. Learn more in [Query Azure Cosmos DB](sql-api-sql-query.md). 
* **JavaScript execution within the database:** Express application logic as stored procedures, triggers, and user-defined functions (UDFs) using standard JavaScript. This allows your application logic to operate over data without worrying about the mismatch between the application and the database schema. The SQL API provides full transactional execution of JavaScript application logic directly inside the database engine. The deep integration of JavaScript enables the execution of INSERT, REPLACE, DELETE, and SELECT operations from within a JavaScript program as an isolated transaction. Learn more in [SQL server-side programming](programming.md).

* **Tunable consistency levels:** Select from five well-defined consistency levels to achieve optimal trade-off between consistency and performance. For queries and read operations, Azure Cosmos DB offers five distinct consistency levels: strong, bounded-staleness, session, consistent prefix, and eventual. These granular, well-defined consistency levels allow you to make sound trade-offs between consistency, availability, and latency. Learn more in [Using consistency levels to maximize availability and performance](consistency-levels.md).

* **Fully managed:** Eliminate the need to manage database and machine resources. As a fully managed Microsoft Azure service, you do not need to manage virtual machines, deploy and configure software, manage scaling, or deal with complex data-tier upgrades. Every database is automatically backed up and protected against regional failures. You can easily add an Azure Cosmos DB account and provision capacity as you need it, allowing you to focus on your application instead of operating and managing your database. 

* **Open by design:** Get started quickly by using existing skills and tools. Programming against the SQL API is simple, approachable, and does not require you to adopt new tools or adhere to custom extensions to JSON or JavaScript. You can access all of the database functionality including CRUD, query, and JavaScript processing over a simple RESTful HTTP interface. The SQL API embraces existing formats, languages, and standards while offering high value database capabilities on top of them.

* **Automatic indexing:** By default, Azure Cosmos DB automatically indexes all the documents in the database and does not expect or require any schema or creation of secondary indices. Don't want to index everything? Don't worry, you can [opt out of paths in your JSON files](indexing-policies.md) too.

* **Change feed support:** Change feed provides a sorted list of documents within an Azure Cosmos DB collection in the order in which they were modified. This feed can be used to listen for modifications to data in order to replicate data, trigger API calls, or perform stream processing on updates. Change feed is automatically enabled and easy to use: [learn more about change feed](https://docs.microsoft.com/azure/cosmos-db/change-feed). 

## <a name="data-management"></a>How do you manage data with the SQL API?
The SQL API helps manage JSON data through well-defined database resources. These resources are replicated for high availability and are uniquely addressable by their logical URI. The SQL API offers a simple HTTP-based RESTful programming model for all resources. 


The Azure Cosmos DB database account is a unique namespace that gives you access to Azure Cosmos DB. Before you can create a database account, you must have an Azure subscription, which gives you access to a variety of Azure services. 

All resources within Azure Cosmos DB are modeled and stored as JSON documents. Resources are managed as items, which are JSON documents containing metadata, and as feeds that are collections of items. Sets of items are contained within their respective feeds.

The image below shows the relationships between the Azure Cosmos DB resources:

![The hierarchical relationship between resources in Azure Cosmos DB][1] 

A database account consists of a set of databases, each containing multiple collections, each of which can contain stored procedures, triggers, UDFs, documents, and related attachments. A database also has associated users, each with a set of permissions to access various other collections, stored procedures, triggers, UDFs, documents, or attachments. While databases, users, permissions, and collections are system-defined resources with well-known schemas - documents, stored procedures, triggers, UDFs, and attachments contain arbitrary, user-defined JSON content.  

## <a name="develop"></a> How can I develop apps with the SQL API?

Azure Cosmos DB exposes resources through the REST APIs that can be called by any language capable of making HTTP/HTTPS requests. Additionally, we offer programming libraries for several popular languages for the SQL API. The client libraries simplify many aspects of working with the API by handling details such as address caching, exception management, automatic retries, and so forth. Libraries are currently available for the following languages and platforms:  

| Download | Documentation |
| --- | --- |
| [.NET SDK](http://go.microsoft.com/fwlink/?LinkID=402989) |[.NET library](/dotnet/api/overview/azure/cosmosdb?view=azure-dotnet) |
| [Java SDK](http://go.microsoft.com/fwlink/?LinkID=402380) |[Java library](/java/api/com.microsoft.azure.documentdb) |
| [JavaScript SDK](https://www.npmjs.com/package/@azure/cosmos) |[JavaScript library](https://github.com/Azure/azure-cosmos-js) |
| n/a |[Server-side library](https://azure.github.io/azure-cosmosdb-js-server/) |
| [Python SDK](https://pypi.python.org/pypi/pydocumentdb) |[Python library](https://github.com/Azure/azure-cosmos-python) |
| n/a | [API for MongoDB](mongodb-introduction.md)


Using the [Azure Cosmos DB Emulator](local-emulator.md), you can develop and test your application locally with the SQL API, without creating an Azure subscription or incurring any costs. When you're satisfied with how your application is working in the emulator, you can switch to using an Azure Cosmos DB account in the cloud.

Beyond basic create, read, update, and delete operations, the SQL API provides a rich SQL query interface for retrieving JSON documents and server side support for transactional execution of JavaScript application logic. The query and script execution interfaces are available through all platform libraries as well as the REST APIs. 

### SQL query
Azure Cosmos DB supports querying documents using a SQL language, which is rooted in the JavaScript type system, and expressions with support for relational, hierarchical, and spatial queries. The Azure Cosmos DB query language is a simple yet powerful interface to query JSON documents. The language supports a subset of ANSI SQL grammar and adds deep integration of JavaScript object, arrays, object construction, and function invocation. The SQL API provides its query model without any explicit schema or indexing hints from the developer.

User Defined Functions (UDFs) can be registered with the SQL API and referenced as part of a SQL query, thereby extending the grammar to support custom application logic. These UDFs are written as JavaScript programs and executed within the database. 

For .NET developers, the SQL API [.NET SDK](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.aspx) also offers a LINQ query provider. 

### Transactions and JavaScript execution
The SQL API allows you to write application logic as named programs written entirely in JavaScript. These programs are registered for a collection and can issue database operations on the documents within a given collection. JavaScript can be registered for execution as a trigger, stored procedure or user defined function. Triggers and stored procedures can create, read, update, and delete documents whereas user defined functions execute as part of the query execution logic without write access to the collection.

JavaScript execution within the Cosmos DB is modeled after the concepts supported by relational database systems, with JavaScript as a modern replacement for Transact-SQL. All JavaScript logic is executed within an ambient ACID transaction with snapshot isolation. During the course of its execution, if the JavaScript throws an exception, then the entire transaction is aborted.

## Next steps
Already have an Azure account? Then you can get started with Azure Cosmos DB by following our [quick starts](../cosmos-db/create-sql-api-dotnet.md), which will walk you through creating an account and getting started with Cosmos DB.

[1]: ./media/sql-api-introduction/json-database-resources1.png

