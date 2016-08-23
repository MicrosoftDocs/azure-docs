<properties
	pageTitle="Get Started with Offline Data Sync in Mobile Services (iOS) | Microsoft Azure"
	description="Learn how to use Azure Mobile Services to cache and sync offline data in your iOS application"
	documentationCenter="ios"
	authors="krisragh"
	manager="erikre"
	editor=""
	services="mobile-services"/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-ios"
	ms.devlang="objective-c"
	ms.topic="article"
	ms.date="07/21/2016"
	ms.author="krisragh;donnam"/>

# Get Started with Offline Data Sync in Mobile Services

[AZURE.INCLUDE [mobile-services-selector-offline](../../includes/mobile-services-selector-offline.md)]

&nbsp;

[AZURE.INCLUDE [mobile-service-note-mobile-apps](../../includes/mobile-services-note-mobile-apps.md)]
> For the equivalent Mobile Apps version of this topic, see [Enable offline sync for your iOS mobile app](../app-service-mobile/app-service-mobile-ios-get-started-offline-data.md).

Offline sync allows you to view, add, or modify data in a mobile app even when there is no network connection. In this tutorial, you'll learn how your app can automatically store changes in a local offline database and sync those changes whenever it's back online.

Offline sync has several advantages:

* Improves app responsiveness by caching server data locally on device
* Makes apps resilient against intermittent network connectivity
* Allows you to create and modify data even with little or no connectivity
* Syncs data across multiple devices
* Detects conflicts when same record is modified by two devices

> [AZURE.NOTE] To complete this tutorial, you need an Azure account. If you don't have an account, you can sign up for an Azure trial and get [free mobile services that you can keep using even after your trial ends](https://azure.microsoft.com/pricing/details/mobile-services/). For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=AE564AB28 target="_blank").

This tutorial is based on the [Mobile Services Quick Start tutorial], which you must complete first. Let's first review the code related to offline sync already in the Quick Start.

## <a name="review-sync"></a>Review Mobile Services Sync Code

Azure Mobile Services offline sync allows end users to interact with a local database when the network is not accessible. To use these features in your app, you initialize the sync context of `MSClient` and reference a local store. Then reference your table through the `MSSyncTable` interface.

* In **QSTodoService.m**, notice the type of member `syncTable` is `MSSyncTable`. Offline sync uses this instead of `MSTable`. When a sync table is used, all operations go to the local store and are synchronized with the remote service only with explicit push and pull operations.

```
		@property (nonatomic, strong)   MSSyncTable *syncTable;
```

To get a reference to a sync table, use the method `syncTableWithName`. To remove offline sync functionality, use `tableWithName` instead.

* In **QSTodoService.m**, before table operations are performed, the local store is initialized in `QSTodoService.init`:

```
		MSCoreDataStore *store = [[MSCoreDataStore alloc] initWithManagedObjectContext:context];
		self.client.syncContext = [[MSSyncContext alloc] initWithDelegate:nil dataSource:store callback:nil];
```

This creates a local store using the `MSCoreDataStore` interface. You may provide a different local store by implementing the `MSSyncContextDataSource` protocol.

The first parameter of `initWithDelegate` specifies a conflict handler, but since we've passed `nil`, we get the default conflict handler which fails on any conflict. For details on how to implement a custom conflict handler, see [Handling Conflicts with Offline Support for Mobile Services].

* In **QSTodoService.m**, `syncData` first pushes new changes, and then calls `pullData` to get data from the remote service.     In `syncData`, we first call `pushWithCompletion` on the sync context. This method is a member of `MSSyncContext` -- rather than the sync table itself -- because it pushes changes across all tables. Only records that are modified in some way locally -- through creation, update, or delete operations -- are sent to the server. At the end of `syncData`, we call the helper `pullData`.

In this example, the push operation is not strictly necessary. If there are changes pending in the sync context for the table that is doing a push operation, pull always issues a push first. However, if you have more than one sync table, call push explicitly to have consistency across tables.

