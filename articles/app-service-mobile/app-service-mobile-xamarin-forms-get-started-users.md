<properties
	pageTitle="Get Started with authentication for Mobile Apps in Xamarin.Forms app | Microsoft Azure"
	description="Learn how to use Mobile Apps to authenticate users of your Xamarin Forms app through a variety of identity providers, including AAD, Google, Facebook, Twitter, and Microsoft."
	services="app-service\mobile"
	documentationCenter="xamarin"
	authors="wesmc7777"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-xamarin"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="06/16/2016"
	ms.author="wesmc"/>

# Add authentication to your Xamarin.Forms app

[AZURE.INCLUDE [app-service-mobile-selector-get-started-users](../../includes/app-service-mobile-selector-get-started-users.md)]

##Overview

This topic shows you how to authenticate users of an App Service Mobile App from your client application. In this tutorial, you add authentication to the Xamarin.Forms quickstart project using an identity provider that is supported by App Service. After being successfully authenticated and authorized by your Mobile App, the user ID value is displayed, and you will be able to access restricted table data.

##Prerequisites

For the best result with this tutorial, we recommend that you first complete the [Create a Xamarin.Forms app](app-service-mobile-xamarin-forms-get-started.md) tutorial. After you complete this tutorial, you will have a Xamarin.Forms project that is a multi-platform TodoList app.

If you do not use the downloaded quick start server project, you must add the authentication extension package to your project. For more information about server extension packages, see [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md).

##Register your app for authentication and configure App Services

[AZURE.INCLUDE [app-service-mobile-register-authentication](../../includes/app-service-mobile-register-authentication.md)]

##Restrict permissions to authenticated users

[AZURE.INCLUDE [app-service-mobile-restrict-permissions-dotnet-backend](../../includes/app-service-mobile-restrict-permissions-dotnet-backend.md)]


##Add authentication to the portable class library

Mobile Apps uses the [LoginAsync] extension method on the [MobileServiceClient] to sign-in a user with App Service authentication. This sample uses a server-managed authentication flow that displays the provider's sign-in interface in the app. For more information, see [Server-managed authentication](app-service-mobile-dotnet-how-to-use-client-library.md#serverflow). To provide a better user experience in your production app, you may consider instead using [Client-managed authentication](app-service-mobile-dotnet-how-to-use-client-library.md#clientflow). 

To authenticate with a Xamarin.Forms project, you define an **IAuthenticate** interface in the Portable Class Library for the app. You also update the user interface defined in the Portable Class Library to add a **Sign-in** button, which the user clicks to start authentication. After successful authentication, data is loaded from the mobile app backend.

You must implement the **IAuthenticate** interface for each platform supported by your app.


1. In Visual Studio or Xamarin Studio, open App.cs from the project with **Portable** in the name, which is Portable Class Library project, then add the following `using` statement:

		using System.Threading.Tasks;

2. In App.cs, add the following `IAuthenticate` interface definition immediately before the `App` class definition.

	    public interface IAuthenticate
	    {
	        Task<bool> Authenticate();
	    }

3. Add the following static members to the **App** class to initialize the interface with a platform specific implementation.

	    public static IAuthenticate Authenticator { get; private set; }

        public static void Init(IAuthenticate authenticator)
        {
            Authenticator = authenticator;
        }

4. Open TodoList.xaml from the Portable Class Library project, add the following **Button** element in the *buttonsPanel* layout element, after the existing button: 

      	<Button x:Name="loginButton" Text="Sign-in" MinimumHeightRequest="30" 
			Clicked="loginButton_Clicked"/>

	This button triggers server-managed authentication with your mobile app backend.

5. Open TodoList.xaml.cs from the Portable Class Library project, then add the following field to the `TodoList` class:

		// Track whether the user has authenticated. 
        bool authenticated = false;


6. Replace the **OnAppearing** method with the following code:

	    protected override async void OnAppearing()
	    {
	        base.OnAppearing();
	
	        // Refresh items only when authenticated.
	        if (authenticated == true)
	        {
	            // Set syncItems to true in order to synchronize the data 
	            // on startup when running in offline mode.
	            await RefreshItems(true, syncItems: false);

				// Hide the Sign-in button.
                this.loginButton.IsVisible = false;
	        }
	    }

	This makes sure that data is only refreshed from the service after the user has been authenticated.

7. Add the following handler for the **Clicked** event to the **TodoList** class:

        async void loginButton_Clicked(object sender, EventArgs e)
        {
            if (App.Authenticator != null)
                authenticated = await App.Authenticator.Authenticate();

            // Set syncItems to true to synchronize the data on startup when offline is enabled.
            if (authenticated == true)
                await RefreshItems(true, syncItems: false);
        }

