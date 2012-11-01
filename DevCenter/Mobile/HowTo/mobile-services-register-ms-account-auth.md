<properties linkid="register-ms-account-auth" urldisplayname="Mobile Services" headerexpose="" pagetitle="Register your apps for Microsoft Live Connect authentication with Mobile Services" metakeywords="Microsoft Account, mobile devices, Windows Azure, mobile, authentication" footerexpose="" metadescription="Windows Live Connect registration steps for Mobile Services using Windows Azure Mobile Services in your Windows Store apps." umbraconavihide="0" disquscomments="1"></properties>

<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="14798" ismacro="true" umb_chunkname="MobileArticleLeft" umb_chunkpath="devcenter/Menu" umb_macroalias="AzureChunkDisplayer" umb_hide="0" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

# Register your Windows Store apps to use a Microsoft Account login

This topic shows you how to register your apps to be able to use Live Connect as an authentication provider for Windows Azure Mobile Services. 

<div class="dev-callout"><b>Note</b>
<p>When you intend to also provide single sign-on or push notifications from a Windows Store app, consider also registering your app with the Windows Store. For more information, see <a href="/en-us/develop/mobile/how-to-guides/register-for-single-sign-on">Register your Windows Store apps for Windows Live Connect authentication</a>.</p>
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

11. In **Redirect domain**, enter the URL of your mobile service from Step 8, and then click **Save**.

You are now ready to use a Microsoft Account for authentication in your app by providing the client ID and client secret values to Mobile Services.

<!-- Anchors. -->

<!-- Images. -->
[1]: ../Media/mobile-services-live-connect-add-app.png
[2]: ../Media/mobile-live-connect-app-api-settings.png
<!-- URLs. -->
[Single sign-on for Windows Store apps by using Live Connect]: ./mobile-services-register-for-single-sign-in.md
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Get started with Mobile Services]: ./mobile-services-get-started.md
[Get started with authentication]: ./mobile-services-get-started-with-users-dotnet.md
[Get started with push notifications]: ./mobile-services-get-started-with-push-dotnet.md
[Authorize users with scripts]: ./mobile-services-authorize-users-dotnet.md
[JavaScript and HTML]: ./mobile-services-get-started-with-users-js.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/