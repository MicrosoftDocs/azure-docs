[!INCLUDE [active-directory-b2c-portal-add-application](../../Users/patricka/git/azure-docs-pr/includes/active-directory-b2c-portal-add-application.md)]

Enter a **Name** for the application that describes your application to consumers. For example, you could enter "Contoso B2C app".

![+ Add button in the applications blade](./media/active-directory-b2c-app-registration/b2c-applications-add.png)

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
