<properties
	pageTitle="How to configure Microsoft Account authentication for your App Services application"
	description="Learn how to configure Microsoft Account authentication for your App Services application."
	authors="mattchenderson" 
	services="app-service\mobile"
	documentationCenter=""
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

# How to configure your App Service application to use Microsoft Account login

[AZURE.INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]
&nbsp;

[AZURE.INCLUDE [app-service-mobile-note-mobile-services](../../includes/app-service-mobile-note-mobile-services.md)]

This topic shows you how to configure Azure App Service to use Microsoft Account as an authentication provider.


> [AZURE.NOTE]
This topic demonstrates use of the App Service Authentication / Authorization feature. This replaces the App Service gateway for most applications. Differences that apply to using the gateway are called out in notes throughout the topic.


## <a name="register"> </a>Register your application with Microsoft Account

1. Log on to the [Azure portal], and navigate to your application. Copy your **URL**. You will use this to configure your Microsoft Account app.

2. Navigate to the [My Applications] page in the Microsoft Account Developer Center, and log on with your Microsoft account, if required.

4. Click **Create application**, then type an **Application name** and click **I accept**.

5. Click **API Settings**. Select **Yes** for **Mobile or desktop client app**. In the **Redirect URL** field, enter your application's **Redirect URL** and click **Save**. Your redirect URI is the URL of your application appended with the path, _/.auth/login/microsoftaccount/callback_. For example, `https://contoso.azurewebsites.net/.auth/login/microsoftaccount/callback`. Make sure that you are using the HTTPS scheme.

	![][0]


	> [AZURE.NOTE]
	If you are using the App Service Gateway instead of the App Service Authentication / Authorization feature, your redirect URL instead uses the gateway URL with the _/signin-microsoft_ path.


6. Click **App Settings** and make a note of the values of the **Client ID** and **Client secret**.


    > [AZURE.NOTE] The client secret is an important security credential. Do not share the client secret with anyone or distribute it within a client application.
	

## <a name="secrets"> </a>Add Microsoft Account information to your application

> [AZURE.NOTE]
If using the App Service Gateway, ignore this section and instead navigate to your gateway in the portal. Select **Settings**, **Identity**, and then **Microsoft Account**. Paste in the values you obtained earlier and click **Save**.


7. Back in the [Azure portal], navigate to your application. Click **Settings**, and then **Authentication / Authorization**.

8. If the Authentication / Authorization feature is not enabled, turn the switch to **On**.

9. Click **Microsoft Account**. Paste in the App ID and App Secret values which you obtained previously, and optionally enable any scopes your application requires. Then click **OK**.

    ![][1]
	
	By default, App Service provides authentication but does not restrict authorized access to your site content and APIs. You must authorize users in your app code. 

17. (Optional) To restrict access to your site to only users authenticated by Microsoft account, set **Action to take when request is not authenticated** to **Microsoft Account**. This requires that all requests be authenticated, and all unauthenticated requests are redirected to Microsoft account for authentication.

11. Click **Save**. 


You are now ready to use Microsoft Account for authentication in your app.

## <a name="related-content"> </a>Related Content

[AZURE.INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]

<!-- Authenticate your app with Live Connect Single Sign-On: [Windows](windows-liveconnect) -->



<!-- Images. -->

[0]: ./media/app-service-mobile-how-to-configure-microsoft-authentication/app-service-microsoftaccount-redirect.png
[1]: ./media/app-service-mobile-how-to-configure-microsoft-authentication/mobile-app-microsoftaccount-settings.png

<!-- URLs. -->

[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Azure portal]: https://portal.azure.com/
