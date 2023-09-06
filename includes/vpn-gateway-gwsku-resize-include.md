---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 11/04/2019
 ms.author: cherylmc
ms.custom: include file
---

You can use the `Resize-AzVirtualNetworkGateway` PowerShell cmdlet to upgrade or downgrade a Generation1 or Generation2 SKU (all VpnGw SKUs can be resized except Basic SKUs). If you are using the Basic gateway SKU, [use these instructions instead](../articles/vpn-gateway/vpn-gateway-about-skus-legacy.md#resize) to resize your gateway.

The following PowerShell example shows a gateway SKU being resized to VpnGw2.

```azurepowershell-interactive
$gw = Get-AzVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg
Resize-AzVirtualNetworkGateway -VirtualNetworkGateway $gw -GatewaySku VpnGw2
```
