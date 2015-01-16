<properties pageTitle="Handle conflicts with offline data in Mobile Services (iOS) | Mobile Dev Center" description="Learn how to use Azure Mobile Services handle conflicts when syncing offline data in your iOS application" documentationCenter="ios" authors="krisragh" manager="dwrede" editor="" services=""/>

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-ios" ms.devlang="dotnet" ms.topic="article" ms.date="01/26/2015" ms.author="krisragh,donnam"/>


# Handling Conflicts with Offline Data Sync in Mobile Services

[WACOM.INCLUDE [mobile-services-selector-offline-conflicts](../includes/mobile-services-selector-offline-conflicts.md)]

This topic shows you how to synchronize data and handle conflicts when using the offline capabilities of Azure Mobile Services. This tutorial builds on the steps and the sample app from the previous tutorial [Get Started with Offline Data]. Before you begin this tutorial, you must first complete [Get Started with Offline Data].

>[AZURE.NOTE] To complete this tutorial, you need a Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=AE564AB28" target="_blank">Azure Free Trial</a>.

## Complete the Get Started with Offline Tutorial

Follow the instructions at the [Get Started with Offline Data] tutorial and complete that project. We will use the finished project from that tutorial as the starting point for this tutorial.

## Update the App Project to Allow Editing

Let's update the finished project from [Get Started with Offline Data] to allow the editing of items. Currently, if you run this same app on two phones, change the same item on both phones locally, and push the changes back to the server, it will fail with a conflict.

The offline sync features in the SDK let you handle such  conflicts via code and let you dynamically decide what to do with conflicting items. Changing the quickstart project lets us experiment with this feature.

### Update Todo List View Controller

1. Let's update the iPhone storyboard. If you're working with an iPad, please follow the same steps for the iPad storyboard as well.

2. Select **MainStoryboard_iPhone.storyboard** in the Xcode Project Navigator, then select **Todo List View Controller**. At the top menu, click **Editor -> Embed In -> Navigation Controller**

      ![][update-todo-list-view-controller-1]

3. Next, in **Todo List View Controller**, select the table view cell, and sets its Accessory mode to **Disclosure indicator**. The disclosure indicator indicates to users that if they tap on the associated table view controller, a new view will be displayed. The disclosure indicator produces no event.

      ![][update-todo-list-view-controller-2]

