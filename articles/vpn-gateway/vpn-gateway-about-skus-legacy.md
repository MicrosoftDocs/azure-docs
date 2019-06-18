---
title: Legacy Azure virtual network VPN gateway SKUs | Microsoft Docs
description: How to work with the old virtual network gateway SKUs; Basic, Standard, and HighPerformance.
services: vpn-gateway
documentationcenter: na
author: cherylmc
manager: jpconnock
editor: ''
tags: azure-resource-manager,azure-service-management

ms.assetid: 
ms.service: vpn-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/10/2019
ms.author: cherylmc

---
# Working with virtual network gateway SKUs (legacy SKUs)

This article contains information about the legacy (old) virtual network gateway SKUs. The legacy SKUs still work in both deployment models for VPN gateways that have already been created. Classic VPN gateways continue to use the legacy SKUs, both for existing gateways, and for new gateways. When creating new Resource Manager VPN gateways, use the new gateway SKUs. For information about the new SKUs, see [About VPN Gateway](vpn-gateway-about-vpngateways.md).

## <a name="gwsku"></a>Gateway SKUs

[!INCLUDE [Legacy gateway SKUs](../../includes/vpn-gateway-gwsku-legacy-include.md)]

You can view legacy gateway pricing in the **Virtual Network Gateways** section, which is located in on the [ExpressRoute pricing page](https://azure.microsoft.com/pricing/details/expressroute).

## <a name="agg"></a>Estimated aggregate throughput by SKU

[!INCLUDE [Aggregated throughput by legacy SKU](../../includes/vpn-gateway-table-gwtype-legacy-aggtput-include.md)]

## <a name="config"></a>Supported configurations by SKU and VPN type

[!INCLUDE [Table requirements for old SKUs](../../includes/vpn-gateway-table-requirements-legacy-sku-include.md)]

## <a name="resize"></a>Resize a gateway

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

You can resize your gateway to a gateway SKU within the same SKU family. For example, if you have a Standard SKU, you can resize to a HighPerformance SKU. However, you can't resize your VPN gateway between the old SKUs and the new SKU families. For example, you can't go from a Standard SKU to a VpnGw2 SKU, or a Basic SKU to VpnGw1.

To resize a gateway for the classic deployment model, use the following command:

```powershell
Resize-AzureVirtualNetworkGateway -GatewayId <Gateway ID> -GatewaySKU HighPerformance
```

To resize a gateway for the Resource Manager deployment model using PowerShell, use the following command:

```powershell
$gw = Get-AzVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg
Resize-AzVirtualNetworkGateway -VirtualNetworkGateway $gw -GatewaySku HighPerformance
```
You can also resize a gateway in the Azure portal.

## <a name="change"></a>Change to the new gateway SKUs

[!INCLUDE [Change to the new SKUs](../../includes/vpn-gateway-gwsku-change-legacy-sku-include.md)]

## Next steps

For more information about the new Gateway SKUs, see [Gateway SKUs](vpn-gateway-about-vpngateways.md#gwsku).

For more information about configuration settings, see [About VPN Gateway configuration settings](vpn-gateway-about-vpn-gateway-settings.md).
