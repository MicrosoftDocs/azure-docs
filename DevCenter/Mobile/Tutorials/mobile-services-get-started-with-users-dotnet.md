<properties linkid="mobile-get-started-with-users-dotnet" urldisplayname="Mobile Services" headerexpose="" pagetitle="Get started with users in Mobile Services" metakeywords="Get started Windows Azure Mobile Services, mobile devices, Windows Azure, mobile, Windows 8, WinRT app" footerexpose="" metadescription="Get started using Windows Azure Mobile Services in your Windows Store apps." umbraconavihide="0" disquscomments="1"></properties>

# Get started with users in Mobile Services
Language: **C# and XAML**  

This topic shows you how to work with authenticated users in Windows Azure Mobile Services from a Windows Store app.  In this tutorial, you add authentication, using Live Connect, to the quickstart project. When successfully authenticated by Live Connect, a logged-in user is welcomed by name and the user ID value is displayed.  

This tutorial walks you through these basic steps to enable Live Connect authentication:

1. [Register your app for authentication and configure Mobile Services]
2. [Restrict table permissions to authenticated users]
3. [Add authentication to the app]
4. [Next steps]

This tutorial requires the [Live SDK for Windows], and you must have already completed the tutorial [Get started with Mobile Services].

## <a name="register"></a>Register your app for authentication and configure Mobile Services

To be able to authenticate users, you must register your Windows Store app at the Live Connect Developer Center. You must then register the client secret to integrate Live Connect with Mobile Services.

1. Navigate to the [Windows Push Notifications & Live Connect] page, login with your Microsoft account if needed, and then follow the instructions to register your app.

2. Once you have registered your app, navigate to the [My Apps dashboard] in Live Connect Developer Center and click on your app in the **My applications** list.

   ![][0] 

3. Click **Edit settings**, then **API Settings** and make a note of the value of **Client secret**. 

   ![][1]

   You must provide this value to Mobile Services to be able to use Live Connect for authentication. 

    <div class="dev-callout"><b>Security Note</b>
	<p>The client secret is an important security credential. Do not share the client secret with anyone or distribute it with your app.</p>
    </div>

4. In **Redirect domain**, enter the domain of your mobile service, in the format **https://_service-name_.azure-mobile.net/**, where _service-name_ is the name of your mobile service, then click **Save**.

5. Log into the [Windows Azure Management Portal], click **Mobile Services**, and then click your app.

   ![][2]

6. Click the **Identity** tab, enter the **Client secret** obtained from Live Connect, and click **Save**.

   ![][3]

## <a name="permissions"></a>Restrict table permissions to authenticated users

1. In the Management Portal, click the **Data** tab and then click the **TodoItem** table. 

   ![][4]

2. Click the **Permissions** tab, set all permissions to **Only authenticated users**, and then click **Save**.

   ![][5]

3. In Visual Studio 2012 Express for Windows 8, open the project that you created when you completed the tutorial [Get started with Mobile Services]. 

4. Press the F5 key to run this quickstart-based app; verify that an exception with a status code of 401 (Unauthorized) is raised. 
   
   This happens because the app is accessing Mobile Services as an unauthenticated user, but the _TodoItem_ table now requires authentication.

Next, you will update the app to authenticate users with Live Connect before requesting resources from the mobile service.

## <a name="add-authentication"></a>Add authentication to the app

1. Download and install the [Live SDK for Windows].

2. In the project in Visual Studio, add a reference to the Live SDK.

5. Open the project file mainpage.xaml.cs and add the following using statements:

        using Microsoft.Live;
        using Windows.UI.Popups;

6. Add the following code snippet that creates a member variable for storing the current Live Connect session and a method to handle the authentication process:
	
        private LiveConnectSession session;
        private async System.Threading.Tasks.Task Authenticate()
        {
            LiveAuthClient liveIdClient = new LiveAuthClient("<< INSERT REDIRECT DOMAIN HERE >>");

            while (session == null)
            {
                // Force a logout to make it easier to test with multiple Microsoft Accounts
                if (liveIdClient.CanLogout)
                    liveIdClient.Logout();
	
                LiveLoginResult result = await liveIdClient.LoginAsync(new[] { "wl.basic" });
                if (result.Status == LiveConnectSessionStatus.Connected)
                {
                    session = result.Session;
                    LiveConnectClient client = new LiveConnectClient(result.Session);
                    LiveOperationResult meResult = await client.GetAsync("me");
                    MobileServiceUser loginResult = await App.MobileService.LoginAsync(result.Session.AuthenticationToken);
	
                    string title = string.Format("Welcome {0}!", meResult.Result["first_name"]);
                    var message = string.Format("You are now logged in - {0}", loginResult.UserId);
                    var dialog = new MessageDialog(message, title);
                    dialog.Commands.Add(new UICommand("OK"));
                    await dialog.ShowAsync();
                }
                else
                {
                    session = null;
                    var dialog = new MessageDialog("You must log in.", "Login Required");
                    dialog.Commands.Add(new UICommand("OK"));
                    await dialog.ShowAsync();
                }
            }
         }

    <div class="dev-callout"><b>Note</b>
	<p>This code forces a logout, when possible, to make sure that the user is prompted for credentials each time the application runs. This makes it easier to test the application with different Microsoft Accounts to ensure that the authentication is working correctly. This mechanism will only work if the logged in user does not have a connected Microsoft account.</p>
    </div>
	

7. Update string _<< INSERT REDIRECT DOMAIN HERE >>_ from the previous step with the redirect domain that was specified when setting up the app in Live Connect, in the format **https://_service-name_.azure-mobile.net/**.

8. Replace the existing **OnNavigatedTo** event handler with the handler that calls the new **Authenticate** method:

        protected override async void OnNavigatedTo(NavigationEventArgs e)
        {
            await Authenticate();
            RefreshTodoItems();
        }
		
9. Press the F5 key to run the app and sign into Live Connect with your Microsoft Account. 

   When you are successfully logged-in, the app should run without errors, and you should be able to query Mobile Services and make updates to data.

## <a name="next-steps"> </a>Next Steps

In the next tutorial, [Authorize users with scripts], you will take the user ID value provided by Mobile Services based on an authenticated user and use it to filter the data returned by Mobile Services. 

<!-- Anchors. -->
[Register your app for authentication and configure Mobile Services]: #register
[Restrict table permissions to authenticated users]: #permissions
[Add authentication to the app]: #add-authentication
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ../Media/mobile-live-connect-apps-list.png
[1]: ../Media/mobile-live-connect-app-api-settings.png
[2]: ../Media/mobile-services-selection.png
[3]: ../Media/mobile-identity-tab.png
[4]: ../Media/mobile-portal-data-tables.png
[5]: ../Media/mobile-portal-change-table-perms.png

<!-- URLs. -->
[Windows Push Notifications & Live Connect]: http://go.microsoft.com/fwlink/?LinkID=257677
[My Apps dashboard]: http://go.microsoft.com/fwlink/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/?LinkId=262253
[Get started with Mobile Services]: ./mobile-services-get-started#create-new-service/
[Get started with data]: ./mobile-services-get-started-with-data-dotnet/
[Get started with users]: ./mobile-services-get-started-with-users-dotnet/
[Get started with push notifications]: ./mobile-services-get-started-with-push-dotnet/
[Authorize users with scripts]: ./mobile-services-authorize-users-dotnet/
[JavaScript and HTML]: mobile-services-win8-javascript/
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/