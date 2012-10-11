<properties linkid="mobile-get-started-with-users-js" urldisplayname="Mobile Services" headerexpose="" pagetitle="Get started with authentication in Mobile Services" metakeywords="Get started Windows Azure Mobile Services, mobile devices, Windows Azure, mobile, Windows 8, WinRT app" footerexpose="" metadescription="Get started using Windows Azure Mobile Services in your Windows Store apps." umbraconavihide="0" disquscomments="1"></properties>

<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="14798" ismacro="true" umb_chunkname="MobileArticleLeft" umb_chunkpath="devcenter/Menu" umb_macroalias="AzureChunkDisplayer" umb_hide="0" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

<div class="dev-center-os-selector">
  <a href="/en-us/develop/mobile/tutorials/get-started-with-users-dotnet/" title=".NET client version">C# and XAML</a>
  <a href="/en-us/develop/mobile/tutorials/get-started-with-users-js/" title="JavaScript client version" class="current">JavaScript and HTML</a>
  <span>Tutorial</span>
</div>

# Get started with authentication in Mobile Services

This topic shows you how to authenticate users in Windows Azure Mobile Services from your app.  In this tutorial, you add authentication to the quickstart project using an identity provider that is supported by Mobile Services. After being successfully authenticated and authorized by Mobile Services, the user ID value is displayed.  

This tutorial walks you through these basic steps to enable authentication in your app:

1. [Register your app for authentication and configure Mobile Services]
2. [Restrict table permissions to authenticated users]
3. [Add authentication to the app]

This tutorial is based on the Mobile Services quickstart. You must also first complete the tutorial [Get started with Mobile Services]. 

Mobile Services currently supports the following identity providers for authentication:

- Microsoft Live Connect
- Facebook
- Twitter
- Google

<div class="dev-callout"><b>Note</b>
	<p>This tutorial demonstrates the basic method provided by Mobile Services to authenticate users by using a variety of identity providers. This method is easy to configure and supports multiple providers. However, this method also requires users to log-in every time your app starts. To instead use Live Connect to provide a single sign-on experience in your Windows Store app, see the topic <a href="/en-us/develop/mobile/tutorials/get-started">Single sign-on for Windows Store apps by using Live Connect</a>.</p>
</div>

<a name="register"></a><h2><span class="short-header">Register your app</span>Register your app for authentication and configure Mobile Services</h2>

To be able to authenticate users, you must register your app with an identity provider. You must then register the provider-generated client secret with Mobile Services.

1. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your mobile service.

   ![][4]

2. Click the **Dashboard** tab and make a note of the **Site URL** value.

   ![][5]

    You may need to provide this value to the identity provider when you register your app.

3. Expand your chosen identity provider and follow the steps to register your app with the provider.

    <div class="dev-callout-new-collapsed">
    <strong>Microsoft Live Connect<span>Click to expand</span></strong>
      <div class="dev-callout-content">
      <p>Use the following procedure to register your app for authentication by using a Microsoft Account.</p>
      <!-- start copied HTML source -->
      <!-- end copied HTML source -->
      </div>
    </div>  

    <div class="dev-callout-new-collapsed">
      <strong>Facebook<span>Click to expand</span></strong>
      <div class="dev-callout-content">
      <p>Use the following procedure to register your app for authentication by using a Facebook login.</p>
      <!-- start copied HTML source -->
      <!-- end copied HTML source -->
      </div>
    </div> 

    <div class="dev-callout-new-collapsed">
       <strong>Twitter<span>Click to expand</span></strong>
       <div class="dev-callout-content">
      <p>Use the following procedure to register your app for authentication by using a Twitter login.</p>
      <!-- start copied HTML source -->

      <!-- end copied HTML source -->
      </div>
    </div> 

    <div class="dev-callout-new-collapsed">
       <strong>Google<span>Click to expand</span></strong>
       <div class="dev-callout-content">
      <p>Use the following procedure to register your app for authentication by using a Google login.</p>
      <!-- start copied HTML source -->
      <!-- end copied HTML source -->
      </div>
    </div>

4. Back in the Management Portal, click the **Identity** tab, enter the app identifier and shared secret values obtained from your identity provider, and click **Save**.

   ![][13]

Both your mobile service and your app are now configured to work with your chosed authenication provider.

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

1. Open the default.html project file and add the following &lt;script&gt; element in the &lt;head&gt; element. 

        <script src="///LiveSDKHTML/js/wl.js"></script>

   This enables Microsoft IntelliSense in the default.html file.

5. Open the project file default.js and add the following comment to the top of the file. 

        /// <reference path="///LiveSDKHTML/js/wl.js" />

   This enables Microsoft IntelliSense in the default.js file.

5. In the **app.OnActivated** method overload, replace the call to the **refreshTodoItems** method  with the following code: 
	
        // Request authentication from Mobile Services using a Facebook login.
        var login = function () {
            return new WinJS.Promise(function (complete) {
                client.login("facebook").done(function (results) {
                    var mobileServiceUser = results[0];
                    refreshTodoItems();
                    var message = "You are now logged in as: " 
                        + mobileServicesUser.userId;
                    var dialog = 
                        new Windows.UI.Popups.MessageDialog(message);
                    dialog.showAsync().done(complete);
                });
            });
        }            

        var authenticate = function () {
            login().then(function () {
                if (user === null) {

                    // Authentication failed, try again.
                    authenticate();
                }
            });
        }

        authenticate();

    This creates a member variable for storing the current user and a method to handle the authentication process. The user is authenticated by using a Facebook login.

    <div class="dev-callout"><b>Note</b>
	<p>If you are using an identity provider other than Facebook, change the value of MobileServiceAuthenticationProvider above to the value for your provider.</p>
    </div>

9. Press the F5 key to run the app and sign into the app with your chosen identity provider. 

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
[Single sign-on for Windows Store apps by using Live Connect]: ./mobile-services-single-sign-on-win8-js.md
[Get started with Mobile Services]: ./mobile-services-get-started.md
[Get started with data]: ./mobile-services-get-started-with-data-js.md
[Get started with authentication]: ./mobile-services-get-started-with-users-js.md
[Get started with push notifications]: ./mobile-services-get-started-with-push-js.md
[Authorize users with scripts]: ./mobile-services-authorize-users-js.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/