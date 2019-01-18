---
title: Diagnose and troubleshoot Azure Cosmos DB Dot Net SDK
description: Use features like client-side logging and other third-party tools to identify, diagnose, and troubleshoot Azure Cosmos DB issues.
author: jawilley
ms.service: cosmos-db
ms.topic: article
ms.date: 01/19/2019
ms.author: jawilley
ms.devlang: c#
ms.subservice: cosmosdb-sql
ms.topic: troubleshooting
ms.reviewer: 
---

# Troubleshoot issues when you use the Dot Net SDK with Azure Cosmos DB SQL API accounts
This article covers common issues, workarounds, diagnostic steps, and tools when you use the [Dot Net SDK](sql-api-sdk-dotnet.md) with Azure Cosmos DB SQL API accounts.
The Dot Net SDK provides client-side logical representation to access the Azure Cosmos DB SQL API. This article describes tools and approaches to help you if you run into any issues.

## Start with this list:

* Upgrade to the latest SDK when possible. The SDK is constantly being updated to add [improvements and fixes](https://github.com/Azure/azure-cosmos-dotnet-v2/blob/master/changelog.md). Note that some of the changes may not seem relevant to the issue you are hitting, but they actually are. For examples fixes around caches can fix null reference, partition key, and not found exceptions.
* Review the [performance tips](performance-tips.md), and follow the suggested practices.
* Take a look at the [Common issues and workarounds] section in this article.
* Look at the SDK, which is available [open source on GitHub](https://github.com/Azure/azure-cosmos-dotnet-v2). It has an [issues section](https://github.com/Azure/azure-cosmos-dotnet-v2/issues) that's actively monitored. Check to see if any similar issue with a workaround is already filed.
* Read the rest of this article, if you didn't find a solution. Then file a [GitHub issue](https://github.com/Azure/azure-cosmos-dotnet-v2/issues).

## Check the portal metrics
Checking the [portal metrics](https://docs.microsoft.com/azure/cosmos-db/monitor-accounts) will help determine if it's a client side issue or if there is an issue with the service. For example if you are seeing a lot of 429s which means the request is getting throttled then check the [Request rate too large] section.  

## <a name="enable-client-side-logging"></a>Enable client SDK logging

* [SDK logging](https://github.com/Azure/azure-cosmos-dotnet-v2/blob/master/docs/documentdb-sdk_capture_etl.md) 
* [SQL Query Metrics](https://docs.microsoft.com/azure/cosmos-db/sql-api-query-metrics)

## <a name="common-issues-workarounds"></a>Common issues and workarounds

### <a name="request-timeouts"></a>Requests timeouts
RequestTimeout usually happens when using Direct/TCP and:

* CPU utilization is high which will cause latency and/or request timeouts. The customer can scale up the host machine to give it more resources, or the load can be distributed across more machines.
* Socket / Port availability might be low. Previous to 2.0 SDK, clients running in Azure could hit the [Azure SNAT (PAT) port exhaustion]. This an example of why it is recommended to always run the latest SDK version.
* The application is not following the [performance tips](performance-tips.md), and use one DocumentClient per request. This has an enormous overhead. Customer must share a single DocumentClient instance across an entire process.
* Users sometimes see elevated latency or request timeouts because their collections are provisioned insufficiently, the back-end throttles requests, and the client retries internally without surfacing this to the caller. Check the [portal metrics](https://docs.microsoft.com/azure/cosmos-db/monitor-accounts).
* Hot [partition keys](https://docs.microsoft.com/azure/cosmos-db/partition-data) can cause throttling on the overloaded partitions, while aggregate RU utilization looks low.
* Splits cause provisioned RUs to also get split between the new partitions. This can lead to hot keys being in partitions with low provisioned RUs under pathological circumstances.
* Additionally, the 2.0 SDK adds channel semantics to direct/TCP connections. One TCP connection is used for multiple requests at the same time. This can lead to two issues under specific cases:
    * A high degree of concurrency can lead to contention on the channel (more than ~12 threads acting on a single connection).
    * Large requests or responses can lead to head-of-line blocking on the channel and exacerbate contention, even with a relatively low degree of concurrency.
    * If the case falls in any of these two categories (or if high CPU utilization is suspected), these are possible mitigations:
        * For batch jobs, try to ensure that 10-second CPU utilization stays under 90% in steady state. For latency-sensitive jobs, try to ensure that 10-second CPU utilization stays under 40% in steady state.
        * Additionally, SDK logs can be captured through [Trace Listener](https://github.com/Azure/azure-cosmosdb-dotnet/blob/master/docs/documentdb-sdk_capture_etl.md) to get more details.

### Network issues, low throughput, high latency

#### General suggestions
* Make sure the app is running on the same region as your Azure Cosmos DB account. 
* Check the CPU usage on the host where the app is running. If CPU usage is 90 percent or more, run your app on a host with a higher configuration. Or you can distribute the load on more machines.

#### Connection throttling
Connection throttling can happen because of a connection limit on a host machine. Previous to 2.0, clients running in Azure could hit the [Azure SNAT (PAT) port exhaustion].

##### <a name="snat"></a>Azure SNAT (PAT) port exhaustion

If your app is deployed on Azure Virtual Machines without a public IP address, by default [Azure SNAT ports](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections#preallocatedports) establish connections to any endpoint outside of your VM. The number of connections allowed from the VM to the Azure Cosmos DB endpoint is limited by the [Azure SNAT configuration](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections#preallocatedports).

 Azure SNAT ports are used only when your VM has a private IP address and a process from the VM tries to connect to a public IP address. There are two workarounds to avoid Azure SNAT limitation:

* Add your Azure Cosmos DB service endpoint to the subnet of your Azure Virtual Machines virtual network. For more information, see [Azure Virtual Network service endpoints](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview). 

    When the service endpoint is enabled, the requests are no longer sent from a public IP to Azure Cosmos DB. Instead, the virtual network and subnet identity are sent. This change might result in firewall drops if only public IPs are allowed. If you use a firewall, when you enable the service endpoint, add a subnet to the firewall by using [Virtual Network ACLs](https://docs.microsoft.com/azure/virtual-network/virtual-networks-acl).
* Assign a public IP to your Azure VM.

#### HTTP proxy

If you use an HTTP proxy, make sure it can support the number of connections configured in the SDK `ConnectionPolicy`.
Otherwise, you face connection issues.

#### Request rate too large<a name="request-rate-too-large"></a>
This failure is a server-side failure. It indicates that you consumed your provisioned throughput. Retry later. If you get this failure often, consider an increase in the collection throughput. Please use the portal's [metrics](https://docs.microsoft.com/azure/cosmos-db/use-metrics) to check if you are getting 429s errors which represents the requests getting throttled.

## Slow query performance

### Log query metrics
The [query metrics](https://docs.microsoft.com/azure/cosmos-db/sql-api-query-metrics) will help determine where the query is spending most of the time. From the query metrics you can see how much of it is being spent on the backend vs the client.
* If the back end query returns quickly, and spends a large time on the client check the load on the machine. It's likely that there are not enough resource and the client has to wait to handle the response.
* If the back end query is slow try [optimizing the query](https://docs.microsoft.com/azure/cosmos-db/optimize-cost-queries) and looking at the current [indexing policy](https://docs.microsoft.com/azure/cosmos-db/index-overview) 


 <!--Anchors-->
[Common issues and workarounds]: #common-issues-workarounds
[Enable client SDK logging]: #enable-client-side-logging
[Request rate too large]: #request-rate-too-large
[Request Timeouts]: #request-timeouts
[Azure SNAT (PAT) port exhaustion]: #snat


