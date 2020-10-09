---

title: Add Facebook as an identity provider - Azure AD
description: Federate with Facebook to enable external users (guests) to sign in to your Azure AD apps with their own Facebook accounts.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 05/19/2020

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: mal
ms.custom: "it-pro, seo-update-azuread-jan"
ms.collection: M365-identity-device-management
---

# Add Facebook as an identity provider for External Identities

You can add Facebook to your self-service sign-up user flows (Preview) so that users can sign in to your applications using their own Facebook accounts. To allow users to sign in using Facebook, you'll first need to [enable self-service sign-up](self-service-sign-up-user-flow.md) for your tenant. After you add Facebook as an identity provider, set up a user flow for the application and select Facebook as one of the sign-in options.

> [!NOTE]
> Users can only use their Facebook accounts to sign up through apps using self-service sign-up and user flows. Users cannot be invited and redeem their invitation using a Facebook account.

## Create an app in the Facebook developers console

To use a Facebook account as an [identity provider](identity-providers.md), you need to create an application in the Facebook developers console. If you don't already have a Facebook account, you can sign up at [https://www.facebook.com/](https://www.facebook.com).

> [!NOTE]  
> Use the following URLs in the steps 9 and 16 below.
> - For **Site URL** enter the address of your application, such as `https://contoso.com`.
> - For **Valid OAuth redirect URIs**, enter `https://login.microsoftonline.com/te/<tenant-id>/oauth2/authresp`. You can find your `<tenant-ID>` in the Azure Active Directory Overview blade.


1. Sign in to [Facebook for developers](https://developers.facebook.com/) with your Facebook account credentials.
2. If you have not already done so, you need to register as a Facebook developer. To do this, select **Get Started** on the upper-right corner of the page, accept Facebook's policies, and complete the registration steps.
3. Select **My Apps** and then **Create App**.
4. Enter a **Display Name** and a valid **Contact Email**.
5. Select **Create App ID**. This may require you to accept Facebook platform policies and complete an online security check.
6. Select **Settings** > **Basic**.
7. Choose a **Category**, for example Business and Pages. This value is required by Facebook, but not used for Azure AD.
8. At the bottom of the page, select **Add Platform**, and then select **Website**.
9. In **Site URL**, enter the appropriate URL (noted above).
10. In **Privacy Policy URL**, enter the URL for the page where you maintain privacy information for your application, for example `http://www.contoso.com`.
11. Select **Save Changes**.
12. At the top of the page, copy the value of **App ID**.
13. Select **Show** and copy the value of **App Secret**. You use both of them to configure Facebook as an identity provider in your tenant. **App Secret** is an important security credential.
14. Select the plus sign next to **PRODUCTS**, and then select **Set up** under **Facebook Login**.
15. Under **Facebook Login**, select **Settings**.
16. In **Valid OAuth redirect URIs**, enter the appropriate URL (noted above).
17. Select **Save Changes** at the bottom of the page.
18. To make your Facebook application available to Azure AD, select the Status selector at the top right of the page and turn it **On** to make the Application public, and then select **Switch Mode**. At this point the Status should change from **Development** to **Live**.
	
## Configure a Facebook account as an identity provider
Now you'll set the Facebook client ID and client secret, either by entering it in the Azure AD portal or by using PowerShell. You can test your Facebook configuration by signing up via a user flow on an app enabled for self-service sign-up.

### To configure Facebook federation in the Azure AD portal
1. Sign in to the [Azure portal](https://portal.azure.com) as the global administrator of your Azure AD tenant.
2. Under **Azure services**, select **Azure Active Directory**.
3. In the left menu, select **External Identities**.
4. Select **All identity providers**, then select **Facebook**.
5. For the **Client ID**, enter the **App ID** of the Facebook application that you created earlier.
6. For the **Client secret**, enter the **App Secret** that you recorded.

   ![Screenshot showing the Add social identity provider page](media/facebook-federation/add-social-identity-provider-page.png)

7. Select **Save**.
### To configure Facebook federation by using PowerShell
1. Install the latest version of the Azure AD PowerShell for Graph module ([AzureADPreview](https://www.powershellgallery.com/packages/AzureADPreview)).
2. Run the following command:
   `Connect-AzureAD`.
3. At the sign-in prompt, sign in with the managed Global Administrator account.  
4. Run the following command: 
   
   `New-AzureADMSIdentityProvider -Type Facebook -Name Facebook -ClientId [Client ID] -ClientSecret [Client secret]`
 
   > [!NOTE]
   > Use the client ID and client secret from the app you created above in the Facebook developer console. For more information, see the [New-AzureADMSIdentityProvider](https://docs.microsoft.com/powershell/module/azuread/new-azureadmsidentityprovider?view=azureadps-2.0-preview) article. 

## How do I remove Facebook federation?
You can delete your Facebook federation setup. If you do so, any users who have signed up through user flows with their Facebook accounts will no longer be able to log in. 

### To delete Facebook federation in the Azure AD portal: 
1. Go to the [Azure portal](https://portal.azure.com). In the left pane, select **Azure Active Directory**. 
2. Select **External Identities**.
3. Select **All identity providers**.
4. On the **Facebook** line, select the context menu (**...**) and then select **Delete**. 
5. Select **Yes** to confirm deletion.

### To delete Facebook federation by using PowerShell: 
1. Install the latest version of the Azure AD PowerShell for Graph module ([AzureADPreview](https://www.powershellgallery.com/packages/AzureADPreview)).
2. Run `Connect-AzureAD`.  
4. In the sign-in prompt, sign in with the managed Global Administrator account.  
5. Enter the following command:

    `Remove-AzureADMSIdentityProvider -Id Facebook-OAUTH`

   > [!NOTE]
   > For more information, see [Remove-AzureADMSIdentityProvider](https://docs.microsoft.com/powershell/module/azuread/Remove-AzureADMSIdentityProvider?view=azureadps-2.0-preview). 

## Next steps

- [Add self-service sign-up to an app](self-service-sign-up-user-flow.md)
