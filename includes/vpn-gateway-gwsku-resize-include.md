---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 03/15/2019
 ms.author: cherylmc
 ms.custom: include file
---

For the current SKUs (VpnGw1, VpnGw2, and VPNGW3) you want to resize your gateway SKU to upgrade to a more powerful one, you can use the `Resize-AzVirtualNetworkGateway` PowerShell cmdlet. You can also downgrade the gateway SKU size using this cmdlet. If you are using the Basic gateway SKU, [use these instructions instead](../articles/vpn-gateway/vpn-gateway-about-skus-legacy.md#resize) to resize your gateway.

The following PowerShell example shows a gateway SKU being resized to VpnGw2.

```azurepowershell-interactive
$gw = Get-AzVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg
Resize-AzVirtualNetworkGateway -VirtualNetworkGateway $gw -GatewaySku VpnGw2
```

You can also resize a gateway in the Azure portal by going to the **Configuration** page for your virtual network gateway and selecting a different SKU from the dropdown.