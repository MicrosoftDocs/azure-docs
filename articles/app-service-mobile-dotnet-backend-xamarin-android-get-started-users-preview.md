<properties 
	pageTitle="Get Started with authentication for Mobile Apps in Xamarin Android" 
	description="Learn how to use Mobile Apps to authenticate users of your Xamarin Android app through a variety of identity providers, including AAD, Google, Facebook, Twitter, and Microsoft." 
	services="app-service\mobile" 
	documentationCenter="xamarin" 
	authors="mattchenderson" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="app-service" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-xamarin-android" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="03/22/2015" 
	ms.author="mahender"/>

# Add authentication to your Xamarin.Android app

[AZURE.INCLUDE [app-service-mobile-selector-get-started-users](../includes/app-service-mobile-selector-get-started-users.md)]

This topic shows you how to authenticate users of an App Service Mobile App from your client application. In this tutorial, you add authentication to the quickstart project using an identity provider that is supported by App Service. After being successfully authenticated and authorized by your Mobile App, the user ID value is displayed.

This tutorial is based on the Mobile App quickstart. You must also first complete the tutorial [Create a Xamarin.Android app]. 

##<a name="register"></a>Register your app for authentication and configure App Services

[AZURE.INCLUDE [app-service-mobile-register-authentication](../includes/app-service-mobile-register-authentication.md)] 

##<a name="permissions"></a>Restrict permissions to authenticated users

[AZURE.INCLUDE [app-service-mobile-restrict-permissions-dotnet-backend](../includes/app-service-mobile-restrict-permissions-dotnet-backend.md)] 

<ol start="7">
<li><p>In Visual Studio or Xamarin Studio, run the client project on a device or emulator. Verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts.</p>
   
   	<p>This happens because the app attempts to access your Mobile App Code as an unauthenticated user, but the <em>TodoItem</em> table now requires authentication.</p></li>
</ol>

Next, you will update the app to authenticate users before requesting resources from your App Service.

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

    This creates a new method to handle the authentication process. The user is authenticated by using a Facebook login. A dialog is displayed which displays the ID of the authenticated user. 

    > [AZURE.NOTE] If you are using an identity provider other than a Facebook, change the value passed to **LoginAsync** above to one of the following: _MicrosoftAccount_, _Twitter_, _Google_, or _WindowsAzureActiveDirectory_.

3. In the **OnCreate** method, add the following line of code after the code that instantiates the `MobileServiceClient` object.

		// Get the Mobile App Table instance to use
        toDoTable = client.GetTable <ToDoItem> ();

        await Authenticate(); // add this line

	This call starts the authentication process and awaits it asynchronously.


4. From the **Run** menu, then click **Run** to start the app and sign in with your chosen identity provider. 

   	When you are successfully logged-in, the app will display the list of todo items, and you can make updates to the data.


<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039

[Create a Xamarin.Android app]: app-service-mobile-dotnet-backend-xamarin-android-get-started-preview.md

[Azure Management Portal]: https://portal.azure.com