```
      -(void)syncData:(QSCompletionBlock)completion
      {
          // push all changes in the sync context, then pull new data
          [self.client.syncContext pushWithCompletion:^(NSError *error) {
              [self logErrorIfNotNil:error];
              [self pullData:completion];
          }];
      }

```

* Next in **QSTodoService.m**, `pullData` gets new data that matches a query. `pullData` calls `MSSyncTable.pullWithQuery` to retrieve remote data and store it locally. `pullWithQuery` also allows you to specify a query to filter the records you wish to retrieve. In this example, the query just retrieves all records in the remote `TodoItem` table.

The second parameter to `pullWithQuery` is a query ID for _incremental sync_. Incremental sync retrieves only those records modified since the last sync, using the record's `UpdatedAt` timestamp, called `ms_updatedAt` in the local store. The query ID is descriptive string that is unique for each logical query in your app. To opt-out of incremental sync, pass `nil` as the query ID. This is inefficient since it will retrieve all records on every pull operation.

```
      -(void)pullData:(QSCompletionBlock)completion
      {
          MSQuery *query = [self.syncTable query];

          // Pulls data from the remote server into the local table.
          // We're pulling all items and filtering in the view
          // query ID is used for incremental sync
          [self.syncTable pullWithQuery:query queryId:@"allTodoItems" completion:^(NSError *error) {
              [self logErrorIfNotNil:error];

              // Let the caller know that we have finished
              if (completion != nil) {
                  dispatch_async(dispatch_get_main_queue(), completion);
              }
          }];
      }
```


>[AZURE.NOTE] To remove records from the device local store when they have been deleted in your mobile service database, enable [Soft Delete]. Otherwise, your app should periodically call `MSSyncTable.purgeWithQuery` to purge the local store.


* In **QSTodoService.m**, the methods `addItem` and `completeItem` invoke `syncData` after modifying data. In **QSTodoListViewController.m**, the method `refresh` also invokes `syncData` so that the UI displays the latest data on every refresh and at launch (`init` calls `refresh`.)

Because the app calls `syncData` whenever you modify data, the app assumes you are online whenever you edit data in the app.

## <a name="review-core-data"></a>Review Core Data Model

When using the Core Data offline store, you need to define particular tables and fields in your data model. The sample app already includes a data model with the right format. In this section we walk through these tables and how they are used.

- Open **QSDataModel.xcdatamodeld**. There are four tables defined, three used by the SDK and one for the todo items themselves:

      * MS_TableOperations: For tracking items to be synchronized with server
      * MS_TableOperationErrors: For tracking errors that happen during offline sync
      * MS_TableConfig: For tracking last updated time for last sync operation for all pull operations
      * TodoItem: For storing todo items. The system columns **ms_createdAt**, **ms_updatedAt**, and **ms_version** are optional system properties.

>[AZURE.NOTE] The Mobile Services SDK reserves column names that begin with "**`ms_`**". Do not use this prefix on anything other than system columns. Otherwise, your column names will be modified when using the remote service.

- When using the offline sync feature, you must define the system tables as shown below.

    ### System Tables

    #### MS_TableOperations

    | Attribute     |    Type     |
    |-------------- |   ------    |
    | id (required) | Integer 64  |
    | itemId        | String      |
    | properties    | Binary Data |
    | table         | String      |
    | tableKind     | Integer 16  |

    #### MS_TableOperationErrors

    | Attribute     |    Type     |
    |-------------- | ----------  |
    | id (required) | String      |
    | operationId   | Integer 64  |
    | properties    | Binary Data |
    | tableKind     | Integer 16  |

    #### MS_TableConfig


    | Attribute     |    Type     |
    |-------------- | ----------  |
    | id (required) | String      |
    | key           | String      |
    | keyType       | Integer 64  |
    | table         | String      |
    | value         | String      |

    ### Data Table

    #### TodoItem

    | Attribute     |  Type   | Note                                                   |
    |-------------- |  ------ | -------------------------------------------------------|
    | id (required) | String  | primary key in remote store (required)                 |
    | complete      | Boolean | todo item field                                        |
    | text          | String  | todo item field                                        |
    | ms_createdAt  | Date    | (optional) maps to __createdAt system property         |
    | ms_updatedAt  | Date    | (optional) maps to __updatedAt system property         |
    | ms_version    | String  | (optional) used to detect conflicts, maps to __version |



