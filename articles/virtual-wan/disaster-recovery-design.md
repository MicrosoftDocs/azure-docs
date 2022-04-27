---
title: 'Disaster recovery design for Azure Virtual WAN'
description: Learn about architectural recommendations for disaster recovery while using Azure Virtual WAN.
services: virtual-wan
author: rambk
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 01/25/2022
ms.author: rambala
---

# Disaster recovery design

Azure Virtual WAN helps you aggregate, connect, centrally manage, and secure all of your global deployments. Your global deployments could include any combination of branches, point of presence (PoP), private users, offices, Azure virtual networks, and other multiple-cloud deployments. 

You can use SD-WAN, site-to-site VPN, point-to-site VPN, and Azure ExpressRoute to connect your sites to a virtual hub. If you have multiple virtual hubs, all the hubs are connected in full mesh in a standard Virtual WAN deployment.

In this article, let's look at how to architect various types of back-end connectivity that Virtual WAN supports for disaster recovery.

## Back-end connectivity options for Virtual WAN

Virtual WAN supports the following back-end connectivity options:

* Point-to-site or user VPN
* Site-to-site VPN
* ExpressRoute private peering

For each of these connectivity options, Virtual WAN deploys a separate set of gateway instances within a virtual hub.

Virtual WAN offers a carrier-grade, high-availability network aggregation solution. For high availability, Virtual WAN instantiates multiple instances when each type of gateway is deployed in a Virtual WAN hub. To learn more about ExpressRoute high availability, see [Designing for high availability with ExpressRoute](../expressroute/designing-for-high-availability-with-expressroute.md).

With the point-to-site VPN gateway, the minimum number of instances deployed is two. You choose the number of instances via *gateway scale units*. You choose gateway scale units according to the number of clients or users you intend to connect to the virtual hub. From the perspective of client connectivity, the point-to-site VPN gateway instances are hidden behind the fully qualified domain name (FQDN) of the gateway.

For the site-to-site VPN gateway, two instances of the gateway are deployed within a virtual hub. Each gateway instance is deployed with its own set of public and private IP addresses. 

The following screen capture shows the IP addresses associated with the two instances of an example site-to-site VPN gateway configuration. In other words, the two instances provide two independent tunnel endpoints for establishing site-to-site VPN connectivity from your branches. To maximize high availability, you can create two tunnels that end on the two instances of the VPN gateway for each link from your branch sites.

:::image type="content" source="./media/disaster-recovery-design/site-to-site-gateway-config.png" alt-text="Screenshot that shows an example site-to-site V P N gateway configuration.":::

Maximizing the high availability of your network architecture is a key first step for business continuity and disaster recovery (BCDR). In the rest of this article, let's go beyond high availability and discuss how to architect your Virtual WAN connectivity network for BCDR.

## Need for disaster recovery design

Disaster can strike at any time, anywhere. Disasters can occur in a cloud provider's regions or network, within a service provider's network, or within an on-premises network. Regional impact of a cloud or network service due to factors such as natural calamity, human errors, war, terrorism, or misconfiguration is hard to rule out. 

For the continuity of your business-critical applications, you need to have a disaster recovery design. For a comprehensive disaster recovery design, you need to identify all the dependencies that can possibly fail in your end-to-end communication path, and then create non-overlapping redundancy for each dependency.

Whether you run your mission-critical applications in an Azure region, on-premises, or anywhere else, you can use another Azure region as your failover site. The following articles address disaster recovery from the perspectives of applications and front-end access:

