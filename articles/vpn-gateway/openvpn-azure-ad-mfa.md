---
title: 'Enable MFA for VPN users - Microsoft Entra ID authentication'
titleSuffix: Azure VPN Gateway
description: Learn how to enable multifactor authentication (MFA) for VPN users.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 01/17/2025
ms.author: cherylmc

---
# Enable Microsoft Entra ID multifactor authentication (MFA) for P2S VPN users

[!INCLUDE [overview](../../includes/vpn-gateway-vwan-openvpn-enable-mfa-overview.md)]

## <a name="enableauth"></a>Enable authentication

[!INCLUDE [enable authentication](../../includes/vpn-gateway-vwan-openvpn-enable-auth.md)]

## <a name="enablesign"></a>Configure sign-in settings

[!INCLUDE [sign in](../../includes/vpn-gateway-vwan-openvpn-sign-in.md)]

## <a name="peruser"></a>Option 1 - Per User access

[!INCLUDE [per user](../../includes/vpn-gateway-vwan-openvpn-per-user.md)]

## <a name="conditional"></a>Option 2 - Conditional Access

[!INCLUDE [conditional access](../../includes/vpn-gateway-vwan-openvpn-conditional.md)]

## Next steps

To connect to your virtual network, you must create and configure a VPN client profile. See [Configure a VPN client for P2S VPN connections](point-to-site-entra-gateway.md#download).
