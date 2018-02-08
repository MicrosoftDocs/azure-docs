---
title: Create, change, or delete Azure route tables | Microsoft Docs
description: Learn how to create, change, or delete route tables and routes.
services: virtual-network
documentationcenter: na
author: jimdial
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/08/2018
ms.author: jdial

---
# Create, change, or delete route tables

Azure automatically routes traffic between Azure subnets, virtual networks, and on-premises networks. If you want to change any of Azure's default routing, you do so by creating route tables. If you're not familiar with Azure routing, we recommend reading the [Routing overview](virtual-networks-udr-overview.md) and completing the [Route network traffic with a route table](create-user-defined-route-portal.md) tutorial, before completing tasks in this article.

## Before you begin

Complete the following tasks before completing steps in any section of this article:

- Review the [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) article to learn about limits for peering.
- If you don't already have an Azure account, sign up for a [free trial account](https://azure.microsoft.com/free).
- If using the portal, open https://portal.azure.com, and log in with your Azure account.
- If using PowerShell commands to complete tasks in this article, either run the commands in the [Azure Cloud Shell](https://shell.azure.com/powershell) by clicking **Try it** in any of the examples, or by running PowerShell from your computer. This tutorial requires the Azure PowerShell module version 5.1.1 or later. Run `Get-Module -ListAvailable AzureRM` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Login-AzureRmAccount` to create a connection with Azure. To get help, with examples, for individual commands, type `get-help <command> -full`, replacing `<command>` with the command you want help on.
- If using Azure Command-line interface (CLI) commands to complete tasks in this article, either run the commands in the [Azure Cloud Shell](https://shell.azure.com/bash) by clicking **Try it** in any of the examples, or by running the CLI from your computer. This tutorial requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). If you are running the Azure CLI locally, you also need to run `az login` to create a connection with Azure. To get help, with examples, for individual commands, type `az <command> -h`, replacing `<command>` with the command you want help on.

## Create a route table

1. In the top-left corner of the portal, click **+ New".
2. Click **Networking**, then click **Route table**.
3. Enter a name for the route table, select your **Subscription**, create a new **Resource group**, or select an existing resource group, select a **Location**, then click **Create**. The **Disable BGP route propagation** option prevents on-premises routes from being propagated to an Azure virtual network via BGP. If your virtual network is not connected to an Azure network gateway (VPN or ExpressRoute), leave the option *Disabled*. 

@@@@Need to add some additional text around benefits of enabling route propagation when VNet is connected to a gateway.@@@

**Commands**

- CLI: [az network route-table create](/cli/azure/network/route-table/route#az_network_route_table_create)
- PowerShell: [New-AzureRmRouteTable](/powershell/module/azurerm.network/new-azurermroutetable)

## View route tables

In the search box at the top of the portal, enter *route tables* in the search box. When **Route tables** appears in the search results, click it. The route tables that exist in your subscription are listed.

**Commands**

- CLI: [az network route-table list](/cli/azure/network/route-table/route#az_network_route_table_list)
- PowerShell: [Get-AzureRmRouteTable](/powershell/module/azurerm.network/get-azurermroutetable)

## View details of a route table

1. In the search box at the top of the portal, enter *route tables* in the search box. When **Route tables** appears in the search results, click it.
3. Click the route table in the list that you want to view details for.

**Commands**

- CLI: [az network route-table show](/cli/azure/network/route-table/route#az_network_route_table_show)
- PowerShell: [Get-AzureRmRouteTable](/powershell/module/azurerm.network/get-azurermroutetable)

## Change a route table

1. In the search box at the top of the portal, enter *route tables* in the search box. When **Route tables** appears in the search results, click it.
3. Click the route table you want to change. The most common changes are [adding](#create-a-route) or [removing](#delete-a-route) routes and [associating](#associate-a-route-table-to-a-subnet) route tables to, or [dissociating](#dissociate-a-route-table-from-a-subnet) route tables from subnets.

**Commands**

- CLI: [az network route-table update](/cli/azure/network/route-table/route#az_network_route_table_update)
- PowerShell: [Set-AzureRmRouteTable](/powershell/module/azurerm.network/set-azurermroutetable)

## Associate a route table to a subnet

A subnet can have zero or one route table associated to it. A route table can be associated to zero or multiple subnets. Since route tables are not associated to virtual networks, you must associate a route table to each subnet you want the route table associated to. Once a route table is associated to a subnet, all traffic leaving the subnet is routed based on default routes, routes you've created, or routes propagated from an on-premises network, if the virtual network is connected to an Azure virtual network gateway (ExpressRoute, or VPN, if using BGP with a VPN gateway).

1. On the left side of the portal, click **More services >**.
2. Enter *virtual networks* in the search box. When **Virtual networks** appears in the search results, click it.
3. Click the virtual network that contains the subnet you want to associate a route table to.
4. Click **Subnets** under **SETTINGS**.
5. Click the subnet you want to associate the route table to.
6. Click **Route table**, select the route table you want to associate to the subnet, then click **Save**.

**Commands**

- CLI: [az network vnet subnet update](/cli/azure/network/vnet/subnet?view=azure-cli-latest#az_network_vnet_subnet_update)
- PowerShell: [Set-AzureRmVirtualNetworkSubnetConfig](powershell/module/azurerm.network/set-azurermvirtualnetworksubnetconfig)

## Dissociate a route table from a subnet

When you dissociate a route table from a subnet, Azure routes traffic based on its default routing.

1. In the search box at the top of the portal, enter *virtual networks* in the search box. When **Virtual networks** appears in the search results, click it.
3. Click the virtual network that contains the subnet you want to dissociate a route table from.
4. Click **Subnets** under **SETTINGS**.
5. Click the subnet you want to dissociate the route table from.
6. Click **Route table**, select **None**, then click **Save**.

**Commands**

- CLI: [az network vnet subnet update](/cli/azure/network/vnet/subnet?view=azure-cli-latest#az_network_vnet_subnet_update)
- PowerShell: [Set-AzureRmVirtualNetworkSubnetConfig](powershell/module/azurerm.network/set-azurermvirtualnetworksubnetconfig) 

## Delete a route table

If a route table is associated to any subnets, it cannot be deleted. [Dissociate](#dissociate-a-route-table-from-a-subnet) a route table from all subnets before attempting to delete it.

1. In the search box at the top of the portal, enter *route tables* in the search box. When **Route tables** appears in the search results, click it.
2. Click **...** on the right-side of the route table you want to delete.
3. Click **Delete**, then click **Yes**.

**Commands**

- CLI: [az network route-table delete](/cli/azure/network/route-table/route#az_network_route_table_delete)
- PowerShell: [Delete-AzureRmRouteTable](/powershell/module/azurerm.network/delete-azurermroutetable) 

## Create a route

1. In the top-left corner of the portal, click **+ New".
2. Enter *route tables* in the search box. When **Route tables** appears in the search results, click it.
3. Click the route table you want to add a route to.
4. Click **Routes**, under **SETTINGS**.
5. Click **+ Add**.
6. Enter a unique name for the route within the route table.
7. Enter the address prefix, in CIDR notation, that you want to route traffic to.
8. Select a next hop type. For a detailed description of all next hop types, see [Routing overview](virtual-networks-udr-overview.md).
9. Enter an IP address for **Next hop address**. You can only enter a value if you selected *Virtual appliance* for **Next hop type**.
10. Click **OK**. 

**Commands**

- CLI: [az network route-table route create](/cli/azure/network/route-table/route?view=azure-cli-latest#az_network_route_table_route_create)
- PowerShell: [New-AzureRmRouteConfig](/powershell/module/azurerm.network/new-azurermrouteconfig)

## View routes

A route table contains zero or multiple routes.

1. In the search box at the top of the portal, enter *route tables* in the search box. When **Route tables** appears in the search results, click it.
3. Click the route table you want to view routes for.
4. Click **Routes**.

**Commands**

- CLI: [az network route-table route list](/cli/azure/network/route-table/route?view=azure-cli-latest#az_network_route_table_route_list)
- PowerShell: [Get-AzureRmRouteConfig](/powershell/module/azurerm.network/get-azurermrouteconfig)

## View details of a route

1. In the search box at the top of the portal, enter *route tables* in the search box. When **Route tables** appears in the search results, click it.
3. Click the route table you want to view details of a route for.
4. Click **Routes**.
5. Click the route you want to view details of.

**Commands**

- CLI: [az network route-table route show](/cli/azure/network/route-table/route?view=azure-cli-latest#az_network_route_table_route_show)
- PowerShell: [Get-AzureRmRouteConfig](/powershell/module/azurerm.network/get-azurermrouteconfig)
- 
## Change a route

1. In the search box at the top of the portal, enter *route tables* in the search box. When **Route tables** appears in the search results, click it.
3. Click the route table you want to change a route for.
4. Click **Routes**.
5. Click the route you want to change.
6. Change existing settings to their new settings, then click **Save**.

**Commands**

- CLI: [az network route-table route update](/cli/azure/network/route-table/route?view=azure-cli-latest#az_network_route_table_route_update)
- PowerShell: [Set-AzureRmRouteConfig](/powershell/module/azurerm.network/set-azurermrouteconfig)

## Delete a route

1. In the search box at the top of the portal, enter *route tables* in the search box. When **Route tables** appears in the search results, click it.
3. Click the route table you want to view details of a route for.
4. Click **Routes**.
5. Click **...** on the right-side of the route you want to delete.
6. Click **Delete**, then click **Yes**.

**Commands**

- CLI: [az network route-table route delete](/cli/azure/network/route-table/route?view=azure-cli-latest#az_network_route_table_route_delete)
- PowerShell: [Remove-AzureRmRouteConfig](/powershell/module/azurerm.network/remove-azurermrouteconfig)

## View effective routes

The effective routes for each network interface are a combination of Azure's default routes, any custom routes you've created, and any routes propagated from on-premises networks via BGP through an Azure virtual network gateway. Understanding the effective routes for a network interface is helpful when troubleshooting routing problems. You can view the effective routes for any network interface that is attached to a running virtual machine.

1. In the search box at the top of the portal, enter the name of a virtual machine you want to view effective routes for. If you don't know the name of a virtual machine, enter *virtual machines* in the search box. When **Virtual machines** appears in the search results, click it and click a virtual machine from the list.
2. Click **Networking** under **SETTINGS**.
3. Click the name of a network interface.
4. Click **Effective routes** under **SUPPORT + TROUBLESHOOTING**.
5. Review the list of effective routes to determine if the correct route exists for where you want to route traffic to. Learn more about next hop types that you see in this list in [Routing overview](virtual-networks-udr-overview.md).

**Commands**

- CLI: [az network nic show-effective-route-table](/cli/azure/network/nic?view=azure-cli-latest#az_network_nic_show_effective_route_table)
- PowerShell: [Get-AzureRmEffectiveRouteTable](/powershell/module/azurerm.network/remove-azurermrouteconfig) 

## Validate routing between two endpoints

You can determine the next hop type between a virtual machine and the IP address of another Azure resource, an on-premises resource, or a resource on the Internet. Determining Azure's routing is helpful when troubleshooting routing problems. To complete this task, you must have an existing Network Watcher. If you don't have an existing Network Watcher, create one by completing the steps in [Create a Network Watcher instance](../network-watcher/network-watcher-create?toc=%2fazure%2fvirtual-network%2ftoc.json).

1. On the left side of the portal, click **More services >**, then click **Network Watcher**.
2. Click **Next hop** under **NETWORK DIAGNOSTIC TOOLS**.
3. Select your **Subscription** and the **Resource group** of the source virtual machine you want to validate routing from.
4. Select the **Virtual machine**, **Network interface** attached to the virtual machine, and **Source IP address** assigned to the network interface that you want to validate routing from.
5. Enter the **Destination IP address** that you want to validate routing to.
6. Click **Next hop**.
7. After a short wait, information is returned that tells you the next hop type and the ID of the route that routed the traffic. Learn more about next hop types that you see returned in [Routing overview](virtual-networks-udr-overview.md).

**Commands**

- CLI: [az network watcher show-next-hop](/cli/azure/network/watcher?view=azure-cli-latest#az_network_watcher_show_next_hop)
- PowerShell: [Get-AzureRmNetworkWatcherNextHop](/powershell/module/azurerm.network/get-azurermnetworkwatchernexthop) 
 
## Permissions

To perform tasks on route tables and routes, your account must be assigned one or more of the following permissions:

|Operation                                       |   Operation name                |
|-------------------------------------------     |   ----------------------------  |
|Microsoft.Network/routeTables/read              |   Get route table               |
|Microsoft.Network/routeTables/write             |   Create or update route table  |
|Microsoft.Network/routeTables/delete            |   Delete route table            |
|Microsoft.Network/routeTables/join/action       |   Join route table              |
|Microsoft.Network/routeTables/routes/read       |   Get route                     |
|Microsoft.Network/routeTables/routes/write      |   Create or update route        |
|Microsoft.Network/routeTables/routes/delete     |   Delete route                  |

The *join* operation is required to associate a route table to a subnet.

To view permissions assigned to your account:
1. In the portal, select a resource group.
2. Click **Access control (IAM)**, then click your account.
3. Under **Permissions**, click **Microsoft.Network**.
4. Under Microsoft Network, scroll until you see **Route table**.
5. View the **Route Table** and **Route** permissions currently assigned to your account.

If you receive any permission-related errors when trying to complete tasks in this article, someone with permissions to assign your account to the [network contributor](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) or a [custom](../active-directory/role-based-access-control-custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) role with the necessary permissions needs to assign your account to the role.