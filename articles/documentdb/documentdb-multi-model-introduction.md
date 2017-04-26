---
title: Introduction to Azure Cosmos DB | Microsoft Docs
description: Learn about Azure Cosmos DB. This multi-model database is built for big data, elastic scalability, and high availability.
keywords: json database, document database
services: documentdb
author: mimig1
manager: jhubbard
editor: monicar
documentationcenter: ''

ms.assetid: 
ms.service: documentdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 04/21/2017
ms.author: mimig

---

# Introduction to Azure Cosmos DB

## What is Azure Cosmos DB?

Azure Cosmos DB is the next generation of the DocumentDB stack. Azure Cosmos DB is a fast, flexible, and comprehensive cloud-based service that provides OSS programming APIs over a multi-model, planet-scale geo-distributed data store with a four 9’s SLA for availability, performance, throughput and consistency. Azure Cosmos DB now provides multi-model support for the following data models and APIs:

|Data model| APIs supported|
|---|---|
|Key-value (table) data|Tables API|
|Document data|[DocumentDB API](documentdb-introduction.md) and [MongoDB APIs](documentdb-protocol-mongodb.md)|
|Graph data|Graph APIs|
 
> [!NOTE]
> In addition to the new high performance table storage provided by Azure Cosmos DB, Azure Storage continues to maintain existing table storage. To work with existing tables in Azure Storage, see [Table storage](https://docs.microsoft.com/rest/api/storageservices/fileservices/Table-Service-Concepts). 

## Why use Azure Cosmos DB?

Azure DocumentDB is known for it's enterprise grade performance, throughput, consistency and availability guarantees and geo-distributed data model. Azure Cosmos DB is the next generation of the DocumentDB stack, and with the newly expanded multi-model support, you can benefit from the impressived managed capabilities with all of your data. 

*Following was taken from Syam's PR one-pager - DocumentDB has not been renamed to Azure Cosmos DB below*

Azure DocumentDB provides up to three times better price performance than other managed NoSQL database services and has at least 10 times better total cost of ownership (TCO) than operating an open source NoSQL database system. With no upfront costs or commitments, customers pay a simple hourly charge for reserved throughput provisioned to use for the hour and cold storage pricing for the data at rest. As a horizontally partitioned database with automatic geo-replication, Azure DocumentDB can automatically scale throughput from 100’s of requests per second) to millions of requests per second, while also scaling storage automatically to Petabytes across all Azure regions. With a few clicks in the Azure portal, customers can launch a new DocumentDB database, scale up or down without downtime or performance degradation, and gain visibility into resource utilization and performance metrics. Azure DocumentDB enables customers to offload the administrative burdens of operating and scaling distributed databases so they don’t have to worry about hardware provisioning, setup and configuration, replication, software patching, partitioning, or cluster scaling. 
 
![The new DocumentDB multi-model approach for document, table, and Gremlin graph data, and MongoDB apps](./media/documentdb-multi-model-introduction/azure-documentdb-multi-model.png)

Traditionally, customers have had to choose between price, performance, durability and availability of NoSQL databases when evaluating petabyte scale distributed data store needs of IoT and mobile applications. Open source NoSQL databases offer high performance and scale but often at the cost of durability or the need of expensive infrastructure and operational costs for maintaining high availability. Managed NoSQL database services offer fast performance, elastic scale and availability, but often are specialized data stores and come with a high lock-in to the programming model of the cloud provider. Azure DocumentDB is a cloud born distributed database that gives you the best of both worlds – the performance characteristics, flexibility and ease of use of popular APIs and open source programming model along with enterprise grade availability and durability guarantees and, low capital and operational cost of managed cloud databases without any lock-in to the vendor. Azure DocumentDB automatically replicates data across selected Azure regions and is highly available (99.99% SLA) and highly performant (P99 reads < 6ms & P99 writes < 10ms), while maintaining 99.999999% durability guarantee for all data. With security and privacy embedded at the core of the platform, Azure DocumentDB makes security and privacy a priority at each step, from development to incident response. All the data stored and accessed as part of Azure DocumentDB is always encrypted at rest and in motion. As a core Azure service, DocumentDB also provides the most comprehensive compliance coverage of any commercial NoSQL database offerings.  

