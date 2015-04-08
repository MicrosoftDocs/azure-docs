<properties 
	pageTitle="Authenticate your app with Live Connect (Windows Phone) | Mobile Dev Center" 
	description="Learn how to use Live Connect single sign-on in Azure Mobile Services from a Windows Phone application." 
	services="mobile-services" 
	documentationCenter="windows" 
	authors="ggailey777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="11/22/2014" 
	ms.author="glenga"/>

# Authenticate your Windows Phone app using a Microsoft account with client flow

[AZURE.INCLUDE [mobile-services-selector-single-signon](../includes/mobile-services-selector-single-signon.md)]	
##Overview
This topic shows you how to obtain an authentication token for Microsoft account using the Live SDK from a Windows Phone 8 or Windows Phone 8.1 Silverlight app. You then use this token to authenticate users with Azure Mobile Services. In this tutorial, you add Microsoft account authentication to an existing project using the Live SDK. When successfully authenticated, a logged-in user is welcomed by name and the user ID value is displayed.  

>[AZURE.NOTE]This tutorial demonstrates the benefits of using the single sign-on experience provided by Live SDK for Windows Phone apps. This enables you to more easily authenticate an already logged-on user with you mobile service. For a more generalized authentication experience that supports multiple authentication providers, see the topic <a href="mobile-services-windows-phone-get-started-users.md">Add authentication to your app</a>. 

This tutorial requires the following:

+ [Live SDK]
+ Microsoft Visual Studio 2013 Update 3, or a later version
+ You must also first complete the tutorial [Add Mobile Services to an existing app].

##Register your app to use a Microsoft account login

To be able to authenticate users, you must register your app at the Microsoft account Developer Center. You must then connect this registration with your mobile service. Please complete the steps in the following topic to create a Microsoft account registration and connect it to your mobile service:

+ [Register your app to use a Microsoft account login](mobile-services-how-to-register-microsoft-authentication.md) 

##<a name="permissions"></a>Restrict permissions to authenticated users

[AZURE.INCLUDE [mobile-services-restrict-permissions-windows](../includes/mobile-services-restrict-permissions-windows.md)] 

##<a name="add-authentication"></a>Add authentication to the app

1. In **Solution Explorer**, right-click the solution, and then select **Manage NuGet Packages**.

2. In the left pane, select the **Online** category, search for **LiveSDK**, click **Install** on the **Live SDK** package, select all projects, then accept the license agreements. 

  	This adds the Live SDK to the solution.

5. Open the project file mainpage.xaml.cs and add the following using statements:

        using Microsoft.Live;      

6. Add the following code snippet to the MainPage class:
	
        private LiveConnectSession session;
        private async System.Threading.Tasks.Task AuthenticateAsync()
        {
            // Get the URL the mobile service.
            var serviceUrl = App.MobileService.ApplicationUri.AbsoluteUri;

            // Create the authentication client using the mobile service URL.
            LiveAuthClient liveIdClient = new LiveAuthClient(serviceUrl);

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

    This creates a member variable for storing the current Live Connect session and a method to handle the authentication process.

8. Delete or comment-out the existing **OnNavigatedTo** method override and replace it with the following method that handles the **Loaded** event for the page. 

        async void MainPage_Loaded(object sender, RoutedEventArgs e)
        {
            await Authenticate();
            RefreshTodoItems();
        }

   	This method calls the new **Authenticate** method. 

9. Replace the MainPage constructor with the following code:

        // Constructor
        public MainPage()
        {
            InitializeComponent();
            this.Loaded += MainPage_Loaded;
        }

   	This constructor also registers the handler for the Loaded event.
		
9. Press the F5 key to run the app and sign into Live Connect with your Microsoft Account. 

   	After you are successfully logged-in, the app runs without errors, and you are able to query Mobile Services and make updates to data.

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
[Authorize users with scripts]: mobile-services-windows-phone-authorize-users-in-scripts.md

[Azure Management Portal]: https://manage.windowsazure.com/
