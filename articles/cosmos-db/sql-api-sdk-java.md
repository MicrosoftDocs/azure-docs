---
title: 'Azure Cosmos DB: SQL Java API, SDK & resources'
description: Learn all about the SQL Java API and SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB SQL Java SDK.
author: SnehaGunda
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: java
ms.topic: reference
ms.date: 03/13/2019
ms.author: sngun


---
# Azure Cosmos DB Java SDK for SQL API: Release notes and resources
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

The SQL API Java SDK supports synchronous operations. For asynchronous support, use the [SQL API Async Java SDK](sql-api-sdk-async-java.md). 

| |  |
|---|---|
|**SDK Download**|[Maven](https://search.maven.org/#search%7Cgav%7C1%7Cg%3A%22com.microsoft.azure%22%20AND%20a%3A%22azure-documentdb%22)|
|**API documentation**|[Java API reference documentation](/java/api/com.microsoft.azure.documentdb)|
|**Contribute to SDK**|[GitHub](https://github.com/Azure/azure-documentdb-java/)|
|**Get started**|[Get started with the Java SDK](sql-api-java-get-started.md)|
|**Web app tutorial**|[Web application development with Azure Cosmos DB](sql-api-java-application.md)|
|**Minimum supported runtime**|[Java Development Kit (JDK) 7+](https://aka.ms/azure-jdks)|

## Release notes

### <a name="2.1.3"/>2.1.3
* Fixed bug in PartitionKey for Hash V2.

### <a name="2.1.2"/>2.1.2
* Added support for composite indexes.
* Fixed bug in global endpoint manager to force refresh.
* Fixed bug for upserts with pre-conditions in direct mode.

### <a name="2.1.1"/>2.1.1
* Fixed bug in gateway address cache.

### <a name="2.1.0"/>2.1.0
* Multi-region write support added for direct mode.
* Added support for handling IOExceptions thrown as ServiceUnavailable exceptions, from a proxy.
* Fixed a bug in endpoint discovery retry policy.
* Fixed a bug to ensure null pointer exceptions are not thrown in BaseDatabaseAccountConfigurationProvider.
* Fixed a bug to ensure QueryIterator does not return nulls.
* Fixed a bug to ensure large PartitionKey is allowed

### <a name="2.0.0"/>2.0.0
* Multi-region write support added for gateway mode.

### <a name="1.16.4"/>1.16.4
* Fixed a bug in Read partition Key ranges for a query.

### <a name="1.16.3"/>1.16.3
* Fixed a bug in setting continuation token header size in DirectHttps mode.

### <a name="1.16.2"/>1.16.2
* Added streaming fail over support.
* Added support for custom metadata.
* Improved session handling logic.
* Fixed a bug in partition key range cache.
* Fixed a NPE bug in direct mode.

### <a name="1.16.1"/>1.16.1
* Added support for Unique Index.
* Added support for limiting continuation token size in feed-options.
* Fixed a bug in Json Serialization (timestamp).
* Fixed a bug in Json Serialization (enum).
* Dependency on com.fasterxml.jackson.core:jackson-databind upgraded to 2.9.5.

### <a name="1.16.0"/>1.16.0
* Improved Connection Pooling for Direct Mode.
* Improved Prefetch improvement for non-orderby cross partition query.
* Improved UUID generation.
* Improved Session consistency logic.
* Added support for multipolygon.
* Added support for Partition Key Range Statistics for Collection.
* Fixed a bug in Multi-region support.

### <a name="1.15.0"/>1.15.0
* Improved Json Serialization performance.
* This SDK version requires the latest version of Azure Cosmos DB Emulator available for download from https://aka.ms/cosmosdb-emulator.

### <a name="1.14.0"/>1.14.0
* Internal changes for Microsoft friends libraries.

### <a name="1.13.0"/>1.13.0
* Fixed an issue in reading single partition key ranges.
* Fixed an issue in ResourceID parsing that affects database with short names.
* Fixed an issue cause by partition key encoding.

### <a name="1.12.0"/>1.12.0
* Critical bug fixes to request processing during partition splits.
* Fixed an issue with the Strong and BoundedStaleness consistency levels.

### <a name="1.11.0"/>1.11.0
* Added support for a new consistency level called ConsistentPrefix.
* Fixed a bug in reading collection in session mode.

### <a name="1.10.0"/>1.10.0
* Enabled support for partitioned collection with as low as 2,500 RU/sec and scale in increments of 100 RU/sec.
* Fixed a bug in the native assembly which can cause NullRef exception in some queries.

### <a name="1.9.6"/>1.9.6
* Fixed a bug in the query engine configuration that may cause exceptions for queries in Gateway mode.
* Fixed a few bugs in the session container that may cause an "Owner resource not found" exception for requests immediately after collection creation.

### <a name="1.9.5"/>1.9.5
* Added support for aggregation queries (COUNT, MIN, MAX, SUM, and AVG). See [Aggregation support](sql-query-aggregates.md).
* Added support for change feed.
* Added support for collection quota information through RequestOptions.setPopulateQuotaInfo.
* Added support for stored procedure script logging through RequestOptions.setScriptLoggingEnabled.
* Fixed a bug where query in DirectHttps mode may stop responding when encountering throttle failures.
* Fixed a bug in session consistency mode.
* Fixed a bug which may cause NullReferenceException in HttpContext when request rate is high.
* Improved performance of DirectHttps mode.

### <a name="1.9.4"/>1.9.4
* Added simple client instance-based proxy support with ConnectionPolicy.setProxy() API.
* Added DocumentClient.close() API to properly shutdown DocumentClient instance.
* Improved query performance in direct connectivity mode by deriving the query plan from the native assembly instead of the Gateway.
* Set FAIL_ON_UNKNOWN_PROPERTIES = false so users don't need to define JsonIgnoreProperties in their POJO.
* Refactored logging to use SLF4J.
* Fixed a few other bugs in consistency reader.

### <a name="1.9.3"/>1.9.3
* Fixed a bug in the connection management to prevent connection leaks in direct connectivity mode.
* Fixed a bug in the TOP query where it may throw NullReference exception.
* Improved performance by reducing the number of network call for the internal caches.
* Added status code, ActivityID and Request URI in DocumentClientException for better troubleshooting.

### <a name="1.9.2"/>1.9.2
* Fixed an issue in the connection management for stability.

### <a name="1.9.1"/>1.9.1
* Added support for BoundedStaleness consistency level.
* Added support for direct connectivity for CRUD operations for partitioned collections.
* Fixed a bug in querying a database with SQL.
* Fixed a bug in the session cache where session token may be set incorrectly.

### <a name="1.9.0"/>1.9.0
* Added support for cross partition parallel queries.
* Added support for TOP/ORDER BY queries for partitioned collections.
* Added support for strong consistency.
* Added support for name based requests when using direct connectivity.
* Fixed to make ActivityId stay consistent across all request retries.
* Fixed a bug related to the session cache when recreating a collection with the same name.
* Added Polygon and LineString DataTypes while specifying collection indexing policy for geo-fencing spatial queries.
* Fixed issues with Java Doc for Java 1.8.

### <a name="1.8.1"/>1.8.1
* Fixed a bug in PartitionKeyDefinitionMap to cache single partition collections and not make extra fetch partition key requests.
* Fixed a bug to not retry when an incorrect partition key value is provided.

### <a name="1.8.0"/>1.8.0
* Added the support for multi-region database accounts.
* Added support for automatic retry on throttled requests with options to customize the max retry attempts and max retry wait time.  See RetryOptions and ConnectionPolicy.getRetryOptions().
* Deprecated IPartitionResolver based custom partitioning code. Please use partitioned collections for higher storage and throughput.

### <a name="1.7.1"/>1.7.1
* Added retry policy support for rate limiting.  

### <a name="1.7.0"/>1.7.0
* Added time to live (TTL) support for documents.

### <a name="1.6.0"/>1.6.0
* Implemented [partitioned collections](partition-data.md) and [user-defined performance levels](performance-levels.md).

### <a name="1.5.1"/>1.5.1
* Fixed a bug in HashPartitionResolver to generate hash values in little-endian to be consistent with other SDKs.

### <a name="1.5.0"/>1.5.0
* Add Hash & Range partition resolvers to assist with sharding applications across multiple partitions.

### <a name="1.4.0"/>1.4.0
* Implement Upsert. New upsertXXX methods added to support Upsert feature.
* Implement ID Based Routing. No public API changes, all changes internal.

### <a name="1.3.0"/>1.3.0
* Release skipped to bring version number in alignment with other SDKs

### <a name="1.2.0"/>1.2.0
* Supports GeoSpatial Index
* Validates ID property for all resources. Ids for resources cannot contain ?, /, #, \, characters or end with a space.
* Adds new header "index transformation progress" to ResourceResponse.

### <a name="1.1.0"/>1.1.0
* Implements V2 indexing policy

### <a name="1.0.0"/>1.0.0
* GA SDK

## Release and retirement dates
Microsoft will provide notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version.

New features and functionality and optimizations are only added to the current SDK, as such it is  recommend that you always upgrade to the latest SDK version as early as possible.

Any request to Cosmos DB using a retired SDK will be rejected by the service.

> [!WARNING]
> All versions **1.x** of the SQL SDK for Java will be retired on **May 30, 2020**.
> 
>

> [!WARNING]
> All versions of the SQL SDK for Java prior to version **1.0.0** were retired on **February 29, 2016**.
> 
> 

<br/>

| Version | Release Date | Retirement Date |
| --- | --- | --- |
| [2.1.3](#2.1.3) |Mar 13, 2018 |--- |
| [2.1.2](#2.1.2) |Mar 09, 2018 |--- |
| [2.1.1](#2.1.1) |Dec 13, 2018 |--- |
| [2.1.0](#2.1.0) |Nov 20, 2018 |--- |
| [2.0.0](#2.0.0) |Sept 21, 2018 |--- |
| [1.16.4](#1.16.4) |Sept 10, 2018 |May 30, 2020 |
| [1.16.3](#1.16.3) |Sept 09, 2018 |May 30, 2020 |
| [1.16.2](#1.16.2) |June 29, 2018 |May 30, 2020 |
| [1.16.1](#1.16.1) |May 16, 2018 |May 30, 2020 |
| [1.16.0](#1.16.0) |March 15, 2018 |May 30, 2020 |
| [1.15.0](#1.15.0) |Nov 14, 2017 |May 30, 2020 |
| [1.14.0](#1.14.0) |Oct 28, 2017 |May 30, 2020 |
| [1.13.0](#1.13.0) |August 25, 2017 |May 30, 2020 |
| [1.12.0](#1.12.0) |July 11, 2017 |May 30, 2020 |
| [1.11.0](#1.11.0) |May 10, 2017 |May 30, 2020 |
| [1.10.0](#1.10.0) |March 11, 2017 |May 30, 2020 |
| [1.9.6](#1.9.6) |February 21, 2017 |May 30, 2020 |
| [1.9.5](#1.9.5) |January 31, 2017 |May 30, 2020 |
| [1.9.4](#1.9.4) |November 24, 2016 |May 30, 2020 |
| [1.9.3](#1.9.3) |October 30, 2016 |May 30, 2020 |
| [1.9.2](#1.9.2) |October 28, 2016 |May 30, 2020 |
| [1.9.1](#1.9.1) |October 26, 2016 |May 30, 2020 |
| [1.9.0](#1.9.0) |October 03, 2016 |May 30, 2020 |
| [1.8.1](#1.8.1) |June 30, 2016 |May 30, 2020 |
| [1.8.0](#1.8.0) |June 14, 2016 |May 30, 2020 |
| [1.7.1](#1.7.1) |April 30, 2016 |May 30, 2020 |
| [1.7.0](#1.7.0) |April 27, 2016 |May 30, 2020 |
| [1.6.0](#1.6.0) |March 29, 2016 |May 30, 2020 |
| [1.5.1](#1.5.1) |December 31, 2015 |May 30, 2020 |
| [1.5.0](#1.5.0) |December 04, 2015 |May 30, 2020 |
| [1.4.0](#1.4.0) |October 05, 2015 |May 30, 2020 |
| [1.3.0](#1.3.0) |October 05, 2015 |May 30, 2020 |
| [1.2.0](#1.2.0) |August 05, 2015 |May 30, 2020 |
| [1.1.0](#1.1.0) |July 09, 2015 |May 30, 2020 |
| 1.0.1 |May 12, 2015 |May 30, 2020 |
| [1.0.0](#1.0.0) |April 07, 2015 |May 30, 2020 |
| 0.9.5-prelease |Mar 09, 2015 |February 29, 2016 |
| 0.9.4-prelease |February 17, 2015 |February 29, 2016 |
| 0.9.3-prelease |January 13, 2015 |February 29, 2016 |
| 0.9.2-prelease |December 19, 2014 |February 29, 2016 |
| 0.9.1-prelease |December 19, 2014 |February 29, 2016 |
| 0.9.0-prelease |December 10, 2014 |February 29, 2016 |

## FAQ
[!INCLUDE [cosmos-db-sdk-faq](../../includes/cosmos-db-sdk-faq.md)]

## See also
To learn more about Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page.

