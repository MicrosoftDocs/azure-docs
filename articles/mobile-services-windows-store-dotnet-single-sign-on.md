<properties linkid="develop-mobile-tutorials-single-sign-on-windows-8-dotnet" urlDisplayName="Authenticate with single sign-on" pageTitle="Authenticate your Windows Store app with Live Connect" metaKeywords="Azure Live Connect, Azure SSO, SSO Live Connect, mobile services sso, Windows Store app sso" description="Learn how to use Live Connect single sign-on in Azure Mobile Services from a Windows Store application." metaCanonical="" services="" documentationCenter="" title="Authenticate your Windows Store app with Live Connect single sign-on" authors="glenga" solutions="" manager="" editor="" />




# Authenticate your Windows Store app with Live Connect single sign-on
<div class="dev-center-tutorial-selector sublanding"> 
	<a href="/en-us/develop/mobile/tutorials/single-sign-on-windows-8-dotnet" title="Windows Store C#" class="current">Windows Store C#</a><a href="/en-us/develop/mobile/tutorials/single-sign-on-windows-8-js" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/develop/mobile/tutorials/single-sign-on-wp8" title="Windows Phone">Windows Phone</a>
</div>	


This topic shows you how to use Live Connect single sign-on to authenticate users in Azure Mobile Services from a Windows Store app.  In this tutorial, you add authentication to the quickstart project using Live Connect. When successfully authenticated by Live Connect, a logged-in user is welcomed by name and the user ID value is displayed.  

<div class="dev-callout"><b>Note</b>
	<p>This tutorial demonstrates the benefits of using the single sign-on experience provided by Live Connect for Windows Store apps. This enables you to more easily authenticate an already logged-on user with you mobile service. For a more generalized authentication experience that supports multiple authentication providers, see the topic <a href="/en-us/develop/mobile/tutorials/get-started-with-users-dotnet/">Get started with authentication</a>. </p>
</div>

<div class="dev-callout"><b>Note</b>
	<p>This tutorial uses an Azure Mobile Service with a Javascript backend. Azure Mobile Services with a .NET backend 
	currently do not support authentication tokens from provider SDKs such as Live Connect.</p>
</div>

This tutorial walks you through these basic steps to enable Live Connect authentication:

1. [Register your app for authentication and configure Mobile Services]
2. [Restrict table permissions to authenticated users]
3. [Add authentication to the app]

This tutorial requires the following:

+ [Live SDK for Windows]
+ Microsoft Visual Studio 2012 Express for Windows 8 RC, or a later version

This tutorial is based on the Mobile Services quickstart. You must also first complete the tutorial [Get started with Mobile Services].

<h2><a name="register"></a><span class="short-header">Register your app</span>Register your app for the Windows Store</h2>

To be able to authenticate users, you must submit your app to the Windows Store. You must then register the client secret to integrate Live Connect with Mobile Services.

1. If you have not already registered your app, navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkID=266582" target="_blank">Submit an app page</a> at the Dev Center for Windows Store apps, log on with your Microsoft account, and then click **App name**.

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

7. Log on to the [Azure Management Portal], click **Mobile Services**, and then click your mobile service.

   	![][4]

8. Click the **Dashboard** tab and make a note of the **Site URL** value.

   	![][5]

    You will use this value to define the redirect domain.

9. Navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkId=262039" target="_blank">My Applications</a> page in the Live Connect Developer Center and click on your app in the **My applications** list.

   	![][6] 

10. Click **Edit settings**, then **API Settings** and make a note of the values of **Client ID** and **Client secret**. 

   	![][7]

    <div class="dev-callout"><b>Security Note</b>
	<p>The client secret is an important security credential. Do not share the client secret with anyone or distribute it with your app.</p>
    </div>

11. In **Redirect domain**, enter the URL of your mobile service from Step 8, and then click **Save**.

16. Back in the Management Portal, click the **Identity** tab, enter the **Client secret** obtained from Windows Store, and click **Save**.

   	![][13]

Both your mobile service and your app are now configured to work with Live Connect.

<h2><a name="permissions"></a><span class="short-header">Restrict permissions</span>Restrict permissions to authenticated users</h2>

1. In the Management Portal, click the **Data** tab, and then click the **TodoItem** table. 

   	![][14]

