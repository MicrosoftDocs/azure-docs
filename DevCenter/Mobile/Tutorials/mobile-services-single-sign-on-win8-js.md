<properties linkid="mobile-get-started-with-users-dotnet" urldisplayname="Mobile Services" headerexpose="" pagetitle="Get started with authentication in Mobile Services" metakeywords="Get started Windows Azure Mobile Services, mobile devices, Windows Azure, mobile, Windows 8, WinRT app, JavaScript" footerexpose="" metadescription="Get started using Windows Azure Mobile Services in your Windows Store apps." umbraconavihide="0" disquscomments="1"></properties>

<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="14798" ismacro="true" umb_chunkname="MobileArticleLeft" umb_chunkpath="devcenter/Menu" umb_macroalias="AzureChunkDisplayer" umb_hide="0" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

<div class="dev-center-os-selector">
  <a href="/en-us/develop/mobile/tutorials/get-started-with-users-dotnet/" title=".NET client version">C# and XAML</a>
  <a href="/en-us/develop/mobile/tutorials/get-started-with-users-js/" title="JavaScript client version" class="current">JavaScript and HTML</a>
  <span>Tutorial</span>
</div>

# Get started with authentication in Mobile Services

This topic shows you how to authenticate users in Windows Azure Mobile Services from a Windows Store app.  In this tutorial, you add authentication to the quickstart project using Live Connect. When successfully authenticated by Live Connect, a logged-in user is welcomed by name and the user ID value is displayed.  

This tutorial walks you through these basic steps to enable Live Connect authentication:

1. [Register your app for authentication and configure Mobile Services]
2. [Restrict table permissions to authenticated users]
3. [Add authentication to the app]

This tutorial requires the following:

+ [Live SDK for Windows]
+ Microsoft Visual Studio 2012 Express for Windows 8 RC, or a later version

This tutorial is based on the Mobile Services quickstart. You must also first complete the tutorial [Get started with Mobile Services].

<a name="register"></a><h2><span class="short-header">Register your app</span>Register your app for the Windows Store</h2>

To be able to authenticate users, you must submit your app to the Windows Store. You must then register the client secret to integrate Live Connect with Mobile Services.

1. If you have not already registered your app, navigate to the [Submit an app page] at the Dev Center for Windows Store apps, log on with your Microsoft account, and then click **App name**.

   ![][0]

2. Type a name for your app in **App name**, click **Reserve app name**, and then click **Save**.

   ![][1]

   This creates a new Windows Store registration for your app.

3. In Visual Studio 2012 Express for Windows 8, open the project that you created when you completed the tutorial [Get started with Mobile Services].

4. In solution explorer, right-click the project, click **Store**, and then click **Associate App with the Store...**. 

  ![][2]

   This displays the **Associate Your App with the Windows Store** Wizard.

5. In the wizard, click **Sign in** and then login with your Microsoft account.

6. Select the app that you registered in step 2, click **Next**, and then click **Associate**.

   ![][3]

   This adds the required Windows Store registration information to the application manifest.    

7. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your mobile service.

   ![][4]

8. Click the **Dashboard** tab and make a note of the **Site URL** value.

   ![][5]

    You will use this value to define the redirect domain.

9. Navigate to the [My Applications] page in the Live Connect Developer Center and click on your app in the **My applications** list.

   ![][6] 

10. Click **Edit settings**, then **API Settings** and make a note of the value of **Client secret**. 

   ![][7]

    <div class="dev-callout"><b>Security Note</b>
	<p>The client secret is an important security credential. Do not share the client secret with anyone or distribute it with your app.</p>
    </div>

11. In **Redirect domain**, enter the URL of your mobile service from Step 8, and then click **Save**.

16. Back in the Management Portal, click the **Identity** tab, enter the **Client secret** obtained from Windows Store, and click **Save**.

   ![][13]

Both your mobile service and your app are now configured to work with Live Connect.

<a name="permissions"></a><h2><span class="short-header">Restrict permissions</span>Restrict permissions to authenticated users</h2>

1. In the Management Portal, click the **Data** tab, and then click the **TodoItem** table. 

   ![][14]

2. Click the **Permissions** tab, set all permissions to **Only authenticated users**, and then click **Save**. This will ensure that all operations against the **TodoItem** table require an authenticated user. This also simplifies the scripts in the next tutorial because they will not have to allow for the possibility of anonymous users.

   ![][15]

3. In Visual Studio 2012 Express for Windows 8, open the project that you created when you completed the tutorial [Get started with Mobile Services]. 

4. Press the F5 key to run this quickstart-based app; verify that an exception with a status code of 401 (Unauthorized) is raised. 
   
   This happens because the app is accessing Mobile Services as an unauthenticated user, but the _TodoItem_ table now requires authentication.

Next, you will update the app to authenticate users with Live Connect before requesting resources from the mobile service.

<a name="add-authentication"></a><h2><span class="short-header">Add authentication</span>Add authentication to the app</h2>

1. Download and install the [Live SDK for Windows].

