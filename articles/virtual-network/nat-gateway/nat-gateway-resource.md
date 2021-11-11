---

title: Designing Virtual networks with NAT gateway resources
titleSuffix: Azure Virtual Network NAT
description: Learn how to design virtual networks with NAT gateway resources.
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

# Designing virtual networks with NAT gateway resources

NAT gateway resources are part of [Virtual Network NAT](nat-overview.md) and provide outbound Internet connectivity for one or more subnets of a virtual network. The subnet of the virtual network states which NAT gateway will be used. NAT provides source network address translation (SNAT) for a subnet.  NAT gateway resources specify which static IP addresses virtual machines use when creating outbound flows. Static IP addresses come from public IP address resources (PIP), public IP prefix resources, or both. If a public IP prefix resource is used, all IP addresses of the entire public IP prefix resource are consumed by a NAT gateway resource. A NAT gateway resource can use a total of up to 16 static IP addresses from either.

<p align="center">
  <img src="media/nat-overview/flow-direction1.svg" alt="Figure depicts a NAT gateway resource that consumes all IP addresses for a public IP prefix and directs that traffic to and from two subnets of virtual machines and a virtual machine scale set." width="256" title="Virtual Network NAT for outbound to Internet">
</p>

*Figure: Virtual Network NAT for outbound to Internet*

## How to deploy NAT

Configuring and using NAT gateway is intentionally made simple:  

