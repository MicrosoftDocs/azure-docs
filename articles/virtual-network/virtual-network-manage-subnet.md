---
title: Create, change, or delete an Azure virtual network subnet | Microsoft Docs
description: Learn how to create, change, or delete a virtual network subnet in Azure.
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
# Create, change, or delete a virtual network subnet

Learn how to create, change, or delete a virtual network subnet. 

If you're not familiar with virtual networks, before you create, change, or delete a subnet, we recommend that you read [Azure Virtual Network overview](virtual-networks-overview.md) and [Create, change, or delete a virtual network](virtual-network-manage-network.md). All Azure resources that can connect to a virtual network are connected to a subnet in a virtual network. Usually, multiple subnets are created within a virtual network to:
- **Filter traffic between subnets**. You can apply network security groups to subnets to filter inbound and outbound network traffic for all resources (like virtual machines) that are connected to the virtual network. To learn more about how to create a network security group, see [Create network security groups](virtual-networks-create-nsg-arm-pportal.md).
- **Control routing between subnets**. Azure creates default routes so that traffic is automatically routed between subnets. You can override Azure default routes by creating user-defined routes. To learn more about user-defined routes, see [Create user-defined routes](virtual-network-create-udr-arm-ps.md). 

This article explains how to create, change, and delete a subnet for virtual networks that were created by using the Azure Resource Manager deployment model.
 
## <a name="before"></a>Before you begin

Before you begin the tasks that are described in this article, complete the following prerequisites:

- If you're new to working with virtual networks, we recommend that you review the exercise in [Create your first Azure virtual network](virtual-network-get-started-vnet-subnet.md). This exercise can help you become more familiar with virtual networks.
- To learn about limits for virtual networks, review [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).
- Sign in to the Azure portal, the Azure command-line tool (Azure CLI), or Azure PowerShell by using your Azure account. If you don't have an Azure account, sign up for a [free trial account](https://azure.microsoft.com/free).
- If you plan to use PowerShell commands to complete the tasks described in this article, you must first [install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs?toc=%2fazure%2fvirtual-network%2ftoc.json). Ensure that you have the most recent version of the Azure PowerShell cmdlets installed. To get help for PowerShell commands in the examples, enter `get-help <command> -full`.
- If you plan to use Azure CLI commands to complete the tasks described in this article, you must first [install and configure Azure CLI](/cli/azure/install-azure-cli?toc=%2fazure%2fvirtual-network%2ftoc.json). Ensure that you have the most recent version of Azure CLI installed. To get help with Azure CLI commands, enter `az <command> --help`.

## <a name="create-subnet"></a>Create a subnet

To create a subnet:

