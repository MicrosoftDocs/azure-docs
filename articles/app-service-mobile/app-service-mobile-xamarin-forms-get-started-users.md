---
title: Get Started with authentication for Mobile Apps in Xamarin Forms app | Microsoft Docs
description: Learn how to use Mobile Apps to authenticate users of your Xamarin Forms app through a variety of identity providers, including AAD, Google, Facebook, Twitter, and Microsoft.
services: app-service\mobile
documentationcenter: xamarin
author: adrianhall
manager: adrianha
editor: ''

ms.assetid: 9c55e192-c761-4ff2-8d88-72260e9f6179
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-xamarin
ms.devlang: dotnet
ms.topic: article
ms.date: 10/01/2016
ms.author: adrianha

---
# Add authentication to your Xamarin Forms app
[!INCLUDE [app-service-mobile-selector-get-started-users](../../includes/app-service-mobile-selector-get-started-users.md)]

## Overview
This topic shows you how to authenticate users of an App Service Mobile App from your client application. In this tutorial, you add authentication to
the Xamarin Forms quickstart project using an identity provider that is supported by App Service. After being successfully authenticated and authorized
by your Mobile App, the user ID value is displayed, and you will be able to access restricted table data.

## Prerequisites
For the best result with this tutorial, we recommend that you first complete the [Create a Xamarin Forms app][1] tutorial. After you complete this
tutorial, you will have a Xamarin Forms project that is a multi-platform TodoList app.

If you do not use the downloaded quick start server project, you must add the authentication extension package to your project. For more information
about server extension packages, see [Work with the .NET backend server SDK for Azure Mobile Apps][2].

## Register your app for authentication and configure App Services
[!INCLUDE [app-service-mobile-register-authentication](../../includes/app-service-mobile-register-authentication.md)]

## Restrict permissions to authenticated users
[!INCLUDE [app-service-mobile-restrict-permissions-dotnet-backend](../../includes/app-service-mobile-restrict-permissions-dotnet-backend.md)]

## Add authentication to the portable class library
Mobile Apps uses the [LoginAsync][3] extension method on the [MobileServiceClient][4] to sign in a user with App Service authentication. This sample
uses a server-managed authentication flow that displays the provider's sign-in interface in the app. For more information, see [Server-managed authentication][5]. To
provide a better user experience in your production app, you should consider instead using [Client-managed authentication][6].

To authenticate with a Xamarin Forms project, define an **IAuthenticate** interface in the Portable Class Library for the app. Then add a **Sign-in** button
to the user interface defined in the Portable Class Library, which you click to start authentication. Data is loaded from the mobile app backend after
successful authentication.

Implement the **IAuthenticate** interface for each platform supported by your app.

1. In Visual Studio or Xamarin Studio, open App.cs from the project with **Portable** in the name, which is Portable Class Library project, then
    add the following `using` statement:
   
        using System.Threading.Tasks;
2. In App.cs, add the following `IAuthenticate` interface definition immediately before the `App` class definition.
   
        public interface IAuthenticate
        {
            Task<bool> Authenticate();
        }
3. To initialize the interface with a platform-specific implementation, add the following static members to the **App** class.
   
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
   
    This code makes sure that data is only refreshed from the service after you have been authenticated.
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

## Add authentication to the Android app
This section shows how to implement the **IAuthenticate** interface in the Android app project. Skip this section if you are not supporting Android devices.

1. In Visual Studio or Xamarin Studio, right-click the **droid** project, then **Set as StartUp Project**.
2. Press F5 to start the project in the debugger, then verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the
   app starts. The 401 code is produced because access on the backend is restricted to authorized users only.
3. Open MainActivity.cs in the Android project and add the following `using` statements:
   
        using Microsoft.WindowsAzure.MobileServices;
        using System.Threading.Tasks;
4. Update the **MainActivity** class to implement the **IAuthenticate** interface, as follows:
   
        public class MainActivity : global::Xamarin.Forms.Platform.Android.FormsApplicationActivity, IAuthenticate
5. Update the **MainActivity** class by adding a **MobileServiceUser** field and an **Authenticate** method, which is required by the **IAuthenticate**
   interface, as follows:
   
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

    If you are using an identity provider other than Facebook, choose a different value for [MobileServiceAuthenticationProvider][7].

1. Add the following code to the **OnCreate** method of the **MainActivity** class before the call to `LoadApplication()`:
   
        // Initialize the authenticator before loading the app.
        App.Init((IAuthenticate)this);
   
    This code ensures the authenticator is initialized before the app loads.
2. Rebuild the app, run it, then sign in with the authentication provider you chose and verify you are able to access data as an authenticated user.