NAT gateway resource:
- Create regional or zonal NAT gateway resource,
- Assign IP addresses,
- If necessary, modify TCP idle timeout (optional).  Review [timers](#timers) <ins>before</ins> you change the default.

Virtual network:
- Configure virtual network subnet to use a NAT gateway.

User-defined routes aren't necessary.


## Design Guidance

Review this section to familiarize yourself with considerations for designing virtual networks with NAT.  

### Connecting to Azure services

When connecting to Azure services, the recommended approach is to leverage [Private Link](../../private-link/private-link-overview.md). 

Private Link ties Azure resources to your virtual network and control access to your Azure service resources. For example, when you access Azure storage, use a private endpoint for storage to ensure your connection is fully private.

### Connecting to the Internet

NAT is recommended for outbound scenarios for all production workloads where you need to connect to a public endpoint. The following scenarios are examples of how to ensure co-existence of inbound with NAT gateway for outbound.

#### NAT and VM with instance-level Public IP

<p align="center">
  <img src="media/nat-overview/flow-direction2.svg" alt="Figure depicts a NAT gateway that supports outbound traffic to the internet from a virtual network and inbound traffic with an instance-level public IP." width="300" title="Virtual Network NAT and VM with instance-level Public IP">
</p>

*Figure: Virtual Network NAT and VM with instance-level Public IP*

| Direction | Resource |
|:---:|:---:|
| Inbound | VM with instance-level Public IP |
| Outbound | NAT gateway |

VM will use NAT gateway for outbound.  Inbound originated isn't affected.

#### NAT and VM with Standard Public Load Balancer

<p align="center">
  <img src="media/nat-overview/flow-direction3.svg" alt="Figure depicts a NAT gateway that supports outbound traffic to the internet from a virtual network and inbound traffic with a public load balancer." width="350" title="Virtual Network NAT and VM with public Load Balancer">
</p>

*Figure: Virtual Network NAT and VM with public Load Balancer*

| Direction | Resource |
|:---:|:---:|
| Inbound | public Load Balancer |
| Outbound | NAT gateway |

Any outbound configuration from a load-balancing rule or outbound rules is superseded by NAT gateway.  Inbound originated isn't affected.

#### NAT and VM with instance-level Public IP and Standard Public Load Balancer

<p align="center">
  <img src="media/nat-overview/flow-direction4.svg" alt="Figure depicts a NAT gateway that supports outbound traffic to the internet from a virtual network and inbound traffic with an instance-level public IP and a public load balancer." width="425" title="Virtual Network NAT and VM with instance-level public IP and public Load Balancer">
</p>

*Figure: Virtual Network NAT and VM with instance-level public IP and public Load Balancer*

| Direction | Resource |
|:---:|:---:|
| Inbound | VM with instance-level public IP and public Load Balancer |
| Outbound | NAT gateway |

Any outbound configuration from a load-balancing rule or outbound rules is superseded by NAT gateway.  The VM will also use NAT gateway for outbound.  Inbound originated isn't affected.

## Performance

Each NAT gateway resource can provide up to 50 Gbps of throughput. You can split your deployments into multiple subnets and assign each subnet or groups of subnets a NAT gateway to scale out.

Each NAT gateway can support 64,000 flows for TCP and UDP respectively per assigned outbound IP address.  Review the following section on Source Network Address Translation (SNAT) for details as well as the [troubleshooting article](./troubleshoot-nat.md) for specific problem resolution guidance.

## Source Network Address Translation

Source network address translation (SNAT) rewrites the source of a flow to originate from a different IP address.  NAT gateway resources use a variant of SNAT commonly referred to port address translation (PAT). PAT rewrites the source address and source port. With SNAT, there's no fixed relationship between the number of private addresses and their translated public addresses.  

### Fundamentals

Let's look at an example of four flows to explain the basic concept.  The NAT gateway is using public IP address resource 65.52.1.1 and the VM is making connections to 65.52.0.1.

| Flow | Source tuple | Destination tuple |
|:---:|:---:|:---:|
| 1 | 192.168.0.16:4283 | 65.52.0.1:80 |
| 2 | 192.168.0.16:4284 | 65.52.0.1:80 |
| 3 | 192.168.0.17.5768 | 65.52.0.1:80 |

These flows might look like this after PAT has taken place:

| Flow | Source tuple | SNAT'ed source tuple | Destination tuple | 
|:---:|:---:|:---:|:---:|
| 1 | 192.168.0.16:4283 | **65.52.1.1:1234** | 65.52.0.1:80 |
| 2 | 192.168.0.16:4284 | **65.52.1.1:1235** | 65.52.0.1:80 |
| 3 | 192.168.0.17.5768 | **65.52.1.1:1236** | 65.52.0.1:80 |

The destination will see the source of the flow as 65.52.0.1 (SNAT source tuple) with the assigned port shown.  PAT as shown in the preceding table is also called port masquerading SNAT.  Multiple private sources are masqueraded behind an IP and port.  

#### source (SNAT) port reuse

NAT gateways opportunistically reuse source (SNAT) ports.  The following illustrates this concept as an additional flow for the preceding set of flows.  The VM in the example is a flow to 65.52.0.2.

| Flow | Source tuple | Destination tuple |
|:---:|:---:|:---:|
| 4 | 192.168.0.16:4285 | 65.52.0.2:80 |

A NAT gateway will likely translate flow 4 to a port that may be used for other destinations as well.  See [Scaling](#scaling) for additional discussion on correctly sizing your IP address provisioning.

| Flow | Source tuple | SNAT'ed source tuple | Destination tuple | 
|:---:|:---:|:---:|:---:|
| 4 | 192.168.0.16:4285 | 65.52.1.1:**1234** | 65.52.0.2:80 |

Don't take a dependency on the specific way source ports are assigned in the above example.  The preceding is an illustration of the fundamental concept only.

SNAT provided by NAT is different from [Load Balancer](../../load-balancer/load-balancer-outbound-connections.md) in several aspects.

### On-demand

NAT provides on-demand SNAT ports for new outbound traffic flows. All available SNAT ports in inventory are used by any virtual machine on subnets configured with NAT. 

<p align="center">
  <img src="media/nat-overview/lb-vnnat-chart.svg" alt="Figure depicts inventory of all available SNAT ports used by any virtual machine on subnets configured with N A T." width="550" title="Virtual Network NAT on-demand outbound SNAT">
</p>

*Figure: Virtual Network NAT on-demand outbound SNAT*

Any IP configuration of a virtual machine can create outbound flows on-demand as needed.  Pre-allocation, per instance planning including per instance worst case overprovisioning, isn't required.  

<p align="center">
  <img src="media/nat-overview/exhaustion-threshold.svg" alt="Figure depicts inventory of all available SNAT ports used by any virtual machine on subnets configured with N A T with exhaustion threshold." width="550" title="Differences in exhaustion scenarios">
</p>

*Figure: Differences in exhaustion scenarios*

Once a SNAT port releases, it's available for use by any virtual machine on subnets configured with NAT.  On-demand allocation allows dynamic and divergent workloads on subnet(s) to use SNAT ports as they need.  As long as there's SNAT port inventory available, SNAT flows will succeed. SNAT port hot spots benefit from the larger inventory instead. SNAT ports aren't left unused for virtual machines not actively needing them.

### Scaling

Scaling NAT is primarily a function of managing the shared, available SNAT port inventory. NAT needs sufficient SNAT port inventory for expected peak outbound flows for all subnets attached to a NAT gateway resource.  You can use public IP address resources, public IP prefix resources, or both to create SNAT port inventory.  

>[!NOTE]
>If you are assigning a public IP prefix resource, the entire public IP prefix will be used.  You can't assign a public IP prefix resource and then break out individual IP addresses to assign to other resources.  If you want to assign individual IP addresses from a public IP prefix to multiple resources, you need to create individual public IP addresses from the public IP prefix resource and assign them as needed instead of the public IP prefix resource itself.

SNAT maps private addresses to one or more public IP addresses, rewriting source address and source port in the processes. A NAT gateway resource will use 64,000 ports (SNAT ports) per configured public IP address for this translation. NAT gateway resources can scale up to 16 IP addresses and 1M SNAT ports. If a public IP prefix resource is provided, each IP address within the prefix is providing SNAT port inventory. And adding more public IP addresses increases the available inventory SNAT ports. TCP and UDP are separate SNAT port inventories and unrelated.

NAT gateway resources opportunistically reuse source (SNAT) ports. As design guidance for scaling purposes, you should assume each flow requires a new SNAT port and scale the total number of available IP addresses for outbound traffic.  You should carefully consider the scale you are designing for and provision IP addresses quantities accordingly.

SNAT ports to different destinations are most likely to be reused when possible. And as SNAT port exhaustion approaches, flows may not succeed.  

See [SNAT fundamentals](#source-network-address-translation) for example.


### Protocols

NAT gateway resources interact with IP and IP transport headers of UDP and TCP flows and are agnostic to application layer payloads.  Other IP protocols aren't supported.

### Timers

>[!IMPORTANT]
>Long idle timer can unnecessarily increase likelihood of SNAT exhaustion. The longer of a timer you specify, the longer NAT will hold on to SNAT ports until they eventually idle timeout. If your flows are idle timed out, they will fail eventually anyway and unnecessarily consume SNAT port inventory.  Flows that fail at 2 hours would have failed at the default 4 minutes as well. Increasing the idle timeout is a last resort option that should be used sparingly. If a flow never does go idle, it will not be impacted by the idle timer.

TCP idle timeout can be adjusted from 4 minutes (default) to 120 minutes (2 hours) for all flows.  Additionally, you can reset the idle timer with traffic on the flow.  A recommended pattern for refreshing long idle connections and endpoint liveness detection is TCP keepalives.  TCP keepalives appear as duplicate ACKs to the endpoints, are low overhead, and invisible to the application layer.

The following timers are used for SNAT port release:

| Timer | Value |
|---|---|
| TCP FIN | 60 seconds |
| TCP RST | 10 seconds |
| TCP half open | 30 seconds |

A SNAT port is available for reuse to the same destination IP address and destination port after 5 seconds.

>[!NOTE] 
>These timer settings are subject to change. The values are provided to help troubleshooting and you shouldn't take a dependency on specific timers at this time.

## Limitations

- Basic Load Balancer and Basic Public IP addresses are incompatible with NAT. Use Standard SKU Load Balancers and Public IPs instead.
- IP fragmentation is not supported via NAT gateway.

## Next steps

* Learn about [virtual network NAT](nat-overview.md).
* Learn about [metrics and alerts for NAT gateway resources](nat-metrics.md).
* Learn about [troubleshooting NAT gateway resources](troubleshoot-nat.md).
