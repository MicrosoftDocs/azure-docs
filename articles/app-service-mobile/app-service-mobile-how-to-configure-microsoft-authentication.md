<properties
	pageTitle="How to configure Microsoft Account authentication for your App Services application"
	description="Learn how to configure Microsoft Account authentication for your App Services application."
	authors="mattchenderson"
	services="app-service"
	documentationCenter=""
	manager="erikre"
	editor=""/>

<tags
	ms.service="app-service"
	ms.workload="mobile"
	ms.tgt_pltfrm="na"
	ms.devlang="multiple"
	ms.topic="article"
	ms.date="02/24/2016"
	ms.author="mahender"/>

# How to configure your App Service application to use Microsoft Account login

[AZURE.INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

This topic shows you how to configure Azure App Service to use Microsoft Account as an authentication provider. 

## <a name="register-windows-dev-center"> </a>Register your Windows app at the Windows Dev Center

Universal Windows apps and Windows store apps must be registered through the Windows Dev Center. This enables you to more more easily configure push notifications for your app in the future.  

>[AZURE.NOTE]Skip this section for Windows Phone 8, Windows Phone 8.1 Silverlight, and all other non-Windows apps. If you have already configured push notifications for your Windows app, you can also skip this section.

1. Log on to the [Azure portal], and navigate to your application. Copy your **URL**. You will use this to configure your app with Microsoft Account.

2. If you have not already registered your app, navigate to the [Windows Dev Center](https://dev.windows.com/dashboard/Application/New), log on with your Microsoft account, type a name for your app, verify its availability, then click **Reserve app name**.

3. Open your Windows app project in Visual Studio, then in Solution Explorer right-click the Windows Store app project, click **Store** > **Associate App with the Store...**.

  	![](./media/app-service-mobile-how-to-configure-microsoft-authentication/mobile-app-windows-store-association.png)

4. In the wizard, click **Sign in** and sign-in with your Microsoft account, select the app name you reserved, then click **Next** > **Associate**.  
For a universal Windows 8.1 app, you must repeat steps 4 and 5 for the Windows Phone Store project.

6. Back in the Windows Dev Center page for your new app, click **Services** > **Push notifications**.

7. In the **Push notifications** page, click **Live Services site** under **Windows Push Notification Services (WNS) and Microsoft Azure Mobile Services**.

Next, you will configure Microsoft account authentication for your Windows app.


## <a name="register-microsoft-account"> </a>Register your app with Microsoft Account

If you have already registered your Windows app in the previous section, you can skip to step 4. 

1. Log on to the [Azure portal], and navigate to your application. Copy your **URL**. You will use this to configure your app with Microsoft Account.

2. Navigate to the [My Applications] page in the Microsoft Account Developer Center, and log on with your Microsoft account, if required.

3. Click **Create application**, then type an **Application name** and click **I accept**.

4. Click **API Settings**, select **Yes** for **Mobile or desktop client app**, supply the **Redirect URL** for your application, then click **Save**. 
 
	![][0]

	>[AZURE.NOTE]Your redirect URI is the URL of your application appended with the path, _/.auth/login/microsoftaccount/callback_. For example, `https://contoso.azurewebsites.net/.auth/login/microsoftaccount/callback`.   
	>Make sure that you are using the HTTPS scheme.

6. Click **App Settings** and make a note of the values of the **Client ID** and **Client secret**.

    > [AZURE.IMPORTANT] The client secret is an important security credential. Do not share the client secret with anyone or distribute it within a client application.

## <a name="secrets"> </a>Add Microsoft Account information to your App Service application

1. Back in the [Azure portal], navigate to your application, click **Settings** > **Authentication / Authorization**.

2. If the Authentication / Authorization feature is not enabled, switch it **On**.

3. Click **Microsoft Account**. Paste in the App ID and App Secret values which you obtained previously, and optionally enable any scopes your application requires. Then click **OK**.

    ![][1]

	By default, App Service provides authentication but does not restrict authorized access to your site content and APIs. You must authorize users in your app code.

4. (Optional) To restrict access to your site to only users authenticated by Microsoft account, set **Action to take when request is not authenticated** to **Microsoft Account**. This requires that all requests be authenticated, and all unauthenticated requests are redirected to Microsoft account for authentication.

5. Click **Save**.

You are now ready to use Microsoft Account for authentication in your app.

## <a name="related-content"> </a>Related content

[AZURE.INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]

<!-- Authenticate your app with Live Connect Single Sign-On: [Windows](windows-liveconnect) -->



<!-- Images. -->

[0]: ./media/app-service-mobile-how-to-configure-microsoft-authentication/app-service-microsoftaccount-redirect.png
[1]: ./media/app-service-mobile-how-to-configure-microsoft-authentication/mobile-app-microsoftaccount-settings.png

<!-- URLs. -->

[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Azure portal]: https://portal.azure.com/
