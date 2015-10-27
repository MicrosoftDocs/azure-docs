<properties 
	pageTitle="Get Started with authentication for Mobile Apps in Xamarin Android" 
	description="Learn how to use Mobile Apps to authenticate users of your Xamarin Android app through a variety of identity providers, including AAD, Google, Facebook, Twitter, and Microsoft." 
	services="app-service\mobile" 
	documentationCenter="xamarin" 
	authors="mattchenderson" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="app-service-mobile" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-xamarin-android" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="08/27/2015" 
	ms.author="mahender"/>

# Add authentication to your Xamarin.Android app

[AZURE.INCLUDE [app-service-mobile-selector-get-started-users](../../includes/app-service-mobile-selector-get-started-users.md)]
&nbsp;  
[AZURE.INCLUDE [app-service-mobile-note-mobile-services](../../includes/app-service-mobile-note-mobile-services.md)]

This topic shows you how to authenticate users of a Mobile App from your client application. In this tutorial, you add authentication to the quickstart project using an identity provider that is supported by Azure Mobile Apps. After being successfully authenticated and authorized in the Mobile App, the user ID value is displayed.

This tutorial is based on the Mobile App quickstart. You must also first complete the tutorial [Create a Xamarin.Android app]. If you do not use the downloaded quick start server project, you must add the authentication extension package to your project. For more information about server extension packages, see [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md). 

##<a name="create-gateway"></a>Create an App Service Gateway

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-gateway](../../includes/app-service-mobile-dotnet-backend-create-gateway.md)] 

##<a name="register"></a>Register your app for authentication and configure App Services

[AZURE.INCLUDE [app-service-mobile-register-authentication](../../includes/app-service-mobile-register-authentication.md)] 

##<a name="permissions"></a>Restrict permissions to authenticated users

[AZURE.INCLUDE [app-service-mobile-restrict-permissions-dotnet-backend](../../includes/app-service-mobile-restrict-permissions-dotnet-backend.md)] 

<ol start="4">
<li><p>In Visual Studio or Xamarin Studio, run the client project on a device or emulator. Verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts.</p>
   
   	<p>This happens because the app attempts to access your Mobile App backend as an unauthenticated user. The <em>TodoItem</em> table now requires authentication.</p></li>
</ol>

Next, you will update the client app to request resources from the Mobile App backend with an authenticated user.

##<a name="add-authentication"></a>Add authentication to the app

1. Add the following property to the **TodoActivity** class:

			private MobileServiceUser user;

2. Add the following method to the **TodoActivity** class: 

	        private async Task Authenticate()
	        {
	            try
	            {
	                user = await client.LoginAsync(this, MobileServiceAuthenticationProvider.Facebook);
	                CreateAndShowDialog(string.Format("you are now logged in - {0}", user.UserId), "Logged in!");
	            }
	            catch (Exception ex)
	            {
	                CreateAndShowDialog(ex, "Authentication failed");
	            }
	        }

    This creates a new method to authenticate a user. The user in the example code above is authenticated by using a Facebook login. A dialog is used to display the user ID once authenticated. 

    > [AZURE.NOTE] If you are using an identity provider other than Facebook, change the value passed to **LoginAsync** above to one of the following: _MicrosoftAccount_, _Twitter_, _Google_, or _WindowsAzureActiveDirectory_.

3. In the **OnCreate** method, add the following line of code after the code that instantiates the `MobileServiceClient` object.

		// Create the Mobile Service Client instance, using the provided
		// Mobile Service URL, Gateway URL and key
		client = new MobileServiceClient (applicationURL, gatewayURL, applicationKey);
		
		await Authenticate(); // Added for authentication

	This call starts the authentication process and awaits it asynchronously.


4. In Visual Studio or Xamarin Studio, run the client project on a device or emulator and sign in with your chosen identity provider. 

   	When you are successfully logged-in, the app will display your login id and the list of todo items, and you can make updates to the data.


<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039

[Create a Xamarin.Android app]: app-service-mobile-xamarin-android-get-started.md

[Azure Management Portal]: https://portal.azure.com
 
