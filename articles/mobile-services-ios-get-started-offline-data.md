<properties urlDisplayName="Using Offline Data" pageTitle="Using Offline data sync in Mobile Services (iOS) | Mobile Dev Center" metaKeywords="" description="Learn how to use Azure Mobile Services to cache and sync offline data in your iOS application" metaCanonical="" disqusComments="1" umbracoNaviHide="1" documentationCenter="ios" title="" authors="krisragh" manager="dwrede" editor="" services=""/>

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-ios" ms.devlang="objective-c" ms.topic="article" ms.date="10/10/2014" ms.author="krisragh" />

# Get started with offline data sync in Mobile Services


[WACOM.INCLUDE [mobile-services-selector-offline](../includes/mobile-services-selector-offline.md)]


This tutorial covers the offline sync feature of Mobile Services on iOS, which allows developers to write apps that are usable even when the end user has no network access.

Offline sync has several potential uses:

* Improve app responsiveness by caching server data locally on the device
* Make apps resilient against intermittent network connectivity
* Allow end-users to create and modify data even when there is no network access, supporting scenarios with little or no connectivity
* Sync data across multiple devices and detect conflicts when the same record is modified by two devices

This tutorial will show how to update the app from [Get Started with Mobile Services] tutorial to support the offline features of Azure Mobile Services. Then you will add data in a disconnected offline scenario, sync those items to the online database, and then log in to the Azure Management Portal to view changes to data made when running the app.

>[AZURE.NOTE] To complete this tutorial, you need a Azure account. If you don't have an account, you can sign up for an Azure trial and get up to 10 free mobile services that you can keep using even after your trial ends. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=AE564AB28" target="_blank">Azure Free Trial</a>.

This tutorial is intended to help you better understand how Mobile Services enables you to use Azure to store and retrieve data in a Windows Store app. As such, this topic walks you through many of the steps that are completed for you in the Mobile Services quickstart. If this is your first experience with Mobile Services, consider first completing the tutorial [Get Started with Mobile Services].

>[AZURE.NOTE] You can skip these sections and jump to downloading a version of the Getting Started project that already has offline support and everything described in this topic.  To download a project with offline support enabled, see [Getting Started Offline iOS Sample].


This tutorial walks you through these basic steps:

1. [Get the Sample Quickstart App]
2. [Download the Preview SDK and Update the Framework]
3. [Set Up Core Data]
4. [Defining the Core Data Model]
5. [Initializing and Using Sync Table and Sync Context]
6. [Test the App]

## <a name="get-app"></a>Get the Sample Quickstart App

Follow the instructions at [Get started with Mobile Services] and download the quickstart project.

## <a name="update-app"></a>Download the preview SDK and update the framework

1. To add offline support to our application, let's get a version of the Mobile Services iOS SDK which supports offline sync. Since we're launching it as a preview feature, it is not yet in the officially downloadable SDK. [Download the preview SDK here].

2. Then, remove the existing **WindowsAzureMobileServices.framework** reference from the project in Xcode by selecting it, clicking the **Edit** menu, selecting "Move to Trash" to really delete the files.

      ![][update-framework-1]

3. Unzip the contents of the new preview SDK, and in place of the old SDK, drag and drop over the new **WindowsAzureMobileServices.framework** SDK. Make sure the "Copy items into destination group's folder (if needed)" is selected.

      ![][update-framework-2]


## <a name="setup-core-data"></a>Set Up Core Data

1. The iOS Mobile Services SDK lets you use any persistent store as long as it complies with the **MSSyncContextDataSource** protocol. Included in the SDK is a data source implementing this protocol based on [Core Data].

2. Since the app uses Core Data, navigate to **Targets** --> **Build Phases**, and under **Link Binary with Libraries**, add **CoreData.framework**.

      ![][core-data-1]

      ![][core-data-2]

