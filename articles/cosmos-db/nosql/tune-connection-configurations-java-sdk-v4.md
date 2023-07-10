---
title: Connection configurations for Azure Cosmos DB Java SDK v4
description: Learn how to tune connection configurations to improve Azure Cosmos DB database performance for Java SDK v4
author: kushagraThapar
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: java
ms.topic: how-to
ms.date: 04/22/2022
ms.author: kuthapar
ms.custom: devx-track-java, contperf-fy21q2, ignite-2022, devx-track-extended-java
---

# Tune connection configurations for Azure Cosmos DB Java SDK v4
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

> [!div class="op_single_selector"]
> * [Java SDK v4](performance-tips-java-sdk-v4.md)
> * [Async Java SDK v2](performance-tips-async-java.md)
> * [Sync Java SDK v2](performance-tips-java.md)
> * [.NET SDK v3](performance-tips-dotnet-sdk-v3.md)
> * [.NET SDK v2](performance-tips.md)
> 

> [!IMPORTANT]  
> The performance tips in this article are for Azure Cosmos DB Java SDK v4 only. Please view the Azure Cosmos DB Java SDK v4 [Release notes](sdk-java-v4.md), [Maven repository](https://mvnrepository.com/artifact/com.azure/azure-cosmos), and Azure Cosmos DB Java SDK v4 [troubleshooting guide](troubleshoot-java-sdk-v4.md) for more information. If you are currently using an older version than v4, see the [Migrate to Azure Cosmos DB Java SDK v4](migrate-java-v4-sdk.md) guide for help upgrading to v4.

Azure Cosmos DB is a fast and flexible distributed database that scales seamlessly with guaranteed latency and throughput. You do not have to make major architecture changes or write complex code to scale your database with Azure Cosmos DB. Scaling up and down is as easy as making a single API call or SDK method call. However, because Azure Cosmos DB is accessed via network calls there are connection configurations you can tune to achieve peak performance when using Azure Cosmos DB Java SDK v4.

## Connection configuration

> [!NOTE]
> In Azure Cosmos DB Java SDK v4, *Direct mode* is the best choice to improve database performance with most workloads.

To learn more about different connectivity options, see the [connectivity modes](sdk-connection-modes.md) article.

### Direct connection mode

Java SDK default connection mode is direct. Direct mode Azure Cosmos DB requests are made over TCP when using Azure Cosmos DB Java SDK v4. Internally Direct mode uses a special architecture to dynamically manage network resources and get the best performance. The client-side architecture employed in Direct mode enables predictable network utilization and multiplexed access to Azure Cosmos DB replicas. To learn more about architecture, see the [direct mode connection architecture](sdk-connection-modes.md#direct-mode)

You can configure the connection mode in the client builder using the *directMode()* method as shown below. To configure direct mode with default settings, call `directMode()` method without arguments. To customize direct mode connection settings, pass *DirectConnectionConfig* to `directMode()` API.

# [Async](#tab/api-async)

Java SDK V4 (Maven com.azure::azure-cosmos) Async API

[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/documentationsnippets/async/SampleDocumentationSnippetsAsync.java?name=PerformanceClientConnectionModeAsync)]

# [Sync](#tab/api-sync)

Java SDK V4 (Maven com.azure::azure-cosmos) Sync API

[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/documentationsnippets/sync/SampleDocumentationSnippets.java?name=PerformanceClientConnectionModeSync)]

--- 

#### Customizing direct connection mode

If non-default Direct mode behavior is desired, create a *DirectConnectionConfig* instance and customize its properties, then pass the customized property instance to the *directMode()* method in the Azure Cosmos DB client builder.

These configuration settings control the behavior of the underlying Direct mode architecture discussed above.

As a first step, use the following recommended configuration settings below. These *DirectConnectionConfig* options are advanced configuration settings which can affect SDK performance in unexpected ways; we recommend users avoid modifying them unless they feel very comfortable in understanding the tradeoffs and it is absolutely necessary. Please contact the [Azure Cosmos DB team](mailto:CosmosDBPerformanceSupport@service.microsoft.com) if you run into issues on this particular topic.

