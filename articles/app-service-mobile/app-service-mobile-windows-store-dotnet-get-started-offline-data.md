<properties
	pageTitle="Enable offline sync for your Universal Windows Platform (UWP) app with Mobile Apps| Azure App Service"
	description="Learn how to use an Azure Mobile App to cache and sync offline data in your Universal Windows Platform (UWP) app."
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
	ms.date="05/14/2016"
	ms.author="wesmc"/>

# Enable offline sync for your Windows app

[AZURE.INCLUDE [app-service-mobile-selector-offline](../../includes/app-service-mobile-selector-offline.md)]

## Overview

This tutorial shows you how to add offline support to a Universal Windows Platform (UWP) app using an Azure Mobile App backend. Offline sync allows end-users to interact with a mobile app&mdash;viewing, adding, or modifying data&mdash;even when there is no network connection. Changes are stored in a local database; once the device is back online, these changes are synced with the remote backend.

In this tutorial, you will update the UWP app project from the tutorial [Create a Windows app] to support the offline features of Azure Mobile Apps. If you do not use the downloaded quick start server project, you must add the data access extension packages to your project. For more information about server extension packages, see [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md).

To learn more about the offline sync feature, see the topic [Offline Data Sync in Azure Mobile Apps].

## Requirements

This tutorial requires the following:

