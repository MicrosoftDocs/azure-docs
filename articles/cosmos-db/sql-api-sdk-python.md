---
title: Azure Cosmos DB SQL Python API, SDK & resources
description: Learn all about the SQL Python API and SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB Python SDK.
author: anfeldma-ms
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: python
ms.topic: reference
ms.date: 05/20/2020
ms.author: anfeldma
ms.custom: tracking-python
---
# Azure Cosmos DB Python SDK for SQL API: Release notes and resources

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
> * [REST](https://docs.microsoft.com/rest/api/cosmos-db/)
> * [REST Resource Provider](https://docs.microsoft.com/rest/api/cosmos-db-resource-provider/)
> * [SQL](sql-api-query-reference.md)
> * [Bulk executor - .NET  v2](sql-api-sdk-bulk-executor-dot-net.md)
> * [Bulk executor - Java](sql-api-sdk-bulk-executor-java.md)

| |  |
|---|---|
|**Download SDK**|[PyPI](https://pypi.org/project/azure-cosmos)|
|**API documentation**|[Python API reference documentation](https://docs.microsoft.com/python/api/azure-cosmos/?view=azure-python)|
|**SDK installation instructions**|[Python SDK installation instructions](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cosmos/azure-cosmos)|
|**Get started**|[Get started with the Python SDK](create-sql-api-python.md)|
|**Current supported platform**|[Python 2.7](https://www.python.org/downloads/) and [Python 3.5.3+](https://www.python.org/downloads/)|

## Release history

### 4.0.0

* Stable release.
* Added HttpLoggingPolicy to pipeline to enable passing in a custom logger for request and response headers.

### 4.0.0b6

* Fixed bug in synchronized_request for media APIs.
* Removed MediaReadMode and MediaRequestTimeout from ConnectionPolicy as media requests are not supported.

### 4.0.0b5

* azure.cosmos.errors module deprecated and replaced by azure.cosmos.exceptions
* The access condition parameters (`access_condition`, `if_match`, `if_none_match`) have been deprecated in favor of separate `match_condition` and `etag` parameters.
* Fixed bug in routing map provider.
* Added query Distinct, Offset, and Limit support.
* Default document query execution context now used for

  * ChangeFeed queries
  * single partition queries (partitionkey, partitionKeyRangeId is present in options)
  * Non-document queries

* Errors out for aggregates on multiple partitions, with enable cross partition query set to true, but no "value" keyword present
* Hits query plan endpoint for other scenarios to fetch query plan
* Added `__repr__` support for Cosmos entity objects.
* Updated documentation.

### 4.0.0b4

* Added support for a `timeout` keyword argument to all operations to specify an absolute timeout in seconds within which the operation must be completed. If the timeout value is exceeded, a `azure.cosmos.errors.CosmosClientTimeoutError` will be raised.

* Added a new `ConnectionRetryPolicy` to manage retry behavior during HTTP connection errors.

* Added new constructor and per-operation configuration keyword arguments:

  * `retry_total` - Maximum retry attempts.
  * `retry_backoff_max` - Maximum retry wait time in seconds.
  * `retry_fixed_interval` - Fixed retry interval in milliseconds.
  * `retry_read` - Maximum number of sockets read retry attempts.
  * `retry_connect` - Maximum number of connection error retry attempts.
  * `retry_status` - Maximum number of retry attempts on error status codes.
  * `retry_on_status_codes` - A list of specific status codes to retry on.
  * `retry_backoff_factor` - Factor to calculate wait time between retry attempts.

### 4.0.0b3

* Added `create_database_if_not_exists()` and `create_container_if_not_exists` functionalities to CosmosClient and Database respectively.

### 4.0.0b2

* Version 4.0.0b2 is the second iteration in our efforts to build a client library that suits the Python language best practices.

**Breaking changes**

* The client connection has been adapted to consume the HTTP pipeline defined in `azure.core.pipeline`.

* Interactive objects have now been renamed as proxies. This includes:

  * `Database` -> `DatabaseProxy`
  * `User` -> `UserProxy`
  * `Container` -> `ContainerProxy`
  * `Scripts` -> `ScriptsProxy`

* The constructor of `CosmosClient` has been updated:

  * The `auth` parameter has been renamed to `credential` and will now take an authentication type directly. This means the master key value, a dictionary of resource tokens, or a list of permissions can be passed in. However the old dictionary format is still supported.

  * The `connection_policy` parameter has been made a keyword only parameter, and while it is still supported, each of the individual attributes of the policy can now be passed in as explicit keyword arguments:

    * `request_timeout`
    * `media_request_timeout`
    * `connection_mode`
    * `media_read_mode`
    * `proxy_config`
    * `enable_endpoint_discovery`
    * `preferred_locations`
    * `multiple_write_locations`

* A new constructor has been added to `CosmosClient` to enable creation via a connection string retrieved from the Azure portal.

* Some `read_all` operations have been renamed to `list` operations:

  * `CosmosClient.read_all_databases` -> `CosmosClient.list_databases`
  * `Container.read_all_conflicts` -> `ContainerProxy.list_conflicts`
  * `Database.read_all_containers` -> `DatabaseProxy.list_containers`
  * `Database.read_all_users` -> `DatabaseProxy.list_users`
  * `User.read_all_permissions` -> `UserProxy.list_permissions`

* All operations that take `request_options` or `feed_options` parameters, these have been moved to keyword only parameters. In addition, while these options dictionaries are still supported, each of the individual options within the dictionary are now supported as explicit keyword arguments.

* The error hierarchy is now inherited from `azure.core.AzureError` instead of, which has been removed.

  * `HTTPFailure` has been renamed to `CosmosHttpResponseError`
  * `JSONParseFailure` has been removed and replaced by `azure.core.DecodeError`
  * Added additional errors for specific response codes:
    * `CosmosResourceNotFoundError` for status 404
    * `CosmosResourceExistsError` for status 409
    * `CosmosAccessConditionFailedError` for status 412

* `CosmosClient` can now be run in a context manager to handle closing the client connection.

* Iterable responses (for example, query responses and list responses) are now of type `azure.core.paging.ItemPaged`. The method `fetch_next_block` has been replaced by a secondary iterator, accessed by the `by_page` method.

### 4.0.0b1

Version 4.0.0b1 is the first preview of our efforts to create a user-friendly client library that suits the Python language best practices. For more information about this, and preview releases of other Azure SDK libraries, please visit https://aka.ms/azure-sdk-preview1-python.

**Breaking changes: New API design**

* Operations are now scoped to a particular client:

  * `CosmosClient`: This client handles account-level operations. This includes managing service properties and listing the databases within an account.
  * `Database`: This client handles database-level operations. This includes creating and deleting containers, users, and stored procedures. It can be accessed from a  cosmosClient` instance by name.
  * `Container`: This client handles operations for a particular container. This includes querying and inserting items and managing properties.
  * `User`: This client handles operations for a particular user. This includes adding and deleting permissions and managing user properties.

    These clients can be accessed by navigating down the client hierarchy using the `get_<child>_client` method. For full details on the new API, please see the [reference documentation](https://aka.ms/azsdk-python-cosmos-ref).

* Clients are accessed by name rather than by ID. No need to concatenate strings to create links.

* No more need to import types and methods from individual modules. The public API surface area is available directly in the `azure.cosmos` package.

* Individual request properties can be provided as keyword arguments rather than constructing a separate `RequestOptions` instance.

### 3.0.2

* Added Support for MultiPolygon Datatype
* Bug Fix in Session Read Retry Policy
* Bug Fix for Incorrect padding issues while decoding base 64 strings

### 3.0.1

* Bug fix in LocationCache
* Bug fix endpoint retry logic
* Fixed documentation

### 3.0.0

* Multi-regions write support added
* Naming changes
  * DocumentClient to CosmosClient
  * Collection to Container
  * Document to Item
  * Package name updated to "azure-cosmos"
  * Namespace updated to "azure.cosmos"

### 2.3.3

* Added support for proxy
* Added support for reading change feed
* Added support for collection quota headers
* Bugfix for large session tokens issue
* Bugfix for ReadMedia API
* Bugfix in partition key range cache

### 2.3.2

* Added support for default retries on connection issues.

### 2.3.1

* Updated documentation to reference Azure Cosmos DB instead of Azure DocumentDB.

### 2.3.0

* This SDK version requires the latest version of Azure Cosmos DB Emulator available for download from https://aka.ms/cosmosdb-emulator.

### 2.2.1

* bugfix for aggregate dict
* bugfix for trimming slashes in the resource link
* tests for unicode encoding

### 2.2.0

* Added support for Request Unit per Minute (RU/m) feature.
* Added support for a new consistency level called ConsistentPrefix.

### 2.1.0

* Added support for aggregation queries (COUNT, MIN, MAX, SUM, and AVG).
* Added an option for disabling SSL verification when running against DocumentDB Emulator.
* Removed the restriction of dependent requests module to be exactly 2.10.0.
* Lowered minimum throughput on partitioned collections from 10,100 RU/s to 2500 RU/s.
* Added support for enabling script logging during stored procedure execution.
* REST API version bumped to '2017-01-19' with this release.

### 2.0.1

* Made editorial changes to documentation comments.

### 2.0.0

* Added support for Python 3.5.
* Added support for connection pooling using the requests module.
* Added support for session consistency.
* Added support for TOP/ORDERBY queries for partitioned collections.

### 1.9.0

* Added retry policy support for throttled requests. (Throttled requests receive a request rate too large exception, error code 429.)
  By default, DocumentDB retries nine times for each request when error code 429 is encountered, honoring the retryAfter time in the response header.
  A fixed retry interval time can now be set as part of the RetryOptions property on the ConnectionPolicy object if you want to ignore the retryAfter time returned by server between the retries.
  DocumentDB now waits for a maximum of 30 seconds for each request that is being throttled (irrespective of retry count) and returns the response with error code 429.
  This time can also be overridden in the RetryOptions property on ConnectionPolicy object.

* DocumentDB now returns x-ms-throttle-retry-count and x-ms-throttle-retry-wait-time-ms as the response headers in every request to denote the throttle retry count
  and the cumulative time the request waited between the retries.

* Removed the RetryPolicy class and the corresponding property (retry_policy) exposed on the document_client class and instead introduced a RetryOptions class
  exposing the RetryOptions property on ConnectionPolicy class that can be used to override some of the default retry options.

### 1.8.0

* Added the support for geo-replicated database accounts.
* Test fixes to move the global host and masterKey into the individual test classes.

### 1.7.0

* Added the support for Time To Live(TTL) feature for documents.

### 1.6.1

* Bug fixes related to server-side partitioning to allow special characters in partition key path.

### 1.6.0

* Added the support for server-side partitioned collections feature.

### 1.5.0

* Added Client-side sharding framework to the SDK. Implemented HashPartionResolver and RangePartitionResolver classes.

### 1.4.2

* Implement Upsert. New UpsertXXX methods added to support Upsert feature.
* Implement ID-Based Routing. No public API changes, all changes internal.

### 1.3.0

* Release skipped to bring version number in alignment with other SDKs

### 1.2.0

* Supports GeoSpatial index.
* Validates ID property for all resources. Ids for resources cannot contain `?, /, #, \\` characters or end with a space.
* Adds new header "index transformation progress" to ResourceResponse.

### 1.1.0

* Implements V2 indexing policy

### 1.0.1

* Supports proxy connection

## Release & retirement dates

Microsoft provides notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version. New features and functionality and optimizations are only added to the current SDK, as such it is recommended that you always upgrade to the latest SDK version as early as possible.

Any request to Azure Cosmos DB using a retired SDK are rejected by the service.

> [!WARNING]
> All versions of the Python SDK for SQL API prior to version **1.0.0** were retired on **February 29, 2016**. And, all versions 1.x and 2.x of the Python SDK for SQL API will be retired on **August 30, 2020**.

| Version | Release Date | Retirement Date |
| --- | --- | --- |
| [4.0.0](#400) |May 20, 2020 |--- |
| [3.0.2](#302) |Nov 15, 2018 |--- |
| [3.0.1](#301) |Oct 04, 2018 |--- |
| [2.3.3](#233) |Sept 08, 2018 |August 30, 2020 |
| [2.3.2](#232) |May 08, 2018 |August 30, 2020 |
| [2.3.1](#231) |December 21, 2017 |August 30, 2020 |
| [2.3.0](#230) |November 10, 2017 |August 30, 2020 |
| [2.2.1](#221) |Sep 29, 2017 |August 30, 2020 |
| [2.2.0](#220) |May 10, 2017 |August 30, 2020 |
| [2.1.0](#210) |May 01, 2017 |August 30, 2020 |
| [2.0.1](#201) |October 30, 2016 |August 30, 2020 |
| [2.0.0](#200) |September 29, 2016 |August 30, 2020 |
| [1.9.0](#190) |July 07, 2016 |August 30, 2020 |
| [1.8.0](#180) |June 14, 2016 |August 30, 2020 |
| [1.7.0](#170) |April 26, 2016 |August 30, 2020 |
| [1.6.1](#161) |April 08, 2016 |August 30, 2020 |
| [1.6.0](#160) |March 29, 2016 |August 30, 2020 |
| [1.5.0](#150) |January 03, 2016 |August 30, 2020 |
| [1.4.2](#142) |October 06, 2015 |August 30, 2020 |
| 1.4.1 |October 06, 2015 |August 30, 2020 |
| [1.2.0](#120) |August 06, 2015 |August 30, 2020 |
| [1.1.0](#110) |July 09, 2015 |August 30, 2020 |
| [1.0.1](#101) |May 25, 2015 |August 30, 2020 |
| 1.0.0 |April 07, 2015 |August 30, 2020 |
| 0.9.4-prelease |January 14, 2015 |February 29, 2016 |
| 0.9.3-prelease |December 09, 2014 |February 29, 2016 |
| 0.9.2-prelease |November 25, 2014 |February 29, 2016 |
| 0.9.1-prelease |September 23, 2014 |February 29, 2016 |
| 0.9.0-prelease |August 21, 2014 |February 29, 2016 |

## FAQ

[!INCLUDE [cosmos-db-sdk-faq](../../includes/cosmos-db-sdk-faq.md)]

## Next steps

To learn more about Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page. 
