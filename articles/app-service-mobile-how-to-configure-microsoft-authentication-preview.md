<properties 
	pageTitle="How to configure Microsoft Account authentication for your App Services application"
	description="Learn how to configure Microsoft Account authentication for your App Services application." 
	authors="mattchenderson,ggailey777" 
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
	ms.date="02/19/2015" 
	ms.author="mahender"/>

# How to configure your application to use Microsoft Account login

This topic shows you how to configure Azure App Services to use Microsoft Account as an authentication provider. 

## <a name="register"> </a>Register your application with Microsoft Account

1. Navigate to the [My Applications] page in the Microsoft Account Developer Center, and log on with your Microsoft account, if required. 

2. Click **Create application**, then type an **Application name** and click **I accept**.

3. Click **API Settings**. Select **Yes** for **Mobile or desktop client app**. In the **Redirect URL** field, enter the URL of your gateway appended with the path, _/signin-microsoft_. For example, `https://contosogateway.azurewebsites.net/signin-microsoft`. Make sure that you are using the HTTPS scheme. After entering the redirect URL, click **Save**.

	![][0]

	>[AZURE.NOTE]For an existing Microsoft Account app registration, you may have to first enable **Enhanced redirection security**.

4. Click **App Settings** and make a note of the values of the **Client ID** and **Client secret**. 

    > [AZURE.NOTE] The client secret is an important security credential. Do not share the client secret with anyone or distribute it within a client application.


## <a name="secrets"> </a>Add Microsoft Account information to your Mobile App

5. Log on to the [Azure Management Portal], and navigate to your App Services gateway.

6. Under **Settings**, choose **Identity**, and then select **Microsoft Account**. Paste in the App ID and App Secret values which you obtained previously. Then click **Save**.

    ![][1]

You are now ready to use Microsoft Account for authentication in your app.

## <a name="related-content"> </a>Related Content

[AZURE.INCLUDE [app-service-mobile-related-content-get-started-users](../includes/app-service-mobile-related-content-get-started-users.md)]

<!-- Authenticate your app with Live Connect Single Sign-On: [Windows](windows-liveconnect) -->



<!-- Images. -->

[0]: ./media/app-service-how-to-configure-microsoft-authentication/app-service-microsoftaccount-redirect.png
[1]: ./media/app-service-how-to-configure-microsoft-authentication/app-service-microsoftaccount-settings.png

<!-- URLs. -->

[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Azure Management Portal]: https://portal.azure.com/