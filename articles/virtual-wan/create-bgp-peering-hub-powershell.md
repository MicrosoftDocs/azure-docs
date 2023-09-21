---
title: 'Configure BGP peering to an NVA: PowerShell'
titleSuffix: Azure Virtual WAN
description: Learn how to create a BGP peering with Virtual WAN hub router using Azure PowerShell.
author: cherylmc
ms.service: virtual-wan
ms.custom: devx-track-azurepowershell
ms.topic: conceptual
ms.date: 09/08/2022
ms.author: cherylmc
---
# Configure BGP peering to an NVA - PowerShell

This article helps you configure an Azure Virtual WAN hub router to peer with a Network Virtual Appliance (NVA) in your virtual network using BGP Peering using Azure PowerShell. The virtual hub router learns routes from the NVA in a spoke VNet that is connected to a virtual WAN hub. The virtual hub router also advertises the virtual network routes to the NVA. For more information, see [Scenario: BGP peering with a virtual hub](scenario-bgp-peering-hub.md). You can also create this configuration using the [Azure portal](create-bgp-peering-hub-portal.md).

:::image type="content" source="./media/create-bgp-peering-hub-portal/diagram.png" alt-text="Diagram of configuration.":::

## Prerequisites

Verify that you've met the following criteria before beginning your configuration:

[!INCLUDE [Before you begin](../../includes/virtual-wan-before-include.md)]

### Azure PowerShell

[!INCLUDE [PowerShell](../../includes/vpn-gateway-cloud-shell-powershell-about.md)]

#### <a name="signin"></a>Sign in

[!INCLUDE [Sign in](../../includes/vpn-gateway-cloud-shell-ps-login.md)]

## Create a virtual WAN

```azurepowershell-interactive
$virtualWan = New-AzVirtualWan -ResourceGroupName "testRG" -Name "myVirtualWAN" -Location "West US"
```

## Create a virtual hub

A hub is a virtual network that can contain gateways for site-to-site, ExpressRoute, or point-to-site functionality. Once the hub is created, you'll be charged for the hub, even if you don't attach any sites.

```azurepowershell-interactive
$virtualHub = New-AzVirtualHub -VirtualWan $virtualWan -ResourceGroupName "testRG" -Name "westushub" -AddressPrefix "10.0.0.1/24"
```

## Connect the VNet to the hub

Create a connection between your hub and VNet.

```azurepowershell-interactive
$remote = Get-AzVirtualNetwork -Name "[vnet name]" -ResourceGroupName "[resource group name]"
$hubVnetConnection = New-AzVirtualHubVnetConnection -ResourceGroupName "[parent resource group name]" -VirtualHubName "[virtual hub name]" -Name "[name of connection]" -RemoteVirtualNetwork $remote
```

## Configure a BGP peer

Configure BGP peer for the $hubVnetConnection you created.

```azurepowershell-interactive
New-AzVirtualHubBgpConnection -ResourceGroupName "testRG" -VirtualHubName "westushub" -PeerIp 192.168.1.5 -PeerAsn 20000 -Name "testBgpConnection" -VirtualHubVnetConnection $hubVnetConnection
```

Or, you can configure BGP for an existing virtual hub VNet connection.

```azurepowershell-interactive
$hubVnetConnection = Get-AzVirtualHubVnetConnection -ResourceGroupName "[resource group name]" -VirtualHubName "[virtual hub name]" -Name "[name of connection]" 

New-AzVirtualHubBgpConnection -ResourceGroupName "[resource group name]" -VirtualHubName "westushub" -PeerIp 192.168.1.5 -PeerAsn 20000 -Name "testBgpConnection" -VirtualHubVnetConnection $hubVnetConnection
```

## Modify a BGP peer

Update an existing hub BGP peer connection.

```azurepowershell-interactive
Update-AzVirtualHubBgpConnection -ResourceGroupName "[resource group name]" -VirtualHubName "westushub" -PeerIp 192.168.1.6 -PeerAsn 20000 -Name "testBgpConnection" -VirtualHubVnetConnection $hubVnetConnection
```

## Delete a BGP peer

Remove an existing hub BGP connection.

```azurepowershell-interactive
Remove-AzVirtualHubBgpConnection -ResourceGroupName "[resource group name]" -VirtualHubName "westushub" -Name "testBgpConnection"
```

## Next steps

For more information about BGP scenarios, see [Scenario: BGP peering with a virtual hub](scenario-bgp-peering-hub.md).
