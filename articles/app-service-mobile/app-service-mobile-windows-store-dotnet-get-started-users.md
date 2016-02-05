<properties
	pageTitle="Add authentication to your Windows Runtime 8.1 universal app | Azure Mobile Apps"
	description="Learn how to use Azure App Service Mobile Apps to authenticate users of your Windows app using a variety of identity providers, including: AAD, Google, Facebook, Twitter, and Microsoft."
	services="app-service\mobile"
	documentationCenter="windows"
	authors="mattchenderson"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-windows"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="02/04/2016"
	ms.author="glenga"/>

# Add authentication to your Windows app

[AZURE.INCLUDE [app-service-mobile-selector-get-started-users](../../includes/app-service-mobile-selector-get-started-users.md)]

This topic shows you how to add cloud-based authentication to your mobile app. In this tutorial, you add authentication to the Mobile Apps quickstart project using an identity provider that is supported by Azure App Service. After being successfully authenticated and authorized by your Mobile App backend, the user ID value is displayed.

This tutorial is based on the Mobile Apps quickstart. You must first complete the tutorial [Get started with Mobile Apps](app-service-mobile-windows-store-dotnet-get-started.md).

##<a name="register"></a>Register your app for authentication and configure the App Service

[AZURE.INCLUDE [app-service-mobile-register-authentication](../../includes/app-service-mobile-register-authentication.md)]

##<a name="permissions"></a>Restrict permissions to authenticated users

[AZURE.INCLUDE [app-service-mobile-restrict-permissions-dotnet-backend](../../includes/app-service-mobile-restrict-permissions-dotnet-backend.md)]

With one of the Windows app projects set as the start-up project, press the F5 key to run the app; verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts. This happens because the app attempts to access your Mobile App Code as an unauthenticated user, but the *TodoItem* table now requires authentication.

Next, you will update the app to authenticate users before requesting resources from your App Service.

##<a name="add-authentication"></a>Add authentication to the app

[AZURE.INCLUDE [mobile-windows-universal-dotnet-authenticate-app](../../includes/mobile-windows-universal-dotnet-authenticate-app.md)]


##<a name="tokens"></a>Store the authentication token on the client

The previous example showed a standard sign-in, which requires the client to contact both the identity provider and the App Service every time that the app starts. Not only is this method inefficient, you can run into usage-relates issues should many customers try to start you app at the same time. A better approach is to cache the authorization token returned by your App Service and try to use this first before using a provider-based sign-in.

>[AZURE.NOTE]You can cache the token issued by App Services regardless of whether you are using client-managed or service-managed authentication. This tutorial uses service-managed authentication.

[AZURE.INCLUDE [mobile-windows-universal-dotnet-authenticate-app-with-token](../../includes/mobile-windows-universal-dotnet-authenticate-app-with-token.md)]

##Next steps

Now that you completed this basic authentication tutorial, consider continuing on to one of the following tutorials:

+ [Add push notifications to your Windows app](app-service-mobile-windows-store-dotnet-get-started-push.md)
  Learn how to add push notifications support to your app and configure your Mobile App backend to use Azure Notification Hubs to send push notifications.

+ [Enable offline sync for your Windows app](app-service-mobile-windows-store-dotnet-get-started-offline-data.md)
  Learn how to add offline support your app using an Mobile App backend. Offline sync allows end-users to interact with a mobile app&mdash;viewing, adding, or modifying data&mdash;even when there is no network connection.


<!-- URLs. -->
[Get started with your mobile app]: app-service-mobile-windows-store-dotnet-get-started.md

