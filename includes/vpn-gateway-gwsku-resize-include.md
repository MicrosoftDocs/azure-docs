---
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 11/20/2023
 ms.author: cherylmc
---

You can use the `Resize-AzVirtualNetworkGateway` PowerShell cmdlet to upgrade or downgrade a Generation 1 or Generation 2 SKU. All VpnGw SKUs can be resized except Basic SKUs. If you're using the Basic gateway SKU, [use these instructions instead](../articles/vpn-gateway/vpn-gateway-about-skus-legacy.md#resize) to resize your gateway.

The following PowerShell example shows a gateway SKU being resized to VpnGw2.

```azurepowershell-interactive
$gw = Get-AzVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg
Resize-AzVirtualNetworkGateway -VirtualNetworkGateway $gw -GatewaySku VpnGw2
```
