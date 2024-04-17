---
title: 'Create and set custom IPsec policies for Point-to-Site: PowerShell'
titleSuffix: Azure VPN Gateway
description: This article helps you create and set custom IPSec policies for VPN Gateway P2S configurations.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 03/18/2024
ms.author: cherylmc 
ms.custom: devx-track-azurepowershell
---

# Create and set custom IPsec policies for point-to-site connections

If your point-to-site (P2S) VPN environment requires a custom IPsec policy for encryption, you can easily configure a policy object with the required settings. This article helps you create a custom policy object, and then set it using PowerShell.

## Before you begin

### Prerequisites

Verify that your environment meets the following prerequisites:

* You have a functioning point-to-site VPN already configured. If you don't, configure one using the steps the **Create a point-to-site VPN**  article using either [PowerShell](vpn-gateway-howto-point-to-site-rm-ps.md), or the [Azure portal](vpn-gateway-howto-point-to-site-resource-manager-portal.md).

### Working with Azure PowerShell

[!INCLUDE [PowerShell](../../includes/vpn-gateway-cloud-shell-powershell.md)]

## Create and set a policy

1. Declare the variables that you want to use. Use the following sample, replacing the values for your own when necessary. If you close your PowerShell/Cloud Shell session at any point during the exercise, just copy and paste the values again to redeclare the variables.

   ```azurepowershell-interactive
   $RG = "TestRG"
   $GWName = "VNet1GW"
   ```

1. Create a custom IPsec policy object. Adjust the values in the example to meet your requirements.

   ```azurepowershell-interactive
   $vpnclientipsecpolicy = New-AzVpnClientIpsecPolicy -IpsecEncryption AES256 -IpsecIntegrity SHA256 -SALifeTime 86471 -SADataSize 429496 -IkeEncryption AES256 -IkeIntegrity SHA384 -DhGroup DHGroup2 -PfsGroup PFS2
   ```

1. Update your existing P2S VPN gateway and set the IPsec policy.

   ```azurepowershell-interactive
   $gateway = Get-AzVirtualNetworkGateway -ResourceGroupName $RG -name $GWName
   Set-AzVirtualNetworkGateway -VirtualNetworkGateway $gateway -VpnClientIpsecPolicy $vpnclientipsecpolicy
   ```

## Next steps

For more information about P2S configurations, see [About point-to-site VPN](point-to-site-about.md).
