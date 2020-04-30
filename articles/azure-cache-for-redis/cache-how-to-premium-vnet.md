---
title: Configure a Virtual Network - Premium Azure Cache for Redis
description: Learn how to create and manage Virtual Network support for your Premium tier Azure Cache for Redis instances
author: yegu-ms
ms.author: yegu
ms.service: cache
ms.topic: conceptual
ms.date: 05/15/2017
---
# How to configure Virtual Network Support for a Premium Azure Cache for Redis
Azure Cache for Redis has different cache offerings, which provide flexibility in the choice of cache size and features, including Premium tier features such as clustering, persistence, and virtual network support. A VNet is a private network in the cloud. When an Azure Cache for Redis instance is configured with a VNet, it is not publicly addressable and can only be accessed from virtual machines and applications within the VNet. This article describes how to configure virtual network support for a premium Azure Cache for Redis instance.

> [!NOTE]
> Azure Cache for Redis supports both classic and Resource Manager VNets.
> 
> 

For information on other premium cache features, see [Introduction to the Azure Cache for Redis Premium tier](cache-premium-tier-intro.md).

## Why VNet?
[Azure Virtual Network (VNet)](https://azure.microsoft.com/services/virtual-network/) deployment provides enhanced security and isolation for your Azure Cache for Redis, as well as subnets, access control policies, and other features to further restrict access.

## Virtual network support
Virtual Network (VNet) support is configured on the **New Azure Cache for Redis** blade during cache creation. 

[!INCLUDE [redis-cache-create](../../includes/redis-cache-premium-create.md)]

Once you have selected a premium pricing tier, you can configure Redis VNet integration by selecting a VNet that is in the same subscription and location as your cache. To use a new VNet, create it first by following the steps in [Create a virtual network using the Azure portal](../virtual-network/manage-virtual-network.md#create-a-virtual-network) or [Create a virtual network (classic) by using the Azure portal](../virtual-network/virtual-networks-create-vnet-classic-pportal.md) and then return to the **New Azure Cache for Redis** blade to create and configure your premium cache.

To configure the VNet for your new cache, click **Virtual Network** on the **New Azure Cache for Redis** blade, and select the desired VNet from the drop-down list.

![Virtual network][redis-cache-vnet]

Select the desired subnet from the **Subnet** drop-down list.  If desired, specify a **Static IP address**. The **Static IP address** field is optional, and if none is specified, one is chosen from the selected subnet.

> [!IMPORTANT]
> When deploying an Azure Cache for Redis to a Resource Manager VNet, the cache must be in a dedicated subnet that contains no other resources except for Azure Cache for Redis instances. If an attempt is made to deploy an Azure Cache for Redis to a Resource Manager VNet to a subnet that contains other resources, the deployment fails.
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

To connect to your Azure Cache for Redis instance when using a VNet, specify the host name of your cache in the connection string as shown in the following example:

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

## Azure Cache for Redis VNet FAQ
The following list contains answers to commonly asked questions about the Azure Cache for Redis scaling.

* What are some common misconfiguration issues with Azure Cache for Redis and VNets?
* [How can I verify that my cache is working in a VNET?](#how-can-i-verify-that-my-cache-is-working-in-a-vnet)
* When trying to connect to my Azure Cache for Redis in a VNET, why am I getting an error stating the remote certificate is invalid?
* [Can I use VNets with a standard or basic cache?](#can-i-use-vnets-with-a-standard-or-basic-cache)
* Why does creating an Azure Cache for Redis fail in some subnets but not others?
* [What are the subnet address space requirements?](#what-are-the-subnet-address-space-requirements)
* [Do all cache features work when hosting a cache in a VNET?](#do-all-cache-features-work-when-hosting-a-cache-in-a-vnet)

### What are some common misconfiguration issues with Azure Cache for Redis and VNets?
When Azure Cache for Redis is hosted in a VNet, the ports in the following tables are used. 

>[!IMPORTANT]
>If the ports in the following tables are blocked, the cache may not function correctly. Having one or more of these ports blocked is the most common misconfiguration issue when using Azure Cache for Redis in a VNet.
> 
> 

- [Outbound port requirements](#outbound-port-requirements)
- [Inbound port requirements](#inbound-port-requirements)

#### Outbound port requirements

There are nine outbound port requirements. Outbound requests in these ranges are either outbound to other services necessary for the cache to function or internal to the Redis subnet for internode communication. For geo-replication, additional outbound requirements exist for communication between subnets of the primary and secondary cache.

| Port(s) | Direction | Transport Protocol | Purpose | Local IP | Remote IP |
| --- | --- | --- | --- | --- | --- |
| 80, 443 |Outbound |TCP |Redis dependencies on Azure Storage/PKI (Internet) | (Redis subnet) |* |
| 443 | Outbound | TCP | Redis dependency on Azure Key Vault | (Redis subnet) | AzureKeyVault <sup>1</sup> |
| 53 |Outbound |TCP/UDP |Redis dependencies on DNS (Internet/VNet) | (Redis subnet) | 168.63.129.16 and 169.254.169.254 <sup>2</sup> and any custom DNS server for the subnet <sup>3</sup> |
| 8443 |Outbound |TCP |Internal communications for Redis | (Redis subnet) | (Redis subnet) |
| 10221-10231 |Outbound |TCP |Internal communications for Redis | (Redis subnet) | (Redis subnet) |
| 20226 |Outbound |TCP |Internal communications for Redis | (Redis subnet) |(Redis subnet) |
| 13000-13999 |Outbound |TCP |Internal communications for Redis | (Redis subnet) |(Redis subnet) |
| 15000-15999 |Outbound |TCP |Internal communications for Redis and Geo-Replication | (Redis subnet) |(Redis subnet) (Geo-replica peer subnet) |
| 6379-6380 |Outbound |TCP |Internal communications for Redis | (Redis subnet) |(Redis subnet) |

<sup>1</sup> You can use the service tag 'AzureKeyVault' with Resource Manager Network Security Groups.

<sup>2</sup> These IP addresses owned by Microsoft are used to address the Host VM which serves Azure DNS.

<sup>3</sup> Not needed for subnets with no custom DNS server, or newer redis caches that ignore custom DNS.

#### Geo-replication peer port requirements

If you are using georeplication between caches in Azure Virtual Networks, please note that the recommended configuration is to unblock ports 15000-15999 for the whole subnet in both inbound AND outbound directions to both caches, so that all the replica components in the subnet can communicate directly with each other even in the event of a future geo-failover.

#### Inbound port requirements

There are eight inbound port range requirements. Inbound requests in these ranges are either inbound from other services hosted in the same VNET or internal to the Redis subnet communications.

| Port(s) | Direction | Transport Protocol | Purpose | Local IP | Remote IP |
| --- | --- | --- | --- | --- | --- |
| 6379, 6380 |Inbound |TCP |Client communication to Redis, Azure load balancing | (Redis subnet) | (Redis subnet), Virtual Network, Azure Load Balancer <sup>1</sup> |
| 8443 |Inbound |TCP |Internal communications for Redis | (Redis subnet) |(Redis subnet) |
| 8500 |Inbound |TCP/UDP |Azure load balancing | (Redis subnet) |Azure Load Balancer |
| 10221-10231 |Inbound |TCP |Internal communications for Redis | (Redis subnet) |(Redis subnet), Azure Load Balancer |
| 13000-13999 |Inbound |TCP |Client communication to Redis Clusters, Azure load balancing | (Redis subnet) |Virtual Network, Azure Load Balancer |
| 15000-15999 |Inbound |TCP |Client communication to Redis Clusters, Azure load Balancing, and Geo-Replication | (Redis subnet) |Virtual Network, Azure Load Balancer, (Geo-replica peer subnet) |
| 16001 |Inbound |TCP/UDP |Azure load balancing | (Redis subnet) |Azure Load Balancer |
| 20226 |Inbound |TCP |Internal communications for Redis | (Redis subnet) |(Redis subnet) |

<sup>1</sup> You can use the Service Tag 'AzureLoadBalancer' (Resource Manager) (or 'AZURE_LOADBALANCER' for classic) for authoring the NSG rules.

#### Additional VNET network connectivity requirements

There are network connectivity requirements for Azure Cache for Redis that may not be initially met in a virtual network. Azure Cache for Redis requires all the following items to function properly when used within a virtual network.

* Outbound network connectivity to Azure Storage endpoints worldwide. This includes endpoints located in the same region as the Azure Cache for Redis instance, as well as storage endpoints located in **other** Azure regions. Azure Storage endpoints resolve under the following DNS domains: *table.core.windows.net*, *blob.core.windows.net*, *queue.core.windows.net*, and *file.core.windows.net*. 
* Outbound network connectivity to *ocsp.msocsp.com*, *mscrl.microsoft.com*, and *crl.microsoft.com*. This connectivity is needed to support TLS/SSL functionality.
* The DNS configuration for the virtual network must be capable of resolving all of the endpoints and domains mentioned in the earlier points. These DNS requirements can be met by ensuring a valid DNS infrastructure is configured and maintained for the virtual network.
* Outbound network connectivity to the following Azure Monitoring endpoints, which resolve under the following DNS domains: shoebox2-black.shoebox2.metrics.nsatc.net, north-prod2.prod2.metrics.nsatc.net, azglobal-black.azglobal.metrics.nsatc.net, shoebox2-red.shoebox2.metrics.nsatc.net, east-prod2.prod2.metrics.nsatc.net, azglobal-red.azglobal.metrics.nsatc.net.

### How can I verify that my cache is working in a VNET?

>[!IMPORTANT]
>When connecting to an Azure Cache for Redis instance that is hosted in a VNET, your cache clients must be in the same VNET or in a VNET with VNET peering enabled within the same Azure region. Global VNET Peering isn't currently supported. This includes any test applications or diagnostic pinging tools. Regardless of where the client application is hosted, Network security groups must be configured such that the client's network traffic is allowed to reach the Redis instance.
>
>

Once the port requirements are configured as described in the previous section, you can verify that your cache is working by performing the following steps.

- [Reboot](cache-administration.md#reboot) all of the cache nodes. If all of the required cache dependencies can't be reached (as documented in [Inbound port requirements](cache-how-to-premium-vnet.md#inbound-port-requirements) and [Outbound port requirements](cache-how-to-premium-vnet.md#outbound-port-requirements)), the cache won't be able to restart successfully.
- Once the cache nodes have restarted (as reported by the cache status in the Azure portal), you can perform the following tests:
  - ping the cache endpoint (using port 6380) from a machine that is within the same VNET as the cache, using [tcping](https://www.elifulkerson.com/projects/tcping.php). For example:
    
    `tcping.exe contosocache.redis.cache.windows.net 6380`
    
    If the `tcping` tool reports that the port is open, the cache is available for connection from clients in the VNET.

  - Another way to test is to create a test cache client (which could be a simple console application using StackExchange.Redis) that connects to the cache and adds and retrieves some items from the cache. Install the sample client application onto a VM that is in the same VNET as the cache and run it to verify connectivity to the cache.


### When trying to connect to my Azure Cache for Redis in a VNET, why am I getting an error stating the remote certificate is invalid?

When trying to connect to an Azure Cache for Redis in a VNET, you see a certificate validation error such as this:

`{"No connection is available to service this operation: SET mykey; The remote certificate is invalid according to the validation procedure.; …"}`

The cause could be you are connecting to the host by the IP address. We recommend using the hostname. In other words, use the following:     

`[mycachename].redis.windows.net:6380,password=xxxxxxxxxxxxxxxxxxxx,ssl=True,abortConnect=False`

Avoid using the IP address similar to the following connection string:

`10.128.2.84:6380,password=xxxxxxxxxxxxxxxxxxxx,ssl=True,abortConnect=False`

If you are unable to resolve the DNS name, some client libraries include configuration options like `sslHost` which is provided by the StackExchange.Redis client. This allows you to override the hostname used for certificate validation. For example:

`10.128.2.84:6380,password=xxxxxxxxxxxxxxxxxxxx,ssl=True,abortConnect=False;sslHost=[mycachename].redis.windows.net`

### Can I use VNets with a standard or basic cache?
VNets can only be used with premium caches.

### Why does creating an Azure Cache for Redis fail in some subnets but not others?
If you are deploying an Azure Cache for Redis to a Resource Manager VNet, the cache must be in a dedicated subnet that contains no other resource type. If an attempt is made to deploy an Azure Cache for Redis to a Resource Manager VNet subnet that contains other resources, the deployment fails. You must delete the existing resources inside the subnet before you can create a new Azure Cache for Redis.

You can deploy multiple types of resources to a classic VNet as long as you have enough IP addresses available.

### What are the subnet address space requirements?
Azure reserves some IP addresses within each subnet, and these addresses can't be used. The first and last IP addresses of the subnets are reserved for protocol conformance, along with three more addresses used for Azure services. For more information, see [Are there any restrictions on using IP addresses within these subnets?](../virtual-network/virtual-networks-faq.md#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets)

In addition to the IP addresses used by the Azure VNET infrastructure, each Redis instance in the subnet uses two IP addresses per shard and one additional IP address for the load balancer. A non-clustered cache is considered to have one shard.

### Do all cache features work when hosting a cache in a VNET?
When your cache is part of a VNET, only clients in the VNET can access the cache. As a result, the following cache management features don't work at this time.

* Redis Console - Because Redis Console runs in your local browser, which is outside the VNET, it can't connect to your cache.


## Use ExpressRoute with Azure Cache for Redis

Customers can connect an [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/) circuit to their virtual network infrastructure, thus extending their on-premises network to Azure. 

By default, a newly created ExpressRoute circuit does not perform forced tunneling (advertisement of a default route, 0.0.0.0/0) on a VNET. As a result, outbound Internet connectivity is allowed directly from the VNET and client applications are able to connect to other Azure endpoints including Azure Cache for Redis.

However a common customer configuration is to use forced tunneling (advertise a default route) which forces outbound Internet traffic to instead flow on-premises. This traffic flow breaks connectivity with Azure Cache for Redis if the outbound traffic is then blocked on-premises such that the Azure Cache for Redis instance is not able to communicate with its dependencies.

The solution is to define one (or more) user-defined routes (UDRs) on the subnet that contains the Azure Cache for Redis. A UDR defines subnet-specific routes that will be honored instead of the default route.

If possible, it is recommended to use the following configuration:

* The ExpressRoute configuration advertises 0.0.0.0/0 and by default force tunnels all outbound traffic on-premises.
* The UDR applied to the subnet containing the Azure Cache for Redis defines 0.0.0.0/0 with a working route for TCP/IP traffic to the public internet; for example by setting the next hop type to 'Internet'.

The combined effect of these steps is that the subnet level UDR takes precedence over the ExpressRoute forced tunneling, thus ensuring outbound Internet access from the Azure Cache for Redis.

Connecting to an Azure Cache for Redis instance from an on-premises application using ExpressRoute is not a typical usage scenario due to performance reasons (for best performance Azure Cache for Redis clients should be in the same region as the Azure Cache for Redis).

>[!IMPORTANT] 
>The routes defined in a UDR **must** be specific enough to take precedence over any routes advertised by the ExpressRoute configuration. The following example uses the broad 0.0.0.0/0 address range, and as such can potentially be accidentally overridden by route advertisements using more specific address ranges.

>[!WARNING]  
>Azure Cache for Redis is not supported with ExpressRoute configurations that **incorrectly cross-advertise routes from the public peering path to the private peering path**. ExpressRoute configurations that have public peering configured, receive route advertisements from Microsoft for a large set of Microsoft Azure IP address ranges. If these address ranges are incorrectly cross-advertised on the private peering path, the result is that all outbound network packets from the Azure Cache for Redis instance's subnet are incorrectly force-tunneled to a customer's on-premises network infrastructure. This network flow breaks Azure Cache for Redis. The solution to this problem is to stop cross-advertising routes from the public peering path to the private peering path.


Background information on user-defined routes is available in this [overview](../virtual-network/virtual-networks-udr-overview.md).

For more information about ExpressRoute, see [ExpressRoute technical overview](../expressroute/expressroute-introduction.md).

## Next steps
Learn how to use more premium cache features.

* [Introduction to the Azure Cache for Redis Premium tier](cache-premium-tier-intro.md)

<!-- IMAGES -->

[redis-cache-vnet]: ./media/cache-how-to-premium-vnet/redis-cache-vnet.png

[redis-cache-vnet-ip]: ./media/cache-how-to-premium-vnet/redis-cache-vnet-ip.png

[redis-cache-vnet-info]: ./media/cache-how-to-premium-vnet/redis-cache-vnet-info.png
