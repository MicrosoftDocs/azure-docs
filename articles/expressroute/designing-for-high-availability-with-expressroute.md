---
title: 'Azure ExpressRoute: Designing for high availability'
description: This page provides architectural recommendations for high availability while using Azure ExpressRoute.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: article
ms.date: 06/15/2023
ms.author: duau
---

# Designing for high availability with ExpressRoute

ExpressRoute is designed for high availability to provide carrier grade private network connectivity to Microsoft resources. In other words, there's no single point of failure in the ExpressRoute path within Microsoft network. To maximize the availability, the customer and the service provider segment of your ExpressRoute circuit should also be architected for high availability. In this article, first let's look into network architecture considerations for building robust network connectivity using an ExpressRoute, then let's look into the fine-tuning features that help you to improve the high availability of your ExpressRoute circuit.

> [!NOTE]
> The concepts described in this article equally applies when an ExpressRoute circuit is created under Virtual WAN or outside of it.
>

## Architecture considerations

The following figure illustrates the recommended way to connect using an ExpressRoute circuit for maximizing the availability of an ExpressRoute circuit.

 [![1]][1]

For high availability, it's essential to maintain the redundancy of the ExpressRoute circuit throughout the end-to-end network. In other words, you need to maintain redundancy within your on-premises network, and shouldn't compromise redundancy within your service provider network. Maintaining redundancy at the minimum implies avoiding single point of network failures. Having redundant power and cooling for the network devices further improves the high availability.

### First mile physical layer design considerations

 If you terminate both the primary and secondary connections of an ExpressRoute circuits on the same Customer Premises Equipment (CPE), you're compromising the high availability within your on-premises network. Additionally, if you configure both the primary and secondary connections using the same port of a CPE, you're forcing the partner to compromise high availability on their network segment as well. This event can happen by either terminating the two connections under different subinterfaces or by merging the two connections within the partner network. This compromise is illustrated in the following figure. 

[![2]][2]

On the other hand, if you terminate the primary and the secondary connections of an ExpressRoute circuits in different geographical locations, then you could be compromising the network performance of the connectivity. If traffic is actively load balanced across the primary and the secondary connections that are terminated on different geographical locations, potential substantial difference in network latency between the two paths would result in suboptimal network performance. 

For geo-redundant design considerations, see [Designing for disaster recovery with ExpressRoute][DR].

### Active-active connections

Microsoft network is configured to operate the primary and secondary connections of ExpressRoute circuits in active-active mode. However, through your route advertisements, you  can force the redundant connections of an ExpressRoute circuit to operate in active-passive mode. Advertising more specific routes and BGP AS path prepending  are the common techniques used to make one path prefer over the other.

To improve high availability, it's recommended to operate both the connections of an ExpressRoute circuit in active-active mode. If you let the connections operate in active-active mode, Microsoft network loads balance the traffic across the connections on per-flow basis.

Running the primary and secondary connections of an ExpressRoute circuit in active-passive mode face the risk of both the connections failing following a failure in the active path. The common causes for failure on switching over are lack of active management of the passive connection, and passive connection advertising stale routes.

Alternatively, running the primary and secondary connections of an ExpressRoute circuit in active-active mode, results in only about half the flows failing and getting rerouted. Therefore, an active-active connection significantly helps improve the Mean Time To Recover (MTTR).

> [!NOTE]
> During a maintenance activity or in case of unplanned events impacting one of the connection, Microsoft will prefer to use AS path prepending to drain traffic over to the healthy connection. You will need to ensure the traffic is able to route over the healthy path when path prepend is configure from Microsoft and required route advertisements are configured appropriately to avoid any service disruption. 
> 

### NAT for Microsoft peering 

Microsoft peering is designed for communication between public end-points. So commonly, on-premises private endpoints are Network Address Translated (NATed) with public IP on the customer or partner network before they communicate over Microsoft peering. Assuming you use both the primary and secondary connections in an active-active setup. Where and how your NAT has an effect on how quickly you recover following a failure in one of the ExpressRoute connections. Two different NAT options are illustrated in the following figure:

[![3]][3]

#### Option 1:

NAT gets applied after splitting the traffic between the primary and secondary connections of the ExpressRoute circuit. To meet the stateful requirements of NAT, independent NAT pools are used for the primary and the secondary devices. The return traffic arrives on the same edge device through which the flow egressed.

If the ExpressRoute connection fails, the ability to reach the corresponding NAT pool is then broken. Therefore, all broken network flows have to get re-established either by TCP or by the application layer following the corresponding window timeout. During the failure, Azure can't reach the on-premises servers using the corresponding NAT until connectivity has been restored for either the primary or secondary connections of the ExpressRoute circuit.

#### Option 2:

A common NAT pool is used before splitting the traffic between the primary and secondary connections of the ExpressRoute circuit. It's important to make the distinction that the common NAT pool before splitting the traffic doesn't mean it introduces a single-point of failure as such compromising high-availability.

The NAT pool is reachable even after the primary or secondary connection fail. So the network layer itself can reroute the packets and help recover faster following a failure. 

> [!NOTE]
> * If you use NAT option 1 (independent NAT pools for primary and secondary ExpressRoute connections) and map a port of an IP address from one of the NAT pool to an on-premises server, the server will not be reachable via the ExpressRoute circuit when the corresponding connection fails.
> * Terminating ExpressRoute BGP connections on stateful devices can cause issues with failover during planned or unplanned maintenances by Microsoft or your ExpressRoute Provider. You should test your set up to ensure your traffic will failover properly, and when possible, terminate BGP sessions on stateless devices.

## Fine-tuning features for private peering

In this section, let us review optional (depending on your Azure deployment and how sensitive you're to MTTR) features that help improve high availability of your ExpressRoute circuit. Specifically, let's review zone-aware deployment of ExpressRoute virtual network gateways, and Bidirectional Forwarding Detection (BFD).

### Availability Zone aware ExpressRoute virtual network gateways

An Availability Zone in an Azure region is a combination of a fault domain and an update domain. If you opt for zone-redundant Azure IaaS deployment, you may also want to configure zone-redundant virtual network gateways that terminate ExpressRoute private peering. To learn further, see [About zone-redundant virtual network gateways in Azure Availability Zones][zone redundant vgw]. To configure zone-redundant virtual network gateway, see [Create a zone-redundant virtual network gateway in Azure Availability Zones][conf zone redundant vgw].

### Improving failure detection time

ExpressRoute supports BFD over private peering. BFD reduces detection time of failure over the Layer 2 network between Microsoft Enterprise Edge (MSEEs) and their BGP neighbors on the on-premises side from about 3 minutes (default) to less than a second. Quick failure detection time helps hastening failure recovery. To learn further, see [Configure BFD over ExpressRoute][BFD].

## Next steps

In this article, we discussed how to design for high availability of an ExpressRoute circuit connectivity. An ExpressRoute circuit peering point is pinned to a geographical location and therefore get affected by catastrophic failure that affects the entire location. 

For design considerations to build geo-redundant network connectivity to Microsoft backbone that can withstand catastrophic failures, which affect an entire region, see [Designing for disaster recovery with ExpressRoute private peering][DR].

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
