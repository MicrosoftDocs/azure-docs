<properties 
	pageTitle="Get Started with authentication for Mobile Apps in Windows" 
	description="Learn how to use Mobile Apps to authenticate users of your Windows app through a variety of identity providers, including AAD, Google, Facebook, Twitter, and Microsoft." 
	services="app-service\mobile" 
	documentationCenter="windows" 
	authors="mattchenderson,ggailey777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="app-service" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="09/23/2014" 
	ms.author="mahender"/>

# Add authentication to your Windows app

[AZURE.INCLUDE [app-service-mobile-selector-get-started-users](../includes/app-service-mobile-selector-get-started-users.md)]

This topic shows you how to authenticate users of an App Service Mobile App from your client application. In this tutorial, you add authentication to the quickstart project using an identity provider that is supported by App Service. After being successfully authenticated and authorized by your Mobile App, the user ID value is displayed.

This tutorial is based on the Mobile App quickstart. You must also first complete the tutorial [Get started with your mobile app]. 

##<a name="register"></a>Register your app for authentication and configure the App Service

[AZURE.INCLUDE [app-service-mobile-register-authentication](../includes/app-service-mobile-register-authentication.md)] 

##<a name="permissions"></a>Restrict permissions to authenticated users

[AZURE.INCLUDE [app-service-mobile-restrict-permissions-dotnet-backend](../includes/app-service-mobile-restrict-permissions-dotnet-backend.md)] 

<ol start="7">
<li>In Visual Studio, open your client app project and ensure that in App.xaml.cs, the instance of <b>MobileServiceClient</b> is configured to use the cloud URL to the Mobile App resource.</li> 
<li><p>Press the F5 key to run this quickstart-based app; verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts.</p>
   
   	<p>This happens because the app attempts to access your Mobile App Code as an unauthenticated user, but the <em>TodoItem</em> table now requires authentication.</p></li>
</ol>

Next, you will update the app to authenticate users before requesting resources from your App Service.

##<a name="add-authentication"></a>Add authentication to the app

[AZURE.INCLUDE [app-service-mobile-windows-universal-dotnet-authenticate-app](../includes/app-service-mobile-windows-universal-dotnet-authenticate-app.md)] 


[AZURE.NOTE] When you have registered your Windows Store app package information with App Services, you should call the <a href="http://go.microsoft.com/fwlink/p/?LinkId=311594" target="_blank">LoginAsync</a> method by supplying a value of <strong>true</strong> for the <em>useSingleSignOn</em> parameter. If you do not do this, your users will continue to be presented with a login prompt every time that the login method is called.


##<a name="tokens"></a>Store the authentication token on the client

[AZURE.INCLUDE [app-service-mobile-windows-store-dotnet-authenticate-app-with-token](../includes/app-service-mobile-windows-store-dotnet-authenticate-app-with-token.md)] 


<!-- Anchors. -->
[Register your app for authentication and configure the App Service]: #register
[Restrict table permissions to authenticated users]: #permissions
[Add authentication to the app]: #add-authentication
[Store authentication tokens on the client]: #tokens
[Next Steps]:#next-steps


<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with your mobile app]: app-service-mobile-dotnet-backend-windows-store-dotnet-get-started-preview.md


[Azure Management Portal]: https://manage.windowsazure.com/
[Mobile Services .NET How-to Conceptual Reference]: /en-us/develop/mobile/how-to-guides/work-with-net-client-library
[Register your Windows Store app package for Microsoft authentication]: mobile-services-how-to-register-store-app-package-microsoft-authentication.md
[Single sign-on for Windows Store apps by using Live Connect]: mobile-services-windows-store-dotnet-single-sign-on.md