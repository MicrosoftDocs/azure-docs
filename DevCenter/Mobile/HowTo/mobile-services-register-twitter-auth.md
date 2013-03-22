<properties linkid="develop-mobile-how-to-guides-register-for-twitter-authentication" urlDisplayName="Register for Twitter Authentication" pageTitle="Register for Twitter authentication - Mobile Services" metaKeywords="Windows Azure registering application, Azure Twitter authentication, application authenticate, authenticate mobile services, Mobile Services Twitter" metaDescription="Learn how to use Twitter authentication with your Windows Azure Mobile Services application." metaCanonical="" disqusComments="0" umbracoNaviHide="1" />



<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="14798" ismacro="true" umb_chunkname="MobileArticleLeft" umb_chunkpath="devcenter/Menu" umb_macroalias="AzureChunkDisplayer" umb_hide="0" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

#Register your apps for Twitter login with Mobile Services

This topic shows you how to register your apps to be able to use Twitter to authenticate with Windows Azure Mobile Services.

<div class="dev-callout"><b>Note</b>
<p>To complete the procedure in this topic, you must have a Twitter account that has a verified email address. To create a new Twitter account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkID=268287" target="_blank">twitter.com</a>.</p>
</div> 

1. Navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkId=268300" target="_blank">Twitter Developers</a> web site, sign-in with your Twitter account credentials, and click **Create a new application**.

   ![][1]

2. Type the **Name**, **Description**, and **Web Site** values for your app, and type the URL of the mobile service in **Callback URL**.

   ![][2]

    <div class="dev-callout"><b>Note</b>
    <p>The <strong>Web Site</strong> value is required but is not used.</p>
    </div> 

3.  At the bottom the page, read and accept the terms, type the correct CAPTCHA words, and then click **Create your Twitter application**. 

   ![][3]

   This registers the app displays the application details.

6. Make a note of the values of **Consumer key** and **Consumer secret**. 

   ![][4]

    <div class="dev-callout"><b>Security Note</b>
	<p>The consumer secret is an important security credential. Do not share this secret with anyone or distribute it with your app.</p>
    </div>

You are now ready to use a Twitter login for authentication in your app by providing the consumer key and consumer secret values to Mobile Services.

<!-- Anchors. -->

<!-- Images. -->
[1]: ../Media/mobile-services-twitter-developers.png
[2]: ../Media/mobile-services-twitter-register-app1.png
[3]: ../Media/mobile-services-twitter-register-app2.png
[4]: ../Media/mobile-services-twitter-app-details.png

<!-- URLs. -->
[twitter.com]: http://go.microsoft.com/fwlink/p/?LinkId=268287
[Twitter Developers]: http://go.microsoft.com/fwlink/p/?LinkId=268300
[Get started with authentication]: ./mobile-services-get-started-with-users-dotnet.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/