*“Azure DocumentDB is an operational NoSQL database for mission-critical operations. We are spearheading a new industry innovation by including enterprise grade guarantees of commercial database systems at a fraction of their cost. This along with the open source programming flexibility and accessibility to popular tools, frameworks, APIs and languages makes it the industry leading scale-out database. As demand for large scale-out durable data stores has expanded over the years, driven by large enterprise investments in IoT and mobile applications, Microsoft’s customers are demanding a planet-scale durable data store backed by Microsoft’s enterprise trust and experience. Azure DocumentDB brings this together for our customers”*, said Joseph Sirosh, Corporate Vice President, Data Group at Microsoft.  

## Battle-tested distributed database technology stack 

Azure DocumentDB delivers these unprecedented guarantees in the industry, for performance and availability by using a fast SSD based latch free database engine co-developed by Microsoft Research and leveraging patterns used in some of the largest scale out systems on planet. Completely fault tolerant and self-healing, DocumentDB uses industry leading machine learning and high scale infrastructure to automatically monitor and mitigate any issues that could impact a customer workload.  

Johnson Controls, with over 170,000 employees is an American multinational conglomerate producing automotive parts such as batteries and electronics and HVAC equipment for buildings. “We are in the temperature business. We used to invest in large scale infrastructure to own and operate a fault tolerant durable data-store for our petabytes of data generated by industry electronics and HVAC equipment. Until now, we used a mix of commercial data base systems and home grown technology along with significant operating capital to maintain these systems. With Azure DocumentDB, this all changes to us focusing on what we do best. Azure DocumentDB provides us the simplicity and flexibility we seek for our various workloads, while relying on Microsoft and their engineers to do all the heavy lifting. This is simply a superb value proposition for me and my team of 100’s of engineers who now focus on deriving value out of this data and delivering the best temperature to our customers”, said Youngchoon Park, Chief Data Scientist and Director of Connected Offerings, Johnson Controls. 

## Flexibility, versatility and ease of use 
Azure DocumentDB is a comprehensive NoSQL database that provides true multi-model support. The data store enables high performant Key-Value, Document and Graph database needs for Azure customers. Customer scenarios and needs for a NoSQL database often start with simple Key-Value needs, but then as the data grows and new scenario need arises, customers often look for other sophisticated capabilities like Graph. This often results in application re-writes or changes to the underlying platform. With Azure DocumentDB, customers can just start using a new set of APIs and capabilities that are directly integrated with the database and leverage the more advanced capabilities for their application without any application re-write or change in their data infrastructure.  

Jet.com, is the fastest growing e-commerce company, based in Hoboken, New Jersey. As a fully owned subsidiary of multi-national retailer, Walmart, Jet.com drives core innovation in the retail industry. When Jet.com wanted to standardize on a scale-out data store to reduce cost and increase efficiency, they looked to Azure DocumentDB to provide them comprehensive capabilities ranging from high-storage, low throughput databases to low-storage, high throughput fast performant data stores. “An year ago, we were dependent on purpose build data stores and several commercial data offerings to meet our diverse data infrastructure needs. For the 2016, holiday period, we moved a portion of our retail inventory application to use Azure DocumentDB. The holiday period often saw 1 Billion plus requests per day which was easily met by Azure with 0 errors. It was very cost effective as we could easily scale-up on demand just for the period without having to worry about the infrastructure and operational costs. Since then we have not had to look back. We standardized on Azure DocumentDB for all our data needs, ranging from simple Key-Value needs to complex fast queries on large Document data models and graphs.”, said John Turek, Senior Vice President Technology, Jet.com. 

With popular open source APIs and frameworks, it is easy for developers to start an application and bring it to life. Customers often face challenges when they need to move the application into production and issues like scale, cost, availability and maintenance means, these applications must wait until the infrastructure is built and secured for the scale needs of the application. In a world where applications can go viral in a matter of hours, customers cannot easily plan for the challenges ahead. Now, customers can easily lift, and shift applications built for popular NoSQL databases like MongoDB to Azure DocumentDB without having to worry about the cost or elastic needs of the application. Also, DocumentDB provides the MongoDB application the same level of enterprise guarantees for availability, performance, throughput and consistency without requiring a single line of application change. Bentley Systems, is an American-based software development company that develops and licenses computer software and services for the design, construction, and operation of infrastructure. The company’s software serves the building, plant, civil, and geospatial markets in the areas of architecture, engineering, construction (AEC) and operations. “To meet the demanding needs of our customers we decided to modernize our software solutions and services. Given the popularity of MongoDB and the flexibility it offered, our development team made a bet on MongoDB as the primary data store. Once we started to move the applications into production and as the scale and high availability needs increased, we were met with the challenge of operating a large MongoDB infrastructure in the cloud. We used the MongoDB API capability of Azure DocumentDB to lift and shift our entire production workload to DocumentDB. It was a breeze as we did not have to change any of our application, and our application could benefit from the high availability, high performant and scale of Azure DocumentDB right away.”, said Bhupinder Singh, CTO, Bentley Systems Inc. 

