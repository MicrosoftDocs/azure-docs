---
title: Azure DocumentDB Java API, SDK & Resources | Microsoft Docs
description: Learn all about the Java API and SDK including release dates, retirement dates, and changes made between each version of the DocumentDB Java SDK.
services: documentdb
documentationcenter: java
author: rnagpal
manager: jhubbard
editor: cgronlun

ms.assetid: 7861cadf-2a05-471a-9925-0fec0599351b
ms.service: documentdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: java
ms.topic: article
ms.date: 03/16/2017
ms.author: khdang
ms.custom: H1Hack27Feb2017

---
# DocumentDB Java SDK: Release notes and resources
> [!div class="op_single_selector"]
> * [.NET](documentdb-sdk-dotnet.md)
> * [.NET Core](documentdb-sdk-dotnet-core.md)
> * [Node.js](documentdb-sdk-node.md)
> * [Java](documentdb-sdk-java.md)
> * [Python](documentdb-sdk-python.md)
> * [REST](https://docs.microsoft.com/en-us/rest/api/documentdb/)
> * [REST Resource Provider](https://docs.microsoft.com/rest/api/documentdbresourceprovider/)
> * [SQL](https://msdn.microsoft.com/library/azure/dn782250.aspx)
> 
> 

<table>

<tr><td>**SDK Download**</td><td>[Maven](http://search.maven.org/#search%7Cgav%7C1%7Cg%3A%22com.microsoft.azure%22%20AND%20a%3A%22azure-documentdb%22)</td></tr>

<tr><td>**API documentation**</td><td>[Java API reference documentation](http://azure.github.io/azure-documentdb-java/)</td></tr>

<tr><td>**Contribute to SDK**</td><td>[GitHub](https://github.com/Azure/azure-documentdb-java/)</td></tr>

<tr><td>**Get started**</td><td>[Get started with the Java SDK](documentdb-java-get-started.md)</td></tr>

<tr><td>**Web app tutorial**</td><td>[Web application development with DocumentDB](documentdb-java-application.md)</td></tr>

<tr><td>**Current supported runtime**</td><td>[JDK 7](http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html)</td></tr>
</table></br>

## Release Notes

### <a name="1.10.0"/>1.10.0
* Enabled support for partitioned collection with as low as 2,500 RU/sec and scale in increments of 100 RU/sec.
* Fixed a bug in the native assembly which can cause NullRef exception in some queries.

### <a name="1.9.6"/>1.9.6
* Fixed a bug in the query engine configuration that may cause exceptions for queries in Gateway mode.
* Fixed a few bugs in the session container that may cause an "Owner resource not found" exception for requests immediately after collection creation.

### <a name="1.9.5"/>1.9.5
* Added support for aggregation queries (COUNT, MIN, MAX, SUM, and AVG). See [Aggregation support](documentdb-sql-query.md#Aggregates).
* Added support for change feed.
* Added support for collection quota information through RequestOptions.setPopulateQuotaInfo.
* Added support for stored procedure script logging through RequestOptions.setScriptLoggingEnabled.
* Fixed a bug where query in DirectHttps mode may hang when encountering throttle failures.
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
* Fixed a bug in the TOP query where it may throw NullReferenece exception.
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
* Added retry policy support for throttling.  

### <a name="1.7.0"/>1.7.0
* Added time to live (TTL) support for documents.

### <a name="1.6.0"/>1.6.0
* Implemented [partitioned collections](documentdb-partition-data.md) and [user-defined performance levels](documentdb-performance-levels.md).

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
* Validates id property for all resources. Ids for resources cannot contain ?, /, #, \, characters or end with a space.
* Adds new header "index transformation progress" to ResourceResponse.

### <a name="1.1.0"/>1.1.0
* Implements V2 indexing policy

### <a name="1.0.0"/>1.0.0
* GA SDK

## Release & Retirement Dates
Microsoft will provide notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version.

New features and functionality and optimizations are only added to the current SDK, as such it is  recommend that you always upgrade to the latest SDK version as early as possible.

Any request to DocumentDB using a retired SDK will be rejected by the service.

> [!WARNING]
> All versions of the Azure DocumentDB SDK for Java prior to version **1.0.0** will be retired on **February 29, 2016**.
> 
> 

<br/>

| Version | Release Date | Retirement Date |
| --- | --- | --- |
| [1.10.0](#1.10.0) |March 11, 2017 |--- |
| [1.9.6](#1.9.6) |February 21, 2017 |--- |
| [1.9.5](#1.9.5) |January 31, 2017 |--- |
| [1.9.4](#1.9.4) |November 24, 2016 |--- |
| [1.9.3](#1.9.3) |October 30, 2016 |--- |
| [1.9.2](#1.9.2) |October 28, 2016 |--- |
| [1.9.1](#1.9.1) |October 26, 2016 |--- |
| [1.9.0](#1.9.0) |October 03, 2016 |--- |
| [1.8.1](#1.8.1) |June 30, 2016 |--- |
| [1.8.0](#1.8.0) |June 14, 2016 |--- |
| [1.7.1](#1.7.1) |April 30, 2016 |--- |
| [1.7.0](#1.7.0) |April 27, 2016 |--- |
| [1.6.0](#1.6.0) |March 29, 2016 |--- |
| [1.5.1](#1.5.1) |December 31, 2015 |--- |
| [1.5.0](#1.5.0) |December 04, 2015 |--- |
| [1.4.0](#1.4.0) |October 05, 2015 |--- |
| [1.3.0](#1.3.0) |October 05, 2015 |--- |
| [1.2.0](#1.2.0) |August 05, 2015 |--- |
| [1.1.0](#1.1.0) |July 09, 2015 |--- |
| [1.0.1](#1.0.1) |May 12, 2015 |--- |
| [1.0.0](#1.0.0) |April 07, 2015 |--- |
| 0.9.5-prelease |Mar 09, 2015 |February 29, 2016 |
| 0.9.4-prelease |February 17, 2015 |February 29, 2016 |
| 0.9.3-prelease |January 13, 2015 |February 29, 2016 |
| 0.9.2-prelease |December 19, 2014 |February 29, 2016 |
| 0.9.1-prelease |December 19, 2014 |February 29, 2016 |
| 0.9.0-prelease |December 10, 2014 |February 29, 2016 |

## FAQ
[!INCLUDE [documentdb-sdk-faq](../../includes/documentdb-sdk-faq.md)]

## See Also
To learn more about DocumentDB, see [Microsoft Azure DocumentDB](https://azure.microsoft.com/services/documentdb/) service page.

