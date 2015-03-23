<properties 
	pageTitle="Using offline data in Mobile Services (Xamarin iOS) | Mobile Dev Center" 
	description="Learn how to use Azure Mobile Services to cache and sync offline data in your Xamarin iOS application" 
	documentationCenter="xamarin" 
	authors="lindydonna" 
	editor="wesmc" 
	manager="dwrede" 
	services="mobile-services"/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="03/20/2015" 
	ms.author="donnam"/>

# Using offline data sync in Mobile Services

[AZURE.INCLUDE [mobile-services-selector-offline](../includes/mobile-services-selector-offline.md)]

This topic walks through the offline sync capabilities of Azure Mobile Services in the todo list quickstart app. Offline sync allows you to easily create apps that are usable even when the end user has no network access.

Offline sync has several potential uses:

* Improve app responsiveness by caching server data locally on the device
* Make apps resilient against intermittent network connectivity
* Allow end-users to create and modify data even when there is no network access, supporting scenarios with little or no connectivity
* Sync data across multiple devices and detect conflicts when the same record is modified by two devices

>[AZURE.NOTE] To complete this tutorial, you need a Azure account. If you don't have an account, you can sign up for an Azure trial and get up to 10 free mobile services that you can keep using even after your trial ends. For details, see <a href="http://www.windowsazure.com/pricing/free-trial/?WT.mc_id=AE564AB28" target="_blank">Azure Free Trial</a>. 
>
> If this is your first experience with Mobile Services, you should first complete [Get started with Mobile Services].

This tutorial walks you through these basic steps:

1. [Review the Mobile Services sync code]
2. [Update the sync behavior of the app]
3. [Update the app to reconnect your mobile service]

This tutorial requires the following:

* Visual Studio with the [Xamarin extension] **or** [Xamarin Studio] on OS X
* XCode 4.5 and iOS 6.0 (or later versions) 
* Completion of the [Get started with Mobile Services] tutorial

## <a name="review-offline"></a>Review the Mobile Services sync code

Azure Mobile Services offline sync allows end users to interact with a local database when the network is not accessible. To use these features in your app, you initialize `MobileServiceClient.SyncContext` to a local store. Then reference your table through the `IMobileServiceSyncTable` interface. 
This section walks through the offline sync related code in `QSTodoService.cs`.

1. In Visual Studio, open the project that you completed in the [Get started with Mobile Services] tutorial. Open the file `QSTodoService.cs`.

2. Notice the type of the member `todoTable` is `IMobileServiceSyncTable`. Offline sync uses this sync table interface instead of `IMobileServiceTable`. When a sync table is used, all operations go to the local store and are only synchronized with the remote service with explicit push and pull operations.

    To get a reference to a sync table, the method `GetSyncTable()` is used. To remove the offline sync functionality, you would instead use `GetTable()`.

3. Before any table operations can be performed, the local store must be initialized. This is done in the `InitializeStoreAsync` method:

        public async Task InitializeStoreAsync()
        {
            var store = new MobileServiceSQLiteStore(localDbPath);
            store.DefineTable<ToDoItem>();

            // Uses the default conflict handler, which fails on conflict
            await client.SyncContext.InitializeAsync(store);
        }

    This creates a local store using the class `MobileServiceSQLiteStore`, which is provided in the Mobile Services SDK. You can also a provide a different local store implementation by implementing `IMobileServiceLocalStore`.

    The `DefineTable` method creates a table in the local store that matches the fields in the provided type, `ToDoItem` in this case. The type doesn't have to include all of the columns that are in the remote database--it is possible to store just a subset of columns.

    This overload of `InitializeAsync` uses the default conflict handler, which fails whenever there is a conflict. To provide a custom conflict handler, see the tutorial [Handling conflicts with offline support for Mobile Services].

4. The method `SyncAsync` triggers the actual sync operation:

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

    First, there is a call to `IMobileServiceSyncContext.PushAsync()`. This method is a member of `IMobileServicesSyncContext` instead of the sync table because it will push changes across all tables. Only records that have been modified in some way locally (through CUD operations) will be sent to the server.

    Next, the method calls `IMobileServiceSyncTable.PullAsync()` to pull data from a table on the server to the app. Note that if there are any changes pending in the sync context, a pull always issues a push first. This is to ensure all tables in the local store along with relationships are consistent. In this case, we have called push explicitly.

    In this example, we retrieve all records in the remote `TodoItem` table, but it is also possible to filter records by passing a query. The first parameter to `PullAsync()` is a query ID that is used for incremental sync, which uses the `UpdatedAt` timestamp to get only those records modified since the last sync. The query ID should be a descriptive string that is unique for each logical query in your app. To opt-out of incremental sync, pass `null` as the query ID. This will retrieve all records on each pull operation, which is potentially inefficient.

    >[AZURE.NOTE] To remove records from the device local store when they have been deleted in your mobile service database, you should enable [Soft Delete]. Otherwise, your app should periodically call `IMobileServiceSyncTable.PurgeAsync()` to purge the local store.

    Note that the `MobileServicePushFailedException` can occur for both a push and a pull operation. The next tutorial, [Handling conflicts with offline support for Mobile Services], shows how to handle these sync related exceptions.

