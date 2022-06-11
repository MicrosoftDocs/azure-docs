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

> [!IMPORTANT]
> Virtual WAN is a collection of hubs and services made available inside the hub. The user can have as many Virtual WAN per their need. In a Virtual WAN hub, there are multiple services like VPN, ExpressRoute etc. Each of these services is automatically deployed across **Availability Zones** *except* Azure Firewall, if the region supports Availability Zones. To deploy an Azure Firewall with Availability Zones (recommended) in a Secure vWAN Hub, [this article](https://docs.microsoft.com/azure/firewall-manager/secure-cloud-network) must be used. 

## View virtual hubs

The **Overview** page for your virtual WAN shows a list of virtual hubs and secured hubs. The following figure shows a virtual WAN with no secured hubs.

:::image type="content" source="./media/howto-firewall/vwan-overview1.png" alt-text="Screenshot shows the Overview page for a virtual WAN with a list of virtual hubs." lightbox="./media/howto-firewall/vwan-overview1.png":::

## Convert to secured hub

1. On the **Overview** page for your virtual WAN, select the hub that you want to convert to a secured hub. 

2. Once in the hub properties, click on **Azure Firewall and Firewall Manager** under the "Security" section on the left:

   :::image type="content" source="./media/howto-firewall/vwan-convert-firewall2.png" alt-text="Screenshot of vWAN hub properties." lightbox="./media/howto-firewall/vwan-convert-firewall2.png":::

3. Click on **Next: Azure Firewall** button at the bottom of screen: 

   :::image type="content" source="./media/howto-firewall/vwan-select-hub3.png" alt-text="Screenshot of initial convertion flow." lightbox="./media/howto-firewall/vwan-select-hub3.png":::

4. Select the Azure Firewall properties and status desired, then complete the wizard up to the **Review + confirm** tab:

   :::image type="content" source="./media/howto-firewall/vwan-firewall-properties4.png" alt-text="Screenshot shows the Convert to secure hub pane with Confirm selected." lightbox="./media/howto-firewall/vwan-firewall-properties4.png":::

> [!NOTE]
> As reported at the beginning of the article, the procedure described in this article will not permit the usage of Availability Zones for Azure Firewall. 

5. After the hub has been converted to a secured hub, Azure Firewall status will be reported as in the image below: 

   :::image type="content" source="./media/howto-firewall/vwan-firewall-secured5.png" alt-text="Screenshot of view secured hub." lightbox="./media/howto-firewall/vwan-firewall-secured5.png":::

## View hub resources

From the virtual WAN **Overview** page, select the secured hub. On the hub page, you can view all the virtual hub resources, including Azure Firewall.

To view Azure Firewall settings from the secured hub, click on **Azure Firewall and Firewall Manager** under the "Security" section on the left:

:::image type="content" source="./media/howto-firewall/vwan-secured-hub-properties6.png" alt-text="Screenshot of Secured virtual hub settings." lightbox="./media/howto-firewall/vwan-secured-hub-properties6.png":::

## Configure additional settings

To configure additional Azure Firewall settings for the virtual hub, select the link to **Azure Firewall Manager**. For information about firewall policies, see [Azure Firewall Manager](../firewall-manager/secure-cloud-network.md#create-a-firewall-policy-and-secure-your-hub).

:::image type="content" source="./media/howto-firewall/additional-settings.png" alt-text="Screenshot of Overview with Manage security provider route settings for this Secured virtual hub in Azure Firewall Manager selected." lightbox="./media/howto-firewall/additional-settings.png":::

To return to the hub **Overview** page, you can navigate back by clicking the path, as shown by the arrow in the following figure.

:::image type="content" source="./media/howto-firewall/arrow.png" alt-text="Screenshot showing how to return to the overview page." lightbox="./media/howto-firewall/arrow.png":::

## Upgrade to Azure Firewall Premium
At any time, it is possible to upgrade from Azure Firewall Standard to Premium following these [instructions](../firewall/premium-migrate.md#migrate-a-secure-hub-firewall). This operation will require a maintenance windows since some minimal downtime will be generated. 

## Next steps

For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).