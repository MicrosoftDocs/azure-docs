<properties 
	pageTitle="Using offline data in Mobile Services (Windows Phone) | Mobile Dev Center" 
	description="Learn how to use Azure Mobile Services with sync offline data in your Windows Phone application" 
	documentationCenter="mobile-services" 
	authors="lindydonna" 
	manager="dwrede" 
	editor="" 
	services="mobile-services"/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-phone" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="04/16/2015" 
	ms.author="wesmc;donnam"/>

# Using offline data sync in Mobile Services

[AZURE.INCLUDE [mobile-services-selector-offline](../includes/mobile-services-selector-offline.md)]


This topic shows you how to use use the offline capabilities of Azure Mobile Services. Azure Mobile Services offline features allow you to interact with a local database when you are in an offline scenario with your Mobile Service. The offline features allow you to sync your local changes with the mobile service when you are online again. 

In this tutorial, you will update the app from the [Get Started with Data] tutorial to support the offline features of Azure Mobile Services. Then you will add data in a disconnected offline scenario, sync those items to the online database, and then log in to the Azure Management Portal to view changes to data made when running the app.


>[AZURE.NOTE] This tutorial is intended to help you better understand how Mobile Services enables you to use Azure to store and retrieve data in a Windows Phone app. If this is your first experience with Mobile Services, consider first completing the [Get started with Mobile Services] and [Get Started with Data] tutorials. 

This tutorial walks you through these basic steps:

1. [Update the app to support offline features]
2. [Test the app in an offline scenario] 
3. [Update the app to reconnect your mobile service]
4. [Test the app connected to the Mobile Service]

This tutorial requires the following:

* Visual Studio 2012
* [Windows Phone 8 SDK]
* Completion of the [Get Started with Data] tutorial.
* [Azure Mobile Services SDK version 1.3.0 (or later)][Mobile Services SDK Nuget]
* [Azure Mobile Services SQLite Store version 1.0.0 (or later)][SQLite store nuget]
* [SQLite for Windows Phone 8]

>[AZURE.NOTE] To complete this tutorial, you need a Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/pricing/free-trial/?WT.mc_id=AE564AB28" target="_blank">Azure Free Trial</a>. 

## <a name="enable-offline-app"></a>Update the app to support offline features

Azure Mobile Services offline features allow you to interact with a local database when you are in an offline scenario with your Mobile Service. To use these features in your app, you initialize `MobileServiceClient.SyncContext` to a local store. Then reference your table through the `IMobileServiceSyncTable` interface.

This section uses SQLite as the local store for the offline features.

>[AZURE.NOTE] You can skip this section and just download a version of the Getting Started project that already has offline support.  To download a project with offline support enabled, see [Getting Started Offline Sample for Windows Phone].


1. Install SQLite for Windows Phone 8 projects. You can install it from this link, [SQLite for Windows Phone 8].

    >[AZURE.NOTE] If you are using Internet Explorer, clicking the link to install SQLite may prompt you to download the .vsix as a .zip file. Save the file to a location on your hard drive with the .vsix extension instead of .zip. The double click the .vsix file in Windows Explorer to run the installation.

2. In Visual Studio open the project that you completed in the [Get started with Mobile Services] or [Get Started with Data] tutorial. In Solution Explorer, right click **References** under the project and add a reference to **SQLite for Windows Phone** under **Windows Phone**>**Extensions**. 

    ![][1]

3. The SQLite Runtime requires you to change the processor architecture of the project being built to **x86**, **x64**, or **ARM**. **Any CPU** is not supported. Change the processor architecture to one of the supported settings that you want to test.

    ![][11]

4. In Solution Explorer for Visual Studio, right click your client app project and click **Manage Nuget Packages** to run NuGet Package Manager. Search for **SQLiteStore** to install the **WindowsAzure.MobileServices.SQLiteStore** package.

    ![][2]

5. In Solution Explorer for Visual Studio, open the MainPage.xaml.cs file. Add the following using statements to the top of the file.

        using Microsoft.WindowsAzure.MobileServices.SQLiteStore;
        using Microsoft.WindowsAzure.MobileServices.Sync;
        using Newtonsoft.Json.Linq;

6. In Mainpage.xaml.cs replace the declaration of `todoTable` with a declaration of type `IMobileServicesSyncTable` that is initialized by calling `MobileServicesClient.GetSyncTable()`.

        //private IMobileServiceTable<TodoItem> todoTable = App.MobileService.GetTable<TodoItem>();
        private IMobileServiceSyncTable<TodoItem> todoTable = App.MobileService.GetSyncTable<TodoItem>();

7. In MainPage.xaml.cs, update the `TodoItem` class so that the class includes the **Version** system property as follows.

        public class TodoItem
        {
          public string Id { get; set; }
          [JsonProperty(PropertyName = "text")]
          public string Text { get; set; }
          [JsonProperty(PropertyName = "complete")]
          public bool Complete { get; set; }
          [Version]
          public string Version { get; set; }
        }


