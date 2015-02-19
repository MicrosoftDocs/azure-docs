<properties 
	pageTitle="How to configure Microsoft Account authentication for your App Services application 
	description="Learn how to configure Microsoft Account authentication for your App Services application." 
	authors="mattchenderson,ggailey777" 
	services="app-services" 
	documentationCenter="" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="02/19/2015" 
	ms.author="mahender"/>

# How to configure your application to use Microsoft Account login

This topic shows you how to register your app to be able to use Live Connect as an authentication provider for Azure Mobile Services. 

>[AZURE.NOTE]To configure Microsoft Account authentication for a universal Windows app or to provide a single sign-on experience for a Windows Store app, see [Register your Windows Store app package for Microsoft authentication](/en-us/documentation/articles/mobile-services-how-to-register-store-app-package-microsoft-authentication).

1. Navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkId=262039" target="_blank">My Applications</a> page in the Live Connect Developer Center, and log on with your Microsoft account, if required. 

2. Click **Create application**, then type an **Application name** and click **I accept**.

   	![][1] 

   	This registers the application with Live Connect.

3. Click **API Settings**, supply a value of `https://<mobile_service>.azure-mobile.net/login/microsoftaccount` in **Redirect URL**, then click **Save**.

	>[AZURE.NOTE]For a .NET backend mobile service published to Azure by using Visual Studio, the redirect URL is the URL of your mobile service appended with the path _signin-microsoft_ your mobile service as a .NET service, such as <code>https://todolist.azure-mobile.net/signin-microsoft</code>.  

	![][3]

	This enables Microsoft Account authentication for your app.

	>[AZURE.NOTE]For an existing Live Connect app registration, you might have to first enable **Enhanced redirection security**.

4. Click **App Settings** and make a note of the values of the **Client ID** and **Client secret**. 

   	![][2]

    > [AZURE.NOTE] The client secret is an important security credential. Do not share the client secret with anyone or distribute it with your app.

You are now ready to use a Microsoft Account for authentication in your app by providing the client ID and client secret values to Mobile Services.

## <a name="related-content"> </a>Related Content
Add Authentication to your Mobile App: [Xamarin.iOS](xamarin)

<!-- Anchors. -->

<!-- Images. -->
[1]: ./media/app-services-how-to-configure-microsoft-authentication/app-services-live-connect-add-app.png
[2]: ./media/app-services-how-to-configure-microsoft-authentication/app-services-win8-app-push-auth.png
[3]: ./media/app-services-how-to-configure-microsoft-authentication/app-services-win8-app-push-auth-2.png

<!-- URLs. -->

[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039

[Azure Management Portal]: https://portal.azure.com/
[xamarin]: /en-us/documentation/articles/app-services-mobile-app-dotnet-backend-xamarin-ios-get-started-users-preview/
