---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 07/13/2022
 ms.author: cherylmc
---
1. Sign in to the Azure portal as a user that is assigned the **Global administrator** role.

1. Next, grant admin consent for your organization. This allows the Azure VPN application to sign in and read user profiles. Copy and paste the URL that pertains to your deployment location in the address bar of your browser:

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

    Microsoft Azure operated by 21Vianet

    ```
    https://login.chinacloudapi.cn/common/oauth2/authorize?client_id=49f817b6-84ae-4cc0-928c-73f27289b3aa&response_type=code&redirect_uri=https://portal.azure.cn&nonce=1234&prompt=admin_consent
    ```

   > [!NOTE]
   > If you're using a global admin account that is not native to the Azure AD tenant to provide consent, replace "common" with the Azure AD tenant ID in the URL. You may also have to replace "common" with your tenant ID in certain other cases as well. For help with finding your tenant ID, see [How to find your Azure Active Directory tenant ID](/azure/active-directory-b2c/tenant-management-read-tenant-name).
   >

1. Select the account that has the **Global administrator** role if prompted.

1. On the **Permissions requested** page, select **Accept**.

1. Go to **Azure Active Directory**. In the left pane, click **Enterprise applications**. You'll see **Azure VPN** listed.

   :::image type="content" source="./media/vpn-gateway-vwan-tenant/vpn.png" alt-text="Screenshot of the Enterprise application page showing Azure V P N listed." lightbox="./media/vpn-gateway-vwan-tenant/vpn.png":::