2. Click the **Permissions** tab, set all permissions to **Only authenticated users**, and then click **Save**. This will ensure that all operations against the **TodoItem** table require an authenticated user. This also simplifies the scripts in the next tutorial because they will not have to allow for the possibility of anonymous users.

   	![][15]

3. In Visual Studio 2012 Express for Windows 8, open the project that you created when you completed the tutorial [Get started with Mobile Services]. 

4. Press the F5 key to run this quickstart-based app; verify that an exception with a status code of 401 (Unauthorized) is raised. 
   
   	This happens because the app is accessing Mobile Services as an unauthenticated user, but the _TodoItem_ table now requires authentication.

Next, you will update the app to authenticate users with Live Connect before requesting resources from the mobile service.

<h2><a name="add-authentication"></a><span class="short-header">Add authentication</span>Add authentication to the app</h2>

1. Download and install the [Live SDK for Windows].

2. In the **Project** menu in Visual Studio, click **Add Reference**, then expand **Windows**, click **Extensions**, check **Live SDK**, and then click **OK**. 

  	![][16]

  	This adds a reference to the Live SDK to the project.

5. Open the project file MainPage.xaml.cs and add the following using statement:

        using Microsoft.Live;        

6. Add the following code snippet to the MainPage class:
	
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
                    MobileServiceUser loginResult = await App.MobileService
                        .LoginWithMicrosoftAccountAsync(result.Session.AuthenticationToken);
	
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

    This creates a member variable for storing the current Live Connect session and a method to handle the authentication process.

    <div class="dev-callout"><b>Note</b>
	<p>This code forces a logout, when possible, to make sure that the user is prompted for credentials each time the application runs. This makes it easier to test the application with different Microsoft Accounts to ensure that the authentication is working correctly. This mechanism will only work if the logged in user does not have a connected Microsoft account.</p>
    </div>
	

7. Update string _<< INSERT REDIRECT DOMAIN HERE >>_ from the previous step with the redirect domain that was specified when setting up the app in Live Connect, in the format **https://_service-name_.azure-mobile.net/**.

    <div class="dev-callout"><b>Note</b>
	<p>In a Windows Store app, an instance of the <strong>LiveAuthClient</strong> class is created by passing the redirect domain URI value to the class constructor. In a <a href="/en-us/develop/mobile/tutorials/single-sign-on-wp8/">Windows Phone 8 app</a>, the same class is instantiated by passing the client ID.</p>
    </div>

8. Replace the existing **OnNavigatedTo** event handler with the handler that calls the new **Authenticate** method:

        protected override async void OnNavigatedTo(NavigationEventArgs e)
        {
            await Authenticate();
            RefreshTodoItems();
        }
		
9. Press the F5 key to run the app and sign into Live Connect with your Microsoft Account. 

   When you are successfully logged-in, the app should run without errors, and you should be able to query Mobile Services and make updates to data.

## <a name="next-steps"> </a>Next steps

In the next tutorial, [Authorize users with scripts], you will take the user ID value provided by Mobile Services based on an authenticated user and use it to filter the data returned by Mobile Services. For information about how to use other identity providers for authentication, see [Get started with authentication]. Learn more about how to use Mobile Services with .NET in [Mobile Services .NET How-to Conceptual Reference]

<!-- Anchors. -->
[Register your app for authentication and configure Mobile Services]: #register
[Restrict table permissions to authenticated users]: #permissions
[Add authentication to the app]: #add-authentication
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-services-submit-win8-app.png
[1]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-services-win8-app-name.png
[2]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-services-store-association.png
[3]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-services-select-app-name.png
[4]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-services-selection.png
[5]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-service-uri.png
[6]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-live-connect-apps-list.png
[7]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-live-connect-app-api-settings.png





[13]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-identity-tab-ma-only.png
[14]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-portal-data-tables.png
[15]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-portal-change-table-perms.png
[16]: ./media/mobile-services-windows-store-dotnet-single-sign-on/mobile-add-reference-live-dotnet.png

<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-dotnet
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-dotnet
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-dotnet
[Authorize users with scripts]: /en-us/develop/mobile/tutorials/authorize-users-in-scripts-dotnet
[JavaScript and HTML]: /en-us/develop/mobile/tutorials/get-started-with-users-js

[Azure Management Portal]: https://manage.windowsazure.com/
[Mobile Services .NET How-to Conceptual Reference]: /en-us/develop/mobile/how-to-guides/work-with-net-client-library
