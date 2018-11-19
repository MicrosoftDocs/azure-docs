---
title: 'Azure Cosmos DB: SQL Python API, SDK & resources | Microsoft Docs'
description: Learn all about the SQL Python API and SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB Python SDK.
services: cosmos-db
author: rnagpal
manager: kfile
editor: cgronlun

ms.service: cosmos-db
ms.component: cosmosdb-sql
ms.devlang: python
ms.topic: reference
ms.date: 9/24/2018
ms.author: rnagpal
ms.custom: H1Hack27Feb2017

---
# Azure Cosmos DB Python SDK for SQL API: Release notes and resources
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

<table>

<tr><td>**Download SDK**</td><td>[PyPI](https://pypi.org/project/azure-cosmos)</td></tr>

<tr><td>**API documentation**</td><td>[Python API reference documentation](https://docs.microsoft.com/python/api/overview/azure/cosmosdb?view=azure-python)</td></tr>

<tr><td>**SDK installation instructions**</td><td>[Python SDK installation instructions](https://github.com/Azure/azure-cosmos-python)</td></tr>

<tr><td>**Contribute to SDK**</td><td>[GitHub](https://github.com/Azure/azure-cosmos-python)</td></tr>

<tr><td>**Get started**</td><td>[Get started with the Python SDK](sql-api-python-application.md)</td></tr>

<tr><td>**Current supported platform**</td><td>[Python 2.7](https://www.python.org/downloads/) and [Python 3.5](https://www.python.org/downloads/)</td></tr>
</table></br>

## Release notes

### <a name="3.0.0"/>3.0.0
* Support for multi-region writes.
* Namespace changed to azure.cosmos.
* Collection and document concepts renamed to container and item, document_client renamed to cosmos_client. 

### <a name="2.3.2"/>2.3.2
* Added support for default retries on connection issues.

### <a name="2.3.1"/>2.3.1
* Updated documentation to reference Azure Cosmos DB instead of Azure DocumentDB.

### <a name="2.3.0"/>2.3.0
* This SDK version requires the latest version of Azure Cosmos DB Emulator available for download from https://aka.ms/cosmosdb-emulator.

### <a name="2.2.1"/>2.2.1
* Bug fix for aggregate dictionary.
* Bug fix for trimming slashes in the resource link.
* Added tests for Unicode encoding.

### <a name="2.2.0"/>2.2.0
* Added support for a new consistency level called ConsistentPrefix.


### <a name="2.1.0"/>2.1.0
* Added support for aggregation queries (COUNT, MIN, MAX, SUM, and AVG).
* Added an option for disabling SSL verification when running against Cosmos DB Emulator.
* Removed the restriction of dependent requests module to be exactly 2.10.0.
* Lowered minimum throughput on partitioned collections from 10,100 RU/s to 2500 RU/s.
* Added support for enabling script logging during stored procedure execution.
* REST API version bumped to '2017-01-19' with this release.

### <a name="2.0.1"/>2.0.1
* Made editorial changes to documentation comments.

### <a name="2.0.0"/>2.0.0
* Added support for Python 3.5.
* Added support for connection pooling using a requests module.
* Added support for session consistency.
* Added support for TOP/ORDERBY queries for partitioned collections.

### <a name="1.9.0"/>1.9.0
* Added retry policy support for throttled requests. (Throttled requests receive a request rate too large exception, error code 429.) By default, Azure Cosmos DB retries nine times for each request when error code 429 is encountered, honoring the retryAfter time in the response header. A fixed retry interval time can now be set as part of the RetryOptions property on the ConnectionPolicy object if you want to ignore the retryAfter time returned by server between the retries. Azure Cosmos DB now waits for a maximum of 30 seconds for each request that is being throttled (irrespective of retry count) and returns the response with error code 429. This time can also be overridden in the RetryOptions property on ConnectionPolicy object.
* Cosmos DB now returns x-ms-throttle-retry-count and x-ms-throttle-retry-wait-time-ms as the response headers in every request to denote the throttle retry count and the cumulative time the request waited between the retries.
* Removed the RetryPolicy class and the corresponding property (retry_policy) exposed on the document_client class and instead introduced a RetryOptions class exposing the RetryOptions property on ConnectionPolicy class that can be used to override some of the default retry options.

### <a name="1.8.0"/>1.8.0
* Added the support for multi-region database accounts.

### <a name="1.7.0"/>1.7.0
* Added the support for Time To Live(TTL) feature for documents.

### <a name="1.6.1"/>1.6.1
* Bug fixes related to server-side partitioning to allow special characters in partition key path.

### <a name="1.6.0"/>1.6.0
* Implemented [partitioned collections](partition-data.md) and [user-defined performance levels](performance-levels.md). 

### <a name="1.5.0"/>1.5.0
* Add Hash & Range partition resolvers to assist with sharding applications across multiple partitions.

### <a name="1.4.2"/>1.4.2
* Implement Upsert. New UpsertXXX methods added to support Upsert feature.
* Implement ID Based Routing. No public API changes, all changes internal.

### <a name="1.2.0"/>1.2.0
* Supports GeoSpatial index.
* Validates id property for all resources. Ids for resources cannot contain ?, /, #, \, characters or end with a space.
* Adds new header "index transformation progress" to ResourceResponse.

### <a name="1.1.0"/>1.1.0
* Implements V2 indexing policy.

### <a name="1.0.1"/>1.0.1
* Supports proxy connection.

### <a name="1.0.0"/>1.0.0
* GA SDK.

## Release & retirement dates
Microsoft provides notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version.

New features and functionality and optimizations are only added to the current SDK, as such it is recommend that you always upgrade to the latest SDK version as early as possible. 

Any request to Cosmos DB using a retired SDK are rejected by the service.

> [!WARNING]
> All versions of the Azure SQL SDK for Python prior to version **1.0.0** were retired on **February 29, 2016**. 
> 
> 

<br/>

| Version | Release Date | Retirement Date |
| --- | --- | --- |
| [2.3.2](#2.3.2) |May 08, 2018 |--- |
| [2.3.1](#2.3.1) |December 21, 2017 |--- |
| [2.3.0](#2.3.0) |November 10, 2017 |--- |
| [2.2.1](#2.2.1) |Sep 29, 2017 |--- |
| [2.2.0](#2.2.0) |May 10, 2017 |--- |
| [2.1.0](#2.1.0) |May 01, 2017 |--- |
| [2.0.1](#2.0.1) |October 30, 2016 |--- |
| [2.0.0](#2.0.0) |September 29, 2016 |--- |
| [1.9.0](#1.9.0) |July 07, 2016 |--- |
| [1.8.0](#1.8.0) |June 14, 2016 |--- |
| [1.7.0](#1.7.0) |April 26, 2016 |--- |
| [1.6.1](#1.6.1) |April 08, 2016 |--- |
| [1.6.0](#1.6.0) |March 29, 2016 |--- |
| [1.5.0](#1.5.0) |January 03, 2016 |--- |
| [1.4.2](#1.4.2) |October 06, 2015 |--- |
| [1.4.1](#1.4.1) |October 06, 2015 |--- |
| [1.2.0](#1.2.0) |August 06, 2015 |--- |
| [1.1.0](#1.1.0) |July 09, 2015 |--- |
| [1.0.1](#1.0.1) |May 25, 2015 |--- |
| [1.0.0](#1.0.0) |April 07, 2015 |--- |
| 0.9.4-prelease |January 14, 2015 |February 29, 2016 |
| 0.9.3-prelease |December 09, 2014 |February 29, 2016 |
| 0.9.2-prelease |November 25, 2014 |February 29, 2016 |
| 0.9.1-prelease |September 23, 2014 |February 29, 2016 |
| 0.9.0-prelease |August 21, 2014 |February 29, 2016 |

## FAQ
[!INCLUDE [cosmos-db-sdk-faq](../../includes/cosmos-db-sdk-faq.md)]

## See also
To learn more about Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page. 

