---
title: Load Balancer TCP Reset on Idle in Azure
titleSuffix: Azure Load Balancer
description: With this article, learn about Azure Load Balancer with bidirectional TCP RST packets on idle timeout.
services: load-balancer
documentationcenter: na
author: asudbring
ms.custom: seodec18
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/03/2019
ms.author: allensu
---

# Load Balancer with TCP Reset on Idle

You can use [Standard Load Balancer](load-balancer-standard-overview.md) to create a more predictable application behavior for your scenarios by enabling TCP Reset on Idle for a given rule. Load Balancer's default behavior is to silently drop flows when the idle timeout of a flow is reached.  Enabling this feature will cause Load Balancer to send bidirectional TCP Resets (TCP RST packet) on idle timeout.  This will inform your application endpoints that the connection has timed out and is no longer usable.  Endpoints can immediately establish a new connection if needed.

![Load Balancer TCP reset](media/load-balancer-tcp-reset/load-balancer-tcp-reset.png)
 
You change this default behavior and enable sending TCP Resets on idle timeout on inbound NAT rules, load balancing rules, and [outbound rules](https://aka.ms/lboutboundrules).  When enabled per rule, Load Balancer will send bidirectional TCP Reset (TCP RST packets) to both client and server endpoints at the time of idle timeout for all matching flows.

Endpoints receiving TCP RST packets close the corresponding socket immediately. This provides an immediate notification to the endpoints that the release of the connection has occurred and any future communication on the same TCP connection will fail.  Applications can purge connections when the socket closes and reestablish connections as needed without waiting for the TCP connection to eventually time out.

For many scenarios, this may reduce the need to send TCP (or application layer) keepalives to refresh the idle timeout of a flow. 

If your idle durations exceed those of allowed by the configuration or your application shows an undesirable behavior with TCP Resets enabled, you may still need to use TCP keepalives (or application layer keepalives) to monitor the liveness of the TCP connections.  Further, keepalives can also remain useful for when the connection is proxied somewhere in the path, particularly application layer keepalives.  

Carefully examine the entire end to end scenario to decide whether you benefit from enabling TCP Resets, adjusting the idle timeout, and if additional steps may be required to ensure the desired application behavior.

## Enabling TCP Reset on idle timeout

Using API version 2018-07-01, you can enable sending of bidirectional TCP Resets on idle timeout on a per rule basis:

```json
      "loadBalancingRules": [
        {
          "enableTcpReset": true | false,
        }
      ]
```

```json
      "inboundNatRules": [
        {
          "enableTcpReset": true | false,
        }
      ]
```

```json
      "outboundRules": [
        {
          "enableTcpReset": true | false,
        }
      ]
```

## <a name="regions"></a> Region availability

Available in all regions.

## Limitations

- TCP RST only sent during TCP connection in ESTABLISHED state.

## Next steps

- Learn about [Standard Load Balancer](load-balancer-standard-overview.md).
- Learn about [outbound rules](load-balancer-outbound-rules-overview.md).
- [Configure TCP RST on Idle Timeout](load-balancer-tcp-idle-timeout.md)
