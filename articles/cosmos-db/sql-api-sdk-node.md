---
title: 'Azure Cosmos DB: SQL Node.js API, SDK & resources | Microsoft Docs'
description: Learn all about the SQL Node.js API and SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB Node.js SDK.
services: cosmos-db
author: deborahc
editor: cgronlun

ms.service: cosmos-db
ms.component: cosmosdb-sql
ms.devlang: nodejs
ms.topic: reference
ms.date: 09/24/2018
ms.author: rnagpal
ms.custom: H1Hack27Feb2017

---
# Azure Cosmos DB Node.js SDK for SQL API: Release notes and resources
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

|Resource  |Link  |
|---------|---------|
|Download SDK  |   [NPM](https://www.npmjs.com/package/@azure/cosmos) 
|API Documentation  |  [JavaScript SDK reference documentation](https://docs.microsoft.com/javascript/api/%40azure/cosmos/?view=azure-node-latest)
|SDK installation instructions  |  [Installation instructions](https://github.com/Azure/azure-cosmos-js#installation)
|Contribute to SDK | [GitHub](https://github.com/Azure/azure-cosmos-js/tree/master)
| Samples | [Node.js code samples](sql-api-nodejs-samples.md)
| Getting started tutorial | [Get started with the JavaScript SDK](sql-api-nodejs-get-started.md)
| Web app tutorial | [Build a Node.js web application using Azure Cosmos DB](sql-api-nodejs-application.md)
| Current supported platform | [Node.js v6.x](https://nodejs.org/en/blog/release/v6.10.3/) - required for SDK Version 2.0.0 and above.<br/>[Node.js v4.2.0](https://nodejs.org/en/blog/release/v4.2.0/)<br/> [Node.js v0.12](https://nodejs.org/en/blog/release/v0.12.0/)<br/> [Node.js v0.10](https://nodejs.org/en/blog/release/v0.10.0/) 

## Release notes

### <a name="2.0.0"/>2.0.0</a>
* GA of Version 2.0.0 of the JavaScript SDK
* Added support for multi-region writes.

### <a name="2.0.0-3"/>2.0.0-3</a>
* RC1 of Version 2.0.0 of the JavaScript SDK for public preview.
* New object model, with top-level CosmosClient and methods split across relevant Database, Container, and Item classes. 
* Support for [promises](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Using_promises). 
* SDK converted to TypeScript.

### <a name="1.14.4"/>1.14.4</a>
* npm documentation fixed.

### <a name="1.14.3"/>1.14.3</a>
* Added support for default retries on connection issues.
* Added support to read collection change feed.
* Fixed session consistency bug that intermittently caused "read session not available".
* Added support for query metrics.
* Modified http Agent's maximum number of connections.

### <a name="1.14.2"/>1.14.2</a>
* Updated documentation to reference Azure Cosmos DB instead of Azure DocumentDB.
* Added Support for proxyUrl setting in ConnectionPolicy.

### <a name="1.14.1"/>1.14.1</a>
* Minor fix for case sensitive file systems.

### <a name="1.14.0"/>1.14.0</a>
* Adds support for Session Consistency.
* This SDK version requires the latest version of Azure Cosmos DB Emulator available for download from https://aka.ms/cosmosdb-emulator.

### <a name="1.13.0"/>1.13.0</a>
* Split proofed cross partition queries.
* Adds supports for resource link with leading and trailing slashes (and corresponding tests).

### <a name="1.12.2"/>1.12.2</a>
*	npm documentation fixed.

### <a name="1.12.1"/>1.12.1</a>
* Fixed a bug in executeStoredProcedure where documents involved had special Unicode characters (LS, PS).
* Fixed a bug in handling documents with Unicode characters in the partition key.
* Fixed support for creating collections with the name media. Github issue #114.
* Fixed support for permission authorization token. Github issue #178.

### <a name="1.12.0"/>1.12.0</a>
* Added support for a new [consistency level](consistency-levels.md) called ConsistentPrefix.
* Added support for UriFactory.
* Fixed a Unicode support bug. GitHub issue #171.

### <a name="1.11.0"/>1.11.0</a>
* Added the support for aggregation queries (COUNT, MIN, MAX, SUM, and AVG).
* Added the option for controlling degree of parallelism for cross partition queries.
* Added the option for disabling SSL verification when running against Azure Cosmos DB Emulator.
* Lowered minimum throughput on partitioned collections from 10,100 RU/s to 2500 RU/s.
* Fixed the continuation token bug for single partition collection. Github issue #107.
* Fixed the executeStoredProcedure bug in handling 0 as single param. Github issue #155.

### <a name="1.10.2"/>1.10.2</a>
* Fixed user-agent header to include the SDK version.
* Minor code cleanup.

### <a name="1.10.1"/>1.10.1</a>
* Disabling SSL verification when using the SDK to target the emulator(hostname=localhost).
* Added support for enabling script logging during stored procedure execution.

### <a name="1.10.0"/>1.10.0</a>
* Added support for cross partition parallel queries.
* Added support for TOP/ORDER BY queries for partitioned collections.

### <a name="1.9.0"/>1.9.0</a>
* Added retry policy support for throttled requests. (Throttled requests receive a request rate too large exception, error code 429.) By default, Azure Cosmos DB retries nine times for each request when error code 429 is encountered, honoring the retryAfter time in the response header. A fixed retry interval time can now be set as part of the RetryOptions property on the ConnectionPolicy object if you want to ignore the retryAfter time returned by server between the retries. Azure Cosmos DB now waits for a maximum of 30 seconds for each request that is being throttled (irrespective of retry count) and returns the response with error code 429. This time can also be overridden in the RetryOptions property on ConnectionPolicy object.
* Cosmos DB now returns x-ms-throttle-retry-count and x-ms-throttle-retry-wait-time-ms as the response headers in every request to denote the throttle retry count and the cumulative time the request waited between the retries.
* The RetryOptions class was added, exposing the RetryOptions property on the ConnectionPolicy class that can be used to override some of the default retry options.

### <a name="1.8.0"/>1.8.0</a>
* Added the support for multi-region database accounts.

### <a name="1.7.0"/>1.7.0</a>
* Added the support for Time To Live(TTL) feature for documents.

### <a name="1.6.0"/>1.6.0</a>
* Implemented [partitioned collections](partition-data.md) and [user-defined performance levels](performance-levels.md).

### <a name="1.5.6"/>1.5.6</a>
* Fixed RangePartitionResolver.resolveForRead bug where it was not returning links due to a bad concat of results.

### <a name="1.5.5"/>1.5.5</a>
* Fixed hashParitionResolver resolveForRead(): When no partition key supplied was throwing exception, instead of returning a list of all registered links.

### <a name="1.5.4"/>1.5.4</a>
* Fixes issue [#100](https://github.com/Azure/azure-documentdb-node/issues/100) - Dedicated HTTPS Agent: Avoid modifying the global agent for Azure Cosmos DB purposes. Use a dedicated agent for all of the lib’s requests.

### <a name="1.5.3"/>1.5.3</a>
* Fixes issue [#81](https://github.com/Azure/azure-documentdb-node/issues/81) - Properly handle dashes in media ids.

### <a name="1.5.2"/>1.5.2</a>
* Fixes issue [#95](https://github.com/Azure/azure-documentdb-node/issues/95) - EventEmitter listener leak warning.

### <a name="1.5.1"/>1.5.1</a>
* Fixes issue [#92](https://github.com/Azure/azure-documentdb-node/issues/90) - rename folder Hash to hash for case-sensitive systems.

### <a name="1.5.0"/>1.5.0</a>
* Implement sharding support by adding hash & range partition resolvers.

### <a name="1.4.0"/>1.4.0</a>
* Implement Upsert. New upsertXXX methods on documentClient.

### <a name="1.3.0"/>1.3.0</a>
* Skipped to bring version numbers in alignment with other SDKs.

### <a name="1.2.2"/>1.2.2</a>
* Split Q promises wrapper to new repository.
* Update to package file for npm registry.

### <a name="1.2.1"/>1.2.1</a>
* Implements ID Based Routing.
* Fixes Issue [#49](https://github.com/Azure/azure-documentdb-node/issues/49) - current property conflicts with method current().

### <a name="1.2.0"/>1.2.0</a>
* Added support for GeoSpatial index.
* Validates id property for all resources. Ids for resources cannot contain ?, /, #, &#47;&#47;, characters or end with a space.
* Adds new header "index transformation progress" to ResourceResponse.

### <a name="1.1.0"/>1.1.0</a>
* Implements V2 indexing policy.

### <a name="1.0.3"/>1.0.3</a>
* Issue [#40](https://github.com/Azure/azure-documentdb-node/issues/40) - Implemented eslint and grunt configurations in the core and promise SDK.

### <a name="1.0.2"/>1.0.2</a>
* Issue [#45](https://github.com/Azure/azure-documentdb-node/issues/45) - Promises wrapper does not include header with error.

### <a name="1.0.1"/>1.0.1</a>
* Implemented ability to query for conflicts by adding readConflicts, readConflictAsync, and queryConflicts.
* Updated API documentation.
* Issue [#41](https://github.com/Azure/azure-documentdb-node/issues/41) - client.createDocumentAsync error.

### <a name="1.0.0"/>1.0.0</a>
* GA SDK.

## Release & Retirement Dates
Microsoft provides notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version.

New features and functionality and optimizations are only added to the current SDK, as such it is  recommended that you always upgrade to the latest SDK version as early as possible.

Any request to Cosmos DB using a retired SDK is be rejected by the service.

<br/>

| Version | Release Date | Retirement Date |
| --- | --- | --- |
| [2.0.0-3 (RC)](#2.0.0-3) |August 2, 2018 |--- |
| [1.14.4](#1.14.4) |May 03, 2018 |--- |
| [1.14.3](#1.14.3) |May 03, 2018 |--- |
| [1.14.2](#1.14.2) |December 21, 2017 |--- |
| [1.14.1](#1.14.1) |November 10, 2017 |--- |
| [1.14.0](#1.14.0) |November 9, 2017 |--- |
| [1.13.0](#1.13.0) |October 11, 2017 |--- |
| [1.12.2](#1.12.2) |August 10, 2017 |--- |
| [1.12.1](#1.12.1) |August 10, 2017 |--- |
| [1.12.0](#1.12.0) |May 10, 2017 |--- |
| [1.11.0](#1.11.0) |March 16, 2017 |--- |
| [1.10.2](#1.10.2) |January 27, 2017 |--- |
| [1.10.1](#1.10.1) |December 22, 2016 |--- |
| [1.10.0](#1.10.0) |October 03, 2016 |--- |
| [1.9.0](#1.9.0) |July 07, 2016 |--- |
| [1.8.0](#1.8.0) |June 14, 2016 |--- |
| [1.7.0](#1.7.0) |April 26, 2016 |--- |
| [1.6.0](#1.6.0) |March 29, 2016 |--- |
| [1.5.6](#1.5.6) |March 08, 2016 |--- |
| [1.5.5](#1.5.5) |February 02, 2016 |--- |
| [1.5.4](#1.5.4) |February 01, 2016 |--- |
| [1.5.2](#1.5.2) |January 26, 2016 |--- |
| [1.5.2](#1.5.2) |January 22, 2016 |--- |
| [1.5.1](#1.5.1) |January 4, 2016 |--- |
| [1.5.0](#1.5.0) |December 31, 2015 |--- |
| [1.4.0](#1.4.0) |October 06, 2015 |--- |
| [1.3.0](#1.3.0) |October 06, 2015 |--- |
| [1.2.2](#1.2.2) |September 10, 2015 |--- |
| [1.2.1](#1.2.1) |August 15, 2015 |--- |
| [1.2.0](#1.2.0) |August 05, 2015 |--- |
| [1.1.0](#1.1.0) |July 09, 2015 |--- |
| [1.0.3](#1.0.3) |June 04, 2015 |--- |
| [1.0.2](#1.0.2) |May 23, 2015 |--- |
| [1.0.1](#1.0.1) |May 15, 2015 |--- |
| [1.0.0](#1.0.0) |April 08, 2015 |--- |

## FAQ
[!INCLUDE [cosmos-db-sdk-faq](../../includes/cosmos-db-sdk-faq.md)]

## See also
To learn more about Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page.

