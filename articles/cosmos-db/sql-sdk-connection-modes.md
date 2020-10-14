---
title: Azure Cosmos DB SQL SDK connectivity modes
description: Learn about the different connectivity modes available on the Azure Cosmos DB SQL SDKs.
author: ealsur
ms.service: cosmos-db
ms.topic: how-to
ms.date: 10/14/2020
ms.author: maquaran
ms.custom: devx-track-dotnet

---

# Azure Cosmos DB SQL SDK connectivity modes

How a client connects to Azure Cosmos DB has important performance implications, especially for observed client-side latency. Azure Cosmos DB offers a simple, open RESTful programming model over HTTPS called gateway mode. Additionally, it offers an efficient TCP protocol, which is also RESTful in its communication model and uses TLS for initial authentication and encrypting traffic, called direct mode.

## Available connectivity modes

The two available connectivity modes are:

  * Gateway mode
      
    Gateway mode is supported on all SDK platforms. If your application runs within a corporate network with strict firewall restrictions, gateway mode is the best choice because it uses the standard HTTPS port and a single DNS endpoint. The performance tradeoff, however, is that gateway mode involves an additional network hop every time data is read from or written to Azure Cosmos DB. We also recommend gateway connection mode when you run applications in environments that have a limited number of socket connections.

    When you use the SDK in Azure Functions, particularly in the [Consumption plan](../azure-functions/functions-scale.md#consumption-plan), be aware of the current [limits on connections](../azure-functions/manage-connections.md).

  * Direct mode

    Direct mode supports connectivity through TCP protocol and offers better performance because there are fewer network hops. The application connects directly to the backend replicas. Direct mode is currently only supported on .NET and Java SDK platforms.
     
:::image type="content" source="./media/performance-tips/connection-policy.png" alt-text="The Azure Cosmos DB connectivity modes" border="false":::

These connectivity modes essentially condition the route that data plane requests - document reads and writes - take from your client machine to partitions in the Azure Cosmos DB back-end. Direct mode is the preferred option for best performance - it allows your client to open TCP connections directly to partitions in the Azure Cosmos DB back-end and send requests *direct*ly with no intermediary. By contrast, in Gateway mode, requests made by your client are routed to a so-called "Gateway" server in the Azure Cosmos DB front end, which in turn fans out your requests to the appropriate partition(s) in the Azure Cosmos DB back-end.

## Service port ranges

When you use direct mode, in addition to the gateway ports, you need to ensure the port range between 10000 and 20000 is open because Azure Cosmos DB uses dynamic TCP ports. When using direct mode on [private endpoints](./how-to-configure-private-endpoints.md), the full range of TCP ports - from 0 to 65535 should be open. If these ports aren't open and you try to use the TCP protocol, you might receive a 503 Service Unavailable error.

The following table shows a summary of the connectivity modes available for various APIs and the service ports used for each API:

|Connection mode  |Supported protocol  |Supported SDKs  |API/Service port  |
|---------|---------|---------|---------|
|Gateway  |   HTTPS    |  All SDKs    |   SQL (443), MongoDB (10250, 10255, 10256), Table (443), Cassandra (10350), Graph (443) <br> The port 10250 maps to a default Azure Cosmos DB API for MongoDB instance without geo-replication. Whereas the ports 10255 and 10256 map to the instance that has geo-replication.   |
|Direct    |     TCP    |  .NET SDK    | When using public/service endpoints: ports in the 10000 through 20000 range<br>When using private endpoints: ports in the 0 through 65535 range |

## Next steps

For specific SDK platform performance optimizations:

* [.NET V2 SDK performance tips](performance-tips.md)

* [.NET V3 SDK performance tips](performance-tips-dotnet-sdk-v3-sql.md)
 
* [Java V4 SDK performance tips](performance-tips-java-sdk-v4-sql.md)