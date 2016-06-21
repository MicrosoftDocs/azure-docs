<properties
	pageTitle="Azure Networking Infrastructure Guidelines"
	description="Learn about the key design and implementation guidelines for deploying virtual networking in Azure infrastructure services."
	documentationCenter=""
	services="virtual-machines-linux"
	authors="iainfoulds"
	manager="timlt"
	editor=""
	tags="azure-service-management,azure-resource-manager"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/20/2016"
	ms.author="iainfou"/>

# Azure Networking Infrastructure Guidelines

[AZURE.INCLUDE [virtual-machines-linux-infrastructure-guidelines-intro](../../includes/virtual-machines-linux-infrastructure-guidelines-intro.md)] This article focuses on understanding the required planning steps for virtual networking within Azure and connectivity between existing on-prem environments.

## Virtual networks

Virtual networks are necessary to support communications between virtual machines (VMs). You can define subnets, custom IP address, DNS settings, security filtering, and load balancing, just as with physical networks. Through the use of a Site-to-Site VPN or Express Route circuit, you can connect Azure virtual networks in to your on-prem networks.

Through the use of Resource Groups, you have flexibility in how you design your virtual networking components. As VMs can connect to virtual networks outside of their own resource group, a common design approach would be to create centralized resource groups that contain your core networking infrastructure that can be managed by a common team, and then VMs and their applications deployed to separate resource groups. This allows application owners access to the resource group that contains their VMs without opening up access to the configuration of the wider virtual networking resources.

## Site connectivity
If on-premises users and computers do not require ongoing connectivity to VMs in an Azure virtual network, your virtual network design will be pretty straight forward:

![](./media/virtual-machines-common-infrastructure-service-guidelines/vnet01.png)

This is typically for Internet-facing workloads, such as an Internet-based web server. You can manage these VMs using SSH or point-to-site VPN connections.

Because they do not connect to your on-premises network, Azure-only virtual networks can use any portion of the private IP address space, even if the same private space is in use on-premises.

If on-premises users and computers require ongoing connectivity to VMs in an Azure virtual network, create a cross-premises virtual network and connect it to your on-premises network with an ExpressRoute or site-to-site VPN connection.

![](./media/virtual-machines-common-infrastructure-service-guidelines/vnet02.png)

In this configuration, the Azure virtual network is essentially a cloud-based extension of your on-premises network.

Because they connect to your on-premises network, cross-premises virtual networks must use a portion of the address space used by your organization that is unique. In the same way that different corporate locations will be assigned a specific IP subnet, Azure becomes another location as you extend out your network.

To allow packets to travel from your cross-premises virtual network to your on-premises network, you must configure the set of relevant on-premises address prefixes as part of the local network definition for the virtual network. Depending on the address space of the virtual network and the set of relevant on-premises locations, there can be many address prefixes in the local network.

You can convert a cloud-only virtual network to a cross-premises virtual network, but it will most likely require you to re-IP your virtual network address space, your subnets, and the VMs that use static Azure IP addresses. Therefore, carefully consider if a virtual network will need to be connected to your on-premises network when you assign an IP subnet.

## Subnets
Subnets allow you to organize resources that are related, either logically (for example, one subnet for VMs associated to the same application), or physically (for example, one subnet per resource group), or to employ subnet isolation techniques for added security.

For cross-premises virtual networks, you should design subnets with the same conventions that you use for on-premises resources, keeping in mind that **Azure always uses the first three IP addresses of the address space for each subnet**. To determine the number of addresses needed for the subnet, count the number of VMs that you need now, estimate for future growth, and then use the following table to determine the size of the subnet.

Number of VMs needed | Number of host bits needed | Size of the subnet
--- | --- | ---
1–3 | 3 | /29
4–11	 | 4 | /28
12–27 | 5 | /27
28–59 | 6 | /26
60–123 | 7 | /25

> [AZURE.NOTE] For normal on-premises subnets, the maximum number of host addresses for a subnet with n host bits is 2<sup>n</sup> – 2. For an Azure subnet, the maximum number of host addresses for a subnet with n host bits is 2<sup>n</sup> – 5 (2 plus 3 for the addresses that Azure uses on each subnet).

If you choose a subnet size that is too small, you will have to re-IP and redeploy the VMs in the subnet.

## Implementation guidelines recap for virtual networks

Decisions:

- What type of virtual network do you need to host your IT workload or infrastructure (cloud-only or cross-premises)?
- For cross-premises virtual networks, how much address space do you need to host the subnets and VMs now and for reasonable expansion in the future?
- Are you going to create centralized virtual networks or create individual virtual networks for each resource group?

Tasks:

- Define the address space for the virtual networks to be created.
- Define the set of subnets and the address space for each.
- For cross-premises virtual networks, define the set of local network address spaces for the on-premises locations that the VMs in the virtual network need to reach.
- Work with on-premises networking team to ensure the appropriate routing is configured when creating cross-premises virtual networks.
- Create the virtual network using your naming convention using the Azure CLI or portal.

## Next steps

Now that you have read about virtual networking you can read up on the guidelines for other Azure services.

* [Azure Availability Set Guidelines](availability-sets-guidelines.md)
* [Azure Cloud Services Infrastructure Guidelines](virtual-machines-linux-infrastructure-cloud-services-guidelines.md)
* [Azure Subscription and Accounts Guidelines](virtual-machines-linux-infrastructure-subscription-accounts-guidelines.md)
* [Azure Infrastructure Naming Guidelines](virtual-machines-linux-infrastructure-naming-guidelines.md)
* [Azure Virtual Machines Guidelines](virtual-machines-linux-infrastructure-virtual-machine-guidelines.md)
* [Azure Storage Solutions Infrastructure Guidelines](virtual-machines-linux-infrastructure-storage-solutions-guidelines.md)
* [Azure Example Infrastructure Walkthrough](virtual-machines-linux-infrastructure-example.md)

Once you have reviewed the guidelines documents you can move over to the [Azure Concepts section](virtual-machines-linux-azure-overview.md) to start building your new infrastructure on Azure.
