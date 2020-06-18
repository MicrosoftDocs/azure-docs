---
title: 'Configure custom IPsec policy for Azure Virtual WAN: Portal | Microsoft Docs'
description: Learn how to configure custom IPsec policy for Azure Virtual WAN using the portal.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: how-to
ms.date: 10/14/2019
ms.author: cherylmc

---
# Configure a custom IPsec policy for Virtual WAN using the portal

You can configure custom IPsec policy for Virtual WAN in the Azure portal. Custom policies are helpful when you want both sides (on-premises and Azure VPN gateway) to use the same settings for IKE Phase 1 and IKE Phase 2.

## Working with custom policies

[!INCLUDE [IPsec](../../includes/virtual-wan-ipsec-custom-include.md)]

## Configure a policy

1. **Locate the virtual hub**. From a browser, navigate to the [Azure portal](https://aka.ms/azurevirtualwanpreviewfeatures) and sign in with your Azure account. Locate the virtual hub for your site.
2. **Select the VPN site**. From the hub page, select the VPN Site for which you want to set up a custom policy.

   ![select](./media/virtual-wan-custom-ipsec-portal/locate.png)
3. **Edit the VPN connection**. From the **Context menu** **...**, select **Edit VPN Connection**.

   ![edit](./media/virtual-wan-custom-ipsec-portal/contextmenu.png)
4. **Configure the settings**. On the **Edit VPN connection** page, configure the settings the settings. Select **Save** to save your settings.

   ![configure and save](./media/virtual-wan-custom-ipsec-portal/edit.png)

## Next steps

To learn more about Virtual WAN, see the [Virtual WAN Overview](virtual-wan-about.md) page.