---
title: 'Configure High Availability connections for P2S User VPN clients'
titleSuffix: Azure Virtual WAN
description: Learn how to configure High Availability connections for Virtual WAN P2S User VPN clients.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: how-to
ms.date: 04/18/2022
ms.author: cherylmc

---
# Configure High Availability connections for Virtual WAN P2S User VPN clients

This article helps you configure and connect using the High Availability setting for Virtual WAN point-to-site (P2S) User VPN clients. This feature is only available for P2S clients connecting to Virtual WAN VPN gateways using the OpenVPN protocol.

By default, every Virtual WAN VPN gateway consists of two instances in an active-active configuration. If anything happens to the gateway instance that the VPN client is connected to, the tunnel will be disconnected. P2S VPN clients must then initiate a connection to the new active instance.

When **High Availability** is configured for the Azure VPN Client, if a failover occurs, the client connection isn't interrupted.

> [!NOTE]
> High Availability is supported for OpenVPN® protocol connections only and requires the Azure VPN Client.

## <a name = "windows"></a>Windows

### <a name = "download"></a>Download the Azure VPN Client

To use this feature, you must install version **2.1901.41.0** or later of the Azure VPN Client.

[!INCLUDE [Download Azure VPN Client](../../includes/vpn-gateway-download-vpn-client.md)]

### <a name = "import"></a>Configure VPN client settings

1. Use the [Point-to-site VPN for Azure AD authentication](virtual-wan-point-to-site-azure-ad.md#download-profile) article as a general guideline to generate client profile files. The OpenVPN® tunnel type is required for High Availability. If the generated client profile files don't contain an **OpenVPN** folder, your point-to-site User VPN configuration settings need to be modified to use the OpenVPN tunnel type.

1. Configure the Azure VPN Client using the steps in the [Configure the Azure VPN Client](virtual-wan-point-to-site-azure-ad.md#configure-client) article as a guideline.

### <a name = "HA"></a>Configure High Availability settings

1. Open the Azure VPN Client and go to **Settings**.

   :::image type="content" source="./media/high-availability-vpn-client/settings.png" alt-text="Screenshot shows VPN client with settings selected." lightbox="./media/high-availability-vpn-client/settings-expand.png":::

1. On the **Settings** page, select **Enable High Availability**.

   :::image type="content" source="./media/high-availability-vpn-client/enable.png" alt-text="Screenshot shows High Availability checkbox." lightbox="./media/high-availability-vpn-client/enable-expand.png":::

1. On the home page for the client, save your settings.

1. Connect to the VPN. After connecting, you'll see **Connected (HA)** in the left pane. You can also see the connection in the **Status logs**.

   :::image type="content" source="./media/high-availability-vpn-client/ha-logs.png" alt-text="Screenshot shows High Availability in left pane and in status logs." lightbox="./media/high-availability-vpn-client/ha-logs-expand.png":::

1. If you later decide that you don't want to use HA, deselect the **Enable High Availability** checkbox on the Azure VPN Client and reconnect to the VPN.

## <a name = "macOS"></a>macOS

1. Use the steps in the [Azure AD - macOS](openvpn-azure-ad-client-mac.md) article as a configuration guideline. The settings you configure may be different than the configuration example in the article, depending on what type of authentication you're using. Configure the Azure VPN Client with the settings specified in the VPN client profile.

1. Open the **Azure VPN Client** and click **Settings** at the bottom of the page.

   :::image type="content" source="./media/high-availability-vpn-client/mac-settings.png" alt-text="Screenshot click Settings button." lightbox="./media/high-availability-vpn-client/mac-settings.png":::

1. On the **Settings** page, select **Enable High Availability**. Settings are automatically saved.

   :::image type="content" source="./media/high-availability-vpn-client/mac-ha-settings.png" alt-text="Screenshot shows Enable High Availability." lightbox="./media/high-availability-vpn-client/mac-ha-settings-expand.png":::

1. Click **Connect**. Once you're connected, you can view the connection status in the left pane and in the **Status logs**.

   :::image type="content" source="./media/high-availability-vpn-client/mac-connected.png" alt-text="Screenshot mac logs and H A connection status." lightbox="./media/high-availability-vpn-client/mac-connected-expand.png":::

## Next steps

For VPN client profile information, see [Global and hub-based profiles](global-hub-profile.md).