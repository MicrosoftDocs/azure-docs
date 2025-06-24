---
title: VPN Gateway legacy SKUs
description: How to work with the old virtual network gateway SKUs; Standard, and High Performance.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 06/23/2025
ms.author: cherylmc

#customer intent: As an Azure administrator, I want to understand the legacy SKU deprecation timeline so that I can plan for the automatic migration.

---
# Working with VPN Gateway legacy SKUs

This article contains information about the legacy (old) virtual network gateway SKUs. The legacy SKUs still work in both deployment models for existing VPN gateways. Classic VPN gateways continue to use the legacy SKUs, both for existing gateways, and for new gateways. When creating new Resource Manager VPN gateways, use the new gateway SKUs. For information about the new SKUs, see [About VPN Gateway](vpn-gateway-about-vpngateways.md). For the projected gateway SKU deprecation/migration timeline, see the [What's new?](whats-new.md) article.

## <a name="gwsku"></a>Legacy gateway SKUs

[!INCLUDE [Legacy gateway SKUs](../../includes/vpn-gateway-gwsku-legacy-include.md)]

You can view legacy gateway pricing in the **Virtual Network Gateways** section, which is located on the [ExpressRoute pricing page](https://azure.microsoft.com/pricing/details/expressroute).

For SKU deprecation, see the [SKU deprecation](#sku-deprecation) and SKU deprecation [FAQs](#sku-deprecation-faqs) sections of this article.

## <a name="agg"></a>Estimated aggregate throughput by SKU

The following table shows the gateway types and the estimated aggregate throughput by gateway SKU. This table applies to the Resource Manager and classic deployment models.

Pricing differs between gateway SKUs. For more information, see [VPN Gateway Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway).

The UltraPerformance gateway SKU isn't represented in this table. For information about the UltraPerformance SKU, see the [ExpressRoute](../expressroute/expressroute-about-virtual-network-gateways.md) documentation.

|  | **VPN Gateway throughput (1)** | **VPN Gateway max IPsec tunnels (2)** | **ExpressRoute Gateway throughput** | **VPN Gateway and ExpressRoute coexist** |
| --- | --- | --- | --- | --- |
| **Standard SKU (3)(4)** |100 Mbps |10 |1,000 Mbps |Yes |
| **High Performance SKU (3)** |200 Mbps |30 |2,000 Mbps |Yes |

(1) The VPN throughput is a rough estimate based on the measurements between VNets in the same Azure region. It isn't a guaranteed throughput for cross-premises connections across the Internet. It's the maximum possible throughput measurement.

(2) The number of tunnels refers to RouteBased VPNs. A PolicyBased VPN can only support one Site-to-Site VPN tunnel.

(3) PolicyBased VPNs aren't supported for this SKU. They're supported for the Basic SKU.

(4) Active-active S2S VPN Gateway connections aren't supported for this SKU. Active-active is supported on the HighPerformance SKU.

## <a name="config"></a>Supported configurations by SKU and VPN type

[!INCLUDE [Table requirements for old SKUs](../../includes/vpn-gateway-table-requirements-legacy-sku-include.md)]

## Move to another gateway SKU

### Considerations

* You can't upgrade a legacy SKU to one of the newer Azure SKUs (VpnGw1AZ, VpnGw2AZ, etc.) Legacy SKUs for the Resource Manager deployment model are: Standard, and High Performance. If you want to use a new Azure SKU, you must delete the gateway, and then create a new one.
* When you go from a legacy SKU to a newer gateway SKU, you incur connectivity downtime.
* When you go from a legacy SKU to a newer gateway SKU, the public IP address for your VPN gateway changes. The IP address change happens even if you specified the same public IP address object that you used previously.
* If you have a classic VPN gateway, you must continue using the older legacy SKUs for that gateway. However, you can upgrade between the legacy SKUs available for classic gateways. You can't change to the new SKUs.
* Standard and High Performance legacy SKUs are being deprecated. See [Legacy SKU deprecation](vpn-gateway-about-skus-legacy.md#sku-deprecation) for SKU migration and upgrade timelines.

### <a name="migrate"></a>Migrate a gateway SKU

A gateway SKU migration process is similar to a resize. It requires fewer steps and configuration changes than changing to a new gateway SKU. Your gateway will be migrated seamlessly from backend without any connectivity impact before September 30, 2025. This is different from the initial approach of providing a migration path.

### <a name="resize"></a>Resize to a gateway SKU in the same SKU family

Resizing a gateway SKU incurs less downtime and fewer configuration changes than the process to change to a new SKU. However, there are limitations. You can only resize your gateway to a gateway SKU within the same SKU family (except for the Basic SKU).

For example, if you have a Standard SKU, you can resize to a High Performance SKU. However, you can't resize your VPN gateway between the old SKUs and the new SKU families. You can't go from a Standard SKU to a VpnGw2 SKU, or from a Basic SKU to VpnGw1 by resizing.

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

### <a name="change"></a>Change to the new gateway SKUs

Standard and High Performance SKUs will be deprecated September 30, 2025. The product team will migrate the legacy SKUs from backend. For more information, See the [Legacy SKU deprecation](#sku-deprecation) section. You can choose to change from a legacy SKU to one of the new SKUs at any point. However, changing to a new SKU requires more steps than migrating and incurs downtime.

[!INCLUDE [Change to the new SKUs](../../includes/vpn-gateway-gwsku-change-legacy-sku-include.md)]

## SKU deprecation

The Standard and High Performance SKUs will be deprecated on September 30, 2025. The product team will do backend seamless migration for these SKUs starting June 2025. This is a change from originally announced November 2024 date **At this time, there's no action that you need to take**.

* View the [Announcement](https://go.microsoft.com/fwlink/?linkid=2255127)
* See the SKU deprecation [FAQs](#sku-deprecation-faqs)

When the migration path becomes available, the product team will automatically migrate your legacy SKUs to the following SKUs:

* **Standard SKU:** -> **VpnGw1**
* **High Performance SKU:** -> **VpnGw2**

There are no [price](https://azure.microsoft.com/pricing/details/vpn-gateway/) changes if you migrate to Standard (VpnGw1) and High Performance (VpnGw2) gateways. As a benefit, there's a performance improvement after migrating:

* **Standard SKU:** 6.5x
* **High Performance SKU:** 5x

As next steps, your gateway will be automatically migrated and upgraded to an AZ gateway SKU:

* **Standard SKU:** -> **VpnGw1AZ**
* **High Performance SKU:** -> **VpnGw2AZ**

Important Dates:

* **December 1, 2023**: No new gateway creations are possible using Standard or High Performance SKUs.
* **May 31, 2025**: Begin migrating gateways to other SKUs.
* **September 30, 2025**: Standard/High Performance SKUs will be retired and remaining deprecated legacy gateways will be automatically migrated and upgraded to AZ SKUs.

## SKU deprecation FAQs

[!INCLUDE [legacy SKU deprecation](../../includes/vpn-gateway-deprecate-sku-faq.md)]

## Next steps

For more information about the new Gateway SKUs, see [Gateway SKUs](vpn-gateway-about-vpngateways.md#gwsku).

For more information about configuration settings, see [About VPN Gateway configuration settings](vpn-gateway-about-vpn-gateway-settings.md).
