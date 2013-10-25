<properties linkid="develop-mobile-how-to-guides-register-for-microsoft-waad-authentication" urlDisplayName="Register for Windows Azure Active Directory Authentication" pageTitle="Register for Windows Azure Active Directory authentication - Mobile Services" metaKeywords="Windows Azure registering application, Windows Azure Active Directory authentication, application authenticate, authenticate mobile services" metaDescription="Learn how to register for Windows Azure Active Directory authentication in your Windows Azure Mobile Services application." metaCanonical="" disqusComments="0" umbracoNaviHide="1" />



<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="14798" ismacro="true" umb_chunkname="MobileArticleLeft" umb_chunkpath="devcenter/Menu" umb_macroalias="AzureChunkDisplayer" umb_hide="0" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

# Register your apps to use a Windows Azure Active Directory Account login

This topic shows you how to register your apps to be able to use Windows Azure Active Directory as an authentication provider for Windows Azure Mobile Services. 

<div class="dev-callout"><b>Note</b>
<p>When you intend to also provide client-driven authentication for single sign-on (SSO) or push notifications from a Windows Store app, consider also registering your app with the Windows Store. For more information, see <a href="/en-us/develop/mobile/how-to-guides/register-for-single-sign-on">Register your Windows Store apps for Windows Live Connect authentication</a>.</p>
</div>

1. Log into the [Windows Azure Management Portal]. 

2. Navigate to **Active Directory** in the management portal, then click your directory.

   ![][1] 

3. Click on the **Applications** tab, then click **Add an App**. 

   ![][2]


4. Follow the directions in the new application wizard choosing **Web Application And/Or Web API** for the XXX. Enable Single Sign On. When prompted for the **App URL**, paste the mobile services application URL.


5. *** MORE TO COME ***


You are now ready to use a Windows Azure Active Directory for authentication in your app by providing the client ID and client secret values to Mobile Services.

<!-- Anchors. -->

<!-- Images. -->
[1]: ../Media/mobile-services-live-connect-add-app.png
[2]: ../Media/mobile-live-connect-app-api-settings.png

<!-- URLs. -->
[Windows Azure Management Portal]: https://manage.windowsazure.com/
