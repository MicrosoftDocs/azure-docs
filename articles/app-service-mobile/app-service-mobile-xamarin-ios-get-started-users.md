<properties 
	pageTitle="Get Started with authentication for Mobile Apps in Xamarin iOS" 
	description="Learn how to use Mobile Apps to authenticate users of your Xamarin iOS app through a variety of identity providers, including AAD, Google, Facebook, Twitter, and Microsoft." 
	services="app-service\mobile" 
	documentationCenter="xamarin" 
	authors="mattchenderson" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="app-service-mobile" 
	ms.workload="na" 
	ms.tgt_pltfrm="mobile-xamarin-ios" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="08/27/2015" 
	ms.author="mahender"/>

# Add authentication to your Xamarin.iOS app

[AZURE.INCLUDE [app-service-mobile-selector-get-started-users](../../includes/app-service-mobile-selector-get-started-users.md)]
&nbsp;  
[AZURE.INCLUDE [app-service-mobile-note-mobile-services](../../includes/app-service-mobile-note-mobile-services.md)]

This topic shows you how to authenticate users of an App Service Mobile App from your client application. In this tutorial, you add authentication to the quickstart project using an identity provider that is supported by App Service. After being successfully authenticated and authorized by your Mobile App, the user ID value is displayed.

This tutorial is based on the Mobile App quickstart. You must also first complete the tutorial [Create a Xamarin.iOS app]. If you do not use the downloaded quick start server project, you must add the authentication extension package to your project. For more information about server extension packages, see [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md). 

[AZURE.INCLUDE [app-service-mobile-to-web-and-api](../../includes/app-service-mobile-to-web-and-api.md)] 

##<a name="create-gateway"></a>Create an App Service Gateway

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-gateway](../../includes/app-service-mobile-dotnet-backend-create-gateway.md)] 

##<a name="register"></a>Register your app for authentication and configure App Services

[AZURE.INCLUDE [app-service-mobile-register-authentication](../../includes/app-service-mobile-register-authentication.md)] 

##<a name="permissions"></a>Restrict permissions to authenticated users

[AZURE.INCLUDE [app-service-mobile-restrict-permissions-dotnet-backend](../../includes/app-service-mobile-restrict-permissions-dotnet-backend.md)] 

&nbsp;&nbsp;4. In Visual Studio or Xamarin Studio, run the client project on a device or emulator. Verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts. The failure is logged to the console of the debugger. So in Visual Studio, you should see the failure in the output window.

&nbsp;&nbsp;This unauthorized failure happens because the app attempts to access your Mobile App backend as an unauthenticated user. The *TodoItem* table now requires authentication.

Next, you will update the client app to request resources from the Mobile App backend with an authenticated user.

##<a name="add-authentication"></a>Add authentication to the app

In this section, you will modify the app to display a login screen before displaying data. When the app starts, it will not not connect to your App Service and will not display any data. After the first time that the user performs the refresh gesture, the login screen will appear; after successful login the list of todo items will be displayed.

1. In the client project, open the file **QSTodoService.cs** and add the following using statement and member declarations to QSTodoService:


		// Logged in user
		private MobileServiceUser user; 
		public MobileServiceUser User { get { return user; } }

2. Add a `using` statment for UIKit and add a new method named **Authenticate** to **QSTodoService** with the following definition:

	```
		using UIKit;
	```

        public async Task Authenticate(UIViewController view)
        {
            try
            {
                user = await client.LoginAsync(view, MobileServiceAuthenticationProvider.Facebook);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine (@"ERROR - AUTHENTICATION FAILED {0}", ex.Message);
            }
        }

	>[AZURE.NOTE] If you are using an identity provider other than a Facebook, change the value passed to **LoginAsync** above to one of the following: _MicrosoftAccount_, _Twitter_, _Google_, or _WindowsAzureActiveDirectory_.

3. Open **QSTodoListViewController.cs**. Modify the method definition of **ViewDidLoad** to remove the call to **RefreshAsync()** near the end:

		public override async void ViewDidLoad ()
		{
			base.ViewDidLoad ();

			todoService = QSTodoService.DefaultService;
           await todoService.InitializeStoreAsync ();

           RefreshControl.ValueChanged += async (sender, e) => {
                await RefreshAsync ();
           }

			// Comment out the call to RefreshAsync
			// await RefreshAsync ();
		}


4. Modify the method **RefreshAsync** to authenticate and display a login screen if the **User** property is null. At the following code at the top of the method definition:

		// start of RefreshAsync method
		if (todoService.User == null) {
			await QSTodoService.DefaultService.Authenticate (this);
			if (todoService.User == null) {
				Console.WriteLine ("couldn't login!!");
				return;
			}
		}
		// rest of RefreshAsync method
	
5. In Visual Studio or Xamarin Studio connected to your Xamarin Build Host on your Mac, run the client project targeting a device or emulator. Verify that the app displays no data. 

	Perform the refresh gesture by pulling down the list of items, which will cause the login screen to appear. Once you have successfully entered valid credentials, the app will display the list of todo items, and you can make updates to the data.

 
<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Create a Xamarin.iOS app]: app-service-mobile-xamarin-ios-get-started.md

[Azure Management Portal]: https://portal.azure.com
 
