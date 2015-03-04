<properties 
	pageTitle="Build Realtime Apps with Pusher (iOS) - Mobile Services" 
	description="Learn how to use Pusher to send notifications to your Azure Media Services app on iOS." 
	services="mobile-services" 
	documentationCenter="ios" 
	authors="lindydonna" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="" 
	ms.devlang="objective-c" 
	ms.topic="article" 
	ms.date="10/10/2014" 
	ms.author="donnam"/>


# Build Real-time Apps with Mobile Services and Pusher
<div class="dev-center-tutorial-selector sublanding">
	<a href="" title="iOS" class="current">iOS</a>
</div>

This topic shows you how can add real-time functionality to your Azure Mobile Services-based app. When completed, your TodoList data is synchronized, in real-time, across all running instances of your app.

The [Push Notifications to Users][] tutorial shows you how to use push notifications to inform users of new items in the Todo list. Push notifications are a great way to show occasional changes. However, sometimes an app needs frequent real-time notifications. Real-time notifications can be added to your mobile service using the Pusher API. In this tutorial, we use Pusher with Mobile Services to keep a Todo list synchronized when changes are made in any running instance of the app.

Pusher is a cloud-based service that, like Mobile Services, makes building real-time apps incredibly easy. You can use Pusher to quickly build live polls, chat rooms, multi-player games, collaborative apps, to broadcast live data and content, and that's just the start! For more information, see [http://pusher.com](http://pusher.com).

This tutorial walks you through these basic steps to add realtime collaboration to the Todo list application:

1. [Create a Pusher account][]
2. [Update your app][]
3. [Install server scripts][]
4. [Test your app][]

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services][].

## <a name="sign-up"></a>Create a new Pusher account

[AZURE.INCLUDE [pusher-sign-up](../includes/pusher-sign-up.md)]

## <a name="update-app"></a>Update your app

Now that you have your Pusher account set up, the next step is to modify the iOS app code for the new functionality.

###Install the libPusher library

The [libPusher][] library lets you access Pusher from iOS.

1. Download the libPusher library [from here][libPusherDownload].

2. Create a group called _libPusher_ in your project.

3. In Finder, unzip the downloaded zip file, select the **libPusher-combined.a** and **/headers** folders, and drag these items into the **libPusher** group in your project.

4. Check **Copy items into destination group's folder**, then click **Finish**

	![][add-files-to-group]

   This copies the libPusher files into your project.

5. On the project root in the project explorer, click **Build Phases**, then click **Add Build Phase** and **Add Copy Files**.

6. Drag the **libPusher-combined.a** file from the project explorer into the new build phase.

7. Change the **Destination** to **Frameworks** and click **Copy only when installing**.

	![][add-build-phase]

8. Within the **Link Binary With Libraries** area, add the following libraries:

	- libicucore.dylib
	- CFNetwork.framework
	- Security.framework
	- SystemConfiguration.framework

9. Finally within **Build Settings**, locate the target build setting **Other Linker Flags** and add the **-all_load** flag.

	![][add-linker-flag]

	This shows the **-all_load** flag set for the Debug build target.

The library is now installed ready for use.

### Add code to the application

1. In Xcode, open the **QSTodoService.h** file and add the following method declarations:

        // Allows retrieval of items by id
        - (NSUInteger) getItemIndex:(NSDictionary *)item;

        // To be called when items are added by other users
        - (NSUInteger) itemAdded:(NSDictionary *)item;

        // To be called when items are completed by other users
        - (NSUInteger) itemCompleted:(NSDictionary *)item;

2. Replace the existing declarations of **addItem** and **completeItem** with the following:

		- (void) addItem:(NSDictionary *) item;
		- (void) completeItem: (NSDictionary *) item;

3. In **QSTodoService.m**, add the following code to implement the new methods:

        // Allows retrieval of items by id
		- (NSUInteger) getItemIndex:(NSDictionary *)item
		{
		    NSInteger itemId = [[item objectForKey: @"id"] integerValue];

		    return [items indexOfObjectPassingTest:^BOOL(id currItem, NSUInteger idx, BOOL *stop)
                 {
                     return ([[currItem objectForKey: @"id"] integerValue] == itemId);
                 }];
		}

        // To be called when items are added by other users
        -(NSUInteger) itemAdded:(NSDictionary *)item
		{
		    NSUInteger index = [self getItemIndex:item];

		    // Only complete action if item not already in list
		    if(index == NSNotFound)
		    {
        		NSUInteger newIndex = [items count];
		        [(NSMutableArray *)items insertObject:item atIndex:newIndex];
		        return newIndex;
		    }
		    else
        		return -1;
		}

        // To be called when items are completed by other users
		- (NSUInteger) itemCompleted:(NSDictionary *)item
		{
		    NSUInteger index = [self getItemIndex:item];

		    // Only complete action if item exists in items list
		    if(index != NSNotFound)
		    {
		        NSMutableArray *mutableItems = (NSMutableArray *) items;
		        [mutableItems removeObjectAtIndex:index];
		    }
		    return index;
		}

	The QSTodoService now allows you to find items by **id** and add and complete items locally without sending explicit requests to the remote service.

