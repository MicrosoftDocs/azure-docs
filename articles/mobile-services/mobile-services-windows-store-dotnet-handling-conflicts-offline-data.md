<properties
	pageTitle="Handle conflicts with offline data in universal Windows apps | Microsoft Azure"
	description="Learn how to use Azure Mobile Services handle conflicts when syncing offline data in your universal Windows application"
	documentationCenter="windows"
	authors="wesmc7777"
	manager="dwrede"
	editor=""
	services="mobile-services"/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-windows-store"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="07/21/2016"
	ms.author="glenga"/>


# Handling conflicts with offline data sync in Mobile Services

[AZURE.INCLUDE [mobile-service-note-mobile-apps](../../includes/mobile-services-note-mobile-apps.md)]

&nbsp;


[AZURE.INCLUDE [mobile-services-selector-offline-conflicts](../../includes/mobile-services-selector-offline-conflicts.md)]

##Overview

This topic shows you how to synchronize data and handle conflicts when using the offline capabilities of Azure Mobile Services.

If you prefer to watch a video, the clip below follows the same steps as this tutorial.

> [AZURE.VIDEO build-offline-apps-with-mobile-services]

In this tutorial, you download a universal Windows C# solution for an app that supports handling offline synchronization conflicts. You will integrate a mobile service with the app, and then run the Windows Store 8.1 and Windows Phone 8.1 clients to generate a sync conflict and resolve it.

This tutorial builds on the steps and the sample app from the previous tutorial [Get started with offline data]. Before you begin this tutorial, you should first complete [Get started with offline data].


##Prerequisites

This tutorial requires Visual Studio 2013 running on Windows 8.1.


##Download the sample project

![][0]

This tutorial is a walkthrough of how the [Todo Offline Mobile Services sample] handles sync conflicts between the local offline store and the Mobile Service database in Azure.

1. Download the zip file for the [Mobile Services Samples GitHub Repository] and extract it to a working directory.

2. If you haven't already installed SQLite for Windows 8.1 and Windows Phone 8.1 as mentioned in the [Get started with offline data] tutorial, install both runtimes.

3. In Visual Studio 2013, open the *mobile-services-samples\TodoOffline\WindowsUniversal\TodoOffline-Universal.sln* solution file. Press the **F5** key to rebuild and run the project. Verify the NuGet packages are restored and the references are correctly set.

    >[AZURE.NOTE] You may need to delete any old references to the SQLite runtime and replace them with the updated reference as mentioned in the [Get started with offline data] tutorial.

4. In the app, type some text in **Insert a TodoItem**, then click **Save** to add some todo items to the local store. Then close the app.

Note that the app is not yet connected to any mobile service, so the buttons **Push** and **Pull** will throw exceptions.




##Test the app against your  mobile service

Now it's time to test the app against Mobile Services.

1. In the [Azure classic portal], find your mobile service's application key by clicking **Manage Keys** on the command bar of the **Dashboard** tab. Copy the **Application Key**.

2. In Solution Explorer for Visual Studio, open the App.xaml.cs file in the client sample project. Change the initialization of the **MobileServiceClient** to use your mobile service URL and application key:

         public static MobileServiceClient MobileService = new MobileServiceClient(
            "https://your-mobile-service.azure-mobile.net/",
            "Your AppKey"
        );

3. In Visual Studio, press the **F5** key to build and run the app again.

    ![][0]


##Update the data in the backend to create a conflict

In a real world scenario, a sync conflict would occur when one app pushes updates to a record in the database, and then another app tries to push an update to the same record using an outdated version field in that record. If you recall from the [Get started with offline data], the version system property is required to support the offline syncing features. This version information is examined with each database update. If an instance of the app tries to update a record using an outdated version, a conflict will occur and be caught as a `MobileServicePreconditionFailedException` in the app. If the app doesn't catch the `MobileServicePreconditionFailedException` then a `MobileServicePushFailedException` will end up being thrown describing how many sync errors were encountered.

>[AZURE.NOTE] To support synchronization of deleted records with offline data sync, you should enable [Soft Delete](mobile-services-using-soft-delete.md). Otherwise, you have to manually remove records in the local store, or call `IMobileServiceSyncTable::PurgeAsync()` to purge the local store.


The following steps show the Windows Phone 8.1 and Windows Store 8.1 clients running at the same time to cause and resolve a conflict using the sample.

1. In Visual Studio, right click the Windows Phone 8.1 project and click **Set as Startup Project**. Then press **Ctrl+F5** keys to run the Windows Phone 8.1 client without debugging. Once you have the Windows Phone 8.1 client up and running in the emulator, click the **Pull** button to sync the local store with the current state of the database.

    ![][3]


