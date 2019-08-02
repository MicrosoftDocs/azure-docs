---
title: 'Azure Cosmos DB: SQL Async Java API, SDK & resources'
description: Learn all about the SQL Async Java API and SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB SQL Async Java SDK.
author: moderakh
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: java
ms.topic: reference
ms.date: 07/01/2019
ms.author: moderakh

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
> * [SQL](sql-api-query-reference.md)
> * [BulkExecutor - .NET](sql-api-sdk-bulk-executor-dot-net.md)
> * [BulkExecutor - Java](sql-api-sdk-bulk-executor-java.md)

The SQL API Async Java SDK differs from the SQL API Java SDK by providing asynchronous operations with support of the [Netty library](https://netty.io/). The pre-existing [SQL API Java SDK](sql-api-sdk-java.md) does not support asynchronous operations. 

| |  |
|---|---|
| **SDK Download** | [Maven](https://mvnrepository.com/artifact/com.microsoft.azure/azure-cosmosdb) |
|**API documentation** |[Java API reference documentation](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient?view=azure-java-stable) | 
|**Contribute to SDK** | [GitHub](https://github.com/Azure/azure-cosmosdb-java) | 
|**Get started** | [Get started with the Async Java SDK](https://github.com/Azure-Samples/azure-cosmos-db-sql-api-async-java-getting-started) | 
|**Code sample** | [GitHub](https://github.com/Azure/azure-cosmosdb-java#usage-code-sample)| 
| **Performance tips**| [GitHub readme](https://github.com/Azure/azure-cosmosdb-java#guide-for-prod)| 
| **Minimum supported runtime**|[JDK 8](https://aka.ms/azure-jdks) | 

## Release notes

### <a name="2.5.0"/>2.5.0
* TCP mode now on by default
* Query metrics in cross partition now returns all partitions
* Global Strong now works properly
* Failover for queries not properly retries for multi-master
* Dependency bumps for security hotfixes

### <a name="2.4.5"/>2.4.5
* Bugfix for Hash V2 support

### <a name="2.4.3"/>2.4.3
* Bugfix for resource leak on client#close()  ([github #88](https://github.com/Azure/azure-cosmosdb-java/issues/88)).

### <a name="2.4.2"/>2.4.2
* Added continuation token support for cross partition queries.

### <a name="2.4.1"/>2.4.1
* Fixed some bugs in Direct mode.
* Improved logging in Direct mode.
* Improved connection management.

### <a name="2.4.0"/>2.4.0
* Direct mode connectivity is now Generally Available(GA). For a sample that uses direct mode connectivity, see [azure-cosmosdb-java](https://github.com/Azure/azure-cosmosdb-java) GitHub repository.
* Added support for QueryMetrics.
* Changed the APIs accepting java.util.Collection for which order is important to accept java.util.List instead. Now ConnectionPolicy#getPreferredLocations(), JsonSerialization, and PartitionKey(.) accept List.

### <a name="2.4.0-beta-1"/>2.4.0-beta-1
* Added support for direct mode connectivity.
* Changed the APIs accepting java.util.Collection for which order is important to accept java.util.List instead.
  Now ConnectionPolicy#getPreferredLocations(), JsonSerialization, and PartitionKey(.) accept List.
* Fixed a session bug for document query in gateway mode.
* Upgraded dependencies (netty 0.4.20 [github #79](https://github.com/Azure/azure-cosmosdb-java/issues/79), RxJava 1.3.8).

### <a name="2.3.1"/>2.3.1
* Fixes handling very large query responses.
* Fixes resource token handling when instantiating client ([github #78](https://github.com/Azure/azure-cosmosdb-java/issues/78)).
* Upgraded vulnerable dependency jackson-databind ([github #77](https://github.com/Azure/azure-cosmosdb-java/pull/77)).

### <a name="2.3.0"/>2.3.0
* Fixed a resource leak bug.
* Added support for MultiPolygon
* Added support for custom headers in RequestOptions.

### <a name="2.2.2"/>2.2.2
* Fixed a packaging bug.

### <a name="2.2.1"/>2.2.1
* Fixed a NPE bug in write retry path.
* Fixed a NPE bug in endpoint management.
* Upgraded vulnerable dependencies ([GitHub #68](https://github.com/Azure/azure-cosmosdb-java/issues/68)).
* Added support for Netty network logging for troubleshooting.

### <a name="2.2.0"/>2.2.0
* Added support for Multi-region write.

### <a name="2.1.0"/>2.1.0
* Added support for Proxy.
* Added support for resource token authorization.
* Fixed a bug in handling large partition keys ([GitHub #63](https://github.com/Azure/azure-cosmosdb-java/issues/63)).
* Documentation improved.
* SDK restructured into more granular modules.

### <a name="2.0.1"/>2.0.1
* Fixed a bug for non-english locales ([GitHub #51](https://github.com/Azure/azure-cosmosdb-java/issues/51)).
* Added helper methods in Conflict Resource.

### <a name="2.0.0"/>2.0.0
* Replaced org.json dependency by jackson due to performance reasons and licensing ([GitHub #29](https://github.com/Azure/azure-cosmosdb-java/issues/29)).
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
* Fixed a bug in Json timestamp serialization ([GitHub #32](https://github.com/Azure/azure-cosmosdb-java/issues/32)).
* Fixed a bug in Json enum serialization.
* Fixed a bug in managing documents of 2MB size ([GitHub #33](https://github.com/Azure/azure-cosmosdb-java/issues/33)).
* Dependency com.fasterxml.jackson.core:jackson-databind upgraded to 2.9.5 due to a bug ([jackson-databind: GitHub #1599](https://github.com/FasterXML/jackson-databind/issues/1599))
* Dependency on rxjava-extras upgraded to 0.8.0.17 due to a bug ([rxjava-extras: GitHub #30](https://github.com/davidmoten/rxjava-extras/issues/30)).
* The metadata description in pom file updated to be inline with the rest of documentation.
* Syntax improvement ([GitHub #41](https://github.com/Azure/azure-cosmosdb-java/issues/41)), ([GitHub #40](https://github.com/Azure/azure-cosmosdb-java/issues/40)).

### <a name="1.0.1"/>1.0.1
* Added back-pressure support in query.
* Added support for partition key range id in query.
* Fix to allow larger continuation token in request header (bugfix GitHub #24).
* Netty dependency upgraded to 4.1.22.Final to ensure JVM shuts down after main thread finishes.
* Fix to avoid passing session token when reading master resources.
* Added more examples.
* Added more benchmarking scenarios.
* Fixed Java header files for proper java doc generation.

### <a name="1.0.0"/>1.0.0
* GA SDK with end-to-end support for non-blocking IO using the [Netty library](https://netty.io/) in gateway mode. 

## Release and retirement dates
Microsoft will provide notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version.

New features and functionality and optimizations are only added to the current SDK. So it's recommended that you always upgrade to the latest SDK version as early as possible.

Any request to Cosmos DB using a retired SDK will be rejected by the service.

<br/>

| Version | Release Date | Retirement Date |
| --- | --- | --- |
| [2.4.3](#2.4.3) |Mar 5, 2019|--- |
| [2.4.2](#2.4.2) |Mar 1, 2019|--- |
| [2.4.1](#2.4.1) |Feb 20, 2019|--- |
| [2.4.0](#2.4.0) |Feb 8, 2019|--- |
| [2.4.0-beta-1](#2.4.0-beta-1) |Feb 4, 2019|--- |
| [2.3.1](#2.3.1) |Jan 15, 2019|--- |
| [2.3.0](#2.3.0) |Nov 29, 2018|--- |
| [2.2.2](#2.2.2) |Nov 8, 2018|--- |
| [2.2.1](#2.2.1) |Nov 2, 2018|--- |
| [2.2.0](#2.2.0) |September 22, 2018|--- |
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

