<properties 
	pageTitle="Register for Twitter authentication - Mobile Services" 
	description="Learn how to use Twitter authentication with your Azure Mobile Services application." 
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

#Register your apps for Twitter login with Mobile Services

This topic shows you how to register your apps to be able to use Twitter to authenticate with Azure Mobile Services.

>[AZURE.NOTE] This tutorial is about [Azure Mobile Services](http://azure.microsoft.com/services/mobile-services/), a solution to help you build scalable mobile applications for any platform. Mobile Services makes it easy to sync data, authenticate users, and send push notifications. This page supports the <a href="http://azure.microsoft.com/documentation/articles/mobile-services-ios-get-started-users/">Get Started with Authentication</a> tutorial which shows how to log users into your app. If this is your first experience with Mobile Services, please complete the tutorial <a href="http://azure.microsoft.com/documentation/articles/mobile-services-ios-get-started/">Get Started with Mobile Services</a>.

To complete the procedure in this topic, you must have a Twitter account that has a verified email address. To create a new Twitter account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkID=268287" target="_blank">twitter.com</a>.

1. Navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkId=268300" target="_blank">Twitter Developers</a> website, sign-in with your Twitter account credentials, and click **Create a new application**.

   	![][1]

2. Type the **Name**, **Description**, and **Website** values for your app, then type the URL of your mobile service appended with the path _/login/twitter_ in **Callback URL**.

	>[AZURE.NOTE]For a .NET backend mobile service published to Azure by using Visual Studio, the redirect URL is the URL of your mobile service appended with the path _signin-twitter_ your mobile service as a .NET service, such as <code>https://todolist.azure-mobile.net/signin-twitter</code>.

   	![][2]

3.  At the bottom the page, read and accept the terms, type the correct CAPTCHA words, and then click **Create your Twitter application**. 

   	![][3]

   	This registers the app displays the application details.

6. Make a note of the values of **Consumer key** and **Consumer secret**. 

   	![][4]

    > [AZURE.NOTE] The consumer secret is an important security credential. Do not share this secret with anyone or distribute it with your app.

7. Click the **Settings** tab, scroll down and check **Allow this application to be used to sign in with Twitter**, then click **Update this Twitter application's settings**.

	![][5]

You are now ready to use a Twitter login for authentication in your app by providing the consumer key and consumer secret values to Mobile Services.

<!-- Anchors. -->

<!-- Images. -->
[1]: ./media/mobile-services-how-to-register-twitter-authentication/mobile-services-twitter-developers.png
[2]: ./media/mobile-services-how-to-register-twitter-authentication/mobile-services-twitter-register-app1.png
[3]: ./media/mobile-services-how-to-register-twitter-authentication/mobile-services-twitter-register-app2.png
[4]: ./media/mobile-services-how-to-register-twitter-authentication/mobile-services-twitter-app-details.png
[5]: ./media/mobile-services-how-to-register-twitter-authentication/mobile-services-twitter-register-settings.png

<!-- URLs. -->

[Twitter Developers]: http://go.microsoft.com/fwlink/p/?LinkId=268300
[Get started with authentication]: /develop/mobile/tutorials/get-started-with-users-dotnet/

[Azure Management Portal]: https://manage.windowsazure.com/