5. In the class `QSTodoService`, the method `SyncAsync()` is called after the operations that modify data, `InsertTodoItemAsync()` and `CompleteItemAsync`. It is also called from `RefreshDataAsync()`, so that the user gets the latest data whenever they perform the refresh gesture. The app also performs a sync on launch, since `QSTodoListViewController.ViewDidLoad()` calls `RefreshDataAsync()`.

    Because `SyncAsync()` is called whenever data is modified, this app assumes that the user is online whenever they are editing data. In the next section, we will update the app so that users can edit even when they are offline.

## <a name="update-sync"></a>Update the sync behavior of the app

In this section, you will modify the app so that it does not sync on app launch or on the insert and update operations, but only when the refresh gesture is performed. Then, you will break the app connection with the mobile service to simulate an offline scenario. When you add data items, they will be held in the local store, but not immediately synced to the mobile service.

1. Open `QSTodoService.cs`. Comment out the calls to `SyncAsync()` in the following methods:

    - `InsertTodoItemAsync`
    - `CompleteItemAsync`
    - `RefreshAsync`

    Now, `RefreshAsync()` will only load data from the local store, but will not connect to the app backend.

2. In `QSTodoService.cs`, comment out the definitions of the members `applicationURL` and `applicationKey`. Add the following lines, which reference an invalid mobile service URL:

        const string applicationURL = @"https://your-mobile-service.azure-mobile.xxx/";
        const string applicationKey = @"AppKey";

3. To ensure that data is synchronized when the refresh gesture is performed, edit the method `QSTodoListViewController.RefreshAsync()`. Add a call to `SyncAsync()` before the call to `RefreshDataAsync()`:

        private async Task RefreshAsync ()
        {
            RefreshControl.BeginRefreshing ();

            await todoService.SyncAsync();
            await todoService.RefreshDataAsync (); // add this line

            RefreshControl.EndRefreshing ();

            TableView.ReloadData ();
        }

4. Build and run the app. Add some new todo items. These new items exist only in the local store until they can be pushed to the mobile service. The client app behaves as if is connected to the mobile service supporting all create, read, update, delete (CRUD) operations.

5. Close the app and restart it to verify that the new items you created are persisted to the local store.

## <a name="update-online-app"></a>Update the app to reconnect your mobile service

In this section you will reconnect the app to the mobile service. This simulates the app moving from an offline state to an online state with the mobile service. When you perform the refresh gesture, data will be synced to your mobile service.

1. Open `QSTodoService.cs`. Remove the invalid mobile service URL and add back the correct URL and app key.

2. Rebuild and run the app. Notice that the data looks the same as the offline scenario even though the app is now connected to the mobile service. This is because this app always uses the `IMobileServiceSyncTable` that is pointed to the local store.

3. Log into the Microsoft Azure Management portal and look at the database for your mobile service. If your service uses the JavaScript backend, you can browse the data from the **Data** tab of the mobile service. 

    If you are using the .NET backend for your mobile service, in Visual Studio go to **Server Explorer** -> **Azure** -> **SQL Databases**. Right click your database and select **Open in SQL Server Object Explorer**.

    Notice the data has *not* been synchronized between the database and the local store.

4. In the app, perform the refresh gesture by pulling down the list of items. This causes the app to call `RefreshDataAsync()`, which in turn calls `SyncAsync()`. This will perform the push and pull operations, first sending the local store items to the mobile service, then retrieving new data from the service.

5. Check the database for your mobile service to confirm that changes have been synchronized.

##Summary

[AZURE.INCLUDE [mobile-services-offline-summary-csharp](../includes/mobile-services-offline-summary-csharp.md)]

## Next steps

* [Handling conflicts with offline support for Mobile Services]

* [How to use the Xamarin Component client for Azure Mobile Services]

<!-- Anchors. -->
[Review the Mobile Services sync code]: #review-offline
[Update the sync behavior of the app]: #update-sync
[Update the app to reconnect your mobile service]: #update-online-app

<!-- Images -->

<!-- URLs. -->
[Handling conflicts with offline support for Mobile Services]: mobile-services-xamarin-ios-handling-conflicts-offline-data.md 
[Get started with data]: partner-xamarin-mobile-services-ios-get-started-data.md
[Get started with Mobile Services]: partner-xamarin-mobile-services-ios-get-started.md
[How to use the Xamarin Component client for Azure Mobile Services]: partner-xamarin-mobile-services-how-to-use-client-library.md
[Soft Delete]: mobile-services-using-soft-delete.md

[Xamarin Studio]: http://xamarin.com/download
[Xamarin extension]: http://xamarin.com/visual-studio
