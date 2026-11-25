---
title: Load Balancer TCP Reset and idle timeout in Azure
titleSuffix: Azure Load Balancer
description: With this article, learn about Azure Load Balancer with bidirectional TCP Reset packets on idle timeout.
services: load-balancer
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: concept-article
ms.date: 07/31/2024
ai-usage: ai-assisted
ms.author: mbender
# Customer intent: "As a network administrator, I want to enable TCP resets on idle timeout for load balancer rules, so that I can enhance application responsiveness by promptly notifying endpoints of closed connections."
---

# Load Balancer TCP Reset and Idle Timeout

You can use [Standard Load Balancer](./load-balancer-overview.md) to create a more predictable application behavior for your scenarios by enabling TCP Reset on Idle for a given rule. Load Balancer's default behavior is to silently drop flows when the idle timeout of a flow is reached. Enabling TCP reset causes Load Balancer to send bidirectional TCP Resets (TCP reset packets) on idle timeout to inform your application endpoints that the connection timed out and is no longer usable. Endpoints can immediately establish a new connection if needed.

:::image type="content" source="media/load-balancer-tcp-reset/load-balancer-tcp-reset.png" alt-text="Diagram shows default TCP reset behavior of network nodes.":::
 
## TCP reset

You change this default behavior and enable sending TCP Resets on idle timeout on inbound NAT rules, load balancing rules, and [outbound rules](./load-balancer-outbound-connections.md#outboundrules). When enabled per rule, Load Balancer sends bidirectional TCP Resets (TCP RST packets) to both client and server endpoints at the time of idle timeout for all matching flows.

Endpoints receiving TCP RST packets close the corresponding socket immediately. This provides an immediate notification to the endpoint's connection release and any future communication on the same TCP connection will fail. Applications can purge connections when the socket closes and reestablish connections as needed without waiting for the TCP connection to eventually time out.

For many scenarios, a TCP reset can reduce the need to send TCP (or application layer) keepalives to refresh the idle timeout of a flow.

### Choose between TCP reset and keepalives

Use the following criteria to decide which mechanism your scenario needs:

- **Enable TCP reset** when you want endpoints notified immediately that an idle flow closed, so applications can purge and reestablish connections instead of waiting for their own TCP timeout.
- **Use TCP keepalives** when your idle durations exceed the configurable idle timeout range, or when your application behaves unexpectedly with TCP resets enabled. Keepalives aren't recommended for mobile applications, because they drain device battery faster.
- **Use application layer keepalives** when the connection is proxied somewhere in the path, because a proxy can terminate the TCP connection that transport-layer keepalives refresh.

By carefully examining the entire end-to-end scenario, you can determine the benefits of enabling TCP resets and adjusting the idle timeout. Then decide if more steps are required to ensure the desired application behavior.

## Configurable TCP idle timeout

Azure Load Balancer Standard has a 4 minutes to 100-minutes timeout range for load balancer rules and inbound NAT rules. [Outbound rules](./outbound-rules.md#idletimeout) have a configurable range of 4 to 120 minutes. The default is 4 minutes for all rule types. If a period of inactivity is longer than the timeout value, there's no guarantee that the TCP or HTTP session is maintained between the client and your cloud service. Azure Load Balancer Basic (retired) had up to a 60 minute timeout range.

When the connection is closed, your client application can receive the following error message: "The underlying connection was closed: A connection that was expected to be kept alive was closed by the server."

If TCP resets are enabled, and it's missed for any reason, resets for any subsequent packets. If the TCP reset option isn't enabled, then packets are silently dropped.

A common practice is to use a TCP keep-alive. This practice keeps the connection active for a longer period. For more information, see these [.NET examples](/dotnet/api/system.net.servicepoint.settcpkeepalive). With keep-alive enabled, packets are sent during periods of inactivity on the connection. Keep-alive packets ensure the idle timeout value isn't reached and the connection is maintained for a long period.

The TCP keep-alive described in this section applies to inbound connections only. TCP reset and configurable idle timeout are separately supported on outbound rules. To avoid losing the connection, configure the TCP keep-alive with an interval less than the idle timeout setting or increase the idle timeout value. To support these scenarios, support for a configurable idle timeout is available.

TCP keep-alive works for scenarios where battery life isn't a constraint. It isn't recommended for mobile applications. Using a TCP keep-alive in a mobile application can drain the device battery faster.

## Order of precedence

It's important to take into account how the idle timeout values set for different IPs could potentially interact.

### Inbound

- If there's an (inbound) load balancer rule with an idle timeout value set differently than the idle timeout of the frontend IP it references, the load balancer frontend IP idle timeout takes precedence.
- If there's an inbound NAT rule with an idle timeout value set differently than the idle timeout of the frontend IP it references, the load balancer frontend IP idle timeout takes precedence.

### Outbound

- If there's an outbound rule with an idle timeout value different than 4 minutes (which is what public IP outbound idle timeout is locked at), the outbound rule idle timeout takes precedence.
- Because a NAT gateway will always take precedence over load balancer outbound rules (and over public IP addresses assigned directly to VMs), the idle timeout value assigned to the NAT gateway will be used. (Along the same lines, the locked public IP outbound idle timeouts of 4 minutes of any IPs assigned to the NAT GW aren't considered.) 

## Limitations

These limitations apply to TCP reset and idle timeout on Azure Load Balancer:

- TCP reset is only sent during a TCP connection in ESTABLISHED state.
- Idle timeout isn't supported for UDP load-balancing rules.
- TCP reset isn't supported for internal load balancer high availability (HA) ports rules when a network virtual appliance (NVA) is in the path. As a workaround, use an outbound rule with TCP reset from the network virtual appliance.
- TCP idle timeout isn't supported for internal load balancer HA ports rules when a user-defined route (UDR) forwards traffic to the internal load balancer.

## Next steps

- Learn about [Standard Load Balancer](./load-balancer-overview.md).
- Learn about [outbound rules](./load-balancer-outbound-connections.md#outboundrules).
- [Configure TCP RST on Idle Timeout](load-balancer-tcp-idle-timeout.md)
