---
author: cherylmc
ms.author: cherylmc
ms.date: 05/15/2024
ms.service: azure-vpn-gateway
ms.topic: include
---

| Authentication | Tunnel type |Client OS|VPN client |
| --- | --- | --- |---|
| Certificate |    | |  |
|  | IKEv2, SSTP   |Windows |  [Native VPN client](../articles/vpn-gateway/point-to-site-vpn-client-certificate-windows-native.md)|
|  | IKEv2|macOS |[Native VPN client](../articles/vpn-gateway/point-to-site-vpn-client-cert-mac.md)|
| |  IKEv2|Linux |[strongSwan](../articles/vpn-gateway/point-to-site-vpn-client-certificate-ike-linux.md) |
| | OpenVPN |Windows |[Azure VPN client](../articles/vpn-gateway/point-to-site-vpn-client-certificate-windows-azure-vpn-client.md)<br> [OpenVPN client](../articles/vpn-gateway/point-to-site-vpn-client-certificate-windows-openvpn-client.md)|
| | OpenVPN  |macOS|[OpenVPN client](../articles/vpn-gateway/point-to-site-vpn-client-certificate-openvpn-mac.md)|
| | OpenVPN  |iOS |[OpenVPN client](../articles/vpn-gateway/point-to-site-vpn-client-certificate-openvpn-ios.md)|
| | OpenVPN |Linux | [Azure VPN Client](../articles/vpn-gateway/point-to-site-certificate-client-linux-azure-vpn-client.md)<br>[OpenVPN client](../articles/vpn-gateway/point-to-site-vpn-client-certificate-openvpn-linux.md)|
| Microsoft Entra ID |    | |  |
|   | OpenVPN| Windows | [Azure VPN client](../articles/vpn-gateway/point-to-site-entra-vpn-client-windows.md)|
|  | OpenVPN| macOS |[Azure VPN Client](../articles/vpn-gateway/point-to-site-entra-vpn-client-mac.md) |
|  | OpenVPN| Linux |[Azure VPN Client](../articles/vpn-gateway/point-to-site-entra-vpn-client-linux.md) |