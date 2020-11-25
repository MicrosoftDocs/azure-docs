---
title: Diagnose and troubleshoot the availability of Azure Cosmos SDKs in multiregional environments
description: Learn all about the Azure Cosmos SDK availability behavior when operating in multi regional environments.
author: ealsur
ms.service: cosmos-db
ms.date: 10/20/2020
ms.author: maquaran
ms.subservice: cosmosdb-sql
ms.topic: troubleshooting
ms.reviewer: sngun
---
# Diagnose and troubleshoot the availability of Azure Cosmos SDKs in multiregional environments
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

This article describes the behavior of the latest version of Azure Cosmos SDKs when you see a connectivity issue to a particular region or when a region failover occurs.

All the Azure Cosmos SDKs give you an option to customize the regional preference. The following properties are used in different SDKs:

* The [ConnectionPolicy.PreferredLocations](/dotnet/api/microsoft.azure.documents.client.connectionpolicy.preferredlocations) property in .NET V2 SDK.
* The [CosmosClientOptions.ApplicationRegion](/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.applicationregion) or [CosmosClientOptions.ApplicationPreferredRegions](/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.applicationpreferredregions) properties in .NET V3 SDK.
* The [CosmosClientBuilder.preferredRegions](/java/api/com.azure.cosmos.cosmosclientbuilder.preferredregions) method in Java V4 SDK.
* The [CosmosClient.preferred_locations](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient) parameter in Python SDK.
* The [CosmosClientOptions.ConnectionPolicy.preferredLocations](/javascript/api/@azure/cosmos/connectionpolicy#preferredlocations) parameter in JS SDK.

When you set the regional preference, the client will connect to a region as mentioned in the following table:

|Account type |Reads |Writes |
|------------------------|--|--|
| Single write region | Preferred region | Primary region  |
| Multiple write regions | Preferred region | Preferred region  |

If you **don't set a preferred region**, the SDK client defaults to the primary region:

|Account type |Reads |Writes |
|------------------------|--|--|
| Single write region | Primary region | Primary region |
| Multiple write regions | Primary region  | Primary region  |

> [!NOTE]
> Primary region refers to the first region in the [Azure Cosmos account region list](distribute-data-globally.md)

Under normal circumstances, the SDK client will connect to the preferred region (if a regional preference is set) or to the primary region (if no preference is set), and the operations will be limited to that region, unless any of the below scenarios occur.

In these cases, the client using the Azure Cosmos SDK exposes logs and includes the retry information as part of the **operation diagnostic information**:

* The *RequestDiagnosticsString* property on responses in .NET V2 SDK.
* The *Diagnostics* property on responses and exceptions in .NET V3 SDK.
* The *getDiagnostics()* method on responses and exceptions in Java V4 SDK.

When determining the next region in order of preference, the SDK client will use the account region list, prioritizing the preferred regions (if any).

For a comprehensive detail on SLA guarantees during these events, see the [SLAs for availability](high-availability.md#slas-for-availability).

## <a id="remove-region"></a>Removing a region from the account

When you remove a region from an Azure Cosmos account, any SDK client that actively uses the account will detect the region removal through a backend response code. The client then marks the regional endpoint as unavailable. The client retries the current operation and all the future operations are permanently routed to the next region in order of preference.

## Adding a region to an account

Every 5 minutes, the Azure Cosmos SDK client reads the account configuration and refreshes the regions that it's aware of.

If you remove a region and later add it back to the account, if the added region has a higher regional preference order in the SDK configuration than the current connected region, the SDK will switch back to use this region permanently. After the added region is detected, all the future requests are directed to it.

If you configure the client to preferably connect to a region that the Azure Cosmos account does not have, the preferred region is ignored. If you add that region later, the client detects it and will switch permanently to that region.

## <a id="manual-failover-single-region"></a>Fail over the write region in a single write region account

If you initiate a failover of the current write region, the next write request will fail with a known backend response. When this response is detected, the client will query the account to learn the new write region and proceeds to retry the current operation and permanently route all future write operations to the new region.

## Regional outage

If the account is single write region and the regional outage occurs during a write operation, the behavior is similar to a [manual failover](#manual-failover-single-region). For read requests or multiple write regions accounts, the behavior is similar to [removing a region](#remove-region).

## Session consistency guarantees

When using [session consistency](consistency-levels.md#guarantees-associated-with-consistency-levels), the client needs to guarantee that it can read its own writes. In single write region accounts where the read region preference is different from the write region, there could be cases where the user issues a write and when doing a read from a local region, the local region has not yet received the data replication (speed of light constraint). In such cases, the SDK detects the specific failure on the read operation and retries the read on the primary region to ensure session consistency.

## Transient connectivity issues on TCP protocol

In scenarios where the Azure Cosmos SDK client is configured to use the TCP protocol, for a given request, there might be situations where the network conditions are temporarily affecting the communication with a particular endpoint. These temporary network conditions can surface as TCP timeouts. The client will retry the request locally on the same endpoint for some seconds.

If the user has configured a preferred region list with more than one region and the Azure Cosmos account is multiple write regions or single write region and the operation is a read request, the client will retry that single operation in the next region from the preference list.

## Next steps

* Review the [Availability SLAs](high-availability.md#slas-for-availability).
* Use the latest [.NET SDK](sql-api-sdk-dotnet-standard.md)
* Use the latest [Java SDK](sql-api-sdk-java-v4.md)
* Use the latest [Python SDK](sql-api-sdk-python.md)
* Use the latest [Node SDK](sql-api-sdk-node.md)
