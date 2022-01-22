﻿﻿﻿﻿---
title: 'Design for disaster recovery with Azure Virtual WAN | Microsoft Docs'
description: This page provides architectural recommendations for disaster recovery while using Azure Virtual WAN.
documentationcenter: na
services: networking
author: rambk
manager: tracsman

ms.service: Virtual WAN
ms.topic: article
ms.workload: infrastructure-services
ms.date: 01/05/2022
ms.author: rambala

---

# Design for disaster recovery with Virtual WAN

Virtual WAN allows to aggregate and connect, centrally manage and secure, your different branches, Point-of-Presence (PoP), private users, offices, Azure virtual networks, and/or other multi-cloud deployments. You can use different type of network connectivity--SD-WAN, Site-to-site VPN, Point-to-site VPN, ExpressRoute--to connect your different sites to a Virtual WAN Hub. If you have multiple Virtual WAN Hubs, all the hubs would be connected in full mesh in a standard Virtual WAN deployment.

In this article let's look into how architect different connectivity to Virtual WAN for disaster recovery. 

## Private connectivity options of Virtual WAN

For backend private connectivity to Virtual WAN, you can use point-to-site, site-to-site, or ExpressRoute private peering. For each of these connectivity options, a Virtual WAN hub has separate gateways. 

Inherently, Virtual WAN is designed to offer carrier-grade high-available network aggregation solution. For high availability, Virtual WAN instantiate multiple instances when each of these different types of gateways is deployed with in a Virtual WAN hub. To learn more about ExpressRoute high availability designing, see [Designing for high availability with ExpressRoute][ExR HA]. 

With the point-to-site VPN gateway the minimum number of instances deployed is 2. With the point-to-site VPN gateway, you choose the number of instances via 'Gateway scale units' according to the number of clients/users you intend to connect to the virtual hub. From the client connectivity perspective, the point-to-site VPN gateway instances are hidden behind the Fully Qualified Domain Name (FQDN) of the gateway you connect to.

In the case of the site-to-site VPN gateway, two instances of the gateway are deployed within a virtual hub with independent public and private IP addresses. The following screen capture shows the IP addresses associated with the two instances of an example site-to-site VPN gateway configuration. In other words, the two instances provide two independent tunnel endpoints to a virtual hub for establishing site-to-site VPN connectivities from your branches. To maximize high-availability you can create two tunnels terminating on the two different instances of the VPN gateway for each link between a branch site and the VPN gateway.

[![8]][8]

Maximizing the high-availability of your connections is very important and a key first step for Business Continuity and Disaster Recovery (BCDR). In the rest of this article, as stated previously, let's go beyond high-availability deployment of each of these Virtual WAN gateways and discuss how to design your Virtual WAN connectivity network for BCDR.


## Need for redundant connectivity solution

 There are possibilities and incidents where an entire regional service be it that of Microsoft, network service providers, customer, or other cloud service providers gets degraded. Microsoft learns from the issues reported and constantly work on fundamentals to improve the availability of its future globally. Yet, a regional service impact due to certain factors such as natural calamity, human errors, war/terrorism, misconfiguration is hard to ruleout. Similarly, you may experience outages because of issues in your service provider network, your own network, or other network/cloud service providers. Therefore, for business continuity of mission critical applications it is important to analyze all failure scenarios and plan for disaster recovery.   

Irrespective of whether you run your mission critical applications in an Azure region or on-premises or anywhere else, you can use another Azure region as your failover site. The following articles addresses disaster recovery from applications and frontend access perspectives:

- [Enterprise-scale disaster recovery][Enterprise DR]
- [SMB disaster recovery with Azure Site Recovery][SMB DR]


## Challenges of using redundant connectivity

When you interconnect the same set of networks using more than one connection, you introduce parallel paths between the networks. Parallel paths, when not properly architected, could lead to asymmetrical routing. If you have state-full entities (for example, NAT, firewall) in the path, asymmetrical routing could block traffic flow.  Typically, over private connectivity you won't have or come across stateful entities such as NAT or Firewalls. Therefore, asymmetrical routing over private connectivity does not necessarily block traffic flow.
 
However, if you load balance traffic across geo-redundant parallel paths, irrespective of whether you have state-full entities or not, you would experience inconsistent network performance because of the difference in physical path of the parallel connections. In this article, let's discuss how to address these challenges.

