---
title: Load Balancer TCP Reset and idle timeout in Azure
titleSuffix: Azure Load Balancer
description: With this article, learn about Azure Load Balancer with bidirectional TCP RST packets on idle timeout.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 12/19/2022
ms.author: mbender
ms.custom: template-concept, engagement-fy23
---

# Load Balancer TCP Reset and Idle Timeout

You can use [Standard Load Balancer](./load-balancer-overview.md) to create a more predictable application behavior for your scenarios by enabling TCP Reset on Idle for a given rule. Load Balancer's default behavior is to silently drop flows when the idle timeout of a flow is reached.  Enabling TCP reset will cause Load Balancer to send bidirectional TCP Resets (TCP RST packet) on idle timeout.  This will inform your application endpoints that the connection has timed out and is no longer usable.  Endpoints can immediately establish a new connection if needed.

:::image type="content" source="media/load-balancer-tcp-reset/load-balancer-tcp-reset.png" alt-text="Diagram shows default TCP reset behavior of network nodes.":::
 
## TCP reset

You change this default behavior and enable sending TCP Resets on idle timeout on inbound NAT rules, load balancing rules, and [outbound rules](./load-balancer-outbound-connections.md#outboundrules).  When enabled per rule, Load Balancer will send bidirectional TCP Reset (TCP RST packets) to both client and server endpoints at the time of idle timeout for all matching flows.

Endpoints receiving TCP RST packets close the corresponding socket immediately. This provides an immediate notification to the endpoints that the release of the connection has occurred and any future communication on the same TCP connection will fail.  Applications can purge connections when the socket closes and reestablish connections as needed without waiting for the TCP connection to eventually time-out.

For many scenarios, TCP reset may reduce the need to send TCP (or application layer) keepalives to refresh the idle timeout of a flow. 

If your idle durations exceed configuration limits or your application shows an undesirable behavior with TCP Resets enabled, you may still need to use TCP keepalives, or application layer keepalives, to monitor the liveness of the TCP connections.  Further, keepalives can also remain useful for when the connection is proxied somewhere in the path, particularly application layer keepalives.  

By carefully examining the entire end to end scenario, you can determine the benefits from enabling TCP Resets and adjusting the idle timeout. Then you decide if more steps may be required to ensure the desired application behavior.

## Configurable TCP idle timeout

Azure Load Balancer has a 4 minutes to 100 minutes timeout range for Load Balancer rules, Outbound Rules, and Inbound NAT rules.

By default, it's set to 4 minutes. If a period of inactivity is longer than the timeout value, there's no guarantee that the TCP or HTTP session is maintained between the client and your cloud service.

When the connection is closed, your client application may receive the following error message: "The underlying connection was closed: A connection that was expected to be kept alive was closed by the server."

A common practice is to use a TCP keep-alive. This practice keeps the connection active for a longer period. For more information, see these [.NET examples](/dotnet/api/system.net.servicepoint.settcpkeepalive). With keep-alive enabled, packets are sent during periods of inactivity on the connection. Keep-alive packets ensure the idle timeout value isn't reached and the connection is maintained for a long period.

The setting works for inbound connections only. To avoid losing the connection, configure the TCP keep-alive with an interval less than the idle timeout setting or increase the idle timeout value. To support these scenarios, support for a configurable idle timeout has been added.

TCP keep-alive works for scenarios where battery life isn't a constraint. It isn't recommended for mobile applications. Using a TCP keep-alive in a mobile application can drain the device battery faster.

## Order of precedence

It is important to take into account how the idle timeout values set for different IPs could potentially interact.

### Inbound

- If there is an (inbound) load balancer rule with an idle timeout value set differently than the idle timeout of the frontend IP it references, the load balancer frontend IP idle timeout will take precedence.
- If there is an inbound NAT rule with an idle timeout value set differently than the idle timeout of the frontend IP it references, the load balancer frontend IP idle timeout will take precedence.

### Outbound

- If there is an outbound rule with an idle timeout value different than 4 minutes (which is what public IP outbound idle timeout is locked at), the outbound rule idle timeout will take precedence.
- Because a NAT gateway will always take precedence over load balancer outbound rules (and over public IP addresses assigned directly to VMs), the idle timeout value assigned to the NAT gateway will be used.  (Along the same lines, the locked public IP outbound idle timeouts of 4 minutes of any IPs assigned to the NAT GW are not considered.) 

## Limitations

- TCP reset only sent during TCP connection in ESTABLISHED state.
- TCP idle timeout doesn't affect load balancing rules on UDP protocol.
- TCP reset isn't supported for ILB HA ports when a network virtual appliance is in the path. A workaround could be to use outbound rule with TCP reset from NVA.

## Next steps

- Learn about [Standard Load Balancer](./load-balancer-overview.md).
- Learn about [outbound rules](./load-balancer-outbound-connections.md#outboundrules).
- [Configure TCP RST on Idle Timeout](load-balancer-tcp-idle-timeout.md)
