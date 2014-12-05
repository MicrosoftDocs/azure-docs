<properties urlDisplayName="Using Offline Data" pageTitle="Using offline data in Mobile Services (Windows Store) | Mobile Dev Center" metaKeywords="" description="Learn how to use Azure Mobile Services to cache and sync offline data in your Windows Store application" metaCanonical="" disqusComments="1" umbracoNaviHide="1" documentationCenter="Mobile" title="Using offline data sync in Mobile Services" authors="wesmc" manager="dwrede" />

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-windows-store" ms.devlang="dotnet" ms.topic="article" ms.date="09/25/2014" ms.author="wesmc" />

# Using offline data sync in Mobile Services

[WACOM.INCLUDE [mobile-services-selector-offline](../includes/mobile-services-selector-offline.md)]


<div class="dev-onpage-video-clear clearfix">
<div class="dev-onpage-left-content">
<p>This tutorial shows you how to add offline support to a Windows Universal Store app using Azure Mobile Services. Offline support will allow you to interact with a local database when your app is in an offline scenario. Once your app is online with the backend database, you sync your local changes using the offline features. 
</p>
<p>If you prefer to watch a video, the clip to the right follows the same steps as this tutorial.</p>
</div>
<div class="dev-onpage-video-wrapper"><a href="http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/Build-offline-apps-Azure-Mobile-Services" target="_blank" class="label">watch the tutorial</a> <a style="background-image: url('http://video.ch9.ms/ch9/ea1c/ffed2371-4db1-4a8e-8869-80013859ea1c/BuildOfflineAppsAzureMobileServices_220.jpg') !important;" href="http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/Build-offline-apps-Azure-Mobile-Services" target="_blank" class="dev-onpage-video"><span class="icon">Play Video</span></a> <span class="time">14:36</span></div>
</div>


In this tutorial, you will update the Universal app project from the [Get started with Mobile Services] tutorial to support the offline features of Azure Mobile Services. Then you will add data in a disconnected offline scenario, sync those items to the online database, and then log in to the Azure Management Portal to view changes to data made when running the app.


>[WACOM.NOTE] This tutorial is intended to help you better understand how Mobile Services enables you to use Azure to store and retrieve data in a Windows Store app. If this is your first experience with Mobile Services, you should complete the tutorial [Get started with Mobile Services] first.
>
>To complete this tutorial, you need a Azure account. If you don't have an account, you can sign up for an Azure trial and get up to 10 free mobile services that you can keep using even after your trial ends. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=AE564AB28" target="_blank">Azure Free Trial</a>. 
>
>The older Windows Phone 8 tutorial for Visual Studio 2012 is still available here, [Windows Phone 8 Tutorial for Visual Studio 2012].


This tutorial walks you through these basic steps:

1. [Update the app to support offline features]
2. [Test the app in an offline Scenario] 
3. [Update the app to reconnect your mobile service]
4. [Test the app connected to the Mobile Service]

This tutorial requires the following:

* Visual Studio 2013 running on Windows 8.1.
* Completion of the [Get started with Mobile Services].
* [Azure Mobile Services SDK version 1.3.0 (or later)][Mobile Services SDK Nuget]
* [Azure Mobile Services SQLite Store version 1.0.0 (or later)][SQLite store Nuget]
* SQLite for Windows 8.1

>[AZURE.NOTE] To complete this tutorial, you need a Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=AE564AB28" target="_blank">Azure Free Trial</a>. 

## <a name="enable-offline-app"></a>Update the app to support offline features

Azure Mobile Services offline features allow you to interact with a local database when you are in an offline scenario with your Mobile Service. To use these features in your app, you initialize a `MobileServiceClient.SyncContext` to a local store. Then reference your table through the `IMobileServiceSyncTable` interface. In this tutorial we use SQLite for the local store.

>[AZURE.NOTE] You can skip this section and just get the example project that already has offline support from the Github samples repository for Mobile Services. The sample project with offline support enabled is located here, [TodoList Offline Sample].