Azure DocumentDB brings a highly scalable graph engine, compatible with Apache Tinkerpop framework. This native graph engine automatically geo-replicates all the data and is optimized for fast traversal of complex graph with over hundreds of billions of vertices and edges. Azure DocumentDB enables high performant graph queries and traversal and with Apache Tinkerpop integration, the most popular graph query language, Gremlin can be used to traverse and operate on these graphs, thus providing the ease and flexibility already familiar to the developers. Fully integrated graph engine enables every application built on Azure DocumentDB to easily incorporate and leverage graph database capabilities for their application. 

ESRI, international supplier of geographic information system software provides geodatabase managed applications for their customers. ”Our customers have very varying needs from the information managed in our geodatabases. Often, customers need to create complex graph which then needs to be optimized for fast traversal and rich queries. With Azure DocumentDB and the support for Gremlin, our developers were easily able to leverage the graph capabilities and provide rich capabilities for our customers.”, said David Maguire, Director of Product Planning, ESRI Inc. 
About Microsoft Azure 

Microsoft Azure is a growing collection of integrated cloud services that developers and IT professionals use to build, deploy, and manage applications through our global network of datacenters. With Azure, you get the freedom to build and deploy wherever you want, using the tools, applications, and frameworks of your choice.  

**Old content from DocDB intro topic:** 

As a schema-free NoSQL database, DocumentDB provides rich and familiar SQL query capabilities with consistent low latencies on JSON data - ensuring that 99% of your reads are served under 10 milliseconds and 99% of your writes are served under 15 milliseconds. These unique benefits make DocumentDB a great fit for web, mobile, gaming, and IoT, and many other applications that need seamless scale and global replication.

## How can I learn about DocumentDB?
A quick way to learn about DocumentDB and see it in action is to follow these three steps: 

