---
title: 'View BGP status and metrics'
titleSuffix: Azure VPN Gateway
description: Learn how to view important BGP-related information for troubleshooting.
author: cherylmc
ms.service: vpn-gateway
ms.topic: sample
ms.date: 03/10/2021
ms.author: cherylmc 
ms.custom:
---

# View BGP metrics and status

You can view BGP metrics and status by using the Azure portal, or by using Azure PowerShell.

## Azure portal

In the Azure portal, you can view BGP peers, learned routes, and advertised routes. You can also download .csv files containing this data.

1. In the [Azure portal](https://portal.azure.com), navigate to your virtual network gateway.
1. Under **Monitoring**, select **BGP peers** to open the BGP peers page.

   :::image type="content" source="./media/bgp-diagnostics/bgp-portal.jpg" alt-text="Screenshot of metrics in the Azure portal.":::

### Learned routes

1. You can view up to 50 learned routes in the portal.

   :::image type="content" source="./media/bgp-diagnostics/learned-routes.jpg" alt-text="Screenshot of learned routes.":::

1. You can also download the learned routes file. If you have more than 50 learned routes, the only way to view all of them is by downloading and viewing the .csv file. To download, select **Download learned routes**.

   :::image type="content" source="./media/bgp-diagnostics/download-routes.jpg" alt-text="Screenshot of downloading learned routes.":::
1. Then, view the file.

   :::image type="content" source="./media/bgp-diagnostics/learned-routes-file.jpg" alt-text="Screenshot of downloaded learned routes.":::

### Advertised routes

1. To view advertised routes, select the **...** at the end of the network that you want to view, then click **View advertised routes**.

   :::image type="content" source="./media/bgp-diagnostics/select-route.png" alt-text="Screenshot showing how to view advertised routes." lightbox="./media/bgp-diagnostics/route-expand.png":::
1. On the **Routes advertised to peer** page, you can view up to 50 advertised routes.

   :::image type="content" source="./media/bgp-diagnostics/advertised-routes.jpg" alt-text="Screenshot of advertised routes.":::
1. You can also download the advertised routes file. If you have more than 50 advertised routes, the only way to view all of them is by downloading and viewing the .csv file. To download, select **Download advertised routes**.

   :::image type="content" source="./media/bgp-diagnostics/download-advertised.jpg" alt-text="Screenshot of selecting downloaded advertised routes.":::
1. Then, view the file.

   :::image type="content" source="./media/bgp-diagnostics/advertised-routes-file.jpg" alt-text="Screenshot of downloaded advertised routes.":::

### BGP peers

1. You can view up to 50 BGP peers in the portal.

   :::image type="content" source="./media/bgp-diagnostics/peers.jpg" alt-text="Screenshot of BGP peers.":::
1. You can also download the BGP peers file. If you have more than 50 BGP peers, the only way to view all of them is by downloading and viewing the .csv file. To download, select **Download BGP peers** on the portal page.

   :::image type="content" source="./media/bgp-diagnostics/download-peers.jpg" alt-text="Screenshot of downloading BGP peers.":::
1. Then, view the file.

   :::image type="content" source="./media/bgp-diagnostics/peers-file.jpg" alt-text="Screenshot of downloaded BGP peers.":::

## PowerShell

Use **Get-AzVirtualNetworkGatewayBGPPeerStatus** to view all BGP peers and the status.

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

## Rest API

You can also use the GetBgpPeerStatus [Rest API call](/rest/api/network-gateway/virtual-network-gateways/get-bgp-peer-status) to retrieve the information. This is an Async operation and will return a 202 status code. You need to fetch the results via a separate GET call. For more information, see [Azure-AsyncOperation request and response](../azure-resource-manager/management/async-operations.md#azure-asyncoperation-request-and-response).

## Next steps

For more information about BGP, see [Configure BGP for VPN Gateway](bgp-howto.md).