1. Install the SQLite runtime for Windows 8.1 and Windows Phone 8.1. 

    * **Windows 8.1 Runtime:** Install the SQLite runtime for Windows 8.1 from this link, [SQLite for Windows 8.1].
    * **Windows Phone 8.1:** Install the SQLite runtime for Windows Phone 8.1 from this link, [SQLite for Windows Phone 8.1].

    >[AZURE.NOTE] If you are using Internet Explorer, clicking the link to install SQLite may prompt you to download the .vsix as a .zip file. Save the file to a location on your hard drive with the .vsix extension instead of .zip. The double click the .vsix file in Windows Explorer to run the installation.

2. In Visual Studio open the project that you completed in the [Get started with Mobile Services] tutorial. In Solution Explorer, right click **References** for the Windows 8.1 Runtime and Windows Phone 8.1 platform projects and add a reference to SQLite, which is located in the **Extensions** section. 

    ![][1]
    </br>**Windows 8.1 Runtime**

    ![][11]
    </br>**Windows Phone 8.1**

3. The SQLite Runtime requires you to change the processor architecture of the project being built to **x86**, **x64**, or **ARM**. **Any CPU** is not supported. In Solution Explorer for Visual Studio, click the Solution at the top, then change the processor architecture drop down box to one of the supported settings that you want to test.

    ![][13]

4. Install the **WindowsAzure.MobileServices.SQLiteStore** NuGet package for the Windows 8.1 runtime and Windows Phone 8.1 projects.

    * **Windows 8.1:** In Solution Explorer, right click the Windows 8.1 project and click **Manage Nuget Packages** to run NuGet Package Manager. Search for **SQLiteStore** to install the WindowsAzure.MobileServices.SQLiteStore package.
    * **Windows Phone 8.1:** Right click the Windows Phone 8.1 project and click **Manage Nuget Packages** to run NuGet Package Manager. Search for **SQLiteStore** to install the WindowsAzure.MobileServices.SQLiteStore package.     

    >[WACOM.NOTE] If the installation creates a reference to an older version of SQLite, you can just delete that duplicate reference. 

    ![][2]

5. In Solution Explorer for Visual Studio, in the shared project, open the MainPage.cs file. Add the following using statements to the top of the file.

        using Microsoft.WindowsAzure.MobileServices.SQLiteStore;
        using Microsoft.WindowsAzure.MobileServices.Sync;

6. In the shared file, Mainpage.cs, replace the declaration of `todoTable` with a declaration of type `IMobileServicesSyncTable` that is initialized by calling `MobileServicesClient.GetSyncTable()`.

        //private IMobileServiceTable<TodoItem> todoTable = App.MobileService.GetTable<TodoItem>();
        private IMobileServiceSyncTable<TodoItem> todoTable = App.MobileService.GetSyncTable<TodoItem>();


7. In the shared file, MainPage.cs, update the `OnNavigatedTo` event handler so that it initializes the client sync context with a SQLite store. The SQLite store is created with a table that matches the schema of the mobile service table and it must include the **Version** system property which you will add in the next step.

        protected async override void OnNavigatedTo(NavigationEventArgs e)
        {
            if (!App.MobileService.SyncContext.IsInitialized)
            {
                var store = new MobileServiceSQLiteStore("localsync.db");
                store.DefineTable<TodoItem>();
                await App.MobileService.SyncContext.InitializeAsync(store);
            }
            await RefreshTodoItems();
        }


8. In Solution Explorer for Visual Studio, in the shared project, expand **DataModel** and open TodoItem.cs. Add a `using` statement for the MobileServices namespace. This is needed to resolve the version attribute for the version system property.

        using Microsoft.WindowsAzure.MobileServices;

      Then update the `TodoItem` class so that the class includes the **Version** system property as follows. The table schema must include the **Version** system property as shown here to support the offline features.

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




