---
title: Design virtual networks with NAT gateway
titleSuffix: Azure Virtual Network NAT
description: Learn how to design virtual networks that use Network Address Translation (NAT) gateway resources.
author: asudbring
ms.service: virtual-network
ms.subservice: nat
ms.topic: article
ms.workload: infrastructure-services
ms.date: 02/25/2022
ms.author: allensu
---

# Design virtual networks with NAT gateway

NAT gateway provides outbound internet connectivity for one or more subnets of a virtual network. Once NAT gateway is associated to a subnet, NAT provides source network address translation (SNAT) for that subnet. NAT gateway specifies which static IP addresses virtual machines use when creating outbound flows. Static IP addresses come from public IP addresses, public IP prefixes, or both. If a public IP prefix is used, all IP addresses of the entire public IP prefix are consumed by a NAT gateway. A NAT gateway can use a total of up to 16 static IP addresses from either.

:::image type="content" source="./media/nat-overview/flow-direction1.png" alt-text="Diagram depicts a NAT gateway resource that consumes all IP addresses for a public IP prefix and directs traffic to and from two subnets of VMs and a virtual machine scale set.":::

*Figure: Virtual Network NAT for outbound to internet*

## How to deploy NAT

Configuring and using NAT gateway is intentionally made simple:

NAT gateway:

