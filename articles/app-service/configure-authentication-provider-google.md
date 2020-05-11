---
title: Configure Google authentication
description: Learn how to configure Google authentication as an identity provider for your App Service or Azure Functions app.
ms.assetid: 2b2f9abf-9120-4aac-ac5b-4a268d9b6e2b
ms.topic: article
ms.date: 09/02/2019
ms.custom: [seodec18, fasttrack-edit]

---

# Configure your App Service or Azure Functions app to use Google login

[!INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

This topic shows you how to configure Azure App Service or Azure Functions to use Google as an authentication provider.

To complete the procedure in this topic, you must have a Google account that has a verified email address. To create a new Google account, go to [accounts.google.com](https://go.microsoft.com/fwlink/p/?LinkId=268302).

## <a name="register"> </a>Register your application with Google

1. Follow the Google documentation at [Google Sign-In for server-side apps](https://developers.google.com/identity/sign-in/web/server-side-flow) to create a client ID and client secret. There's no need to make any code changes. Just use the following information:
    - For **Authorized JavaScript Origins**, use `https://<app-name>.azurewebsites.net` with the name of your app in *\<app-name>*.
    - For **Authorized Redirect URI**, use `https://<app-name>.azurewebsites.net/.auth/login/google/callback`.
1. Copy the App ID and the App secret values.

    > [!IMPORTANT]
    > The App secret is an important security credential. Do not share this secret with anyone or distribute it within a client application.

## <a name="secrets"> </a>Add Google information to your application

1. In the [Azure portal], go to your App Service app.
1. Select **Settings** > **Authentication / Authorization**, and make sure that **App Service Authentication** is **On**.
1. Select **Google**, then paste in the App ID and App Secret values that you obtained previously. Enable any scopes needed by your application.
1. Select **OK**.

   App Service provides authentication but doesn't restrict authorized access to your site content and APIs. For more information, see [Authorize or deny users](app-service-authentication-how-to.md#authorize-or-deny-users).

1. (Optional) To restrict site access only to users authenticated by Google, set **Action to take when request is not authenticated** to **Google**. When you set this functionality, your app requires that all requests be authenticated. It also redirects all unauthenticated requests to Google for authentication.

    > [!CAUTION]
    > Restricting access in this way applies to all calls to your app, which might not be desirable for apps that have a publicly available home page, as in many single-page applications. For such applications, **Allow anonymous requests (no action)** might be preferred so that the app manually starts authentication itself. For more information, see [Authentication flow](overview-authentication-authorization.md#authentication-flow).

1. Select **Save**.

You are now ready to use Google for authentication in your app.

## <a name="related-content"> </a>Next steps

[!INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]

<!-- Anchors. -->

<!-- Images. -->

[0]: ./media/app-service-mobile-how-to-configure-google-authentication/mobile-app-google-redirect.png
[1]: ./media/app-service-mobile-how-to-configure-google-authentication/mobile-app-google-settings.png

<!-- URLs. -->

[Google apis]: https://go.microsoft.com/fwlink/p/?LinkId=268303

[Azure portal]: https://portal.azure.com/

