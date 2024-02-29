---
title: 'Configure an Always-On VPN user tunnel'
titleSuffix: Azure Virtual WAN
description: Learn how to configure an Always On VPN user tunnel for your Virtual WAN.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: how-to
ms.date: 11/21/2023
ms.author: cherylmc

---
# Configure an Always On VPN user tunnel for Virtual WAN

[!INCLUDE [intro](../../includes/vpn-gateway-vwan-always-on-intro.md)]

## Prerequisites

You must create a point-to-site configuration and edit the virtual hub assignment. See the following sections for instructions:

* [Create a P2S configuration](virtual-wan-point-to-site-portal.md#p2sconfig)
* [Create hub with P2S gateway](virtual-wan-point-to-site-portal.md#hub)

## Configure a user tunnel

[!INCLUDE [user tunnel](../../includes/vpn-gateway-vwan-always-on-user.md)]

## To remove a profile

To remove a profile, use the following steps:

1. Run the following command:

   ```powershell
   C:\> Remove-VpnConnection UserTest  
   ```

1. Disconnect the connection, and clear the **Connect automatically** check box.

   ![Cleanup](./media/howto-always-on-user-tunnel/disconnect.jpg)

## Next steps

For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
