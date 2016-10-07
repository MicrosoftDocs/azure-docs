<properties
    pageTitle="Enable offline sync for your Azure Mobile App (Xamarin Android)"
    description="Learn how to use App Service Mobile App to cache and sync offline data in your Xamarin Android application"
    documentationCenter="xamarin"
    authors="adrianhall"
    manager="dwrede"
    editor=""
    services="app-service\mobile"/>

<tags
    ms.service="app-service-mobile"
    ms.workload="mobile"
    ms.tgt_pltfrm="mobile-xamarin-android"
    ms.devlang="dotnet"
    ms.topic="article"
	ms.date="10/01/2016"
    ms.author="adrianha"/>

# Enable offline sync for your Xamarin.Android mobile app

[AZURE.INCLUDE [app-service-mobile-selector-offline](../../includes/app-service-mobile-selector-offline.md)]

## Overview

This tutorial introduces the offline sync feature of Azure Mobile Apps for Xamarin.Android. Offline sync allows end-users to interact 
with a mobile app--viewing, adding, or modifying data--even when there is no network connection. Changes are stored in a local database; 
once the device is back online, these changes are synced with the remote service.

In this tutorial, you will update the client project from the tutorial [Create a Xamarin Android app] to support the offline features 
of Azure Mobile Apps. If you do not use the downloaded quick start server project, you must add the data access extension packages to your 
project. For more information about server extension packages, see [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md).

To learn more about the offline sync feature, see the topic [Offline Data Sync in Azure Mobile Apps].

## Update the client app to support offline features

Azure Mobile App offline features allow you to interact with a local database when you are in an offline scenario. To use 
these features in your app, you initialize a [SyncContext][synccontext] to a local store. Then reference your table through 
the [IMobileServiceSyncTable][IMobileServiceSyncTable] interface. SQLite is used as the local store on the device.

1. In Visual Studio, open the NuGet package manager in the project that you completed in the [Create a Xamarin Android app] tutorial, 
    then search for and install the **Microsoft.Azure.Mobile.Client.SQLiteStore** NuGet package.

2. Open the ToDoActivity.cs file and uncomment the `#define OFFLINE_SYNC_ENABLED` definition to enable offline sync.       

3. In Visual Studio, press the **F5** key to rebuild and run the client app. The app works the same as it did before you enabled
    offline sync. However, the local database is now populated with data that can be used in an offline scenario.  Next, you will 
    create an offline scenario and use locally stored data to start the app.

## <a name="update-sync"></a>Update the app to disconnect from the backend

In this section, you break the connection to your Mobile App backend to simulate an offline situation. When you add data items, your 
exception handler tells you that the app is in offline mode. In this state, new items added in the local store and will be synced to 
the mobile app backend when push is next run in a connected state.

1. Edit ToDoActivity.cs in the shared project. Change the **applicationURL** to point to an invalid URL:

         const string applicationURL = @"https://your-service.azurewebsites.fail";

	Note that when your app is also using authentication, this will cause sign in to fail. You can also demonstrate offline behavior by 
    disabling wifi and cellular networks on the device or use airplane mode.

2. Press **F5** to build and run the app. Notice your sync failed on refresh when the app launched.
 
3. Enter new items and notice that push fails with a [CancelledByNetworkError] status each time you click **Save**. However, the new 
   todo items exist in the local store until they can be pushed to the mobile app backend.  In a production app, if you suppress these 
   exceptions the client app behaves as if it's still connected to the mobile app backend.

4. Close the app and restart it to verify that the new items you created are persisted to the local store.

5. (Optional) In Visual Studio, open **Server Explorer**. Navigate to your database in **Azure**->**SQL Databases**. Right-click your 
   database and select **Open in SQL Server Object Explorer**. Now you can browse to your SQL database table and its contents. Verify 
   that the data in the backend database has not changed.

6. (Optional) Use a REST tool such as Fiddler or Postman to query your mobile backend, using a GET query in the 
   form `https://<your-mobile-app-backend-name>.azurewebsites.net/tables/TodoItem`.

## <a name="update-online-app"></a>Update the app to reconnect your Mobile App backend

