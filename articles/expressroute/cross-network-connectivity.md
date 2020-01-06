---
title: 'Azure cross-network connectivity'
description: This page describes an application scenario for cross network connectivity and solution based on Azure networking features.
services: expressroute
author: rambk

ms.service: expressroute
ms.topic: article
ms.date: 04/03/2019
ms.author: rambala

---

# Cross-network connectivity

Fabrikam Inc. has a large physical presence and Azure deployment in East US. Fabrikam has back-end connectivity between its on-premises and Azure deployments via ExpressRoute. Similarly, Contoso Ltd. has a presence and Azure deployment in West US. Contoso has back-end connectivity between its on-premises and Azure deployments via ExpressRoute.  

Fabrikam Inc. acquires Contoso Ltd. Following the merger, Fabrikam wants to interconnect the networks. The following figure illustrates the scenario:

 [![1]][1]

The dashed arrows in the middle of the above figure indicate the desired network interconnections. Specifically, there are three types cross connections desired: 1) Fabrikam and Contoso VNets cross connect, 2) Cross regional on-premises and VNets cross connects (that is, connecting Fabrikam on-premises network to Contoso VNet and connecting Contoso on-premises network to Fabrikam VNet), and 3) Fabrikam and Contoso on-premises network cross connect. 

The following table shows the route table of the private peering of the ExpressRoute of Contoso Ltd., before the merger.

[![2]][2]

The following table shows the effective routes of a VM in the Contoso subscription, before the merger. Per the table, the VM on the VNet is aware of the VNet address space and the Contoso on-premises network, apart from the default ones. 

[![4]][4]

The following table shows the route table of the private peering of the ExpressRoute of Fabrikam Inc., before the merger.

[![3]][3]

The following table shows the effective routes of a VM in the Fabrikam subscription, before the merger. Per the table, the VM on the VNet is aware of the VNet address space and the Fabrikam on-premises network, apart from the default ones.

[![5]][5]

In this article, let's go through step by step and discuss how to achieve the desired cross connections using the following Azure network features:

* [Virtual network peering][Virtual network peering] 
* [Virtual network ExpressRoute connection][connection]
* [Global Reach][Global Reach] 

## Cross connecting VNets

Virtual network peering (VNet peering) provides the most optimal and the best network performance when connecting two virtual networks. VNet peering supports peering two VNets both within the same Azure region (commonly called VNet peering) and in two different Azure regions (commonly called Global VNet peering). 

Let's configure Global VNet peering between the VNets in Contoso and Fabrikam Azure subscriptions. For how to create the virtual network peering between two the virtual networks, see [Create a virtual network peering][Configure VNet peering] article.

The following picture shows the network architecture after configuring Global VNet peering.

[![6]][6]

The following table shows the routes known to the Contoso subscription VM. Pay attention to the last entry of the table. This entry is the result of cross connecting the virtual networks.

[![7]][7]

The following table shows the routes known to the Fabrikam subscription VM. Pay attention to the last entry of the table. This entry is the result of cross connecting the virtual networks.

[![8]][8]

VNet peering directly links two virtual networks (see there are no next hop for *VNetGlobalPeering* entry in the above two tables)

## Cross connecting VNets to the on-premises networks

We can connect an ExpressRoute circuit to multiple virtual networks. See [Subscription and service limits][Subscription limits] for the maximum number of virtual networks that can be connected to an ExpressRoute circuit. 

Let's connect Fabrikam ExpressRoute circuit to Contoso subscription VNet and similarly Contoso ExpressRoute circuit to Fabrikam subscription VNet to enable cross connectivity between virtual networks and the on-premises networks. To connect a virtual network to an ExpressRoute circuit in a different subscription, we need to create and use an authorization.  See the article: [Connect a virtual network to an ExpressRoute circuit][Connect-ER-VNet].

The following picture shows the network architecture after configuring the ExpressRoute cross connectivity to the virtual networks.

[![9]][9]

The following table shows the route table of the private peering of the ExpressRoute of Contoso Ltd., after cross connecting virtual networks to the on-premises networks via ExpressRoute. See that the route table has routes belonging to both the virtual networks.

[![10]][10]

The following table shows the route table of the private peering of the ExpressRoute of Fabrikam Inc., after cross connecting virtual networks to the on-premises networks via ExpressRoute. See that the route table has routes belonging to both the virtual networks.

[![11]][11]

The following table shows the routes known to the Contoso subscription VM. Pay attention to *Virtual network gateway* entries of the table. The VM sees routes for both the on-premises networks.

[![12]][12]

