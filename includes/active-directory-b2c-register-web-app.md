[!INCLUDE [active-directory-b2c-portal-add-application](active-directory-b2c-portal-add-application.md)]

Enter a **Name** for the application that describes your application to consumers. For example, you could enter `Contoso B2C app`.

Toggle the **Web app / Web API** switch to **Yes**.

If your application needs to use [OpenID Connect sign-in](active-directory-b2c-reference-oidc.md), toggle the **Allow implicit flow** toggle to **Yes**.

The **Reply URLs** are endpoints where Azure AD B2C returns any tokens that your application requests. For example, enter `https://contoso.com/b2capp`.

![Example settings in the new application blade](./media/active-directory-b2c-app-registration/b2c-new-app-settings.png)

Click **Create** to register your application. Your application is now registered and will be listed in the applications list for the B2C tenant.

In the applications blade, find and select your newly registered application. The application's property page will be displayed.

Make note of the  globally unique **Application Client ID** that you include in your application's code.

If your web application calls a web API secured by Azure AD B2C, you want to:
   1. Create an **Application Secret** by going to the **Keys** blade and clicking the **Generate Key** button.
   2. Click **API Access**, click **Add**, and select your web API and scopes (permissions).

> [!NOTE]
> An **Application Secret** is an important security credential, and should be secured appropriately.
> 