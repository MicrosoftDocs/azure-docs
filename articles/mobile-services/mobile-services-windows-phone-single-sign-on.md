<properties
	pageTitle="Authenticate your app with Live Connect (Windows Phone) | Microsoft Azure"
	description="Learn how to use Live Connect single sign-on in Azure Mobile Services from a Windows Phone application."
	services="mobile-services"
	documentationCenter="windows"
	authors="ggailey777"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-windows-phone"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="08/18/2015" 
	ms.author="glenga"/>

# Authenticate your Windows Phone app with client managed authentication using Microsoft account

[AZURE.INCLUDE [mobile-services-selector-single-signon](../../includes/mobile-services-selector-single-signon.md)]
##Overview
This topic shows you how to obtain an authentication token for Microsoft account using the Live SDK from a Windows Phone 8 or Windows Phone 8.1 Silverlight app. You then use this token to authenticate users with Azure Mobile Services. In this tutorial, you add Microsoft account authentication to an existing project using the Live SDK. When successfully authenticated, a logged-in user is welcomed by name and the user ID value is displayed.  

>[AZURE.NOTE]This tutorial demonstrates the benefits of using client-managed authentication and the Live SDK. This enables you to more easily authenticate an already logged-on user with you mobile service. You can also request additional scopes to enable your app to also access resources like OneDrive.
>Service-managed authentication provides a more generalized experience and supports multiple authentication providers. For more information about service-managed authentication, see the topic [Add authentication to your app](mobile-services-windows-phone-get-started-users.md).

This tutorial requires the following:

+ [Live SDK]
+ Microsoft Visual Studio 2013 Update 3, or a later version
+ You must also first complete the tutorial [Add Mobile Services to an existing app].

##Register your app to use Microsoft account

To be able to authenticate users, you must register your app at the Microsoft account Developer Center. You must then connect this registration with your mobile service. Please complete the steps in the following topic to create a Microsoft account registration and connect it to your mobile service.

+ [Register your app to use a Microsoft account login](mobile-services-how-to-register-microsoft-authentication.md)

##<a name="permissions"></a>Restrict permissions to authenticated users

You next need to restrict access to a resource, in this case the *TodoItems* table to make sure it can only be accessed by a signed-in user.

[AZURE.INCLUDE [mobile-services-restrict-permissions-windows](../../includes/mobile-services-restrict-permissions-windows.md)]

##<a name="add-authentication"></a>Add authentication to the app

Finally, you add the Live SDK and use it to authenticate users in your app.

1. In **Solution Explorer**, right-click the solution, and then select **Manage NuGet Packages**.

2. In the left pane, select the **Online** category, search for **LiveSDK**, click **Install** on the **Live SDK** package, select all projects, then accept the license agreements.

  	This adds the Live SDK to the solution.

5. Open the project file mainpage.xaml.cs and add the following using statements:

        using Microsoft.Live;

6. Add the following code snippet to the MainPage class:

        private LiveConnectSession session;
        private static string clientId = "<microsoft-account-client-id>";
        private async System.Threading.Tasks.Task AuthenticateAsync()
        {
            // Create the authentication client using the client ID of the registration.
            LiveAuthClient liveIdClient = new LiveAuthClient(clientId);

            while (session == null)
            {
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
                    MessageBox.Show(message, title, MessageBoxButton.OK);
                }
                else
                {
                    session = null;
                    MessageBox.Show("You must log in.", "Login Required", MessageBoxButton.OK);
                }
            }
        }

    This creates a member variable for storing the current Live Connect session and a method to handle the authentication process. The LiveLoginResult contains the authentication token that is given to Mobile Services to authenticate the user.

7. In the code snippet above, replace the placeholder `<microsoft-account-client-id>` with the client ID that you obtained from the Microsoft account registration for your app.

5. Comment-out or delete the call to the **RefreshTodoItems** method in the existing **OnNavigatedTo** method override.

	This prevents the data from being loaded before the user is authenticated. Next, you will add a button to start the sign-in process.

6. Add the following code snippet to the MainPage class:

        private async void ButtonLogin_Click(object sender, RoutedEventArgs e)
        {
            // Login the user and then load data from the mobile service.
            await AuthenticateAsync();

            // Hide the login button and load items from the mobile service.
            this.ButtonLogin.Visibility = System.Windows.Visibility.Collapsed;
            RefreshTodoItems();
        }

7. In the app project, open the MainPage.xaml project file and add the following **Button** element in the **TitlePanel**, after the **TextBlock** element:

		<Button Name="ButtonLogin" Click="ButtonLogin_Click"
                        Visibility="Visible">Sign in</Button>

9. Press the F5 key to run the app and sign in with your Microsoft account.

   When you are successfully logged-in, the app should run without errors, and you should be able to query Mobile Services and make updates to data.

Now, any user authenticated by one of your registered identity providers can access the *TodoItem* table. To better secure user-specific data, you must also implement authorization. To do this you get the user ID of a given user, which can then be used to determine what level of access that user should have for a given resource.

## <a name="next-steps"> </a>Next steps

In the next tutorial, [Authorize users with scripts], you will take the user ID value provided by Mobile Services based on an authenticated user and use it to filter the data returned by Mobile Services. For information about how to use other identity providers for authentication, see [Get started with authentication].

<!-- Anchors. -->
[Register your app for authentication and configure Mobile Services]: #register
[Restrict table permissions to authenticated users]: #permissions
[Add authentication to the app]: #add-authentication
[Next Steps]:#next-steps

<!-- Images. -->


<!-- URLs. -->
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Add Mobile Services to an existing app]: mobile-services-windows-phone-get-started-data.md
[Get started with authentication]: mobile-services-windows-phone-get-started-users.md
[Authorize users with scripts]: ../mobile-services-windows-phone-authorize-users-in-scripts.md

[Azure Management Portal]: https://manage.windowsazure.com/
