---
title: Configure a Virtual Network for a Premium Azure Redis Cache | Microsoft Docs
description: Learn how to create and manage Virtual Network support for your Premium tier Azure Redis Cache instances
services: redis-cache
documentationcenter: ''
author: steved0x
manager: douge
editor: ''

ms.assetid: 8b1e43a0-a70e-41e6-8994-0ac246d8bf7f
ms.service: cache
ms.workload: tbd
ms.tgt_pltfrm: cache-redis
ms.devlang: na
ms.topic: article
ms.date: 06/07/2017
ms.author: sdanie

---
# How to configure Virtual Network Support for a Premium Azure Redis Cache
Azure Redis Cache has different cache offerings, which provide flexibility in the choice of cache size and features, including Premium tier features such as clustering, persistence, and virtual network support. A VNet is a private network in the cloud. When an Azure Redis Cache instance is configured with a VNet, it is not publicly addressable and can only be accessed from virtual machines and applications within the VNet. This article describes how to configure virtual network support for a premium Azure Redis Cache instance.

> [!NOTE]
> Azure Redis Cache supports both classic and Resource Manager VNets.
> 
> 

For information on other premium cache features, see [Introduction to the Azure Redis Cache Premium tier](cache-premium-tier-intro.md).

## Why VNet?
[Azure Virtual Network (VNet)](https://azure.microsoft.com/services/virtual-network/) deployment provides enhanced security and isolation for your Azure Redis Cache, as well as subnets, access control policies, and other features to further restrict access.

## Virtual network support
Virtual Network (VNet) support is configured on the **New Redis Cache** blade during cache creation. 

[!INCLUDE [redis-cache-create](../../includes/redis-cache-premium-create.md)]

Once you have selected a premium pricing tier, you can configure Redis VNet integration by selecting a VNet that is in the same subscription and location as your cache. To use a new VNet, create it first by following the steps in [Create a virtual network using the Azure portal](../virtual-network/virtual-networks-create-vnet-arm-pportal.md) or [Create a virtual network (classic) by using the Azure portal](../virtual-network/virtual-networks-create-vnet-classic-portal.md) and then return to the **New Redis Cache** blade to create and configure your premium cache.

To configure the VNet for your new cache, click **Virtual Network** on the **New Redis Cache** blade, and select the desired VNet from the drop-down list.

![Virtual network][redis-cache-vnet]

Select the desired subnet from the **Subnet** drop-down list, and specify the desired **Static IP address**. If you are using a classic VNet the **Static IP address** field is optional, and if none is specified, one is chosen from the selected subnet.

> [!IMPORTANT]
> When deploying an Azure Redis Cache to a Resource Manager VNet, the cache must be in a dedicated subnet that contains no other resources except for Azure Redis Cache instances. If an attempt is made to deploy an Azure Redis Cache to a Resource Manager VNet to a subnet that contains other resources, the deployment fails.
> 
> 

![Virtual network][redis-cache-vnet-ip]

> [!IMPORTANT]
> Azure reserves some IP addresses within each subnet, and these addresses can't be used. The first and last IP addresses of the subnets are reserved for protocol conformance, along with three more addresses used for Azure services. For more information, see [Are there any restrictions on using IP addresses within these subnets?](../virtual-network/virtual-networks-faq.md#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets)
> 
> In addition to the IP addresses used by the Azure VNET infrastructure, each Redis instance in the subnet uses two IP addresses per shard and one additional IP address for the load balancer. A non-clustered cache is considered to have one shard.
> 
> 

After the cache is created, you can view the configuration for the VNet by clicking **Virtual Network** from the **Resource menu**.

![Virtual network][redis-cache-vnet-info]

To connect to your Azure Redis cache instance when using a VNet, specify the host name of your cache in the connection string as shown in the following example:

    private static Lazy<ConnectionMultiplexer> lazyConnection = new Lazy<ConnectionMultiplexer>(() =>
    {
        return ConnectionMultiplexer.Connect("contoso5premium.redis.cache.windows.net,abortConnect=false,ssl=true,password=password");
    });

    public static ConnectionMultiplexer Connection
    {
        get
        {
            return lazyConnection.Value;
        }
    }

## Azure Redis Cache VNet FAQ
The following list contains answers to commonly asked questions about the Azure Redis Cache scaling.

* [What are some common misconfiguration issues with Azure Redis Cache and VNets?](#what-are-some-common-misconfiguration-issues-with-azure-redis-cache-and-vnets)
* [How can I verify that my cache is working in a VNET?](#how-can-i-verify-that-my-cache-is-working-in-a-vnet)
* [Can I use VNets with a standard or basic cache?](#can-i-use-vnets-with-a-standard-or-basic-cache)
* [Why does creating a Redis cache fail in some subnets but not others?](#why-does-creating-a-redis-cache-fail-in-some-subnets-but-not-others)
* [What are the subnet address space requirements?](#what-are-the-subnet-address-space-requirements)
* [Do all cache features work when hosting a cache in a VNET?](#do-all-cache-features-work-when-hosting-a-cache-in-a-vnet)

## What are some common misconfiguration issues with Azure Redis Cache and VNets?
When Azure Redis Cache is hosted in a VNet, the ports in the following tables are used. 

>[!IMPORTANT]
>If the ports in the following tables are blocked, the cache may not function correctly. Having one or more of these ports blocked is the most common misconfiguration issue when using Azure Redis Cache in a VNet.
> 
> 

- [Outbound port requirements](#outbound-port-requirements)
- [Inbound port requirements](#inbound-port-requirements)

### Outbound port requirements

There are seven outbound port requirements.

- If desired, all outbound connections to the internet can be made through a client's on-premise auditing device.
- Three of the ports route traffic to Azure endpoints servicing Azure Storage and Azure DNS.
- The remaining port ranges and for internal Redis subnet communications. No subnet NSG rules are required for internal Redis subnet communications.

| Port(s) | Direction | Transport Protocol | Purpose | Remote IP |
| --- | --- | --- | --- | --- |
| 80, 443 |Outbound |TCP |Redis dependencies on Azure Storage/PKI (Internet) |* |
| 53 |Outbound |TCP/UDP |Redis dependencies on DNS (Internet/VNet) |* |
| 8443 |Outbound |TCP |Internal communications for Redis | (Redis subnet) |
| 10221-10231 |Outbound |TCP |Internal communications for Redis | (Redis subnet) |
| 20226 |Outbound |TCP |Internal communications for Redis |(Redis subnet) |
| 13000-13999 |Outbound |TCP |Internal communications for Redis |(Redis subnet) |
| 15000-15999 |Outbound |TCP |Internal communications for Redis |(Redis subnet) |


### Inbound port requirements

There are eight inbound port range requirements. Inbound requests in these ranges are either inbound from other services hosted in the same VNET or internal to the Redis subnet communications.

| Port(s) | Direction | Transport Protocol | Purpose | Remote IP |
| --- | --- | --- | --- | --- |
| 6379, 6380 |Inbound |TCP |Client communication to Redis, Azure load balancing |Virtual Network, Azure Load Balancer |
| 8443 |Inbound |TCP |Internal communications for Redis |(Redis subnet) |
| 8500 |Inbound |TCP/UDP |Azure load balancing |Azure Load Balancer |
| 10221-10231 |Inbound |TCP |Internal communications for Redis |(Redis subnet), Azure Load Balancer |
| 13000-13999 |Inbound |TCP |Client communication to Redis Clusters, Azure load balancing |Virtual Network, Azure Load Balancer |
| 15000-15999 |Inbound |TCP |Client communication to Redis Clusters, Azure load Balancing |Virtual Network, Azure Load Balancer |
| 16001 |Inbound |TCP/UDP |Azure load balancing |Azure Load Balancer |
| 20226 |Inbound |TCP |Internal communications for Redis |(Redis subnet) |

### Additional VNET network connectivity requirements

There are network connectivity requirements for Azure Redis Cache that may not be initially met in a virtual network. Azure Redis Cache requires all the following items to function properly when used within a virtual network.

* Outbound network connectivity to Azure Storage endpoints worldwide. This includes endpoints located in the same region as the Azure Redis Cache instance, as well as storage endpoints located in **other** Azure regions. Azure Storage endpoints resolve under the following DNS domains: *table.core.windows.net*, *blob.core.windows.net*, *queue.core.windows.net*, and *file.core.windows.net*. 
* Outbound network connectivity to *ocsp.msocsp.com*, *mscrl.microsoft.com*, and *crl.microsoft.com*. This connectivity is needed to support SSL functionality.
* The DNS configuration for the virtual network must be capable of resolving all of the endpoints and domains mentioned in the earlier points. These DNS requirements can be met by ensuring a valid DNS infrastructure is configured and maintained for the virtual network.
* Outbound network connectivity to the following Azure Monitoring endpoints, which resolve under the following DNS domains: shoebox2-black.shoebox2.metrics.nsatc.net, north-prod2.prod2.metrics.nsatc.net, azglobal-black.azglobal.metrics.nsatc.net, shoebox2-red.shoebox2.metrics.nsatc.net, east-prod2.prod2.metrics.nsatc.net, azglobal-red.azglobal.metrics.nsatc.net.

### How can I verify that my cache is working in a VNET?

>[!IMPORTANT]
>When connecting to an Azure Redis Cache instance that is hosted in a VNET, your cache clients must be in the same VNET, including any test applications or diagnostic pinging tools.
>
>

Once the port requirements are configured as described in the previous section, you can verify that your cache is working by performing the following steps.

- [Reboot](cache-administration.md#reboot) all of the cache nodes. If all of the required cache dependencies can't be reached (as documented in [Inbound port requirements](cache-how-to-premium-vnet.md#inbound-port-requirements) and [Outbound port requirements](cache-how-to-premium-vnet.md#outbound-port-requirements)), the cache won't be able to restart successfully.
- Once the cache nodes have restarted (as reported by the cache status in the Azure portal), you can perform the following tests:
  - ping the cache endpoint (using port 6380) from a machine that is within the same VNET as the cache, using [tcping](https://www.elifulkerson.com/projects/tcping.php). For example:
    
    `tcping.exe contosocache.redis.cache.windows.net 6380`
    
    If the `tcping` tool reports that the port is open, the cache is available for connection from clients in the VNET.

  - Another way to test is to create a test cache client (which could be a simple console application using StackExchange.Redis) that connects to the cache and adds and retrieves some items from the cache. Install the sample client application onto a VM that is in the same VNET as the cache and run it to verify connectivity to the cache.


### Can I use VNets with a standard or basic cache?
VNets can only be used with premium caches.

### Why does creating a Redis cache fail in some subnets but not others?
If you are deploying an Azure Redis Cache to a Resource Manager VNet, the cache must be in a dedicated subnet that contains no other resource type. If an attempt is made to deploy an Azure Redis Cache to a Resource Manager VNet subnet that contains other resources, the deployment fails. You must delete the existing resources inside the subnet before you can create a new Redis cache.

You can deploy multiple types of resources to a classic VNet as long as you have enough IP addresses available.

### What are the subnet address space requirements?
Azure reserves some IP addresses within each subnet, and these addresses can't be used. The first and last IP addresses of the subnets are reserved for protocol conformance, along with three more addresses used for Azure services. For more information, see [Are there any restrictions on using IP addresses within these subnets?](../virtual-network/virtual-networks-faq.md#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets)

In addition to the IP addresses used by the Azure VNET infrastructure, each Redis instance in the subnet uses two IP addresses per shard and one additional IP address for the load balancer. A non-clustered cache is considered to have one shard.

### Do all cache features work when hosting a cache in a VNET?
When your cache is part of a VNET, only clients in the VNET can access the cache. As a result, the following cache management features don't work at this time.

* Redis Console - Because Redis Console runs in your local browser, which is outside the VNET, it can't connect to your cache.

## Use ExpressRoute with Azure Redis Cache
Customers can connect an [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/) circuit to their virtual network infrastructure, thus extending their on-premises network to Azure. 

By default, a newly created ExpressRoute circuit advertises a default route that allows outbound Internet connectivity. With this configuration, client applications are able to connect to other Azure endpoints including Azure Redis Cache.

However a common customer configuration is to define their own default route (0.0.0.0/0) which forces outbound Internet traffic to instead flow on-premises. This traffic flow breaks connectivity with Azure Redis Cache if the outbound traffic is then blocked on-premises such that the Azure Redis Cache instance is not able to communicate with its dependencies.

The solution is to define one (or more) user-defined routes (UDRs) on the subnet that contains the Azure Redis Cache. A UDR defines subnet-specific routes that will be honored instead of the default route.

If possible, it is recommended to use the following configuration:

* The ExpressRoute configuration advertises 0.0.0.0/0 and by default force tunnels all outbound traffic on-premises.
* The UDR applied to the subnet containing the Azure Redis Cache defines 0.0.0.0/0 with a working route for TCP/IP traffic to the public internet; for example by setting the next hop type to 'Internet'.

The combined effect of these steps is that the subnet level UDR takes precedence over the ExpressRoute forced tunneling, thus ensuring outbound Internet access from the Azure Redis Cache.

Connecting to an Azure Redis Cache instance from an on-premises application using ExpressRoute is not a typical usage scenario due to performance reasons (for best performance Azure Redis Cache clients should be in the same region as the Azure Redis Cache).

>[!IMPORTANT] 
>The routes defined in a UDR **must** be specific enough to take precedence over any routes advertised by the ExpressRoute configuration. The following example uses the broad 0.0.0.0/0 address range, and as such can potentially be accidentally overridden by route advertisements using more specific address ranges.

>[!WARNING]  
>Azure Redis Cache is not supported with ExpressRoute configurations that **incorrectly cross-advertise routes from the public peering path to the private peering path**. ExpressRoute configurations that have public peering configured, receive route advertisements from Microsoft for a large set of Microsoft Azure IP address ranges. If these address ranges are incorrectly cross-advertised on the private peering path, the result is that all outbound network packets from the Azure Redis Cache instance's subnet are incorrectly force-tunneled to a customer's on-premises network infrastructure. This network flow breaks Azure Redis Cache. The solution to this problem is to stop cross-advertising routes from the public peering path to the private peering path.


Background information on user-defined routes is available in this [overview](../virtual-network/virtual-networks-udr-overview.md).

For more information about ExpressRoute, see [ExpressRoute technical overview](../expressroute/expressroute-introduction.md).

## Next steps
Learn how to use more premium cache features.

* [Introduction to the Azure Redis Cache Premium tier](cache-premium-tier-intro.md)

<!-- IMAGES -->

[redis-cache-vnet]: ./media/cache-how-to-premium-vnet/redis-cache-vnet.png

[redis-cache-vnet-ip]: ./media/cache-how-to-premium-vnet/redis-cache-vnet-ip.png

[redis-cache-vnet-info]: ./media/cache-how-to-premium-vnet/redis-cache-vnet-info.png

