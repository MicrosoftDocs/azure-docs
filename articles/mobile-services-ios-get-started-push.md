<properties pageTitle="Get started with push notifications (iOS) | Mobile Dev Center" description="Learn how to use Azure Mobile Services to send push notifications to your iOS app (legacy push)." services="mobile-services" documentationCenter="ios" manager="dwrede" editor="" authors="krisragh"/>

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-ios" ms.devlang="objective-c" ms.topic="article" ms.date="10/10/2014" ms.author="krisragh"/>

# Add push notifications to your Mobile Services app (legacy push)

<div class="dev-center-tutorial-selector sublanding">
    <a href="/en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-push" title="Windows Store C#">Windows Store C#</a>
    <a href="/en-us/documentation/articles/mobile-services-windows-store-javascript-get-started-push" title="Windows Store JavaScript">Windows Store JavaScript</a>
    <a href="/en-us/documentation/articles/mobile-services-windows-phone-get-started-push" title="Windows Phone">Windows Phone</a>
    <a href="/en-us/documentation/articles/mobile-services-ios-get-started-push" title="iOS" class="current">iOS</a>
    <a href="/en-us/documentation/articles/mobile-services-android-get-started-push" title="Android">Android</a>
	<a href="/en-us/documentation/articles/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started-push" title="Appcelerator">Appcelerator</a>
</div>

<div class="dev-center-tutorial-subselector"><a href="/en-us/documentation/articles/mobile-services-dotnet-backend-ios-get-started-push/" title=".NET backend">.NET backend</a> | <a href="/en-us/documentation/articles/mobile-services-ios-get-started-push/"  title="JavaScript backend" class="current">JavaScript backend</a></div>

This topic shows you how to use Azure Mobile Services to send push notifications to an iOS app. In this tutorial you add push notifications using the Apple Push Notification service (APNS) to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted.


>[AZURE.NOTE]This topic supports <em>existing</em> mobile services that have <em>not yet been upgraded</em> to use Notification Hubs integration. When you create a <em>new</em> mobile service, this integrated functionality is automatically enabled. For new mobile services, see [Get started with push notifications](/en-us/documentation/articles/mobile-services-javascript-backend-ios-get-started-push/).
>
>Mobile Services integrates with Azure Notification Hubs to support additional push notification functionality, such as templates, multiple platforms, and improved scale. <em>You should upgrade your existing mobile services to use Notification Hubs when possible</em>. Once you have upgraded, see this version of [Get started with push notifications](/en-us/documentation/articles/mobile-services-javascript-backend-ios-get-started-push/).

This tutorial walks you through these basic steps to enable push notifications:

1. [Generate the certificate signing request]
2. [Register your app and enable push notifications]
3. [Create a provisioning profile for the app]
3. [Configure Mobile Services]
4. [Add push notifications to the app]
5. [Update scripts to send push notifications]
6. [Insert data to receive notifications]

This tutorial requires the following:

+ [Mobile Services iOS SDK]
+ [Xcode 4.5][Install Xcode]
+ An iOS 5.0 (or later version) capable device
+ iOS Developer Program membership

   > [AZURE.NOTE] Because of push notification configuration requirements, you must deploy and test push notifications on an iOS capable device (iPhone or iPad) instead of in the emulator.

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services].

[WACOM.INCLUDE [Enable Apple Push Notifications](../includes/enable-apple-push-notifications.md)]

## Configure Mobile Services to send push requests

[WACOM.INCLUDE [mobile-services-apns-configure-push](../includes/mobile-services-apns-configure-push.md)]

## Add push notifications to your app

1. In Xcode, open the QSAppDelegate.h file and add the following property below the ***window** property:

        @property (strong, nonatomic) NSString *deviceToken;

    > [AZURE.NOTE] When dynamic schema is enabled on your mobile service, a new 'deviceToken' column is automatically added to the **TodoItem** table when a new item that contains this property is inserted.

2. In QSAppDelegate.m, replace the following handler method inside the implementation:

        - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:
        (NSDictionary *)launchOptions
        {
            // Register for remote notifications
            [[UIApplication sharedApplication] registerForRemoteNotificationTypes:
            UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound];
            return YES;
        }

