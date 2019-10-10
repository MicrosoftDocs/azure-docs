---

title: What is Azure NAT service?
titlesuffix: Azure NAT
description: Overview of Azure NAT service features, architecture, and implementation. Learn how the NAT service works and how to utilize it in the cloud.
services: nat
documentationcenter: na
author: asudbring
ms.service: nat
Customer intent: As an IT administrator, I want to learn more about the Azure NAT service and what I can use it for. 
ms.devlang: na
ms.topic: overview
ms.custom: seodec18
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/21/2019
ms.author: allensu

---

# What is Azure NAT service (Public Preview)

You can use NAT service to provide outbound connectivity to public IP address destinations for all virtual machines on your virtual network. NAT service can accommodate different kinds of workloads by providing translations on demand without preplanning per instance demand.

You can define which subnets of a virtual network should use NAT service. You can scale outbound connectivity with one or more IP addresses. And you can tune the idle timeout from 4 to 120 minutes. NAT service will also always send TCP Resets when inactive connections are reused as would be the case after idle timeout has been reached. 

You can create [Availability Zones](../availability-zones/az-overview.md) scenarios by placing NAT service in a specific availability zone.

NAT service is a managed, resilient service for outbound connectivity. You can combine NAT service with Standard public IP address resources and Standard load balancer to create additional inbound scenarios.

>[!NOTE] 
>Azure NAT service is available as public Preview at this time. Currently it's only available in a limited set of [regions](#regions). This preview is provided without a service level agreement and isn't recommended for production workloads. Certain features may not be supported or may have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.comsupport/legal/preview-supplemental-terms) for details.

## NAT Gateways

