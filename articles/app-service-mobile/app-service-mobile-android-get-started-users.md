---
title: Add authentication on Android with Mobile Apps | Microsoft Docs
description: Learn how to use the Mobile Apps feature of Azure App Service to authenticate users of your Android app through a variety of identity providers, including Google, Facebook, Twitter, and Microsoft.
services: app-service\mobile
documentationcenter: android
author: elamalani
manager: crdun
editor: ''

ms.assetid: 1fc8e7c1-6c3c-40f4-9967-9cf5e21fc4e1
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-android
ms.devlang: java
ms.topic: article
ms.date: 06/25/2019
ms.author: emalani
---
# Add authentication to your Android app
[!INCLUDE [app-service-mobile-selector-get-started-users](../../includes/app-service-mobile-selector-get-started-users.md)]

> [!NOTE]
> Visual Studio App Center is investing in new and integrated services central to mobile app development. Developers can use **Build**, **Test** and **Distribute** services to set up Continuous Integration and Delivery pipeline. Once the app is deployed, developers can monitor the status and usage of their app using the **Analytics** and **Diagnostics** services, and engage with users using the **Push** service. Developers can also leverage **Auth** to authenticate their users and **Data** service to persist and sync app data in the cloud. Check out [App Center](https://appcenter.ms/?utm_source=zumo&utm_campaign=app-service-mobile-android-get-started-users) today.
>

## Summary
In this tutorial, you add authentication to the todolist quickstart project on Android by using a supported identity provider. This tutorial is based on the [Get started with Mobile Apps] tutorial, which you must complete first.

## <a name="register"></a>Register your app for authentication and configure Azure App Service
[!INCLUDE [app-service-mobile-register-authentication](../../includes/app-service-mobile-register-authentication.md)]

## <a name="redirecturl"></a>Add your app to the Allowed External Redirect URLs

Secure authentication requires that you define a new URL scheme for your app. This allows the authentication system to redirect back to your app once the authentication process is complete. In this tutorial, we use the URL scheme _appname_ throughout. However, you can use any URL scheme you choose. It should be unique to your mobile application. To enable the redirection on the server side:

1. In the [Azure portal], select your App Service.

2. Click the **Authentication / Authorization** menu option.

3. In the **Allowed External Redirect URLs**, enter `appname://easyauth.callback`.  The _appname_ in this string is the URL Scheme for your mobile application.  It should follow normal URL specification for a protocol (use letters and numbers only, and start with a letter).  You should make a note of the string that you choose as you will need to adjust your mobile application code with the URL Scheme in several places.

4. Click **OK**.

5. Click **Save**.

## <a name="permissions"></a>Restrict permissions to authenticated users
[!INCLUDE [app-service-mobile-restrict-permissions-dotnet-backend](../../includes/app-service-mobile-restrict-permissions-dotnet-backend.md)]

* In Android Studio, open the project you completed with the tutorial [Get started with Mobile Apps]. From the **Run** menu, click **Run app**, and verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts.

     This exception happens because the app attempts to access the back end as an unauthenticated user, but the *TodoItem* table now requires authentication.

Next, you update the app to authenticate users before requesting resources from the Mobile Apps back end.

## Add authentication to the app
[!INCLUDE [mobile-android-authenticate-app](../../includes/mobile-android-authenticate-app.md)]



## <a name="cache-tokens"></a>Cache authentication tokens on the client
[!INCLUDE [mobile-android-authenticate-app-with-token](../../includes/mobile-android-authenticate-app-with-token.md)]

## Next steps
Now that you completed this basic authentication tutorial, consider continuing on to one of the following tutorials:

* [Add push notifications to your Android app](app-service-mobile-android-get-started-push.md).
  Learn how to configure your Mobile Apps back end to use Azure notification hubs to send push notifications.
* [Enable offline sync for your Android app](app-service-mobile-android-get-started-offline-data.md).
  Learn how to add offline support to your app by using a Mobile Apps back end. With offline sync, users can interact with a mobile app&mdash;viewing, adding, or modifying data&mdash;even when there is no network connection.

<!-- Anchors. -->
[Register your app for authentication and configure Mobile Services]: #register
[Restrict table permissions to authenticated users]: #permissions
[Add authentication to the app]: #add-authentication
[Store authentication tokens on the client]: #cache-tokens
[Refresh expired tokens]: #refresh-tokens
[Next Steps]:#next-steps


<!-- URLs. -->
[Get started with Mobile Apps]: app-service-mobile-android-get-started.md
[Azure portal]: https://portal.azure.com/
