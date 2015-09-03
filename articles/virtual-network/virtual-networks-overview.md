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
   ms.date="08/05/2015"
   ms.author="telmos" />

# Virtual Network Overview

An Azure virtual network (VNet) is a representation of your own network in the cloud. You can control your Azure network settings and define DHCP address blocks, DNS settings, security policies, and routing. You can also further segment your VNet into subnets and deploy Azure IaaS virtual machines (VMs) and PaaS role instances, in the same way you can deploy physical and virtual machines to your on-premises datacenter. In essence, you can expand your network to Azure, bringing your own IP address blocks. 

To better understand VNets, take a look at the figure below, which shows a simplified on-premises network.

![On-premises network](./media/virtual-networks-overview/figure01.png)

The figure above shows an on-premises network connected to the public Internet through a router. You can also see a firewall between the router and a DMZ hosting a DNS server and a web server farm. The web server farm is load balanced using a hardware load balancer that is exposed to the Internet, and consumes resources from the internal subnet. The internal subnet is separated from the DMZ by another firewall, and hosts Active Directory Domain Controller servers, database servers, and application servers.

The same network can be hosted in Azure as shown in the figure below.

![Azure virtual network](./media/virtual-networks-overview/figure02.png)

Notice how the Azure infrastructure takes on the role of the router, allowing access from your VNet to the public Internet without the need of any configuration. Firewalls can be substituted by Network Security Groups (NSGs) applied to each individual subnet. And physical load balancers are substituted by internet facing and internal load balancers in Azure.

## Virtual Networks

VNets provide the following services to IaaS VMs and role PaaS role instances deployed to them:

- **Isolation**. VNets are completely isolated from one another. That allows you to create separate VNets for development, testing, and production that use the same CIDR address blocks.

- **Containment**. VNets cannot span multiple Azure regions. 

    >[AZURE.NOTE] There are two deployment modes in Azure: classic (also known as Service Management) and Azure Resource Manager (ARM). Classic VNets could be added to an affinity group, or created as a regional VNet. If you have a VNet in an affinity group, it is recommended to [migrate it to a regional VNet](./virtual-networks-migrate-to-regional-vnet.md). 

- **Access to the public Internet**. All IaaS VMs and PaaS role instances in a VNet can access the public Internet by default. You can control access by using Network Security Groups (NSGs).

- **Access to VMs within the VNet**. IaaS VMs and PaaS role instances can connect to each other in the same VNet, even if they are in different subnets, without the need to configure a gateway or use public IP addresses, bringing your PaaS and IaaS environments together.

- **Name resolution**. Azure provides internal name resolution for IaaS VMs and PaaS role instances deployed in your VNet. You can also deploy your own DNS servers and configure the VNet to use them.

- **Connectivity**. VNets can be connected to each other, and even to your on-premises datacenter, by using a site-to-site VPN connection, or ExpressRoute connection. To learn more about VPN gateways, visit [About VPN gateways](./vpn-gateway-about-vpngateways.md). To learn more about ExpressRoute, visit [ExpressRoute technical overview](./expressroute-introduction.md).

    >[AZURE.NOTE] Make sure you create a VNet before deploying any IaaS VMs or PaaS role instances to your Azure environment. ARM based VMs require a VNet, and if you do not specify an existing VNet, Azure creates a default VNet that might have a CIDR address block clash with your on-premises network. Making ti impossible for you to connect your VNet to your on-premises network.

## Subnets

You can divide your VNet into multiple subnets for organization and security. Subnets within a VNet can communicate with each other, without any extra configuration. You can also change routing settings at the subnet level, and apply NSGs to subnets.

## IP addresses

There are two types of IP addresses assigned to components in Azure: public and private. IaaS VMs and PaaS role instances deployed to an Azure subnet are automatically assigned a private IP address to each of their NICs based on the CIDR address blocks assigned to your subnets. You can also assign a public IP address to your IaaS VMs and PaaS role instances. 

These IP addresses are dynamic, meaning that they can change at any time. You may want to ensure the IP address for certain services remain the same, at all times. To do so, you can reserve an IP address, making it static.

## Azure load balancers

You can use two types of load balancers in Azure:

- **External load balancer**. You can use an external load balancer to provide high availability for IaaS VMs and PaaS role instances accessed from the public Internet.

- **Internal load balancer**. You can use an internal load balancer to provide high availability for IaaS VMs and PaaS role instances accessed from other services in your VNet.

To learn more about load balancing in Azure, visit [Load balancer overview](../load-balancer-overview.md).

## Network Security Groups (NSG)

You can create NSGs to control inbound and outbound access to network interfaces (NICs), VMs, and subnets. Each NSG contains one or more rules specifying whether or not traffic is approved or denied based on source IP address, source port, destination IP address, and destination port. To learn more about NSGs, visit [What is a Network Security Group](../virtual-networks-nsg.md).

## Virtual appliances

A virtual appliance is just another VM in your VNet that runs a software based appliance function, such as firewall, WAN optimization, or intrusion detection. You can create a route in Azure to route your VNet traffic through a virtual appliance to use its capabilities.

For instance, NSGs can be used to provide security on your VNet. However, NSGs provide layer 4 Access Control List (ACL) to incoming and outgoing packets. If you want to use a layer 7 security model, you need to use a firewall appliance.

Virtual appliances depend on [user defined routes and IP forwarding](../virtual-networks-udr-overview.md).

## Next steps

- [Create a VNet](../virtual-networks-create-a-vnet.md) and subnets.
- [Create a VM in a VNet](../virtual-machines-windows-tutorial.md).
- Learn about [NSGs](../virtual-networks-nsg.md).
- Learn about [load balancers](../load-balancer-overview.md).
- [Reserve an internal IP address](../virtual-networks-reserved-private-ip.md)
- [Reserve a public IP address](../virtual-networks-reserved-public-ip.md).
- Learn about [user defined routes and IP forwarding](virtual-networks-udr-overview.md).
