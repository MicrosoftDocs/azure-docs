<properties title="Introduction to Microsoft Azure DocumentDB" pageTitle="Introduction to Microsoft Azure DocumentDB | Azure" description="Learn about Azure DocumentDB and its value to cloud and mobile applications. Also, learn about how it manages data, and how you can use it in application development." metaKeywords="" services="documentdb" solutions="data-management"  authors="bradsev" manager="jhubbard" editor="cgronlun" videoId="" scriptId="" />

<tags ms.service="documentdb" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="08/20/2014" ms.author="spelluru" />

#Introduction to Microsoft Azure DocumentDB

This article provides an introduction to Microsoft Azure DocumentDB for developers, IT Pros, and business decision makers. By reading it, you learn:  

-	What Azure DocumentDB is and the value it provides to your cloud and mobile applications
-	How your data is managed in Azure DocumentDB
-	How to access data and develop applications using Azure DocumentDB
-	Where to go next to build your first Azure DocumentDB application  

##What is Azure DocumentDB?  

Modern applications produce, consume and respond quickly to very large volumes of data. These applications evolve very rapidly and so does the underlying data schema. In response to this, developers have increasingly chosen schema-free NoSQL databases as simple, fast, elastic solutions to store and process data while preserving the ability to quickly iterate over application data models and unstructured data feeds. However, many schema-free databases do not allow non-trivial queries and transactional processing, making advanced data management hard. Microsoft developed Azure DocumentDB to provide these capabilities when managing schema-free data.

Microsoft Azure DocumentDB is a document-oriented, NoSQL database service designed for modern mobile and web applications.  DocumentDB delivers consistently fast reads and writes, schema flexibility and the ability to easily scale a database up and down on demand. DocumentDB enables complex ad hoc queries using the SQL dialect, supports well defined consistency levels, and offers JavaScript language integrated, multi-document transaction processing using the familiar programming model of stored procedures, triggers and UDFs. 

Azure DocumentDB natively supports JSON documents enabling easy iteration of application schema. It embraces the ubiquity of JSON and JavaScript, eliminating mismatch between the application type system and database schema. Deep integration of JavaScript also allows developers to execute application logic efficiently directly within the database engine within a database transaction. 

Azure DocumentDB offers the following key capabilities and benefits:

-	**Ad hoc queries with familiar SQL syntax:** Store heterogeneous JSON documents within DocumentDB and query these documents through a familiar SQL syntax. DocumentDB utilizes a highly concurrent, lock free, log structured indexing technology to automatically index all document content. This enables rich real-time queries without the need to specify schema hints, secondary indexes or views.

-	**JavaScript execution within the database:** Express application logic as stored procedures, triggers and user defined functions (UDFs) using standard JavaScript. This allows your application logic to operate over JSON data without worrying about the impedance mismatch between the application and the database schema. DocumentDB provides full transactional execution of JavaScript application logic directly inside the database engine. The deep integration of JavaScript enables the execution of INSERT, REPLACE, DELETE and SELECT operations from within a JavaScript program as an isolated transaction. 

-	**Tunable consistency levels:** Select from four well defined consistency levels to achieve optimal trade-off between consistency and performance. For queries and read operations, DocumentDB offers four distinct consistency levels - Strong, Bounded-Staleness, Session, and Eventual. These granular, well-defined consistency levels allow you to make sound trade-offs between consistency, availability and latency. 

-	**Fully managed:** Eliminate the need to manage database and machine resources. As a fully-managed Microsoft Azure service, you do not need to manage virtual machines, deploy and configure software, or deal with complex data-tier upgrades. Every database is automatically backed up and protected against regional failures. You can easily add a DocumentDB account and provision capacity as you need it, allowing you to focus on your application vs. operating and managing your database.

-	**Elastically scalable throughput and storage:** Easily scale up or down DocumentDB to meet your application needs. Scaling is done through fine grained units of reserved SSD backed storage and throughput. You can elastically scale DocumentDB with predictable performance by purchasing more capacity units, as your application grows. 

-	**Open by design:** Get started quickly using existing skills and tools. Programming against DocumentDB is simple, approachable and does not require you to adopt new tools or adhere to custom extensions to JSON or JavaScript. You can access all of the database functionality including CRUD, query and JavaScript processing over a simple RESTful HTTP interface. DocumentDB embraces existing formats, languages and standards while offering high value database capabilities on top of them.

