---
title: Frequently asked questions about different APIs in Azure Cosmos DB
description: Get answers to frequently asked questions about Azure Cosmos DB, a globally distributed, multi-model database service. Learn about capacity, performance levels, and scaling.
author: SnehaGunda
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/20/2019
ms.author: sngun
ms.custom: seodec18
---
# Frequently asked questions about different APIs in Azure Cosmos DB

### What are the typical use cases for Azure Cosmos DB?

Azure Cosmos DB is a good choice for new web, mobile, gaming, and IoT applications where automatic scale, predictable performance, fast order of millisecond response times, and the ability to query over schema-free data is important. Azure Cosmos DB lends itself to rapid development and supporting the continuous iteration of application data models. Applications that manage user-generated content and data are [common use cases for Azure Cosmos DB](use-cases.md).

### How does Azure Cosmos DB offer predictable performance?

A [request unit](request-units.md) (RU) is the measure of throughput in Azure Cosmos DB. A 1RU throughput corresponds to the throughput of the GET of a 1-KB document. Every operation in Azure Cosmos DB, including reads, writes, SQL queries, and stored procedure executions, has a deterministic RU value that's based on the throughput required to complete the operation. Instead of thinking about CPU, IO, and memory and how they each affect your application throughput, you can think in terms of a single RU measure.

You can configure each Azure Cosmos container with provisioned throughput in terms of RUs of throughput per second. For applications of any scale, you can benchmark individual requests to measure their RU values, and provision a container to handle the total of request units across all requests. You can also scale up or scale down your container's throughput as the needs of your application evolve. For more information about request units and for help with determining your container needs, try the [throughput calculator](https://www.documentdb.com/capacityplanner).

### How does Azure Cosmos DB support various data models such as key/value, columnar, document, and graph?

Key/value (table), columnar, document, and graph data models are all natively supported because of the ARS (atoms, records, and sequences) design that Azure Cosmos DB is built on. Atoms, records, and sequences can be easily mapped and projected to various data models. The APIs for a subset of models are available right now (SQL, MongoDB, Table, and Gremlin) and others specific to additional data models will be available in the future.

Azure Cosmos DB has a schema agnostic indexing engine capable of automatically indexing all the data it ingests without requiring any schema or secondary indexes from the developer. The engine relies on a set of logical index layouts (inverted, columnar, tree) which decouple the storage layout from the index and query processing subsystems. Cosmos DB also has the ability to support a set of wire protocols and APIs in an extensible manner and translate them efficiently to the core data model (1) and the logical index layouts (2) making it uniquely capable of supporting more than one data model natively.

### Is Azure Cosmos DB HIPAA compliant?

