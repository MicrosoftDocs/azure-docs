---
title: Azure Cosmos DB SQL SDK connectivity modes
description: Learn about the different connectivity modes available on the Azure Cosmos DB SQL SDKs.
author: ealsur
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 02/03/2023
ms.author: maquaran
ms.custom: contperf-fy21q2, ignite-2022
---

# Azure Cosmos DB SQL SDK connectivity modes
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

How a client connects to Azure Cosmos DB has important performance implications, especially for observed client-side latency. Azure Cosmos DB offers a simple, open RESTful programming model over HTTPS called gateway mode. Additionally, it offers an efficient TCP protocol, which is also RESTful in its communication model and uses TLS for initial authentication and encrypting traffic, called direct mode.

## Available connectivity modes

The two available connectivity modes are:

  * Gateway mode
      
    Gateway mode is supported on all SDK platforms. If your application runs within a corporate network with strict firewall restrictions, gateway mode is the best choice because it uses the standard HTTPS port and a single DNS endpoint. The performance tradeoff, however, is that gateway mode involves an additional network hop every time data is read from or written to Azure Cosmos DB. We also recommend gateway connection mode when you run applications in environments that have a limited number of socket connections.

    When you use the SDK in Azure Functions, particularly in the [Consumption plan](../../azure-functions/consumption-plan.md), be aware of the current [limits on connections](../../azure-functions/manage-connections.md).

  * Direct mode

    Direct mode supports connectivity through TCP protocol, using TLS for initial authentication and encrypting traffic, and offers better performance because there are fewer network hops. The application connects directly to the backend replicas. Direct mode is currently only supported on .NET and Java SDK platforms.
     
:::image type="content" source="./media/performance-tips/connection-policy.png" alt-text="The Azure Cosmos DB connectivity modes" border="false":::

These connectivity modes essentially condition the route that data plane requests - document reads and writes - take from your client machine to partitions in the Azure Cosmos DB back-end. Direct mode is the preferred option for best performance - it allows your client to open TCP connections directly to partitions in the Azure Cosmos DB back-end and send requests *direct*ly with no intermediary. By contrast, in Gateway mode, requests made by your client are routed to a so-called "Gateway" server in the Azure Cosmos DB front end, which in turn fans out your requests to the appropriate partition(s) in the Azure Cosmos DB back-end.

## Service port ranges

When you use direct mode, you need to ensure that your client can access ports ranging between 10000 and 20000 because Azure Cosmos DB uses dynamic TCP ports. This is in addition to the gateway ports. When using direct mode on [private endpoints](../how-to-configure-private-endpoints.md), the full range of TCP ports - from 0 to 65535 may be used by Azure Cosmos DB. If these ports aren't open on your client and you try to use the TCP protocol, you might receive a 503 Service Unavailable error.

The following table shows a summary of the connectivity modes available for various APIs and the service ports used for each API:

|Connection mode  |Supported protocol  |Supported SDKs  |API/Service port  |
|---------|---------|---------|---------|
|Gateway  |   HTTPS    |  All SDKs    |   SQL (443), MongoDB (10255), Table (443), Cassandra (10350), Graph (443) <br> |
|Direct    |     TCP (Encrypted via TLS)    |  .NET SDK Java SDK    | When using public/service endpoints: ports in the 10000 through 20000 range<br>When using private endpoints: ports in the 0 through 65535 range |

## <a id="direct-mode"></a> Direct mode connection architecture

As detailed in the [introduction](#available-connectivity-modes), Direct mode clients will directly connect to the backend nodes through TCP protocol. Each backend node represents a replica in a [replica set](../partitioning-overview.md#replica-sets) belonging to a [physical partition](../partitioning-overview.md#physical-partitions).

### Routing

When an Azure Cosmos DB SDK on Direct mode is performing an operation, it needs to resolve which backend replica to connect to. The first step is knowing which physical partition should the operation go to, and for that, the SDK obtains the container information that includes the [partition key definition](../partitioning-overview.md#choose-partitionkey) from a Gateway node. It also needs the routing information that contains the replicas' TCP addresses. The routing information is available also from Gateway nodes and both are considered [Control Plane metadata](../concepts-limits.md#control-plane). Once the SDK obtains the routing information, it can proceed to open the TCP connections to the replicas belonging to the target physical partition and execute the operations.

Each replica set contains one primary replica and three secondaries. Write operations are always routed to primary replica nodes while read operations can be served from primary or secondary nodes.

:::image type="content" source="./media/performance-tips/sdk-direct-mode.png" alt-text="Diagram that shows how S D Ks in direct mode fetch the container and routing information from Gateway before opening the T C P connections to the backend nodes" border="false":::

Because the container and routing information don't change often, it's cached locally on the SDKs so subsequent operations can benefit from this information. The TCP connections already established are also reused across operations. Unless otherwise configured through the SDKs options, connections are permanently maintained during the lifetime of the SDK instance.

As with any distributed architecture, the machines holding replicas might undergo upgrades or maintenance. The service will ensure the replica set maintains consistency but any replica movement would cause existing TCP addresses to change. In these cases, the SDKs need to refresh the routing information and re-connect to the new addresses through new Gateway requests. These events should not affect the overall P99 SLA.

### Volume of connections

Each physical partition has a replica set of four replicas, in order to provide the best possible performance, SDKs will end up opening connections to all replicas for workloads that mix write and read operations. Concurrent operations are load balanced across existing connections to take advantage of the throughput each replica provides.

There are two factors that dictate the number of TCP connections the SDK will open:

* Number of physical partitions

    In a steady state, the SDK will have one connection per replica per physical partition. The larger the number of physical partitions in a container, the larger the number of open connections will be. As operations are routed across different partitions, connections are established on demand. The average number of connections would then be the number of physical partitions times four.

* Volume of concurrent requests

    Each established connection can serve a configurable number of concurrent operations. If the volume of concurrent operations exceeds this threshold, new connections will be open to serve them, and it's possible that for a physical partition, the number of open connections exceeds the steady state number. This behavior is expected for workloads that might have spikes in their operational volume. For the .NET SDK this configuration is set by [CosmosClientOptions.MaxRequestsPerTcpConnection](/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.maxrequestspertcpconnection), and for the Java SDK you can customize using [DirectConnectionConfig.setMaxRequestsPerConnection](/java/api/com.azure.cosmos.directconnectionconfig.setmaxrequestsperconnection).

By default, connections are permanently maintained to benefit the performance of future operations (opening a connection has computational overhead). There might be some scenarios where you might want to close connections that are unused for some time understanding that this might affect future operations slightly. For the .NET SDK this configuration is set by [CosmosClientOptions.IdleTcpConnectionTimeout](/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.idletcpconnectiontimeout), and for the Java SDK you can customize using [DirectConnectionConfig.setIdleConnectionTimeout](/java/api/com.azure.cosmos.directconnectionconfig.setidleconnectiontimeout). It isn't recommended to set these configurations to low values as it might cause connections to be frequently closed and affect overall performance.

### Language specific implementation details

For further implementation details regarding a language see:

* [.NET SDK implementation information](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/docs/SdkDesign.md)
* [Java SDK direct mode information](tune-connection-configurations-java-sdk-v4.md#direct-connection-mode)

## Next steps

For specific SDK platform performance optimizations:

* [.NET V2 SDK performance tips](performance-tips.md)

* [.NET V3 SDK performance tips](performance-tips-dotnet-sdk-v3.md)
 
* [Java V4 SDK performance tips](performance-tips-java-sdk-v4.md)

* Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    * If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
    * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
