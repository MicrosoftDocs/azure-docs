[!INCLUDE [active-directory-b2c-portal-add-application](active-directory-b2c-portal-add-application.md)]

Enter a **Name** for the application that describes your application to consumers. For example, you could enter "Contoso B2C API".

Toggle the **Include web app / web API** switch to **Yes**. The **Reply URLs** are endpoints where Azure AD B2C returns any tokens that your application requests. For example, if your web API is local and listening on port 44316, you could enter `https://localhost:44316/`.

Enter an **App ID URI**. The App ID URI is the identifier used for your web API. For example, enter 'notes'. The full identifier URI is generated for you.

Click **Create** to register your application. Your application is now registered and will be listed in the applications list for the B2C tenant.

Click the application that you created and copy down the globally unique **Application Client ID** that you use later in your code.

Click **Published scopes**. The published scopes are where you define the permissions (scopes) that can be granted to other applications.

Add more scopes as necessary. By default, the "user_impersonation" scope is defined. The user_impersonation scope gives other applications the ability to access this api on behalf of the signed-in user. If you wish, the user_impersonation scope can be removed.

Click **Save**.