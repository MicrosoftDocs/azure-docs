<properties linkid="develop-mobile-tutorials-get-started-offline-data-dotnet" urlDisplayName="Getting Started with Offline Data" pageTitle="Get started with offline data in Mobile Services (Windows Store) | Mobile Dev Center" metaKeywords="" description="Learn how to use offline data in your Windows Store application." metaCanonical="" disqusComments="1" umbracoNaviHide="1" documentationCenter="Mobile" title="Get started with offline data in Mobile Services" authors="wesmc" />

# Get started with Offline Data in Mobile Services

<div class="dev-center-tutorial-selector sublanding">
<a href="/en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-offline-data" title="Windows Store C#" class="current">Windows Store C#</a>
<a href="/en-us/documentation/articles/mobile-services-windows-phone-get-started-offline-data" title="Windows Phone">Windows Phone</a>
</div>

This topic shows you how to use use the offline capabilities of Azure Mobile Services. Azure Mobile Services offline features allow you to interact with a local database when you are in an offline scenario with your Mobile Service. The offline features allow you to sync your local changes with the mobile service when you are online again. 

In this tutorial, you will update the app from the [Get started with Mobile Services] or [Get Started with Data] tutorial to support the offline features of Azure Mobile Services. Then you will add data in a disconnected offline scenario, sync those items to the online database, and then log in to the Azure Management Portal to view changes to data made when running the app.


>[WACOM.NOTE] This tutorial is intended to help you better understand how Mobile Services enables you to use Azure to store and retrieve data in a Windows Store app. As such, this topic walks you through many of the steps that are completed for you in the Mobile Services quickstart. If this is your first experience with Mobile Services, consider first completing the tutorial [Get started with Mobile Services].

This tutorial walks you through these basic steps:

1. [Update the app to support offline features]
2. [Test the app in an offline Scenario] 
3. [Update the app to reconnect your mobile service]
4. [Test the app connected to the Mobile Service]

This tutorial requires the following:

* Visual Studio 2013 running on Windows 8.1.
* Completion of the [Get started with Mobile Services] or [Get Started with Data] tutorial.
* Windows Azure Mobile Services SDK NuGet package version 1.3.0-alpha2
* Windows Azure Mobile Services SQLite Store NuGet package 1.0.0-alpha 
* SQLite for Windows 8.1

>[WACOM.NOTE] To complete this tutorial, you need a Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=AE564AB28" target="_blank">Azure Free Trial</a>. 

## <a name="enable-offline-app"></a>Update the app to support offline features

Azure Mobile Services offline features allow you to interact with a local database when you are in an offline scenario with your Mobile Service. To use these features in your app, you initialize `MobileServiceClient.SyncContext` to a local store. Then reference your table through the `IMobileServiceSyncTable` interface.

This section uses SQLite as the local store for the offline features.

>[WACOM.NOTE] You can skip this section and just download a version of the Getting Started project that already has offline support.  To download a project with offline support enabled, see [Getting Started Offline Sample].


1. Install SQLite. You can install it from this link, [SQLite for Windows 8.1].

    >[WACOM.NOTE] If you are using Internet Explorer, clicking the link to install SQLite may prompt you to download the .vsix as a .zip file. Save the file to a location on your hard drive with the .vsix extension instead of .zip. The double click the .vsix file in Windows Explorer to run the installation.

2. In Visual Studio open the project that you completed in the [Get started with Mobile Services] or [Get Started with Data] tutorial. In Solution Explorer, right click **References** under the project and add a reference to **SQLite for Windows Runtime** under **Windows** > **Extensions**. 

    ![][1]

3. The SQLite Runtime requires you to change the processor architecture of the project being built to **x86**, **x64**, or **ARM**. **Any CPU** is not supported. Change the processor architecture to one of the supported settings that you want to test.

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

9. In Solution Explorer for Visual Studio, open the MainPage.xaml file. Find the Grid element that contains the StackPanel titled **Query and Update Data**. Add the following UI code that replaces the elements from the row definitions down to the start tag of the ListView. 

    This code adds row and column definitions to the grid to layout the elements. It also adds two button controls with click event handlers for **Push** and **Pull** operations. The buttons are positioned just above the `ListView` named ListItems. Save the file.

        <Grid.RowDefinitions>
            <RowDefinition Height="Auto" />
            <RowDefinition Height="Auto" />
            <RowDefinition Height="*" />
        </Grid.RowDefinitions>
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="Auto" />
            <ColumnDefinition Width="*" />
        </Grid.ColumnDefinitions>
        <StackPanel Grid.Row="0" Grid.ColumnSpan="2">
            <local:QuickStartTask Number="2" Title="Query, Update, and Synchronize Data" 
              Description="Use the Pull and Push buttons to synchronize the local store with the server" />
        </StackPanel>
        <Button Grid.Row="1" Grid.Column="0" Margin="5,5,0,0" Name="ButtonPush"
            Click="ButtonPush_Click" Width="80" Height="34">⬆ Push</Button>
        <Button Grid.Row="1" Grid.Column="1" Margin="5,5,0,0"  Name="ButtonPull" 
            Click="ButtonPull_Click" Width="80" Height="34">⬇ Pull</Button>
        <ListView Name="ListItems" SelectionMode="None" Margin="0,10,0,0" Grid.ColumnSpan="2" Grid.Row="2">
        


