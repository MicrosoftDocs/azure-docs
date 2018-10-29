---
title: 'Azure Cosmos DB: SQL Async Java API, SDK & resources | Microsoft Docs'
description: Learn all about the SQL Async Java API and SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB SQL Async Java SDK.
services: cosmos-db
author: SnehaGunda
manager: kfile

ms.service: cosmos-db
ms.component: cosmosdb-sql
ms.devlang: java
ms.topic: reference
ms.date: 09/05/2018
ms.author: sngun

---
# Azure Cosmos DB Async Java SDK for SQL API: Release notes and resources
> [!div class="op_single_selector"]
> * [.NET](sql-api-sdk-dotnet.md)
> * [.NET Change Feed](sql-api-sdk-dotnet-changefeed.md)
> * [.NET Core](sql-api-sdk-dotnet-core.md)
> * [Node.js](sql-api-sdk-node.md)
> * [Async Java](sql-api-sdk-async-java.md)
> * [Java](sql-api-sdk-java.md)
> * [Python](sql-api-sdk-python.md)
> * [REST](https://docs.microsoft.com/rest/api/cosmos-db/)
> * [REST Resource Provider](https://docs.microsoft.com/rest/api/cosmos-db-resource-provider/)
> * [SQL](https://msdn.microsoft.com/library/azure/dn782250.aspx)
> * [BulkExecutor - .NET](sql-api-sdk-bulk-executor-dot-net.md)
> * [BulkExecutor - Java](sql-api-sdk-bulk-executor-java.md)

The SQL API Async Java SDK differs from the SQL API Java SDK by providing asynchronous operations with support of the [Netty library](http://netty.io/). The pre-existing [SQL API Java SDK](sql-api-sdk-java.md) does not support asynchronous operations. 

<table>

<tr><td>**SDK Download**</td><td>[Maven](https://mvnrepository.com/artifact/com.microsoft.azure/azure-cosmosdb)</td></tr>

<tr><td>**API documentation**</td><td>[Java API reference documentation](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx._async_document_client?view=azure-java-stable)</td></tr>

<tr><td>**Contribute to SDK**</td><td>[GitHub](https://github.com/Azure/azure-cosmosdb-java)</td></tr>

<tr><td>**Get started**</td><td>[Get started with the Async Java SDK](https://github.com/Azure-Samples/azure-cosmos-db-sql-api-async-java-getting-started)</td></tr>

<tr><td>**Code sample**</td><td>[Github](https://github.com/Azure/azure-cosmosdb-java#usage-code-sample)</td></tr>

<tr><td>**Performance tips**</td><td>[Github readme](https://github.com/Azure/azure-cosmosdb-java#guide-for-prod)</td></tr>

<tr><td>**Minimum supported runtime**</td><td>[JDK 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)</td></tr>
</table></br>

## Release notes

### <a name="2.1.0"/>2.1.0
* Added support for Proxy.
* Added support for resource token authorization.
* Fixed a bug in handling large partition keys ([github #63](https://github.com/Azure/azure-cosmosdb-java/issues/63)).
* Documentation improved.
* SDK restructured into more granular modules.

### <a name="2.0.1"/>2.0.1
* Fixed a bug for non-english locales ([github #51](https://github.com/Azure/azure-cosmosdb-java/issues/51)).
* Added helper methods in Conflict Resource.

### <a name="2.0.0"/>2.0.0
* Replaced org.json dependency by jackson due to performance reasons and licensing ([github #29](https://github.com/Azure/azure-cosmosdb-java/issues/29)).
* Removed deprecated OfferV2 class.
* Added accessor method to Offer class for throughput content.
* Any method in Document/Resource returning org.json types changed to return a jackson object type.
* getObject(.) method of classes extending JsonSerializable changed to return a jackson ObjectNode type.
* getCollection(.) method changed to return Collection of ObjectNode.
* Removed JsonSerializable subclasses' constructors with org.json.JSONObject arg.
* JsonSerializable.toJson (SerializationFormattingPolicy.Indented) now uses two spaces for indentation.
  
### <a name="1.0.2"/>1.0.2
* Added support for Unique Index Policy.
* Added support for limiting response continuation token size in feed options.
* Added support for Partition Split in Cross Partition Query.
* Fixed a bug in Json timestamp serialization ([github #32](https://github.com/Azure/azure-cosmosdb-java/issues/32)).
* Fixed a bug in Json enum serialization.
* Fixed a bug in managing documents of 2MB size ([github #33](https://github.com/Azure/azure-cosmosdb-java/issues/33)).
* Dependency com.fasterxml.jackson.core:jackson-databind upgraded to 2.9.5 due to a bug ([jackson-databind: github #1599](https://github.com/FasterXML/jackson-databind/issues/1599))
* Dependency on rxjava-extras upgraded to 0.8.0.17 due to a bug ([rxjava-extras: github #30](https://github.com/davidmoten/rxjava-extras/issues/30)).
* The metadata description in pom file updated to be inline with the rest of documentation.
* Syntax improvement ([github #41](https://github.com/Azure/azure-cosmosdb-java/issues/41)), ([github #40](https://github.com/Azure/azure-cosmosdb-java/issues/40)).

### <a name="1.0.1"/>1.0.1
* Added back-pressure support in query.
* Added support for partition key range id in query.
* Fix to allow larger continuation token in request header (bugfix github #24).
* Netty dependency upgraded to 4.1.22.Final to ensure JVM shuts down after main thread finishes.
* Fix to avoid passing session token when reading master resources.
* Added more examples.
* Added more benchmarking scenarios.
* Fixed Java header files for proper java doc generation.

### <a name="1.0.0"/>1.0.0
* GA SDK with end-to-end support for non-blocking IO using the [Netty library](http://netty.io/) in gateway mode. 

## Release and retirement dates
Microsoft will provide notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version.

New features and functionality and optimizations are only added to the current SDK. So it's recommended that you always upgrade to the latest SDK version as early as possible.

Any request to Cosmos DB using a retired SDK will be rejected by the service.

<br/>

| Version | Release Date | Retirement Date |
| --- | --- | --- |
| [2.1.0](#2.1.0) |September 5, 2018|--- |
| [2.0.1](#2.0.1) |August 16, 2018|--- |
| [2.0.0](#2.0.0) |June 20, 2018|--- |
| [1.0.2](#1.0.2) |May 18, 2018|--- |
| [1.0.1](#1.0.1) |April 20, 2018|--- |
| [1.0.0](#1.0.0) |February 27, 2018|--- |

## FAQ
[!INCLUDE [cosmos-db-sdk-faq](../../includes/cosmos-db-sdk-faq.md)]

## See also
To learn more about Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page.

