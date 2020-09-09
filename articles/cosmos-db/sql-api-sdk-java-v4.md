---
title: 'Azure Cosmos DB Java SDK v4 for SQL API release notes and resources'
description: Learn all about the Azure Cosmos DB Java SDK v4 for SQL API and SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB SQL Async Java SDK.
author: anfeldma-ms
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: java
ms.topic: reference
ms.date: 08/12/2020
ms.author: anfeldma
ms.custom: devx-track-java
---

# Azure Cosmos DB Java SDK v4 for Core (SQL) API: release notes and resources
> [!div class="op_single_selector"]
> * [.NET SDK v3](sql-api-sdk-dotnet-standard.md)
> * [.NET SDK v2](sql-api-sdk-dotnet.md)
> * [.NET Core SDK v2](sql-api-sdk-dotnet-core.md)
> * [.NET Change Feed SDK v2](sql-api-sdk-dotnet-changefeed.md)
> * [Node.js](sql-api-sdk-node.md)
> * [Java SDK v4](sql-api-sdk-java-v4.md)
> * [Async Java SDK v2](sql-api-sdk-async-java.md)
> * [Sync Java SDK v2](sql-api-sdk-java.md)
> * [Spring Data v2](sql-api-sdk-java-spring-v2.md)
> * [Spring Data v3](sql-api-sdk-java-spring-v3.md)
> * [Spark Connector](sql-api-sdk-java-spark.md)
> * [Python](sql-api-sdk-python.md)
> * [REST](/rest/api/cosmos-db/)
> * [REST Resource Provider](/rest/api/cosmos-db-resource-provider/)
> * [SQL](sql-api-query-reference.md)
> * [Bulk executor - .NET v2](sql-api-sdk-bulk-executor-dot-net.md)
> * [Bulk executor - Java](sql-api-sdk-bulk-executor-java.md)

