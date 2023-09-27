---
title: What is Azure Virtual Network?
description: Learn about Azure Virtual Network concepts and features, including address space, subnets, regions, and subscriptions. 
author: asudbring
# Customer intent: As someone with a basic network background who is new to Azure, I want to understand the capabilities of Azure Virtual Network so that my Azure resources can securely communicate with each other, the internet, and my on-premises resources.
ms.service: virtual-network
ms.topic: overview
ms.date: 05/08/2023
ms.author: allensu
---

# What is Azure Virtual Network?

Azure Virtual Network is a service that provides the fundamental building block for your private network in Azure. An instance of the service (a virtual network) enables many types of Azure resources to securely communicate with each other, the internet, and on-premises networks. These Azure resources include virtual machines (VMs).

A virtual network is similar to a traditional network that you'd operate in your own datacenter. But it brings extra benefits of the Azure infrastructure, such as scale, availability, and isolation.

## Why use an Azure virtual network?

Key scenarios that you can accomplish with a virtual network include:

- Communication of Azure resources with the internet.

- Communication between Azure resources.

- Communication with on-premises resources.

- Filtering of network traffic.

- Routing of network traffic.

- Integration with Azure services.

### Communicate with the internet

All resources in a virtual network can communicate outbound with the internet, by default. You can also use a [public IP address](./ip-services/virtual-network-public-ip-address.md), [NAT gateway](../nat-gateway/nat-overview.md), or [public load balancer](../load-balancer/load-balancer-overview.md) to manage your [outbound connections](../load-balancer/load-balancer-outbound-connections.md). You can communicate inbound with a resource by assigning a public IP address or a public load balancer.

When you're using only an [internal standard load balancer](../load-balancer/load-balancer-overview.md), outbound connectivity is not available until you define how you want outbound connections to work with an instance-level public IP address or a public load balancer.

### Communicate between Azure resources

Azure resources communicate securely with each other in one of the following ways:

- **Virtual network**: You can deploy VMs and other types of Azure resources in a virtual network. Examples of resources include App Service Environments, Azure Kubernetes Service (AKS), and Azure Virtual Machine Scale Sets. To view a complete list of Azure resources that you can deploy in a virtual network, see [Deploy dedicated Azure services into virtual networks](virtual-network-for-azure-services.md).

- **Virtual network service endpoint**: You can extend your virtual network's private address space and the identity of your virtual network to Azure service resources over a direct connection. Examples of resources include Azure Storage accounts and Azure SQL Database. Service endpoints allow you to secure your critical Azure service resources to only a virtual network. To learn more, see [Virtual network service endpoints](virtual-network-service-endpoints-overview.md).

- **Virtual network peering**: You can connect virtual networks to each other by using virtual peering. The resources in either virtual network can then communicate with each other. The virtual networks that you connect can be in the same, or different, Azure regions. To learn more, see [Virtual network peering](virtual-network-peering-overview.md).

### Communicate with on-premises resources

You can connect your on-premises computers and networks to a virtual network by using any of the following options:

- **Point-to-site virtual private network (VPN)**: Established between a virtual network and a single computer in your network. Each computer that wants to establish connectivity with a virtual network must configure its connection. This connection type is useful if you're just getting started with Azure, or for developers, because it requires few or no changes to an existing network. The communication between your computer and a virtual network is sent through an encrypted tunnel over the internet. To learn more, see [About point-to-site VPN](../vpn-gateway/point-to-site-about.md?toc=/azure/virtual-network/toc.json#).

- **Site-to-site VPN**: Established between your on-premises VPN device and an Azure VPN gateway that's deployed in a virtual network. This connection type enables any on-premises resource that you authorize to access a virtual network. The communication between your on-premises VPN device and an Azure VPN gateway is sent through an encrypted tunnel over the internet. To learn more, see [Site-to-site VPN](../vpn-gateway/design.md?toc=/azure/virtual-network/toc.json#s2smulti).

- **Azure ExpressRoute**: Established between your network and Azure, through an ExpressRoute partner. This connection is private. Traffic doesn't go over the internet. To learn more, see [What is Azure ExpressRoute?](../expressroute/expressroute-introduction.md?toc=/azure/virtual-network/toc.json).

### Filter network traffic

You can filter network traffic between subnets by using either or both of the following options:

- **Network security groups**: Network security groups and application security groups can contain multiple inbound and outbound security rules. These rules enable you to filter traffic to and from resources by source and destination IP address, port, and protocol. To learn more, see [Network security groups](./network-security-groups-overview.md) and [Application security groups](./application-security-groups.md).

- **Network virtual appliances**: A network virtual appliance is a VM that performs a network function, such as a firewall or WAN optimization. To view a list of available network virtual appliances that you can deploy in a virtual network, go to [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking?page=1&subcategories=appliances).

### Route network traffic

Azure routes traffic between subnets, connected virtual networks, on-premises networks, and the internet, by default. You can implement either or both of the following options to override the default routes that Azure creates:

- **Route tables**: You can create [custom route tables](virtual-networks-udr-overview.md#user-defined) that control where traffic is routed to for each subnet.

- **Border gateway protocol (BGP) routes**: If you connect your virtual network to your on-premises network by using an [Azure VPN gateway](../vpn-gateway/vpn-gateway-bgp-overview.md?toc=/azure/virtual-network/toc.json) or an [ExpressRoute](../expressroute/expressroute-routing.md?toc=/azure/virtual-network/toc.json#dynamic-route-exchange) connection, you can propagate your on-premises BGP routes to your virtual networks.

### Integrate with Azure services

Integrating Azure services with an Azure virtual network enables private access to the service from virtual machines or compute resources in the virtual network. You can use the following options for this integration:

- Deploy [dedicated instances of the service](virtual-network-for-azure-services.md) into a virtual network. The services can then be privately accessed within the virtual network and from on-premises networks.

- Use [Azure Private Link](../private-link/private-link-overview.md) to privately access a specific instance of the service from your virtual network and from on-premises networks.

- Access the service over public endpoints by extending a virtual network to the service, through [service endpoints](virtual-network-service-endpoints-overview.md). Service endpoints allow service resources to be secured to the virtual network.

## Limits

There are limits to the number of Azure resources that you can deploy. Most Azure networking limits are at the maximum values. However, you can [increase certain networking limits](../azure-portal/supportability/networking-quota-requests.md). For more information, see [Networking limits](../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits).

## Virtual networks and availability zones

Virtual networks and subnets span all availability zones in a region. You don't need to divide them by availability zones to accommodate zonal resources. For example, if you configure a zonal VM, you don't have to take into consideration the virtual network when selecting the availability zone for the VM. The same is true for other zonal resources.

## Pricing

There's no charge for using Azure Virtual Network. It's free of cost. Standard charges apply for resources, such as VMs and other products. To learn more, see [Virtual Network pricing](https://azure.microsoft.com/pricing/details/virtual-network/) and the Azure [pricing calculator](https://azure.microsoft.com/pricing/calculator/).

## Next steps

- Learn about [Azure Virtual Network concepts and best practices](concepts-and-best-practices.md).

- Get started with using a virtual network by creating one, deploying a few VMs to it, and communicating between the VMs. To learn how, see the [Use the Azure portal to create a virtual network](quick-create-portal.md) quickstart.

- Follow a training module on designing and implementing core Azure networking infrastructure, including virtual networks: [Introduction to Azure virtual networks](/training/modules/introduction-to-azure-virtual-networks).
