---
title: 'Create an Azure AD tenant for P2S VPN connections: Azure AD authentication'
titleSuffix: Azure VPN Gateway
description: Learn how to set up an Azure AD tenant for P2S Azure AD authentication - OpenVPN protocol.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: how-to
ms.date: 05/27/2021
ms.author: cherylmc

---
# Create an Azure Active Directory tenant for P2S OpenVPN protocol connections

When you connect to your VNet using Point-to-Site, you have a choice of which protocol to use. The protocol you use determines the authentication options that are available to you. If you want to use Azure Active Directory authentication, you can do so when using the OpenVPN protocol. This article helps you set up an Azure AD tenant. For more information about Point-to-Site protocols and authentication, see [About Point-to-Site VPN](point-to-site-about.md).

[!INCLUDE [OpenVPN note](../../includes/vpn-gateway-openvpn-auth-include.md)]

## <a name="tenant"></a>1. Verify Azure AD tenant

Verify that you have an Azure AD tenant. If you don't have an Azure AD tenant, you can create one using the steps in the [Create a new tenant](../active-directory/fundamentals/active-directory-access-create-new-tenant.md) article:

* Organizational name
* Initial domain name

   :::image type="content" source="./media/openvpn-create-azure-ad-tenant/newtenant.png" alt-text="Screenshot of Create Directory page." border="false":::

## <a name="users"></a>2. Create Azure AD tenant users

Your Azure AD tenant needs the following accounts: a Global Admin account and a user account. The user account is used as your embedding account (service account). When you create an Azure AD tenant user account, you adjust the Directory role for the type of user that you want to create.

Use the steps in [Add or delete users - Azure Active Directory](../active-directory/fundamentals/add-users-azure-active-directory.md) to create at least two users for your Azure AD tenant. Be sure to change the **Directory Role** to create the account types:

* Global Admin
* User

## <a name="enable-authentication"></a>3. Enable Azure AD authentication on the VPN gateway

1. Locate the Directory ID of the directory that you want to use for authentication. It's listed in the properties section of the Active Directory page.

   :::image type="content" source="./media/openvpn-create-azure-ad-tenant/directory-id.png" alt-text="Screenshot that shows the Directory Properties." lightbox="./media/openvpn-create-azure-ad-tenant/directory-id.png":::

1. Copy the Directory ID.

1. Sign in to the Azure portal as a user that is assigned the **Global administrator** role.

1. Next, give admin consent. Copy and paste the URL that pertains to your deployment location in the address bar of your browser:

   Public

   ```
   https://login.microsoftonline.com/common/oauth2/authorize?client_id=41b23e61-6c1e-4545-b367-cd054e0ed4b4&response_type=code&redirect_uri=https://portal.azure.com&nonce=1234&prompt=admin_consent
   ````

   Azure Government

   ```
   https://login.microsoftonline.us/common/oauth2/authorize?client_id=51bb15d4-3a4f-4ebf-9dca-40096fe32426&response_type=code&redirect_uri=https://portal.azure.us&nonce=1234&prompt=admin_consent
   ````

   Microsoft Cloud Germany

   ```
   https://login-us.microsoftonline.de/common/oauth2/authorize?client_id=538ee9e6-310a-468d-afef-ea97365856a9&response_type=code&redirect_uri=https://portal.microsoftazure.de&nonce=1234&prompt=admin_consent
   ````

    Azure China 21Vianet

    ```
    https://login.chinacloudapi.cn/common/oauth2/authorize?client_id=49f817b6-84ae-4cc0-928c-73f27289b3aa&response_type=code&redirect_uri=https://portal.azure.cn&nonce=1234&prompt=admin_consent
    ```

   > [!NOTE]
   > If you using a global admin account that is not native to the Azure AD tenant to provide consent, please replace “common” with the Azure AD directory id in the URL. You may also have to replace “common” with your directory id in certain other cases as well.
   >

1. Select the **Global Admin** account if prompted.

   :::image type="content" source="./media/openvpn-create-azure-ad-tenant/pick.png" alt-text="Screnshot showing Pick an account page." border="false":::
1. Select **Accept** when prompted.

   :::image type="content" source="./media/openvpn-create-azure-ad-tenant/accept.jpg" alt-text="Screenshot shows the message Permissions requested Accept for your organization with details and the option to accept." border="false":::
1. Under your Azure AD, in **Enterprise applications**, you see **Azure VPN** listed.

   :::image type="content" source="./media/openvpn-create-azure-ad-tenant/azurevpn.png" alt-text="Screenshot that shows the All applications page." lightbox="./media/openvpn-create-azure-ad-tenant/azurevpn.png" :::
1. If you don't already have a functioning point-to-site environment, follow the instruction to create one. See [Create a point-to-site VPN](vpn-gateway-howto-point-to-site-resource-manager-portal.md) to create and configure a point-to-site VPN gateway.

    > [!IMPORTANT]
    > The Basic SKU is not supported for OpenVPN.

1. Enable Azure AD authentication on the VPN gateway by navigating to **Point-to-site configuration** and picking **OpenVPN (SSL)** as the **Tunnel type**. Select **Azure Active Directory** as the **Authentication type**, then fill in the information under the **Azure Active Directory** section.

   * **Tenant:** TenantID for the Azure AD tenant ```https://login.microsoftonline.com/{AzureAD TenantID}/```

   * **Audience:** Application ID of the "Azure VPN" Azure AD Enterprise App

	   * Enter 41b23e61-6c1e-4545-b367-cd054e0ed4b4 for Azure Public
	   * Enter 51bb15d4-3a4f-4ebf-9dca-40096fe32426 for Azure Government
	   * Enter 538ee9e6-310a-468d-afef-ea97365856a9 for Azure Germany
	   * Enter 49f817b6-84ae-4cc0-928c-73f27289b3aa for Azure China 21Vianet


   * **Issuer**: URL of the Secure Token Service ```https://sts.windows.net/{AzureAD TenantID}/```


   :::image type="content" source="./media/openvpn-create-azure-ad-tenant/azure-ad-auth-portal.png" alt-text="Screenshot showing settings for Tunnel type, Authentication type, and Azure Active Directory settings." border="false":::

   > [!NOTE]
   > Make sure you include a trailing slash at the end of the `AadIssuerUri` value. Otherwise, the connection may fail.
   >

1. Create and download the profile by clicking on the **Download VPN client** link.

1. Extract the downloaded zip file.

1. Browse to the unzipped “AzureVPN” folder.

1. Make a note of the location of the “azurevpnconfig.xml” file. The azurevpnconfig.xml contains the setting for the VPN connection and can be imported directly into the Azure VPN Client application. You can also distribute this file to all the users that need to connect via e-mail or other means. The user will need valid Azure AD credentials to connect successfully.

## Next steps

Create and configure a VPN client profile. See [Configure a VPN client for P2S VPN connections](openvpn-azure-ad-client.md).
