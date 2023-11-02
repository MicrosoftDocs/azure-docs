---
title: 'Azure Cosmos DB: SQL Java API, SDK & resources'
description: Learn all about the SQL Java API and SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB SQL Java SDK.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: java
ms.topic: reference
ms.date: 04/06/2021
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: devx-track-java, ignite-2022, devx-track-extended-java
---

# Azure Cosmos DB Java SDK for API for NoSQL (legacy): Release notes and resources
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[SDK selector](../includes/cosmos-db-sdk-list.md)]

This is the original Azure Cosmos DB Sync Java SDK v2 for API for NoSQL which supports synchronous operations.

> [!IMPORTANT]  
> This is *not* the latest Java SDK for Azure Cosmos DB! We **strongly recommend** using [Azure Cosmos DB Java SDK v4](sdk-java-v4.md) for your project. To upgrade, follow the instructions in the [Migrate to Azure Cosmos DB Java SDK v4](migrate-java-v4-sdk.md) guide and the [Reactor vs RxJava](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/reactor-rxjava-guide.md) guide. 
>

> [!IMPORTANT]  
> On February 29, 2024 the Azure Cosmos DB Sync Java SDK v2.x
> will be retired. Azure Cosmos DB will cease
> to provide further maintenance and support for this SDK after retirement.
> Please follow the instructions above to migrate to
> Azure Cosmos DB Java SDK v4.
>


