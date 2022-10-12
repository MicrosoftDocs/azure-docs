---
title: 'Configure Azure AD tenant and settings for P2S VPN connections: Azure AD authentication: OpenVPN'
titleSuffix: Azure VPN Gateway
description: Learn how to set up an Azure AD tenant for P2S Azure AD authentication - OpenVPN protocol.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 09/06/2022
ms.author: cherylmc

---
# Configure an Azure AD tenant and P2S configuration for VPN Gateway P2S connections

This article helps you configure your AD tenant and P2S settings for Azure AD authentication. For more information about point-to-site protocols and authentication, see [About VPN Gateway point-to-site VPN](point-to-site-about.md). To authenticate using the Azure AD authentication type, you must include the OpenVPN tunnel type in your point-to-site configuration.

[!INCLUDE [OpenVPN note](../../includes/vpn-gateway-openvpn-auth-include.md)]

## <a name="tenant"></a>1. Verify Azure AD tenant

Verify that you have an Azure AD tenant. If you don't have an Azure AD tenant, you can create one using the steps in the [Create a new tenant](../active-directory/fundamentals/active-directory-access-create-new-tenant.md) article. Note the following fields when creating your directory:

* Organizational name
* Initial domain name

## <a name="users"></a>2. Create Azure AD tenant users

1. Create two accounts in the newly created Azure AD tenant. For steps, see [Add or delete a new user](../active-directory/fundamentals/add-users-azure-active-directory.md).

   * Global administrator account
   * User account

   The global administrator account will be used to grant consent to the Azure VPN app registration. The user account can be used to test OpenVPN authentication.
1. Assign one of the accounts the **Global administrator** role. For steps, see  [Assign administrator and non-administrator roles to users with Azure Active Directory](../active-directory/fundamentals/active-directory-users-assign-role-azure-portal.md).

## <a name="enable-authentication"></a>3. Enable Azure AD authentication on the VPN gateway

### Enable the application

[!INCLUDE [Steps to enable the tenant](../../includes/vpn-gateway-vwan-azure-ad-tenant.md)]

### Configure point-to-site settings

1. Locate the tenant ID of the directory that you want to use for authentication. It's listed in the properties section of the Active Directory page. For help with finding your tenant ID, see [How to find your Azure Active Directory tenant ID](../active-directory/fundamentals/active-directory-how-to-find-tenant.md).

1. If you don't already have a functioning point-to-site environment, follow the instruction to create one. See [Create a point-to-site VPN](vpn-gateway-howto-point-to-site-resource-manager-portal.md) to create and configure a point-to-site VPN gateway.

    > [!IMPORTANT]
    > The Basic SKU is not supported for OpenVPN.

1. Enable Azure AD authentication on the VPN gateway by going to **Point-to-site configuration** and picking **OpenVPN (SSL)** as the **Tunnel type**. Select **Azure Active Directory** as the **Authentication type**, then fill in the information under the **Azure Active Directory** section. Replace {AzureAD TenantID} with your tenant ID.

   * **Tenant:** TenantID for the Azure AD tenant

   	 * Enter `https://login.microsoftonline.com/{AzureAD TenantID}/` for Azure Public AD
   	 * Enter `https://login.microsoftonline.us/{AzureAD TenantID/` for Azure Government AD
   	 * Enter `https://login-us.microsoftonline.de/{AzureAD TenantID/` for Azure Germany AD
   	 * Enter `https://login.chinacloudapi.cn/{AzureAD TenantID/` for China 21Vianet AD
	
   * **Audience:** Application ID of the "Azure VPN" Azure AD Enterprise App

	  * Enter 41b23e61-6c1e-4545-b367-cd054e0ed4b4 for Azure Public
	  * Enter 51bb15d4-3a4f-4ebf-9dca-40096fe32426 for Azure Government
	  * Enter 538ee9e6-310a-468d-afef-ea97365856a9 for Azure Germany
	  * Enter 49f817b6-84ae-4cc0-928c-73f27289b3aa for Azure China 21Vianet


   * **Issuer**: URL of the Secure Token Service `https://sts.windows.net/{AzureAD TenantID}/`


     :::image type="content" source="./media/openvpn-create-azure-ad-tenant/configuration.png" alt-text="Screenshot showing settings for Tunnel type, Authentication type, and Azure Active Directory settings.":::

     > [!NOTE]
     > Make sure you include a trailing slash at the end of the **Issuer** value. Otherwise, the connection may fail.
     >

1. Save your changes.

1. At the top of the page, click **Download VPN client**. It takes a few minutes for the client configuration package to generate.

1. Your browser indicates that a client configuration zip file is available. It's named the same name as your gateway.

1. Extract the downloaded zip file.

1. Browse to the unzipped “AzureVPN” folder.

1. Make a note of the location of the “azurevpnconfig.xml” file. The azurevpnconfig.xml contains the setting for the VPN connection. You can also distribute this file to all the users that need to connect via e-mail or other means. The user will need valid Azure AD credentials to connect successfully. For more information, see [Azure VPN client profile config files for Azure AD authentication](about-vpn-profile-download.md).

## Next steps

[Configure a VPN client for P2S VPN connections](openvpn-azure-ad-client.md).