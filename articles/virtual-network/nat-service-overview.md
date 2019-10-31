---

title: What is Azure NAT service?
titlesuffix: Azure NAT
description: Overview of Azure NAT service features, architecture, and implementation. Learn how the NAT service works and how to use it in the cloud.
services: virtual-network
documentationcenter: na
author: asudbring
manager: KumudD
ms.service: virtual-network
Customer intent: As an IT administrator, I want to learn more about the Azure NAT service and what I can use it for. 
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/04/2019
ms.author: allensu
---

# What is Azure NAT service (Public preview)

Azure NAT service is used to provide outbound connections to public IP destinations.  These connections apply for all virtual machines in your virtual network. NAT service can accommodate different workloads by providing translations on demand without preplanning per instance demand.

Subnets of a virtual network can be defined to use the NAT service. Outbound connectivity is scaled with one or more IP addresses. You can tune the idle timeout from 4 to 120 minutes. NAT service will also always send TCP Resets when inactive connections are reused after the idle timeout is reached.

You can create [Availability Zones](../availability-zones/az-overview.md) scenarios by placing NAT service in a specific availability zone.

NAT service is a managed, resilient service for outbound connectivity. You can combine NAT service with Standard public IP address resources and Standard load balancer to create additional inbound scenarios.

>[!NOTE] 
>Azure NAT service is available as public preview at this time. Currently it's only available in a limited set of [regions](#regions). This preview is provided without a service level agreement and isn't recommended for production workloads. Certain features may not be supported or may have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.comsupport/legal/preview-supplemental-terms) for details.

## NAT gateways

Azure NAT service provides a NAT gateway resource. NAT gateway can be configured with:

