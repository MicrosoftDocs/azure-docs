## Test your code

1. Deploy your code to your device/emulator.

2. When you're ready to test your application, use an Azure Active Directory account (work or school account) or a Microsoft account (live.com, outlook.com) to sign in. 

    ![Test your application](media/active-directory-develop-guidedsetup-android-test/mainwindow.png)
    <br/><br/>
    ![Enter username and password](media/active-directory-develop-guidedsetup-android-test/usernameandpassword.png)

### Provide consent for application access
The first time that you sign in to your application, you're also prompted to provide consent to allow the application to access your profile and sign you in, as shown here: 

![Provide your consent for application access](media/active-directory-develop-guidedsetup-android-test/androidconsent.png)


### View application results
After you sign in, you should see the results that are returned by the call to the Microsoft Graph API. The call to the Microsoft Graph API **me** endpoint returns the [user profile](https://graph.microsoft.com/v1.0/me). For a list of common Microsoft Graph endpoints, see [Microsoft Graph API developer documentation](https://developer.microsoft.com/graph/docs#common-microsoft-graph-queries).

<!--start-collapse-->
### More information about scopes and delegated permissions

The Microsoft Graph API requires the *user.read* scope to read a user's profile. This scope is automatically added by default in every application that's registered in the Application Registration Portal. Other APIs for Microsoft Graph, as well as custom APIs for your back-end server, might require additional scopes. The Microsoft Graph API requires the *Calendars.Read* scope to list the user’s calendars. 

To access the user’s calendars in the context of an application, add the *Calendars.Read* delegated permission to the application registration information. Then, add the *Calendars.Read* scope to the `acquireTokenSilent` call. 

>[!NOTE]
>The user might be prompted for additional consents as you increase the number of scopes.

<!--end-collapse-->

[!INCLUDE [Help and support](active-directory-develop-help-support-include.md)]
