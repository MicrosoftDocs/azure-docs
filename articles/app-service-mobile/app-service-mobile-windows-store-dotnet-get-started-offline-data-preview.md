<properties
	pageTitle="Enable offline sync for your Azure Mobile App (Windows 8.1) | Microsoft Azure"
	description="Learn how to use an Azure Mobile App to cache and sync offline data in your Windows Store application"
	documentationCenter="windows"
	authors="wesmc7777"
	manager="dwrede"
	editor=""
	services="app-service\mobile"/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-windows"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="08/27/2015"
	ms.author="wesmc"/>

# Enable offline sync for your Windows app

[AZURE.INCLUDE [app-service-mobile-selector-offline-preview](../../includes/app-service-mobile-selector-offline-preview.md)]
&nbsp;  
[AZURE.INCLUDE [app-service-mobile-note-mobile-services-preview](../../includes/app-service-mobile-note-mobile-services-preview.md)]

## Overview

This tutorial shows you how to add offline support to a Windows 8.1 Store or Phone app using an Azure Mobile App backend. Offline sync allows end-users to interact with a mobile app--viewing, adding, or modifying data--even when there is no network connection. Changes are stored in a local database; once the device is back online, these changes are synced with the remote backend.

In this tutorial, you will update the Windows 8.1 app project from the tutorial [Create a Windows app] to support the offline features of Azure Mobile Apps. If you do not use the downloaded quick start server project, you must add the data access extension packages to your project. For more information about server extension packages, see [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md). 

To learn more about the offline sync feature, see the topic [Offline Data Sync in Azure Mobile Apps].

## Requirements

This tutorial requires the following:

