---
title: 'Azure Virtual WAN Overview | Microsoft Docs'
description: Learn about Virtual WAN automated scalable branch-to-branch connectivity, available regions, and partners.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: overview
ms.date: 09/22/2020
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to understand what Virtual WAN is and if it is the right choice for my Azure network.
---

# What is Azure Virtual WAN?

Azure Virtual WAN is a networking service that brings many networking, security, and routing functionalities together to provide a single operational interface. These functionalities include branch connectivity (via connectivity automation from Virtual WAN Partner devices such as SD-WAN or VPN CPE), Site-to-site VPN connectivity, remote user VPN (Point-to-site) connectivity, private (ExpressRoute) connectivity, intra-cloud connectivity (transitive connectivity for virtual networks), VPN ExpressRoute inter-connectivity, routing, Azure Firewall, and encryption for private connectivity. You do not have to have all of these use cases to start using Virtual WAN. You can simply get started with just one use case, and then adjust your network as it evolves.

The Virtual WAN architecture is a hub and spoke architecture with scale and performance built in for branches (VPN/SD-WAN devices), users (Azure VPN/OpenVPN/IKEv2 clients), ExpressRoute circuits, and virtual networks. It enables [global transit network architecture](virtual-wan-global-transit-network-architecture.md), where the cloud hosted network 'hub' enables transitive connectivity between endpoints that may be distributed across different types of 'spokes'.

Azure regions serve as hubs that you can choose to connect to. All hubs are connected in full mesh in a Standard Virtual WAN making it easy for the user to use the Microsoft backbone for any-to-any (any spoke) connectivity. For spoke connectivity with SD-WAN/VPN devices, users can either manually set it up in Azure Virtual WAN, or use the Virtual WAN CPE (SD-WAN/VPN) partner solution to set up connectivity to Azure. We have a list of partners that support connectivity automation (ability to export the device info into Azure, download the Azure configuration and establish connectivity) with Azure Virtual WAN. For more information, see the [Virtual WAN partners and locations](virtual-wan-locations-partners.md) article.

![Virtual WAN diagram](./media/virtual-wan-about/virtualwan1.png)

This article provides a quick view into the network connectivity in Azure Virtual WAN. Virtual WAN offers the following advantages:

* **Integrated connectivity solutions in hub and spoke:** Automate site-to-site configuration and connectivity between on-premises sites and an Azure hub.
* **Automated spoke setup and configuration:** Connect your virtual networks and workloads to the Azure hub seamlessly.
* **Intuitive troubleshooting:** You can see the end-to-end flow within Azure, and then use this information to take required actions.

## <a name="basicstandard"></a>Basic and Standard virtual WANs

There are two types of virtual WANs: Basic and Standard. The following table shows the available configurations for each type.

[!INCLUDE [Basic and Standard SKUs](../../includes/virtual-wan-standard-basic-include.md)]

For steps to upgrade a virtual WAN, see [Upgrade a virtual WAN from Basic to Standard](upgrade-virtual-wan.md).

## <a name="architecture"></a>Architecture

For information about Virtual WAN architecture and how to migrate to Virtual WAN, see the following articles:

* [Virtual WAN architecture](migrate-from-hub-spoke-topology.md)
* [Global transit network architecture](virtual-wan-global-transit-network-architecture.md)

## <a name="resources"></a>Virtual WAN resources

To configure an end-to-end virtual WAN, you create the following resources:

* **virtualWAN:** The virtualWAN resource represents a virtual overlay of your Azure network and is a collection of multiple resources. It contains links to all your virtual hubs that you would like to have within the virtual WAN. Virtual WAN resources are isolated from each other and cannot contain a common hub. Virtual hubs across Virtual WAN do not communicate with each other.

* **Hub:** A virtual hub is a Microsoft-managed virtual network. The hub contains various service endpoints to enable connectivity. From your on-premises network (vpnsite), you can connect to a VPN Gateway inside the virtual hub, connect ExpressRoute circuits to a virtual hub, or even connect mobile users to a Point-to-site gateway in the virtual hub. The hub is the core of your network in a region. There can only be one hub per Azure region.

  A hub gateway is not the same as a virtual network gateway that you use for ExpressRoute and VPN Gateway. For example, when using Virtual WAN, you don't create a site-to-site connection from your on-premises site directly to your VNet. Instead, you create a site-to-site connection to the hub. The traffic always goes through the hub gateway. This means that your VNets do not need their own virtual network gateway. Virtual WAN lets your VNets take advantage of scaling easily through the virtual hub and the virtual hub gateway.

* **Hub virtual network connection:** The Hub virtual network connection resource is used to connect the hub seamlessly to your virtual network.

* **Hub-to-Hub connection:** Hubs are all connected to each other in a virtual WAN. This implies that a branch, user, or VNet connected to a local hub can communicate with another branch or VNet using the full mesh architecture of the connected hubs. You can also connect VNets within a hub transiting through the virtual hub, as well as VNets across hub, using the hub-to-hub connected framework.

* **Hub route table:**  You can create a virtual hub route and apply the route to the virtual hub route table. You can apply multiple routes to the virtual hub route table.

**Additional Virtual WAN resources**

* **Site:** This resource is used for site-to-site connections only. The site resource is **vpnsite**. It represents your on-premises VPN device and its settings. By working with a Virtual WAN partner, you have a built-in solution to automatically export this information to Azure.

## <a name="connectivity"></a>Types of connectivity

Virtual WAN allows the following types of connectivity: Site-to-Site VPN, User VPN (Point-to-Site), and ExpressRoute.

### <a name="s2s"></a>Site-to-site VPN connections

