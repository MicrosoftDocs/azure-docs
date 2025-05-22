---
title: Configure X authentication
description: Learn how to configure X authentication as an identity provider for your App Service or Azure Functions app.
ms.assetid: c6dc91d7-30f6-448c-9f2d-8e91104cde73
ms.topic: article
ms.date: 03/29/2021
ms.custom: fasttrack-edit, AppServiceIdentity
author: cephalin
ms.author: cephalin
---

# Configure your App Service or Azure Functions app to use X login

[!INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

This article shows how to configure Azure App Service or Azure Functions to use X as an authentication provider.

To complete the procedure in this article, you need an X account that has a verified email address and phone number. To create a new X account, go to [x.com].

## <a name="register"> </a>Register your application with X

1. Sign in to the [Azure portal] and go to your application. Copy your **URL**. You'll use it to configure your X app.
1. Go to the [X Developers] website, sign in with your X account credentials, and select **Create an app**.
1. Enter the **App name** and the **Application description** for your new app. Paste your application's **URL** into the **Website URL** field. In the **Callback URLs** section, enter the HTTPS URL of your App Service app and append the path `/.auth/login/x/callback`. For example, `https://contoso.azurewebsites.net/.auth/login/x/callback`.
1. At the bottom of the page, type at least 100 characters in **Tell us how this app will be used**, then select **Create**. Click **Create** again in the pop-up. The application details are displayed.
1. Select the **Keys and Access Tokens** tab.

   Make a note of these values:
   - API key
   - API secret key

   > [!IMPORTANT]
   > The API secret key is an important security credential. Do not share this secret with anyone or distribute it with your app.

## <a name="secrets"> </a>Add X information to your application

1. Sign in to the [Azure portal] and navigate to your app.
1. Select **Authentication** in the menu on the left. Click **Add identity provider**.
1. Select **Twitter** in the identity provider dropdown. Paste in the `API key` and `API secret key` values that you obtained previously.

    The secret will be stored as a slot-sticky [application setting](./configure-common.md#configure-app-settings) named `TWITTER_PROVIDER_AUTHENTICATION_SECRET`. You can update that setting later to use [Key Vault references](./app-service-key-vault-references.md) if you wish to manage the secret in Azure Key Vault.

1. If this is the first identity provider configured for the application, you will also be prompted with an **App Service authentication settings** section. Otherwise, you may move on to the next step.

    These options determine how your application responds to unauthenticated requests, and the default selections will redirect all requests to log in with this new provider. You can change customize this behavior now or adjust these settings later from the main **Authentication** screen by choosing **Edit** next to **Authentication settings**. To learn more about these options, see [Authentication flow](overview-authentication-authorization.md#authentication-flow).

1. Click **Add**.

You're now ready to use X for authentication in your app. The provider will be listed on the **Authentication** screen. From there, you can edit or delete this provider configuration.

## <a name="related-content"> </a>Next steps

[!INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]

<!-- URLs. -->

[X Developers]: https://go.microsoft.com/fwlink/p/?LinkId=268300
[x.com]: https://go.microsoft.com/fwlink/p/?LinkID=268287
[Azure portal]: https://portal.azure.com/