3. We are adding Core Data to an existing project in Xcode that does not already support Core Data. As such, we need to add additional boilerplate code to various parts of the project. First add the following code in **QSAppDelegate.h**:

        #import <UIKit/UIKit.h> 
        #import <CoreData/CoreData.h> 

        @interface QSAppDelegate : UIResponder <UIApplicationDelegate> 

        @property (strong, nonatomic) UIWindow *window; 

        @property (readonly, strong, nonatomic) NSManagedObjectContext *managedObjectContext; 
        @property (readonly, strong, nonatomic) NSManagedObjectModel *managedObjectModel; 
        @property (readonly, strong, nonatomic) NSPersistentStoreCoordinator *persistentStoreCoordinator; 

        - (void)saveContext; 
        - (NSURL *)applicationDocumentsDirectory; 

        @end

4. Next, replace the contents of **QSAppDelegate.m** with the following code. This is almost the same code that you get when you create a new application in Xcode and select the "Use Core Data" checkbox, except that you're using a private queue concurrency type when initializing **_managedObjectContext**. With this change, you're almost ready to use Core Data, but you're not doing anything with it yet.

        #import "QSAppDelegate.h"

        @implementation QSAppDelegate

        @synthesize managedObjectContext = _managedObjectContext;
        @synthesize managedObjectModel = _managedObjectModel;
        @synthesize persistentStoreCoordinator = _persistentStoreCoordinator;

        - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
        {
            return YES;
        }

        - (void)saveContext
        {
            NSError *error = nil;
            NSManagedObjectContext *managedObjectContext = self.managedObjectContext;
            if (managedObjectContext != nil) {
                if ([managedObjectContext hasChanges] && ![managedObjectContext save:&error]) {
                    // Replace this implementation with code to handle the error appropriately.
                    // abort() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                    NSLog(@"Unresolved error %@, %@", error, [error userInfo]);
                    abort();
                }
            }
        }

        #pragma mark - Core Data stack

        // Returns the managed object context for the application.
        // If the context doesn't already exist, it is created and bound to the persistent store coordinator for the application.
        - (NSManagedObjectContext *)managedObjectContext
        {
            if (_managedObjectContext != nil) {
                return _managedObjectContext;
            }

            NSPersistentStoreCoordinator *coordinator = [self persistentStoreCoordinator];
            if (coordinator != nil) {
                _managedObjectContext = [[NSManagedObjectContext alloc] initWithConcurrencyType:NSPrivateQueueConcurrencyType];
                [_managedObjectContext setPersistentStoreCoordinator:coordinator];
            }
            return _managedObjectContext;
        }

        // Returns the managed object model for the application.
        // If the model doesn't already exist, it is created from the application's model.
        - (NSManagedObjectModel *)managedObjectModel
        {
            if (_managedObjectModel != nil) {
                return _managedObjectModel;
            }
            NSURL *modelURL = [[NSBundle mainBundle] URLForResource:@"QSTodoDataModel" withExtension:@"momd"];
            _managedObjectModel = [[NSManagedObjectModel alloc] initWithContentsOfURL:modelURL];
            return _managedObjectModel;
        }

        // Returns the persistent store coordinator for the application.
        // If the coordinator doesn't already exist, it is created and the application's store added to it.
        - (NSPersistentStoreCoordinator *)persistentStoreCoordinator
        {
            if (_persistentStoreCoordinator != nil) {
                return _persistentStoreCoordinator;
            }

            NSURL *storeURL = [[self applicationDocumentsDirectory] URLByAppendingPathComponent:@"qstodoitem.sqlite"];

            NSError *error = nil;
            _persistentStoreCoordinator = [[NSPersistentStoreCoordinator alloc] initWithManagedObjectModel:[self managedObjectModel]];
            if (![_persistentStoreCoordinator addPersistentStoreWithType:NSSQLiteStoreType configuration:nil URL:storeURL options:nil error:&error]) {
                /*
                 Replace this implementation with code to handle the error appropriately.

                 abort() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.

                 Typical reasons for an error here include:
                 * The persistent store is not accessible;
                 * The schema for the persistent store is incompatible with current managed object model.
                 Check the error message to determine what the actual problem was.

                 If the persistent store is not accessible, there is typically something wrong with the file path. Often, a file URL is pointing into the application's resources directory instead of a writeable directory.

                 If you encounter schema incompatibility errors during development, you can reduce their frequency by:
                 * Simply deleting the existing store:
                 [[NSFileManager defaultManager] removeItemAtURL:storeURL error:nil]

                 * Performing automatic lightweight migration by passing the following dictionary as the options parameter:
                 @{NSMigratePersistentStoresAutomaticallyOption:@YES, NSInferMappingModelAutomaticallyOption:@YES}

                 Lightweight migration will only work for a limited set of schema changes; consult "Core Data Model Versioning and Data Migration Programming Guide" for details.

                 */

                NSLog(@"Unresolved error %@, %@", error, [error userInfo]);
                abort();
            }

            return _persistentStoreCoordinator;
        }

        #pragma mark - Application's Documents directory

        // Returns the URL to the application's Documents directory.
        - (NSURL *)applicationDocumentsDirectory
        {
            return [[[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] lastObject];
        }

        @end

## <a name="defining-core-data"></a>Defining the Core Data Model

1. Let's continue to set up the application with Core Data by defining the data model. We won't start using this data model just. First, let's define the Core Data model or schema. To get started, click **File** -> **New File** and select **Data Model** in the **Core Data** section. When prompted for a file name, use **QSTodoDataModel.xcdatamodeld**.

      ![][defining-core-data-main-screen]

2. Next, let's define the actual entities (tables) we need. We'll create three tables (entities) using the Core Data model editor. To learn more, see [Core Data Model Editor Help].

  * TodoItem: For storing the items themselves
  * MS_TableOperations: For tracking the items that need to be synchronized with the server (necessary for offline feature to work)
  * MS_TableOperationErrors: For tracking any errors that happen during offline synchronization (necessary for offline feature to work)

      ![][defining-core-data-model-editor]

3. Define the three entities as shown below. Save the model, and build the project to make sure that everything is fine. Now we have finished setting up the application to work with Core Data, but the app is not using it yet.

      ![][defining-core-data-todoitem-entity]

      ![][defining-core-data-tableoperations-entity]

      ![][defining-core-data-tableoperationerrors-entity]


    **TodoItem**

    | Attribute  |  Type   |
    |----------- |  ------ |
    | id         | String  |
    | complete   | Boolean |
    | text       | String  |
    | ms_version | String  |

    **MS_TableOperations**

    | Attribute  |    Type     |
    |----------- |   ------    |
    | id         | Integer 64  |
    | properties | Binary Data |
    | itemId     | String      |
    | table      | String      |

    **MS_TableOperationErrors**

    | Attribute  |    Type     |
    |----------- |   ------    |
    | id         | String      |
    | properties | Binary Data |

## <a name="setup-sync"></a> Initializing and Using Sync Table and Sync Context

1. To start caching data offline, let's replace usage of **MSTable** with **MSSyncTable** to access the mobile service. Unlike a regular **MSTable**, a sync table is like a local table that adds the ability to push changes made locally to a remote table and to pull those changes locally. 

    In **QSTodoService.m**, remove the definition of the **table** property:

        @property (nonatomic, strong)   MSTable *table;

    Add a new line to define the **syncTable** property:

        @property (nonatomic, strong)   MSSyncTable *syncTable;

2. Add the following import statement at the top of **QSTodoService.m**:

        #import "QSAppDelegate.h"

3. In **QSTodoService.m**, remove the following two lines in **init**:

        // Create an MSTable instance to allow us to work with the TodoItem table
        self.table = [_client tableWithName:@"TodoItem"];

    Instead, add these two new lines in its place:

        // Create an MSSyncTable instance to allow us to work with the TodoItem table
        self.syncTable = [self.client syncTableWithName:@"TodoItem"];

4. Next, again in **QSTodoService.m**, let's initialize the synchronization context in the **MSClient** with the Core Data-based data store implementation above. The context is responsible for tracking which items have been changed locally, and sending those to the server when a push operation is started. To initialize the context we need a data source (the **MSCoreDataStore** implementation of the protocol) and an optional **MSSyncContextDelegate** implementation. Insert these lines right above the two lines you inserted above:

        QSAppDelegate *delegate = (QSAppDelegate *)[[UIApplication sharedApplication] delegate];
        NSManagedObjectContext *context = delegate.managedObjectContext;
        MSCoreDataStore *store = [[MSCoreDataStore alloc] initWithManagedObjectContext:context];

        self.client.syncContext = [[MSSyncContext alloc] initWithDelegate:nil dataSource:store callback:nil];

5. Next, let's update the operations in **QSTodoService.m** to use the sync table instead of the regular table. First, replace **refreshDataOnSuccess** with the following implementation. This retrieves data from the service, so let's update it to use a sync table, ask the sync table to pull only items that match our criteria, and start loading data from the local sync table into the **items** property of the service. With this code,  **refreshDataOnSuccess** pulls the data from the remote table into the local (sync) table. We should generally pull only a subset of the table so that we don't overload the client with information that it may not need.

    For this and the remaining operations further below, we wrap the calls to the completion blocks in a **dispatch_async** call to the main thread. When we initialize the sync context, we do not pass a callback parameter, so the framework creates a default serial queue that dispatches the results of all syncTable operations into a background thread. When modifying UI components, we need to dispatch the code back to the UI thread.

          -(void) refreshDataOnSuccess:(QSCompletionBlock)completion
          {
              NSPredicate * predicate = [NSPredicate predicateWithFormat:@"complete == NO"];
              MSQuery *query = [self.syncTable queryWithPredicate:predicate];

              [query orderByAscending:@"text"];
              [query readWithCompletion:^(MSQueryResult *result, NSError *error) {
                  [self logErrorIfNotNil:error];

                  self.items = [result.items mutableCopy];

                  // Let the caller know that we finished
                  dispatch_async(dispatch_get_main_queue(), ^{
                      completion();
                  });
              }];
          }

6. Next, replace **addItem** in **QSTodoService.m** as follows. With this change, you're queuing the operation so that you push the changes to the remote service and make it visible to everyone:

        -(void)addItem:(NSDictionary *)item completion:(QSCompletionWithIndexBlock)completion
        {
            // Insert the item into the TodoItem table and add to the items array on completion
            [self.syncTable insert:item completion:^(NSDictionary *result, NSError *error)
             {
                 [self logErrorIfNotNil:error];

                 NSUInteger index = [items count];
                 [(NSMutableArray *)items insertObject:result atIndex:index];

                 // Let the caller know that we finished
                 dispatch_async(dispatch_get_main_queue(), ^{
                     completion(index);
                 });
             }];
        }

7. Update **completeItem** in **QSTodoService.m** as follows. Unlike in **MSTable**, the completion block of the **update** operation for **MSSyncTable** does not have an updated item. With **MSTable**, the server modifies the item being updated, and that modification is reflected on the client. With **MSSyncTable**, the updated items are not modified and the completion block doesn't have a parameter.

        -(void) completeItem:(NSDictionary *)item completion:(QSCompletionWithIndexBlock)completion
        {
            // Cast the public items property to the mutable type (it was created as mutable)
            NSMutableArray *mutableItems = (NSMutableArray *) items;

            // Set the item to be complete (we need a mutable copy)
            NSMutableDictionary *mutable = [item mutableCopy];
            [mutable setObject:@YES forKey:@"complete"];

            // Replace the original in the items array
            NSUInteger index = [items indexOfObjectIdenticalTo:item];
            [mutableItems replaceObjectAtIndex:index withObject:item];

            // Update the item in the TodoItem table and remove from the items array on completion
            [self.syncTable update:mutable completion:^(NSError *error) {

                [self logErrorIfNotNil:error];

                NSUInteger index = [items indexOfObjectIdenticalTo:mutable];
                if (index != NSNotFound)
                {
                    [mutableItems removeObjectAtIndex:index];
                }

                // Let the caller know that we have finished
                dispatch_async(dispatch_get_main_queue(), ^{
                    completion(index);
                });

            }];
        }

8. Add the following operation declaration of **syncData** to **QSTodoService.h**:

        - (void)syncData:(QSCompletionBlock)completion;

     We're adding this operation to update the sync table with remote changes. Note that we need to pull *all* todo items (not just ones that aren't complete), because the app may have items locally that have been marked complete. If we filtered only non-completed items, then there could be todo items in the UI that have actually been set as completed on the server.

     Add the corresponding implementation of **syncData** to **QSTodoService.m**:

            -(void)syncData:(QSCompletionBlock)completion
            {
                MSQuery *query = [self.syncTable query];

                // Pulls data from the remote server into the local table.
                // We're pulling all items and filtering in refreshDataOnSuccess
                [self.syncTable pullWithQuery:query completion:^(NSError *error) {
                    [self logErrorIfNotNil:error];
                    [self refreshDataOnSuccess:completion];
                }];
            }

