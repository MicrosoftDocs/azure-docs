---
title: 'How to configure OpenVPN clients for P2S VPN gateways'
titleSuffix: Azure VPN Gateway
description: Learn how to configure OpenVPN clients for Azure VPN Gateway. This article helps you configure Windows, Linux, iOS, and Mac clients.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 05/05/2022
ms.author: cherylmc

---
# Configure an OpenVPN client for Azure VPN Gateway P2S connections

This article helps you configure the **OpenVPN &reg; Protocol** client for Azure VPN Gateway point-to-site configurations. This article pertains specifically to OpenVPN clients, not the Azure VPN Client or native VPN clients.

For these authentication types, see the following articles instead:

* Azure AD authentication
  * [Windows clients](openvpn-azure-ad-client.md)
  * [macOS clients](openvpn-azure-ad-client.md)

* RADIUS authentication
  * [All RADIUS clients](point-to-site-vpn-client-configuration-radius.md)

## Before you begin

Verify that you've completed the steps to configure OpenVPN for your VPN gateway. For details, see [Configure OpenVPN for Azure VPN Gateway](vpn-gateway-howto-openvpn.md).

## VPN client configuration files

You can generate and download the VPN client configuration files from the portal, or by using PowerShell. Either method returns the same zip file. Unzip the file to view the OpenVPN folder.

When you open the zip file, if you don't see the OpenVPN folder, verify that your VPN gateway is configured to use the OpenVPN tunnel type. Additionally, if you're using Azure AD authentication, you may not have an OpenVPN folder. See the links at the top of this article for Azure AD instructions.

:::image type="content" source="./media/howto-openvpn-clients/download.png" alt-text="Screenshot of Download VPN client highlighted." :::

[!INCLUDE [configuration steps](../../includes/vpn-gateway-vwan-config-openvpn-clients.md)]

## Next steps

If you want the VPN clients to be able to access resources in another VNet, then follow the instructions on the [VNet-to-VNet](vpn-gateway-howto-vnet-vnet-resource-manager-portal.md) article to set up a vnet-to-vnet connection. Be sure to enable BGP on the gateways and the connections, otherwise traffic won't flow.

**"OpenVPN" is a trademark of OpenVPN Inc.**
