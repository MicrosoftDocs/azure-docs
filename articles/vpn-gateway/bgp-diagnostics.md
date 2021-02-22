---
title: 'View BGP status and metrics'
titleSuffix: Azure VPN Gateway
description: View important BGP-related information for troubleshooting.
services: vpn-gateway
author: anzaman

ms.service: vpn-gateway
ms.devlang: powershell
ms.topic: sample
ms.date: 02/22/2021
ms.author: alzam

---

# View BGP metrics and status using PowerShell

Use **Get-AzVirtualNetworkGatewayBGPPeerStatus** to view all BGP peers and the status

[!INCLUDE [VPN Gateway PowerShell instructions](../../includes/vpn-gateway-cloud-shell-powershell-about.md)]

```azurepowershell-interactive
Get-AzVirtualNetworkGatewayBgpPeerStatus -ResourceGroupName resourceGroup -VirtualNetworkGatewayName gatewayName

Asn               : 65515
ConnectedDuration : 9.01:04:53.5768637
LocalAddress      : 10.1.0.254
MessagesReceived  : 14893
MessagesSent      : 14900
Neighbor          : 10.0.0.254
RoutesReceived    : 1
State             : Connected
```

Use **Get-AzVirtualNetworkGatewayLearnedRoute** to view all the routes that the gateway has learnt through BGP.

```azurepowershell-interactive
Get-AzVirtualNetworkGatewayLearnedRoute -ResourceGroupName resourceGroup -VirtualNetworkGatewayname gatewayName

AsPath       :
LocalAddress : 10.1.0.254
Network      : 10.1.0.0/16
NextHop      :
Origin       : Network
SourcePeer   : 10.1.0.254
Weight       : 32768

AsPath       :
LocalAddress : 10.1.0.254
Network      : 10.0.0.254/32
NextHop      :
Origin       : Network
SourcePeer   : 10.1.0.254
Weight       : 32768

AsPath       : 65515
LocalAddress : 10.1.0.254
Network      : 10.0.0.0/16
NextHop      : 10.0.0.254
Origin       : EBgp
SourcePeer   : 10.0.0.254
Weight       : 32768
```

Use **Get-AzVirtualNetworkGatewayAdvertisedRoute** to view all the routes that the gateway is advertising to its peers through BGP.

```azurepowershell-interactive
Get-AzVirtualNetworkGatewayAdvertisedRoute -VirtualNetworkGatewayName gatewayName -ResourceGroupName resourceGroupName -Peer 10.0.0.254
```

## Clean up resources

When you no longer need the resources you created, use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to delete the resource group. This command deletes the resource group and all of the resources it contains.

```azurepowershell-interactive
Remove-AzResourceGroup -Name ResourceGroupName
```

## Next steps

For more information about the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).
