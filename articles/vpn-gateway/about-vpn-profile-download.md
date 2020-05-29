---
title: 'Azure VPN Gateway: About P2S VPN client profiles'
description: This helps you work with the client profile file
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: article
ms.date: 05/13/2020
ms.author: cherylmc

---
# About P2S VPN client profiles

The downloaded profile file contains information that is necessary to configure a VPN connection. This article will help you obtain and understand the information necessary for a VPN client profile.

[!INCLUDE [client profiles](../../includes/vpn-gateway-vwan-vpn-profile-download.md)]

* The **OpenVPN folder** contains the *ovpn* profile that needs to be modified to include the key and the certificate. For more information, see [Configure OpenVPN clients for Azure VPN Gateway](vpn-gateway-howto-openvpn-clients.md#windows). If Azure AD authentication is selected on the VPN gateway, this folder is not present in the zip file. Instead, navigate to the AzureVPN folder and locate azurevpnconfig.xml.

## Next steps

For more information about point-to-site, see [About point-to-site](point-to-site-about.md).
