<properties
	pageTitle="Add Authentication on iOS with Azure Mobile Apps"
	description="Learn how to use Azure Mobile Apps to authenticate users of your iOS app through a variety of identity providers, including AAD, Google, Facebook, Twitter, and Microsoft."
	services="app-service\mobile"
	documentationCenter="ios"
	authors="krisragh"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-ios"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="06/28/2016"
	ms.author="krisragh"/>

# Add authentication to your iOS app

[AZURE.INCLUDE [app-service-mobile-selector-get-started-users](../../includes/app-service-mobile-selector-get-started-users.md)]

In this tutorial, you add authentication to the [iOS quick start] project using a supported identity provider. This tutorial is based on the [iOS quick start] tutorial, which you must complete first.

##<a name="register"></a>Register your app for authentication and configure the App Service

[AZURE.INCLUDE [app-service-mobile-register-authentication](../../includes/app-service-mobile-register-authentication.md)]

##<a name="permissions"></a>Restrict permissions to authenticated users

[AZURE.INCLUDE [app-service-mobile-restrict-permissions-dotnet-backend](../../includes/app-service-mobile-restrict-permissions-dotnet-backend.md)]

In Xcode, press **Run** to  start the app. An exception will be raised because the app attempts to access the backend as an unauthenticated user, but _TodoItem_ table now requires authentication.

##<a name="add-authentication"></a>Add authentication to app

[AZURE.INCLUDE [app-service-mobile-ios-authenticate-app](../../includes/app-service-mobile-ios-authenticate-app.md)]


<!-- URLs. -->

[iOS quick start]: app-service-mobile-ios-get-started.md

[Azure portal]: https://portal.azure.com
