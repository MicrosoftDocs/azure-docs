---
title: VPN Gateway legacy SKUs
description: How to work with the old virtual network gateway SKUs; Basic, Standard, and High Performance.
author: cherylmc
ms.service: vpn-gateway
ms.topic: article
ms.date: 12/20/2023
ms.author: cherylmc 
---
# Working with VPN Gateway legacy SKUs

This article contains information about the legacy (old) virtual network gateway SKUs. The legacy SKUs still work in both deployment models for VPN gateways that have already been created. Classic VPN gateways continue to use the legacy SKUs, both for existing gateways, and for new gateways. When creating new Resource Manager VPN gateways, use the new gateway SKUs. For information about the new SKUs, see [About VPN Gateway](vpn-gateway-about-vpngateways.md).

## <a name="gwsku"></a>Legacy gateway SKUs

[!INCLUDE [Legacy gateway SKUs](../../includes/vpn-gateway-gwsku-legacy-include.md)]

You can view legacy gateway pricing in the **Virtual Network Gateways** section, which is located on the [ExpressRoute pricing page](https://azure.microsoft.com/pricing/details/expressroute).

For SKU deprecation, see the [SKU deprecation](#sku-deprecation) and SKU deprecation [FAQs](#sku-deprecation-faqs) sections of this article.

## <a name="agg"></a>Estimated aggregate throughput by SKU

[!INCLUDE [Aggregated throughput by legacy SKU](../../includes/vpn-gateway-table-gwtype-legacy-aggtput-include.md)]

## <a name="config"></a>Supported configurations by SKU and VPN type

[!INCLUDE [Table requirements for old SKUs](../../includes/vpn-gateway-table-requirements-legacy-sku-include.md)]

## Resize, migrate, and change SKUs

### <a name="resize"></a>Resize a gateway SKU

Resizing a gateway SKU incurs less downtime and fewer configuration changes than the process to change to a new SKU. However, there are limitations. You can only resize your gateway to a gateway SKU within the same SKU family (except for the Basic SKU).

For example, if you have a Standard SKU, you can resize to a High Performance SKU. However, you can't resize your VPN gateway between the old SKUs and the new SKU families. You can't go from a Standard SKU to a VpnGw2 SKU, or from a Basic SKU to VpnGw1 by resizing. For more information, see [Resize a gateway SKU](gateway-sku-resize.md).

**Resource Manager**

You can resize a gateway for the [Resource Manager deployment model](../azure-resource-manager/management/deployment-models.md) using the Azure portal or PowerShell. For PowerShell, use the following command:

```powershell
$gw = Get-AzVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg
Resize-AzVirtualNetworkGateway -VirtualNetworkGateway $gw -GatewaySku HighPerformance
```

**Classic**

To resize a gateway for the [classic deployment model](../azure-resource-manager/management/deployment-models.md), you must use the Service Management PowerShell cmdlets. Use the following command:

```powershell
Resize-AzureVirtualNetworkGateway -GatewayId <Gateway ID> -GatewaySKU HighPerformance
```

### <a name="migrate"></a>Migrate a gateway SKU

A gateway SKU migration process is similar to a resize. It requires fewer steps and configuration changes than changing to a new gateway SKU. At this time, gateway SKU migration isn't available. You can migrate a deprecated legacy gateway SKU December 2024 through September 30, 2025. We'll make a migration path available along with detailed documentation.

### <a name="change"></a>Change to the new gateway SKUs

Standard and High Performance SKUs will be deprecated September 30, 2025. The product team will make a migration path available for legacy SKUs. See the [Legacy SKU deprecation](#sku-deprecation) section for more information. You can choose to change from a legacy SKU to one of the new SKUs at any point. However, changing to a new SKU requires more steps than migrating and incurs more downtime.

[!INCLUDE [Change to the new SKUs](../../includes/vpn-gateway-gwsku-change-legacy-sku-include.md)]

## SKU deprecation

The Standard and High Performance SKUs will be deprecated on September 30, 2025. The product team will make a migration path available for these SKUs by November 30, 2024. **At this time, there's no action that you need to take**.

* View the [Announcement](https://go.microsoft.com/fwlink/?linkid=2255127)
* See the SKU deprecation [FAQs](#sku-deprecation-faqs)

When the migration path becomes available, you can migrate your legacy SKUs to the following SKUs:

* **Standard SKU:** -> **VpnGw1**
* **High Performance SKU:** -> **VpnGw2**

There are no [price](https://azure.microsoft.com/pricing/details/vpn-gateway/) changes if you migrate to Standard (VpnGw1) and High Performance (VpnGw2) gateways. As a benefit, there's a performance improvement after migrating:

* **Standard SKU:** 6.5x
* **High Performance SKU:** 5x

If you don't migrate your gateway SKUs by September 30, 2025, your gateway will be automatically migrated and upgraded to an AZ gateway SKU:

* **Standard SKU:** -> **VpnGw1AZ**
* **High Performance SKU:** -> **VpnGw2AZ**

Important Dates:

* **December 1, 2023**: No new gateway creations are possible using Standard or High Performance SKUs.
* **November 30, 2024**: Begin migrating gateways to other SKUs.
* **September 30, 2025**: Standard/High Performance SKUs will be retired and remaining deprecated legacy gateways will be automatically migrated and upgraded to AZ SKUs.

## SKU deprecation FAQs

[!INCLUDE [legacy SKU deprecation](../../includes/vpn-gateway-deprecate-sku-faq.md)]

## Next steps

For more information about the new Gateway SKUs, see [Gateway SKUs](vpn-gateway-about-vpngateways.md#gwsku).

For more information about configuration settings, see [About VPN Gateway configuration settings](vpn-gateway-about-vpn-gateway-settings.md).