4. In **TodoListViewController.m**, remove the following operations and their contents altogether. We do not need them:

        -(NSString *)tableView:(UITableView *)tableView titleForDeleteConfirmationButtonForRowAtIndexPath:(NSIndexPath *)indexPath

        -(UITableViewCellEditingStyle)tableView:(UITableView *)tableView editingStyleForRowAtIndexPath:(NSIndexPath *)indexPath

        -(void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle
         forRowAtIndexPath:(NSIndexPath *)indexPath

### Add Todo Item View Controller

1. Add a new Objective-C class called **QSTodoItemViewController**, derived from **UIViewController**, to your project:

      ![][add-todo-item-view-controller-1]

      ![][add-todo-item-view-controller-2]

2. In **QSTodoItemViewController.h**, add a property to hold the item to be modified:

        @property (nonatomic, weak) NSMutableDictionary *item;

3. In **QSTodoItemViewController.m**, add two private properties for the two fields of the todo item we'll edit -- the completion status and the text of the todo item itself:

        @interface QSTodoItemViewController ()

        @property (nonatomic, strong) IBOutlet UITextField *itemText;
        @property (nonatomic, strong) IBOutlet UISegmentedControl *itemComplete;

        @end

4. In **QSTodoItemViewController.m**, update the stub implementation of **viewDidLoad** to the following code:

        - (void)viewDidLoad
        {
            [super viewDidLoad];

            UINavigationItem *nav = [self navigationItem];
            [nav setTitle:@"Todo Item"];

            NSDictionary *theItem = [self item];
            [self.itemText setText:[theItem objectForKey:@"text"]];

            BOOL isComplete = [[theItem objectForKey:@"complete"] boolValue];
            [self.itemComplete setSelectedSegmentIndex:(isComplete ? 0 : 1)];

            [self.itemComplete addTarget:self
                                  action:@selector(completedValueChanged:)
                        forControlEvents:UIControlEventValueChanged];
        }

5. In **QSTodoItemViewController.m**, add four additional methods to handle several events:


        - (BOOL)textFieldShouldEndEditing:(UITextField *)textField {
            [textField resignFirstResponder];
            return YES;
        }

        - (BOOL)textFieldShouldReturn:(UITextField *)textField {
            [textField resignFirstResponder];
            return YES;
        }


        - (void)completedValueChanged:(id)sender {
            [[self view] endEditing:YES];
        }

        - (void)viewWillDisappear:(BOOL)animated {
            [self.item setValue:[self.itemText text] forKey:@"text"];
            [self.item setValue:[NSNumber numberWithBool:self.itemComplete.selectedSegmentIndex == 0] forKey:@"complete"];
        }

### Add Todo Item View Controller and Segue to Storyboard

1. Return to the **MainStoryboard_iPhone.storyboard** file using the Project Navigator.

2. Add a new view controller for the Todo Item to the storyboard, to the right of the existing **Todo List View Controller**. Set the custom class of this new view controller to **QSTodoItemViewController**. To learn more, see [Adding a Scene to a Storyboard].

3. Add a push segue from the **Todo List View Controller** to the **Todo Item View Controller** and name the segue **detailSegue**. To learn more, see [Adding a Segue Between Scenes in a Storyboard]. Don't create this segue from the any cell or button in the origin view controller. Instead, CTRL + Drag from the view controller icon below the **Todo List View Controller** in the storyboard interface to the  **Todo Item View Controller**. If you accidentally segue from a cell, you will trigger the segue twice when you run the app, resulting in this error:

        Nested push animation can result in corrupted navigation bar

4. Add a text field for item text and a segmented control for the completion status to the new **Todo Item View Controller**, with labels as well. In the segmented control, set the title of **Segment 0** to **Yes** and the title for **Segment 1** to **No**. Connect these new fields to outlets in code. To learn more, see [Build a User Interface] and [Segmented Controls].

      ![][add-todo-item-view-controller-3]

5. Connect these new fields to the corresponding outlets you've already added to **QSTodoItemViewController.m**. Connect the item text field to the **itemText** outlet and the completion status segmented control to the **itemComplete** outlet. To learn more, see [Creating an Outlet Connection].

6. Set the text field's delegate to the view controller. This resigns the text field when you eventually edit an item and press RETURN. CTRL + Drag from the text field to the view controller icon below the **Todo Item View Controller** in the storyboard interface, and select the delegate outlet; this indicates to the storyboard that this text field's delegate is this view controller.

7. Verify that the app works with all the changes you've made so far. Run the app now in the simulator. Add items to the todo list, and then click on them. You'll see the (currently empty) item view controller.

      ![][add-todo-item-view-controller-4]

      ![][add-todo-item-view-controller-5]

### Add Item Details to Todo Item View Controller

1. We will refer to **QSTodoItemViewController** from  **QSTodoListViewController.m**. So, in **QSTodoListViewController.m**, let's add a line to import **QSTodoItemViewController.h**.

        #import "QSTodoItemViewController.h"

2. Add two new properties to the **QSTodoListViewController** interface in **QSTodoListViewController.m** to store the item being edited:

        @property (nonatomic)           NSInteger       editedItemIndex;
        @property (strong, nonatomic)   NSMutableDictionary *editedItem;

3. Implement **tableView:didSelectRowAtIndexPath:** in **QSTodoListViewController.m** to save the item being edited and then to call the segue to display the detail view.

          - (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
              self.editedItemIndex = [indexPath row];
              self.editedItem = [[self.todoService.items objectAtIndex:[indexPath row]] mutableCopy];

              [self performSegueWithIdentifier:@"detailSegue" sender:self];
          }

4. Implement **prepareForSegue:sender:** in **QSTodoListViewController.m** to pass the item to the  **Todo Item View Controller**.

        - (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
            if ([[segue identifier] isEqualToString:@"detailSegue"]) {
                QSTodoItemViewController *ivc = (QSTodoItemViewController *)[segue destinationViewController];
                ivc.item = self.editedItem;
            }
        }

5. Verify that the app works with all the changes you've made so far. Run the app now in the simulator. Add items to the todo list, and then click on them. You'll see the item view controller is no longer empty -- it displays the details of the todo items.

      ![][add-todo-item-view-controller-6]

### Add Support for Saving Edits

1. When you click the "Back" button in the navigation view, the edits are lost. We've sent data to the detail view, but the data isn't  sent back to the master view. Since we already pass a pointer to a copy of the item, we can use that pointer to retrieve the list of updates made to the item and update it on the server. To get started, first update the server wrapper class of **QSTodoService** in **QSTodoService.m** by removing the **completeItem** operation and adding a new  **updateItem** operation. This is because **completeItem** only marks items as complete; instead, **updateItem** will update items.

        - (void)updateItem:(NSDictionary *)item atIndex:(NSInteger)index completion:(QSCompletionWithIndexBlock)completion {
            // Cast the public items property to the mutable type (it was created as mutable)
            NSMutableArray *mutableItems = (NSMutableArray *) items;

            // Replace the original in the items array
            [mutableItems replaceObjectAtIndex:index withObject:item];

            // Update the item in the TodoItem table and remove from the items array when we mark an item as complete
            [self.syncTable update:item completion:^(NSError *error) {
                [self logErrorIfNotNil:error];

                NSInteger index = -1;
                if (!error) {
                    BOOL isComplete = [[item objectForKey:@"complete"] boolValue];
                    NSString *remoteId = [item objectForKey:@"id"];
                    index = [items indexOfObjectPassingTest:^BOOL(id obj, NSUInteger idx, BOOL *stop) {
                        return [remoteId isEqualToString:[obj objectForKey:@"id"]];
                    }];

                    if (index != NSNotFound && isComplete)
                    {
                        [mutableItems removeObjectAtIndex:index];
                    }
                }

                // Let the caller know that we have finished
                dispatch_async(dispatch_get_main_queue(), ^{
                    completion(index);
                });
            }];
        }

2. Remove the declaration for **completeItem** from **QSTodoService.h** and add this declaration for **updateItem**:

        - (void)updateItem:(NSDictionary *)item atIndex:(NSInteger)index completion:(QSCompletionWithIndexBlock)completion;

3. In **QSTodoListViewController.m**, add the operation **viewWillAppear**, to call the update method whenever the master view is displayed after returning from the details view controller.

        - (void)viewWillAppear:(BOOL)animated {
            if (self.editedItem && self.editedItemIndex >= 0) {
                // Returning from the details view controller
                NSDictionary *item = [self.todoService.items objectAtIndex:self.editedItemIndex];

                BOOL changed = ![item isEqualToDictionary:self.editedItem];
                if (changed) {
                    [self.tableView setUserInteractionEnabled:NO];

                    // Change the appearance to look greyed out until we remove the item
                    NSIndexPath *indexPath = [NSIndexPath indexPathForRow:self.editedItemIndex inSection:0];

                    UITableViewCell *cell = [self.tableView cellForRowAtIndexPath:indexPath];
                    cell.textLabel.textColor = [UIColor grayColor];

                    // Ask the todoService to update the item, and remove the row if it's been completed
                    [self.todoService updateItem:self.editedItem atIndex:self.editedItemIndex completion:^(NSUInteger index) {
                        if ([[self.editedItem objectForKey:@"complete"] boolValue]) {
                            // Remove the row from the UITableView
                            [self.tableView deleteRowsAtIndexPaths:@[ indexPath ]
                                                  withRowAnimation:UITableViewRowAnimationTop];
                        } else {
                            [self.tableView reloadRowsAtIndexPaths:[NSArray arrayWithObject:indexPath]
                                                  withRowAnimation:UITableViewRowAnimationAutomatic];
                        }

                        [self.tableView setUserInteractionEnabled:YES];

                        self.editedItem = nil;
                        self.editedItemIndex = -1;
                    }];
                } else {
                    self.editedItem = nil;
                    self.editedItemIndex = -1;
                }
            }
        }

4. Now let's test the app. Verify that the app works with all the changes you've made so far. Run the app now in the simulator. Add items to the todo list, and then click on them. Try to edit an item, and go back. Verify that the item description is updated in the app's master view. Refresh the app using the drag-down gesture, and verify that the edit is reflected in the cloud.

### Conflict Handling Problem

1. Let's examine what happens when two different clients try to modify the same piece of data at the same time. In the example list below, there's an item "Hello world 3" Let's change this to, say, "Hello world 13" on one device and let's change this to "Hello world 23" on another device.

      ![][conflict-handling-problem-1]

2. Launch the app in two places: on two iOS devices, or in the simulator and on an iOS device. If you don't have a physical device to test on, launch one instance in the simulator, and using a REST client, send a PATCH request to the mobile service.The URL of the PATCH request reflects the name of the Mobile Service, the name of the todo item table, and the ID of the todo item table you're editing, while the x-zumo-application header is the application key:

        PATCH https://todolist.azure-mobile.net/tables/todoitem/D265929E-B17B-42D1-8FAB-D0ADF26486FA?__systemproperties=__version
        Content-Type: application/json
        x-zumo-application: shYOoDFdKhmzLEbnMQqPYrCLhwGOVA10

        {
            "id": "D265929E-B17B-42D1-8FAB-D0ADF26486FA",
            "text": "Hello world 23"
        }

3. Now, refresh the items in the two instances of the app. You'll see an error printed in the output log in Xcode:

        TodoList[1575:4a2f] ERROR Error Domain=com.Microsoft.WindowsAzureMobileServices.ErrorDomain Code=-1170 "Not all operations completed successfully" UserInfo=0x8dd6310 {com.Microsoft.WindowsAzureMobileServices.ErrorPushResultKey=(
            "The server's version did not match the passed version"
        ), NSLocalizedDescription=Not all operations completed successfully}

  This is because on the completion block, in the call to **pullWithQuery:completion:**, the error parameter will be non-nil, which will cause the error to be printed out to the output via **NSLog**.

### Update QSTodoService to Support Conflict Handling

1. Let's let the user decide how to handle the conflict by dealing with it in the client. To do this, let's implement the **MSSyncContextDelegate** protocol. In both **QSTodoService.h** and **QSTodoService.m**, change the **(QSTodoService *)defaultService;** factory method declaration to the statement below, so as to receive the sync context delegate as a parameter:

        + (QSTodoService *)defaultServiceWithDelegate:(id)delegate;

2. In **QSTodoService.m**, change the **init** line as shown below, again receiving the sync context delegate as a parameter:

        -(QSTodoService *)initWithDelegate:(id)syncDelegate

3. In **QSTodoService.m**, change the **init** call in **defaultServiceWithDelegate** to **initWithDelegate** instead:

        service = [[QSTodoService alloc] initWithDelegate:delegate];

4. Back in **QSTodoService.m**, change the initialization of **self.client.syncContext** to pass in **syncDelegate** instead of **nil** for the delegate:

        self.client.syncContext = [[MSSyncContext alloc] initWithDelegate:syncDelegate dataSource:store callback:nil];

### Add UI Alert View Helper to Support Conflict Handling

1. If there's a conflict, let's allow the user to choose which version to keep:
  * keep the client version (which overrides the version on the server),
  * keep the server version (which updates the client local table), or
  * keep neither version (cancels push and leaves the operation pending).

  Since another update may also happen while we display the prompt, we'll keep showing  options until the server stops returning a failure response. In our code, let's use a helper class that shows an alert view and takes a delegate that is invoked when the alert view is displayed. Let's define the helper class **QSUIAlertViewWithBlock** first.

2. Add this new class, **QSUIAlertViewWithBlock**, using Xcode, and overwrite **QSUIAlertViewWithBlock.h** with the following contents:

        #import <Foundation/Foundation.h>

        typedef void (^QSUIAlertViewBlock) (NSInteger index);

        @interface QSUIAlertViewWithBlock : NSObject <UIAlertViewDelegate>

        - (id) initWithCallback:(QSUIAlertViewBlock)callback;
        - (void) showAlertWithTitle:(NSString *)title message:(NSString *)message cancelButtonTitle:(NSString *)cancelButtonTitle otherButtonTitles:(NSArray *)otherButtonTitles;

        @end

3. Next, overwrite **QSUIAlertViewWithBlock.m** with the following file:

        #import "QSUIAlertViewWithBlock.h"
        #import <objc/runtime.h>

        @interface QSUIAlertViewWithBlock()

        @property (nonatomic, copy) QSUIAlertViewBlock callback;

        @end

        @implementation QSUIAlertViewWithBlock

        static const char *key;

        @synthesize callback = _callback;

        - (id) initWithCallback:(QSUIAlertViewBlock)callback
        {
            self = [super init];
            if (self) {
                _callback = [callback copy];
            }
            return self;
        }

        - (void) showAlertWithTitle:(NSString *)title message:(NSString *)message cancelButtonTitle:(NSString *)cancelButtonTitle otherButtonTitles:(NSArray *)otherButtonTitles {
            UIAlertView *alert = [[UIAlertView alloc] initWithTitle:title
                                                            message:message
                                                           delegate:self
                                                  cancelButtonTitle:cancelButtonTitle
                                                  otherButtonTitles:nil];

            if (otherButtonTitles) {
                for (NSString *buttonTitle in otherButtonTitles) {
                    [alert addButtonWithTitle:buttonTitle];
                }
            }

            [alert show];

            objc_setAssociatedObject(alert, &key, self, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
        }

        - (void) alertView:(UIAlertView *)alertView didDismissWithButtonIndex:(NSInteger)buttonIndex
        {
            if (self.callback) {
                self.callback(buttonIndex);
            }
        }

        @end

### Add Conflict Handler to Todo List View Controller

1. In **QSTodoListViewController.m**, replace the call to **defaultService** in **viewDidLoad** with a call to **defaultServiceWithDelegate** instead, as shown below:

        self.todoService = [QSTodoService defaultServiceWithDelegate:self];

2. In **QSTodoListViewController.h**, add **&lt;MSSyncContextDelegate&gt;** to the interface declaration so we're implementing the **MSSyncContextDelegate** protocol.

        @interface QSTodoListViewController : UITableViewController<MSSyncContextDelegate>

3. Add the following import statement at the top of **QSTodoListViewController.m**:

        #import "QSUIAlertViewWithBlock.h"

4. Finally, let's add the following two operations to **QSTodoListViewController.m** to use this helper class and prompt the user to reconcile the conflict in one of three ways.

        - (void)tableOperation:(MSTableOperation *)operation onComplete:(MSSyncItemBlock)completion
        {
            [self doOperation:operation complete:completion];
        }

        -(void)doOperation:(MSTableOperation *)operation complete:(MSSyncItemBlock)completion
        {
            [operation executeWithCompletion:^(NSDictionary *item, NSError *error) {

                NSDictionary *serverItem = [error.userInfo objectForKey:MSErrorServerItemKey];

                if (error.code == MSErrorPreconditionFailed) {
                    QSUIAlertViewWithBlock *alert = [[QSUIAlertViewWithBlock alloc] initWithCallback:^(NSInteger buttonIndex) {
                        if (buttonIndex == 1) { // Client
                            NSMutableDictionary *adjustedItem = [operation.item mutableCopy];

                            [adjustedItem setValue:[serverItem objectForKey:MSSystemColumnVersion] forKey:MSSystemColumnVersion];
                            operation.item = adjustedItem;

                            [self doOperation:operation complete:completion];
                            return;

                        } else if (buttonIndex == 2) { // Server
                            NSDictionary *serverItem = [error.userInfo objectForKey:MSErrorServerItemKey];
                            completion(serverItem, nil);
                        } else { // Cancel
                            [operation cancelPush];
                            completion(nil, error);
                        }
                    }];

                    NSString *message = [NSString stringWithFormat:@"Client value: %@\nServer value: %@", operation.item[@"text"], serverItem[@"text"]];

                    [alert showAlertWithTitle:@"Server Conflict"
                                      message:message
                            cancelButtonTitle:@"Cancel"
                            otherButtonTitles:[NSArray arrayWithObjects:@"Use Client", @"Use Server", nil]];
                } else {
                    completion(item, error);
                }
            }];
        }

### Test the App

Let's test the application with conflicts! Edit the same item in two different instances of the app running at the same time. Now perform the refresh gesture in the app instances by dragging from the top. You'll see a prompt to reconcile the change now.

### Summary

In order to set up the completed project from [Get Started with Offline Data] to detect conflicts, you first added the ability to edit and update the todo items.

To do so, you added a new item details view controller, connected the main view controller and the details view controller, and finally added the ability to save edits and push them to the cloud.

Next, you discovered what happens when there is a conflict. You added support for a conflict handler by implementing the **MSSyncContextDelegate** protocol. You also enabled support for the sync context delegate through the server interface class of **QSTodoService**, **QSTodoListViewController**, and supporting classes.

Along the way, you added a **QSUIAlertViewWithBlock** helper class to display an alert to users, and finished by adding code to **QSTodoListViewController** to prompt the user to reconcile the conflict in one of three ways.

<!-- URLs. -->

[add-todo-item-view-controller-1]: ./media/mobile-services-ios-handling-conflicts-offline-data/add-todo-item-view-controller-1.png
[add-todo-item-view-controller-2]: ./media/mobile-services-ios-handling-conflicts-offline-data/add-todo-item-view-controller-2.png
[add-todo-item-view-controller-3]: ./media/mobile-services-ios-handling-conflicts-offline-data/add-todo-item-view-controller-3.png
[add-todo-item-view-controller-4]: ./media/mobile-services-ios-handling-conflicts-offline-data/add-todo-item-view-controller-4.png
[add-todo-item-view-controller-5]: ./media/mobile-services-ios-handling-conflicts-offline-data/add-todo-item-view-controller-5.png
[add-todo-item-view-controller-6]: ./media/mobile-services-ios-handling-conflicts-offline-data/add-todo-item-view-controller-6.png
[conflict-handling-problem-1]: ./media/mobile-services-ios-handling-conflicts-offline-data/conflict-handling-problem-1.png
[update-todo-list-view-controller-1]: ./media/mobile-services-ios-handling-conflicts-offline-data/update-todo-list-view-controller-1.png
[update-todo-list-view-controller-2]: ./media/mobile-services-ios-handling-conflicts-offline-data/update-todo-list-view-controller-2.png

[Segmented Controls]: https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/UIKitUICatalog/UISegmentedControl.html
[Core Data Model Editor Help]: https://developer.apple.com/library/mac/recipes/xcode_help-core_data_modeling_tool/Articles/about_cd_modeling_tool.html
[Creating an Outlet Connection]: https://developer.apple.com/library/mac/recipes/xcode_help-interface_builder/articles-connections_bindings/CreatingOutlet.html
[Build a User Interface]: https://developer.apple.com/library/mac/documentation/ToolsLanguages/Conceptual/Xcode_Overview/Edit_User_Interfaces/edit_user_interface.html
[Adding a Segue Between Scenes in a Storyboard]: https://developer.apple.com/library/ios/recipes/xcode_help-IB_storyboard/chapters/StoryboardSegue.html#//apple_ref/doc/uid/TP40014225-CH25-SW1
[Adding a Scene to a Storyboard]: https://developer.apple.com/library/ios/recipes/xcode_help-IB_storyboard/chapters/StoryboardScene.html
[Core Data]: https://developer.apple.com/library/ios/documentation/Cocoa/Conceptual/CoreData/cdProgrammingGuide.html
[Download the preview SDK here]: http://aka.ms/Gc6fex
[How to use the Mobile Services client library for iOS]: /en-us/documentation/articles/mobile-services-ios-how-to-use-client-library/
[Getting Started Offline iOS Sample]: https://github.com/Azure/mobile-services-samples/tree/master/TodoOffline/iOS/blog20140611
[Get Started with Offline Data]: /en-us/documentation/articles/mobile-services-ios-get-started-offline-data/
[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-ios-get-started/
[Get started with data]: /en-us/documentation/articles/mobile-services-ios-get-started-data/