10. In MainPage.xaml.cs, add the button click event handlers for the **Push** and **Pull** buttons and save the file.

        private async void ButtonPull_Click(object sender, RoutedEventArgs e)
        {
            Exception pullException = null;
            try
            {
                await todoTable.PullAsync();
                RefreshTodoItems();
            }
            catch (Exception ex)
            {
                pullException = ex;
            }
            if (pullException != null) {
                MessageDialog d = new MessageDialog("Pull failed: " + pullException.Message +
                  "\n\nIf you are in an offline scenario, " + 
                  "try your Pull again when connected with your Mobile Serice.");
                await d.ShowAsync();
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
                MessageDialog d = new MessageDialog(errorString + 
                  "\n\nIf you are in an offline scenario, " + 
                  "try your Push again when connected with your Mobile Serice.");
                await d.ShowAsync();
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

    ![][5]

2. Log into the Microsoft Azure Management portal and look at the database for your mobile service. If your service uses the JavaScript backend for mobile services, you can browse the data from the **Data** tab of the mobile service. If you are using the .NET backend for your mobile service, you can click on the **Manage** button for your database in the SQL Azure Extension to execute a query against your table.

    Notice the data has not been synchronized between the database and the local store.

    ![][6]

3. In the app, press the **Push** button. This causes the app to call `MobileServiceClient.SyncContext.PushAsync` and then `RefreshTodoItems` to refresh the app with the items from the local store. This push operation results in the mobile service database receiving the data from the store. However, the local store does not receive the items from the mobile service database.

    A push operation is executed off the `MobileServiceClient.SyncContext` instead of the `IMobileServicesSyncTable` and pushes changes on all tables associated with that sync context. This is to cover scenarios where there are relationships between tables.

    ![][7]

4. In the app a few new items to the local store.

    ![][8]

5. This time press the **Pull** button in the app. The app only calls `IMobileServiceSyncTable.PullAsync()` and `RefreshTodoItems`.  Notice that all the data from the mobile service database was pulled into the local store and shown in the app. However, also notice that all the data in the local store was still pushed to the mobile service database. This is because a **pull always does a push first**.    
 
    ![][9]

    ![][10] 
  

##Summary

In order to support the offline features of mobile services, we used the `IMobileServiceSyncTable` interface and initialized `MobileServiceClient.SyncContext` with a local store. In this case the local store was a SQLite database.

The normal CRUD operations for mobile services work as if the app is still connected but, all the operations occur against the local store.

When we wanted to synchronize the local store with the server, we used the `IMobileServiceSyncTable.PullAsync` and `MobileServiceClient.SyncContext.PushAsync` methods.

*  To push changes to the server, we called `IMobileServiceSyncContext.PushAsync()`. This method is a member of `IMobileServicesSyncContext` instead of the sync table because it will push changes across all tables:

    Only records that have been modified in some way locally (through CRUD operations) will be sent to the server.
   
* To pull data from a table on the server to the app, we called `IMobileServiceSyncTable.PullAsync`.

    A pull always issues a push first.  

    There are also overloads of **PullAsync()** that allow a query to be specified. Note that in the preview release of offline support for Mobile Services, **PullAsync** will read all rows in the corresponding table (or query)--it does not attempt to read only rows newer than the last sync, for instance. If the rows already exist in the local sync table, they will remain unchanged.


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


<!-- URLs. -->
[Handling conflicts with offline support for Mobile Services]: /en-us/documentation/articles/mobile-services-windows-store-dotnet-handling-conflicts-offline-data/ 
[Getting Started Offline Sample]: http://go.microsoft.com/fwlink/?LinkId=394777
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service
[Getting Started]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started/
[Get started with data]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started-data/
[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-windows-store-get-started/
[SQLite for Windows 8.1]: http://go.microsoft.com/fwlink/?LinkId=394776


