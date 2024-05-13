---
author: cherylmc
ms.author: cherylmc
ms.date: 05/02/2024
ms.service: vpn-gateway
ms.topic: include
---

| Authentication | Tunnel type |Generate config files| Configure VPN client |
| --- | --- | --- |---| 
| Azure certificate | IKEv2, SSTP   |  [Windows](../articles/vpn-gateway/point-to-site-vpn-client-cert-windows.md)| [Native VPN client](../articles/vpn-gateway/point-to-site-vpn-client-certificate-windows-native.md)
| Azure certificate | OpenVPN  | [Windows](../articles/vpn-gateway/point-to-site-vpn-client-cert-windows.md)|- [OpenVPN client](../articles/vpn-gateway/point-to-site-vpn-client-certificate-windows-openvpn-client.md)<br>- [Azure VPN client](../articles/vpn-gateway/point-to-site-vpn-client-certificate-windows-azure-vpn-client.md)
| Azure certificate | IKEv2, OpenVPN  | [macOS-iOS](../articles/vpn-gateway/point-to-site-vpn-client-cert-mac.md)|[macOS-iOS](../articles/vpn-gateway/point-to-site-vpn-client-cert-mac.md)|
| Azure certificate |  IKEv2, OpenVPN  | [Linux](../articles/vpn-gateway/point-to-site-vpn-client-cert-linux.md) |[Linux](../articles/vpn-gateway/point-to-site-vpn-client-cert-linux.md) |
| Azure certificate | OpenVPN | [Generate](../articles/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md#profile-files) | [Azure VPN Client - Linux](../articles/vpn-gateway/point-to-site-certificate-client-linux-azure-vpn-client.md)
| Microsoft Entra ID - registered Enterprise app | OpenVPN (SSL) | [Linux](../articles/vpn-gateway/point-to-site-entra-gateway.md)| [Azure VPN Client - Linux](../articles/vpn-gateway/point-to-site-entra-vpn-client-linux.md) |
| Microsoft Entra ID - registered Enterprise app | OpenVPN (SSL) | [Windows](../articles/vpn-gateway/point-to-site-entra-gateway.md)| [Azure VPN Client - Windows](../articles/vpn-gateway/point-to-site-entra-vpn-client-linux.md) |
| Microsoft Entra ID - registered Enterprise app | OpenVPN (SSL) | [macOS](../articles/vpn-gateway/point-to-site-entra-gateway.md)| [Azure VPN Client - macOS](../articles/vpn-gateway/point-to-site-entra-vpn-client-linux.md) |
| Microsoft Entra ID - manually registered app |OpenVPN (SSL) | [Windows](../articles/vpn-gateway/openvpn-azure-ad-client.md) |[Azure VPN Client - Windows](../articles/vpn-gateway/openvpn-azure-ad-client.md) |
| Microsoft Entra ID - manually registered app| OpenVPN (SSL)| [macOS](../articles/vpn-gateway/openvpn-azure-ad-client-mac.md) |[Azure VPN Client - macOS](../articles/vpn-gateway/openvpn-azure-ad-client-mac.md) |
| RADIUS - certificate |  - | [Article](../articles/vpn-gateway/point-to-site-vpn-client-configuration-radius-certificate.md)|[Article](../articles/vpn-gateway/point-to-site-vpn-client-configuration-radius-certificate.md)|
| RADIUS -  password | - | [Article](../articles/vpn-gateway/point-to-site-vpn-client-configuration-radius-password.md)|[Article](../articles/vpn-gateway/point-to-site-vpn-client-configuration-radius-password.md)|
| RADIUS - other methods |  - | [Article](../articles/vpn-gateway/point-to-site-vpn-client-configuration-radius-other.md)|[Article](../articles/vpn-gateway/point-to-site-vpn-client-configuration-radius-other.md)|
