---
title: Diagnose and troubleshoot issues when using Azure Cosmos DB .NET SDK
description: Use features like client-side logging and other third-party tools to identify, diagnose, and troubleshoot Azure Cosmos DB issues when using .NET SDK.
author: anfeldma-ms
ms.service: cosmos-db
ms.date: 06/16/2020
ms.author: anfeldma
ms.subservice: cosmosdb-sql
ms.topic: troubleshooting
ms.reviewer: sngun
---
# Diagnose and troubleshoot issues when using Azure Cosmos DB .NET SDK

> [!div class="op_single_selector"]
> * [Java SDK v4](troubleshoot-java-sdk-v4-sql.md)
> * [Async Java SDK v2](troubleshoot-java-async-sdk.md)
> * [.NET](troubleshoot-dot-net-sdk.md)
> 

This article covers common issues, workarounds, diagnostic steps, and tools when you use the [.NET SDK](sql-api-sdk-dotnet.md) with Azure Cosmos DB SQL API accounts.
The .NET SDK provides client-side logical representation to access the Azure Cosmos DB SQL API. This article describes tools and approaches to help you if you run into any issues.

## Checklist for troubleshooting issues
Consider the following checklist before you move your application to production. Using the checklist will prevent several common issues you might see. You can also quickly diagnose when an issue occurs:

*    Use the latest [SDK](sql-api-sdk-dotnet-standard.md). Preview SDKs should not be used for production. This will prevent hitting known issues that are already fixed.
*    Review the [performance tips](performance-tips.md), and follow the suggested practices. This will help prevent scaling, latency, and other performance issues.
*    Enable the SDK logging to help you troubleshoot an issue. Enabling the logging may affect performance so it's best to enable it only when troubleshooting issues. You can enable the following logs:
*    [Log metrics](monitor-accounts.md) by using the Azure portal. Portal metrics show the Azure Cosmos DB telemetry, which is helpful to determine if the issue corresponds to Azure Cosmos DB or if it's from the client side.
*    Log the [diagnostics string](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.resourceresponsebase.requestdiagnosticsstring) in the V2 SDK or [diagnostics](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmos.responsemessage.diagnostics) in V3 SDK from the point operation responses.
*    Log the [SQL Query Metrics](sql-api-query-metrics.md) from all the query responses 
*    Follow the setup for [SDK logging]( https://github.com/Azure/azure-cosmos-dotnet-v2/blob/master/docs/documentdb-sdk_capture_etl.md)

Take a look at the [Common issues and workarounds](#common-issues-workarounds) section in this article.

Check the [GitHub issues section](https://github.com/Azure/azure-cosmos-dotnet-v2/issues) that's actively monitored. Check to see if any similar issue with a workaround is already filed. If you didn't find a solution, then file a GitHub issue. You can open a support tick for urgent issues.


## <a name="common-issues-workarounds"></a>Common issues and workarounds

### General suggestions
* Run your app in the same Azure region as your Azure Cosmos DB account, whenever possible. 
* You may run into connectivity/availability issues due to lack of resources on your client machine. We recommend monitoring your CPU utilization on nodes running the Azure Cosmos DB client, and scaling up/out if they're running at high load.

### Check the portal metrics
Checking the [portal metrics](monitor-accounts.md) will help determine if it's a client-side issue or if there is an issue with the service. For example, if the metrics contain a high rate of rate-limited requests(HTTP status code 429) which means the request is getting throttled then check the [Request rate too large](troubleshoot-request-rate-too-large.md) section. 

## Common error status codes <a id="error-codes"></a>

| Status Code | Title | Description |
|----------|-------------|------|
| 400 | Bad request | User's need to troubleshoot this based on the error message as this mostly points to a bug in user's code which causes the request to be invalid. For example passing the wrong partition key for an item will result in an bad request. | 
| 401 | [Not authorized](troubleshoot-unauthorized.md) | User's application should have retry logic for some corner scenarios, but most likely require user to manually fix | 
| 404 | [Resource is not found](troubleshoot-not-found.md) | User's application should handle this scenario. |
| 408 | [Request timed out](troubleshoot-dot-net-sdk-request-timeout.md)| There are many transient scenarios that can cause this. |
| 409 | Conflict (Only for Create/Replace/Upsert) | User's application should handle the conflict |
| 410 | Gone exceptions | SDK handles the retries. If the retry logic is exceeded it will get converted to a 503 error. This can be caused by many scenarios like partition was moved to a larger machine because of a scaling operation. This is an expected exception and will not impact the Cosmos DB SLA. |
| 413 | [Request Entity Too Large](https://docs.microsoft.com/azure/cosmos-db/concepts-limits#per-item-limits) | User's application should handle the payload being to large |
| 429 | [Too many requests](troubleshoot-request-rate-too-large.md) | The SDK has built in logic, and it is user configurable for most SDKs |
| 500 | Azure Cosmos DB failure | User's application should have retry logic. |
| 503 | Was not able to reach Azure Cosmos DB | User's application should have retry logic. |

### <a name="high-network-latency"></a>High network latency
High network latency can be identified by using the [diagnostics string](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.resourceresponsebase.requestdiagnosticsstring?view=azure-dotnet) in the V2 SDK or [diagnostics](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmos.responsemessage.diagnostics?view=azure-dotnet#Microsoft_Azure_Cosmos_ResponseMessage_Diagnostics) in V3 SDK.

If no [timeouts](#request-timeouts) are present and the diagnostics show single requests where the high latency is evident on the difference between `ResponseTime` and `RequestStartTime`, like so (>300 milliseconds in this example):

```bash
RequestStartTime: 2020-03-09T22:44:49.5373624Z, RequestEndTime: 2020-03-09T22:44:49.9279906Z,  Number of regions attempted:1
ResponseTime: 2020-03-09T22:44:49.9279906Z, StoreResult: StorePhysicalAddress: rntbd://..., ...
```

This latency can have multiple causes:

* Your application is not running in the same region as your Azure Cosmos DB account.
* Your [PreferredLocations](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.connectionpolicy.preferredlocations) or [ApplicationRegion](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.applicationregion) configuration is incorrect and is trying to connect to a different region to where your application is currently running on.
* There might be a bottleneck on the Network interface because of high traffic. If the application is running on Azure Virtual Machines, there are possible workarounds:
    * Consider using a [Virtual Machine with Accelerated Networking enabled](../virtual-network/create-vm-accelerated-networking-powershell.md).
    * Enable [Accelerated Networking on an existing Virtual Machine](../virtual-network/create-vm-accelerated-networking-powershell.md#enable-accelerated-networking-on-existing-vms).
    * Consider using a [higher end Virtual Machine](../virtual-machines/windows/sizes.md).

### Slow query performance
The [query metrics](sql-api-query-metrics.md) will help determine where the query is spending most of the time. From the query metrics, you can see how much of it is being spent on the back-end vs the client.
* If the back-end query returns quickly, and spends a large time on the client check the load on the machine. It's likely that there are not enough resource and the SDK is waiting for resources to be available to handle the response.
* If the back-end query is slow try [optimizing the query](optimize-cost-queries.md) and looking at the current [indexing policy](index-overview.md) 

 <!--Anchors-->
[Common issues and workarounds]: #common-issues-workarounds
[Enable client SDK logging]: #logging
[Request rate too large]: #request-rate-too-large
[Request Timeouts]: #request-timeouts
[Azure SNAT (PAT) port exhaustion]: #snat
[Production check list]: #production-check-list
