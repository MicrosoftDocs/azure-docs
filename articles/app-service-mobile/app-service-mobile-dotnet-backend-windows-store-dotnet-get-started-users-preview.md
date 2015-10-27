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
	ms.date="08/22/2015"
	ms.author="glenga"/>

# Add authentication to your Windows app

[AZURE.INCLUDE [app-service-mobile-selector-get-started-users](../../includes/app-service-mobile-selector-get-started-users.md)]
&nbsp;  
[AZURE.INCLUDE [app-service-mobile-note-mobile-services-preview](../../includes/app-service-mobile-note-mobile-services-preview.md)]

This topic shows you how to authenticate users of an App Service Mobile App from your client application. In this tutorial, you add authentication to the quickstart project using an identity provider that is supported by App Service. After being successfully authenticated and authorized by your Mobile App, the user ID value is displayed.

This tutorial is based on the Mobile App quickstart. You must first complete the tutorial [Get started with your mobile app]. http://acom-sandbox.azurewebsites.net/documentation/articles/app-service-mobile-dotnet-backend-windows-store-dotnet-get-started-push-preview/?rnd=1

##<a name="create-gateway"></a>Create an App Service Gateway

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-gateway-preview](../../includes/app-service-mobile-dotnet-backend-create-gateway-preview.md)] 

##<a name="register"></a>Register your app for authentication and configure the App Service

[AZURE.INCLUDE [app-service-mobile-register-authentication](../../includes/app-service-mobile-register-authentication.md)]

##<a name="permissions"></a>Restrict permissions to authenticated users

[AZURE.INCLUDE [app-service-mobile-restrict-permissions-dotnet-backend](../../includes/app-service-mobile-restrict-permissions-dotnet-backend.md)]

&nbsp;&nbsp;4. In Visual Studio, open the shared App.xaml.cs project file in your client app project and make sure that the **MobileServiceClient** instance is configured to use both the URL of the Mobile App backend and the Gateway.

&nbsp;&nbsp;5. With one of the Windows app projects set as the start-up project, press the F5 key to run the app; verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts.

&nbsp;&nbsp;This happens because the app attempts to access your Mobile App Code as an unauthenticated user, but the *TodoItem* table now requires authentication.

Next, you will update the app to authenticate users before requesting resources from your App Service.

##<a name="add-authentication"></a>Add authentication to the app

[AZURE.INCLUDE [app-service-mobile-windows-universal-dotnet-authenticate-app](../../includes/app-service-mobile-windows-universal-dotnet-authenticate-app.md)]


##<a name="tokens"></a>Store the authentication token on the client

[AZURE.INCLUDE [app-service-mobile-windows-store-dotnet-authenticate-app-with-token](../../includes/app-service-mobile-windows-store-dotnet-authenticate-app-with-token.md)]

##Next Steps


<!-- URLs. -->
[Get started with your mobile app]: app-service-mobile-dotnet-backend-windows-store-dotnet-get-started-preview.md
 
