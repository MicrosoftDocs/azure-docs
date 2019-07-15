---
title: What is Azure Standard Load Balancer?
titlesuffix: Azure Load Balancer
description: Overview of Azure Standard Load Balancer features
services: load-balancer
documentationcenter: na
author: KumudD
manager: twooley
ms.custom: seodec18
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/28/2019
ms.author: kumud
---

# Azure Standard Load Balancer overview

Azure Load Balancer allows you to scale your applications and create high availability for your services. Load Balancer can be used for inbound as well as outbound scenarios and provides low latency, high throughput, and scales up to millions of flows for all TCP and UDP applications. 

This article is focused on Standard Load Balancer.  For a more general overview for Azure Load Balancer, review [Load Balancer Overview](load-balancer-overview.md) as well.

## What is Standard Load Balancer?

Standard Load Balancer is a new Load Balancer product for all TCP and UDP applications with an expanded and more granular feature set over Basic Load Balancer.  While there are many similarities, it is important to familiarize yourself with the differences as outlined in this article.

You can use Standard Load Balancer as a public or internal Load Balancer. And a virtual machine can be connected to one public and one internal Load Balancer resource.

The Load Balancer resource's functions are always expressed as a frontend, a rule, a health probe, and a backend pool definition.  A resource can contain multiple rules. You can place virtual machines into the backend pool by specifying the backend pool from the virtual machine's NIC resource.  This parameter is passed through the network profile and expanded when using virtual machine scale sets.

One key aspect is the scope of the virtual network for the resource.  While Basic Load Balancer exists within the scope of an availability set, a Standard Load Balancer is fully integrated with the scope of a virtual network and all virtual network concepts apply.

Load Balancer resources are objects within which you can express how Azure should program its multi-tenant infrastructure to achieve the scenario you wish to create.  There is no direct relationship between Load Balancer resources and actual infrastructure; creating a Load Balancer doesn't create an instance, capacity is always available, and there are no start-up or scaling delays to consider. 

>[!NOTE]
> Azure provides a suite of fully managed load balancing solutions for your scenarios.  If you are looking for TLS termination ("SSL offload") or per HTTP/HTTPS request application layer processing, review [Application Gateway](../application-gateway/application-gateway-introduction.md).  If you are looking for global DNS load balancing, review [Traffic Manager](../traffic-manager/traffic-manager-overview.md).  Your end-to-end scenarios may benefit from combining these solutions as needed.

## Why use Standard Load Balancer?

Standard Load Balancer enables you to scale your applications and create high availability for small scale deployments to large and complex multi-zone architectures.

Review the table below for an overview of the differences between Standard Load Balancer and Basic Load Balancer:

>[!NOTE]
> New designs should adopt Standard Load Balancer. 

[!INCLUDE [comparison table](../../includes/load-balancer-comparison-table.md)]

