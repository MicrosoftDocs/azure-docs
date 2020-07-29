---
title: 'Enable MFA for VPN users: Azure AD authentication'
description: Enable multi-factor authentication for VPN users
services: virtual-wan
author: anzaman

ms.service: virtual-wan
ms.topic: how-to
ms.date: 01/16/2020
ms.author: alzam

---
# Enable Azure Multi-Factor Authentication (MFA) for VPN users

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

To connect to your virtual network, you must create and configure a VPN client profile. See [Configure Azure AD authentication for Point-to-Site connection to Azure](virtual-wan-point-to-site-azure-ad.md).
