---
title: Diagnose and troubleshoot Azure Cosmos SDK availability behavior
description: Learn all about the Azure Cosmos SDK availability behavior when operating in multi regional environments.
author: ealsur
ms.service: cosmos-db
ms.date: 09/04/2020
ms.author: maquaran
ms.subservice: cosmosdb-sql
ms.topic: troubleshooting
ms.reviewer: sngun
---
# Diagnose and troubleshoot Azure Cosmos SDK availability behavior

This article describes the behavior of the most recent Azure Cosmos SDKs when a connectivity issue happens to a particular region or when a region is involved in a failover.

All Azure Cosmos SDKs give users the option to customize the regional preference:

* [ConnectionPolicy.PreferredLocations](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.connectionpolicy.preferredlocations) in .NET V2 SDK.
* [CosmosClientOptions.ApplicationRegion](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.applicationregion) or [CosmosClientOptions.ApplicationPreferredRegions](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.applicationpreferredregions) in .NET V3 SDK.
* [CosmosClientBuilder.preferredRegions](https://docs.microsoft.com/java/api/com.azure.cosmos.cosmosclientbuilder.preferredregions) in Java V4 SDK.

For single-master accounts, all write operations will always go to the write region, so the preference list applies for read operations. For multi-master accounts, the preference list affects read and write operations.

If the user is not setting a preference, the regional preference order is defined by the [Azure Cosmos region list order](distribute-data-globally.md).

When any of the following scenarios happen, the Azure Cosmos SDK client will expose logs and include the retry information as part of the **operation diagnostic information**.

## Removing a region from the Azure Cosmos account

When a region is removed from an account, any Azure Cosmos SDK client that was actively using it will detect the case through a backend response code and mark the regional endpoint as unavailable. After the region is marked as unavailable, the current operation will be retried and all future operations permanently routed to the next region in order of preference.

## Adding a region to an Azure Cosmos account

Every 5 minutes, the Azure Cosmos SDK client reads the Azure Cosmos account configuration, and refreshes the regions that it's aware of.

If the region removed in the previous step is later added back to the account, since this region has a higher preference on the Azure Cosmos SDK configuration, the Azure Cosmos SDK will then switch back to use this region permanently for all future requests after its detection.

If the user configures the Azure Cosmos SDK client to connect preferably to a region that the Azure Cosmos account does not have initially, that preference will get ignored. But if the region is later added, the client will switch permanently to that region after its detection.

## Failing over the write region in a single-master Azure Cosmos account

If the user initiates a failover of the current write region, the next write request will fail with a known backend response. Upon detecting it, the Azure Cosmos SDK client will query the account information to understand which is the new write region and proceed to retry the current operation and permanently route all future write operations to the new region.

## Regional outage

If the account is single-master and the regional outage is for a write operation, the behavior is similar to a [manual failover](#failing-over-the-write-region-in-a-single-master-azure-cosmos-account). For read requests or multi-master accounts, the behavior is similar to [removing a region](#removing-a-region-from-the-azure-cosmos-account).

## Session consistency guarantees

When using [session consistency](consistency-levels.md#guarantees-associated-with-consistency-levels), the Azure Cosmos SDK client needs to guarantee that the client can read its own writes. In single-master accounts where the read region preference is different from the write region, there could be cases where the user issues a write and when doing a read from a local region, the local region has not yet received the data replication (speed of light constraint), in this case, the Azure Cosmos SDK detects the specific failure on the read operation and retries the read on the hub region to ensure session consistency. This does not affect any other future operations.

## Transient connectivity issues on TCP protocol

In scenarios where the Azure Cosmos SDK client is configured to use TCP protocol, there might be occurrences where network conditions are temporarily affecting the communication with a particular endpoint for a given request. These temporary network conditions can surface as TCP timeouts. The Azure Cosmos SDK client will retry the request locally on the same endpoint for some seconds.

If the user has configured a preferred region list with more than one region and the Azure Cosmos account is multi-master or single-master and the operation is a read request, the Azure Cosmos SDK client will retry that single operation in the next region from the preference list. This does not affect any other future operations.

## Next steps

* Use the latest [.NET SDK](sql-api-sdk-dotnet-standard.md)
* Use the latest [Java SDK](sql-api-sdk-java-v4.md)
* Use the latest [Python SDK](sql-api-sdk-python.md)
* Use the latest [Node SDK](sql-api-sdk-node.md)