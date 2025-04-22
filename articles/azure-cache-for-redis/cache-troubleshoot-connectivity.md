---
title: Troubleshoot connectivity
description: Learn how to resolve connectivity problems when creating clients with Azure Cache for Redis.



ms.topic: conceptual
ms.date: 04/17/2025
appliesto:
  - ✅ Azure Cache for Redis
ms.custom: template-concept, ignite-2024
---

# Troubleshoot Azure Cache for Redis connectivity

This article explains how to troubleshoot common issues with connecting your client application to Azure Cache for Redis. Connectivity issues might be caused by intermittent conditions, or by incorrect cache configuration. This article is divided into intermittent issues and cache configuration issues.

**Intermittent connectivity issues**

- [Kubernetes-hosted applications](#kubernetes-hosted-applications)
- [Linux-based client application](#linux-based-client-application)
- [Number of connected clients](#number-of-connected-clients)
- [Server maintenance](#server-maintenance)

**Cache configuration connectivity issues**

- [Firewall rules](#third-party-firewall-or-external-proxy)
- [Private endpoint configuration](#private-endpoint-configuration)
- [Public IP address change](#public-ip-address-change)
- [Virtual network configuration](#virtual-network-configuration)

## Test connectivity

You can test connectivity by using the Redis command line tool _redis-cli_. For more information on Redis CLI, see [Use the Redis command-line tool with Azure Cache for Redis](cache-how-to-redis-cli-tool.md).

If redis-cli is unable to connect, you can test connectivity by using `PSPING` in Azure PowerShell.

```azurepowershell-interactive
psping -q <cachename>:<port>
```

If the number of sent packets is equal to the number of received packets, there's no drop in connectivity.

## Intermittent connectivity issues

Your client application might have intermittent connectivity issues caused by spikes in the number of connections or by events such as patching.

### Kubernetes hosted applications

If your client application is hosted on Kubernetes, check whether the cluster nodes or the pod running the client application are under memory, CPU, or network pressure. A pod running the client application can be affected by other pods running on the same node and might throttle Redis connections or IO operations.

If you're using _Istio_ or any other service mesh, make sure that your service mesh proxy reserves ports `13000-13019` or `15000-15019`. Clients use these ports to communicate with nodes in a clustered Azure Redis cache, and could cause connectivity issues on those ports.

### Linux-based client application

Using optimistic TCP settings in Linux might cause connectivity issues for client applications. For more information, see [TCP settings for Linux-hosted client applications](cache-best-practices-connection.md#tcp-settings-for-linux-hosted-client-applications) and [Connection stalls lasting for 15 minutes](https://github.com/StackExchange/StackExchange.Redis/issues/1848#issuecomment-913064646).

### Number of connected clients

Check if the **Max** aggregate for the **Connected Clients** metric is close to or higher than the maximum number of allowed connections for your cache size. For more information on sizing per client connections, see [Azure Cache for Redis performance](https://azure.microsoft.com/pricing/details/cache/).

### Server maintenance

Your cache might undergo planned or unplanned server maintenance that negatively affects your application during the maintenance window. You can verify this issue by checking the **Errors (Type: Failover)** metric on your cache in the Azure portal. To minimize the effects of failovers, see [Connection resilience](cache-best-practices-connection.md#connection-resilience).

## Connectivity configuration issues

If your application can't connect to your Azure Redis cache at all, some cache configuration might not be set up correctly. The following sections offer suggestions on how to make sure your cache is configured correctly.

### Firewall rules

If you have a firewall configured for your Azure Redis cache, ensure that your client IP address is added to the firewall rules. To check the firewall rules, select **Firewall** under **Settings** in the left navigation menu for your cache page.

#### Third-party firewall or external proxy

If you use a third-party firewall or proxy in your network, make sure it allows the Azure Cache for Redis endpoint `*.redis.cache.windows.net` and the ports `6379` and `6380`. You might need to allow more ports when you use a clustered cache or geo-replication.

### Private endpoint configuration

In the Azure portal, check your private endpoint configuration by selecting **Private Endpoint** under **Settings** in the left navigation menu for your cache.

- On the **Private Endpoint** page, ensure that **Enable public network access** is set correctly.

  - Public network access is disabled by default when you create a private endpoint.
  - To connect to your cache private endpoint from outside your cache virtual network, you must enable public network access.
  - If you delete your private endpoint, be sure to enable public network access.

- Select the link under **Private endpoint** and make sure your private endpoint is configured correctly. For more information, see [Create a private endpoint with a new Azure Cache for Redis instance](cache-private-link.md#create-a-private-endpoint-with-a-new-azure-cache-for-redis-instance).

- Make sure your application connects to `<cachename>.redis.cache.windows.net` on port `6380`. Avoid using `<cachename>.privatelink.redis.cache.windows.net` in the configuration or the connection string.

- To verify that a command resolves to the private IP address for the cache, run a command like `nslookup <hostname>` from within the virtual network linked to the private endpoint.
  
### Public IP address change

If you configure any networking or security resource to use your cache's public IP address, check to see whether your cache's public IP address changed. For more information, see [Rely on hostname not public IP address](cache-best-practices-development.md#rely-on-hostname-not-public-ip-address).

### Virtual network configuration

Check your virtual network configuration as follows:

- Make sure a virtual network is assigned to your cache. In the Azure portal, select **Virtual Network** under **Settings** in the left navigation menu for your cache.
- Ensure that the client host machine is in the same virtual network as the cache.
- If the client application is in a different virtual network from the cache, enable peering for both virtual networks within the same Azure region.
- Verify that the [Inbound](cache-how-to-premium-vnet.md#inbound-port-requirements) and [Outbound](cache-how-to-premium-vnet.md#outbound-port-requirements) rules meet the port requirements.

For more information, see [Configure virtual network support for a Premium Azure Cache for Redis instance](cache-how-to-premium-vnet.md).

#### Geo-replication using VNet injection with Premium caches

Geo-replication between caches in the same virtual network is supported. Geo-replication between caches in different virtual networks is supported with the following caveats:

- If the virtual networks are in the same region, you can connect them using [virtual network peering](/azure/virtual-network/virtual-network-peering-overview) or a [VPN Gateway VNet-to-VNet connection](/azure/vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal).

- If the virtual networks are in different regions, geo-replication using virtual network peering isn't supported. A client virtual machine in `VNet 1` (region 1) can't access a cache in `VNet 2` (region 2) by using its name, because of a constraint with Basic internal load balancers. Instead, use a VPN Gateway VNet-to-VNet connection. For more information about virtual network peering constraints, see [Virtual Network peering requirements and constraints](/azure/virtual-network/virtual-network-manage-peering#requirements-and-constraints).

To configure your virtual network effectively and avoid geo-replication issues, you must configure both the inbound and outbound ports correctly. For more information on avoiding the most common virtual network misconfiguration issues, see [Geo-replication peer port requirements](cache-how-to-premium-vnet.md#geo-replication-peer-port-requirements).

While it's possible to use virtual network injection with Premium caches, it's preferable to use Azure Private Link. For more information, see:

- [Migrate from `VNet` injection caches to Private Link caches](cache-vnet-migration.md)
- [What is Azure Cache for Redis with Azure Private Link?](cache-private-link.md)

## Related content

- [Best practices for connection resilience](cache-best-practices-connection.md)
- [High availability for Azure Cache for Redis](cache-high-availability.md)
