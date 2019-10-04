---
title: Enable offline sync for your Azure Mobile App (Xamarin iOS)
description: Learn how to use App Service Mobile App to cache and sync offline data in your Xamarin iOS application
documentationcenter: xamarin
author: elamalani
manager: cfowler
editor: ''
services: app-service\mobile

ms.assetid: 828a287c-5d58-4540-9527-1309ebb0f32b
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-xamarin-ios
ms.devlang: dotnet
ms.topic: article
ms.date: 06/25/2019
ms.author: emalani
---
# Enable offline sync for your Xamarin.iOS mobile app
[!INCLUDE [app-service-mobile-selector-offline](../../includes/app-service-mobile-selector-offline.md)]

> [!NOTE]
> Visual Studio App Center is investing in new and integrated services central to mobile app development. Developers can use **Build**, **Test** and **Distribute** services to set up Continuous Integration and Delivery pipeline. Once the app is deployed, developers can monitor the status and usage of their app using the **Analytics** and **Diagnostics** services, and engage with users using the **Push** service. Developers can also leverage **Auth** to authenticate their users and **Data** service to persist and sync app data in the cloud. Check out [App Center](https://appcenter.ms/?utm_source=zumo&utm_campaign=app-service-mobile-xamarin-ios-get-started-offline-data) today.
>

## Overview
This tutorial introduces the offline sync feature of Azure Mobile Apps for Xamarin.iOS. Offline sync allows end users to interact
with a mobile app--viewing, adding, or modifying data--even when there is no network connection. Changes are stored in a local
database. Once the device is back online, these changes are synced with the remote service.

In this tutorial, update the Xamarin.iOS app project from [Create a Xamarin iOS app] to support the offline features of
Azure Mobile Apps. If you do not use the downloaded quick start server project, you must add the data access extension packages to
your project. For more information about server extension packages, see [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md).

To learn more about the offline sync feature, see the topic [Offline Data Sync in Azure Mobile Apps].

## Update the client app to support offline features
Azure Mobile App offline features allow you to interact with a local database when you are in an offline scenario. To use
these features in your app, initialize a [SyncContext] to a local store. Reference your table through
the [IMobileServiceSyncTable] interface. SQLite is used as the local store on the device.

1. Open the NuGet package manager in the project that you completed in the [Create a Xamarin iOS app] tutorial,
    then search for and install the **Microsoft.Azure.Mobile.Client.SQLiteStore** NuGet package.
2. Open the QSTodoService.cs file and uncomment the `#define OFFLINE_SYNC_ENABLED` definition.
3. Rebuild and run the client app. The app works the same as it did before you enabled offline sync. However, the local database
   is now populated with data that can be used in an offline scenario.

## <a name="update-sync"></a>Update the app to disconnect from the backend
In this section, you break the connection to your Mobile App backend to simulate an offline situation. When you add data items, your
exception handler tells you that the app is in offline mode. In this state, new items added in the local store and will be synced to
the mobile app backend when push is next run in a connected state.

1. Edit QSToDoService.cs in the shared project. Change the **applicationURL** to point to an invalid URL:

         const string applicationURL = @"https://your-service.azurewebsites.fail";

    You can also demonstrate offline behavior by disabling wifi and cellular networks on the device or using airplane mode.
2. Build and run the app. Notice your sync failed on refresh when the app launched.
3. Enter new items and notice that push fails with a [CancelledByNetworkError] status each time you click **Save**. However, the new
   todo items exist in the local store until they can be pushed to the mobile app backend.  In a production app, if you suppress these
   exceptions the client app behaves as if it's still connected to the mobile app backend.
4. Close the app and restart it to verify that the new items you created are persisted to the local store.
5. (Optional) If you have Visual Studio installed on a PC, open **Server Explorer**. Navigate to your database in **Azure**-> **SQL Databases**. Right-click
   your database and select **Open in SQL Server Object Explorer**. Now you can browse to your SQL database table and its contents. Verify
   that the data in the backend database has not changed.
6. (Optional) Use a REST tool such as Fiddler or Postman to query your mobile backend, using a GET query in the
   form `https://<your-mobile-app-backend-name>.azurewebsites.net/tables/TodoItem`.

## <a name="update-online-app"></a>Update the app to reconnect your Mobile App backend
In this section, reconnect the app to the mobile app backend. This simulates the app moving from an offline state to an online state
with the mobile app backend.   If you simulated the network breakage by turning off network connectivity, no code changes are needed.
Turn the network on again.  When you first run the application, the `RefreshDataAsync` method is called. This in turn calls `SyncAsync`
to sync your local store with the backend database.

1. Open QSToDoService.cs in the shared project, and revert your change of the **applicationURL** property.
2. Rebuild and run the app. The app syncs your local changes with the Azure Mobile App backend using push and pull
   operations when the `OnRefreshItemsSelected` method executes.
3. (Optional) View the updated data using either SQL Server Object Explorer or a REST tool like Fiddler. Notice the data has been synchronized
   between the Azure Mobile App backend database and the local store.
4. In the app, click the check box beside a few items to complete them in the local store.

   `CompleteItemAsync` calls `SyncAsync` to sync each completed item with the Mobile App backend. `SyncAsync` calls both push and pull.
   **Whenever you execute a pull against a table that the client has made changes to, a push on the client sync context is always executed
   first automatically**. The implicit push ensures all tables in the local store along with relationships remain consistent. For more
   information on this behavior, see [Offline Data Sync in Azure Mobile Apps].

## Review the client sync code
The Xamarin client project that you downloaded when you completed the tutorial [Create a Xamarin iOS app] already contains code supporting offline
synchronization using a local SQLite database. Here is a brief overview of what is already included in the tutorial code. For a conceptual overview
of the feature, see [Offline Data Sync in Azure Mobile Apps].

* Before any table operations can be performed, the local store must be initialized. The local store database is initialized when
  `QSTodoListViewController.ViewDidLoad()` executes `QSTodoService.InitializeStoreAsync()`. This method creates a new local SQLite database using
  the `MobileServiceSQLiteStore` class provided by the Azure Mobile App client SDK.

    The `DefineTable` method creates a table in the local store that matches the fields in the provided type, `ToDoItem` in this case. The type
    doesn't have to include all the columns that are in the remote database. It is possible to store just a subset of columns.

        // QSTodoService.cs

        public async Task InitializeStoreAsync()
        {
            var store = new MobileServiceSQLiteStore(localDbPath);
            store.DefineTable<ToDoItem>();

            // Uses the default conflict handler, which fails on conflict
            await client.SyncContext.InitializeAsync(store);
        }
* The `todoTable` member of `QSTodoService` is of the `IMobileServiceSyncTable` type instead of `IMobileServiceTable`. The IMobileServiceSyncTable
  directs all create, read, update, and delete (CRUD) table operations to the local store database.

    You decide when those changes are pushed to the Azure Mobile App backend by calling `IMobileServiceSyncContext.PushAsync()`. The sync context
    helps preserve table relationships by tracking and pushing changes in all tables a client app has modified when `PushAsync` is called.

    The provided code calls `QSTodoService.SyncAsync()` to sync whenever the todoitem list is refreshed or a todoitem is added or completed. The
    app syncs after every local change. If a pull is executed against a table that has pending local updates tracked by the context, that pull
    operation will automatically trigger a context push first.

    In the provided code, all records in the remote `TodoItem` table are queried, but it is also possible to filter records by passing a query id
    and query to `PushAsync`. For more information, see the section *Incremental Sync* in [Offline Data Sync in Azure Mobile Apps].

        // QSTodoService.cs
        public async Task SyncAsync()
        {
            try
            {
                await client.SyncContext.PushAsync();
                await todoTable.PullAsync("allTodoItems", todoTable.CreateQuery()); // query ID is used for incremental sync
            }

            catch (MobileServiceInvalidOperationException e)
            {
                Console.Error.WriteLine(@"Sync Failed: {0}", e.Message);
            }
        }

## Additional Resources
* [Offline Data Sync in Azure Mobile Apps]
* [Azure Mobile Apps .NET SDK HOWTO][8]

<!-- Images -->

<!-- URLs. -->
[Create a Xamarin iOS app]: app-service-mobile-xamarin-ios-get-started.md
[Offline Data Sync in Azure Mobile Apps]: app-service-mobile-offline-data-sync.md
[SyncContext]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobileservices.mobileserviceclient.synccontext(v=azure.10).aspx
[8]: app-service-mobile-dotnet-how-to-use-client-library.md