1. Sign in to the [portal](https://portal.azure.com) with an account that is assigned permissions for the Network Contributor role (at a minimum) for your subscription. To learn more about assigning roles and permissions to accounts, see [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor).
2. In the portal search box, enter **virtual networks**. In the search results, click **Virtual networks**.
3. On the **Virtual networks** blade, click the virtual network you want to add a subnet to.
4. On the virtual network blade, click **Subnets**.
5. Click **+Subnet**.
6. On the **Add subnet** blade, enter values for the following parameters:
	- **Name**: The name must be unique within the virtual network.
	- **Address range**: The range must be unique within the address space for the virtual network. The range cannot overlap with other subnet address ranges within the virtual network. The address space must be specified by using Classless Inter-Domain Routing (CIDR) notation. For example, in a virtual network with address space 10.0.0.0/16, you might define a subnet address space of 10.0.0.0/24. The smallest range you can specify is /29, which provides eight IP addresses for the subnet. Azure reserves the first and last address in each subnet for protocol conformance. Three additional addresses are reserved for Azure service usage. As a result, defining a subnet with a /29 address range results in three usable IP addresses in the subnet. If you plan to connect a virtual network to a VPN gateway, you must create a gateway subnet. Learn more about [specific address range considerations for gateway subnets](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md?toc=%2fazure%2fvirtual-network%2ftoc.json#a-namegwsubagateway-subnet). You can change the address range after the subnet is created, under specific conditions. To learn how to change a subnet address range, see [Change subnet settings](#change-subnet) in this article.
	- **Network security group**: Optionally, you can associate an existing network security group with the subnet to control inbound and outbound network traffic filtering for the subnet. The network security group must exist in the same subscription and location as the virtual network. It also must be created by using the Resource Manager deployment model. To learn more about how to create a network security group, see [Network security groups](virtual-networks-create-nsg-arm-pportal.md).
	- **Route table**: Optionally, you can associate an existing route table with the subnet to control network traffic routing to other networks. The route table must exist in the same subscription and location as the virtual network. It also must be created by using the Resource Manager deployment model. To learn more about how to create route tables, see [User-defined routes](virtual-network-create-udr-arm-ps.md).
	- **Users**: You can control access to the subnet by using built-in roles or your own custom roles. To learn more about assigning roles and users to access the subnet, see [Use role assignment to manage access to your Azure resources](../active-directory/role-based-access-control-configure.md?toc=%2fazure%2fvirtual-network%2ftoc.json#add-access).
7. To add the subnet to the virtual network that you selected, click **OK**.

**Commands**

|Tool|Command|
|---|---|
|Azure CLI|[az network vnet subnet create](/cli/azure/network/vnet/subnet?toc=%2fazure%2fvirtual-network%2ftoc.json#create)|
|PowerShell|[New-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/new-azurermvirtualnetworksubnetconfig?view=azurermps-3.8.0?toc=%2fazure%2fvirtual-network%2ftoc.json), [Add-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/add-azurermvirtualnetworksubnetconfig?view=azurermps-3.8.0?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="change-subnet"></a>Change subnet settings

You can change network security groups, route tables, and user access to a subnet by managing resources that are connected to a subnet. To learn about these settings, in [Create a subnet](#create-subnet), see step 6. If you want to change the address space of a subnet, you must first delete any resources that are connected to the subnet. The steps you take to delete a resource vary depending on the resource. To learn how to delete resources that are connected to subnets, read the documentation for each resource type that you want to delete. To change the address range for a subnet:

1. Sign in to the [portal](https://portal.azure.com) with an account that is assigned permissions for the Network Contributor role (at a minimum) for your subscription. To learn more about assigning roles and permissions to accounts, see [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor).
2. In the portal search box, enter **virtual networks**. In the search results, click **Virtual networks**.
3. On the **Virtual networks** blade, click the virtual network for which you want to change a subnet address range.
4. Click the subnet for which you want to change the address range.
5. On the subnet blade, in the **Address range** box, enter the new address range. The range must be unique within the address space for the virtual network. The range cannot overlap with other subnet address ranges within the virtual network. The address space must be specified by using CIDR notation. For example, in a virtual network with address space 10.0.0.0/16, you might define a subnet address space of 10.0.0.0/24. The smallest range you can specify is /29, which provides eight IP addresses for the subnet. Azure reserves the first and last address in each subnet for protocol conformance. Three additional addresses are reserved for Azure service usage. As a result, a subnet with a /29 address range has three usable IP addresses. If you plan to connect a virtual network to a VPN gateway, you must create a gateway subnet. Learn more about [specific address range considerations for gateway subnets](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md?toc=%2fazure%2fvirtual-network%2ftoc.json#a-namegwsubagateway-subnet). You can change the address range after the subnet is created, under specific conditions. To learn how to change a subnet address range, see [Change subnet settings](#change-subnet) in this article.
6. Click **Save**.

**Commands**

|Tool|Command|
|---|---|
|Azure CLI|[az network vnet subnet update](/cli/azure/network/vnet?toc=%2fazure%2fvirtual-network%2ftoc.json#update)|
|PowerShell|[Set-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/set-azurermvirtualnetworksubnetconfig?view=azurermps-3.8.0?toc=%2fazure%2fvirtual-network%2ftoc.json)|


## <a name="delete-subnet"></a>Delete a subnet

You can delete a subnet only if there are no resources connected to it. If there are resources connected to the subnet, you must delete the resources that are connected to the subnet before you can delete the subnet. The steps you take to delete a resource vary depending on the resource. To learn how to delete resources that are connected to subnets, read the documentation for each resource type that you want to delete. To delete a subnet:

1. Sign in to the [portal](https://portal.azure.com) with an account that is assigned permissions for the Network Contributor role (at a minimum) for your subscription. To learn more about assigning roles and permissions to accounts, see [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor).
2. In the portal search box, enter **virtual networks**. In the search results, click **Virtual networks**.
3. On the **Virtual networks** blade, click the virtual network you want to delete a subnet from.
4. On the virtual network blade, under **SETTINGS**, click **Subnets**.
5. In the list of subnets that appears on the subnets blade, right-click the subnet you want to delete, click **Delete**, and then click **Yes** to delete the subnet.

**Commands**

|Tool|Command|
|---|---|
|Azure CLI|[az network vnet delete](/cli/azure/network/vnet?toc=%2fazure%2fvirtual-network%2ftoc.json#delete)|
|PowerShell|[Remove-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/remove-azurermvirtualnetworksubnetconfig?view=azurermps-3.8.0?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="next-steps"></a>Next steps

To create a VM and then connect it to a subnet, see [Create a virtual network and connect VMs](virtual-network-get-started-vnet-subnet.md#a-namecreate-vmsacreate-virtual-machines).