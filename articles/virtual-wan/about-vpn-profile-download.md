---
title: 'Azure Virtual WAN: User VPN client profiles'
description: This helps you work with the client profile file
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: how-to
ms.date: 08/24/2023
ms.author: cherylmc

---
# Working with User VPN client profile files

The profile files contain information that is necessary to configure a VPN connection. This article helps you obtain and understand the information necessary for a User VPN client profile.

## Download the profile

You can use the steps in the [Download profiles](global-hub-profile.md) article to download the client profile zip file.

[!INCLUDE [client profiles](../../includes/vpn-gateway-vwan-vpn-profile-download.md)]

* The **OpenVPN folder** contains the *ovpn* profile that needs to be modified to include the key and the certificate. For more information, see [Configure OpenVPN clients](../virtual-wan/howto-openvpn-clients.md#windows).

## Next steps

For more information about Virtual WAN User VPN, see [Create a User VPN connection](virtual-wan-point-to-site-portal.md).
