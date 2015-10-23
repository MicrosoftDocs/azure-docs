<properties 
	pageTitle="Register for Facebook authentication | Azure Mobile Services" 
	description="Learn how to use Facebook authentication in your Azure Mobile Services app." 
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
	ms.date="09/25/2015" 
	ms.author="glenga"/>

# Register your apps for Facebook authentication with Mobile Services

[AZURE.INCLUDE [mobile-services-selector-register-identity-provider](../../includes/mobile-services-selector-register-identity-provider.md)]

This topic shows you how to register your apps to be able to use Facebook to authenticate with Azure Mobile Services. 

>[AZURE.NOTE] This tutorial is about [Azure Mobile Services], a solution to help you build scalable mobile applications for any platform. Mobile Services makes it easy to sync data, authenticate users, and send push notifications. This page supports the [Get Started with Authentication](mobile-services-ios-get-started-users.md) tutorial which shows how to log users into your app. If this is your first experience with Mobile Services, please complete the tutorial [Get Started with Mobile Services](mobile-services-ios-get-started.md).
	
To complete the procedure in this topic, you must have a Facebook account that has a verified email address and a mobile phone number. To create a new Facebook account, go to [facebook.com](http://go.microsoft.com/fwlink/p/?LinkId=268285).

1. Navigate to the [Facebook Developers](http://go.microsoft.com/fwlink/p/?LinkId=268285) website and sign-in with your Facebook account credentials.

2. (Optional) If you have not already registered, click **My Apps** then click **Register as a Developer**, accept the policy and follow the registration steps. 

3. Click **My Apps** > **Add a New App** > **Advanced setup**.

4. Type a unique **Display name** for your app, choose **Apps for Pages** under **Category**, then click **Create App ID** and complete the security exercise. 

	This creates a new Facebook app ID.

5. Click **Settings**, type the domain of your mobile service in **App Domains**, enter an optional **Contact Email**, click **Add Platform** and select **Website**.

   	![][3]

6. Type the URL of your mobile service in **Site URL**, then click **Save Changes**.

7. Click **Show**, provide your password if requested, then make a note of the values of **App ID** and **App Secret**. 

   	![][5]
	&nbsp;
	
    >[AZURE.IMPORTANT] The app secret is an important security credential. Do not share this secret with anyone or distribute it with your app.
	&nbsp;

8. Click the **Advanced** tab, type the URL of your mobile service appended with the path _/login/facebook_ in **Valid OAuth redirect URIs**, then click **Save Changes**. 
	&nbsp;

     >[AZURE.NOTE] For a .NET backend mobile service published to Azure by using Visual Studio, the redirect URL is the URL of your mobile service appended with the path _signin-facebook_ your mobile service as a .NET service, such as `https://todolist.azure-mobile.net/signin-facebook`.  
       

9. Click **Status & Review** > **Yes** to enable general public access to your app.

	The Facebook account you used to register the new app is an administrator of the app and has access to the app as administrator. This step grants the general public access so that the app can authenticate by using other Facebook accounts. 


You are now ready to use a Facebook login for authentication in your app by providing the App ID and App Secret values to Mobile Services.  

<!-- Anchors. -->

<!-- Images. -->
[3]: ./media/mobile-services-how-to-register-facebook-authentication/mobile-services-facebook-configure-app.png
[5]: ./media/mobile-services-how-to-register-facebook-authentication/mobile-services-facebook-completed.png

<!-- URLs. -->
[Facebook Developers]: http://go.microsoft.com/fwlink/p/?LinkId=268286
[Get started with authentication]: /develop/mobile/tutorials/get-started-with-users-dotnet/
[Azure Management Portal]: https://manage.windowsazure.com/
[Azure Mobile Services]: http://azure.microsoft.com/services/mobile-services/
 