Azure NAT service provides a NAT Gateway resource. This resource can be configured with one or more public IP addresses using [Standard public IP address](../virtual-network/virtual-network-ip-addresses-overview-arm.md#standard) or [Standard public IP prefix](../virtual-network/public-ip-address-prefix.md) resources or both. You use the NAT service by configuring subnets of a virtual network resource to use a specific NAT Gateway. A NAT Gateway can be used on multiple subnets of the same virtual network. Different virtual networks need separate NAT Gateways.

A subnet will begin using the NAT Gateway for outbound connections when it has been configured for a subnet of a virtual network. NAT Gateway replaces the default Internet destination of a subnet and configuration of a UDR isn't needed. Outbound translations are provided on demand as virtual machines create them.

>[!IMPORTANT]
>Outbound flows will not succeed until you also assign at least one public IP address to the NAT Gateway.

>[!NOTE]
> If you require guaranteed per virtual machine allocations or need granularity for defining outbound connectivity on a per instance level or pools of instances or guarantee source network address translation (SNAT) ports to specific instance, use [Standard Load Balancer](../load-balancer/load-balancer-standard-overview.md) with [outbound rules](../load-balancer/load-balancer-outbound-rules-overview.md) to define Load Balancer pool-based outbound source network address translation (SNAT).   This flexibility comes with significantly increased complexity and additional planning when different workloads are combined or the outbound connectivity of the workloads cannot be accurately sized down to an individual instance.

## Combination of inbound and outbound scenarios, and SKUs

You can create inbound and outbound scenarios on the same subnets with NAT Gateway, by combining NAT Gateway with Standard public IP to have instance-level access to virtual and Standard public load balancer endpoints including any services based on them. NAT Gateway and Standard public IP address and Standard public load balancer are flow direction aware. For outbound flows, NAT Gateway replaces all other outbound scenarios and takes precedence over [Load Balancer outbound connectivity](../load-balancer/load-balancer-outbound-connections.md) and [instance-level public IP addresses on virtual machines](../load-balancer/load-balancer-outbound-connections.md) specifically. For inbound originated flows, instance-level public IP addresses or public endpoints on a load balancer can be used simultaneously with NAT Gateway.  When this scenario is complete, inbound/outbound flows will succeed on the same subnets.  The resulting scenario is "secure by default" for inbound originated scenarios as an NSG is required and must explicitly allow inbound originated traffic.

You have the ability to break out your deployments in a virtual network into subnets to influence the outbound behavior. You can also have public IP addresses used as instance-level public IP addresses on virtual machines and load balancer provided outbound source network address translation (SNAT) for outbound connections on one subnet and NAT Gateway on a different subnet of the same virtual network. You can't combine NAT Gateways with resources using Basic public IP address resources or Basic load balancer resources on the same subnet. You can deploy the Basic SKU resources out to a different subnet of the same virtual network.

## Network address translation

Once configuration has been completed, NAT Gateway provides port masquerading source network address translation (SNAT) for all TCP and UDP applications by translating a virtual machine instance's private IP address to public IP addresses.

Flows from private IP addresses are translated to one or more public IP addresses based on your configuration. The translation occurs because the source private IP address source network address translation (SNAT) is changed to a public IP address. Port masquerading means the source port is rewritten to distinguish flows after translation and simplify a many to one/many mapping. The source port number for the resulting flow in public IP address space is assigned on demand as source virtual machines start flows. Multiple connections to the same destination public IP address, IP protocol, and destination port combination consume an additional port per flow.

When virtual machines make outbound connections on these subnets, source ports are given on demand and released after the flow completes or idle timeout is reached. Each public IP provides 55,000 SNAT ports to use and you can scale out by using multiple public IP addresses. NAT Gateway attempts to reuse ports for flows to different destinations to increase outbound connection scale further. 

You can address multiple workloads within the same subnet easily.  Unlike Azure Load Balancer's outbound connectivity, you don't have to preallocate or preplan for the worst case scenario of a virtual machine's consumption of SNAT ports. Instead, you plan for the total volume of outbound connections for all virtual machines on configured subnets. Every available port is shared for all instances as needed.

## Timeout and TCP Resets

NAT Gateway implements idle timeouts and sends TCP Resets (RST) for flows that don't exist.  Timeouts can be configured from 4 minutes (default) to 120 minutes. A TCP RST packet is returned to the source when it arrives at NAT Gateway and no matching connection exists. When a flow has reached idle timeout, the flow is removed from NAT Gateway and the port becomes available for the next flow that is established. For example, if a TCP connection has reached idle timeout and additional packets are seen for an already timed out connection, a TCP RST is sent to the source.  Your application can use TCP keepalives to signal and provide synchronization of endpoint state if needed.

## Availability zones

NAT Gateways can be placed in a specific availability zone if necessary.  

A zonal public IP address must match the same availability zone as the NAT Gateway. Public IP prefix doesn't support availability zones and can't be used.

When a zonal NAT Gateway has been configured, the data plane of the NAT Gateway is aligned with and isolated to the requested availability zone.

You can align the data plane of the NAT Gateway with a virtual machine in a specific zone.  You can do this alignment by creating a regional subnet, which only contains virtual machines in the same zone as the NAT Gateway configured for the subnet.

The availability zone placement of a NAT Gateway can't be changed and you can't convert a NAT Gateway from regional to zonal or zonal to regional.

## Outbound connection service comparison

NAT Gateway and Load Balancer outbound connectivity are intended for different scenarios. Simplicity, on-demand allocation, and virtual network level scale versus pool-centric, per instance granularity and more complicated scenarios are the key trade offs to consider.  There are also a number of other behavior differences and planning considerations.

NAT service is a simpler way to configure outbound connectivity for virtual networks instead of pool-based based configuration for [Standard Load Balancer](../load-balancer/load-balancer-standard-overview.md) using [outbound rules](../load-balancer/load-balancer-outbound-rules-overview.md).  You can easily configure and scale outbound connectivity for a subnet and achieve scenarios not previously possible.

NAT service will take precedence over load balancer outbound SNAT, but both can be combined for an inbound and outbound originated scenario. If you combine inbound originated scenarios with public IP addresses and load balancer endpoints, you can also take advantage of "secure by default" for Standard Public IP address and Standard load balancers.  Only after an NSG exists and allows traffic explicitly, will inbound traffic be allowed to flow.

NAT service can create predictable outbound only connectivity for your virtual network. If all you need is outbound connectivity, you don't have to configure a load balancer with outbound rules, join machines to the pool, calculate and define SNAT port allocation, or assign public IP addresses to individual machines. You can delegate responsibility for outbound connectivity to the administrator of the NAT Gateway resource rather than the administrator of the load balancer.

NAT service allows you to plan outbound connectivity for peak workload scale of a virtual network or subnets within, rather than peak virtual machine instance scale. You can accommodate additional demand more easily by increasing the number of public IP addresses dynamically for all subnets of the entire virtual network. Instead of calculating and replanning load balancer SNAT port allocation, NAT service shares SNAT ports available for outbound connectivity and gives them on demand to accommodate bursty or not easily predictable workloads.  Load balancer preallocates a specific number of SNAT ports for a given virtual machine instance.  

NAT service always returns TCP Reset (RST) packets to the sender for non-existing flows (for example, because of idle timeout). Standard load balancer can be configured to enable [TCP Reset on Idle](../load-balancer/load-balancer-tcp-reset.md), which creates TCP RST packets to both endpoints of a connection at the time of idle timeout.

## Regions

NAT service is available in these regions
- US East 2
- West Central US

## Limitations

- NAT service isn't compatible with Basic public IP or Basic load balancers on the same subnet.  They have to exist on a subnet not served by a NAT Gateway.
- TCP and UDP-based application protocols are supported.
- NAT Gateways can be configured on one or more subnets of a virtual network.
- IPv6 isn't supported.
- Public IP Prefix doesn't support zonal placement and can't be used with a zonal NAT Gateway.

## Next steps

- [Provide feedback for NAT service roadmap](https://aka.ms/natuservoice) .
