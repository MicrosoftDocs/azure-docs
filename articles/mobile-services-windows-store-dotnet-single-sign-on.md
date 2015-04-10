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
	ms.date="04/08/2015" 
	ms.author="glenga"/>

# Authenticate your Windows Store app with client managed authentication using Microsoft account

[AZURE.INCLUDE [mobile-services-selector-single-signon](../includes/mobile-services-selector-single-signon.md)]	

##Overview
This topic shows you how to obtain an authentication token for Microsoft account using the Live SDK from a universal Windows app. You then use this token to authenticate users with Azure Mobile Services.  In this tutorial, you add Microsoft account authentication to an existing project using the Live SDK. When successfully authenticated, a logged-in user is welcomed by name and the user ID value is displayed.  

>[AZURE.NOTE]This tutorial demonstrates the benefits of using client-directed authentication and the Live SDK. This enables you to more easily authenticate an already logged-on user with you mobile service. You can also request additional scopes to enable your app to also access resources like OneDrive. 
>Service-directed authentication provides a more generalized experience and supports multiple authentication providers. For more information about service-directed authentication, see the topic [Add authentication to your app](mobile-services-javascript-backend-windows-universal-dotnet-get-started-users.md). 

This tutorial requires the following:

+ [Live SDK]
+ Microsoft Visual Studio 2013 Update 3, or a later version.
+ You must also first complete either [Get started with Mobile Services](mobile-services-javascript-backend-windows-store-dotnet-get-started.md) or [Add Mobile Services to an existing app] tutorials.

##Register your app to use Microsoft account for authentication

To be able to authenticate users, you must register your app at the Microsoft account Developer Center. You must then connect this registration with your mobile service. Please complete the steps in the following topic to create a Microsoft account registration and connect it to your mobile service.

+ [Register your app to use a Microsoft account login](mobile-services-how-to-register-microsoft-authentication.md)

##<a name="permissions"></a>Restrict permissions to authenticated users

You next need to restrict access to a resource, in this case the *TodoItems* table to make sure it can only be accessed by a signed-in user.

[AZURE.INCLUDE [mobile-services-restrict-permissions-windows](../includes/mobile-services-restrict-permissions-windows.md)] 

##<a name="add-authentication"></a>Add authentication to the app

Finally, you add the Live SDK and use it to authenticate users in your app.

1. In **Solution Explorer**, right-click the solution, and then select **Manage NuGet Packages**.

2. In the left pane, select the **Online** category, search for **LiveSDK**, click **Install** on the **Live SDK** package, select all projects, then accept the license agreements. 

  	This adds the Live SDK to the solution.

3. Open the shared project file MainPage.xaml.cs and add the following using statement:

        using Microsoft.Live;        

4. Add the following code snippet to the **MainPage** class:
	
        private LiveConnectSession session;
        private async System.Threading.Tasks.Task AuthenticateAsync()
        {

            // Get the URL the mobile service.
            var serviceUrl = App.MobileService.ApplicationUri.AbsoluteUri;

            // Create the authentication client using the mobile service URL.
            LiveAuthClient liveIdClient = new LiveAuthClient(serviceUrl);

            while (session == null)
            {
                // Request the authentication token from the Live authentication service.
				// The wl.basic scope is requested.
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

5. Comment-out or delete the call to the **RefreshTodoItems** method in the existing **OnNavigatedTo** method override.

	This prevents the data from being loaded before the user is authenticated. Next, you will add a button to start the sign-in process.

6. Add the following code snippet to the MainPage class:

        private async void ButtonLogin_Click(object sender, RoutedEventArgs e)
        {
            // Login the user and then load data from the mobile service.
            await AuthenticateAsync();

            // Hide the login button and load items from the mobile service.
            this.ButtonLogin.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
            await RefreshTodoItems();
        }
		
7. In the Windows Store app project, open the MainPage.xaml project file and add the following **Button** element just before the element that defines the **Save** button:

		<Button Name="ButtonLogin" Click="ButtonLogin_Click" 
                        Visibility="Visible">Sign in</Button>

8. Repeat the previous step for the Windows Phone Store app project, but this time add the **Button** in the **TitlePanel**, after the **TextBlock** element.
		
9. Press the F5 key to run the app and sign into Live Connect with your Microsoft account. 

	When you are successfully logged-in, the app should run without errors, and you should be able to query Mobile Services and make updates to data.

10. Right-click the Windows Phone Store app project, click **Set as StartUp Project**, then repeat the previous step to verify that the Windows Phone Store app also runs correctly.

Now, any user authenticated by one of your registered identity providers can access the *TodoItem* table. To better secure user-specific data, you must also implement authorization. To do this you get the user ID of a given user, which can then be used to determine what level of access that user should have for a given resource.

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
[Authorize users with scripts]: mobile-services-javascript-backend-service-side-authorization.md

[Azure Management Portal]: https://manage.windowsazure.com/
[Mobile Services .NET How-to Conceptual Reference]: mobile-services-windows-dotnet-how-to-use-client-library.md
[Live SDK]: http://go.microsoft.com/fwlink/p/?LinkId=262253
