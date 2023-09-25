---
title: Create, change, or delete an Azure route table
titlesuffix: Azure Virtual Network
description: Learn where to find information about virtual network traffic routing, and how to create, change, or delete a route table.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.topic: how-to
ms.workload: infrastructure-services
ms.custom: devx-track-linux
ms.date: 04/24/2023
ms.author: allensu
---

# Create, change, or delete a route table

Azure automatically routes traffic between Azure subnets, virtual networks, and on-premises networks. If you want to change Azure's default routing, you do so by creating a route table. If you're new to routing in virtual networks, you can learn more about it in [virtual network traffic routing](virtual-networks-udr-overview.md) or by completing a [tutorial](tutorial-create-route-table-portal.md).

## Before you begin

If you don't have one, set up an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio). Then complete one of these tasks before starting steps in any section of this article:

- **Portal users**: Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

- **PowerShell users**: Either run the commands in the [Azure Cloud Shell](https://shell.azure.com/powershell), or run PowerShell from your computer. The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. In the Azure Cloud Shell browser tab, find the **Select environment** dropdown list, then choose **PowerShell** if it isn't already selected.

    If you're running PowerShell locally, use Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az.Network` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). Also run `Connect-AzAccount` to create a connection with Azure.

- **Azure CLI users**: Run the commands via either the [Azure Cloud Shell](https://shell.azure.com/bash) or the Azure CLI running locally. Use Azure CLI version 2.0.31 or later if you're running the Azure CLI locally. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). Also run `az login` to create a connection with Azure.

Assign the [Network contributor role](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) or a [Custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) with the appropriate [Permissions](#permissions).

## Create a route table

There's a limit to how many route tables you can create per Azure location and subscription. For details, see [Networking limits - Azure Resource Manager](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).

1. On the [Azure portal](https://portal.azure.com) menu or from the **Home** page, select **Create a resource**.

1. In the search box, enter *Route table*. When **Route table** appears in the search results, select it.

1. In the **Route table** page, select **Create**.

1. In the **Create route table** dialog box:

    :::image type="content" source="./media/manage-route-table/create-route-table.png" alt-text="Screenshot of the create route table page.":::

    | Setting | Value |
    |--|--|
    | Name | Enter a **name** for the route table. |
    | Subscription | Select the **subscription** to deploy the route table in. |
    | Resource group | Choose an existing **Resource group** or select **Create new** to create a new resource group. |
    | Location | Select a **region** to deploy the route table in. |
    | Propagate gateway routes | If you plan to associate the route table to a subnet in a virtual network that's connected to your on-premises network through a VPN gateway, and you don't want to propagate your on-premises routes to the network interfaces in the subnet, set **Virtual network gateway route propagation** to **Disabled**.

1. Select **Review + create** and then **Create** to create your new route table.

### Create route table - commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network route-table create](/cli/azure/network/route-table#az-network-route-table-create) |
| PowerShell | [New-AzRouteTable](/powershell/module/az.network/new-azroutetable) |

## View route tables

Go to the [Azure portal](https://portal.azure.com) to manage your virtual network. Search for and select **Route tables**. The route tables that exist in your subscription are listed.

:::image type="content" source="./media/manage-route-table/list.png" alt-text="Screenshot of the list of route tables in the Azure subscription.":::

### View route table - commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network route-table list](/cli/azure/network/route-table#az-network-route-table-list) |
| PowerShell | [Get-AzRouteTable](/powershell/module/az.network/get-azroutetable) |

## View details of a route table

1. Go to the [Azure portal](https://portal.azure.com) to manage your virtual network. Search for and select **Route tables**.

1. In the route table list, choose the route table that you want to view details for.

1. In the route table page, under **Settings**, view the **Routes** in the route table or the **Subnets** the route table is associated to.

    :::image type="content" source="./media/manage-route-table/route-table.png" alt-text="Screenshot of the overview page of a route tables in an Azure subscription.":::

To learn more about common Azure settings, see the following information:

- [Activity log](../azure-monitor/essentials/platform-logs-overview.md)
- [Access control (IAM)](../role-based-access-control/overview.md)
- [Tags](../azure-resource-manager/management/tag-resources.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [Locks](../azure-resource-manager/management/lock-resources.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [Automation script](../azure-resource-manager/templates/export-template-portal.md)

### View details of route table - commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network route-table show](/cli/azure/network/route-table#az-network-route-table-show) |
| PowerShell | [Get-AzRouteTable](/powershell/module/az.network/get-azroutetable) |

## Change a route table

1. Go to the [Azure portal](https://portal.azure.com) to manage your virtual network. Search for and select **Route tables**.

1. In the route table list, choose the route table that you want to change.

    :::image type="content" source="./media/manage-route-table/routes.png" alt-text="Screenshot of the routes in a route table.":::

The most common changes are to [add](#create-a-route) routes, [remove](#delete-a-route) routes, [associate](#associate-a-route-table-to-a-subnet) route tables to subnets, or [dissociate](#dissociate-a-route-table-from-a-subnet) route tables from subnets.

### Change a route table - commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network route-table update](/cli/azure/network/route-table#az-network-route-table-update) |
| PowerShell | [Set-AzRouteTable](/powershell/module/az.network/set-azroutetable) |

## Associate a route table to a subnet

You can optionally associate a route table to a subnet. A route table can be associated to zero or more subnets. Route tables aren't associated to virtual networks. You must associate a route table to each subnet you want the route table associated to. 

Azure routes all traffic leaving the subnet based on routes you've created:

* Within route tables

* [Default routes](virtual-networks-udr-overview.md#default)

* Routes propagated from an on-premises network, if the virtual network is connected to an Azure virtual network gateway (ExpressRoute or VPN). 

You can only associate a route table to subnets in virtual networks that exist in the same Azure location and subscription as the route table.

1. Go to the [Azure portal](https://portal.azure.com) to manage your virtual network. Search for and select **Virtual networks**.

1. In the virtual network list, choose the virtual network that contains the subnet you want to associate a route table to.

1. In the virtual network menu bar, choose **Subnets**.

1. Select the subnet you want to associate the route table to.

1. In **Route table**, choose the route table you want to associate to the subnet.

    :::image type="content" source="./media/manage-route-table/subnet-route-table.png" alt-text="Screenshot of associating a route table to a subnet.":::

1. Select **Save**.

If your virtual network is connected to an Azure VPN gateway, don't associate a route table to the [gateway subnet](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md?toc=%2fazure%2fvirtual-network%2ftoc.json#gwsub) that includes a route with a destination of *0.0.0.0/0*. Doing so can prevent the gateway from functioning properly. For more information about using *0.0.0.0/0* in a route, see [Virtual network traffic routing](virtual-networks-udr-overview.md#default-route).

### Associate a route table - commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) |
| PowerShell | [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) |

## Dissociate a route table from a subnet

When you dissociate a route table from a subnet, Azure routes traffic based on its [default routes](virtual-networks-udr-overview.md#default).

1. Go to the [Azure portal](https://portal.azure.com) to manage your virtual network. Search for and select **Virtual networks**.

1. In the virtual network list, choose the virtual network that contains the subnet you want to dissociate a route table from.

1. In the virtual network menu bar, choose **Subnets**.

1. Select the subnet you want to dissociate the route table from.

1. In **Route table**, choose **None**.

    :::image type="content" source="./media/manage-route-table/remove-route-table.png" alt-text="Screenshot of removing a route table from a subnet.":::

1. Select **Save**.

### Dissociate a route table - commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) |
| PowerShell | [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) |

## Delete a route table

You can't delete a route table that's associated to any subnets. [Dissociate](#dissociate-a-route-table-from-a-subnet) a route table from all subnets before attempting to delete it.

1. Go to the [Azure portal](https://portal.azure.com) to manage your route tables. Search for and select **Route tables**.

1. In the route table list, choose the route table you want to delete.

1. Select **Delete**, and then select **Yes** in the confirmation dialog box.

    :::image type="content" source="./media/manage-route-table/delete-route-table.png" alt-text="Screenshot of the delete button for a route table.":::

### Delete a route table - commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network route-table delete](/cli/azure/network/route-table#az-network-route-table-delete) |
| PowerShell | [Remove-AzRouteTable](/powershell/module/az.network/remove-azroutetable) |

## Create a route

There's a limit to how many routes per route table can create per Azure location and subscription. For details, see [Networking limits - Azure Resource Manager](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).

1. Go to the [Azure portal](https://portal.azure.com) to manage your route tables. Search for and select **Route tables**.

1. In the route table list, choose the route table you want to add a route to.

1. From the route table menu bar, choose **Routes** and then select **+ Add**.

1. Enter a unique **Route name** for the route within the route table.

    :::image type="content" source="./media/manage-route-table/add-route.png" alt-text="Screenshot of add a route page for a route table.":::

1. Enter the **Address prefix**, in Classless Inter-Domain Routing (CIDR) notation, that you want to route traffic to. The prefix can't be duplicated in more than one route within the route table, though the prefix can be within another prefix. For example, if you defined *10.0.0.0/16* as a prefix in one route, you can still define another route with the *10.0.0.0/22* address prefix. Azure selects a route for traffic based on longest prefix match. To learn more, see [How Azure selects a route](virtual-networks-udr-overview.md#how-azure-selects-a-route).

1. Choose a **Next hop type**. To learn more about next hop types, see [Virtual network traffic routing](virtual-networks-udr-overview.md).

1. If you chose a **Next hop type** of **Virtual appliance**, enter an IP address for **Next hop address**.

1. Select **OK**.

### Create a route - commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network route-table route create](/cli/azure/network/route-table/route#az-network-route-table-route-create) |
| PowerShell | [New-AzRouteConfig](/powershell/module/az.network/new-azrouteconfig) |

## View routes

A route table contains zero or more routes. To learn more about the information listed when viewing routes, see [Virtual network traffic routing](virtual-networks-udr-overview.md).

1. Go to the [Azure portal](https://portal.azure.com) to manage your route tables. Search for and select **Route tables**.

1. In the route table list, choose the route table you want to view routes for.

1. In the route table menu bar, choose **Routes** to see the list of routes.

    :::image type="content" source="./media/manage-route-table/routes.png" alt-text="Screenshot of the routes in a route table.":::

### View routes - commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network route-table route list](/cli/azure/network/route-table/route#az-network-route-table-route-list) |
| PowerShell | [Get-AzRouteConfig](/powershell/module/az.network/get-azrouteconfig) |

## View details of a route

1. Go to the [Azure portal](https://portal.azure.com) to manage your route tables. Search for and select **Route tables**.

1. In the route table list, choose the route table containing the route you want to view details for.

1. In the route table menu bar, choose **Routes** to see the list of routes.

1. Select the route you want to view details of.

    :::image type="content" source="./media/manage-route-table/view-route.png" alt-text="Screenshot of a route details page.":::

### View details of a route - commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network route-table route show](/cli/azure/network/route-table/route#az-network-route-table-route-show) |
| PowerShell | [Get-AzRouteConfig](/powershell/module/az.network/get-azrouteconfig) |

## Change a route

1. Go to the [Azure portal](https://portal.azure.com) to manage your route tables. Search for and select **Route tables**.

1. In the route table list, choose the route table containing the route you want to change.

1. In the route table menu bar, choose **Routes** to see the list of routes.

1. Choose the route you want to change.

1. Change existing settings to their new settings, then select **Save**.

### Change a route - commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network route-table route update](/cli/azure/network/route-table/route#az-network-route-table-route-update) |
| PowerShell | [Set-AzRouteConfig](/powershell/module/az.network/set-azrouteconfig) |

## Delete a route

1. Go to the [Azure portal](https://portal.azure.com) to manage your route tables. Search for and select **Route tables**.

1. In the route table list, choose the route table containing the route you want to delete.

1. In the route table menu bar, choose **Routes** to see the list of routes.

1. Choose the route you want to delete.

1. Select the **...** and then select **Delete**. Select **Yes** in the confirmation dialog box.

   :::image type="content" source="./media/manage-route-table/delete-route.png" alt-text="Screenshot of the delete button for a route from a route table.":::     

### Delete a route - commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network route-table route delete](/cli/azure/network/route-table/route#az-network-route-table-route-delete) |
| PowerShell | [Remove-AzRouteConfig](/powershell/module/az.network/remove-azrouteconfig) |

## View effective routes

The effective routes for each VM-attached network interface are a combination of route tables that you've created, Azure's default routes, and any routes propagated from on-premises networks via the Border Gateway Protocol (BGP) through an Azure virtual network gateway. Understanding the effective routes for a network interface is helpful when troubleshooting routing problems. You can view the effective routes for any network interface that's attached to a running VM.

1. Go to the [Azure portal](https://portal.azure.com) to manage your VMs. Search for and select **Virtual machines**.

1. In the virtual machine list, choose the VM you want to view effective routes for.

1. In the VM menu bar, choose **Networking**.

1. Select the name of a network interface.

1. In the network interface menu bar, select **Effective routes**.

    :::image type="content" source="./media/manage-route-table/effective-routes.png" alt-text="Screenshot of the effective routes for a network interface.":::

1. Review the list of effective routes to see whether the correct route exists for where you want to route traffic to. Learn more about next hop types that you see in this list in [Virtual network traffic routing](virtual-networks-udr-overview.md).

### View effective routes - commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network nic show-effective-route-table](/cli/azure/network/nic#az-network-nic-show-effective-route-table) |
| PowerShell | [Get-AzEffectiveRouteTable](/powershell/module/az.network/get-azeffectiveroutetable) |

## Validate routing between two endpoints

You can determine the next hop type between a virtual machine and the IP address of another Azure resource, an on-premises resource, or a resource on the Internet. Determining Azure's routing is helpful when troubleshooting routing problems. To complete this task, you must have an existing network watcher. If you don't have an existing network watcher, create one by completing the steps in [Create a Network Watcher instance](../network-watcher/network-watcher-create.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

1. Go to the [Azure portal](https://portal.azure.com) to manage your network watchers. Search for and select **Network Watcher**.

1. In the network watcher menu bar, choose **Next hop**.

1. In the **Network Watcher | Next hop** page:

    :::image type="content" source="./media/manage-route-table/add-route.png" alt-text="Screenshot of add a route page for a route table.":::

    | Setting | Value |
    |--|--|
    | Subscription | Select the **subscription** the source VM is in. |
    | Resource group | Select the **resource group** that contains the VM. |
    | Virtual machine | Select the **VM** you want to test against. |
    | Network interface | Select the **network interface** you want to test next hop from. |
    | Source IP address | The default **source IP** has been selected for you. You can change the source IP if the network interface has more than one. |
    | Destination IP address | Enter the **destination IP** to want to view the next hop for the VM. |

1. Select **Next hop**.

After a short wait, Azure tells you the next hop type and the ID of the route that routed the traffic. Learn more about next hop types that you see returned in [Virtual network traffic routing](virtual-networks-udr-overview.md).

### Validate routing between two endpoints - commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network watcher show-next-hop](/cli/azure/network/watcher#az-network-watcher-show-next-hop) |
| PowerShell | [Get-AzNetworkWatcherNextHop](/powershell/module/az.network/get-aznetworkwatchernexthop) |

## Permissions

To do tasks on route tables and routes, your account must be assigned to the [Network contributor role](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) or to a [Custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that's assigned the appropriate actions listed in the following table:

| Action                                                          |   Name                                                  |
|--------------------------------------------------------------   |   -------------------------------------------           |
| Microsoft.Network/routeTables/read                              |   Read a route table                                    |
| Microsoft.Network/routeTables/write                             |   Create or update a route table                        |
| Microsoft.Network/routeTables/delete                            |   Delete a route table                                  |
| Microsoft.Network/routeTables/join/action                       |   Associate a route table to a subnet                   |
| Microsoft.Network/routeTables/routes/read                       |   Read a route                                          |
| Microsoft.Network/routeTables/routes/write                      |   Create or update a route                              |
| Microsoft.Network/routeTables/routes/delete                     |   Delete a route                                        |
| Microsoft.Network/networkInterfaces/effectiveRouteTable/action  |   Get the effective route table for a network interface |
| Microsoft.Network/networkWatchers/nextHop/action                |   Gets the next hop from a VM                           |

## Next steps

- Create a route table using [PowerShell](powershell-samples.md) or [Azure CLI](cli-samples.md) sample scripts, or Azure [Resource Manager templates](template-samples.md)
- Create and assign [Azure Policy definitions](./policy-reference.md) for virtual networks
