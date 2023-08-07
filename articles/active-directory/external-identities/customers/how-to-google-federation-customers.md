---
title: Add Google as an identity provider
description: Learn how to add Google as an identity provider for your customer tenant.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 08/07/2023
ms.author: mimart
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# Add Google as an identity provider

By setting up federation with Google, you allow customers to sign in to your applications with their own Google accounts. After you add Google as one of your application's sign-in options, on the sign-in page, customers can sign in to Azure AD for customers with a Google account. (Learn more about [authentication methods and identity providers for customers](concept-authentication-methods-customers.md).)

## Prerequisites

- Azure AD for customers tenant. If you don't already have one, [sign up for a free trial](https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl).
- [A sign-up and sign-in user flow](how-to-user-flow-sign-up-sign-in-customers.md).

## Create a Google application

To enable sign-in for customers with a Google account, you need to create an application in [Google Developers Console](https://console.developers.google.com/). For more information, see [Setting up OAuth 2.0](https://support.google.com/googleapi/answer/6158849). If you don't already have a Google account, you can sign up at [`https://accounts.google.com/signup`](https://accounts.google.com/signup).

1. Sign in to the [Google Developers Console](https://console.developers.google.com/) with your Google account credentials.
1. Accept the terms of service if you're prompted to do so.
1. In the upper-left corner of the page, select the project list, and then select **New Project**.
1. Enter a **Project Name**, select **Create**.
1. Make sure you're using the new project by selecting the project drop-down in the top-left of the screen. Select your project by name, then select **Open**.
1. Under the **Quick access**, or in the left menu, select **APIs & services** and then **OAuth consent screen**.
1. For the **User Type**, select **External** and then select **Create**.
1. On the **OAuth consent screen**, under **App information**
   1. Enter a **Name** for your application.
   1. Select a **User support email** address.
1. Under the **Authorized domains** section, select **Add domain**, and then add `ciamlogin.com` and `microsoftonline.com`.
1. In the **Developer contact information** section, enter comma separated emails for Google to notify you about any changes to your project.
1. Select **Save and Continue**.
1. From the left menu, select **Credentials**
1. Select **Create credentials**, and then **OAuth client ID**.
1. Under **Application type**, select **Web application**.
   1. Enter a suitable **Name** for your application, such as "Azure AD for customers."
   1. In **Valid OAuth redirect URIs**, enter the following URIs. Replace `<tenant-ID>` with your customer Directory (tenant) ID and `<tenant-subdomain>` with your customer Directory (tenant) subdomain. If you don't have your tenant name, [learn how to read your tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details).  
    - `https://login.microsoftonline.com`
    - `https://login.microsoftonline.com/te/<tenant-ID>/oauth2/authresp`
    - `https://login.microsoftonline.com/te/<tenant-subdomain>.onmicrosoft.com/oauth2/authresp`
    - `https://<tenant-ID>.ciamlogin.com/<tenant-ID>/federation/oidc/accounts.google.com`
    - `https://<tenant-ID>.ciamlogin.com/<tenant-subdomain>.onmicrosoft.com/federation/oidc/accounts.google.com`
    - `https://<tenant-ID>.ciamlogin.com/<tenant-ID>/federation/oauth2`
    - `https://<tenant-ID>.ciamlogin.com/<tenant-subdomain>.onmicrosoft.com/federation/oauth2`

1. Select **Create**.
1. Record the values of **Client ID** and **Client secret**. You need both values to configure Google as an identity provider in your tenant.

> [!NOTE]
> In some cases, your app might require verification by Google (for example, if you update the application logo). For more information, check out the [Google's verification status guid](https://support.google.com/cloud/answer/10311615#verification-status).

## Configure Google federation in Azure AD for customers

After you create the Google application, in this step you set the Google client ID and client secret in Azure AD. You can use the Microsoft Entra admin center or PowerShell to do so. To configure Google federation in the Microsoft Entra admin center, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/) as the global administrator of your customer tenant.
1. Go to **Azure Active Directory** > **External Identities** > **All identity providers**.
1. Select **+ Google**.

   <!-- ![Screenshot that shows how to add Google identity provider in Azure AD.](./media/sign-in-with-google/configure-google-idp.png)-->

1. Enter a **Name**. For example, *Google*.
1. For the **Client ID**, enter the Client ID of the Google application that you created earlier.
1. For the **Client secret**, enter the Client Secret that you recorded.
1. Select **Save**.

To configure Google federation by using PowerShell, follow these steps:

1. Install the latest version of the Azure AD PowerShell for Graph module ([AzureADPreview](https://www.powershellgallery.com/packages/AzureADPreview)).
1. Run the following command: `Connect-AzureAD`
1. At the sign-in prompt, sign in with the managed Global Administrator account.
1. Run the following command:
    
    `New-AzureADMSIdentityProvider -Type Google -Name Google -ClientId <client ID> -ClientSecret <client secret>`

    Use the client ID and client secret from the app you created in [Create a Google application](#create-a-google-application) step.


## Add Google identity provider to a user flow 

At this point, the Google identity provider has been set up in your Azure AD, but it's not yet available in any of the sign-in pages. To add the Google identity provider to a user flow:

1. In your customer tenant, go to **Azure Active Directory** > **External Identities** > **User flows**.
1. Select the user flow where you want to add the Google identity provider.
1. Under Settings, select **Identity providers**
1. Under **Other Identity Providers**, select **Google**.

   <!-- ![Screenshot that shows how to add Google identity provider a user flow.](./media/sign-in-with-google/add-google-idp-to-user-flow.png)-->

1. Select **Save**.

## Next steps

- [Add Facebook as an identity provider](how-to-facebook-federation-customers.md)
- [Customize the branding for customer sign-in experiences](how-to-customize-branding-customers.md)
