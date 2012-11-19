<properties linkid="develop-mobile-tutorials-push-notifications-to-users-ios" urlDisplayName="Push Notifications to Users" pageTitle="Push Notifications to iOS app users - Windows Azure Mobile Services" metaKeywords="" metaDescription="Learn how to push notifications to app users in iOS apps that use Windows Azure Mobile Services." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="14827" ismacro="true" umb_chunkname="MobileArticleLeft" umb_chunkpath="devcenter/Menu" umb_macroalias="AzureChunkDisplayer" umb_hide="0" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

# Push notifications to users by using Mobile Services
<div class="dev-center-tutorial-selector"> 
	<a href="/en-us/develop/mobile/tutorials/push-notifications-to-users-dotnet" title="Windows Store C#">Windows Store C#</a><a href="/en-us/develop/mobile/tutorials/push-notifications-to-users-js" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/develop/mobile/tutorials/push-notifications-to-users-wp8" title="Windows Phone 8">Windows Phone 8</a><a href="/en-us/develop/mobile/tutorials/push-notifications-to-users-ios" title="iOS" class="current">iOS</a>
</div>

This topic extends the [previous push notification tutorial][Get started with push notifications] by adding a new table to store Apple Push Notification Service (APNS) tokens. These tokens can then be used to send push notifications to users of the iPhone or iPad app.  

This tutorial walks you through these steps to update push notifications in your app:

1. [Create the Devices table]
2. [Update the app]
3. [Update server scripts]
4. [Verify the push notification behavior] 

This tutorial is based on the Mobile Services quickstart and builds on the previous tutorial [Get started with push notifications]. Before you start this tutorial, you must first complete [Get started with push notifications].  

## <a name="create-table"></a><h2><span class="short-header">Create the table</span>Create the new Devices table</h2>

1. Log into the [Windows Azure Management Portal], click **Mobile Services**, and then click your app.

   ![][0]

2. Click the **Data** tab, and then click **Create**.

   ![][1]

   This displays the **Create new table** dialog.

3. Keeping the default **Anybody with the application key** setting for all permissions, type _Devices_ in **Table name**, and then click the check button.

   ![][2]

  This creates the **Devices** table, which stores the device tokens used to send push notifications separate from item data.

Next, you will modify the push notifications app to store data in this new table instead of in the **TodoItem** table.

## <a name="update-app"></a>Update your app

1. In Xcode, open the XXXXXXX file and remove the **deviceToken ** property from the **TodoItem** class. It should now look like this:

        // The original class definition

2. Replace the XXXXX event handler method with the original version of this method, as follows:

        // Back to the original save method.

3. Add the following code that creates a new **Devices** class:

        // Need an iOS equivalent of this....
	    public class Devices
        {
	        public int id { get; set; }
	        public string token { get; set; }
	    }

4. Open the AppDelegate file and replace the current implementation with the following code:

        @implementation AppDelegate

        - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
        {
            [[UIApplication sharedApplication] registerForRemoteNotificationTypes:UIRemoteNotificationTypeAlert];
            return YES;
        }

        - (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
            NSLog(@"%@", deviceToken);
            self.deviceToken = [[deviceToken description] stringByTrimmingCharactersInSet:[NSCharacterSet characterSetWithCharactersInString:@"<>"]];
        }

     This code inserts the token for the current device into the Devices table.

## <a name="update-scripts"></a>Update server scripts

1. In the Management Portal, click the **Data** tab and then click the **Devices** table. 

   ![][3]

2. In **devices**, click the **Script** tab and select **Insert**.
   
   ![][4]

   This displays the function that is invoked when an insert occurs in the **Devices** table.

3. Replace the insert function with the following code, and then click **Save**:

	    // This is just a guess....
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

        // Need to update this with the apns one...
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
                        devices.forEach(function(device) {
                            push.apns.send(device.token, {
                                payload: item.text
                            });
                        });
                    }
                });
            }
        }

    This insert script sends a push notification (with the text of the inserted item) to all devices stored in the **Devices** table.

## <a name="test-app"></a>Test the app

1. Press the **Run** button to build the project and start the app in the iPhone emulator, which is the default for this project.

2. In the app, type meaningful text, such as _Complete the tutorial_ and then click the plus (+) icon.

  ![][23]

3. Verify that a notification is received.

  ![][24]

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
[0]: ../Media/mobile-services-selection.png
[1]: ../Media/mobile-create-table.png
[2]: ../Media/mobile-create-devices-table.png
[3]: ../Media/mobile-portal-data-tables-devices.png
[4]: ../Media/mobile-insert-script-devices.png
[5]: ../Media/mobile-insert-script-push2.png
[6]: ../Media/mobile-quickstart-push1.png
[7]: ../Media/mobile-quickstart-push2.png

<!-- URLs. -->
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[Get started with Mobile Services]: ./mobile-services-get-started-ios.md
[Get started with data]: ./mobile-services-get-started-with-data-ios.md
[Get started with authentication]: ./mobile-services-get-started-with-users-ios.md
[Get started with push notifications]: ./mobile-services-get-started-with-push-ios.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/