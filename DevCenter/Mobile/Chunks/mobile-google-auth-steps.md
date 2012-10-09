<div class="dev-callout"><b>Note</b>
<p>To complete the procedure in this topic, you must have a Google account that has a verified email address. To create a new Google account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkId=268302" target="_blank">accounts.google.com</a>.</p>
</div> 

1. Navigate to the [Google apis] web site, sign-in with your Google account credentials, and then click **Create project...**.

   ![][1]   

2. Click **API Access** and then click **Create an OAuth 2.0 client ID...**.

   ![][2]

3. Under **Branding Information**, type your **Product name**, then click **Next**.  

   ![][3]

4. Under **Client ID Settings**, select **Web application**, type your mobile service URL in **Your site or hostname**, click **more options**, add your mobile service URL to the list of **Authorized Redirect URIs**, and then click **Create client ID**.

   ![][4]

6. Under **Client ID for web applications**, make a note of the values of **Client ID** and **Client secret**. 

   ![][5]

    <div class="dev-callout"><b>Security Note</b>
	<p>The client secret is an important security credential. Do not share this secret with anyone or distribute it with your app.</p>
    </div>

You are now ready to integrate authentication by using Twitter into your app by providing the consumer key and consumer secret values to Mobile Services.

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