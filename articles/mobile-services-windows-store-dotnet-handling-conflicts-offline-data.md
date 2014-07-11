

<properties linkid="develop-mobile-tutorials-handle-conflcits-offline-data-dotnet" urlDisplayName="Handle Conflicts with Offline Data" pageTitle="Handle Conflicts with offline data in Mobile Services (Windows Store) | Mobile Dev Center" metaKeywords="" description="Learn how to handle conflicts with offline data in your Windows Store application." metaCanonical="" disqusComments="1" umbracoNaviHide="1" documentationCenter="Mobile" title="Handling conflicts with offline data in Mobile Services" authors="wesmc" />


# Handling conflicts with offline data in Mobile Services

<div class="dev-center-tutorial-selector sublanding">
<a href="/en-us/documentation/articles/mobile-services-windows-store-dotnet-handling-conflicts-offline-data" title="Windows Store C#" class="current">Windows Store C#</a>
<a href="/en-us/documentation/articles/mobile-services-windows-phone-handling-conflicts-offline-data" title="Windows Phone">Windows Phone</a>
</div>


<p>This topic shows you how to synchronize data and handle conflicts when using the offline capabilities of Azure Mobile Services. In this tutorial, you will download an app that supports both offline and online data, integrate the mobile service with the app, and then login to the Azure Management Portal to view and update the database when running the app.
</p>

This tutorial builds on the steps and the sample app from the previous tutorial [Get started with offline data]. Before you begin this tutorial, you must first complete [Get started with offline data].


This tutorial walks you through these basic steps:

1. [Download the Windows Store app project] 
2. [Add a due date column for the database]
  * [Updating the database for .NET backend mobile services]  
  * [Updating the database for JavaScript mobile services]  
3. [Test the app against a mobile service]
4. [Manually update the data in the backend to create a conflict]

This tutorial requires Visual Studio 2013 running on Windows 8.1.


## <a name="download-app"></a>Download the sample project

![][0]

This tutorial is built on the [Handling conflicts code sample], which is a Windows Store app project for Visual Studio 2013. The UI for this app is similar to the app in the tutorial [Get started with offline data], except that there is a new date column in for each TodoItem. 

1. Download the C# version of the [Handling conflicts code sample]. 

2. Install [SQLite for Windows 8.1] if it has not been installed.

3. In Visual Studio 2013, open the downloaded project. Press the **F5** key to rebuild the project and start the app.

4. In the app, type some text in **Insert a TodoItem**, then click **Save**. You can also modify the due date of the todo items you add.

Note that the app is not yet connected to any mobile service, so the buttons **Push** and **Pull** will throw exceptions.


## <a name="add-column"></a>Add a column to the data model

In this section you will update the database for your mobile service to include a TodoItem table with a due date column. The app allows you to change the due date for an item at runtime so that you can generate sync conflicts in a later section of this tutorial. 

The `TodoItem` class in the sample is defined in MainPage.xaml.cs. Notice the class has the following attribute which will target the sync operations against that table.

        [DataTable("TodoWithDate")]

Update your database to include this table.

### <a name="dotnet-backend"></a>Updating the database for .NET backend mobile services 

If you are using the .NET backend for your mobile service, follow these steps to update the schema for your database.

1. Open your .NET backend mobile service project in Visual Studio.
2. In Solution Explorer for Visual Studio, in your service project, expand the **Models** folder and open ToDoItem.cs. Add the `DueDate` property as follows.

          public class TodoItem : EntityData
          {
            public string Text { get; set; }
            public bool Complete { get; set; }
            public System.DateTime DueDate { get; set; }
          }