8. Save your changes and rebuild the Portable Class Library project verifying no errors.


##Add authentication to the Android app

This section shows how to implement the **IAuthenticate** interface in the Android app project. Skip this section if you are not supporting Android devices.

1. In Visual Studio or Xamarin Studio, right-click the **droid** project, then **Set as StartUp Project**.

2. Press F5 to start the project in the debugger, then verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts. This happens because access on the backend is restricted to authorized users only.

3. Open MainActivity.cs in the Android project and add the following `using` statements:

		using Microsoft.WindowsAzure.MobileServices;
		using System.Threading.Tasks;

4. Update the **MainActivity** class to implement the **IAuthenticate** interface, as follows:

		public class MainActivity : global::Xamarin.Forms.Platform.Android.FormsApplicationActivity, IAuthenticate


5. Update the **MainActivity** class by adding a **MobileServiceUser** field and an **Authenticate** method, which is required by the **IAuthenticate** interface, as follows:

        // Define a authenticated user.
        private MobileServiceUser user;

        public async Task<bool> Authenticate()
        {
            var success = false;
            var message = string.Empty;
            try
            {
                // Sign in with Facebook login using a server-managed flow.
                user = await TodoItemManager.DefaultManager.CurrentClient.LoginAsync(this,
                    MobileServiceAuthenticationProvider.Facebook);
                if (user != null)
                {
                    message = string.Format("you are now signed-in as {0}.",
                        user.UserId);
                    success = true;
                }
            }
            catch (Exception ex)
            {
                message = ex.Message;
            }

            // Display the success or failure message.
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.SetMessage(message);
            builder.SetTitle("Sign-in result");
            builder.Create().Show();

            return success;
        }


	If you are using an identity provider other than Facebook, choose a different value for [MobileServiceAuthenticationProvider].

6. Add the following code to the **OnCreate** method of the **MainActivity** class before the call to `LoadApplication()`:

        // Initialize the authenticator before loading the app.
        App.Init((IAuthenticate)this);

	This makes sure that the authenticator is initialized before the app loads.

7. Rebuild the app, run it, then sign-in with the authentication provider you chose and verify you are able to access data as an authenticated user.

##Add authentication to the iOS app

This section shows how to implement the **IAuthenticate** interface in the iOS app project. Skip this section if you are not supporting iOS devices.

1. In Visual Studio or Xamarin Studio, right-click the **iOS** project, then **Set as StartUp Project**.

2. Press F5 to start the project in the debugger, then verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts. This happens because access on the backend is restricted to authorized users only.

4. Open AppDelegate.cs in the iOS project and add the following `using` statements:

		using Microsoft.WindowsAzure.MobileServices;
		using System.Threading.Tasks;

4. Update the **AppDelegate** class to implement the **IAuthenticate** interface, as follows:

		public partial class AppDelegate : global::Xamarin.Forms.Platform.iOS.FormsApplicationDelegate, IAuthenticate

5. Update the **AppDelegate** class by adding a **MobileServiceUser** field and an **Authenticate** method, which is required by the **IAuthenticate** interface, as follows:

        // Define a authenticated user.
        private MobileServiceUser user;

        public async Task<bool> Authenticate()
        {
            var success = false;
            var message = string.Empty;
            try
            {
                // Sign in with Facebook login using a server-managed flow.
                if (user == null)
                {
                    user = await TodoItemManager.DefaultManager.CurrentClient
                        .LoginAsync(UIApplication.SharedApplication.KeyWindow.RootViewController,
                        MobileServiceAuthenticationProvider.Facebook);
                    if (user != null)
                    {
                        message = string.Format("You are now signed-in as {0}.", user.UserId);
                        success = true;                        
                    }
                }        
            }
            catch (Exception ex)
            {
               message = ex.Message;
            }

            // Display the success or failure message.
            UIAlertView avAlert = new UIAlertView("Sign-in result", message, null, "OK", null);
            avAlert.Show();         

            return success;
        }

	If you are using an identity provider other than Facebook, choose a different value for [MobileServiceAuthenticationProvider].

6. Add the following line of code to the **FinishedLaunching** method before the call to `LoadApplication()`: 

        App.Init(this);

	This makes sure that the authenticator is initialized before the app is loaded.

7. Rebuild the app, run it, then sign-in with the authentication provider you chose and verify you are able to access data as an authenticated user.


##Add authentication to Windows app projects

