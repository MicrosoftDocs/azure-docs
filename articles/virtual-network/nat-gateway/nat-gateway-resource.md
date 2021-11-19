---
title: Design virtual networks by using NAT gateway resources
titleSuffix: Azure Virtual Network NAT
description: Learn how to design virtual networks by using Network Address Translation (NAT) gateway resources.
services: virtual-network
documentationcenter: na
author: asudbring
manager: KumudD
ms.service: virtual-network
ms.subservice: nat
# Customer intent: As an IT administrator, I want to learn more about how to design virtual networks with NAT gateway resources.
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/11/2021
ms.author: allensu
---

# Design virtual networks by using NAT gateway resources

Network Address Translation (NAT) gateway resources provide outbound internet connectivity for one or more subnets of a virtual network. NAT gateway resources are part of [Azure Virtual Network NAT](nat-overview.md). 

In Virtual Network NAT, the subnet of the virtual network states which NAT gateway the virtual network uses. NAT provides Source Network Address Translation (SNAT) for a subnet. NAT gateway resources specify which static IP addresses virtual machines use when they create outbound flows. Static IP addresses come from public IP address resources, public IP prefix resources, or both. If a NAT gateway resource uses a public IP prefix resource, all IP addresses of the entire public IP prefix resource are consumed by the NAT gateway resource. A NAT gateway resource can use a maximum of 16 static IP addresses from either type of public IP resource.

<p align="center">
  <img src="media/nat-overview/flow-direction1.svg" alt="Figure depicts a NAT gateway resource that consumes all IP addresses for a public IP prefix and directs that traffic to and from two subnets of virtual machines and a virtual machine scale set." width="256" title="Virtual Network NAT for outbound to internet">
</p>

*Figure: Virtual Network NAT for outbound to internet*

## Deploy NAT

It's intentionally simple to configure and use a NAT gateway.  

On the NAT gateway resource:

