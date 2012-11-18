<properties linkid="develop-mobile-tutorials-get-started-with-push-ios" urlDisplayName="Get Started with Push Notifications" pageTitle="Get started with push notifications - Mobile Services" metaKeywords="" metaDescription="Learn how to use push notifications in iOS apps with Windows Azure Mobile Services." metaCanonical="" disqusComments="0" umbracoNaviHide="1" />

<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="14799" ismacro="true" umb_chunkname="MobileArticleLeft" umb_chunkpath="devcenter/Menu" umb_macroalias="AzureChunkDisplayer" umb_hide="0" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

# Get started with push notifications in Mobile Services
<div class="dev-center-tutorial-selector"> 
	<a href="/en-us/develop/mobile/tutorials/get-started-with-push-dotnet" title="Windows Store C#">Windows Store C#</a>
	<a href="/en-us/develop/mobile/tutorials/get-started-with-push-js" title="Windows Store JavaScript">Windows Store JavaScript</a>
	<a href="/en-us/develop/mobile/tutorials/get-started-with-push-wp8" title="Windows Phone 8">Windows Phone 8</a> 
	<a href="/en-us/develop/mobile/tutorials/get-started-with-push-ios" title="iOS" class="current">iOS</a>
</div>	

This topic shows you how to use Windows Azure Mobile Services to send push notifications to an iOS app. 
In this tutorial you add push notifications using the Apple Push Notification service (APNS) to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted.

   <div class="dev-callout"><b>Note</b>
   <p>This tutorial demonstrates a simplified way of sending push notifications by attaching a push notification device token to the inserted record. Be sure to follow along with the next tutorial to get a better idea of how to incorporate push notifications into your real-world apps.</p>
   </div>

This tutorial walks you through these basic steps to enable push notifications:

1. [Generate client certificates] 
2. [Register your app for push notifications]
3. [Configure Mobile Services]
4. [Add push notifications to the app]
5. [Update scripts to send push notifications]
6. [Insert data to receive notifications]

This tutorial requires the following:

+ [Mobile Services iOS SDK]
+ [XCode 4.5][Install Xcode] 
+ An iOS 5.0 (or later version) capable device
+ iOS Developer Program membership

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services]. 

The Apple Push Notification Service (APNS) uses certificates to authenticate to your mobile service. Follow these instructions to create the necessary certificates and upload it to your Mobile Service. For the official APNS feature documentation, see [Apple Push Notification Service].

<h2><a name="certificates"></a><span class="short-header">Generate certificates</span>Generate client certificates</h2>

First you must generate the required certificates.

1. From the Applications\Utilities folder, run the Keychain Access tool.

2. Click **Keychain Access**, expand **Certificate Assistant**, then click **Request a Certificate from a Certificate Authority...**.

   ![][1]

3. Type your information in the **User Email Address** and **Common Name** fields, make sure that **Saved to disk** is selected, and then click **Continue**.

  ![][2]

4. Type a name for the Certificate Signing Request (CSR) file in **Save As**, select the location in **Where**, then click **Save**.

  ![][3]
  
  This saves the CSR file in the selected location; the default location is in the Desktop. Remember the location chosen for this file.

5. Back in the Keychain Access tool, click the new private key, and select **Export**.

  ![][4]

6. Type a name for the exported private key in **Save As**, select a location in **Where**, then click **Save**.     

  ![][5]

Next, you will upload this exported private key to Apple to enable push notifications.

<h2><a name="register"></a><span class="short-header">Register your app</span>Register your app for push notifications</h2>

To be able to send push notifications to an iOS app from mobile services, you must register your application in the iOS provisioning portal.  

1. In Xcode, select the **Project** and **Targets**, and make a note of the value of **Identifier** in **iOS Application Target**. This is the bundle identifier for this application, which in the quickstart project should be _MobileServices.Quickstart_.

   ![][6]

2. If you have not already registered your app, navigate to the [iOS Provisioning Portal] at the Apple Developer Center, log on with your Apple ID, and then click **App ID**.

   ![][7]

3. Type a name for your app in **Description**, type the **Bundle Identifier** value from Step 1, then click **Submit**. 

   ![][8]

