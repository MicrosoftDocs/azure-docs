<properties urlDisplayName="Register for Google Authentication" pageTitle="Register for Google authentication - Mobile Services" metaKeywords="Azure registering application, Azure authentication, Google application authenticate, authenticate mobile services" description="Learn how to register your apps to use Google to authenticate with Azure Mobile Services." metaCanonical="" services="mobile-services" documentationCenter="Mobile" title="Register your apps for Google login with Mobile Services" authors="glenga" solutions="" manager="dwrede" editor="" />

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-multiple" ms.devlang="multiple" ms.topic="article" ms.date="11/21/2014" ms.author="glenga" />

# Register your apps for Google login with Mobile Services

This topic shows you how to register your apps to be able to use Google to authenticate with Azure Mobile Services.

>[AZURE.NOTE] This tutorial is about [Azure Mobile Services](http://azure.microsoft.com/en-us/services/mobile-services/), a solution to help you build scalable mobile applications for any platform. Mobile Services makes it easy to sync data, authenticate users, and send push notifications. This page supports the <a href="http://azure.microsoft.com/en-us/documentation/articles/mobile-services-ios-get-started-users/">Get Started with Authentication</a> tutorial which shows how to log users into your app. If this is your first experience with Mobile Services, please complete the tutorial <a href="http://azure.microsoft.com/en-us/documentation/articles/mobile-services-ios-get-started/">Get Started with Mobile Services</a>.

To complete the procedure in this topic, you must have a Google account that has a verified email address. To create a new Google account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkId=268302" target="_blank">accounts.google.com</a>.

1. Navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkId=268303" target="_blank">Google apis</a> website, sign-in with your Google account credentials, click **Create Project**, provide a **Project name**, then click **Create**.

   	![][1]

2. Click **API & Auth**, click **Credentials**, then click **Create new Client ID**.

   	![][2]

3. Select **Web application**, type your mobile service URL in **Authorized JavaScript Origins**, replace the generated URL in **Authorized Redirect URI** with the URL of your mobile service appended with the path _/login/google_, and then click **Create client ID**.

	>[AZURE.NOTE]For a .NET backend mobile service published to Azure by using Visual Studio, the redirect URL is the URL of your mobile service appended with the path _signin-google_ your mobile service as a .NET service, such as <code>https://todolist.azure-mobile.net/signin-google</code>. 

   	![][3]

6. Under **Client ID for web applications**, make a note of the values of **Client ID** and **Client secret**. 

   	![][4]

    <div class="dev-callout"><b>Security Note</b>
	<p>The client secret is an important security credential. Do not share this secret with anyone or distribute it with your app.</p>
    </div>

You are now ready to use a Google login for authentication in your app by providing the client ID and client secret values to Mobile Services.

<!-- Anchors. -->

<!-- Images. -->
[1]: ./media/mobile-services-how-to-register-google-authentication/mobile-services-google-new-project.png
[2]: ./media/mobile-services-how-to-register-google-authentication/mobile-services-google-create-client.png
[3]: ./media/mobile-services-how-to-register-google-authentication/mobile-services-google-create-client2.png
[4]: ./media/mobile-services-how-to-register-google-authentication/mobile-services-google-create-client3.png
[5]: ./media/mobile-services-how-to-register-google-authentication/mobile-services-google-app-details.png

<!-- URLs. -->

[Google apis]: http://go.microsoft.com/fwlink/p/?LinkId=268303
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-dotnet/

[Azure Management Portal]: https://manage.windowsazure.com/
