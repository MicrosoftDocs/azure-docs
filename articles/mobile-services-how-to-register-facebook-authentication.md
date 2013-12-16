<properties linkid="develop-mobile-how-to-guides-register-for-facebook-authentication" urlDisplayName="Register for Facebook Authentication" pageTitle="Register for Facebook authentication - Mobile Services" metaKeywords="Windows Azure Facebook, Azure Facebook, Azure authenticate Mobile Services" description="Learn how to use Facebook authentication in your Windows Azure Mobile Services app." metaCanonical="" services="" documentationCenter="" title="Register your apps for Facebook authentication with Mobile Services" authors=""  solutions="" writer="glenga" manager="" editor=""  />

# Register your apps for Facebook authentication with Mobile Services

This topic shows you how to register your apps to be able to use Facebook to authenticate with Windows Azure Mobile Services. 

<div class="dev-callout"><b>Note</b>
<p>To complete the procedure in this topic, you must have a Facebook account that has a verified email address and a mobile phone number. To create a new Facebook account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkId=268285" target="_blank">facebook.com</a>.</p>
</div> 

1. Navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkId=268286" target="_blank">Facebook Developers</a> web site and sign-in with your Facebook account credentials.

2. (Optional) If you have not already registered, click **Register Now** button, accept the policy, provide any and then click **Done**. 

   	![][0]

3. Click **Apps**, then click **Create New App**.

   	![][1]

4. Choose a unique name for your app, select **OK**.

   	![][2]

	This registers the app with Facebook 

5.  Under **Select how your app integrates with Facebook**, expand **Web Site with Facebook Login**, type the URL of your mobile service in **Site URL**, disable **Sandbox Mode**, and then click **Save Changes**.

   	![][3]

6. Make a note of the values of **App ID** and **App Secret**. 

   	![][4]

    <div class="dev-callout"><b>Security Note</b>
	<p>The app secret is an important security credential. Do not share this secret with anyone or distribute it with your app.</p>
    </div>

You are now ready to use a Facebook login for authentication in your app by providing the App ID and App Secret values to Mobile Services. 

<!-- Anchors. -->

<!-- Images. -->
[0]: ./media/mobile-services-how-to-register-facebook-authentication/mobile-services-facebook-developer-register.png
[1]: ./media/mobile-services-how-to-register-facebook-authentication/mobile-services-facebook-add-app.png
[2]: ./media/mobile-services-how-to-register-facebook-authentication/mobile-services-facebook-new-app-dialog.png
[3]: ./media/mobile-services-how-to-register-facebook-authentication/mobile-services-facebook-configure-app.png
[4]: ./media/mobile-services-how-to-register-facebook-authentication/mobile-services-facebook-completed.png

<!-- URLs. -->

[Facebook Developers]: http://go.microsoft.com/fwlink/p/?LinkId=268286
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-dotnet/

[Windows Azure Management Portal]: https://manage.windowsazure.com/
