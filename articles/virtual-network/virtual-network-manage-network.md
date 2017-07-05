---
title: Create, change, or delete Azure virtual networks | Microsoft Docs
description: Learn how to create, change, or delete virtual networks.
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
# Create, change, or delete virtual networks

Learn how to create and delete virtual networks (VNet) and change settings such as DNS servers and IP address spaces for existing VNets. A VNet is a representation of your own network in the cloud. A VNet is a logical isolation of the Azure cloud dedicated to your subscription. For each VNet you can:
- Choose which address space to assign. An address space consists of one or more address ranges defined using CIDR notation, such as 10.0.0.0/16.
- Choose to use the Azure-provided DNS server, or your own DNS server, for each VNet. All resources connected to the VNet are assigned this DNS server to resolve names within the VNet.
- Segment the VNet into subnets, each with their own address range, within the address space of the VNet. To learn how to create, change, and delete subnets, read the [Add, change, or delete subnets](virtual-network-manage-subnet.md) article.

This article explains how to create, change, and delete VNets created through the Azure Resource Manager deployment model.
 
## <a name="before"></a>Before you begin

Complete the following tasks before completing steps in any section of this article:

- If you're new to VNets, we recommend completing the exercise in the [Create your first Azure Virtual Network](virtual-network-get-started-vnet-subnet.md) before reading this article. The exercise helps familiarize you with VNets.
- Review the [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) article to learn about limits for VNets.
- Log in to the Azure portal, Azure command-line interface (CLI), or Azure PowerShell with an Azure account. If you don't already have an Azure account, sign up for a [free trial account](https://azure.microsoft.com/free).
- If you use Azure PowerShell commands to complete tasks in this article, first you must [install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs?toc=%2fazure%2fvirtual-network%2ftoc.json). Ensure you have the most recent version of the Azure PowerShell cmdlets installed. To get help for PowerShell commands, with examples, type `get-help <command> -full`.
- If you use Azure Command-line interface (CLI) commands to complete tasks in this article, first you must [install and configure the Azure CLI](/cli/azure/install-azure-cli?toc=%2fazure%2fvirtual-network%2ftoc.json). Ensure you have the most recent version of the Azure CLI installed. To get help for CLI commands, type `az <command> --help`.


## <a name="create-vnet"></a>Create a virtual network

