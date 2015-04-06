<properties 
	pageTitle="How to configure Google authentication for your App Services application"
	description="Learn how to configure Google authentication for your App Services application." 
    services="app-service\mobile" 
	documentationCenter="" 
	authors="mattchenderson,ggailey777" 
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

# How to configure your application to use Google login

This topic shows you how to configure Azure App Services to use Google as an authentication provider. 

To complete the procedure in this topic, you must have a Google account that has a verified email address. To create a new Google account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkId=268302" target="_blank">accounts.google.com</a>.

## <a name="register"> </a>Register your application with Google

1. Navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkId=268303" target="_blank">Google apis</a> website, sign-in with your Google account credentials, click **Create Project**, provide a **Project name**, then click **Create**.

2. In the left navigation bar, click **API & Auth**. Then click **Consent screen**. Select your **Email Address**, and enter a **Product Name**. Then click **Save**. 

3. Also under **API & Auth** select **APIs** and enable the **Google+ API**.

4. Once more under **API & Auth**, select **Credentials**, and then **Create new Client ID**.

5. Select **Web application**. Type your App Services gateway URL in **Authorized JavaScript Origins**, and then replace the generated URL in **Authorized Redirect URI** with the URL of your gateway appended with the path, _/signin-google_. For example, `https://contoso.azurewebsites.net/signin-google`. Make sure that you are using the HTTPS scheme. Then click **Create client ID**.

     ![][0]

6. On the next screen, under **Client ID for web applications**, make a note of the values of **Client ID** and **Client secret**. 

    > [AZURE.IMPORTANT] The client secret is an important security credential. Do not share this secret with anyone or distribute it within a client application.


## <a name="secrets"> </a>Add Google information to your Mobile App

7. Log on to the [Azure Management Portal], and navigate to your App Services gateway.

8. Under **Settings**, choose **Identity**, and then select **Google**. Paste in the Client ID and Client secret values which you obtained previously. Then click **Save**.

     ![][1]


You are now ready to use Google for authentication in your app.

## <a name="related-content"> </a>Related Content

[AZURE.INCLUDE [app-service-mobile-related-content-get-started-users](../includes/app-service-mobile-related-content-get-started-users.md)]


<!-- Anchors. -->

<!-- Images. -->

[0]: ./media/app-service-how-to-configure-google-authentication/app-service-google-redirect.png
[1]: ./media/app-service-how-to-configure-google-authentication/app-service-google-settings.png

<!-- URLs. -->

[Google apis]: http://go.microsoft.com/fwlink/p/?LinkId=268303

[Azure Management Portal]: https://portal.azure.com/
