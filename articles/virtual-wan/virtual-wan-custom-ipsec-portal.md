---
title: 'Configure a custom IPsec policy for Azure Virtual WAN: Portal'
description: Learn how to configure a custom IPsec policy for Azure Virtual WAN using the portal.
services: virtual-wan
author: cherylmc

ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 12/12/2024
ms.author: cherylmc

---
# Configure a custom IPsec policy for Virtual WAN using the portal

You can configure a custom IPsec policy for a Virtual WAN VPN connection in the Azure portal. Custom policies are helpful when you want both sides (on-premises and Azure VPN gateway) to use the same settings for IKE Phase 1 and IKE Phase 2.

## Working with custom policies

[!INCLUDE [IPsec](../../includes/virtual-wan-ipsec-custom-include.md)]

## Configure a policy

1. **Locate the virtual hub**. In the Azure portal, go to your Virtual WAN resource and locate the virtual hub that your VPN site is connected to.

1. **Select the VPN site**. From the hub overview page, click **VPN (Site to site)** and select the VPN Site for which you want to set up a custom IPsec policy.

1. **Edit the VPN connection**. From the **Context menu** **...**, select **Edit VPN Connection**.

   :::image type="content" source="./media/virtual-wan-custom-ipsec-portal/contextmenu.png" alt-text="Screenshot shows how to use the context menu to edit the policy." lightbox="./media/virtual-wan-custom-ipsec-portal/contextmenu.png":::

1. **Configure the settings**. On the **Edit VPN connection** page, change the IPsec setting from default to custom and customize the IPsec policy. Select **Save** to save your settings.

   :::image type="content" source="./media/virtual-wan-custom-ipsec-portal/edit.png" alt-text="Screenshot shows how to configure and save the policy." lightbox="./media/virtual-wan-custom-ipsec-portal/edit.png":::

## Next steps

To learn more about Virtual WAN, see the [Virtual WAN Overview](virtual-wan-about.md) page.