## Add authentication to the iOS app
This section shows how to implement the **IAuthenticate** interface in the iOS app project. Skip this section if you are not supporting iOS devices.

1. In Visual Studio or Xamarin Studio, right-click the **iOS** project, then **Set as StartUp Project**.
2. Press F5 to start the project in the debugger, then verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after
   the app starts. The 401 response is produced because access on the backend is restricted to authorized users only.
3. Open AppDelegate.cs in the iOS project and add the following `using` statements:
   
        using Microsoft.WindowsAzure.MobileServices;
        using System.Threading.Tasks;
4. Update the **AppDelegate** class to implement the **IAuthenticate** interface, as follows:
   
        public partial class AppDelegate : global::Xamarin.Forms.Platform.iOS.FormsApplicationDelegate, IAuthenticate
5. Update the **AppDelegate** class by adding a **MobileServiceUser** field and an **Authenticate** method, which is required by the **IAuthenticate**
   interface, as follows:
   
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
   
    This code ensures the authenticator is initialized before the app is loaded.
7. Rebuild the app, run it, then sign in with the authentication provider you chose and verify you are able to access data as an authenticated user.

## Add authentication to Windows 8.1 (including Phone) app projects
This section shows how to implement the **IAuthenticate** interface in the Windows 8.1 and Windows Phone 8.1 app projects. The same steps apply for
Universal Windows Platform (UWP) projects, but using the **UWP** project (with noted changes). Skip this section if you are not supporting Windows devices.

1. In Visual Studio, right-click either the **WinApp** or the **WinPhone81** project, then **Set as StartUp Project**.
2. Press F5 to start the project in the debugger, then verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after
   the app starts. The 401 response happens because access on the backend is restricted to authorized users only.
3. Open MainPage.xaml.cs for the Windows app project and add the following `using` statements:
   
        using Microsoft.WindowsAzure.MobileServices;
        using System.Threading.Tasks;
        using Windows.UI.Popups;
        using <your_Portable_Class_Library_namespace>;
   
    Replace `<your_Portable_Class_Library_namespace>` with the namespace for your portable class library.
4. Update the **MainPage** class to implement the **IAuthenticate** interface, as follows:
   
        public sealed partial class MainPage : IAuthenticate
5. Update the **MainPage** class by adding a **MobileServiceUser** field and an **Authenticate** method, which is required by the **IAuthenticate**
   interface, as follows:
   
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

1. Add the following line of code in the constructor for the **MainPage** class before the call to `LoadApplication()`:
   
        // Initialize the authenticator before loading the app.
        <your_Portable_Class_Library_namespace>.App.Init(this);
   
    Replace `<your_Portable_Class_Library_namespace>` with the namespace for your portable class library.
   
    If you are modifying the WinApp project, skip to step 8. The next step applies only to the WinPhone81 project, where you need to complete
    the login callback.
2. (Optional) In the **WinPhone81** app project, open App.xaml.cs and add the following `using` statements:
   
        using Microsoft.WindowsAzure.MobileServices;
        using <your_Portable_Class_Library_namespace>;
   
    Replace `<your_Portable_Class_Library_namespace>` with the namespace for your portable class library.
3. If you are using **WinPhone81** or **WinApp**, add the following **OnActivated** method override to the **App** class:
   
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
   
   When the method override already exists, add the conditional code from the preceding snippet.  This code is not required for Universal Windows
   projects.
4. Rebuild the app, run it, then sign in with the authentication provider you chose and verify you are able to access data as an authenticated user.

## Next steps
Now that you completed this basic authentication tutorial, consider continuing on to one of the following tutorials:

* [Add push notifications to your app](app-service-mobile-xamarin-forms-get-started-push.md)
  
  Learn how to add push notifications support to your app and configure your Mobile App backend to use Azure Notification Hubs to send push notifications.
* [Enable offline sync for your app](app-service-mobile-xamarin-forms-get-started-offline-data.md)
  
  Learn how to add offline support your app using a Mobile App backend. Offline sync allows end users to interact with a mobile app - viewing, adding,
  or modifying data - even when there is no network connection.

<!-- Images. -->

<!-- URLs. -->
[1]: app-service-mobile-xamarin-forms-get-started.md
[2]: app-service-mobile-dotnet-backend-how-to-use-server-sdk.md
[3]: https://msdn.microsoft.com/library/azure/dn268341(v=azure.10).aspx
[4]: https://msdn.microsoft.com/library/azure/JJ553674(v=azure.10).aspx
[5]: app-service-mobile-dotnet-how-to-use-client-library.md#serverflow
[6]: app-service-mobile-dotnet-how-to-use-client-library.md#clientflow
[7]: https://msdn.microsoft.com/library/azure/jj730936(v=azure.10).aspx