1. Watch the two minute [What is DocumentDB?](https://azure.microsoft.com/documentation/videos/what-is-azure-documentdb/) video, which introduces the benefits of using DocumentDB.
2. Watch the three minute [Create DocumentDB on Azure](https://azure.microsoft.com/documentation/videos/create-documentdb-on-azure/) video, which highlights how to get started with DocumentDB by using the Azure Portal.
3. Visit the [Query Playground](http://www.documentdb.com/sql/demo), where you can walk through different activities to learn about the rich querying functionality available in DocumentDB. Then, head over to the Sandbox tab and run your own custom SQL queries and experiment with DocumentDB.

Then, return to this article, where we'll dig in deeper.  

## What capabilities and key features does DocumentDB offer?
Azure DocumentDB offers the following key capabilities and benefits:

* **Elastically scalable throughput and storage:** Easily scale up or scale down your DocumentDB JSON database to meet your application needs. Your data is stored on solid state disks (SSD) for low predictable latencies. DocumentDB supports containers for storing JSON data called collections that can scale to virtually unlimited storage sizes and provisioned throughput. You can elastically scale DocumentDB with predictable performance seamlessly as your application grows. 
* **Multi-region replication:** DocumentDB transparently replicates your data to all regions you've associated with your DocumentDB account, enabling you to develop applications that require global access to data while providing tradeoffs between consistency, availability and performance, all with corresponding guarantees. DocumentDB provides transparent regional failover with multi-homing APIs, and the ability to elastically scale throughput and storage across the globe. Learn more in [Distribute data globally with DocumentDB](documentdb-distribute-data-globally.md).
* **Ad hoc queries with familiar SQL syntax:** Store heterogeneous JSON documents within DocumentDB and query these documents through a familiar SQL syntax. DocumentDB utilizes a highly concurrent, lock free, log structured indexing technology to automatically index all document content. This enables rich real-time queries without the need to specify schema hints, secondary indexes, or views. Learn more in [Query DocumentDB](documentdb-sql-query.md). 
* **JavaScript execution within the database:** Express application logic as stored procedures, triggers, and user defined functions (UDFs) using standard JavaScript. This allows your application logic to operate over data without worrying about the mismatch between the application and the database schema. DocumentDB provides full transactional execution of JavaScript application logic directly inside the database engine. The deep integration of JavaScript enables the execution of INSERT, REPLACE, DELETE, and SELECT operations from within a JavaScript program as an isolated transaction. Learn more in [DocumentDB server-side programming](documentdb-programming.md).
* **Tunable consistency levels:** Select from four well defined consistency levels to achieve optimal trade-off between consistency and performance. For queries and read operations, DocumentDB offers four distinct consistency levels: strong, bounded-staleness, session, and eventual. These granular, well-defined consistency levels allow you to make sound trade-offs between consistency, availability, and latency. Learn more in [Using consistency levels to maximize availability and performance in DocumentDB](documentdb-consistency-levels.md).
* **Fully managed:** Eliminate the need to manage database and machine resources. As a fully-managed Microsoft Azure service, you do not need to manage virtual machines, deploy and configure software, manage scaling, or deal with complex data-tier upgrades. Every database is automatically backed up and protected against regional failures. You can easily add a DocumentDB account and provision capacity as you need it, allowing you to focus on your application instead of operating and managing your database. 
* **Open by design:** Get started quickly by using existing skills and tools. Programming against DocumentDB is simple, approachable, and does not require you to adopt new tools or adhere to custom extensions to JSON or JavaScript. You can access all of the database functionality including CRUD, query, and JavaScript processing over a simple RESTful HTTP interface. DocumentDB embraces existing formats, languages, and standards while offering high value database capabilities on top of them.
* **Automatic indexing:** By default, DocumentDB automatically indexes all the documents in the database and does not expect or require any schema or creation of secondary indices. Don't want to index everything? Don't worry, you can [opt out of paths in your JSON files](documentdb-indexing-policies.md) too.
* **Compatibility with MongoDB apps:** With DocumentDB: API for MongoDB, you can use DocumentDB databases as the data store for apps written for MongoDB. This means that by using existing drivers for MongoDB databases, your application written for MongoDB can now communicate with DocumentDB and use DocumentDB databases instead of MongoDB databases. In many cases, you can switch from using MongoDB to DocumentDB by simply changing a connection string. Learn more in [What is DocumentDB: API for MongoDB?](documentdb-protocol-mongodb.md)

## <a name="data-management"></a>How does DocumentDB manage data?
Azure DocumentDB manages JSON data through well-defined database resources. These resources are replicated for high availability and are uniquely addressable by their logical URI. DocumentDB offers a simple HTTP based RESTful programming model for all resources. 

The DocumentDB database account is a unique namespace that gives you access to Azure DocumentDB. Before you can create a database account, you must have an Azure subscription, which gives you access to a variety of Azure services. 

All resources within DocumentDB are modeled and stored as JSON documents. Resources are managed as items, which are JSON documents containing metadata, and as feeds which are collections of items. Sets of items are contained within their respective feeds.

The image below shows the relationships between the DocumentDB resources:

![The hierarchical relationship between resources in DocumentDB, a NoSQL JSON database][1] 

A database account consists of a set of databases, each containing multiple collections, each of which can contain stored procedures, triggers, UDFs, documents, and related attachments. A database also has associated users, each with a set of permissions to access various other collections, stored procedures, triggers, UDFs, documents, or attachments. While databases, users, permissions, and collections are system-defined resources with well-known schemas - documents, stored procedures, triggers, UDFs, and attachments contain arbitrary, user defined JSON content.  

## <a name="develop"></a> How can I develop apps with DocumentDB?
Azure DocumentDB exposes resources through a REST API that can be called by any language capable of making HTTP/HTTPS requests. Additionally, DocumentDB offers programming libraries for several popular languages and technologies including Gremlin Graph APIs and MongoDB APIs. The client libraries simplify many aspects of working with Azure DocumentDB by handling details such as address caching, exception management, automatic retries and so forth. Libraries are currently available for the following languages and platforms:  

| Download | Documentation |
| --- | --- |
| [.NET SDK](http://go.microsoft.com/fwlink/?LinkID=402989) |[.NET library](https://msdn.microsoft.com/library/azure/dn948556.aspx) |
| [Node.js SDK](http://go.microsoft.com/fwlink/?LinkID=402990) |[Node.js library](http://azure.github.io/azure-documentdb-node/) |
| [Java SDK](http://go.microsoft.com/fwlink/?LinkID=402380) |[Java library](http://azure.github.io/azure-documentdb-java/) |
| [JavaScript SDK](http://go.microsoft.com/fwlink/?LinkID=402991) |[JavaScript library](http://azure.github.io/azure-documentdb-js/) |
| n/a |[Server-side JavaScript SDK](http://azure.github.io/azure-documentdb-js-server/) |
| [Python SDK](https://pypi.python.org/pypi/pydocumentdb) |[Python library](http://azure.github.io/azure-documentdb-python/) |
| n/a | [API for MongoDB](documentdb-protocol-mongodb.md)

Using the [Azure DocumentDB Emulator](documentdb-nosql-local-emulator.md), you can develop and test your application locally, without creating an Azure subscription or incurring any costs. When you're satisfied with how your application is working in the DocumentDB Emulator, you can switch to using an Azure DocumentDB account in the cloud.

Beyond basic create, read, update, and delete operations, DocumentDB provides a rich SQL query interface for retrieving JSON documents and server side support for transactional execution of JavaScript application logic. The query and script execution interfaces are available through all platform libraries as well as the REST APIs. 

### SQL query
Azure DocumentDB supports querying documents using a SQL language, which is rooted in the JavaScript type system, and expressions with support for relational, hierarchical, and spatial queries. The DocumentDB query language is a simple yet powerful interface to query JSON documents. The language supports a subset of ANSI SQL grammar and adds deep integration of JavaScript object, arrays, object construction, and function invocation. DocumentDB provides its query model without any explicit schema or indexing hints from the developer.

User Defined Functions (UDFs) can be registered with DocumentDB and referenced as part of a SQL query, thereby extending the grammar to support custom application logic. These UDFs are written as JavaScript programs and executed within the database. 

For .NET developers, DocumentDB also offers a LINQ query provider as part of the [.NET SDK](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.aspx). 

### Transactions and JavaScript execution
DocumentDB allows you to write application logic as named programs written entirely in JavaScript. These programs are registered for a collection and can issue database operations on the documents within a given collection. JavaScript can be registered for execution as a trigger, stored procedure or user defined function. Triggers and stored procedures can create, read, update, and delete documents whereas user defined functions execute as part of the query execution logic without write access to the collection.

JavaScript execution within DocumentDB is modeled after the concepts supported by relational database systems, with JavaScript as a modern replacement for Transact-SQL. All JavaScript logic is executed within an ambient ACID transaction with snapshot isolation. During the course of its execution, if the JavaScript throws an exception, then the entire transaction is aborted.

## Are there any online courses on DocumentDB?

Yes, there's a [Microsoft Virtual Academy](https://mva.microsoft.com/en-US/training-courses/azure-documentdb-planetscale-nosql-16847) course on Azure DocumentDB. 

>[!VIDEO https://mva.microsoft.com/en-US/training-courses-embed/azure-documentdb-planetscale-nosql-16847]
>
>

## Next steps
Already have an Azure account? Then you can get started with DocumentDB in the [Azure Portal](https://portal.azure.com/#gallery/Microsoft.DocumentDB) by [creating a DocumentDB database account](documentdb-create-account.md).

Don't have an Azure account? You can:

* Sign up for an [Azure free trial](https://azure.microsoft.com/free/), which gives you 30 days and $200 to try all the Azure services. 
* If you have an MSDN subscription, you are eligible for [$150 in free Azure credits per month](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) to use on any Azure service. 
* Download the the [Azure DocumentDB Emulator](documentdb-nosql-local-emulator.md) to develop your application locally.

Then, when you're ready to learn more, visit our [learning path](https://azure.microsoft.com/documentation/learning-paths/documentdb/) to navigate all the learning resources available to you. 

[1]: ./media/documentdb-introduction/json-database-resources1.png