## <a name="setup-sync"></a>Change Sync Behavior of App

In this section, you modify the app so that it does not sync on app start, or when inserting and updating items, but only when the refresh gesture  is performed.

* In **QSTodoListViewController.m**, change `viewDidLoad` to remove the call to `[self refresh]` at the end of the method. Now, the data will not be synced with the server on app start, but instead will be only stored locally.

* In **QSTodoService.m**, modify `addItem` so that it doesn't sync after the item is inserted. Remove the `self syncData` block and replace it with the following:

```
        if (completion != nil) {
            dispatch_async(dispatch_get_main_queue(), completion);
        }
```

* Similarly, again in **QSTodoService.m**, in `completeItem`, remove the block for `self syncData` and replace with the following:

```
        if (completion != nil) {
            dispatch_async(dispatch_get_main_queue(), completion);
        }
```

## <a name="test-app"></a>Test App

In this section, you will turn of Wi-Fi in the simulator to create an offline scenario. When you add data items, they will be held in the local Core Data store, but not synced to the mobile service.

1. Turn off the internet connection on your Mac. Turning off WiFi in just iOS simulator may not have an effect, since the simulator may still use the host Mac's internet connection, so turn off internet for the computer itself. This simulates an offline scenario.

2. Add some todo items or complete some items. Quit the simulator (or forcibly close the app) and restart. Verify that your changes have been persisted. Notice that the data items are still displayed because they are held in the local Core Data store.

