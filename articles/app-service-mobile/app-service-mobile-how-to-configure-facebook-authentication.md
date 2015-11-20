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
	ms.date="11/20/2015"
	ms.author="mahender"/>

# How to configure your App Service application to use Facebook login

[AZURE.INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]
&nbsp;

[AZURE.INCLUDE [app-service-mobile-note-mobile-services](../../includes/app-service-mobile-note-mobile-services.md)]

This topic shows you how to configure Azure App Service to use Facebook as an authentication provider.

To complete the procedure in this topic, you must have a Facebook account that has a verified email address and a mobile phone number. To create a new Facebook account, go to [facebook.com].

> [AZURE.NOTE]
This topic demonstrates use of the App Service Authentication / Authorization feature. This replaces the App Service gateway for most applications. Differences that apply to using the gateway are called out in notes throughout the topic.


## <a name="register"> </a>Register your application with Facebook

1. Log on to the [Azure Management Portal], and navigate to your application. Copy your **URL**. You will use this to configure your Facebook app.
 
2. In another browser window, navigate to the [Facebook Developers] website and sign-in with your Facebook account credentials.

3. (Optional) If you have not already registered, click **Apps** then click **Register as a Developer**, accept the policy and follow the registration steps.

4. Click **My Apps**, then click **Add a New App**.

5. Select **Website** as your platform. Choose a unique name for your app, and then click **Create New Facebook App ID**.

6. Pick a category for your application from the dropdown. Then click **Create App ID**.

7. On the next page, select **Skip Quick Start** in the top right. This will take you to the developer dashboard for your application.

8. On the **App Secret** field, click **Show**, provide your password if requested, then make a note of the values of **App ID** and **App Secret**. You will configure your application to use these later.

	> [AZURE.NOTE] **Security Note**
	The app secret is an important security credential. Do not share this secret with anyone or distribute it within a client application.

9. On the left navigation bar, click **Settings**. Type the **URL** of your Mobile App in **App Domains**, and enter a **Contact Email**. 

    ![][0]

10. If you don't see a website section below, click **Add Platform** and select **Website**. Enter the **URL** of your Mobile App in the **Site URL** field, then click **Save Changes**.

11. Click the **Advanced** tab and add your application's **Redirect URI** to **Valid OAuth redirect URIs**. Then click **Save Changes**. Your redirect URI is the URL of your application appended with the path, _/.auth/login/facebook/callback_. For example, `https://contoso.azurewebsites.net/.auth/login/facebook/callback`. Make sure that you are using the HTTPS scheme.


	> [AZURE.NOTE]
	If you are using the App Service Gateway instead of the App Service Authentication / Authorization feature, your redirect URL instead uses the gateway URL with the _/signin-facebook_ path.


12. The Facebook account which was used to register the application is an administrator of the app. At this point, only administrators can sign into this application. To authenticate other Facebook accounts, click **Status & Review** in the left navigation bar. Then click **Yes** to enable general public access.


## <a name="secrets"> </a>Add Facebook information to your application


	> [AZURE.NOTE]
	If using the App Service Gateway, ignore this section and instead navigate to your gateway in the portal. Select **Settings**, **Identity**, and then **Facebook**. Paste in the values you obtained earlier and click **Save**.


13. Back in the [Azure Management Portal], navigate to your application. Click **Settings**, and then **Authentication / Authorization**.

14. If the Authentication / Authorization feature is not enabled, turn the switch to **On**.

15. Click **Facebook**. Paste in the App ID and App Secret values which you obtained previously, and optionally enable any scopes your application requires. Then click **OK**.

    ![][1]
	
16. By default, App Service provides login but does not restrict access to your site content and APIs - this is the responsibility of your app code. If you wish to have the site completely protected by Facebook login, change the **Action to take when request is not authenticated** dropdown to use the **Facebook** option. This will require all requests to be authenticated; unauthenticated requests will be redirected to log in with Facebook.

17. Click **Save**. 


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