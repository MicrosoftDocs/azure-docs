---
ms.author: cherylmc
author: cherylmc
ms.date: 07/28/2022
ms.service: virtual-wan
ms.topic: include
---

**IKEv2**

In the User VPN configuration, if you specified the IKEv2 VPN tunnel type, you can configure the native VPN client (Windows and macOS Catalina or later).

The following steps are for Windows. For macOS, see [IKEv2-macOS](../articles/virtual-wan/point-to-site-vpn-client-cert-mac.md#ikev2-macOS) steps.

1. Select the VPN client configuration files that correspond to the architecture of the Windows computer. For a 64-bit processor architecture, choose the 'VpnClientSetupAmd64' installer package. For a 32-bit processor architecture, choose the 'VpnClientSetupX86' installer package.

1. Double-click the package to install it. If you see a SmartScreen popup, select **More info**, then **Run anyway**.

1. On the client computer, navigate to **Network Settings** and select **VPN**. The VPN connection shows the name of the virtual network that it connects to.

1. Install a client certificate on each computer that you want to connect via this User VPN configuration. A client certificate is required for authentication when using the native Azure certificate authentication type. For more information about generating certificates, see [Generate Certificates](../articles/virtual-wan/certificates-point-to-site.md). For information about how to install a client certificate, see [Install a client certificate](../articles/virtual-wan/install-client-certificates.md).

**OpenVPN**

In the User VPN configuration, if you specified the OpenVPN tunnel type, you can download and configure the Azure VPN client or, in some cases, you can use OpenVPN client software. For steps, use the link that corresponds to your configuration.

* [Azure AD authentication - Azure VPN client - Windows](../articles/virtual-wan/openvpn-azure-ad-client.md)
* [Azure AD authentication - Azure VPN client - macOS](../articles/virtual-wan/openvpn-azure-ad-client-mac.md)
* [Configure OpenVPN client software - Windows, macOS, iOS, Linux ](../articles/virtual-wan/howto-openvpn-clients.md)
