<properties 
	pageTitle="Handle conflicts with offline data in Mobile Services (Windows Phone) | Microsoft Azure" 
	description="Learn how to use Azure Mobile Services handle conflicts when syncing offline data in your Windows phone application" 
	documentationCenter="windows" 
	authors="wesmc7777" 
	manager="dwrede" 
	editor="" 
	services="mobile-services"/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-phone" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="06/15/2015" 
	ms.author="wesmc"/>


# Handling conflicts with offline data sync in Mobile Services

[AZURE.INCLUDE [mobile-services-selector-offline-conflicts](../../includes/mobile-services-selector-offline-conflicts.md)]

##Overview

This topic shows you how to synchronize data and handle conflicts when using the offline capabilities of Azure Mobile Services. In this tutorial, you will download an app that supports both offline and online data, integrate the mobile service with the app, and then login to the Azure Management Portal to view and update the database when running the app.

This tutorial builds on the steps and the sample app from the previous tutorial [Get started with offline data]. Before you begin this tutorial, you must first complete [Get started with offline data].


##Prerequisites

This tutorial requires Visual Studio 2012 and the [Windows Phone 8 SDK].


##Download the sample project



This tutorial is built on the [Handling conflicts code sample], which is a Windows Phone 8 project for Visual Studio 2012.  
The UI for this app is similar to the app in the tutorial [Get started with offline data], except that there is a new date column in for each TodoItem.

![][0]


1. Download the Windows Phone version of the [Handling conflicts code sample]. 

2. Install [SQLite for Windows Phone 8] if it has not been installed.

3. In Visual Studio 2012, open the downloaded project. Add a reference to **SQLite for Windows Phone** under **Windows Phone** > **Extensions**.

4. In Visual Studio 2012, press the **F5** key to build and run the app in the debugger.
 
5. In the app, type some text for some new todo items, then click **Save** to save each one. You can also modify the due date of the todo items you add.


Note that the app is not yet connected to any mobile service, so the buttons **Push** and **Pull** will throw exceptions.


##Add a column to the data model

In this section you will update the database for your mobile service to include a TodoItem table with a due date column. The app allows you to change the due date for an item at runtime so that you can generate sync conflicts in a later section of this tutorial. 

The `TodoItem` class in the sample is defined in MainPage.xaml.cs. Notice the class has the following attribute which will target the sync operations against that table.

        [DataTable("TodoWithDate")]

Update your database to include this table.

###<a name="dotnet-backend"></a>Updating the database for .NET backend mobile services 

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

    >[AZURE.NOTE] When using the default database initializer, Entity Framework will drop and recreate the database whenever it detects a data model change in the Code First model definition. To make this data model change and maintain existing data in the database, you must use Code First Migrations. For more information, see [How to Use Code First Migrations to Update the Data Model](mobile-services-dotnet-backend-how-to-use-code-first-migrations.md).


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


##Test the app against your  mobile service

Now it's time to test the app against Mobile Services.

1. In the Azure Management Portal, find your mobile service's application key by clicking **Manage Keys** on the command bar of the **Dashboard** tab. Copy the **Application Key**.

2. In Solution Explorer for Visual Studio, open the App.xaml.cs file in the client sample project. Change the initialization of the **MobileServiceClient** to use your mobile service URL and application key:

         public static MobileServiceClient MobileService = new MobileServiceClient(
            "https://your-mobile-service.azure-mobile.net/",
            "Your AppKey"
        );

3. In Visual Studio, press the **F5** key to build and run the app.

4. As before, type text in the textbox, and then click **Save** to save some new todo items. This saves the data to the local sync table, but not to the server.

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

9. Leave **Emulator WVGA 512MB** up and running for the next section where you will run the app in two emulators to generate a conflict.

##Update the data in the backend to create a conflict

In a real world scenario, a sync conflict would occur when one app pushes updates to a record in the database, and then another app tries to push a change to the same record using an outdated version field in that record. If an instance of the app tries to update the same record, without pulling in the updated record, a conflict will occur and be caught as a `MobileServicePreconditionFailedException` in the app.  

In this section you will run two instances of the app at the same time to generate a conflict. 


1. If **Emulator WVGA 512MB** is not still up and running, press **Ctrl+F5** to relaunch it.

2. In Visual Studio, change the output device to **Emulator WVGA** and run a second instance of the app in the new emulator by pressing **F5**.
 
    ![][5]
 
   
3. In the second instance of the app, click **Pull** to sync the local store with the mobile service database. Both instances of the app should have the same data.
 
    ![][6]

4. In the second instance of the app, click the check box to complete one of the items then click **Push** to push your change to the remote database. In the following screen shot, **Pick up James** has been completed indicating the James has already been picked up. The first instance of the app now has an outdated record.

    ![][9]

5. In the first instance of the app, try to change the date for the outdated record then click **Push** to attempt to update the remote database with the outdated record. In the screen shot below, we try to schedule James to be picked up on **5/10/2014**.

    ![][7]

6. When you click the **Push** button to commit the date change, you will see a dialog box indicating that the conflict has been detected. You will be asked how to resolve the conflict. Choose one of the options to resolve the conflict.

    In the scenario shown below, James has already been picked up. So there's no need to schedule a pick up for him on **5/10/2014**. The **Use server version** option would be selected so the first instance of the app would have that record updated with the record from the server. 

    ![][8]

##Review of the code for handling sync conflicts

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




<!-- Images -->
[0]: ./media/mobile-services-windows-phone-handling-conflicts-offline-data/mobile-services-handling-conflicts-app-run1.png
[1]: ./media/mobile-services-windows-phone-handling-conflicts-offline-data/mobile-services-todowithdate-empty.png
[2]: ./media/mobile-services-windows-phone-handling-conflicts-offline-data/mobile-services-todowithdate-empty-sql.png
[3]: ./media/mobile-services-windows-phone-handling-conflicts-offline-data/mobile-services-todowithdate-push1.png
[5]: ./media/mobile-services-windows-phone-handling-conflicts-offline-data/vs-emulator-wvga.png
[6]: ./media/mobile-services-windows-phone-handling-conflicts-offline-data/two-emulators-synced.png
[7]: ./media/mobile-services-windows-phone-handling-conflicts-offline-data/two-emulators-date-change.png
[8]: ./media/mobile-services-windows-phone-handling-conflicts-offline-data/two-emulators-conflict-detected.png
[9]: ./media/mobile-services-windows-phone-handling-conflicts-offline-data/two-emulators-item-completed.png



<!-- URLs -->
[Handling conflicts code sample]: http://go.microsoft.com/fwlink/?LinkId=398257
[Get started with Mobile Services]: ../mobile-services-windows-phone-get-started.md
[Get started with offline data]: mobile-services-windows-phone-get-started-offline-data.md
[Azure Management Portal]: https://manage.windowsazure.com/
[Windows Phone 8 SDK]: http://go.microsoft.com/fwlink/p/?linkid=268374
[SQLite for Windows Phone 8]: http://go.microsoft.com/fwlink/?LinkId=397953
[Get started with data]: mobile-services-windows-phone-get-started-data.md
 