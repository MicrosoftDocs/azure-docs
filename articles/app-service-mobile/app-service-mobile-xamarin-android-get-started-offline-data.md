<properties
    pageTitle="Enable offline sync for your Azure Mobile App (Xamarin Android)"
    description="Learn how to use App Service Mobile App to cache and sync offline data in your Xamarin Android application"
    documentationCenter="xamarin"
    authors="wesmc7777"
    manager="dwrede"
    editor=""
    services="app-service\mobile"/>

<tags
    ms.service="app-service-mobile"
    ms.workload="mobile"
    ms.tgt_pltfrm="mobile-xamarin-android"
    ms.devlang="dotnet"
    ms.topic="article"
	ms.date="05/05/2016"
    ms.author="wesmc"/>

# Enable offline sync for your Xamarin.Android mobile app

[AZURE.INCLUDE [app-service-mobile-selector-offline](../../includes/app-service-mobile-selector-offline.md)]

## Overview

This tutorial introduces the offline sync feature of Azure Mobile Apps for Xamarin.Android. Offline sync allows end-users to interact with a mobile app--viewing, adding, or modifying data--even when there is no network connection. Changes are stored in a local database; once the device is back online, these changes are synced with the remote service.

In this tutorial, you will update the client project from the tutorial [Create a Xamarin Android app] to support the offline features of Azure Mobile Apps. If you do not use the downloaded quick start server project, you must add the data access extension packages to your project. For more information about server extension packages, see [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md).

To learn more about the offline sync feature, see the topic [Offline Data Sync in Azure Mobile Apps].

## Review the client sync code

The Xamarin client project that you downloaded when you completed the tutorial [Create a Xamarin Android app] already contains code supporting offline synchronization using a local SQLite database. Here is a brief overview of what is already included in the tutorial code. For a conceptual overview of the feature, see [Offline Data Sync in Azure Mobile Apps].

* Before any table operations can be performed, the local store must be initialized. The local store database is initialized when `ToDoActivity.OnCreate()` executes `ToDoActivity.InitLocalStoreAsync()`. This creates a new local SQLite database using the `MobileServiceSQLiteStore` class provided by the Azure Mobile Apps client SDK.

	The `DefineTable` method creates a table in the local store that matches the fields in the provided type, `ToDoItem` in this case. The type doesn't have to include all of the columns that are in the remote database. It is possible to store just a subset of columns.

		// ToDoActivity.cs
        private async Task InitLocalStoreAsync()
        {
            // new code to initialize the SQLite store
            string path = Path.Combine(System.Environment
				.GetFolderPath(System.Environment.SpecialFolder.Personal), localDbFilename);

            if (!File.Exists(path))
            {
                File.Create(path).Dispose();
            }

            var store = new MobileServiceSQLiteStore(path);
            store.DefineTable<ToDoItem>();

            // Uses the default conflict handler, which fails on conflict
            // To use a different conflict handler, pass a parameter to InitializeAsync.
			// For more details, see http://go.microsoft.com/fwlink/?LinkId=521416.
            await client.SyncContext.InitializeAsync(store);
        }


* The `toDoTable` member of `ToDoActivity` is of the `IMobileServiceSyncTable` type instead of `IMobileServiceTable`. This directs all create, read, update, and delete (CRUD) table operations to the local store database.

	You decide when those changes are pushed up to the Azure Mobile App backend by calling `IMobileServiceSyncContext.PushAsync()` using the sync context for the client connection. The sync context helps preserve table relationships by tracking and pushing changes in all tables a client app has modified when `PushAsync` is called.

	The provided code calls `ToDoActivity.SyncAsync()` to sync whenever the todoitem list is refreshed or a todoitem is added or completed. So it syncs after every local change executing a push on the sync context and a pull on the sync table. However, it is important to realize that if a pull is executed against a table that has pending local updates tracked by the context, that pull operation will automatically trigger a context push first. So in these cases (refresh, adding and completing items) you could omit the explicit `PushAsync` call. It is redundant.

    In the provided code, all records in the remote `TodoItem` table are queried, but it is also possible to filter records by passing a query id and query to `PushAsync`. For more information see the section *Incremental Sync* in [Offline Data Sync in Azure Mobile Apps].

	<!-- Need updated conflict handling info : `InitializeAsync` uses the default conflict handler, which fails whenever there is a conflict. To provide a custom conflict handler, see the tutorial [Handling conflicts with offline support for Mobile Services].
 	-->


		// ToDoActivity.cs
        private async Task SyncAsync()
        {
			try {
	            await client.SyncContext.PushAsync();
	            await toDoTable.PullAsync("allTodoItems", toDoTable.CreateQuery()); // query ID is used for incremental sync
			} catch (Java.Net.MalformedURLException) {
				CreateAndShowDialog (new Exception ("There was an error creating the Mobile Service. Verify the URL"), "Error");
			} catch (Exception e) {
				CreateAndShowDialog (e, "Error");
			}
        }


