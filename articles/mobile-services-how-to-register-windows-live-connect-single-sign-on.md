<properties 
	pageTitle="Register for single sign-on - Azure Mobile Services" 
	description="Learn how to register for single sign-on authentication in your Azure Mobile Services application." 
	services="mobile-services" 
	documentationCenter="" 
	authors="ggailey777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-multiple" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="11/21/2014" 
	ms.author="glenga"/>

# Register your Windows Store apps to use Windows Live Connect single sign-on

This topic shows you how to register your app with the Windows Store to be able to use Live Connect for single sign-on as the identity provider for Azure Mobile Services. This step is also required to use push notifications.

> [AZURE.IMPORTANT] You do not need to register your app with the Windows Store to be able to use Microsoft Account for authentication before you publish your app. When your Windows Store app does not require single sign-on or push notifications, you can just register your app with Live Connect to use a Microsoft Account login.  For more information, see [Register your Windows Store apps to use a Microsoft Account login](/en-us/develop/mobile/how-to-guides/register-for-microsoft-authentication).

1. If you have not already registered your app, navigate to the [Submit an app page] at the Dev Center for Windows Store apps, log on with your Microsoft Account, and then click **App name**.

   	![][0]

2. Type a name for your app in **App name**, click **Reserve app name**, and then click **Save**.

   	![][1]

   	This creates a new Windows Store registration for your app.

3. In Visual Studio 2012 Express for Windows 8, open the project that you created when you completed the tutorial [Get started with Mobile Services].

4. In solution explorer, right-click the project, click **Store**, and then click **Associate App with the Store...**. 

  	![][2]

   	This displays the **Associate Your App with the Windows Store** Wizard.

5. In the wizard, click **Sign in** and then login with your Microsoft account.

6. Select the app that you registered in step 2, click **Next**, and then click **Associate**.

   	![][3]

   	This adds the required Windows Store registration information to the application manifest.    

9. Navigate to the [My Applications] page in the Live Connect Developer Center and click on your app in the **My applications** list.

   	![][6] 

10. Click **Edit settings**, then **API Settings** and make a note of the value of **Client secret**. 

   	![][7]

    > [AZURE.NOTE] The client secret is an important security credential. Do not share the client secret with anyone or distribute it with your app.

11. In **Redirect domain**, enter the URL of your mobile service from Step 8, and then click **Save**.

You are now ready to integrate authentication by using Live Connect into your app. Mobile Services provides the following two methods for authenticating users by using Live Connect:

   - Single sign-on for Windows Store apps. In this method, users only need to authorize authentication in your application one time by using Live Connect, and then credentials are managed by Windows, based on user preferences. For more information see, [Single sign-on for Windows Store apps by using Live Connect].

   - Basic authentication. This method, which supports a variety of authentication providers, requires users to log-in every time your app starts. For more information, see [Get started with authentication].

<!-- Anchors. -->

<!-- Images. -->
[0]: ./media/mobile-services-how-to-register-windows-live-connect-single-sign-on/mobile-services-submit-win8-app.png
[1]: ./media/mobile-services-how-to-register-windows-live-connect-single-sign-on/mobile-services-win8-app-name.png
[2]: ./media/mobile-services-how-to-register-windows-live-connect-single-sign-on/mobile-services-store-association.png
[3]: ./media/mobile-services-how-to-register-windows-live-connect-single-sign-on/mobile-services-select-app-name.png


[6]: ./media/mobile-services-how-to-register-windows-live-connect-single-sign-on/mobile-live-connect-apps-list.png
[7]: ./media/mobile-services-how-to-register-windows-live-connect-single-sign-on/mobile-live-connect-app-api-settings.png



<!-- URLs. -->
[Single sign-on for Windows Store apps by using Live Connect]: /en-us/develop/mobile/tutorials/single-sign-on-windows-8-dotnet
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-dotnet
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-dotnet/
[Authorize users with scripts]: /en-us/develop/mobile/tutorials/authorize-users-in-scripts-dotnet/
[JavaScript and HTML]: /en-us/develop/mobile/tutorials/get-started-with-users-js/
[Azure Management Portal]: https://manage.windowsazure.com/