| Configuration option       | Default          | Recommended   | Details |
| :------------------:       | :-----:          | :---------:   | :-----: |
| idleConnectionTimeout      | "PT0" (ZERO)     | "PT0" (ZERO)  | This represents the idle connection timeout duration for a *single connection* to an endpoint/backend node (representing a replica). By default, SDK doesn't automatically close idle connections to the backend nodes. |
| idleEndpointTimeout        | "PT1H"           | "PT1H"        | This represents the idle connection timeout duration for the *connection pool* for an endpoint/backend node (representing a replica). By default, if there are no incoming requests to a specific endpoint/backend node, SDK will close all the connections in the connection pool to that endpoint/backend node after 1 hour to save network resources and I/O cost. For sparse or sporadic traffic pattern, we recommend setting this value to a higher number like 6 hours, 12 hours or even 24 hours, so that SDK will not have to open the connections frequently. However, this will utilize the network resources and will have higher number of connections kept open at any given time. If this is set to ZERO, idle endpoint check will be disabled. |
| maxConnectionsPerEndpoint  | "130"            | "130"         | This represents the upper bound size of the *connection pool* for an endpoint/backend node (representing a replica). SDK creates connections to endpoint/backend node on-demand and based on incoming concurrent requests. By default, if required, SDK will create maximum 130 connections to an endpoint/backend node. (NOTE: SDK doesn't create these 130 connections upfront). |
| maxRequestsPerConnection   | "30"             | "30"          | This represents the upper bound size of the maximum number of requests that can be queued on a *single connection* for a specific endpoint/backend node (representing a replica). SDK queues requests to a single connection to an endpoint/backend node on-demand and based on incoming concurrent requests. By default, if required, SDK will queue maximum 30 requests to a single connection for a specific endpoint/backend node. (NOTE: SDK doesn't queue these 30 requests to a single connection upfront). |
| connectTimeout             | "PT5S"           | "~PT1S"        | This represents the connection establishment timeout duration for a *single connection* to be established with an endpoint/backend node. By default SDK will wait for maximum 5 seconds for connection establishment before throwing an error. TCP connection establishment uses [multi-step handshake](https://en.wikipedia.org/wiki/Transmission_Control_Protocol#Protocol_operation) which increases latency of the connection establishment time, hence, customers are recommended to set this value according to their network bandwidth and environment settings. NOTE: This recommendation of ~PT1S is only for applications deployed in colocated regions of their Cosmos DB accounts. |
| networkRequestTimeout      | "PT5S"           | "PT5S"        | This represents the network timeout duration for a *single request*. SDK will wait maximum for this duration to consume a service response after the request has been written to the network connection. SDK only allows values between 1 second (min) and 10 seconds (max). Setting a value too high can result in fewer retries and reduce chances of success by retries. |


### Gateway Connection mode

Control plane operations such as database and container CRUD *always* utilize Gateway mode. Even when the user has configured Direct mode for data plane operations, control plane and meta data operations use default Gateway mode settings. This suits most users. However, users who want Direct mode for data plane operations as well as tunability of control plane Gateway mode parameters can use the following *directMode()* override:

# [Async](#tab/api-async)

Java SDK V4 (Maven com.azure::azure-cosmos) Async API

[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/documentationsnippets/async/SampleDocumentationSnippetsAsync.java?name=PerformanceClientDirectOverrideAsync)]

# [Sync](#tab/api-sync)

Java SDK V4 (Maven com.azure::azure-cosmos) Sync API

[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/documentationsnippets/sync/SampleDocumentationSnippets.java?name=PerformanceClientDirectOverrideSync)]

--- 

#### Customizing gateway connection mode

If non-default Gateway mode behavior is desired, create a *GatewayConnectionConfig* instance and customize its properties, then pass the customized property instance to the above *directMode()* override method or *gatewayMode()* method in the Azure Cosmos DB client builder.

As a first step, use the following recommended configuration settings below. These *GatewayConnectionConfig* options are advanced configuration settings which can affect SDK performance in unexpected ways; we recommend users avoid modifying them unless they feel very comfortable in understanding the tradeoffs and it is absolutely necessary. Please contact the [Azure Cosmos DB team](mailto:CosmosDBPerformanceSupport@service.microsoft.com) if you run into issues on this particular topic.

| Configuration option       | Default | Recommended | Details |
| :------------------:       | :-----: | :---------: | :-----: |
| maxConnectionPoolSize      | "1000"  | "1000"      | This represents the upper bound size of the connection pool size for underlying http client, which is the maximum number of connections that SDK will create for requests going to Gateway mode. SDK reuses these connections when sending requests to the Gateway. |
| idleConnectionTimeout      | "PT60S" | "PT60S"     | This represents the idle connection timeout duration for a *single connection* to the Gateway. After this time, the connection will be automatically closed and will be removed from the connection pool. |


## Next steps

To learn more about performance tips for Java SDK, see [Performance tips for Azure Cosmos DB Java SDK v4](performance-tips-java-sdk-v4.md).

To learn more about designing your application for scale and high performance, see [Partitioning and scaling in Azure Cosmos DB](../partitioning-overview.md).

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
