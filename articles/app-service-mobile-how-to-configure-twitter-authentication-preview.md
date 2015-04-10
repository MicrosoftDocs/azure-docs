<properties 
	pageTitle="How to configure Twitter authentication for your App Services application"
	description="Learn how to configure Twitter authentication for your App Services application." 
	services="app-service\mobile" 
	documentationCenter="" 
	authors="mattchenderson,ggailey777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="app-service-mobile" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="02/19/2015" 
	ms.author="mahender"/>

# How to configure your application to use Twitter login

This topic shows you how to configure Azure App Services to use Twitter as an authentication provider. 

To complete the procedure in this topic, you must have a Twitter account that has a verified email address. To create a new Twitter account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkID=268287" target="_blank">twitter.com</a>.

## <a name="register"> </a>Register your application with Twitter

1. Navigate to the [Twitter Developers] website, sign-in with your Twitter account credentials, and click **Create New App**.

2. Type the **Name**, **Description**, and **Website** values for your app. Then, in in **Callback URL**, type the URL of your gateway appended with the path, _/signin-twitter_. For example, `https://contosogateway.azurewebsites.net/signin-twitter`. Make sure that you are using the HTTPS scheme.

    ![][0]

3.  At the bottom the page, read and accept the terms. Then click **Create your Twitter application**. This registers the app displays the application details.

4. Click the **Settings** tab, check **Allow this application to be used to sign in with Twitter**, then click **Update Settings**.

5. Select the **Keys and Access Tokens** tab. Make a note of the values of **Consumer Key (API Key)** and **Consumer secret (API Secret)**. 

    > [AZURE.NOTE] The consumer secret is an important security credential. Do not share this secret with anyone or distribute it with your app.


## <a name="secrets"> </a>Add Twitter information to your Mobile App

6. Log on to the [Azure Management Portal], and navigate to your App Service gateway.

7. Under **Settings**, choose **Identity**, and then select **Twitter**. Paste in the App ID and App Secret values which you obtained previously. Then click **Save**.

    ![][1]

You are now ready to use Twitter for authentication in your app.

## <a name="related-content"> </a>Related Content

[AZURE.INCLUDE [app-service-mobile-related-content-get-started-users](../includes/app-service-mobile-related-content-get-started-users.md)]



<!-- Images. -->

[0]: ./media/app-service-how-to-configure-twitter-authentication/app-service-twitter-redirect.png
[1]: ./media/app-service-how-to-configure-twitter-authentication/app-service-twitter-settings.png

<!-- URLs. -->

[Twitter Developers]: http://go.microsoft.com/fwlink/p/?LinkId=268300
[Azure Management Portal]: https://portal.azure.com/
[xamarin]: app-services-mobile-app-dotnet-backend-xamarin-ios-get-started-users-preview.md
