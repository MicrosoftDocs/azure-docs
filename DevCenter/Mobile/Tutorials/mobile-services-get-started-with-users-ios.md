<properties linkid="get-started-with-users-ios" urldisplayname="Mobile Services" headerexpose="" pagetitle="Get started with authentication in Mobile Services" metakeywords="Get started Windows Azure Mobile Services, mobile devices, Windows Azure, mobile, Windows 8, WinRT app" footerexpose="" metadescription="Get started with authentication in Mobile Services with your iOS apps" umbraconavihide="0" disquscomments="1"></properties>

<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="14798" ismacro="true" umb_chunkname="MobileArticleLeft" umb_chunkpath="devcenter/Menu" umb_macroalias="AzureChunkDisplayer" umb_hide="0" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

<!--<div class="dev-center-os-selector">
  <a href="/en-us/develop/mobile/tutorials/get-started-with-users-dotnet/" title="Windows Store version">Windows Store</a>
  <a href="/en-us/develop/mobile/tutorials/get-started-with-users-ios/" title="iOS version" class="current">iOS</a>  
</div>-->

# Get started with authentication in Mobile Services for iOS
<h3><a href="/en-us/develop/mobile/tutorials/get-started-with-users-dotnet">Windows Store C#</a> / <a href="/en-us/develop/mobile/tutorials/get-started-with-users-js">Windows Store JavaScript</a> / <strong>iOS</strong></h3>

_The iOS client library for Mobile Services is currently under development on [GitHub]. We welcome feedback on and contributions to this library._

This topic shows you how to authenticate users in Windows Azure Mobile Services from your app.  In this tutorial, you add authentication to the quickstart project using an identity provider that is supported by Mobile Services. After being successfully authenticated and authorized by Mobile Services, the user ID value is displayed.  

This tutorial walks you through these basic steps to enable authentication in your app:

1. [Register your app for authentication and configure Mobile Services]
2. [Restrict table permissions to authenticated users]
3. [Add authentication to the app]

This tutorial is based on the Mobile Services quickstart. You must also first complete the tutorial [Get started with Mobile Services]. 

Completing this tutorial requires XCode 4.5 and iOS 5.0 or later versions. 

<!--<div class="dev-callout"><b>Note</b>
	<p>This tutorial demonstrates the basic method provided by Mobile Services to authenticate users by using a variety of identity providers. This method is easy to configure and supports multiple providers. However, this method also requires users to log-in every time your app starts. To instead use Live Connect to provide a single sign-on experience in your Windows Store app, see the topic <a href="/en-us/develop/mobile/tutorials/single-sign-on-win8-dotnet">Single sign-on for Windows Store apps by using Live Connect</a>.</p>
</div>-->

<h2><span class="short-header">Register your app</span><a name="register"></a>Register your app for authentication and configure Mobile Services</h2>

To be able to authenticate users, you must register your app with an identity provider. You must then register the provider-generated client secret with Mobile Services.

1. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your mobile service.

   ![][4]

2. Click the **Dashboard** tab and make a note of the **Site URL** value.

   ![][5]

    You may need to provide this value to the identity provider when you register your app.

3. Choose a supported identity provider from the list below and follow the steps to register your app with that provider:

 - <a href="/en-us/develop/mobile/howto/register-ms-account-auth" target="_blank">Microsoft Account</a>
 - <a href="/en-us/develop/mobile/howto/register-facebook-auth" target="_blank">Facebook login</a>
 - <a href="/en-us/develop/mobile/howto/register-twitter-auth" target="_blank">Twitter login</a>
 - <a href="/en-us/develop/mobile/howto/register-google-auth" target="_blank">Google login</a>

4. Back in the Management Portal, click the **Identity** tab, enter the app identifier and shared secret values obtained from your identity provider, and click **Save**.

   ![][13]

Both your mobile service and your app are now configured to work with your chosen authentication provider.

<h2><span class="short-header">Restrict permissions</span><a name="permissions"></a>Restrict permissions to authenticated users</h2>

1. In the Management Portal, click the **Data** tab, and then click the **TodoItem** table. 

   ![][14]

2. Click the **Permissions** tab, set all permissions to **Only authenticated users**, and then click **Save**. This will ensure that all operations against the **TodoItem** table require an authenticated user. This also simplifies the scripts in the next tutorial because they will not have to allow for the possibility of anonymous users.

   ![][15]

3. In Xcode, open the project that you created when you completed the tutorial [Get started with Mobile Services]. 

4. Press the **Run** button to build the project and start the app in the iPhone emulator; verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts. 
   
   This happens because the app attempts to access Mobile Services as an unauthenticated user, but the _TodoItem_ table now requires authentication.

Next, you will update the app to authenticate users before requesting resources from the mobile service.

<h2><span class="short-header">Add authentication</span><a name="add-authentication"></a>Add authentication to the app</h2>

1. Open the project file TodoListController.m and in the **viewDidLoad** method, remove the following code that reloads the data into the table:

        [todoService refreshDataOnSuccess:^{
            [self.tableView reloadData];
        }];

2.	Just after the **viewDidLoad** method, add the following code:

        - (void)viewDidAppear:(BOOL)animated
        {
            // If user is already logged in, no need to ask for auth
            if (todoService.client.currentUser == nil)
            {
                // We want the login view to be presented after the this run loop has completed
                // Here we use a delay to ensure this.
                [self performSelector:@selector(login) withObject:self afterDelay:0.1];
            }
        }

        - (void) login
        {
            UINavigationController *controller =
    
            [self.todoService.client
                loginViewControllerWithProvider:@"facebook"
                completion:^(MSUser *user, NSError *error) {
         
                if (error) {
                        NSLog(@"Authentication Error: %@", error);
                        // Note that error.code == -1503 indicates
                        // that the user cancelled the dialog
                } else {
                    // No error, so load the data
                    [self.todoService refreshDataOnSuccess:^{
                        [self.tableView reloadData];
                    }];
                }
         
                [self dismissViewControllerAnimated:YES completion:nil];
            }];
    
            [self presentViewController:controller animated:YES completion:nil];
        }

    This creates a member variable for storing the current user and a method to handle the authentication process. The user is authenticated by using a Facebook login.

    <div class="dev-callout"><b>Note</b>
	<p>If you are using an identity provider other than Facebook, change the value passed to <strong>loginViewControllerWithProvider</strong> above to one of the following: <i>microsoftaccount</i>, <i>facebook</i>, <i>twitter</i>, or <i>google</i>.</p>
    </div>
		
3. Press the **Run** button to build the project, start the app in the iPhone emulator, then log-on with your chosen identity provider.

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
[16]: ../Media/mobile-add-reference-live-dotnet.png

<!-- URLs. -->
[GitHub]: http://go.microsoft.com/fwlink/p/?LinkId=268784
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Single sign-on for Windows Store apps by using Live Connect]: ./mobile-services-single-sign-on-win8-dotnet.md
[Get started with Mobile Services]: ./mobile-services-get-started-ios.md
[Get started with data]: ./mobile-services-get-started-with-data-ios.md
[Get started with authentication]: ./mobile-services-get-started-with-users-ios.md
[Get started with push notifications]: ./mobile-services-get-started-with-push-ios.md
[Authorize users with scripts]: ./mobile-services-authorize-users-ios.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/