1. Create a regional or zonal NAT gateway resource.
1. Assign IP addresses.
1. (Optional) If necessary, modify the TCP idle timeout. Review [timers](#timers) *before* you change the default.

On the virtual network:

- Configure the virtual network subnet to use a NAT gateway.

User-defined routes aren't necessary.

## Design guidance

Review the following sections to become familiar with considerations for designing virtual networks that use NAT gateway resources.  

### Connect to Azure services

We recommend that you use [Azure Private Link](../../private-link/private-link-overview.md) to connect to Azure services.

Private Link ties Azure resources to your virtual network. Private Link also helps you manage access to your Azure service resources. For example, when you access Azure Storage, use a private endpoint to ensure that your connection is private.

### Connect to the internet

NAT is recommended in outbound scenarios for all production workloads that need to connect to a public endpoint. The following scenarios are examples of how to ensure coexistence of inbound internet when you use a NAT gateway for outbound internet.

#### NAT and VM with instance-level public IP

<p align="center">
  <img src="media/nat-overview/flow-direction2.svg" alt="Figure depicts a NAT gateway that supports outbound traffic to the internet from a virtual network and inbound traffic with an instance-level public IP." width="300" title="Virtual Network NAT and VM with instance-level Public IP">
</p>

*Figure: Virtual Network NAT and VM with instance-level public IP*

| Direction | Resource |
|:---:|:---:|
| Inbound | VM with instance-level public IP |
| Outbound | NAT gateway |

The VM will use the NAT gateway for outbound. Inbound originated isn't affected.

#### NAT and VM with a standard public load balancer

<p align="center">
  <img src="media/nat-overview/flow-direction3.svg" alt="Figure depicts a NAT gateway that supports outbound traffic to the internet from a virtual network and inbound traffic with a public load balancer." width="350" title="Virtual Network NAT and VM with public load balancer">
</p>

*Figure: Virtual Network NAT and VM with public load balancer*

| Direction | Resource |
|:---:|:---:|
| Inbound | Public load balancer |
| Outbound | NAT gateway |

Any outbound configuration from a load-balancing rule or outbound rules is superseded by the NAT gateway. Inbound originated isn't affected.

#### NAT and VM with an instance-level public IP and standard public load balancer

<p align="center">
  <img src="media/nat-overview/flow-direction4.svg" alt="Figure depicts a NAT gateway that supports outbound traffic to the internet from a virtual network and inbound traffic with an instance-level public IP and a public load balancer." width="425" title="Virtual Network NAT and VM with instance-level public IP and public load balancer">
</p>

*Figure: Virtual Network NAT and VM with instance-level public IP and public load balancer*

| Direction | Resource |
|:---:|:---:|
| Inbound | VM with instance-level public IP and public load balancer |
| Outbound | NAT gateway |

Any outbound configuration from a load-balancing rule or outbound rules is superseded by the NAT gateway. The VM also uses the NAT gateway for outbound. Inbound originated isn't affected.

## Performance

Each NAT gateway resource can provide up to 50 Gbps of throughput. You can split your deployments into multiple subnets and assign each subnet or groups of subnets a NAT gateway to scale out.

Each NAT gateway can support 64,000 flows each for TCP and UDP per assigned outbound IP address.  For more information, see the following section about SNAT. For specific problem resolution guidance, see [Troubleshoot Azure Virtual Network NAT connectivity](./troubleshoot-nat.md).

## SNAT

SNAT rewrites the source of a flow to originate from a different IP address. NAT gateway resources use a variant of SNAT that's commonly referred to as *port address translation (PAT)*. PAT rewrites the source address and the source port. With SNAT, there's no fixed relationship between the number of private addresses and their translated public addresses.  

### Fundamentals

Let's look at an example of four flows.  In this example, the NAT gateway uses public IP address resource 65.52.1.1 and the VM makes connections to 65.52.0.1.

| Flow | Source tuple | Destination tuple |
|:---:|:---:|:---:|
| 1 | 192.168.0.16:4283 | 65.52.0.1:80 |
| 2 | 192.168.0.16:4284 | 65.52.0.1:80 |
| 3 | 192.168.0.17.5768 | 65.52.0.1:80 |

These flows might look like this after PAT:

| Flow | Source tuple | Source tuple after SNAT | Destination tuple |
|:---:|:---:|:---:|:---:|
| 1 | 192.168.0.16:4283 | **65.52.1.1:1234** | 65.52.0.1:80 |
| 2 | 192.168.0.16:4284 | **65.52.1.1:1235** | 65.52.0.1:80 |
| 3 | 192.168.0.17.5768 | **65.52.1.1:1236** | 65.52.0.1:80 |

The destination sees the source of the flow as 65.52.0.1 (SNAT source tuple) with the assigned port shown in the table. PAT as shown is also called *port masquerading SNAT*.  Multiple private sources are masqueraded behind an IP and port.  

#### Source (SNAT) port reuse

NAT gateways opportunistically reuse source (SNAT) ports. The following table illustrates this concept as an added flow for the set of flows in the preceding section. The VM in the example is a flow to 65.52.0.2.

| Flow | Source tuple | Destination tuple |
|:---:|:---:|:---:|
| 4 | 192.168.0.16:4285 | 65.52.0.2:80 |

A NAT gateway likely will translate flow 4 to a port that can also be used for other destinations. For more information about how to correctly size IP address provisioning, see [Scaling](#scaling).

| Flow | Source tuple | Source tuple after SNAT | Destination tuple |
|:---:|:---:|:---:|:---:|
| 4 | 192.168.0.16:4285 | 65.52.1.1:**1234** | 65.52.0.2:80 |

Source ports in the example are examples only. 

SNAT that's provided by NAT is different from SNAT that's provided by a [load balancer](../../load-balancer/load-balancer-outbound-connections.md) in several aspects.

### On-demand

NAT provides on-demand SNAT ports for new outbound traffic flows. Virtual machine on subnets that are configured to use NAT use all available SNAT ports in inventory.

<p align="center">
  <img src="media/nat-overview/lb-vnnat-chart.svg" alt="Figure depicts inventory of all available SNAT ports used by any virtual machine on subnets configured with N A T." width="550" title="Virtual Network NAT on-demand outbound SNAT">
</p>

*Figure: Virtual Network NAT on-demand outbound SNAT*

Any IP configuration of a virtual machine can create outbound flows on-demand as needed. You don't need to consider pre-allocation or per-instance planning, including per-instance worst-case overprovisioning.  

<p align="center">
  <img src="media/nat-overview/exhaustion-threshold.svg" alt="Figure depicts inventory of all available SNAT ports used by any virtual machine on subnets configured with N A T with exhaustion threshold." width="550" title="Differences in exhaustion scenarios">
</p>

*Figure: Differences in exhaustion scenarios*

After a SNAT port releases, it's available for use by any virtual machine on subnets that are configured to use NAT. On-demand allocation allows dynamic and divergent workloads on subnets to use SNAT ports as needed. As long as there's SNAT port inventory available, SNAT flows succeed. SNAT port hotspots benefit from the larger inventory instead. SNAT ports aren't left unused for virtual machines that don't actively need them.

### Scaling

Scaling NAT primarily is a function of managing the shared, available SNAT port inventory. NAT requires sufficient SNAT port inventory for expected peak outbound flows for all subnets that are attached to a NAT gateway resource.  You can use public IP address resources, public IP prefix resources, or both to create SNAT port inventory.  

> [!NOTE]
> If you assign a public IP prefix resource, the entire public IP prefix is used. You can't assign a public IP prefix resource and then break out individual IP addresses to assign to other resources.  If you want to assign individual IP addresses from a public IP prefix to multiple resources, create individual public IP addresses from the public IP prefix resource and assign them as needed instead of assigning the public IP prefix resource itself.

SNAT maps private addresses to one or more public IP addresses. During the mapping process, SNAT rewrites the source address and source port. A NAT gateway resource will use 64,000 ports (SNAT ports) per configured public IP address for this translation. NAT gateway resources can scale up to 16 IP addresses and 1 million SNAT ports. If a public IP prefix resource is provided, each IP address within the prefix provides SNAT port inventory. Adding more public IP addresses increases the available inventory SNAT ports. TCP and UDP are separate SNAT port inventories and are unrelated.

NAT gateway resources opportunistically reuse source (SNAT) ports. When you design scaling, assume that each flow requires a new SNAT port, and then scale the total number of available IP addresses for outbound traffic.  Carefully consider the scale you're designing for and provision IP addresses quantities accordingly.

SNAT ports to different destinations are the most likely to be reused, when possible. As SNAT port exhaustion approaches, flows might not succeed.  

For a SNAT example, see [SNAT fundamentals](#source-network-address-translation).

### Protocols

NAT gateway resources interact with IP and IP transport headers of UDP and TCP flows and are agnostic to application layer payloads.  Other IP protocols aren't supported.

### Timers

> [!IMPORTANT]
> A long idle timer might unnecessarily increase the likelihood of SNAT exhaustion. The longer the timer you set, the longer NAT holds on to SNAT ports, until they eventually idle time out. If your flows  idle time out, they eventually fail and unnecessarily consume SNAT port inventory.  Flows that fail at 2 hours would have failed at the default 4 minutes, as well. Increasing the idle timeout is a last resort option that you should use sparingly. If a flow never goes idle, it won't be affected by the idle timer.

For all flows, TCP idle timeout can be adjusted from 4 minutes (default) to 120 minutes (2 hours).  You also can reset the idle timer with traffic on the flow.  A recommended pattern for refreshing long idle connections and endpoint liveness detection is to use TCP keepalives. TCP keepalives appear as duplicate acknowledgments (ACKs) to the endpoints, they're low overhead, and they're invisible to the application layer.

The following timers are used for SNAT port release:

| Timer | Value |
|---|---|
| TCP FIN | 60 seconds |
| TCP RST | 10 seconds |
| TCP half open | 30 seconds |

A SNAT port is available for reuse to the same destination IP address and destination port after 5 seconds.

> [!NOTE]
> The timer settings described in the preceding table are subject to change. The values are provided to help you troubleshoot and are for example only.

## Limitations

NAT gateway resources have the following limitations:

- Basic load balancers and basic public IP addresses are not compatible with NAT. Instead, use standard SKU load balancers and public IPs.
- IP fragmentation isn't available when you use a NAT gateway.

## Next steps

- Learn about [virtual network NAT](nat-overview.md).
- Learn about [metrics and alerts for NAT gateway resources](nat-metrics.md).
- Learn about [troubleshooting NAT gateway resources](troubleshoot-nat.md).