1. Log in to the [portal](https://portal.azure.com) with an account that is assigned (at a minimum) permissions for the Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles and permissions to accounts.
2. In the Azure portal, click **+ New**. In the **New** blade that appears, click **Networking**. In the **Networking** blade that appears, click **Virtual network.**
3. In the **Virtual network** blade that appears, leave *Resource Manager* selected in the **Select a deployment model** box, and click **Create**.
4. In the **Create virtual network** blade that appears, enter, or select values for the following settings, then click **Create**:
	- **Name**: The name must be unique with the [resource group](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#resource-group) you select to create the VNet in. The name cannot be changed after the VNet is created. You may create multiple VNets over time. Read the [Naming conventions](/azure/architecture/best-practices/naming-conventions?toc=%2fazure%2fvirtual-network%2ftoc.json#naming-rules-and-restrictions) article for naming suggestions to make it easier to manage multiple VNets.
	- **Address space**: Specify in CIDR notation. The address space you define can be public or private (RFC 1918). Whether you define a public or private address space, the address space is only reachable from within the VNet, interconnected VNets, and any on-premises networks you have connected to the VNet. You cannot add the following address spaces:
		- 224.0.0.0/4 (Multicast)
		- 255.255.255.255/32 (Broadcast)
		- 127.0.0.0/8 (Loopback)
		- 169.254.0.0/16 (Link-local)
		- 168.63.129.16/32 (Internal DNS)
	
	  Though you can only define one address space when creating the VNet, you can add additional address spaces after the VNet is created. To learn how, complete the steps in the [Add-remove address spaces](#add-address-spaces) section of this article.

	  >[!WARNING]
	  >If VNets have overlapping address spaces with other VNets or on-premises networks, they can't be connected together. Consider other VNets or on-premises networks you may want to connect the VNet to in the future before defining an address space.
	  >
	  >
	
	- **Subnet name:** The name must be unique within the VNet. The name cannot be changed after the subnet is created. The portal requires that you define one subnet when creating a VNet, even though a VNet isn't required to have any subnets. The portal only allows you to define one subnet when creating the VNet, though you can add additional subnets to the VNet you create after the VNet is created. To add a subnet to a VNet, read the [Create subnet](virtual-network-manage-subnet.md#create-subnet) section of the [Create, change, or delete subnets](virtual-network-manage-subnet.md) article. You can create a VNet with multiple subnets using the CLI or PowerShell.

	  >[!TIP]
	  >Different subnets are often created to filter or control traffic routing between them. Before defining subnets, consider how you may want to filter and route traffic between subnets. To learn more about filtering traffic between subnets, read the [Network security groups](virtual-networks-nsg.md) article. Azure routes between subnets automatically, but you can override Azure's default routes. To learn how, read the [User-defined routes](virtual-networks-udr-overview.md) article.
	  >

	- **Subnet address range:** Must be within the **Address space** you entered for the VNet. The smallest range you can specify is /29, which provides eight IP addresses for the subnet. Azure reserves the first and last address in each subnet for protocol conformance. Three additional addresses are reserved for Azure service usage. As a result, a VNet with a subnet address range of /29 only has three usable IP addresses. If you ever plan to connect a VNet to a VPN Gateway, a gateway subnet must be created. Learn more about [specific address range considerations for gateway subnets](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md?toc=%2fazure%2fvirtual-network%2ftoc.json#a-namegwsubagateway-subnet). You can change the address range after the subnet is created, under specific conditions. To learn how to change a subnet address range, read the [Change subnet](#change-subnet) section of the [Add, change, or delete subnets](virtual-network-manage-subnet.md) article.
	- **Subscription:** Select a [subscription](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#subscription). A VNet cannot span subscriptions, though it can be connected to VNets in other subscriptions using an Azure VPN Gateway or VNet peering. Azure resources that you connect to the VNet must exist in the same subscription.
	- **Resource group:** Select an existing [resource group](../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#resource-groups) or create a new one. Azure resources you connect to the VNet can exist in the same or different resource groups.
	- **Location:** Select an Azure [location](https://azure.microsoft.com/regions/), also referred to as a region. A VNet cannot span Azure locations, though a VNet in one location can be connected to a VNet in another location using an Azure VPN Gateway. Azure resources that you connect to the VNet must exist in the same location.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az network vnet create](/cli/azure/network/vnet?toc=%2fazure%2fvirtual-network%2ftoc.json#create)|
|PowerShell|[New-AzureRmVirtualNetwork](/powershell/module/azurerm.network/new-azurermvirtualnetwork?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name = "view-vnet"></a>View virtual networks and settings

1. Log in to the [portal](https://portal.azure.com) with an account that is assigned (at a minimum) permissions for the Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles and permissions to accounts.
2. In the box that contains the text *Search resources* at the top of the portal, type *virtual networks*. When **Virtual networks** appears in the search results, click it.
3. In the **Virtual networks** blade that appears, click the VNet you want to view settings for.
4. The following settings are listed in the blade that appears for the VNet you selected:
	- **Overview:** Provides information about the VNet, such as its address space and DNS servers. The following picture shows the overview settings for a VNet named **MyVNet**:
	
		![Network interface overview](./media/virtual-network-manage-network/vnet-overview.png)

	  You can move a VNet to a different subscription or resource group from this blade. To learn how to move a VNet, read the [Move resources to a different resource group or subscription](../azure-resource-manager/resource-group-move-resources.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article. The article lists prerequisites, and how to move resources using the Azure portal, PowerShell, and the Azure CLI. All resources connected to the VNet must also move with the VNet. 
	- **Address space:** The address spaces assigned to the VNet are listed. To learn how to add and remove address spaces, complete the steps in the [Add-remove address spaces](#address-spaces) section of this article.
	- **Connected devices:** Any resources connected to the VNet are displayed. In the example shown in the previous picture, three network interfaces and one load balancer are connected to the VNet. Any new resources you create and connect to the VNet are listed. If you delete a resource connected to the VNet, it's no longer displayed in the list.
	- **Subnets:** A list of subnets that exist within the VNet. To learn how to add and remove subnets, read the [Add subnet](virtual-network-manage-subnet.md#create-subnet) and [Delete subnet](virtual-network-manage-subnet.md#delete-subnet) sections of the [Add, change, or delete subnets](virtual-network-manage-subnet.md) article.
	- **DNS servers:** You can specify whether the Azure internal DNS server or custom DNS server provides name resolution for devices connected to the VNet. When creating a VNet using the Azure portal, Azure's DNS servers are used for name resolution within a VNet, by default. To modify the DNS servers, complete the steps in the [Add-change-remove DNS servers](#dns-servers) section of this article. 
	- **Peerings:** If there are existing peerings in the subscription, they're listed here. You can view settings for existing peerings, or create, change, or delete peerings. To learn more about peerings, read the [Peering overview](virtual-network-peering-overview.md) article.
	- **Properties:** Displays settings about the VNet, including the VNet's resource ID and the subscription it exists in.
	- **Diagram:** The diagram provides a visual representation of all devices connected to the VNet with some key information about the devices. You can click any of the devices to manage it directly through this view.
	- **Common Azure settings:**  To learn more about common Azure settings, read the [Activity log](../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#activity-logs), [Access control (IAM)](../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#access-control), [Tags](../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#tags), [Locks](../azure-resource-manager/resource-group-lock-resources.md?toc=%2fazure%2fvirtual-network%2ftoc.json), and [Automation script](../azure-resource-manager/resource-manager-export-template.md?toc=%2fazure%2fvirtual-network%2ftoc.json#export-the-template-from-resource-group) articles.

**Commands**

|**Tool**|**Command**|
|---|---|
|CLI|[az network vnet show](/cli/azure/network/vnet?toc=%2fazure%2fvirtual-network%2ftoc.json#show)|
|PowerShell|[Get-AzureRmVirtualNetwork](/powershell/resourcemanager/azurerm.network/v3.8.0/get-azurermvirtualnetwork/?toc=%2fazure%2fvirtual-network%2ftoc.json)|


## <a name="address-spaces"></a>Add-remove address spaces

You can add address spaces to and remove address spaces from a VNet. The address spaces must be specified in CIDR notation, and cannot overlap within the same VNet. The address spaces you define can be public or private (RFC 1918). Whether you define public or private address spaces, the address spaces within a VNet are only reachable from within the VNet, interconnected VNets, and any on-premises networks you have connected to the VNet. You cannot add the following address spaces:
	- 224.0.0.0/4 (Multicast)
	- 255.255.255.255/32 (Broadcast)
	- 127.0.0.0/8 (Loopback)
	- 169.254.0.0/16 (Link-local)
	- 168.63.129.16/32 (Internal DNS)

1. Log in to the [portal](https://portal.azure.com) with an account that is assigned (at a minimum) permissions for the Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles and permissions to accounts.
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *virtual networks*. When **Virtual networks** appears in the search results, click it.
3. In the **Virtual networks** blade that appears, click the virtual network you want to add or remove an address space to or from.
4. In the blade that appears for the VNet you selected, click **Address space** in the **SETTINGS** section.
5. Complete one of the following options in the blade that appears with address spaces:
	- **Add an address space:** Enter the new address space in the box. **Note:** The address space cannot overlap with an existing address space defined for the VNet.
	- **Remove an address space:** Right-click an address space, then click **Remove**. If a subnet exists in the address space, you cannot remove the address space. Before you can remove an address space, any subnets that exist in the address space (and any resources connected to the subnets), must be deleted.
6. Click **Save**.

**Commands**

|Tool|Command|
|---|---|
|CLI|Resource Manager only|[az network vnet update](/cli/azure/network/vnet?toc=%2fazure%2fvirtual-network%2ftoc.json#update)|
|PowerShell|[Set-AzureRmVirtualNetwork](/powershell/module/azurerm.network/set-azurermvirtualnetwork?view=azurermps-3.8.0?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="dns-servers"></a>Add-change-remove DNS servers

All VMs connected to the VNet register with the DNS servers specified for the VNet and use the DNS server for name resolution. Each network interface (NIC) in a VM can have its own DNS server settings. If a NIC has its own DNS server settings, they override the DNS server settings for the VNet. To learn more about NIC DNS settings, read the [Network interface tasks and settings](virtual-network-network-interface.md#dns) article. To learn more about name resolution for VMs and Cloud Services role instances, read the [Name resolution for VMs and role instances](virtual-networks-name-resolution-for-vms-and-role-instances.md) article.

1. Log in to the [portal](https://portal.azure.com) with an account that is assigned (at a minimum) permissions for the Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles and permissions to accounts.
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *virtual networks*. When **Virtual networks** appears in the search results, click it. 
3. In the **Virtual networks** blade that appears, click the virtual network you want to change DNS settings for.
4. In the blade that appears for the VNet you selected, click **DNS servers** in the **SETTINGS** section.
5. Select one of the following options in the blade that appears with DNS servers:
	- **Default (Azure-provided):** All resource names and private IP addresses are automatically registered to the Azure DNS servers. You can resolve names between any resources connected to the same VNet. You cannot use this option to resolve names across VNets. To resolve names across VNets, you must use a custom DNS server.
	- **Custom:** You can add one or more servers, up to the Azure limit for a VNet. To learn more about DNS server limits, read the [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#virtual-networking-limits-classic) article. You have the following options:
		- **Add an address:** Adds the server to your virtual network DNS Servers list and also registers the DNS server with Azure. If you previously registered a DNS server with Azure, you can select it from the list that appears. 
		- **Remove an address:** Click the **X** next to the server you want to remove. Deleting the server only removes it from this VNet list. The DNS server remains registered in Azure for your other VNets to use. 
		- **Reorder DNS server addresses**: It's important to verify that you list your DNS servers in the correct order for your environment. DNS server lists do not work round-robin. They are used in the order that they are specified. If the first DNS server in the list can be reached, the client uses that DNS server, regardless of whether the DNS server is functioning properly or not. Remove all the DNS servers that are listed, and then add them back in the order that you want.
		- **Change an address**: Highlight the DNS server in the list, then type the new name.
6. Click **Save**.
7. Restart the VMs connected to the VNet so they're assigned the new DNS server settings. VMs continue to use their current DNS settings until they are restarted.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az network vnet update](/cli/azure/network/vnet?toc=%2fazure%2fvirtual-network%2ftoc.json#update)|
|PowerShell|[Set-AzureRmVirtualNetwork](/powershell/module/azurerm.network/set-azurermvirtualnetwork?view=azurermps-3.8.0?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="delete-vnet"></a>Delete a virtual network

You can only delete a VNet if there are no resources connected to it. If there are resources connected to any subnet within the VNet, you must first delete the resources connected to all subnets within the VNet. The instructions for how to delete a resource vary depending upon the resource. To learn how to delete resources connected to subnets, read the documentation for each resource type you want to delete. To delete a VNet, complete the following steps:

1. Log in to the [portal](https://portal.azure.com) with an account that is assigned (at a minimum) permissions for the Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles and permissions to accounts.
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *virtual networks*. When **virtual networks** appears in the search results, click it.
3. In the **Virtual networks** blade that appeared, click the VNet you want to delete.
4. Confirm there are no devices connected to the VNet by clicking **Connected devices** in the **SETTINGS** section of the blade that appeared for the VNet you selected. If there are connected devices, you must first delete them before you can delete the VNet.  If there are no connected devices, click **Overview** in the blade.
5. Click the **Delete** icon at the top of the blade. 
6. Click **Yes** to confirm the deletion of the VNet.


**Commands**

|Tool|Command|
|---|---|
|CLI|[azure network vnet delete](/cli/azure/network/vnet?toc=%2fazure%2fvirtual-network%2ftoc.json#delete)|
|PowerShell|[Remove-AzureRmVirtualNetwork](/powershell/module/azurerm.network/remove-azurermvirtualnetwork?view=azurermps-3.8.0?toc=%2fazure%2fvirtual-network%2ftoc.json)|


## <a name="next-steps"></a>Next steps

- To create a VM and connect it to a VNet, read the [Create a VNet and connect VMs](virtual-network-get-started-vnet-subnet.md#a-namecreate-vmsacreate-virtual-machines) article.
- To filter network traffic between subnets within a VNet, read the [Create network security groups](virtual-networks-create-nsg-arm-pportal.md) article.
- To peer a VNet to another VNet, read the [Create a virtual network peering](virtual-networks-create-vnetpeering-arm-portal.md#peering-vnets-in-the-same-subscription) article.
- To learn about options for connecting a VNet to an on-premises network, read the [About network gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%2ftoc.json#a-namediagramsaconnection-topology-diagrams) article.