| | Links |
|---|---|
|**SDK Download**|[Maven](https://search.maven.org/#search%7Cgav%7C1%7Cg%3A%22com.microsoft.azure%22%20AND%20a%3A%22azure-documentdb%22)|
|**API documentation**|[Java API reference documentation](/java/api/com.microsoft.azure.documentdb)|
|**Contribute to SDK**|[GitHub](https://github.com/Azure/azure-documentdb-java/)|
|**Get started**|[Get started with the Java SDK](./quickstart-java.md)|
|**Web app tutorial**|[Web application development with Azure Cosmos DB](tutorial-java-web-app.md)|
|**Minimum supported runtime**|[Java Development Kit (JDK) 7+](/java/azure/jdk/)|

## Release notes
### <a name="2.6.5"></a>2.6.5
* Removed test dependency `com.google.guava/guava` due to security vulnerabilities
* Upgraded dependency `com.fasterxml.jackson.core/jackson-databind` to 2.14.0
* Upgraded dependency `commons-codec/commons-codec` to 1.15
* Upgraded dependency `org.json/json` to 20180130

### <a name="2.6.4"></a>2.6.4
* Fixed the retry policy for read timeouts

### <a name="2.6.3"></a>2.6.3
* Fixed a retry policy when `GoneException` is wrapped in `IllegalStateException` - - this change is necessary to make sure Gateway cache is refreshed on 410 so the Spark connector (for Spark 2.4) can use a custom retry policy to allow queries to succeed during partition splits

### <a name="2.6.2"></a>2.6.2
* Added a new retry policy to  retry on Read Timeouts
* Upgraded dependency `com.fasterxml.jackson.core/jackson-databind` to 2.9.10.8
* Upgraded dependency `org.apache.httpcomponents/httpclient` to 4.5.13

### <a name="2.6.1"></a>2.6.1
* Fixed a bug in handling a query through service interop.

### <a name="2.6.0"></a>2.6.0
* Added support for querying change feed from point in time.

### <a name="2.5.1"></a>2.5.1
* Fixes primary partition cache issue on documentCollection query.

### <a name="2.5.0"></a>2.5.0
* Added support for 449 retry custom configuration.

### <a name="2.4.7"></a>2.4.7
* Fixes connection pool timeout issue.
* Fixes auth token refresh on internal retries.

### <a name="2.4.6"></a>2.4.6
* Updated correct client side replica policy tag on databaseAccount and made databaseAccount configuration reads from cache.

### <a name="2.4.5"></a>2.4.5
* Avoiding retry on invalid partition key range error, if user provides pkRangeId.

### <a name="2.4.4"></a>2.4.4
* Optimized partition key range cache refreshes.
* Fixes the scenario where the SDK doesn't entertain partition split hint from server and results in incorrect client side routing caches refresh.

### <a name="2.4.2"></a>2.4.2
* Optimized collection cache refreshes.

### <a name="2.4.1"></a>2.4.1
* Added support to retrieve inner exception message from request diagnostic string.

### <a name="2.4.0"></a>2.4.0
* Introduced version api on PartitionKeyDefinition.

### <a name="2.3.0"></a>2.3.0
* Added separate timeout support for direct mode.

### <a name="2.2.3"></a>2.2.3
* Consuming null error message from service and producing document client exception.

### <a name="2.2.2"></a>2.2.2
* Socket connection improvement, adding SoKeepAlive default true.

### <a name="2.2.0"></a>2.2.0
* Added request diagnostics string support.

### <a name="2.1.3"></a>2.1.3
* Fixed bug in PartitionKey for Hash V2.

### <a name="2.1.2"></a>2.1.2
* Added support for composite indexes.
* Fixed bug in global endpoint manager to force refresh.
* Fixed bug for upserts with pre-conditions in direct mode.

### <a name="2.1.1"></a>2.1.1
* Fixed bug in gateway address cache.

### <a name="2.1.0"></a>2.1.0
* Multi-region write support added for direct mode.
* Added support for handling IOExceptions thrown as ServiceUnavailable exceptions, from a proxy.
* Fixed a bug in endpoint discovery retry policy.
* Fixed a bug to ensure null pointer exceptions are not thrown in BaseDatabaseAccountConfigurationProvider.
* Fixed a bug to ensure QueryIterator does not return nulls.
* Fixed a bug to ensure large PartitionKey is allowed

### <a name="2.0.0"></a>2.0.0
* Multi-region write support added for gateway mode.

### <a name="1.16.4"></a>1.16.4
* Fixed a bug in Read partition Key ranges for a query.

### <a name="1.16.3"></a>1.16.3
* Fixed a bug in setting continuation token header size in DirectHttps mode.

### <a name="1.16.2"></a>1.16.2
* Added streaming fail over support.
* Added support for custom metadata.
* Improved session handling logic.
* Fixed a bug in partition key range cache.
* Fixed a NPE bug in direct mode.

### <a name="1.16.1"></a>1.16.1
* Added support for Unique Index.
* Added support for limiting continuation token size in feed-options.
* Fixed a bug in Json Serialization (timestamp).
* Fixed a bug in Json Serialization (enum).
* Dependency on com.fasterxml.jackson.core:jackson-databind upgraded to 2.9.5.

### <a name="1.16.0"></a>1.16.0
* Improved Connection Pooling for Direct Mode.
* Improved Prefetch improvement for non-orderby cross partition query.
* Improved UUID generation.
* Improved Session consistency logic.
* Added support for multipolygon.
* Added support for Partition Key Range Statistics for Collection.
* Fixed a bug in Multi-region support.

### <a name="1.15.0"></a>1.15.0
* Improved Json Serialization performance.
* This SDK version requires the latest version of [Azure Cosmos DB Emulator](https://aka.ms/cosmosdb-emulator).

### <a name="1.14.0"></a>1.14.0
* Internal changes for Microsoft friends libraries.

### <a name="1.13.0"></a>1.13.0
* Fixed an issue in reading single partition key ranges.
* Fixed an issue in ResourceID parsing that affects database with short names.
* Fixed an issue cause by partition key encoding.

### <a name="1.12.0"></a>1.12.0
* Critical bug fixes to request processing during partition splits.
* Fixed an issue with the Strong and BoundedStaleness consistency levels.

### <a name="1.11.0"></a>1.11.0
* Added support for a new consistency level called ConsistentPrefix.
* Fixed a bug in reading collection in session mode.

### <a name="1.10.0"></a>1.10.0
* Enabled support for partitioned collection with as low as 2,500 RU/sec and scale in increments of 100 RU/sec.
* Fixed a bug in the native assembly which can cause NullRef exception in some queries.

### <a name="1.9.6"></a>1.9.6
* Fixed a bug in the query engine configuration that may cause exceptions for queries in Gateway mode.
* Fixed a few bugs in the session container that may cause an "Owner resource not found" exception for requests immediately after collection creation.

### <a name="1.9.5"></a>1.9.5
* Added support for aggregation queries (COUNT, MIN, MAX, SUM, and AVG).
* Added support for change feed.
* Added support for collection quota information through RequestOptions.setPopulateQuotaInfo.
* Added support for stored procedure script logging through RequestOptions.setScriptLoggingEnabled.
* Fixed a bug where query in DirectHttps mode may stop responding when encountering throttle failures.
* Fixed a bug in session consistency mode.
* Fixed a bug which may cause NullReferenceException in HttpContext when request rate is high.
* Improved performance of DirectHttps mode.

### <a name="1.9.4"></a>1.9.4
* Added simple client instance-based proxy support with ConnectionPolicy.setProxy() API.
* Added DocumentClient.close() API to properly shutdown DocumentClient instance.
* Improved query performance in direct connectivity mode by deriving the query plan from the native assembly instead of the Gateway.
* Set FAIL_ON_UNKNOWN_PROPERTIES = false so users don't need to define JsonIgnoreProperties in their POJO.
* Refactored logging to use SLF4J.
* Fixed a few other bugs in consistency reader.

### <a name="1.9.3"></a>1.9.3
* Fixed a bug in the connection management to prevent connection leaks in direct connectivity mode.
* Fixed a bug in the TOP query where it may throw NullReference exception.
* Improved performance by reducing the number of network call for the internal caches.
* Added status code, ActivityID and Request URI in DocumentClientException for better troubleshooting.

### <a name="1.9.2"></a>1.9.2
* Fixed an issue in the connection management for stability.

### <a name="1.9.1"></a>1.9.1
* Added support for BoundedStaleness consistency level.
* Added support for direct connectivity for CRUD operations for partitioned collections.
* Fixed a bug in querying a database with SQL.
* Fixed a bug in the session cache where session token may be set incorrectly.

### <a name="1.9.0"></a>1.9.0
* Added support for cross partition parallel queries.
* Added support for TOP/ORDER BY queries for partitioned collections.
* Added support for strong consistency.
* Added support for name based requests when using direct connectivity.
* Fixed to make ActivityId stay consistent across all request retries.
* Fixed a bug related to the session cache when recreating a collection with the same name.
* Added Polygon and LineString DataTypes while specifying collection indexing policy for geo-fencing spatial queries.
* Fixed issues with Java Doc for Java 1.8.

### <a name="1.8.1"></a>1.8.1
* Fixed a bug in PartitionKeyDefinitionMap to cache single partition collections and not make extra fetch partition key requests.
* Fixed a bug to not retry when an incorrect partition key value is provided.

### <a name="1.8.0"></a>1.8.0
* Added the support for multi-region database accounts.
* Added support for automatic retry on throttled requests with options to customize the max retry attempts and max retry wait time.  See RetryOptions and ConnectionPolicy.getRetryOptions().
* Deprecated IPartitionResolver based custom partitioning code. Please use partitioned collections for higher storage and throughput.

### <a name="1.7.1"></a>1.7.1
* Added retry policy support for rate limiting.  

### <a name="1.7.0"></a>1.7.0
* Added time to live (TTL) support for documents.

### <a name="1.6.0"></a>1.6.0
* Implemented [partitioned collections](../partitioning-overview.md) and [user-defined performance levels](../performance-levels.md).

### <a name="1.5.1"></a>1.5.1
* Fixed a bug in HashPartitionResolver to generate hash values in little-endian to be consistent with other SDKs.

### <a name="1.5.0"></a>1.5.0
* Add Hash & Range partition resolvers to assist with sharding applications across multiple partitions.

### <a name="1.4.0"></a>1.4.0
* Implement Upsert. New upsertXXX methods added to support Upsert feature.
* Implement ID Based Routing. No public API changes, all changes internal.

### <a name="1.3.0"></a>1.3.0
* Release skipped to bring version number in alignment with other SDKs

### <a name="1.2.0"></a>1.2.0
* Supports GeoSpatial Index
* Validates ID property for all resources. Ids for resources cannot contain ?, /, #, \, characters or end with a space.
* Adds new header "index transformation progress" to ResourceResponse.

### <a name="1.1.0"></a>1.1.0
* Implements V2 indexing policy

### <a name="1.0.0"></a>1.0.0
* GA SDK

## Release and retirement dates

Microsoft will provide notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version. New features and functionality and optimizations are only added to the current SDK, as such it is  recommend that you always upgrade to the latest SDK version as early as possible.

> [!WARNING]
> After 30 May 2020, Azure Cosmos DB will no longer make bug fixes, add new features, and provide support to versions 1.x of the Azure Cosmos DB Java SDK for API for NoSQL. If you prefer not to upgrade, requests sent from version 1.x of the SDK will continue to be served by the Azure Cosmos DB service.
>
> After 29 February 2016, Azure Cosmos DB will no longer make bug fixes, add new features, and provide support to versions 0.x of the Azure Cosmos DB Java SDK for API for NoSQL. If you prefer not to upgrade, requests sent from version 0.x of the SDK will continue to be served by the Azure Cosmos DB service.


| Version | Release Date | Retirement Date |
| --- | --- | --- |
| [2.6.1](#2.6.1) |Dec 17, 2020 |Feb 29, 2024|
| [2.6.0](#2.6.0) |July 16, 2020 |Feb 29, 2024|
| [2.5.1](#2.5.1) |June 03, 2020 |Feb 29, 2024|
| [2.5.0](#2.5.0) |May 12, 2020 |Feb 29, 2024|
| [2.4.7](#2.4.7) |Feb 20, 2020 |Feb 29, 2024|
| [2.4.6](#2.4.6) |Jan 24, 2020 |Feb 29, 2024|
| [2.4.5](#2.4.5) |Nov 10, 2019 |Feb 29, 2024|
| [2.4.4](#2.4.4) |Oct 24, 2019 |Feb 29, 2024|
| [2.4.2](#2.4.2) |Sep 26, 2019 |Feb 29, 2024|
| [2.4.1](#2.4.1) |Jul 18, 2019 |Feb 29, 2024|
| [2.4.0](#2.4.0) |May 04, 2019 |Feb 29, 2024|
| [2.3.0](#2.3.0) |Apr 24, 2019 |Feb 29, 2024|
| [2.2.3](#2.2.3) |Apr 16, 2019 |Feb 29, 2024|
| [2.2.2](#2.2.2) |Apr 05, 2019 |Feb 29, 2024|
| [2.2.0](#2.2.0) |Mar 27, 2019 |Feb 29, 2024|
| [2.1.3](#2.1.3) |Mar 13, 2019 |Feb 29, 2024|
| [2.1.2](#2.1.2) |Mar 09, 2019 |Feb 29, 2024|
| [2.1.1](#2.1.1) |Dec 13, 2018 |Feb 29, 2024|
| [2.1.0](#2.1.0) |Nov 20, 2018 |Feb 29, 2024|
| [2.0.0](#2.0.0) |Sept 21, 2018 |Feb 29, 2024|
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
[!INCLUDE [cosmos-db-sdk-faq](../includes/cosmos-db-sdk-faq.md)]

## See also
To learn more about Azure Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page.