2. In the **Project** menu in Visual Studio, click **Add Reference**, then expand **Windows**, click **Extensions**, check **Live SDK**, and then click **OK**. 

  ![][16]

  This adds a reference to the Live SDK to the project.

3. Open the default.html project file and add the following &lt;script&gt; element in the &lt;head&gt; element. 

        <script src="///LiveSDKHTML/js/wl.js"></script>

   This enables Microsoft IntelliSense in the default.html file.


4. Open the project file default.js and add the following comment to the top of the file. 

        /// <reference path="///LiveSDKHTML/js/wl.js" />

   This enables Microsoft IntelliSense in the default.js file.

5. In the **app.OnActivated** method overload, replace the call to the **refreshTodoItems** method  with the following code: 
	
        var session = null;   

        var logout = function () {
            return new WinJS.Promise(function (complete) {
                WL.getLoginStatus().then(function () {
                    if (WL.canLogout()) {
                        WL.logout(complete);                            
                    }
                    else {
                        complete();
                    }
                });
            });
        };                  

        var login = function () {
            return new WinJS.Promise(function (complete) {                    
                WL.login({ scope: "wl.basic"}).then(function (result) {
                    session = result.session;

                    WinJS.Promise.join([
                        WL.api({ path: "me", method: "GET" }),
                        client.login(result.session.authentication_token)
                    ]).done(function (results) {
                        var profile = results[0];
                        var mobileServicesUser = results[1];
                        refreshTodoItems();
                        var title = "Welcome " + profile.first_name + "!";
                        var message = "You are now logged in as: " + mobileServicesUser.userId;
                        var dialog = new Windows.UI.Popups.MessageDialog(message, title);
                        dialog.showAsync().done(complete);                                
                    });                       
                }, function (error) {                        
                    session = null;
                    var dialog = new Windows.UI.Popups.MessageDialog("You must log in.", "Login Required");
                    dialog.showAsync().done(complete);                        
                });
            });
        }

        var authenticate = function () {
            // Force a logout to make it easier to test with multiple Microsoft Accounts
            logout().then(login).then(function () {
                if (session === null) {
                    // Authentication failed, try again.
                    authenticate();
                }
            });
        }

        WL.init({
            redirect_uri: "<< INSERT REDIRECT DOMAIN HERE >>"
        });           
            
        authenticate();

    This initializes the Live Connect client, forces a logout, sends a new login request to Live Connect, sends the returned authentication token to Mobile Services, and then displays information about the logged-in user. 

    <div class="dev-callout"><b>Note</b>
	<p>This code forces a logout, when possible, to make sure that the user is prompted for credentials each time the application runs. This makes it easier to test the application with different Microsoft Accounts to ensure that the authentication is working correctly. This mechanism will only work if the logged in user does not have a connected Microsoft account.</p>
    </div>
	
7. Update string _<< INSERT REDIRECT DOMAIN HERE >>_ from the previous step with the redirect domain that was specified when setting up the app in Live Connect, in the format **https://_service-name_.azure-mobile.net/**.
		
8. Press the F5 key to run the app and sign into Live Connect with your Microsoft Account. 

   When you are successfully logged-in, the app should run without errors, and you should be able to query Mobile Services and make updates to data.

## <a name="next-steps"> </a>Next steps

In the next tutorial, [Authorize users with scripts], you will take the user ID value provided by Mobile Services based on an authenticated user and use it to filter the data returned by Mobile Services. 

<!-- Anchors. -->
[Register your app for authentication and configure Mobile Services]: #register
[Restrict table permissions to authenticated users]: #permissions
[Add authentication to the app]: #add-authentication
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ../Media/mobile-services-submit-win8-app.png
[1]: ../Media/mobile-services-win8-app-name.png
[2]: ../Media/mobile-services-store-association.png
[3]: ../Media/mobile-services-select-app-name.png
[4]: ../Media/mobile-services-selection.png
[5]: ../Media/mobile-service-uri.png
[6]: ../Media/mobile-live-connect-apps-list.png
[7]: ../Media/mobile-live-connect-app-api-settings.png
[8]: ../Media/mobile-services-win8-app-advanced.png
[9]: ../Media/mobile-services-win8-app-connect-redirect.png
[10]: ../Media/mobile-services-win8-app-connect-redirect-uri.png
[11]: ../Media/mobile-services-win8-app-push-connect.png
[12]: ../Media/mobile-services-win8-app-connect-auth.png
[13]: ../Media/mobile-identity-tab.png
[14]: ../Media/mobile-portal-data-tables.png
[15]: ../Media/mobile-portal-change-table-perms.png
[16]: ../Media/mobile-add-reference-live-js.png

<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: ./mobile-services-get-started.md
[Get started with data]: ./mobile-services-get-started-with-data-js.md
[Get started with authentication]: ./mobile-services-get-started-with-users-js.md
[Get started with push notifications]: ./mobile-services-get-started-with-push-js.md
[Authorize users with scripts]: ./mobile-services-authorize-users-js.md
[JavaScript and HTML]: ./mobile-services-get-started-with-users-js.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/