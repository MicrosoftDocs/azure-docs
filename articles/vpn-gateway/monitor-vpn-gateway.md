---
title: Monitor Azure VPN Gateway
description: Start here to learn how to monitor Azure VPN Gateway by using Azure Monitor metrics and resource logs.
ms.date: 07/26/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: cherylmc
ms.author: cherylmc
ms.service: azure-vpn-gateway
---
# Monitor Azure VPN Gateway

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

For more information about the resource types for VPN Gateway, see [Azure VPN Gateway monitoring data reference](monitor-vpn-gateway-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

See [Create diagnostic setting to collect platform logs and metrics in Azure](../azure-monitor/essentials/diagnostic-settings.md) for the detailed process for creating a diagnostic setting using the Azure portal, CLI, or PowerShell. When you create a diagnostic setting, you specify which categories of logs to collect. The categories for VPN Gateway are listed in [VPN Gateway monitoring data reference](monitor-vpn-gateway-reference.md).

> [!IMPORTANT]
> Enabling these settings requires additional Azure services (storage account, event hub, or Log Analytics), which might increase your cost. To calculate an estimated cost, visit the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator).

Data in Azure Monitor Logs is stored in tables where each table has its own set of unique properties.  

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for VPN Gateway, see [Azure VPN Gateway monitoring data reference](monitor-vpn-gateway-reference.md#metrics).

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the log schemas for VPN Gateway, see [Azure VPN Gateway monitoring data reference](monitor-vpn-gateway-reference.md#resource-logs).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### VPN Gateway alert rules

You can set alerts for any metric, log entry, or activity log entry listed in the [Azure VPN Gateway monitoring data reference](monitor-vpn-gateway-reference.md).

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## View BGP metrics and status

You can view BGP metrics and status by using the Azure portal, or by using Azure PowerShell.

### Azure portal

In the Azure portal, you can view BGP peers, learned routes, and advertised routes. You can also download .csv files containing this data.

1. In the [Azure portal](https://portal.azure.com), navigate to your virtual network gateway.
1. Under **Monitoring**, select **BGP peers** to open the BGP peers page.

   :::image type="content" source="./media/bgp-diagnostics/bgp-portal.jpg" alt-text="Screenshot of metrics in the Azure portal.":::

#### Learned routes

1. You can view up to 50 learned routes in the portal.

   :::image type="content" source="./media/bgp-diagnostics/learned-routes.jpg" alt-text="Screenshot of learned routes.":::

1. You can also download the learned routes file. If you have more than 50 learned routes, the only way to view all of them is by downloading and viewing the .csv file. To download, select **Download learned routes**.

   :::image type="content" source="./media/bgp-diagnostics/download-routes.jpg" alt-text="Screenshot of downloading learned routes.":::
1. Then, view the file.

   :::image type="content" source="./media/bgp-diagnostics/learned-routes-file.jpg" alt-text="Screenshot of downloaded learned routes.":::

#### Advertised routes

1. To view advertised routes, select the **...** at the end of the network that you want to view, then select **View advertised routes**.

   :::image type="content" source="./media/bgp-diagnostics/select-route.png" alt-text="Screenshot showing how to view advertised routes." lightbox="./media/bgp-diagnostics/route-expand.png":::
1. On the **Routes advertised to peer** page, you can view up to 50 advertised routes.

   :::image type="content" source="./media/bgp-diagnostics/advertised-routes.jpg" alt-text="Screenshot of advertised routes.":::
1. You can also download the advertised routes file. If you have more than 50 advertised routes, the only way to view all of them is by downloading and viewing the .csv file. To download, select **Download advertised routes**.

   :::image type="content" source="./media/bgp-diagnostics/download-advertised.jpg" alt-text="Screenshot of selecting downloaded advertised routes.":::
1. Then, view the file.

   :::image type="content" source="./media/bgp-diagnostics/advertised-routes-file.jpg" alt-text="Screenshot of downloaded advertised routes.":::

#### BGP peers

1. You can view up to 50 BGP peers in the portal.

   :::image type="content" source="./media/bgp-diagnostics/peers.jpg" alt-text="Screenshot of BGP peers.":::
1. You can also download the BGP peers file. If you have more than 50 BGP peers, the only way to view all of them is by downloading and viewing the .csv file. To download, select **Download BGP peers** on the portal page.

   :::image type="content" source="./media/bgp-diagnostics/download-peers.jpg" alt-text="Screenshot of downloading BGP peers.":::
1. Then, view the file.

   :::image type="content" source="./media/bgp-diagnostics/peers-file.jpg" alt-text="Screenshot of downloaded BGP peers.":::

### PowerShell

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

Use **Get-AzVirtualNetworkGatewayLearnedRoute** to view all the routes that the gateway learned through BGP.

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

### Rest API

You can also use the GetBgpPeerStatus [Rest API call](/rest/api/network-gateway/virtual-network-gateways/get-bgp-peer-status) to retrieve the information. This Async operation returns a 202 status code. You need to fetch the results via a separate GET call. For more information, see [Azure-AsyncOperation request and response](../azure-resource-manager/management/async-operations.md#azure-asyncoperation-request-and-response).

## Related content

- See [Azure VPN Gateway monitoring data reference](monitor-vpn-gateway-reference.md) for a reference of the metrics, logs, and other important values created for VPN Gateway.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
