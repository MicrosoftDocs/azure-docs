---
title: Configure Facebook authentication
description: Learn how to configure Facebook authentication as an identity provider for your App Service or Azure Functions app.
ms.assetid: b6b4f062-fcb4-47b3-b75a-ec4cb51a62fd
ms.topic: article
ms.date: 06/06/2019
ms.custom: [seodec18, fasttrack-edit]
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

1. Sign in to the [Azure portal] and navigate to your App Service app.
1. Select **Settings** > **Authentication / Authorization**, and make sure that **App Service Authentication** is **On**.
1. Select **Facebook**, and then paste in the App ID and App Secret values that you obtained previously. Enable any scopes needed by your application.
1. Select **OK**.

   ![Screenshot of Mobile App Facebook Settings][0]

    By default, App Service provides authentication, but it doesn't restrict authorized access to your site content and APIs. You need to authorize users in your app code.
1. (Optional) To restrict access only to users authenticated by Facebook, set **Action to take when request is not authenticated** to **Facebook**. When you set this functionality, your app requires all requests to be authenticated. It also redirects all unauthenticated requests to Facebook for authentication.

   > [!CAUTION]
   > Restricting access in this way applies to all calls to your app, which might not be desirable for apps that have a publicly available home page, as in many single-page applications. For such applications, **Allow anonymous requests (no action)** might be preferred so that the app manually starts authentication itself. For more information, see [Authentication flow](overview-authentication-authorization.md#authentication-flow).

1. Select **Save**.

You're now ready to use Facebook for authentication in your app.

## <a name="related-content"> </a>Next steps

[!INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]

<!-- Images. -->
[0]: ./media/app-service-mobile-how-to-configure-facebook-authentication/mobile-app-facebook-settings.png

<!-- URLs. -->
[Facebook Developers]: https://go.microsoft.com/fwlink/p/?LinkId=268286
[facebook.com]: https://go.microsoft.com/fwlink/p/?LinkId=268285
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-dotnet/
[Azure portal]: https://portal.azure.com/
