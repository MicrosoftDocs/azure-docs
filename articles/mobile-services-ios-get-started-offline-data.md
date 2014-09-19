<properties linkid="develop-mobile-tutorials-get-started-offline-data-ios" urlDisplayName="Getting Started with Offline Data" pageTitle="Get started with offline data in Mobile Services (iOS) | Mobile Dev Center" metaKeywords="" description="Learn how to use Azure Mobile Services to cache and sync offline data in your iOS application" metaCanonical="" disqusComments="1" umbracoNaviHide="1" documentationCenter="Mobile" title="Get started with offline data sync in Mobile Services" authors="krisragh" />

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-ios" ms.devlang="objective-c" ms.topic="article" ms.date="01/01/1900" ms.author="wesmc" />

# Get started with Offline Data Sync in Mobile Services on iOS

<div class="dev-center-tutorial-selector sublanding">
<a href="/en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-offline-data" title="Windows Store C#">Windows Store C#</a>
<a href="/en-us/documentation/articles/mobile-services-windows-phone-get-started-offline-data" title="Windows Phone">Windows Phone</a>
<a href="/en-us/documentation/articles/mobile-services-ios-get-started-offline-data" title="iOS" class="current">iOS</a>
<a href="/en-us/documentation/articles/mobile-services-xamarin-ios-get-started-offline-data" title="Xamarin.iOS">Xamarin.iOS</a>
<a href="/en-us/documentation/articles/mobile-services-xamarin-android-get-started-offline-data" title="Xamarin.Android">Xamarin.Android</a>
</div>

This tutorial covers the offline sync feature of Mobile Services on iOS, which allows developers to write apps that are usable even when the end user has no network access.

Offline sync has several potential uses:

* Improve app responsiveness by caching server data locally on the device
* Make apps resilient against intermittent network connectivity
* Allow end-users to create and modify data even when there is no network access, supporting scenarios with little or no connectivity
* Sync data across multiple devices and detect conflicts when the same record is modified by two devices

This tutorial will show how to update the app from [Get started with Mobile Services in iOS] tutorial to support the offline features of Azure Mobile Services. Then you will add data in a disconnected offline scenario, sync those items to the online database, and then log in to the Azure Management Portal to view changes to data made when running the app.

>[WACOM.NOTE] To complete this tutorial, you need a Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=AE564AB28" target="_blank">Azure Free Trial</a>.


>[WACOM.NOTE] You can skip these sections and jump to downloading a version of the Getting Started project that already has offline support and everything described in this topic.  To download a project with offline support enabled, see [Getting Started Offline iOS Sample].


## Get the sample quickstart app

Follow the instructions at [Get started with Mobile Services] and download the quickstart project.

## Download the preview SDK and update the framework

1. To add offline support to our application, let's get a version of the Mobile Services iOS SDK which supports offline sync. Since we're launching it as a preview feature, it is not yet in the officially downloadable SDK. [Download the preview SDK here].

2. Then, remove the existing **WindowsAzureMobileServices.framework** reference from the project in Xcode by selecting it, clicking the **Edit** menu, selecting "Move to Trash" to really delete the files.

![][update-framework-1]


3. Unzip the contents of the new preview SDK, and in place of the old SDK, drag and drop over the new **WindowsAzureMobileServices.framework** SDK. Make sure the "Copy items into destination group's folder (if needed)" is selected.

![][update-framework-2]

## Update the quickstart app project

Let's update the quickstart project to allow the editing of items. Currently, if you run this same app on two phones, change the same item on both phones locally, and push the changes back to the server, it will fail with a conflict.

The offline sync features in the SDK let you handle such  conflicts via code and let you dynamically decide what to do with conflicting items. Changing the quickstart project lets us experiment with  this feature.

### Update Todo List View Controller

1. Let's update the iPhone storyboard. If you're working with an iPad, please follow the same steps for the iPad storyboard as well.

2. Select **MainStoryboard_iPhone.storyboard** in the Xcode Project Navigator, then select the  Todo List View Controller. At the top menu, click **Editor -> Embed In -> Navigation Controller**

![][update-todo-list-view-controller-1]

3. Next, in the Todo List View Controller, select the table view cell, and sets its Accessory mode to **Disclosure indicator**. The disclosure indicator indicates to users that if they tap on the associated table view controller, a new view will be displayed. The disclosure indicator produces no event.

![][update-todo-list-view-controller-2]

