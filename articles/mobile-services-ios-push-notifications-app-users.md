<properties linkid="develop-net-tutorials-push-notifications-to-users-ios" urlDisplayName="Push Notifications to Users (iOS)" pageTitle="Push notifications to users (iOS) | Mobile Dev Center" metaKeywords="" description="Learn how to use Mobile Services to push notifications to users of your iOS app." metaCanonical="" services="" documentationCenter="Mobile" title="Push notifications to users by using Mobile Services" authors="" solutions="" manager="" editor="" />



 
# Push notifications to users by using Mobile Services
<div class="dev-center-tutorial-selector sublanding"> 
	<a href="/en-us/develop/mobile/tutorials/push-notifications-to-users-wp8" title="Windows Phone">Windows Phone</a><a href="/en-us/develop/mobile/tutorials/push-notifications-to-users-ios" title="iOS" class="current">iOS</a><a href="/en-us/develop/mobile/tutorials/push-notifications-to-users-android" title="Android">Android</a>
</div>

This topic extends the [previous push notification tutorial][Get started with push notifications] by adding a new table to store Apple Push Notification Service (APNS) tokens. These tokens can then be used to send push notifications to users of the iPhone or iPad app.  

This tutorial walks you through these steps to update push notifications in your app:

1. [Create the Devices table]
2. [Update the app]
3. [Update server scripts]
4. [Verify the push notification behavior] 

This tutorial is based on the Mobile Services quickstart and builds on the previous tutorial [Get started with push notifications]. Before you start this tutorial, you must first complete [Get started with push notifications].  

## <a name="create-table"></a><h2><span class="short-header">Create the table</span>Create the new Devices table</h2>

1. Log into the [Azure Management Portal], click **Mobile Services**, and then click your app.

   	![][0]

2. Click the **Data** tab, and then click **Create**.

   	![][1]

   	This displays the **Create new table** dialog.

3. Keeping the default **Anybody with the application key** setting for all permissions, type _Devices_ in **Table name**, and then click the check button.

   	![][2]

  	This creates the **Devices** table, which stores the device tokens used to send push notifications separate from item data.

Next, you will modify the push notifications app to store data in this new table instead of in the **TodoItem** table.

## <a name="update-app"></a>Update your app

1. In Xcode, open the QSTodoService.h file and add the following method declaration: 

        // Declare method to register device token for other users
        - (void)registerDeviceToken:(NSString *)deviceToken;

   	This enables the App Delegate to register a deviceToken with the Mobile Service.

2. In QSTodoService.m, add the following instance method:

        // Instance method to register deviceToken in Devices table.
        // Called in AppDelegate.m when APNS registration succeeds.
        - (void)registerDeviceToken:(NSString *)deviceToken
        {
            MSTable *devicesTable = [self.client tableWithName:@"Devices"]; 
            NSDictionary *device = @{ @"deviceToken" : deviceToken };
    
            // Insert the item into the devices table and add to the items array on completion
            [devicesTable insert:device completion:^(NSDictionary *result, NSError *error) {
                if (error) {
                    NSLog(@"ERROR %@", error);
                }
            }];
        }

   	This allows other callers to register the device token with Mobile Services.

3. In the QSAppDelegate.m file, add the following import statement:

        #import "QSTodoService.h"

     This code makes the AppDelegate aware of the TodoService implementation.

