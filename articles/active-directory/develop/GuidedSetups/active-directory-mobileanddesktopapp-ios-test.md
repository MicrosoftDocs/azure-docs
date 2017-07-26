
## Test querying the Microsoft Graph API from your iOS application

Press `Command` + `R` to run the code in the simulator.

![Sample screen shot](media/active-directory-mobileanddesktopapp-ios-test/iostestscreenshot.png)

When you're ready to test, tap *‘Call Microsoft Graph API’* and you will be prompted to type your username and password.

### Consent
The first time you sign in to your application, you will be presented with a consent screen similar to the below, where you need to explicitly accept:

![Consent Screen](media/active-directory-mobileanddesktopapp-ios-test/iosconsentscreen.png)

### Expected results
You should see user profile information returned by the Microsoft Graph API call in the *Logging* section.

<!--start-collapse-->
### More information about scopes and delegated permissions

The Microsoft Graph API requires the `user.read` scope to read the user's profile. This scope is automatically added by default in every application being registered on our registration portal. Some other APIs for Microsoft Graph as well as custom APIs for your backend server may require additional scopes. For example, for Microsoft Graph, the scope `Calendars.Read` is required to list the user’s calendars. In order to access the user’s calendar in a context of an application, you need to add the `Calendars.Read` delegated permission to the application registration’s information and then add the `Calendars.Read` scope to the `acquireTokenSilent` call. The user may be prompted for additional consents as you increase the number of scopes.

<!--end-collapse-->



