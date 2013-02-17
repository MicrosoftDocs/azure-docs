<properties linkid="develop-mobile-tutorials-get-started-with-push-android" urlDisplayName="Get Started with Push Notifications" pageTitle="Get started with push notifications - Mobile Services" metaKeywords="" metaDescription="Learn how to use push notifications in Android apps with Windows Azure Mobile Services." metaCanonical="" disqusComments="0" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu-android.md" />

# Get started with push notifications in Mobile Services
<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/develop/mobile/tutorials/get-started-with-push-dotnet" title="Windows Store C#">Windows Store C#</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-js" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-wp8" title="Windows Phone 8">Windows Phone 8</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-ios" title="iOS">iOS</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-android" title="Android" class="current">Android</a></div>

<p>This topic shows you how to use Windows Azure Mobile Services to send push notifications to an Android app. In this tutorial you add push notifications using the Apple Push Notification service (APNS) to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted.</p>

   <div class="dev-callout"><b>Note</b>
   <p>This tutorial demonstrates a simplified way of sending push notifications by attaching a push notification device token to the inserted record. Be sure to follow along with the next tutorial to get a better idea of how to incorporate push notifications into your real-world apps.</p>
   </div>

This tutorial walks you through these basic steps to enable push notifications:

1. [Register your app for push notifications]
2. [Configure Mobile Services]
2. [Add push notifications to the app]
3. [Update scripts to send push notifications]
4. [Insert data to receive notifications]

This tutorial requires the following:

+ [Mobile Services Android SDK]
+ a

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services]. 

The Apple Push Notification Service (APNS) uses certificates to authenticate your mobile service. Follow these instructions to create the necessary certificates and upload it to your Mobile Service. For the official APNS feature documentation, see [Apple Push Notification Service].

<h2><a name="register"></a><span class="short-header">Register your app</span>Register your app for push notifications</h2>

<div class="dev-callout"><b>Note</b>
<p>To complete the procedure in this topic, you must have a Google account that has a verified email address. To create a new Google account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkId=268302" target="_blank">accounts.google.com</a>.</p>
</div> 

1. Navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkId=268303" target="_blank">Google apis</a> web site, sign-in with your Google account credentials, and then click **Create project...**.

   ![][1]   

	<div class="dev-callout"><b>Note</b>
	<p>When you already have an existing project, you are directed to the <strong>Dashboard</strong> page after login. To create a new project from the Dashboard, expand <strong>API Project</strong>, click <strong>Create...</strong> under <strong>Other projects</strong>, then enter a project name and click <strong>Create project</strong>.</p>
    </div>

2. In the URL of the page, make a note of the integer value after `#project:`. 

	This is your project number, which is used as the sender ID.

3. Type a name for your app in **Description**, enter the value _MobileServices.Quickstart_ in **Bundle Identifier**, then click **Submit**. 

   ![][2]

   This generates your app ID.

    <div class="dev-callout"><b>Note</b>
	<p>If you choose to supply a <strong>Bundle Identifier</strong> value other than <i>MobileServices.Quickstart</i>, you must also update the bundle identifier value in your Xcode project.</p>
    </div>

4. Locate the app ID that you just created, then click **Configure**. 

   ![][3]

5. Check the **Enable for Apple Push Notification service** check box, then click the **Continue** button for the **Development Push SSL Certificate**.

   ![][4]

   This displays the Apple Push Notification service SSL Certificate Assistant. 

    <div class="dev-callout"><b>Note</b>
	<p>This tutorial uses a development certificate. The same process is used when registering a production certificate. Just make sure that you set the same certificate type when you upload the certificate to Mobile Services.</p>
    </div>

6. Click **Browse**, browse to the location where you saved the CSR file that you created in the first task, then click **Generate**. 

  ![][8]

7. After the certificate is created by the portal, click **Continue** and on the next screen click **Download**. 
 
   This downloads the signing certificate and saves it to your computer in your Downloads folder. 

  ![][9]

    <div class="dev-callout"><b>Note</b>
	<p>By default, the downloaded file a development certificate is named <strong>aps_development.cer</strong>.</p>
    </div>

8. Double-click the downloaded push certificate **aps_development.cer**.

   This installs the new certificate in the Keychain, as shown below:

   ![][10]

    <div class="dev-callout"><b>Note</b>
	<p>The name in your certificate might be different, but it will be prefixed with <strong>Apple Development iOS Push Notification Services:</strong>.</p>
    </div>

Later, you will use this certificate to generate a .p12 file and upload it to Mobile Services to enable authentication with APNS.

<a name="configure"></a><h2><span class="short-header">Configure the service</span>Configure Mobile Services to send push requests</h2>

After you have registered your app with APNS and configured your project, you must next configure your mobile service to integrate with APNS.

1. In Keychain Access, right-click the new certificate, click **Export**, name your file QuickstartPusher, select the **.p12** format, then click **Save**.

   ![][28]

  Make a note of the file name and location of the exported certificate.

    <div class="dev-callout"><b>Note</b>
	<p>This tutorial creates a QuickstartPusher.p12 file. Your file name and location might be different.</p>
    </div>

2. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your app.

   ![][18]

3. Click the **Push** tab and click **Upload**.

   ![][19]

   This displays the Upload Certificate dialog.

4. Click **File**, select the exported certificate QuickstartPusher.p12 file, enter the **Password**, make sure that the correct **Mode** is selected, click the check icon, then click **Save**.

   ![][20] 

    <div class="dev-callout"><b>Note</b>
	<p>This tutorial uses developement certificates.</p>
    </div>

Both your mobile service is now configured to work with APNS.

<a name="add-push"></a><h2><span class="short-header">Add push notifications</span>Add push notifications to your app</h2>

1. In Xcode, open the AppDelegate.h file and add the following property below the ***window** property:

        @property (strong, nonatomic) NSString *deviceToken;

    <div class="dev-callout"><b>Note</b>
	<p>When dynamic schema is enabled on your mobile service, a new 'deviceToken' column is automatically added to the <strong>TodoItem</strong> table when a new item that contains this property is inserted.</p>
    </div>

2. In AppDelegate.m, replace the following handler method inside the implementation: 

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

6. In TodoListController.m, modify the **(IBAction)onAdd** action by locating the following line: 

        NSDictionary *item = @{ @"text" : itemText.text, @"complete" : @(NO) }; 
 
   Replace this with the following code:

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
   <p>You must add this code before to the call to the <strong>addItem</strong> method.</p>
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
            request.execute();
            // Set timeout to delay the notification, to provide time for the 
            // app to be closed on the device to demonstrate toast notifications
            setTimeout(function() {
                push.apns.send(item.deviceToken, {
                    alert: "Toast: " + item.text,
                    payload: {
                        inAppMessage: "Hey, a new item arrived: '" + item.text + "'"
                    }
                });
            }, 2500);
        }

   This registers a new insert script, which uses the [apns object] to send a push notification (the inserted text) to the device provided in the insert request. 


   <div class="dev-callout"><b>Note</b>
   <p>This script delays sending the notification to give you time to close the app to receive a toast notification.</p>
   </div> 

<h2><a name="test"></a><span class="short-header">Test the app</span>Test push notifications in your app</h2>

1. Press the **Run** button to build the project and start the app in an Android capable device, then click **OK** to accept push notifications

  ![][23]

    <div class="dev-callout"><b>Note</b>
    <p>You must explicitly accept push notifications from your app. This request only occurs the first time that the app runs.</p>
    </div>

2. In the app, type meaningful text, such as _A new Mobile Services task_ and then click the plus (**+**) icon.

  ![][24]

3. Verify that a notification is received, then click **OK** to dismiss the notification.

  ![][25]

4. Repeat step 2 and immediately close the app, then verify that the following toast is shown.

  ![][26]

You have successfully completed this tutorial.

## <a name="next-steps"> </a>Next steps

In this simple example a user receives a push notification with the data that was just inserted. The device token used by APNS is supplied to the mobile service by the client in the request. In the next tutorial, [Push notifications to app users], you will create a separate Devices table in which to store device tokens and send a push notification out to all stored channels when an insert occurs. 

<!-- Anchors. -->
[Register your app for push notifications]: #register
[Configure Mobile Services]: #configure
[Update scripts to send push notifications]: #update-scripts
[Add push notifications to the app]: #add-push
[Insert data to receive notifications]: #test
[Next Steps]:#next-steps

<!-- Images. -->
[1]: ../Media/mobile-services-google-developers.png
[18]: ../Media/mobile-services-selection.png
[19]: ../Media/mobile-push-tab-android.png
[20]: ../Media/mobile-push-tab-android-upload.png
[21]: ../Media/mobile-portal-data-tables.png
[22]: ../Media/mobile-insert-script-push2.png
[23]: ../Media/mobile-quickstart-push1-android.png
[24]: ../Media/mobile-quickstart-push2-android.png
[25]: ../Media/mobile-quickstart-push3-android.png
[26]: ../Media/mobile-quickstart-push4-android.png
[28]: ../Media/mobile-services-android-push-step18.png

<!-- URLs. -->
[Google apis]: http://go.microsoft.com/fwlink/p/?LinkId=268303
[Android Provisioning Portal]: http://go.microsoft.com/fwlink/p/?LinkId=272456
[Mobile Services Android SDK]: https://go.microsoft.com/fwLink/p/?LinkID=266533
[Get started with Mobile Services]: ../tutorials/mobile-services-get-started-android.md
[Get started with data]: ../tutorials/mobile-services-get-started-with-data-android.md
[Get started with authentication]: ../tutorials/mobile-services-get-started-with-users-android.md
[Get started with push notifications]: ../tutorials/mobile-services-get-started-with-push-android.md
[Push notifications to app users]: ../tutorials/mobile-services-push-notifications-to-app-users-android.md
[Authorize users with scripts]: ../tutorials/mobile-services-authorize-users-android.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[Windows Developer Preview registration steps for Mobile Services]: ../HowTo/mobile-services-windows-developer-preview-registration.md
