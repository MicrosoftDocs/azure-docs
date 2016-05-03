<properties
	pageTitle="Get Started with authentication for Mobile Apps in Xamarin.Forms app"
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
	ms.date="02/04/2016"
	ms.author="wesmc"/>

# Add authentication to your Xamarin.Forms app

[AZURE.INCLUDE [app-service-mobile-selector-get-started-users](../../includes/app-service-mobile-selector-get-started-users.md)]

##Overview

This topic shows you how to authenticate users of an App Service Mobile App from your client application. In this tutorial, you add authentication to the Xamarin.Forms quickstart project using an identity provider that is supported by App Service. After being successfully authenticated and authorized by your Mobile App, the user ID value is displayed and you will be able to access restricted table data.

You must first complete the [Create a Xamarin.Forms app](app-service-mobile-xamarin-forms-get-started.md) tutorial. If you do not use the downloaded quick start server project, you must add the authentication extension package to your project. For more information about server extension packages, see [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md).

##Register your app for authentication and configure App Services

[AZURE.INCLUDE [app-service-mobile-register-authentication](../../includes/app-service-mobile-register-authentication.md)]

##Restrict permissions to authenticated users

[AZURE.INCLUDE [app-service-mobile-restrict-permissions-dotnet-backend](../../includes/app-service-mobile-restrict-permissions-dotnet-backend.md)]


##Add authentication to the portable class library

Mobile Apps use a platform specific `MobileServiceClient.LoginAsync` method in order to display the login interface and cache data. To authenticate with a Xamarin Forms project you will define an `IAuthenticate` interface in the portable class library. Each platform you want to support will implement this interface in the platform specific project.

You will also update the user interface defined in the portable class library, adding a login button. The user will need to click this button to authenticate after the app starts.

1. In Visual Studio or Xamarin Studio, open App.cs from the **portable** project. Add the following `using` statement to the file.

		using System.Threading.Tasks;

2. In App.cs, add the following `IAuthenticate` interface definition immediately before the `App` class definition.

	    public interface IAuthenticate
	    {
	        Task<bool> Authenticate();
	    };

