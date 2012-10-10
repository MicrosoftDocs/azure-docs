<div class="dev-callout"><b>Note</b>
<p>To complete the procedure in this topic, you must have a Twitter account that has a verified email address. To create a new Twitter account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkID=268287" target="_blank">twitter.com</a>.</p>
</div> 

1. Navigate to the [Twitter Developers] web site, sign-in with your Twitter account credentials, and then click **Create an app**.

   ![][1]   

2. Type the **Name**, **Description**, and **Website** for your app, and type the URL of the mobile service in **Callback URL**.

   ![][2]

3.  At the bottom the page, read and accept the terms, type the correct CAPTCHA words, and then click **Create your Twitter application**. 

   ![][3]

   This reigsters the app displays the application details.

6. Make a note of the values of **Consumer key** and **Consumer secret**. 

   ![][4]

    <div class="dev-callout"><b>Security Note</b>
	<p>The consumer secret is an important security credential. Do not share this secret with anyone or distribute it with your app.</p>
    </div>

You are now ready to integrate authentication by using Twitter into your app by providing the consumer key and consumer secret values to Mobile Services.

<!-- Anchors. -->

<!-- Images. -->
[1]: ../Media/mobile-services-twitter-developers.png
[2]: ../Media/mobile-services-twitter-register-app1.png
[3]: ../Media/mobile-services-twitter-register-app2.png
[4]: ../Media/mobile-services-twitter-app-details.png

<!-- URLs. -->
[twitter.com]: http://go.microsoft.com/fwlink/p/?LinkId=268287
[Twitter Developers]: http://go.microsoft.com/fwlink/?LinkId=268300
[Get started with authentication]: ./mobile-services-get-started-with-users-dotnet.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/