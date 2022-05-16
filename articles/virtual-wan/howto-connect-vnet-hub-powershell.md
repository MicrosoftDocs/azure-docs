---
title: 'Connect a VNet to a Virtual WAN hub - PowerShell'
titleSuffix: Azure Virtual WAN
description: Learn how to connect a VNet to a Virtual WAN hub using PowerShell.
author: reasuquo
ms.service: virtual-wan
ms.topic: how-to
ms.date: 05/13/2022
ms.author: reasuquo

---
# Connect a virtual network to a Virtual WAN hub - PowerShell

This article helps you connect your virtual network to your virtual hub using PowerShell. You can also use the [Azure portal](howto-connect-vnet-hub.md) to complete this task. Repeat these steps for each VNet that you want to connect.

> [!NOTE]
>
> * A virtual network can only be connected to one virtual hub at a time.
> * In order to connect it to a virtual hub, the remote virtual network can't have a gateway.

## Prerequisites

* Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).
* This tutorial creates a NAT rule on a VPN gateway that will be associated with a VPN site connection. The steps assume that you have an existing Virtual WAN VPN gateway connection to two branches with overlapping address spaces.

### Azure PowerShell

[!INCLUDE [PowerShell](../../includes/vpn-gateway-cloud-shell-powershell-about.md)]

## <a name="signin"></a>Sign in

[!INCLUDE [sign in](../../includes/vpn-gateway-cloud-shell-ps-login.md)]

## Add a connection

1. Declare the variables for the existing resources including the existing Virtual Network.

   ```azurepowershell-interactive
   $resourceGroup = Get-AzResourceGroup -ResourceGroupName "testRG" 
   $virtualWan = Get-AzVirtualWan -ResourceGroupName "testRG" -Name "myVirtualWAN"
   $virtualHub = Get-AzVirtualHub -ResourceGroupName "testRG" -Name "westushub"
   $remoteVirtualNetwork = Get-AzVirtualNetwork -Name "MyVirtualNetwork" -ResourceGroupName "testRG" 
   ```

1. You can create a connection between a new virtual network or an already existing virtual network to peer the Virtual Network to the Virtual Hub. To create the connection:

   ```azurepowershell-interactive
   New-AzVirtualHubVnetConnection -ResourceGroupName "testRG" -VirtualHubName "westushub" -Name "testvnetconnection" -RemoteVirtualNetwork $remoteVirtualNetwork
   ```

## Next steps

For more information about Virtual WAN, see the [Virtual WAN FAQ](virtual-wan-faq.md).