4. Replace the existing **addItem** and **completeItem** methods with the following code:

		-(void) addItem:(NSDictionary *)item
		{
		    // Insert the item into the TodoItem table and add to the items array on completion
		    [self.table insert:item completion:^(NSDictionary *result, NSError *error) {
        		[self logErrorIfNotNil:error];
		    }];
		}

		-(void) completeItem:(NSDictionary *)item
		{
		    // Set the item to be complete (we need a mutable copy)
		    NSMutableDictionary *mutable = [item mutableCopy];
		    [mutable setObject:@(YES) forKey:@"complete"];

		    // Update the item in the TodoItem table and remove from the items array on completion
		    [self.table update:mutable completion:^(NSDictionary *item, NSError *error) {
		        [self logErrorIfNotNil:error];
		    }];
		}


	Note that items are now added and completed, along with updates to the UI, when events are received from Pusher instead of when the data table is updated.

5. In the **QSTodoListViewController.h** file, add the following import statements:

		#import "PTPusherDelegate.h"
		#import "PTPusher.h"
		#import "PTPusherEvent.h"
		#import "PTPusherChannel.h"

6. Modify the interface declaration to add **PTPusherDelegate** to look like the following:

		@interface QSTodoListViewController : UITableViewController<UITextFieldDelegate, PTPusherDelegate>

7. Add the following new property:

		@property (nonatomic, strong) PTPusher *pusher;

8. Add the following code that declares a new method:

		// Sets up the Pusher client
		- (void) setupPusher;

9. In **QSTodoListViewController.m**, add the following line under the other **@synthesise** lines to implement the new property:

		@synthesize pusher = _pusher;

10. Now add the following code to implement the new method:

		// Sets up the Pusher client
		- (void) setupPusher {

			// Create a Pusher client, using your Pusher app key as the credential
		    // TODO: Move Pusher app key to configuration file
		    self.pusher = [PTPusher pusherWithKey:@"**your_app_key**" delegate:self encrypted:NO];
		    self.pusher.reconnectAutomatically = YES;

    		// Subscribe to the 'todo-updates' channel
		    PTPusherChannel *todoChannel = [self.pusher subscribeToChannelNamed:@"todo-updates"];

    		// Bind to the 'todo-added' event
		    [todoChannel bindToEventNamed:@"todo-added" handleWithBlock:^(PTPusherEvent *channelEvent) {

		    	// Add item to the todo list
        		NSUInteger index = [self.todoService itemAdded:channelEvent.data];

        		// If the item was not already in the list, add the item to the UI
		        if(index != -1)
        		{
		            NSIndexPath *indexPath = [NSIndexPath indexPathForRow:index inSection:0];
        		    [self.tableView insertRowsAtIndexPaths:@[ indexPath ]
                                  withRowAnimation:UITableViewRowAnimationTop];
		        }
		    }];

    		// Bind to the 'todo-completed' event
		    [todoChannel bindToEventNamed:@"todo-completed" handleWithBlock:^(PTPusherEvent *channelEvent) {

		    	// Update the item to be completed
		        NSUInteger index = [self.todoService itemCompleted:channelEvent.data];

        		// As long as the item did exit in the list, update the UI
		        if(index != NSNotFound)
		        {
		            NSIndexPath *indexPath = [NSIndexPath indexPathForRow:index inSection:0];
        		    [self.tableView deleteRowsAtIndexPaths:@[ indexPath ]
                                  withRowAnimation:UITableViewRowAnimationTop];
		        }
		    }];
		}

11. Replace the `**your_app_key**` placeholder with the app_key value you copied from the Connection Info dialog earlier.

12. Replace the **onAdd** method with the following code:

		- (IBAction)onAdd:(id)sender
		{
		    if (itemText.text.length  == 0) {
        		return;
		    }

		    NSDictionary *item = @{ @"text" : itemText.text, @"complete" : @(NO) };
		    [self.todoService addItem:item];

		    itemText.text = @"";
		}

