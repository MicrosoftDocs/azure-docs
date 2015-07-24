
First, you need to register your app with an identity provider at their site, then set those credentials in your mobile service. 

1. In the [Azure Management portal], navigate to your mobile service, then click **Dashboard** and make a note of the **Mobile Service URL** value.

2. Register your app with one of the following supported identity providers. 

	* [Google](mobile-services-how-to-register-google-authentication.md)
	* [Facebook](mobile-services-how-to-register-facebook-authentication.md)
	* [Twitter](mobile-services-how-to-register-twitter-authentication.md)
	* [Microsoft](mobile-services-how-to-register-microsoft-authentication.md)
	* [Azure Active Directory](mobile-services-how-to-register-active-directory-authentication.md).  
	
    >[AZURE.IMPORTANT]Make sure to correctly set the redirect URI for your mobile service in the identity provider's developer site. As described in the linked instructions for each provider above, the path of the redirect URL is different for a .NET backend mobile service (`/signin-<provider>`) compared to a JavaScript backend mobile service (`/login/<provider>`). An incorrectly configured redirect URI prevents the client from being able to sign in to your app.
    <br/>Do not distribute or share the client secret.

3. Back in your mobile service in the [Azure Management portal], click the **Identity** tab and enter the app ID and secret values that you just obtained from the identity provider. 

Now that you've configured both your app and your mobile service to support one identity provider for authentication, you can repeat these steps to add support for additional identity providers.

[Azure Management portal]: https://manage.windowsazure.com/
