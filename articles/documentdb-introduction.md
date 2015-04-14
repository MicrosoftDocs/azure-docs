<properties 
	pageTitle="Introduction to Microsoft Azure DocumentDB | Azure" 
	description="Learn about Azure DocumentDB, a NoSQL document database, and its value to cloud and mobile applications. Learn how it manages data, and how you can use it in application development." 
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
	ms.date="04/08/2015" 
	ms.author="mimig"/>

#Introduction to Microsoft Azure DocumentDB

This article provides an introduction to Microsoft Azure DocumentDB, a NoSQL document database service for developers, IT Pros, and business decision makers. 

We recommend getting started by watching the following video, where Ryan CrawCour and Scott Hanselman introduce Azure DocumentDB and trying our [Query Playground](http://www.documentdb.com/sql/demo), where you can try out DocumentDB and run SQL queries against our dataset.

> [AZURE.VIDEO documentdb-101-with-ryan-crawcour]

Then, return to this article, where you'll learn the answers to the following questions:  

-	[What is DocumentDB and what value does it provide to cloud and mobile applications?](#what-is-docdb)
-	[How is my data managed in DocumentDB and how do I access it?](#data-management)
-	[How do I develop applications using DocumentDB?](#develop)
-	[What are my next steps to build a DocumentDB application?](#next-steps)  

##<a name="what-is-docdb"></a>What is Azure DocumentDB?  

Modern applications produce, consume and respond quickly to very large volumes of data. These applications evolve very rapidly and so does the underlying data schema. In response to this, developers have increasingly chosen schema-free NoSQL document databases as simple, fast, scalable solutions to store and process data while preserving the ability to quickly iterate over application data models and unstructured data feeds. However, many schema-free databases do not allow for complex queries and transactional processing, making advanced data management difficult. This is where DocumentDB comes in. Microsoft developed DocumentDB to fulfill these requirements when managing data for today's applications.

DocumentDB is a NoSQL document database service designed for modern mobile and web applications.  DocumentDB delivers consistently fast reads and writes, schema flexibility, and the ability to easily scale a database up and down on demand. DocumentDB enables complex ad hoc queries using a SQL language, supports well defined consistency levels, and offers JavaScript language integrated, multi-document transaction processing using the familiar programming model of stored procedures, triggers, and UDFs. 

DocumentDB natively supports JSON documents enabling easy iteration of application schema. It embraces the ubiquity of JSON and JavaScript, eliminating mismatch between application defined objects and database schema. Deep integration of JavaScript also allows developers to execute application logic efficiently and directly - within the database engine in a database transaction. 

Azure DocumentDB offers the following key capabilities and benefits:

-	**Ad hoc queries with familiar SQL syntax:** Store heterogeneous JSON documents within DocumentDB and query these documents through a familiar SQL syntax. DocumentDB utilizes a highly concurrent, lock free, log structured indexing technology to automatically index all document content. This enables rich real-time queries without the need to specify schema hints, secondary indexes, or views.

-	**JavaScript execution within the database:** Express application logic as stored procedures, triggers, and user defined functions (UDFs) using standard JavaScript. This allows your application logic to operate over JSON data without worrying about the mismatch between the application and the database schema. DocumentDB provides full transactional execution of JavaScript application logic directly inside the database engine. The deep integration of JavaScript enables the execution of INSERT, REPLACE, DELETE, and SELECT operations from within a JavaScript program as an isolated transaction. 

-	**Tunable consistency levels:** Select from four well defined consistency levels to achieve optimal trade-off between consistency and performance. For queries and read operations, DocumentDB offers four distinct consistency levels: strong, bounded-staleness, session, and eventual. These granular, well-defined consistency levels allow you to make sound trade-offs between consistency, availability, and latency. 

-	**Fully managed:** Eliminate the need to manage database and machine resources. As a fully-managed Microsoft Azure service, you do not need to manage virtual machines, deploy and configure software, or deal with complex data-tier upgrades. Every database is automatically backed up and protected against regional failures. You can easily add a DocumentDB account and provision capacity as you need it, allowing you to focus on your application instead of operating and managing your database.

-	**Elastically scalable throughput and storage:** Easily scale up or scale down DocumentDB to meet your application needs. Scaling is done through fine grained units (collections) of reserved SSD backed storage and throughput. You can elastically scale DocumentDB with predictable performance by creating more units as your application grows. 

-	**Open by design:** Get started quickly by using existing skills and tools. Programming against DocumentDB is simple, approachable, and does not require you to adopt new tools or adhere to custom extensions to JSON or JavaScript. You can access all of the database functionality including CRUD, query, and JavaScript processing over a simple RESTful HTTP interface. DocumentDB embraces existing formats, languages, and standards while offering high value database capabilities on top of them.

You can use DocumentDB to store flexible datasets that require query retrieval and transactional processing. Application scenarios may include user data for interactive web and mobile applications as well as storage, retrieval, and processing of application JSON data. A database can store any number of JSON documents, as DocumentDB is well suited for applications that run at scale on the internet.

##<a name="data-management"></a>Azure DocumentDB Resources
Azure DocumentDB manages data through well-defined database resources. These resources are replicated for high availability and are uniquely addressable by their logical URI. DocumentDB offers a simple HTTP based RESTful programming model for all resources. 

The DocumentDB database account is a unique namespace that gives you access to Azure DocumentDB. Before you can create a database account, you must have an Azure subscription, which gives you access to a variety of Azure services. 

All resources within DocumentDB are modeled and stored as JSON documents. Resources are managed as items, which are JSON documents containing metadata, and as feeds which are collections of items. Sets of items are contained within their respective feeds.

The image below shows the relationships between the DocumentDB resources:

![][1] 

A database account consists of a set of databases, each containing multiple collections, each of which can contain stored procedures, triggers, UDFs, documents, and related attachments. A database also has associated users, each with a set of permissions to access various other collections, stored procedures, triggers, UDFs, documents, or attachments. While databases, users, permissions, and collections are system-defined resources with well-known schemas - documents, stored procedures, triggers, UDFs, and attachments contain arbitrary, user defined JSON content.  

##<a name="develop"></a>Developing Against Azure DocumentDB
Azure DocumentDB exposes resources through a REST API that can be called by any language capable of making HTTP/HTTPS requests. Additionally, DocumentDB offers programming libraries for several popular languages. These libraries simplify many aspects of working with Azure DocumentDB by handling details such as address caching, exception management, automatic retries and so forth. Libraries are currently available for the following languages and platforms, with others on the way:  

- [.NET](http://go.microsoft.com/fwlink/?LinkID=402989)  
-	[Node.js](http://go.microsoft.com/fwlink/?LinkID=402990)
-  [Java](http://go.microsoft.com/fwlink/?LinkID=402380)
-	[JavaScript](http://go.microsoft.com/fwlink/?LinkID=402991)
-	[Python](http://go.microsoft.com/fwlink/?LinkID=402992)

Beyond basic Create, Read, Update and Delete operations, Azure DocumentDB provides a rich SQL query interface for retrieving JSON documents and server side support for transactional execution of JavaScript application logic. The query and script execution interfaces are available through all platform libraries as well as the REST APIs. 

###SQL Query
Azure DocumentDB supports querying documents using a SQL language, which is rooted in the JavaScript type system, and expressions with support for rich hierarchical queries. The DocumentDB query language is a simple yet powerful interface to query JSON documents. The language supports a subset of ANSI SQL grammar and adds deep integration of JavaScript object, arrays, object construction, and function invocation. DocumentDB provides its query model without any explicit schema or indexing hints from the developer.

User Defined Functions (UDFs) can be registered with DocumentDB and referenced as part of a SQL query, thereby extending the grammar to support custom application logic. These UDFs are written as JavaScript programs and executed within the database. 

For .NET developers, DocumentDB also offers a LINQ query provider as part of the .NET SDK. 

###Transactions and JavaScript Execution
DocumentDB allows you to write application logic as named programs written entirely in JavaScript. These programs are registered for a collection and can issue database operations on the documents within a given collection. JavaScript can be registered for execution as a trigger, stored procedure or user defined function. Triggers and stored procedures can create, read, update, and delete documents whereas user defined functions execute as part of the query execution logic without write access to the collection.

JavaScript execution within DocumentDB is modeled after the concepts supported by relational database systems, with JavaScript as a modern replacement for T-SQL. All JavaScript logic is executed within an ambient ACID transaction with snapshot isolation. During the course of its execution, if the JavaScript throws an exception, then the entire transaction is aborted.

##<a name="next-steps"></a>Next Steps
To get started with Azure DocumentDB, explore these resources:

-   [Try DocumentDB now](https://portal.azure.com/#gallery/Microsoft.DocumentDB)
-   [Query Playground](http://www.documentdb.com/sql/demo)
-	[DocumentDB resource model and concepts](documentdb-resources.md)
-	[Interact with DocumentDB resources](documentdb-interactions-with-resources.md)
-	[Create a DocumentDB database account](documentdb-create-account.md)
-	[Get started with the DocumentDB .NET SDK](documentdb-get-started.md)

[1]: ./media/documentdb-introduction/intro.png
