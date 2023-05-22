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
ms.date: 04/28/2023
ms.author: mimart
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# Add Facebook as an identity provider

By setting up federation with Facebook, you can allow customers to sign in to your applications with their own Facebook accounts. After you've added Facebook as one of your application's sign-in options, on the sign-in page, customers can sign-in to Azure AD for customers with a Facebook account. (Learn more about [authentication methods and identity providers for customers](concept-authentication-methods-customers.md).)

## Create a Facebook application

To enable sign-in for customers with a Facebook account, you need to create an application in [Facebook App Dashboard](https://developers.facebook.com/). For more information, see [App Development](https://developers.facebook.com/docs/development).

If you don't already have a Facebook account, sign up at [https://www.facebook.com](https://www.facebook.com). After you sign-up or sign-in with your Facebook account, start the [Facebook developer account registration process](https://developers.facebook.com/async/registration). For more information, see [Register as a Facebook Developer](https://developers.facebook.com/docs/development/register).

1. Sign in to [Facebook for developers](https://developers.facebook.com/apps) with your Facebook developer account credentials.
1. If you haven't already done so, register as a Facebook developer: Select **Get Started** in the upper-right corner of the page, accept Facebook's policies, and complete the registration steps.
1. Select **Create App**.
1. For **Select an app type**, select **customers**, then select **Next**.
1. Enter an **App Display Name** and a valid **App Contact Email**.
1. Select **Create App**. This step may require you to accept Facebook platform policies and complete an online security check.
1. Select **Settings** > **Basic**.
    1. Copy the value of **App ID**.
    1. Select **Show** and copy the value of **App Secret**. You use both of them to configure Facebook as an identity provider in your tenant. **App Secret** is an important security credential.
    1. Enter a URL for the **Privacy Policy URL**, for example `https://www.contoso.com/privacy`. The policy URL is a page you maintain to provide privacy information for your application.
    1. Enter a URL for the **Terms of Service URL**, for example `https://www.contoso.com/tos`. The policy URL is a page you maintain to provide terms and conditions for your application.
    1. Enter a URL for the **User Data Deletion**, for example `https://www.contoso.com/delete_my_data`. The User Data Deletion URL is a page you maintain to provide away for users to request that their data be deleted.
    1. Choose a **Category**, for example `Business and Pages`. Facebook requires this value, but it's not used for Azure AD.
2. At the bottom of the page, select **Add Platform**, and then select **Website**.
3. In **Site URL**, enter the address of your website, for example `https://contoso.com`. 
4. Select **Save Changes**.
5. From the menu, select the **plus** sign or **Add Product** link next to **PRODUCTS**. Under the **Add Products to Your App**, select **Set up** under **Facebook Login**.
6. From the menu, select **Facebook Login**, select **Settings**.
7. In **Valid OAuth redirect URIs**, enter:
    - `https://login.microsoftonline.com`
    -  `https://login.microsoftonline.com/te/<tenant ID>/oauth2/authresp`. Replace the tenant ID with your Azure AD for customers tenant ID. To find your tenant ID, go to the [Microsoft Entra admin center](https://entra.microsoft.com). Under **Azure Active Directory**, select **Overview**. Then select the **Overview** tab and copy the **Tenant ID**.
    - `https://login.microsoftonline.com/te/<tenant name>.onmicrosoft.com/oauth2/authresp`. Replace the tenant name with your Azure AD for customers tenant name.
8. Select **Save Changes** at the bottom of the page.
9. To make your Facebook application available to Azure AD, select the Status selector at the top right of the page and turn it **On** to make the Application public, and then select **Switch Mode**. At this point, the Status should change from **Development** to **Live**. For more information, see [Facebook App Development](https://developers.facebook.com/docs/development/release).

## Configure Facebook federation in Azure AD for customers

After you create the Facebook application, in this step you set the Facebook client ID and client secret in Azure AD. You can use the Azure portal or PowerShell to do so. To configure Facebook federation in the Microsoft Entra admin center, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/) as the global administrator of your customer tenant.
1. Go to **Azure Active Directory** > **External Identities** > **All identity providers**.
2. Select **+ Facebook**.

   <!-- ![Screenshot that shows how to add Facebook identity provider in Azure AD.](./media/sign-in-with-facebook/configure-facebook-idp.png)-->

1. Enter a **Name**. For example, *Facebook*.
1. For the **Client ID**, enter the Client ID of the Facebook application that you created earlier.
1. For the **Client secret**, enter the Client Secret that you recorded.
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

1. In your customer tenant, go to **Azure Active Directory** > **External Identities** > **User flows**.
1. Select the user flow where you want to add the Facebook identity provider.
1. Under Settings, select **Identity providers**
1. Under **Other Identity Providers**, select **Facebook**.

   <!-- ![Screenshot that shows how to add Facebook identity provider a user flow.](./media/sign-in-with-facebook/add-facebook-to-user-flow.png)-->

1. At the top of the pane, select **Save**.

## Next steps

- [Add Google as an identity provider](how-to-google-federation-customers.md)
- [Customize the branding for customer sign-in experiences](how-to-customize-branding-customers.md)