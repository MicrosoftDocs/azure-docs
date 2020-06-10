---
title: 'Interoperability in Azure : Control plane analysis'
description: This article provides the control plane analysis of the test setup you can use to analyze interoperability between ExpressRoute, a site-to-site VPN, and virtual network peering in Azure.
documentationcenter: na
services: networking
author: rambk
manager: tracsman

ms.service: virtual-network
ms.topic: article
ms.workload: infrastructure-services
ms.date: 10/18/2018
ms.author: rambala

---

# Interoperability in Azure : Control plane analysis

This article describes the control plane analysis of the [test setup][Setup]. You can also review the [test setup configuration][Configuration] and the [data plane analysis][Data-Analysis] of the test setup.

Control plane analysis essentially examines routes that are exchanged between networks within a topology. Control plane analysis can help you understand how different networks view the topology.

## Hub and spoke VNet perspective

The following figure illustrates the network from the perspective of a hub virtual network (VNet) and a spoke VNet (highlighted in blue). The figure also shows the autonomous system number (ASN) of different networks and routes that are exchanged between different networks: 

![1][1]

The ASN of the VNet's Azure ExpressRoute gateway is different from the ASN of Microsoft Enterprise Edge Routers (MSEEs). An ExpressRoute gateway uses a private ASN (a value of **65515**) and MSEEs use public ASN (a value of **12076**) globally. When you configure ExpressRoute peering, because MSEE is the peer, you use **12076** as the peer ASN. On the Azure side, MSEE establishes eBGP peering with the ExpressRoute gateway. The dual eBGP peering that the MSEE establishes for each ExpressRoute peering is transparent at the control plane level. Therefore, when you view an ExpressRoute route table, you see the VNet's ExpressRoute gateway ASN for the VNet's prefixes. 

The following figure shows a sample ExpressRoute route table: 

![5][5]

Within Azure, the ASN is significant only from a peering perspective. By default, the ASN of both the ExpressRoute gateway and the VPN gateway in Azure VPN Gateway is **65515**.

## On-premises Location 1 and the remote VNet perspective via ExpressRoute 1

Both on-premises Location 1 and the remote VNet are connected to the hub VNet via ExpressRoute 1. They share the same perspective of the topology, as shown in the following diagram:

![2][2]

## On-premises Location 1 and the branch VNet perspective via a site-to-site VPN

Both on-premises Location 1 and the branch VNet are connected to a hub VNet's VPN gateway via a site-to-site VPN connection. They share the same perspective of the topology, as shown in the following diagram:

![3][3]

## On-premises Location 2 perspective

On-premises Location 2 is connected to a hub VNet via private peering of ExpressRoute 2: 

![4][4]

## ExpressRoute and site-to-site VPN connectivity in tandem

###  Site-to-site VPN over ExpressRoute

You can configure a site-to-site VPN by using ExpressRoute Microsoft peering to privately exchange data between your on-premises network and your Azure VNets. With this configuration, you can exchange data with confidentiality, authenticity, and integrity. The data exchange also is anti-replay. For more information about how to configure a site-to-site IPsec VPN in tunnel mode by using ExpressRoute Microsoft peering, see [Site-to-site VPN over ExpressRoute Microsoft peering][S2S-Over-ExR]. 

The primary limitation of configuring a site-to-site VPN that uses Microsoft peering is throughput. Throughput over the IPsec tunnel is limited by the VPN gateway capacity. The VPN gateway throughput is lower than ExpressRoute throughput. In this scenario, using the IPsec tunnel for highly secure traffic and using private peering for all other traffic helps optimize the ExpressRoute bandwidth utilization.

### Site-to-site VPN as a secure failover path for ExpressRoute

ExpressRoute serves as a redundant circuit pair to ensure high availability. You can configure geo-redundant ExpressRoute connectivity in different Azure regions. Also, as demonstrated in our test setup, within an Azure region, you can use a site-to-site VPN to create a failover path for your ExpressRoute connectivity. When the same prefixes are advertised over both ExpressRoute and a site-to-site VPN, Azure prioritizes ExpressRoute. To avoid asymmetrical routing between ExpressRoute and the site-to-site VPN, on-premises network configuration should also reciprocate by using ExpressRoute connectivity before it uses site-to-site VPN connectivity.