3. In Solution Explorer for Visual Studio, expand the **App_Start** folder and open the WebApiConfig.cs file. 

    In the WebApiConfig.cs file, notice that your default database initializer class is derived from the `DropCreateDatabaseIfModelChanges` class. This means any change to the model will result in the table being dropped and recreated to accommodate the new model. So the data in the table will be lost and the table will be re-seeded. Modify the Seed method of the database initializer so that the `Seed()` initialization function as follows to initialize the new DueDate column. Save the WebApiConfig.cs file.

    >[WACOM.NOTE] When using the default database initializer, Entity Framework will drop and recreate the database whenever it detects a data model change in the Code First model definition. To make this data model change and maintain existing data in the database, you must use Code First Migrations. For more information, see [How to Use Code First Migrations to Update the Data Model](/en-us/documentation/articles/mobile-services-dotnet-backend-how-to-use-code-first-migrations).


        new TodoItem { Id = "1", Text = "First item", Complete = false, DueDate = DateTime.Today },
        new TodoItem { Id = "2", Text = "Second item", Complete = false, DueDate = DateTime.Today },

          

4. In Solution Explorer for Visual Studio, expand the **Controllers** folder and open ToDoItemController.cs. Rename the `TodoItemController` class to `TodoWithDateController`. This will change the REST endpoint for table operations. 

        public class TodoWithDateController : TableController<TodoItem>
    

5. In Solution Explorer for Visual Studio, right click your .NET backend mobile service project and click **Publish** to publish your changes.


### <a name="javascript-backend"></a>Updating the database for JavaScript backend mobile services

For JavaScript backend mobile services, you will add a new table named **TodoWithDate**. To add the **TodoWithDate** table for JavaScript backend mobile services, follow these steps.

  1. Log into the [Azure Management Portal]. 

  2. Navigate to the **Data** tab of your mobile service. 

  3. Click **Create** at the bottom of the page and create a new table named **TodoWithDate**. 


## <a name="test-app"></a>Test the app against your  mobile service

Now it's time to test the app against Mobile Services.

1. In the Azure Management Portal, find your mobile service's application key by clicking **Manage Keys** on the command bar of the **Dashboard** tab. Copy the **Application Key**.

2. In Solution Explorer for Visual Studio, open the App.xaml.cs file in the client sample project. Change the initialization of the **MobileServiceClient** to use your mobile service URL and application key:

         public static MobileServiceClient MobileService = new MobileServiceClient(
            "https://your-mobile-service.azure-mobile.net/",
            "Your AppKey"
        );

3. In Visual Studio, press the **F5** key to build and run the app.

4. As before, type text in the textbox, and then click **Save**. This saves the data to the local sync table, but not to the server.

    ![][0]

5. To see the current state of your database, log into the [Azure Management Portal], click **Mobile Services**, and then click your mobile service.

  * If you are using the JavaScript backend for your mobile service, click the **Data** tab, then click the **TodoWithDate** table. Click **Browse** to see that the table will still be empty, since we have not pushed changes from the app to the server..

        ![][1]

  *  If you are using the .NET backend for your mobile service, click the **Configure** tab, then click your SQL database. Click **Manage** at the bottom of the screen to log into the SQL Azure Managment Portal to view your database by running a SQL query similar to the following.
    
            SELECT * FROM todolist.todowithdate

        ![][2]
   	 

7. Back in the app, click **Push**.

8. In the Management Portal, click **Refresh** on the **TodoItem** table. You should now see the data that you entered in your app.

   	![][3]

## <a name="handle-conflict"></a>Update the data in the backend to create a conflict

In a real world scenario, a sync conflict would occur when one app pushes updates to a record in the database, and then another app tries to push a change to the same record using an outdated version field in that record. If an instance of the app tries to update the same record, without pulling in the updated record, a conflict will occur and be caught as a `MobileServicePreconditionFailedException` in the app.  

If you want to deploy the app to another machine to run two instances of the app to generate a conflict, you can follow the deployment instructions in the [Handling Database Conflicts] tutorial.

The following steps show you how you can update the database in Visual Studio to cause a conflcit.

1. In Visual Studio run Server Explorer and connect to your Azure account. Expand your **SQL Databases** for your Azure account.
 
    ![][5]
 
   
2. Right click your SQL database in list and click **Open in SQL Server Object Explorer**.
3. In SQL Server Object Explorer, expand your database and expand **Tables**. Right click your **TodoWithDate** table and click **View Data**. 


4. Change the **complete** field for one of the items to True.

    ![][6]

5. Back in your Todo app, edit the same item that you modified in the database directly.

    ![][7]

