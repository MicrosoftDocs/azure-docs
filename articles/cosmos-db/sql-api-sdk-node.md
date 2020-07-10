---
title: 'Azure Cosmos DB: SQL Node.js API, SDK & resources'
description: Learn all about the SQL Node.js API and SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB Node.js SDK.
author: anfeldma-ms
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: nodejs
ms.topic: reference
ms.date: 05/11/2020
ms.author: anfeldma


---
# Azure Cosmos DB Node.js SDK for SQL API: Release notes and resources
> [!div class="op_single_selector"]
> * [.NET SDK v3](sql-api-sdk-dotnet-standard.md)
> * [.NET SDK v2](sql-api-sdk-dotnet.md)
> * [.NET Core SDK v2](sql-api-sdk-dotnet-core.md)
> * [.NET Change Feed SDK v2](sql-api-sdk-dotnet-changefeed.md)
> * [Node.js](sql-api-sdk-node.md)
> * [Java SDK v4](sql-api-sdk-java-v4.md)
> * [Async Java SDK v2](sql-api-sdk-async-java.md)
> * [Sync Java SDK v2](sql-api-sdk-java.md)
> * [Python](sql-api-sdk-python.md)
> * [REST](/rest/api/cosmos-db/)
> * [REST Resource Provider](/rest/api/cosmos-db-resource-provider/)
> * [SQL](sql-api-query-reference.md)
> * [Bulk executor - .NET v2](sql-api-sdk-bulk-executor-dot-net.md)
> * [Bulk executor - Java](sql-api-sdk-bulk-executor-java.md)