4. In QSAppDelegate.m, replace the **didRegisterForRemoteNotificationsWithDeviceToken** method with the following code:

        // We have registered, so now store the device token (as a string) on the AppDelegate instance
        // taking care to remove the angle brackets first.
        - (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:
        (NSData *)deviceToken {

           // Register the APNS deviceToken with the Mobile Service Devices table.
           NSCharacterSet *angleBrackets = [NSCharacterSet characterSetWithCharactersInString:@"<>"];
           NSString *token = [[deviceToken description] stringByTrimmingCharactersInSet:angleBrackets];
        	
           QSTodoService *instance = [QSTodoService defaultService];
           [instance registerDeviceToken:token];
        }

5. In QSTodoListViewController.m, locate the **(IBAction)onAdd** method and _remove_ the following code:

        // Get a reference to the AppDelegate to easily retrieve the deviceToken
        QSAppDelegate *delegate = [[UIApplication sharedApplication] delegate];
    
        NSDictionary *item = @{
            @"text" : itemText.text,
            @"complete" : @(NO),
            // add the device token property to our todo item payload
            @"deviceToken" : delegate.deviceToken
        };
 
   	Replace this with the following code:

        // We removed the delegate; this application no longer passes the deviceToken here.
        // Remove the device token from the payload
        NSDictionary *item = @{ @"text" : itemText.text, @"complete" : @(NO) };

Your app has now been updated to use the new Devices table to store device tokens that are used to send push notifications back to the device.

## <a name="update-scripts"></a>Update server scripts

1. In the Management Portal, click the **Data** tab and then click the **Devices** table. 

   	![][3]

2. In **devices**, click the **Script** tab and select **Insert**.
   
   	![][4]

	This displays the function that is invoked when an insert occurs in the **Devices** table.

3. Replace the insert function with the following code, and then click **Save**:

        function insert(item, user, request) {
           var devicesTable = tables.getTable('Devices');
           devicesTable.where({
               token: item.token
           }).read({
               success: insertTokenIfNotFound
           });

           function insertTokenIfNotFound(existingTokens) {
               if (existingTokens.length > 0) {
                   request.respond(200, existingTokens[0]);
               } else {
                   request.execute();
               }
           }
        }

   	This script checks the **Devices** table for an existing device with the same token. The insert only proceeds when no matching device is found. This prevents duplicate device records.

4. Click **TodoItem**, click **Script** and select **Insert**. 

   	![][5]

5. Replace the insert function with the following code, and then click **Save**:

        function insert(item, user, request) {
          request.execute({
              success: function() {
                  request.respond();
                  sendNotifications();
              }
          });

          function sendNotifications() {
              var devicesTable = tables.getTable('Devices');
              devicesTable.read({
                  success: function(devices) {
                      // Set timeout to delay the notifications, 
                      // to provide time for the app to be closed 
                      // on the device to demonstrate toast notifications.
                      setTimeout(function() {
                          devices.forEach(function(device) {

                              push.apns.send(device.deviceToken, {
                                  alert: "Toast: " + item.text,
                                  payload: {
                                      inAppMessage: 
                                      "Hey, a new item arrived: '" + 
                                      item.text + "'"
                                  }
                              });
                          });
                      }, 2500);
                  }
              });
          }
      }

    This insert script sends a push notification (with the text of the inserted item) to all devices stored in the **Devices** table.

<h2><a name="test"></a><span class="short-header">Test the app</span>Test push notifications in your app</h2>

1. Press the **Run** button to build the project and start the app in an iOS capable device, then in the app, type meaningful text, such as _A new Mobile Services task_ and then click the plus (**+**) icon.

  	![][24]

3. Verify that a notification is received, then click **OK** to dismiss the notification.

  	![][25]

4. Repeat step 2 and immediately close the app, then verify that the following toast is shown.

  	![][26]

You have successfully completed this tutorial.

## Next steps

This concludes the tutorials that demonstrate the basics of working with push notifications. Consider finding out more about the following Mobile Services topics:

* [Get started with data]
  <br/>Learn more about storing and querying data using Mobile Services.

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app with Windows Account.

* [Mobile Services server script reference]
  <br/>Learn more about registering and using server scripts.

<!-- Anchors. -->
[Create the Devices table]: #create-table
[Update the app]: #update-app
[Update server scripts]: #update-scripts
[Verify the push notification behavior]: #test-app
[Next Steps]: #next-steps

<!-- Images. -->
[0]: ./media/mobile-services-ios-push-notifications-app-users/mobile-services-selection.png
[1]: ./media/mobile-services-ios-push-notifications-app-users/mobile-create-table.png
[2]: ./media/mobile-services-ios-push-notifications-app-users/mobile-create-devices-table.png
[3]: ./media/mobile-services-ios-push-notifications-app-users/mobile-portal-data-tables-devices.png
[4]: ./media/mobile-services-ios-push-notifications-app-users/mobile-insert-script-devices.png
[5]: ./media/mobile-services-ios-push-notifications-app-users/mobile-insert-script-push2.png



[24]: ./media/mobile-services-ios-push-notifications-app-users/mobile-quickstart-push2-ios.png
[25]: ./media/mobile-services-ios-push-notifications-app-users/mobile-quickstart-push3-ios.png
[26]: ./media/mobile-services-ios-push-notifications-app-users/mobile-quickstart-push4-ios.png

<!-- URLs. -->
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started-ios
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-ios
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-ios
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-ios

[Azure Management Portal]: https://manage.windowsazure.com/
