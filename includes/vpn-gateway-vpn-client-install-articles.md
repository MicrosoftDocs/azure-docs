---
author: cherylmc
ms.author: cherylmc
ms.date: 04/09/2024
ms.service: vpn-gateway
ms.topic: include
---

| Authentication | Tunnel type |Server config| Generate config files| Configure VPN client |
| --- | --- | --- |---| --- |
| Azure certificate | IKEv2, SSTP   | [Article](../articles/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md)|  [Windows](../articles/vpn-gateway/point-to-site-vpn-client-cert-windows.md)| [Native VPN client](../articles/vpn-gateway/point-to-site-vpn-client-certificate-windows-native.md)
| Azure certificate | OpenVPN  | [Article](../articles/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md)|  [Windows](../articles/vpn-gateway/point-to-site-vpn-client-cert-windows.md)|- [OpenVPN client](../articles/vpn-gateway/point-to-site-vpn-client-certificate-windows-openvpn-client.md)<br>- [Azure VPN client](../articles/vpn-gateway/point-to-site-vpn-client-certificate-windows-azure-vpn-client.md)
| Azure certificate | IKEv2, OpenVPN  | [Article](../articles/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md)| [macOS-iOS](../articles/vpn-gateway/point-to-site-vpn-client-cert-mac.md)|[macOS-iOS](../articles/vpn-gateway/point-to-site-vpn-client-cert-mac.md)|
| Azure certificate |  IKEv2, OpenVPN  |  [Article](../articles/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md)| [Linux](../articles/vpn-gateway/point-to-site-vpn-client-cert-linux.md) |[Linux](../articles/vpn-gateway/point-to-site-vpn-client-cert-linux.md) |
| Microsoft Entra ID - 3rd-party App ID |OpenVPN (SSL) |[Article](../articles/vpn-gateway/openvpn-azure-ad-tenant.md) | [Windows](../articles/vpn-gateway/openvpn-azure-ad-client.md) |[Windows](../articles/vpn-gateway/openvpn-azure-ad-client.md) |
| Microsoft Entra ID - 3rd-party App ID| OpenVPN (SSL)|[Article](../articles/vpn-gateway/openvpn-azure-ad-tenant.md)|  [macOS](../articles/vpn-gateway/openvpn-azure-ad-client-mac.md) |[macOS](../articles/vpn-gateway/openvpn-azure-ad-client-mac.md) |
| Microsoft Entra ID - 1st-party App ID | OpenVPN (SSL) | [Linux](../articles/vpn-gateway/point-to-site-entra-application-id-first-party.md) | [Linux](../articles/vpn-gateway/point-to-site-entra-application-id-first-party.md)| [Linux](../articles/vpn-gateway/point-to-site-entra-vpn-client-linux.md) |
| RADIUS - certificate |  - | - |[Article](../articles/vpn-gateway/point-to-site-vpn-client-configuration-radius-certificate.md)|[Article](../articles/vpn-gateway/point-to-site-vpn-client-configuration-radius-certificate.md)|
| RADIUS -  password | - | -  |[Article](../articles/vpn-gateway/point-to-site-vpn-client-configuration-radius-password.md)|[Article](../articles/vpn-gateway/point-to-site-vpn-client-configuration-radius-password.md)|
| RADIUS - other methods |  - | - |[Article](../articles/vpn-gateway/point-to-site-vpn-client-configuration-radius-other.md)|[Article](../articles/vpn-gateway/point-to-site-vpn-client-configuration-radius-other.md)|
