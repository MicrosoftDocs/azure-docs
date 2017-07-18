
## Test your code

> ### Testing with Visual Studio
> If you are using Visual Studio, press `F5` to run your project. The browser will open and direct you to *http://localhost:{port}* where you’ll see the *Call Microsoft Graph API* button.

<p/><!-- -->

> ### Testing with Python or another web server
> If you are not using Visual Studio, make sure your web server is started and it is configured to listen to a TCP port based on the folder containing your *index.html* file. For Python, you can start listening to the port by running the following in the command prompt/ terminal, from the app's folder:
> 
> ```bash
> python -m http.server 8080
> ```
>  Then, open the browser and type *http://localhost:8080* or *http://localhost:{port}* - where the *port* corresponds to the port that your web server is listening to. You should see the contents of your index.html page with the *Call Microsoft Graph API* button.

## Test your application

After the browser loads your *index.html*, click the *Call Microsoft Graph API* button. If this is the first time, the browser will redirect you to the Microsoft Azure Active Directory v2 endpoint, where you will be prompted to sign in.
 
![Sample screen shot](media/active-directory-singlepageapp-javascriptspa-test/javascriptspascreenshot1.png)


### Consent
The very first time you sign in to your application, you will be presented with a consent screen similar to below, where you need to explicitly accept:

 ![Consent screen](media/active-directory-singlepageapp-javascriptspa-test/javascriptspaconsent.png)


### Expected results
You should see user profile information returned by the Microsoft Graph API call response.
 
 ![Results](media/active-directory-singlepageapp-javascriptspa-test/javascriptsparesults.png)

You will also see basic information about the token acquired in the *Access Token* and *ID Token Claims* boxes.

<!--start-collapse-->
### More information about scopes and delegated permissions

The Microsoft Graph API requires the `user.read` scope to read the user's profile. This scope is automatically added by default in every application being registered on our registration portal. Some other APIs for Microsoft Graph as well as custom APIs for your backend server may require additional scopes. For example, for Microsoft Graph, the scope `Calendars.Read` is required to list the user’s calendars. In order to access the user’s calendar in a context of an application, you need to add the `Calendars.Read` delegated permission to the application registration’s information and then add the `Calendars.Read` scope to the `acquireTokenSilent` call. The user may be prompted for additional consents as you increase the number of scopes.

If a backend API does not require a scope (not recommended), you can use the `clientId` as the scope in the `acquireTokenSilent` and/or `acquireTokenPopup` calls.

<!--end-collapse-->
