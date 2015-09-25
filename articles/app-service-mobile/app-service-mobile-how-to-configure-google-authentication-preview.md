<properties
	pageTitle="How to configure Google authentication for your App Services application"
	description="Learn how to configure Google authentication for your App Services application."
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
	ms.date="08/28/2015"
	ms.author="mahender"/>

# How to configure your application to use Google login

[AZURE.INCLUDE [app-service-mobile-note-mobile-services-preview](../../includes/app-service-mobile-note-mobile-services-preview.md)]

This topic shows you how to configure Mobile Apps to use Google as an authentication provider.

To complete the procedure in this topic, you must have a Google account that has a verified email address. To create a new Google account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkId=268302" target="_blank">accounts.google.com</a>.

1. Log on to the [Azure Management Portal], and navigate to your Mobile App. Copy your **URL**. You will use this later with your Google app.
 
2. Click **Settings**, **User authentication**, and then click **Google**. Copy the **Redirect URI**. You will use this to configure your Google app.

3. Navigate to the [Google apis](http://go.microsoft.com/fwlink/p/?LinkId=268303) website, sign-in with your Google account credentials, click **Create Project**, provide a **Project name**, then click **Create**.

4. In the left navigation bar, click **API & Auth**, then under **Social APIs** click **Google+ API** > **Enable API**.

5. Click **API & Auth** > **Credentials** > **OAuth consent screen**, then select your **Email address**,  enter a **Product Name**, and click **Save**.

6. In the **Credentials** tab, click **Add credentials** > **OAuth 2.0 client ID**, then select **Web application**.

7. Paste the Mobile Apps **URL** you copied earlier into **Authorized JavaScript Origins**, then paste the **Redirect URI** you copied earlier into **Authorized Redirect URI**. The redirect URI is the Mobile App gateway appended with the path, _/signin-google_. For example, `https://contosogateway.azurewebsites.net/signin-google`. Make sure that you are using the HTTPS scheme. Then click **Create**.

8. On the next screen, make a note of the values of the client ID and client secret.

    > [AZURE.IMPORTANT] The client secret is an important security credential. Do not share this secret with anyone or distribute it within a client application.

9. Back in the [Azure Management Portal], on the Google settings blade for your Mobile App, paste in the Client ID and Client secret values which you obtained previously. Then click **Save**.

     ![][1]

You are now ready to use Google for authentication in your app.

## <a name="related-content"> </a>Related Content

[AZURE.INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]


<!-- Anchors. -->

<!-- Images. -->

[0]: ./media/app-service-mobile-how-to-configure-google-authentication-preview/mobile-app-google-redirect.png
[1]: ./media/app-service-mobile-how-to-configure-google-authentication-preview/mobile-app-google-settings.png

<!-- URLs. -->

[Google apis]: http://go.microsoft.com/fwlink/p/?LinkId=268303

[Azure Management Portal]: https://portal.azure.com/
 
