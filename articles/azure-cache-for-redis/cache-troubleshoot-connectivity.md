---
title: Troubleshoot connectivity in Azure Cache for Redis
titleSuffix: Azure Cache for Redis
description: Learn how to resolve connectivity problems when creating clients with Azure Cache for Redis.
author: curib
ms.author: cauribeg
ms.service: cache
ms.topic: conceptual 
ms.date: 11/20/2021
ms.custom: template-concept
---

# Connectivity troubleshooting

Your client application could experience intermittent connectivity issues. If your application is unable to connect to your Azure Cache for Redis continually, it's possible some configuration on the cache isn't set up correctly. In this article, we provide troubleshooting help for connecting your client application to Azure Cache for Redis.

## Server maintenance

Sometimes, your cache undergoes a planned or an unplanned server maintenance. Your application can be negatively affected during the maintenance. You can validate by checking the "Errors: Type Failover" metric on your portal. To minimize the effects of failovers, see [Connection resilience](cache-best-practices-connection.md#connection-resilience).

## Number of connected clients

Check if the Max aggregate for `Connected Clients` metric is close or higher than the maximum number of allowed connections for a particular cache size. For more information on sizing per client connections, see [Azure Cache for Redis performance](cache-planning-faq.yml#azure-cache-for-redis-performance) <!-- is this the table -->

## Kubernetes hosted applications

1. If your client application is hosted on Kubernetes, check that the pod running the client application or the cluster nodes are under memory/CPU/Network pressure. A pod running the client application can be affected by other pods running on the same node and throttle Redis connections or IO operations.
1. If you're using *Istio* or any other service mesh, check that your service mesh proxy reserves port 13000-13019 or 15000-15019. These ports are used by clients to communicate with a clustered Azure Cache For Redis nodes and could cause connectivity issues on those ports.

## Linux-based client application

Using optimistic TCP settings in Linux can cause client applications could experience connectivity issues. See [Connection stalls lasting for 15 minutes](https://github.com/StackExchange/StackExchange.Redis/issues/1848#issuecomment-913064646).

## Azure Cache for Redis CLI

Test connectivity using Azure Cache for Redis CLI. For more information on CLI,[Use the Redis command-line tool with Azure Cache for Redis](cache-how-to-redis-cli-tool.md).

## PSPING

If Azure Cache for Redis CLI is unable to connect, you can test connectivity using `PSPING`.

```azurepowershell-interactive
psping -q <cache DNS endpoint>:<Port Number>
```

You can confirm the number of sent packets is equal to the received packets. Confirming ensures no drop in connectivity.

## Virtual network configuration

1. Check if a virtual network is assigned to your cache from the "**Virtual Network**" section under the **Settings** on the Resource menu of the Azure portal.
1. Ensure that the client host machine  <!-- can we avoid the word machine --> is in the same virtual network as the Azure Cache For Redis.
1. When the client application is in a different VNet than your Azure Cache For Redis, both VNets must have VNet peering enabled within the same Azure region.
1. Validate that the [Inbound](cache-how-to-premium-vnet.md#inbound-port-requirements) and [Outbound](cache-how-to-premium-vnet.md#outbound-port-requirements) rules meet the requirement.
1. For more information, see [Configure a virtual network - Premium-tier Azure Cache for Redis instance](cache-how-to-premium-vnet.md#how-can-i-verify-that-my-cache-is-working-in-a-virtual-network).

## Private endpoint configuration

1. `Public Network Access` flag is disabled by default on creating a private endpoint. Ensure that you have set the `Public Network Access` correctly. <!-- where is the flag? -->
1. If you're trying to connect to your cache private endpoint from outside your virtual network of your cache, `Public Network Access` needs to be enabled.
1. If you've deleted your private endpoint, ensure that the public network access is enabled.
1. Verify if your private endpoint is configured correctly. For more information, see [Create a private endpoint with a new Azure Cache for Redis instance](cache-private-link.md#create-a-private-endpoint-with-a-new-azure-cache-for-redis-instance).

## Firewall rules

If you have a firewall configured for your Azure Cache For Redis, ensure that your client IP address is added to the firewall rules. You can check **Firewall** on the Resource menu under **Settings** on the Azure portal.

### Third-party firewall or external proxy

When you use a third-party firewall or proxy in your network, ensure that the endpoint for Azure Cache for Redis, `*.redis.cache.windows.net`, is allowed along with the ports `6379` and `6380`. You might need to allow more ports when using a clustered cache.

## Next steps
<!-- Add a context sentence for the following links -->
- Write concepts
- Links
