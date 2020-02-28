---
title: 'VPN Gateway: Azure AD tenant for P2S VPN connections: Azure AD authentication'
description: You can use P2S VPN to connect to your VNet using Azure AD authentication
services: virtual-wan
author: anzaman

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 12/27/2019
ms.author: alzam

---
# Create an Azure Active Directory tenant for P2S OpenVPN protocol connections

When connecting to your VNet, you can use certificate-based authentication or RADIUS authentication. However, when you use the Open VPN protocol, you can also use Azure Active Directory authentication. This article helps you set up an Azure AD tenant for P2S Open VPN authentication.

> [!NOTE]
> Azure AD authentication is supported only for OpenVPN® protocol connections.
>

## <a name="tenant"></a>1. Create the Azure AD tenant

Create an Azure AD tenant using the steps in the [Create a new tenant](../active-directory/fundamentals/active-directory-access-create-new-tenant.md) article:

* Organizational name
* Initial domain name

Example:

   ![New Azure AD tenant](./media/openvpn-create-azure-ad-tenant/newtenant.png)

## <a name="users"></a>2. Create Azure AD tenant users

Next, create two user accounts. Create one Global Admin account and one master user account. The master user account is used as your master embedding account (service account). When you create an Azure AD tenant user account, you adjust the Directory role for the type of user that you want to create.

Use the steps in [this article](../active-directory/fundamentals/add-users-azure-active-directory.md) to create at least two users for your Azure AD tenant. Be sure to change the **Directory Role** to create the account types:

* Global Admin
* User

## <a name="enable-authentication"></a>3. Enable Azure AD authentication on the VPN gateway

1. Locate the Directory ID of the directory that you want to use for authentication. It is listed in the properties section of the Active Directory page.

    ![Directory ID](./media/openvpn-create-azure-ad-tenant/directory-id.png)

2. Copy the Directory ID.

3. Sign in to the Azure portal as a user that is assigned the **Global administrator** role.

4. Next, give admin consent. Copy and paste the URL that pertains to your deployment location in the address bar of your browser:

    Public

    ```
    https://login.microsoftonline.com/common/oauth2/authorize?client_id=41b23e61-6c1e-4545-b367-cd054e0ed4b4&response_type=code&redirect_uri=https://portal.azure.com&nonce=1234&prompt=admin_consent
    ````

    Azure Government

    ```
    https://login-us.microsoftonline.com/common/oauth2/authorize?client_id=51bb15d4-3a4f-4ebf-9dca-40096fe32426&response_type=code&redirect_uri=https://portal.azure.us&nonce=1234&prompt=admin_consent
    ````

    Microsoft Cloud Germany

    ```
    https://login-us.microsoftonline.de/common/oauth2/authorize?client_id=538ee9e6-310a-468d-afef-ea97365856a9&response_type=code&redirect_uri=https://portal.microsoftazure.de&nonce=1234&prompt=admin_consent
    ````

    Azure China 21Vianet

    ```
    https://https://login.chinacloudapi.cn/common/oauth2/authorize?client_id=49f817b6-84ae-4cc0-928c-73f27289b3aa&response_type=code&redirect_uri=https://portal.azure.cn&nonce=1234&prompt=admin_consent
    ```

5. Select the **Global Admin** account if prompted.

    ![Directory ID](./media/openvpn-create-azure-ad-tenant/pick.png)

6. Select **Accept** when prompted.

    ![Accept](./media/openvpn-create-azure-ad-tenant/accept.jpg)

7. Under your Azure AD, in **Enterprise applications**, you see **Azure VPN** listed.

    ![Azure VPN](./media/openvpn-create-azure-ad-tenant/azurevpn.png)

8. Configure Azure AD authentication for User VPN and assign it to a Virtual Hub by following the steps in [Configure Azure AD authentication for Point-to-Site connection to Azure](virtual-wan-point-to-site-azure-ad.md)

## Next steps

In order to connect to your virtual network, you must create and configure a VPN client profile and associate it to a Virtual Hub. See [Configure Azure AD authentication for Point-to-Site connection to Azure](virtual-wan-point-to-site-azure-ad.md).
