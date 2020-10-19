---

title: Add Google as an identity provider for B2B - Azure AD
description: Federate with Google to enable guest users to sign in to your Azure AD apps with their own Gmail accounts.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 05/11/2020

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: mal
ms.custom: "it-pro, seo-update-azuread-jan"
ms.collection: M365-identity-device-management
---

# Add Google as an identity provider for B2B guest users

By setting up federation with Google, you can allow invited users to sign in to your shared apps and resources with their own Gmail accounts, without having to create Microsoft accounts. 

> [!NOTE]
> Google federation is designed specifically for Gmail users. To federate with G Suite domains, use [direct federation](direct-federation.md).

## What is the experience for the Google user?
When you send an invitation to Google Gmail users, the guest users should access your shared apps or resources by using a link that includes the tenant context. Their experience varies depending on whether they're already signed in to Google:
  - Guest users who aren't signed in to Google will be prompted to sign in to Google.
  - Guest users who are already signed in to Google will be prompted to choose the account they want to use. They must choose the account you used to invite them.

Guest users who see a "header too long" error can clear their cookies or open a private or incognito window and try to sign in again.

![Screenshot that shows the Google sign-in page.](media/google-federation/google-sign-in.png)

## Limitations

Teams fully supports Google guest users on all devices. Google users can sign in to Teams from a common endpoint like `https://teams.microsoft.com`.

Other applications' common endpoints might not support Google users. Google guest users must sign in by using a link that includes your tenant information. Following are examples:
  * `https://myapps.microsoft.com/?tenantid=<your tenant id>`
  * `https://portal.azure.com/<your tenant id>`
  * `https://myapps.microsoft.com/<your verified domain>.onmicrosoft.com`

   If Google guest users try to use a link like `https://myapps.microsoft.com` or `https://portal.azure.com`, they'll get an error.

You can also give Google guest users a direct link to an application or resource, as long as the link includes your tenant information. For example, `https://myapps.microsoft.com/signin/Twitter/<application ID?tenantId=<your tenant ID>`. 

## Step 1: Configure a Google developer project
First, create a new project in the Google Developers Console to obtain a client ID and a client secret that you can later add to Azure Active Directory (Azure AD). 
1. Go to the Google APIs at https://console.developers.google.com, and sign in with your Google account. We recommend that you use a shared team Google account.
2. Accept the terms of service if you're prompted to do so.
3. Create a new project: On the Dashboard, select **Create Project**, give the project a name (for example, **Azure AD B2B**) and then select **Create**: 
   
   ![Screenshot that shows a New Project page.](media/google-federation/google-new-project.png)

4. On the **APIs & Services** page, select **View** under your new project.

5. Select **Go to APIs overview** on the APIs card. Select **OAuth consent screen**.

6. Select **External**, and then select **Create**. 

7. On the **OAuth consent screen**, enter an **Application name**:

   ![Screenshot that shows the Google OAuth consent screen.](media/google-federation/google-oauth-consent-screen.png)

8. Scroll to the **Authorized domains** section and enter **microsoftonline.com**:

   ![Screenshot that shows the Authorized domains section.](media/google-federation/google-oauth-authorized-domains.PNG)

9. Select **Save**.

10. Select **Credentials**. On the **Create credentials** menu, select **OAuth client ID**:

    ![Screenshot that shows the Google APIs Create credentials menu.](media/google-federation/google-api-credentials.png)

11. Under **Application type**, select **Web application**. Give the application a suitable name, like **Azure AD B2B**. Under **Authorized redirect URIs**, enter the following URIs:
    - `https://login.microsoftonline.com`
    - `https://login.microsoftonline.com/te/\<tenant id>/oauth2/authresp` <br>(where `<tenant id>` is your tenant ID)
   
    > [!NOTE]
    > To find your tenant ID, go to https://portal.azure.com. Under **Azure Active Directory**, select **Properties** and copy the **Tenant ID**.

    ![Screenshot that shows the Authorized redirect URIs section.](media/google-federation/google-create-oauth-client-id.png)

12. Select **Create**. Copy the client ID and client secret. You'll use them when you add the identity provider in the Azure portal.

    ![Screenshot that shows the OAuth client ID and client secret.](media/google-federation/google-auth-client-id-secret.png)

## Step 2: Configure Google federation in Azure AD 
You'll now set the Google client ID and client secret. You can use the Azure portal or PowerShell to do so. Be sure to test your Google federation configuration by inviting yourself. Use a Gmail address and try to redeem the invitation with your invited Google account. 

**To configure Google federation in the Azure portal** 
1. Go to the [Azure portal](https://portal.azure.com). In the left pane, select **Azure Active Directory**. 
2. Select **External Identities**.
3. Select **All identity providers**, and then select the **Google** button.
4. Enter the client ID and client secret you obtained earlier. Select **Save**: 

   ![Screenshot that shows the Add Google identity provider page.](media/google-federation/google-identity-provider.png)

**To configure Google federation by using PowerShell**
1. Install the latest version of the Azure AD PowerShell for Graph module ([AzureADPreview](https://www.powershellgallery.com/packages/AzureADPreview)).
2. Run this command:
   `Connect-AzureAD`
3. At the sign-in prompt, sign in with the managed Global Administrator account.  
4. Run the following command: 
   
   `New-AzureADMSIdentityProvider -Type Google -Name Google -ClientId <client ID> -ClientSecret <client secret>`
 
   > [!NOTE]
   > Use the client id and client secret from the app you created in "Step 1: Configure a Google developer project." For more information, see [New-AzureADMSIdentityProvider](https://docs.microsoft.com/powershell/module/azuread/new-azureadmsidentityprovider?view=azureadps-2.0-preview). 
 
## How do I remove Google federation?
You can delete your Google federation setup. If you do so, Google guest users who have already redeemed their invitation won't be able to sign in. But you can give them access to your resources again by deleting them from the directory and reinviting them. 
 
**To delete Google federation in the Azure AD portal**
1. Go to the [Azure portal](https://portal.azure.com). In the left pane, select **Azure Active Directory**. 
2. Select **External Identities**.
3. Select **All identity providers**.
4. On the **Google** line, select the ellipsis button (**...**) and then select **Delete**. 
   
   ![Screenshot that shows the Delete button for the social identity provider.](media/google-federation/google-social-identity-providers.png)

1. Select **Yes** to confirm the deletion. 

**To delete Google federation by using PowerShell** 
1. Install the latest version of the Azure AD PowerShell for Graph module ([AzureADPreview](https://www.powershellgallery.com/packages/AzureADPreview)).
2. Run `Connect-AzureAD`.  
4. In the sign-in prompt, sign in with the managed Global Administrator account.  
5. Enter the following command:

    `Remove-AzureADMSIdentityProvider -Id Google-OAUTH`

   > [!NOTE]
   > For more information, see [Remove-AzureADMSIdentityProvider](https://docs.microsoft.com/powershell/module/azuread/Remove-AzureADMSIdentityProvider?view=azureadps-2.0-preview). 
