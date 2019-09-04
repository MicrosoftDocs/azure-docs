---
title: Diagnose and troubleshoot issues when using Azure Cosmos DB .NET SDK
description: Use features like client-side logging and other third-party tools to identify, diagnose, and troubleshoot Azure Cosmos DB issues when using .NET SDK.
author: j82w
ms.service: cosmos-db
ms.date: 05/28/2019
ms.author: jawilley
ms.subservice: cosmosdb-sql
ms.topic: troubleshooting
ms.reviewer: sngun
---
# Diagnose and troubleshoot issues when using Azure Cosmos DB .NET SDK
This article covers common issues, workarounds, diagnostic steps, and tools when you use the [.NET SDK](sql-api-sdk-dotnet.md) with Azure Cosmos DB SQL API accounts.
The .NET SDK provides client-side logical representation to access the Azure Cosmos DB SQL API. This article describes tools and approaches to help you if you run into any issues.

## Checklist for troubleshooting issues:
Consider the following checklist before you move your application to production. Using the checklist will prevent several common issues you might see. You can also quickly diagnose when an issue occurs:

*	Use the latest [SDK](https://github.com/Azure/azure-cosmos-dotnet-v2/blob/master/changelog.md). Preview SDKs should not be used for production. This will prevent hitting known issues that are already fixed.
*	Review the [performance tips](performance-tips.md), and follow the suggested practices. This will help prevent scaling, latency, and other performance issues.
*	Enable the SDK logging to help you troubleshoot an issue. Enabling the logging may affect performance so it’s best to enable it only when troubleshooting issues. You can enable the following logs:
    *	[Log metrics](monitor-accounts.md) by using the Azure portal. Portal metrics show the Azure Cosmos DB telemetry, which is helpful to determine if the issue corresponds to Azure Cosmos DB or if it’s from the client side.
    *	Log the [diagnostics string](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.resourceresponsebase.requestdiagnosticsstring?view=azure-dotnet) from the point operation responses.
    *	Log the [SQL Query Metrics](sql-api-query-metrics.md) from all the query responses 
    *	Follow the setup for [SDK logging]( https://github.com/Azure/azure-cosmos-dotnet-v2/blob/master/docs/documentdb-sdk_capture_etl.md)

Take a look at the [Common issues and workarounds](#common-issues-workarounds) section in this article.

Check the [GitHub issues section](https://github.com/Azure/azure-cosmos-dotnet-v2/issues) that's actively monitored. Check to see if any similar issue with a workaround is already filed. If you didn't find a solution, then file a GitHub issue. You can open a support tick for urgent issues.


## <a name="common-issues-workarounds"></a>Common issues and workarounds

### General suggestions
* Run your app in the same Azure region as your Azure Cosmos DB account, whenever possible. 
* You may run into connectivity/availability issues due to lack of resources on your client machine. We recommend monitoring your CPU utilization on nodes running the Azure Cosmos DB client, and scaling up/out if they're running at high load.

### Check the portal metrics
Checking the [portal metrics](monitor-accounts.md) will help determine if it's a client side issue or if there is an issue with the service. For example if the metrics contain a high rate of rate-limited requests(HTTP status code 429) which means the request is getting throttled then check the [Request rate too large] section. 

### <a name="request-timeouts"></a>Requests timeouts
RequestTimeout usually happens when using Direct/TCP, but can happen in Gateway mode. These are the common known causes, and suggestions on how to fix the problem.

* CPU utilization is high, which will cause latency and/or request timeouts. The customer can scale up the host machine to give it more resources, or the load can be distributed across more machines.
* Socket / Port availability might be low. When using the .NET SDKs released before the 2.0 version, clients running in Azure could hit the [Azure SNAT (PAT) port exhaustion]. This an example of why it is recommended to always run the latest SDK version.
* Creating multiple DocumentClient instances might lead to connection contention and timeout issues. Follow the [performance tips](performance-tips.md), and use a single DocumentClient instance across an entire process.
* Users sometimes see elevated latency or request timeouts because their collections are provisioned insufficiently, the back-end throttles requests, and the client retries internally without surfacing this to the caller. Check the [portal metrics](monitor-accounts.md).
* Azure Cosmos DB distributes the overall provisioned throughput evenly across physical partitions. Check portal metrics to see if the workload is encountering a hot [partition key](partition-data.md). This will cause the aggregate consumed throughput (RU/s) to be appear to be under the provisioned RUs, but a single partition consumed throughput (RU/s) will exceed the provisioned throughput. 
* Additionally, the 2.0 SDK adds channel semantics to direct/TCP connections. One TCP connection is used for multiple requests at the same time. This can lead to two issues under specific cases:
    * A high degree of concurrency can lead to contention on the channel.
    * Large requests or responses can lead to head-of-line blocking on the channel and exacerbate contention, even with a relatively low degree of concurrency.
    * If the case falls in any of these two categories (or if high CPU utilization is suspected), these are possible mitigations:
        * Try to scale the application up/out.
        * Additionally, SDK logs can be captured through [Trace Listener](https://github.com/Azure/azure-cosmosdb-dotnet/blob/master/docs/documentdb-sdk_capture_etl.md) to get more details.

### Connection throttling
Connection throttling can happen because of a connection limit on a host machine. Previous to 2.0, clients running in Azure could hit the [Azure SNAT (PAT) port exhaustion].

### <a name="snat"></a>Azure SNAT (PAT) port exhaustion

If your app is deployed on Azure Virtual Machines without a public IP address, by default [Azure SNAT ports](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections#preallocatedports) establish connections to any endpoint outside of your VM. The number of connections allowed from the VM to the Azure Cosmos DB endpoint is limited by the [Azure SNAT configuration](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections#preallocatedports).

 Azure SNAT ports are used only when your VM has a private IP address and a process from the VM tries to connect to a public IP address. There are two workarounds to avoid Azure SNAT limitation:

* Add your Azure Cosmos DB service endpoint to the subnet of your Azure Virtual Machines virtual network. For more information, see [Azure Virtual Network service endpoints](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview). 

    When the service endpoint is enabled, the requests are no longer sent from a public IP to Azure Cosmos DB. Instead, the virtual network and subnet identity are sent. This change might result in firewall drops if only public IPs are allowed. If you use a firewall, when you enable the service endpoint, add a subnet to the firewall by using [Virtual Network ACLs](https://docs.microsoft.com/azure/virtual-network/virtual-networks-acl).
* Assign a public IP to your Azure VM.

### HTTP proxy
If you use an HTTP proxy, make sure it can support the number of connections configured in the SDK `ConnectionPolicy`.
Otherwise, you face connection issues.

### Request rate too large<a name="request-rate-too-large"></a>
'Request rate too large' or error code 429 indicates that your requests are being throttled, because the consumed throughput (RU/s) has exceeded the provisioned throughput. The SDK will automatically retry requests based on the specified [retry policy](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.connectionpolicy.retryoptions?view=azure-dotnet). If you get this failure often, consider increasing the throughput on the collection. Check the [portal’s metrics](use-metrics.md) to see if you are getting 429 errors. Review your [partition key](https://docs.microsoft.com/azure/cosmos-db/partitioning-overview#choose-partitionkey) to ensure it results in an even distribution of storage and request volume. 

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


