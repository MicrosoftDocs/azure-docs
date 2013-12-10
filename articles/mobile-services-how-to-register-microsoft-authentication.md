<properties linkid="develop-mobile-how-to-guides-register-for-microsoft-authentication" urlDisplayName="Register for Microsoft Authentication" pageTitle="Register for Microsoft authentication - Mobile Services" metaKeywords="Windows Azure registering application, Azure Microsoft authentication, application authenticate, authenticate mobile services" metaDescription="Learn how to register for Microsoft authentication in your Windows Azure Mobile Services application." metaCanonical="" disqusComments="0" umbracoNaviHide="1" />

# Register your apps to use a Microsoft Account login

This topic shows you how to register your apps to be able to use Live Connect as an authentication provider for Windows Azure Mobile Services. 

<div class="dev-callout"><b>Note</b>
<p>When you intend to also provide client-driven authentication for single sign-on (SSO) or push notifications from a Windows Store app, consider also registering your app with the Windows Store. For more information, see <a href="/en-us/develop/mobile/how-to-guides/register-for-single-sign-on">Register your Windows Store apps for Windows Live Connect authentication</a>.</p>
</div>

1. Navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkId=262039" target="_blank">My Applications</a> page in the Live Connect Developer Center, and log on with your Microsoft account, if required. 

2. Click **Create application**, then type an **Application name** and click **I accept**.

   ![][1] 

   This registers the application with Live Connect.

10. Click **Application settings page**, then **API Settings** and make a note of the values of the **Client ID** and **Client secret**. 

   ![][2]

    <div class="dev-callout"><b>Security Note</b>
	<p>The client secret is an important security credential. Do not share the client secret with anyone or distribute it with your app.</p>
    </div>

11. In **Redirect domain**, enter the URL of your mobile service, and then click **Save**.

You are now ready to use a Microsoft Account for authentication in your app by providing the client ID and client secret values to Mobile Services.

<!-- Anchors. -->

<!-- Images. -->
[1]: ./media/mobile-services-how-to-register-microsoft-authentication/mobile-services-live-connect-add-app.png
[2]: ./media/mobile-services-how-to-register-microsoft-authentication/mobile-live-connect-app-api-settings.png
<!-- URLs. -->
[Single sign-on for Windows Store apps by using Live Connect]: /en-us/develop/mobile/how-to-guides/register-for-single-sign-on/
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-dotnet/
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-dotnet/
[Authorize users with scripts]: /en-us/develop/mobile/tutorials/authorize-users-in-scripts-dotnet/
[JavaScript and HTML]: /en-us/develop/mobile/tutorials/get-started-with-users-js/

[Windows Azure Management Portal]: https://manage.windowsazure.com/