* Visual Studio 2013 running on Windows 8.1.
* Completion of [Create a Windows app][create a windows app].
* [Azure Mobile Services SQLite Store][sqlite store nuget]
* [SQLite for Universal Windows Platform development](http://www.sqlite.org/downloads)

## Update the client app to support offline features

Azure Mobile App offline features allow you to interact with a local database when you are in an offline scenario. To use these features in your app, you initialize a [SyncContext][synccontext] to a local store. Then reference your table through the [IMobileServiceSyncTable][IMobileServiceSyncTable] interface. SQLite is used as the local store on the device.

1. Install the [SQLite runtime for the Universal Windows Platform](http://sqlite.org/2016/sqlite-uwp-3120200.vsix).

2. In Visual Studio, open the NuGet package manager for the UWP app project that you completed in the [Create a Windows app] tutorial, then search for and install the **Microsoft.Azure.Mobile.Client.SQLiteStore** NuGet package.

4. In Solution Explorer, right click **References** > **Add Reference...** > **Universal Windows** > **Extensions**, then enable both **SQLite for Universal Windows Platform** and **Visual C++ 2015 Runtime for Universal Windows Platform apps**.

    ![Add SQLite UWP reference][1]

5. Open the MainPage.xaml.cs file and uncomment the following `using` statements at the top of the file:

        using Microsoft.WindowsAzure.MobileServices.SQLiteStore;  
        using Microsoft.WindowsAzure.MobileServices.Sync;         

6. Comment the line of code that initializes `todoTable` as an **IMobileServiceTable**, then uncomment the line of code that initializes `todoTable` as an **IMobileServiceSyncTable**:

        //private IMobileServiceTable<TodoItem> todoTable = App.MobileService.GetTable<TodoItem>();
        private IMobileServiceSyncTable<TodoItem> todoTable = App.MobileService.GetSyncTable<TodoItem>(); 

7. In the `Offline sync` region of MainPage.xaml.cs, uncomment the following methods: 

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

	In `SyncAsync` a push operation is started from the [SyncContext][synccontext] followed by an incremental sync. The sync context tracks changes made by the client to all tables.  For more information on this behavior, see [Offline Data Sync in Azure Mobile Apps].

8. In the `OnNavigatedTo` event handler, uncomment the call to `InitLocalStoreAsync`. If you have already completed the [authentication tutorial](app-service-mobile-windows-store-dotnet-get-started-users.md), you must instead do this in the `AuthenticateAsync` method. 

9. Uncommment calls to [PushAsync] in the `InsertTodoItem` and `UpdateCheckedTodoItem` methods, then uncomment the call to `SyncAsync` in the `ButtonRefresh_Click` method.

10. In the `SyncAsync` method, add the following exception handlers: 

        private async Task SyncAsync()
        {
            String errorString = null;

            try
            {
                await App.MobileService.SyncContext.PushAsync();
                await todoTable.PullAsync("todoItems", todoTable.CreateQuery()); 
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
                  "you can try your pull again when connected with your backend.";
            }

            if (errorString != null)
            {
                MessageDialog d = new MessageDialog(errorString);
                await d.ShowAsync();
            }
        }

	In an offline situation, [PullAsync][PullAsync] can result in a [MobileServicePushFailedException][MobileServicePushFailedException] with a [PushResult.Status][Status] of [CancelledByNetworkError][CancelledByNetworkError]. This happens when an implicit push tries to push pending updates before the pull and fails. For more information, see [Offline Data Sync in Azure Mobile Apps]. 

11. In Visual Studio, press the **F5** key to rebuild and run the client app. The app works the same as it did before you enabled offline sync. However, the local database is now populated with data that can be used in an offline scenario.  Next, you will create an offline scenario and use locally stored data to start the app.

## <a name="update-sync"></a>Update the app to disconnect from the backend

In this section, you break the connection to your Mobile App backend to simulate an offline situation. When you add data items, your exception handler tells you that the app is in offline mode. In this state, new items added in the local store and will be synced to the mobile app backend when push is next run in a connected state.

1. Edit App.xaml.cs in the shared project. Comment out the initialization of the **MobileServiceClient** and add the following lines, which use an invalid mobile app URL:

         public static MobileServiceClient MobileService =
				new MobileServiceClient("https://your-service.azurewebsites.fail");

	Note that when your app is also using authentication, this will cause sign in to fail. You can also demonstrate offline behavior by disabling wifi and celluar networks on the device or use airplane mode.

2. Press **F5** to build and run the app. Notice your sync failed on refresh when the app launched.
 
3. Enter new items and notice that push fails with a [CancelledByNetworkError] status each time you click **Save**. However, the new todo items exist in the local store until they can be pushed to the mobile app backend.

	In a production app, if you suppress these exceptions the client app behaves as if it's still connected to the mobile app backend.

4. Close the app and restart it to verify that the new items you created are persisted to the local store.

5. (Optional) In Visual Studio, open **Server Explorer**. Navigate to your database in **Azure**->**SQL Databases**. Right-click your database and select **Open in SQL Server Object Explorer**. Now you can browse to your SQL database table and its contents. Verify that the data in the backend database has not changed.

6. (Optional) Use a REST tool such as Fiddler or Postman to query your mobile backend, using a GET query in the form `https://<your-mobile-app-backend-name>.azurewebsites.net/tables/TodoItem`.

## <a name="update-online-app"></a>Update the app to reconnect your Mobile App backend

In this section you reconnect the app to the mobile app backend. This simulates the app moving from an offline state to an online state with the mobile app backend. When you first run the application, the `OnNavigatedTo` event handler will call `InitLocalStoreAsync`. This will in turn call `SyncAsync` to sync your local store with the backend database. So the app will attempt to sync on start up.

1. Open App.xaml.cs in the shared project, and uncomment your previous initialization of `MobileServiceClient` to use the correct the mobile app URL.

2. Press the **F5** key to rebuild and run the app. The app syncs your local changes with the Azure Mobile App backend using push and pull operations as soon as the `OnNavigatedTo` event handler executes.

3. (Optional) View the updated data using either SQL Server Object Explorer or a REST tool like Fiddler. Notice the data has been synchronized between the Azure Mobile App backend database and the local store.

4. In the app, click the check box beside a few items to complete them in the local store.

  `UpdateCheckedTodoItem` calls `SyncAsync` to sync each completed item with the Mobile App backend. `SyncAsync` calls both push and pull. However, you should note that **whenever you execute a pull against a table that the client has made changes to, a push on the client sync context will always be executed first automatically**. This is to ensure all tables in the local store, along with relationships remain consistent. So in this case we could have removed the call to `PushAsync` because it is executed automatically when executing a pull. This behavior may result in an unexpected push if you are not aware of it. For more information on this behavior, see [Offline Data Sync in Azure Mobile Apps].


##API Summary

To support the offline features of mobile services, we used the [IMobileServiceSyncTable] interface and initialized [MobileServiceClient.SyncContext][synccontext] with a local SQLite database. When offline, the normal CRUD operations for Mobile Apps work as if the app is still connected while the operations occur against the local store. The following methods are used to synchronize the local store with the server:

*  **[PushAsync]**  
   Because this method is a member of [IMobileServicesSyncContext], changes across all tables are pushed to the backend. Only records with local changes are sent to the server.

* **[PullAsync]**   
   A pull is started from a [IMobileServiceSyncTable]. When there are tracked changes in the table, an implicit push is run to make sure that all tables in the local store along with relationships remain consistent. The *pushOtherTables* parameter controls whether other tables in the context are pushed in an  implicit push. The *query* parameter takes an [IMobileServiceTableQuery&lt;U&gt;][IMobileServiceTableQuery] or OData query string to filter the returned data. The *queryId* parameter is used to define incremental sync. For more information, see [Offline Data Sync in Azure Mobile Apps](app-service-mobile-offline-data-sync.md#how-sync-works).

* **[PurgeAsync]**  
 Your app should periodically call this method to purge stale data from the local store. Use the *force* parameter when you need to purge any changes that have not yet been synced. 

For more information about these concepts, see [Offline Data Sync in Azure Mobile Apps](app-service-mobile-offline-data-sync.md#how-sync-works).

## More info

The following topics provide additional background information on the offline sync feature of Mobile Apps:

* [Offline Data Sync in Azure Mobile Apps]
* [Cloud Cover: Offline Sync in Azure Mobile Services] (Note that the video is for Mobile Services, but offline sync works in a similar way in Azure Mobile Apps)
* [Azure Friday: Offline-enabled apps in Azure Mobile Services]

<!-- Anchors. -->
[Update the app to support offline features]: #enable-offline-app
[Update the sync behavior of the app]: #update-sync
[Update the app to reconnect your Mobile Apps backend]: #update-online-app
[Next Steps]:#next-steps

<!-- Images -->
[1]: ./media/app-service-mobile-windows-store-dotnet-get-started-offline-data/app-service-mobile-add-reference-sqlite-dialog.png
[11]: ./media/app-service-mobile-windows-store-dotnet-get-started-offline-data/app-service-mobile-add-wp81-reference-sqlite-dialog.png
[13]: ./media/app-service-mobile-windows-store-dotnet-get-started-offline-data/cpu-architecture.png


<!-- URLs. -->
[Offline Data Sync in Azure Mobile Apps]: app-service-mobile-offline-data-sync.md
[create a windows app]: app-service-mobile-windows-store-dotnet-get-started.md
[SQLite for Windows 8.1]: http://go.microsoft.com/fwlink/?LinkID=716919
[SQLite for Windows Phone 8.1]: http://go.microsoft.com/fwlink/?LinkID=716920
[SQLite for Windows 10]: http://go.microsoft.com/fwlink/?LinkID=716921
[synccontext]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobileservices.mobileserviceclient.synccontext(v=azure.10).aspx
[sqlite store nuget]: https://www.nuget.org/packages/Microsoft.Azure.Mobile.Client.SQLiteStore/
[IMobileServiceSyncTable]: https://msdn.microsoft.com/library/azure/mt691742(v=azure.10).aspx
[IMobileServiceTableQuery]: https://msdn.microsoft.com/library/azure/dn250631(v=azure.10).aspx
[IMobileServicesSyncContext]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobileservices.sync.imobileservicesynccontext(v=azure.10).aspx
[MobileServicePushFailedException]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobileservices.sync.mobileservicepushfailedexception(v=azure.10).aspx
[Status]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobileservices.sync.mobileservicepushcompletionresult.status(v=azure.10).aspx
[CancelledByNetworkError]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobileservices.sync.mobileservicepushstatus(v=azure.10).aspx
[PullAsync]: https://msdn.microsoft.com/library/azure/mt667558(v=azure.10).aspx
[PushAsync]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobileservices.mobileservicesynccontextextensions.pushasync(v=azure.10).aspx
[PurgeAsync]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobileservices.sync.imobileservicesynctable.purgeasync(v=azure.10).aspx
[Cloud Cover: Offline Sync in Azure Mobile Services]: http://channel9.msdn.com/Shows/Cloud+Cover/Episode-155-Offline-Storage-with-Donna-Malayeri
[Azure Friday: Offline-enabled apps in Azure Mobile Services]: http://azure.microsoft.com/en-us/documentation/videos/azure-mobile-services-offline-enabled-apps-with-donna-malayeri/
