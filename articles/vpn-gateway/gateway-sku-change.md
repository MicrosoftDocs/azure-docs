---
title: 'Change a gateway SKU'
titleSuffix: Azure VPN Gateway
description: Learn how to change a gateway SKU.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 10/24/2023
ms.author: cherylmc

---
# Change a gateway SKU

This article helps you change a VPN Gateway virtual network gateway SKU. Before beginning the workflow to change your SKU, check the table in the [Considerations](#considerations) section of this article to see if you can, instead, [resize](gateway-sku-resize.md) your SKU. If you have the option to resize a SKU, select that method rather than changing a SKU.

[!INCLUDE [changing vs. resizing](../../includes/vpn-gateway-sku-about-change-resize.md)]

> [!NOTE]
> The steps in this article apply to current Resource Manager deployments and not to legacy classic (service management) deployments.

## Considerations

There are a number of things to consider when moving to a new gateway SKU. This section outlines the main items and also provides a table that helps you select the best method to use.

[!INCLUDE [resize SKU restrictions](../../includes/vpn-gateway-sku-resize-restrictions.md)]

The following table helps you understand the required method to move from one SKU to another.

[!INCLUDE [resize SKU methods table](../../includes/vpn-gateway-sku-resize-methods-table.md)]

## Workflow

The following steps illustrate the workflow to change a SKU.

1. Remove any connections to the virtual network gateway.
1. Delete the old VPN gateway.
1. Create the new VPN gateway.
1. Update your on-premises VPN devices with the new VPN gateway IP address (for site-to-site connections).
1. Update the gateway IP address value for any VNet-to-VNet local network gateways that connect to this gateway.
1. Download new client VPN configuration packages for point-to-site clients connecting to the virtual network through this VPN gateway.
1. Recreate the connections to the virtual network gateway.

## Next steps

For more information about SKUs, see [VPN Gateway settings](vpn-gateway-about-vpn-gateway-settings.md).