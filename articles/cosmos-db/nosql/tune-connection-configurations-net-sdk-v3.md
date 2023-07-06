---
title: Connection configurations for Azure Cosmos DB .NET SDK v3
description: Learn how to tune connection configurations to improve Azure Cosmos DB database performance for .NET SDK v3
author: rinatmini
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: csharp
ms.topic: how-to
ms.date: 06/27/2023
ms.author: maquaran
ms.custom: devx-track-dotnet
---
# Tune connection configurations for Azure Cosmos DB .NET SDK v3

> [!IMPORTANT]  
> The information in this article are for Azure Cosmos DB .NET SDK v3 only. Please view the [Azure Cosmos DB SQL SDK connectivity modes](sdk-connection-modes.md) the Azure Cosmos DB .NET SDK v3 [Release notes](sdk-dotnet-v3.md), [Nuget repository](https://www.nuget.org/packages/Microsoft.Azure.Cosmos), and Azure Cosmos DB .NET SDK v3 [troubleshooting guide](troubleshoot-dotnet-sdk.md) for more information. If you are currently using an older version than v3, see the [Migrate to Azure Cosmos DB .NET SDK v3](migrate-dotnet-v3.md) guide for help upgrading to v3.

Azure Cosmos DB is a fast and flexible distributed database that scales seamlessly with guaranteed latency and throughput. You don't have to make major architecture changes or write complex code to scale your database with Azure Cosmos DB. Scaling up and down is as easy as making a single API call or SDK method call. However, because Azure Cosmos DB is accessed via network calls there are connection configurations you can tune to achieve peak performance when using Azure Cosmos DB .NET SDK v3.

## Connection configuration

> [!NOTE]
> In Azure Cosmos DB .NETS SDK v3, *Direct mode* is the best choice in most cases to improve database performance with most workloads.

To learn more about different connectivity options, see the [connectivity modes](sdk-connection-modes.md) article.

## Direct connection mode

.NET SDK default connection mode is direct. In direct mode, requests are made using the TCP protocol. Internally Direct mode uses a special architecture to dynamically manage network resources and get the best performance. The client-side architecture employed in Direct mode enables predictable network utilization and multiplexed access to Azure Cosmos DB replicas. To learn more about architecture, see the [direct mode connection architecture](sdk-connection-modes.md#direct-mode).

You configure the connection mode when you create the `CosmosClient` instance in `CosmosClientOptions`.

```csharp
string connectionString = "<your-account-connection-string>";
CosmosClient client = new CosmosClient(connectionString,
new CosmosClientOptions
{
    ConnectionMode = ConnectionMode.Gateway // ConnectionMode.Direct is the default
});
```

### Customizing direct connection mode

Direct mode can be customized through the *CosmosClientOptions* passed to the *CosmosClient* constructor. We recommend users avoid modifying these unless they feel comfortable in understanding the tradeoffs and it's necessary.

| Configuration option       | Default          | Recommended   | Details |
| :------------------:       | :-----:          | :---------:   | :-----: |
| EnableTcpConnectionEndpointRediscovery        | true           | true        | This represents the flag to enable detection of connections closing from the server. |
| IdleTcpConnectionTimeout        | By default, idle connections are kept open indefinitely.          | 20h-24h        | This represents the amount of idle time after which unused connections are closed. Recommended values are between 20 minutes and 24 hours. |
| MaxRequestsPerTcpConnection        | 30           | 30        | This represents the number of requests allowed simultaneously over a single TCP connection. When more requests are in flight simultaneously, the direct/TCP client opens extra connections. Don't set this value lower than four requests per connection or higher than 50-100 requests per connection. Applications with a high degree of parallelism per connection, with large requests or responses, or with tight latency requirements might get better performance with 8-16 requests per connection. |
| MaxTcpConnectionsPerEndpoint        | 65535           | 65535        | This represents the maximum number of TCP connections that may be opened to each Cosmos DB back-end. Together with MaxRequestsPerTcpConnection, this setting limits the number of requests that are simultaneously sent to a single Cosmos DB back-end(MaxRequestsPerTcpConnection x MaxTcpConnectionPerEndpoint). Value must be greater than or equal to 16. |
| OpenTcpConnectionTimeout      | 5 seconds     | >= 5 seconds  | This represents the amount of time allowed for trying to establish a connection. When the time elapses, the attempt is canceled and an error is returned. Longer timeouts delay retries and failures. |
| PortReuseMode      | PortReuseMode.ReuseUnicastPort     | PortReuseMode.ReuseUnicastPort  | This represents the client port reuse policy used by the transport stack. |

> [!NOTE]
> See also [Networking perfomance tips for direct connection mode](performance-tips-dotnet-sdk-v3.md?tabs=trace-net-core#networking)

#### Customizing gateway connection mode

The Gateway mode can be customized through the *CosmosClientOptions* passed to the *CosmosClient* constructor. We recommend users avoid modifying these unless they feel comfortable in understanding the tradeoffs and it's necessary.

| Configuration option       | Default          | Recommended   | Details |
| :------------------:       | :-----:          | :---------:   | :-----: |
| GatewayModeMaxConnectionLimit        | 50           | 50        | This represents the maximum number of concurrent connections allowed for the target service endpoint in the Azure Cosmos DB service. |
| WebProxy        |  null           |  null       | This represents the proxy information used for web requests. |

> [!NOTE]
> See also [Best practices when using Gateway mode for Azure Cosmos DB NET SDK v3](best-practice-dotnet.md#best-practices-when-using-gateway-mode).

## Next steps

To learn more about performance tips for .NET SDK, see [Performance tips for Azure Cosmos DB NET SDK v3](performance-tips-dotnet-sdk-v3.md).

* If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)