This section shows how to implement the **IAuthenticate** interface in the Windows 8.1 and Windows Phone 8.1 app projects. The same steps apply for Universal Windows Platform (UWP) projects. Skip this section if you are not supporting Windows devices.

1. In Visual Studio, right-click either the **WinApp** or the **WinPhone81** project, then **Set as StartUp Project**.

2. Press F5 to start the project in the debugger, then verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts. This happens because access on the backend is restricted to authorized users only.

3. Open MainPage.xaml.cs for the Windows app project and add the following `using` statements:

		using Microsoft.WindowsAzure.MobileServices;
		using System.Threading.Tasks;
		using Windows.UI.Popups;
		using <your_Portable_Class_Library_namespace>;

	Replace `<your_Portable_Class_Library_namespace>` with the namespace for your portable class library.

4. Update the **MainPage** class to implement the **IAuthenticate** interface, as follows:

	    public sealed partial class MainPage : IAuthenticate


5. Update the **MainPage** class by adding a **MobileServiceUser** field and an **Authenticate** method, which is required by the **IAuthenticate** interface, as follows:

        // Define a authenticated user.
        private MobileServiceUser user;

        public async Task<bool> Authenticate()
        {
            string message = string.Empty;
            var success = false;

            try
            {
                // Sign in with Facebook login using a server-managed flow.
                if (user == null)
                {
                    user = await TodoItemManager.DefaultManager.CurrentClient
                        .LoginAsync(MobileServiceAuthenticationProvider.Facebook);
                    if (user != null)
                    {
						success = true;
                        message = string.Format("You are now signed-in as {0}.", user.UserId);
                    }
                }
                
            }
            catch (Exception ex)
            {
                message = string.Format("Authentication Failed: {0}", ex.Message);
            }

			// Display the success or failure message.
            await new MessageDialog(message, "Sign-in result").ShowAsync();

            return success;
        }


	If you are using an identity provider other than Facebook, choose a different value for [MobileServiceAuthenticationProvider].

6. Add the following line of code in the constructor for the **MainPage** class before the call to `LoadApplication()`:

        // Initialize the authenticator before loading the app.
        <your_Portable_Class_Library_namespace>.App.Init(this);
 
    Replace `<your_Portable_Class_Library_namespace>` with the namespace for your portable class library.  
	If this is the WinApp project, you can skip down to step 8. The next step applies only to the WinPhone81 project, where you need to complete the login callback.

7. (Optional) In the **WinPhone81** app project, open App.xaml.cs and add the following `using` statements:

		using Microsoft.WindowsAzure.MobileServices;
		using <your_Portable_Class_Library_namespace>;

	Replace `<your_Portable_Class_Library_namespace>` with the namespace for your portable class library.

8.  Add the following **OnActivated** method override to the **App** class:

		protected override void OnActivated(IActivatedEventArgs args)
		{
		    base.OnActivated(args);

			// We just need to handle activation that occurs after web authentication. 
		    if (args.Kind == ActivationKind.WebAuthenticationBrokerContinuation)
		    {
				// Get the client and call the LoginComplete method to complete authentication.
		        var client = TodoItemManager.DefaultManager.CurrentClient as MobileServiceClient;
		        client.LoginComplete(args as WebAuthenticationBrokerContinuationEventArgs);
		    }
		}

	When the method override already exists, just add the conditional code from the above snippet.

7. Rebuild the app, run it, then sign-in with the authentication provider you chose and verify you are able to access data as an authenticated user.

##Next steps

Now that you completed this basic authentication tutorial, consider continuing on to one of the following tutorials:

+ [Add push notifications to your app](app-service-mobile-xamarin-forms-get-started-push.md)  
  Learn how to add push notifications support to your app and configure your Mobile App backend to use Azure Notification Hubs to send push notifications.

+ [Enable offline sync for your app](app-service-mobile-xamarin-forms-get-started-offline-data.md)  
  Learn how to add offline support your app using an Mobile App backend. Offline sync allows end-users to interact with a mobile app&mdash;viewing, adding, or modifying data&mdash;even when there is no network connection.

<!-- Images. -->

<!-- URLs. -->
[apns object]: http://go.microsoft.com/fwlink/p/?LinkId=272333
[LoginAsync]: https://msdn.microsoft.com/library/azure/dn268341(v=azure.10).aspx
[MobileServiceClient]: https://msdn.microsoft.com/library/azure/JJ553674(v=azure.10).aspx
[MobileServiceAuthenticationProvider]: https://msdn.microsoft.com/library/azure/jj730936(v=azure.10).aspx

