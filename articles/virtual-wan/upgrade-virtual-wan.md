---
title: 'Upgrade Virtual WAN - Basic SKU type to Standard'
titleSuffix: Azure Virtual WAN
description: You can upgrade your virtual WAN SKU type from Basic to Standard for greater functionality.
author: cherylmc
ms.service: virtual-wan
ms.topic: how-to
ms.date: 07/28/2023
ms.author: cherylmc
---

# Upgrade a virtual WAN from Basic to Standard

This article helps you upgrade a virtual WAN that was created using the Basic type (SKU), to Standard. When a virtual WAN type is Basic, all hubs within the virtual WAN are configured as Basic hubs. A Basic hub is limited to site-to-site VPN functionality only.

When you upgrade from Basic to Standard, all the hubs within the virtual WAN are upgraded to Standard hubs. Standard hubs support ExpressRoute, point-to-site (User VPN), a full mesh hub, and VNet-to-VNet transit through the Azure hubs.

The following table shows the configurations available for each WAN type:

[!INCLUDE [Basic and Standard SKUs](../../includes/virtual-wan-standard-basic-include.md)]

## <a name = "upgrade"></a>To upgrade

1. On the page for your virtual WAN, select **Configuration** to open the Configuration page.

   :::image type="content" source="./media/upgrade-virtual-wan/configuration.png" alt-text="Screenshot that shows the Configuration page with an information text box about upgrading to a Standard-type virtual WAN highlighted on the bottom." lightbox="./media/upgrade-virtual-wan/configuration.png":::

1. For the Virtual WAN type, select **Standard** from the drop-down.

   :::image type="content" source="./media/upgrade-virtual-wan/type.png" alt-text="Screenshot that shows the Virtual WAN type drop-down menu." lightbox="./media/upgrade-virtual-wan/type.png":::

1. Understand that if you upgrade to a Standard virtual WAN, you can't revert back to a Basic virtual WAN. Select **Confirm** if you want to upgrade. Then, click **Save**.

   :::image type="content" source="./media/upgrade-virtual-wan/confirm.png" alt-text="Screenshot that shows the upgrade confirmation dialog box." lightbox="./media/upgrade-virtual-wan/confirm.png":::

1. Once the change has been saved, your virtual WAN and the hubs within it are updated to Standard.

## Next steps

To learn more about Virtual WAN, see the [Virtual WAN Overview](virtual-wan-about.md) page.