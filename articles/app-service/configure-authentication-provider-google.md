---
title: Configure Google authentication - Azure App Service
description: Learn how to configure Google authentication for your App Service app.
services: app-service
documentationcenter: ''
author: cephalin
manager: gwallace
editor: ''

ms.assetid: 2b2f9abf-9120-4aac-ac5b-4a268d9b6e2b
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 09/02/2019
ms.author: cephalin
ms.custom: seodec18

---
# How to configure your App Service application to use Google login
[!INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

This topic shows you how to configure Azure App Service to use Google as an authentication provider.

To complete the procedure in this topic, you must have a Google account that has a verified email address. To create a new Google account, go to [accounts.google.com](https://go.microsoft.com/fwlink/p/?LinkId=268302).

## <a name="register"> </a>Register your application with Google
1. Follow the Google documentation at [Google Sign-In for server-side apps](https://developers.google.com/identity/sign-in/web/server-side-flow) to create a client ID and client secret, with the following information (no need to make any code changes):
    - For **Authorized JavaScript Origins**, use `https://<app-name>.azurewebsites.net` with the name of your app in *\<app-name>*.
    - For **Authorized Redirect URI**, use `https://<app-name>.azurewebsites.net/.auth/login/google/callback`.
1. Once the client ID and client secrets are created, copy their values.

    > [!IMPORTANT]
    > The client secret is an important security credential. Do not share this secret with anyone or distribute it within a client application.


## <a name="secrets"> </a>Add Google information to your application
1. In the [Azure portal], navigate to your App Service app. From the left menu, select **Authentication / Authorization**.
2. If the Authentication / Authorization feature is not enabled, turn the switch to **On**.
3. Click **Google**. Paste in the App ID and App Secret values that you obtained previously, and optionally enable any scopes your application requires. Then click **OK**.

   App Service provides authentication but does not restrict authorized access to your site content and APIs. For more information, see [Authorize or deny users](app-service-authentication-how-to.md#authorize-or-deny-users).
4. (Optional) To restrict access to your site to only users authenticated by Google, set **Action to take when request is not authenticated** to **Google**. This requires that all requests be authenticated, and all unauthenticated requests are redirected to Google for authentication.

    > [!NOTE]
    > Restricting access in this way applies to all calls to your app, which may not be desirable for apps wanting a publicly available home page, as in many single-page applications. For such applications, **Allow anonymous requests (no action)** may be preferred, with the app manually starting login itself, as described [here](overview-authentication-authorization.md#authentication-flow).
    
5. Click **Save**.

You are now ready to use Google for authentication in your app.

## <a name="related-content"> </a>Related Content
[!INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]

<!-- Anchors. -->

<!-- Images. -->

[0]: ./media/app-service-mobile-how-to-configure-google-authentication/mobile-app-google-redirect.png
[1]: ./media/app-service-mobile-how-to-configure-google-authentication/mobile-app-google-settings.png

<!-- URLs. -->

[Google apis]: https://go.microsoft.com/fwlink/p/?LinkId=268303

[Azure portal]: https://portal.azure.com/

