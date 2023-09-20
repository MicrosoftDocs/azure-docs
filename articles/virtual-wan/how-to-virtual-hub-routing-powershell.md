---
title: 'How to configure virtual hub routing: Azure PowerShell'
titleSuffix: Azure Virtual WAN
description: Learn how to configure Virtual WAN virtual hub routing using Azure PowerShell.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 10/26/2022
ms.author: cherylmc
---
# How to configure virtual hub routing - Azure PowerShell

A virtual hub can contain multiple gateways such as a site-to-site VPN gateway, ExpressRoute gateway, point-to-site gateway, and Azure Firewall. The routing capabilities in the virtual hub are provided by a router that manages all routing, including transit routing, between the gateways using Border Gateway Protocol (BGP). The virtual hub router also provides transit connectivity between virtual networks that connect to a virtual hub and can support up to an aggregate throughput of 50 Gbps. These routing capabilities apply to customers using **Standard** Virtual WANs. For more information, see [About virtual hub routing](about-virtual-hub-routing.md).

This article helps you configure virtual hub routing using Azure PowerShell. You can also configure virtual hub routing using the [Azure portal steps](how-to-virtual-hub-routing.md).

## Create a route table

1. Get the virtual hub details to create route table.

   ```azurepowershell-interactive
   $virtualhub = Get-AzVirtualHub -ResourceGroupName "[resource group name]" -Name "[virtualhub name]"
   ```

1. Get VNet connection details to be used as next hop.

   ```azurepowershell-interactive
   $hubVnetConnection = Get-AzVirtualHubVnetConnection -Name "[HubconnectionName]" -ParentResourceName "[Hub Name]" -ResourceGroupName "[resource group name]"
   ```

1. Create a route to be associated with the virtual hub $virtualhub. The **-NextHop** is the virtual network connection $hubVnetConnection.  Nexthop can be list of virtual network connections or Azure Firewall.

   ```azurepowershell-interactive
   $route = New-AzVHubRoute -Name "[Route Name]" -Destination “[@("Destination prefix")]” -DestinationType "CIDR" -NextHop $hubVnetConnection.Id -NextHopType "ResourceId"
   ```

1. Create the route table using the route object created in the previous step, $route, and associate it to the virtual hub $virtualhub.

   ```azurepowershell-interactive
   New-AzVHubRouteTable -Name "testRouteTable" -ParentObject $virtualhub -Route @($route) -Label @("testLabel")
   ```

## Delete a route table

```azurepowershell-interactive
Remove-AzVirtualHubRouteTable -ResourceGroupName "[resource group name]" -HubName "virtualhubname" -Name "routeTablename"
```

## Update a route table

The steps in this section help you update a route table. For example, update an existing route's next hop to an existing Azure Firewall.

```azurepowershell-interactive
$firewall = Get-AzFirewall -Name "[firewall name]]" -ResourceGroupName "[resource group name]"
$newroute = New-AzVHubRoute -Name "[Route Name]" -Destination @("0.0.0.0/0") -DestinationType "CIDR" -NextHop $firewall.Id -NextHopType "ResourceId"
Update-AzVHubRouteTable -ResourceGroupName "[resource group name]" -VirtualHubName ["virtual hub name"] -Name ["route table name"] -Route @($newroute)
```

## Configure routing for a virtual network connection

The steps in this section help you set up routing configuration for a virtual network connection. For example, adding static routes to an NVA appliance.

* For this configuration, the route name should be the same as the one you used when you added a route earlier. Otherwise, you'll create two routes in the routing table: one without an IP address and one with an IP address.
* The destination prefix can be one CIDR or multiple ones. For a single CIDR, use this format: `@("10.19.2.0/24")`. For multiple CIDRs, use this format: `@("10.19.2.0/24", "10.40.0.0/16")`.

1. Define a static route to an NVA IP address.

   ```azurepowershell-interactive
   $staticRoute = New-AzStaticRoute -Name "[Route Name]" -A-AddressPrefix "[@("Destination prefix")]" -NextHopIpAddress "[Destination NVA IP address]" -NextHopIpAddress "[Destination NVA IP address]" 
   ```

1. Define routing configuration.

   ```azurepowershell-interactive
   $associatedTable = Get-AzVHubRouteTable -ResourceGroupName "[resource group name]" -VirtualHubName $virtualhub.Name -Name "defaultRouteTable"
   $propagatedTable = Get-AzVHubRouteTable -ResourceGroupName "[resource group name]" -VirtualHubName $virtualhub.Name -Name "noneRouteTable"
   $updatedRoutingConfiguration= New-AzRoutingConfiguration -AssociatedRouteTable $associatedTable.Id -Label @("testLabel") -Id @($propagatedTable.Id) -StaticRoute @($staticRoute)
   ```

> [!NOTE]
> For updates, when using the `New-AzRoutingConfiguration`, all exisiting cofiguration needs to be provided, such as AssociatedRouteTables, Labels and/or StaticRoutes.
> This command creates a new configuration, which will overwrite existing configurations, when the `Update-AzVirtualHubVnetConnection` is executed.


1. Update the existing virtual network connection.

   ```azurepowershell-interactive
   Update-AzVirtualHubVnetConnection -ResourceGroupName "[resource group name]" -VirtualHubName $virtualhub.Name -Name "[Virtual hub connection name]" -RoutingConfiguration $updatedRoutingConfiguration
   ```

1. Verify static route on the virtual network connection.

   ```azurepowershell-interactive
   Get-AzVirtualHubVnetConnection -ResourceGroupName "[Resource group name]" -VirtualHubName "[virtual hub name]" -Name "[Virtual hub connection name]"
   ```

## Next steps

* For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
* For more information about Virtual WAN, see the [Virtual WAN FAQ](virtual-wan-faq.md).
