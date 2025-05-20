---
title: 'Upgrade a VPN Gateway SKU'
titleSuffix: Azure VPN Gateway
description: Learn how to upgrade a VPN Gateway SKU in Azure.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 05/20/2025
ms.author: cherylmc

---
# Upgrade a gateway SKU

This article helps you upgrade a VPN Gateway virtual network gateway SKU. Upgrading a gateway SKU is a relatively fast process. When you upgrade a SKU, you incur very little downtime. You don't need to follow a workflow to upgrade a SKU. You can upgrade a SKU quickly and easily in the Azure portal. Or, you can use PowerShell or the Azure CLI. You don't need to reconfigure your VPN device or your P2S clients. The public IP address assigned to your gateway SKU doesn't change. However, there are certain limitations and restrictions for upgrading. Not all SKUs are available to upgrade.

## Considerations

There are many things to consider when upgrading to a new gateway SKU. The following table helps you understand the required method to move from one SKU to another.

| Starting SKU | Target SKU | Eligible for SKU upgrade| Delete/Recreate only |
| --- | --- |--- | --- |
| Basic SKU | Any other SKU | No | Yes  |
| Generation 1 SKU | Generation 1 SKU | Yes| No |
| Generation 1 SKU | Generation 1 AZ SKU | No |Yes |
| Generation 1 AZ SKU | Generation 1 AZ SKU |Yes | No |
| Generation 1 AZ SKU | Generation 2 AZ SKU | No | Yes |
| Generation 2 SKU | Generation 2 SKU | Yes | No |
| Generation 2 SKU | Generation 2 AZ SKU | No |Yes |
| Generation 2 AZ SKU | Generation 2 AZ SKU Yes | No |

### Limitations and restrictions

* You can't upgrade a Basic SKU to a new SKU. You must instead delete the gateway, and then create a new one.
* You can't downgrade a SKU without deleting the gateway and creating a new one.
* You can't upgrade a legacy SKU to one of the newer Azure SKUs (VpnGw1AZ, VpnGw2AZ, etc.) Legacy SKUs for the Resource Manager deployment model are: Standard, and High Performance. You must instead delete the gateway, and then create a new one.
* When you go from a legacy SKU to a new SKU, you incur connectivity downtime.
* When you go from a legacy SKU to a new gateway SKU, the public IP address for your VPN gateway changes. The IP address change happens even if you specified the same public IP address object that you used previously.
* If you have a classic VPN gateway, you must continue using the older legacy SKUs for that gateway. However, you can upgrade between the legacy SKUs available for classic gateways. You can't change to the new SKUs.
* Standard and High Performance legacy SKUs are being deprecated. See [Legacy SKU deprecation](../articles/vpn-gateway/vpn-gateway-about-skus-legacy.md#sku-deprecation) for SKU migration and upgrade timelines.

## Upgrade a gateway SKU using the Azure portal

Upgrading a gateway SKU takes about 45 minutes to complete.

1. Go to the **Configuration** page for your virtual network gateway.
1. On the right side of the page, click the dropdown arrow to show a list of available SKUs. The options listed are based on the starting SKU and SKU Generation.

   :::image type="content" source="./media/gateway-sku-upgrade/upgrade-sku.png" alt-text="Screenshot showing how to upgrade the gateway SKU." lightbox ="./media/gateway-sku-upgrade/upgrade-sku.png":::
1. Select the SKU from the dropdown.
1. **Save** your changes.
1. It takes about 45 minutes for the gateway SKU upgrade to complete.

## Next steps

For more information about SKUs, see [VPN Gateway settings](vpn-gateway-about-vpn-gateway-settings.md).
