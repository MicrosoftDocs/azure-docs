<properties
	pageTitle="How to configure Facebook authentication for your App Services application"
	description="Learn how to configure Facebook authentication for your App Services application."
	services="app-service\mobile"
	documentationCenter=""
	authors="mattchenderson" 
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="na"
	ms.devlang="multiple"
	ms.topic="article"
	ms.date="10/29/2015"
	ms.author="mahender"/>

# How to configure your application to use Facebook login

[AZURE.INCLUDE [app-service-mobile-note-mobile-services](../../includes/app-service-mobile-note-mobile-services.md)]

This topic shows you how to configure Azure Mobile Apps to use Facebook as an authentication provider.

To complete the procedure in this topic, you must have a Facebook account that has a verified email address and a mobile phone number. To create a new Facebook account, go to [facebook.com].

## <a name="register"> </a>Register your application with Facebook

1. Log on to the [Azure Management Portal], and navigate to your Mobile App. Copy your **URL**. You will use this to configure your Facebook app.
 
2. Click **Settings**, **Mobile authentication**, and then **Facebook**. Then copy the **Redirect URI** from the Facebook blade. You will use this with your Facebook app.
 
3. In another browser window, navigate to the [Facebook Developers] website and sign-in with your Facebook account credentials.

4. (Optional) If you have not already registered, click **Apps** then click **Register as a Developer**, accept the policy and follow the registration steps.

5. Click **My Apps**, then click **Add a New App**.

6. Select **Website** as your platform. Choose a unique name for your app, and then click **Create New Facebook App ID**.

7. Pick a category for your application from the dropdown. Then click **Create App ID**.

8. On the next page, select **Skip Quick Start** in the top right. This will take you to the developer dashboard for your application.

9. On the **App Secret** field, click **Show**, provide your password if requested, then make a note of the values of **App ID** and **App Secret**. You will set these on your Mobile App's Facebook authentication settings blade.

	> [AZURE.NOTE] **Security Note**
	The app secret is an important security credential. Do not share this secret with anyone or distribute it within a client application.

10. On the left navigation bar, click **Settings**. Type the **URL** of your Mobile App in **App Domains**, and enter a **Contact Email**. 

    ![][0]

11. If you don't see a website section below, click **Add Platform** and select **Website**. Enter the **URL** of your Mobile App in the **Site URL** field, then click **Save Changes**.

12. Click the **Advanced** tab and add your Mobile App **Redirect URI** that you copied earlier to **Valid OAuth redirect URIs**. Then click **Save Changes**. Your redirect URI is the URL of your Mobile App gateway appended with the path, _/signin-facebook_. For example, `https://contosogateway.azurewebsites.net/signin-facebook`. Make sure that you are using the HTTPS scheme.

13. The Facebook account which was used to register the application is an administrator of the app. At this point, only administrators can sign into this application. To authenticate other Facebook accounts, click **Status & Review** in the left navigation bar. Then click **Yes** to enable general public access.


## <a name="secrets"> </a>Add Facebook information to your Mobile App


12. Back in the [Azure Management Portal], and navigate to the Facebook setting blade for your Mobile App again. Paste in the App ID and App Secret values which you obtained previously. Then click **Save**.

    ![][1]

You are now ready to use Facebook for authentication in your app.

## <a name="related-content"> </a>Related Content

[AZURE.INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]

<!-- Images. -->
[0]: ./media/app-service-mobile-how-to-configure-facebook-authentication/app-service-facebook-dashboard.png
[1]: ./media/app-service-mobile-how-to-configure-facebook-authentication/mobile-app-facebook-settings.png

<!-- URLs. -->
[Facebook Developers]: http://go.microsoft.com/fwlink/p/?LinkId=268286
[facebook.com]: http://go.microsoft.com/fwlink/p/?LinkId=268285
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-dotnet/
[Azure Management Portal]: https://portal.azure.com/