9. Back in **QSTodoListViewController.m**, change the implementation of **refresh** to call **syncData** instead of **refreshDataOnSuccess**:

        -(void) refresh
        {
            [self.refreshControl beginRefreshing];
            [self.todoService syncData:^
             {
                  [self.refreshControl endRefreshing];
                  [self.tableView reloadData];
             }];
        }

10. Again in **QSTodoListViewController.m**, replace the call to **[self refresh]** at the end of the **viewDidLoad** operation with the following code:

        // load the local data, but don't pull from server
        [self.todoService refreshDataOnSuccess:^
         {
             [self.refreshControl endRefreshing];
             [self.tableView reloadData];
         }];

11. Now, let's really test the app offline. Add a few items to the app, then visit the Azure Management Portal and look at the **Data** tab for your app. You'll see that no items are added yet.

12. Next, perform the refresh gesture on the app by dragging it from the top. Then visit the Azure Management Portal again and look at the **Data** tab again. You'll see the data saved in the cloud now. You can also close the app after adding an item (or after editing one, if the app has the functionality enabled to edit items.) When the app is relaunched, it'll sync with the server and save the changes.

13. When the client performs some changes in the items locally, those changes are stored in the sync context to be sent to the server. A *push* operation sends the tracked changes to the remote server, but here, we have no push calls to the serve. However, *before a pull is executed, any pending operations are generally pushed to the server*, so a push is still happening automatically to prevent conflicts. This is why there are no explicit calls to *push* in this app.

