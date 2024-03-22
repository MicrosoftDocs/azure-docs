---
title: 'Enable MFA for VPN users by using Microsoft Entra authentication'
description: Learn how to enable Microsoft Entra multifactor authentication (MFA) for VPN users by using Microsoft Entra authentication.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: how-to
ms.date: 08/23/2023
ms.author: alzam

---
# Enable Microsoft Entra multifactor authentication (MFA) for VPN users by using Microsoft Entra authentication

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

To connect to your virtual network, you must create and configure a VPN client profile. See [Configure Microsoft Entra authentication for Point-to-Site connection to Azure](virtual-wan-point-to-site-azure-ad.md).
