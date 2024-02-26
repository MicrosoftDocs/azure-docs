---
title: Source Network Address Translation (SNAT) with Azure NAT Gateway
description: Learn about options and considerations for Source Network Address Translation (SNAT) with Azure NAT Gateway.
author: asudbring
ms.author: allensu
ms.service: nat-gateway
ms.topic: concept-article #Required; leave this attribute/value as-is.
ms.date: 07/06/2023

---
# Source Network Address Translation (SNAT) with Azure NAT Gateway

Source Network Address Translation (SNAT) allows traffic from a private virtual network to connect to the internet while remaining fully private. SNAT rewrites the source IP and port of the originating packet to a public IP and port combination. Ports are used as unique identifiers to distinguish different connections from one another. The internet uses a five-tuple hash (protocol, source IP/port, destination IP/port) to provide this distinction.

SNAT also allows multiple private instances within a virtual network to use the same single public IP address or set of IP addresses (prefix) to connect to the internet.

NAT gateway enables a many-to-one SNAT capability. Many private instances in a subnet can SNAT to a public IP address attached to NAT gateway in order to connect to the internet. When NAT gateway makes multiple connections to the same destination endpoint, each new connection uses a different SNAT port so that connections can be distinguished from one another.

SNAT port exhaustion occurs when a source endpoint has run out of available SNAT ports to differentiate between new connections. When SNAT port exhaustion occurs, connections fail.

## Scale SNAT for NAT gateway

Scaling NAT gateway is primarily a function of managing the shared, available SNAT port inventory.

SNAT port inventory is provided by the public IP addresses, public IP prefixes or both attached to NAT gateway. SNAT port inventory is made available on-demand to all instances within a subnet attached to NAT gateway. As the workload of a subnet’s private instances scale, NAT gateway allocates SNAT ports as needed.

When multiple subnets within a virtual network are attached to the same NAT gateway resource, the SNAT port inventory provided by NAT gateway is shared across all subnets.

A single NAT gateway can scale up to 16 IP addresses. Each NAT gateway public IP address provides 64,512 SNAT ports to make outbound connections. NAT gateway can scale up to over 1 million SNAT ports. TCP and UDP are separate SNAT port inventories and are unrelated to NAT gateway.

## NAT gateway dynamically allocates SNAT ports

NAT gateway dynamically allocates SNAT ports across a subnet's private resources, such as virtual machines. All available SNAT ports are used on-demand by any virtual machine in subnets configured with NAT gateway.

Preallocation of SNAT ports to each virtual machine is required for other SNAT methods. This preallocation of SNAT ports can cause SNAT port exhaustion on some virtual machines while others still have available SNAT ports for connecting outbound.

With NAT gateway, preallocation of SNAT ports isn't required, which means SNAT ports aren't left unused by virtual machines not actively needing them.

After a SNAT port is released, it's available for use by any virtual machine within subnets configured with NAT gateway. On-demand allocation allows dynamic and divergent workloads on subnets to use SNAT ports as needed. As long as SNAT ports are available, SNAT flows succeed.

## NAT gateway SNAT port selection and reuse

NAT gateway selects a SNAT port at random out of the available inventory of ports to make new outbound connections. If NAT gateway doesn't find any available SNAT ports, then it reuses a SNAT port. The same SNAT port can be used to connect to multiple different destinations at the same time.

A SNAT port can be reused to connect to the same destination endpoint. Before the port is reused, NAT gateway places a SNAT port reuse timer for cool down on the port after the connection closes.