## Access network redundancy

Most SD-WAN services offered (managed solutions or not) provide you network connectivity via multiple transport type (e.g. Internet broadband, MPLS, LTE). To safeguard against transport network failures, choose connectivity over more than one transport network. If network connectivity over more than one transport type network is not possible or network performance over certain types of transport network is bad, then choose network connectivity via more than one service provider. If you are getting connectivity via more than one service providers, ensure that the service providers maintain non-overlapping independent access networks.

## Point-to-site VPN network connectivity considerations

With point-to-site VPN, that establishes private connectivity between an end-device to a network, your disaster recovery design should aim to minimize the recovery time following a failure. The following would help minimize the recovery time, following a network failure:

* Access network redundancy, as discussed above. In certain scenarios, you may have to consider different types of access network for redundancy. For example, leveraging mobile network connectivity as a back-up for broadband network connecivity for a home user.
* Managing redundant VPN termination points at the network level. The end-devices should be able to connect to the redundant VPN termination point(s), if their primary connectivity fails. The concept is illustrated in the following diagram.

[![6]][6]

In the above diagram, the solid green lines show the primary site-to-site VPN connections and the dotted yellow lines show the stand-by back-up connections. As shown in the above diagram, you can load balance the user connections across the redundant virtual hubs within a region for optimal performance during steady-state as well as during recovery phase following a failure.

## Site-to-site VPN network conectivity considerations

Let's consider the example of connecting an on-premises branch site to virtual-WAN via site-to-site VPN as illustrated in the following diagram. To establish a site-to-site VPN connection with high-available active-active tunnels, see [Tutorial: Create a Site-to-Site connection using Azure Virtual WAN][Create-VPN].

[![1]][1]

>[!NOTE] 
>For easy understanding of the concepts discussed in the section, we are not repeating the discussion of the high-availability feature of site-to-stie VPN gateway that lets you create two tunnels to two different endpoints for each VPN link you configure. However, while deploying any of the suggested architecture in the section, remember to configure two tunnels for each of the link you establish.
>

### Multi-link topology

To protect against failures of VPN termination Customer Premises Equipment (CPE) at a branch site, you can configure parallel VPN links to a VPN gateway from parallel CPE devices at the branch site. Further to protect against nework failures of a last-mile service provider to the branch office, you can configure different VPN links over different service provider network. The following diagram illustrates multiple VPN topology from a branch site terminating on the same VPN-gateway.

[![2]][2]

You can configure up to four links to a branch site from a virtual hub VPN gateway. While configuring a link to a branch site you can identify the service provider and the throughput speed associated with the link. When you configure parallel links between a branch site and a virtual hub, the VPN gateway by default would load balance traffic across the parallel links. The load balancing of traffic would be according to Equal-Cost Multi-Path (ECMP) on per-flow basis.

### Multi-hub multi-link topology

Multi-link topology protects against CPE device failures and a service provider network failure at the on-premises branch location. Additionally, to protect against any downtime of a virtual hub VPN-gateway, multi-hub multi-link topology would help. The following diagram shows the topology:

[![3]][3]

In the above topology, because intra-Azure-region latency over the connection between the hubs are insignificant, you can use all the site-to-site VPN connections between the on-premises and the two virtual hubs in active-active state by spreading the spoke VNets across the hubs. 

In the topology, by default, traffic between on-premises and a spoke VNET would traverse directly through the virtual hub to which the spoke VNET is connected in the steady-state and use another virtual hub as a backup only during a failure state. Traffic would traverse through the directly connected hub in the steady state, because the BGP routes advertised by the directly connected hub would have shorter AS-path compared to the backup hub.

The multi-hub multi-link topology would protect and provide business continuity against most of the failure scenarios. However, in the event of a catastropic failure that takes down the entire Azure region, 'multi-region multi-link topology' would help. 

### Multi-region multi-link topology

Multi-region multi-link topology protect against even a catastropic failure of an entire region in addition to the protections offered by the multi-hub multi-link topology that we previously discussed. The following diagram shows the multi-region multi-link topology.

[![4]][4]

