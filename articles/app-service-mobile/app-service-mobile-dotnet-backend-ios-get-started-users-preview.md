<properties
	pageTitle="Add Authentication on iOS with Azure Mobile Apps"
	description="Learn how to use Azure Mobile Apps to authenticate users of your iOS app through a variety of identity providers, including AAD, Google, Facebook, Twitter, and Microsoft."
	services="app-service\mobile"
	documentationCenter="ios"
	authors="krisragh" 
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-ios"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="08/12/2015"
	ms.author="krisragh"/>

# iOS authentication with Azure Mobile Apps

[AZURE.INCLUDE [app-service-mobile-selector-get-started-users](../../includes/app-service-mobile-selector-get-started-users.md)]

[AZURE.INCLUDE [app-service-mobile-note-mobile-services-preview](../../includes/app-service-mobile-note-mobile-services-preview.md)]

In this tutorial, you add authentication to the [iOS quick start] project using a supported identity provider. This tutorial is based on the [iOS quick start] tutorial, which you must complete first.

##<a name="review"></a>Review your server project configuration (optional)

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-enable-auth-preview](../../includes/app-service-mobile-dotnet-backend-enable-auth-preview.md)] 

##<a name="create-gateway"></a>Create an App Service Gateway

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-gateway-preview](../../includes/app-service-mobile-dotnet-backend-create-gateway-preview.md)] 

##<a name="register"></a>Register your app for authentication and configure the App Service

[AZURE.INCLUDE [app-service-mobile-register-authentication](../../includes/app-service-mobile-register-authentication.md)]

##<a name="permissions"></a>Restrict permissions to authenticated users

[AZURE.INCLUDE [app-service-mobile-restrict-permissions-dotnet-backend](../../includes/app-service-mobile-restrict-permissions-dotnet-backend.md)]

In Xcode, press **Run** to  start the app. An exception will be raised because the app attempts to access the backend as an unauthenticated user, but _TodoItem_ table now requires authentication.

##<a name="add-authentication"></a>Add authentication to app

[AZURE.INCLUDE [app-service-mobile-ios-authenticate-app](../../includes/app-service-mobile-ios-authenticate-app.md)]


<!-- URLs. -->

[iOS quick start]: app-service-mobile-dotnet-backend-ios-get-started-preview.md

[Azure Management Portal]: https://portal.azure.com
 
