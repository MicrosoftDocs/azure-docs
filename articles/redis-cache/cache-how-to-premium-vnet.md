<properties 
	pageTitle="How to configure Virtual Network support for a Premium Azure Redis Cache | Microsoft Azure" 
	description="Learn how to create and manage Virtual Network support for your Premium tier Azure Redis Cache instances" 
	services="redis-cache" 
	documentationCenter="" 
	authors="steved0x" 
	manager="douge" 
	editor=""/>

<tags 
	ms.service="cache" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="cache-redis" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/12/2016" 
	ms.author="sdanie"/>

# How to configure Virtual Network Support for a Premium Azure Redis Cache
Azure Redis Cache has different cache offerings which provide flexibility in the choice of cache size and features, including the new Premium tier.

The Azure Redis Cache premium tier includes clustering, persistence, and virtual network (VNet) support. A VNet is a private network in the cloud. When an Azure Redis Cache instance is configured with a VNet, it is not publicly addressable and can only be accessed from virtual machines and applications within the VNet. This article describes how to configure virtual network support for a premium Azure Redis Cache instance.

>[AZURE.NOTE] Azure Redis Cache supports both classic and ARM VNets.

For information on other premium cache features, see [How to configure persistence for a Premium Azure Redis Cache](cache-how-to-premium-persistence.md) and [How to configure clustering for a Premium Azure Redis Cache](cache-how-to-premium-clustering.md).

