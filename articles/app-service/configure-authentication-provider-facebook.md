---
title: Configure Facebook authentication
description: Learn how to configure Facebook authentication as an identity provider for your App Service or Azure Functions app.
ms.assetid: b6b4f062-fcb4-47b3-b75a-ec4cb51a62fd
ms.topic: article
ms.date: 03/29/2021
ms.custom: seodec18, fasttrack-edit, AppServiceIdentity
author: cephalin
ms.author: cephalin
---

# Configure your App Service or Azure Functions app to use Facebook login

[!INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

This article shows how to configure Azure App Service or Azure Functions to use Facebook as an authentication provider.

To complete the procedure in this article, you need a Facebook account that has a verified email address and a mobile phone number. To create a new Facebook account, go to [facebook.com].

## <a name="register"> </a>Register your application with Facebook

1. Go to the [Facebook Developers] website and sign in with your Facebook account credentials.

   If you don't have a Facebook for Developers account, select **Get Started** and follow the registration steps.
1. Select **My Apps** > **Add New App**.
1. In **Display Name** field:
   1. Type a unique name for your app.
   1. Provide your **Contact Email**.
   1. Select **Create App ID**.
   1. Complete the security check.

   The developer dashboard for your new Facebook app opens.
1. Select **Dashboard** > **Facebook Login** > **Set up** > **Web**.
1. In the left navigation under **Facebook Login**, select **Settings**.
1. In the **Valid OAuth redirect URIs** field, enter `https://<app-name>.azurewebsites.net/.auth/login/facebook/callback`. Remember to replace `<app-name>` with the name of your Azure App Service app.
1. Select **Save Changes**.
1. In the left pane, select **Settings** > **Basic**. 
1. In the **App Secret** field, select **Show**. Copy the values of **App ID** and **App Secret**. You use them later to configure your App Service app in Azure.

   > [!IMPORTANT]
   > The app secret is an important security credential. Do not share this secret with anyone or distribute it within a client application.
   >

1. The Facebook account that you used to register the application is an administrator of the app. At this point, only administrators can sign in to this application.

   To authenticate other Facebook accounts, select **App Review** and enable **Make \<your-app-name> public** to enable the general public to access the app by using Facebook authentication.

## <a name="secrets"> </a>Add Facebook information to your application

1. Sign in to the [Azure portal] and navigate to your app.
1. Select **Authentication** in the menu on the left. Click **Add identity provider**.
1. Select **Facebook** in the identity provider dropdown. Paste in the App ID and App Secret values that you obtained previously.

    The secret will be stored as a slot-sticky [application setting](./configure-common.md#configure-app-settings) named `FACEBOOK_PROVIDER_AUTHENTICATION_SECRET`. You can update that setting later to use [Key Vault references](./app-service-key-vault-references.md) if you wish to manage the secret in Azure Key Vault.

1. If this is the first identity provider configured for the application, you will also be prompted with an **App Service authentication settings** section. Otherwise, you may move on to the next step.
    
    These options determine how your application responds to unauthenticated requests, and the default selections will redirect all requests to log in with this new provider. You can change customize this behavior now or adjust these settings later from the main **Authentication** screen by choosing **Edit** next to **Authentication settings**. To learn more about these options, see [Authentication flow](overview-authentication-authorization.md#authentication-flow).

1. (Optional) Click **Next: Scopes** and add any scopes needed by the application. These will be requested at login time for browser-based flows.
1. Click **Add**.

You're now ready to use Facebook for authentication in your app. The provider will be listed on the **Authentication** screen. From there, you can edit or delete this provider configuration.

## <a name="related-content"> </a>Next steps

[!INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]

<!-- URLs. -->
[Facebook Developers]: https://go.microsoft.com/fwlink/p/?LinkId=268286
[facebook.com]: https://go.microsoft.com/fwlink/p/?LinkId=268285
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-dotnet/
[Azure portal]: https://portal.azure.com/
