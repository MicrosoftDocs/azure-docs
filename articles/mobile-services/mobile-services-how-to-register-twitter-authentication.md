<properties
	pageTitle="Register for Twitter authentication | Microsoft Azure"
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
	ms.date="07/21/2016" 
	ms.author="glenga"/>

#Register your apps for Twitter login with Mobile Services

[AZURE.INCLUDE [mobile-service-note-mobile-apps](../../includes/mobile-services-note-mobile-apps.md)]

&nbsp;


[AZURE.INCLUDE [mobile-services-selector-register-identity-provider](../../includes/mobile-services-selector-register-identity-provider.md)]

This topic shows you how to register your apps to be able to use Twitter to authenticate with Azure Mobile Services.

>[AZURE.NOTE] This tutorial is about [Azure Mobile Services](https://azure.microsoft.com/services/mobile-services/), a solution to help you build scalable mobile applications for any platform. Mobile Services makes it easy to sync data, authenticate users, and send push notifications. This page supports the [Add authentication to your app](mobile-services-ios-get-started-users.md) tutorial which shows how to sign users into your app. If this is your first experience with Mobile Services, please complete the tutorial [Get Started with Mobile Services](mobile-services-ios-get-started.md).

To complete the procedure in this topic, you must have a Twitter account that has a verified email address. To create a new Twitter account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkID=268287" target="_blank">twitter.com</a>.

1. Navigate to the [Twitter Developers](http://go.microsoft.com/fwlink/p/?LinkId=268300) website, sign-in with your Twitter account credentials, and click **Create new app**.

2. Type the **Name**, **Description**, and **Website** values for your app, then type one of the following URL formats in **Callback URL**.

	+ **.NET backend**: `https://<mobile_service>.azure-mobile.net/signin-twitter`
	+ **JavaScript backend**: `https://<mobile_service>.azure-mobile.net/login/twitter`

	 >[AZURE.NOTE]Make sure that you use the correct redirect URL path format for your type of Mobile Services backend. When this is incorrect, authentication will not succeed.
	&nbsp;

   	![][2]

3.  At the bottom the page, read and accept the terms, and then click **Create your Twitter application**.

   	This registers the app displays the application details.

6. Click the **Keys and Access Tokens** tab in your app dashboard and make a note of the values of **Consumer key** and **Consumer secret**.

    > [AZURE.NOTE] The consumer secret is an important security credential. Do not share this secret with anyone or distribute it with your app.

7. Click the **Settings** tab, scroll down and make sure the **Allow this application to be used to sign in with Twitter** checkbox is checked, then click **Update Settings**.

You are now ready to use a Twitter login for authentication in your app by providing the consumer key and consumer secret values to Mobile Services.

<!-- Anchors. -->

<!-- Images. -->
[1]: ./media/mobile-services-how-to-register-twitter-authentication/mobile-services-twitter-developers.png
[2]: ./media/mobile-services-how-to-register-twitter-authentication/mobile-services-twitter-register-app1.png

<!-- URLs. -->

[Twitter Developers]: http://go.microsoft.com/fwlink/p/?LinkId=268300
[Get started with authentication]: /develop/mobile/tutorials/get-started-with-users-dotnet/