## Why VNet?
[Azure Virtual Network (VNet)](https://azure.microsoft.com/services/virtual-network/) deployment provides enhanced security and isolation for your Azure Redis Cache, as well as subnets, access control policies, and other features to further restrict access to Azure Redis Cache.

## Virtual network support
Virtual Network (VNet) support is configured on the **New Redis Cache** blade during cache creation. 

[AZURE.INCLUDE [redis-cache-create](../../includes/redis-cache-premium-create.md)]

Once you have selected a premium pricing tier, you can configure Azure Redis Cache VNet integration by selecting a VNet that is in the same subscription and location as your cache. To use a new VNet, create it first  by following the steps in [Create a virtual network using the Azure portal](../virtual-network/virtual-networks-create-vnet-arm-pportal.md) or [Create a virtual network (classic) by using the Azure Portal](../virtual-network/virtual-networks-create-vnet-classic-portal.md) and then return to the **New Redis Cache** blade to create and configure your premium cache.

To configure the VNet for your new cache, click **Virtual Network** on the **New Redis Cache** blade, and select the desired VNet from the drop-down list.

![Virtual network][redis-cache-vnet]

Select the desired subnet from the **Subnet** drop-down list, and specify the desired **Static IP address**. If you are using a classic VNet the **Static IP address** field is optional, and if none is specified, one will be chosen from the selected subnet.

>[AZURE.IMPORTANT] When deploying an Azure Redis Cache to an ARM VNet, the cache must be in a dedicated subnet that contains no other resources except for Azure Redis Cache instances. If an attempt is made to deploy an Azure Redis Cache to an ARM VNet to a subnet that contains other resources, the deployment will fail.

![Virtual network][redis-cache-vnet-ip]

>[AZURE.IMPORTANT] The first 4 addresses in a subnet are reserved and can't be used. For more information, see [Are there any restrictions on using IP addresses within these subnets?](../virtual-network/virtual-networks-faq.md#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets)

After the cache is created, you can view the configuration for the VNet by clicking **Virtual Network** from the **Settings** blade.

![Virtual network][redis-cache-vnet-info]


To connect to your Azure Redis cache instance when using a VNet, specify the host name of your cache in the connection string as shown in the following example.

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

-	[What are some common misconfiguration issues with Azure Redis Cache and VNets?](#what-are-some-common-misconfiguration-issues-with-azure-redis-cache-and-vnets)
-	[Can I use VNets with a standard or basic cache?](#can-i-use-vnets-with-a-standard-or-basic-cache)
-	[Why does creating a Redis cache fail in some subnets but not others?](#why-does-creating-a-redis-cache-fail-in-some-subnets-but-not-others)
-	[Do all cache features work when hosting a cache in a VNET?](#do-all-cache-features-work-when-hosting-a-cache-in-a-vnet)


## What are some common misconfiguration issues with Azure Redis Cache and VNets?

When Azure Redis Cache is hosted in a VNet, the ports in the following table are used. If these ports are blocked, the cache may not function correctly. Having one or more of these ports blocked is the most common misconfiguration issue when using Azure Redis Cache in a VNet.

| Port(s)     | Direction        | Transport Protocol | Purpose                                                                           | Remote IP                           |
|-------------|------------------|--------------------|-----------------------------------------------------------------------------------|-------------------------------------|
| 80, 443     | Outbound         | TCP                | Redis dependencies on Azure Storage/PKI (Internet)                                | *                                   |
| 53          | Outbound         | TCP/UDP            | Redis dependencies on DNS (Internet/VNet)                                         | *                                   |
| 6379, 6380  | Inbound          | TCP                | Client communication to Redis, Azure Load Balancing                               | VIRTUAL_NETWORK, AZURE_LOADBALANCER |
| 8443        | Inbound/Outbound | TCP                | Implementation Detail for Redis                                                   | VIRTUAL_NETWORK                     |
| 8500        | Inbound          | TCP/UDP            | Azure Load Balancing                                                              | AZURE_LOADBALANCER                  |
| 10221-10231 | Inbound/Outbound | TCP                | Implementation Detail for Redis (can restrict remote endpoint to VIRTUAL_NETWORK) | VIRTUAL_NETWORK, AZURE_LOADBALANCER |
| 13000-13999 | Inbound          | TCP                | Client communication to Redis Clusters, Azure Load Balancing                      | VIRTUAL_NETWORK, AZURE_LOADBALANCER |
| 15000-15999 | Inbound          | TCP                | Client communication to Redis Clusters, Azure Load Balancing                      | VIRTUAL_NETWORK, AZURE_LOADBALANCER |
| 16001       | Inbound          | TCP/UDP            | Azure Load Balancing                                                              | AZURE_LOADBALANCER                  |
| 20226       | Inbound+Outbound | TCP                | Implementation Detail for Redis Clusters                                          | VIRTUAL_NETWORK                     |


There are network connectivity requirements for Azure Redis Cache that may not be initially met in a virtual network. Azure Redis Cache requires all of the following in order to function properly when used within a virtual network.

-  Outbound network connectivity to Azure Storage endpoints worldwide. This includes endpoints located in the same region as the Azure Redis Cache instance, as well as storage endpoints located in **other** Azure regions. Azure Storage endpoints resolve under the following DNS domains: *table.core.windows.net*, *blob.core.windows.net*, *queue.core.windows.net* and *file.core.windows.net*. 
-  Outbound network connectivity to *ocsp.msocsp.com*, *mscrl.microsoft.com* and *crl.microsoft.com*. This is needed to support SSL functionality.
-  The DNS configuration for the virtual network must be capable of resolving all of the endpoints and domains mentioned in the earlier points. These DNS requirements can be met by ensuring a valid DNS infrastructure is configured and maintained for the virtual network.



### Can I use VNets with a standard or basic cache?

VNets can only be used with premium caches.

### Why does creating a Redis cache fail in some subnets but not others?

If you are deploying an Azure Redis Cache to an ARM VNet, the cache must be in a dedicated subnet that contains no other resource type. If an attempt is made to deploy an Azure Redis Cache to an ARM VNet subnet that contains other resources, the deployment will fail. You must delete the existing resources inside the subnet before you can create a new Redis cache.

You can deploy multiple types of resources to a classic VNet as long as you have enough IP addresses available.

### Do all cache features work when hosting a cache in a VNET?

When your cache is part of a VNET, only clients in the VNET can access the cache, and as a result the following cache management features don't work at this time.

-	Redis Console - Because Redis Console uses the redis-cli.exe client hosted on VMs that are not part of your VNET, it can't connect to your cache.


## Use ExpressRoute with Azure Redis Cache

Customers can connect an [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/) circuit to their virtual network infrastructure, thus extending their on-premises network to Azure. 

By default, a newly created ExpressRoute circuit advertises a default route that allows outbound Internet connectivity. With this configuration client applications will be able to connect to other Azure endpoints including Azure Redis Cache.

However a common customer configuration is to define their own default route (0.0.0.0/0) which forces outbound Internet traffic to instead flow on-premises. This traffic flow invariably breaks connectivity with Azure Redis Cache because the outbound traffic is either blocked on-premises, or NAT'd to an unrecognizable set of addresses that no longer work with various Azure endpoints.

The solution is to define one (or more) user defined routes (UDRs) on the subnet that contains the Azure Redis Cache. A UDR defines subnet-specific routes that will be honored instead of the default route.

If possible, it is recommended to use the following configuration:

- The ExpressRoute configuration advertises 0.0.0.0/0 and by default force tunnels all outbound traffic on-premises.
- The UDR applied to the subnet containing the Azure Redis Cache defines 0.0.0.0/0 with a next hop type of Internet (an example of this is farther down in this article).

The combined effect of these steps is that the subnet level UDR will take precedence over the ExpressRoute forced tunneling, thus ensuring outbound Internet access from the Azure Redis Cache.

Although connecting to an Azure Redis Cache instance from an on-premises application using ExpressRoute is not a typical usage scenario due to performance reasons (for best performance Azure Redis Cache clients should be in the same region as the Azure Redis Cache), in this scenario the outbound network path cannot travel through internal corporate proxies, nor can it be force tunneled to on-premises. Doing so changes the effective NAT address of outbound network traffic from the Azure Redis Cache. Changing the NAT address of an Azure Redis Cache instance's outbound network traffic will cause connectivity failures to many of the endpoints listed above. This results in failed Azure Redis Cache creation attempts.

**IMPORTANT:**  The routes defined in a UDR **must** be specific enough to  take precedence over any routes advertised by the ExpressRoute configuration. The example below uses the broad 0.0.0.0/0 address range, and as such can potentially be accidentally overridden by route advertisements using more specific address ranges.

**VERY IMPORTANT:**  Azure Redis Cache is not supported with ExpressRoute configurations that **incorrectly cross-advertise routes from the public peering path to the private peering path**. ExpressRoute configurations that have public peering configured, will receive route advertisements from Microsoft for a large set of Microsoft Azure IP address ranges. If these address ranges are incorrectly cross-advertised on the private peering path, the end result is that all outbound network packets from the Azure Redis Cache instance's subnet will be incorrectly force-tunneled to a customer's on-premises network infrastructure. This network flow will break Azure Redis Cache. The solution to this problem is to stop cross-advertising routes from the public peering path to the private peering path.

Background information on user defined routes is available in this [overview](../virtual-network/virtual-networks-udr-overview.md). 

For more information about ExpressRoute, see [ExpressRoute technical overview](../expressroute/expressroute-introduction.md)

## Next steps
Learn how to use more premium cache features.

-	[How to configure persistence for a Premium Azure Redis Cache](cache-how-to-premium-persistence.md)
-	[How to configure clustering for a Premium Azure Redis Cache](cache-how-to-premium-clustering.md)
-	[Import and Export data in Azure Redis Cache](cache-how-to-import-export-data.md)





  
<!-- IMAGES -->

[redis-cache-vnet]: ./media/cache-how-to-premium-vnet/redis-cache-vnet.png

[redis-cache-vnet-ip]: ./media/cache-how-to-premium-vnet/redis-cache-vnet-ip.png

[redis-cache-vnet-info]: ./media/cache-how-to-premium-vnet/redis-cache-vnet-info.png

