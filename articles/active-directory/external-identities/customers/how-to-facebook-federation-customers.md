---
title: Add Facebook for customer sign-in
description: Learn how to add Facebook as an identity provider for your customer tenant.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 06/20/2023
ms.author: mimart
ms.custom: it-pro, has-azure-ad-ps-ref
#Customer intent: As a dev, devops, or it admin, I want to
---

# Add Facebook as an identity provider

By setting up federation with Facebook, you can allow customers to sign in to your applications with their own Facebook accounts. After you've added Facebook as one of your application's sign-in options, on the sign-in page, customers can sign-in to Microsoft Entra ID for customers with a Facebook account. (Learn more about [authentication methods and identity providers for customers](concept-authentication-methods-customers.md).)

## Create a Facebook application

To enable sign-in for customers with a Facebook account, you need to create an application in [Facebook App Dashboard](https://developers.facebook.com/). For more information, see [App Development](https://developers.facebook.com/docs/development).

If you don't already have a Facebook account, sign up at [https://www.facebook.com](https://www.facebook.com). After you sign-up or sign-in with your Facebook account, start the [Facebook developer account registration process](https://developers.facebook.com/async/registration). For more information, see [Register as a Facebook Developer](https://developers.facebook.com/docs/development/register).

1. Sign in to [Facebook for developers](https://developers.facebook.com/apps) with your Facebook developer account credentials.
1. If you haven't already done so, register as a Facebook developer: Select **Get Started** in the upper-right corner of the page, accept Facebook's policies, and complete the registration steps.
1. Select **Create App**. Select **Set up Facebook Login**, and then select **Next**.
1. For **Select an app type**, select **Consumer**, then select **Next**.
1. Add an app name and a valid app contact mail.
1. Select **Create app**. This step may require you to accept Facebook platform policies and complete an online security check.
1. Select **Settings** > **Basic**.
    1. Copy the value of **App ID**. Then select **Show** and copy the value of **App Secret**. You use both of these values to configure Facebook as an identity provider in your tenant. **App Secret** is an important security credential.
    1. Enter a URL for the **Privacy Policy URL**, for example `https://www.contoso.com/privacy`. The policy URL is a page you maintain to provide privacy information for your application.
    1. Enter a URL for the **Terms of Service URL**, for example `https://www.contoso.com/tos`. The policy URL is a page you maintain to provide terms and conditions for your application.
    1. Enter a URL for the **User Data Deletion**, for example `https://www.contoso.com/delete_my_data`. The User Data Deletion URL is a page you maintain to provide away for users to request that their data be deleted.
    1. Choose a **Category**, for example `Business and pages`. Facebook requires this value, but it's not used by Microsoft Entra ID.
1. At the bottom of the page, select **Add platform**, select **Website**, and then select **Next**.
1. In **Site URL**, enter the address of your website, for example `https://contoso.com`. 
1. Select **Save changes**.
1. From the menu, select **Products**. Next to **Facebook Login**, select **Configure** > **Settings**.
1. In **Valid OAuth Redirect URIs**, enter the following URIs, replacing `<tenant-ID>` with your customer tenant ID and `<tenant-name>` with your customer tenant name:
   - `https://login.microsoftonline.com/te/<tenant-ID>/oauth2/authresp`
   - `https://<tenant-name>.ciamlogin.com/<tenant-ID>/federation/oidc/www.facebook.com`
    - `https://<tenant-name>.ciamlogin.com/<tenant-name>.onmicrosoft.com/federation/oidc/www.facebook.com`
    - `https://<tenant-name>.ciamlogin.com/<tenant-ID>/federation/oauth2`
    - `https://<tenant-name>.ciamlogin.com/<tenant-name>.onmicrosoft.com/federation/oauth2`
   > [!NOTE]
   > To find your customer tenant ID, sign in to the [Microsoft Entra admin center](https://entra.microsoft.com). Browse to **Identity** > **Overview**. Then select the **Overview** tab and copy the **Tenant ID**.
1. Select **Save changes** at the bottom of the page.
1. At this point, only Facebook application owners can sign in. Because you registered the app, you can sign in with your Facebook account. To make your Facebook application available to your users, from the menu, select **Go live**. Follow all of the steps listed to complete all requirements. You'll likely need to complete the business verification to verify your identity as a business entity or organization. For more information, see [Meta App Development](https://developers.facebook.com/docs/development/release).

<a name='configure-facebook-federation-in-azure-ad-for-customers'></a>

## Configure Facebook federation in Microsoft Entra ID for customers

After you create the Facebook application, in this step you set the Facebook client ID and client secret in Microsoft Entra ID. You can use the Azure portal or PowerShell to do so. To configure Facebook federation in the Microsoft Entra admin center, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com).
1. Browse to **Identity** > **External Identities** > **All identity providers**.
2. Select **+ Facebook**.

   <!-- ![Screenshot that shows how to add Facebook identity provider in Azure AD.](./media/sign-in-with-facebook/configure-facebook-idp.png)-->

1. Enter a **Name**. For example, *Facebook*.
1. For the **Client ID**, enter the App ID of the Facebook application that you created earlier.
1. For the **Client secret**, enter the App Secret that you recorded.
1. Select **Save**.

To configure Facebook federation by using PowerShell, follow these steps:

1. Install the latest version of the Azure AD PowerShell for Graph module ([AzureADPreview](https://www.powershellgallery.com/packages/AzureADPreview)).
1. Run the following command: `Connect-AzureAD`
1. At the sign-in prompt, sign in with the managed Global Administrator account.
1. Run the following command:
    
    `New-AzureADMSIdentityProvider -Type Facebook -Name Facebook -ClientId <client ID> -ClientSecret <client secret>`

    Use the client ID and client secret from the app you created in [Create a Facebook application](#create-a-facebook-application) step.

## Add Facebook identity provider to a user flow

At this point, the Facebook identity provider has been set up in your customer tenant, but it's not yet available in any of the sign-in pages. To add the Facebook identity provider to a user flow:

1. Browse to **Identity** > **External Identities** > **User flows**.
1. Select the user flow where you want to add the Facebook identity provider.
1. Under Settings, select **Identity providers**
1. Under **Other Identity Providers**, select **Facebook**.

   <!-- ![Screenshot that shows how to add Facebook identity provider a user flow.](./media/sign-in-with-facebook/add-facebook-to-user-flow.png)-->

1. At the top of the pane, select **Save**.

## Next steps

- [Add Google as an identity provider](how-to-google-federation-customers.md)
- [Customize the branding for customer sign-in experiences](how-to-customize-branding-customers.md)
