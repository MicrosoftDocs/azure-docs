<properties
    pageTitle="Enable offline sync for your Azure Mobile App (Xamarin.Forms) | Microsoft Azure"
    description="Learn how to use App Service Mobile App to cache and sync offline data in your Xamarin.Forms application"
    documentationCenter="xamarin"
    authors="ggailey777"
    manager="erikre"
    editor=""
    services="app-service\mobile"/>

<tags
    ms.service="app-service-mobile"
    ms.workload="mobile"
    ms.tgt_pltfrm="mobile-xamarin-ios"
    ms.devlang="dotnet"
    ms.topic="article"
	ms.date="06/18/2016"
    ms.author="glenga"/>

# Enable offline sync for your Xamarin.Forms mobile app

[AZURE.INCLUDE [app-service-mobile-selector-offline](../../includes/app-service-mobile-selector-offline.md)]

## Overview
This tutorial introduces the offline sync feature of Azure Mobile Apps for Xamarin.Forms. Offline sync allows end-users to interact with a mobile app&mdash;viewing, adding, or modifying data&mdash;even when there is no network connection. Changes are stored in a local database; once the device is back online, these changes are synced with the remote service.

This tutorial is based on the Xamarin.Forms quickstart solution for Mobile Apps that you create when you complete the tutorial [Create a Xamarin iOS app]. The quickstart solution for Xamarin.Forms contains the code to support offline sync, which just needs to be enabled. In this tutorial, you will update the quickstart solution to turn on the offline features of Azure Mobile Apps. We will also highlight the offline-specific code in the app. If you do not use the downloaded quickstart solution, you must add the data access extension packages to your project. For more information about server extension packages, see [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md).

To learn more about the offline sync feature, see the topic [Offline Data Sync in Azure Mobile Apps].

## Enable offline sync functionality in the quickstart solution

The offline sync code is included in the project by using C# preprocessor directives. When the **OFFLINE_SYNC_ENABLED** symbol is defined, these code paths are included in the build. For Windows apps, you must also install the SQLite platform. 

1. In Visual Studio, right-click the solution > **Manage NuGet Packages for Solution...**, then search for and install the **Microsoft.Azure.Mobile.Client.SQLiteStore** NuGet package for all projects in the solution.

2. In the Solution Explorer, open the TodoItemManager.cs file from the project with **Portable** in the name, which is Portable Class Library project, then uncomment the following preprocessor directive:

		#define OFFLINE_SYNC_ENABLED

3. In the Solution Explorer, open the TodoList.xaml.cs file from the **Portable** project, locate the **OnAppearing** method, and make sure that `true` is passed for *syncItems* when calling **RefreshItems**, as follows:

		await RefreshItems(true, syncItems: true);
	This means that app will attempt to sync with the backend when it starts.
 
4. (Optional) If you are supporting iOS devices, open the AppDelegate.cs file from the **iOS** project and uncomment the following line of code in the **FinishedLaunching** method: 

		SQLitePCL.CurrentPlatform.Init();

	This initializes the SQLite store on iOS devices.
	The remaining tasks are only required to support Windows devices.

