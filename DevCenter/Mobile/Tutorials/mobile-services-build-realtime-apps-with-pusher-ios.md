<div chunk="../chunks/article-left-menu-ios.md" />

# Build Realtime Apps with Mobile Services and Pusher

This topic shows you how can add realtime functionality to your mobile service application. When complete, mobile services will synchronise your todo list across all running instances of your app in realtime.

The [Push Notifications to Users][] tutorial showed you how to use push notifications to inform users of new items in the Todo list. In this tutorial we use Pusher so that the Todo list is kept in sync live with any changes applied immediately in-app. Push notifications are great to show occasional changes, however a service like Pusher is much better suited to deliver frequent and rapid changes.

Pusher is a cloud-based service that makes building realtime apps incredibly easy. You can use Pusher to quickly build live polls, chat rooms, multi-player games, collaborative apps, to broadcast live data and content, and that’s just the start! For more information, see [http://pusher.com][].

This tutorial walks you through these basic steps to add realtime collaboration to the Todo list application:

1. [Create a Pusher account][]
2. [Update your app][]
3. [Install server scripts][]
4. [Test your app][]

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services][].

<a name="sign-up"></a><h2>Create a new Pusher account</h2>

<div chunk="../../../Shared/Chunks/pusher-sign-up.md"></div>

<a name="update-app"></a><h2>Update your app</h2>

Now that you have your Pusher account set up, the next step is to modify the iOS app code for the new functionality.

###Install the libPusher library

The [libPusher][] library let’s you access Pusher from iOS. 

1. Download the libPusher library [here](https://github.com/downloads/lukeredpath/libPusher/libPusher-iOS-v1.4.zip).

2. Create a group called 'libPusher' in your project.

3. In Finder, unzip the downloaded zip file, select the **libPusher-combined.a** and **/headers** folder, and drag these items onto the **libPusher** group in your project.

4. Check **Copy items into destination group’s folder**, then click **Finish**
	
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

1. In Xcode, open the **TodoService.h** file and add the following method declarations:

        // Allows retrieval of items by id
        - (NSUInteger) getItemIndex:(NSDictionary *)item;

        // To be called when items are added by other users
        - (NSUInteger) itemAdded:(NSDictionary *)item;
        
        // To be called when items are completed by other users
        - (NSUInteger) itemCompleted:(NSDictionary *)item;
        
2. Next, replace the declarations of **addItem** and **completeItem** to be:

		- (void) addItem:(NSDictionary *) item;
		- (void) completeItem: (NSDictionary *) item;

3. In **TodoService.m**, add the following code to implement the new methods:

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

	The TodoService now allows you to find items by **id**, and to add and complete items locally without hitting the data table on Windows Azure.
	
4. Replace the **addItem** and **completeItem** methods:

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


	The items will be added and completed (and updated in the UI) when events are received from Pusher, not when the data table is updated.

5. In **TodoListController.h**, add the following import statements:

		#import "PTPusherDelegate.h"
		#import "PTPusher.h"
		#import "PTPusherEvent.h"
		#import "PTPusherChannel.h"
		
6. Also, modify the interface declaration to add 'PTPusherDelegate', so the line now reads:

		@interface TodoListController : UITableViewController<UITextFieldDelegate, PTPusherDelegate>
		
7. Add a new property as follows:

		@property (nonatomic, strong) PTPusher *pusher;

8. Add the following code to declare a new method:

		// Sets up the Pusher client
		- (void) setupPusher;
		
9. In **TodoListController.m** add the following line under the other **@synthesise** lines to implement the new property:

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

13. In the **TodoListController.m** file, in the (void)viewDidLoad method, add a call to the setupPusher method so the first few lines are:

		- (void)viewDidLoad
		{
		    [super viewDidLoad];
		    [self setupPusher];
		    
14. At the end of the **tableView** method replace the call to **completeItem**:

		// Ask the todoService to set the item's complete value to YES
	    [self.todoService completeItem:item];

The app is now setup to receive events from Pusher, and to update the local Todo list accordingly.

<a name="install-scripts"></a><h2>Install server scripts</h2>

All that remains is setting up your server scripts. We'll insert a script for when an item is inserted or updated into the TodoList table.

1. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your mobile service.

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

<a name="test-app"></a><h2>Test your app</h2>

To test the app you'll need to run two instances. You can run one instance on an iOS device and another in the iOS simulator.

1. Connect your iOS device, and Run the app on the device. Stop debugging and you'll now have your app installed on your device.
2. Run the app on the iOS simulator, and open the app on your iOS device so that you have two instances running.
3. Add a new Todo item on one of the instances. See it appear on the other instance.
4. Complete a Todo item on one instance. See it disappear on the other instance. 

Congratulations, you have successfully configured your mobile service app to synchronise across all clients in realtime.

## <a name="nextsteps"> </a>Next Steps

Now that you’ve seen how easy it is to use the Pusher service with Mobile Services, follow these links to learn more about Pusher.

-   Pusher API documentation: <http://pusher.com/docs>
-   Pusher tutorials: <http://pusher.com/tutorials>

To learn more about registering and using server scripts, see [Mobile Services server script reference].

<!-- Anchors. -->
[Create a Pusher account]: #sign-up
[Update your app]: #update-app
[Install server scripts]: #install-scripts
[Test your app]: #test-app

<!-- Images. -->
[1]: ../Media/mobile-portal-data-tables.png
[2]: ../Media/mobile-insert-script-push2.png

[add-files-to-group]: ../Media/pusher-ios-add-files-to-group.png
[add-build-phase]: ../Media/pusher-ios-add-build-phase.png
[add-linker-flag]: ../Media/pusher-ios-add-linker-flag.png

<!-- URLs. -->
[Push Notifications to Users]: ./mobile-services-push-notifications-to-app-users.md
[Get started with Mobile Services]: ./mobile-services-get-started.md
[libPusher]: https://github.com/lukeredpath/libPusher

[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[http://pusher.com]: http://pusher.com/
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/p/?LinkId=262293
