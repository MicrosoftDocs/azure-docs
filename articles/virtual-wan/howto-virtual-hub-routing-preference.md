---
title: 'Configure virtual hub routing preference: Azure portal'
titleSuffix: Azure Virtual WAN
description: Learn how to configure Virtual WAN virtual hub routing preference using the Azure portal.
author: cherylmc
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 03/26/2025
ms.author: cherylmc
---
# Configure virtual hub routing preference - Azure portal

The following steps help you configure virtual hub routing preference settings. For information about this feature, see [Virtual hub routing preference](about-virtual-hub-routing-preference.md). You can also configure these settings using the [Azure PowerShell](how-to-virtual-hub-routing-preference-powershell.md).

## New virtual hub

You can configure a new virtual hub to include the virtual hub routing preference setting by using the [Azure portal](https://portal.azure.com). Follow the steps in the [Tutorial: Create a site-to-site connection](virtual-wan-site-to-site-portal.md) article.

## Existing virtual hub

To configure virtual hub routing preference for an existing virtual hub, use the following steps.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your virtual WAN. In the left pane, click **Hubs** to view the list of hubs.

1. Click the hub that you want to configure. On the **Virtual HUB** page, click **Edit virtual hub**.

1. On the **Edit virtual hub** page, select from the dropdown to configure **Hub routing preference**. To determine the setting to use, see [About virtual hub routing preference](about-virtual-hub-routing-preference.md).

   Click **Confirm** to save the settings.

1. After the settings have saved, you can verify the configuration on the **Overview** page for the virtual hub.

## Next steps

To learn more about virtual hub routing preference, see [About virtual hub routing preference](about-virtual-hub-routing-preference.md).
