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
	ms.date="07/27/2015"
	ms.author="mahender"/>

# How to configure your application to use Microsoft Account login

[AZURE.INCLUDE [app-service-mobile-note-mobile-services-preview](../../includes/app-service-mobile-note-mobile-services-preview.md)]

This topic shows you how to configure Azure Mobile Apps to use Microsoft Account as an authentication provider.

## <a name="register"> </a>Register your application with Microsoft Account

1. Log on to the [Azure Management Portal], and navigate to your Mobile App.

2. Click **Settings**, **User authentication**, and then click **Microsoft Account**. Copy the **Redirect URL**. You will use this to configure a new app for your Microsoft Account.

3. Navigate to the [My Applications] page in the Microsoft Account Developer Center, and log on with your Microsoft account, if required.

4. Click **Create application**, then type an **Application name** and click **I accept**.

5. Click **API Settings**. Select **Yes** for **Mobile or desktop client app**. In the **Redirect URL** field, enter the **Redirect URL** you copied earlier. This is the Mobile App gateway appended with, _/signin-microsoft_. For example, `https://contosogateway.azurewebsites.net/signin-microsoft`. Make sure that you are using the HTTPS scheme. After entering the redirect URL, click **Save**.

	![][0]

	>[AZURE.NOTE]For an existing Microsoft Account app registration, you may have to first enable **Enhanced redirection security**.

4. Click **App Settings** and make a note of the values of the **Client ID** and **Client secret**.

    > [AZURE.NOTE] The client secret is an important security credential. Do not share the client secret with anyone or distribute it within a client application.


## <a name="secrets"> </a>Add Microsoft Account information to your Mobile App

1. Back in the [Azure Management Portal] on the Microsoft Account setting blade for your Mobile App, paste in the Client ID and Client Secret values which you obtained previously. Then click **Save**.

    ![][1]

You are now ready to use Microsoft Account for authentication in your app.

## <a name="related-content"> </a>Related Content

[AZURE.INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]

<!-- Authenticate your app with Live Connect Single Sign-On: [Windows](windows-liveconnect) -->



<!-- Images. -->

[0]: ./media/app-service-mobile-how-to-configure-microsoft-authentication-preview/app-service-microsoftaccount-redirect.png
[1]: ./media/app-service-mobile-how-to-configure-microsoft-authentication-preview/mobile-app-microsoftaccount-settings.png

<!-- URLs. -->

[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Azure Management Portal]: https://portal.azure.com/
 