## Run the client app

Run the client application  at least once to to populate the local store database. In the next section, you will simulate an offline scenario and modify the data in the local store while the app is offline.

## Update the sync behavior of the client app

In this section, you will modify the client app to simulate an offline scenario by using an invalid application URL for your backend. When you add or change data items, these changes will be held in the local store, but not synced to the backend data store until the connection is re-established.

1. At the top of `ToDoActivity.cs`, change the initialization of `applicationURL` to point to an invalid URL:

        const string applicationURL = @"https://your-service.azurewebsites.fail/";

	Note that when your app is also using authentication, this will cause sign in to fail. You can also demonstrate offline behavior by disabling wifi and celluar networks on the device or use airplane mode.

2. Update `ToDoActivity.SyncAsync` so that `MobileServicePushFailedException` are caught and simply ignored assuming you are offline.

        private async Task SyncAsync()
        {
			try {
	            await client.SyncContext.PushAsync();
	            await toDoTable.PullAsync("allTodoItems", toDoTable.CreateQuery()); // query ID is used for incremental sync
			} catch (Java.Net.MalformedURLException) {
				CreateAndShowDialog (new Exception ("There was an error creating the Mobile Service. Verify the URL"), "Error");
			} catch (MobileServicePushFailedException)
            {
                // Not reporting this exception. Assuming the app is offline for now
            }
            catch (Exception e) {
				CreateAndShowDialog (e, "Error");
			}
        }


3. Build and run the app. If you get an exception dialog reporting name resolution exception close it. Add some new todo items and notice the app behaves as if it is connected because `MobileServicePushFailedException` is handled without displaying the dialog.

4. The new items you add exist only in the local store until they can be pushed to the mobile backend. Close the app and restart it to verify that the new items you created are persisted to the local store.

5. (Optional) Use Visual Studio to view your Azure SQL Database table to see that the data in the backend database has not changed.

   	In Visual Studio, open **Server Explorer**. Navigate to your database in **Azure**->**SQL Databases**. Right-click your database and select **Open in SQL Server Object Explorer**. Now you can browse to your SQL database table and its contents.

6. (Optional) Use a REST tool such as Fiddler or Postman to query your mobile backend, using a GET query in the form `https://your-mobile-app-backend-name.azurewebsites.net/tables/TodoItem`.


## Update the client app to reconnect your mobile backend

In this section you will reconnect the app to the mobile backend, which simulates the app coming back to an online state. When you perform the refresh gesture, data will be synced to your mobile backend.

1. Open `ToDoActivity.cs`. Correct the `applicationURL` to point to the correct URL.

2. Rebuild and run the app. The app attempts to sync with the Azure Mobile App backend after launching. Verify no exception dialogs are created.

3. (Optional) View the updated data using either SQL Server Object Explorer or a REST tool like Fiddler. Notice the data has been synchronized between the Azure Mobile App backend database and the local store.

    Notice the data has been synchronized between the database and the local store and contains the items you added while in an offline situation.

## Additional Resources

* [Offline Data Sync in Azure Mobile Apps]

* [Cloud Cover: Offline Sync in Azure Mobile Services] \(note: the video is on Mobile Services, but offline sync works in a similar way in Azure Mobile Apps\)

<!-- ##Summary

[AZURE.INCLUDE [mobile-services-offline-summary-csharp](../../includes/mobile-services-offline-summary-csharp.md)]

## Next steps

* [Handling conflicts with offline support for Mobile Services]

* [How to use the Xamarin Component client for Azure Mobile Services]
 -->

<!-- Images -->

<!-- URLs. -->
[Create a Xamarin Android app]: ../app-service-mobile-xamarin-android-get-started.md
[Offline Data Sync in Azure Mobile Apps]: ../app-service-mobile-offline-data-sync.md

[How to use the Xamarin Component client for Azure Mobile Services]: ../partner-xamarin-mobile-services-how-to-use-client-library.md

[Xamarin Studio]: http://xamarin.com/download
[Xamarin extension]: http://xamarin.com/visual-studio

[Cloud Cover: Offline Sync in Azure Mobile Services]: http://channel9.msdn.com/Shows/Cloud+Cover/Episode-155-Offline-Storage-with-Donna-Malayeri
