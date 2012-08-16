<properties linkid="mobile-get-started-with-users-dotnet" urldisplayname="Mobile Services" headerexpose="" pagetitle="Get started with users in Mobile Services" metakeywords="Get started Windows Azure Mobile Services, mobile devices, Windows Azure, mobile, Windows 8, WinRT app" footerexpose="" metadescription="Get started using Windows Azure Mobile Services in your Windows Store apps." umbraconavihide="0" disquscomments="1"></properties>

# Get started with users in Mobile Services
Language: **C# and XAML**  

This topic shows you how to work with authenticated users in Windows Azure Mobile Services from a Windows 8 app.  In this tutorial, you add Live Connect authentication to the quickstart project. When successfully authenticated by Live Connect, a logged-in user is welcomed by name and the user ID value is displayed.  

To be able to authenticate users, you must register your Windows app and configure Mobile Services to integrate with Live Connect. You can do this at the Live Connect Developer Center.

1. Navigate to the [Windows Push Notifications & Live Connect] page, login with your Microsoft account if needed, and then follow the instructions to register your app.

2. Once you have registered your app, navigate to the [My Apps dashboard]

1. Create a Windows Live application and configure the mobile service and app (reuse or link to content as necessary).

2. Navigate to the TodoItem table in the portal and on the permissions tab set everything to authenticated users only.

3. Run the application and observe that it throws an exception with a status code of 401 (unauthorized).

4. Install and add a reference to the Live SDK

5. Open mainpage.xaml.cs  and add the following using statements:

	using Microsoft.Live;
	using Windows.UI.Popups;

6. Add a member variable for storing the current Windows Live session and a method to handle the authentication process. This includes code to force a logout if possible to ensure that the user is prompted for credentials each time the application is run. This makes it easier to test the application with different Microsoft Accounts to ensure that the authentication is working correctly. This mechanism will only work if the logged in user does not have a connected Microsoft account.
	
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
	
7. Update the << INSERT REDIRECT DOMAIN HERE >> from the previous step with the redirect domain that was specified when setting up the Windows Live app. (e.g. https://mymobileservice.azure-mobile.net/ )
8. Replace OnNavigatedTo with the following:

        protected override async void OnNavigatedTo(NavigationEventArgs e)
        {
            await Authenticate();
            RefreshTodoItems();
        }
		
9. Run the app and sign in. After granting access permissions to the app, the user should be prompted with a welcome dialog which concludes this tutorial.

### Build and test your app

The final stage of this tutorial is to build and run your new Windows 8 app.

1. Browse to the location where you saved the compressed project files, expand the files on your computer, and open the solution file in Visual Studio 2012 Express for Windows 8. 

2. Press the **F5** key to rebuild the project and start the app.

3. In the app, enter text in **Insert a TodoItem** and then click **Save**.

   ![][10]

   This inserts the text in the TodoItem table in the mobile service. Text stored in the table is returned by the service and displayed in the second column.

### <a name="next-steps"> </a>Next Steps

In the next tutorial, Authorize users with scripts, you will take the user ID value and use it to filter the data returned from a table. 

<!-- Anchors. -->

[Next Steps]:#next-steps

<!-- Images. -->


<!-- URLs. -->
[Windows Push Notifications & Live Connect]: http://go.microsoft.com/fwlink/?LinkID=257677
[My Apps dashboard]: http://go.microsoft.com/fwlink/?LinkId=262039
[Get started with Mobile Services]: ./mobile-services-get-started#create-new-service/
[Get started with data]: ./mobile-services-get-started-with-data-dotnet/
[Get started with users]: ./mobile-services-get-started-with-users-dotnet/
[Get started with push notifications]: ./mobile-services-get-started-with-push-dotnet/
[JavaScript and HTML]: mobile-services-win8-javascript/
[WindowsAzure.com]: http://www.windowsazure.com/
[Management Portal preview]: https://manage.windowsazure.com/