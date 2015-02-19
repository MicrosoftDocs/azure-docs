<properties 
	pageTitle="How to configure Twitter authentication for your App Services application 
	description="Learn how to configure Twitter authentication for your App Services application." 
	services="app-services" 
	documentationCenter="" 
	authors="mattchenderson,ggailey777" 
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

# How to configure your application to use Twitter login

This topic shows you how to configure Azure App Services to use Twitter as an authentication provider. 

To complete the procedure in this topic, you must have a Twitter account that has a verified email address. To create a new Twitter account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkID=268287" target="_blank">twitter.com</a>.

1. Navigate to the [Twitter Developers] website, sign-in with your Twitter account credentials, and click **Create a new application**.

2. Type the **Name**, **Description**, and **Website** values for your app. Then, in in **Callback URL**, type the URL of your gateway appended with the path, _/signin-facebook_. For example, `https://contoso.azurewebsites.net/signin-facebook`.

    ![][0]

3.  At the bottom the page, read and accept the terms, type the correct CAPTCHA words, and then click **Create your Twitter application**. This registers the app displays the application details.

4. Make a note of the values of **Consumer key** and **Consumer secret**. 

    > [AZURE.NOTE] The consumer secret is an important security credential. Do not share this secret with anyone or distribute it with your app.

5. Click the **Settings** tab, scroll down and check **Allow this application to be used to sign in with Twitter**, then click **Update this Twitter application's settings**.

6. Log on to the [Azure Management Portal], and navigate to your App Services gateway.

7. Click the **User authentication** part and select **Facebook**. Paste in the App ID and App Secret values which you obtained previously. Then click **Save**.

    ![][1]

You are now ready to use Facebook for authentication in your app.

## <a name="related-content"> </a>Related Content

Add Authentication to your Mobile App: [Xamarin.iOS](xamarin)

<!-- Anchors. -->

<!-- Images. -->

[0]: ./media/app-services-how-to-configure-twitter-authentication/app-services-twitter-redirect.png
[1]: ./media/app-services-how-to-configure-twitter-authentication/app-services-twitter-app-configure.png

<!-- URLs. -->

[Twitter Developers]: http://go.microsoft.com/fwlink/p/?LinkId=268300
[Azure Management Portal]: https://portal.azure.com/
[xamarin]: /en-us/documentation/articles/app-services-mobile-app-dotnet-backend-xamarin-ios-get-started-users-preview/
