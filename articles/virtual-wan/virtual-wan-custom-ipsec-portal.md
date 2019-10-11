---
title: 'Use Azure Virtual WAN to create a Site-to-Site connection to Azure | Microsoft Docs'
description: In this tutorial, learn how to use Azure Virtual WAN to create a Site-to-Site VPN connection to Azure.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: tutorial
ms.date: 10/11/2019
ms.author: cherylmc

---
# Configure a custom IPsec policy for Virtual WAN

You can configure custom IPsec policy for virtual want in the Azure portal.

[!INCLUDE [IPsec](../../includes/virtual-wan-ipsec-custom-include.md)]

## 1. Locate the virtual hub

From a browser, navigate to the [Azure portal](https://aka.ms/azurevirtualwanpreviewfeatures) and sign in with your Azure account. Locate the virtual hub for your site.
## 2. Select the VPN site

From the hub page, select the VPN Site that you want to set up the Custom policy for.

![](./media/virtual-wan-custom-ipsec-portal/locate.png)

## 3. Edit the VPN connection

From the context menu **...**, select **Edit VPN Connection**.

![](./media/virtual-wan-custom-ipsec-portal/contextmenu.png)

## 4. Configure the settings

On the **Edit VPN connection** page the settings you want to configure. Select **Save** to save your settings.

![](./media/virtual-wan-custom-ipsec-portal/edit.png)





## Next steps

To learn more about Virtual WAN, see the [Virtual WAN Overview](virtual-wan-about.md) page.
