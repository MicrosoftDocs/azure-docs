---
title: Troubleshoot connectivity in Azure Cache for Redis
titleSuffix: Azure Cache for Redis
description: Learn how to resolve connectivity problems when creating clients with Azure Cache for Redis.
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.topic: conceptual 
ms.date: 12/12/2023
ms.custom: template-concept

---

# Connectivity troubleshooting

In this article, we provide troubleshooting help for connecting your client application to Azure Cache for Redis. Connectivity issues are divided into two types: intermittent connectivity issues and continuous connectivity issues.

- [Intermittent connectivity issues](#intermittent-connectivity-issues)
  - [Server maintenance](#server-maintenance)
  - [Number of connected clients](#number-of-connected-clients)
  - [Kubernetes hosted applications](#kubernetes-hosted-applications)
  - [Linux-based client application](#linux-based-client-application)
- [Continuous connectivity issues](#continuous-connectivity)
  - [Test connectivity using _redis-cli_](#test-connectivity-using-redis-cli)
  - [Test connectivity using PSPING](#test-connectivity-using-psping)
  - [Virtual network configuration](#virtual-network-configuration)
  - [Private endpoint configuration](#private-endpoint-configuration)
  - [Firewall rules](#third-party-firewall-or-external-proxy)
  - [Public IP address change](#public-ip-address-change)
- [Geo-replication using VNet injection with Premium caches](#geo-replication-using-vnet-injection-with-premium-caches)

## Intermittent connectivity issues

Your client application might have intermittent connectivity issues caused by events such as patching, or spikes in the number of connections.

### Server maintenance

Sometimes, your cache undergoes a planned or an unplanned server maintenance. Your application can be negatively affected during the maintenance. You can validate by checking the `Errors (Type: Failover)` metric on your portal. To minimize the effects of failovers, see [Connection resilience](cache-best-practices-connection.md#connection-resilience).

### Number of connected clients

Check if the Max aggregate for `Connected Clients` metric is close or higher than the maximum number of allowed connections for a particular cache size. For more information on sizing per client connections, see [Azure Cache for Redis performance](https://azure.microsoft.com/pricing/details/cache/).

### Kubernetes hosted applications

- If your client application is hosted on Kubernetes, check that the pod running the client application or the cluster nodes aren't under memory/CPU/Network pressure. A pod running the client application can be affected by other pods running on the same node and throttle Redis connections or IO operations.
- If you're using _Istio_ or any other service mesh, check that your service mesh proxy reserves port 13000-13019 or 15000-15019. These ports are used by clients to communicate with a clustered Azure Cache For Redis nodes and could cause connectivity issues on those ports.

### Linux-based client application

Using optimistic TCP settings in Linux might cause client applications to experience connectivity issues. See [Connection stalls lasting for 15 minutes](https://github.com/StackExchange/StackExchange.Redis/issues/1848#issuecomment-913064646).

## Continuous connectivity

If your application can't connect to your Azure Cache for Redis, it's possible some configuration on the cache isn't set up correctly. The following sections offer suggestions on how to make sure your cache is configured correctly.

### Test connectivity using _redis-cli_

Test connectivity using _redis-cli_. For more information on CLI, [Use the Redis command-line tool with Azure Cache for Redis](cache-how-to-redis-cli-tool.md).

### Test connectivity using PSPING

If _redis-cli_ is unable to connect, you can test connectivity using `PSPING` in PowerShell.

```azurepowershell-interactive
psping -q <cache DNS endpoint>:<Port Number>
```

You can confirm the number of sent packets is equal to the received packets. Confirming ensures no drop in connectivity.

### Virtual network configuration

Steps to check your virtual network configuration:

1. Check if a virtual network is assigned to your cache from the "**Virtual Network**" section under the **Settings** on the Resource menu of the Azure portal.
1. Ensure that the client host machine is in the same virtual network as the Azure Cache For Redis.
1. When the client application is in a different VNet from your Azure Cache For Redis, both VNets must have VNet peering enabled within the same Azure region.
1. Validate that the [Inbound](cache-how-to-premium-vnet.md#inbound-port-requirements) and [Outbound](cache-how-to-premium-vnet.md#outbound-port-requirements) rules meet the requirement.
1. For more information, see [Configure a virtual network - Premium-tier Azure Cache for Redis instance](cache-how-to-premium-vnet.md#how-can-i-verify-that-my-cache-is-working-in-a-virtual-network).

### Private endpoint configuration

Steps to check your private endpoint configuration:

1. `Public Network Access` flag is disabled by default on creating a private endpoint. Ensure that you have set the `Public Network Access` correctly. When you have your cache in Azure portal, look under **Private Endpoint** in the Resource menu on the left for this setting.
1. If you're trying to connect to your cache private endpoint from outside your virtual network of your cache, `Public Network Access` needs to be enabled.
1. If you've deleted your private endpoint, ensure that the public network access is enabled.
1. Verify if your private endpoint is configured correctly. For more information, see [Create a private endpoint with a new Azure Cache for Redis instance](cache-private-link.md#create-a-private-endpoint-with-a-new-azure-cache-for-redis-instance).
1. Verify if your application is connecting to `<cachename>.redis.cache.windows.net` on port 6380. We recommend avoiding the use of `<cachename>.privatelink.redis.cache.windows.net` in the configuration or the connection string.
1. Run a command like `nslookup <hostname>` from within the VNet that is linked to the private endpoint to verify that the command resolves to the private IP address for the cache.
  
### Firewall rules

If you have a firewall configured for your Azure Cache For Redis, ensure that your client IP address is added to the firewall rules. You can check **Firewall** on the Resource menu under **Settings** on the Azure portal.

#### Third-party firewall or external proxy

When you use a third-party firewall or proxy in your network, check that the endpoint for Azure Cache for Redis, `*.redis.cache.windows.net`, is allowed along with the ports `6379` and `6380`. You might need to allow more ports when using a clustered cache or geo-replication.

### Public IP address change

If you've configured any networking or security resource to use your cache's public IP address, check to see if your cache's public IP address changed. For more information, see [Rely on hostname not public IP address for your cache](cache-best-practices-development.md#rely-on-hostname-not-public-ip-address).

## Geo-replication using VNet injection with Premium caches

While it is possible to use VNet injection with your Premium caches, we recommend Azure Private Link.

For more information, see:

- [Migrate from VNet injection caches to Private Link caches](cache-vnet-migration.md)
- [What is Azure Cache for Redis with Azure Private Link?](cache-private-link.md)

Geo-replication of caches in VNets is supported with caveats:

- Geo-replication between caches in the same VNet is supported.
- Geo-replication between caches in different VNets is also supported.
  - If the VNets are in the same region, you can connect them using [VNet peering](../virtual-network/virtual-network-peering-overview.md) or a [VPN Gateway VNet-to-VNet connection](../vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md).
  - If the VNets are in different regions, geo-replication using VNet peering is not supported. A client VM in VNet 1 (region 1) isn't able to access the cache in VNet 2 (region 2) using its DNS name because of a constraint with Basic internal load balancers. For more information about VNet peering constraints, see [Virtual Network - Peering - Requirements and constraints](../virtual-network/virtual-network-manage-peering.md#requirements-and-constraints). We recommend using a VPN Gateway VNet-to-VNet connection.

To configure your VNet effectively and avoid geo-replication issues, you must configure both the inbound and outbound ports correctly. For more information on avoiding the most common VNet misconfiguration issues, see [Geo-replication peer port requirements](cache-how-to-premium-vnet.md#geo-replication-peer-port-requirements).

## Related Content

These articles provide more information on connectivity and resilience:

- [Best practices for connection resilience](cache-best-practices-connection.md)
- [High availability for Azure Cache for Redis](cache-high-availability.md)
