---
title: 'Azure Virtual WAN Overview'
description: Learn about Virtual WAN automated scalable branch-to-branch connectivity, available regions, and partners.
author: cherylmc

ms.service: virtual-wan
ms.topic: overview
ms.date: 06/30/2023
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to understand what Virtual WAN is and if it is the right choice for my Azure network.
---

# What is Azure Virtual WAN?

Azure Virtual WAN is a networking service that brings many networking, security, and routing functionalities together to provide a single operational interface. Some of the main features include:

* Branch connectivity (via connectivity automation from Virtual WAN Partner devices such as SD-WAN or VPN CPE).
* Site-to-site VPN connectivity.
* Remote user VPN connectivity (point-to-site).
* Private connectivity (ExpressRoute).
* Intra-cloud connectivity (transitive connectivity for virtual networks).
* VPN ExpressRoute inter-connectivity.
* Routing, Azure Firewall, and encryption for private connectivity.

You don't have to have all of these use cases to start using Virtual WAN. You can get started with just one use case, and then adjust your network as it evolves.

The Virtual WAN architecture is a hub and spoke architecture with scale and performance built in for branches (VPN/SD-WAN devices), users (Azure VPN/OpenVPN/IKEv2 clients), ExpressRoute circuits, and virtual networks. It enables a [global transit network architecture](virtual-wan-global-transit-network-architecture.md), where the cloud hosted network 'hub' enables transitive connectivity between endpoints that may be distributed across different types of 'spokes'.

Azure regions serve as hubs that you can choose to connect to. All hubs are connected in full mesh in a Standard Virtual WAN making it easy for the user to use the Microsoft backbone for any-to-any (any spoke) connectivity.

For spoke connectivity with SD-WAN/VPN devices, users can either manually set it up in Azure Virtual WAN, or use the Virtual WAN CPE (SD-WAN/VPN) partner solution to set up connectivity to Azure. We have a list of partners that support connectivity automation (ability to export the device info into Azure, download the Azure configuration and establish connectivity) with Azure Virtual WAN. For more information, see the [Virtual WAN partners and locations](virtual-wan-locations-partners.md) article.

:::image type="content" source="./media/virtual-wan-about/virtual-wan-diagram.png" alt-text="Virtual WAN diagram." lightbox="./media/virtual-wan-about/virtual-wan-diagram.png":::

 Virtual WAN offers the following advantages:

* **Integrated connectivity solutions in hub and spoke:** Automate site-to-site configuration and connectivity between on-premises sites and an Azure hub.
* **Automated spoke setup and configuration:** Connect your virtual networks and workloads to the Azure hub seamlessly.
* **Intuitive troubleshooting:** You can see the end-to-end flow within Azure, and then use this information to take required actions.

## <a name="architecture"></a>Architecture

For information about Virtual WAN architecture and how to migrate to Virtual WAN, see the following articles:

* [Virtual WAN architecture](migrate-from-hub-spoke-topology.md)
* [Global transit network architecture](virtual-wan-global-transit-network-architecture.md)

## <a name="locations"></a>Available regions and locations

For available regions and locations, see [Virtual WAN partners, regions, and locations](virtual-wan-locations-partners.md).

## <a name="resources"></a>Virtual WAN resources

To configure an end-to-end virtual WAN, you create the following resources:

* **Virtual WAN:** The *virtualWAN* resource represents a virtual overlay of your Azure network and is a collection of multiple resources. It contains links to all your virtual hubs that you would like to have within the virtual WAN. Virtual WANs are isolated from each other and can't contain a common hub. Virtual hubs in different virtual WANs don't communicate with each other.

* **Hub:** A virtual hub is a Microsoft-managed virtual network. The hub contains various service endpoints to enable connectivity. From your on-premises network (vpnsite), you can connect to a VPN gateway inside the virtual hub, connect ExpressRoute circuits to a virtual hub, or even connect mobile users to a point-to-site gateway in the virtual hub. The hub is the core of your network in a region. Multiple virtual hubs can be created in the same region.

  A hub gateway isn't the same as a virtual network gateway that you use for ExpressRoute and VPN Gateway. For example, when using Virtual WAN, you don't create a site-to-site connection from your on-premises site directly to your VNet. Instead, you create a site-to-site connection to the hub. The traffic always goes through the hub gateway. This means that your VNets don't need their own virtual network gateway. Virtual WAN lets your VNets take advantage of scaling easily through the virtual hub and the virtual hub gateway.

* **Hub virtual network connection:** The hub virtual network connection resource is used to connect the hub seamlessly to your virtual network. One virtual network can be connected to only one virtual hub.

* **Hub-to-hub connection:** Hubs are all connected to each other in a virtual WAN. This implies that a branch, user, or VNet connected to a local hub can communicate with another branch or VNet using the full mesh architecture of the connected hubs. You can also connect VNets within a hub transiting through the virtual hub, as well as VNets across hub, using the hub-to-hub connected framework.

* **Hub route table:** You can create a virtual hub route and apply the route to the virtual hub route table. You can apply multiple routes to the virtual hub route table.

**Additional Virtual WAN resources**

* **Site:** This resource is used for site-to-site connections only. The site resource is **vpnsite**. It represents your on-premises VPN device and its settings. By working with a Virtual WAN partner, you have a built-in solution to automatically export this information to Azure.

## <a name="basicstandard"></a>Virtual WAN types

There are two types of virtual WANs: Basic and Standard. The following table shows the available configurations for each type.

[!INCLUDE [Basic and Standard SKUs](../../includes/virtual-wan-standard-basic-include.md)]

For steps to upgrade a virtual WAN, see [Upgrade a virtual WAN from Basic to Standard](upgrade-virtual-wan.md).