4. Locate your new app ID and click **Configure**, then click the **Configure** button for the desired kind of certificate. 

   ![][9]

   This displays the Certificate Assistant.

    <div class="dev-callout"><b>Note</b>
	<p>The sample process is used when registering certificates for both development and production environments. Just be sure to use the same type of certificate throughout the process.</p>
    </div>

5. Click **Continue** then **Choose File**, browse to the location where you saved your certificate, then click **Generate**. 

   ![][10]

   This generates the APNS SSL certificate for your app.

6. Once the certificate is generated, click **Continue**, **Download**, then **Done**. 

   ![][11]

  The signing certificate is generated and saved in your Downloads folder.

7. Back in the [iOS Provisioning Portal], select **Provisioning**, then click **New Profile**.

   ![][12] 

8. Enter a **Profile Name**, select the **Certificates** and **Devices** to use for testing, select the **App ID**, then click **Submit**.

   ![][13]

  This creates a new provisioning profile.

9. From the list of provisioning profiles, click the **Download** button for this new profile.

   ![][14]

   This downloads the profile to the local computer.

10. Back in Xcode, click **Downloads**, then double-click the downloaded profile. 

   This installs the new profile into the Xcode project.

11. In **Build Settings**, expand **Code Signing Identity**, then under **Debug** select the new profile.

   ![][15]

This ensures that the Xcode project uses the new profile for code signing. Next, you must upload the certificate to Mobile Services.

<a name="configure"></a><h2><span class="short-header">Configure the service</span>Congfigure Mobile Services to send push requests</h2>

After you have registered your app with APNS and configured your project, you must then configure your mobile service to integrate with APNS.

1. In Keychain Access, click **Login** and **Keys**, click the new certificate, then click **Export**.

   ![][16] 

  Make a note of the location of the exported certificate.


2. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your app.

   ![][18]

3. Click the **Push** tab and click **Upload**.

   ![][19]

   This displays the Upload Certificate dialog.

4. Click **File**, select the exported certificate file, enter the **Password**, make sure that the correct **Mode** is selected, click the check icon, then click **Save**.

   ![][20] 

Both your mobile service is now configured to work with APNS.

<a name="add-push"></a><h2><span class="short-header">Add push notifications</span>Add push notifications to your app</h2>

1. In Xcode, open the AppDelegate.h file and add the following property:

        @property (strong, nonatomic) NSString *deviceToken;

    <div class="dev-callout"><b>Note</b>
	<p>When dynamic schema is enabled on your mobile service, a new 'deviceToken' column is automatically added to the <strong>TodoItem</strong> table when a new item that contains this property is inserted.</p>
    </div>

2. In AppDelegate.m, add the following handler method inside the implementation: 

        - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:
        (NSDictionary *)launchOptions
        {
            // Register for remote notifications
            [[UIApplication sharedApplication] registerForRemoteNotificationTypes:
            UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound];
            return YES;
        }

