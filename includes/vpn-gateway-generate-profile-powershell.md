---
 author: cherylmc
 ms.service: vpn-gateway
ms.custom: devx-track-azurepowershell
 ms.topic: include
 ms.date: 12/01/2022
 ms.author: cherylmc
---

When you generate VPN client configuration files, the value for '-AuthenticationMethod' is 'EapTls'. Generate the VPN client configuration files using the following command:

```azurepowershell-interactive
$profile=New-AzVpnClientConfiguration -ResourceGroupName "TestRG" -Name "VNet1GW" -AuthenticationMethod "EapTls"

$profile.VPNProfileSASUrl
```
