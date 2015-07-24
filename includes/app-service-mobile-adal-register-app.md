1. Register your Mobile App backend with your Azure Active Directory tenant by following the [How to configure your Mobile App with Azure Active Directory] topic.

2. Navigate to **Active Directory** in the [Azure Management Portal]

   ![](./media/app-service-mobile-adal-register-app/app-service-navigate-aad.png)

3. Select your directory, and then select the **Applications** tab at the top. Click **ADD** at the bottom to create a new app registration. 

4. Click **Add an application my organization is developing**.

5. In the Add Application Wizard, enter a **Name** for your application and click the  **Native Client Application** type. Then click to continue.

6. In the **Redirect URI** box, enter the /login/done endpoint for your App Service gateway. This value should be similar to https://contoso.azurewebsites.net/login/done.

7. Once the native application has been added, click the **Configure** tab. Copy the **Client ID**. You will need this later.

8. Scroll the page down to the **permissions to other applications** section and click **Add application**.

9. Search for the web application that you registered earlier and click the plus icon. Then click the check to close the dialog.

10. On the new entry you just added, open the **Delegated Permissions** dropdown and select **Access (appName)**. Then click **Save**

   ![](./media/app-service-mobile-adal-register-app/aad-native-client-add-permissions.png)

Your application is now configured in AAD so that users can log in using AAD single sign-on.

[Azure Management Portal]: https://manage.windowsazure.com/
[How to configure your Mobile App with Azure Active Directory]: ../articles/app-service-how-to-configure-active-directory-authentication-preview.md
