---
title: Diagnose and troubleshoot issues when using Azure Cosmos DB .NET SDK
description: Use features like client-side logging and other third-party tools to identify, diagnose, and troubleshoot Azure Cosmos DB issues when using .NET SDK.
author: anfeldma-ms
ms.service: cosmos-db
ms.date: 05/06/2020
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
Checking the [portal metrics](monitor-accounts.md) will help determine if it's a client-side issue or if there is an issue with the service. For example, if the metrics contain a high rate of rate-limited requests(HTTP status code 429) which means the request is getting throttled then check the [Request rate too large] section. 

### <a name="request-timeouts"></a>Requests timeouts
RequestTimeout usually happens when using Direct/TCP, but can happen in Gateway mode. These errors are the common known causes, and suggestions on how to fix the problem.

* CPU utilization is high, which will cause latency and/or request timeouts. The customer can scale up the host machine to give it more resources, or the load can be distributed across more machines.
* Socket / Port availability might be low. When running in Azure, clients using the .NET SDK can hit Azure SNAT (PAT) port exhaustion. To reduce the chance of hitting this issue, use the latest version 2.x or 3.x of the .NET SDK. This is an example of why it is recommended to always run the latest SDK version.
* Creating multiple DocumentClient instances might lead to connection contention and timeout issues. Follow the [performance tips](performance-tips.md), and use a single DocumentClient instance across an entire process.
* Users sometimes see elevated latency or request timeouts because their collections are provisioned insufficiently, the back-end throttles requests, and the client retries internally. Check the [portal metrics](monitor-accounts.md).
* Azure Cosmos DB distributes the overall provisioned throughput evenly across physical partitions. Check portal metrics to see if the workload is encountering a hot [partition key](partition-data.md). This will cause the aggregate consumed throughput (RU/s) to be appear to be under the provisioned RUs, but a single partition consumed throughput (RU/s) will exceed the provisioned throughput. 
* Additionally, the 2.0 SDK adds channel semantics to direct/TCP connections. One TCP connection is used for multiple requests at the same time. This can lead to two issues under specific cases:
    * A high degree of concurrency can lead to contention on the channel.
    * Large requests or responses can lead to head-of-line blocking on the channel and exacerbate contention, even with a relatively low degree of concurrency.
    * If the case falls in any of these two categories (or if high CPU utilization is suspected), these are possible mitigations:
        * Try to scale the application up/out.
        * Additionally, SDK logs can be captured through [Trace Listener](https://github.com/Azure/azure-cosmosdb-dotnet/blob/master/docs/documentdb-sdk_capture_etl.md) to get more details.

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

### <a name="snat"></a>Azure SNAT (PAT) port exhaustion

If your app is deployed on [Azure Virtual Machines without a public IP address](../load-balancer/load-balancer-outbound-connections.md#defaultsnat), by default [Azure SNAT ports](../load-balancer/load-balancer-outbound-connections.md#preallocatedports) establish connections to any endpoint outside of your VM. The number of connections allowed from the VM to the Azure Cosmos DB endpoint is limited by the [Azure SNAT configuration](../load-balancer/load-balancer-outbound-connections.md#preallocatedports). This situation can lead to connection throttling, connection closure, or the above mentioned [Request timeouts](#request-timeouts).

 Azure SNAT ports are used only when your VM has a private IP address is connecting to a public IP address. There are two workarounds to avoid Azure SNAT limitation (provided you already are using a single client instance across the entire application):

* Add your Azure Cosmos DB service endpoint to the subnet of your Azure Virtual Machines virtual network. For more information, see [Azure Virtual Network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md). 

    When the service endpoint is enabled, the requests are no longer sent from a public IP to Azure Cosmos DB. Instead, the virtual network and subnet identity are sent. This change might result in firewall drops if only public IPs are allowed. If you use a firewall, when you enable the service endpoint, add a subnet to the firewall by using [Virtual Network ACLs](../virtual-network/virtual-networks-acl.md).
* Assign a [public IP to your Azure VM](../load-balancer/troubleshoot-outbound-connection.md#assignilpip).

### HTTP proxy
If you use an HTTP proxy, make sure it can support the number of connections configured in the SDK `ConnectionPolicy`.
Otherwise, you face connection issues.

### <a name="request-rate-too-large"></a>Request rate too large
'Request rate too large' or error code 429 indicates that your requests are being throttled, because the consumed throughput (RU/s) has exceeded the [provisioned throughput](set-throughput.md). The SDK will automatically retry requests based on the specified [retry policy](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.connectionpolicy.retryoptions?view=azure-dotnet). If you get this failure often, consider increasing the throughput on the collection. Check the [portal's metrics](use-metrics.md) to see if you are getting 429 errors. Review your [partition key](partitioning-overview.md#choose-partitionkey) to ensure it results in an even distribution of storage and request volume. 

### Slow query performance
The [query metrics](sql-api-query-metrics.md) will help determine where the query is spending most of the time. From the query metrics, you can see how much of it is being spent on the back-end vs the client.
* If the back-end query returns quickly, and spends a large time on the client check the load on the machine. It's likely that there are not enough resource and the SDK is waiting for resources to be available to handle the response.
* If the back-end query is slow try [optimizing the query](optimize-cost-queries.md) and looking at the current [indexing policy](index-overview.md) 

### HTTP 401: The MAC signature found in the HTTP request is not the same as the computed signature
If you received the following 401 error message: "The MAC signature found in the HTTP request is not the same as the computed signature." it can be caused by the following scenarios.

1. The key was rotated and did not follow the [best practices](secure-access-to-data.md#key-rotation). This is usually the case. Cosmos DB account key rotation can take anywhere from a few seconds to possibly days depending on the Cosmos DB account size.
   1. 401 MAC signature is seen shortly after a key rotation and eventually stops without any changes. 
2. The key is misconfigured on the application so the key does not match the account.
   1. 401 MAC signature issue will be consistent and happens for all calls
3. There is a race condition with container creation. An application instance is trying to access the container before container creation is complete. The most common scenario for this if the application is running, and the container is deleted and recreated with the same name while the application is running. The SDK will attempt to use the new container, but the container creation is still in progress so it does not have the keys.
   1. 401 MAC signature issue is seen shortly after a container creation, and only occur until the container creation is completed.
 
 ### HTTP Error 400. The size of the request headers is too long.
 The size of the header has grown to large and is exceeding the maximum allowed size. It's always recommended to use the latest SDK. Make sure to use at least version [3.x](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/changelog.md) or [2.x](https://github.com/Azure/azure-cosmos-dotnet-v2/blob/master/changelog.md), which adds header size tracing to the exception message.

Causes:
 1. The session token has grown too large. The session token grows as the number of partitions increase in the container.
 2. The continuation token has grown to large. Different queries will have different continuation token sizes.
 3. It's caused by a combination of the session token and continuation token.

Solution:
   1. Follow the [performance tips](performance-tips.md) and convert the application to Direct + TCP connection mode. Direct + TCP does not have the header size restriction like HTTP does which avoids this issue.
   2. If the session token is the cause, then a temporary mitigation is to restart the application. Restarting the application instance will reset the session token. If the exceptions stop after the restart, then it confirms the session token is the cause. It will eventually grow back to the size that will cause the exception.
   3. If the application cannot be converted to Direct + TCP and the session token is the cause, then mitigation can be done by changing the client [consistency level](consistency-levels.md). The session token is only used for session consistency which is the default for Cosmos DB. Any other consistency level will not use the session token. 
   4. If the application cannot be converted to Direct + TCP and the continuation token is the cause, then try setting the ResponseContinuationTokenLimitInKb option. The option can be found in the FeedOptions for v2 or the QueryRequestOptions in v3.

 <!--Anchors-->
[Common issues and workarounds]: #common-issues-workarounds
[Enable client SDK logging]: #logging
[Request rate too large]: #request-rate-too-large
[Request Timeouts]: #request-timeouts
[Azure SNAT (PAT) port exhaustion]: #snat
[Production check list]: #production-check-list
