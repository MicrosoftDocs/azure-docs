<properties
   pageTitle="Azure Virtual Network (VNet) Overview"
   description="Learn about virtual networks (VNets) in Azure"
   services="virtual-network"
   documentationCenter="na"
   authors="telmosampaio"
   manager="carolz"
   editor="tysonn" />
<tags
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="08/04/2015"
   ms.author="telmos" />

# Virtual Network Overview

An Azure virtual network (VNet) works similarly to a network implemented in your own datacenter. Each Azure VNet you create must have a set of CIDR address blocks, which can be divided to create subnets. You can deploy Azure virtual machines (VMs) and role instances to a VNet, and connect them to subnets, in the same way you can deploy physical and virtual machines to your on-premises datacenter. 

To better understand VNets, take a look at the figure below, which shows a traditional on premises network.

![On-premises network](./media/virtual-networks-overview/figure01.png)

The figure above shows an on-premises network connected to the public Internet through a router. You can also see a firewall between the router and a DMZ hosting a DNS server and a web server farm. The web server farm is load balanced using a hardware load balancer that is exposed to the Internet, and consumes resources from the internal subnet. The internal subnet is separated from the DMZ by another firewall, and hosts Active Directory Domain Controller servers, database servers, and application servers.

The same network can be hosted in Azure as shown in the figure below.

![Azure virtual network](./media/virtual-networks-overview/figure02.png)

Notice how the Azure infrastructure takes on the role of the router, allowing access from your VNet to the public Internet without the need of any configuration. Firewalls can be substituted by Network Security Groups (NSGs) applied to each individual subnet. And physical load balancers are substituted by internet facing and internal load balancers in Azure.

## Virtual Network

Each VNet you create is completely isolated from other VNets. You can connect a VNet to any other VNet, and even to your on-premises network, as long as the CIDR address blocks used by the VNets are not overlapping. VNets provide the following services to virtual machines (VMs) and role instances deployed to them:

- **Access to the public Internet**. All VMs and role instances in a VNet can access the public Internet. You can control access by using Network Security Groups (NSGs).

- **Access to other VMs and role instances within the VNet**. VMs can connect to other VMs in the same VNet, even if they are in different subnets, without the need to configure a gateway.

- **Name resolution**. Azure provides internal name resolution for VMs and role instances deployed in your VNet. You can also deploy your own DNS servers and configure the VNet to use them.

- **Isolation**. VNets are completely isolated from one another. That allows you to create separate VNets for development, testing, and production that use the same CIDR address blocks.

- **Connectivity**. VNets can be connected to each other, and even to your on premises datacenter, by using a site-to-site VPN connection, or ExpressRoute connection. To learn more about VPN gateways, visit [About VPN gateways](./vpn-gateway-about-vpngateways.md). To learn more about ExpressRoute, visit [ExpressRoute technical overview](./expressroute-introduction.md).

## Subnet

You can divide your VNet into multiple subnets for organization and security. Subnets within a VNet can communicate with each other, without any extra configuration.

## IP addresses

There are two types of IP addresses assigned to components in Azure: public and internal. VMs and role instances deployed to an Azure subnet are automatically assigned an internal IP address to each of their NICs. Internet facing load balancers are assigned a public IP address to allow access from the Internet. 

These IP addresses are dynamic, meaning that they can change at any time. You may want to ensure the IP address for certain services remain teh same, at all times. To do so, you can reserve an IP address, making it static.

## Azure load balancer

You can use two types of load balancers in Azure:

- **External load balancer**. You can use an external load balancer to expose VMs and role instances to the public Internet.

- **Internal load balancer**. You can use an internal load balancer to expose VMs and roles instances to apps and services running inside your VNet.

To learn more about load balancing in Azure, visit [Load balancer overview](../load-balancer-overview.md).

## Network Security Groups

You can create NSGs to control inbound and outbound access to network interfaces (NICs), VMs, and subnets. For instance, in the figure above, you can create an NSG for the front end subnet that allows inbound traffic from the Internet to port 80 for the front end subnet, and all inbound and outbound traffic to the backend subnet. And a separate NSG for the backend subnet that allows all inbound and outbound traffic to the front end subnet. To learn more about NSGs, visit [What is a Network Security Group](../virtual-networks-nsg.md).

## Virtual appliances

A virtual appliance is just another VM in your VNet that runs a software based appliance function, such as firewall, WAN optimization, or intrusion detection. You can create a route in Azure to route your VNet traffic through a virtual appliance to use its capabilities.

For instance, NSGs can be used to provide security on your VNet. However, there are limits on the number of rules an NSG can have, and you do not have access to logging. If you require these types of functionality, you might consider using a firewall appliance.

Virtual appliances depend on [user defined routes and IP forwarding](../virtual-networks-udr-overview.md).

## Next steps

- [Create a VNet](../virtual-networks-create-a-vnet.md) and subnets.
- [Create a VM in a VNet](../virtual-machines-windows-tutorial.md).
- Learn about [NSGs](../virtual-networks-nsg.md).
- Learn about [load balancers](../load-balancer-overview.md).
- [Reserve an internal IP address](../virtual-networks-reserved-private-ip.md)
- [Reserve a pubic IP address](../virtual-networks-reserved-public-ip.md).
- Learn about [user defined routes and IP forwarding](virtual-networks-udr-overview.md).