13. In the **QSTodoListViewController.m** file, locate the (void)viewDidLoad method and add a call to the **setupPusher** method so the first few lines are:

		- (void)viewDidLoad
		{
		    [super viewDidLoad];
		    [self setupPusher];

14. At the end of the **tableView:commitEditingStyle:forRowAtIndexPath** method, replace the call to **completeItem** with the following code:

		// Ask the todoService to set the item's complete value to YES
	    [self.todoService completeItem:item];

The app is now able to receive events from Pusher, and to update the local Todo list accordingly.



<h2><a name="install-scripts"></a>Install server scripts</h2>



All that remains is setting up your server scripts. We'll insert a script for when an item is inserted or updated into the TodoList table.



1. Log on to the [Azure Management Portal], click **Mobile Services**, and then click your mobile service.


2. In the Management Portal, click the **Data** tab and then click the **TodoItem** table.

	![][1]



3. In **TodoItem**, click the **Script** tab and select **Insert**.


	![][2]



	This displays the function that is invoked when an insert occurs in the **TodoItem** table.


4. Replace the insert function with the following code:


		var Pusher = require('pusher');

		function insert(item, user, request) {

			request.execute({
	    		success: function() {
			        // After the record has been inserted, trigger immediately to the client
	    		    request.respond();

			        // Publish event for all other active clients
			        publishItemCreatedEvent(item);
			    }
			});

			function publishItemCreatedEvent(item) {

				// Ideally these settings would be taken from config
			    var pusher = new Pusher({
				  appId: '**your_app_id**',
				  key: '**your_app_key**',
				  secret: '**your_app_secret**'
				});

				// Publish event on Pusher channel
			    pusher.trigger( 'todo-updates', 'todo-added', item );
			}
		}



5. Replace the placeholders in the above script with the values you copied from the Connection Info dialog earlier:

	- **`**your_app_id**`**: the app&#95;id value
	- **`**your_app_key**`**: the app&#95;key value
	- **`**your_app_key_secret**`**: the app&#95;key&#95;secret


6. Click the **Save** button. You have now configured a script to publish an event to Pusher every time a new item is inserted into the **TodoItem** table.


7. Select **Update** from the **Operation** dropdown.


8. Replace the update function with the following code:

		var Pusher = require('pusher');

		function update(item, user, request) {

			request.execute({
	    		success: function() {
			        // After the record has been updated, trigger immediately to the client
	    		    request.respond();

			        // Publish event for all other active clients
			        publishItemUpdatedEvent(item);
			    }
			});

			function publishItemUpdatedEvent(item) {

				// Ideally these settings would be taken from config
			    var pusher = new Pusher({
				  appId: '**your_app_id**',
				  key: '**your_app_key**',
				  secret: '**your_app_secret**'
				});

				// Publish event on Pusher channel
			    pusher.trigger( 'todo-updates', 'todo-completed', item );

			}
		}



9. Repeat step 5 for this script to replace the placeholders.


10. Click the **Save** button. You have now configured a script to publish an event to Pusher every time a new item is updated.



<h2><a name="test-app"></a>Test your app</h2>



To test the app you'll need to run two instances. You can run one instance on an iOS device and another in the iOS simulator.

1. Connect your iOS device, press the **Run** button (or the Command+R key) to start the app on the device, then stop debugging.

	You now have your app installed on your device.

2. Run the app on the iOS simulator, and at the same time start the app on your iOS device.

	Now you have two instances of the app running.

3. Add a new Todo item in one of the app instances.

	Verify that the added item appears in the other instance.

4. Check a Todo item to mark it complete in one app instance.

	Verify that the item disappears from the other instance.

Congratulations, you have successfully configured your mobile service app to synchronise across all clients in realtime.

## <a name="nextsteps"> </a>Next Steps

Now that you've seen how easy it is to use the Pusher service with Mobile Services, follow these links to learn more about Pusher.

-   Pusher API documentation: <http://pusher.com/docs>
-   Pusher tutorials: <http://pusher.com/tutorials>

To learn more about registering and using server scripts, see [Mobile Services server script reference].

<!-- Anchors. -->
[Create a Pusher account]: #sign-up
[Update your app]: #update-app
[Install server scripts]: #install-scripts
[Test your app]: #test-app

<!-- Images. -->
[1]: ./media/mobile-services-ios-build-realtime-apps-pusher/mobile-portal-data-tables.png
[2]: ./media/mobile-services-ios-build-realtime-apps-pusher/mobile-insert-script-push2.png

[add-files-to-group]: ./media/mobile-services-ios-build-realtime-apps-pusher/pusher-ios-add-files-to-group.png
[add-build-phase]: ./media/mobile-services-ios-build-realtime-apps-pusher/pusher-ios-add-build-phase.png
[add-linker-flag]: ./media/mobile-services-ios-build-realtime-apps-pusher/pusher-ios-add-linker-flag.png

<!-- URLs. -->
[Push Notifications to Users]: /develop/mobile/tutorials/push-notifications-to-users-ios
[Get started with Mobile Services]: /develop/mobile/tutorials/get-started
[libPusher]: http://go.microsoft.com/fwlink/p?LinkId=276999
[libPusherDownload]: http://go.microsoft.com/fwlink/p/?LinkId=276998


[Azure Management Portal]: https://manage.windowsazure.com/

[Mobile Services server script reference]: http://go.microsoft.com/fwlink/p/?LinkId=262293
