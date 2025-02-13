---
author: cherylmc
ms.author: cherylmc
ms.date: 02/12/2025
ms.service: azure-virtual-wan
ms.topic: include
---

| Authentication method | Tunnel type | Client OS | VPN client |
|---|---|---|---|
| Certificate | IKEv2, SSTP | Windows |[Native VPN client](../articles/virtual-wan/point-to-site-vpn-client-certificate-windows-native.md) |
| | IKEv2| macOS|[Native VPN client](../articles/virtual-wan/point-to-site-vpn-client-cert-mac.md) |
| |IKEv2 |Linux | [strongSwan](../articles/virtual-wan/point-to-site-vpn-client-certificate-ike-linux.md)|
| | OpenVPN | Windows | [Azure VPN client](../articles/virtual-wan/vpn-client-certificate-windows.md)<br>[OpenVPN client version 2.x](../articles/virtual-wan/point-to-site-vpn-client-certificate-windows-openvpn-client-version-2.md)<br>[OpenVPN client version 3.x](../articles/virtual-wan/point-to-site-vpn-client-certificate-windows-openvpn-client-version-3.md) |
| | OpenVPN | macOS | [OpenVPN client](../articles/virtual-wan/point-to-site-vpn-client-certificate-openvpn-mac.md) |
| | OpenVPN | iOS | [OpenVPN client](../articles/virtual-wan/point-to-site-vpn-client-certificate-openvpn-ios.md) |
| | OpenVPN |Linux | [Azure VPN client](../articles/virtual-wan/point-to-site-azure-vpn-client-certificate-linux.md)<br>[OpenVPN client](../articles/virtual-wan/point-to-site-vpn-client-certificate-openvpn-linux.md)|
| Microsoft Entra ID | OpenVPN | Windows | [Azure VPN client](../articles/virtual-wan/point-to-site-entra-vpn-client-windows.md) |
|  | OpenVPN | macOS | [Azure VPN client](../articles/virtual-wan/point-to-site-entra-vpn-client-mac.md) |
|  | OpenVPN| Linux |[Azure VPN client](../articles/virtual-wan/point-to-site-entra-vpn-client-linux.md) |