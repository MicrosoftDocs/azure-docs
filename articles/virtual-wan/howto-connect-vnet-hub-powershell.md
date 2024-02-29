---
title: 'Connect a VNet to a Virtual WAN hub - PowerShell'
titleSuffix: Azure Virtual WAN
description: Learn how to connect a VNet to a Virtual WAN hub using PowerShell.
author: cherylmc
ms.service: virtual-wan
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 06/15/2023
ms.author: cherylmc
---
# Connect a virtual network to a Virtual WAN hub - PowerShell

This article helps you connect your virtual network to your virtual hub using PowerShell. You can also use [Azure portal](howto-connect-vnet-hub.md) to complete this task. Repeat these steps for each VNet that you want to connect.

Before you create a connection, be aware of the following:

* A virtual network can only be connected to one virtual hub at a time.
* In order to connect it to a virtual hub, the remote virtual network can't have a gateway.

* Some configuration settings, such as **Propagate static route**, can only be configured in the Azure portal at this time. See the [Azure portal](howto-connect-vnet-hub.md) version of this article for steps.

> [!IMPORTANT]
> If VPN gateways are present in the virtual hub, this operation as well as any other write operation on the connected VNet can cause disconnection to point-to-site clients as well as reconnection of site-to-site tunnels and BGP sessions.

## Prerequisites

* Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).
* The following steps assume that you have already created a [site-to-site Virtual WAN VPN gateway](site-to-site-powershell.md).

### Azure PowerShell

[!INCLUDE [PowerShell](../../includes/vpn-gateway-cloud-shell-powershell-about.md)]

## <a name="signin"></a>Sign in

[!INCLUDE [sign in](../../includes/vpn-gateway-cloud-shell-ps-login.md)]

## Add a connection

1. Declare the variables for the existing resources, including the existing virtual network.

   ```azurepowershell-interactive
   $resourceGroup = Get-AzResourceGroup -ResourceGroupName "TestRG" 
   $virtualWan = Get-AzVirtualWan -ResourceGroupName "TestRG" -Name "TestVWAN1"
   $virtualHub = Get-AzVirtualHub -ResourceGroupName "TestRG" -Name "Hub1"
   $remoteVirtualNetwork = Get-AzVirtualNetwork -Name "VNet1" -ResourceGroupName "TestRG" 
   ```

1. Create a connection to peer the virtual network to the virtual hub.

   ```azurepowershell-interactive
   New-AzVirtualHubVnetConnection -ResourceGroupName "TestRG" -VirtualHubName "Hub1" -Name "VNet1-connection" -RemoteVirtualNetwork $remoteVirtualNetwork
   ```

## Next steps

For more information about Virtual WAN, see the [Virtual WAN FAQ](virtual-wan-faq.md).
