---
title: Create, change, or delete Azure virtual network subnets | Microsoft Docs
description: Learn how to create, change, or delete virtual network subnets.
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
# Create, change, or delete virtual network subnets

Learn how to create, change, or delete virtual network (VNet) subnets. If you're not familiar with VNets, we recommend reading the [Virtual network overview](virtual-networks-overview.md) and [Create, change, or delete virtual networks](virtual-network-manage-network.md) articles before creating, changing, or deleting subnets. Azure resources that can connect to a VNet are connected to a subnet within a VNet. Multiple subnets are typically created within a VNet to:
- **Filter traffic between subnets:** Network security groups (NSG) can be applied to subnets to filter the inbound and outbound network traffic for all resources (such as virtual machines) connected to the VNet. To learn more about how to create NSGs, read the [Create network security groups](virtual-networks-create-nsg-arm-pportal.md) article.
- **Control routing between subnets:** Azure creates default routes so that traffic is automatically routed between subnets. You can override the default Azure routes by creating user-defined routes (UDR). To learn more about UDRs, read the [Create user-defined routes](virtual-network-create-udr-arm-ps.md) article. 

This article explains how to create, change, and delete subnets for VNets created through the Azure Resource Manager deployment model.
 
## <a name="before"></a>Before you begin

Complete the following tasks before completing steps in any section of this article:

- If you're new to VNets and subnets in Azure, we recommend completing the exercise in the [Create your first Azure Virtual Network](virtual-network-get-started-vnet-subnet.md) before reading this article. The exercise helps familiarize you with VNets and subnets.
- Review the [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) article to learn about limits for subnets and VNets.
- Log in to the Azure portal, Azure command-line interface (CLI), or Azure PowerShell with an Azure account. If you don't already have an Azure account, sign up for a [free trial account](https://azure.microsoft.com/free).
- If you use Azure PowerShell commands to complete tasks in this article, first you must [install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs?toc=%2fazure%2fvirtual-network%2ftoc.json). Ensure you have the most recent version of the Azure PowerShell cmdlets installed. To get help for PowerShell commands, with examples, type `get-help <command> -full`.
- If you use Azure Command-line interface (CLI) commands to complete tasks in this article, first you must [install and configure the Azure CLI](/cli/azure/install-azure-cli?toc=%2fazure%2fvirtual-network%2ftoc.json). Ensure you have the most recent version of the Azure CLI installed. To get help for CLI commands, type `az <command> --help`.


## <a name="create-subnet"></a>Create a subnet

