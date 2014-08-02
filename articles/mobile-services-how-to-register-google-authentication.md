<properties linkid="develop-mobile-how-to-guides-register-for-google-authentication" urlDisplayName="Register for Google Authentication" pageTitle="Register for Google authentication - Mobile Services" metaKeywords="Azure registering application, Azure authentication, Google application authenticate, authenticate mobile services" description="Learn how to register your apps to use Google to authenticate with Azure Mobile Services." metaCanonical="" services="mobile-services" documentationCenter="Mobile" title="Register your apps for Google login with Mobile Services" authors="glenga" solutions="" manager="" editor="" />

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-multiple" ms.devlang="multiple" ms.topic="article" ms.date="01/01/1900" ms.author="glenga" />

# Register your apps for Google login with Mobile Services

This topic shows you how to register your apps to be able to use Google to authenticate with Azure Mobile Services.

<div class="dev-callout"><b>Note</b>
<p>To complete the procedure in this topic, you must have a Google account that has a verified email address. To create a new Google account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkId=268302" target="_blank">accounts.google.com</a>.</p>
</div> 

1. Navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkId=268303" target="_blank">Google apis</a> web site, sign-in with your Google account credentials, click **Create Project**, provide a **Project name**, then click **Create**.

   	![][1]

2. Click **API & Auth**, click **Credentials**, then click **Create new Client ID**.

   	![][2]

3. Select **Web application**, type your mobile service URL in **Authorized JavaScript Origins**, replace the generated URL in **Authorized Redirect URI** with the URL of your mobile service appended with the path _/login/google_, and then click **Create client ID**.

	>[WACOM.NOTE]For a .NET backend mobile service published to Azure by using Visual Studio, the redirect URL is the URL of your mobile service appended with the path _signin-google_ your mobile service as a .NET service, such as <code>https://todolist.azure-mobile.net/signin-google</code>. 

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