* Visual Studio 2013 running on Windows 8.1.
* Completion of [Create a Windows app][create a windows app].
* [Azure Mobile Services SQLite Store version 2.0.0-beta][sqlite store nuget]
* [SQLite for Windows 8.1](http://www.sqlite.org/downloads)

## Update the client app to support offline features

Azure Mobile App offline features allow you to interact with a local database when you are in an offline scenario. To use these features in your app, you initialize a `MobileServiceClient.SyncContext` to a local store. Then reference your table through the `IMobileServiceSyncTable` interface. In this tutorial we use SQLite for the local store.

1. Install the SQLite runtime for Windows 8.1 and Windows Phone 8.1.

    * **Windows 8.1 Runtime:** Install [SQLite for Windows 8.1].
    * **Windows Phone 8.1:** Install [SQLite for Windows Phone 8.1].

    >[AZURE.NOTE] If you are using Internet Explorer, clicking the link to install SQLite may prompt you to download the .vsix as a .zip file. Save the file to a location on your hard drive with the .vsix extension instead of .zip. The double click the .vsix file in Windows Explorer to run the installation.

2. In Visual Studio open the project that you completed in the [Create a Windows app] tutorial. Install the **WindowsAzure.MobileServices.SQLiteStore** NuGet package for the Windows 8.1 runtime and Windows Phone 8.1 projects.

    In Solution Explorer, right click the solution and click **Manage Nuget Packages for Solution** to run NuGet Package Manager. In the "Online" tab, select the option "Include Prerelease" in the dropdown at the top. Search for **SQLiteStore** to install the 2.0.0-beta of `WindowsAzure.MobileServices.SQLiteStore`. 

    Then, add the NuGet reference to both the Windows Store 8.1 and Windows Phone 8.1 projects.

    >[AZURE.NOTE] If the installation creates an additional reference to a different version of SQLite than you have installed, you will get a compilation error. You should resolve this error by removing the duplicate in the **References** node in your projects.

3. In Solution Explorer, right click **References** for the Windows 8.1 Runtime and Windows Phone 8.1 platform projects and ensure there is a reference to SQLite, which is located in the **Extensions** section.

    ![][1]
    </br>

    **Windows 8.1 Runtime**

    ![][11]
    </br>

    **Windows Phone 8.1**

4. SQLite is a native library and requires that you choose a platform-specific architecture such as **x86**, **x64**, or **ARM**. **Any CPU** is not supported. In Solution Explorer, click the Solution at the top, then change the processor architecture drop down box to one of the supported settings that you want to test.

    ![][13]

5. In Solution Explorer, in the shared project, open the MainPage.cs file. Uncomment the following using statements at the top of the file:

        using Microsoft.WindowsAzure.MobileServices.SQLiteStore;  // offline sync
        using Microsoft.WindowsAzure.MobileServices.Sync;         // offline sync

6. In MainPage.cs, comment the line of code that initializes `todoTable` as an `IMobileServiceTable`. Uncomment the line of code that initializes `todoTable` as an `IMobileServiceSyncTable`:

        //private IMobileServiceTable<TodoItem> todoTable = App.MobileService.GetTable<TodoItem>();
        private IMobileServiceSyncTable<TodoItem> todoTable = App.MobileService.GetSyncTable<TodoItem>(); // offline sync

7. In MainPage.cs, in the region marked `Offline sync`, uncomment the methods `InitLocalStoreAsync` and `SyncAsync`. The method `InitLocalStoreAsync` initializes the client sync context with a SQLite store. In Visual Studio, you can select all commented lines and use the **Ctrl**+**K**+**U** keyboard shortcut to uncomment.

	Notice in `SyncAsync` a push operation is executed off the `MobileServiceClient.SyncContext` instead of the `IMobileServicesSyncTable`. This is because the context tracks changes made by the client for all tables. This is to cover scenarios where there are relationships between tables. For more information on this behavior, see [Offline Data Sync in Azure Mobile Apps].

        private async Task InitLocalStoreAsync()
        {
            if (!App.MobileService.SyncContext.IsInitialized)
            {
                var store = new MobileServiceSQLiteStore("localstore.db");
                store.DefineTable<TodoItem>();
                await App.MobileService.SyncContext.InitializeAsync(store);
            }

            await SyncAsync();
        }

        private async Task SyncAsync()
        {
            await App.MobileService.SyncContext.PushAsync();
            await todoTable.PullAsync("todoItems", todoTable.CreateQuery());
        }

8. In the `OnNavigatedTo` event handler, uncomment the call to `InitLocalStoreAsync`:

        protected override async void OnNavigatedTo(NavigationEventArgs e)
        {
            await InitLocalStoreAsync(); // offline sync
            await RefreshTodoItems();
        }

9. Uncommment the 3 calls to `SyncAsync` in the methods `InsertTodoItem`, `UpdateCheckedTodoItem`, and `ButtonRefresh_Click`:

        private async Task InsertTodoItem(TodoItem todoItem)
        {
            await todoTable.InsertAsync(todoItem);
            items.Add(todoItem);

            await SyncAsync(); // offline sync
        }

        private async Task UpdateCheckedTodoItem(TodoItem item)
        {
            await todoTable.UpdateAsync(item);
            items.Remove(item);
            ListItems.Focus(Windows.UI.Xaml.FocusState.Unfocused);

            await SyncAsync(); // offline sync
        }

        private async void ButtonRefresh_Click(object sender, RoutedEventArgs e)
        {
            ButtonRefresh.IsEnabled = false;

            await SyncAsync(); // offline sync
            await RefreshTodoItems();

            ButtonRefresh.IsEnabled = true;
        }

10. Add exception handlers in the `SyncAsync` method. In an offline situation a `MobileServicePushFailedException` will be thrown with `PushResult.Status == CancelledByNetworkError`.

        private async Task SyncAsync()
        {
            String errorString = null;

            try
            {
                await App.MobileService.SyncContext.PushAsync();
                await todoTable.PullAsync("todoItems", todoTable.CreateQuery()); // first param is query ID, used for incremental sync
            }

            catch (MobileServicePushFailedException ex)
            {
                errorString = "Push failed because of sync errors. You may be offine.\nMessage: " +
                  ex.Message + "\nPushResult.Status: " + ex.PushResult.Status.ToString();
            }
            catch (Exception ex)
            {
                errorString = "Pull failed: " + ex.Message +
                  "\n\nIf you are still in an offline scenario, " +
                  "you can try your Pull again when connected with your Mobile Serice.";
            }

            if (errorString != null)
            {
                MessageDialog d = new MessageDialog(errorString);
                await d.ShowAsync();
            }
        }

    In this `PullAsync` example, we retrieve all records in the remote `todoTable`, but it is also possible to filter records by passing a query. The first parameter to `PullAsync` is a query ID that is used for incremental sync, which uses the `UpdatedAt` timestamp to get only records modified since the last sync. The query ID should be a descriptive string that is unique for each logical query in your client application. To opt-out of incremental sync, pass `null` as the query ID. This will retrieve all records on each pull operation, which is potentially inefficient.

    Note that the `MobileServicePushFailedException` can occur for both a push and a pull operation. It can occur for a pull because the pull operation internally executes a push to make sure all tables along with any relationships are consistent.

11. In Visual Studio, press the **F5** key to rebuild and run the client app. The app will behave the same as it did before the offline sync changes, because it does a sync operation on the insert, update, and refresh operations. However, it will populate a local database which can be used in an offline scenario.  We will cause and offline scenario in the next section now that the local database is populated.  

## <a name="update-sync"></a>Update the sync behavior of the client app

In this section, you will modify the client app to simulate an offline scenario by breaking your connection to the Azure Mobile App backend. When you add data items, your exception handler will inform you that the app is operating in offline mode with `PushResult.Status == CancelledByNetworkError`. Items added will be held in the local store, but not synced to the mobile app backend until you are online again and execute a successful push to the Azure Mobile App backend.

1. Edit App.xaml.cs in the shared project. Comment out the initialization of the **MobileServiceClient** and add the following lines, which use an invalid mobile app URL:

         public static MobileServiceClient MobileService = new MobileServiceClient(
            "https://your-service.azurewebsites.fail",
            "https://your-gateway.azurewebsites.fail",
            ""
        );

2. Press **F5** to build and run the app. Notice your sync failed on refresh when the app launched.
3. Enter some new todo items and click **Save** for each one. Push fails for each one with a `PushResult.Status=CancelledByNetworkError`. The new todo items exist only in the local store until they can be pushed to the mobile app backend. 
 
	You could suppress the exception dialog for `PushResult.Status=CancelledByNetworkError`, then client app would behave as if its connected to the mobile app backend supporting all create, read, update, delete (CRUD) operations seamlessly. 

4. Close the app and restart it to verify that the new items you created are persisted to the local store.

5. (Optional) Use Visual Studio to view your Azure SQL Database table to see that the data in the backend database has not changed. 

   In Visual Studio, open **Server Explorer**. Navigate to your database in **Azure**->**SQL Databases**. Right-click your database and select **Open in SQL Server Object Explorer**. Now you can browse to your SQL database table and its contents.

6. (Optional) Use a REST tool such as Fiddler or Postman to query your mobile backend, using a GET query in the form `https://your-mobile-app-backend-name.azurewebsites.net/tables/TodoItem`. 

## <a name="update-online-app"></a>Update the app to reconnect your Mobile App backend

In this section you reconnect the app to the mobile app backend. This simulates the app moving from an offline state to an online state with the mobile app backend. When you first run the application, the `OnNavigatedTo` event handler will call `InitLocalStoreAsync`. This will in turn call `SyncAsync` to sync your local store with the backend database. So the app will attempt to sync on start up.

1. Open App.xaml.cs in the shared project. Uncomment your previous initialization of `MobileServiceClient` to use the correct Mobile App URL and gateway URL.

2. Press the **F5** key to rebuild and run the app. The app syncs your local changes with the Azure Mobile App backend using push and pull operations as soon as the `OnNavigatedTo` event handler executes.

3. (Optional) View the updated data using either SQL Server Object Explorer or a REST tool like Fiddler. Notice the data has been synchronized between the Azure Mobile App backend database and the local store.

4. In the app, click the check box beside a few items to complete them in the local store.

  `UpdateCheckedTodoItem` calls `SyncAsync` to sync the complete each item with the Mobile App backend. `SyncAsync` calls both push and pull. However, you should note that **whenever you execute a pull against a table that the client has made changes to, a push on the client sync context will always be executed first automatically**. This is to ensure all tables in the local store, along with relationships remain consistent. So in this case we could have removed the call to `PushAsync` because it is executed automatically when executing a pull. This behavior may result in an unexpected push if you are not aware of it. For more information on this behavior, see [Offline Data Sync in Azure Mobile Apps].


##Summary

In order to support the offline features of mobile services, we used the `IMobileServiceSyncTable` interface and initialized `MobileServiceClient.SyncContext` with a local store. In this case the local store was a SQLite database.

The normal CRUD operations for mobile services work as if the app is still connected but, all the operations occur against the local store.

When we want to synchronize the local store with the server, we used the `IMobileServiceSyncTable.PullAsync` and `MobileServiceClient.SyncContext.PushAsync` methods.

*  To push changes to the server, we called `IMobileServiceSyncContext.PushAsync()`. This method is a member of `IMobileServicesSyncContext` instead of the sync table because it will push changes across all tables.

    Only records that have been modified in some way locally (through CUD operations) will be sent to the server.

* To pull data from a table on the server to the app, we called `IMobileServiceSyncTable.PullAsync`.

    A pull always issues a sync context push first if the client sync context has tracked changes on that table. This is to ensure all tables in the local store along with relationships remain consistent.

    There are also overloads of `PullAsync()` that allow a query to be specified in order to filter the data that is stored on the client. If a query is not passed, `PullAsync()` will pull all rows in the corresponding table (or query). You can pass the query to filter only the changes your app needs to sync with.

* To enable incremental sync, pass a query ID to `PullAsync()`. The query ID is used to store the last updated timestamp from the results of the last pull operation. The query ID should be a descriptive string that is unique for each logical query in your app. If the query has a parameter, then the same parameter value could be part of the query ID.

    For instance, if you are filtering on userid, your unique query ID could be:

        await PullAsync("todoItems" + userid, syncTable.Where(u => u.UserId = userid));

    If you want to opt out of incremental sync, pass `null` as the query ID. In this case, all records will be retrieved on every call to `PullAsync`, which is potentially inefficient.

* Your app should periodically call `IMobileServiceSyncTable.PurgeAsync()` to purge the local store.


## Additional Resources

* [Offline Data Sync in Azure Mobile Apps]

* [Cloud Cover: Offline Sync in Azure Mobile Services] \(note: the video is on Mobile Services, but offline sync works in a similar way in Azure Mobile Apps\)

* [Azure Friday: Offline-enabled apps in Azure Mobile Services]

<!-- Anchors. -->
[Update the app to support offline features]: #enable-offline-app
[Update the sync behavior of the app]: #update-sync
[Update the app to reconnect your Mobile Apps backend]: #update-online-app
[Next Steps]:#next-steps

<!-- Images -->
[1]: ./media/app-service-mobile-windows-store-dotnet-get-started-offline-data-preview/app-service-mobile-add-reference-sqlite-dialog.png
[11]: ./media/app-service-mobile-windows-store-dotnet-get-started-offline-data-preview/app-service-mobile-add-wp81-reference-sqlite-dialog.png
[13]: ./media/app-service-mobile-windows-store-dotnet-get-started-offline-data-preview/cpu-architecture.png


<!-- URLs. -->
[Offline Data Sync in Azure Mobile Apps]: ../app-service-mobile-offline-data-sync-preview.md
[create a windows app]: ../app-service-mobile-dotnet-backend-windows-store-dotnet-get-started-preview.md
[sqlite for windows 8.1]: http://go.microsoft.com/fwlink/?LinkId=394776
[sqlite for windows phone 8.1]: http://go.microsoft.com/fwlink/?LinkId=397953

[azure mobile app sdk nuget]: http://www.nuget.org/packages/WindowsAzure.MobileServices/2.0.0-beta
[sqlite store nuget]: http://www.nuget.org/packages/WindowsAzure.MobileServices.SQLiteStore/2.0.0-beta
 
[Cloud Cover: Offline Sync in Azure Mobile Services]: http://channel9.msdn.com/Shows/Cloud+Cover/Episode-155-Offline-Storage-with-Donna-Malayeri
[Azure Friday: Offline-enabled apps in Azure Mobile Services]: http://azure.microsoft.com/en-us/documentation/videos/azure-mobile-services-offline-enabled-apps-with-donna-malayeri/
