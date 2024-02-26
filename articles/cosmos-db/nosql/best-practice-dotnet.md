---
title: Azure Cosmos DB best practices for .NET SDK v3
description: Learn the best practices for using the Azure Cosmos DB .NET SDK v3
author: StefArroyo
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 07/31/2023
ms.author: esarroyo
ms.reviewer: mjbrown
ms.custom: cosmos-db-video, devx-track-dotnet
---

# Best practices for Azure Cosmos DB .NET SDK
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This article walks through the best practices for using the Azure Cosmos DB .NET SDK. Following these practices, will help improve your latency, availability, and boost overall performance.

Watch the video below to learn more about using the .NET SDK from an Azure Cosmos DB engineer!

>
> [!VIDEO https://aka.ms/docs.dotnet-best-practices]

## Checklist
|Checked  | Subject  |Details/Links  |
|---------|---------|---------|
|<input type="checkbox"/> |    SDK Version    |   Always using the [latest version](sdk-dotnet-v3.md) of the Azure Cosmos DB SDK available for optimal performance.     |
| <input type="checkbox"/>   |    Singleton Client     |       Use a [single instance](/dotnet/api/microsoft.azure.cosmos.cosmosclient?view=azure-dotnet&preserve-view=true) of `CosmosClient` for the lifetime of your application for [better performance](performance-tips-dotnet-sdk-v3.md#sdk-usage).     |
| <input type="checkbox"/>  |     Regions     |   Make sure to run your application in the same [Azure region](../distribute-data-globally.md) as your Azure Cosmos DB account, whenever possible to reduce latency. Enable 2-4 regions and replicate your accounts in multiple regions for [best availability](../distribute-data-globally.md). For production workloads, enable [service-managed failover](../how-to-manage-database-account.md#configure-multiple-write-regions). In the absence of this configuration, the account will experience loss of write availability for all the duration of the write region outage, as manual failover won't succeed due to lack of region connectivity. To learn how to add multiple regions using the .NET SDK visit [here](tutorial-global-distribution.md)   |
| <input type="checkbox"/>   |   Availability and Failovers     |  Set the [ApplicationPreferredRegions](/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.applicationpreferredregions?view=azure-dotnet&preserve-view=true) or [ApplicationRegion](/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.applicationregion?view=azure-dotnet&preserve-view=true) in the v3 SDK, and the [PreferredLocations](/dotnet/api/microsoft.azure.documents.client.connectionpolicy.preferredlocations?view=azure-dotnet&preserve-view=true) in the v2 SDK using the  [preferred regions list](./tutorial-global-distribution.md?tabs=dotnetv3%2capi-async#preferred-locations). During failovers, write operations are sent to the current write region and all reads are sent to the first region within your preferred regions list. For more information about regional failover mechanics, see the [availability troubleshooting guide](troubleshoot-sdk-availability.md). |
|  <input type="checkbox"/> |    CPU     |  You may run into connectivity/availability issues due to lack of resources on your client machine. Monitor your CPU utilization on nodes running the Azure Cosmos DB client, and scale up/out if usage is high.      |
| <input type="checkbox"/>   |    Hosting      |   Use [Windows 64-bit host](performance-tips-query-sdk.md#use-local-query-plan-generation) processing for best performance, whenever possible. For Direct mode latency-sensitive production workloads, we highly recommend using at least 4-cores and 8-GB memory VMs whenever possible.
| <input type="checkbox"/> |    Connectivity Modes    |    Use [Direct mode](sdk-connection-modes.md) for the best performance.  For instructions on how to do this, see the [V3 SDK documentation](performance-tips-dotnet-sdk-v3.md#networking) or the [V2 SDK documentation](performance-tips.md#networking).|
|<input type="checkbox"/>  |    Networking   | If using a virtual machine to run your application, enable [Accelerated Networking](../../virtual-network/create-vm-accelerated-networking-powershell.md) on your VM to help with bottlenecks due to high traffic and reduce latency or CPU jitter. You might also want to consider using a higher end Virtual Machine where the max CPU usage is under 70%.    |
|<input type="checkbox"/> |  Ephemeral Port Exhaustion      | For sparse or sporadic connections, we set the [`IdleConnectionTimeout`](/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.idletcpconnectiontimeout?view=azure-dotnet&preserve-view=true) and [`PortReuseMode`](/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.portreusemode?view=azure-dotnet&preserve-view=true) to `PrivatePortPool`. The `IdleConnectionTimeout` property helps control the time after which unused connections are closed. This reduces the number of unused connections. By default, idle connections are kept open indefinitely. The value set must be greater than or equal to 10 minutes. We recommended values between 20 minutes and 24 hours.  The `PortReuseMode` property allows the SDK to use a small pool of ephemeral ports for various Azure Cosmos DB destination endpoints.    |
|<input type="checkbox"/> |  Use Async/Await     |  Avoid blocking calls: `Task.Result`, `Task.Wait`, and `Task.GetAwaiter().GetResult()`. The entire call stack is asynchronous in order to benefit from [async/await](/dotnet/csharp/programming-guide/concepts/async/) patterns. Many synchronous blocking calls lead to [Thread Pool starvation](/archive/blogs/vancem/diagnosing-net-core-threadpool-starvation-with-perfview-why-my-service-is-not-saturating-all-cores-or-seems-to-stall) and degraded response times. |
|<input type="checkbox"/>  |   End-to-End Timeouts | To get end-to-end timeouts, you need to use both `RequestTimeout` and `CancellationToken` parameters. For more details [visit our timeout troubleshooting guide](troubleshoot-dotnet-sdk-request-timeout.md). |
|<input type="checkbox"/>  |   Retry Logic      | For more information on which errors to retry on and which ones are retried by SDKs, see [design guide](conceptual-resilient-sdk-applications.md#should-my-application-retry-on-errors). For accounts configured with multiple regions, there are [some scenarios](troubleshoot-sdk-availability.md#transient-connectivity-issues-on-tcp-protocol) where the SDK will automatically retry on other regions. For .NET specific implementation details visit the [SDK source repository](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/docs/SdkDesign.md). |
|<input type="checkbox"/>  |     Caching database/collection names    |    Retrieve the names of your databases and containers from configuration or cache them on start. Calls like `ReadDatabaseAsync` or `ReadDocumentCollectionAsync` and  `CreateDatabaseQuery` or `CreateDocumentCollectionQuery` will result in metadata calls to the service, which consume from the system-reserved RU limit. `CreateIfNotExist` should also only be used once for setting up the database. Overall, these operations should be performed infrequently.       |
|<input type="checkbox"/> |     Bulk Support      |     In scenarios where you may not need to optimize for latency, we recommend enabling [Bulk support](https://devblogs.microsoft.com/cosmosdb/introducing-bulk-support-in-the-net-sdk/) for dumping large volumes of data.    |
| <input type="checkbox"/>  |     Parallel Queries     |    The Azure Cosmos DB SDK supports [running queries in parallel](performance-tips-query-sdk.md?pivots=programming-language-csharp) for better latency and throughput on your queries.  We recommend setting the `MaxConcurrency` property within the `QueryRequestsOptions` to the number of partitions you have. If you aren't aware of the number of partitions, start by using `int.MaxValue`, which will give you the best latency. Then decrease the number until it fits the resource restrictions of the environment to avoid high CPU issues. Also, set the `MaxBufferedItemCount` to the expected number of results returned to limit the number of prefetched results. |
| <input type="checkbox"/> |     Performance Testing Backoffs      |    When performing testing on your application,  you should implement backoffs at [`RetryAfter`](performance-tips-dotnet-sdk-v3.md#sdk-usage) intervals. Respecting the backoff helps ensure that you spend a minimal amount of time waiting between retries.   |
|  <input type="checkbox"/>   |   Indexing     |   The Azure Cosmos DB indexing policy also allows you to specify which document paths to include or exclude from indexing by using indexing paths (IndexingPolicy.IncludedPaths and IndexingPolicy.ExcludedPaths).  Ensure that you exclude unused paths from indexing for faster writes.  For more information on how to create indexes using the SDK, see [performance tips .NET SDK v3](performance-tips-dotnet-sdk-v3.md#indexing-policy).   |
|  <input type="checkbox"/>   |    Document Size  |    The request charge of a specified operation correlates directly to the size of the document. We recommend reducing the size of your documents as operations on large documents cost more than operations on smaller documents.      |
| <input type="checkbox"/>   |     Increase the number of threads/tasks    |    Because calls to Azure Cosmos DB are made over the network, you might need to vary the degree of concurrency of your requests so that the client application spends minimal time waiting between requests. For example, if you're using the [.NET Task Parallel Library](/dotnet/standard/parallel-programming/task-parallel-library-tpl), create on the order of hundreds of tasks that read from or write to Azure Cosmos DB.     |
|  <input type="checkbox"/> |    Enabling Query Metrics     |  For more logging of your backend query executions, you can enable SQL Query Metrics using our .NET SDK. For more information on how to collect SQL Query Metrics, see [query metrics and performance](query-metrics-performance.md).    |
|  <input type="checkbox"/>    | SDK Logging   | Log [SDK diagnostics](#capture-diagnostics) for outstanding scenarios, such as exceptions or when requests go beyond an expected latency.
|  <input type="checkbox"/>    | DefaultTraceListener   | The DefaultTraceListener poses performance issues on production environments causing high CPU and I/O bottlenecks. Make sure you're using the latest SDK versions or [remove the DefaultTraceListener from your application](performance-tips-dotnet-sdk-v3.md#logging-and-tracing)  |
|  <input type="checkbox"/>    | Avoid using any special characters in identifiers   | Some characters are restricted and cannot be used in some identifiers: '/', '\\', '?', '#'. The general recommendation is to not use any special characters in identifiers like database name, collection name, item id, or partition key to avoid any unexpected behavior. |

## Capture diagnostics

[!INCLUDE[cosmos-db-dotnet-sdk-diagnostics](../includes/dotnet-sdk-diagnostics.md)]

## Best practices for HTTP connections

The .NET SDK uses `HttpClient` to perform HTTP requests regardless of the connectivity mode configured. In [Direct mode](sdk-connection-modes.md#direct-mode) HTTP is used for metadata operations and in Gateway mode it's used for both data plane and metadata operations. One of the [fundamentals of HttpClient](/dotnet/fundamentals/networking/http/httpclient-guidelines#dns-behavior) is to make sure the `HttpClient` can react to DNS changes on your account by **customizing the pooled connection lifetime**. As long as pooled connections are kept open, they don't react to DNS changes.  This setting forces pooled **connections to be closed** periodically, ensuring that your application reacts to DNS changes. Our recommendation is that you customize this value according to your [connectivity mode](sdk-connection-modes.md) and workload to balance the performance impact of frequently creating new connections, with needing to react to DNS changes (availability). A 5-minute value would be a good start that can be increased if it's impacting performance particularly for Gateway mode.

You can inject your custom HttpClient through `CosmosClientOptions.HttpClientFactory`, for example:

```csharp
// Use a Singleton instance of the SocketsHttpHandler, which you can share across any HttpClient in your application
SocketsHttpHandler socketsHttpHandler = new SocketsHttpHandler();
// Customize this value based on desired DNS refresh timer
socketsHttpHandler.PooledConnectionLifetime = TimeSpan.FromMinutes(5);

CosmosClientOptions cosmosClientOptions = new CosmosClientOptions()
{
    // Pass your customized SocketHttpHandler to be used by the CosmosClient
    // Make sure `disposeHandler` is `false`
    HttpClientFactory = () => new HttpClient(socketsHttpHandler, disposeHandler: false)
};

// Use a Singleton instance of the CosmosClient
return new CosmosClient("<connection-string>", cosmosClientOptions);
```

If you use [.NET dependency injection](/dotnet/core/extensions/dependency-injection), you can simplify the Singleton process:

```csharp
SocketsHttpHandler socketsHttpHandler = new SocketsHttpHandler();
// Customize this value based on desired DNS refresh timer
socketsHttpHandler.PooledConnectionLifetime = TimeSpan.FromMinutes(5);
// Registering the Singleton SocketsHttpHandler lets you reuse it across any HttpClient in your application
services.AddSingleton<SocketsHttpHandler>(socketsHttpHandler);

// Use a Singleton instance of the CosmosClient
services.AddSingleton<CosmosClient>(serviceProvider =>
{
    SocketsHttpHandler socketsHttpHandler = serviceProvider.GetRequiredService<SocketsHttpHandler>();
    CosmosClientOptions cosmosClientOptions = new CosmosClientOptions()
    {
        HttpClientFactory = () => new HttpClient(socketsHttpHandler, disposeHandler: false)
    };

    return new CosmosClient("<connection-string>", cosmosClientOptions);
});
```

## Best practices when using Gateway mode

Increase `System.Net MaxConnections` per host when you use Gateway mode. Azure Cosmos DB requests are made over HTTPS/REST when you use Gateway mode. They're subject to the default connection limit per hostname or IP address. You might need to set `MaxConnections` to a higher value (from 100 through 1,000) so that the client library can use multiple simultaneous connections to Azure Cosmos DB. In .NET SDK 1.8.0 and later, the default value for `ServicePointManager.DefaultConnectionLimit` is 50. To change the value, you can set `CosmosClientOptions.GatewayModeMaxConnectionLimit` to a higher value.

## Best practices for write-heavy workloads

For workloads that have heavy create payloads, set the `EnableContentResponseOnWrite` request option to `false`. The service will no longer return the created or updated resource to the SDK. Normally, because the application has the object that's being created, it doesn't need the service to return it. The header values are still accessible, like a request charge. Disabling the content response can help improve performance, because the SDK no longer needs to allocate memory or serialize the body of the response. It also reduces the network bandwidth usage to further help performance.

> [!IMPORTANT]
> Setting `EnableContentResponseOnWrite` to `false` will also disable the response from a trigger operation.

## Best practices for multi-tenant applications

Applications that distribute usage across multiple tenants where each tenant is represented by a different database, container, or partition key **within the same Azure Cosmos DB account** should use a single client instance. A single client instance can interact with all the databases, containers, and partition keys within an account, and it's best practice to use the [singleton pattern](performance-tips-dotnet-sdk-v3.md#sdk-usage). 

However, when each tenant is represented by a **different Azure Cosmos DB account**, it's required to create a separate client instance per account. The singleton pattern still applies for each client (one client for each account for the lifetime of the application), but if the volume of tenants is high, the number of clients can be difficult to manage. [Connections](sdk-connection-modes.md#direct-mode) can increase beyond the limits of the compute environment and cause [connectivity issues](conceptual-resilient-sdk-applications.md#client-instances-and-connections). 

It's recommended in these cases to:

* Understand the limitations of the compute environment (CPU and connection resources). We recommend using VMs with at least 4-cores and 8-GB memory whenever possible.
* Based on the limitations of the compute environment, determine the number of client instances (and therefore number of tenants) a single compute instance can handle. You can [estimate the number of connections](sdk-connection-modes.md#volume-of-connections) that will be opened per client depending on the connection mode chosen.
* Evaluate tenant distribution across instances. If each compute instance can successfully handle a certain limited amount of tenants, load balancing and routing of tenants to different compute instances would allow for scaling as the number of tenants grow.
* For sparse workloads, consider using a Least Frequently Used cache as the structure to hold the client instances and dispose clients for tenants that haven't been accessed within a time window. One option in .NET is [MemoryCacheEntryOptions](/dotnet/api/microsoft.extensions.caching.memory.memorycacheentryoptions), where [RegisterPostEvictionCallback](/dotnet/api/microsoft.extensions.caching.memory.memorycacheentryextensions.registerpostevictioncallback) can be used to **dispose inactive clients** and [SetSlidingExpiration](/dotnet/api/microsoft.extensions.caching.memory.memorycacheentryextensions.setslidingexpiration) can be used to define the maximum time to hold inactive connections.
* Evaluate using [Gateway mode](sdk-connection-modes.md#available-connectivity-modes) to reduce the number of network connections.
* When using [Direct mode](sdk-connection-modes.md#direct-mode) consider adjusting [CosmosClientOptions.IdleTcpConnectionTimeout](/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.idletcpconnectiontimeout) and [CosmosClientOptions.PortReuseMode](/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.portreusemode) on the [direct mode configuration](tune-connection-configurations-net-sdk-v3.md) to close unused connections and keep the [volume of connections](sdk-connection-modes.md#volume-of-connections) under control.

## Next steps

For a sample application that's used to evaluate Azure Cosmos DB for high-performance scenarios on a few client machines, see [Performance and scale testing with Azure Cosmos DB](performance-testing.md).

To learn more about designing your application for scale and high performance, see [Partitioning and scaling in Azure Cosmos DB](../partitioning-overview.md).

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
