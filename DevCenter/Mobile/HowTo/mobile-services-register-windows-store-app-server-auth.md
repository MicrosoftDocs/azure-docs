<properties linkid="register-windows-store-app-server-auth" urlDisplayName="Register your Windows Store app package for improved Microsoft authentication" pageTitle="Register your Windows Store app package for improved Microsoft Account login with Mobile Services" writer="glenga" metaKeywords="Windows Azure registering application, Azure Microsoft authentication, application authenticate, single sign-in, authenticate mobile services" metaDescription="Learn how to register your Windows Store app for Microsoft authentication in your Windows Azure Mobile Services application." metaCanonical="" disqusComments="0" umbracoNaviHide="1" />

<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="14798" ismacro="true" umb_chunkname="MobileArticleLeft" umb_chunkpath="devcenter/Menu" umb_macroalias="AzureChunkDisplayer" umb_hide="0" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

# Register your Windows Store app package for Microsoft authentication

Windows Azure Mobile Services supports both client-driven and server-driven authentication methods. Server-driven authentication uses identity providers, including Microsoft Account. When you use a Microsoft Account with server-driven authentication without registering your app with Mobile Services, users are prompted to supply credentials every time that the authentication is requested. When you register your app, the Microsoft Account login credentials are cached and can be used for authentication without the user being prompted to supply them again. This topic shows you how to register your Windows Store app package for an improved Microsoft Account login experience when using Windows Azure Mobile Services for authentication. 

Client-driven authentication can be used to provide a single sign-on experience on a Windows device by using Live Connect. If you use Live Connect APIs, you do not need to complete the steps in this topic. For more information, see [Authenticate your Windows Store app with Live Connect single sign-on].   

Registering your app also enables you to send push notifications to your app. If you have already completed the tutorial [Get started with push notifications] for your app, you have already completed the steps in this topic.

<div class="dev-callout"><b>Note</b>
	<p><em>Visual Studio 2013 Preview</em> includes new features that make it easy to register your Windows Store app package with Mobile Services. For more information, see <a href="http://go.microsoft.com/fwlink/p/?LinkId=309101">Quickstart: Adding push notifications for a mobile service</a> in the Windows Dev Center.</p>
</div>

<div chunk="../chunks/mobile-services-register-windows-store-app.md" />

Now that you have registered your app package, you can return to complete the **Get started with authentication** ([C#][Get started with users C#]/[JavaScript][Get started with users JavaScript]) tutorial, using the Microsoft Account identity provider. Remember to supply a value of <strong>true</strong> for the <em>useSingleSignOn</em> when you call the <a href="http://go.microsoft.com/fwlink/p/?LinkId=311594" target="_blank">LoginAsync</a> method. This provides your users with the improved login experience when using a Microsoft Account.

<!-- Anchors. -->
<!-- Images. -->
[1]: ../Media/mobile-services-live-connect-add-app.png
[2]: ../Media/mobile-live-connect-app-api-settings.png
<!-- URLs. -->
[Get started with push notifications]: ../Tutorials/mobile-services-get-started-with-push-dotnet.md
[Authenticate your Windows Store app with Live Connect single sign-on]: ../Tutorials/mobile-services-single-sign-on-win8-dotnet.md
[Get started with users C#]: ../HowTo/mobile-services-get-started-with-users-dotnet.md
[Get started with users JavaScript]: ../HowTo/mobile-services-get-started-with-users-js.md