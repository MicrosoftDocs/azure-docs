<properties 
	pageTitle="Get started with authentication (Xamarin.Android) - Mobile Services" 
	description="Learn how to use authentication in your Azure Mobile Services app for Xamarin.Android." 
	services="mobile-services" 
	documentationCenter="xamarin" 
	manager="dwrede" 
	authors="lindydonna" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-xamarin-android" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="05/01/2015" 
	ms.author="donnam"/>

# Add authentication to your Mobile Services app

[AZURE.INCLUDE [mobile-services-selector-get-started-users](../includes/mobile-services-selector-get-started-users.md)]

<p>This topic shows you how to authenticate users in Azure Mobile Services from your Xamarin.Android app. In this tutorial, you add authentication to the quickstart project using an identity provider that is supported by Mobile Services. After being successfully authenticated and authorized by Mobile Services, the user ID value is displayed.</p>

This tutorial walks you through these basic steps to enable authentication in your app:

1. [Register your app for authentication and configure Mobile Services]
2. [Restrict table permissions to authenticated users]
3. [Add authentication to the app]

This tutorial is based on the Mobile Services quickstart. You must also first complete the tutorial [Get started with Mobile Services]. 

Completing this tutorial requires Xamarin.Android and Android SDK 4.2 or a later version. 

##<a name="register"></a>Register your app for authentication and configure Mobile Services

[AZURE.INCLUDE [mobile-services-register-authentication](../includes/mobile-services-register-authentication.md)] 

##<a name="permissions"></a>Restrict permissions to authenticated users


[AZURE.INCLUDE [mobile-services-restrict-permissions-javascript-backend](../includes/mobile-services-restrict-permissions-javascript-backend.md)] 


3. In Eclipse, open the project that you created when you completed the tutorial [Get started with Mobile Services]. 

4. From the **Run** menu, then click **Run** to start the app; verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts. 

	 This happens because the app attempts to access Mobile Services as an unauthenticated user, but the _TodoItem_ table now requires authentication.

Next, you will update the app to authenticate users before requesting resources from the mobile service.

##<a name="add-authentication"></a>Add authentication to the app

1. Add the following property to the **TodoActivity** class:

		private MobileServiceUser user;

2. Add the following method to the **TodoActivity** class: 

        private async Task Authenticate()
        {
            try
            {
                user = await client.LoginAsync(this, MobileServiceAuthenticationProvider.MicrosoftAccount);
                CreateAndShowDialog(string.Format("you are now logged in - {0}", user.UserId), "Logged in!");
            }
            catch (Exception ex)
            {
                CreateAndShowDialog(ex, "Authentication failed");
            }
        }

    This creates a new method to handle the authentication process. The user is authenticated by using a Microsoft Account login. A dialog is displayed which displays the ID of the authenticated user. You cannot proceed without a positive authentication.

    > [AZURE.NOTE] If you are using an identity provider other than Microsoft, change the value passed to the **login** method above to one of the following: _Facebook_, _Google_, _Twitter_, or _WindowsAzureActiveDirectory_.

3. In the **OnCreate** method, add the following line of code after the code that instantiates the `MobileServiceClient` object.

		await Authenticate();

	This call starts the authentication process and awaits it asynchronously.

4. Move the remaining code after `await Authenticate();` in the **OnCreate** method to a new **CreateTable** method, which looks like this:

        private async Task CreateTable()
        {
            // Get the Mobile Service Table instance to use
            todoTable = client.GetTable<TodoItem>();

            textNewTodo = FindViewById<EditText>(Resource.Id.textNewTodo);

            // Create an adapter to bind the items with the view
            adapter = new TodoItemAdapter(this, Resource.Layout.Row_List_To_Do);
            var listViewTodo = FindViewById<ListView>(Resource.Id.listViewTodo);
            listViewTodo.Adapter = adapter;

            // Load the items from the Mobile Service
            await RefreshItemsFromTableAsync();
        }

5. Then call the new **CreateTable** method in **OnCreate** after the **Authenticate** call added in step 2:

		await CreateTable();


6. From the **Run** menu, then click **Run** to start the app and sign in with your chosen identity provider. 

   	When you are successfully logged-in, the app should run without errors, and you should be able to query Mobile Services and make updates to data.

## Get completed example
Download the [completed example project]. Be sure to update the **applicationURL** and **applicationKey** variables with your own Azure settings.

## <a name="next-steps"></a>Next steps

In the next tutorial, [Authorize users with scripts], you will take the user ID value provided by Mobile Services based on an authenticated user and use it to filter the data returned by Mobile Services. 

<!-- Anchors. -->
[Register your app for authentication and configure Mobile Services]: #register
[Restrict table permissions to authenticated users]: #permissions
[Add authentication to the app]: #add-authentication
[Next Steps]:#next-steps

<!-- Images. -->
[4]: ./media/partner-xamarin-mobile-services-android-get-started-users/mobile-services-selection.png
[5]: ./media/partner-xamarin-mobile-services-android-get-started-users/mobile-service-uri.png

[13]: ./media/partner-xamarin-mobile-services-android-get-started-users/mobile-identity-tab.png
[14]: ./media/partner-xamarin-mobile-services-android-get-started-users/mobile-portal-data-tables.png
[15]: ./media/partner-xamarin-mobile-services-android-get-started-users/mobile-portal-change-table-perms.png

<!-- URLs. -->
[Authorize users with scripts]: mobile-services-javascript-backend-service-side-authorization.md
[Azure Management Portal]: https://manage.windowsazure.com/
[completed example project]: http://go.microsoft.com/fwlink/p/?LinkId=331328