1. Log in to the [portal](https://portal.azure.com) with an account that is assigned (at a minimum) permissions for the Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles and permissions to accounts.
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *virtual networks*. When **Virtual networks** appears in the search results, click it.
3. In the **Virtual networks** blade that appears, click the virtual network you want to add a subnet to.
4. In the pane that appears for the virtual network you selected, click **Subnets**.
5. Click **+ Subnet**.
6. In the **Add subnet** blade, enter values for the following parameters:
	- **Name:** The name must be unique within the virtual network.
	- **Address range:** The range must be unique within the address space for the VNet and cannot overlap with other subnet address ranges within the VNet. The address space must be specified using CIDR notation. For example, in a VNet with address space 10.0.0.0/16, you might define a subnet address space of 10.0.0.0/24. The smallest range you can specify is /29, which provides eight IP addresses for the subnet. Azure reserves the first and last address in each subnet for protocol conformance. Three additional addresses are reserved for Azure service usage. As a result, defining a subnet with a /29 address range results in three usable IP addresses in the subnet. If you ever plan to connect a VNet to a VPN Gateway, a gateway subnet must be created. Learn more about [specific address range considerations for gateway subnets](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md?toc=%2fazure%2fvirtual-network%2ftoc.json#a-namegwsubagateway-subnet). You can change the address range after the subnet is created, under specific conditions. To learn how to change a subnet address range, read the [Change subnet](#change-subnet) section of this article.
	- **Network security group (NSG):** You can optionally associate an existing NSG to the subnet to control inbound and outbound network traffic filtering for the subnet. The NSG must exist in the same subscription and location that the VNet does, and created through the Resource Manager deployment model. To learn more about how to create NSGs, read the [Network security groups](virtual-networks-create-nsg-arm-pportal.md) article.
	- **Route table:** You can optionally associate an existing route table to the subnet to control network traffic routing to other networks. The route table must exist in the same subscription and location that the VNet does, and created through the Resource Manager deployment model. To learn more about how to create route tables, read the [User-defined routes](virtual-network-create-udr-arm-ps.md) article.
	- **Users**: You can control access to the subnet using built-in roles or your own custom roles. To learn more about assigning roles and users to access the subnet, read the [Use role assignment to manage access to your Azure resources](../active-directory/role-based-access-control-configure.md?toc=%2fazure%2fvirtual-network%2ftoc.json#add-access) article.
7. Click the **OK** button to add the subnet to the VNet you selected.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az network vnet subnet create](/cli/azure/network/vnet/subnet?toc=%2fazure%2fvirtual-network%2ftoc.json#create)|
|PowerShell|[New-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/new-azurermvirtualnetworksubnetconfig?view=azurermps-3.8.0?toc=%2fazure%2fvirtual-network%2ftoc.json), [Add-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/add-azurermvirtualnetworksubnetconfig?view=azurermps-3.8.0?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="change-subnet"></a>Change subnet settings

You can change the NSG, route tables, and user access to the subnet with resources connected to a subnet. To learn about these settings, read step 6 of the [Create a subnet](#create-subnet) section of this article. To change the address space of a subnet, no resources can be connected to the subnet. If there are resources connected to the subnet, you must first delete the resources connected to the subnet before you can change the address range. The instructions for how to delete a resource vary depending upon the resource. To learn how to delete resources connected to subnets, read the documentation for each resource type you want to delete. Complete the following steps to change the address range for a subnet:

1. Log in to the [portal](https://portal.azure.com) with an account that is assigned (at a minimum) permissions for the Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles and permissions to accounts.
2. In the box that contains the text *Search resources* at the top of the portal, type *virtual networks*. When **Virtual networks** appears in the search results, click it.
3. In the **Virtual networks** blade that appears, click the VNet you want to change a subnet address range for.
4. Click the subnet you want to change the address range for.
5. In the blade that appears for the subnet you selected, enter the new address range in the **Address range** box. The range must be unique within the address space for the VNet and cannot overlap with other subnet address ranges within the VNet. The address space must be specified using CIDR notation. For example, in a VNet with address space 10.0.0.0/16, you might define a subnet address space of 10.0.0.0/24. The smallest range you can specify is /29, which provides eight IP addresses for the subnet. Azure reserves the first and last address in each subnet for protocol conformance. Three additional addresses are reserved for Azure service usage. As a result, a subnet with a /29 address range has three usable IP addresses. If you ever plan to connect a VNet to a VPN Gateway, a gateway subnet must be created. Learn more about [specific address range considerations for gateway subnets](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md?toc=%2fazure%2fvirtual-network%2ftoc.json#a-namegwsubagateway-subnet). You can change the address range after the subnet is created, under specific conditions. To learn how to change a subnet address range, read the [Change subnet](#change-subnet) section of this article.
6. Click **Save**.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az network vnet subnet update](/cli/azure/network/vnet?toc=%2fazure%2fvirtual-network%2ftoc.json#update)|
|PowerShell|[Set-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/set-azurermvirtualnetworksubnetconfig?view=azurermps-3.8.0?toc=%2fazure%2fvirtual-network%2ftoc.json)|


## <a name="delete-subnet"></a>Delete a subnet

You can only delete a subnet if there are no resources connected to it. If there are resources connected to the subnet, you must first delete the resources connected to the subnet. The instructions for how to delete a resource vary depending upon the resource. To learn how to delete resources connected to subnets, read the documentation for each resource type you want to delete.

1. Log in to the [portal](https://portal.azure.com) with an account that is assigned (at a minimum) permissions for the Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles and permissions to accounts.
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *virtual networks*. When **Virtual networks** appears in the search results, click it.
3. In the **Virtual networks** blade that appears, click the VNet you want to delete a subnet from.
4. In the blade that appears for the VNet you selected, click **Subnets** under **Settings**.
5. In the list of subnets that appears in the subnets blade, right-click the subnet you want to delete, click **Delete**, then **Yes** to delete the subnet.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az network vnet delete](/cli/azure/network/vnet?toc=%2fazure%2fvirtual-network%2ftoc.json#delete)|
|PowerShell|[Remove-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/remove-azurermvirtualnetworksubnetconfig?view=azurermps-3.8.0?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="next-steps"></a>Next steps

To create a VM and connect it to a subnet, read the [Create a VNet and connect VMs](virtual-network-get-started-vnet-subnet.md#a-namecreate-vmsacreate-virtual-machines) article.