For more information about how to configure coexisting connections for ExpressRoute and a site-to-site VPN, see [ExpressRoute and site-to-site coexistence][ExR-S2S-CoEx].

## Extend back-end connectivity to spoke VNets and branch locations

### Spoke VNet connectivity by using VNet peering

Hub and spoke VNet architecture is widely used. The hub is a VNet in Azure that acts as a central point of connectivity between your spoke VNets and to your on-premises network. The spokes are VNets that peer with the hub, and which you can use to isolate workloads. Traffic flows between the on-premises datacenter and the hub through an ExpressRoute or VPN connection. For more information about the architecture, see [Implement a hub-spoke network topology in Azure][Hub-n-Spoke].

In VNet peering within a region, spoke VNets can use hub VNet gateways (both VPN and ExpressRoute gateways) to communicate with remote networks.

### Branch VNet connectivity by using site-to-site VPN

You might want branch VNets, which are in different regions, and on-premises networks to communicate with each other via a hub VNet. The native Azure solution for this configuration is site-to-site VPN connectivity by using a VPN. An alternative is to use a network virtual appliance (NVA) for routing in the hub.

For more information, see [What is VPN Gateway?][VPN] and [Deploy a highly available NVA][Deploy-NVA].

## Next steps

Learn about [data plane analysis][Data-Analysis] of the test setup and Azure network monitoring feature views.

See the [ExpressRoute FAQ][ExR-FAQ] to:
-   Learn how many ExpressRoute circuits you can connect to an ExpressRoute gateway.
-   Learn how many ExpressRoute gateways you can connect to an ExpressRoute circuit.
-   Learn about other scale limits of ExpressRoute.


<!--Image References-->
[1]: ./media/backend-interoperability/HubView.png "Hub and spoke VNet perspective of the topology"
[2]: ./media/backend-interoperability/Loc1ExRView.png "Location 1 and remote VNet perspective of the topology via ExpressRoute 1"
[3]: ./media/backend-interoperability/Loc1VPNView.png "Location 1 and branch VNet perspective of the topology via a site-to-site VPN"
[4]: ./media/backend-interoperability/Loc2View.png "Location 2 perspective of the topology"
[5]: ./media/backend-interoperability/ExR1-RouteTable.png "ExpressRoute 1 route table"

<!--Link References-->
[Setup]: https://docs.microsoft.com/azure/networking/connectivty-interoperability-preface
[Configuration]: https://docs.microsoft.com/azure/networking/connectivty-interoperability-configuration
[ExpressRoute]: https://docs.microsoft.com/azure/expressroute/expressroute-introduction
[VPN]: https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways
[VNet]: https://docs.microsoft.com/azure/virtual-network/tutorial-connect-virtual-networks-portal
[Configuration]: https://docs.microsoft.com/azure/networking/connectivty-interoperability-configuration
[Control-Analysis]:https://docs.microsoft.com/azure/networking/connectivty-interoperability-control-plane
[Data-Analysis]: https://docs.microsoft.com/azure/networking/connectivty-interoperability-data-plane
[ExR-FAQ]: https://docs.microsoft.com/azure/expressroute/expressroute-faqs
[S2S-Over-ExR]: https://docs.microsoft.com/azure/expressroute/site-to-site-vpn-over-microsoft-peering
[ExR-S2S-CoEx]: https://docs.microsoft.com/azure/expressroute/expressroute-howto-coexist-resource-manager
[Hub-n-Spoke]: https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/hub-spoke
[Deploy-NVA]: https://docs.microsoft.com/azure/architecture/reference-architectures/dmz/nva-ha
[VNet-Config]: https://docs.microsoft.com/azure/virtual-network/virtual-network-manage-peering


