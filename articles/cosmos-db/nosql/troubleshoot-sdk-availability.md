---
title: Diagnose and troubleshoot the availability of Azure Cosmos DB SDKs in multiregional environments
description: Learn all about the Azure Cosmos DB SDK availability behavior when operating in multi regional environments.
author: ealsur
ms.service: cosmos-db
ms.date: 03/10/2023
ms.author: maquaran
ms.subservice: nosql
ms.custom: ignite-2022
ms.topic: troubleshooting
ms.reviewer: mjbrown
---
# Diagnose and troubleshoot the availability of Azure Cosmos DB SDKs in multiregional environments
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This article describes the behavior of the latest version of Azure Cosmos DB SDKs when you see a connectivity issue to a particular region or when a region failover occurs.

All the Azure Cosmos DB SDKs give you an option to customize the regional preference. The following properties are used in different SDKs:

* The [ConnectionPolicy.PreferredLocations](/dotnet/api/microsoft.azure.documents.client.connectionpolicy.preferredlocations) property in .NET V2 SDK.
* The [CosmosClientOptions.ApplicationRegion](/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.applicationregion) or [CosmosClientOptions.ApplicationPreferredRegions](/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.applicationpreferredregions) properties in .NET V3 SDK.
* The [CosmosClientBuilder.preferredRegions](/java/api/com.azure.cosmos.cosmosclientbuilder.preferredregions) method in Java V4 SDK.
* The [CosmosClient.preferred_locations](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient) parameter in Python SDK.
* The [CosmosClientOptions.ConnectionPolicy.preferredLocations](/javascript/api/@azure/cosmos/connectionpolicy#preferredlocations) parameter in JS SDK.

When the SDK initializes with a configuration that specifies regional preference, it will first obtain the account information including the available regions from the global endpoint. It will then apply an intersection of the configured regional preference and the account's available regions and use the order in the regional preference to prioritize the result.

If the regional preference configuration contains regions that aren't an available region in the account, the values will be ignored. If these invalid regions are [added later to the account](#adding-a-region-to-an-account), the SDK will use them if they're higher in the preference configuration.

|Account type |Reads |Writes |
|------------------------|--|--|
| Single write region | Preferred region with highest order | Primary region  |
| Multiple write regions | Preferred region with highest order | Preferred region with highest order  |

If you **don't set a preferred region**, the SDK client defaults to the primary region:

|Account type |Reads |Writes |
|------------------------|--|--|
| Single write region | Primary region | Primary region |
| Multiple write regions | Primary region  | Primary region  |

> [!NOTE]
> Primary region refers to the first region in the [Azure Cosmos DB account region list](../distribute-data-globally.md).
> If the values specified as regional preference do not match with any existing Azure regions, they will be ignored. If they match an existing region but the account is not replicated to it, then the client will connect to the next preferred region that matches or to the primary region.

> [!WARNING]
> The failover and availability logic described in this document can be disabled on the client configuration, which is not advised unless the user application is going to handle availability errors itself. This can be achieved by:
>
> * Setting the [ConnectionPolicy.EnableEndpointDiscovery](/dotnet/api/microsoft.azure.documents.client.connectionpolicy.enableendpointdiscovery) property in .NET V2 SDK to false.
> * Setting the [CosmosClientOptions.LimitToEndpoint](/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.limittoendpoint) property in .NET V3 SDK to true.
> * Setting the [CosmosClientBuilder.endpointDiscoveryEnabled](/java/api/com.azure.cosmos.cosmosclientbuilder.endpointdiscoveryenabled) method in Java V4 SDK to false.
> * Setting the [CosmosClient.enable_endpoint_discovery](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient) parameter in Python SDK to false.
> * Setting the [CosmosClientOptions.ConnectionPolicy.enableEndpointDiscovery](/javascript/api/@azure/cosmos/connectionpolicy#enableEndpointDiscovery) parameter in JS SDK to false.

Under normal circumstances, the SDK client will connect to the preferred region (if a regional preference is set) or to the primary region (if no preference is set), and the operations will be limited to that region, unless any of the below scenarios occur.

In these cases, the client using the Azure Cosmos DB SDK exposes logs and includes the retry information as part of the **operation diagnostic information**:

* The *RequestDiagnosticsString* property on responses in .NET V2 SDK.
* The *Diagnostics* property on responses and exceptions in .NET V3 SDK.
* The *getDiagnostics()* method on responses and exceptions in Java V4 SDK.

When determining the next region in order of preference, the SDK client will use the account region list, prioritizing the preferred regions (if any).

For a comprehensive detail on SLA guarantees during these events, see the [SLAs for availability](../high-availability.md#slas).

## <a id="remove-region"></a>Removing a region from the account

When you remove a region from an Azure Cosmos DB account, any SDK client that actively uses the account will detect the region removal through a backend response code. The client then marks the regional endpoint as unavailable. The client retries the current operation and all the future operations are permanently routed to the next region in order of preference. In case the preference list only had one entry (or was empty) but the account has other regions available, it will route to the next region in the account list.

## Adding a region to an account

Every 5 minutes, the Azure Cosmos DB SDK client reads the account configuration and refreshes the regions that it's aware of.

If you remove a region and later add it back to the account, if the added region has a higher regional preference order in the SDK configuration than the current connected region, the SDK will switch back to use this region permanently. After the added region is detected, all the future requests are directed to it.

If you configure the client to preferably connect to a region that the Azure Cosmos DB account doesn't have, the preferred region is ignored. If you add that region later, the client detects it, and will switch permanently to that region.

## <a id="manual-failover-single-region"></a>Fail over the write region in a single write region account

If you initiate a failover of the current write region, the next write request will fail with a known backend response. When this response is detected, the client will query the account to learn the new write region, and proceed to retry the current operation and permanently route all future write operations to the new region.

## Regional outage

If the account is single write region and the regional outage occurs during a write operation, the behavior is similar to a [manual failover](#manual-failover-single-region). For read requests or multiple write regions accounts, the behavior is similar to [removing a region](#remove-region).

## Session consistency guarantees

When using [session consistency](../consistency-levels.md#guarantees-associated-with-consistency-levels), the client needs to guarantee that it can read its own writes. In single write region accounts where the read region preference is different from the write region, there could be cases where the user issues a write and then does a read from a local region, the local region hasn't yet received the data replication (speed of light constraint). In such cases, the SDK receives a specific failure from the service on the read operation and retries the read on the primary region to ensure session consistency. For accounts with multiple write regions, the same session semantics apply but because there are multiple write regions available, retries are issued using the preferred region list or account's region order.

## Transient connectivity issues on TCP protocol

In scenarios where the Azure Cosmos DB SDK client is configured to use the TCP protocol, for a given request, there might be situations where the network conditions are temporarily affecting the communication with a particular endpoint. These temporary network conditions can surface as TCP timeouts and Service Unavailable (HTTP 503) errors. The client will, if possible, [retry the request locally](conceptual-resilient-sdk-applications.md#timeouts-and-connectivity-related-failures-http-408503) on the same endpoint for some seconds.

If the user has configured a preferred region list with more than one region and the client exhausted all local retries, it can attempt to retry that single operation in the next region from the preference list. Write operations can only be retried in other region if the Azure Cosmos DB account has multiple write regions enabled, while read operations can be retried in any available region.

## Next steps

* Review the [Availability SLAs](../high-availability.md#slas).
* Use the latest [.NET SDK](sdk-dotnet-v3.md)
* Use the latest [Java SDK](sdk-java-v4.md)
* Use the latest [Python SDK](sdk-python.md)
* Use the latest [Node SDK](sdk-nodejs.md)
