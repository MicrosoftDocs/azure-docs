---
title: Azure Cosmos DB Python API, SDK & Resources | Microsoft Docs
description: Learn all about the Python API and SDK including release dates, retirement dates, and changes made between each version of the DocumentDB Python SDK.
services: cosmos-db
documentationcenter: python
author: rnagpal
manager: jhubbard
editor: cgronlun

ms.assetid: 3ac344a9-b2fa-4a3f-a4cc-02d287e05469
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: python
ms.topic: article
ms.date: 05/24/2017
ms.author: rnagpal
ms.custom: H1Hack27Feb2017

---
# DocumentDB Python SDK: Release notes and resources
> [!div class="op_single_selector"]
> * [.NET](documentdb-sdk-dotnet.md)
> * [.NET Core](documentdb-sdk-dotnet-core.md)
> * [Node.js](documentdb-sdk-node.md)
> * [Java](documentdb-sdk-java.md)
> * [Python](documentdb-sdk-python.md)
> * [REST](https://docs.microsoft.com/rest/api/documentdb/)
> * [REST Resource Provider](https://docs.microsoft.com/rest/api/documentdbresourceprovider/)
> * [SQL](https://msdn.microsoft.com/library/azure/dn782250.aspx)
> 
> 

<table>

<tr><td>**Download SDK**</td><td>[PyPI](https://pypi.python.org/pypi/pydocumentdb)</td></tr>

<tr><td>**API documentation**</td><td>[Python API reference documentation](http://azure.github.io/azure-documentdb-python/api/pydocumentdb.html)</td></tr>

<tr><td>**SDK installation instructions**</td><td>[Python SDK installation instructions](http://azure.github.io/azure-documentdb-python/)</td></tr>

<tr><td>**Contribute to SDK**</td><td>[GitHub](https://github.com/Azure/azure-documentdb-python)</td></tr>

<tr><td>**Get started**</td><td>[Get started with the Python SDK](documentdb-python-application.md)</td></tr>

<tr><td>**Current supported platform**</td><td>[Python 2.7](https://www.python.org/downloads/) and [Python 3.5](https://www.python.org/downloads/)</td></tr>
</table></br>

## Release notes
### <a name="2.2.0"/>2.2.0
* Added support for Request Unit per Minute (RU/m) feature.
* Added support for a new consistency level called ConsistentPrefix.


### <a name="2.1.0"/>2.1.0
* Added support for aggregation queries (COUNT, MIN, MAX, SUM, and AVG).
* Added an option for disabling SSL verification when running against DocumentDB Emulator.
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
* Added retry policy support for throttled requests. (Throttled requests receive a request rate too large exception, error code 429.) By default, DocumentDB retries nine times for each request when error code 429 is encountered, honoring the retryAfter time in the response header. A fixed retry interval time can now be set as part of the RetryOptions property on the ConnectionPolicy object if you want to ignore the retryAfter time returned by server between the retries. DocumentDB now waits for a maximum of 30 seconds for each request that is being throttled (irrespective of retry count) and returns the response with error code 429. This time can also be overriden in the RetryOptions property on ConnectionPolicy object.
* Cosmos DB now returns x-ms-throttle-retry-count and x-ms-throttle-retry-wait-time-ms as the response headers in every request to denote the throttle retry count and the cummulative time the request waited between the retries.
* Removed the RetryPolicy class and the corresponding property (retry_policy) exposed on the document_client class and instead introduced a RetryOptions class exposing the RetryOptions property on ConnectionPolicy class that can be used to override some of the default retry options.

### <a name="1.8.0"/>1.8.0
* Added the support for multi-region database accounts.

### <a name="1.7.0"/>1.7.0
* Added the support for Time To Live(TTL) feature for documents.

### <a name="1.6.1"/>1.6.1
* Bug fixes related to server side partitioning to allow special characters in partitionkey path.

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
Microsoft will provide notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version.

New features and functionality and optimizations are only added to the current SDK, as such it is  recommend that you always upgrade to the latest SDK version as early as possible. 

Any request to Cosmos DB using a retired SDK will be rejected by the service.

> [!WARNING]
> All versions of the Azure DocumentDB SDK for Python prior to version **1.0.0** will be retired on **February 29, 2016**. 
> 
> 

<br/>

| Version | Release Date | Retirement Date |
| --- | --- | --- |
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

