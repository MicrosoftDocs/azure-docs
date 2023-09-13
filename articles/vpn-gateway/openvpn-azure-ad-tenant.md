---
title: 'Configure Azure AD tenant and settings for P2S VPN connections: Azure AD authentication: OpenVPN'
titleSuffix: Azure VPN Gateway
description: Learn how to set up an Azure AD tenant for P2S Azure AD authentication - OpenVPN protocol.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 09/07/2023
ms.author: cherylmc

---
# Configure an Azure AD tenant and P2S settings for VPN Gateway connections

This article helps you configure your AD tenant and P2S settings for Azure AD authentication. For more information about point-to-site protocols and authentication, see [About VPN Gateway point-to-site VPN](point-to-site-about.md). To authenticate using the Azure AD authentication type, you must include the OpenVPN tunnel type in your point-to-site configuration.

[!INCLUDE [OpenVPN note](../../includes/vpn-gateway-openvpn-auth-include.md)]

## <a name="tenant"></a> Azure AD tenant

The steps in this article require an Azure AD tenant. If you don't have an Azure AD tenant, you can create one using the steps in the [Create a new tenant](../active-directory/fundamentals/active-directory-access-create-new-tenant.md) article. Note the following fields when creating your directory:

* Organizational name
* Initial domain name

## Create Azure AD tenant users

1. Create two accounts in the newly created Azure AD tenant. For steps, see [Add or delete a new user](../active-directory/fundamentals/add-users-azure-active-directory.md).

   * Global administrator account
   * User account

   The global administrator account will be used to grant consent to the Azure VPN app registration. The user account can be used to test OpenVPN authentication.
1. Assign one of the accounts the **Global administrator** role. For steps, see  [Assign administrator and non-administrator roles to users with Azure Active Directory](/azure/active-directory-b2c/tenant-management-read-tenant-name).

## Authorize the Azure VPN application

### Authorize the application

[!INCLUDE [Steps to authorize the Azure VPN app](../../includes/vpn-gateway-vwan-azure-ad-tenant.md)]

## <a name="enable-authentication"></a>Configure authentication for the gateway

1. Locate the tenant ID of the directory that you want to use for authentication. It's listed in the properties section of the Active Directory page. For help with finding your tenant ID, see [How to find your Azure Active Directory tenant ID](../active-directory/fundamentals/how-to-find-tenant.md).

1. If you don't already have a functioning point-to-site environment, follow the instruction to create one. See [Create a point-to-site VPN](vpn-gateway-howto-point-to-site-resource-manager-portal.md) to create and configure a point-to-site VPN gateway.

    > [!IMPORTANT]
    > The Basic SKU is not supported for OpenVPN.

1. Go to the virtual network gateway. In the left pane, click **Point-to-site configuration**.

   :::image type="content" source="./media/openvpn-create-azure-ad-tenant/configuration.png" alt-text="Screenshot showing settings for Tunnel type, Authentication type, and Azure Active Directory settings.":::

   Configure the following values:

   * **Address pool**: client address pool
   * **Tunnel type:** OpenVPN (SSL)
   * **Authentication type**: Azure Active Directory

   For **Azure Active Directory** values, use the following guidelines for **Tenant**, **Audience**, and **Issuer** values. Replace {AzureAD TenantID} with your tenant ID, taking care to remove **{}** from the examples when you replace this value.

   * **Tenant:** TenantID for the Azure AD tenant. Enter the tenant ID that corresponds to your configuration. Make sure the Tenant URL does not have a `\` at the end. 

     * Azure Public AD: `https://login.microsoftonline.com/{AzureAD TenantID}`
     * Azure Government AD: `https://login.microsoftonline.us/{AzureAD TenantID}`
     * Azure Germany AD: `https://login-us.microsoftonline.de/{AzureAD TenantID}`
     * China 21Vianet AD: `https://login.chinacloudapi.cn/{AzureAD TenantID}`

   * **Audience**: The Application ID of the "Azure VPN" Azure AD Enterprise App.

     * Azure Public: `41b23e61-6c1e-4545-b367-cd054e0ed4b4`
     * Azure Government: `51bb15d4-3a4f-4ebf-9dca-40096fe32426`
     * Azure Germany: `538ee9e6-310a-468d-afef-ea97365856a9`
     * Microsoft Azure operated by 21Vianet: `49f817b6-84ae-4cc0-928c-73f27289b3aa`

   * **Issuer**: URL of the Secure Token Service. Include a trailing slash at the end of the **Issuer** value. Otherwise, the connection may fail.

     * `https://sts.windows.net/{AzureAD TenantID}/`

1. Once you finish configuring settings, click **Save** at the top of the page.

## Download the Azure VPN Client profile configuration package

In this section, you generate and download the Azure VPN Client profile configuration package. This package contains the settings that you can use to configure the Azure VPN Client profile on client computers.

[!INCLUDE [Azure VPN Client profile configuration package](../../includes/vpn-gateway-point-to-site-client-package-download.md)]

## Next steps

* To connect to your virtual network, you must configure the Azure VPN client on your client computers. See [Configure a VPN client for P2S VPN connections](openvpn-azure-ad-client.md).
* For frequently asked questions, see the **Point-to-site** section of the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#P2S).
