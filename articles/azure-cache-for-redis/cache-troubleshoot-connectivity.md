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

Your client application could experience intermittent connectivity issues. In this article, we provide troubleshooting help for connecting your client application to Azure Cache for Redis.

## Server maintenance

It is possible that your cache underwent a planned or an unplanned maintenance during the time when your application was affected. You can validate by checking the "Errors: Type Failover" metric on your portal. To minimize the effects of failovers, see [Connection resilience](cache-best-practices-connection.md#connection-resilience)

## Number of connected clients

Check if the Max aggregate for "Connected Clients" metric is close or higher than the maximum number of allowed connections for a particular cache size. See <!--link to table for thresholds -->

## Kubernetes hosted applications

1. If your client application is hosted on Kubernetes, check that the pod running the client application or the cluster nodes are under memory/CPU/Network pressure. Kubernetes hosted applications are prone to "noisy neighbor" problem. <!-- we seem to be trying to get rid of the noisy neighbor verbiage. What are the options? -->
1. If you're using *Istio* or any other service mesh, check that your service mesh proxy reserves port 13000-13019 or 15000-15019. These ports are used by clients to communicate with a clustered Azure Cache For Redis nodes and could cause connectivity issues on those ports.

## Linux-based client application

Using optimistic TCP settings in Linux can cause client applications could experience connectivity issues. See <!--link to 15 mins issue-->

If your application is unable to connect to your Azure Cache for Redis continually, it's possible some configuration on the cache isn't set up correctly. The following steps help ensure  your cache is configured correctly.

### Azure Cache for Redis CLI

Test connectivity using Azure Cache for Redis CLI. For more information on CLI,[Use the Redis command-line tool with Azure Cache for Redis](cache-how-to-redis-cli-tool.md).

### PSPING

If Azure Cache for Redis CLI is unable to connect, you can test connectivity using `PSPING`.

```azurepowershell-interactive
psping -q <cache DNS endpoint>:<Port Number>
```

You can confirm the number of sent packets is equal to the received packets. Confirming ensures no drop in connectivity.

### Virtual network configuration

1. Check if a virtual network is assigned to your cache from the "**Virtual Network**" section under the **Settings** blade on the Azure portal. <!-- Need to fix the blade verbiage. -->
1. Ensure that the client host machine is in the same virtual network as the Azure Cache For Redis.
1. In case the client application is in a different VNET than your Azure Cache For Redis, ensure that both the VNETs have VNET  peering enabled within the same Azure region. 
1. Validate that the [Inbound](cache-how-to-premium-vnet.md#inbound-port-requirements) and [Outbound](cache-how-to-premium-vnet.md#outbound-port-requirements) rules are in place as per the requirement.
1. For more information, see [Configure a virtual network - Premium-tier Azure Cache for Redis instance](cache-how-to-premium-vnet.md#how-can-i-verify-that-my-cache-is-working-in-a-virtual-network).

### Private endpoint configuration

1. `Public Network Access` flag is disabled by default on creating a private endpoint and ensure that you have set the `Public Network Access correctly.
1. If you're trying to connect to your cache private endpoint from outside your cache virtual network, Public Network Access flag needs to be enabled.
1. If you've deleted your private endpoint, ensure that the public network access is enabled.
1. Verify <!--link to private link setup--> if your private endpoint is configured correctly.

### Firewall rules

If you have a firewall configured for your Azure Cache For Redis, ensure that your client IP address is added to the firewall rules. You can check **Firewall** blade under **Settings** on the portal.

### Third-party firewall or external proxy

If you're using a third-party firewall or proxy in your network, ensure that the Azure Cache for Redis endpoint `*.redis.cache.windows.net` is whitelisted along with the ports `6379` and `6380`. You might need to allow more ports when using a clustered cache.

## Next steps
<!-- Add a context sentence for the following links -->
- Write concepts
- Links
