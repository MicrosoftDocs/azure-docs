<properties 
	pageTitle="Register for Facebook authentication - Mobile Services" 
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
	ms.date="04/13/2015" 
	ms.author="glenga"/>

# Register your apps for Facebook authentication with Mobile Services

This topic shows you how to register your apps to be able to use Facebook to authenticate with Azure Mobile Services. 

> [AZURE.NOTE] This tutorial is about [Azure Mobile Services], a solution to help you build scalable mobile applications for any platform. Mobile Services makes it easy to sync data, authenticate users, and send push notifications. This page supports the <a href="http://azure.microsoft.com/documentation/articles/mobile-services-ios-get-started-users/">Get Started with Authentication</a> tutorial which shows how to log users into your app. If this is your first experience with Mobile Services, please complete the tutorial <a href="http://azure.microsoft.com/documentation/articles/mobile-services-ios-get-started/">Get Started with Mobile Services</a>.
	
To complete the procedure in this topic, you must have a Facebook account that has a verified email address and a mobile phone number. To create a new Facebook account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkId=268285" target="_blank">facebook.com</a>.

1. Navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkId=268286" target="_blank">Facebook Developers</a> website and sign-in with your Facebook account credentials.

2. (Optional) If you have not already registered, click **Apps** then click **Register as a Developer**, accept the policy and follow the registration steps. 

   	![][0]

3. Click **Apps**, then click **Create a New App**.

   	![][1]

4. Choose a unique name for your app, select **Apps for Pages**, click **Create App** and complete the challenge question.

   	![][2]

	This registers the app with Facebook 

5. Click **Settings**, type the domain of your mobile service in **App Domains**. Also enter a **Contact Email**, then click **Add Platform** and select **Website**.

   	![][3]

6. Type the URL of your mobile service in **Site URL**, then click **Save Changes**.

	![][4]

7. Click **Show**, provide your password if requested, then make a note of the values of **App ID** and **App Secret**. 

   	![][5]

	> [AZURE.NOTE] **Security Note**
	The app secret is an important security credential. Do not share this secret with anyone or distribute it with your app.


8. Click the **Advanced** tab, type the URL of your mobile service appended with the path _/login/facebook_ in **Valid OAuth redirect URIs**, then click **Save Changes**. 

	> [AZURE.NOTE] For a .NET backend mobile service published to Azure by using Visual Studio, the redirect URL is the URL of your mobile service appended with the path _signin-facebook_ your mobile service as a .NET service, such as <code>https://todolist.azure-mobile.net/signin-facebook</code>.  
	
	![][7]

9. The Facebook account, for which you defined the new app, is an administrator of the app and has access to the app as administrator. To authenticate other Facebook accounts, they need access to the app. This step grants the general public access so that the app can authenticate other Facebook accounts. Click **Status & Review**. Then click **Yes** to enable general public access.

    ![][6]



You are now ready to use a Facebook login for authentication in your app by providing the App ID and App Secret values to Mobile Services.  

<!-- Anchors. -->

<!-- Images. -->
[0]: ./media/mobile-services-how-to-register-facebook-authentication/mobile-services-facebook-developer-register.png
[1]: ./media/mobile-services-how-to-register-facebook-authentication/mobile-services-facebook-add-app.png
[2]: ./media/mobile-services-how-to-register-facebook-authentication/mobile-services-facebook-new-app-dialog.png
[3]: ./media/mobile-services-how-to-register-facebook-authentication/mobile-services-facebook-configure-app.png
[4]: ./media/mobile-services-how-to-register-facebook-authentication/mobile-services-facebook-configure-app-2.png
[5]: ./media/mobile-services-how-to-register-facebook-authentication/mobile-services-facebook-completed.png
[6]: ./media/mobile-services-how-to-register-facebook-authentication/mobile-services-facebook-configure-app-general-public.png
[7]: ./media/mobile-services-how-to-register-facebook-authentication/mobile-services-facebook-configure-app-3.png

<!-- URLs. -->
[Facebook Developers]: http://go.microsoft.com/fwlink/p/?LinkId=268286
[Get started with authentication]: /develop/mobile/tutorials/get-started-with-users-dotnet/
[Azure Management Portal]: https://manage.windowsazure.com/
[Azure Mobile Services]: http://azure.microsoft.com/services/mobile-services/