The SNAT port reuse down timer helps prevent ports from being selected too quickly for connecting to the same destination. This process is helpful when destination endpoints have firewalls or other services configured that place a cool down timer on source ports. A SNAT port may be placed on a different length port reuse timer for cool down depending on how the previous connection closed. To learn more, see [Port Reuse Timers](/azure/nat-gateway/nat-gateway-resource#timers).

## Example SNAT flows for NAT gateway

### Many to one SNAT with NAT gateway

NAT gateway provides a many to one configuration in which multiple private instances within a NAT gateway configured subnet can use the same public IP address to connect outbound.

In the following table, two different virtual machines (10.0.0.1 and 10.2.0.1) make connections to https://microsoft.com destination IP 23.53.254.142. When NAT gateway is configured with public IP address 65.52.1.1, each virtual machine's source IPs are translated into NAT gateway's public IP address and a SNAT port:

| Flow | Source tuple | Source tuple after SNAT | Destination tuple |
| --- | --- | --- | --- |
| 1 | 10.0.0.1:4283 | 65.52.1.1:1234 | 23.53.254.142:80 |
| 2 | 10.0.0.1:4284 | 65.52.1.1:1235 | 23.53.254.142:80 |
| 3 | 10.2.0.1:5768 | 65.52.1.1:1236 | 23.53.254.142:80 |

**IP masquerading** or **port masquerading** is the act of replacing the private IP and port with the public IP and port before connecting to the internet. Multiple private resources can be masqueraded behind the same public IP of NAT gateway.

### NAT gateway reuses a SNAT port to connect to a new destination

As mentioned previously, NAT gateway can reuse the same SNAT port to connect simultaneously to a new destination endpoint. In the following table, NAT gateway translates flow 4 to a SNAT port that is already in use for other destinations (see flow 1 from previous table).

| Flow | Source tuple | Source tuple after SNAT | Destination tuple |
| --- | --- | --- | --- |
| 4 | 10.0.0.1:4285 | 65.52.1.1:1234 | 26.108.254.155:80 |

### NAT gateway SNAT port cool down for reuse to the same destination

In a scenario where NAT gateway reuses a SNAT port to make new connections to the same destination endpoint, the SNAT port is first placed in a SNAT port reuse phase for cool down. The SNAT port reuse period helps ensure that SNAT ports aren't reused too quickly when connecting to the same destination. This SNAT port reuse for cool down on NAT gateway is beneficial in scenarios where the destination endpoint has a firewall with its own source port timer for cool down in place.

To demonstrate this SNAT port reuse cool down behavior, let's take a closer look at flow 4 from the previous table. Flow 4 was connecting to a destination endpoint fronted by a firewall with a 20-second source port cool down timer.

| Flow | Source tuple | Source tuple after SNAT | Destination tuple | Packet type connection is closed with | Destination firewall timer for cool down for source port |
| --- | --- | --- | --- | --- | --- |
| 4 | 10.0.0.1:4285 | 65.52.1.1:1234 | 26.108.254.155:80 | TCP FIN | 20 seconds |

Connection flow 4 closes with a TCP FIN packet. Since the connection is closed with a TCP FIN packet, NAT gateway places SNAT port 1234 in cool down for 65 seconds before it can be reused. Because port 1234 is in cool down for longer than the firewall source port cool down timer duration of 20 seconds, connection flow 5 proceeds with reusing SNAT port 1234 without issue.

| Flow | Source tuple | Source tuple after SNAT | Destination tuple |
| --- | --- | --- | --- |
| 5 | 10.2.0.1:5769 | 65.52.1.1:1234 | 26.108.254.155:80 |

Keep in mind that NAT gateway places SNAT ports under different SNAT port reuse cool down timers depending on how the previous connection closed. For more information about SNAT port reuse timers, see [Port Reuse Timers](/azure/nat-gateway/nat-gateway-resource#port-reuse-timers).

Don't take a dependency on the specific way source ports are assigned in the above examples. The preceding are illustrations of the fundamental concepts only.

## Related content

- [What is Azure NAT Gateway?](/azure/nat-gateway/nat-overview)

- [Design virtual network with NAT gateway](/azure/nat-gateway/nat-gateway-resource)

- [Azure NAT Gateway metrics and alerts](/azure/nat-gateway/nat-metrics)