## <a name="test-app"></a>Test the App

Finally, let's test the application offline. Add a few items in the app. Then go to the portal and browse the data (or use a networking tool such as PostMan or Fiddler to query the table directly).

You'll see that the items have not been added to the service yet. Now perform the refresh gesture in the app by dragging it from the top. You'll see that the data has been saved in the cloud now. You can even close the app after adding some items. When you launch the app again it will sync with the server and your changes are saved.

## Next Steps

* [Handling conflicts with offline support for Mobile Services]

<!-- URLs. -->

[Get the Sample Quickstart App]: #get-app
[Download the Preview SDK and Update the Framework]: #update-app
[Set Up Core Data]: #setup-core-data
[Defining the Core Data Model]: #defining-core-data
[Initializing and Using Sync Table and Sync Context]: #setup-sync
[Test the App]: #test-app

[core-data-1]: ./media/mobile-services-ios-get-started-offline-data/core-data-1.png
[core-data-2]: ./media/mobile-services-ios-get-started-offline-data/core-data-2.png
[core-data-3]: ./media/mobile-services-ios-get-started-offline-data/core-data-3.png
[defining-core-data-main-screen]: ./media/mobile-services-ios-get-started-offline-data/defining-core-data-main-screen.png
[defining-core-data-model-editor]: ./media/mobile-services-ios-get-started-offline-data/defining-core-data-model-editor.png
[defining-core-data-tableoperationerrors-entity]: ./media/mobile-services-ios-get-started-offline-data/defining-core-data-tableoperationerrors-entity.png
[defining-core-data-tableoperations-entity]: ./media/mobile-services-ios-get-started-offline-data/defining-core-data-tableoperations-entity.png
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
[How to use the Mobile Services client library for iOS]: /en-us/documentation/articles/mobile-services-ios-how-to-use-client-library/
[Getting Started Offline iOS Sample]: https://github.com/Azure/mobile-services-samples/tree/master/TodoOffline/iOS/blog20140611


[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-ios-get-started/
[Get started with data]: /en-us/documentation/articles/mobile-services-ios-get-started-data/
[Handling conflicts with offline support for Mobile Services]: /en-us/documentation/articles/mobile-services-ios-handling-conflicts-offline-data/
