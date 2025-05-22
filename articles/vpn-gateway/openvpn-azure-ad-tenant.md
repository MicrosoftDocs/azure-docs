---
title: 'Configure a P2S VPN - Microsoft Entra ID authentication - manually registered Azure VPN Client App ID'
titleSuffix: Azure VPN Gateway
description: Learn how to set up a Microsoft Entra tenant and P2S gateway for P2S Microsoft Entra authentication - OpenVPN protocol.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 02/25/2025
ms.author: cherylmc

#Note that Audience values are not sensitive data. 

---

# Configure P2S VPN gateway for Microsoft Entra ID authentication – manually registered app

This article helps you configure a point-to-site (P2S) VPN gateway for Microsoft Entra ID authentication and manually register the Azure VPN client. This type of configuration is supported only for OpenVPN protocol connections. While the steps and Audience values in this article do result in a working configuration, we recommend that you use the [Configure P2S VPN Gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md) article instead.

> [!IMPORTANT]
> We recommend using the new [Configure P2S VPN Gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md) article. The new article offers a more efficient setup process using the new **Microsoft-registered Azure VPN Client App ID** Audience value. Additionally, the new Audience value now supports the Azure VPN Client for Linux. If your P2S User VPN gateway is already set up with the manually configured Azure VPN Client Audience values, you can [migrate](point-to-site-entra-gateway-update.md) to the new Microsoft-registered App ID.

## Prerequisites

The steps in this article require a Microsoft Entra tenant. If you don't have a Microsoft Entra tenant, you can create one using the steps in the [Create a new tenant](../active-directory/fundamentals/active-directory-access-create-new-tenant.md) article. Note the following fields when creating your directory:

* Organizational name
* Initial domain name

If you already have an existing P2S gateway, the steps in this article help you configure the gateway for Microsoft Entra ID authentication. You can also create a new VPN gateway. The link to create a new gateway is included in this article.

[!INCLUDE [OpenVPN note](../../includes/vpn-gateway-openvpn-auth-include.md)]

## <a name='create-azure-ad-tenant-users'></a>Create Microsoft Entra tenant users

1. Create two accounts in the newly created Microsoft Entra tenant. For steps, see [Add or delete a new user](../active-directory/fundamentals/add-users-azure-active-directory.md).

   * [Cloud Application Administrator role](/entra/identity/role-based-access-control/permissions-reference#cloud-application-administrator)
   * User account

   The Cloud Application Administrator role is used to grant consent to the Azure VPN app registration. The user account can be used to test OpenVPN authentication.
1. Assign one of the accounts the **Cloud Application Administrator** role. For steps, see  [Assign administrator and non-administrator roles to users with Microsoft Entra ID](/azure/active-directory-b2c/tenant-management-read-tenant-name).

## Authorize the Azure VPN application

[!INCLUDE [Steps to authorize the Azure VPN app](../../includes/vpn-gateway-vwan-azure-ad-tenant.md)]

## <a name="enable-authentication"></a>Configure the VPN gateway

> [!IMPORTANT]
> [!INCLUDE [Entra ID note for portal pages](../../includes/vpn-gateway-entra-portal-note.md)]

1. Locate the tenant ID of the directory that you want to use for authentication. It's listed in the properties section of the Active Directory page. For help with finding your tenant ID, see [How to find your Microsoft Entra tenant ID](../active-directory/fundamentals/how-to-find-tenant.md).

1. If you don't already have a functioning point-to-site environment, follow the instruction to create one. See [Create a point-to-site VPN](point-to-site-certificate-gateway.md) to create and configure a point-to-site VPN gateway. When you create a VPN gateway, the Basic SKU isn't supported for OpenVPN.

1. Go to the virtual network gateway. In the left pane, click **Point-to-site configuration**.

   :::image type="content" source="./media/openvpn-create-azure-ad-tenant/configuration.png" alt-text="Screenshot showing settings for Tunnel type, Authentication type, and Microsoft Entra settings.":::

   Configure the following values:

   * **Address pool**: client address pool
   * **Tunnel type:** OpenVPN (SSL)
   * **Authentication type**: Microsoft Entra ID

   For **Microsoft Entra ID** values, use the following guidelines for **Tenant**, **Audience**, and **Issuer** values. Replace {TenantID} with your tenant ID, taking care to remove **{}** from the examples when you replace this value.

   * **Tenant:** TenantID for the Microsoft Entra tenant. Enter the tenant ID that corresponds to your configuration. Make sure the Tenant URL doesn't have a `\` (backslash) at the end. Forward slash is permissible.

     * Azure Public AD: `https://login.microsoftonline.com/{TenantID}`
     * Azure Government AD: `https://login.microsoftonline.us/{TenantID}`
     * Azure Germany AD: `https://login-us.microsoftonline.de/{TenantID}`
     * China 21Vianet AD: `https://login.chinacloudapi.cn/{TenantID}`

   * **Audience**: The Application ID of the "Azure VPN" Microsoft Entra Enterprise App.

     * Azure Public: `41b23e61-6c1e-4545-b367-cd054e0ed4b4`
     * Azure Government: `51bb15d4-3a4f-4ebf-9dca-40096fe32426`
     * Azure Germany: `538ee9e6-310a-468d-afef-ea97365856a9`
     * Microsoft Azure operated by 21Vianet: `49f817b6-84ae-4cc0-928c-73f27289b3aa`

   * **Issuer**: URL of the Secure Token Service. Include a trailing slash at the end of the **Issuer** value. Otherwise, the connection might fail. Example:

     * `https://sts.windows.net/{TenantID}/`

1. Once you finish configuring settings, click **Save** at the top of the page.

## Download the Azure VPN Client profile configuration package

In this section, you generate and download the Azure VPN Client profile configuration package. This package contains the settings that you can use to configure the Azure VPN Client profile on client computers.

[!INCLUDE [Azure VPN Client profile configuration package](../../includes/vpn-gateway-point-to-site-client-package-download.md)]

## Next steps

* To connect to your virtual network, you must configure the Azure VPN client on your client computers. See [Configure a VPN client for P2S VPN connections- Windows](point-to-site-entra-vpn-client-windows.md) or [Configure a VPN client for P2S VPN connections- macOS](point-to-site-entra-vpn-client-mac.md).
* For frequently asked questions, see the **Point-to-site** section of the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#P2S).
