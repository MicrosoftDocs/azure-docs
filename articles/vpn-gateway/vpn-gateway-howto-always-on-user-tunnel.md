---
title: 'Configure an Always-On VPN user tunnel'
titleSuffix: Azure VPN Gateway
description: Learn how to configure an Always On VPN user tunnel for your VPN gateway.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 08/11/2023
ms.author: cherylmc

---
# Configure an Always On VPN user tunnel

[!INCLUDE [intro](../../includes/vpn-gateway-vwan-always-on-intro.md)]

This article helps you configure an Always On VPN user tunnel. For information about configuring a device tunnel, see [Configure an Always On VPN device tunnel](vpn-gateway-howto-always-on-device-tunnel.md).

## Configure the gateway

 Use the instructions in the [Configure a Point-to-Site VPN connection](vpn-gateway-howto-point-to-site-resource-manager-portal.md) article to configure the VPN gateway to use IKEv2 and certificate-based authentication.

## Configure a user tunnel

[!INCLUDE [user configuration](../../includes/vpn-gateway-vwan-always-on-user.md)]

## To remove a profile

To remove a profile, use the following steps:

1. Run the following command:

   ```powershell
   C:\> Remove-VpnConnection UserTest  
   ```

1. Disconnect the connection, and clear the **Connect automatically** check box.

   ![Cleanup](./media/vpn-gateway-howto-always-on-user-tunnel/disconnect.jpg)

## Next steps

To troubleshoot any connection issues that might occur, see [Azure point-to-site connection problems](vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems.md).