The following table shows the routes known to the Fabrikam subscription VM. Pay attention to *Virtual network gateway* entries of the table. The VM sees routes for both the on-premises networks.

[![13]][13]

>[!NOTE]
>In either the Fabrikam and/or Contoso subscriptions you can also have spoke VNets to the respective hub VNet (a hub and spoke design is not illustrated in the architecture diagrams in this article). The cross connections between the hub VNet gateways to ExpressRoute will also allow communication between East and West hubs and spokes.
>

## Cross connecting on-premises networks

ExpressRoute Global Reach provides connectivity between on-premises networks that are connected to different ExpressRoute circuits. Let's configure Global Reach between Contoso and Fabrikam ExpressRoute circuits. Because the ExpressRoute circuits are in different subscriptions, we need to create and use an authorization. See [Configure ExpressRoute Global Reach][Configure Global Reach] article for step by step guidance.

The following picture shows the network architecture after configuring Global Reach.

[![14]][14]

The following table shows the route table of the private peering of the ExpressRoute of Contoso Ltd., after configuring Global Reach. See that the route table has routes belonging to both the on-premises networks. 

[![15]][15]

The following table shows the route table of the private peering of the ExpressRoute of Fabrikam Inc., after configuring Global Reach. See that the route table has routes belonging to both the on-premises networks.

[![16]][16]

## Next steps

See [virtual network FAQ][VNet-FAQ], for any further questions on VNet and VNet-peering. See [ExpressRoute FAQ][ER-FAQ] for any further questions on ExpressRoute and virtual network connectivity.

Global Reach is rolled out on a country/region by country/region basis. To see if Global Reach is available in the countries/regions that you want, see [ExpressRoute Global Reach][Global Reach].

<!--Image References-->
[1]: ./media/cross-network-connectivity/premergerscenario.png "The Application scenario"
[2]: ./media/cross-network-connectivity/contosoexr-rt-premerger.png "Contoso ExpressRoute route table before merger"
[3]: ./media/cross-network-connectivity/fabrikamexr-rt-premerger.png "Fabrikam ExpressRoute route table before merger"
[4]: ./media/cross-network-connectivity/contosovm-routes-premerger.png "Contoso VM routes before merger"
[5]: ./media/cross-network-connectivity/fabrikamvm-routes-premerger.png "Fabrikam VM routes before merger"
[6]: ./media/cross-network-connectivity/vnet-peering.png "The Architecture after VNet-peering"
[7]: ./media/cross-network-connectivity/contosovm-routes-peering.png "Contoso VM routes after VNet peering"
[8]: ./media/cross-network-connectivity/fabrikamvm-routes-peering.png "Fabrikam VM routes after VNet peering"
[9]: ./media/cross-network-connectivity/exr-x-connect.png "The Architecture after ExpressRoutes cross connection"
[10]: ./media/cross-network-connectivity/contosoexr-rt-xconnect.png "Contoso ExpressRoute route table after cross connecting ExR and VNets"
[11]: ./media/cross-network-connectivity/fabrikamexr-rt-xconnect.png "Fabrikam ExpressRoute route table after cross connecting ExR and VNets"
[12]: ./media/cross-network-connectivity/contosovm-routes-xconnect.png "Contoso VM routes after cross connecting ExR and VNets"
[13]: ./media/cross-network-connectivity/fabrikamvm-routes-xconnect.png "Fabrikam VM routes after cross connecting ExR and VNets"
[14]: ./media/cross-network-connectivity/globalreach.png "The Architecture after configuring Global Reach"
[15]: ./media/cross-network-connectivity/contosoexr-rt-gr.png "Contoso ExpressRoute route table after Global Reach"
[16]: ./media/cross-network-connectivity/fabrikamexr-rt-gr.png "Fabrikam ExpressRoute route table after Global Reach"

<!--Link References-->
[Virtual network peering]: https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview
[connection]: https://docs.microsoft.com/azure/expressroute/expressroute-howto-linkvnet-portal-resource-manager
[Global Reach]: https://docs.microsoft.com/azure/expressroute/expressroute-global-reach
[Configure VNet peering]: https://docs.microsoft.com/azure/virtual-network/create-peering-different-subscriptions
[Configure Global Reach]: https://docs.microsoft.com/azure/expressroute/expressroute-howto-set-global-reach
[Subscription limits]: https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#networking-limits
[Connect-ER-VNet]: https://docs.microsoft.com/azure/expressroute/expressroute-howto-linkvnet-portal-resource-manager
[ER-FAQ]: https://docs.microsoft.com/azure/expressroute/expressroute-faqs
[VNet-FAQ]: https://docs.microsoft.com/azure/virtual-network/virtual-networks-faq