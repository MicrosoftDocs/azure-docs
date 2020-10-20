---
title: Load Balancer TCP Reset and idle timeout in Azure
titleSuffix: Azure Load Balancer
description: With this article, learn about Azure Load Balancer with bidirectional TCP RST packets on idle timeout.
services: load-balancer
documentationcenter: na
author: asudbring
ms.custom: seodec18
ms.service: load-balancer
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/07/2020
ms.author: allensu
---

# Load Balancer TCP Reset and Idle Timeout

You can use [Standard Load Balancer](load-balancer-standard-overview.md) to create a more predictable application behavior for your scenarios by enabling TCP Reset on Idle for a given rule. Load Balancer's default behavior is to silently drop flows when the idle timeout of a flow is reached.  Enabling this feature will cause Load Balancer to send bidirectional TCP Resets (TCP RST packet) on idle timeout.  This will inform your application endpoints that the connection has timed out and is no longer usable.  Endpoints can immediately establish a new connection if needed.

![Load Balancer TCP reset](media/load-balancer-tcp-reset/load-balancer-tcp-reset.png)
 
## TCP reset

You change this default behavior and enable sending TCP Resets on idle timeout on inbound NAT rules, load balancing rules, and [outbound rules](https://aka.ms/lboutboundrules).  When enabled per rule, Load Balancer will send bidirectional TCP Reset (TCP RST packets) to both client and server endpoints at the time of idle timeout for all matching flows.

Endpoints receiving TCP RST packets close the corresponding socket immediately. This provides an immediate notification to the endpoints that the release of the connection has occurred and any future communication on the same TCP connection will fail.  Applications can purge connections when the socket closes and reestablish connections as needed without waiting for the TCP connection to eventually time out.

For many scenarios, this may reduce the need to send TCP (or application layer) keepalives to refresh the idle timeout of a flow. 

If your idle durations exceed those of allowed by the configuration or your application shows an undesirable behavior with TCP Resets enabled, you may still need to use TCP keepalives (or application layer keepalives) to monitor the liveness of the TCP connections.  Further, keepalives can also remain useful for when the connection is proxied somewhere in the path, particularly application layer keepalives.  

Carefully examine the entire end to end scenario to decide whether you benefit from enabling TCP Resets, adjusting the idle timeout, and if additional steps may be required to ensure the desired application behavior.

## Configurable TCP idle timeout

Azure Load Balancer has the following idle timeout range:
-  4 minutes to 100 minutes for Outbound Rules
-  4 minutes to 30 minutes for Load Balancer rules and Inbound NAT rules

By default, it is set to 4 minutes. If a period of inactivity is longer than the timeout value, there's no guarantee that the TCP or HTTP session is maintained between the client and your cloud service.

When the connection is closed, your client application may receive the following error message: "The underlying connection was closed: A connection that was expected to be kept alive was closed by the server."

A common practice is to use a TCP keep-alive. This practice keeps the connection active for a longer period. For more information, see these [.NET examples](https://msdn.microsoft.com/library/system.net.servicepoint.settcpkeepalive.aspx). With keep-alive enabled, packets are sent during periods of inactivity on the connection. Keep-alive packets ensure the idle timeout value isn't reached and the connection is maintained for a long period.

The setting works for inbound connections only. To avoid losing the connection, configure the TCP keep-alive with an interval less than the idle timeout setting or increase the idle timeout value. To support these scenarios, support for a configurable idle timeout has been added.

TCP keep-alive works for scenarios where battery life isn't a constraint. It isn't recommended for mobile applications. Using a TCP keep-alive in a mobile application can drain the device battery faster.


## Limitations

- TCP reset only sent during TCP connection in ESTABLISHED state.
- TCP reset is not sent for internal Load Balancers with HA ports configured.
- TCP idle timeout does not affect load balancing rules on UDP protocol.

## Next steps

- Learn about [Standard Load Balancer](load-balancer-standard-overview.md).
- Learn about [outbound rules](load-balancer-outbound-rules-overview.md).
- [Configure TCP RST on Idle Timeout](load-balancer-tcp-idle-timeout.md)