2. In Visual Studio, right click the Windows 8.1 runtime project and click **Set as Startup Project** to set it back to the start up project. Then press **F5** to run it. Once you have the Windows Store 8.1 client up and running, click the **Pull** button to sync the local store with the current state of the database.

    ![][4]

3. At this point point both clients are synchronized with the database. The code for both clients are also using incremental sync, so that they will only sync incomplete todo items. Completed todo items will be ignored. Choose one of the items and edit the text of the same item in both clients to a different value. Click the **Push** button to sync both changes with the database on the server.

    ![][5]

    ![][6]


4. The client whose push was executing last encounters the conflict and allows the user to decide which value to commit to the database. The exception provides the correct version value which is used for resolving the conflict.

    ![][7]



##Review of the code for handling sync conflicts

In order to use the offline features for Mobile Services, you must include the version column in both your local database and your data transfer object. This is accomplished by updating the `TodoItem` class the following member:

        [Version]
        public string Version { get; set; }

The `__version` column is included in the local database in the  `OnNavigatedTo()` method when the `TodoItem` class is used to define the local store.

To handle offline sync conflicts in your code, you create a class that implements `IMobileServiceSyncHandler`. Pass an object of this type in the call to `MobileServiceClient.SyncContext.InitializeAsync()`. This also occurs in the  `OnNavigatedTo()` method of the sample.

     await App.MobileService.SyncContext.InitializeAsync(store, new SyncHandler(App.MobileService));

The class `SyncHandler` in **SyncHandler.cs** implements `IMobileServiceSyncHandler`. The method `ExecuteTableOperationAsync` is called when each push operation is sent to the server. If an exception of type `MobileServicePreconditionFailedException` is thrown, this means that there is a conflict between the local and remote versions of an item.

To resolve conflicts in favor of the local item, you should simply retry the operation. Once a conflict has occurred, the local item version will be updated to match the server version, so executing the operation again will overwrite the server changes with the local changes:

    await operation.ExecuteAsync();

To resolve conflicts in favor of the server item, simply return from the `ExecuteTableOperationAsync`. The local version of the object will be discarded and replaced with the value from the server.

To stop the push operation (but retain the queued changes), use the method `AbortPush()`:

    operation.AbortPush();

This will stop the current push operation but will keep all pending changes, including the current operation if `AbortPush` is called from `ExecuteTableOperationAsync`. The next time that `PushAsync()` is called, these changes will be sent to the server.

When a push is canceled, `PushAsync` will throw a `MobileServicePushFailedException`, and the exception property `PushResult.Status` will have the value `MobileServicePushStatus.CancelledByOperation`.



<!-- Images -->
[0]: ./media/mobile-services-windows-store-dotnet-handling-conflicts-offline-data/mobile-services-handling-conflicts-app-run1.png
[1]: ./media/mobile-services-windows-store-dotnet-handling-conflicts-offline-data/javascript-backend-database.png
[2]: ./media/mobile-services-windows-store-dotnet-handling-conflicts-offline-data/dotnet-backend-database.png
[3]: ./media/mobile-services-windows-store-dotnet-handling-conflicts-offline-data/wp81-view.png
[4]: ./media/mobile-services-windows-store-dotnet-handling-conflicts-offline-data/win81-view.png
[5]: ./media/mobile-services-windows-store-dotnet-handling-conflicts-offline-data/wp81-edit-text.png
[6]: ./media/mobile-services-windows-store-dotnet-handling-conflicts-offline-data/win81-edit-text.png
[7]: ./media/mobile-services-windows-store-dotnet-handling-conflicts-offline-data/conflict.png




<!-- URLs -->
[Handling conflicts code sample]: http://go.microsoft.com/fwlink/?LinkId=394787
[Get started with Mobile Services]: ../mobile-services-windows-store-get-started.md
[Get started with offline data]: mobile-services-windows-store-dotnet-get-started-offline-data.md
[SQLite for Windows 8.1]: http://go.microsoft.com/fwlink/?LinkId=394776
[Azure classic portal]: https://manage.windowsazure.com/
[Handling Database Conflicts]: mobile-services-windows-store-dotnet-handle-database-conflicts.md#test-app
[Mobile Services Samples GitHub Repository]: http://go.microsoft.com/fwlink/?LinkId=512865
[Todo Offline Mobile Services sample]: http://go.microsoft.com/fwlink/?LinkId=512866

