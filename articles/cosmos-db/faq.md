---
title: Frequently asked questions on different APIs in Azure Cosmos DB
description: Get answers to frequently asked questions about Azure Cosmos DB, a globally distributed, multi-model database service. Learn about capacity, performance levels, and scaling.
author: SnehaGunda
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/01/2019
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

### Can I use multiple APIs to access my data?

Azure Cosmos DB is Microsoft's globally distributed, multi-model database service. Where multi-model means Azure Cosmos DB supports multiple APIs and multiple data models, different APIs use different data formats for storage and wire protocol. For example, SQL uses JSON, MongoDB uses BSON, Table uses EDM, Cassandra uses CQL, Gremlin uses JSON format. As a result, we recommend using the same API for all access to the data in a given account.

Each API operates independently, except the Gremlin and SQL API, which are interoperable.

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

* [Microsoft Q&A question page](https://docs.microsoft.com/answers/topics/azure-cosmos-db.html)
* [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-cosmosdb). Stack Overflow is best for programming questions. Make sure your question is [on-topic](https://stackoverflow.com/help/on-topic) and [provide as many details as possible, making the question clear and answerable](https://stackoverflow.com/help/how-to-ask).

To request new features, create a new request on [User voice](https://feedback.azure.com/forums/263030-azure-cosmos-db).

To fix an issue with your account, file a [support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.

## <a id="try-cosmos-db"></a>Try Azure Cosmos DB subscriptions

You can now enjoy a time-limited Azure Cosmos DB experience without a subscription, free of charge and commitments. To sign up for a Try Azure Cosmos DB subscription, go to [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) and use any personal Microsoft account (MSA). This subscription is separate from the [Azure Free Trial](https://azure.microsoft.com/free/), and can be used along with an Azure Free Trial or an Azure paid subscription.

Try Azure Cosmos DB subscriptions appear in the Azure portal next other subscriptions associated with your user ID.

The following conditions apply to Try Azure Cosmos DB subscriptions:

* Account access can be granted to personal Microsoft accounts (MSA). Avoid using Active Directory (AAD) accounts or accounts belonging to corporate AAD Tenants, they might have limitations in place that could block access granting.
* One [throughput provisioned container](./set-throughput.md#set-throughput-on-a-container) per subscription for SQL, Gremlin API, and Table accounts.
* Up to three [throughput provisioned collections](./set-throughput.md#set-throughput-on-a-container) per subscription for MongoDB accounts.
* One [throughput provisioned database](./set-throughput.md#set-throughput-on-a-database) per subscription. Throughput provisioned databases can contain any number of containers inside.
* 10-GB storage capacity.
* Global replication is available in the following [Azure regions](https://azure.microsoft.com/regions/): Central US, North Europe, and Southeast Asia
* Maximum throughput of 5 K RU/s when provisioned at the container level.
* Maximum throughput of 20 K RU/s when provisioned at the database level.
* Subscriptions expire after 30 days, and can be extended to a maximum of 31 days total. After expiration, the information contained is deleted.
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

Container and database level throughput provisioning are separate offerings and switching between either of these require migrating data from source to destination. Which means you need to create a new database or a new container and then migrate data by using [bulk executor library](bulk-executor-overview.md) or [Azure Data Factory](../data-factory/connector-azure-cosmos-db.md).

### Does Azure CosmosDB support time series analysis?

Yes Azure CosmosDB supports time series analysis, here is a sample for [time series pattern](https://github.com/Azure/azure-cosmosdb-dotnet/tree/master/samples/Patterns). This sample shows how to use change feed to build aggregated views over time series data. You can extend this approach by using spark streaming or another stream data processor.

## What are the Azure Cosmos DB service quotas and throughput limits

See the Azure Cosmos DB [service quotas](concepts-limits.md) and [throughout limits per container and database](set-throughput.md#comparison-of-models) articles for more information.

## <a id="sql-api-faq"></a>Frequently asked questions about SQL API

### How do I start developing against the SQL API?

First you must sign up for an Azure subscription. Once you sign up for an Azure subscription, you can add a SQL API container to your Azure subscription. For instructions on adding an Azure Cosmos DB account, see [Create an Azure Cosmos database account](create-sql-api-dotnet.md#create-account).

[SDKs](sql-api-sdk-dotnet.md) are available for .NET, Python, Node.js, JavaScript, and Java. Developers can also use the [RESTful HTTP APIs](/rest/api/cosmos-db/) to interact with Azure Cosmos DB resources from various platforms and languages.

### Can I access some ready-made samples to get a head start?

Samples for the SQL API [.NET](sql-api-dotnet-samples.md), [Java](https://github.com/Azure/azure-documentdb-java), [Node.js](sql-api-nodejs-samples.md), and [Python](sql-api-python-samples.md) SDKs are available on GitHub.

### Does the SQL API database support schema-free data?

Yes, the SQL API allows applications to store arbitrary JSON documents without schema definitions or hints. Data is immediately available for query through the Azure Cosmos DB SQL query interface.

### Does the SQL API support ACID transactions?

Yes, the SQL API supports cross-document transactions expressed as JavaScript-stored procedures and triggers. Transactions are scoped to a single partition within each container and executed with ACID semantics as "all or nothing," isolated from other concurrently executing code and user requests. If exceptions are thrown through the server-side execution of JavaScript application code, the entire transaction is rolled back. 

### What is a container?

A container is a group of documents and their associated JavaScript application logic. A container is a billable entity, where the [cost](performance-levels.md) is determined by the throughput and used storage. Containers can span one or more partitions or servers and can scale to handle practically unlimited volumes of storage or throughput.

* For SQL API, a container maps to a Container.
* For Cosmos DB's API for MongoDB accounts, a container maps to a Collection.
* For Cassandra and Table API accounts, a container maps to a Table.
* For Gremlin API accounts, a container maps to a Graph.

Containers are also the billing entities for Azure Cosmos DB. Each container is billed hourly, based on the provisioned throughput and used storage space. For more information, see [Azure Cosmos DB Pricing](https://azure.microsoft.com/pricing/details/cosmos-db/).

### How do I create a database?

You can create databases by using the [Azure portal](https://portal.azure.com), as described in [Add a container](create-sql-api-java.md#add-a-container), one of the [Azure Cosmos DB SDKs](sql-api-sdk-dotnet.md), or the [REST APIs](/rest/api/cosmos-db/).

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

The SQL API supports language-integrated transactions via JavaScript-stored procedures and triggers. All database operations inside scripts are executed under snapshot isolation. If it's a single-partition container, the execution is scoped to the container. If the container is partitioned, the execution is scoped to documents with the same partition-key value within the container. A snapshot of the document versions (ETags) is taken at the start of the transaction and committed only if the script succeeds. If the JavaScript throws an error, the transaction is rolled back. For more information, see [Server-side JavaScript programming for Azure Cosmos DB](stored-procedures-triggers-udfs.md).

### How can I bulk-insert documents into Cosmos DB?

You can bulk-insert documents into Azure Cosmos DB in one of the following ways:

* The bulk executor tool, as described in [Using bulk executor .NET library](bulk-executor-dot-net.md) and [Using bulk executor Java library](bulk-executor-java.md)
* The data migration tool, as described in [Database migration tool for Azure Cosmos DB](import-data.md).
* Stored procedures, as described in [Server-side JavaScript programming for Azure Cosmos DB](stored-procedures-triggers-udfs.md).

### Does the SQL API support resource link caching?

Yes, because Azure Cosmos DB is a RESTful service, resource links are immutable and can be cached. SQL API clients can specify an "If-None-Match" header for reads against any resource-like document or container and then update their local copies after the server version has changed.

### Is a local instance of SQL API available?

Yes. The [Azure Cosmos DB Emulator](local-emulator.md) provides a high-fidelity emulation of the Cosmos DB service. It supports functionality that's identical to Azure Cosmos DB, including support for creating and querying JSON documents, provisioning and scaling collections, and executing stored procedures and triggers. You can develop and test applications by using the Azure Cosmos DB Emulator, and deploy them to Azure at a global scale by making a single configuration change to the connection endpoint for Azure Cosmos DB.

### Why are long floating-point values in a document rounded when viewed from data explorer in the portal.

This is limitation of JavaScript. JavaScript uses double-precision floating-point format numbers as specified in IEEE 754 and it can safely hold numbers between -(2<sup>53</sup> - 1) and 2<sup>53</sup>-1 (i.e., 9007199254740991) only.

### Where are permissions allowed in the object hierarchy?

Creating permissions by using ResourceTokens is allowed at the container level and its descendants (such as documents, attachments). This implies that trying to create a permission at the database or an account level isn't currently allowed.

[azure-portal]: https://portal.azure.com
[query]: sql-api-sql-query.md

## Next steps

To learn about frequently asked questions in other APIs, see:

* Frequently asked questions about [Azure Cosmos DB's API for MongoDB](mongodb-api-faq.md)
* Frequently asked questions about [Gremlin API in Azure Cosmos DB](gremlin-api-faq.md)
* Frequently asked questions about [Cassandra API in Azure Cosmos DB](cassandra-faq.md)
* Frequently asked questions about [Table API in Azure Cosmos DB](table-api-faq.md)
