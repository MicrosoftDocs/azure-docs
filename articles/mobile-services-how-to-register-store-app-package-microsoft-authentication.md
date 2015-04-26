<properties 
	pageTitle="Register your Windows Store app package for Microsoft authentication" 
	description="Learn how to register your Windows Store app for Microsoft authentication in your Azure Mobile Services application" 
	services="mobile-services" 
	documentationCenter="" 
	authors="ggailey777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="04/13/2015" 
	ms.author="glenga"/>

# Register your Windows Store app package for Microsoft authentication

Azure Mobile Services supports both client-driven and server-driven authentication methods. Server-driven authentication uses identity providers, including Microsoft Account. When you use a Microsoft Account with server-driven authentication without registering your app with Mobile Services, users are prompted to supply credentials every time that the authentication is requested. When you register your app, the Microsoft Account login credentials are cached and can be used for authentication without the user being prompted to supply them again. This topic shows you how to register your Windows Store app package for an improved Microsoft Account login experience when using Azure Mobile Services for authentication. 

>[AZURE.NOTE]Visual Studio 2013 makes it easy to register your Windows Store app package with Mobile Services. For more information, see <a href="http://go.microsoft.com/fwlink/p/?LinkId=309101">Quickstart: Adding push notifications for a mobile service</a> in the Windows Dev Center.

Client-managed authentication can be used to provide a single sign-on experience on a Windows device by using Live Connect. If you use Live Connect APIs, you do not need to complete the steps in this topic. For more information, see [Authenticate your Windows Store app with Live Connect single sign-on].   

[AZURE.INCLUDE [mobile-services-register-windows-store-app](../includes/mobile-services-register-windows-store-app.md)]

After you have registered your app package, remember to supply a value of <strong>true</strong> for the <em>useSingleSignOn</em> when you call the <a href="http://go.microsoft.com/fwlink/p/?LinkId=311594" target="_blank">LoginAsync</a> method. This provides your users with the improved login experience when using a Microsoft Account.

<!-- Anchors. -->
<!-- Images. -->


<!-- URLs. -->
[Get started with push notifications]: /develop/mobile/tutorials/get-started-with-push-dotnet/
[Authenticate your Windows Store app with Live Connect single sign-on]: /develop/mobile/tutorials/single-sign-on-windows-8-dotnet
[Get started with users C#]: /develop/mobile/tutorials/get-started-with-users-dotnet/
[Get started with users JavaScript]: /develop/mobile/tutorials/get-started-with-users-js/
