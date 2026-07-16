---
title: Configure GitHub Authentication
description: Learn how to configure GitHub authentication as an identity provider for your App Service or Azure Functions app.
ms.topic: how-to
ms.date: 03/18/2026
ms.custom: AppServiceIdentity
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
# customer intent: As a developer, I want to configure GitHub authentication so that I can use it as an identity provider for an App Service or Azure Functions app. 

 
---

# Configure your App Service or Azure Functions app to use Sign in with GitHub

[!INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

This article shows how to configure Azure App Service or Azure Functions to use GitHub as an authentication provider.

To complete the procedure in this article, you need a GitHub account. To create a new GitHub account, go to [GitHub].

## <a name="register"> </a>Register your application with GitHub

To register your application with GitHub: 

1. Sign in to the [Azure portal] and go to your application. Copy your **URL**, which is under **Default domain** on the **Overview** page. You'll use it to configure your GitHub app. 
1. Follow the instructions for [creating an OAuth app on GitHub](https://docs.github.com/developers/apps/building-oauth-apps/creating-an-oauth-app). In the **Authorization callback URL** section, enter the HTTPS URL of your app and append the path `/.auth/login/github/callback`. For example, `https://contoso.azurewebsites.net/.auth/login/github/callback`.
1. On the application page, make note of the **Client ID**. You'll need it later.
1. Under **Client Secrets**, select **Generate a new client secret**.
1. Make note of the client secret value, which you'll need later.

   > [!IMPORTANT]
   > The client secret is an important security credential. Don't share this secret with anyone or distribute it with your app.

## <a name="secrets"> </a>Add GitHub information to your application

To add GitHub information to your application: 

1. Sign in to the [Azure portal] and go to your app.
1. Select **Settings** > **Authentication** in the navigation menu. Select **Add identity provider**.
1. Select **GitHub** in the identity provider dropdown list. Paste in the `Client ID` and `Client secret` values that you obtained previously.

    The secret will be stored as a slot-sticky [application setting](./configure-common.md#configure-app-settings) named `GITHUB_PROVIDER_AUTHENTICATION_SECRET`. You can update that setting later to use [Key Vault references](./app-service-key-vault-references.md) if you want to manage the secret in Azure Key Vault.

1. If this identity provider is the first one configured for the application, you also see an **App Service authentication settings** section. Otherwise, you can move on to the next step.
    
    These options determine how your application responds to unauthenticated requests. The default selections redirect all requests to sign in with the new provider. You can change this behavior now or adjust these settings later from the main **Authentication** screen by selecting **Edit** next to **Authentication settings**. To learn more about these options, see [Authentication flow](overview-authentication-authorization.md#authentication-flow).

1. Select **Add**.

You're now ready to use GitHub for authentication in your app. The provider is listed on the **Authentication** screen. From there, you can edit or delete this provider configuration.

<!-- URLs. -->

[GitHub]:https://github.com/
[Azure portal]: https://portal.azure.com/
