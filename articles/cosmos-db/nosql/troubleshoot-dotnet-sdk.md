---
title: Diagnose and troubleshoot issues when using Azure Cosmos DB .NET SDK
description: Use features like client-side logging and other third-party tools to identify, diagnose, and troubleshoot Azure Cosmos DB issues when using .NET SDK.
author: seesharprun
ms.service: cosmos-db
ms.date: 09/01/2022
ms.author: sidandrews
ms.reviewer: mjbrown
ms.subservice: nosql
ms.topic: troubleshooting
ms.custom: devx-track-dotnet, ignite-2022
---
# Diagnose and troubleshoot issues when using Azure Cosmos DB .NET SDK
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

> [!div class="op_single_selector"]
> * [Java SDK v4](troubleshoot-java-sdk-v4.md)
> * [Async Java SDK v2](troubleshoot-java-async-sdk.md)
> * [.NET](troubleshoot-dotnet-sdk.md)
> 

This article covers common issues, workarounds, diagnostic steps, and tools when you use the [.NET SDK](sdk-dotnet-v2.md) with Azure Cosmos DB for NoSQL accounts.
The .NET SDK provides client-side logical representation to access the Azure Cosmos DB for NoSQL. This article describes tools and approaches to help you if you run into any issues.

## Checklist for troubleshooting issues

Consider the following checklist before you move your application to production. Using the checklist will prevent several common issues you might see. You can also quickly diagnose when an issue occurs:

* Use the latest [SDK](sdk-dotnet-v3.md). Preview SDKs shouldn't be used for production. This will prevent hitting known issues that are already fixed.
* Review the [performance tips](performance-tips-dotnet-sdk-v3.md), and follow the suggested practices. This will help prevent scaling, latency, and other performance issues.
* Enable the SDK logging to help you troubleshoot an issue. Enabling the logging may affect performance so it's best to enable it only when troubleshooting issues. You can enable the following logs:
  * [Log metrics](../monitor.md) by using the Azure portal. Portal metrics show the Azure Cosmos DB telemetry, which is helpful to determine if the issue corresponds to Azure Cosmos DB or if it's from the client side.
  * Log the [diagnostics string](#capture-diagnostics) from the operations and/or exceptions.

Take a look at the [Common issues and workarounds](#common-issues-and-workarounds) section in this article.

Check the [GitHub issues section](https://github.com/Azure/azure-cosmos-dotnet-v3/issues) that's actively monitored. Check to see if any similar issue with a workaround is already filed. If you didn't find a solution, then file a GitHub issue. You can open a support tick for urgent issues.

## Capture diagnostics

[!INCLUDE[cosmos-db-dotnet-sdk-diagnostics](../includes/dotnet-sdk-diagnostics.md)]

## Common issues and workarounds

### General suggestions

* Follow any `aka.ms` link included in the exception details.
* Run your app in the same Azure region as your Azure Cosmos DB account, whenever possible.
* You may run into connectivity/availability issues due to lack of resources on your client machine. We recommend monitoring your CPU utilization on nodes running the Azure Cosmos DB client, and scaling up/out if they're running at high load.

### Check the portal metrics

Checking the [portal metrics](../monitor.md) will help determine if it's a client-side issue or if there's an issue with the service. For example, if the metrics contain a high rate of rate-limited requests (HTTP status code 429) which means the request is getting throttled then check the [Request rate too large](troubleshoot-request-rate-too-large.md) section.

### Retry design

See our guide to [designing resilient applications with Azure Cosmos DB SDKs](conceptual-resilient-sdk-applications.md) for guidance on how to design resilient applications and learn which are the retry semantics of the SDK.

### SNAT

If your app is deployed on [Azure Virtual Machines without a public IP address](../../load-balancer/load-balancer-outbound-connections.md), by default [Azure SNAT ports](../../load-balancer/load-balancer-outbound-connections.md#preallocatedports) establish connections to any endpoint outside of your VM. The number of connections allowed from the VM to the Azure Cosmos DB endpoint is limited by the [Azure SNAT configuration](../../load-balancer/load-balancer-outbound-connections.md#preallocatedports). This situation can lead to connection throttling, connection closure, or the above mentioned [Request timeouts](troubleshoot-dotnet-sdk-request-timeout.md).

 Azure SNAT ports are used only when your VM has a private IP address is connecting to a public IP address. There are two workarounds to avoid Azure SNAT limitation (provided you already are using a single client instance across the entire application):

* Add your Azure Cosmos DB service endpoint to the subnet of your Azure Virtual Machines virtual network. For more information, see [Azure Virtual Network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md).

    When the service endpoint is enabled, the requests are no longer sent from a public IP to Azure Cosmos DB. Instead, the virtual network and subnet identity are sent. This change might result in firewall drops if only public IPs are allowed. If you use a firewall, when you enable the service endpoint, add a subnet to the firewall by using [Virtual Network ACLs](/previous-versions/azure/virtual-network/virtual-networks-acl).
* Assign a [public IP to your Azure VM](../../load-balancer/troubleshoot-outbound-connection.md#configure-an-individual-public-ip-on-vm).

### High network latency

See our [latency troubleshooting guide](troubleshoot-dotnet-sdk-slow-request.md) for details on latency troubleshooting.

### Proxy authentication failures

If you see errors that show as HTTP 407:

```
Response status code does not indicate success: ProxyAuthenticationRequired (407);
```

This error isn't generated by the SDK nor it's coming from the Azure Cosmos DB Service. This is an error related to networking configuration. A proxy in your network configuration is most likely missing the required proxy authentication. If you're not expecting to be using a proxy, reach out to your network team. If you *are* using a proxy, make sure you're setting the right [WebProxy](/dotnet/api/system.net.webproxy) configuration on [CosmosClientOptions.WebProxy](/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.webproxy) when creating the client instance.

### Common query issues

The [query metrics](query-metrics.md) will help determine where the query is spending most of the time. From the query metrics, you can see how much of it's being spent on the back-end vs the client. Learn more on the [query performance guide](performance-tips-query-sdk.md?pivots=programming-language-csharp).

If you encounter the following error: `Unable to load DLL 'Microsoft.Azure.Cosmos.ServiceInterop.dll' or one of its dependencies:` and are using Windows, you should upgrade to the latest Windows version.

## Next steps

* Learn about Performance guidelines for the [.NET SDK](performance-tips-dotnet-sdk-v3.md)
* Learn about the best practices for the [.NET SDK](best-practice-dotnet.md)

 <!--Anchors-->
[Common issues and workarounds]: #common-issues-workarounds
[Azure SNAT (PAT) port exhaustion]: #snat
[Production check list]: #production-check-list