From a traffic engineering point of view, you need to take into consideration one substantial difference between having redundant hubs within a region vs having the backup hub in a different region. The difference is the latency resulting from the physical distance between the primary and secondary regions. Therefore, you may want to deploy your steady-state service resources in the region closest to your branch/end-users and use the remote region purely for backup.

If your on-premises branch locations are spread around two or more Azure regions, the multi-region multi-link topology would be more effective in spreading the load and in gaining better network experience during the steady state. The following diagram shows multi-region multi-link topology with branches in different regions. In such scenario, the topology would additionlly provide effective Business Continuity Disaster Recovery (BCDR).

[![5]][5]

## ExpressRoute conectivity considerations

Disaster recovery considerations for ExpressRoute private peering are discussed in [Designing for disaster recovery with ExpressRoute private peering][ExR DR]. As noted in the article, the concepts described in that article equally applies for ExpressRoute gateways created within a virtual hub. The following is the only topology enhancement recommended for [Small to medium on-premises network considerations][S2M ExR DR].

[![7]][7]

In the above diagram, the ExpressRoute 2 is terminated on a separate ExpressRoute gateway within a second virtaul hub within the region. 

## Next steps

In this article, we discussed how to design for disaster recovery for backend private connectivity to Virtual WAN. The following articles addresses disaster recovery from applications and frontend access perspectives:

- [Enterprise-scale disaster recovery][Enterprise DR]
- [SMB disaster recovery with Azure Site Recovery][SMB DR]

To create a point-to-site connectivity to Virtual WAN, see [Tutorial: Create a User VPN connection using Azure Virtual WAN][p2s]. To create a site-to-site connectivity to Virtual WAN see [Tutorial: Create a Site-to-Site connection using Azure Virtual WAN][s2s]. To associate an ExpressRoute circuit to Virtual WAN, see [Tutorial: Create an ExpressRoute association using Azure Virtual WAN][exr].

<!--Image References-->
[1]: ./media/designing-for-disaster-recovery-with-virtual-wan/VPNscenario.png "Connecting an on-premises branch to virtual wan via site-to-site VPN"
[2]: ./media/designing-for-disaster-recovery-with-virtual-wan/multionpremVPN.png "Redundant site-to-site VPN connections to a branch site"
[3]: ./media/designing-for-disaster-recovery-with-virtual-wan/multihub.png "Multi-hub site-to-site VPN connections to a branch site"
[4]: ./media/designing-for-disaster-recovery-with-virtual-wan/multiregion.png "Multi-region site-to-site VPN connections to a branch site"
[5]: ./media/designing-for-disaster-recovery-with-virtual-wan/multibranch.png "Multi-region site-to-site VPN connections to multi-branch sites"
[6]: ./media/designing-for-disaster-recovery-with-virtual-wan/p2smultihub.png "Multi-hub point-to-site aggregation"
[7]: ./media/designing-for-disaster-recovery-with-virtual-wan/exrmultihub.png "Multi-hub ExpresssRoute connectivity"
[8]: ./media/designing-for-disaster-recovery-with-virtual-wan/s2s-gw-instances.png "Instances of an example S2S VPN gateway configuration"


<!--Link References-->
[Create-VPN]: https://docs.microsoft.com/azure/virtual-wan/virtual-wan-site-to-site-portal
[Enterprise DR]: https://azure.microsoft.com/solutions/architecture/disaster-recovery-enterprise-scale-dr/
[SMB DR]: https://azure.microsoft.com/solutions/architecture/disaster-recovery-smb-azure-site-recovery/
[ExR DR]: https://docs.microsoft.com/azure/expressroute/designing-for-disaster-recovery-with-expressroute-privatepeering
[S2M ExR DR]: https://docs.microsoft.com/azure/expressroute/designing-for-disaster-recovery-with-expressroute-privatepeering#small-to-medium-on-premises-network-considerations
[p2s]: https://docs.microsoft.com/azure/virtual-wan/virtual-wan-point-to-site-portal
[s2s]: https://docs.microsoft.com/azure/virtual-wan/virtual-wan-site-to-site-portal
[exr]: https://docs.microsoft.com/azure/virtual-wan/virtual-wan-expressroute-portal
[ExR HA]: https://docs.microsoft.com/azure/expressroute/designing-for-high-availability-with-expressroute