6. Click the **Push** button. You will see a dialog box asking how to resolve the conflict. Choose one of the options to resolve the conflict.

    ![][8]

## Review of the code for handling sync conflicts

In order to set up the offline feature to detect conflicts, you must include a version column in both your local database and your data transfer object. The class `TodoItem` has the following member:

        [Version]
        public string Version { get; set; }

The column `__version` is also specified in the local database set up in the  `OnNavigatedTo()` method.

To handle offline sync conflicts in your code, you create a class that implements `IMobileServiceSyncHandler`. Pass an object of this type in the call to `InitializeAsync`:

     await App.MobileService.SyncContext.InitializeAsync(store, new SyncHandler(App.MobileService));

The class `SyncHandler` in **MainPage.xaml.cs** implements `IMobileServiceSyncHandler`. The method `ExecuteTableOperationAsync` is called when each push operation is sent to the server. If an exception of type `MobileServicePreconditionFailedException` is thrown, this means that there is a conflict between the local and remote versions of an item.

To resolve conflicts in favor of the local item, you should simply retry the operation. Once a conflict has occurred, the local item version will be updated to match the server version, so executing the operation again will overwrite the server changes with the local changes:

    await operation.ExecuteAsync(); 

To resolve conflicts in favor of the server item, simply return from the `ExecuteTableOperationAsync`. The local version of the object will be discarded and replaced with the value from the server.

To stop the push operation (but retain the queued changes), use the method `AbortPush()`:

    operation.AbortPush();

This will stop the current push operation but will keep all pending changes, including the current operation if `AbortPush` is called from `ExecuteTableOperationAsync`. The next time that `PushAsync()` is called, these changes will be sent to the server. 

When a push is canceled, `PushAsync` will throw a `MobileServicePushFailedException`, and the exception property `PushResult.Status` will have the value `MobileServicePushStatus.CancelledByOperation`. 


<!-- Anchors. -->
[Download the Windows Store app project]: #download-app
[Create the mobile service]: #create-service
[Add a due date column for the database]: #add-column
[Updating the database for .NET backend mobile services]: #dotnet-backend  
[Updating the database for JavaScript mobile services]: #javascript-backend
[Test the app against a mobile service]: #test-app
[Manually update the data in the backend to create a conflict]: #handle-conflict
[Next Steps]:#next-steps

<!-- Images -->
[0]: ./media/mobile-services-windows-store-dotnet-handling-conflicts-offline-data/mobile-services-handling-conflicts-app-run1.png
[1]: ./media/mobile-services-windows-store-dotnet-handling-conflicts-offline-data/mobile-services-todowithdate-empty.png
[2]: ./media/mobile-services-windows-store-dotnet-handling-conflicts-offline-data/mobile-services-todowithdate-empty-sql.png
[3]: ./media/mobile-services-windows-store-dotnet-handling-conflicts-offline-data/mobile-services-todowithdate-push1.png
[4]: ./media/mobile-services-windows-store-dotnet-handling-conflicts-offline-data/mobile-services-todowithdate-design-edit.png
[5]: ./media/mobile-services-windows-store-dotnet-handling-conflicts-offline-data/mobile-services-server-explorer.png
[6]: ./media/mobile-services-windows-store-dotnet-handling-conflicts-offline-data/mobile-services-sql-server-object-explorer-update-data.png
[7]: ./media/mobile-services-windows-store-dotnet-handling-conflicts-offline-data/mobile-services-handling-conflicts-app-run2.png
[8]: ./media/mobile-services-windows-store-dotnet-handling-conflicts-offline-data/mobile-services-handling-conflicts-app-run3.png




<!-- URLs -->
[Handling conflicts code sample]: http://go.microsoft.com/fwlink/?LinkId=394787
[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-windows-store-get-started/
[Get started with offline data]: /en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-offline-data
[SQLite for Windows 8.1]: http://go.microsoft.com/fwlink/?LinkId=394776
[Azure Management Portal]: https://manage.windowsazure.com/
[Handling Database Conflicts]: /en-us/documentation/articles/mobile-services-windows-store-dotnet-handle-database-conflicts/#test-app