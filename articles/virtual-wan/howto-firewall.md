---
title: 'Install Azure Firewall in a Virtual WAN hub'
titleSuffix: Azure Virtual WAN
description: Learn how to configure Azure Firewall in a Virtual WAN hub.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: how-to
ms.date: 02/13/2023
ms.author: cherylmc

---
# Configure Azure Firewall in a Virtual WAN hub

A **secured hub** is an Azure Virtual WAN hub with Azure Firewall. This article walks you through the steps to convert a virtual WAN hub to a secured hub by installing Azure Firewall directly from the Azure Virtual WAN portal pages.

## Before you begin

The steps in this article assume that you've already deployed a virtual WAN with one or more hubs.

To create a new virtual WAN and a new hub, use the steps in the following articles:

* [Create a virtual WAN](virtual-wan-site-to-site-portal.md#openvwan)
* [Create a hub](virtual-wan-site-to-site-portal.md#hub)

> [!IMPORTANT]
> Virtual WAN is a collection of hubs and services made available inside the hub. The user can deploy as many Virtual WANs as they need. In a Virtual WAN hub, there are multiple services like VPN, ExpressRoute etc. Each of these services is automatically deployed across **Availability Zones** (*except* Azure Firewall) if the region supports Availability Zones. To deploy an Azure Firewall with Availability Zones (recommended) in a Secure vWAN Hub, [this article](../firewall-manager/secure-cloud-network.md) must be used. 

## View virtual hubs

The **Overview** page for your virtual WAN shows a list of virtual hubs and secured hubs. The following figure shows a virtual WAN with no secured hubs.

:::image type="content" source="./media/howto-firewall/vwan-overview-page.jpg" alt-text="Screenshot showing the Overview page for an Azure Virtual WAN." lightbox="./media/howto-firewall/vwan-overview-page.jpg":::

## Convert to secured hub

1. On the **Overview** page for your virtual WAN, select the hub that you want to convert to a secured hub. 

2. Once in the hub properties, select **Azure Firewall and Firewall Manager** under the "Security" section on the left:

   :::image type="content" source="./media/howto-firewall/vwan-convert-firewall-start.png" alt-text="Screenshot showing Azure Virtual WAN Hub properties." lightbox="./media/howto-firewall/vwan-convert-firewall-start.png":::

3. Select **Next: Azure Firewall** button at the bottom of screen: 

   :::image type="content" source="./media/howto-firewall/vwan-select-hub.png" alt-text="Screenshot showing [Select virtual hubs] step in the conversion flow" lightbox="./media/howto-firewall/vwan-select-hub.png":::

4. Select the Azure Firewall properties and status desired, then complete the wizard up to the **Review + confirm** tab:

   :::image type="content" source="./media/howto-firewall/vwan-firewall-properties-conversion.png" alt-text="[Azure Firewall] step in the conversion flow" lightbox="./media/howto-firewall/vwan-firewall-properties-conversion.png":::

> [!NOTE]
> As reported at the beginning of the article, the procedure described in this article will not permit the usage of Availability Zones for Azure Firewall. 

5. After the hub has been converted to a secured hub, Azure Firewall status will be reported as in the image below: 

   :::image type="content" source="./media/howto-firewall/vwan-firewall-secured-final.png" alt-text="Screenshot showing end result of the conversion flow." lightbox="./media/howto-firewall/vwan-firewall-secured-final.png":::

## View hub resources

From the virtual WAN **Overview** page, select the secured hub. On the hub page, you can view all the virtual hub resources, including Azure Firewall.

To view Azure Firewall settings from the secured hub, select on **Azure Firewall and Firewall Manager** under the "Security" section on the left:

:::image type="content" source="./media/howto-firewall/vwan-secured-hub-status.png" alt-text="Screenshot showing Azure Virtual WAN status view in Firewall Manager." lightbox="./media/howto-firewall/vwan-secured-hub-status.png":::

Usage of Availability Zones for Azure Firewall in the Azure Virtual WAN Hub, can be checked accessing the security properties of the hub, as shown in the screenshot below:

:::image type="content" source="./media/howto-firewall/vwan-firewall-hub-az-correct-zone.png" alt-text="Screenshot showing Availability Zones property in Virtual WAN secured hub." lightbox="./media/howto-firewall/vwan-firewall-hub-az-correct-zone.png":::


## Configure additional settings

To configure additional Azure Firewall settings for the virtual hub, select the link to **Azure Firewall Manager**. For information about firewall policies, see [Azure Firewall Manager](../firewall-manager/secure-cloud-network.md#create-a-firewall-policy-and-secure-your-hub).

:::image type="content" source="./media/howto-firewall/additional-settings.png" alt-text="Screenshot showing Secured Hub overview with Manage Security Provider." lightbox="./media/howto-firewall/additional-settings.png":::

To return to the hub **Overview** page, you can navigate back by clicking the path, as shown by the arrow in the following figure.

:::image type="content" source="./media/howto-firewall/arrow.png" alt-text="Screenshot showing how to return to the Overview page." lightbox="./media/howto-firewall/arrow.png":::

## Upgrade to Azure Firewall Premium
At any time, it's possible to upgrade from Azure Firewall Standard to Premium following these [instructions](../firewall/premium-migrate.md#migrate-a-secure-hub-firewall). This operation will require a maintenance window since some minimal downtime will be generated. 

## Next steps

For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).