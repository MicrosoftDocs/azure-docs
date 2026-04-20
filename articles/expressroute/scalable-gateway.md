---
title: About Scalable Gateway
titleSuffix: Azure ExpressRoute
description: ExpressRoute scalable gateway offers flexible scaling and up to 40-Gbps bandwidth. See how to configure ErGwScale and review supported regions and features.
services: expressroute
author: mekaylamoore
ms.service: azure-expressroute
ms.custom: references_regions
ms.topic: concept-article
ms.date: 11/06/2025
ms.author: mekaylamoore
---

# About ExpressRoute scalable gateway

The ExpressRoute scalable gateway (ErGwScale) is a virtual network gateway SKU that provides flexible, high-bandwidth connectivity for your Azure virtual networks. With support for up to 40-Gbps bandwidth and autoscaling capabilities, you can efficiently manage network performance and scale resources to meet your workload needs. This article explains the features, configuration options, limitations, and performance details of the ErGwScale gateway.

## Autoscaling vs. fixed scale unit

The virtual network gateway infrastructure autoscales between the minimum and maximum scale units that you configure, based on bandwidth or flow count utilization. Scale operations can take up to 30 minutes to complete. To achieve fixed connectivity at a specific bandwidth value, configure a fixed scale unit by setting both the minimum and maximum scale units to the same value.

> [!IMPORTANT]
> When you set the maximum scale unit to 1, the minimum scale unit must also be 1.

You can configure gateway scaling by setting the minimum and maximum scale units:

- **Fixed-size gateway**: Set both the minimum and maximum scale units to the same value (for example, both to 1, both to 20, or both to 40).
- **Autoscaling**: Set the minimum scale unit to 2 or higher, and specify the desired maximum scale unit (up to 40).

When autoscaling is enabled, the gateway automatically scales based on your workload requirements.

| Scenario              | Minimum Scale Unit | Maximum Scale Unit | Autoscaling Enabled? |
|-----------------------|-------------------|-------------------|---------------------|
| Fixed scaling         | 1                 | 1                 | No                  |
| Fixed scaling         | 20                | 20                | No                  |  
| Fixed scaling         | 40                | 40                | No                  |  
| Autoscaling           | 2 or higher       | Up to 40          | Yes                 |

## Upgrade and migration paths

You can move to ErGwScale using either an upgrade or migration process, depending on your current gateway SKU.

### Upgrade options

If you have an existing gateway using the ErGw1Az, ErGw2Az, or ErGw3Az SKU, you can [upgrade](expressroute-howto-add-gateway-portal-resource-manager.md#upgrade-the-gateway-sku) directly to the scalable gateway SKU. No migration tool is required. You can perform upgrades through the Azure portal or by using PowerShell.

The upgrade process can take up to 2 hours to complete. During this time, your gateway remains available without downtime.

### Migration options

If your gateway uses the Standard, High Performance, or Ultra Performance SKU, you must use the [migration tool](gateway-migration.md) to move to ErGwScale.

## Limitations

ErGwScale has the following limitations:

* **IPsec over ExpressRoute**: IPsec traffic over ExpressRoute isn't currently supported. For more information, see [About IPsec over ExpressRoute private peering](expressroute-about-encryption.md).
* **Basic public IP**: The Basic public IP SKU isn't supported. You must use a Standard public IP SKU.
* **Scale unit range**: The minimum scale unit can't be lower than 1, and the maximum scale unit can't exceed 40.

### Supported performance per scale unit

| Scale unit | Bandwidth (Gbps) | Packets per second | Connections per second | Maximum VM connections <sup>1</sup> | Maximum number of flows |
|--|--|--|--|--|--|
| 1-10 | 1 | 100,000 | 7,000 | 2,000 | 100,000 |
| 11-40 | 1 | 200,000 | 7,000 | 1,000 | 100,000 |

### Sample performance with scale unit

| Scale unit | Bandwidth (Gbps) | Packets per second | Connections per second | Maximum VM connections <sup>1</sup> | Maximum number of flows |
|--|--|--|--|--|--|
| 10 | 10 | 1,000,000 | 70,000 | 20,000 | 1,000,000 |
| 20 | 20 | 2,000,000 | 140,000 | 30,000 | 2,000,000 |
| 40 | 40 | 8,000,000 | 280,000 | 50,000 | 4,000,000 |

<sup>1</sup> Maximum VM connections scale differently beyond 10 scale units. The first 10 scale units provide capacity for 2,000 VMs per scale unit. Scale units 11 and above provide 1,000 more VM capacity per scale unit.

## Region availability

ErGwScale is available in most Azure regions except:

* Belgium Central
* Japan East
* Qatar Central
* Southeast Asia
* West Europe
* West India
* West US 2
* South Central US
* East US 2

## Pricing

For more information about ExpressRoute pricing, see [Azure ExpressRoute pricing](https://azure.microsoft.com/pricing/details/expressroute/). Select the **ExpressRoute Gateway** tab to view pricing for the ErGwScale SKU.


## Related content

- [Create an ExpressRoute scalable gateway](expressroute-howto-scalable-portal.md)
- Learn [about ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md)