Review [service limits for Load Balancer](https://aka.ms/lblimits), as well as [pricing](https://aka.ms/lbpricing), and [SLA](https://aka.ms/lbsla).


### <a name="backend"></a>Backend pool

Standard Load Balancer backend pools expand to any virtual machine resource in a virtual network.  It can contain up to 1000 backend instances.  A backend instance is an IP configuration, which is a property of a NIC resource.

The backend pool can contain standalone virtual machines, availability sets, or virtual machine scale sets.  You can also blend resources in the backend pool. You can combine up to 150 resources in the backend pool per Load Balancer resource.

When considering how to design your backend pool, you can design for the least number of individual backend pool resources to further optimize the duration of management operations.  There is no difference in data plane performance or scale.

### <a name="probes"></a>Health probes
  
Standard Load Balancer adds support for [HTTPS health probes](load-balancer-custom-probe-overview.md#httpprobe) (HTTP probe with Transport Layer Security (TLS) wrapper) to accurately monitor your HTTPS applications.  

In addition, when the entire backend pool [probes down](load-balancer-custom-probe-overview.md#probedown), Standard Load Balancer allows all established TCP connections to continue. (Basic Load Balancer will terminate all TCP connections to all instances).

Review [Load Balancer health probes](load-balancer-custom-probe-overview.md) for details.

### <a name="az"></a>Availability Zones

>[!IMPORTANT]
>Review [Availability Zones](../availability-zones/az-overview.md) for related topics, including any region specific information.

Standard Load Balancer supports additional abilities in regions where Availability Zones are available.  These features are incremental to all Standard Load Balancer provides.  Availability Zones configurations are available for public and internal Standard Load Balancer.

Non-zonal frontends become zone-redundant by default when deployed in a region with Availability Zones.   A zone-redundant frontend survives zone failure and is served by dedicated infrastructure in all of the zones simultaneously. 

Additionally, you can guarantee a frontend to a specific zone. A zonal frontend shares fate with the respective zone and is served only by dedicated infrastructure in a single zone.

Cross-zone load balancing is available for the backend pool, and any virtual machine resource in a vnet can be part of a backend pool.

Review [detailed discussion of Availability Zones related abilities](load-balancer-standard-availability-zones.md).

### <a name="diagnostics"></a> Diagnostics

Standard Load Balancer provides multi-dimensional metrics through Azure Monitor.  These metrics can be filtered, grouped, and broken out for a given dimension.  They provide current and historic insights into performance and health of your service.  Resource Health is also supported.  Following is a brief overview of supported diagnostics:

| Metric | Description |
| --- | --- |
| VIP availability | Standard Load Balancer continuously exercises the data path from within a region to the Load Balancer front-end all the way to the SDN stack that supports your VM. As long as healthy instances remain, the measurement follows the same path as your application's load-balanced traffic. The data path that is used by your customers is also validated. The measurement is invisible to your application and does not interfere with other operations.|
| DIP availability | Standard Load Balancer uses a distributed health probing service that monitors your application endpoint's health according to your configuration settings. This metric provides an aggregate or per endpoint filtered-view of each individual instance endpoint in the Load Balancer pool.  You can see how Load Balancer views the health of your application as indicated by your health probe configuration.
| SYN packets | Standard Load Balancer does not terminate TCP connections or interact with TCP or UDP packet flows. Flows and their handshakes are always between the source and the VM instance. To better troubleshoot your TCP protocol scenarios, you can make use of SYN packets counters to understand how many TCP connection attempts are made. The metric reports the number of TCP SYN packets that were received.|
| SNAT connections | Standard Load Balancer reports the number of outbound flows that are masqueraded to the Public IP address front-end. SNAT ports are an exhaustible resource. This metric can give an indication of how heavily your application is relying on SNAT for outbound originated flows.  Counters for successful and failed outbound SNAT flows are reported and can be used to troubleshoot and understand the health of your outbound flows.|
| Byte counters | Standard Load Balancer reports the data processed per front-end.|
| Packet counters | Standard Load Balancer reports the packets processed per front-end.|

Review [detailed discussion of Standard Load Balancer Diagnostics](load-balancer-standard-diagnostics.md).

### <a name="haports"></a>HA Ports

Standard Load Balancer supports a new type of rule.  

You can configure load-balancing rules to make your application scale and be highly reliable. When you use an HA Ports load-balancing rule, Standard Load Balancer will provide per flow load balancing on every ephemeral port of an internal Standard Load Balancer's frontend IP address.  The feature is useful for other scenarios where it is impractical or undesirable to specify individual ports.

An HA Ports load-balancing rule allows you to create active-passive or active-active n+1 scenarios for Network Virtual Appliances and any application, which requires large ranges of inbound ports.  A health probe can be used to determine which backends should be receiving new flows.  You can use a Network Security Group to emulate a port range scenario.

>[!IMPORTANT]
> If you are planning to use a Network Virtual Appliance, check with your vendor for guidance on whether their product has been tested with HA Ports and follow their specific guidance for implementation. 

Review [detailed discussion of HA Ports](load-balancer-ha-ports-overview.md).

### <a name="securebydefault"></a>Secure by default

Standard Load Balancer is fully onboarded to the virtual network.  The virtual network is a private, closed network.  Because Standard Load Balancers and Standard public IP addresses are designed to allow this virtual network to be accessed from outside of the virtual network, these resources now default to closed unless you open them. This means Network Security Groups (NSGs) are now used to explicitly permit and whitelist allowed traffic.  You can create your entire virtual data center and decide through NSG what and when it should be available.  If you do not have an NSG on a subnet or NIC of your virtual machine resource, traffic is not allowed to reach this resource.

To learn more about NSGs and how to apply them for your scenario, see [Network Security Groups](../virtual-network/security-overview.md).

### <a name="outbound"></a> Outbound connections

Load Balancer supports inbound and outbound scenarios.  Standard Load Balancer is significantly different than Basic Load Balancer with respect to outbound connections.

Source Network Address Translation (SNAT) is used to map internal, private IP addresses on your virtual network to public IP addresses on Load Balancer frontends.

Standard Load Balancer introduces a new algorithm for a [more robust, scalable, and predictable SNAT algorithm](load-balancer-outbound-connections.md#snat) and enables new abilities, removes ambiguity, and forces explicit configurations rather side effects. These changes are necessary to allow for new features to emerge. 

These are the key tenets to remember when working with Standard Load Balancer:

- the completion of a rule drives the Load Balancer resource.  all programming of Azure derives from its configuration.
- when multiple frontends are available, all frontends are used and each frontend multiplies the number of available SNAT ports
- you can choose and control if you do not wish for a particular frontend to be used for outbound connections.
- outbound scenarios are explicit and outbound connectivity does not exist until it has been specified.
- load-balancing rules infer how SNAT is programmed. Load balancing rules are protocol specific. SNAT is protocol specific and configuration should reflect this rather than create a side effect.

#### Multiple frontends
If you want more SNAT ports because you are expecting or are already experiencing a high demand for outbound connections, you can also add incremental SNAT port inventory by configuring additional frontends, rules, and backend pools to the same virtual machine resources.

#### Control which frontend is used for outbound
If you want to constrain outbound connections to only originate from a specific frontend IP address, you can optionally disable outbound SNAT on the rule that expresses the outbound mapping.

#### Control outbound connectivity
Standard Load Balancer exists within the context of the virtual network.  A virtual network is an isolated, private network.  Unless an association with a public IP address exists, public connectivity is not allowed.  You can reach [VNet Service Endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) because they are inside of and local to your virtual network.  If you want to establish outbound connectivity to a destination outside of your virtual network, you have two options:
- assign a Standard SKU public IP address as an Instance-Level Public IP address to the virtual machine resource or
- place the virtual machine resource in the backend pool of a public Standard Load Balancer.

Both will allow outbound connectivity from the virtual network to outside of the virtual network. 

If you _only_ have an internal Standard Load Balancer associated with the backend pool in which your virtual machine resource is located, your virtual machine can only reach virtual network resources and [VNet Service Endpoints](../virtual-network/virtual-network-service-endpoints-overview.md).  You can follow the steps described in the preceding paragraph to create outbound connectivity.

Outbound connectivity of a virtual machine resource not associated with Standard SKUs remains as before.

Review [detailed discussion of Outbound Connections](load-balancer-outbound-connections.md).

### <a name="multife"></a>Multiple frontends
Load Balancer supports multiple rules with multiple frontends.  Standard Load Balancer expands this to outbound scenarios.  Outbound scenarios are essentially the inverse of an inbound load-balancing rule.  The inbound load-balancing rule also creates an associate for outbound connections. Standard Load Balancer uses all frontends associated with a virtual machine resource through a load-balancing rule.  Additionally, a parameter on the load-balancing rule and allows you to suppress a load-balancing rule for the purposes of outbound connectivity, which allows the selection of specific frontends including none.

For comparison, Basic Load Balancer selects a single frontend at random and there is no ability to control which one was selected.

Review [detailed discussion of Outbound Connections](load-balancer-outbound-connections.md).

### <a name="operations"></a> Management Operations

Standard Load Balancer resources exist on an entirely new infrastructure platform.  This enables faster management operations for Standard SKUs and completion times are typically less than 30 seconds per Standard SKU resource.  As backend pools increase in size, the duration required for backend pool changes also increase.

You can modify Standard Load Balancer resources and move a Standard public IP address from one virtual machine to another much faster.

## Migration between SKUs

SKUs are not mutable. Follow the steps in this section to move from one resource SKU to another.

>[!IMPORTANT]
>Review this document in its entirety to understand the differences between SKUs and have carefully examined your scenario.  You may need to make additional changes to align your scenario.

### Migrate from Basic to Standard SKU

1. Create a new Standard resource (Load Balancer and Public IPs, as needed). Recreate your rules and probe definitions.  If you were using a TCP probe to 443/tcp previously, consider changing this probe protocol to an HTTPS probe and add a path.

2. Create new or update existing NSG on NIC or subnet to whitelist load balanced traffic, probe, as well as any other traffic you wish to permit.

3. Remove the Basic SKU resources (Load Balancer and Public IPs, as applicable) from all VM instances. Be sure to also remove all VM instances of an availability set.

4. Attach all VM instances to the new Standard SKU resources.

### Migrate from Standard to Basic SKU

1. Create a new Basic resource (Load Balancer and Public IPs, as needed). Recreate your rules and probe definitions.  Change an HTTPS probe to a TCP probe to 443/tcp. 

2. Remove the Standard SKU resources (Load Balancer and Public IPs, as applicable) from all VM instances. Be sure to also remove all VM instances of an availability set.

3. Attach all VM instances to the new Basic SKU resources.

>[!IMPORTANT]
>
>There are limitations regarding use of the Basic and Standard SKUs.
>
>HA Ports and Diagnostics of the Standard SKU are only available in the Standard SKU. You can't migrate from the Standard SKU to the Basic SKU and also retain these features.
>
>Both Basic and Standard SKU have a number of differences as outlined in this article.  Make sure you understand and prepare for them.
>
>Matching SKUs must be used for Load Balancer and Public IP resources. You can't have a mixture of Basic SKU resources and Standard SKU resources. You can't attach standalone virtual machines, virtual machines in an availability set resource, or a virtual machine scale set resources to both SKUs simultaneously.

## Region availability

Standard Load Balancer is currently available in all public cloud regions.

## SLA

Standard Load Balancers are available with a 99.99% SLA.  Review the [Standard Load Balancer SLA](https://aka.ms/lbsla) for details.

## Pricing

Standard Load Balancer usage is charged.

- Number of configured load-balancing and outbound rules (inbound NAT rules do not count against the total number of rules)
- Amount of data processed inbound and outbound irrespective of rule. 

For Standard Load Balancer pricing information, go to the [Load Balancer pricing](https://azure.microsoft.com/pricing/details/load-balancer/) page.

## Limitations

- SKUs are not mutable. You may not change the SKU of an existing resource.
- A standalone virtual machine resource, availability set resource, or virtual machine scale set resource can reference one SKU, never both.
- A Load Balancer rule cannot span two virtual networks.  Frontends and their related backend instances must be located in the same virtual network.  
- [Move subscription operations](../azure-resource-manager/resource-group-move-resources.md) are not supported for Standard SKU LB and PIP resources.
- Web Worker Roles without a VNet and other Microsoft platform services can be accessible when only an internal Standard Load Balancer is used due to a side effect from how pre-VNet services and other platform services function. You must not rely on this as the respective service itself or the underlying platform can change without notice. You must always assume you need to create [outbound connectivity](load-balancer-outbound-connections.md) explicitly if desired when using an internal Standard Load Balancer only.
- Load Balancer is a TCP or UDP product for load balancing and port forwarding for these specific IP protocols.  Load balancing rules and inbound NAT rules are supported for TCP and UDP and not supported for other IP protocols including ICMP. Load Balancer does not terminate, respond, or otherwise interact with the payload of a UDP or TCP flow. It is not a proxy. Successful validation of connectivity to a front-end must take place in-band with the same protocol used in a load balancing or inbound NAT rule (TCP or UDP) _and_ at least one of your virtual machines must generate a response for a client to see a response from a front-end.  Not receiving an in-band response from the Load Balancer front-end indicates no virtual machines were able to respond.  It is not possible to interact with a Load Balancer front-end without a virtual machine able to respond.  This also applies to outbound connections where [port masquerade SNAT](load-balancer-outbound-connections.md#snat) is only supported for TCP and UDP; any other IP protocols including ICMP  will also fail.  Assign an instance-level Public IP address to mitigate.
- Unlike public Load Balancers which provide [outbound connections](load-balancer-outbound-connections.md) when transitioning from private IP addresses inside the virtual network to public IP addresses, internal Load Balancers do not translate outbound originated connections to the front-end of an internal Load Balancer as both are in private IP address space.  This avoids potential for SNAT exhaustion inside unique internal IP address space where translation is not required.  The side effect is that if an outbound flow from a VM in the back-end pool attempts a flow to front-end of the internal Load Balancer in which pool it resides _and_ is mapped back to itself, both legs of the flow don't match and the flow will fail.  If the flow did not map back to the same VM in the back-end pool which created the flow to the front-end, the flow will succeed.   When the flow maps back to itself the outbound flow appears to originate from the VM to the front-end and the corresponding inbound flow appears to originate from the VM to itself. From the guest OS's point of view, the inbound and outbound parts of the same flow don't match inside the virtual machine. The TCP stack will not recognize these halves of the same flow as being part of the same flow as the source and destination don't match.  When the flow maps to any other VM in the back-end pool, the halves of the flow will match and the VM can successfully respond to the flow.  The symptom for this scenario is intermittent connection timeouts. There are several common workarounds for reliably achieving this scenario (originating flows from a back-end pool to the back-end pools respective internal Load Balancer front-end) which include either insertion of a third-party proxy behind the internal Load Balancer or [using DSR style rules](load-balancer-multivip-overview.md).  While you could use a public Load Balancer to mitigate, the resulting scenario is prone to [SNAT exhaustion](load-balancer-outbound-connections.md#snat) and should be avoided unless carefully managed.

## Next steps

- Learn about using [Standard Load Balancer and Availability Zones](load-balancer-standard-availability-zones.md).
- Learn about [Health Probes](load-balancer-custom-probe-overview.md).
- Learn more about [Availability Zones](../availability-zones/az-overview.md).
- Learn about [Standard Load Balancer Diagnostics](load-balancer-standard-diagnostics.md).
- Learn about [supported multi-dimensional metrics](../azure-monitor/platform/metrics-supported.md#microsoftnetworkloadbalancers) for diagnostics  in [Azure Monitor](../monitoring-and-diagnostics/monitoring-overview.md).
- Learn about using [Load Balancer for outbound connections](load-balancer-outbound-connections.md).
- Learn about [Outbound Rules](load-balancer-outbound-rules-overview.md).
- Learn about [TCP Reset on Idle](load-balancer-tcp-reset.md).
- Learn about [Standard Load Balancer with HA Ports load balancing rules](load-balancer-ha-ports-overview.md).
- Learn about using [Load Balancer with Multiple Frontends](load-balancer-multivip-overview.md).
- Learn about [Virtual Networks](../virtual-network/virtual-networks-overview.md).
- Learn more about [Network Security Groups](../virtual-network/security-overview.md).
- Learn about [VNet Service Endpoints](../virtual-network/virtual-network-service-endpoints-overview.md).
- Learn about some of the other key [networking capabilities](../networking/networking-overview.md) in Azure.
- Learn more about [Load Balancer](load-balancer-overview.md).
