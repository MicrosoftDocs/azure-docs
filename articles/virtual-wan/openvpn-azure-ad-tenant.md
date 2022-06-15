---
title: 'Azure AD tenant for User VPN connections: Azure AD authentication -OpenVPN'
description: You can use Azure Virtual WAN User VPN (point-to-site) to connect to your VNet using Azure AD authentication
titleSuffix: Azure Virtual WAN
author: cherylmc
ms.service: virtual-wan
ms.topic: how-to
ms.date: 06/14/2022
ms.author: cherylmc

---

# Configure an Azure AD tenant for P2S User VPN OpenVPN protocol connections

When you connect to your VNet using Virtual WAN User VPN (point-to-site), you have a choice of which protocol to use. The protocol you use determines the authentication options that are available to you. If you're using the OpenVPN protocol, Azure Active Directory authentication is one of the authentication options available for you to use. This article helps you configure an Azure AD tenant for Virtual WAN User VPN (point-to-site) using OpenVPN authentication.

[!INCLUDE [OpenVPN note](../../includes/vpn-gateway-openvpn-auth-include.md)]

## <a name="tenant"></a>1. Create the Azure AD tenant

Verify that you have an Azure AD tenant. If you don't have an Azure AD tenant, you can create one using the steps in the [Create a new tenant](../active-directory/fundamentals/active-directory-access-create-new-tenant.md) article:

* Organization name
* Initial domain name

## <a name="users"></a>2. Create Azure AD tenant users

1. Create two accounts in the newly created Azure AD tenant. For steps, see [Add or delete a new user](../active-directory/fundamentals/add-users-azure-active-directory.md).

   * Global administrator account
   * User account

   The global administrator account will be used to grant consent to the Azure VPN app registration. The user account can be used to test OpenVPN authentication.
1. Assign one of the accounts the **Global administrator** role. For steps, see  [Assign administrator and non-administrator roles to users with Azure Active Directory](../active-directory/fundamentals/active-directory-users-assign-role-azure-portal.md).

## <a name="enable-authentication"></a>3. Grant consent to the Azure VPN app registration

[!INCLUDE [Steps to enable the tenant](../../includes/vpn-gateway-vwan-azure-ad-tenant.md)]

## Next steps

In order to connect to your virtual networks using Azure AD authentication, you must create a User VPN configuration and associate it to a Virtual Hub. See [Configure Azure AD authentication for point-to-site connection to Azure](virtual-wan-point-to-site-azure-ad.md).