8. In MainPage.xaml.cs, update the `OnNavigatedTo` event handler so that it is an `async` method and initializes the client sync context with a SQLite store. The SQLite store is created with a table that matches the schema of the mobile service table but it must contain the **Version** system property added in the previous step.

        protected async override void OnNavigatedTo(NavigationEventArgs e)
        {
            if (!App.MobileService.SyncContext.IsInitialized)
            {
                var store = new MobileServiceSQLiteStore("localsync12.db");
                store.DefineTable<TodoItem>();
                await App.MobileService.SyncContext.InitializeAsync(store, new MobileServiceSyncHandler());
            }
            RefreshTodoItems();
        }

9. In Solution Explorer for Visual Studio, open the MainPage.xaml file. Find the button definition for the **Refresh** button. Replace it with the following stack panel defintion. 

    This code adds two button controls with click event handlers for **Push** and **Pull** operations. The buttons are horizontally where the refresh button is. Save the file.

        <StackPanel  Orientation="Horizontal" Grid.Row="3" Grid.ColumnSpan="2" HorizontalAlignment="Center">
          <Button Name="ButtonRefresh" Click="ButtonRefresh_Click" Width="160">Refresh</Button>
          <Button Name="ButtonPush" Click="ButtonPush_Click" Width="160">Push</Button>
          <Button Name="ButtonPull" Click="ButtonPull_Click" Width="160">Pull</Button>
        </StackPanel>

    Also, change the text for the textblocks to match the following screenshot.

    ![][12]
        


10. In MainPage.xaml.cs, add the button click event handlers for the **Push** and **Pull** buttons and save the file.

        private async void ButtonPull_Click(object sender, RoutedEventArgs e)
        {
            Exception pullException = null;
            try
            {
                await todoTable.PullAsync("todoItems", todoTable.CreateQuery()); // first param is query ID, used for incremental sync
                RefreshTodoItems();
            }
            catch (Exception ex)
            {
                pullException = ex;
            }
            if (pullException != null) {
                MessageBox.Show("Pull failed: " + pullException.Message +
                  "\n\nIf you are in an offline scenario, " + 
                  "try your Pull again when connected with your Mobile Serice.");
            }
        }
        private async void ButtonPush_Click(object sender, RoutedEventArgs e)
        {
            string errorString = null;
            try
            {
                await App.MobileService.SyncContext.PushAsync();
                RefreshTodoItems();
            }
            catch (MobileServicePushFailedException ex)
            {
                errorString = "Push failed because of sync errors: " + 
                  ex.PushResult.Errors.Count() + ", message: " + ex.Message;
            }
            catch (Exception ex)
            {
                errorString = "Push failed: " + ex.Message;
            }
            if (errorString != null) {
                MessageBox.Show(errorString + 
                  "\n\nIf you are in an offline scenario, " + 
                  "try your Push again when connected with your Mobile Serice.");
            }
        }

11. Don't run the app yet. Press the **F7** key to rebuild the project. Verify no build errors occurred.

## <a name="test-offline-app"></a>Test the app in an offline scenario

In this section, you break the app connection with the mobile service to simulate an offline scenario. Then you will add some data items which will be held in the local store.

Notice that in this section the app should not be connected to any mobile service. So the **Push** and **Pull** buttons will throw exceptions if you test them. In the next section, you will connect this client app to the mobile service again to test the **Push** and **Pull** operations to sync the store with the mobile service database.


1. In Solution Explorer for Visual Studio, open App.xaml.cs. Change the initialization of the **MobileServiceClient** to a invalid address by replacing "**azure-mobile.net**" with "**azure-mobile.xxx**" for your URL. Then save the file.

         public static MobileServiceClient MobileService = new MobileServiceClient(
            "https://your-mobile-service.azure-mobile.xxx/",
            "AppKey"
        );

2. In Visual Studio, press **F5** to build and run the app. Enter a new todo item and click **Save**. The new todo items exist only in the local store until they can be pushed to the mobile service. The client app behaves as if its connected to the mobile service supporting all create, read, update, delete (CRUD) operations.

    ![][4]

3. Close the app and restart it to verify that the new items you created are persisted to the local store.

## <a name="update-online-app"></a>Update the app to reconnect your mobile service

In this section you reconnect the app to the mobile service. This simulates the app moving from an offline state to an online state with the mobile service.


1. In Solution Explorer for Visual Studio, open App.xaml.cs. Change the initialization of the **MobileServiceClient** back to the correct address by replacing "**azure-mobile.xxx**" with "**azure-mobile.net**" for your URL. Then save the file.

         public static MobileServiceClient MobileService = new MobileServiceClient(
            "https://your-mobile-service.azure-mobile.net/",
            "Your AppKey"
        );


## <a name="test-online-app"></a>Test the app connected to the mobile service


In this section you will test push and pull operations to sync the local store with the mobile service database.

1. In Visual Studio, press the **F5** key to rebuild and run the app. Notice that the data looks the same as the offline scenario even though the app is now connected to the mobile service. This is because this app always works with the `IMobileServiceSyncTable` that is pointed to the local store.

    ![][4]

