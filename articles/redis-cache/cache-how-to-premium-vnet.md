<properties 
	pageTitle="How to configure Virtual Network support for a Premium Azure Redis Cache" 
	description="Learn how to create and manage Virtual Network support for your Premium tier Azure Redis Cache instances" 
	services="redis-cache" 
	documentationCenter="" 
	authors="steved0x" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="cache" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="cache-redis" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/27/2016" 
	ms.author="sdanie"/>

# How to configure Virtual Network Support for a Premium Azure Redis Cache
Azure Redis Cache has different cache offerings which provide flexibility in the choice of cache size and features, including the new Premium tier.

The Azure Redis Cache premium tier includes clustering, persistence, and virtual network (VNET) support. A VNET is a representation of your own network in the cloud. When an Azure Redis Cache instance is configured with a VNET, it is not publicly addressable and can only be accessed from clients within the VNET. This article describes how to configure Virtual Network Support for a premium Azure Redis Cache instance.

For information on other premium cache features, see [How to configure persistence for a Premium Azure Redis Cache](cache-how-to-premium-persistence.md) and [How to configure clustering for a Premium Azure Redis Cache](cache-how-to-premium-clustering.md).

## Why VNET?
[Azure Virtual Network (VNET)](https://azure.microsoft.com/services/virtual-network/) deployment provides enhanced security and isolation for your Azure Redis Cache, as well as subnets, access control policies, and other features to further restrict access to Azure Redis Cache.

## Virtual network support
Virtual Network (VNET) support is configured on the **New Redis Cache** blade during cache creation. 

[AZURE.INCLUDE [redis-cache-create](../../includes/redis-cache-premium-create.md)]

Azure Redis Cache VNET integration is configured in the **Virtual Network** blade. From here you can select a VNET that is in the same subscription and location as your cache. To use a new VNET, follow the steps in [Create a virtual network using the Azure portal](../virtual-network/virtual-networks-create-vnet-arm-pportal.md) or [Create a virtual network (classic) by using the Azure Portal](../virtual-network/virtual-networks-create-vnet-classic-pportal.md) and then return to the **Redis Cache Virtual Network** blade to select it.

Click **Virtual Network** on the **New Redis Cache** blade, and select the desired VNET from the drop-down list to select and configure your VNET.

![Virtual network][redis-cache-vnet]

Select the desired subnet from the **Subnet** drop-down list.

![Virtual network][redis-cache-vnet-ip]

Specify the desired **Static IP address**. If you are using a classic VNET this field is optional, and if none is specified, one will be chosen from the selected subnet.

>[AZURE.IMPORTANT] The first 4 addresses in a subnet are reserved and can't be used.

Once the cache is created, you can view and modify the configuration for the VNET by clicking **Virtual Network** from the **Settings** blade.

![Virtual network][redis-cache-vnet-info]

>[AZURE.IMPORTANT] To access your Azure Redis cache instance when using a VNET, pass the static IP address of the cache in the VNET as the first parameter, and pass in an `sslhost` parameter with the endpoint of your cache. In the following example the static IP address is `10.14.0.5` and the cache endpoint is `contoso55vnet.redis.cache.windows.net`.

	private static Lazy<ConnectionMultiplexer> lazyConnection = new Lazy<ConnectionMultiplexer>(() =>
	{
	    return ConnectionMultiplexer.Connect("10.14.0.5,sslhost=contoso55vnet.redis.cache.windows.net,abortConnect=false,ssl=true,password=password");
	});
	
	public static ConnectionMultiplexer Connection
	{
	    get
	    {
	        return lazyConnection.Value;
	    }
	}

## Azure Redis Cache VNET FAQ

The following list contains answers to commonly asked questions about the Azure Redis Cache scaling.

## What are some common misconfiguration issues with Azure Redis Cache and VNETs?

When Azure Redis Cache is hosted in a VNET, the ports in the following table are used. If these ports are blocked, the cache may not function correctly. Having one or more of these ports blocked is the most common misconfiguration issue when using Azure Redis Cache in a VNET.

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




## Can I use VNETs with a standard or basic cache?

VNETs can only be used with premium caches.

## Next steps
Learn how to use more premium cache features.

-	[How to configure persistence for a Premium Azure Redis Cache](cache-how-to-premium-persistence.md)
-	[How to configure clustering for a Premium Azure Redis Cache](cache-how-to-premium-clustering.md)
-	[Import and Export data in Azure Redis Cache](cache-how-to-import-export-data.md)





  
<!-- IMAGES -->

[redis-cache-vnet]: ./media/cache-how-to-premium-vnet/redis-cache-vnet.png

[redis-cache-vnet-ip]: ./media/cache-how-to-premium-vnet/redis-cache-vnet-ip.png

[redis-cache-vnet-info]: ./media/cache-how-to-premium-vnet/redis-cache-vnet-info.png

