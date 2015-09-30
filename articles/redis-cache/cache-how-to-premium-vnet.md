<properties 
	pageTitle="How to configure Virtual Network support for a Premium Azure Redis Cache" 
	description="Learn how to create and manage Virtual Network support for your Premium tier Azure Redis Cache instances" 
	services="redis-cache" 
	documentationCenter="" 
	authors="steved0x" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="cache" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="cache-redis" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/30/2015" 
	ms.author="sdanie"/>

# How to configure Virtual Network Support for a Premium Azure Redis Cache
Azure Redis Cache has different cache offerings which provide flexibility in the choice of cache size and features, including the new Premium tier, currently in preview.

The Azure Redis Cache premium tier includes clustering, persistence, and virtual network (VNET) support. A VNET is a representation of your own network in the cloud. When an Azure Redis Cache instance is configured with a VNET, it is not publicly addressable and can only be accessed from clients within the VNET. This article describes how to configure Virtual Network Support for a premium Azure Redis Cache instance.

For information on other premium cache features, see [How to configure persistence for a Premium Azure Redis Cache](cache-how-to-premium-persistence.md) and [How to configure clustering for a Premium Azure Redis Cache](cache-how-to-premium-clustering.md).

>[AZURE.NOTE] The Azure Redis Cache Premium tier is currently in preview.

## Why VNET?
[Azure Virtual Network (VNET)](https://azure.microsoft.com/en-us/services/virtual-network/) deployment provides enhanced security and isolation for your Azure Redis Cache, as well as subnets, access control policies, and other features to further restrict access to Azure Redis Cache.

## Virtual network support
Virtual Network (VNET) support is configured on the **New Redis Cache** blade during cache creation. To create a cache, sign-in to the [Azure preview portal](https://portal.azure.com) and click **New**->**Data + Storage**>**Redis Cache**.

![Create a Redis Cache][redis-cache-new-cache-menu]

To configure VNET support, first select one of the **Premium** caches in the **Choose your pricing Tier** blade.

![Choose your pricing tier][redis-cache-premium-pricing-tier]

Azure Redis Cache VNET integration is configured in the **Virtual Network** blade. From here you can select an existing classic VNET. To use a new VNET, follow the steps in [Create a virtual network (classic) by using the Azure preview portal](../virtual-network/virtual-networks-create-vnet-classic-pportal.md) and then return to the **Redis Cache Virtual Network** blade to select it.

>[AZURE.NOTE] During the preview period for premium cache, Azure Redis Cache works with classic VNETs. For information on creating a classic VNET, see [Create a virtual network (classic) by using the Azure preview portal](../virtual-network/virtual-networks-create-vnet-classic-pportal.md).

![Virtual network][redis-cache-vnet]

Click **Virtual Network** on the **Virtual Network** blade to select and configure your VNET.

![Virtual network][redis-cache-vnet-select]

Click the desired VNET to select it.

![Virtual network][redis-cache-vnet-subnet]

Click Subnet to select the desired subnet.

![Virtual network][redis-cache-vnet-ip]

Type the desired **Static IP address** and click **OK** to save the VNET configuration. If the selected static IP is already use, an error message is displayed.

Once the cache is created, it can be accessed only by clients within the same VNET.

## Azure Redis Cache VNET FAQ

The following list contains answers to commonly asked questions about the Azure Redis Cache scaling.

## What are some common misconfiguration issues with Azure Redis Cache and VNETs?

The following list contains some common configuration errors that can prevent Azure Redis Cache from working properly.

-	Blocked TCP ports that clients use to connect to redis, i.e. 6379 or 6380.
-	Blocked or intercepted outgoing HTTPS traffic from the virtual network. Azure Redis Cache uses outgoing HTTPS traffic to Azure services, especially Storage.
-	Blocked redis role instance VMs from communicating with each other inside the subnet. Redis role instances should be allowed to talk to each other using TCP on any of the ports used, which may be subject to change, but at a minimum can be assumed to be all the ports used in the redis CSDEF file.
-	Blocked Azure Load Balancer from connecting to the redis VMs on TCP/HTTP port 16001. Azure Redis Cache depends on the default Azure load balancer probe to determine which role instances are up. The default load balancer probe works by pinging the Azure Guest Agent on port 16001. Only the role instances which respond to the ping will be placed in rotation to receive traffic forwarded by the ILB. When no instances are in rotation because pings fail because the ports are blocked, then the ILB will not accept any incoming TCP connections.
-	Blocked client application's web traffic used for SSL public key validation. Clients of redis (within the virtual network) must to be able to do HTTP traffic to the public internet in order to download CA certificates and certificate revocation lists in order to do SSL certificate validation when they use port 6380 to connect to Redis and do SSL server authentication.
-	Blocked Azure Load Balancer from connecting to Redis VMs in a cluster via TCP on port 1300x (13000, 13001, etc.) or 1500x (15000, 15001, etc.). VNets are configured in the csdef file with a load balancer probe to open these ports. The Azure load balancer needs to be permitted by NSGs, the default NSGs do this using the tag AZURE_LOADBALANCER. The Azure load balancer has a single static IP address of 168.63.126.16. For more information, see [What is a Network Security Group (NSG)?](..\virtual-network\virtual-networks-nsg.md).

## Can I use VNETs with a standard or basic cache?

VNETs can only be used with premium caches.

## Next steps

Learn how to use more premium cache features.
-	[How to configure persistence for a Premium Azure Redis Cache](cache-how-to-premium-persistence.md)
-	[How to configure clustering for a Premium Azure Redis Cache](cache-how-to-premium-clustering.md)





  
<!-- IMAGES -->

[redis-cache-new-cache-menu]: ./media/cache-how-to-premium-vnet/redis-cache-new-cache-menu.png

[redis-cache-premium-pricing-tier]: ./media/cache-how-to-premium-vnet/redis-cache-premium-pricing-tier.png

[redis-cache-vnet]: ./media/cache-how-to-premium-vnet/redis-cache-vnet.png

[redis-cache-vnet-select]: ./media/cache-how-to-premium-vnet/redis-cache-vnet-select.png

[redis-cache-vnet-ip]: ./media/cache-how-to-premium-vnet/redis-cache-vnet-ip.png

[redis-cache-vnet-subnet]: ./media/cache-how-to-premium-vnet/redis-cache-vnet-subnet.png

