---
title: Azure Virtual Network | Microsoft Docs
description: Learn about Azure Virtual Network concepts and features.
services: virtual-network
documentationcenter: na
author: jimdial
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 9633de4b-a867-4ddf-be3c-a332edf02e24
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/03/2017
ms.author: jdial

---
# Azure Virtual Network

The Microsoft Azure Virtual Network service enables Azure resources to securely communicate with other in a virtual network. A virtual network is a representation of your own network in the cloud. A virtual network is a logical isolation of the Azure cloud dedicated to your subscription. You can connect virtual networks to other virtual networks, or to your on-premises network. The following picture shows some of the capabilities of the Azure Virtual Network service:

![Network diagram](./media/virtual-networks-overview/virtual-network-overview.png)

To learn more about the following Azure Virtual Network capabilities, click the capability:
- **[Isolation:](#isolation)** Virtual networks are isolated from one another. You can create separate virtual networks for development, testing, and production that use the same CIDR (10.0.0.0/0, for example) address blocks. Conversely, you can create multiple virtual networks that use different CIDR address blocks and connect the networks together. You can segment a virtual network into multiple subnets. Azure provides internal name resolution for virtual machines and Azure Cloud Services role instances deployed in a virtual network. You can optionally configure a virtual network to use your own DNS servers, instead of using Azure internal name resolution.
- **[Internet communication:](#internet)** All Azure Virtual Machines and Cloud Services role instances in a virtual network have access to the Internet, by default. You can also enable inbound access to specific resources, as needed.
- **[Azure resource communication:](#within-vnet)** Azure resources such as Cloud Services and virtual machines can be deployed in the same virtual network. The resources can communicate with each other using private IP addresses, even if they are in different subnets. Azure provides default routing between subnets, VNets, and on-premises networks, so you don't have to configure and manage routes. You can customize Azure's routing though, if desired.
- **[Virtual network connectivity:](#connect-vnets)** Virtual networks can be connected to each other, enabling resources in any virtual network to communicate with resources in any other virtual network.
- **[On-premises connectivity:](#connect-on-premises)** A virtual network can be privately connected to an on-premises network or by using a site-to-site VPN connection over the Internet.
- **[Traffic filtering:](#filtering)** Virtual machines and Cloud Services role instance network traffic can be filtered inbound and outbound by source IP address and port, destination IP address and port, and protocol.
- **[Routing:](#routing)** You can optionally override Azure's default routing by configuring your own routes, or by propagating BGP routes through a network gateway.

## <a name = "isolation"></a>Network isolation and segmentation

You can implement multiple virtual networks within each Azure [subscription](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#subscription) and Azure [region](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#region). Each virtual network is isolated from other virtual networks. For each virtual network you can:
- Specify a custom private IP address space using public and private (RFC 1918) addresses. Azure assigns resources in a virtual network a private IP address from the address space you assign.
- Segment the virtual network into one or more subnets and allocate a portion of the virtual network's address space to each subnet.
- Use Azure-provided name resolution or specify your own DNS server for use by resources in a virtual network. To learn more about name resolution in virtual networks, see [Name resolution for VMs and Cloud Services](virtual-networks-name-resolution-for-vms-and-role-instances.md) article.

## <a name = "internet"></a>Internet communication
All resources in a virtual network can communicate outbound to the Internet, by default. The private IP address of the resource is source network address translated (SNAT) to a public IP address selected by the Azure infrastructure. To learn more about outbound Internet connectivity, read the [Understanding outbound connections in Azure](..\load-balancer\load-balancer-outbound-connections.md?toc=%2fazure%2fvirtual-network%2ftoc.json#standalone-vm-with-no-instance-level-public-ip-address) article. To prevent outbound Internet connectivity, you can implement custom routes or traffic filtering.

To communicate inbound to Azure resources from the Internet, or to communicate outbound to the Internet without SNAT, a resource must be assigned a public IP address. To learn more about public IP addresses, read the [Public IP addresses](virtual-network-public-ip-address.md) article.

## <a name="within-vnet"></a>Secure communication between Azure resources

You can deploy virtual machines within a virtual network. Virtual machines communicate with other resources in a virtual network through a network interface. To learn more about network interfaces, see [Network interfaces](virtual-network-network-interface.md).

You can also deploy several other types of Azure resources to a virtual network, such as Azure Virtual Machines, Azure Cloud Services, Azure App Service Environments, and Azure Virtual Machine Scale Sets. For a complete list of Azure resources you can deploy into a virtual network, see [Virtual network service integration for Azure services](virtual-network-for-azure-services.md).

Some resources can't be deployed into a virtual network, but enable you to restrict communication from resources within a virtual network only. To learn more about how to restrict access to resources, see [Virtual network service endpoints](virtual-network-service-endpoints-overview.md). 

## <a name="connect-vnets"></a>Connect virtual networks

You can connect virtual networks to each other, enabling resources in either virtual network to communicate with each other using virtual network peering. The bandwidth and latency of communication between resources in different virtual networks is the same as if the resources were in the same virtual network. To learn more about peering, read the [Virtual network peering](virtual-network-peering-overview.md) article.

## <a name="connect-on-premises"></a>Connect to an on-premises network

You can connect your on-premises network to a virtual network using any combination of the following options:
- **Point-to-site virtual private network (VPN):** Established between a virtual network and a single PC in your network. Each PC that wants to establish connectivity with a virtual network must configure their connections independently. This connection type is great if you're just getting started with Azure, or for developers, because it requires little or no changes to your existing network. The connection uses the SSTP protocol to provide encrypted communication over the Internet between the PC and a virtual network. The latency for a point-to-site VPN is unpredictable, since the traffic traverses the Internet.
- **Site-to-site VPN:** Established between your VPN device and an Azure VPN Gateway deployed in a virtual network. This connection type enables any on-premises resource you authorize to access a virtual network. The connection is an IPSec/IKE VPN that provides encrypted communication over the Internet between your on-premises device and the Azure VPN gateway. The latency for a site-to-site connection is unpredictable, since the traffic traverses the Internet.
- **Azure ExpressRoute:** Established between your network and Azure, through an ExpressRoute partner. This connection is private. Traffic does not traverse the Internet. The latency for an ExpressRoute connection is predictable, since traffic doesn't traverse the Internet.

To learn more about all the previous connection options, read the [Connection topology diagrams](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%2ftoc.json#diagrams) article.

## <a name="filtering"></a>Filter network traffic
You can filter network traffic between subnets using either or both of the following options:
- **Network security groups:** A network security group can contain multiple inbound and outbound security rules that enable you to filter traffic by source and destination IP address, port, and protocol. You can apply a network security group to each network interface in a virtual machine. You can also apply a network security group to the subnet a network interface, or other Azure resource, is in. To learn more about network security groups, see [Network security groups](security-overview.md#network-security-groups).
- **Network virtual appliances:** A network virtual appliance is a virtual machine running software that performs a network function, such as a firewall. View a list of available network virtual appliances in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking?page=1&subcategories=appliances). Network virtual appliances are also available that provide WAN optimization and other network traffic functions. Network virtual appliances are typically used with user-defined or BGP routes. You can also use a network virtual appliance to filter traffic between virtual networks.

## <a name="routing"></a>Route network traffic

Azure creates route tables that enable resources connected to any subnet in any virtual network to communicate with each other, by default. You can implement either or both of the following options to override the default routes Azure creates:
- **User-defined routes:** You can create custom route tables with routes that control where traffic is routed to for each subnet. To learn more about user-defined routes, see [User-defined routes](virtual-networks-udr-overview.md#user-defined).
- **BGP routes:** If you connect your virtual network to your on-premises network using an Azure VPN Gateway or ExpressRoute connection, you can propagate BGP routes to your virtual networks.

## Pricing

There is no charge for virtual networks, subnets, route tables, or network security groups. Outbound Internet bandwidth usage, public IP addresses, virtual network peering, VPN Gateways, and ExpressRoute each have their own pricing structures. View the [Virtual network](https://azure.microsoft.com/pricing/details/virtual-network), [VPN Gateway](https://azure.microsoft.com/pricing/details/vpn-gateway), and [ExpressRoute](https://azure.microsoft.com/pricing/details/expressroute) pricing pages for more information.

## FAQ

To review frequently asked questions about Azure Virtual Network, see the [Virtual network FAQ](virtual-networks-faq.md) article.


## <a name="next-steps"></a>Next steps

- Create your first virtual network, and deploy a few virtual machines into it, by completing the steps in [Create your first virtual network](virtual-network-get-started-vnet-subnet.md).
- Create a point-to-site connection to a virtual network by completing the steps in [Configure a point-to-site connection](../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json).
- Learn about some of the other key [network capabilities](../networking/networking-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) of Azure.