3. View the contents of the remote TodoItem table. Verify that the new items have _not_ been synced to the server.

   - For the JavaScript backend, go to the [Azure classic portal](http://manage.windowsazure.com), and click the Data tab to view the contents of the `TodoItem` table.
   - For the .NET backend, view the table contents either with a SQL tool such as SQL Server Management Studio, or a REST client such as Fiddler or Postman.

4. Turn on Wi-Fi in the iOS simulator. Next, perform the refresh gesture by pulling down the list of items. You will see a progress spinner and the text "Syncing...".

5. View the TodoItem data again. The new and changed TodoItems should now appear.

## Summary

In order to support the offline features of mobile services, you used the `MSSyncTable` interface and initialized `MSClient.syncContext` with a local store. In this case the local store was a Core Data-based database.

When using a Core Data local store, you define several tables with the [correct system properties][Review the Core Data model]. The normal  operations for mobile services work as if the app is still connected but all the operations occur against the local store.

To synchronize the local store with the server, you used `MSSyncTable.pullWithQuery` and `MSClient.syncContext.pushWithCompletion`:

		* To push changes to the server, you called `pushWithCompletion`. This method is in `MSSyncContext` instead of the sync table because it will push changes across all tables. Only records that are modified in some way locally (through CUD operations) are be sent to the server.

		* To pull data from a table on the server to the app, you called `MSSyncTable.pullWithQuery`. A pull always issues a push first. This is to ensure all tables in the local store along with relationships remain consistent. `pullWithQuery` can also be used to filter the data that is stored on the client, by customizing the `query` parameter.

## Next Steps

* [Handling Conflicts with Offline Support for Mobile Services]

* [Using Soft Delete in Mobile Services][Soft Delete]

## Additional Resources

* [Cloud Cover: Offline Sync in Azure Mobile Services]

* [Azure Friday: Offline-enabled apps in Azure Mobile Services] \(note: demos are for Windows, but feature discussion applies to all platforms\)

<!-- URLs. -->

[Get the sample app]: #get-app
[Review the Core Data model]: #review-core-data
[Review the Mobile Services sync code]: #review-sync
[Change the sync behavior of the app]: #setup-sync
[Test the app]: #test-app

[core-data-1]: ./media/mobile-services-ios-get-started-offline-data/core-data-1.png
[core-data-2]: ./media/mobile-services-ios-get-started-offline-data/core-data-2.png
[core-data-3]: ./media/mobile-services-ios-get-started-offline-data/core-data-3.png
[defining-core-data-main-screen]: ./media/mobile-services-ios-get-started-offline-data/defining-core-data-main-screen.png
[defining-core-data-model-editor]: ./media/mobile-services-ios-get-started-offline-data/defining-core-data-model-editor.png
[defining-core-data-tableoperationerrors-entity]: ./media/mobile-services-ios-get-started-offline-data/defining-core-data-tableoperationerrors-entity.png
[defining-core-data-tableoperations-entity]: ./media/mobile-services-ios-get-started-offline-data/defining-core-data-tableoperations-entity.png
[defining-core-data-tableconfig-entity]: ./media/mobile-services-ios-get-started-offline-data/defining-core-data-tableconfig-entity.png
[defining-core-data-todoitem-entity]: ./media/mobile-services-ios-get-started-offline-data/defining-core-data-todoitem-entity.png
[update-framework-1]: ./media/mobile-services-ios-get-started-offline-data/update-framework-1.png
[update-framework-2]: ./media/mobile-services-ios-get-started-offline-data/update-framework-2.png

[Core Data Model Editor Help]: https://developer.apple.com/library/mac/recipes/xcode_help-core_data_modeling_tool/Articles/about_cd_modeling_tool.html
[Creating an Outlet Connection]: https://developer.apple.com/library/mac/recipes/xcode_help-interface_builder/articles-connections_bindings/CreatingOutlet.html
[Build a User Interface]: https://developer.apple.com/library/mac/documentation/ToolsLanguages/Conceptual/Xcode_Overview/Edit_User_Interfaces/edit_user_interface.html
[Adding a Segue Between Scenes in a Storyboard]: https://developer.apple.com/library/ios/recipes/xcode_help-IB_storyboard/chapters/StoryboardSegue.html#//apple_ref/doc/uid/TP40014225-CH25-SW1
[Adding a Scene to a Storyboard]: https://developer.apple.com/library/ios/recipes/xcode_help-IB_storyboard/chapters/StoryboardScene.html

[Core Data]: https://developer.apple.com/library/ios/documentation/Cocoa/Conceptual/CoreData/cdProgrammingGuide.html
[Download the preview SDK here]: http://aka.ms/Gc6fex
[How to use the Mobile Services client library for iOS]: mobile-services-ios-how-to-use-client-library.md
[Offline iOS Sample]: https://github.com/Azure/mobile-services-samples/tree/master/TodoOffline/iOS/blog20140611
[Mobile Services sample repository on GitHub]: https://github.com/Azure/mobile-services-samples


[Get started with Mobile Services]: mobile-services-ios-get-started.md
[Handling Conflicts with Offline Support for Mobile Services]:  mobile-services-ios-handling-conflicts-offline-data.md
[Soft Delete]: mobile-services-using-soft-delete.md

[Cloud Cover: Offline Sync in Azure Mobile Services]: http://channel9.msdn.com/Shows/Cloud+Cover/Episode-155-Offline-Storage-with-Donna-Malayeri
[Azure Friday: Offline-enabled apps in Azure Mobile Services]: http://azure.microsoft.com/documentation/videos/azure-mobile-services-offline-enabled-apps-with-donna-malayeri/

[Mobile Services Quick Start tutorial]: mobile-services-ios-get-started.md
