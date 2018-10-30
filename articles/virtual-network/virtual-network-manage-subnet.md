---
title: Add, change, or delete an Azure virtual network subnet | Microsoft Docs
description: Learn how to add, change, or delete a virtual network subnet in Azure.
services: virtual-network
documentationcenter: na
author: jimdial
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/09/2018
ms.author: jdial

---
# Add, change, or delete a virtual network subnet

Learn how to add, change, or delete a virtual network subnet. All Azure resources deployed into a virtual network are deployed into a subnet within a virtual network. If you're new to virtual networks, you can learn more about them in the [Virtual network overview](virtual-networks-overview.md) or by completing a [tutorial](quick-create-portal.md). To create, change, or delete a virtual network, see [Manage a virtual network](manage-virtual-network.md).

## Before you begin

Complete the following tasks before completing steps in any section of this article:

- If you don't already have an Azure account, sign up for a [free trial account](https://azure.microsoft.com/free).
- If using the portal, open https://portal.azure.com, and log in with your Azure account.
- If using PowerShell commands to complete tasks in this article, either run the commands in the [Azure Cloud Shell](https://shell.azure.com/powershell), or by running PowerShell from your computer. The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. This tutorial requires the Azure PowerShell module version 5.7.0 or later. Run `Get-Module -ListAvailable AzureRM` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure.
- If using Azure Command-line interface (CLI) commands to complete tasks in this article, either run the commands in the [Azure Cloud Shell](https://shell.azure.com/bash), or by running the CLI from your computer. This tutorial requires the Azure CLI version 2.0.31 or later. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). If you are running the Azure CLI locally, you also need to run `az login` to create a connection with Azure.

The account you log into, or connect to Azure with, must be assigned to the [network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that is assigned the appropriate actions listed in [Permissions](#permissions).

## Add a subnet

1. In the search box at the top of the portal, enter *virtual networks* in the search box. When **Virtual networks** appear in the search results, select it.
2. From the list of virtual networks, select the virtual network you want to add a subnet to.
3. Under **SETTINGS**, select **Subnets**.
4. Select **+Subnet**.
5. Enter values for the following parameters:
	- **Name**: The name must be unique within the virtual network. For maximum compatibility with other Azure services, we recommend using a letter as the first character of the name. For example, Azure Application Gateway won't deploy into a subnet that has a name that starts with a number.
	- **Address range**: The range must be unique within the address space for the virtual network. The range cannot overlap with other subnet address ranges within the virtual network. The address space must be specified by using Classless Inter-Domain Routing (CIDR) notation. For example, in a virtual network with address space 10.0.0.0/16, you might define a subnet address space of 10.0.0.0/24. The smallest range you can specify is /29, which provides eight IP addresses for the subnet. Azure reserves the first and last address in each subnet for protocol conformance. Three additional addresses are reserved for Azure service usage. As a result, defining a subnet with a /29 address range results in three usable IP addresses in the subnet. If you plan to connect a virtual network to a VPN gateway, you must create a gateway subnet. Learn more about [specific address range considerations for gateway subnets](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md?toc=%2fazure%2fvirtual-network%2ftoc.json#gwsub). You can change the address range after the subnet is added, under specific conditions. To learn how to change a subnet address range, see [Change subnet settings](#change-subnet-settings).
	- **Network security group**: You can associate zero, or one existing network security group to a subnet to filter inbound and outbound network traffic for the subnet. The network security group must exist in the same subscription and location as the virtual network. Learn more about [network security groups](security-overview.md) and [how to create a network security group](tutorial-filter-network-traffic.md).
	- **Route table**: You can associate zero or one existing route table to a subnet to control network traffic routing to other networks. The route table must exist in the same subscription and location as the virtual network. Learn more about [Azure routing](virtual-networks-udr-overview.md) and [how to create a route table](tutorial-create-route-table-portal.md)
	- **Service endpoints:** A subnet can have zero or multiple service endpoints enabled for it. To enable a service endpoint for a service, select the service or services that you want to enable service endpoints for from the **Services** list. The location is configured automatically for an endpoint. By default, service endpoints are configured for the virtual network's region. For Azure Storage, to support regional failover scenarios, endpoints are automatically configured to [Azure paired regions](../best-practices-availability-paired-regions.md?toc=%2fazure%2fvirtual-network%2ftoc.json#what-are-paired-regions).
    - **Subnet delegation:** A subnet can have zero to multiple delegations enabled for it. Subnet delegation gives explicit permissions to the service to create service-specific resources in the subnet using a unique identifier when deploying the service. To delegate for a service, select the service you want to delegate to from the **Services** list. 

    To remove a service endpoint, unselect the service you want to remove the service endpoint for. To learn more about service endpoints, and the services they can be enabled for, see [Virtual network service endpoints overview](virtual-network-service-endpoints-overview.md). Once you enable a service endpoint for a service, you must also enable network access for the subnet for a resource created with the service. For example, if you enable the service endpoint for *Microsoft.Storage*, you must also enable network access to all Azure Storage accounts you want to grant network access to. For details about how to enable network access to subnets that a service endpoint is enabled for, see the documentation for the individual service you enabled the service endpoint for.

    To validate that a service endpoint is enabled for a subnet, view the [effective routes](diagnose-network-routing-problem.md) for any network interface in the subnet. When an endpoint is configured, you see a *default* route with the address prefixes of the service, and a nextHopType of **VirtualNetworkServiceEndpoint**. To learn more about routing, see [Routing overview](virtual-networks-udr-overview.md).
6. To add the subnet to the virtual network that you selected, select **OK**.

**Commands**

- Azure CLI: [az network vnet subnet create](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_create)
- PowerShell: [Add-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/add-azurermvirtualnetworksubnetconfig)

## Change subnet settings

1. In the search box at the top of the portal, enter *virtual networks* in the search box. When **Virtual networks** appear in the search results, select it.
2. From the list of virtual networks, select the virtual network that contains the subnet you want to change settings for.
3. Under **SETTINGS**, select **Subnets**.
4. In the list of subnets, select the subnet you want to change settings for. You can change the following settings:

    - **Address range:** If no resources are deployed within the subnet, you can change the address range. If any resources exist in the subnet, you must either move the resources to another subnet, or delete them from the subnet first. The steps you take to move or delete a resource vary depending on the resource. To learn how to move or delete resources that are in subnets, read the documentation for each resource type that you want to move or delete. See the constraints for **Address range** in step 5 of [Add a subnet](#add-a-subnet).
    - **Users**: You can control access to the subnet by using built-in roles or your own custom roles. To learn more about assigning roles and users to access the subnet, see [Use role assignment to manage access to your Azure resources](../role-based-access-control/role-assignments-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json#grant-access).
    - **Network security group** and  **Route table**: See step 5 of [Add a subnet](#add-a-subnet).
    - **Service endpoints**: See service endpoints in step 5 of [Add a subnet](#add-a-subnet). When enabling a service endpoint for an existing subnet, ensure that no critical tasks are running on any resource in the subnet. Service endpoints switch routes on every network interface in the subnet from using the default route with the *0.0.0.0/0* address prefix and next hop type of *Internet*, to using a new route with the address prefixes of the service, and a next hop type of *VirtualNetworkServiceEndpoint*. During the switch, any open TCP connections may be terminated. The service endpoint is not enabled until traffic flows to the service for all network interfaces are updated with the new route. To learn more about routing, see [Routing overview](virtual-networks-udr-overview.md).
    - **Subnet delegation:** See service endpoints in step 5 of [Add a subnet](#add-a-subnet). Subnet delegation can be modified to zero or multiple delegations enabled for it. If a resource for a service is already deployed in the subnet, subnet delegation cannot be removed until the all resources for the service are removed. To delegate for a different service, select the service you want to delegate to from the **Services** list. 
5. Select **Save**.

**Commands**

- Azure CLI: [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update)
- PowerShell: [Set-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/set-azurermvirtualnetworksubnetconfig)

## Delete a subnet

You can delete a subnet only if there are no resources in the subnet. If there are resources in the subnet, you must delete the resources that are in the subnet before you can delete the subnet. The steps you take to delete a resource vary depending on the resource. To learn how to delete resources that are in subnets, read the documentation for each resource type that you want to delete.

1. In the search box at the top of the portal, enter *virtual networks* in the search box. When **Virtual networks** appear in the search results, select it.
2. From the list of virtual networks, select the virtual network that contains the subnet you want to delete.
3. Under **SETTINGS**, select **Subnets**.
4. In the list of subnets, select **...**, on the right, for the subnet you want to delete
5. Select **Delete**, and then select **Yes**.

**Commands**

- Azure CLI: [az network vnet delete](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-delete)
- PowerShell: [Remove-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/remove-azurermvirtualnetworksubnetconfig?toc=%2fazure%2fvirtual-network%2ftoc.json)

## Permissions

To perform tasks on subnets, your account must be assigned to the [network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) role that is assigned the appropriate actions listed in the following table:

|Action                                                                   |   Name                                       |
|-----------------------------------------------------------------------  |   -----------------------------------------  |
|Microsoft.Network/virtualNetworks/subnets/read                           |   Read a virtual network subnet              |
|Microsoft.Network/virtualNetworks/subnets/write                          |   Create or update a virtual network subnet  |
|Microsoft.Network/virtualNetworks/subnets/delete                         |   Delete a virtual network subnet            |
|Microsoft.Network/virtualNetworks/subnets/join/action                    |   Join a virtual network                     |
|Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action  |   Enable a service endpoint for a subnet     |
|Microsoft.Network/virtualNetworks/subnets/virtualMachines/read           |   Get the virtual machines in a subnet       |

## Next steps

- Create a virtual network and subnets using [PowerShell](powershell-samples.md) or [Azure CLI](cli-samples.md) sample scripts, or using Azure [Resource Manager templates](template-samples.md)
- Create and apply [Azure policy](policy-samples.md) for virtual networks