|Resource  |Link  |
|---------|---------|
|Download SDK  |   [NPM](https://www.npmjs.com/package/@azure/cosmos) 
|API Documentation  |  [JavaScript SDK reference documentation](https://docs.microsoft.com/javascript/api/%40azure/cosmos/?view=azure-node-latest)
|SDK installation instructions  |  [Installation instructions](https://github.com/Azure/azure-cosmos-js#installation)
|Contribute to SDK | [GitHub](https://github.com/Azure/azure-cosmos-js/tree/master)
| Samples | [Node.js code samples](sql-api-nodejs-samples.md)
| Getting started tutorial | [Get started with the JavaScript SDK](sql-api-nodejs-get-started.md)
| Web app tutorial | [Build a Node.js web application using Azure Cosmos DB](sql-api-nodejs-application.md)
| Current supported platform | [Node.js v12.x](https://nodejs.org/en/blog/release/v12.7.0/) - SDK Version 3.x.x<br/>[Node.js v10.x](https://nodejs.org/en/blog/release/v10.6.0/) - SDK Version 3.x.x<br/>[Node.js v8.x](https://nodejs.org/en/blog/release/v8.16.0/) - SDK Version 3.x.x<br/>[Node.js v6.x](https://nodejs.org/en/blog/release/v6.10.3/) - SDK Version 2.x.x<br/>[Node.js v4.2.0](https://nodejs.org/en/blog/release/v4.2.0/)- SDK Version 1.x.x<br/> [Node.js v0.12](https://nodejs.org/en/blog/release/v0.12.0/)- SDK Version 1.x.x<br/> [Node.js v0.10](https://nodejs.org/en/blog/release/v0.10.0/)- SDK Version 1.x.x

## Release notes

### <a name="3.1.0"></a>3.1.0
* Set default ResponseContinuationTokenLimitInKB to 1kb. By default, we are capping this to 1kb to avoid long headers (Node.js has a global header size limit). A user may set this field to allow for longer headers, which can help the backend optimize query execution.
* Remove disableSSLVerification. This option has new alternatives described in [#388](https://github.com/Azure/azure-cosmos-js/pull/388)

### <a name="3.0.4"></a>3.0.4
* Allow initialHeaders to explicitly set partition key header
* Use package.json#files to prevent extraneous files from being published
* Fix routing map sort error on older version of node+v8
* Fixes bug when user supplies partial retry options

### <a name="3.0.3"></a>3.0.3
* Prevent Webpack from resolving modules called with require

### <a name="3.0.2"></a>3.0.2
* Fixes a long outstanding bug where RUs were always being reported as 0 for aggregate queries

### <a name="3.0.0"></a>3.0.0

🎉 v3 release! 🎉 Many new features, bug fixes, and a few breaking changes. Primary goals of this release:

* Implement major new features
  * DISTINCT queries
  * LIMIT/OFFSET queries
  * User cancelable requests
* Update to the latest Cosmos REST API version where all containers have unlimited scale
* Make it easier to use Cosmos from the browser
* Better align with the new Azure JS SDK guidelines

#### Migration guide for breaking changes
##### Improved client Constructor options

Constructor options have been simplified:

* masterKey was renamed key and moved to the top-level
* Properties previously under options.auth have moved to the top-level

``` js
// v2
const client = new CosmosClient({
    endpoint: "https://your-database.cosmos.azure.com",
    auth: {
        masterKey: "your-primary-key"
    }
})

// v3
const client = new CosmosClient({
    endpoint: "https://your-database.cosmos.azure.com",
    key: "your-primary-key"
})
```

##### Simplified QueryIterator API
In v2 there were many different ways to iterate or retrieve results from a query. We have attempted to simplify the v3 API and remove similar or duplicate APIs:

* Remove iterator.next() and iterator.current(). Use fetchNext() to get pages of results.
* Remove iterator.forEach(). Use async iterators instead.
* iterator.executeNext() renamed to iterator.fetchNext()
* iterator.toArray() renamed to iterator.fetchAll()
* Pages are now proper Response objects instead of plain JS objects
* const container = client.database(dbId).container(containerId)

``` js
// v2
container.items.query('SELECT * from c').toArray()
container.items.query('SELECT * from c').executeNext()
container.items.query('SELECT * from c').forEach(({ body: item }) => { console.log(item.id) })

// v3
container.items.query('SELECT * from c').fetchAll()
container.items.query('SELECT * from c').fetchNext()
for await(const { result: item } in client.databases.readAll().getAsyncIterator()) {
    console.log(item.id)
}
```

##### Fixed containers are now partitioned
The Cosmos service now supports partition keys on all containers, including those that were previously created as fixed containers. The v3 SDK updates to the latest API version that implements this change, but it is not breaking. If you do not supply a partition key for operations, we will default to a system key that works with all your existing containers and documents.

##### Upsert removed for stored procedures
Previously upsert was allowed for non-partitioned collections, but with the API version update, all collections are partitioned so we removed it entirely.

##### Item reads will not throw on 404
const container = client.database(dbId).container(containerId)

``` js
// v2
try {
    container.items.read(id, undefined)
} catch (e) {
    if (e.code === 404) { console.log('item not found') }
}

// v3
const { result: item }  = container.items.read(id, undefined)
if (item === undefined) { console.log('item not found') }
```

##### Default multi-region write
The SDK will now write to multiple regions by default if your Cosmos configuration supports it. This was previously opt-in behavior.

##### Proper error objects
Failed requests now throw proper Error or subclasses of Error. Previously they threw plain JS objects.

#### New features
##### User-cancelable requests
The move to fetch internally allows us to use the browser AbortController API to support user-cancelable operations. In the case of operations where multiple requests are potentially in progress (like cross partition queries), all requests for the operation will be canceled. Modern browser users will already have AbortController. Node.js users will need to use a polyfill library

``` js
 const controller = new AbortController()
 const {result: item} = await items.query('SELECT * from c', { abortSignal: controller.signal});
 controller.abort()
```

##### Set throughput as part of db/container create operation
``` js
const { database }  = client.databases.create({ id: 'my-database', throughput: 10000 })
database.containers.create({ id: 'my-container', throughput: 10000 })
```

##### @azure/cosmos-sign
Header token generation was split out into a new library, @azure/cosmos-sign. Anyone calling the Cosmos REST API directly can use this to sign headers using the same code we call inside @azure/cosmos.

##### UUID for generated IDs
v2 had custom code to generate item IDs. We have switched to the well known and maintained community library uuid.

##### Connection strings
It is now possible to pass a connection string copied from the Azure portal:

``` js
const client = new CosmosClient("AccountEndpoint=https://test-account.documents.azure.com:443/;AccountKey=c213asdasdefgdfgrtweaYPpgoeCsHbpRTHhxuMsTaw==;")
Add DISTINCT and LIMIT/OFFSET queries (#306)
 const { results } = await items.query('SELECT DISTINCT VALUE r.name FROM ROOT').fetchAll()
 const { results } = await items.query('SELECT * FROM root r OFFSET 1 LIMIT 2').fetchAll()
```

#### Improved browser experience
While it was possible to use the v2 SDK in the browser it was not an ideal experience. You needed to polyfill several node.js built-in libraries and use a bundler like Webpack or Parcel. The v3 SDK makes the out of the box experience much better for browser users.

* Replace request internals with fetch (#245)
* Remove usage of Buffer (#330)
* Remove node builtin usage in favor of universal packages/APIs (#328)
* Switch to node-abort-controller (#294)

#### Bug fixes
* Fix offer read and bring back offer tests (#224)
* Fix EnableEndpointDiscovery (#207)
* Fix missing RUs on paginated results (#360)
* Expand SQL query parameter type (#346)
* Add ttl to ItemDefinition (#341)
* Fix CP query metrics (#311)
* Add activityId to FeedResponse (#293)
* Switch _ts type from string to number (#252)(#295)
* Fix Request Charge Aggregation (#289)
* Allow blank string partition keys (#277)
* Add string to conflict query type (#237)
* Add uniqueKeyPolicy to container (#234)

#### Engineering systems
Not always the most visible changes, but they help our team ship better code, faster.

* Use rollup for production builds (#104)
* Update to Typescript 3.5 (#327)
* Convert to TS project references. Extract test folder (#270)
* Enable noUnusedLocals and noUnusedParameters (#275)
* Azure Pipelines YAML for CI builds (#298)

### <a name="2.1.5"></a>2.1.5
* No code changes. Fixes an issue where some extra files were included in 2.1.4 package.

### <a name="2.1.4"></a>2.1.4
* Fix regional failover within retry policy
* Fix ChangeFeed hasMoreResults property
* Dev dependency updates
* Add PolicheckExclusions.txt

### <a name="2.1.3"></a>2.1.3
* Switch _ts type from string to number
* Fix default indexing tests
* Backport uniqueKeyPolicy to v2
* Demo and demo debugging fixes

### <a name="2.1.2"></a>2.1.2
* Backport offer fixes from v3 branch
* Fix bug in executeNext() type signature
* Typo fixes

### <a name="2.1.1"></a>2.1.1
* Build restructuring. Allows pulling the SDK version at build time.

### <a name="2.1.0"></a>2.1.0
#### New Features
* Added ChangeFeed support (#196)
* Added MultiPolygon datatype for indexing (#191)
* Add "key" property to constructor as alias for masterKey (#202)

#### Fixes
* Fix bug where next() was returning incorrect value on iterator

#### Engineering Improvements
* Add integration test for typescript consumption (#199)
* Enable installing directly from GitHub (#194)

### <a name="2.0.5"></a>2.0.5
* Adds interface for node Agent type. Typescript users no longer have to install @types/node as a dependency
* Preferred locations are now properly honored
* Improvements to contributing developer documentation
* Various typo fixes

### <a name="2.0.4"></a>2.0.4
* Fixes type definition issue introduced in 2.0.3

### <a name="2.0.3"></a>2.0.3
* Remove `big-integer` dependency
* Switch to reference directives for AsyncIterable type. Typescript users no longer have to customize their "lib" setting.
* Typo Fixes

### <a name="2.0.2"></a>2.0.2
* Fix readme links

### <a name="2.0.1"></a>2.0.1
* Fix retry interface implementation

### <a name="2.0.0"></a>2.0.0
* GA of Version 2.0.0 of the JavaScript SDK
* Added support for multi-region writes.

### <a name="2.0.0-3"></a>2.0.0-3
* RC1 of Version 2.0.0 of the JavaScript SDK for public preview.
* New object model, with top-level CosmosClient and methods split across relevant Database, Container, and Item classes. 
* Support for [promises](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Using_promises). 
* SDK converted to TypeScript.

### <a name="1.14.4"></a>1.14.4
* npm documentation fixed.

### <a name="1.14.3"></a>1.14.3
* Added support for default retries on connection issues.
* Added support to read collection change feed.
* Fixed session consistency bug that intermittently caused "read session not available".
* Added support for query metrics.
* Modified http Agent's maximum number of connections.

### <a name="1.14.2"></a>1.14.2
* Updated documentation to reference Azure Cosmos DB instead of Azure DocumentDB.
* Added Support for proxyUrl setting in ConnectionPolicy.

### <a name="1.14.1"></a>1.14.1
* Minor fix for case sensitive file systems.

### <a name="1.14.0"></a>1.14.0
* Adds support for Session Consistency.
* This SDK version requires the latest version of [Azure Cosmos DB Emulator](https://aka.ms/cosmosdb-emulator).

### <a name="1.13.0"></a>1.13.0
* Split proofed cross partition queries.
* Adds supports for resource link with leading and trailing slashes (and corresponding tests).

### <a name="1.12.2"></a>1.12.2
*    npm documentation fixed.

### <a name="1.12.1"></a>1.12.1
* Fixed a bug in executeStoredProcedure where documents involved had special Unicode characters (LS, PS).
* Fixed a bug in handling documents with Unicode characters in the partition key.
* Fixed support for creating collections with the name media. GitHub issue #114.
* Fixed support for permission authorization token. GitHub issue #178.

### <a name="1.12.0"></a>1.12.0
* Added support for a new [consistency level](consistency-levels.md) called ConsistentPrefix.
* Added support for UriFactory.
* Fixed a Unicode support bug. GitHub issue #171.

### <a name="1.11.0"></a>1.11.0
* Added the support for aggregation queries (COUNT, MIN, MAX, SUM, and AVG).
* Added the option for controlling degree of parallelism for cross partition queries.
* Added the option for disabling TLS verification when running against Azure Cosmos DB Emulator.
* Lowered minimum throughput on partitioned collections from 10,100 RU/s to 2500 RU/s.
* Fixed the continuation token bug for single partition collection. GitHub issue #107.
* Fixed the executeStoredProcedure bug in handling 0 as single param. GitHub issue #155.

### <a name="1.10.2"></a>1.10.2
* Fixed user-agent header to include the SDK version.
* Minor code cleanup.

### <a name="1.10.1"></a>1.10.1
* Disabling TLS verification when using the SDK to target the emulator(hostname=localhost).
* Added support for enabling script logging during stored procedure execution.

### <a name="1.10.0"></a>1.10.0
* Added support for cross partition parallel queries.
* Added support for TOP/ORDER BY queries for partitioned collections.

### <a name="1.9.0"></a>1.9.0
* Added retry policy support for throttled requests. (Throttled requests receive a request rate too large exception, error code 429.) By default, Azure Cosmos DB retries nine times for each request when error code 429 is encountered, honoring the retryAfter time in the response header. A fixed retry interval time can now be set as part of the RetryOptions property on the ConnectionPolicy object if you want to ignore the retryAfter time returned by server between the retries. Azure Cosmos DB now waits for a maximum of 30 seconds for each request that is being throttled (irrespective of retry count) and returns the response with error code 429. This time can also be overridden in the RetryOptions property on ConnectionPolicy object.
* Cosmos DB now returns x-ms-throttle-retry-count and x-ms-throttle-retry-wait-time-ms as the response headers in every request to denote the throttle retry count and the cumulative time the request waited between the retries.
* The RetryOptions class was added, exposing the RetryOptions property on the ConnectionPolicy class that can be used to override some of the default retry options.

### <a name="1.8.0"></a>1.8.0
* Added the support for multi-region database accounts.

### <a name="1.7.0"></a>1.7.0
* Added the support for Time To Live(TTL) feature for documents.

### <a name="1.6.0"></a>1.6.0
* Implemented [partitioned collections](partition-data.md) and [user-defined performance levels](performance-levels.md).

### <a name="1.5.6"></a>1.5.6
* Fixed RangePartitionResolver.resolveForRead bug where it was not returning links due to a bad concat of results.

### <a name="1.5.5"></a>1.5.5
* Fixed hashPartitionResolver resolveForRead(): When no partition key supplied was throwing exception, instead of returning a list of all registered links.

### <a name="1.5.4"></a>1.5.4
* Fixes issue [#100](https://github.com/Azure/azure-documentdb-node/issues/100) - Dedicated HTTPS Agent: Avoid modifying the global agent for Azure Cosmos DB purposes. Use a dedicated agent for all of the lib's requests.

### <a name="1.5.3"></a>1.5.3
* Fixes issue [#81](https://github.com/Azure/azure-documentdb-node/issues/81) - Properly handle dashes in media IDs.

### <a name="1.5.2"></a>1.5.2
* Fixes issue [#95](https://github.com/Azure/azure-documentdb-node/issues/95) - EventEmitter listener leak warning.

### <a name="1.5.1"></a>1.5.1
* Fixes issue [#92](https://github.com/Azure/azure-documentdb-node/issues/90) - rename folder Hash to hash for case-sensitive systems.

### <a name="1.5.0"></a>1.5.0
* Implement sharding support by adding hash & range partition resolvers.

### <a name="1.4.0"></a>1.4.0
* Implement Upsert. New upsertXXX methods on documentClient.

### <a name="1.3.0"></a>1.3.0
* Skipped to bring version numbers in alignment with other SDKs.

### <a name="1.2.2"></a>1.2.2
* Split Q promises wrapper to new repository.
* Update to package file for npm registry.

### <a name="1.2.1"></a>1.2.1
* Implements ID Based Routing.
* Fixes Issue [#49](https://github.com/Azure/azure-documentdb-node/issues/49) - current property conflicts with method current().

### <a name="1.2.0"></a>1.2.0
* Added support for GeoSpatial index.
* Validates ID property for all resources. IDs for resources cannot contain ?, /, #, &#47;&#47;, characters or end with a space.
* Adds new header "index transformation progress" to ResourceResponse.

### <a name="1.1.0"></a>1.1.0
* Implements V2 indexing policy.

### <a name="1.0.3"></a>1.0.3
* Issue [#40](https://github.com/Azure/azure-documentdb-node/issues/40) - Implemented eslint and grunt configurations in the core and promise SDK.

### <a name="1.0.2"></a>1.0.2
* Issue [#45](https://github.com/Azure/azure-documentdb-node/issues/45) - Promises wrapper does not include header with error.

### <a name="1.0.1"></a>1.0.1
* Implemented ability to query for conflicts by adding readConflicts, readConflictAsync, and queryConflicts.
* Updated API documentation.
* Issue [#41](https://github.com/Azure/azure-documentdb-node/issues/41) - client.createDocumentAsync error.

### <a name="1.0.0"></a>1.0.0
* GA SDK.

## Release & Retirement Dates
Microsoft provides notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version.

New features and functionality and optimizations are only added to the current SDK, as such it is recommended that you always upgrade to the latest SDK version as early as possible.

Any request to Cosmos DB using a retired SDK will be rejected by the service.

> [!WARNING]
> All versions **1.x** of the Node client SDK for SQL API will be retired on **August 30, 2020**. This affects only the client-side Node SDK and does not affect server-side scripts (stored procedures, triggers, and UDFs).
> 
>
<br/>

| Version | Release Date | Retirement Date |
| --- | --- | --- |
| [3.1.0](#3.1.0) |July 26, 2019 |--- |
| [3.0.4](#3.0.4) |July 22, 2019 |--- |
| [3.0.3](#3.0.3) |July 17, 2019 |--- |
| [3.0.2](#3.0.2) |July 9, 2019 |--- |
| [3.0.0](#3.0.0) |June 28, 2019 |--- |
| [2.1.5](#2.1.5) |March 20, 2019 |--- |
| [2.1.4](#2.1.4) |March 15, 2019 |--- |
| [2.1.3](#2.1.3) |March 8, 2019 |--- |
| [2.1.2](#2.1.2) |January 28, 2019 |--- |
| [2.1.1](#2.1.1) |December 5, 2018 |--- |
| [2.1.0](#2.1.0) |December 4, 2018 |--- |
| [2.0.5](#2.0.5) |November 7, 2018 |--- |
| [2.0.4](#2.0.4) |October 30, 2018 |--- |
| [2.0.3](#2.0.3) |October 30, 2018 |--- |
| [2.0.2](#2.0.2) |October 10, 2018 |--- |
| [2.0.1](#2.0.1) |September 25, 2018 |--- |
| [2.0.0](#2.0.0) |September 24, 2018 |--- |
| [2.0.0-3 (RC)](#2.0.0-3) |August 2, 2018 |--- |
| [1.14.4](#1.14.4) |May 03, 2018 |August 30, 2020 |
| [1.14.3](#1.14.3) |May 03, 2018 |August 30, 2020 |
| [1.14.2](#1.14.2) |December 21, 2017 |August 30, 2020 |
| [1.14.1](#1.14.1) |November 10, 2017 |August 30, 2020 |
| [1.14.0](#1.14.0) |November 9, 2017 |August 30, 2020 |
| [1.13.0](#1.13.0) |October 11, 2017 |August 30, 2020 |
| [1.12.2](#1.12.2) |August 10, 2017 |August 30, 2020 |
| [1.12.1](#1.12.1) |August 10, 2017 |August 30, 2020 |
| [1.12.0](#1.12.0) |May 10, 2017 |August 30, 2020 |
| [1.11.0](#1.11.0) |March 16, 2017 |August 30, 2020 |
| [1.10.2](#1.10.2) |January 27, 2017 |August 30, 2020 |
| [1.10.1](#1.10.1) |December 22, 2016 |August 30, 2020 |
| [1.10.0](#1.10.0) |October 03, 2016 |August 30, 2020 |
| [1.9.0](#1.9.0) |July 07, 2016 |August 30, 2020 |
| [1.8.0](#1.8.0) |June 14, 2016 |August 30, 2020 |
| [1.7.0](#1.7.0) |April 26, 2016 |August 30, 2020 |
| [1.6.0](#1.6.0) |March 29, 2016 |August 30, 2020 |
| [1.5.6](#1.5.6) |March 08, 2016 |August 30, 2020 |
| [1.5.5](#1.5.5) |February 02, 2016 |August 30, 2020 |
| [1.5.4](#1.5.4) |February 01, 2016 |August 30, 2020 |
| [1.5.2](#1.5.2) |January 26, 2016 |August 30, 2020 |
| [1.5.2](#1.5.2) |January 22, 2016 |August 30, 2020 |
| [1.5.1](#1.5.1) |January 4, 2016 |August 30, 2020 |
| [1.5.0](#1.5.0) |December 31, 2015 |August 30, 2020 |
| [1.4.0](#1.4.0) |October 06, 2015 |August 30, 2020 |
| [1.3.0](#1.3.0) |October 06, 2015 |August 30, 2020 |
| [1.2.2](#1.2.2) |September 10, 2015 |August 30, 2020 |
| [1.2.1](#1.2.1) |August 15, 2015 |August 30, 2020 |
| [1.2.0](#1.2.0) |August 05, 2015 |August 30, 2020 |
| [1.1.0](#1.1.0) |July 09, 2015 |August 30, 2020 |
| [1.0.3](#1.0.3) |June 04, 2015 |August 30, 2020 |
| [1.0.2](#1.0.2) |May 23, 2015 |August 30, 2020 |
| [1.0.1](#1.0.1) |May 15, 2015 |August 30, 2020 |
| [1.0.0](#1.0.0) |April 08, 2015 |August 30, 2020 |

## FAQ
[!INCLUDE [cosmos-db-sdk-faq](../../includes/cosmos-db-sdk-faq.md)]

## See also
To learn more about Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page.

