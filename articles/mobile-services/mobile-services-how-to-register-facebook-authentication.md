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
	ms.date="07/21/2016"
	ms.author="glenga"/>

# Register your apps for Facebook authentication with Mobile Services

[AZURE.INCLUDE [mobile-services-selector-register-identity-provider](../../includes/mobile-services-selector-register-identity-provider.md)]
&nbsp;


[AZURE.INCLUDE [mobile-service-note-mobile-apps](../../includes/mobile-services-note-mobile-apps.md)]

This topic shows you how to register your apps to be able to use Facebook to authenticate with Azure Mobile Services. This page supports the [Get Started with Authentication](mobile-services-ios-get-started-users.md) tutorial which shows how to log users into your app. If this is your first experience with Mobile Services, please complete the tutorial [Get Started with Mobile Services](mobile-services-ios-get-started.md).

To complete the procedure in this topic, you must have a Facebook account that has a verified email address and a mobile phone number. To create a new Facebook account, go to [facebook.com](http://go.microsoft.com/fwlink/p/?LinkId=268285).

1. Navigate to the [Facebook Developers](http://go.microsoft.com/fwlink/p/?LinkId=268285) website and sign-in with your Facebook account credentials.

2. (Optional) If you have not already registered, click **My Apps** then click **Register as a Developer**, accept the policy and follow the registration steps.

3. Click **My Apps** > **Add a New App** > **Website** > **Skip and Create App ID**. 

4. In **Display Name**, enter a unique name for your app, choose a **Category** for you app, then click **Create App ID** and complete the security check. This takes you to the developer dashboard for your new Facebook app.

5. On the **App Secret** field, click **Show**, provide your password if requested, then make a note of the values of **App ID** and **App Secret**. You will uses these later to configure your application in Azure.

	> [AZURE.NOTE] **Security Note**
	The app secret is an important security credential. Do not share this secret with anyone or distribute it within a client application.

5. In the left navigation bar, click **Settings**, type the domain of your mobile service in **App Domains**, enter an optional **Contact Email**, click **Add Platform** and select **Website**.

   	![][3]

6. Type the URL of your mobile service in **Site URL**, then click **Save Changes**.

7. Click **Show**, provide your password if requested, then make a note of the values of **App ID** and **App Secret**.

   	![][5]
	&nbsp;

    >[AZURE.IMPORTANT] The app secret is an important security credential. Do not share this secret with anyone or distribute it with your app.
	&nbsp;

8. Click the **Advanced** tab, type one of the following URL formats in **Valid OAuth redirect URIs**, then click **Save Changes**:

	+ **.NET backend**: `https://<mobile_service>.azure-mobile.net/signin-facebook`
	+ **JavaScript backend**: `https://<mobile_service>.azure-mobile.net/login/facebook`

	 >[AZURE.NOTE]Make sure that you use the correct redirect URL path format for your type of Mobile Services backend, using the *HTTPS* scheme. When this is incorrect, authentication will not succeed.


12. The Facebook account which was used to register the application is an administrator of the app. At this point, only administrators can sign into this application. To authenticate other Facebook accounts, click **App Review** and enable **Make todolist-complete-nodejs public** to enable general public access using Facebook authentication.

You are now ready to use a Facebook login for authentication in your app by providing the App ID and App Secret values to Mobile Services.

<!-- Anchors. -->

<!-- Images. -->
[3]: ./media/mobile-services-how-to-register-facebook-authentication/mobile-services-facebook-configure-app.png
[5]: ./media/mobile-services-how-to-register-facebook-authentication/mobile-services-facebook-completed.png

<!-- URLs. -->
[Facebook Developers]: http://go.microsoft.com/fwlink/p/?LinkId=268286
[Get started with authentication]: /develop/mobile/tutorials/get-started-with-users-dotnet/
[Azure Mobile Services]: http://azure.microsoft.com/services/mobile-services/