5. (Optional) To support Windows devices, install one of the following SQLite runtime packages:

	* **Windows 8.1 Runtime:** Install [SQLite for Windows 8.1](http://go.microsoft.com/fwlink/p/?LinkID=716919).
    * **Windows Phone 8.1:** Install [SQLite for Windows Phone 8.1]( http://go.microsoft.com/fwlink/p/?LinkID=716920).
    * **Universal Windows Platform** Install [SQLite for the Universal Windows Universal](http://sqlite.org/2016/sqlite-uwp-3120200.vsix).  
    The quickstart doesn't currently include a Universal Windows Platform (UWP) project.

6. (Optional) In each Windows app project, right click **References** > **Add Reference...**, expand the **Windows** folder > **Extensions**, then enable the appropriate **SQLite for Windows Runtime** SDK along with the  **Visual C++ 2013 Runtime for Windows** SDK.   
	Note that the SQLite SDK names vary slightly with each Windows platform. For a UWP project, install the **Visual C++ 2015 Runtime for Universal Windows Platform apps** SDK.


## Review the client sync code

Here is a brief overview of what is already included in the tutorial code inside the `#if OFFLINE_SYNC_ENABLED` directives. Note that the offline sync functionality is in the TodoItemManager.cs project file in the Portable Class Library project. For a conceptual overview of the feature, see [Offline Data Sync in Azure Mobile Apps].

* Before any table operations can be performed, the local store must be initialized. The local store database is initialized in the **TodoItemManager** class constructor by using the following code: 

	    var store = new MobileServiceSQLiteStore("localstore.db");
        store.DefineTable<TodoItem>();

        //Initializes the SyncContext using the default IMobileServiceSyncHandler.
        this.client.SyncContext.InitializeAsync(store);

        this.todoTable = client.GetSyncTable<TodoItem>();

	This creates a new local SQLite database using the **MobileServiceSQLiteStore** class. The **DefineTable** method creates a table in the local store that matches the fields in the provided type, `ToDoItem` in this case. The type doesn't have to include all of the columns that are in the remote database. It is possible to store just a subset of columns.

* The **todoTable** field in **TodoItemManager** is an **IMobileServiceSyncTable** type instead of **IMobileServiceTable**. This class uses the local database for all create, read, update, and delete (CRUD) table operations. You decide when those changes are pushed up to the Mobile App backend by calling **PushAsync** on the **IMobileServiceSyncContext** used by the client. This sync context helps preserve table relationships by tracking and pushing changes in all tables a client app has modified when **PushAsync** is called.

	The following **SyncAsync** method is called to sync with the Mobile App backend: 

		public async Task SyncAsync()
        {
            ReadOnlyCollection<MobileServiceTableOperationError> syncErrors = null;

            try
            {
                await this.client.SyncContext.PushAsync();

                await this.todoTable.PullAsync(
                    "allTodoItems",
                    this.todoTable.CreateQuery());
            }
            catch (MobileServicePushFailedException exc)
            {
                if (exc.PushResult != null)
                {
                    syncErrors = exc.PushResult.Errors;
                }
            }

            // Simple error/conflict handling. 
            if (syncErrors != null)
            {
                foreach (var error in syncErrors)
                {
                    if (error.OperationKind == MobileServiceTableOperationKind.Update && error.Result != null)
                    {
                        //Update failed, reverting to server's copy.
                        await error.CancelAndUpdateItemAsync(error.Result);
                    }
                    else
                    {
                        // Discard local change.
                        await error.CancelAndDiscardItemAsync();
                    }

                    Debug.WriteLine(@"Error executing sync operation. Item: {0} ({1}). Operation discarded.",
						error.TableName, error.Item["id"]);
                }
            }
        }

	This sample uses simple error handling with the default sync handler. A real application would handle the various errors like network conditions, server conflicts and others by using a custom the **IMobileServiceSyncHandler** implementation.

##Offline sync considerations

In the sample, the **SyncAsync** method is only called on start-up and when a sync is specifically requested.  To initiate sync in an Android or iOS app, pull down on the items list; for Windows, use the **Sync** button. In a real-world application, you could also make this sync functionality triggered when the network state changes.

When a pull is executed against a table that has pending local updates tracked by the context, that pull operation will automatically trigger a preceding context push. When refreshing, adding and completing items in this sample, you can omit the explicit **PushAsync** call, since it is redundant.

In the provided code, all records in the remote TodoItem table are queried, but it is also possible to filter records by passing a query id and query to **PushAsync**. For more information see the section *Incremental Sync* in [Offline Data Sync in Azure Mobile Apps].


## Run the client app

With offline sync now enabled, you can now run the client application at least once on each platform to to populate the local store database. Later, you will simulate an offline scenario and modify the data in the local store while the app is offline.

## Update the sync behavior of the client app

In this section, you will modify the client project to simulate an offline scenario by using an invalid application URL for your backend. When you add or change data items, these changes will be held in the local store, but not synced to the backend data store until the connection is re-established.

2. In the Solution Explorer, open the Constants.cs project file from the **Portable** project and change the value of `ApplicationURL` to point to an invalid URL, like the following:

        publis static string ApplicationURL = @"https://your-service.azurewebsites.xxx/";


2. Open the TodoItemManager.cs file from the **Portable** project, then add an additional **catch** for the base **Exception** class to the **try...catch** block  in **SyncAsync**. This **catch** block writes the exception message to the console, as follows:

            catch (Exception ex)
            {
                Console.Error.WriteLine(@"Exception: {0}", ex.Message);
            }

3. Build and run the client app, add some new items and notice that an exception is logged in the console for each attempt to sync with the backend. These new items exist only in the local store until they can be pushed to the mobile backend. The client app behaves as if is connected to the backend, supporting all create, read, update, delete (CRUD) operations.

4. Close the app and restart it to verify that the new items you created are persisted to the local store.

5. (Optional) Use Visual Studio to view your Azure SQL Database table to see that the data in the backend database has not changed.

	In Visual Studio, open **Server Explorer**. Navigate to your database in **Azure**->**SQL Databases**. Right-click your database and select **Open in SQL Server Object Explorer**. Now you can browse to your SQL database table and its contents.


## Update the client app to reconnect your mobile backend

In this section you will reconnect the app to the mobile backend, which simulates the app coming back to an online state. When you perform the refresh gesture, data will be synced to your mobile backend.

1. Reopen Constants.cs, then correct the `applicationURL` to point to the correct URL.

2. Rebuild and run the client app. The app attempts to sync with the mobile app backend after launching. Verify that no exceptions are logged in the debug console.

3. (Optional) View the updated data using either SQL Server Object Explorer or a REST tool like Fiddler. Notice the data has been synchronized between the backend database and the local store.

    Notice the data has been synchronized between the database and the local store and contains the items you added while your app was disconnected.

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
[Create a Xamarin iOS app]: app-service-mobile-xamarin-ios-get-started.md
[Offline Data Sync in Azure Mobile Apps]: app-service-mobile-offline-data-sync.md
[How to use the Xamarin Component client for Azure Mobile Services]: partner-xamarin-mobile-services-how-to-use-client-library.md
[Cloud Cover: Offline Sync in Azure Mobile Services]: http://channel9.msdn.com/Shows/Cloud+Cover/Episode-155-Offline-Storage-with-Donna-Malayeri