You can connect to your resources in Azure over a Site-to-site IPsec/IKE (IKEv2) connection. For more information, see [Create a site-to-site connection using Virtual WAN](virtual-wan-site-to-site-portal.md). 

This type of connection requires a VPN device or a Virtual WAN Partner device. Virtual WAN partners provide automation for connectivity, which is the ability to export the device info into Azure, download the Azure configuration, and establish connectivity to the Azure Virtual WAN hub. For a list of the available partners and locations, see the [Virtual WAN partners and locations](virtual-wan-locations-partners.md) article. If your VPN/SD-WAN device provider is not listed in the mentioned link, then you can simply use the step-by-step instruction [Create a site-to-site connection using Virtual WAN](virtual-wan-site-to-site-portal.md) to set up the connection.

### <a name="uservpn"></a>User VPN (point-to-site) connections

You can connect to your resources in Azure over an IPsec/IKE (IKEv2) or OpenVPN connection. This type of connection requires a VPN client to be configured on the client computer. For more information, see [Create a point-to-site connection](virtual-wan-point-to-site-portal.md).

### <a name="er"></a>ExpressRoute connections
ExpressRoute lets you connect on-premises network to Azure over a private connection. To create the connection, see [Create an ExpressRoute connection using Virtual WAN](virtual-wan-expressroute-portal.md).

### <a name="hub"></a>Hub-to-VNet connections

You can connect an Azure virtual network to a virtual hub. For more information, see [Connect your VNet to a hub](virtual-wan-site-to-site-portal.md#vnet).

### <a name="transit"></a>Transit connectivity

#### <a name="transit-vnet"></a>Transit connectivity between VNets

Virtual WAN allows transit connectivity between VNets. VNets connect to a virtual hub via a virtual network connection. Transit connectivity between the VNets in **Standard Virtual WAN** is enabled due to the presence of a router in every virtual hub. This router is instantiated when the virtual hub is first created.

The router can have four routing statuses: Provisioned, Provisioning, Failed, or None. The **Routing status** is located in the Azure portal by navigating to the Virtual Hub page.

* A **None** status indicates that the Virtual hub did not provision the router. This can happen if the Virtual WAN is of type *Basic*, or if the virtual hub was deployed prior to the service being made available.
* A **Failed** status indicates failure during instantiation. In order to instantiate or reset the router, you can locate the **Reset Router** option by navigating to the virtual hub Overview page in the Azure portal.

Every virtual hub router supports an aggregate throughput up to 50 Gbps. Connectivity between the virtual network connections assumes a total of 2000 VM workload across all VNets connected to a single virtual Hub.

#### <a name="transit-er"></a>Transit connectivity between VPN and ExpressRoute

Virtual WAN allows transit connectivity between VPN and ExpressRoute. This implies that VPN-connected sites or remote users can communicate with ExpressRoute-connected sites. There is also an implicit assumption that the **Branch-to-branch flag** is enabled and BGP is supported in VPN and ExpressRoute connections. This flag can be located in the Azure Virtual WAN settings in Azure portal. All route management is provided by the virtual hub router, which also enables transit connectivity between virtual networks.

### <a name="routing"></a>Custom Routing

Virtual WAN provides advanced routing enhancements. Ability to set up custom route tables, optimize virtual network routing with route association and propagation, logically group route tables with labels and simplify numerous network virtual appliance (NVA) or shared services routing scenarios.

### <a name="global"></a>Global VNet peering

Global VNet Peering provides a mechanism to connect two VNets in different regions. In Virtual WAN, virtual network connections connect VNets to virtual hubs. The user does not need to set up global VNet peering explicitly. VNets connected to virtual hub in same region incur VNet peering charges. VNets connected to virtual hub in a different region incur Global VNet peering charges.

### <a name="encryption"></a>ExpressRoute traffic encryption

Azure Virtual WAN provides ability to encrypt your ExpressRoute traffic. The technique provides an encrypted transit between the on-premises networks and Azure virtual networks over ExpressRoute, without going over the public internet or using public IP addresses. For more information, see [IPsec over ExpressRoute for Virtual WAN](vpn-over-expressroute.md).

## <a name="locations"></a>Locations

For location information, see the [Virtual WAN partners and locations](virtual-wan-locations-partners.md) article.

## <a name="route"></a>Route tables for Basic and Standard virtual WANs

Route tables now have features for association and propagation. A pre-existing route table is a route table that does not have these features. If you have pre-existing routes in hub routing and would like to use the new capabilities, consider the following:

* **Standard Virtual WAN Customers with pre-existing routes in virtual hub**:
If you have pre-existing routes in Routing section for the hub in the Azure portal, you will need to first delete them and then attempt creating new route tables (available in the Route Tables section for the hub in Azure portal). It is highly encouraged to do the delete step for all hubs in a Virtual WAN.

* **Basic Virtual WAN Customers with pre-existing routes in virtual hub**:
If you have pre-existing routes in Routing section for the hub in the Azure portal, you will need to first delete them, then **upgrade** your Basic Virtual WAN to Standard Virtual WAN. See [Upgrade a virtual WAN from Basic to Standard](upgrade-virtual-wan.md). It is highly encouraged to do the delete step for all hubs in a Virtual WAN.

## <a name="faq"></a>FAQ

[!INCLUDE [Virtual WAN FAQ](../../includes/virtual-wan-faq-include.md)]

## <a name="new"></a>What's new?

Subscribe to the RSS feed and view the latest Virtual WAN feature updates on the [Azure Updates](https://azure.microsoft.com/updates/?category=networking&query=VIRTUAL%20WAN) page.

## Next steps

[Create a site-to-site connection using Virtual WAN](virtual-wan-site-to-site-portal.md)
