---
title: Create, change, or delete an Azure virtual network | Microsoft Docs
description: Learn how to create, change, or delete a virtual network in Azure.
services: virtual-network
documentationcenter: na
author: jimdial
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/10/2017
ms.author: jdial

---
# Create, change, or delete a virtual network

Learn how to create and delete a virtual network and change settings, like DNS servers and IP address spaces, for an existing virtual network.

A virtual network is a representation of your own network in the cloud. A virtual network is a logical isolation of the Azure cloud that is dedicated to your Azure subscription. For each virtual network that you create, you can:
- Choose an address space to assign. An address space consists of one or more address ranges that are defined by using Classless Inter-Domain Routing (CIDR) notation, like 10.0.0.0/16.
- Choose to use the Azure-provided DNS server, or use your own DNS server. All resources that are connected to the virtual network are assigned this DNS server to resolve names within the virtual network.
- Segment the virtual network into subnets, each with its own address range, within the address space of the virtual network. To learn how to create, change, and delete subnets, see [Add, change, or delete subnets](virtual-network-manage-subnet.md).

This article explains how to create, change, and delete virtual networks by using the Azure Resource Manager deployment model.

## <a name="before"></a>Before you begin

Before you begin the tasks that are described in this article, complete the following prerequisites:

- If you're new to working with virtual networks, we recommend that you review the exercise in [Create your first Azure virtual network](virtual-network-get-started-vnet-subnet.md). This exercise can help you become more familiar with virtual networks.
- To learn about limits for virtual networks, review [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).
- Sign in to the Azure portal, the Azure command-line tool (Azure CLI), or Azure PowerShell by using your Azure account. If you don't have an Azure account, sign up for a [free trial account](https://azure.microsoft.com/free).
- If you plan to use PowerShell commands to complete the tasks described in this article, you must first [install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs?toc=%2fazure%2fvirtual-network%2ftoc.json). Ensure that you have the most recent version of the Azure PowerShell cmdlets installed. To get help for PowerShell commands in the examples, enter `get-help <command> -full`.
- If you plan to use Azure CLI commands to complete the tasks described in this article, you must first [install and configure Azure CLI](/cli/azure/install-azure-cli?toc=%2fazure%2fvirtual-network%2ftoc.json). Ensure that you have the most recent version of Azure CLI installed. To get help with Azure CLI commands, enter `az <command> --help`.


## <a name="create-vnet"></a>Create a virtual network

To create a virtual network:

