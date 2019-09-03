---
title: Enable offline sync for your Azure Mobile App (Android)
description: Learn how to use App Service Mobile Apps to cache and sync offline data in your Android application
documentationcenter: android
author: elamalani
manager: crdun
services: app-service\mobile

ms.assetid: 32a8a079-9b3c-4faf-8588-ccff02097224
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-android
ms.devlang: java
ms.topic: article
ms.date: 06/25/2019
ms.author: emalani
---
# Enable offline sync for your Android mobile app
[!INCLUDE [app-service-mobile-selector-offline](../../includes/app-service-mobile-selector-offline.md)]

> [!NOTE]
> Visual Studio App Center is investing in new and integrated services central to mobile app development. Developers can use **Build**, **Test** and **Distribute** services to set up Continuous Integration and Delivery pipeline. Once the app is deployed, developers can monitor the status and usage of their app using the **Analytics** and **Diagnostics** services, and engage with users using the **Push** service. Developers can also leverage **Auth** to authenticate their users and **Data** service to persist and sync app data in the cloud. Check out [App Center](https://appcenter.ms/?utm_source=zumo&utm_campaign=app-service-mobile-android-get-started-offline-data) today.
>

## Overview
This tutorial covers the offline sync feature of Azure Mobile Apps for Android. Offline sync allows end users to interact with a mobile app&mdash;viewing, adding, or modifying data&mdash;even when there is no network connection. Changes are stored in a local database. Once the device is back online, these changes are synced with the remote backend.

If this is your first experience with Azure Mobile Apps, you should first complete the tutorial [Create an Android App]. If you do not use the downloaded quick start server project, you must add the data access extension packages to your project. For more information about server extension packages, see [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md).

To learn more about the offline sync feature, see the topic [Offline Data Sync in Azure Mobile Apps].

## Update the app to support offline sync
With offline sync, you read to and write from a *sync table* (using the *IMobileServiceSyncTable* interface), which is part of a **SQLite** database on your device.

To push and pull changes between the device and Azure Mobile Services, you use a *synchronization context* (*MobileServiceClient.SyncContext*), which you initialize with the local database to store data locally.

1. In `TodoActivity.java`, comment out the existing definition of `mToDoTable` and uncomment the sync table version:
   
        private MobileServiceSyncTable<ToDoItem> mToDoTable;
2. In the `onCreate` method, comment out the existing initialization of `mToDoTable` and uncomment this definition:
   
        mToDoTable = mClient.getSyncTable("ToDoItem", ToDoItem.class);
3. In `refreshItemsFromTable` comment out the definition of `results` and uncomment this definition:
   
        // Offline Sync
        final List<ToDoItem> results = refreshItemsFromMobileServiceTableSyncTable();
4. Comment out the definition of `refreshItemsFromMobileServiceTable`.
5. Uncomment the definition of `refreshItemsFromMobileServiceTableSyncTable`:
   
        private List<ToDoItem> refreshItemsFromMobileServiceTableSyncTable() throws ExecutionException, InterruptedException {
            //sync the data
            sync().get();
            Query query = QueryOperations.field("complete").
                    eq(val(false));
            return mToDoTable.read(query).get();
        }
6. Uncomment the definition of `sync`:
   
        private AsyncTask<Void, Void, Void> sync() {
            AsyncTask<Void, Void, Void> task = new AsyncTask<Void, Void, Void>(){
                @Override
                protected Void doInBackground(Void... params) {
                    try {
                        MobileServiceSyncContext syncContext = mClient.getSyncContext();
                        syncContext.push().get();
                        mToDoTable.pull(null).get();
                    } catch (final Exception e) {
                        createAndShowDialogFromTask(e, "Error");
                    }
                    return null;
                }
            };
            return runAsyncTask(task);
        }

## Test the app
In this section, you test the behavior with WiFi on, and then turn off WiFi to create an offline scenario.

When you add data items, they are held in the local SQLite store, but not synced to the mobile service until you press the **Refresh** button. Other apps may have different requirements regarding when data needs to be synchronized, but for demo purposes this tutorial has the user explicitly request it.

When you press that button, a new background task starts. It first pushes all changes made to the local store using synchronization context, then pulls all changed data from Azure to the local table.

### Offline testing
1. Place the device or simulator in *Airplane Mode*. This creates an offline scenario.
2. Add some *ToDo* items, or mark some items as complete. Quit the device or simulator (or forcibly close the app) and restart. Verify that your changes have been persisted on the device because they are held in the local SQLite store.
3. View the contents of the Azure *TodoItem* table either with a SQL tool such as *SQL Server Management Studio*, or a REST client such as *Fiddler* or *Postman*. Verify that the new items have *not* been synced to the server
   
       + For a Node.js backend, go to the [Azure portal](https://portal.azure.com/), and in your Mobile App backend click **Easy Tables** > **TodoItem** to view the contents of the `TodoItem` table.
       + For a .NET backend, view the table contents either with a SQL tool such as *SQL Server Management Studio*, or a REST client such as *Fiddler* or *Postman*.
4. Turn on WiFi in the device or simulator. Next, press the **Refresh** button.
5. View the TodoItem data again in the Azure portal. The new and changed TodoItems should now appear.

## Additional Resources
* [Offline Data Sync in Azure Mobile Apps]
* [Cloud Cover: Offline Sync in Azure Mobile Services] \(note: the video is on Mobile Services, but offline sync works in a similar way in Azure Mobile Apps\)

<!-- URLs. -->

[Offline Data Sync in Azure Mobile Apps]: app-service-mobile-offline-data-sync.md

[Create an Android App]: app-service-mobile-android-get-started.md

[Cloud Cover: Offline Sync in Azure Mobile Services]: https://channel9.msdn.com/Shows/Cloud+Cover/Episode-155-Offline-Storage-with-Donna-Malayeri
[Azure Friday: Offline-enabled apps in Azure Mobile Services]: https://azure.microsoft.com/documentation/videos/azure-mobile-services-offline-enabled-apps-with-donna-malayeri/