You can use Azure DocumentDB to store flexible datasets that require query retrieval and transactional processing. Application scenarios may include user data for interactive web and mobile applications as well as storage, retrieval and processing of application JSON data. A database can store any number of JSON documents, as such DocumentDB is well suited for applications that run at internet scale.

##Azure DocumentDB Resources
Azure DocumentDB manages data through well-defined database resources. These resources are replicated for high availability and uniquely addressable by their logical URI. DocumentDB offers a simple HTTP based RESTful programming model for all resources. 

The DocumentDB database account is a unique namespace that gives you access to Azure DocumentDB. Before you can create a database account, you must have an Azure subscription, which is a plan that gives you access to a variety of Azure services. 

All resources within Azure DocumentDB are modeled and stored as JSON documents. Resources are managed as items, which are JSON documents containing metadata and as feeds which are collections of items. Sets of items are contained within their respective feeds.

The image below shows the relationships between the Azure DocumentDB resources:

![][1] 

A database account consists of a set of databases, each containing multiple collections, each of which can contain stored procedures, triggers, UDFs, documents and related attachments. A database also has associated users each with a set of permissions to access various other collections, stored procedures, triggers, UDFs, documents or attachments. While databases, users, permissions and collections are system defined resources with well-known schemas, documents, stored procedures, triggers, UDFs and attachments contain arbitrary, user defined JSON content.  

##Developing Against Azure DocumentDB
Azure DocumentDB exposes resources via a REST API that can be called by any language capable of making HTTP/HTTPS requests. Additionally, Azure DocumentDB offers programming libraries for several popular languages. These libraries simplify many aspects of working with Azure DocumentDB by handling details such as address caching, exception management, automatic retries and so forth. Libraries are currently available for the following languages and platforms, with others on the way:  

- [.NET](http://go.microsoft.com/fwlink/?LinkID=402989)  
-	[Node.js](http://go.microsoft.com/fwlink/?LinkID=402990)
-	[JavaScript](http://go.microsoft.com/fwlink/?LinkID=402991)
-	[Python](http://go.microsoft.com/fwlink/?LinkID=402992)

Beyond basic Create, Read, Update and Delete operations, Azure DocumentDB provides a rich SQL query interface for retrieving JSON documents and server side support for transactional execution of JavaScript application logic. The query and script execution interfaces are available through all platform libraries as well as the REST APIs. 

###SQL Query
Azure DocumentDB supports query of documents using a SQL language which is rooted in the JavaScript type system and expressions with support for rich hierarchical queries. The DocumentDB query language is a simple yet powerful interface to query JSON documents. The language supports a subset of ANSI SQL grammar and adds deep integration of JavaScript object, arrays, object construction and function invocation. DocumentDB provides its query model without any explicit schema or indexing hints from the developer.

User Defined Functions (UDFs) can be registered with Azure DocumentDB and referenced as part of a SQL query thereby extending the grammar to support custom application logic. These UDFs are written as JavaScript programs and executed within the database. 

For .NET developers, Azure DocumentDB also offers a LINQ query provider as part of the .NET SDK. 

###Transactions and JavaScript Execution
Azure DocumentDB allows you to write application logic as named programs written entirely in JavaScript. These programs are registered for a collection and support issuing database operations on the documents within a given collection. Application JavaScript can be registered for execution as a Trigger, Stored Procedure or User Defined Function (UDF). Triggers and Stored Procedures can create, read, update and delete documents whereas UDFs execute as part of query execution without write access to the collection.

JavaScript execution within DocumentDB is modeled after the concepts supported by relational database systems, with JavaScript as a modern replacement for T-SQL. All JavaScript logic is executed within an ambient ACID transaction with snapshot isolation. During the course of its execution, if the JavaScript throws an exception, then the entire transaction is aborted.

##Next Steps
To get started with Azure DocumentDB, explore these resources:
- [Try DocumentDB now](https://portal.azure.com/#gallery/Microsoft.DocumentDB)
-	[Understand DocumentDB concepts](/documentation/articles/documentdb-resources/)
-	[Interact with DocumentDB](/documentation/articles/documentdb-interactions-with-resources/)
-	[Create a database account](/documentation/articles/documentdb-create-account/)
-	[Get started with DocumentDB](/documentation/articles/documentdb-get-started/)

[1]: ./media/documentdb-introduction/intro.png
