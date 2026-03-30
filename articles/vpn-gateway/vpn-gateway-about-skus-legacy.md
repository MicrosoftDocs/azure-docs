---
title: VPN Gateway Legacy SKUs
description: How to work with the old virtual network gateway SKUs, called Standard and High Performance.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 2/27/2026
ms.author: cherylmc 
# Customer intent: As a network administrator, I want to manage legacy VPN gateway SKUs so that I can ensure continuity of service and plan for the upcoming deprecation of these SKUs before the migration deadline.
---
# Work with VPN Gateway legacy SKUs

This article contains information about the legacy (old) virtual network Azure VPN Gateway SKUs. The legacy SKUs still work in both deployment models for existing VPN gateways. Classic VPN gateways continue to use the legacy SKUs, for both existing and new gateways. When you create new VPN gateways in Azure Resource Manager, use the new gateway SKUs.

For information about the new SKUs, see [About VPN Gateway](vpn-gateway-about-vpngateways.md). For the projected gateway SKU deprecation and migration timeline, see the [What's new?](whats-new.md) article.

## <a name="gwsku"></a>Legacy gateway SKUs

[!INCLUDE [Legacy gateway SKUs](../../includes/vpn-gateway-gwsku-legacy-include.md)]

For SKU deprecation, see the [SKU deprecation](#sku-deprecation) and [FAQs](#sku-deprecation-faqs) sections of this article.

## <a name="agg"></a>Estimated aggregate throughput by SKU

The following table shows the gateway types and the estimated aggregate throughput by gateway SKU. This table applies to the Resource Manager and classic deployment models.

Pricing differs between gateway SKUs. For more information, see [VPN Gateway pricing](https://azure.microsoft.com/pricing/details/vpn-gateway).

| SKU | VPN Gateway throughput (1) | VPN Gateway max IPsec tunnels (2) | ExpressRoute Gateway throughput | VPN Gateway and ExpressRoute coexist |
| --- | --- | --- | --- | --- |
| Standard SKU (3)(4) | 100 Mbps | 10 | 1,000 Mbps | Yes |
| High Performance SKU (3) | 200 Mbps | 30 | 2,000 Mbps | Yes |

(1) The VPN throughput is a rough estimate based on the measurements between virtual networks in the same Azure region. It isn't a guaranteed throughput for cross-premises connections across the internet. It's the maximum possible throughput measurement.

(2) The number of tunnels refers to route-based VPNs. A policy-based VPN can only support one site-to-site VPN tunnel.

(3) Policy-based VPNs aren't supported for this SKU. They're supported for the Basic SKU.

(4) Site-to-site VPN Gateway connections in active-active mode aren't supported for this SKU. Active-active mode is supported on the High Performance SKU.

## <a name="config"></a>Supported configurations by SKU and VPN type

[!INCLUDE [Table requirements for old SKUs](../../includes/vpn-gateway-table-requirements-legacy-sku-include.md)]

### <a name="change"></a> Move to a new gateway SKUs

Standard and High Performance SKUs will be deprecated on March 31, 2026. All legacy SKUs use Basic IP address today, and we recommend you use the Azure portal to [migrate a Basic IP address to a Standard IP address](basic-public-ip-migrate-about.md) before the retirement date. As part of Basic IP address migration, your legacy SKU will also be migrated to a newer SKU that's supported by availability zones. For more information, see the [Legacy SKU deprecation](#sku-deprecation) section. For the most up-to-date timeline, see [What's new in Azure VPN Gateway?](whats-new.md).

[!INCLUDE [Change to the new SKUs](../../includes/vpn-gateway-gwsku-change-legacy-sku-include.md)]

## SKU deprecation

The Standard and High Performance SKUs will be deprecated on March 31, 2026. All legacy SKUs use Basic IP addresses today, and you can use the Azure portal to [migrate a Basic IP address to a Standard IP address](basic-public-ip-migrate-about.md) before the retirement date. As part of Basic IP migration, your legacy SKU will also be migrated to AZ SKU family.

For more information, you can:

* View the [announcement](https://go.microsoft.com/fwlink/?linkid=2255127).
* See the SKU deprecation [FAQs](#sku-deprecation-faqs).

With the current Basic IP address migration tool, your gateway SKU will automatically migrate to the following SKUs:

* Standard SKU becomes VpnGw1AZ.
* High Performance SKU becomes VpnGw2AZ.

Performance improves after this migration.

## SKU deprecation FAQs

[!INCLUDE [legacy SKU deprecation](../../includes/vpn-gateway-deprecate-sku-faq.md)]

## Related content

* For more information about the new VPN Gateway SKUs, see [Gateway SKUs](vpn-gateway-about-vpngateways.md#gwsku).
* For more information about configuration settings, see [About VPN Gateway configuration settings](vpn-gateway-about-vpn-gateway-settings.md).
