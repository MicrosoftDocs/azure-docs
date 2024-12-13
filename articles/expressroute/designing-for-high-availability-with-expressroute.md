---
title: 'Azure ExpressRoute: Designing for high availability'
description: This page provides architectural recommendations for high availability while using Azure ExpressRoute.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 11/18/2024
ms.author: duau
---

# Designing for high availability with Azure ExpressRoute

Azure ExpressRoute is designed for high availability, providing carrier-grade private network connectivity to Microsoft resources. This means there's no single point of failure within the Microsoft network. To maximize availability, both the customer and service provider segments of your Azure ExpressRoute circuit should also be architected for high availability. This article covers network architecture considerations for building robust connectivity using Azure ExpressRoute and fine-tuning features to improve the high availability of your Azure ExpressRoute circuit.

> [!NOTE]
> The concepts described in this article apply equally whether an Azure ExpressRoute circuit is created under Virtual WAN or outside of it.

## Architecture considerations

The following figure illustrates the recommended way to connect using an Azure ExpressRoute circuit to maximize availability.

[![1]][1]

For high availability, it's essential to maintain redundancy throughout the end-to-end network. This means maintaining redundancy within your on-premises network and not compromising redundancy within your service provider network. At a minimum, this involves avoiding single points of network failure. Redundant power and cooling for network devices further improve high availability.

### First mile physical layer design considerations

If you terminate both the primary and secondary connections of an Azure ExpressRoute circuit on the same Customer Premises Equipment (CPE), you compromise high availability within your on-premises network. Additionally, configuring both connections using the same port of a CPE forces the partner to compromise high availability on their network segment. This can occur by terminating the two connections under different subinterfaces or merging the two connections within the partner network, as illustrated below.

[![2]][2]

Terminating the primary and secondary connections of an Azure ExpressRoute circuit in different geographical locations can compromise network performance. If traffic is actively load-balanced across connections terminated in different locations, substantial differences in network latency between the two paths can result in suboptimal performance.

For geo-redundant design considerations, see [Designing for disaster recovery with Azure ExpressRoute][DR].

### Active-active connections

Microsoft network operates the primary and secondary connections of Azure ExpressRoute circuits in active-active mode. However, you can force the redundant connections to operate in active-passive mode through your route advertisements. Advertising more specific routes and BGP AS path prepending are common techniques to prefer one path over the other.

To improve high availability, it's recommended to operate both connections in active-active mode. This allows Microsoft network to load balance traffic across the connections on a per-flow basis.

Running connections in active-passive mode risks both connections failing if the active path fails. Common causes for failure include lack of active management of the passive connection and passive connection advertising stale routes.

Alternatively, running connections in active-active mode results in only about half the flows failing and getting rerouted, significantly improving the Mean Time To Recover (MTTR).

> [!NOTE]
> During maintenance or unplanned events impacting one connection, Microsoft will use AS path prepending to drain traffic to the healthy connection. Ensure traffic can route over the healthy path when path prepending is configured by Microsoft and required route advertisements are set appropriately to avoid service disruption.

### NAT for Microsoft peering

Microsoft peering is designed for communication between public endpoints. Typically, on-premises private endpoints are Network Address Translated (NATed) with public IPs on the customer or partner network before communicating over Microsoft peering. Using both primary and secondary connections in an active-active setup affects how quickly you recover from a failure in one of the connections. Two different NAT options are illustrated below:

[![3]][3]

#### Option 1:

NAT is applied after splitting traffic between the primary and secondary connections. Independent NAT pools are used for the primary and secondary devices to meet stateful NAT requirements. Return traffic arrives on the same edge device through which the flow egressed.

If an Azure ExpressRoute connection fails, the corresponding NAT pool becomes unreachable, breaking all network flows. These flows must be re-established by TCP or the application layer following the window timeout. During the failure, Azure can't reach on-premises servers using the corresponding NAT until connectivity is restored.

#### Option 2:

A common NAT pool is used before splitting traffic between the primary and secondary connections. This doesn't introduce a single point of failure, thus maintaining high availability.

The NAT pool remains reachable even if the primary or secondary connection fails, allowing the network layer to reroute packets and recover faster.

> [!NOTE]
> * If using NAT option 1 (independent NAT pools for primary and secondary connections) and mapping a port of an IP address from one NAT pool to an on-premises server, the server will not be reachable via the Azure ExpressRoute circuit if the corresponding connection fails.
> * Terminating Azure ExpressRoute BGP connections on stateful devices can cause failover issues during planned or unplanned maintenance by Microsoft or your Azure ExpressRoute Provider. Test your setup to ensure proper failover, and when possible, terminate BGP sessions on stateless devices.

## Fine-tuning features for private peering

This section reviews optional features that help improve the high availability of your Azure ExpressRoute circuit, depending on your Azure deployment and sensitivity to MTTR. Specifically, it covers zone-aware deployment of Azure ExpressRoute virtual network gateways and Bidirectional Forwarding Detection (BFD).

### Availability Zone aware Azure ExpressRoute virtual network gateways

An Availability Zone in an Azure region combines a fault domain and an update domain. To achieve the highest resiliency and availability, configure a zone-redundant Azure ExpressRoute virtual network gateway. For more information, see [About zone-redundant virtual network gateways in Azure Availability Zones][zone redundant vgw]. To configure a zone-redundant virtual network gateway, see [Create a zone-redundant virtual network gateway in Azure Availability Zones][conf zone redundant vgw].

### Improving failure detection time

Azure ExpressRoute supports BFD over private peering, reducing failure detection time over the Layer 2 network between Microsoft Enterprise Edge (MSEEs) and their BGP neighbors on the on-premises side from about 3 minutes (default) to less than a second. Quick failure detection helps hasten recovery. For more information, see [Configure BFD over Azure ExpressRoute][BFD].

## Next steps

This article discussed designing for high availability of an Azure ExpressRoute circuit. An Azure ExpressRoute circuit peering point is pinned to a geographical location and can be affected by catastrophic failures impacting the entire location.

For design considerations to build geo-redundant network connectivity to the Microsoft backbone that can withstand catastrophic failures affecting an entire region, see [Designing for disaster recovery with Azure ExpressRoute private peering][DR].

<!--Image References-->
[1]: ./media/designing-for-high-availability-with-expressroute/exr-reco.png "Recommended way to connect using ExpressRoute"
[2]: ./media/designing-for-high-availability-with-expressroute/suboptimal-lastmile-connectivity.png "Suboptimal last mile connectivity"
[3]: ./media/designing-for-high-availability-with-expressroute/nat-options.png "NAT options"


<!--Link References-->
[zone redundant vgw]: ../vpn-gateway/about-zone-redundant-vnet-gateways.md
[conf zone redundant vgw]: ../vpn-gateway/create-zone-redundant-vnet-gateway.md
[Configure Global Reach]: ./expressroute-howto-set-global-reach.md
[BFD]: ./expressroute-bfd.md
[DR]: ./designing-for-disaster-recovery-with-expressroute-privatepeering.md