9. Next update the user interface for the Windows 8.1 and Windows Phone 8.1 projects to include buttons that will support the offline synchronization operations between the local offline database and the Mobile Service database in Azure. 

    * **Windows 8.1:** In Solution Explorer for Visual Studio, under the Windows 8.1 project open MainPage.xaml. Find the button named **ButtonRefresh**. Replace that button element with the following stack panel of buttons. 

            <StackPanel Orientation="Horizontal">
                <Button Margin="72,0,0,0" Height="44" Name="ButtonRefresh" Click="ButtonRefresh_Click">
                	Refresh
                </Button>
                <Button Margin="10,0,0,0" Name="ButtonPull" Click="ButtonPull_Click">
                    <StackPanel Orientation="Horizontal">
                        <TextBlock Margin="5">Pull</TextBlock>
                        <SymbolIcon Symbol="Download"/>
                    </StackPanel>
                </Button>
                <Button Margin="10,0,0,0" Name="ButtonPush" Click="ButtonPush_Click">
                    <StackPanel Orientation="Horizontal">
                        <TextBlock Margin="5">Push</TextBlock>
                        <SymbolIcon Symbol="Upload"/>
                    </StackPanel>
                </Button>
            </StackPanel>

    * **Windows Phone 8.1:** In Solution Explorer for Visual Studio, under the Windows Phone 8.1 project open MainPage.xaml. Find the button named **ButtonRefresh**. Replace that button element with the following stack panel of buttons. 

            <StackPanel Orientation="Horizontal" Grid.Row="3" Grid.ColumnSpan="2">
                <Button Name="ButtonRefresh" Click="ButtonRefresh_Click" Margin="10,0,0,0">
                    Refresh
                </Button>
                <Button Name="ButtonPull" Click="ButtonPull_Click" Margin="10,0,0,0">
                    <StackPanel Orientation="Horizontal">
                        <TextBlock Margin="5">Pull</TextBlock>
                        <SymbolIcon Symbol="Download"/>
                    </StackPanel>
                </Button>
                <Button Name="ButtonPush" Click="ButtonPush_Click" Margin="10,0,0,0">
                    <StackPanel Orientation="Horizontal">
                        <TextBlock Margin="5">Push</TextBlock>
                        <SymbolIcon Symbol="Upload"/>
                    </StackPanel>
                </Button>
        </StackPanel>
        