3. In QSAppDelegate.m, add the following handler method inside the implementation:

        // We are registered, so now store the device token (as a string) on the AppDelegate instance
        // taking care to remove the angle brackets first.
        - (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:
        (NSData *)deviceToken {
            NSCharacterSet *angleBrackets = [NSCharacterSet characterSetWithCharactersInString:@"<>"];
            self.deviceToken = [[deviceToken description] stringByTrimmingCharactersInSet:angleBrackets];
        }

4. In QSAppDelegate.m, add the following handler method inside the implementation:

        // Handle any failure to register. In this case we set the deviceToken to an empty
        // string to prevent the insert from failing.
        - (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:
        (NSError *)error {
            NSLog(@"Failed to register for remote notifications: %@", error);
            self.deviceToken = @"";
        }

5. In QSAppDelegate.m, add the following handler method inside the implementation:  

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

5. In QSTodoListViewController.m, import the QSAppDelegate.h file so that you can use the delegate to obtain the device token:

        #import "QSAppDelegate.h"

6. In QSTodoListViewController.m, modify the **(IBAction)onAdd** action by locating the following line:

        NSDictionary *item = @{ @"text" : itemText.text, @"complete" : @(NO) };

   Replace this with the following code:

        // Get a reference to the AppDelegate to easily retrieve the deviceToken
        QSAppDelegate *delegate = [[UIApplication sharedApplication] delegate];

        NSDictionary *item = @{
            @"text" : itemText.text,
            @"complete" : @(NO),
            // add the device token property to our todo item payload
            @"deviceToken" : delegate.deviceToken
        };

   	This adds a reference to the **QSAppDelegate** to obtain the device token and then modifies the request payload to include that device token.

   	> [AZURE.NOTE] You must add this code before to the call to the <strong>addItem</strong> method.

Your app is now updated to support push notifications.

## Update the registered insert script in the Management Portal

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


   	> [AZURE.NOTE] This script delays sending the notification to give you time to close the app to receive a toast notification.

## Test push notifications in your app

1. Press the **Run** button to build the project and start the app in an iOS capable device, then click **OK** to accept push notifications

  	![][23]

    > [AZURE.NOTE] You must explicitly accept push notifications from your app. This request only occurs the first time that the app runs.

2. In the app, type meaningful text, such as _A new Mobile Services task_ and then click the plus (**+**) icon.

  	![][24]

3. Verify that a notification is received, then click **OK** to dismiss the notification.

  	![][25]

4. Repeat step 2 and immediately close the app, then verify that the following toast is shown.

  	![][26]

You have successfully completed this tutorial.

## Next steps

In this simple example a user receives a push notification with the data that was just inserted. The device token used by APNS is supplied to the mobile service by the client in the request. In the next tutorial, [Push notifications to app users], you will create a separate Devices table in which to store device tokens and send a push notification out to all stored channels when an insert occurs.

<!-- Anchors. -->
[Generate the certificate signing request]: #certificates
[Register your app and enable push notifications]: #register
[Create a provisioning profile for the app]: #profile
[Configure Mobile Services]: #configure
[Update scripts to send push notifications]: #update-scripts
[Add push notifications to the app]: #add-push
[Insert data to receive notifications]: #test
[Next Steps]:#next-steps

<!-- Images. -->
[5]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-step5.png
[6]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-step6.png
[7]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-step7.png

[9]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-step9.png
[10]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-step10.png
[17]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-step17.png
[18]: ./media/mobile-services-ios-get-started-push/mobile-services-selection.png
[19]: ./media/mobile-services-ios-get-started-push/mobile-push-tab-ios.png
[20]: ./media/mobile-services-ios-get-started-push/mobile-push-tab-ios-upload.png
[21]: ./media/mobile-services-ios-get-started-push/mobile-portal-data-tables.png
[22]: ./media/mobile-services-ios-get-started-push/mobile-insert-script-push2.png
[23]: ./media/mobile-services-ios-get-started-push/mobile-quickstart-push1-ios.png
[24]: ./media/mobile-services-ios-get-started-push/mobile-quickstart-push2-ios.png
[25]: ./media/mobile-services-ios-get-started-push/mobile-quickstart-push3-ios.png
[26]: ./media/mobile-services-ios-get-started-push/mobile-quickstart-push4-ios.png
[28]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-step18.png

[101]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-01.png
[102]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-02.png
[103]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-03.png
[104]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-04.png
[105]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-05.png
[106]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-06.png
[107]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-07.png
[108]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-08.png

[110]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-10.png
[111]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-11.png
[112]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-12.png
[113]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-13.png
[114]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-14.png
[115]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-15.png
[116]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-16.png
[117]: ./media/mobile-services-ios-get-started-push/mobile-services-ios-push-17.png

<!-- URLs. -->
[Install Xcode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
[iOS Provisioning Portal]: http://go.microsoft.com/fwlink/p/?LinkId=272456
[Mobile Services iOS SDK]: https://go.microsoft.com/fwLink/p/?LinkID=266533
[Apple Push Notification Service]: http://go.microsoft.com/fwlink/p/?LinkId=272584
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started-ios
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-ios
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-ios
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-ios
[Push notifications to app users]: /en-us/develop/mobile/tutorials/push-notifications-to-users-ios
[Authorize users with scripts]: /en-us/develop/mobile/tutorials/authorize-users-in-scripts-ios
[Azure Management Portal]: https://manage.windowsazure.com/
[apns object]: http://go.microsoft.com/fwlink/p/?LinkId=272333
