---
ms.author: cherylmc
author: cherylmc
ms.date: 07/30/2021
ms.service: virtual-wan
ms.topic: include
---

**OpenVPN**

* [Configure an OpenVPN client for Azure Virtual WAN](../articles/virtual-wan/howto-openvpn-clients.md)
* [Azure AD authentication - Windows 10](../articles/virtual-wan/openvpn-azure-ad-client.md)
* [Azure AD authentication - macOS](../articles/virtual-wan/openvpn-azure-ad-client-mac.md)

**IKEv2**

1. Select the VPN client configuration files that correspond to the architecture of the Windows computer. For a 64-bit processor architecture, choose the 'VpnClientSetupAmd64' installer package. For a 32-bit processor architecture, choose the 'VpnClientSetupX86' installer package.

1. Double-click the package to install it. If you see a SmartScreen popup, select **More info**, then **Run anyway**.

1. On the client computer, navigate to **Network Settings** and select **VPN**. The VPN connection shows the name of the virtual network that it connects to.

1. Before you attempt to connect, verify that you have installed a client certificate on the client computer. A client certificate is required for authentication when using the native Azure certificate authentication type. For more information about generating certificates, see [Generate Certificates](../articles/virtual-wan/certificates-point-to-site.md). For information about how to install a client certificate, see [Install a client certificate](../articles/vpn-gateway/point-to-site-how-to-vpn-client-install-azure-cert.md).
