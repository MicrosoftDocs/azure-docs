<properties
	pageTitle="Get started with authentication (Xamarin.iOS) - Mobile Services"
	description="Learn how to use authentication in your Azure Mobile Services app for Xamarin.iOS."
	documentationCenter="xamarin"
	services="mobile-services"
	manager="dwrede"
	authors="lindydonna"
	editor=""/>


<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-xamarin-ios"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="07/21/2016"
	ms.author="donnam"/>

# Add authentication to your Mobile Services app

[AZURE.INCLUDE [mobile-services-selector-get-started-users](../../includes/mobile-services-selector-get-started-users.md)]

&nbsp;

[AZURE.INCLUDE [mobile-service-note-mobile-apps](../../includes/mobile-services-note-mobile-apps.md)]
> For the equivalent Mobile Apps version of this topic, see [Add authentication to your Xamarin.iOS app](../app-service-mobile/app-service-mobile-xamarin-ios-get-started-users.md).

This topic shows you how to authenticate users in Azure Mobile Services from your app.  In this tutorial, you add authentication to the quickstart project using an identity provider that is supported by Mobile Services. After being successfully authenticated and authorized by Mobile Services, the user ID value is displayed.

This tutorial walks you through these basic steps to enable authentication in your app:

1. [Register your app for authentication and configure Mobile Services]
2. [Restrict table permissions to authenticated users]
3. [Add authentication to the app]

This tutorial is based on the Mobile Services quickstart. You must also first complete the tutorial [Get started with Mobile Services].

Completing this tutorial requires [Xamarin Studio], XCode 6.0, and iOS 7.0 or later versions.

##<a name="register"></a>Register your app for authentication and configure Mobile Services

[AZURE.INCLUDE [mobile-services-register-authentication](../../includes/mobile-services-register-authentication.md)]

##<a name="permissions"></a>Restrict permissions to authenticated users


[AZURE.INCLUDE [mobile-services-restrict-permissions-javascript-backend](../../includes/mobile-services-restrict-permissions-javascript-backend.md)]


3. In Xcode, open the project that you created when you completed the tutorial [Get started with Mobile Services].

4. Press the **Run** button to build the project and start the app in the iPhone emulator; verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts.

   	This happens because the app attempts to access Mobile Services as an unauthenticated user, but the _TodoItem_ table now requires authentication.

Next, you will update the app to authenticate users before requesting resources from the mobile service.

##<a name="add-authentication"></a>Add authentication to the app

1. Open the **QSToDoService** project file and add the following variables

		// Mobile Service logged in user
		private MobileServiceUser user;
		public MobileServiceUser User { get { return user; } }

2. Then add a new method named **Authenticate** to **ToDoService** defined as:

        private async Task Authenticate(MonoTouch.UIKit.UIViewController view)
        {
            try
            {
                user = await client.LoginAsync(view, MobileServiceAuthenticationProvider.MicrosoftAccount);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine (@"ERROR - AUTHENTICATION FAILED {0}", ex.Message);
            }
        }

	> [AZURE.NOTE] If you are using an identity provider other than a Microsoft Account, change the value passed to **LoginAsync** above to one of the following: _Facebook_, _Twitter_, _Google_, or _WindowsAzureActiveDirectory_.

3. Move the request for the **ToDoItem** table from the **ToDoService** constructor into a new method named **CreateTable**:

        private async Task CreateTable()
        {
            // Create an MSTable instance to allow us to work with the ToDoItem table
            todoTable = client.GetSyncTable<ToDoItem>();
        }

4. Create a new asynchronous public method named **LoginAndGetData** defined as:

        public async Task LoginAndGetData(MonoTouch.UIKit.UIViewController view)
        {
            await Authenticate(view);
            await CreateTable();
        }

5. In the **TodoListViewController** override the **ViewDidAppear** method and define it as found below. This logs in the user if the **ToDoService** doesn't yet have a handle on the user:

        public override async void ViewDidAppear(bool animated)
        {
            base.ViewDidAppear(animated);

            if (QSTodoService.DefaultService.User == null)
            {
                await QSTodoService.DefaultService.LoginAndGetData(this);
            }

            if (QSTodoService.DefaultService.User == null)
            {
                // TODO:: show error
                return;
            }


            await RefreshAsync();
        }
6. Remove the original call to **RefreshAsync** from **TodoListViewController.ViewDidLoad**.

7. Press the **Run** button to build the project, start the app in the iPhone emulator, then log-on with your chosen identity provider.

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
[4]: ./media/partner-xamarin-mobile-services-ios-get-started-users/mobile-services-selection.png
[5]: ./media/partner-xamarin-mobile-services-ios-get-started-users/mobile-service-uri.png
[13]: ./media/partner-xamarin-mobile-services-ios-get-started-users/mobile-identity-tab.png
[14]: ./media/partner-xamarin-mobile-services-ios-get-started-users/mobile-portal-data-tables.png
[15]: ./media/partner-xamarin-mobile-services-ios-get-started-users/mobile-portal-change-table-perms.png

<!-- URLs. TODO:: update completed example project link with project download -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253

[Get started with Mobile Services]: /develop/mobile/tutorials/get-started-xamarin-ios
[Get started with data]: /develop/mobile/tutorials/get-started-with-data-xamarin-ios
[Get started with authentication]: /develop/mobile/tutorials/get-started-with-users-xamarin-ios
[Get started with push notifications]: /develop/mobile/tutorials/-get-started-with-push-xamarin-ios
[Authorize users with scripts]: /develop/mobile/tutorials/authorize-users-in-scripts-xamarin-ios
[completed example project]: http://go.microsoft.com/fwlink/p/?LinkId=331328
[Xamarin Studio]: http://xamarin.com/download
