---
title: 'Enable MFA for VPN users: Azure AD authentication'
description: Enable multi-factor authentication for VPN users
services: virtual-wan
author: anzaman

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 01/16/2020
ms.author: alzam

---
# Enable Azure Multi-Factor Authentication (MFA) for VPN users

If you want users to be prompted for a second factor of authentication before granting access, you can configure Azure Multi-Factor Authentication (MFA) for your Azure AD tenant. The steps in this article help you enable a requirement for two-step verification.

## <a name="prereq"></a>Prerequisite

The prerequisite for this configuration is a configured Azure AD tenant using the steps in [Configure a tenant](openvpn-azure-ad-tenant.md).

[!INCLUDE [MFA steps](../../includes/vpn-gateway-vwan-openvpn-azure-ad-mfa.md)]

## <a name="enablesign"></a> Configure sign-in settings

On the **Azure VPN - Properties** page, configure sign-in settings.

1. Set **Enabled for users to sign-in?** to **Yes**. This allows all users in the AD tenant to connect to the VPN successfully.
2. Set **User assignment required?** to **Yes** if you want to limit sign-in to only users that have permissions to the Azure VPN.
3. Save your changes.

   ![Permissions](./media/openvpn-azure-ad-mfa/user2.jpg)

## Next steps

To connect to your virtual network, you must create and configure a VPN client profile. See [Configure Azure AD authentication for Point-to-Site connection to Azure](virtual-wan-point-to-site-azure-ad.md).