3. In AppDelegate.m, add the following handler method inside the implementation: 

        // We are registered, so now store the device token (as a string) on the AppDelegate instance
        // taking care to remove the angle brackets first.
        - (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:
        (NSData *)deviceToken {
            NSCharacterSet *angleBrackets = [NSCharacterSet characterSetWithCharactersInString:@"<>"];
            self.deviceToken = [[deviceToken description] stringByTrimmingCharactersInSet:angleBrackets];
        }

4. In AppDelegate.m, add the following handler method inside the implementation: 

        // Handle any failure to register. In this case we set the deviceToken to an empty
        // string to prevent the insert from failing.
        - (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:
        (NSError *)error {
            NSLog(@"Failed to register for remote notifications: %@", error);
            self.deviceToken = @"";
        }

5. In AppDelegate.m, add the following handler method inside the implementation:  

        // Because toast alerts don't work when the app is running, the app handles them.
        // This uses the userInfo in the payload to display a UIAlertView.
        - (void)application:(UIApplication *)application didReceiveRemoteNotification:
        (NSDictionary *)userInfo {
            NSLog(@"%@", userInfo);
            UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Notification" message:
            [userInfo objectForKey:@"inAppMessage"] delegate:nil cancelButtonTitle:
            @"OK" otherButtonTitles:nil, nil];
            [alert show];
        }

5. In TodoListController.m, import the AppDelegate.h file so that you can use the delegate to obtain the device token: 

        #import "AppDelegate.h"

6. In TodoListController.m, locate the following code block in the **(IBAction)onAdd** action method declaration: 

        if (itemText.text.length  == 0) {
            return;
        }
 
   Just after this code block, insert the following code:

        // Get a reference to the AppDelegate to easily retrieve the deviceToken
        AppDelegate *delegate = [[UIApplication sharedApplication] delegate];
    
        NSDictionary *item = @{
            @"text" : itemText.text,
            @"complete" : @(NO),
            // add the device token property to our todo item payload
            @"deviceToken" : delegate.deviceToken
        };

   This adds a reference to the **AppDelegate** to obtain the device token and then modifies the request payload to include that device token.

   <div class="dev-callout"><b>Note</b>
   <p>You must add this code before to the <strong>addItem</strong> call</p>
   </div>

Your app is now updated to support push notifications.

<h2><a name="update-scripts"></a><span class="short-header">Update the insert script</span>Update the registered insert script in the Management Portal</h2>

1. In the Management Portal, click the **Data** tab and then click the **TodoItem** table. 

   ![][21]

2. In **todoitem**, click the **Script** tab and select **Insert**.
   
  ![][22]

   This displays the function that is invoked when an insert occurs in the **TodoItem** table.

3. Replace the insert function with the following code, and then click **Save**:

        function insert(item, user, request) {
            request.execute({
                success: function() {
                    // Write to the response and then send the notification in the background
                    request.respond();
                    push.apns.send(item.deviceToken, {
                        payload: item.text
                    }, {
                        success: function(pushResponse) {
                            console.log("Sent push:", pushResponse);
                        }
                    });
                }
            });
        }

   This registers a new insert script, which uses the [apns object] to send a push notification (the inserted text) to the device provided in the insert request.

<h2><a name="test"></a><span class="short-header">Test the app</span>Test push notifications in your app</h2>

1. Press the **Run** button to build the project and start the app in the iPhone emulator, which is the default for this project.

2. In the app, type meaningful text, such as _Complete the tutorial_ and then click the plus (+) icon.

  ![][23]

3. Verify that a notification is received.

  ![][24]

## <a name="next-steps"> </a>Next steps

In this simple example a user receives a push notification with the data that was just inserted. The device token used by APNS is supplied to the mobile service by the client in the request. In the next tutorial, [Push notifications to app users], you will create a separate Devices table in which to store device tokens and send a push notification out to all stored channels when an insert occurs. 

<!-- Anchors. -->
[Generate client certificates]: #certificates
[Register your app for push notifications]: #register
[Configure Mobile Services]: #configure
[Update scripts to send push notifications]: #update-scripts
[Add push notifications to the app]: #add-push
[Insert data to receive notifications]: #test
[Next Steps]:#next-steps

<!-- Images. -->
[1]: ../Media/mobile-services-ios-push-step2.png
[2]: ../Media/mobile-services-ios-push-step3.png
[3]: ../Media/mobile-services-ios-push-step4.png
[18]: ../Media/mobile-services-selection.png
[19]: ../Media/mobile-push-tab-ios.png
[20]: ../Media/mobile-push-tab-ios-upload.png
[21]: ../Media/mobile-portal-data-tables.png
[22]: ../Media/mobile-insert-script-push2.png


<!-- URLs. -->
[Install Xcode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
[iOS Provisioning Portal]: http://go.microsoft.com/fwlink/p/?LinkId=272456
[Mobile Services iOS SDK]: https://go.microsoft.com/fwLink/p/?LinkID=266533
[Apple Push Notification Service]: http://go.microsoft.com/fwlink/p/?LinkId=272584
[Get started with Mobile Services]: ./mobile-services-get-started-ios.md
[Get started with data]: ./mobile-services-get-started-with-data-ios.md
[Get started with authentication]: ./mobile-services-get-started-with-users-ios.md
[Get started with push notifications]: ./mobile-services-get-started-with-push-ios.md
[Push notifications to app users]: ./mobile-services-push-notifications-to-app-users-ios.md
[Authorize users with scripts]: ./mobile-services-authorize-users-ios.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[Windows Developer Preview registration steps for Mobile Services]: ../HowTo/mobile-services-windows-developer-preview-registration.md
[apns object]: http://go.microsoft.com/fwlink/p/?LinkId=272333