3. In App.cs, add the following static members to initialize the interface with a platform specific implementation.

		public class App : Application
		{

	        public static IAuthenticate Authenticator { get; private set; }

	        public static void Init(IAuthenticate authenticator)
	        {
	            Authenticator = authenticator;
	        }

			...


4. Open TodoList.xaml.cs from the **portable** project.  Add the following flag to the `TodoList` class to indicate whether or not the user has authenticated.

        bool authenticated = false;


5. In TodoList.xaml.cs update the `OnAppearing` method so that you only refresh the items if the user has authenticated.


        protected override async void OnAppearing()
        {
            base.OnAppearing();

            // Set syncItems to true in order to synchronize the data on startup when running in offline mode
            if (authenticated == true)
                await RefreshItems(true, syncItems: false);
        }

6. In TodoList.xaml.cs, at the top of the constructor for the `TodoList` class define the following login button and click handler...

        public TodoList()
        {
            InitializeComponent();

            manager = TodoItemManager.DefaultManager;

            var loginButton = new Button
            {
                Text = "Login",
                TextColor = Xamarin.Forms.Color.Black,
                BackgroundColor = Xamarin.Forms.Color.Lime,
            };
            loginButton.Clicked += loginButton_Clicked;

            Xamarin.Forms.StackLayout bp = buttonsPanel as StackLayout;
            Xamarin.Forms.StackLayout bpParentStack = bp.Parent.Parent as StackLayout;

            bpParentStack.Padding = new Xamarin.Forms.Thickness(10, 30, 10, 20);
            bp.Orientation = StackOrientation.Vertical;
            bp.Children.Add(loginButton);

			...

7. In TodoList.xaml.cs, add the following handler for the login button click event

        async void loginButton_Clicked(object sender, EventArgs e)
        {
            if (App.Authenticator != null)
                authenticated = await App.Authenticator.Authenticate();

            // Set syncItems to true in order to synchronize the data on startup when running in offline mode
            if (authenticated == true)
                await RefreshItems(true, syncItems: false);
        }


8. Save your changes and build the portable class library project verifying no errors.


##Add authentication to the Android app

In this section you will add authentication for the droid project. If you are not working with Android devices, you can skip this section.

1. In Visual Studio or Xamarin Studio, right click the **droid** project and click **Set as StartUp Project**.

2. Go ahead and run the project in the debugger to verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts. This will happen because you restricted access on the backend to authorized users only.

3. Next, open MainActivity.cs in the droid project and add the following `using` statement.

		using Microsoft.WindowsAzure.MobileServices;
		using System.Threading.Tasks;

4. Update the `MainActivity` class to implement the `IAuthenticate` interface.

		public class MainActivity : global::Xamarin.Forms.Platform.Android.FormsApplicationActivity, IAuthenticate


5. Update the `MainActivity` class by adding a `MobileServiceUser` field and the `Authenticate` method shown below to support the `IAuthenticate` interface.

	If you want to use a different `MobileServiceAuthenticationProvider` instead of Facebook, make that change as well.

		// Define a authenticated user.
		private MobileServiceUser user;

        public async Task<bool> Authenticate()
        {
            var success = false;
            try
            {
                // Sign in with Facebook login using a server-managed flow.
                user = await TodoItemManager.DefaultManager.CurrentClient.LoginAsync(this,
                    MobileServiceAuthenticationProvider.Facebook);
                CreateAndShowDialog(string.Format("you are now logged in - {0}",
                    user.UserId), "Logged in!");

                success = true;
            }
            catch (Exception ex)
            {
                CreateAndShowDialog(ex.Message, "Authentication failed");
            }
            return success;
        }

        private void CreateAndShowDialog(String message, String title)
        {
            AlertDialog.Builder builder = new AlertDialog.Builder(this);

            builder.SetMessage(message);
            builder.SetTitle(title);
            builder.Create().Show();
        }


6. Update the `OnCreate` method of the `MainActivity` class to initialize the authenticator before loading the app.

        App.Init((IAuthenticate)this);

        LoadApplication(new App());



7. Rebuild the app and run it.  Log in with the authentication provider you chose and verify you are able to access the table as an authenticated user.



##Add authentication to the iOS app

In this section you will add authentication for the iOS project. If you are not working with iOS devices, you can skip this section.

1. In Visual Studio or Xamarin Studio, right click the **iOS** project and click **Set as StartUp Project**.

2. Go ahead and run the project in the debugger to verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts. This will happen because you restricted access on the backend to authorized users only.

3. Next, open AppDelegate.cs in the iOS project and add the following `using` statement.

		using Microsoft.WindowsAzure.MobileServices;
		using System.Threading.Tasks;

4. Update the `AppDelegate` class to implement the `IAuthenticate` interface.

		public partial class AppDelegate : global::Xamarin.Forms.Platform.iOS.FormsApplicationDelegate, IAuthenticate


5. Update the `AppDelegate` class by adding a `MobileServiceUser` field and the `Authenticate` method shown below to support the `IAuthenticate` interface.

	If you want to use a different `MobileServiceAuthenticationProvider` instead of Facebook, make that change as well.

		// Define a authenticated user.
		private MobileServiceUser user;

        public async Task<bool> Authenticate()
        {
            var success = false;
            try
            {
                // Sign in with Facebook login using a server-managed flow.
                if (user == null)
                {
                    user = await TodoItemManager.DefaultManager.CurrentClient.LoginAsync(UIApplication.SharedApplication.KeyWindow.RootViewController,
                        MobileServiceAuthenticationProvider.Facebook);
                    if (user != null)
                    {
                        UIAlertView avAlert = new UIAlertView("Authentication", "You are now logged in " + user.UserId, null, "OK", null);
                        avAlert.Show();
                    }
                }

                success = true;
            }
            catch (Exception ex)
            {
                UIAlertView avAlert = new UIAlertView("Authentication failed", ex.Message, null, "OK", null);
                avAlert.Show();
            }
            return success;
        }

6. Update the `FinishedLaunching` method of the `AppDelegate` class to initialize the authenticator before loading the app.

        App.Init(this);

		LoadApplication (new App ());



7. Rebuild the app and run it.  Log in with the authentication provider you chose and verify you are able to access the table as an authenticated user.




##Add authentication to the Windows app

In this section you will add authentication for the WinApp project. If you are not working with Windows devices, you can skip this section.

1. In Visual Studio right click the **WinApp** project and click **Set as StartUp Project**.

2. Go ahead and run the project in the debugger to verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts. This will happen because you restricted access on the backend to authorized users only.

3. Next, open MainPage.xaml.cs in the WinApp project and add the following `using` statement. Replace <*Your portable class library namespace*> with the namespace for your portable class library.

		using Microsoft.WindowsAzure.MobileServices;
		using System.Threading.Tasks;
		using <Your portable class library namespace>;

4. Update the `MainPage` class to implement the `IAuthenticate` interface.

	    public sealed partial class MainPage : IAuthenticate


5. Update the `MainPage` class by adding a `MobileServiceUser` field and the `Authenticate` method shown below to support the `IAuthenticate` interface.

	If you want to use a different `MobileServiceAuthenticationProvider` instead of Facebook, make that change as well.

        // Define a authenticated user.
        private MobileServiceUser user;

        public async Task<bool> Authenticate()
        {
            var success = false;
            try
            {
                // Sign in with Facebook login using a server-managed flow.
                if (user == null)
                {
                    user = await TodoItemManager.DefaultManager.CurrentClient.LoginAsync(MobileServiceAuthenticationProvider.Facebook);
					if (user != null)
					{
	                    var messageDialog = new Windows.UI.Popups.MessageDialog(
								string.Format("you are now logged in - {0}", user.UserId), "Authentication");
	                    messageDialog.ShowAsync();
					}
                }

                success = true;
            }
            catch (Exception ex)
            {
                var messageDialog = new Windows.UI.Popups.MessageDialog(ex.Message, "Authentication Failed");
                messageDialog.ShowAsync();
            }
            return success;
        }

6. Update the constructor for the `MainPage` class to initialize the authenticator before loading the app. Replace <*Your portable class library namespace*> with the namespace for your portable class library.

        public MainPage()
        {
            this.InitializeComponent();

            <Your portable class library namespace>.App.Init(this);

            LoadApplication(new <Your portable class library namespace>.App());
        }



7. Rebuild the app and run it.  Log in with the authentication provider you chose and verify you are able to access the table as an authenticated user.


##Add authentication to the Windows Phone 8.1 app

In this section you will add authentication for the WinPhone81 project. If you are not working with Windows Phone 8.1 devices, you can skip this section.

1. In Visual Studio right click the **WinPhone81** project and click **Set as StartUp Project**.

2. Go ahead and run the project in the debugger to verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts. This will happen because you restricted access on the backend to authorized users only.


3. Next, open MainPage.xaml.cs in the WinPhone81 project and add the following `using` statement. Replace <*Your portable class library namespace*> with the namespace for your portable class library.

		using Microsoft.WindowsAzure.MobileServices;
		using System.Threading.Tasks;
		using <Your portable class library namespace>;

4. Update the `MainPage` class to implement the `IAuthenticate` interface.

	    public sealed partial class MainPage : IAuthenticate


5. Update the `MainPage` class by adding a `MobileServiceUser` field and the `Authenticate` method shown below to support the `IAuthenticate` interface.

	If you want to use a different `MobileServiceAuthenticationProvider` instead of Facebook, make that change as well.

        // Define a authenticated user.
        private MobileServiceUser user;

        public async Task<bool> Authenticate()
        {
            var success = false;
            try
            {
                // Sign in with Facebook login using a server-managed flow.
                if (user == null)
                {
                    user = await TodoItemManager.DefaultManager.CurrentClient.LoginAsync(MobileServiceAuthenticationProvider.Facebook);
					if (user != null)
					{
	                    var messageDialog = new Windows.UI.Popups.MessageDialog(
								string.Format("you are now logged in - {0}", user.UserId), "Authentication");
	                    messageDialog.ShowAsync();
					}
                }

                success = true;
            }
            catch (Exception ex)
            {
                var messageDialog = new Windows.UI.Popups.MessageDialog(ex.Message, "Authentication Failed");
                messageDialog.ShowAsync();
            }
            return success;
        }

6. Update the constructor for the `MainPage` class to initialize the authenticator before loading the app. Replace <*Your portable class library namespace*> with the namespace for your portable class library.

        public MainPage()
        {
            this.InitializeComponent();

            this.NavigationCacheMode = NavigationCacheMode.Required;

            <Your portable class library namespace>.App.Init(this);

            LoadApplication(new <Your portable class library namespace>.App());
        }

7. On Windows Phone you need to additionally complete the login. Open App.xaml.cs and add the following `using` statement and code to the `OnActivated` handler in the `App` class.

	```
		using Microsoft.WindowsAzure.MobileServices;
	```

		protected override void OnActivated(IActivatedEventArgs args)
		{
		    base.OnActivated(args);

		    if (args.Kind == ActivationKind.WebAuthenticationBrokerContinuation)
		    {
		        var client = TodoItemManager.DefaultManager.CurrentClient as MobileServiceClient;
		        client.LoginComplete(args as WebAuthenticationBrokerContinuationEventArgs);
		    }
		}



8. Rebuild the app and run it.  Log in with the authentication provider you chose and verify you are able to access the table as an authenticated user.

<!-- Images. -->

<!-- URLs. -->
[apns object]: http://go.microsoft.com/fwlink/p/?LinkId=272333


