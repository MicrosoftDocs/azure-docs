<div class="dev-callout"><b>Note</b>
<p>To complete the procedure in this topic, you must have a Facebook account that has a verified email address and a mobile phone number. To create a new Facebook account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkId=268285" target="_blank">facebook.com</a>.</p>
</div> 

1. Navigate to the [Facebook Developers] web site and sign-in with your Facebook account credentials.

2. (Optional) If you have not already registered, click **Register Now** button, accept the policy, provide any and then click **Done**. 

   ![][0]

3. Click **Apps**, then click **Create New App**.

   ![][1]

4. Choose a unique name for your app, select **OK**.

   ![][2]

	This registers the app with Facebook 

5.  Under **Select how your app integrates with Facebook**, expand **Website with Facebook Login**, type the URL of your mobile service in **Site URL**, and then click **Save Changes**.

   ![][3]

6. Make a note of the values of **App ID** and **App Secret**. 

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
[facebook.com]: http://go.microsoft.com/fwlink/p/?LinkId=268285
[Facebook Developers]: http://go.microsoft.com/fwlink/p/?LinkId=268286
[Get started with authentication]: ./mobile-services-get-started-with-users-dotnet.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/