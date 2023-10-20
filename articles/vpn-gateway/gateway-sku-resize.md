---
title: 'Resize a gateway SKU'
titleSuffix: Azure VPN Gateway
description: Learn how to resize a gateway SKU.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 10/20/2023
ms.author: cherylmc

---
# Resize a gateway SKU for VPN Gateway

This article helps you resize a gateway SKU. Resizing a gateway SKU is a relatively fast process. You don't need to delete and recreate your existing VPN gateway to resize. However, there are certain limitations and restrictions for resizing and not all SKUs are available when resizing.

When using the portal to resize your SKU, notice that the dropdown list of available SKUs is based on the SKU you currently have. If you don't see the SKU you want to resize to, instead of resizing, you have to change to a new SKU. For more information, see [About VPN Gateway settings](vpn-gateway-about-vpn-gateway-settings.md).

## Resize a SKU

1. Go to the **Configuration** page for your virtual network gateway.
1. On the right side of the page, click the dropdown arrow to show a list of available SKUs. The options listed are based on the starting SKU and SKU Generation.

   :::image type="content" source="./media/gateway-sku-resize/resize-sku.png" alt-text="Screenshot showing how to resize the gateway SKU." lightbox ="./media/gateway-sku-resize/resize-sku.png":::
1. Select the SKU from the dropdown.
1. **Save** your changes.

## Next steps

For more information about SKUs, see [VPN Gateway settings](vpn-gateway-about-vpn-gateway-settings.md).