- Create a non-zonal or zonal NAT gateway.
- Assign a public IP address or public IP prefix.
- If necessary, modify TCP idle timeout (optional). Review [timers](#timers) before you change the default.

Virtual network:

- Configure virtual network subnet to use a NAT gateway.

User-defined routes aren't necessary.

## Design guidance

Review this section to familiarize yourself with considerations for designing virtual networks with NAT.

### Connect to Azure services

When you connect to Azure services from your private network, the recommended approach is to use [Private Link](../../private-link/private-link-overview.md). 

Private Link lets you access services in Azure from your private network without the use of a public IP address. Connecting to these services over the internet aren't necessary and are handled over the Azure backbone network. For example, when you access Azure Storage, you can use a private endpoint to ensure your connection is fully private.

### Connect to the internet

NAT is recommended for outbound scenarios for all production workloads where you need to connect to a public endpoint. The following scenarios are examples of how to ensure coexistence of inbound with NAT gateway for outbound.

#### NAT and VM with an instance-level public IP

:::image type="content" source="./media/nat-overview/flow-direction2.png" alt-text="Diagram that depicts a NAT gateway resource that consumes all IP addresses for a public IP prefix and directs that traffic to and from two subnets of VMs and a virtual machine scale set.":::

*Figure: Virtual Network NAT and VM with an instance level public IP*

| Direction | Resource |
|:---:|:---:|
| Inbound | VM with instance-level public IP |
| Outbound | NAT gateway |

VM will use NAT gateway for outbound. Inbound originated isn't affected.

#### NAT and VM with a standard public load balancer

:::image type="content" source="./media/nat-overview/flow-direction3.png" alt-text="Diagram that depicts a NAT gateway that supports outbound traffic to the internet from a virtual network and inbound traffic with a public load balancer.":::

*Figure: Virtual Network NAT and VM with a standard public load balancer*

| Direction | Resource |
|:---:|:---:|
| Inbound | Standard public load balancer |
| Outbound | NAT gateway |

Any outbound configuration from a load-balancing rule or outbound rules is superseded by NAT gateway. Inbound originated isn't affected.

#### NAT and VM with an instance-level public IP and a standard public load balancer

:::image type="content" source="./media/nat-overview/flow-direction4.png" alt-text="Diagram that depicts a NAT gateway that supports outbound traffic to the internet from a virtual network and inbound traffic with an instance-level public I P and a public load balancer.":::

*Figure: Virtual Network NAT and VM with an instance-level public IP and a standard public load balancer*

| Direction | Resource |
|:---:|:---:|
| Inbound | VM with instance-level public IP and a standard public load balancer |
| Outbound | NAT gateway |

Any outbound configuration from a load-balancing rule or outbound rules is superseded by NAT gateway. The VM will also use NAT gateway for outbound. Inbound originated isn't affected.

### Monitor outbound network traffic

A network security group allows you to filter inbound and outbound traffic to and from a virtual machine. To monitor outbound traffic flowing from NAT, you can enable NSG flow logs.

To learn more about NSG flow logs, see [NSG Flow Log Overview](../../network-watcher/network-watcher-nsg-flow-logging-overview.md).

For guides on how to enable NSG flow logs, see [Enabling NSG Flow Logs](../../network-watcher/network-watcher-nsg-flow-logging-overview.md#enabling-nsg-flow-logs).

## Performance

Each NAT gateway can provide up to 50 Gbps of throughput. You can split your deployments into multiple subnets and assign each subnet or group of subnets a NAT gateway to scale out.

Each NAT gateway public IP address provides 64,512 SNAT ports to make outbound connections. NAT gateway can support up to 50,000 concurrent connections per public IP address to the same destination endpoint over the internet for TCP and UDP. Review the following section for details and the [troubleshooting article](./troubleshoot-nat.md) for specific problem resolution guidance.

## Source Network Address Translation

Source Network Address Translation (SNAT) rewrites the source of a flow to originate from a different IP address and/or port. Typically, SNAT is used when a private network needs to connect to a public host over the internet. SNAT allows multiple compute resources within the private VNet to use the same single Public IP address or set of IP addresses (prefix) to connect to the internet.

NAT gateway SNATs the private IP address and source port of a virtual machine (or other compute resource) to a static public IP address before going outbound to the internet from a virtual network. 

### Fundamentals

The following example flows explain the basic concept of SNAT and how it works with NAT gateway. 

In the table below the VM is making connections to destination IP 65.52.0.1 from the following source tuples (IPs and ports):

| Flow | Source tuple | Destination tuple |
|:---:|:---:|:---:|
| 1 | 192.168.0.16:4283 | 65.52.0.1:80 |
| 2 | 192.168.0.16:4284 | 65.52.0.1:80 |
| 3 | 192.168.0.17.5768 | 65.52.0.1:80 |

When NAT gateway is configured with public IP address 65.52.1.1, the source IPs are SNAT'd into NAT gateway's public IP address as shown below:

| Flow | Source tuple | Source tuple after SNAT | Destination tuple |
|:---:|:---:|:---:|:---:|
| 1 | 192.168.0.16:4283 | **65.52.1.1:1234** | 65.52.0.1:80 |
| 2 | 192.168.0.16:4284 | **65.52.1.1:1235** | 65.52.0.1:80 |
| 3 | 192.168.0.17.5768 | **65.52.1.1:1236** | 65.52.0.1:80 |

The source IP address and port of each flow is SNAT'd to the public IP address 65.52.1.1 (source tuple after SNAT) and to a different port for each new connection going to the same destination endpoint. The act of NAT gateway replacing all of the source ports and IPs with the public IP and port before connecting to the internet is known as *IP masquerading* or *port masquerading*. Multiple private sources are masqueraded behind a public IP.

#### Source (SNAT) port reuse

For NAT gateway, 64,512 SNAT ports are available per public IP address. For each public IP address attached to NAT gateway, the entire inventory of ports provided by those IPs is made available to any virtual machine instance within a subnet that is also attached to NAT gateway. NAT gateway selects a port at random out of the available inventory of ports to make new outbound connections. If NAT gateway doesn't find any available SNAT ports, then it will reuse a SNAT port. A port can be reused so long as it's going to a different destination endpoint. As mentioned in the [Performance](#performance) section, NAT gateway supports up to 50,000 concurrent connections per public IP address to the same destination endpoint over the internet. 

The following illustrates this concept as an additional flow to the preceding set, with a VM flowing to a new destination IP 65.52.0.2.

| Flow | Source tuple | Destination tuple |
|:---:|:---:|:---:|
| 4 | 192.168.0.16:4285 | 65.52.0.2:80 |

A NAT gateway will likely translate flow 4 to a source port that may be used for other destinations as well. See [Scale NAT](#scale-nat) for more discussion on correctly sizing your IP address provisioning.

| Flow | Source tuple | Source tuple after SNAT | Destination tuple |
|:---:|:---:|:---:|:---:|
| 4 | 192.168.0.16:4285 | 65.52.1.1:**1234** | 65.52.0.2:80 |

Don't take a dependency on the specific way source ports are assigned in the above example. The preceding is an illustration of the fundamental concept only.

SNAT provided by NAT is different from SNAT provided by a [load balancer](../../load-balancer/load-balancer-outbound-connections.md) in several aspects, including:

- NAT gateway dynamically allocates SNAT ports across all VMs within a NAT gateway configured subnet whereas Load Balancer pre-allocates a fixed number of SNAT ports to each VM.

- NAT gateway selects source ports at random for outbound traffic flow whereas Load Balancer selects ports sequentially.

- NAT gateway reuses SNAT ports for connections to different destination endpoints if no other source ports are available, whereas Load Balancer looks to select the lowest available SNAT port in sequential order.

### On-demand

NAT provides on-demand SNAT ports for new outbound traffic flows. All available SNAT ports in inventory can be used by any virtual machine on subnets configured with NAT:

:::image type="content" source="./media/nat-overview/lb-vnnat-chart.png" alt-text="Diagram that depicts the inventory of all available SNAT ports used by any VM on subnets configured with NAT.":::

*Figure: Virtual Network NAT on-demand outbound SNAT*

Any IP configuration of a virtual machine can create outbound flows on-demand as needed. Pre-allocation of SNAT ports to each virtual machine isn't required.

:::image type="content" source="./media/nat-overview/exhaustion-threshold.png" alt-text="Diagram that depicts the inventory of all available SNAT ports used by any VM on subnets configured with NAT with an exhaustion threshold.":::

*Figure: Differences in exhaustion scenarios*

After a SNAT port is released, it's available for use by any VM on subnets configured with NAT. On-demand allocation allows dynamic and divergent workloads on subnets to use SNAT ports as needed. As long as SNAT ports are available, SNAT flows will succeed. SNAT port hot spots benefit from a larger inventory. SNAT ports aren't left unused for VMs not actively needing them.

### Scale NAT

Scaling NAT is primarily a function of managing the shared, available SNAT port inventory. NAT needs sufficient SNAT port inventory for expected peak outbound flows for all subnets that are attached to a NAT gateway. You can use public IP addresses, public IP prefixes, or both to create SNAT port inventory. 

> [!NOTE]
> If you assign a public IP prefix, the entire public IP prefix is used. You can't assign a public IP prefix and then break out individual IP addresses to assign to other resources. If you want to assign individual IP addresses from a public IP prefix to multiple resources, you need to create individual public IP addresses and assign them as needed instead of using the public IP prefix itself.

SNAT maps private addresses to one or more public IP addresses, rewriting the source address and source port in the process. A single NAT gateway can scale up to 16 IP addresses. If a public IP prefix is provided, each IP address within the prefix provides SNAT port inventory. Adding more public IP addresses increases the available inventory of SNAT ports. TCP and UDP are separate SNAT port inventories and are unrelated to NAT gateway.

NAT gateway opportunistically reuses source (SNAT) ports. When you scale your workload, assume that each flow requires a new SNAT port, and then scale the total number of available IP addresses for outbound traffic. Carefully consider the scale you're designing for, and then allocate IP addresses quantities accordingly.

SNAT ports to different destinations are most likely to be reused when possible. As SNAT port exhaustion approaches, flows may not succeed.

For a SNAT example, see [SNAT fundamentals](#source-network-address-translation).

### Protocols

NAT gateway interacts with IP and IP transport headers of UDP and TCP flows. NAT gateway is agnostic to application layer payloads. Other IP protocols aren't supported.

### Timers

TCP timers determine the amount of time a connection is held between two endpoints before it's terminated and the port is available for reuse. Depending on the type of packet sent by either endpoint, a specific type of timer will be triggered.

The following timers indicate how long a connection is maintained before closing and releasing the destination SNAT port for reuse:

| Timer | Description | Value |
|---|---|---|
| TCP FIN | Occurs when the private side of NAT initiates termination of a TCP connection. A timer is set after the FIN packet is sent by the public endpoint. This timer allows the private endpoint time to resend an ACK (acknowledgment) packet should it be lost. Once the timer ends, the connection is closed. | 60 seconds |
| TCP RST | Occurs when the private side of NAT sends an RST (reset) packet in an attempt to communicate on the TCP connection. If the RST packet isn't received by the public side of NAT, or the RST packet is returned to the private endpoint, the connection will time out and close. The public side of NAT doesn't generate TCP RST packets or any other traffic. | 10 seconds |
| TCP half open | Occurs when the public endpoint is waiting for acknowledgment from the private endpoint that the connection between the two is fully bidirectional. | 30 seconds |
| TCP idle timeout | TCP connections can go idle when no data is transmitted between either endpoint for a prolonged period of time. A timer can be configured from 4 minutes (default) to 120 minutes (2 hours) to time out a connection that has gone idle. Traffic on the flow will reset the idle timeout timer. | Configurable; 4 minutes (default) - 120 minutes |

> [!NOTE]
> These timer settings are subject to change. The values are provided to help with troubleshooting and you should not take a dependency on specific timers at this time.

After a SNAT port is no longer in use, it's available for reuse to the same destination IP address and port after 5 seconds.

#### Timer considerations

Design recommendations for configuring timers:

- In an idle connection scenario, NAT gateway holds onto SNAT ports until the connection idle times out. Because long idle timeout timers can unnecessarily increase the likelihood of SNAT port exhaustion, it isn't recommended to increase the idle timeout duration to longer than the default time of 4 minutes. If a flow never goes idle, then it will not be impacted by the idle timer.

- TCP keepalives can be used to provide a pattern of refreshing long idle connections and endpoint liveness detection. TCP keepalives appear as duplicate ACKs to the endpoints, are low overhead, and invisible to the application layer.

## Limitations

- Basic load balancers and basic public IP addresses aren't compatible with NAT. Use standard SKU load balancers and public IPs instead.
  
  - To upgrade a basic load balancer to standard, see [Upgrade Azure Public Load Balancer](../../load-balancer/upgrade-basic-standard.md)
  
  - To upgrade a basic public IP address too standard, see [Upgrade a public IP address](../ip-services/public-ip-upgrade-portal.md)

- IP fragmentation isn't available for NAT gateway.

## Next steps

- Review [virtual network NAT](nat-overview.md).

- Learn about [metrics and alerts for NAT gateway](nat-metrics.md).

- Learn how to [troubleshoot NAT gateway](troubleshoot-nat.md).
