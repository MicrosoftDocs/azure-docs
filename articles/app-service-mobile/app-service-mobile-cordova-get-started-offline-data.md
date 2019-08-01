---
title: Enable offline sync for your Azure Mobile App (Cordova) | Microsoft Docs
description: Learn how to use App Service Mobile App to cache and sync offline data in your Cordova application
documentationcenter: cordova
author: elamalani
manager: crdun
editor: ''
services: app-service\mobile

ms.assetid: 1a3f685d-f79d-4f8b-ae11-ff96e79e9de9
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-cordova-ios
ms.devlang: dotnet
ms.topic: article
ms.date: 06/25/2019
ms.author: emalani
---
# Enable offline sync for your Cordova mobile app
[!INCLUDE [app-service-mobile-selector-offline](../../includes/app-service-mobile-selector-offline.md)]

> [!NOTE]
> Visual Studio App Center is investing in new and integrated services central to mobile app development. Developers can use **Build**, **Test** and **Distribute** services to set up Continuous Integration and Delivery pipeline. Once the app is deployed, developers can monitor the status and usage of their app using the **Analytics** and **Diagnostics** services, and engage with users using the **Push** service. Developers can also leverage **Auth** to authenticate their users and **Data** service to persist and sync app data in the cloud. Check out [App Center](https://appcenter.ms/?utm_source=zumo&utm_campaign=app-service-mobile-cordova-get-started-offline-data) today.
>

## Overview
This tutorial introduces the offline sync feature of Azure Mobile Apps for Cordova. Offline sync allows
end users to interact with a mobile app&mdash;viewing, adding, or modifying data&mdash;even when there
is no network connection. Changes are stored in a local database.  Once the device is back online, these
changes are synced with the remote service.

This tutorial is based on the Cordova quickstart solution for Mobile Apps that you create when you complete
the tutorial [Apache Cordova quick start]. In this tutorial, you update the quickstart solution to add offline
features of Azure Mobile Apps.  We also highlight the offline-specific code in the app.

To learn more about the offline sync feature, see the topic [Offline Data Sync in Azure Mobile Apps]. For
details of API usage, see the [API documentation](https://azure.github.io/azure-mobile-apps-js-client).

## Add offline sync to the quickstart solution
The offline sync code must be added to the app. Offline sync requires the cordova-sqlite-storage plugin, which
automatically gets added to your app when the Azure Mobile Apps plugin is included in the project. The Quickstart
project includes both of these plugins.

1. In Visual Studio's Solution Explorer, open index.js and replace the following code

        var client,            // Connection to the Azure Mobile App backend
           todoItemTable;      // Reference to a table endpoint on backend

    with this code:

        var client,            // Connection to the Azure Mobile App backend
           todoItemTable,      // Reference to a table endpoint on backend
           syncContext;        // Reference to offline data sync context

2. Next, replace the following code:

        client = new WindowsAzure.MobileServiceClient('http://yourmobileapp.azurewebsites.net');

    with this code:

        client = new WindowsAzure.MobileServiceClient('http://yourmobileapp.azurewebsites.net');
        var store = new WindowsAzure.MobileServiceSqliteStore('store.db');

        store.defineTable({
          name: 'todoitem',
          columnDefinitions: {
              id: 'string',
              text: 'string',
              complete: 'boolean',
              version: 'string'
          }
        });

        // Get the sync context from the client
        syncContext = client.getSyncContext();

    The preceding code additions initialize the local store and define a local table that matches the column values
    used in your Azure back end. (You don't need to include all column values in this code.)  The `version` field
    is maintained by the mobile backend and is used for conflict resolution.

    You get a reference to the sync context by calling **getSyncContext**. The sync context helps preserve table
    relationships by tracking and pushing changes in all tables a client app has modified when `.push()` is called.

3. Update the application URL to your Mobile App application URL.

4. Next, replace this code:

        todoItemTable = client.getTable('todoitem'); // todoitem is the table name

    with this code:

        // Initialize the sync context with the store
        syncContext.initialize(store).then(function () {

        // Get the local table reference.
        todoItemTable = client.getSyncTable('todoitem');

        syncContext.pushHandler = {
            onConflict: function (pushError) {
                // Handle the conflict.
                console.log("Sync conflict! " + pushError.getError().message);
                // Update failed, revert to server's copy.
                pushError.cancelAndDiscard();
              },
              onError: function (pushError) {
                  // Handle the error
                  // In the simulated offline state, you get "Sync error! Unexpected connection failure."
                  console.log("Sync error! " + pushError.getError().message);
              }
        };

        // Call a function to perform the actual sync
        syncBackend();

        // Refresh the todoItems
        refreshDisplay();

        // Wire up the UI Event Handler for the Add Item
        $('#add-item').submit(addItemHandler);
        $('#refresh').on('click', refreshDisplay);

    The preceding code initializes the sync context and then calls getSyncTable (instead of getTable) to get a reference to the local table.

    This code uses the local database for all create, read, update, and delete (CRUD) table operations.

    This sample performs simple error handling on sync conflicts. A real application would handle the various errors like network conditions, server
    conflicts, and others. For code examples, see the [offline sync sample].

5. Next, add this function to perform the actual sync.

        function syncBackend() {

          // Sync local store to Azure table when app loads, or when login complete.
          syncContext.push().then(function () {
              // Push completed

          });

          // Pull items from the Azure table after syncing to Azure.
          syncContext.pull(new WindowsAzure.Query('todoitem'));
        }

    You decide when to push changes to the Mobile App backend by calling **syncContext.push()**. For example,
    you could call **syncBackend** in a button event handler tied to a sync button.

## Offline sync considerations

In the sample, the **push** method of **syncContext** is only called on app startup in the callback
function for login.  In a real-world application, you could also make this sync functionality triggered
 manually or when the network state changes.

When a pull is executed against a table that has pending local updates tracked by the context, that
pull operation automatically triggers a push. When refreshing, adding, and completing items in this
sample, you can omit the explicit **push** call, since it may be redundant.

In the provided code, all records in the remote todoItem table are queried, but it is also possible
to filter records by passing a query id and query to **push**. For more information, see the section
*Incremental Sync* in [Offline Data Sync in Azure Mobile Apps].

## (Optional) Disable authentication

If you don't want to set up authentication before testing offline sync, comment out the callback function
for login, but leave the code inside the callback function uncommented.  After commenting out the login lines,
the code follows:

      // Login to the service.
      // client.login('twitter')
      //    .then(function () {
        syncContext.initialize(store).then(function () {
          // Leave the rest of the code in this callback function  uncommented.
                ...
        });
      // }, handleError);

Now, the app syncs with the Azure backend when you run the app.

## Run the client app
With offline sync now enabled, you can run the client application at least once on each platform to
populate the local store database. Later, simulate an offline scenario and modify the data in
the local store while the app is offline.

## (Optional) Test the sync behavior
In this section, you modify the client project to simulate an offline scenario by using an invalid
application URL for your backend. When you add or change data items, these changes are held in the
local store, but are not synced to the backend data store until the connection is re-established.

1. In the Solution Explorer, open the index.js project file and change the application URL to point to
    an invalid URL, like the following code:

        client = new WindowsAzure.MobileServiceClient('http://yourmobileapp.azurewebsites.net-fail');

2. In index.html, update the CSP `<meta>` element with the same invalid URL.

        <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: http://yourmobileapp.azurewebsites.net-fail; style-src 'self'; media-src *">

3. Build and run the client app and notice that an exception is logged in the console when the app attempts to
    sync with the backend after login. Any new items you add exist only in the local store until they are pushed
    to the mobile backend. The client app behaves as if it is connected to the backend.

4. Close the app and restart it to verify that the new items you created are persisted to the local store.

5. (Optional) Use Visual Studio to view your Azure SQL Database table to see that the data in the backend database has not changed.

    In Visual Studio, open **Server Explorer**. Navigate to your database in **Azure**->**SQL Databases**. Right-click your database and select
    **Open in SQL Server Object Explorer**. Now you can browse to your SQL database table and its contents.

## (Optional) Test the reconnection to your mobile backend

In this section, you reconnect the app to the mobile backend, which simulates the app coming back to
an online state. When you log in, data is synced to your mobile backend.

1. Reopen index.js and restore the application URL.
2. Reopen index.html and correct the application URL in the CSP `<meta>` element.
3. Rebuild and run the client app. The app attempts to sync with the mobile app backend after login. Verify
    that no exceptions are logged in the debug console.
4. (Optional) View the updated data using either SQL Server Object Explorer or a REST tool like Fiddler. Notice
    the data has been synchronized between the backend database and the local store.

    Notice the data has been synchronized between the database and the local store and contains the items you added while your app was disconnected.

## Additional resources
* [Offline Data Sync in Azure Mobile Apps]
* [Visual Studio Tools for Apache Cordova]

## Next steps
* Review more advanced offline sync features such as conflict resolution in the [offline sync sample]
* Review the offline sync API reference in the [API documentation](https://azure.github.io/azure-mobile-apps-js-client).

<!-- ##Summary -->

<!-- Images -->

<!-- URLs. -->
[Apache Cordova quick start]: app-service-mobile-cordova-get-started.md
[offline sync sample]: https://github.com/Azure-Samples/app-service-mobile-cordova-client-conflict-handling
[Offline Data Sync in Azure Mobile Apps]: app-service-mobile-offline-data-sync.md
[Cloud Cover: Offline Sync in Azure Mobile Services]: https://channel9.msdn.com/Shows/Cloud+Cover/Episode-155-Offline-Storage-with-Donna-Malayeri
[Adding Authentication]: app-service-mobile-cordova-get-started-users.md
[authentication]: app-service-mobile-cordova-get-started-users.md
[Work with the .NET backend server SDK for Azure Mobile Apps]: app-service-mobile-dotnet-backend-how-to-use-server-sdk.md
[Visual Studio Community 2015]: https://www.visualstudio.com/
[Visual Studio Tools for Apache Cordova]: https://www.visualstudio.com/en-us/features/cordova-vs.aspx
[Apache Cordova SDK]: app-service-mobile-cordova-how-to-use-client-library.md
[ASP.NET Server SDK]: app-service-mobile-dotnet-backend-how-to-use-server-sdk.md
[Node.js Server SDK]: app-service-mobile-node-backend-how-to-use-server-sdk.md
