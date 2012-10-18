<properties linkid="register-google-auth" urldisplayname="Mobile Services" headerexpose="" pagetitle="Register your apps for Google login with Mobile Services" metakeywords="Google, mobile devices, Windows Azure, mobile, authentication" footerexpose="" metadescription="Windows Developer Preview registration steps for Mobile Services using Windows Azure Mobile Services in your Windows Store apps." umbraconavihide="0" disquscomments="1"></properties>

<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="14798" ismacro="true" umb_chunkname="MobileArticleLeft" umb_chunkpath="devcenter/Menu" umb_macroalias="AzureChunkDisplayer" umb_hide="0" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

# Register your apps for Google login with Mobile Services

This topic shows you how to register your apps to be able to use Google to authenticate with Windows Azure Mobile Services.

<div class="dev-callout"><b>Note</b>
<p>To complete the procedure in this topic, you must have a Google account that has a verified email address. To create a new Google account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkId=268302" target="_blank">accounts.google.com</a>.</p>
</div> 

1. Navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkId=268303" target="_blank">Google apis</a> web site, sign-in with your Google account credentials, and then click **Create project...**.

   ![][1]   

2. Click **API Access** and then click **Create an OAuth 2.0 client ID...**.

   ![][2]

3. Under **Branding Information**, type your **Product name**, then click **Next**.  

   ![][3]

4. Under **Client ID Settings**, select **Web application**, type your mobile service URL in **Your site or hostname**, click **more options**, replace the generated URL in **Authorized Redirect URIs** with the URL of your mobile service appended with the path _/login/google_, and then click **Create client ID**.

   ![][4]

6. Under **Client ID for web applications**, make a note of the values of **Client ID** and **Client secret**. 

   ![][5]

    <div class="dev-callout"><b>Security Note</b>
	<p>The client secret is an important security credential. Do not share this secret with anyone or distribute it with your app.</p>
    </div>

You are now ready to use a Google login for authentication in your app by providing the client ID and client secret values to Mobile Services.

<!-- Anchors. -->

<!-- Images. -->
[1]: ../Media/mobile-services-google-developers.png
[2]: ../Media/mobile-services-google-create-client.png
[3]: ../Media/mobile-services-google-create-client2.png
[4]: ../Media/mobile-services-google-create-client3.png
[5]: ../Media/mobile-services-google-app-details.png

<!-- URLs. -->
[accounts.google.com]: http://go.microsoft.com/fwlink/p/?LinkId=268302
[Google apis]: http://go.microsoft.com/fwlink/p/?LinkId=268303
[Get started with authentication]: ./mobile-services-get-started-with-users-dotnet.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/