- [Enterprise-scale disaster recovery](https://azure.microsoft.com/solutions/architecture/disaster-recovery-enterprise-scale-dr/) 
- [Disaster recovery with Azure Site Recovery](https://azure.microsoft.com/solutions/architecture/disaster-recovery-smb-azure-site-recovery/)

## Challenges of using redundant connectivity

When you interconnect the same set of networks by using more than one connection, you introduce parallel paths between the networks. Parallel paths, when not properly architected, could lead to asymmetrical routing. If you have stateful entities (for example, NAT or firewalls) in a path, asymmetrical routing could block traffic flow. 

Over private connectivity, you typically won't have or come across stateful entities such as NAT or firewalls. Asymmetrical routing over private connectivity doesn't necessarily block traffic flow.

However, if you load balance traffic across geo-redundant parallel paths, you'll experience inconsistent network performance because of the difference in the physical path of the parallel connections. So you need to consider network traffic performance during both the steady state (non-failure state) and a failure state as part of your disaster recovery design.

## Redundant access networks

Most SD-WAN services (managed solutions or otherwise) provide network connectivity via multiple transport types (for example, internet broadband, MPLS, LTE). To safeguard against transport network failures, choose connectivity over more than one transport network. For a home user scenario, consider using a mobile network as a backup for broadband network connectivity. 

If network connectivity over various transport types isn't possible, choose network connectivity via more than one service provider. If you're getting connectivity via more than one service provider, ensure that the service providers maintain independent access networks that don't overlap.

## Point-to-site VPN considerations

Point-to-site VPN establishes private connectivity between an end device and a network. After a network failure, the end device drops and tries to re-establish the VPN tunnel. 

For point-to-site VPN, your disaster recovery design should aim to minimize the recovery time after a failure. The following options for network redundancy can help minimize the recovery time. Depending on how critical the connections are, you can choose either or both of these options.

- Redundant access networks (as discussed earlier)
- Managing a redundant virtual hub for point-to-site VPN termination 

When you have multiple virtual hubs with point-to-site gateways, Virtual WAN provides a global profile that lists all the point-to-site endpoints. With the global profile, your end devices can connect to the closest available virtual hub that offers the best network performance. 

If all your Azure deployments are in a single region and the end devices that connect are in close proximity to the region, you can have redundant virtual hubs within the region. If your deployment and end devices are spread across multiple regions, you can deploy a virtual hub with a point-to-site gateway in each of your selected regions.  

The following diagram shows the concept of managing redundant virtual hubs with their respective point-to-site gateways within a region. 

:::image type="content" source="./media/disaster-recovery-design/point-to-site-multi-hub.png" alt-text="Diagram that shows multiple-hub point-to-site aggregation.":::

In the diagram, the solid green lines show the primary site-to-site VPN connections. The dotted yellow lines show the standby backup connections. The Virtual WAN point-to-site global profile selects primary and backup connections based on the network performance. For more information about global profiles, see [Download a global profile for User VPN clients](global-hub-profile.md).

## Site-to-site VPN considerations

Let's consider the example site-to-site VPN connection shown in the following diagram for our discussion. To establish a site-to-site VPN connection with high-availability active/active tunnels, see [Tutorial: Create a site-to-site connection using Azure Virtual WAN](virtual-wan-site-to-site-portal.md).

:::image type="content" source="./media/disaster-recovery-design/site-to-site-scenario.png" alt-text="Diagram that shows connecting an on-premises branch to Virtual WAN via site-to-site V P N.":::

> [!NOTE]
> For easy understanding of the concepts discussed in this section, we're not repeating the discussion of the high-availability feature of site-to-site VPN gateways that lets you create two tunnels to two different endpoints for each VPN link that you configure. While you're deploying any of the suggested architectures in this section, remember to configure two tunnels for each link that you establish.
>

### Multiple-link topology

To protect against failures of VPN customer premises equipment (CPE) at a branch site, you can configure parallel VPN links to a VPN gateway from parallel CPE devices at the branch site. To protect against network failures of a last-mile service provider to the branch office, you can configure different VPN links over different service provider networks. 

The following diagram shows multiple VPN links originating from two CPEs of a branch site and ending on the same VPN gateway.

:::image type="content" source="./media/disaster-recovery-design/multi-on-premises-site-to-site.png" alt-text="Diagram that shows redundant site-to-site VPN connections to a branch site.":::

You can configure up to four links to a branch site from a virtual hub's VPN gateway. While you're configuring a link to a branch site, you can identify the service provider and the throughput speed associated with the link. When you configure parallel links between a branch site and a virtual hub, the VPN gateway will load balance traffic across the parallel links by default. The gateway load balances traffic according to equal-cost multi-path (ECMP) on a per-flow basis.

### Multiple-hub, multiple-link topology

A multiple-hub, multiple-link topology helps protect against failures of CPE devices and a service provider's network at the on-premises branch location. It also helps protect against any downtime of a virtual hub's VPN gateway. The following diagram shows the topology.

:::image type="content" source="./media/disaster-recovery-design/multi-hub.png" alt-text="Diagram of multiple-hub site-to-site VPN connections to a branch site.":::

In this topology, latency over the connection between the hubs within an Azure region is insignificant. So you can use all the site-to-site VPN connections between the on-premises branch location and the two virtual hubs in active/active state by spreading the spoke virtual networks across the hubs. 

By default, traffic between the on-premises branch location and a spoke virtual network traverses directly through the virtual hub to which the spoke virtual network is connected during the steady state. The traffic uses another virtual hub as a backup only during a failure state. Traffic traverses through the directly connected hub in the steady state because the BGP routes advertised by the directly connected hub have a shorter autonomous systems (AS) path compared to the backup hub.

The multiple-hub, multiple-link topology provides protection and business continuity in most failure scenarios. But it's not sufficient if a catastrophic failure takes down the entire Azure region.

### Multiple-region, multiple-link topology

A multiple-region, multiple-link topology helps protect against a catastrophic failure of an entire region, along with providing the protections of a multiple-hub, multiple-link topology. The following diagram shows the multiple-region, multiple-link topology.

:::image type="content" source="./media/disaster-recovery-design/multi-region.png" alt-text="Diagram that shows multiple-region site-to-site V P N connections to a branch site.":::

From a traffic engineering point of view, you need consider one substantial difference between having redundant hubs within a region and having the backup hub in a different region. The difference is the latency that results from the physical distance between the primary and secondary regions. You might want to deploy your steady-state service resources in the region closest to your branch and end users, and then use the remote region purely for backup.

If your on-premises branch locations are spread around two or more Azure regions, the multiple-region, multiple-link topology would be more effective in spreading the load and in gaining better network experience during the steady state. The following diagram shows the multiple-region, multiple-link topology with branches in different regions. In such a scenario, the topology would provide effective BCDR.

:::image type="content" source="./media/disaster-recovery-design/multi-branch.png" alt-text="Diagram that shows multiple-region site-to-site VPN connections to multiple branch sites.":::

## ExpressRoute considerations

Disaster recovery considerations for ExpressRoute private peering are discussed in [Designing for disaster recovery with ExpressRoute private peering](../expressroute/designing-for-disaster-recovery-with-expressroute-privatepeering.md#small-to-medium-on-premises-network-considerations). The concepts described in that article equally apply to ExpressRoute gateways created within a virtual hub. Using a redundant virtual hub within the region, as shown in the following diagram, is the only topology enhancement that we recommend for [small to medium on-premises networks](../expressroute/index.yml).

:::image type="content" source="./media/disaster-recovery-design/expressroute-multi-hub.png" alt-text="Diagram that shows multiple-hub ExpressRoute connectivity.":::

In the preceding diagram, the second ExpressRoute instance ends on a separate ExpressRoute gateway within a second virtual hub in the region.

## Next steps

This article discussed design considerations for Virtual WAN disaster recovery. The following articles address disaster recovery from the perspectives of applications and front-end access:

- [Enterprise-scale disaster recovery](https://azure.microsoft.com/solutions/architecture/disaster-recovery-enterprise-scale-dr/)
- [Disaster recovery with Azure Site Recovery](https://azure.microsoft.com/solutions/architecture/disaster-recovery-smb-azure-site-recovery/)

To create a point-to-site connectivity to Virtual WAN, see [Tutorial: Create a User VPN connection using Azure Virtual WAN](virtual-wan-point-to-site-portal.md). 

To create a site-to-site connectivity to Virtual WAN, see [Tutorial: Create a site-to-site connection using Azure Virtual WAN](virtual-wan-site-to-site-portal.md). 

To associate an ExpressRoute circuit with Virtual WAN, see [Tutorial: Create an ExpressRoute association using Azure Virtual WAN](virtual-wan-expressroute-portal.md).
