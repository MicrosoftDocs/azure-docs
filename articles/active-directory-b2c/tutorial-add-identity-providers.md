---
title: "Tutorial: Add identity providers to your apps"
titleSuffix: Azure AD B2C
description: Learn how to add identity providers to your applications in Azure Active Directory B2C using the Azure portal.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: article
ms.date: 07/08/2019
ms.author: mimart
ms.subservice: B2C
---

# Tutorial: Add identity providers to your applications in Azure Active Directory B2C

In your applications, you may want to enable users to sign in with different identity providers. An *identity provider* creates, maintains, and manages identity information while providing authentication services to applications. You can add identity providers that are supported by Azure Active Directory B2C (Azure AD B2C) to your [user flows](user-flow-overview.md) using the Azure portal.

In this article, you learn how to:

> [!div class="checklist"]
> * Create the identity provider applications
> * Add the identity providers to your tenant
> * Add the identity providers to your user flow

You typically use only one identity provider in your applications, but you have the option to add more. This tutorial shows you how to add an Azure AD identity provider and a Facebook identity provider to your application. Adding both of these identity providers to your application is optional. You can also add other identity providers, such as [Amazon](identity-provider-amazon.md), [GitHub](identity-provider-github.md), [Google](identity-provider-google.md), [LinkedIn](identity-provider-linkedin.md), [Microsoft](identity-provider-microsoft-account.md), or [Twitter](identity-provider-twitter.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

[Create a user flow](tutorial-create-user-flows.md) to enable users to sign up and sign in to your application.

## Create applications

Identity provider applications provide the identifier and key to enable communication with your Azure AD B2C tenant. In this section of the tutorial, you create an Azure AD application and a Facebook application from which you get identifiers and keys to add the identity providers to your tenant. If you're adding just one of the identity providers, you only need to create the application for that provider.

### Create an Azure Active Directory application

To enable sign-in for users from Azure AD, you need to register an application within the Azure AD tenant. The Azure AD tenant is not the same as your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains your Azure AD tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your Azure AD tenant.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **App registrations**.
1. Select **New registration**.
1. Enter a name for your application. For example, `Azure AD B2C App`.
1. Accept the selection of **Accounts in this organizational directory only** for this application.
1. For the **Redirect URI**, accept the value of **Web** and enter the following URL in all lowercase letters, replacing `your-B2C-tenant-name` with the name of your Azure AD B2C tenant.

    ```
    https://your-B2C-tenant-name.b2clogin.com/your-B2C-tenant-name.onmicrosoft.com/oauth2/authresp
    ```

    For example, `https://contoso.b2clogin.com/contoso.onmicrosoft.com/oauth2/authresp`.

    All URLs should now be using [b2clogin.com](b2clogin.md).

1. Select **Register**, then record the **Application (client) ID** which you use in a later step.
1. Under **Manage** in the application menu, select **Certificates & secrets**, then select **New client secret**.
1. Enter a **Description** for the client secret. For example, `Azure AD B2C App Secret`.
1. Select the expiration period. For this application, accept the selection of **In 1 year**.
1. Select **Add**, then record the value of the new client secret which you use in a later step.

### Create a Facebook application

To use a Facebook account as an identity provider in Azure AD B2C, you need to create an application at Facebook. If you don’t already have a Facebook account, you can get it at [https://www.facebook.com/](https://www.facebook.com/).

1. Sign in to [Facebook for developers](https://developers.facebook.com/) with your Facebook account credentials.
1. If you haven't already done so, you need to register as a Facebook developer. To do this, select **Get Started** on the upper-right corner of the page, accept Facebook's policies, and complete the registration steps.
1. Select **My Apps** and then **Create App**.
1. Enter a **Display Name** and a valid **Contact Email**.
1. Click **Create App ID**. This may require you to accept Facebook platform policies and complete an online security check.
1. Select **Settings** > **Basic**.
1. Choose a **Category**, for example `Business and Pages`. This value is required by Facebook, but isn't used by Azure AD B2C.
1. At the bottom of the page, select **Add Platform**, and then select **Website**.
1. In **Site URL**, enter `https://your-tenant-name.b2clogin.com/` replacing `your-tenant-name` with the name of your tenant.
1. Enter a URL for the **Privacy Policy URL**, for example `http://www.contoso.com/`. The privacy policy URL is a page you maintain to provide privacy information for your application.
1. Select **Save Changes**.
1. At the top of the page, record the value of **App ID**.
1. Next to **App Secret**, select **Show** and record its value. You use both the App ID and App Secret to configure Facebook as an identity provider in your tenant. **App Secret** is an important security credential which you should store securely.
1. Select the plus sign next to **PRODUCTS**, then under **Facebook Login**, select **Set up**.
1. Under **Facebook Login** in the left-hand menu, select **Settings**.
1. In **Valid OAuth redirect URIs**, enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp`. Replace `your-tenant-name` with the name of your tenant. Select **Save Changes** at the bottom of the page.
1. To make your Facebook application available to Azure AD B2C, click the **Status** selector at the top right of the page and turn it **On** to make the Application public, and then click **Confirm**. At this point, the Status should change from **Development** to **Live**.

## Add the identity providers

After you create the application for the identity provider that you want to add, you add the identity provider to your tenant.

### Add the Azure Active Directory identity provider

1. Make sure you're using the directory that contains Azure AD B2C tenant. Select the **Directory + subscription** filter in the top menu and choose the directory that contains your Azure AD B2C tenant.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Select **Identity providers**, and then select **New OpenID Connect provider**.
1. Enter a **Name**. For example, enter *Contoso Azure AD*.
1. For **Metadata url**, enter the following URL replacing `your-AD-tenant-domain` with the domain name of your Azure AD tenant:

    ```
    https://login.microsoftonline.com/your-AD-tenant-domain/.well-known/openid-configuration
    ```

    For example, `https://login.microsoftonline.com/contoso.onmicrosoft.com/.well-known/openid-configuration`.

1. For **Client ID**, enter the application ID that you previously recorded.
1. For **Client secret**, enter the client secret that you previously recorded.
1. Leave the default values for **Scope**, **Response type**, and **Response mode**.
1. (Optional) Enter a value for **Domain_hint**. For example, *ContosoAD*. [Domain hints](../active-directory/manage-apps/configure-authentication-for-federated-users-portal.md) are directives that are included in the authentication request from an application. They can be used to accelerate the user to their federated IdP sign-in page. Or they can be used by a multi-tenant application to accelerate the user straight to the branded Azure AD sign-in page for their tenant.
1. Under **Identity provider claims mapping**, enter the following claims mapping values:

    * **User ID**: *oid*
    * **Display name**: *name*
    * **Given name**: *given_name*
    * **Surname**: *family_name*
    * **Email**: *unique_name*

1. Select **Save**.

### Add the Facebook identity provider

1. Select **Identity providers**, then select **Facebook**.
1. Enter a **Name**. For example, *Facebook*.
1. For the **Client ID**, enter the App ID of the Facebook application that you created earlier.
1. For the **Client secret**, enter the App Secret that you recorded.
1. Select **Save**.

## Update the user flow

In the tutorial that you completed as part of the prerequisites, you created a user flow for sign-up and sign-in named *B2C_1_signupsignin1*. In this section, you add the identity providers to the *B2C_1_signupsignin1* user flow.

1. Select **User flows (policies)**, and then select the *B2C_1_signupsignin1* user flow.
2. Select **Identity providers**, select the **Facebook** and **Contoso Azure AD** identity providers that you added.
3. Select **Save**.

## Test the user flow

1. On the Overview page of the user flow that you created, select **Run user flow**.
1. For **Application**, select the web application named *webapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Select **Run user flow**, and then sign in with an identity provider that you previously added.
1. Repeat steps 1 through 3 for the other identity providers that you added.

If the sign in operation is successful, you're redirected to `https://jwt.ms` which displays the Decoded Token, similar to:

```json
{
  "typ": "JWT",
  "alg": "RS256",
  "kid": "<key-ID>"
}.{
  "exp": 1562346892,
  "nbf": 1562343292,
  "ver": "1.0",
  "iss": "https://your-b2c-tenant.b2clogin.com/10000000-0000-0000-0000-000000000000/v2.0/",
  "sub": "20000000-0000-0000-0000-000000000000",
  "aud": "30000000-0000-0000-0000-000000000000",
  "nonce": "defaultNonce",
  "iat": 1562343292,
  "auth_time": 1562343292,
  "name": "User Name",
  "idp": "facebook.com",
  "postalCode": "12345",
  "tfp": "B2C_1_signupsignin1"
}.[Signature]
```

## Next steps

In this article, you learned how to:

> [!div class="checklist"]
> * Create the identity provider applications
> * Add the identity providers to your tenant
> * Add the identity providers to your user flow

Next, learn how to customize the UI of the pages shown to users as part of their identity experience in your applications:

> [!div class="nextstepaction"]
> [Customize the user interface of your applications in Azure Active Directory B2C](tutorial-customize-ui.md)
