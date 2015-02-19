<properties 
	pageTitle="How to configure Facebook authentication for your App Services application 
	description="Learn how to configure Facebook authentication for your App Services application." 
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

# How to configure your application to use Facebook login

This topic shows you how to configure Azure App Services to use Facebook as an authentication provider. 
	
To complete the procedure in this topic, you must have a Facebook account that has a verified email address and a mobile phone number. To create a new Facebook account, go to [facebook.com].

1. Navigate to the [Facebook Developers] website and sign-in with your Facebook account credentials.

2. (Optional) If you have not already registered, click **Apps** then click **Register as a Developer**, accept the policy and follow the registration steps. 

3. Click **Apps**, then click **Create a New App**.

4. Choose a unique name for your app, select **Apps for Pages**, click **Create App** and complete the challenge question. This registers the app with Facebook.

5. From the dashboard page for your application, click **Settings**, type the domain of your mobile service in **App Domains**. Also enter a **Contact Email**, then click **Add Platform** and select **Website**.

    ![][0]

6. Type the URL of your App Service gateway in **Site URL**, then click **Save Changes**.

7. Click **Show**, provide your password if requested, then make a note of the values of **App ID** and **App Secret**. 

	> [AZUTE.NOTE] **Security Note**
	The app secret is an important security credential. Do not share this secret with anyone or distribute it within a client application.


8. Click the **Advanced** tab and add your redirect URI to **Valid OAuth redirect URIs**. Then click **Save Changes**. Your redirect URI is the URL of your gateway appended with the path, _/signin-facebook_. For example, `https://contoso.azurewebsites.net/signin-facebook`.

9. The Facebook account, for which you defined the new app, is an administrator of the app and has access to the app as administrator. To authenticate other Facebook accounts, they need access to the app. This step grants the general public access so that the app can authenticate other Facebook accounts. Click **Status & Review**. Then click **Yes** to enable general public access.

10. Log on to the [Azure Management Portal], and navigate to your App Services gateway.

11. Click the **User authentication** part and select **Facebook**. Paste in the App ID and App Secret values which you obtained previously. Then click **Save**.

    ![][1]

You are now ready to use Facebook for authentication in your app.

## <a name="related-content"> </a>Related Content
Add Authentication to your Mobile App: [Xamarin.iOS](xamarin)

<!-- Anchors. -->

<!-- Images. -->
[0]: ./media/app-services-how-to-configure-facebook-authentication/app-services-facebook-dashboard.png
[1]: ./media/app-services-how-to-configure-facebook-authentication/app-services-facebook-app-configure.png

<!-- URLs. -->
[Facebook Developers]: http://go.microsoft.com/fwlink/p/?LinkId=268286
[facebook.com]: http://go.microsoft.com/fwlink/p/?LinkId=268285
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-dotnet/
[Azure Management Portal]: https://portal.azure.com/
[Azure Mobile Services]: http://azure.microsoft.com/en-us/services/mobile-services/
[xamarin]: /en-us/documentation/articles/app-services-mobile-app-dotnet-backend-xamarin-ios-get-started-users-preview/
