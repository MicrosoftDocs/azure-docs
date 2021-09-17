---
title: 'Install Azure Firewall in a Virtual WAN hub'
titleSuffix: Azure Virtual WAN
description: Learn how to configure Azure Firewall in a Virtual WAN hub.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: how-to
ms.date: 05/26/2021
ms.author: cherylmc

---
# Configure Azure Firewall in a Virtual WAN hub

A **secured hub** is an Azure Virtual WAN hub with Azure Firewall. This article walks you through the steps to convert a virtual WAN hub to a secured hub by installing Azure Firewall directly from the Azure Virtual WAN portal pages.

## Before you begin

The steps in this article assume that you have already deployed a virtual WAN with one or more hubs.

To create a new virtual WAN and a new hub, use the steps in the following articles:

* [Create a virtual WAN](virtual-wan-site-to-site-portal.md#openvwan)
* [Create a hub](virtual-wan-site-to-site-portal.md#hub)

## View virtual hubs

The **Overview** page for your virtual WAN shows a list of virtual hubs and secured hubs. The following figure shows a virtual WAN with no secured hubs.

:::image type="content" source="./media/howto-firewall/overview.png" alt-text="Screenshot shows the Overview page for a virtual WAN with a list of virtual hubs." lightbox="./media/howto-firewall/overview.png":::

## Convert to secured hub

1. On the **Overview** page for your virtual WAN, select the hub that you want to convert to a secured hub. On the virtual hub page, you see two options to deploy Azure Firewall into this hub. Select either option.

   :::image type="content" source="./media/howto-firewall/security.png" alt-text="Screenshot shows the Overview page for your virtual WAN where you can select either Convert to secure hub or Azure Firewall." lightbox="./media/howto-firewall/security.png":::

1. After you select one of the options, you see the **Convert to secure hub** page. Select a hub to convert, and then select **Next: Azure Firewall** at the bottom of the page.

   :::image type="content" source="./media/howto-firewall/select-hub.png" alt-text="Screenshot of Convert to secure hub with a hub selected." lightbox="./media/howto-firewall/select-hub.png":::
1. After completing the workflow, select **Confirm**.

   :::image type="content" source="./media/howto-firewall/confirm.png" alt-text="Screenshot shows the Convert to secure hub pane with Confirm selected." lightbox="./media/howto-firewall/confirm.png":::
1. After the hub has been converted to a secured hub, you can view it on the virtual WAN **Overview** page.

   :::image type="content" source="./media/howto-firewall/secured-hub.png" alt-text="Screenshot of view secured hub." lightbox="./media/howto-firewall/secured-hub.png":::

## View hub resources

From the virtual WAN **Overview** page, select the secured hub. On the hub page, you can view all the virtual hub resources, including Azure Firewall.

To view Azure Firewall settings from the secured hub, under **Security**, select **Secured virtual hub settings**.

:::image type="content" source="./media/howto-firewall/hub-settings.png" alt-text="Screenshot of Secured virtual hub settings." lightbox="./media/howto-firewall/hub-settings.png":::

## Configure additional settings

To configure additional Azure Firewall settings for the virtual hub, select the link to **Azure Firewall Manager**. For information about firewall policies, see [Azure Firewall Manager](../firewall-manager/secure-cloud-network.md#create-a-firewall-policy-and-secure-your-hub).

:::image type="content" source="./media/howto-firewall/additional-settings.png" alt-text="Screenshot of Overview with Manage security provider route settings for this Secured virtual hub in Azure Firewall Manager selected." lightbox="./media/howto-firewall/additional-settings.png":::

To return to the hub **Overview** page, you can navigate back by clicking the path, as shown by the arrow in the following figure.

:::image type="content" source="./media/howto-firewall/arrow.png" alt-text="Screenshot showing how to return to the overview page." lightbox="./media/howto-firewall/arrow.png":::

## Next steps

For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