1. Sign in to the [portal](https://portal.azure.com) with an account that is assigned permissions for the Network Contributor role (at a minimum) for your subscription. To learn more about assigning roles and permissions to accounts, see [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor).
2. Click **New** > **Networking** > **Virtual network**.
3. On the **Virtual network** blade, in the **Select a deployment model** box, leave **Resource Manager** selected, and then click **Create**.
4. On the **Create virtual network** blade, enter or select values for the following settings, then click **Create**:
	- **Name**: The name must be unique in the [resource group](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#resource-group) that you select to create the virtual network in. You cannot change the name after the virtual network is created. You can create multiple virtual networks over time. For naming suggestions, see [Naming conventions](/azure/architecture/best-practices/naming-conventions.md?toc=%2fazure%2fvirtual-network%2ftoc.json#naming-rules-and-restrictions). Following a naming convention can help make it easier to manage multiple virtual networks.
	- **Address space**: Specify the address space in CIDR notation. The address space you define can be public or private (RFC 1918). Whether you define the address space as public or private, the address space is reachable only from within the virtual network, from interconnected virtual networks, and from any on-premises networks that you have connected to the virtual network. You cannot add the following address spaces:
		- 224.0.0.0/4 (Multicast)
		- 255.255.255.255/32 (Broadcast)
		- 127.0.0.0/8 (Loopback)
		- 169.254.0.0/16 (Link-local)
		- 168.63.129.16/32 (Internal DNS)

	  Although you can define only one address space when you create the virtual network, you can add more address spaces after the virtual network is created. To learn how to add an address space to an existing virtual network, see [Add or remove an address space](#add-address-spaces) in this article.

	  >[!WARNING]
	  >If a virtual network has address spaces that overlap with another virtual network or on-premises network, the two networks cannot be connected. Before you define an address space, consider whether you might want to connect the virtual network to other virtual networks or on-premises networks in the future.
	  >
	  >

	- **Subnet name**: The subnet name must be unique within the virtual network. You cannot change the subnet name after the subnet is created. The portal requires that you define one subnet when you create a virtual network, even though a virtual network isn't required to have any subnets. In the portal, you can define only one subnet when you create a virtual network. You can add more subnets to the virtual network later, after the virtual network is created. To add a subnet to a virtual network, see [Create a subnet](virtual-network-manage-subnet.md#create-subnet) in [Create, change, or delete subnets](virtual-network-manage-subnet.md). You can create a virtual network that has multiple subnets by using Azure CLI or PowerShell.

	  >[!TIP]
	  >Sometimes, admins create different subnets to filter or control traffic routing between the subnets. Before you define subnets, consider how you might want to filter and route traffic between your subnets. To learn more about filtering traffic between subnets, see [Network security groups](virtual-networks-nsg.md). Azure automatically routes traffic between subnets, but you can override Azure default routes. To learn how to override Azure default subnet traffic routing, see [User-defined routes](virtual-networks-udr-overview.md).
	  >

	- **Subnet address range**: The range must be within the address space you entered for the virtual network. The smallest range you can specify is /29, which provides eight IP addresses for the subnet. Azure reserves the first and last address in each subnet for protocol conformance. Three additional addresses are reserved for Azure service usage. As a result, a virtual network with a subnet address range of /29 has only three usable IP addresses. If you plan to connect a virtual network to a VPN gateway, you must create a gateway subnet. Learn more about [specific address range considerations for gateway subnets](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md?toc=%2fazure%2fvirtual-network%2ftoc.json#a-namegwsubagateway-subnet). You can change the address range after the subnet is created, under specific conditions. To learn how to change a subnet address range, see [Change subnet settings](#change-subnet) in [Add, change, or delete subnets](virtual-network-manage-subnet.md).
	- **Subscription**: Select a [subscription](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#subscription). You cannot use the same virtual network in more than one Azure subscription. However, you can connect a virtual network in one subscription to virtual networks in other subscriptions. To connect virtual networks in different subscriptions, use Azure VPN Gateway or virtual network peering. Any Azure resource that you connect to the virtual network must be in the same subscription as the virtual network.
	- **Resource group**: Select an existing [resource group](../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#resource-groups) or create a new one. An Azure resource that you connect to the virtual network can be in the same resource group as the virtual network or in a different resource group.
	- **Location**: Select an Azure [location](https://azure.microsoft.com/regions/), also known as a region. A virtual network can be in only one Azure location. However, you can connect a virtual network in one location to a virtual network in another location by using a VPN gateway. Any Azure resource that you connect to the virtual network must be in the same location as the virtual network.

**Commands**

|Tool|Command|
|---|---|
|Azure CLI|[az network vnet create](/cli/azure/network/vnet?toc=%2fazure%2fvirtual-network%2ftoc.json#create)|
|PowerShell|[New-AzureRmVirtualNetwork](/powershell/module/azurerm.network/new-azurermvirtualnetwork?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name = "view-vnet"></a>View virtual networks and settings

To view virtual networks and settings:

1. Sign in to the [portal](https://portal.azure.com) with an account that is assigned permissions for the Network Contributor role (at a minimum) for your subscription. To learn more about assigning roles and permissions to accounts, see [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor).
2. In the portal search box, enter **virtual networks**. In the search results, click **Virtual networks**.
3. On the **Virtual networks** blade, click the virtual network that you want to view settings for.
4. The following settings are listed on the blade for the virtual network you selected:
	- **Overview**: Provides information about the virtual network, including address space and DNS servers. The following screenshot shows the overview settings for a virtual network named **MyVNet**:

		![Network interface overview](./media/virtual-network-manage-network/vnet-overview.png)

	  On the **Overview** blade, you can move a virtual network to a different subscription or resource group. To learn how to move a virtual network, see [Move resources to a different resource group or subscription](../azure-resource-manager/resource-group-move-resources.md?toc=%2fazure%2fvirtual-network%2ftoc.json). The article lists prerequisites, and how to move resources by using the Azure portal, PowerShell, and Azure CLI. All resources that are connected to the virtual network must move with the virtual network.
	- **Address space**: The address spaces that are assigned to the virtual network are listed. To learn how to add and remove an address space, complete the steps in [Add or remove an address space](#address-spaces) in this article.
	- **Connected devices**: Any resources that are connected to the virtual network are listed. In the preceding screenshot, three network interfaces and one load balancer are connected to the virtual network. Any new resources that you create and connect to the virtual network are listed. If you delete a resource that was connected to the virtual network, it no longer appears in the list.
	- **Subnets**: A list of subnets that exist within the virtual network is shown. To learn how to add and remove a subnet, see [Create a subnet](virtual-network-manage-subnet.md#create-subnet) and [Delete a subnet](virtual-network-manage-subnet.md#delete-subnet) in [Add, change, or delete subnets](virtual-network-manage-subnet.md).
	- **DNS servers**: You can specify whether the Azure internal DNS server or a custom DNS server provides name resolution for devices that are connected to the virtual network. When you create a virtual network by using the Azure portal, Azure's DNS servers are used for name resolution within a virtual network, by default. To modify the DNS servers, complete the steps in [Add, change, or remove a DNS server](#dns-servers) in this article.
	- **Peerings**: If there are existing peerings in the subscription, they are listed here. You can view settings for existing peerings, or create, change, or delete peerings. To learn more about peerings, see [Virtual network peering](virtual-network-peering-overview.md).
	- **Properties**: Displays settings about the virtual network, including the virtual network's resource ID and the Azure subscription it is in.
	- **Diagram**: The diagram provides a visual representation of all devices that are connected to the virtual network. The diagram has some key information about the devices. To manage a device in this view, in the diagram, click the device.
	- **Common Azure settings**: To learn more about common Azure settings, see the following information:
		*	[Activity log](../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#activity-logs)
		*	[Access control (IAM)](../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#access-control)
		*	[Tags](../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#tags)
		*	[Locks](../azure-resource-manager/resource-group-lock-resources.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
		*	[Automation script](../azure-resource-manager/resource-manager-export-template.md?toc=%2fazure%2fvirtual-network%2ftoc.json#export-the-template-from-resource-group)

**Commands**

|Tool|Command|
|---|---|
|Azure CLI|[az network vnet show](/cli/azure/network/vnet?toc=%2fazure%2fvirtual-network%2ftoc.json#show)|
|PowerShell|[Get-AzureRmVirtualNetwork](/powershell/resourcemanager/azurerm.network/v3.8.0/get-azurermvirtualnetwork/?toc=%2fazure%2fvirtual-network%2ftoc.json)|


## <a name="add-address-spaces"></a>Add or remove an address space

You can add and remove address spaces for a virtual network. An address space must be specified in CIDR notation, and cannot overlap with other address spaces within the same virtual network. The address spaces you define can be public or private (RFC 1918). Whether you define the address space as public or private, the address space is reachable only from within the virtual network, from interconnected virtual networks, and from any on-premises networks that you have connected to the virtual network. You cannot add the following address spaces:

- 224.0.0.0/4 (Multicast)
- 255.255.255.255/32 (Broadcast)
- 127.0.0.0/8 (Loopback)
- 169.254.0.0/16 (Link-local)
- 168.63.129.16/32 (Internal DNS)

To add or remove an address space:

1. Sign in to the [portal](https://portal.azure.com) with an account that is assigned permissions for the Network Contributor role (at a minimum) for your subscription. To learn more about assigning roles and permissions to accounts, see [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor).
2. In the portal search box, enter **virtual networks**. In the search results, select **Virtual networks**.
3. On the **Virtual networks** blade, click the virtual network for which you want to add or remove an address space.
4. On the virtual network blade, under **SETTINGS**, click **Address space**.
5. On the blade for the address space, complete one of the following options:
	- **Add an address space**: Enter the new address space. The address space cannot overlap with an existing address space that is defined for the virtual network.
	- **Remove an address space**: Right-click an address space, and then click **Remove**. If a subnet exists in the address space, you cannot remove the address space. To remove an address space, you must first delete any subnets (and any resources that are connected to the subnets) that exist in the address space.
6. Click **Save**.

**Commands**

|Tool|Command|
|---|---|
|Azure CLI|Resource Manager only|[az network vnet update](/cli/azure/network/vnet?toc=%2fazure%2fvirtual-network%2ftoc.json#update)|
|PowerShell|[Set-AzureRmVirtualNetwork](/powershell/module/azurerm.network/set-azurermvirtualnetwork?view=azurermps-3.8.0?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="dns-servers"></a>Add, change, or remove a DNS server

All VMs that are connected to the virtual network register with the DNS servers that you specify for the virtual network. They also use the specified DNS server for name resolution. Each network interface (NIC) in a VM can have its own DNS server settings. If a NIC has its own DNS server settings, they override the DNS server settings for the virtual network. To learn more about NIC DNS settings, see [Network interface tasks and settings](virtual-network-network-interface.md#dns). To learn more about name resolution for VMs and role instances in Azure Cloud Services, see [Name resolution for VMs and role instances](virtual-networks-name-resolution-for-vms-and-role-instances.md). To add, change, or remove a DNS server:

1. Sign in to the [portal](https://portal.azure.com) with an account that is assigned permissions for the Network Contributor role (at a minimum) for your subscription. To learn more about assigning roles and permissions to accounts, see [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor).
2. In the portal search box, type **virtual networks**. In the search results, select **Virtual networks**.
3. On the **Virtual networks** blade, click the virtual network you want to change DNS settings for.
4. On the virtual network blade, under **SETTINGS**, click **DNS servers**.
5. Select one of the following options on the blade that lists DNS servers:
	- **Default (Azure-provided)**: All resource names and private IP addresses are automatically registered to the Azure DNS servers. You can resolve names between any resources that are connected to the same virtual network. You cannot use this option to resolve names across virtual networks. To resolve names across virtual networks, you must use a custom DNS server.
	- **Custom**: You can add one or more servers, up to the Azure limit for a virtual network. To learn more about DNS server limits, see [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#virtual-networking-limits-classic). You have the following options:
		- **Add an address**: Adds the server to your virtual network DNS servers list. This option also registers the DNS server with Azure. If you've already registered a DNS server with Azure, you can select that DNS server in the list.
		- **Remove an address**: Next to the server that you want to remove, click **X**. Deleting the server removes the server only from this virtual network list. The DNS server remains registered in Azure for your other virtual networks to use.
		- **Reorder DNS server addresses**: It's important to verify that you list your DNS servers in the correct order for your environment. DNS server lists are used in the order that they are specified. They do not work as a round-robin setup. If the first DNS server in the list can be reached, the client uses that DNS server, regardless of whether the DNS server is functioning properly. Remove all the DNS servers that are listed, and then add them back in the order that you want.
		- **Change an address**: Highlight the DNS server in the list, and then enter the new name.
6. Click **Save**.
7. Restart the VMs that are connected to the virtual network, so they are assigned the new DNS server settings. VMs continue to use their current DNS settings until they are restarted.

**Commands**

|Tool|Command|
|---|---|
|Azure CLI|[az network vnet update](/cli/azure/network/vnet?toc=%2fazure%2fvirtual-network%2ftoc.json#update)|
|PowerShell|[Set-AzureRmVirtualNetwork](/powershell/module/azurerm.network/set-azurermvirtualnetwork?view=azurermps-3.8.0?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="delete-vnet"></a>Delete a virtual network

You can delete a virtual network only if there are no resources connected to it. If there are resources connected to any subnet within the virtual network, you must first delete the resources that are connected to all subnets within the virtual network. The steps you take to delete a resource vary depending on the resource. To learn how to delete resources that are connected to subnets, read the documentation for each resource type you want to delete. To delete a virtual network:

1. Sign in to the [portal](https://portal.azure.com) with an account that is assigned (at a minimum) permissions for the Network Contributor role for your subscription. To learn more about assigning roles and permissions to accounts, see [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor).
2. In the portal search box, enter **virtual networks**. In the search results, click **Virtual networks**.
3. On the **Virtual networks** blade, select the virtual network you want to delete.
4. On the virtual network blade, to confirm that there are no devices connected to the virtual network, under **SETTINGS**, click **Connected devices**. If there are connected devices, you must delete them before you can delete the virtual network. If there are no connected devices, click **Overview**.
5. At the top of the blade, click the **Delete** icon.
6. To confirm the deletion of the virtual network, click **Yes**.


**Commands**

|Tool|Command|
|---|---|
|Azure CLI|[azure network vnet delete](/cli/azure/network/vnet?toc=%2fazure%2fvirtual-network%2ftoc.json#delete)|
|PowerShell|[Remove-AzureRmVirtualNetwork](/powershell/module/azurerm.network/remove-azurermvirtualnetwork?view=azurermps-3.8.0?toc=%2fazure%2fvirtual-network%2ftoc.json)|


## <a name="next-steps"></a>Next steps

- To create a VM and then connect it to a virtual network, see [Create a virtual network and connect VMs](virtual-network-get-started-vnet-subnet.md#a-namecreate-vmsacreate-virtual-machines).
- To filter network traffic between subnets within a virtual network, see [Create network security groups](virtual-networks-create-nsg-arm-pportal.md).
- To peer a virtual network to another virtual network, see [Create a virtual network peering](virtual-network-create-peering.md#a-nameportalacreate-peering---azure-portal).
- To learn about options for connecting a virtual network to an on-premises network, see [About VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%2ftoc.json#a-namediagramsaconnection-topology-diagrams).
