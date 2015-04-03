<properties 
	pageTitle="Authenticate your Windows Store app with Live Connect" 
	description="Learn how to use Live Connect single sign-on in Azure Mobile Services from a Windows Store application." 
	services="mobile-services" 
	documentationCenter="windows" 
	authors="ggailey777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="03/23/2015" 
	ms.author="glenga"/>

# Authenticate your Windows Store app using a Microsoft account with client flow

[AZURE.INCLUDE [mobile-services-selector-single-signon](../includes/mobile-services-selector-single-signon.md)]	

This topic shows you how to obtain an authentication token for Microsoft account using the Live SDK from a Windows Store app. You then use this token to authenticate users in Azure Mobile Services.  In this tutorial, you add Microsoft account authentication to an existing project using the Live SDK. When successfully authenticated, a logged-in user is welcomed by name and the user ID value is displayed.  

>[AZURE.NOTE]This tutorial demonstrates the benefits of using the single sign-on experience provided by the Live SDK. This enables you to more easily authenticate an already logged-on user with you mobile service. For a more generalized authentication experience that supports multiple authentication providers, see the topic [Get started with authentication](mobile-services-javascript-backend-windows-universal-dotnet-get-started-users.md). 

This tutorial walks you through these basic steps to enable Microsoft account authentication using the Live SDK:

1. [Register your app for authentication and configure Mobile Services]
2. [Restrict table permissions to authenticated users]
3. [Add authentication to the app]

This tutorial requires the following:

+ [Live SDK]
+ Microsoft Visual Studio 2013 Update 3, or a later version.
+ You must also first complete either [Get started with Mobile Services](mobile-services-javascript-backend-windows-store-dotnet-get-started.md) or [Add Mobile Services to an existing app] tutorials.

##<a name="register"></a>Register your app for the Windows Store

To be able to authenticate users, you must submit your app to the Windows Store. You must then register the client secret to integrate Live Connect with Mobile Services.

[AZURE.INCLUDE [mobile-services-register-windows-store-app](../includes/mobile-services-register-windows-store-app.md)]

##<a name="permissions"></a>Restrict permissions to authenticated users

[AZURE.INCLUDE [mobile-services-restrict-permissions-windows](../includes/mobile-services-restrict-permissions-windows.md)] 

##<a name="add-authentication"></a>Add authentication to the app

1. In **Solution Explorer**, right-click the solution, and then select **Manage NuGet Packages**.

2. In the left pane, select the **Online** category, search for **LiveSDK**, click **Install** on the **Live SDK** package, select all projects, then accept the license agreements. 

  	This adds the Live SDK to the project.

3. Open the shared project file MainPage.xaml.cs and add the following using statement:

        using Microsoft.Live;        

4. Add the following code snippet to the **MainPage** class:
	
        private LiveConnectSession session;
        private async System.Threading.Tasks.Task AuthenticateAsync()
        {
            // Build the redirect URL of a JavaScript backend mobile service.
            var redirectUrl = App.MobileService.ApplicationUri.ToString() + "login/microsoftaccount/";

            // Create the authentication client using the redirect URL.
            LiveAuthClient liveIdClient = new LiveAuthClient(redirectUrl);

            while (session == null)
            {
                //// Force a sign out to make it easier to test with multiple Microsoft accounts
                //if (liveIdClient.CanLogout)
                //    liveIdClient.Logout();

                // Request the authentication token from the Live authentication service.
                LiveLoginResult result = await liveIdClient.LoginAsync(new string[] { "wl.basic" });
                if (result.Status == LiveConnectSessionStatus.Connected)
                {
                    session = result.Session;

                    // Get information about the logged-in user.
                    LiveConnectClient client = new LiveConnectClient(session);
                    LiveOperationResult meResult = await client.GetAsync("me");

                    // Use the Microsoft account auth token to sign in to Mobile Services.
                    MobileServiceUser loginResult = await App.MobileService
                        .LoginWithMicrosoftAccountAsync(result.Session.AuthenticationToken);

                    // Display a personalized sign-in greeting.
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

	>[AZURE.NOTE]You should try to use cached Live authentiction tokens or Mobile Services authorization tokens before requesting new tokens from the services. If you don't do this, you might have usage-relates issues should many customers try to start your app at the same time. For an example of how to cache this token, see [Get started with authentication](mobile-services-windows-store-dotnet-get-started-users.md#tokens)

8. Replace the existing **OnNavigatedTo** event handler with the handler that calls the new **Authenticate** method:

        protected override async void OnNavigatedTo(NavigationEventArgs e)
        {
            await AuthenticateAsync();
            RefreshTodoItems();
        }
		
9. Press the F5 key to run the app and sign into Live Connect with your Microsoft account. 

   When you are successfully logged-in, the app should run without errors, and you should be able to query Mobile Services and make updates to data.

## <a name="next-steps"> </a>Next steps

In the next tutorial, [Authorize users with scripts], you will take the user ID value provided by Mobile Services based on an authenticated user and use it to filter the data returned by Mobile Services. For information about how to use other identity providers for authentication, see [Get started with authentication]. Learn more about how to use Mobile Services with .NET in [Mobile Services .NET How-to Conceptual Reference]

<!-- Anchors. -->
[Register your app for authentication and configure Mobile Services]: #register
[Restrict table permissions to authenticated users]: #permissions
[Add authentication to the app]: #add-authentication
[Next Steps]:#next-steps

<!-- Images. -->

<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039 

[Add Mobile Services to an existing app]: mobile-services-windows-store-dotnet-get-started-data.md
[Get started with authentication]: mobile-services-windows-store-dotnet-get-started-users.md
[Authorize users with scripts]: mobile-services-windows-store-dotnet-authorize-users-in-scripts.md

[Azure Management Portal]: https://manage.windowsazure.com/
[Mobile Services .NET How-to Conceptual Reference]: mobile-services-windows-dotnet-how-to-use-client-library.md
[Live SDK]: http://go.microsoft.com/fwlink/p/?LinkId=262253
