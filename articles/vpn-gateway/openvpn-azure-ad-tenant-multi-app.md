---
title: 'Configure P2S for different user and group access: Microsoft Entra authentication and multi app'
titleSuffix: Azure VPN Gateway
description: Learn how to set up a Microsoft Entra tenant for P2S OpenVPN authentication and register multiple apps in Microsoft Entra ID to allow different access for different users and groups.
author: cherylmc
ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 08/18/2023
ms.author: cherylmc
ms.custom: engagement-fy23
---

# Configure P2S for access based on users and groups - Microsoft Entra authentication

When you use Microsoft Entra ID as the authentication method for P2S, you can configure P2S to allow different access for different users and groups. If you want different sets of users to be able to connect to different VPN gateways, you can register multiple apps in AD and link them to different VPN gateways. This article helps you set up a Microsoft Entra tenant for P2S Microsoft Entra authentication and create and register multiple apps in Microsoft Entra ID for allowing different access for different users and groups. For more information about point-to-site protocols and authentication, see [About point-to-site VPN](point-to-site-about.md).

[!INCLUDE [OpenVPN note](../../includes/vpn-gateway-openvpn-auth-include.md)]

<a name='azure-ad-tenant'></a>

## Microsoft Entra tenant

The steps in this article require a Microsoft Entra tenant. If you don't have a Microsoft Entra tenant, you can create one using the steps in the [Create a new tenant](../active-directory/fundamentals/active-directory-access-create-new-tenant.md) article. Note the following fields when creating your directory:

* Organizational name
* Initial domain name

<a name='create-azure-ad-tenant-users'></a>

## Create Microsoft Entra tenant users

1. Create two accounts in the newly created Microsoft Entra tenant. For steps, see [Add or delete a new user](../active-directory/fundamentals/add-users-azure-active-directory.md).

   * Global administrator account
   * User account

   The global administrator account will be used to grant consent to the Azure VPN app registration. The user account can be used to test OpenVPN authentication.

1. Assign one of the accounts the **Global administrator** role. For steps, see  [Assign administrator and non-administrator roles to users with Microsoft Entra ID](../active-directory/fundamentals/active-directory-users-assign-role-azure-portal.md).

## Authorize the Azure VPN application

[!INCLUDE [Steps to authorize the Azure VPN app](../../includes/vpn-gateway-vwan-azure-ad-tenant.md)]

## Register additional applications

In this section, you can register additional applications for various users and groups. Repeat the steps to create as many applications that are needed for your security requirements. Each application will be associated to a VPN gateway and can have a different set of users. Only one application can be associated to a gateway.

### Add a scope

1. In the Azure portal, select **Microsoft Entra ID**.
1. In the left pane, select **App registrations**.
1. At the top of the **App registrations** page, select **+ New registration**.
1. On the **Register an application** page, enter the **Name**. For example, MarketingVPN. You can always change the name later.
   * Select the desired **Supported account types**.
   * At the bottom of the page, click **Register**.
1. Once the new app has been registered, in the left pane, click **Expose an API**. Then click **+ Add a scope**.
   * On the **Add a scope** page, leave the default **Application ID URI**.
   * Click **Save and continue**.
1. The page returns back to the **Add a scope** page. Fill in the required fields and ensure that **State** is **Enabled**.

   :::image type="content" source="./media/openvpn-azure-ad-tenant-multi-app/add-scope.png" alt-text="Screenshot of Microsoft Entra ID add a scope page." lightbox="./media/openvpn-azure-ad-tenant-multi-app/add-scope.png":::
1. When you're done filling out the fields, click **Add scope**.

### Add a client application

1. On the **Expose an API** page, click **+ Add a client application**.
1. On the **Add a client application** page, for **Client ID**, enter the following values depending on the cloud:

    * Azure Public: `41b23e61-6c1e-4545-b367-cd054e0ed4b4`
    * Azure Government: `51bb15d4-3a4f-4ebf-9dca-40096fe32426`
    * Azure Germany: `538ee9e6-310a-468d-afef-ea97365856a9`
    * Microsoft Azure operated by 21Vianet: `49f817b6-84ae-4cc0-928c-73f27289b3aa`
