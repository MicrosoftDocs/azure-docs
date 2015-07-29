
First, you need to register your app with an identity provider at their site, then set those credentials in the Mobile App backend.

* In the [Azure portal], click **Browse** > **Web Apps** > your backend. Click **Settings** > **Mobile App** > **User authentication** > your preferred identity provider. Make a note of the pre-populated URI values for your preferred identity provider; you'll need this for the next step. 

* Configure one or more of your preferred identity providers by following the provider's instructions -- [Azure Active Directory](app-service-mobile-how-to-configure-active-directory-authentication-preview.md), [Facebook](app-service-mobile-how-to-configure-facebook-authentication-preview.md), [Google](app-service-mobile-how-to-configure-google-authentication-preview.md), 
[Microsoft](app-service-mobile-how-to-configure-microsoft-authentication-preview.md), or [Twitter](app-service-mobile-how-to-configure-twitter-authentication-preview.md).

<!-- URLs. -->
[Azure portal]: https://portal.azure.com/