10. In the shared MainPage.cs file, add click event handlers for the **Push** and **Pull** buttons. Then save the file. 
        
    Notice the `MobileServicePushFailedException` can occur for both a push and a pull operation. It can occur for a pull because the pull operation internally executes a push to make sure all tables along with any relationships are in sync. The next tutorial, [Handling conflicts with offline support for Mobile Services], shows how to handle these sync related exceptions.

    To support synchronization of deleted records with offline data sync, you should enable [Soft Delete](/en-us/documentation/articles/mobile-services-using-soft-delete/). Otherwise, you have to manually remove records in the local store, or call `IMobileServiceSyncTable::PurgeAsync()` to purge the local store.

    In this example, we pass a query to the `PullAsync` method call to support incremental syncing. This is useful in cases where you really don't want the expense of pulling the entire table during syncing. In this scenario we aren't concerned about text changes to the todoitems, we just want to pull completed items to mark them off our todolist.

        private async void ButtonPull_Click(object sender, Windows.UI.Xaml.RoutedEventArgs e)
        {
            string errorString = null;

            // Prevent extra clicking while Pull is in progress
            // and visibly show the action is in progress. 
            ButtonPull.Focus(FocusState.Programmatic);
            ButtonPull.IsEnabled = false;

            try
            {
                // All items should be synced since other clients might mark an item as complete
                // The first parameter is a query ID that uniquely identifies the query.
                // This is used in incremental sync to get only newer items the next time PullAsync is called
                await todoTable.PullAsync("allTodoItems", todoTable.CreateQuery());

                await RefreshTodoItems();
            }
            catch (MobileServicePushFailedException ex)
            {
                errorString = "Internal Push operation during pull request failed because of sync errors: " +
                  ex.PushResult.Errors.Count + " errors, message: " + ex.Message;
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

            ButtonPull.IsEnabled = true; 
        }


        private async void ButtonPush_Click(object sender, Windows.UI.Xaml.RoutedEventArgs e)
        {
            string errorString = null;

            // Prevent extra clicking while Push is in progress
            // and visibly show the action is in progress. 
            ButtonPush.Focus(FocusState.Programmatic);
            ButtonPush.IsEnabled = false;

            try
            {
                await App.MobileService.SyncContext.PushAsync();
            }
            catch (MobileServicePushFailedException ex)
            {
                errorString = "Push failed because of sync errors: " + 
                  ex.PushResult.Errors.Count + " errors, message: " + ex.Message;
            }
            catch (Exception ex)
            {
                errorString = "Push failed: " + ex.Message +
                  "\n\nIf you are still in an offline scenario, " +
                  "you can try your Push again when connected with your Mobile Serice.";
            }

            if (errorString != null)
            {
                MessageDialog d = new MessageDialog(errorString);
                await d.ShowAsync();
            }

            ButtonPush.IsEnabled = true;
        }

11. Build the solution and verify no build errors occurred in any of the projects.


## <a name="test-offline-app"></a>Test the app in an offline scenario

In this section, you break the app connection with the mobile service to simulate an offline scenario. Then you will add some data items which will be held in the local store.

Notice that in this section the app should not be connected to any mobile service. So the **Push** and **Pull** buttons will throw exceptions if you test them. In the next section, you will connect this client app to the mobile service again to test the **Push** and **Pull** operations to sync the store with the mobile service database.


1. In Solution Explorer for Visual Studio, open App.xaml.cs in the shared project. Change the initialization of the **MobileServiceClient** to a invalid address by replacing "**azure-mobile.net**" with "**azure-mobile.xxx**" for your URL. Then save the file.

         public static MobileServiceClient MobileService = new MobileServiceClient(
            "https://your-mobile-service.azure-mobile.xxx/",
            "AppKey"
        );

2. In Visual Studio, press **F5** to build and run the app. Enter some new todo items and click **Save** for each one. The new todo items exist only in the local store until they can be pushed to the mobile service. The client app behaves as if its connected to the mobile service supporting all create, read, update, delete (CRUD) operations.

    ![][4]

3. Close the app and restart it to verify that the new items you created are persisted to the local store.

## <a name="update-online-app"></a>Update the app to reconnect your mobile service

In this section you reconnect the app to the mobile service. This simulates the app moving from an offline state to an online state with the mobile service.


1. In Solution Explorer for Visual Studio, open App.xaml.cs in the shared project. Change the initialization of the **MobileServiceClient** back to the correct address by replacing "**azure-mobile.xxx**" with "**azure-mobile.net**" for your URL. Then save the file.

         public static MobileServiceClient MobileService = new MobileServiceClient(
            "https://your-mobile-service.azure-mobile.net/",
            "Your AppKey"
        );


## <a name="test-online-app"></a>Test the app connected to the mobile service


In this section you will test push and pull operations to sync the local store with the mobile service database. You can test the Windows Store 8.1 client or the Windows Phone 8.1 client. The screen shots below show the Windows Store 8.1 client. 

1. In Visual Studio, press the **F5** key to rebuild and run the app. Notice that the data looks the same as the offline scenario even though the app is now connected to the mobile service. This is because this app always works with the `IMobileServiceSyncTable` that is pointed to the local store.

    ![][4]

2. Log into the Microsoft Azure Management portal and look at the database for your mobile service. If your service uses the JavaScript backend for mobile services, you can browse the data from the **Data** tab of the mobile service. If you are using the .NET backend for your mobile service, you can click on the **Manage** button for your database in the SQL Azure Extension to execute a query against your table.

    Notice the data has not been synchronized between the database and the local store.

    ![][6]

3. In the app, press the **Push** button. This causes the app to call `MobileServiceClient.SyncContext.PushAsync`. This push operation results in the mobile service database receiving the data from the store. However, the local store does not receive the items from the mobile service database.

    A push operation is executed off the `MobileServiceClient.SyncContext` instead of the `IMobileServicesSyncTable` and pushes changes on all tables associated with that sync context. This is to cover scenarios where there are relationships between tables.

    ![][7]

4. In the app, click the check box beside a few items to complete them in the local store. 

    ![][8]

5. This time press the **Pull** button in the app. The app calls `IMobileServiceSyncTable.PullAsync()` and `RefreshTodoItems`.  Notice that all the data from the mobile service database was pulled into the local store and shown in the app. However, also notice that all the data in the local store was still pushed to the mobile service database. This is because a **pull always does a push first**. This is to ensure all tables in the local store along with relationships stay in sync.
 
    ![][9]

    ![][10] 
  

##Summary

In order to support the offline features of mobile services, we used the `IMobileServiceSyncTable` interface and initialized `MobileServiceClient.SyncContext` with a local store. In this case the local store was a SQLite database.

The normal CRUD operations for mobile services work as if the app is still connected but, all the operations occur against the local store.

When we wanted to synchronize the local store with the server, we used the `IMobileServiceSyncTable.PullAsync` and `MobileServiceClient.SyncContext.PushAsync` methods.

*  To push changes to the server, we called `IMobileServiceSyncContext.PushAsync()`. This method is a member of `IMobileServicesSyncContext` instead of the sync table because it will push changes across all tables:

    Only records that have been modified in some way locally (through CRUD operations) will be sent to the server.
   
* To pull data from a table on the server to the app, we called `IMobileServiceSyncTable.PullAsync`.

    A pull always issues a push first. This is to ensure all tables in the local store along with relationships stay in sync.

    There are also overloads of `PullAsync()` that allow a query to be specified to support incremental sync. If a query is not passed, `PullAsync()` will pull all rows in the corresponding table (or query). You can pass the query to filter only the chnages your app needs to sync with.


## Next steps

* [Handling conflicts with offline support for Mobile Services]

<!-- Anchors. -->
[Update the app to support offline features]: #enable-offline-app
[Test the app in an offline Scenario]: #test-offline-app
[Update the app to reconnect your mobile service]: #update-online-app
[Test the app connected to the Mobile Service]: #test-online-app
[Next Steps]:#next-steps

<!-- Images -->
[0]: ./media/mobile-services-windows-store-dotnet-get-started-data-vs2013/mobile-todoitem-data-browse.png
[1]: ./media/mobile-services-windows-store-dotnet-get-started-offline-data/mobile-services-add-reference-sqlite-dialog.png
[2]: ./media/mobile-services-windows-store-dotnet-get-started-offline-data/mobile-services-sqlitestore-nuget.png
[3]: ./media/mobile-services-windows-store-dotnet-get-started-offline-data/mobile-services-sqlitepcl-nuget.png
[4]: ./media/mobile-services-windows-store-dotnet-get-started-offline-data/mobile-services-offline-app-run1.png
[5]: ./media/mobile-services-windows-store-dotnet-get-started-offline-data/mobile-services-online-app-run1.png
[6]: ./media/mobile-services-windows-store-dotnet-get-started-offline-data/mobile-data-browse.png
[7]: ./media/mobile-services-windows-store-dotnet-get-started-offline-data/mobile-data-browse2.png
[8]: ./media/mobile-services-windows-store-dotnet-get-started-offline-data/mobile-services-online-app-run2.png
[9]: ./media/mobile-services-windows-store-dotnet-get-started-offline-data/mobile-services-online-app-run3.png
[10]: ./media/mobile-services-windows-store-dotnet-get-started-offline-data/mobile-data-browse3.png
[11]: ./media/mobile-services-windows-store-dotnet-get-started-offline-data/mobile-services-add-wp81-reference-sqlite-dialog.png
[12]: ./media/mobile-services-windows-store-dotnet-get-started-offline-data/new-synchandler-class.png
[13]: ./media/mobile-services-windows-store-dotnet-get-started-offline-data/cpu-architecture.png


<!-- URLs. -->
[Handling conflicts with offline support for Mobile Services]: /en-us/documentation/articles/mobile-services-windows-store-dotnet-handling-conflicts-offline-data/ 
[TodoList Offline Sample]: http://go.microsoft.com/fwlink/?LinkId=394777
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service
[Getting Started]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started/
[Get started with data]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started-data/
[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-windows-store-get-started/
[SQLite for Windows 8.1]: http://go.microsoft.com/fwlink/?LinkId=394776
[SQLite for Windows Phone 8.1]: http://go.microsoft.com/fwlink/?LinkId=397953
[Windows Phone 8 Tutorial for Visual Studio 2012]: /en-us/documentation/articles/mobile-services-windows-phone-get-started-offline-data/


[Mobile Services SDK Nuget]: http://www.nuget.org/packages/WindowsAzure.MobileServices/1.3.0
[SQLite store nuget]: http://www.nuget.org/packages/WindowsAzure.MobileServices.SQLiteStore/1.0.0