1. Select the checkbox for the **Authorized scopes** to include. Then, click **Add application**.

   :::image type="content" source="./media/openvpn-azure-ad-tenant-multi-app/add-application.png" alt-text="Screenshot of Microsoft Entra ID add client application page." lightbox="./media/openvpn-azure-ad-tenant-multi-app/add-application.png":::

1. Click **Add application**.

### Copy Application (client) ID

When you enable authentication on the VPN gateway, you'll need the **Application (client) ID** value in order to fill out the Audience value for the point-to-site configuration.

1. Go to the **Overview** page.

1. Copy the **Application (client) ID** from the **Overview** page and save it so that you can access this value later. You'll need this information to configure your VPN gateway(s).

   :::image type="content" source="./media/openvpn-azure-ad-tenant-multi-app/client-id.png" alt-text="Screenshot showing Client ID value." lightbox="./media/openvpn-azure-ad-tenant-multi-app/client-id.png":::

## Assign users to applications

Assign the users to your applications.

1. Go to your Microsoft Entra ID and select **Enterprise applications**.
1. From the list, locate the application you just registered and click to open it.
1. Click **Properties**. On the **Properties** page, verify that **Enabled for users to sign in** is set to **Yes**. If not, change the value to **Yes**.
1. For **Assignment required**, change the value to **Yes**. For more information about this setting, see [Application properties](../active-directory/manage-apps/application-properties.md#enabled-for-users-to-sign-in).
1. If you've made changes, click **Save** to save your settings.
1. In the left pane, click **Users and groups**. On the **Users and groups** page, click **+ Add user/group** to open the **Add Assignment** page.
1. Click the link under **Users and groups** to open the **Users and groups** page. Select the users and groups that you want to assign, then click **Select**.
1. After you finish selecting users and groups, click **Assign**.

## Configure authentication for the gateway

In this step, you configure P2S Microsoft Entra authentication for the virtual network gateway.

1. Go to the virtual network gateway. In the left pane, click **Point-to-site configuration**.

   :::image type="content" source="./media/openvpn-azure-ad-tenant-multi-app/enable-authentication.png" alt-text="Screenshot showing point-to-site configuration page." lightbox="./media/openvpn-azure-ad-tenant-multi-app/enable-authentication.png":::

   Configure the following values:

   * **Address pool**: client address pool
   * **Tunnel type:** OpenVPN (SSL)
   * **Authentication type**: Microsoft Entra ID

   For **Microsoft Entra ID** values, use the following guidelines for **Tenant**, **Audience**, and **Issuer** values.

   * **Tenant**: `https://login.microsoftonline.com/{TenantID}`
   * **Audience ID**: Use the value that you created in the previous section that corresponds to **Application (client) ID**. Don't use the application ID for "Azure VPN" Microsoft Entra Enterprise App - use application ID that you created and registered. If you use the application ID for the "Azure VPN" Microsoft Entra Enterprise App instead, this will grant all users access to the VPN gateway (which would be the default way to set up access), instead of granting only the users that you assigned to the application that you created and registered.
   * **Issuer**: `https://sts.windows.net/{TenantID}`  For the Issuer value, make sure to include a trailing **/** at the end.

1. Once you finish configuring settings, click **Save** at the top of the page.

## Download the Azure VPN Client profile configuration package

In this section, you generate and download the Azure VPN Client profile configuration package. This package contains the settings that you can use to configure the Azure VPN Client profile on client computers.

[!INCLUDE [Azure VPN Client profile configuration package](../../includes/vpn-gateway-point-to-site-client-package-download.md)]

## Next steps

* To connect to your virtual network, you must configure the Azure VPN client on your client computers. See [Configure a VPN client for P2S VPN connections](openvpn-azure-ad-client.md).
* For frequently asked questions, see the **Point-to-site** section of the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#P2S).
