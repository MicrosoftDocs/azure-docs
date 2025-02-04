---
title: 'Azure Virtual WAN: User VPN client profiles'
description: This helps you work with the client profile file
services: virtual-wan
author: cherylmc

ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 02/04/2025
ms.author: cherylmc

---
# Working with User VPN client profile files

The profile files contain information that is necessary to configure a VPN connection. This article helps you obtain and understand the information necessary for a User VPN client profile.

## Download the profile

You can use the steps in the [Download profiles](global-hub-profile.md) article to download the client profile zip file.

[!INCLUDE [client profiles](../../includes/vpn-gateway-vwan-vpn-profile-download.md)]

* The **OpenVPN folder** contains the *ovpn* profile that needs to be modified to include the key and the certificate. For information about configuring OpenVPN clients, see the following articles:

   | Client OS| Article |
   |---|---|
   | Windows | [OpenVPN 2.x](point-to-site-vpn-client-certificate-windows-openvpn-client-version-2.md) |
   | Windows | [OpenVPN 3.x](point-to-site-vpn-client-certificate-windows-openvpn-client-version-3.md) |
   | macOS | [OpenVPN](point-to-site-vpn-client-certificate-openvpn-mac.md) |
   | iOS | [OpenVPN](point-to-site-vpn-client-certificate-openvpn-ios.md) |
   | Linux | [OpenVPN](../vpn-gateway/point-to-site-vpn-client-certificate-openvpn-linux.md) |

## Next steps

For more information about Virtual WAN User VPN, see [Create a User VPN connection](virtual-wan-point-to-site-portal.md).
