<properties linkid="register-for-facebook-auth" urldisplayname="Mobile Services" headerexpose="" pagetitle="Register your apps for Facebook authentication with Mobile Services" metakeywords="Facebook, mobile devices, Windows Azure, mobile, authentication" footerexpose="" metadescription="Windows Developer Preview registration steps for Mobile Services using Windows Azure Mobile Services in your Windows Store apps." umbraconavihide="0" disquscomments="1"></properties>

<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="14798" ismacro="true" umb_chunkname="MobileArticleLeft" umb_chunkpath="devcenter/Menu" umb_macroalias="AzureChunkDisplayer" umb_hide="0" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

# Register your apps for Facebook authentication with Mobile Services

This topic shows you how to register your apps to be able to use Facebook as an authentication provider Windows Azure Mobile Services. 

<div class="dev-callout"><b>Note</b>
<p>To complete the procedure in this topic, you must have a Facebook account that has a verified email address and a mobile phone number. To create a new Facebook account, go to facebook.com.</p>
</div> 

1. Navigate to [Facebook Developers] web site and sign-in with your Facebook account credentials.

2. (Optional) If you have not already registered, click **Register Now** button, accept the policy, provide any and then click **Done**. 

   ![][0]

3. Click **Apps**, then click **Create New App**.

   ![][1]

   This displays the 

4. Choose a unique name for your app, select **OK**.

   ![][2]

	This registers the app with Facebook 

5.  Under **Select how your app integrates with Facebook**, expand **Website with Facebook Login**, type the URL of your mobile service in **Site URL**, and then click **Save Changes**.

   ![][3]

6. Make a note of the value of **App ID** and **App Secret**. 

   ![][4]

    <div class="dev-callout"><b>Security Note</b>
	<p>The app secret is an important security credential. Do not share this secret with anyone or distribute it with your app.</p>
    </div>

You are now ready to integrate authentication by using Facebook into your app by providing the App ID and App Secret values to Mobile Services.

<!-- Anchors. -->

<!-- Images. -->
[0]: ../Media/mobile-services-facebook-developer-register.png
[1]: ../Media/mobile-services-facebook-add-app.png
[2]: ../Media/mobile-services-facebook-new-app-dialog.png
[3]: ../Media/mobile-services-facebook-configure-app.png
[4]: ../Media/mobile-services-facebook-completed.png

<!-- URLs. -->
[Facebook Developers]: http://developer.facebook.com
[Get started with authentication]: ./mobile-services-get-started-with-users-dotnet.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/