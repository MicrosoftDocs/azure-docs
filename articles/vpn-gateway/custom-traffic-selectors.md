---
title: 'Custom traffic selectors for Azure VPN Gateway connections| Microsoft Docs'
description: Learn about how to use custom traffic selectors on VPN Gateway connections
services: vpn-gateway
author: radwiv

ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 10/17/2019
ms.author: radwiv

---
# Custom traffic selectors for VPN Gateway connections

You can set custom traffic selectors on your VPN gateway connections. The ability to set traffic selectors allows you to narrow down address spaces from both sides of the VPN tunnels on which you want to send traffic. Custom traffic selectors are particularly useful when you have a large VNet address space, but want to use one of your subnets for IPsec/IKE negotiation.

Custom traffic selectors can be added while creating a new connection, or can be updated for an existing connection. The `TrafficSelectorPolicies` parameter consists of an array of traffic selectors. Each traffic selector holds a collection of local and remote address ranges in CIDR format.

## Add custom traffic selectors

The following examples show how custom traffic selectors can be created for a virtual network gateway connection using PowerShell commands. For help on how to create virtual network gateway connection, see [Configure a site-to-site connection](vpn-gateway-create-site-to-site-rm-powershell.md).

1. Set values for the *trafficselectorpolicies* parameter in $trafficselectorpolicy. When setting this, notice that the *New-AzTrafficSelectorPolicy* value takes local and remote address ranges in an array.

   ```azurepowershell-interactive
   $trafficSelectorPolicy = New-AzTrafficSelectorPolicy `
   -LocalAddressRanges ("10.10.10.0/24", "20.20.20.0/24") `
   -RemoteAddressRanges ("30.30.30.0/24", "40.40.40.0/24")
   ```
2. Create new virtual network gateway connection. Adjust the value parameters for your requirements.

   ```azurepowershell-interactive
   New-AzVirtualNetworkGatewayConnection `
   -ResourceGroupName $rgname `
   -name $vnetConnectionName `
   -location $location `
   -VirtualNetworkGateway1 $vnetGateway `
   -LocalNetworkGateway2 $localnetGateway `
   -ConnectionType IPsec `
   -RoutingWeight 3 `
   -SharedKey $sharedKey `
   -UsePolicyBasedTrafficSelectors $true `
   -TrafficSelectorPolicies ($trafficSelectorPolicy)
   ```

You can also update custom traffic selectors for an existing virtual network gateway connection using 'Set-AzVirtualNetworkGatewayConnection'. For PowerShell values, see [virtual network gateway connection](https://docs.microsoft.com/powershell/module/az.network/new-azvirtualnetworkgatewayconnection?).

## Next steps

For more information about VPN gateways, see [About VPN Gateway](vpn-gateway-about-vpngateways.md).