### Add Todo Item View Controller

1. Add a new Objective-C class called QSTodoItemViewController, derived from UIViewController to your project:

![][add-todo-item-view-controller-1]

![][add-todo-item-view-controller-2]

2. In **QSTodoItemViewController.h**, add a property to hold the item to be modified:

        @property (nonatomic, weak) NSMutableDictionary *item;

3. In **QSTodoItemViewController.m**, add two private properties for the two fields of the todo item we'll edit:

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

3. Add a push segue from the **Todo List View Controller** to the **Todo Item View Controller** and name the segue "detailSegue." To learn more, see [Adding a Segue Between Scenes in a Storyboard]. Don't create this segue from the any cell or button in the origin view controller. Instead, CTRL + Drag from the view controller icon below the **Todo List View Controller** in the storyboard interface to the  **Todo Item View Controller**. If you accidentally segue from a cell, you will trigger the segue twice when you run the app, resulting in this error:

        nested push animation can result in corrupted navigation bar

4. Add a text field for item text and a segmented control for the completion status to the new **Todo Item View Controller**, with labels as well. Connect these new fields to outlets in code. To learn more, see [Build a User Interface].

![][add-todo-item-view-controller-3]

5. Connect these new fields to the corresponding outlets you've already added to **QSTodoItemViewController.m**. Connect the item text field to the **itemText** outlet and the completion status segmented control to the **itemComplete** outlet. To learn more, see [Creating an Outlet Connection].

6. Verify that the app works with all the changes you've made so far. Run the app now in the simulator. Add items to the todo list, and then click on them. You'll see the (currently empty) item view controller.

![][add-todo-item-view-controller-4]
![][add-todo-item-view-controller-5]

### Add Item Details to Todo Item View Controller

1. We have to start referring to **QSTodoItemViewController** from within **QSTodoListViewController.m**, so add an import statement to **QSTodoListViewController.m**.

        #import "QSTodoItemViewController.h"


2. Add two new properties to the **QSTodoListViewController** interface in  **QSTodoListViewController.m** to store the item being edited:


    @property (nonatomic)           NSInteger       editedItemIndex;
    @property (strong, nonatomic)   NSMutableDictionary *editedItem;

3. Implement **tableView:didSelectRowAtIndexPath:** to save the item being edited and then to call the segue to display the detail view.


          - (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
              self.editedItemIndex = [indexPath row];
              self.editedItem = [[self.todoService.items objectAtIndex:[indexPath row]] mutableCopy];

              [self performSegueWithIdentifier:@"detailSegue" sender:self];
          }

4. Implement **prepareForSegue:sender** to pass the item to the todo item view controller.

        - (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
            if ([[segue identifier] isEqualToString:@"detailSegue"]) {
                QSTodoItemViewController *ivc = (QSTodoItemViewController *)[segue destinationViewController];
                ivc.item = self.editedItem;
            }
        }

5. Verify that the app works with all the changes you've made so far. Run the app now in the simulator. Add items to the todo list, and then click on them. You'll see the item view controller is no longer empty -- it displays the details of the todo items.

![][add-todo-item-view-controller-6]
![][add-todo-item-view-controller-7]


<!-- URLs. -->
[Creating an Outlet Connection]: https://developer.apple.com/library/mac/recipes/xcode_help-interface_builder/articles-connections_bindings/CreatingOutlet.html
[Build a User Interface]: https://developer.apple.com/library/mac/documentation/ToolsLanguages/Conceptual/Xcode_Overview/Edit_User_Interfaces/edit_user_interface.html
[Adding a Segue Between Scenes in a Storyboard]: https://developer.apple.com/library/ios/recipes/xcode_help-IB_storyboard/chapters/StoryboardSegue.html#//apple_ref/doc/uid/TP40014225-CH25-SW1
[Adding a Scene to a Storyboard]: https://developer.apple.com/library/ios/recipes/xcode_help-IB_storyboard/chapters/StoryboardScene.html

[Download the preview SDK here]: http://aka.ms/Gc6fex
[How to use the Mobile Services client library for iOS]: /en-us/documentation/articles/mobile-services-ios-how-to-use-client-library/
[Getting Started Offline iOS Sample]: https://github.com/Azure/mobile-services-samples/tree/master/TodoOffline/iOS/blog20140611

[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-ios-get-started/
[Get started with data]: /en-us/documentation/articles/mobile-services-ios-get-started-data/
