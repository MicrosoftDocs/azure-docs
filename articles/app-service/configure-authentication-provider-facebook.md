---
title: Configure Facebook Authentication
description: Learn how to configure Facebook authentication as an identity provider for your App Service or Azure Functions app.
ms.assetid: b6b4f062-fcb4-47b3-b75a-ec4cb51a62fd
ms.topic: how-to
ms.date: 03/23/2026
ms.custom: fasttrack-edit, AppServiceIdentity
author: cephalin
ms.author: cephalin
ms.service: azure-app-service

# As a developer, I want to configure Facebook authentication so that I can use it as an identity provider for an App Service or Azure Functions app. 

---

# Configure your App Service or Azure Functions app to use Facebook sign-in

[!INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

This article shows how to configure Azure App Service or Azure Functions to use Facebook as an authentication provider.

To complete the procedure in this article, you need a Facebook account that has a verified email address and a mobile phone number. To create a new Facebook account, go to [facebook.com].

## <a name="register"> </a>Register your application with Facebook

To register your application with Facebook:

1. Go to the [Facebook Developers] website, and sign in with your Facebook account credentials.

   If you don't have a Facebook for Developers account, select **Get Started** and follow the registration steps.
1. On the **My Apps** page, select **Create App**.
1. In the resulting window, select **Create app** again. 
1. In **App name**, enter a unique name for your app, and then select **Next**.
1. On the **Use cases** tab, select **Authenticate and request data from users with Facebook Login**, and then select **Next**.
1. On the **Business** tab, select **I don't want to connect to a business portfolio yet**, or create or select a portfolio, and then select **Next**.  
1. On the **Requirements** tab, select **Next**.
1. On the **Overview** tab, select **Create app**. 
1. Enter the password for the Facebook account.

   The developer dashboard for your new Facebook app opens.
1. Select the arrow next to **App customization and requirements**.
1. In the left pane, under **Facebook Login**, select **Settings**.
1. In **Valid OAuth redirect URIs**, enter `https://<app-name>.azurewebsites.net/.auth/login/facebook/callback`. Replace `<app-name>` with the name of your App Service or Functions app.
1. Select **Save changes**.
1. In the left pane, select **App settings** > **Basic**. 
1. In **App Secret**, select **Show**. Copy the values of **App ID** and **App Secret**. You use them later to configure your App Service or Functions app in Azure.

   > [!IMPORTANT]
   > The app secret is an important security credential. Don't share this secret with anyone or distribute it within a client application.
   >

1. The Facebook account that you used to register the application is an administrator of the app. At this point, only administrators can sign in to this application.

   To authenticate other Facebook accounts, you need to [publish](https://developers.facebook.com/docs/development/release) the app.

## <a name="secrets"> </a>Add Facebook information to your application

Next, add Facebook information to your application: 

1. Sign in to the [Azure portal] and go to your app.
1. In the left pane, under **Settings**, select **Authentication**. Select **Add identity provider**.
1. Select **Facebook** in the identity provider list. Paste in the app ID and app secret values that you obtained previously.

    The secret is stored as a slot-sticky [application setting](./configure-common.md#configure-app-settings) named `FACEBOOK_PROVIDER_AUTHENTICATION_SECRET`. You can update that setting later to use [Key Vault references](./app-service-key-vault-references.md) if you want to manage the secret in Azure Key Vault.

1. If this identity provider is the first one configured for the application, you're also prompted with an **App Service authentication settings** section. Otherwise, you can go to the next step.
    
    These options determine how your application responds to unauthenticated requests. The default selections redirect all requests to sign in with this new provider. You can change this behavior now or adjust these settings later from the main **Authentication** screen by selecting **Edit** next to **Authentication settings**. To learn more about these options, see [Authentication flow](overview-authentication-authorization.md#authentication-flow).

1. (Optional) Select **Next: Scopes** and add any scopes needed by the application. These scopes will be requested at sign-in time for browser-based flows.
1. Select **Add**.

You're now ready to use Facebook for authentication in your app. The provider is listed on the **Authentication** screen. From there, you can edit or delete the provider configuration.

## <a name="related-content"> </a>Related content

[!INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]

<!-- URLs. -->
[Facebook Developers]: https://go.microsoft.com/fwlink/p/?LinkId=268286
[facebook.com]: https://www.facebook.com/
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-dotnet/
[Azure portal]: https://portal.azure.com/