Yes, Azure Cosmos DB is HIPAA-compliant. HIPAA establishes requirements for the use, disclosure, and safeguarding of individually identifiable health information. For more information, see the [Microsoft Trust Center](https://www.microsoft.com/en-us/TrustCenter/Compliance/HIPAA).

### What are the storage limits of Azure Cosmos DB?

There's no limit to the total amount of data that a container can store in Azure Cosmos DB.

### What are the throughput limits of Azure Cosmos DB?

There's no limit to the total amount of throughput that a container can support in Azure Cosmos DB. The key idea is to distribute your workload roughly evenly among a sufficiently large number of partition keys.

### Are Direct and Gateway connectivity modes encrypted?

Yes both modes are always fully encrypted.

### How much does Azure Cosmos DB cost?

For details, refer to the [Azure Cosmos DB pricing details](https://azure.microsoft.com/pricing/details/cosmos-db/) page. Azure Cosmos DB usage charges are determined by the number of provisioned containers, the number of hours the containers were online, and the provisioned throughput for each container.

### Is a free account available?

Yes, you can sign up for a time-limited account at no charge, with no commitment. To sign up, visit [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) or read more in the [Try Azure Cosmos DB FAQ](#try-cosmos-db).

If you're new to Azure, you can sign up for an [Azure free account](https://azure.microsoft.com/free/), which gives you 30 days and a credit to try all the Azure services. If you have a Visual Studio subscription, you're also eligible for [free Azure credits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) to use on any Azure service.

You can also use the [Azure Cosmos DB Emulator](local-emulator.md) to develop and test your application locally for free, without creating an Azure subscription. When you're satisfied with how your application is working in the Azure Cosmos DB Emulator, you can switch to using an Azure Cosmos DB account in the cloud.

### How can I get additional help with Azure Cosmos DB?

To ask a technical question, you can post to one of these two question and answer forums:

* [MSDN forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurecosmosdb)
* [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-cosmosdb). Stack Overflow is best for programming questions. Make sure your question is [on-topic](https://stackoverflow.com/help/on-topic) and [provide as many details as possible, making the question clear and answerable](https://stackoverflow.com/help/how-to-ask).

To request new features, create a new request on [User voice](https://feedback.azure.com/forums/263030-azure-cosmos-db).

To fix an issue with your account, file a [support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.

Other questions can be submitted to the team at [askcosmosdb@microsoft.com](mailto:askcosmosdb@microsoft.com); however this isn't a technical support alias.

## <a id="try-cosmos-db"></a>Try Azure Cosmos DB subscriptions

You can now enjoy a time-limited Azure Cosmos DB experience without a subscription, free of charge and commitments. To sign up for a Try Azure Cosmos DB subscription, go to [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/). This subscription is separate from the [Azure Free Trial](https://azure.microsoft.com/free/), and can be used along with an Azure Free Trial or an Azure paid subscription.

Try Azure Cosmos DB subscriptions appear in the Azure portal next other subscriptions associated with your user ID.

The following conditions apply to Try Azure Cosmos DB subscriptions:

* One [throughput provisioned container](./set-throughput.md#set-throughput-on-a-container) per subscription for SQL, Gremlin API, and Table accounts.
* Up to three [throughput provisioned collections](./set-throughput.md#set-throughput-on-a-container) per subscription for MongoDB accounts.
* One [throughput provisioned database](./set-throughput.md#set-throughput-on-a-database) per subscription. Throughput provisioned databases can contain any number of containers inside.
* 10-GB storage capacity.
* Global replication is available in the following [Azure regions](https://azure.microsoft.com/regions/): Central US, North Europe, and Southeast Asia
* Maximum throughput of 5 K RU/s when provisioned at the container level.
* Maximum throughput of 20 K RU/s when provisioned at the database level.
* Subscriptions expire after 30 days, and can be extended to a maximum of 31 days total.
* Azure support tickets can't be created for Try Azure Cosmos DB accounts; however, support is provided for subscribers with existing support plans.

## Set up Azure Cosmos DB

### How do I sign up for Azure Cosmos DB?

Azure Cosmos DB is available in the Azure portal. First, sign up for an Azure subscription. After you've signed up, you can add an Azure Cosmos DB account to your Azure subscription.

### What is a master key?

A master key is a security token to access all resources for an account. Individuals with the key have read and write access to all resources in the database account. Use caution when you distribute master keys. The primary master key and secondary master key are available on the **Keys** blade of the [Azure portal][azure-portal]. For more information about keys, see [View, copy, and regenerate access keys](manage-with-cli.md#list-account-keys).

### What are the regions that PreferredLocations can be set to?

The PreferredLocations value can be set to any of the Azure regions in which Cosmos DB is available. For a list of available regions, see [Azure regions](https://azure.microsoft.com/regions/).

### Is there anything I should be aware of when distributing data across the world via the Azure datacenters?

Azure Cosmos DB is present across all Azure regions, as specified on the [Azure regions](https://azure.microsoft.com/regions/) page. Because it's the core service, every new datacenter has an Azure Cosmos DB presence.

When you set a region, remember that Azure Cosmos DB respects sovereign and government clouds. That is, if you create an account in a [sovereign region](https://azure.microsoft.com/global-infrastructure/), you can't replicate out of that [sovereign region](https://azure.microsoft.com/global-infrastructure/). Similarly, you can't enable replication into other sovereign locations from an outside account.

### Is it possible to switch from container level throughput provisioning to database level throughput provisioning? Or vice versa

Container and database level throughput provisioning are separate offerings and switching between either of these require migrating data from source to destination. Which means you need to create a new database or a new collection and then migrate data by using [bulk executor library](bulk-executor-overview.md) or [Azure Data Factory](../data-factory/connector-azure-cosmos-db.md).

### Does Azure CosmosDB support time series analysis?

Yes Azure CosmosDB supports time series analysis, here is a sample for [time series pattern](https://github.com/Azure/azure-cosmosdb-dotnet/tree/master/samples/Patterns). This sample shows how to use change feed to build aggregated views over time series data. You can extend this approach by using spark streaming or another stream data processor.

## SQL API

### How do I start developing against the SQL API?

First you must sign up for an Azure subscription. Once you sign up for an Azure subscription, you can add a SQL API container to your Azure subscription. For instructions on adding an Azure Cosmos DB account, see [Create an Azure Cosmos DB database account](create-sql-api-dotnet.md#create-account).

[SDKs](sql-api-sdk-dotnet.md) are available for .NET, Python, Node.js, JavaScript, and Java. Developers can also use the [RESTful HTTP APIs](/rest/api/cosmos-db/) to interact with Azure Cosmos DB resources from various platforms and languages.

### Can I access some ready-made samples to get a head start?

Samples for the SQL API [.NET](sql-api-dotnet-samples.md), [Java](https://github.com/Azure/azure-documentdb-java), [Node.js](sql-api-nodejs-samples.md), and [Python](sql-api-python-samples.md) SDKs are available on GitHub.

### Does the SQL API database support schema-free data?

Yes, the SQL API allows applications to store arbitrary JSON documents without schema definitions or hints. Data is immediately available for query through the Azure Cosmos DB SQL query interface.

### Does the SQL API support ACID transactions?

Yes, the SQL API supports cross-document transactions expressed as JavaScript-stored procedures and triggers. Transactions are scoped to a single partition within each container and executed with ACID semantics as "all or nothing," isolated from other concurrently executing code and user requests. If exceptions are thrown through the server-side execution of JavaScript application code, the entire transaction is rolled back. 

### What is a container?

A container is a group of documents and their associated JavaScript application logic. A container is a billable entity, where the [cost](performance-levels.md) is determined by the throughput and used storage. Containers can span one or more partitions or servers and can scale to handle practically unlimited volumes of storage or throughput.

* For SQL API and Cosmos DB's API for MongoDB accounts, a container maps to a Collection.
* For Cassandra and Table API accounts, a container maps to a Table.
* For Gremlin API accounts, a container maps to a Graph.

Containers are also the billing entities for Azure Cosmos DB. Each container is billed hourly, based on the provisioned throughput and used storage space. For more information, see [Azure Cosmos DB Pricing](https://azure.microsoft.com/pricing/details/cosmos-db/).

### How do I create a database?

You can create databases by using the [Azure portal](https://portal.azure.com), as described in [Add a collection](create-sql-api-dotnet.md#create-collection-database), one of the [Azure Cosmos DB SDKs](sql-api-sdk-dotnet.md), or the [REST APIs](/rest/api/cosmos-db/).

### How do I set up users and permissions?

You can create users and permissions by using one of the [Cosmos DB API SDKs](sql-api-sdk-dotnet.md) or the [REST APIs](/rest/api/cosmos-db/).

### Does the SQL API support SQL?

The SQL query language supported by SQL API accounts is an enhanced subset of the query functionality that's supported by SQL Server. The Azure Cosmos DB SQL query language provides rich hierarchical and relational operators and extensibility via JavaScript-based, user-defined functions (UDFs). JSON grammar allows for modeling JSON documents as trees with labeled nodes, which are used by both the Azure Cosmos DB automatic indexing techniques and the SQL query dialect of Azure Cosmos DB. For information about using SQL grammar, see the [SQL Query][query] article.

### Does the SQL API support SQL aggregation functions?

The SQL API supports low-latency aggregation at any scale via aggregate functions `COUNT`, `MIN`, `MAX`, `AVG`, and `SUM` via the SQL grammar. For more information, see [Aggregate functions](sql-query-aggregates.md).

### How does the SQL API provide concurrency?

The SQL API supports optimistic concurrency control (OCC) through HTTP entity tags, or ETags. Every SQL API resource has an ETag, and the ETag is set on the server every time a document is updated. The ETag header and the current value are included in all response messages. ETags can be used with the If-Match header to allow the server to decide whether a resource should be updated. The If-Match value is the ETag value to be checked against. If the ETag value matches the server ETag value, the resource is updated. If the ETag is no longer current, the server rejects the operation with an "HTTP 412 Precondition failure" response code. The client then refetches the resource to acquire the current ETag value for the resource. In addition, ETags can be used with the If-None-Match header to determine whether a refetch of a resource is needed.

To use optimistic concurrency in .NET, use the [AccessCondition](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.accesscondition.aspx) class. For a .NET sample, see [Program.cs](https://github.com/Azure/azure-documentdb-dotnet/blob/master/samples/code-samples/DocumentManagement/Program.cs) in the DocumentManagement sample on GitHub.

### How do I perform transactions in the SQL API?

The SQL API supports language-integrated transactions via JavaScript-stored procedures and triggers. All database operations inside scripts are executed under snapshot isolation. If it's a single-partition collection, the execution is scoped to the collection. If the collection is partitioned, the execution is scoped to documents with the same partition-key value within the collection. A snapshot of the document versions (ETags) is taken at the start of the transaction and committed only if the script succeeds. If the JavaScript throws an error, the transaction is rolled back. For more information, see [Server-side JavaScript programming for Azure Cosmos DB](stored-procedures-triggers-udfs.md).

### How can I bulk-insert documents into Cosmos DB?

You can bulk-insert documents into Azure Cosmos DB in one of the following ways:

* The bulk executor tool, as described in [Using bulk executor .NET library](bulk-executor-dot-net.md) and [Using bulk executor Java library](bulk-executor-java.md)
* The data migration tool, as described in [Database migration tool for Azure Cosmos DB](import-data.md).
* Stored procedures, as described in [Server-side JavaScript programming for Azure Cosmos DB](stored-procedures-triggers-udfs.md).

### Does the SQL API support resource link caching?

Yes, because Azure Cosmos DB is a RESTful service, resource links are immutable and can be cached. SQL API clients can specify an "If-None-Match" header for reads against any resource-like document or collection and then update their local copies after the server version has changed.

### Is a local instance of SQL API available?

Yes. The [Azure Cosmos DB Emulator](local-emulator.md) provides a high-fidelity emulation of the Cosmos DB service. It supports functionality that's identical to Azure Cosmos DB, including support for creating and querying JSON documents, provisioning and scaling collections, and executing stored procedures and triggers. You can develop and test applications by using the Azure Cosmos DB Emulator, and deploy them to Azure at a global scale by making a single configuration change to the connection endpoint for Azure Cosmos DB.

### Why are long floating-point values in a document rounded when viewed from data explorer in the portal.

This is limitation of JavaScript. JavaScript uses double-precision floating-point format numbers as specified in IEEE 754 and it can safely hold numbers between -(2<sup>53</sup> - 1) and 2<sup>53</sup>-1 (i.e., 9007199254740991) only.

### Where are permissions allowed in the object hierarchy?

Creating permissions by using ResourceTokens is allowed at the container level and its descendants (such as documents, attachments). This implies that trying to create a permission at the database or an account level isn't currently allowed.

## Azure Cosmos DB's API for MongoDB

### What is the Azure Cosmos DB's API for MongoDB?

The Azure Cosmos DB's API for MongoDB is a wire-protocol compatibility layer that allows applications to easily and transparently communicate with the native Azure Cosmos DB database engine by using existing, community-supported SDKs and drivers for MongoDB. Developers can now use existing MongoDB toolchains and skills to build applications that take advantage of Azure Cosmos DB. Developers benefit from the unique capabilities of Azure Cosmos DB, which include global distribution with multi-master replication, auto-indexing, backup maintenance, financially backed service level agreements (SLAs) etc.

### How do I connect to my database?

The quickest way to connect to a Cosmos database with Azure Cosmos DB's API for MongoDB is to head over to the [Azure portal](https://portal.azure.com). Go to your account and then, on the left navigation menu, click **Quick Start**. Quickstart is the best way to get code snippets to connect to your database.

Azure Cosmos DB enforces strict security requirements and standards. Azure Cosmos DB accounts require authentication and secure communication via SSL, so be sure to use TLSv1.2.

For more information, see [Connect to your Cosmos database with Azure Cosmos DB's API for MongoDB](connect-mongodb-account.md).

### Are there additional error codes that I need to deal with while using Azure Cosmos DB's API for MongoDB?

Along with the common MongoDB error codes, the Azure Cosmos DB's API for MongoDB has its own specific error codes:

| Error               | Code  | Description  | Solution  |
|---------------------|-------|--------------|-----------|
| TooManyRequests     | 16500 | The total number of request units consumed is more than the provisioned request-unit rate for the collection and has been throttled. | Consider scaling the throughput  assigned to a container or a set of containers from the Azure portal or retrying again. |
| ExceededMemoryLimit | 16501 | As a multi-tenant service, the operation has gone over the client's memory allotment. | Reduce the scope of the operation through more restrictive query criteria or contact support from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). <br><br>Example: <em>&nbsp;&nbsp;&nbsp;&nbsp;db.getCollection('users').aggregate([<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{$match: {name: "Andy"}}, <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{$sort: {age: -1}}<br>&nbsp;&nbsp;&nbsp;&nbsp;])</em>) |

### Is the Simba driver for MongoDB supported for use with Azure Cosmos DB's API for MongoDB?

Yes, you can use Simba’s Mongo ODBC driver with Azure Cosmos DB's API for MongoDB

## <a id="table"></a>Table API

### How can I use the Table API offering?

The Azure Cosmos DB Table API is available in the [Azure portal][azure-portal]. First you must sign up for an Azure subscription. After you've signed up, you can add an Azure Cosmos DB Table API account to your Azure subscription, and then add tables to your account.

You can find the supported languages and associated quick-starts in the [Introduction to Azure Cosmos DB Table API](table-introduction.md).

### Do I need a new SDK to use the Table API?

No, existing storage SDKs should still work. However, it's recommended that one always gets the latest SDKs for the best support and in many cases superior performance. See the list of available languages in the [Introduction to Azure Cosmos DB Table API](table-introduction.md).

### Where is Table API not identical with Azure Table storage behavior?

There are some behavior differences that users coming from Azure Table storage who want to create tables with the Azure Cosmos DB Table API should be aware of:

* Azure Cosmos DB Table API uses a reserved capacity model in order to ensure guaranteed performance but this means that one pays for the capacity as soon as the table is created, even if the capacity isn't being used. With Azure Table storage one only pays for capacity that's used. This helps to explain why Table API can offer a 10 ms read and 15 ms write SLA at the 99th percentile while Azure Table storage offers a 10-second SLA. But as a consequence, with Table API tables, even empty tables without any requests, cost money in order to ensure the capacity is available to handle any requests to them at the SLA offered by Azure Cosmos DB.
* Query results returned by the Table API aren't sorted in partition key/row key order as they are in Azure Table storage.
* Row keys can only be up to 255 bytes
* Batches can only have up to 2 MBs
* CORS isn't currently supported
* Table names in Azure Table storage aren't case-sensitive, but they are in Azure Cosmos DB Table API
* Some of Azure Cosmos DB's internal formats for encoding information, such as binary fields, are currently not as efficient as one might like. Therefore this can cause unexpected limitations on data size. For example, currently one couldn't use the full one Meg of a table entity to store binary data because the encoding increases the data's size.
* Entity property name 'ID' currently not supported
* TableQuery TakeCount isn't limited to 1000

In terms of the REST API there are a number of endpoints/query options that aren't supported by Azure Cosmos DB Table API:

| Rest Method(s) | Rest Endpoint/Query Option | Doc URLs | Explanation |
| ------------| ------------- | ---------- | ----------- |
| GET, PUT | /?restype=service@comp=properties| [Set Table Service Properties](https://docs.microsoft.com/rest/api/storageservices/set-table-service-properties) and [Get Table Service Properties](https://docs.microsoft.com/rest/api/storageservices/get-table-service-properties) | This endpoint is used to set CORS rules, storage analytics configuration, and logging settings. CORS is currently not supported and analytics and logging are handled differently in Azure Cosmos DB than Azure Storage Tables |
| OPTIONS | /\<table-resource-name> | [Pre-flight CORS table request](https://docs.microsoft.com/rest/api/storageservices/preflight-table-request) | This is part of CORS which Azure Cosmos DB doesn't currently support. |
| GET | /?restype=service@comp=stats | [Get Table Service Stats](https://docs.microsoft.com/rest/api/storageservices/get-table-service-stats) | Provides information how quickly data is replicating between primary and secondaries. This isn't needed in Cosmos DB as the replication is part of writes. |
| GET, PUT | /mytable?comp=acl | [Get Table ACL](https://docs.microsoft.com/rest/api/storageservices/get-table-acl) and [Set Table ACL](https://docs.microsoft.com/rest/api/storageservices/set-table-acl) | This gets and sets the stored access policies used to manage Shared Access Signatures (SAS). Although SAS is supported, they are set and managed differently. |

In addition Azure Cosmos DB Table API only supports the JSON format, not ATOM.

While Azure Cosmos DB supports Shared Access Signatures (SAS) there are certain policies it doesn't support, specifically those related to management operations such as the right to create new tables.

For the .NET SDK in particular, there are some classes and methods that Azure Cosmos DB doesn't currently support.

| Class | Unsupported Method |
|-------|-------- |
| CloudTableClient | \*ServiceProperties* |
|                  | \*ServiceStats* |
| CloudTable | SetPermissions* |
|            | GetPermissions* |
| TableServiceContext | * (this class is deprecated) |
| TableServiceEntity | " " |
| TableServiceExtensions | " " |
| TableServiceQuery | " " |

If any of these differences are a problem for your project, contact [askcosmosdb@microsoft.com](mailto:askcosmosdb@microsoft.com) and let us know.

### How do I provide feedback about the SDK or bugs?

You can share your feedback in any of the following ways:

* [User voice](https://feedback.azure.com/forums/263030-azure-cosmos-db)
* [MSDN forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurecosmosdb)
* [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-cosmosdb). Stack Overflow is best for programming questions. Make sure your question is [on-topic](https://stackoverflow.com/help/on-topic) and [provide as many details as possible, making the question clear and answerable](https://stackoverflow.com/help/how-to-ask).

### What is the connection string that I need to use to connect to the Table API?

The connection string is:

```
DefaultEndpointsProtocol=https;AccountName=<AccountNamefromCosmos DB;AccountKey=<FromKeysPaneofCosmosDB>;TableEndpoint=https://<AccountName>.table.cosmosdb.azure.com
```

You can get the connection string from the Connection String page in the Azure portal.

### How do I override the config settings for the request options in the .NET SDK for the Table API?

Some settings are handled on the CreateCloudTableClient method and other via the app.config in the appSettings section in the client application. For information about config settings, see [Azure Cosmos DB capabilities](tutorial-develop-table-dotnet.md).

### Are there any changes for customers who are using the existing Azure Table storage SDKs?

None. There are no changes for existing or new customers who are using the existing Azure Table storage SDKs.

### How do I view table data that's stored in Azure Cosmos DB for use with the Table API?

You can use the Azure portal to browse the data. You can also use the Table API code or the tools mentioned in the next answer.

### Which tools work with the Table API?

You can use the [Azure Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer).

Tools with the flexibility to take a connection string in the format specified previously can support the new Table API. A list of table tools is provided on the [Azure Storage Client Tools](../storage/common/storage-explorers.md) page.

### Is the concurrency on operations controlled?

Yes, optimistic concurrency is provided via the use of the ETag mechanism.

### Is the OData query model supported for entities?

Yes, the Table API supports OData query and LINQ query.

### Can I connect to Azure Table Storage and Azure Cosmos DB Table API side by side in the same application?

Yes, you can connect by creating two separate instances of the CloudTableClient, each pointing to its own URI via the connection string.

### How do I migrate an existing Azure Table storage application to this offering?

[AzCopy](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy) and the [Azure Cosmos DB Data Migration Tool](import-data.md) are both supported.

### How is expansion of the storage size done for this service if, for example, I start with *n* GB of data and my data will grow to 1 TB over time?

Azure Cosmos DB is designed to provide unlimited storage via the use of horizontal scaling. The service can monitor and effectively increase your storage.

### How do I monitor the Table API offering?

You can use the Table API **Metrics** pane to monitor requests and storage usage.

### How do I calculate the throughput I require?

You can use the capacity estimator to calculate the TableThroughput that's required for the operations. For more information, see [Estimate Request Units and Data Storage](https://www.documentdb.com/capacityplanner). In general, you can show your entity as JSON and provide the numbers for your operations.

### Can I use the Table API SDK locally with the emulator?

Not at this time.

### Can my existing application work with the Table API?

Yes, the same API is supported.

### Do I need to migrate my existing Azure Table storage applications to the SDK if I don't want to use the Table API features?

No, you can create and use existing Azure Table storage assets without interruption of any kind. However, if you don't use the Table API, you can't benefit from the automatic index, the additional consistency option, or global distribution.

### How do I add replication of the data in the Table API across more than one region of Azure?

You can use the Azure Cosmos DB portal's [global replication settings](tutorial-global-distribution-sql-api.md#portal) to add regions that are suitable for your application. To develop a globally distributed application, you should also add your application with the PreferredLocation information set to the local region for providing low read latency.

### How do I change the primary write region for the account in the Table API?

You can use the Azure Cosmos DB global replication portal pane to add a region and then fail over to the required region. For instructions, see [Developing with multi-region Azure Cosmos DB accounts](high-availability.md).

### How do I configure my preferred read regions for low latency when I distribute my data?

To help read from the local location, use the PreferredLocation key in the app.config file. For existing applications, the Table API throws an error if LocationMode is set. Remove that code, because the Table API picks up this information from the app.config file. 

### How should I think about consistency levels in the Table API?

Azure Cosmos DB provides well-reasoned trade-offs between consistency, availability, and latency. Azure Cosmos DB offers five consistency levels to Table API developers, so you can choose the right consistency model at the table level and make individual requests while querying the data. When a client connects, it can specify a consistency level. You can change the level via the consistencyLevel argument of CreateCloudTableClient.

The Table API provides low-latency reads with "Read your own writes," with Bounded-staleness consistency as the default. For more information, see [Consistency levels](consistency-levels.md).

By default, Azure Table storage provides Strong consistency within a region and Eventual consistency in the secondary locations.

### Does Azure Cosmos DB Table API offer more consistency levels than Azure Table storage?

Yes, for information about how to benefit from the distributed nature of Azure Cosmos DB, see [Consistency levels](consistency-levels.md). Because guarantees are provided for the consistency levels, you can use them with confidence.

### When global distribution is enabled, how long does it take to replicate the data?

Azure Cosmos DB commits the data durably in the local region and pushes the data to other regions immediately in a matter of milliseconds. This replication is dependent only on the round-trip time (RTT) of the datacenter. To learn more about the global-distribution capability of Azure Cosmos DB, see [Azure Cosmos DB: A globally distributed database service on Azure](distribute-data-globally.md).

### Can the read request consistency level be changed?

With Azure Cosmos DB, you can set the consistency level at the container level (on the table). By using the .NET SDK, you can change the level by providing the value for TableConsistencyLevel key in the app.config file. The possible values are: Strong, Bounded Staleness, Session, Consistent Prefix, and Eventual. For more information, see [Tunable data consistency levels in Azure Cosmos DB](consistency-levels.md). The key idea is that you can't set the request consistency level at more than the setting for the table. For example, you can't set the consistency level for the table at Eventual and the request consistency level at Strong.

### How does the Table API handle failover if a region goes down?

The Table API leverages the globally distributed platform of Azure Cosmos DB. To ensure that your application can tolerate datacenter downtime, enable at least one more region for the account in the Azure Cosmos DB portal [Developing with multi-region Azure Cosmos DB accounts](high-availability.md). You can set the priority of the region by using the portal [Developing with multi-region Azure Cosmos DB accounts](high-availability.md).

You can add as many regions as you want for the account and control where it can fail over to by providing a failover priority. To use the database, you need to provide an application there too. When you do so, your customers won't experience downtime. The [latest .NET client SDK](table-sdk-dotnet.md) is auto homing but the other SDKs aren't. That is, it can detect the region that's down and automatically fail over to the new region.

### Is the Table API enabled for backups?

Yes, the Table API leverages the platform of Azure Cosmos DB for backups. Backups are made automatically. For more information, see [Online backup and restore with Azure Cosmos DB](online-backup-and-restore.md).

### Does the Table API index all attributes of an entity by default?

Yes, all attributes of an entity are indexed by default. For more information, see [Azure Cosmos DB: Indexing policies](index-policy.md).

### Does this mean I don't have to create more than one index to satisfy the queries?

Yes, Azure Cosmos DB Table API provides automatic indexing of all attributes without any schema definition. This automation frees developers to focus on the application rather than on index creation and management. For more information, see [Azure Cosmos DB: Indexing policies](index-policy.md).

### Can I change the indexing policy?

Yes, you can change the indexing policy by providing the index definition. You need to properly encode and escape the settings.

For the non-.NET SDKs, the indexing policy can only be set in the portal at **Data Explorer**, navigate to the specific table you want to change and then go to the **Scale & Settings**->Indexing Policy, make the desired change and then **Save**.

From the .NET SDK it can be submitted in the app.config file:

```JSON
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
```

### Azure Cosmos DB as a platform seems to have lot of capabilities, such as sorting, aggregates, hierarchy, and other functionality. Will you be adding these capabilities to the Table API?

The Table API provides the same query functionality as Azure Table storage. Azure Cosmos DB also supports sorting, aggregates, geospatial query, hierarchy, and a wide range of built-in functions. For more information, see [SQL queries](how-to-sql-query.md).

### When should I change TableThroughput for the Table API?

You should change TableThroughput when either of the following conditions applies:

* You're performing an extract, transform, and load (ETL) of data, or you want to upload a lot of data in short amount of time.
* You need more throughput from the container or from a set of containers at the back end. For example, you see that the used throughput is more than the provisioned throughput, and you're getting throttled. For more information, see [Set throughput for Azure Cosmos DB containers](set-throughput.md).

### Can I scale up or scale down the throughput of my Table API table?

Yes, you can use the Azure Cosmos DB portal's scale pane to scale the throughput. For more information, see [Set throughput](set-throughput.md).

### Is a default TableThroughput set for newly provisioned tables?

Yes, if you don't override the TableThroughput via app.config and don't use a pre-created container in Azure Cosmos DB, the service creates a table with throughput of 400.

### Is there any change of pricing for existing customers of the Azure Table storage service?

None. There's no change in price for existing Azure Table storage customers.

### How is the price calculated for the Table API?

The price depends on the allocated TableThroughput.

### How do I handle any rate limiting on the tables in Table API offering?

If the request rate is more than the capacity of the provisioned throughput for the underlying container or a set of containers, you get an error, and the SDK retries the call by applying the retry policy.

### Why do I need to choose a throughput apart from PartitionKey and RowKey to take advantage of the Table API offering of Azure Cosmos DB?

Azure Cosmos DB sets a default throughput for your container if you don't provide one in the app.config file or via the portal.

Azure Cosmos DB provides guarantees for performance and latency, with upper bounds on operation. This guarantee is possible when the engine can enforce governance on the tenant's operations. Setting TableThroughput ensures that you get the guaranteed throughput and latency, because the platform reserves this capacity and guarantees operational success.

By using the throughput specification, you can elastically change it to benefit from the seasonality of your application, meet the throughput needs, and save costs.

### Azure Table storage has been inexpensive for me, because I pay only to store the data, and I rarely query. The Azure Cosmos DB Table API offering seems to be charging me even though I haven't performed a single transaction or stored anything. Can you explain?

Azure Cosmos DB is designed to be a globally distributed, SLA-based system with guarantees for availability, latency, and throughput. When you reserve throughput in Azure Cosmos DB, it's guaranteed, unlike the throughput of other systems. Azure Cosmos DB provides additional capabilities that customers have requested, such as secondary indexes and global distribution.

### I never get a quota full" notification (indicating that a partition is full) when I ingest data into Azure Table storage. With the Table API, I do get this message. Is this offering limiting me and forcing me to change my existing application?

Azure Cosmos DB is an SLA-based system that provides unlimited scale, with guarantees for latency, throughput, availability, and consistency. To ensure guaranteed premium performance, make sure that your data size and index are manageable and scalable. The 10-GB limit on the number of entities or items per partition key is to ensure that we provide great lookup and query performance. To ensure that your application scales well, even for Azure Storage, we recommend that you *not* create a hot partition by storing all information in one partition and querying it.

### So PartitionKey and RowKey are still required with the Table API?

Yes. Because the surface area of the Table API is similar to that of the Azure Table storage SDK, the partition key provides an efficient way to distribute the data. The row key is unique within that partition. The row key needs to be present and can't be null as in the standard SDK. The length of RowKey is 255 bytes and the length of PartitionKey is 1 KB.

### What are the error messages for the Table API?

Azure Table storage and Azure Cosmos DB Table API use the same SDKs so most of the errors will be the same.

### Why do I get throttled when I try to create lot of tables one after another in the Table API?

Azure Cosmos DB is an SLA-based system that provides latency, throughput, availability, and consistency guarantees. Because it's a provisioned system, it reserves resources to guarantee these requirements. The rapid rate of creation of tables is detected and throttled. We recommend that you look at the rate of creation of tables and lower it to less than 5 per minute. Remember that the Table API is a provisioned system. The moment you provision it, you'll begin to pay for it.

## Gremlin API

### For C#/.NET development, should I use the Microsoft.Azure.Graphs package or Gremlin.NET?

Azure Cosmos DB Gremlin API leverages the open-source drivers as the main connectors for the service. So the recommended option is to use [drivers that are supported by Apache Tinkerpop](https://tinkerpop.apache.org/).

### How are RU/s charged when running queries on a graph database?

All graph objects, vertices, and edges, are shown as JSON documents in the backend. Since one Gremlin query can modify one or many graph objects at a time, the cost associated with it is directly related to the objects, edges that are processed by the query. This is the same process that Azure Cosmos DB uses for all other APIs. For more information, see [Request Units in Azure Cosmos DB](request-units.md).

The RU charge is based on the working data set of the traversal, and not the result set. For example, if a query aims to obtain a single vertex as a result but needs to traverse more than one other object on the way, then the cost will be based on all the graph objects that it will take to compute the one result vertex.

### What’s the maximum scale that a graph database can have in Azure Cosmos DB Gremlin API?

Azure Cosmos DB makes use of [horizontal partitioning](partition-data.md) to automatically address increase in storage and throughput requirements. The maximum throughput and storage capacity of a workload is determined by the number of partitions that are associated with a given collection. However, a Gremlin API collection has a specific set of guidelines to ensure a proper performance experience at scale. For more information about partitioning, and best practices, see [partitioning in Azure Cosmos DB](partition-data.md) article.

### How can I protect against injection attacks using Gremlin drivers?

Most native Apache Tinkerpop Gremlin drivers allow the option to provide a dictionary of parameters for query execution. This is an example of how to do it in [Gremlin.Net](https://tinkerpop.apache.org/docs/3.2.7/reference/#gremlin-DotNet) and in [Gremlin-Javascript](https://github.com/Azure-Samples/azure-cosmos-db-graph-nodejs-getting-started/blob/master/app.js).

### Why am I getting the “Gremlin Query Compilation Error: Unable to find any method” error?

Azure Cosmos DB Gremlin API implements a subset of the functionality defined in the Gremlin surface area. For supported steps and more information, see [Gremlin support](gremlin-support.md) article.

The best workaround is to rewrite the required Gremlin steps with the supported functionality, since all essential Gremlin steps are supported by Azure Cosmos DB.

### Why am I getting the “WebSocketException: The server returned status code '200' when status code '101' was expected” error?

This error is likely thrown when the wrong endpoint is being used. The endpoint that generates this error has the following pattern:

`https:// YOUR_DATABASE_ACCOUNT.documents.azure.com:443/`

This is the documents endpoint for your graph database.  The correct endpoint to use is the Gremlin Endpoint, which has the following format:

`https://YOUR_DATABASE_ACCOUNT.gremlin.cosmosdb.azure.com:443/`

### Why am I getting the “RequestRateIsTooLarge” error?

This error means that the allocated Request Units per second aren't enough to serve the query. This error is usually seen when you run a query that obtains all vertices:

```
// Query example:
g.V()
```

This query will attempt to retrieve all vertices from the graph. So, the cost of this query will be equal to at least the number of vertices in terms of RUs. The RU/s setting should be adjusted to address this query.

### Why do my Gremlin driver connections get dropped eventually?

A Gremlin connection is made through a WebSocket connection. Although WebSocket connections don't have a specific time to live, Azure Cosmos DB Gremlin API will terminate idle connections after 30 minutes of inactivity.

### Why can’t I use fluent API calls in the native Gremlin drivers?

Fluent API calls aren't yet supported by the Azure Cosmos DB Gremlin API. Fluent API calls require an internal formatting feature known as bytecode support that currently isn't supported by Azure Cosmos DB Gremlin API. Due to the same reason, the latest Gremlin-JavaScript driver is also currently not supported.

### How can I evaluate the efficiency of my Gremlin queries?

The **executionProfile()** preview step can be used to provide an analysis of the query execution plan. This step needs to be added to the end of any Gremlin query as illustrated by the following example:

**Query example**

```
g.V('mary').out('knows').executionProfile()
```

**Example output**

```json
[
  {
    "gremlin": "g.V('mary').out('knows').executionProfile()",
    "totalTime": 8,
    "metrics": [
      {
        "name": "GetVertices",
        "time": 3,
        "annotations": {
          "percentTime": 37.5
        },
        "counts": {
          "resultCount": 1
        }
      },
      {
        "name": "GetEdges",
        "time": 5,
        "annotations": {
          "percentTime": 62.5
        },
        "counts": {
          "resultCount": 0
        },
        "storeOps": [
          {
            "count": 0,
            "size": 0,
            "time": 0.6
          }
        ]
      },
      {
        "name": "GetNeighborVertices",
        "time": 0,
        "annotations": {
          "percentTime": 0
        },
        "counts": {
          "resultCount": 0
        }
      },
      {
        "name": "ProjectOperator",
        "time": 0,
        "annotations": {
          "percentTime": 0
        },
        "counts": {
          "resultCount": 0
        }
      }
    ]
  }
]
```

The output of the above profile shows how much time is spent obtaining the vertex objects, the edge objects, and the size of the working data set. This is related to the standard cost measurements for Azure Cosmos DB queries.

## <a id="cassandra"></a> Cassandra API

### What is the protocol version supported by Azure Cosmso DB Cassandra API? Is there a plan to support other protocols?

Apache Cassandra API for Azure Cosmos DB supports today CQL version 4. If you have feedback about supporting other protocols, let us know via [user voice feedback](https://feedback.azure.com/forums/263030-azure-cosmos-db) or send an email to [askcosmosdbcassandra@microsoft.com](mailto:askcosmosdbcassandra@microsoft.com).

### Why is choosing a throughput for a table a requirement?

Azure Cosmos DB sets default throughput for your container based on where you create the table from - portal or CQL.
Azure Cosmos DB provides guarantees for performance and latency, with upper bounds on operation. This guarantee is possible when the engine can enforce governance on the tenant's operations. Setting throughput ensures that you get the guaranteed throughput and latency, because the platform reserves this capacity and guarantees operation success.
You can elastically change throughput to benefit from the seasonality of your application and save costs.

The throughput concept is explained in the [Request Units in Azure Cosmos DB](request-units.md) article. The throughput for a table is distributed across the underlying physical partitions equally.

### What is the default RU/s of table when created through CQL? What If I need to change it?

Azure Cosmos DB uses request units per second (RU/s) as a currency for providing throughput. Tables created through CQL have 400 RU. You can change the RU from the portal.

CQL

```
CREATE TABLE keyspaceName.tablename (user_id int PRIMARY KEY, lastname text) WITH cosmosdb_provisioned_throughput=1200
```

.NET

```csharp
int provisionedThroughput = 400;
var simpleStatement = new SimpleStatement($"CREATE TABLE {keyspaceName}.{tableName} (user_id int PRIMARY KEY, lastname text)");
var outgoingPayload = new Dictionary<string, byte[]>();
outgoingPayload["cosmosdb_provisioned_throughput"] = Encoding.UTF8.GetBytes(provisionedThroughput.ToString());
simpleStatement.SetOutgoingPayload(outgoingPayload);
```

### What happens when throughput is used up?

Azure Cosmos DB provides guarantees for performance and latency, with upper bounds on operation. This guarantee is possible when the engine can enforce governance on the tenant's operations. This is possible based on setting the throughput, which ensures that you get the guaranteed throughput and latency, because platform reserves this capacity and guarantees operation success.
When you go over this capacity, you get overloaded error message indicating your capacity was used up.
0x1001 Overloaded: the request can't be processed because "Request Rate is large". At this juncture, it's essential to see what operations and their volume causes this issue. You can get an idea about consumed capacity going over the provisioned capacity with metrics on the portal. Then you need to ensure capacity is consumed nearly equally across all underlying partitions. If you see most of the throughput is consumed by one partition, you have skew of workload.

Metrics are available that show you how throughput is used over hours, days, and per seven days, across partitions or in aggregate. For more information, see [Monitoring and debugging with metrics in Azure Cosmos DB](use-metrics.md).

Diagnostic logs are explained in the [Azure Cosmos DB diagnostic logging](logging.md) article.

### Does the primary key map to the partition key concept of Azure Cosmos DB?

Yes, the partition key is used to place the entity in right location. In Azure Cosmos DB, it's used to find right logical partition that's stored on a physical partition. The partitioning concept is well explained in the [Partition and scale in Azure Cosmos DB](partition-data.md) article. The essential take away here is that a logical partition shouldn't go over the 10-GB limit today.

### What happens when I get a quota full" notification indicating that a partition is full?

Azure Cosmos DB is a SLA-based system that provides unlimited scale, with guarantees for latency, throughput, availability, and consistency. This unlimited storage is based on horizontal scale out of data using partitioning as the key concept. The partitioning concept is well explained in the [Partition and scale in Azure Cosmos DB](partition-data.md) article.

The 10-GB limit on the number of entities or items per logical partition you should adhere to. To ensure that your application scales well, we recommend that you *not* create a hot partition by storing all information in one partition and querying it. This error can only come if your data is skewed: that is, you have lot of data for one partition key (more than 10&nbsp;GB). You can find the distribution of data using the storage portal. Way to fix this error is to recreate the table and choose a granular primary (partition key), which allows better distribution of data.

### Is it possible to use Cassandra API as key value store with millions or billions of individual partition keys?

Azure Cosmos DB can store unlimited data by scaling out the storage. This is independent of the throughput. Yes you can always just use Cassandra API to store and retrieve key/values by specifying right primary/partition key. These individual keys get their own logical partition and sit atop physical partition without issues.

### Is it possible to create more than one table with Apache Cassandra API of Azure Cosmos DB?

Yes, it's possible to create more than one table with Apache Cassandra API. Each of those tables is treated as unit for throughput and storage.

### Is it possible to create more than one table in succession?

Azure Cosmos DB is resource governed system for both data and control plane activities. Containers like collections, tables are runtime entities that are provisioned for given throughput capacity. The creation of these containers in quick succession isn't expected activity and throttled. If you have tests that drop/create tables immediately, try to space them out.

### What is maximum number of tables that can be created?

There's no physical limit on number of tables, send an email at [askcosmosdbcassandra@microsoft.com](mailto:askcosmosdbcassandra@microsoft.com) if you have large number of tables (where the total steady size goes over 10 TB of data) that need to be created from usual 10s or 100s.

### What is the maximum # of keyspace that we can create?

There's no physical limit on number of keyspaces as they're metadata containers, send an email at [askcosmosdbcassandra@microsoft.com](mailto:askcosmosdbcassandra@microsoft.com) if you have large number of keyspaces for some reason.

### Is it possible to bring in lot of data after starting from normal table?

The storage capacity is automatically managed and increases as you push in more data. So you can confidently import as much data as you need without managing and provisioning nodes, and more.

### Is it possible to supply yaml file settings to configure Apache Casssandra API of Azure Cosmos DB behavior?

Apache Cassandra API of Azure Cosmos DB is a platform service. It provides protocol level compatibility for executing operations. It hides away the complexity of management, monitoring, and configuration. As a developer/user, you don't need to worry about availability, tombstones, key cache, row cache, bloom filter, and multitude of other settings. Azure Cosmos DB's Apache Cassandra API focuses on providing read and write performance that you require without the overhead of configuration and management.

### Will Apache Cassandra API for Azure Cosmos DB support node addition/cluster status/node status commands?

Apache Cassandra API is a platform service that makes capacity planning, responding to the elasticity demands for throughput & storage a breeze. With Azure Cosmos DB you provision throughput, you need. Then you can scale it up and down any number of times through the day without worrying about adding/deleting nodes or managing them. This implies you don't need to use the node, cluster management tool too.

### What happens with respect to various config settings for keyspace creation like simple/network?

Azure Cosmos DB provides global distribution out of the box for availability and low latency reasons. You don't need to setup replicas or other things. All writes are always durably quorum committed in any region where you write while providing performance guarantees.

### What happens with respect to various settings for table metadata like bloom filter, caching, read repair change, gc_grace, compression memtable_flush_period, and more?

Azure Cosmos DB provides performance for reads/writes and throughput without need for touching any of the configuration settings and accidentally manipulating them.

### Is time-to-live (TTL) supported for Cassandra tables?

Yes, TTL is supported.

### Is it possible to monitor node status, replica status, gc, and OS parameters earlier with various tools? What needs to be monitored now?

Azure Cosmos DB is a platform service that helps you increase productivity and not worry about managing and monitoring infrastructure. You just need to take care of throughput that's available on portal metrics to find if you're getting throttled and increase or decrease that throughput.
Monitor [SLAs](monitor-accounts.md).
Use [Metrics](use-metrics.md)
Use [Diagnostic logs](logging.md).

### Which client SDKs can work with Apache Cassandra API of Azure Cosmos DB?

Apache Cassandra SDK's client drivers that use CQLv3 were used for client programs. If you have other drivers that you use or if you're facing issues, send mail to [askcosmosdbcassandra@microsoft.com](mailto:askcosmosdbcassandra@microsoft.com).

### Is composite partition key supported?

Yes, you can use regular syntax to create composite partition key.

### Can I use sstableloader for data loading?

No, sstableloader isn't supported.

### Can an on-premises Apache Cassandra cluster be paired with Azure Cosmos DB's Cassandra API?

At present Azure Cosmos DB has an optimized experience for cloud environment without overhead of operations. If you require pairing, send mail to [askcosmosdbcassandra@microsoft.com](mailto:askcosmosdbcassandra@microsoft.com) with a description of your scenario. We are working on offering to help pair the on-premise/different cloud Cassandra cluster to Cosomos DB's Cassandra API.

### Does Cassandra API provide full backups?

Azure Cosmos DB provides two free full backups taken at four hours interval today across all APIs. This ensures you don't need to set up a backup schedule and other things.
If you want to modify retention and frequency, send an email to [askcosmosdbcassandra@microsoft.com](mailto:askcosmosdbcassandra@microsoft.com) or raise a support case. Information about backup capability is provided in the [Automatic online backup and restore with Azure Cosmos DB](online-backup-and-restore.md) article.

### How does the Cassandra API account handle failover if a region goes down?

The Azure Cosmos DB Cassandra API borrows from the globally distributed platform of Azure Cosmos DB. To ensure that your application can tolerate datacenter downtime, enable at least one more region for the account in the Azure Cosmos DB portal [Developing with multi-region Azure Cosmos DB accounts](high-availability.md). You can set the priority of the region by using the portal [Developing with multi-region Azure Cosmos DB accounts](high-availability.md).

You can add as many regions as you want for the account and control where it can fail over to by providing a failover priority. To use the database, you need to provide an application there too. When you do so, your customers won't experience downtime.

### Does the Apache Cassandra API index all attributes of an entity by default?

Cassandra API is planning to support Secondary indexing to help create selective index on certain attributes. 


### Can I use the new Cassandra API SDK locally with the emulator?

Yes this is supported.

### Azure Cosmos DB as a platform seems to have lot of capabilities, such as change feed and other functionality. Will these capabilities be added to the Cassandra API?

The Apache Cassandra API provides the same CQL functionality as Apache Cassandra. We do plan to look into feasibility of supporting various capabilities in future.

### Feature x of regular Cassandra API isn't working as today, where can the feedback be provided?

Provide feedback via [user voice feedback](https://feedback.azure.com/forums/263030-azure-cosmos-db).

[azure-portal]: https://portal.azure.com
[query]: sql-api-sql-query.md