The Azure Cosmos DB Java SDK v4 for Core (SQL) combines an Async API and a Sync API into one Maven artifact. The v4 SDK brings enhanced performance, new API features, and Async support based on Project Reactor and the [Netty library](https://netty.io/). Users can expect improved performance with Azure Cosmos DB Java SDK v4 versus the [Azure Cosmos DB Async Java SDK v2](sql-api-sdk-async-java.md) and the [Azure Cosmos DB Sync Java SDK v2](sql-api-sdk-java.md).

> [!IMPORTANT]  
> These Release Notes are for Azure Cosmos DB Java SDK v4 only. If you are currently using an older version than v4, see the [Migrate to Azure Cosmos DB Java SDK v4](migrate-java-v4-sdk.md) guide for help upgrading to v4.
>
> Here are three steps to get going fast!
> 1. Install the [minimum supported Java runtime, JDK 8](/java/azure/jdk/?view=azure-java-stable) so you can use the SDK.
> 2. Work through the [Quickstart Guide for Azure Cosmos DB Java SDK v4](https://docs.microsoft.com/azure/cosmos-db/create-sql-api-java) which gets you access to the Maven artifact and walks through basic Azure Cosmos DB requests.
> 3. Read the Azure Cosmos DB Java SDK v4 [performance tips](performance-tips-java-sdk-v4-sql.md) and [troubleshooting](troubleshoot-java-sdk-v4-sql.md) guides to optimize the SDK for your application.
>
> The [Azure Cosmos DB workshops and labs](https://aka.ms/cosmosworkshop) are another great resource for learning how to use Azure Cosmos DB Java SDK v4!
>

## Helpful content

| Content | Link |
|---|---|
|**SDK download**| [Maven](https://mvnrepository.com/artifact/com.azure/azure-cosmos) |
|**API documentation** | [Java API reference documentation](https://docs.microsoft.com/java/api/overview/azure/cosmosdb/client?view=azure-java-stable) |
|**Contribute to SDK** | [Azure SDK for Java Central Repo on GitHub](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/cosmos/azure-cosmos) | 
|**Get started** | [Quickstart: Build a Java app to manage Azure Cosmos DB SQL API data](https://docs.microsoft.com/azure/cosmos-db/create-sql-api-java) <br> [GitHub repo with quickstart code](https://github.com/Azure-Samples/azure-cosmos-java-getting-started) | 
|**Basic code samples** | [Azure Cosmos DB: Java examples for the SQL API](sql-api-java-sdk-samples.md) <br> [GitHub repo with sample code](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples)|
|**Console app with Change Feed**| [Change feed - Java SDK v4 sample](create-sql-api-java-changefeed.md) <br> [GitHub repo with sample code](https://github.com/Azure-Samples/azure-cosmos-java-sql-app-example)| 
|**Web app sample**| [Build a web app with Java SDK v4](sql-api-java-application.md) <br> [GitHub repo with sample code](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-todo-app)|
| **Performance tips**| [Performance tips for Java SDK v4](performance-tips-java-sdk-v4-sql.md)| 
| **Troubleshooting** | [Troubleshoot Java SDK v4](troubleshoot-java-sdk-v4-sql.md) |
| **Migrate to v4 from an older SDK** | [Migrate to Java V4 SDK](migrate-java-v4-sdk.md) |
| **Minimum supported runtime**|[JDK 8](/java/azure/jdk/?view=azure-java-stable) | 
| **Azure Cosmos DB workshops and labs** |[Cosmos DB workshops home page](https://aka.ms/cosmosworkshop)

## Release history

### 4.4.0-beta.2 (Unreleased)
#### Key Bug Fixes
* Fixed RequestTimeoutException when enable tcnative.

### 4.4.0-beta.1 (2020-08-27)
#### New Features
* Added new API to efficiently load many documents (via list of pk/id pairs or all documents for a set of pk values).
* Added new `deleteItem` API.
* Enabled query metrics by default.
#### Key Bug Fixes
* Fixed NPE in `GatewayAddressCache`.
* Fixing query metric issue for zero item response.
* Improved performance (reduced CPU usage) for address parsing and Master-Key authentication.

### 4.3.2-beta.2 (2020-08-17)
#### Key Bug Fixes
* No changes from previous version, releasing for compatibility issues with spring data modules.

### 4.3.2-beta.1 (2020-08-14)
#### Key Bug Fixes
* Fixed issue in RntbdServiceEndpoint to avoid early closure of an unused TCP connection.

### 4.3.1 (2020-08-13)
#### Key Bug Fixes
* Fixed issue with `GROUP BY` query, where it was returning only one page.
* Fixed user agent string format to comply with central SDK guidelines.
* Enhanced diagnostics information to include query plan diagnostics.

### 4.3.0 (2020-07-29)
#### New features
* Updated reactor-core library version to `3.3.8.RELEASE`. 
* Updated reactor-netty library version to `0.9.10.RELEASE`. 
* Updated netty library version to `4.1.51.Final`. 
* Added new overload APIs for `upsertItem` with `partitionKey`. 
* Added open telemetry tracing support. 
#### Key bug fixes
* Fixed issue where SSLException gets thrown in case of cancelation of requests in GATEWAY mode.
* Fixed resource throttle retry policy on stored procedures execution.
* Fixed issue where SDK hangs in log level DEBUG mode. 
* Fixed periodic spikes in latency in Direct mode. 
* Fixed high client initialization time issue. 
* Fixed http proxy bug when customizing client with direct mode and gateway mode. 
* Fixed potential NPE in users passes null options. 
* Added timeUnit to `requestLatency` in diagnostics string.
* Removed duplicate uri string from diagnostics string. 
* Fixed diagnostics string in proper JSON format for point operations.
* Fixed issue with `.single()` operator causing the reactor chain to blow up in case of Not Found exception. 

### 4.2.0 (2020-07-14)
#### New features
* Added script logging enabled API to `CosmosStoredProcedureRequestOptions`.
* Updated `DirectConnectionConfig` default `idleEndpointTimeout` to 1h and default `connectTimeout` to 5s.
#### Key bug fixes
* Fixed issue where `GatewayConnectionConfig` `idleConnectionTimeout` was overriding `DirectConnectionConfig` `idleConnectionTimeout`.
* Fixed `responseContinuationTokenLimitInKb` get and set APIs in `CosmosQueryRequestOptions`.
* Fixed issue in query and change feed when recreating the collection with same name.
* Fixed issue with top query throwing ClassCastException.
* Fixed issue with order by query throwing NullPointerException.
* Fixed issue in handling of canceled requests in direct mode causing reactor `onErrorDropped` being called. 

### 4.1.0 (2020-06-25)
#### New features
* Added support for `GROUP BY` query.
* Increased the default value of maxConnectionsPerEndpoint to 130 in DirectConnectionConfig.
* Increased the default value of maxRequestsPerConnection to 30 in DirectConnectionConfig.
#### Key bug fixes
* Fixed issues with order by query returning duplicate results when resuming by using continuation token. 
* Fixed issues with value query returning null values for nested object.
* Fixed null pointer exception on request manager in RntbdClientChannelPool.

### 4.0.1 (2020-06-10)
#### New features
* Renamed `QueryRequestOptions` to `CosmosQueryRequestOptions`.
* Updated `ChangeFeedProcessorBuilder` to builder pattern.
* Updated `CosmosPermissionProperties` with new container name and child resources APIs.
* Added more samples & enriched docs to `CosmosClientBuilder`. 
* Updated `CosmosDatabase` & `CosmosContainer` APIs with throughputProperties for autoscale/autopilot support. 
* Renamed `CosmosClientException` to `CosmosException`. 
* Replaced `AccessCondition` & `AccessConditionType` by `ifMatchETag()` & `ifNoneMatchETag()` APIs. 
* Merged all `Cosmos*AsyncResponse` & `CosmosResponse` types to a single `CosmosResponse` type.
* Renamed `CosmosResponseDiagnostics` to `CosmosDiagnostics`.  
* Wrapped `FeedResponseDiagnostics` in `CosmosDiagnostics`. 
* Removed `jackson` dependency from azure-cosmos & relying on azure-core. 
* Replaced `CosmosKeyCredential` with `AzureKeyCredential` type. 
* Added `ProxyOptions` APIs to `GatewayConnectionConfig`. 
* Updated SDK to use `Instant` type instead of `OffsetDateTime`. 
* Added new enum type `OperationKind`. 
* Renamed `FeedOptions` to `QueryRequestOptions`. 
* Added `getETag()` & `getTimestamp()` APIs to `Cosmos*Properties` types. 
* Added `userAgent` information in `CosmosException` & `CosmosDiagnostics`. 
* Updated new line character in `Diagnostics` to System new line character. 
* Removed `readAll*` APIs, use query select all APIs instead.
* Added `ChangeFeedProcessor` estimate lag API.   
* Added autoscale/autopilot throughput provisioning support to SDK.  
* Replaced `ConnectionPolicy` with new connection configs. Exposed `DirectConnectionConfig` & `GatewayConnectionConfig` APIs through `CosmosClientBuilder` for Direct & Gateway mode connection configurations.
* Moved `JsonSerializable` & `Resource` to implementation package. 
* Added `contentResponseOnWriteEnabled` API to CosmosClientBuilder which disables full response content on write operations.
* Exposed `getETag()` APIs on response types.
* Moved `CosmosAuthorizationTokenResolver` to implementation. 
* Renamed `preferredLocations` & `multipleWriteLocations` API to `preferredRegions` & `multipleWriteRegions`. 
* Updated `reactor-core` to 3.3.5.RELEASE, `reactor-netty` to 0.9.7.RELEASE & `netty` to 4.1.49.Final versions. 
* Added support for `analyticalStoreTimeToLive` in SDK.     
* `CosmosClientException` extends `AzureException`. 
* Removed `maxItemCount` & `requestContinuationToken` APIs from `FeedOptions` instead using `byPage()` APIs from `CosmosPagedFlux` & `CosmosPagedIterable`.
* Introduced `CosmosPermissionProperties` on public surface for `Permission` APIs.
* Removed `SqlParameterList` type & replaced with `List`
* Fixed multiple memory leaks in Direct TCP client. 
* Added support for `DISTINCT` queries. 
* Removed external dependencies on `fasterxml.uuid, guava, commons-io, commons-collection4, commons-text`.  
* Moved `CosmosPagedFlux` & `CosmosPagedIterable` to `utils` package. 
* Updated netty to 4.1.45.Final & project reactor to 3.3.3 version.
* Updated public rest contracts to `Final` classes.
* Added support for advanced Diagnostics for point operations.
* Updated package to `com.azure.cosmos`
* Added `models` package for model / rest contracts
* Added `utils` package for `CosmosPagedFlux` & `CosmosPagedIterable` types. 
* Updated public APIs to use `Duration` across the SDK.
* Added all rest contracts to `models` package.
* `RetryOptions` renamed to `ThrottlingRetryOptions`.
* Added `CosmosPagedFlux` & `CosmosPagedIterable` pagination types for query APIs. 
* Added support for sharing TransportClient across multiple instances of CosmosClients using a new API in the `CosmosClientBuilder#connectionSharingAcrossClientsEnabled(true)`
* Query Optimizations by removing double serialization / deserialization. 
* Response Headers optimizations by removing unnecessary copying back and forth. 
* Optimized `ByteBuffer` serialization / deserialization by removing intermediate String instantiations.

#### Key bug fixes
* Fixed ConnectionPolicy `toString()` Null Pointer Exception.
* Fixed issue with parsing of query results in case of Value order by queries. 
* Fixed socket leak issues with Direct TCP client.
* Fixed `orderByQuery` with continuation token bug.
* `ChangeFeedProcessor` bug fix for handling partition splits & when partition not found.
* `ChangeFeedProcessor` bug fix when synchronizing lease updates across different threads.
* Fixed race condition causing `ArrayIndexOutOfBound` exception in StoreReader

## FAQ
[!INCLUDE [cosmos-db-sdk-faq](../../includes/cosmos-db-sdk-faq.md)]

## Next steps
To learn more about Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page.