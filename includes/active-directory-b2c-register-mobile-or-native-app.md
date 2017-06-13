[!INCLUDE [active-directory-b2c-portal-add-application](active-directory-b2c-portal-add-application.md)]

Enter a **Name** for the application that describes your application to consumers. For example, you could enter "Contoso B2C app".

Toggle the **Include native client** switch to **Yes**.

Enter a **Redirect URI** with a custom scheme. For example, com.onmicrosoft.contoso.appname://redirect/path. Make sure you choose a [good redirect URI](#choosing-a-redirect-uri) and do not include special characters such as underscores.

Click **Save** to register your application.

Click the application that you created and copy down the globally unique **Application Client ID** that you use later in your code.

If your native application is calling a web API secured by Azure AD B2C, you want to:
   1. Create an **Application Secret** by going to the **Keys** blade and clicking the **Generate Key** button.
   2. Click **API Access**, click **Add**, and select your web API and scopes (permissions).

> [!NOTE]
> An **Application Secret** is an important security credential, and should be secured appropriately.
> 

### Choosing a redirect URI

There are two important considerations when choosing a redirect URI for mobile/native applications:

* **Unique**: The scheme of the redirect URI should be unique for every application. In our example (com.onmicrosoft.contoso.appname://redirect/path), we use com.onmicrosoft.contoso.appname as the scheme. We recommend following this pattern. If two applications share the same scheme, the user sees a "choose app" dialog. If the user makes an incorrect choice, the login fails.
* **Complete**: Redirect URI must have a scheme and a path. The path must contain at least one forward slash after the domain (for example, //contoso/ works and //contoso fails).

Ensure there are no special characters like underscores in the redirect uri.