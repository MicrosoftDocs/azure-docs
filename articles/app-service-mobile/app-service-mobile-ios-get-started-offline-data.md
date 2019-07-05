---
title: Enable offline syncing with iOS mobile apps | Microsoft Docs
description: Learn how to use Azure App Service mobile apps to cache and sync offline data in iOS applications.
documentationcenter: ios
author: elamalani
manager: crdun
editor: ''
services: app-service\mobile

ms.assetid: eb5b9520-0f39-4a09-940a-dadb6d940db8
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-ios
ms.devlang: objective-c
ms.topic: article
ms.date: 06/25/2019
ms.author: emalani
---
# Enable offline syncing with iOS mobile apps
[!INCLUDE [app-service-mobile-selector-offline](../../includes/app-service-mobile-selector-offline.md)]

> [!NOTE]
> Visual Studio App Center is investing in new and integrated services central to mobile app development. Developers can use **Build**, **Test** and **Distribute** services to set up Continuous Integration and Delivery pipeline. Once the app is deployed, developers can monitor the status and usage of their app using the **Analytics** and **Diagnostics** services, and engage with users using the **Push** service. Developers can also leverage **Auth** to authenticate their users and **Data** service to persist and sync app data in the cloud. Check out [App Center](https://appcenter.ms/?utm_source=zumo&utm_campaign=app-service-mobile-ios-get-started-offline-data) today.
>

## Overview
This tutorial covers offline syncing with the Mobile Apps feature of Azure App Service for iOS. With offline syncing end-users can interact with a mobile app to view, add, or modify data, even when they have no network connection. Changes are stored in a local database. After the device is back online, the changes are synced with the remote back end.

If this is your first experience with Mobile Apps, you should first complete the tutorial [Create an iOS App]. If you do not use the downloaded quick-start server project, you must add the data-access extension packages to your project. For more information about server extension packages, see [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md).

To learn more about the offline sync feature, see [Offline Data Sync in Mobile Apps].

## <a name="review-sync"></a>Review the client sync code
The client project that you downloaded for the [Create an iOS App] tutorial already contains code that supports offline synchronization using a local Core Data-based database. This section summarizes what is already included in the tutorial code. For a conceptual overview of the feature, see [Offline Data Sync in Mobile Apps].

Using the offline data-sync feature of Mobile Apps, end-users can interact with a local database even when the network is inaccessible. To use these features in your app, you initialize the sync context of `MSClient` and reference a local store. Then you reference your table through the **MSSyncTable** interface.

In **QSTodoService.m** (Objective-C) or **ToDoTableViewController.swift** (Swift), notice that the type of the member **syncTable** is **MSSyncTable**. Offline sync uses this sync table interface instead of **MSTable**. When a sync table is used, all operations go to the local store and are synchronized only with the remote back end with explicit push and pull operations.

 To get a reference to a sync table, use the **syncTableWithName** method on `MSClient`. To remove offline sync functionality, use **tableWithName** instead.

Before any table operations can be performed, the local store must be initialized. Here is the relevant code:

* **Objective-C**. In the **QSTodoService.init** method:

   ```objc
   MSCoreDataStore *store = [[MSCoreDataStore alloc] initWithManagedObjectContext:context];
   self.client.syncContext = [[MSSyncContext alloc] initWithDelegate:nil dataSource:store callback:nil];
   ```    
* **Swift**. In the **ToDoTableViewController.viewDidLoad** method:

   ```swift
   let client = MSClient(applicationURLString: "http:// ...") // URI of the Mobile App
   let managedObjectContext = (UIApplication.sharedApplication().delegate as! AppDelegate).managedObjectContext!
   self.store = MSCoreDataStore(managedObjectContext: managedObjectContext)
   client.syncContext = MSSyncContext(delegate: nil, dataSource: self.store, callback: nil)
   ```
   This method creates a local store by using the `MSCoreDataStore` interface, which the Mobile Apps SDK provides. Alternatively, you can provide a different local store by implementing the `MSSyncContextDataSource` protocol. Also, the first parameter of **MSSyncContext** is used to specify a conflict handler. Because we have passed `nil`, we get the default conflict handler, which fails on any conflict.

Now, let's perform the actual sync operation, and get data from the remote back end:

* **Objective-C**. `syncData` first pushes new changes and then calls **pullData** to get data from the remote back end. In turn, the **pullData** method gets new data that matches a query:

   ```objc
   -(void)syncData:(QSCompletionBlock)completion
   {
       // Push all changes in the sync context, and then pull new data.
       [self.client.syncContext pushWithCompletion:^(NSError *error) {
           [self logErrorIfNotNil:error];
           [self pullData:completion];
       }];
   }

   -(void)pullData:(QSCompletionBlock)completion
   {
       MSQuery *query = [self.syncTable query];

       // Pulls data from the remote server into the local table.
       // We're pulling all items and filtering in the view.
       // Query ID is used for incremental sync.
       [self.syncTable pullWithQuery:query queryId:@"allTodoItems" completion:^(NSError *error) {
           [self logErrorIfNotNil:error];

           // Lets the caller know that we have finished.
           if (completion != nil) {
               dispatch_async(dispatch_get_main_queue(), completion);
           }
       }];
   }
   ```
* **Swift**:
   ```swift
   func onRefresh(sender: UIRefreshControl!) {
      UIApplication.sharedApplication().networkActivityIndicatorVisible = true

      self.table!.pullWithQuery(self.table?.query(), queryId: "AllRecords") {
          (error) -> Void in

          UIApplication.sharedApplication().networkActivityIndicatorVisible = false

          if error != nil {
              // A real application would handle various errors like network conditions,
              // server conflicts, etc. via the MSSyncContextDelegate
              print("Error: \(error!.description)")

              // We will discard our changes and keep the server's copy for simplicity
              if let opErrors = error!.userInfo[MSErrorPushResultKey] as? Array<MSTableOperationError> {
                  for opError in opErrors {
                      print("Attempted operation to item \(opError.itemId)")
                      if (opError.operation == .Insert || opError.operation == .Delete) {
                          print("Insert/Delete, failed discarding changes")
                          opError.cancelOperationAndDiscardItemWithCompletion(nil)
                      } else {
                          print("Update failed, reverting to server's copy")
                          opError.cancelOperationAndUpdateItem(opError.serverItem!, completion: nil)
                      }
                  }
              }
          }
          self.refreshControl?.endRefreshing()
      }
   }
   ```

In the Objective-C version, in `syncData`, we first call **pushWithCompletion** on the sync context. This method is a member of `MSSyncContext` (and not the sync table itself) because it pushes changes across all tables. Only records that have been modified in some way locally (through CUD operations) are sent to the server. Then the helper **pullData** is called, which calls **MSSyncTable.pullWithQuery** to retrieve remote data and store it in the local database.

In the Swift version, because the push operation was not strictly necessary, there is no call to **pushWithCompletion**. If there are any changes pending in the sync context for the table that is doing a push operation, pull always issues a push first. However, if you have more than one sync table, it is best to explicitly call push to ensure that everything is consistent across related tables.

In both the Objective-C and Swift versions, you can use the **pullWithQuery** method to specify a query to filter the records you want to retrieve. In this example, the query retrieves all records in the remote `TodoItem` table.

The second parameter of **pullWithQuery** is a query ID that is used for *incremental sync*. Incremental sync retrieves only records that were modified since the last sync, using the record's `UpdatedAt` time stamp (called `updatedAt` in the local store.) The query ID should be a descriptive string that is unique for each logical query in your app. To opt out of incremental sync, pass `nil` as the query ID. This approach can be potentially inefficient, because it retrieves all records on each pull operation.

The Objective-C app syncs when you modify or add data, when a user performs the refresh gesture, and on launch.

The Swift app syncs when the user performs the refresh gesture and on launch.

Because the app syncs whenever data is modified (Objective-C) or whenever the app starts (Objective-C and Swift), the app assumes that the user is online. In a later section, you will update the app so that users can edit even when they are offline.

## <a name="review-core-data"></a>Review the Core Data model
When you use the Core Data offline store, you must define particular tables and fields in your data model. The sample app already includes a data model with the right format. In this section, we walk through these tables to show how they are used.

Open **QSDataModel.xcdatamodeld**. Four tables are defined--three that are used by the SDK and one that's used for the to-do items themselves:
  * MS_TableOperations: Tracks the items that need to be synchronized with the server.
  * MS_TableOperationErrors: Tracks any errors that happen during offline synchronization.
  * MS_TableConfig: Tracks the last updated time for the last sync operation for all pull operations.
  * TodoItem: Stores the to-do items. The system columns **createdAt**, **updatedAt**, and **version** are optional system properties.

> [!NOTE]
> The Mobile Apps SDK reserves column names that begin with "**``**". Do not use this prefix with anything other than system columns. Otherwise, your column names are modified when you use the remote back end.
>
>

When you use the offline sync feature, define the three system tables and the data table.

### System tables

**MS_TableOperations**  

![MS_TableOperations table attributes][defining-core-data-tableoperations-entity]

| Attribute | Type |
| --- | --- |
| id | Integer 64 |
| itemId | String |
| properties | Binary Data |
| table | String |
| tableKind | Integer 16 |


**MS_TableOperationErrors**

 ![MS_TableOperationErrors table attributes][defining-core-data-tableoperationerrors-entity]

| Attribute | Type |
| --- | --- |
| id |String |
| operationId |Integer 64 |
| properties |Binary Data |
| tableKind |Integer 16 |

 **MS_TableConfig**

 ![][defining-core-data-tableconfig-entity]

| Attribute | Type |
| --- | --- |
| id |String |
| key |String |
| keyType |Integer 64 |
| table |String |
| value |String |

### Data table

**TodoItem**

| Attribute | Type | Note |
| --- | --- | --- |
| id | String, marked required |Primary key in remote store |
| complete | Boolean | To-do item field |
| text |String |To-do item field |
| createdAt | Date | (optional) Maps to **createdAt** system property |
| updatedAt | Date | (optional) Maps to **updatedAt** system property |
| version | String | (optional) Used to detect conflicts, maps to version |

## <a name="setup-sync"></a>Change the sync behavior of the app
In this section, you modify the app so that it does not sync on app start or when you insert and update items. It syncs only when the refresh gesture button is performed.

**Objective-C**:

1. In **QSTodoListViewController.m**, change the **viewDidLoad** method to remove the call to `[self refresh]` at the end of the method. Now the data is not synced with the server on app start. Instead, it's synced with the contents of the local store.
2. In **QSTodoService.m**, modify the definition of `addItem` so that it doesn't sync after the item is inserted. Remove the `self syncData` block and replace it with the following:

   ```objc
   if (completion != nil) {
       dispatch_async(dispatch_get_main_queue(), completion);
   }
   ```
3. Modify the definition of `completeItem` as mentioned previously. Remove the block for `self syncData` and replace it with the following:
   ```objc
   if (completion != nil) {
       dispatch_async(dispatch_get_main_queue(), completion);
   }
   ```

**Swift**:

In `viewDidLoad`, in **ToDoTableViewController.swift**, comment out the two lines shown here, to stop syncing on app start. At the time of this writing, the Swift Todo app does not update the service when someone adds or completes an item. It updates the service only on app start.

   ```swift
  self.refreshControl?.beginRefreshing()
  self.onRefresh(self.refreshControl)
```

## <a name="test-app"></a>Test the app
In this section, you connect to an invalid URL to simulate an offline scenario. When you add data items, they're held in the local Core Data store, but they're not synced with the mobile-app back end.

1. Change the mobile-app URL in **QSTodoService.m** to an invalid URL, and run the app again:

   **Objective-C**. In QSTodoService.m:
   ```objc
   self.client = [MSClient clientWithApplicationURLString:@"https://sitename.azurewebsites.net.fail"];
   ```
   **Swift**. In ToDoTableViewController.swift:
   ```swift
   let client = MSClient(applicationURLString: "https://sitename.azurewebsites.net.fail")
   ```
2. Add some to-do items. Quit the simulator (or forcibly close the app), and then restart it. Verify that your changes persist.

3. View the contents of the remote **TodoItem** table:
   * For a Node.js back end, go to the [Azure portal](https://portal.azure.com/) and, in your mobile-app back end, click **Easy Tables** > **TodoItem**.  
   * For a .NET back end, use either a SQL tool, such as SQL Server Management Studio, or a REST client, such as Fiddler or Postman.  

4. Verify that the new items have *not* been synced with the server.

5. Change the URL back to the correct one in **QSTodoService.m**, and rerun the app.

6. Perform the refresh gesture by pulling down the list of items.  
A progress spinner is displayed.

7. View the **TodoItem** data again. The new and changed to-do items should now be displayed.

## Summary
To support the offline sync feature, we used the `MSSyncTable` interface and initialized `MSClient.syncContext` with a local store. In this case, the local store was a Core Data-based database.

When you use a Core Data local store, you must define several tables with the [correct system properties](#review-core-data).

The normal create, read, update, and delete (CRUD) operations for mobile apps work as if the app is still connected, but all the operations occur against the local store.

When we synchronized the local store with the server, we used the **MSSyncTable.pullWithQuery** method.

## Additional resources
* [Offline Data Sync in Mobile Apps]
* [Cloud Cover: Offline Sync in Azure Mobile Services] \(The video is about Mobile Services, but Mobile Apps offline sync works in a similar way.\)

<!-- URLs. -->


[Create an iOS App]: app-service-mobile-ios-get-started.md
[Offline Data Sync in Mobile Apps]: app-service-mobile-offline-data-sync.md

[defining-core-data-tableoperationerrors-entity]: ./media/app-service-mobile-ios-get-started-offline-data/defining-core-data-tableoperationerrors-entity.png
[defining-core-data-tableoperations-entity]: ./media/app-service-mobile-ios-get-started-offline-data/defining-core-data-tableoperations-entity.png
[defining-core-data-tableconfig-entity]: ./media/app-service-mobile-ios-get-started-offline-data/defining-core-data-tableconfig-entity.png
[defining-core-data-todoitem-entity]: ./media/app-service-mobile-ios-get-started-offline-data/defining-core-data-todoitem-entity.png

[Cloud Cover: Offline Sync in Azure Mobile Services]: https://channel9.msdn.com/Shows/Cloud+Cover/Episode-155-Offline-Storage-with-Donna-Malayeri
[Azure Friday: Offline-enabled apps in Azure Mobile Services]: https://azure.microsoft.com/documentation/videos/azure-mobile-services-offline-enabled-apps-with-donna-malayeri/
