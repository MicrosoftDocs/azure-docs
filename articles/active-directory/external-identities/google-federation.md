---

title: Add Google as an identity provider for B2B - Azure AD
description: Federate with Google to enable guest users to sign in to your Azure AD apps with their own Gmail accounts.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 03/02/2021

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: mal
ms.custom: "it-pro, seo-update-azuread-jan"
ms.collection: M365-identity-device-management
---

# Add Google as an identity provider for B2B guest users

By setting up federation with Google, you can allow invited users to sign in to your shared apps and resources with their own Gmail accounts, without having to create Microsoft accounts.

After you've added Google as one of your application's sign-in options, on the **Sign in** page, a user can simply enter the email they use to sign in to Google, or they can select **Sign-in options** and choose **Sign in with Google**. In either case, they'll be redirected to the Google sign-in page for authentication.

![Sign in options for Google users](media/google-federation/sign-in-with-google-overview.png)

> [!NOTE]
> Google federation is designed specifically for Gmail users. To federate with G Suite domains, use [direct federation](direct-federation.md).

> [!IMPORTANT]
> **Starting January 4, 2021**, Google is [deprecating WebView sign-in support](https://developers.googleblog.com/2020/08/guidance-for-our-effort-to-block-less-secure-browser-and-apps.html). If you’re using Google federation or self-service sign-up with Gmail, you should [test your line-of-business native applications for compatibility](google-federation.md#deprecation-of-webview-sign-in-support).

## What is the experience for the Google user?

When a Google user redeems your invitation, their experience varies depending on whether they're already signed in to Google:

- Guest users who aren't signed in to Google will be prompted to do so.
- Guest users who are already signed in to Google will be prompted to choose the account they want to use. They must choose the account you used to invite them.

Guest users who see a "header too long" error can clear their cookies or open a private or incognito window and try to sign in again.

![Screenshot that shows the Google sign-in page.](media/google-federation/google-sign-in.png)

## Sign-in endpoints

Google guest users can now sign in to your multi-tenant or Microsoft first-party apps by using a [common endpoint](redemption-experience.md#redemption-and-sign-in-through-a-common-endpoint) (in other words, a general app URL that doesn't include your tenant context). During the sign-in process, the guest user chooses **Sign-in options**, and then selects **Sign in to an organization**. The user then types the name of your organization and continues signing in using their Google credentials.

Google guest users can also use application endpoints that include your tenant information, for example:

  * `https://myapps.microsoft.com/?tenantid=<your tenant ID>`
  * `https://myapps.microsoft.com/<your verified domain>.onmicrosoft.com`
  * `https://portal.azure.com/<your tenant ID>`

You can also give Google guest users a direct link to an application or resource by including your tenant information, for example `https://myapps.microsoft.com/signin/Twitter/<application ID?tenantId=<your tenant ID>`.

## Deprecation of WebView sign-in support

Starting January 4, 2021, Google is [deprecating embedded WebView sign-in support](https://developers.googleblog.com/2020/08/guidance-for-our-effort-to-block-less-secure-browser-and-apps.html). If you’re using Google federation or [self-service sign-up with Gmail](identity-providers.md), you should test your line-of-business native applications for compatibility. If your apps include WebView content that requires authentication, Google Gmail users won't be able to authenticate. The following are known scenarios that will impact Gmail users:

- Windows apps that use embedded WebView or the WebAccountManager (WAM) on older versions of Windows.
- Other native apps you’ve developed that use an embedded browser framework for authentication.

This change does not affect:

- Windows apps that use embedded WebView or the WebAccountManager (WAM) on the latest versions of Windows
- Microsoft iOS apps
- G Suite identities, for example when you’re using SAML-based [direct federation](direct-federation.md) with G Suite

We’re continuing to test various platforms and scenarios, and will update this article accordingly.
### To test your apps for compatibility

1. Follow [Google’s guidance](https://developers.googleblog.com/2020/08/guidance-for-our-effort-to-block-less-secure-browser-and-apps.html) to determine if your apps are affected.
2. Using Fiddler or another testing tool, inject a header during sign-in and use a Google external identity to test sign-in:

   1. Add Google-Accounts-Check-OAuth-Login:true to your HTTP request headers when the requests are sent to accounts.google.com.
   1. Attempt to sign in to the app by entering a Gmail address in the accounts.google.com sign-in page.
   1. If sign-in fails and you see an error such as “This browser or app may not be secure,” your Google external identities will be blocked from signing in.

3. Resolve the issue by doing one of the following:

   - If your Windows app uses embedded WebView or the WebAccountManager (WAM) on an older version of Windows, update to the latest version of Windows.
   - Modify your apps to use the system browser for sign-in. For details, see [Embedded vs System Web UI](../develop/msal-net-web-browsers.md#embedded-vs-system-web-ui) in the MSAL.NET documentation.  


## Step 1: Configure a Google developer project
First, create a new project in the Google Developers Console to obtain a client ID and a client secret that you can later add to Azure Active Directory (Azure AD). 
1. Go to the Google APIs at https://console.developers.google.com, and sign in with your Google account. We recommend that you use a shared team Google account.
2. Accept the terms of service if you're prompted to do so.
3. Create a new project: In the upper-left corner of the page, select the project list, and then on the **Select a project** page, select **New Project**.
4. On the **New Project** page, give the project a name (for example, **Azure AD B2B**), and then select **Create**: 
   
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
    - `https://login.microsoftonline.com/te/<tenant ID>/oauth2/authresp` <br>(where `<tenant ID>` is your tenant ID)
   
    > [!NOTE]
    > To find your tenant ID, go to the [Azure portal](https://portal.azure.com). Under **Azure Active Directory**, select **Properties** and copy the **Tenant ID**.

    ![Screenshot that shows the Authorized redirect URIs section.](media/google-federation/google-create-oauth-client-id.png)

12. Select **Create**. Copy the client ID and client secret. You'll use them when you add the identity provider in the Azure portal.

    ![Screenshot that shows the OAuth client ID and client secret.](media/google-federation/google-auth-client-id-secret.png)

## Step 2: Configure Google federation in Azure AD 
You'll now set the Google client ID and client secret. You can use the Azure portal or PowerShell to do so. Be sure to test your Google federation configuration by inviting yourself. Use a Gmail address and try to redeem the invitation with your invited Google account. 

**To configure Google federation in the Azure portal** 
1. Go to the [Azure portal](https://portal.azure.com). On the left pane, select **Azure Active Directory**. 
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
   > Use the client ID and client secret from the app you created in "Step 1: Configure a Google developer project." For more information, see [New-AzureADMSIdentityProvider](/powershell/module/azuread/new-azureadmsidentityprovider?view=azureadps-2.0-preview). 
 
## How do I remove Google federation?
You can delete your Google federation setup. If you do so, Google guest users who have already redeemed their invitation won't be able to sign in. But you can give them access to your resources again by deleting them from the directory and reinviting them. 
 
**To delete Google federation in the Azure AD portal**
1. Go to the [Azure portal](https://portal.azure.com). On the left pane, select **Azure Active Directory**. 
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
   > For more information, see [Remove-AzureADMSIdentityProvider](/powershell/module/azuread/Remove-AzureADMSIdentityProvider?view=azureadps-2.0-preview).
