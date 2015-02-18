<properties
	pageTitle="Add Authentication to Existing Azure Mobile Services App (iOS) | Mobile Dev Center"
	description="Learn how to use Mobile Services to authenticate users of your iOS app through a variety of identity providers, including Google, Facebook, Twitter, and Microsoft."
	services="mobile-services"
	documentationCenter="ios"
	authors="krisragh"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm=""
	ms.devlang="objective-c"
	ms.topic="article"
	ms.date="2/16/2015"
	ms.author="krisragh"/>

# Add Authentication to Existing Azure Mobile Services app

[AZURE.INCLUDE [mobile-services-selector-get-started-users](../includes/mobile-services-selector-get-started-users.md)]

In this tutorial, you add authentication to the Quick Start project using a supported identity provider. This tutorial is based on the [Mobile Services Quick Start tutorial], which you must complete first.

##<a name="register"></a>Register app for authentication and configure Mobile Services

[AZURE.INCLUDE [mobile-services-register-authentication](../includes/mobile-services-register-authentication.md)]

[AZURE.INCLUDE [mobile-services-dotnet-backend-aad-server-extension](../includes/mobile-services-dotnet-backend-aad-server-extension.md)]

##<a name="permissions"></a>Restrict permissions to authenticated users

[AZURE.INCLUDE [mobile-services-restrict-permissions-dotnet-backend](../includes/mobile-services-restrict-permissions-dotnet-backend.md)]

In Xcode, open the project. Press the **Run** button to  start the app. Verify that an exception with a status code of 401 (Unauthorized) is raised after the app starts. This happens because the app attempts to access Mobile Services as an unauthenticated user, but the _TodoItem_ table now requires authentication.

##<a name="add-authentication"></a>Add authentication to app

[AZURE.INCLUDE [mobile-services-ios-authenticate-app](../includes/mobile-services-ios-authenticate-app.md)]

##<a name="store-authentication"></a>Store authentication tokens in app

[AZURE.INCLUDE [mobile-services-ios-authenticate-app-with-token](../includes/mobile-services-ios-authenticate-app-with-token.md)]

##<a name="next-steps"></a>Next steps

In the next tutorial, [Service-side authorization of Mobile Services users], you will take the user ID value provided by Mobile Services based on an authenticated user and use it to filter the data returned by Mobile Services.

<!-- Anchors. -->
[Register your app for authentication and configure Mobile Services]: #register
[Restrict table permissions to authenticated users]: #permissions
[Add authentication to the app]: #add-authentication
[Next Steps]:#next-steps
[Storing authentication tokens in your app]:#store-authentication

<!-- URLs. -->
[Service-side authorization of Mobile Services users]: /en-us/documentation/articles/mobile-services-dotnet-backend-service-side-authorization/
[Mobile Services Quick Start tutorial]: /en-us/documentation/articles/mobile-services-dotnet-backend-ios-get-started/
[Get started with data]: /en-us/documentation/articles/mobile-services-dotnet-backend-ios-get-started-data/
[Get started with authentication]: /en-us/documentation/articles/mobile-services-dotnet-backend-ios-get-started-users/
[Get started with push notifications]: /en-us/documentation/articles/mobile-services-dotnet-backend-ios-get-started-push/
[Authorize users with scripts]: /en-us/documentation/articles/mobile-services-dotnet-backend-ios-authorize-users-in-scripts

[Azure Management Portal]: https://manage.windowsazure.com/
[Mobile Services .NET How-to Conceptual Reference]: /en-us/develop/mobile/how-to-guides/work-with-net-client-library
[Register your Windows Store app package for Microsoft authentication]: /en-us/documentation/articles/mobile-services-how-to-register-store-app-package-microsoft-authentication