In this section you reconnect the app to the mobile app backend. This simulates the app moving from an offline state to an online state 
with the mobile app backend. When you first run the application, the `OnCreate` event handler will call `OnRefreshItemsSelected`. This 
will in turn call `SyncAsync` to sync your local store with the backend database. So the app will attempt to sync on start up.

1. Open ToDoActivity.cs in the shared project, and revert your change of the **applicationURL** property.

2. Press the **F5** key to rebuild and run the app. The app syncs your local changes with the Azure Mobile App backend using push and pull 
   operations as soon as the `OnRefreshItemsSelected` method executes.

3. (Optional) View the updated data using either SQL Server Object Explorer or a REST tool like Fiddler. Notice the data has been synchronized 
   between the Azure Mobile App backend database and the local store.

4. In the app, click the check box beside a few items to complete them in the local store.

  `CheckItem` calls `SyncAsync` to sync each completed item with the Mobile App backend. `SyncAsync` calls both push and pull. However, 
  you should note that **whenever you execute a pull against a table that the client has made changes to, a push on the client sync context will 
  always be executed first automatically**. This is to ensure all tables in the local store, along with relationships remain consistent. In 
  this case we could have removed the call to `PushAsync` because it is executed automatically when executing a pull. This behavior may result 
  in an unexpected push if you are not aware of it. For more information on this behavior, see [Offline Data Sync in Azure Mobile Apps].

## Review the client sync code

The Xamarin client project that you downloaded when you completed the tutorial [Create a Xamarin Android app] already contains code 
supporting offline synchronization using a local SQLite database. Here is a brief overview of what is already included in the tutorial c
ode. For a conceptual overview of the feature, see [Offline Data Sync in Azure Mobile Apps].

* Before any table operations can be performed, the local store must be initialized. The local store database is initialized 
   when `ToDoActivity.OnCreate()` executes `ToDoActivity.InitLocalStoreAsync()`. This creates a new local SQLite database using 
   the `MobileServiceSQLiteStore` class provided by the Azure Mobile Apps client SDK.

	The `DefineTable` method creates a table in the local store that matches the fields in the provided type, `ToDoItem` in this case. The type 
    doesn't have to include all of the columns that are in the remote database. It is possible to store just a subset of columns.

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


* The `toDoTable` member of `ToDoActivity` is of the `IMobileServiceSyncTable` type instead of `IMobileServiceTable`. This directs all 
  create, read, update, and delete (CRUD) table operations to the local store database.

	You decide when those changes are pushed up to the Azure Mobile App backend by calling `IMobileServiceSyncContext.PushAsync()` using the 
    sync context for the client connection. The sync context helps preserve table relationships by tracking and pushing changes in all tables 
    a client app has modified when `PushAsync` is called.

	The provided code calls `ToDoActivity.SyncAsync()` to sync whenever the todoitem list is refreshed or a todoitem is added or completed. It 
    syncs after every local change executing a push on the sync context and a pull on the sync table. However, it is important to realize that 
    if a pull is executed against a table that has pending local updates tracked by the context, that pull operation will automatically trigger 
    a context push first. So in these cases (refresh, adding and completing items) you could omit the explicit `PushAsync` call. It is redundant.

    In the provided code, all records in the remote `TodoItem` table are queried, but it is also possible to filter records by passing a query 
    id and query to `PushAsync`. For more information see the section *Incremental Sync* in [Offline Data Sync in Azure Mobile Apps].

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

## Additional Resources

* [Offline Data Sync in Azure Mobile Apps]
* [Azure Mobile Apps .NET SDK HOWTO][8]

<!-- URLs. -->
[Create a Xamarin Android app]: ../app-service-mobile-xamarin-android-get-started.md
[Offline Data Sync in Azure Mobile Apps]: ../app-service-mobile-offline-data-sync.md

<!-- Images -->

<!-- URLs. -->
[Create a Xamarin Android app]: app-service-mobile-xamarin-android-get-started.md
[Offline Data Sync in Azure Mobile Apps]: app-service-mobile-offline-data-sync.md
[Xamarin Studio]: http://xamarin.com/download
[Xamarin extension]: http://xamarin.com/visual-studio
[8]: app-service-mobile-dotnet-how-to-use-client-library.md
