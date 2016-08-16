<properties
	pageTitle="Add authentication on Android with Mobile Apps | Azure App Service"
	description="Learn how to use Mobile Apps in Azure App Service to authenticate users of your Android app through a variety of identity providers, including Google, Facebook, Twitter, and Microsoft."
	services="app-service\mobile"
	documentationCenter="android"
	authors="RickSaling"
	manager="erikre"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-android"
	ms.devlang="java"
	ms.topic="article"
	ms.date="07/18/2016"
	ms.author="ricksal"/>

# Add authentication to your Android app

[AZURE.INCLUDE [app-service-mobile-selector-get-started-users](../../includes/app-service-mobile-selector-get-started-users.md)]

## Summary

In this tutorial, you add authentication to the todolist quickstart project on Android using a supported identity provider. This tutorial is based on the [Get started with Mobile Apps] tutorial, which you must complete first.

##<a name="register"></a>Register your app for authentication and configure the App Service

[AZURE.INCLUDE [app-service-mobile-register-authentication](../../includes/app-service-mobile-register-authentication.md)]

##<a name="permissions"></a>Restrict permissions to authenticated users

[AZURE.INCLUDE [app-service-mobile-restrict-permissions-dotnet-backend](../../includes/app-service-mobile-restrict-permissions-dotnet-backend.md)]

+ In Android Studio, open the project that you created when you completed the tutorial [Get started with Mobile Apps], then from the **Run** menu click **Run app** and verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts.

	 This happens because the app attempts to access the backend as an unauthenticated user, but the _TodoItem_ table now requires authentication.

Next, you will update the app to authenticate users before requesting resources from the Mobile App backend.

## Add authentication to the app

[AZURE.INCLUDE [mobile-android-authenticate-app](../../includes/mobile-android-authenticate-app.md)]

## <a name="cache-tokens"></a>Cache authentication tokens on the client

[AZURE.INCLUDE [mobile-android-authenticate-app-with-token](../../includes/mobile-android-authenticate-app-with-token.md)]

##Next steps

Now that you completed this basic authentication tutorial, consider continuing on to one of the following tutorials:

+ [Add push notifications to your Android app](app-service-mobile-android-get-started-push.md)
  Learn how to add push notifications support to your app and configure your Mobile App backend to use Azure Notification Hubs to send push notifications.

+ [Enable offline sync for your Android app](app-service-mobile-android-get-started-offline-data.md)
  Learn how to add offline support your app using an Mobile App backend. Offline sync allows end-users to interact with a mobile app&mdash;viewing, adding, or modifying data&mdash;even when there is no network connection.



<!-- Anchors. -->
[Register your app for authentication and configure Mobile Services]: #register
[Restrict table permissions to authenticated users]: #permissions
[Add authentication to the app]: #add-authentication
[Store authentication tokens on the client]: #cache-tokens
[Refresh expired tokens]: #refresh-tokens
[Next Steps]:#next-steps


<!-- URLs. -->
[Get started with Mobile Apps]: app-service-mobile-android-get-started.md
