

To be able to authenticate users, you must register your app with an identity provider. You must then register the provider-generated client secret with App Services.

1. Log on to the [Azure Management Portal], click **Browse**, and choose **App Service Gateways**.

2. Select your gateway, and make a note of the **URL** value under **Properties**. You may need to provide this value to the identity provider when you register your app.

   	![](./media/app-service-mobile-register-authentication/gateway-uri.png)

3. Choose a supported identity provider from the list below and follow the steps to configure your app with that provider:

 - <a href="/en-us/documentation/articles/app-services-how-to-configure-microsoft-authentication/" target="_blank">Microsoft Account</a>
 - <a href="/en-us/documentation/articles/app-services-how-to-configure-facebook-authentication/" target="_blank">Facebook login</a>
 - <a href="/en-us/documentation/articles/app-services-how-to-configure-twitter-authentication/" target="_blank">Twitter login</a>
 - <a href="/en-us/documentation/articles/app-services-how-to-configure-google-authentication/" target="_blank">Google login</a>
 - <a href="/en-us/documentation/articles/app-services-how-to-configure-active-directory-authentication/" target="_blank">Azure Active Directory</a>

	Your application is now configured to work with your chosen authentication provider.

<!-- URLs. -->
[Azure Management Portal]: https://manage.windowsazure.com/