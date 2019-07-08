---
title: Configure Google authentication - Azure App Service
description: Learn how to configure Google authentication for your App Services application.
services: app-service
documentationcenter: ''
author: mattchenderson
manager: syntaxc4
editor: ''

ms.assetid: 2b2f9abf-9120-4aac-ac5b-4a268d9b6e2b
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 04/19/2018
ms.author: mahender
ms.custom: seodec18

---
# How to configure your App Service application to use Google login
[!INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

This topic shows you how to configure Azure App Service to use Google as an authentication provider.

To complete the procedure in this topic, you must have a Google account that has a verified email address. To create a new Google account, go to [accounts.google.com](https://go.microsoft.com/fwlink/p/?LinkId=268302).

## <a name="register"> </a>Register your application with Google
1. Log on to the [Azure portal], and navigate to your application. Copy your **URL**, which you use later to configure your Google app.
2. Navigate to the [Google apis](https://go.microsoft.com/fwlink/p/?LinkId=268303) website, sign in with your Google account credentials, click **Create Project**, provide a **Project name**, then click **Create**.
3. Once the project is created, select it. From the project dashboard, click **Go to APIs overview**.
4. Select **Enable APIs and services**. Search for **Google+ API**, and select it. Then click **Enable**.
5. In the left navigation, **Credentials** > **OAuth consent screen**, then select your **Email address**,  enter a **Product Name**, and click **Save**.
6. In the **Credentials** tab, click **Create credentials** > **OAuth client ID**.
7. On the "Create client ID" screen, select **Web application**.
8. Paste the App Service **URL** you copied earlier into **Authorized JavaScript Origins**, then paste your redirect URI into **Authorized Redirect URI**. The redirect URI is the URL of your application appended with the path, */.auth/login/google/callback*. For example, `https://contoso.azurewebsites.net/.auth/login/google/callback`. Make sure that you are using the HTTPS scheme. Then click **Create**.
9. On the next screen, make a note of the values of the client ID and client secret.

    > [!IMPORTANT]
    > The client secret is an important security credential. Do not share this secret with anyone or distribute it within a client application.


## <a name="secrets"> </a>Add Google information to your application
1. Back in the [Azure portal], navigate to your application. Click **Settings**, and then **Authentication / Authorization**.
2. If the Authentication / Authorization feature is not enabled, turn the switch to **On**.
3. Click **Google**. Paste in the App ID and App Secret values which you obtained previously, and optionally enable any scopes your application requires. Then click **OK**.
   
   ![][1]
   
   By default, App Service provides authentication but does not restrict authorized access to your site content and APIs. You must authorize users in your app code.
4. (Optional) To restrict access to your site to only users authenticated by Google, set **Action to take when request is not authenticated** to **Google**. This requires that all requests be authenticated, and all unauthenticated requests are redirected to Google for authentication.
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