2.  Log into the Microsoft Azure Management portal and look at the database for your mobile service. If your service uses the JavaScript backend for mobile services, you can browse the data from the **Data** tab of the mobile service. 

    If you are using the .NET backend for your mobile service, in Visual Studio go to **Server Explorer** -> **Azure** -> **SQL Databases**. Right click your database and select **Open in SQL Server Object Explorer**.

    Notice the data has not been synchronized between the database and the local store.

    ![][6]

3. In the app, press the **Push** button. This causes the app to call `MobileServiceClient.SyncContext.PushAsync` and then `RefreshTodoItems` to refresh the app with the items from the local store. This push operation results in the mobile service database receiving the data from the store. However, the local store does not receive the items from the mobile service database.

    A push operation is executed off the `MobileServiceClient.SyncContext` instead of the `IMobileServicesSyncTable` and pushes changes on all tables associated with that sync context. This is to cover scenarios where there are relationships between tables.

    ![][7]

4. In the app a few new items to the local store.

    ![][8]

5. This time press the **Pull** button in the app. The app only calls `IMobileServiceSyncTable.PullAsync()` and `RefreshTodoItems`.  Notice that all the data from the mobile service database was pulled into the local store and shown in the app. However, also notice that all the data in the local store was still pushed to the mobile service database. This is because a **pull always does a push first**.
 
    In this example, we retrieve all records in the remote `todoTable`, but it is also possible to filter records by passing a query. The first parameter to `PullAsync` is a query ID that is used for incremental sync, which uses the `UpdatedAt` timestamp to get only records modified since the last sync. The query ID should be a descriptive string that is unique for each logical query in your app. To opt-out of incremental sync, pass `null` as the query ID. This will retrieve all records on each pull operation, which is potentially inefficient.

    >[AZURE.NOTE] To support synchronization of deleted records with offline data sync, you should enable [Soft Delete]. Otherwise, you have to call `IMobileServiceSyncTable.PurgeAsync()` to purge the local store.

 
    ![][9]

    ![][10] 
  

##Summary

##Summary

[AZURE.INCLUDE [mobile-services-offline-summary-csharp](../includes/mobile-services-offline-summary-csharp.md)]

## Next steps

* [Handling conflicts with offline support for Mobile Services]

* [Using Soft Delete in Mobile Services][Soft Delete]

<!-- Anchors. -->
[Update the app to support offline features]: #enable-offline-app
[Test the app in an offline Scenario]: #test-offline-app
[Update the app to reconnect your mobile service]: #update-online-app
[Test the app connected to the Mobile Service]: #test-online-app
[Next Steps]:#next-steps

<!-- Images -->
[0]: ./media/mobile-services-windows-phone-get-started-data-vs2013/mobile-todoitem-data-browse.png
[1]: ./media/mobile-services-windows-phone-get-started-offline-data/mobile-services-add-reference-sqlite-dialog.png
[2]: ./media/mobile-services-windows-phone-get-started-offline-data/mobile-services-sqlitestore-nuget.png
[3]: ./media/mobile-services-windows-phone-get-started-offline-data/mobile-services-sqlitepcl-nuget.png
[4]: ./media/mobile-services-windows-phone-get-started-offline-data/mobile-services-offline-app-run1.png
[5]: ./media/mobile-services-windows-phone-get-started-offline-data/mobile-services-online-app-run1.png
[6]: ./media/mobile-services-windows-phone-get-started-offline-data/mobile-data-browse.png
[7]: ./media/mobile-services-windows-phone-get-started-offline-data/mobile-data-browse2.png
[8]: ./media/mobile-services-windows-phone-get-started-offline-data/mobile-services-online-app-run2.png
[9]: ./media/mobile-services-windows-phone-get-started-offline-data/mobile-services-online-app-run3.png
[10]: ./media/mobile-services-windows-phone-get-started-offline-data/mobile-data-browse3.png
[11]: ./media/mobile-services-windows-phone-get-started-offline-data/vs-select-processor-architecture.png
[12]: ./media/mobile-services-windows-phone-get-started-offline-data/ui-screenshot.png

<!-- URLs. -->
[Handling conflicts with offline support for Mobile Services]: mobile-services-windows-phone-handling-conflicts-offline-data.md 
[Getting Started Offline Sample for Windows Phone]: http://go.microsoft.com/fwlink/?LinkId=397952
[Get started with Mobile Services]: mobile-services-windows-phone-get-started.md
[Get started with data]: mobile-services-windows-phone-get-started-data.md
[SQLite for Windows Phone 8]: http://go.microsoft.com/fwlink/?LinkId=397953
[Windows Phone 8 SDK]: http://go.microsoft.com/fwlink/p/?linkid=268374
[Soft Delete]: mobile-services-using-soft-delete.md

[Mobile Services SDK Nuget]: http://www.nuget.org/packages/WindowsAzure.MobileServices/1.3.0
[SQLite store nuget]: http://www.nuget.org/packages/WindowsAzure.MobileServices.SQLiteStore/1.0.0