## <a name="connectivity"></a>Connectivity

### <a name="s2s"></a>Site-to-site VPN connections

You can connect to your resources in Azure over a site-to-site IPsec/IKE (IKEv2) connection. For more information, see [Create a site-to-site connection using Virtual WAN](virtual-wan-site-to-site-portal.md).

This type of connection requires a VPN device or a Virtual WAN Partner device. Virtual WAN partners provide automation for connectivity, which is the ability to export the device info into Azure, download the Azure configuration, and establish connectivity to the Azure Virtual WAN hub. For a list of the available partners and locations, see the [Virtual WAN partners, regions, and locations](virtual-wan-locations-partners.md) article. If your VPN/SD-WAN device provider isn't listed in the mentioned link, use the step-by-step instructions in the [Create a site-to-site connection using Virtual WAN](virtual-wan-site-to-site-portal.md) article to set up the connection.

### <a name="uservpn"></a>User VPN (point-to-site) connections

You can connect to your resources in Azure over an IPsec/IKE (IKEv2) or OpenVPN connection. This type of connection requires a VPN client to be configured on the client computer. For more information, see [Create a point-to-site connection](virtual-wan-point-to-site-portal.md).

### <a name="er"></a>ExpressRoute connections

ExpressRoute lets you connect on-premises network to Azure over a private connection. To create the connection, see [Create an ExpressRoute connection using Virtual WAN](virtual-wan-expressroute-portal.md).

#### <a name="encryption"></a>ExpressRoute traffic encryption

Azure Virtual WAN provides the ability to encrypt your ExpressRoute traffic. The technique provides an encrypted transit between the on-premises networks and Azure virtual networks over ExpressRoute, without going over the public internet or using public IP addresses. For more information, see [IPsec over ExpressRoute for Virtual WAN](vpn-over-expressroute.md).

### <a name="hub"></a>Hub-to-VNet connections

You can connect an Azure virtual network to a virtual hub. For more information, see [Connect your VNet to a hub](virtual-wan-site-to-site-portal.md#vnet).

### <a name="transit"></a>Transit connectivity

#### <a name="transit-vnet"></a>Transit connectivity between VNets

Virtual WAN allows transit connectivity between VNets. VNets connect to a virtual hub via a virtual network connection. Transit connectivity between the VNets in **Standard Virtual WAN** is enabled due to the presence of a router in every virtual hub. This router is instantiated when the virtual hub is first created.

[!INCLUDE [virtual hub router status](../../includes/virtual-wan-hub-router-status.md)]

Every virtual hub router supports an aggregate throughput up to 50 Gbps.

Connectivity between the virtual network connections assumes, by default, a maximum total of 2000 VM workload across all VNets connected to a single virtual hub. **Hub infrastructure units** can be adjusted to support additional VMs. For more information about hub infrastructure units, see [Hub settings](hub-settings.md).

#### <a name="transit-er"></a>Transit connectivity between VPN and ExpressRoute

Virtual WAN allows transit connectivity between VPN and ExpressRoute. This implies that VPN-connected sites or remote users can communicate with ExpressRoute-connected sites. There is also an implicit assumption that the **Branch-to-branch flag** is enabled and BGP is supported in VPN and ExpressRoute connections. This flag can be located in the Azure Virtual WAN settings in Azure portal. All route management is provided by the virtual hub router, which also enables transit connectivity between virtual networks.

### <a name="routing"></a>Custom routing

Virtual WAN provides advanced routing enhancements. Ability to set up custom route tables, optimize virtual network routing with route association and propagation, logically group route tables with labels and simplify numerous network virtual appliances (NVAs) or shared services routing scenarios.

### <a name="global"></a>Global VNet peering

Global VNet Peering provides a mechanism to connect two VNets in different regions. In Virtual WAN, virtual network connections connect VNets to virtual hubs. The user doesn't need to set up global VNet peering explicitly. VNets connected to virtual hub in same region incur VNet peering charges. VNets connected to virtual hub in a different region incur Global VNet peering charges.

## <a name="route"></a>Route tables

Route tables now have features for association and propagation. A pre-existing route table is a route table that doesn't have these features. If you have pre-existing routes in hub routing and would like to use the new capabilities, consider the following:

* **Standard Virtual WAN Customers with pre-existing routes in virtual hub**:
If you have pre-existing routes in the Routing section for the hub in the Azure portal, you'll need to first delete them and then attempt creating new route tables (available in the Route Tables section for the hub in Azure portal). It's best to perform the delete step for all hubs in a virtual WAN.

* **Basic Virtual WAN Customers with pre-existing routes in virtual hub**:
If you have pre-existing routes in Routing section for the hub in the Azure portal, you'll need to first delete them, then **upgrade** your Basic Virtual WAN to Standard Virtual WAN. See [Upgrade a virtual WAN from Basic to Standard](upgrade-virtual-wan.md). It's best to perform the delete step for all hubs in a virtual WAN.

## <a name="faq"></a>FAQ

For frequently asked questions, see the [Virtual WAN FAQ](virtual-wan-faq.md).

## <a name="new"></a>Previews and What's new?

* For information about recent releases, previews underway, preview limitations, known issues, and deprecated functionality, see [What's new?](whats-new.md)
* Subscribe to the RSS feed and view the latest Virtual WAN feature updates on the [Azure Updates - Virtual WAN](https://azure.microsoft.com/updates/?category=networking&query=VIRTUAL%20WAN) page.

## Next steps

* [Tutorial: Create a site-to-site connection using Virtual WAN](virtual-wan-site-to-site-portal.md)

* [Learn module: Introduction to Azure Virtual WAN](/training/modules/introduction-azure-virtual-wan/)
