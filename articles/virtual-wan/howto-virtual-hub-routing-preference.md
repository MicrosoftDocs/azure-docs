---
title: 'Configure virtual hub routing preference'
titleSuffix: Azure Virtual WAN
description: Learn how to configure Virtual WAN virtual hub routing preference.
author: cherylmc
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 05/30/2022
ms.author: cherylmc
---
# Configure virtual hub routing preference

The following steps help you configure virtual hub routing preference settings. For information about this feature, see [Virtual hub routing preference](about-virtual-hub-routing-preference.md).


## Configure

You can configure a new virtual hub to include the virtual hub routing preference setting by using the [Azure Preview portal]( https://portal.azure.com/?feature.virtualWanRoutingPreference=true#home). Follow the steps in the [Tutorial: Create a site-to-site connection](virtual-wan-site-to-site-portal.md) article.

To configure virtual hub routing preference for an existing virtual hub, use the following steps.

1. Open the [Azure Preview portal]( https://portal.azure.com/?feature.virtualWanRoutingPreference=true#home). You can't use the regular Azure portal yet for this feature.

1. Go to your virtual WAN. In the left pane, under the **Connectivity** section, click **Hubs** to view the list of hubs. Select **… > Edit virtual hub** to open the **Edit virtual hub** dialog box.

   :::image type="content" source="./media/howto-virtual-hub-routing-preference/edit-virtual-hub.png" alt-text="Screenshot shows select Edit virtual hub." lightbox="./media/howto-virtual-hub-routing-preference/edit-virtual-hub-expand.png":::

   You can also click on the hub to open the virtual hub, and then under virtual hub resource, click the **Edit virtual hub** button.

   :::image type="content" source="./media/howto-virtual-hub-routing-preference/hub-edit.png" alt-text="Screenshot shows Edit virtual hub." lightbox="./media/howto-virtual-hub-routing-preference/hub-edit.png":::

1. On the **Edit virtual hub** page, select from the dropdown to configure the field **Hub routing preference**. To determine the setting to use, see [About virtual hub routing preference](about-virtual-hub-routing-preference.md).

   Click **Confirm** to save the settings.

   :::image type="content" source="./media/howto-virtual-hub-routing-preference/select-preference.png" alt-text="Screenshot shows the dropdown showing ExpressRoute, VPN, and AS PATH." lightbox="./media/howto-virtual-hub-routing-preference/select-preference.png":::

1. After the settings have saved, you can verify the configuration on the **Overview** page for the virtual hub.

   :::image type="content" source="./media/howto-virtual-hub-routing-preference/view-preference.png" alt-text="Screenshot shows virtual hub Overview page with routing preference." lightbox="./media/howto-virtual-hub-routing-preference/view-preference-expand.png":::

## Next steps

To learn more about virtual hub routing preference, see [About virtual hub routing preference](about-virtual-hub-routing-preference.md).