* [Standard public IP address](../virtual-network/virtual-network-ip-addresses-overview-arm.md#standard)
* [Standard public IP prefix](../virtual-network/public-ip-address-prefix.md)

NAT gateway can use both.

You use the NAT service by configuring subnets of a virtual network resource to use a specific NAT gateway. A NAT gateway can be used on multiple subnets of the same virtual network. Different virtual networks need separate NAT gateways.

A subnet will begin using the NAT gateway for outbound connections when it has been configured. NAT gateway replaces the default Internet destination of a subnet and configuration of a UDR isn't needed. Outbound source network address translations (SNAT) are provided on demand as virtual machines create them.

>[!IMPORTANT]
>Outbound flows will not succeed until you also assign at least one public IP address to the NAT Gateway.

>[!NOTE]
> If you require guaranteed per virtual machine allocations or need granularity for defining outbound connectivity on a per instance level or pools of instances or guarantee source network address translation (SNAT) ports to specific instance, use [Standard Load Balancer](../load-balancer/load-balancer-standard-overview.md) with [outbound rules](../load-balancer/load-balancer-outbound-rules-overview.md) to define Load Balancer pool-based outbound source network address translation (SNAT).   This flexibility comes with significantly increased complexity and additional planning when different workloads are combined or the outbound connectivity of the workloads cannot be accurately sized down to an individual instance.

## Combination of inbound and outbound scenarios, and SKUs

Inbound/outbound and a combination of scenarios is possible with NAT gateway.  These scenarios can be configured on the same subnets, and can be combined with Standard public IP. This combination results in access to virtual machine and Standard public load balancer endpoints. 

NAT gateway, Standard public IP address, and Standard public load balancer are flow direction aware. NAT gateway replaces all other outbound scenarios and takes precedence over [load balancer outbound connections](../load-balancer/load-balancer-outbound-connections.md).  NAT gateway also takes precedence over [public IP addresses assigned to virtual machines](../load-balancer/load-balancer-outbound-connections.md). 

For inbound originated flows, instance-level public IP addresses or public endpoints on a load balancer can be used simultaneously with NAT gateway. After scenario completion, inbound/outbound flows will succeed on the same subnets.  The resulting scenario is "secure by default" for inbound originated scenarios as an NSG is required and must explicitly allow inbound originated traffic.

Outbound behavior is influenced by breaking out deployments in a virtual network to subnets. You can have public IP addresses that are used as instance-level addresses on virtual machines. It's possible to have both load balancer SNAT on one subnet, and NAT gateway on a different subnet of the same virtual network.

You can't combine NAT gateways with resources using Basic public IPs on the same subnet. Basic load balancers on the same subnet as NAT gateway aren't allowed. You can deploy the Basic SKU resources out to a different subnet of the same virtual network.

## Network address translation

Once configuration is complete, NAT gateway provides port masquerading and SNAT for all TCP and UDP applications. A virtual machine instance's private IP address is translated to a public IP address.

Flows from private IP addresses are translated to one or more public IP addresses based on your configuration. The translation occurs because the source private IP address SNAT is changed to a public IP address. Port masquerading means the source port is rewritten to distinguish flows after translation and simplify a many to one/many mapping. The source port for the resulting flow is assigned on demand when source virtual machines start flows. Multiple connections to the same destination public IP, IP protocol, and destination port consume an additional port per flow.

During outbound connections from virtual machines, the NAT service gives source ports on demand. The NAT service releases the ports after the flow completes or there's an idle timeout.

Each public IP provides 55,000 SNAT ports to use. You can scale out NAT gateway by using multiple public IPs. NAT gateway attempts to reuse ports for flows to different destinations to increase outbound connection scale further. 

You can address multiple workloads within the same subnet easily.  Unlike Azure load balancer's outbound connectivity, it's not required to preallocate or preplan for a virtual machine's consumption of SNAT ports. Instead, you plan for the total volume of outbound connections for all virtual machines on configured subnets. Every available port is shared for all instances as needed.

## Timeout and TCP Resets

NAT gateway implements idle timeouts and sends TCP Resets (RST) for flows that don't exist.  Timeouts can be configured from 4 minutes (default) to 120 minutes. A TCP RST packet is returned to the source when it arrives at the NAT gateway and no matching connection exists. When a flow has reached idle timeout, it's removed from NAT gateway. The port becomes available for the next flow that is established. When additional packets are seen for a TCP connection that has reached an idle timeout, a TCP RST will be sent to the source. Your application can use TCP keepalives to signal and provide synchronization of endpoint state if needed.

## Availability zones

NAT gateways can be placed in a specific availability zone if necessary.  

A public IP that is zonal, must match the same availability zone as the NAT gateway. Public IP prefixes don't support availability zones and can't be used.

When a zonal NAT gateway has been configured, the data plane of the NAT gateway is aligned with and isolated to the requested availability zone.

You can align the data plane of the NAT gateway with a virtual machine in a specific zone.  You can do this alignment by creating a regional subnet. This subnet only contains virtual machines in the same zone as the NAT gateway configured for the subnet.

The availability zone placement of a NAT gateway can't be changed. You can't convert a NAT gateway from regional to zonal or zonal to regional.

## Outbound connection service comparison

NAT gateway and load balancer outbound connectivity are intended for different scenarios. Simplicity, on-demand allocation, and virtual network level scale versus pool-centric, per instance granularity and more complicated scenarios are the trade offs to consider.  There are a number of other behavior differences and planning considerations.

NAT service is an easier way to configure outbound connections for virtual networks. Previous scenarios utilizing [Standard load balancer](../load-balancer/load-balancer-standard-overview.md) using [outbound rules](../load-balancer/load-balancer-outbound-rules-overview.md) aren't needed. You can easily configure and scale outbound connectivity for a subnet and achieve scenarios not previously possible.

NAT service will take precedence over load balancer outbound SNAT. Both can be combined for an inbound and outbound originated scenario. Combination of inbound scenarios with public IP addresses and load balancer endpoints, allows you to take advantage of "secure by default" for those resources. Only after an NSG exists and allows traffic explicitly, will inbound traffic be allowed to flow.

NAT service can create predictable outbound only connectivity for your virtual network. Configuration of a load balancer with outbound rules, with individual machines joined to the pool are no longer needed. Calculation and definition of SNAT port allocation, or assignment of public IP addresses to individual machines isn't required. You can delegate management of outbound connections to the administrator of the NAT gateway instead of the administrator of the load balancer.

NAT service allows you to plan outbound connectivity for peak workload scale of a virtual network or subnets within, rather than peak virtual machine instance scale. The increase of public IP addresses dynamically for all subnets of a virtual network will accommodate additional demand. Instead of calculating and replanning load balancer SNAT port allocation, NAT service shares SNAT ports available for outbound connectivity. NAT service gives ports on demand to accommodate unpredictable workloads.  Load balancer preallocates a specific number of SNAT ports for a given virtual machine instance.  

NAT service returns TCP Reset (RST) packets to the sender for non-existing flows (for example, because of idle timeout). Standard load balancer can be configured to enable [TCP Reset on Idle](../load-balancer/load-balancer-tcp-reset.md). This configuration creates TCP RST packets to both endpoints of a connection at the time of idle timeout.

## Regions

NAT service is available in these regions
- US East 2
- West Central US

## Limitations

- NAT service isn't compatible with Basic public IP or Basic load balancers on the same subnet.  They have to exist on a subnet not served by a NAT gateway.
- TCP and UDP-based application protocols are supported.
- NAT gateways can be configured on one or more subnets of a virtual network.
- IPv6 isn't supported.
- Public IP prefix doesn't support zonal placement and can't be used with a zonal NAT gateway.

## Next steps

- [Provide feedback for NAT service roadmap](https://aka.ms/natuservoice) .
