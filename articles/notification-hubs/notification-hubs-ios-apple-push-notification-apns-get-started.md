---
title: Send push notifications to iOS apps using Azure Notification Hubs | Microsoft Docs
description: In this tutorial, you learn how to use Azure Notification Hubs to send push notifications to an iOS application.
services: notification-hubs
documentationcenter: ios
keywords: push notification,push notifications,ios push notifications
author: sethmanheim
manager: femila
editor: jwargo

ms.assetid: b7fcd916-8db8-41a6-ae88-fc02d57cb914
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: mobile-ios
ms.devlang: objective-c
ms.topic: tutorial
ms.custom: mvc
ms.date: 11/21/2019
ms.author: sethm
ms.reviewer: jowargo
ms.lastreviewed: 05/21/2019
---

# Tutorial: Send push notifications to iOS apps using Azure Notification Hubs

> [!div class="op_single_selector"]
> * [Objective-C](notification-hubs-ios-apple-push-notification-apns-get-started.md)
> * [Swift](notification-hubs-ios-push-notifications-swift-apps-get-started.md)

In this tutorial, you use Azure Notification Hubs to send push notifications to an iOS application. You create a blank iOS app that receives push notifications by using the [Apple Push Notification service (APNs)](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html#//apple_ref/doc/uid/TP40008194-CH8-SW1).

In this tutorial, you take the following steps:

> [!div class="checklist"]
> * Generate the certificate signing request file
> * Request your app for push notifications
> * Create a provisioning profile for the app
> * Configure your notification hub for iOS push notifications
> * Connect your iOS app to notification hubs
> * Send test push notifications
> * Verify that your app receives notifications

The complete code for this tutorial can be found [on GitHub](https://github.com/Azure/azure-notificationhubs-ios/tree/master/Samples).

## Prerequisites

To complete this tutorial, you need the following prerequisites:

* An active Azure account. If you don't have an account, you can [create a free Azure account](https://azure.microsoft.com/free).
* [Windows Azure Messaging Framework]
* Latest version of [Xcode]
* An iOS version 10 (or later)-capable device
* [Apple Developer Program](https://developer.apple.com/programs/) membership.
  
  > [!NOTE]
  > Because of configuration requirements for push notifications, you must deploy and test push notifications on a physical iOS device (iPhone or iPad) instead of the iOS Simulator.
  
Completing this tutorial is a prerequisite for all other Notification Hubs tutorials for iOS apps.

[!INCLUDE [Notification Hubs Enable Apple Push Notifications](../../includes/notification-hubs-enable-apple-push-notifications.md)]

## Connect your iOS app to Notification Hubs

1. In Xcode, create a new iOS project and select the **Single View Application** template.

    ![Xcode - Single View Application][8]

2. When setting the options for your new project, make sure to use the same **Product Name** and **Organization Identifier** that you used when you set the bundle identifier in the Apple Developer portal.

3. Under Project Navigator, select your project name under **Targets**, then select the **Signing & Capabilities** tab. Make sure you select the appropriate **Team** for your Apple Developer account. XCode should automatically pull down the Provisioning Profile you created previously based on your bundle identifier.

    If you don't see the new provisioning profile that you created in Xcode, try refreshing the profiles for your signing identity. Click **Xcode** on the menu bar, click **Preferences**, click the **Account** tab, click the **View Details** button, click your signing identity, and then click the refresh button in the bottom-right corner.

    ![Xcode - provisioning profile][9]

4. In the **Signing & Capabilities** tab, select **+ Capability**.  Double-click **Push Notifications** to enable it.

    ![Xcode - push capabilities][12]

5. Add the Azure Notification Hubs SDK modules.

   You can integrate the Azure Notification Hubs SDK in your app by using [Cocoapods](https://cocoapods.org) or by manually adding the binaries to your project.

   - Integration via Cocoapods

     Add the following dependencies to your `podfile` to include Azure Notification Hubs SDK into your app.

     ```ruby
     pod 'AzureNotificationHubs-iOS'
     ```

     Run `pod install` to install your newly defined pod and open your `.xcworkspace`.

     > [!NOTE]
     > If you see an error such as **[!] Unable to find a specification for AzureNotificationHubs-iOS**
     >  while running `pod install`, please run `pod repo update` to get the latest pods from the Cocoapods repository, and then run `pod install`.

   - Integration via Carthage

     Add the following dependencies to your `Cartfile` to include Azure Notification Hubs SDK into your app.

     ```ruby
     github "Azure/azure-notificationhubs-ios"
     ```

     Next, update, and build dependencies:

     ```shell
     $ carthage update
     ```

     For more information about using Carthage, see the [Carthage GitHub repository](https://github.com/Carthage/Carthage).

   - Integration by copying the binaries into your project

     1. Download the [Azure Notification Hubs SDK](https://github.com/Azure/azure-notificationhubs-ios/releases) framework provided as a zip file and unzip it.

     2. In Xcode, right-click your project and click the **Add Files to** option to add the **WindowsAzureMessaging.framework** folder to your Xcode project. Select **Options** and make sure **Copy items if needed** is selected, and then click **Add**.

        ![Unzip Azure SDK][10]

6. Add a new header file to your project named **Constants.h**. To do so, right-click the project name and select **New File...**. Then select **Header File**. This file holds the constants for your notification hub. Then select **Next**. Name the file **Constants.h**.

7. Add the following code to the Constants.h file:

    ```objc
    #ifndef Constants_h
    #define Constants_h

    extern NSString* const NHInfoConnectionString;
    extern NSString* const NHInfoHubName;
    extern NSString* const NHUserDefaultTags;

    #endif /* Constants_h */
    ```

8. Add the implementation file for Constants.h. To do so, right-click the project name and select **New File...**. Select **Objective-C File**, and then select **Next**. Name the file **Constants.m**.

    ![Add .m file](media/notification-hubs-ios-get-started/new-file-objc.png)

9. Open the **Constants.m** file and replace its contents with the following code. Replace the string literal placeholders `NotificationHubConnectionString` and `NotificationHubConnectionString` with the hub name and the **DefaultListenSharedAccessSignature**, respectively, as you  previously obtained from the portal:

    ```objc
    #import <Foundation/Foundation.h>
    #import "Constants.h"

    NSString* const NHInfoConnectionString = @"NotificationHubConnectionString";
    NSString* const NHInfoHubName = @"NotificationHubName";
    NSString* const NHUserDefaultTags = @"notification_tags";
    ```

10. Open your project's **AppDelegate.h** file and replace its contents with the following code:

    ```objc
    #import <UIKit/UIKit.h>
    #import <WindowsAzureMessaging/WindowsAzureMessaging.h>
    #import <UserNotifications/UserNotifications.h> 

    @interface AppDelegate : UIResponder <UIApplicationDelegate,UNUserNotificationCenterDelegate>

    @property (strong, nonatomic) UIWindow *window;

    - (void)handleRegister;
    - (void)handleUnregister;

    @end

    ```

11. In the project's **AppDelegate.m** file, add the following `import` statements:

    ```objc
    #import "Constants.h"
    #import "NotificationDetailViewController.h"
    ```

12. Also in your **AppDelegate.m** file, add the following line of code in the `didFinishLaunchingWithOptions` method based on your version of iOS. This code registers your device handle with APNs:

    ```objc
    [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];
    ```

13. In the same **AppDelegate.m** file, replace all the code after `didFinishLaunchingWithOptions` with the following code:

    ```objc
    // Tells the app that a remote notification arrived that indicates there is data to be fetched.

    - (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))completionHandler {
        NSLog(@"Received remote (silent) notification");
        [self logNotificationDetails:userInfo];

        //
        // Let the system know the silent notification has been processed.
        //
        completionHandler(UIBackgroundFetchResultNoData);
    }

    // Tells the delegate that the app successfully registered with Apple Push Notification service (APNs).

    - (void) application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
        NSMutableSet *tags = [[NSMutableSet alloc] init];

        // Load and parse stored tags
        NSString *unparsedTags = [[NSUserDefaults standardUserDefaults] valueForKey:NHUserDefaultTags];
        if (unparsedTags.length > 0) {
            NSArray *tagsArray = [unparsedTags componentsSeparatedByString: @","];
            [tags addObjectsFromArray:tagsArray];
        }

        // Register the device with the Notification Hub.
        // If the device has not already been registered, this will create the registration.
        // If the device has already been registered, this will update the existing registration.
        //
        SBNotificationHub* hub = [self getNotificationHub];
        [hub registerNativeWithDeviceToken:deviceToken tags:tags completion:^(NSError* error) {
            if (error != nil) {
                NSLog(@"Error registering for notifications: %@", error);
            } else {
                [self showAlert:@"Registered" withTitle:@"Registration Status"];
            }
        }];
    }

    // UNUserNotificationCenterDelegate methods
    //
    // Asks the delegate how to handle a notification that arrived while the app was running in the  foreground.

    - (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler {
        NSLog(@"Received notification while the application is in the foreground");

        // The system calls this delegate method when the app is in the foreground. This allows the app to handle the notification
        // itself (and potentially modify the default system behavior).

        // Handle the notification by displaying custom UI.
        //
        [self showNotification:notification.request.content.userInfo];

        // Use 'options' to specify which default behaviors to enable.
        // - UNAuthorizationOptionBadge: Apply the notification's badge value to the app’s icon.
        // - UNAuthorizationOptionSound: Play the sound associated with the notification.
        // - UNAuthorizationOptionAlert: Display the alert using the content provided by the notification.
        //
        // In this case, do not pass UNAuthorizationOptionAlert because the notification was handled by the app.
        //
        completionHandler(UNAuthorizationOptionBadge | UNAuthorizationOptionSound);
    }

    // Asks the delegate to process the user's response to a delivered notification.
    //

    - (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)(void))completionHandler {
        NSLog(@"Received notification while the application is in the background");

        // The system calls this delegate method when the user taps or responds to the system notification.

        // Handle the notification response by displaying custom UI
        //
        [self showNotification:response.notification.request.content.userInfo];

        // Let the system know the response has been processed.
        //
        completionHandler();
    }

    // App logic and helpers

    - (SBNotificationHub *)getNotificationHub {
        NSString *hubName = [[NSBundle mainBundle] objectForInfoDictionaryKey:NHInfoHubName];
        NSString *connectionString = [[NSBundle mainBundle] objectForInfoDictionaryKey:NHInfoConnectionString];

        return [[SBNotificationHub alloc] initWithConnectionString:connectionString notificationHubPath:hubName];
    }

    - (void)handleRegister {
        UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];

        UNAuthorizationOptions options =  UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
        [center requestAuthorizationWithOptions:(options) completionHandler:^(BOOL granted, NSError * _Nullable error) {
            if (error != nil) {
                NSLog(@"Error requesting for authorization: %@", error);
            }
        }];
        [[UIApplication sharedApplication] registerForRemoteNotifications];
    }

    - (void)handleUnregister {
        //
        // Unregister the device with the Notification Hub.
        //
        SBNotificationHub *hub = [self getNotificationHub];
        [hub unregisterNativeWithCompletion:^(NSError* error) {
            if (error != nil) {
                NSLog(@"Error unregistering for push: %@", error);
            } else {
                [self showAlert:@"Unregistered" withTitle:@"Registration Status"];
            }
        }];
    }

    - (void)logNotificationDetails:(NSDictionary *)userInfo {
        if (userInfo != nil) {
            UIApplicationState state = [UIApplication sharedApplication].applicationState;
            BOOL background = state != UIApplicationStateActive;
            NSLog(@"Received %@notification: \n%@", background ? @"(background) " : @"", userInfo);
        }
    }

    - (void)showAlert:(NSString *)message withTitle:(NSString *)title {
        if (title == nil) {
            title = @"Alert";
        }
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:title message:message preferredStyle:UIAlertControllerStyleAlert];
        [alert addAction:[UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:nil]];
        [[[[UIApplication sharedApplication] keyWindow] rootViewController] presentViewController:alert animated:YES completion:nil];
    }

    - (void)showNotification:(NSDictionary *)userInfo {
        [self logNotificationDetails:userInfo];

        NotificationDetailViewController *notificationDetail = [[NotificationDetailViewController alloc] initWithUserInfo:userInfo];
        [[[[UIApplication sharedApplication] keyWindow] rootViewController] presentViewController:notificationDetail animated:YES completion:nil];
    }

    @end
    ```

    This code connects to the notification hub using the connection information you specified in **Constants.h**. It then gives the device token to the notification hub so that the notification hub can send notifications.

### NotificationDetailViewController

1. Similar the previous instructions, add another header file named **NotificationDetailViewController.h**. Replace the contents of the new header file with the following code:

    ```objc
    #import <UIKit/UIKit.h>

    NS_ASSUME_NONNULL_BEGIN

    @interface NotificationDetailViewController : UIViewController

    @property (strong, nonatomic) IBOutlet UILabel *titleLabel;
    @property (strong, nonatomic) IBOutlet UILabel *bodyLabel;
    @property (strong, nonatomic) IBOutlet UIButton *dismissButton;

    @property (strong, nonatomic) NSDictionary *userInfo;

    - (id)initWithUserInfo:(NSDictionary *)userInfo;

    @end

    NS_ASSUME_NONNULL_END
    ```

2. Add the implementation file **NotificationDetailViewController.m**. Replace the contents of the file with the following code, which implements the `UIViewController` methods:

    ```objc
    #import "NotificationDetailViewController.h"

    @interface NotificationDetailViewController ()

    @end

    @implementation NotificationDetailViewController

    - (id)initWithUserInfo:(NSDictionary *)userInfo {
        self = [super initWithNibName:@"NotificationDetail" bundle:nil];
        if (self) {
            _userInfo = userInfo;
        }
        return self;
    }

    - (void)viewDidLayoutSubviews {
        [self.titleLabel sizeToFit];
        [self.bodyLabel sizeToFit];
    }

    - (void)viewDidLoad {
        [super viewDidLoad];

        NSString *title = nil;
        NSString *body = nil;

        NSDictionary *aps = [_userInfo valueForKey:@"aps"];
        NSObject *alertObject = [aps valueForKey:@"alert"];
        if (alertObject != nil) {
            if ([alertObject isKindOfClass:[NSDictionary class]]) {
                NSDictionary *alertDict = (NSDictionary *)alertObject;
                title = [alertDict valueForKey:@"title"];
                body = [alertObject valueForKey:@"body"];
            } else if ([alertObject isKindOfClass:[NSString class]]) {
                body = (NSString *)alertObject;
            } else {
                NSLog(@"Unable to parse notification content. Unexpected format: %@", alertObject);
            }
        }

        if (title == nil) {
            title = @"<unset>";
        }

        if (body == nil) {
            body = @"<unset>";
        }

        self.titleLabel.text = title;
        self.bodyLabel.text = body;
    }

    - (IBAction)handleDismiss:(id)sender {
        [self dismissViewControllerAnimated:YES completion:nil];
    }

    @end
    ```

### ViewController

1. In the project's **ViewController.h** file, add the following `import` statements:

    ```objc
    #import <WindowsAzureMessaging/WindowsAzureMessaging.h>
    #import <UserNotifications/UserNotifications.h>
    ```

2. Also in **ViewController.h**, add the following property declarations after the `@interface` declaration:

    ```objc
    @property (strong, nonatomic) IBOutlet UITextField *tagsTextField;
    @property (strong, nonatomic) IBOutlet UIButton *registerButton;
    @property (strong, nonatomic) IBOutlet UIButton *unregisterButton;
    ```

3. In the project's **ViewController.m** implementation file, replace the contents of the file with the following code:

    ```objc
    #import "ViewController.h"
    #import "Constants.h"
    #import "AppDelegate.h"

    @interface ViewController ()

    @end

    @implementation ViewController

    // UIViewController methods

    - (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
        // Simple method to dismiss keyboard when user taps outside of the UITextField.
        [self.view endEditing:YES];
    }

    - (void)viewDidLoad {
        [super viewDidLoad];

        // Load raw tags text from storage and initialize the text field
        self.tagsTextField.text = [[NSUserDefaults standardUserDefaults] valueForKey:NHUserDefaultTags];
    }

    - (IBAction)handleRegister:(id)sender {
        // Save raw tags text in storage
        [[NSUserDefaults standardUserDefaults] setValue:self.tagsTextField.text forKey:NHUserDefaultTags];

    // Delegate processing the register action to the app delegate.
    [[[UIApplication sharedApplication] delegate] performSelector:@selector(handleRegister)];
    }

    - (IBAction)handleUnregister:(id)sender {
        [[[UIApplication sharedApplication] delegate] performSelector:@selector(handleUnregister)];
    }

    @end
    ```

4. To verify there are no failures, build and run the app on your device.

## Send test push notifications

You can test receiving notifications in your app with the *Test Send* option in the [Azure portal]. It sends a test push notification to your device.

![Azure portal - Test Send][30]

[!INCLUDE [notification-hubs-sending-notifications-from-the-portal](../../includes/notification-hubs-sending-notifications-from-the-portal.md)]

## Verify that your app receives push notifications

To test push notifications on iOS, you must deploy the app to a physical iOS device. You cannot send Apple push notifications by using the iOS Simulator.

1. Run the app and verify that registration succeeds, and then press **OK**.

    ![iOS App Push Notification Registration Test][33]

2. Next you send a test push notification from the [Azure portal], as described in the previous section.

3. The push notification is sent to all devices that are registered to receive the notifications from the particular Notification Hub.

    ![iOS App Push Notification Receive Test][35]

## Next steps

In this simple example, you broadcasted push notifications to all your registered iOS devices. To learn how to push notifications to specific iOS devices, advance to the following tutorial:

> [!div class="nextstepaction"]
>[Push notifications to specific devices](notification-hubs-ios-xplat-segmented-apns-push-notification.md)

<!-- Images. -->
[8]: ./media/notification-hubs-ios-get-started/notification-hubs-create-ios-app.png
[9]: ./media/notification-hubs-ios-get-started/notification-hubs-create-ios-app2.png
[10]: ./media/notification-hubs-ios-get-started/notification-hubs-create-ios-app3.png
[11]: ./media/notification-hubs-ios-get-started/notification-hubs-xcode-product-name.png
[12]: ./media/notification-hubs-ios-get-started/notification-hubs-enable-push.png
[30]: ./media/notification-hubs-ios-get-started/notification-hubs-test-send.png
[33]: ./media/notification-hubs-ios-get-started/notification-hubs-test1.png
[35]: ./media/notification-hubs-ios-get-started/notification-hubs-test3.png

<!-- URLs. -->
[Windows Azure Messaging Framework]: https://go.microsoft.com/fwlink/?LinkID=799698&clcid=0x409
[Mobile Services iOS SDK]: https://go.microsoft.com/fwLink/?LinkID=266533
[Submit an app page]: https://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: https://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: https://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: /develop/mobile/tutorials/get-started-ios
[Notification Hubs Guidance]: https://msdn.microsoft.com/library/jj927170.aspx
[Xcode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
[iOS Provisioning Portal]: https://go.microsoft.com/fwlink/p/?LinkId=272456
[Get started with push notifications in Mobile Services]: ../mobile-services-javascript-backend-ios-get-started-push.md
[Azure Notification Hubs Notify Users for iOS with .NET backend]: notification-hubs-aspnet-backend-ios-apple-apns-notification.md
[Use Notification Hubs to send breaking news]: notification-hubs-ios-xplat-segmented-apns-push-notification.md
[Local and Push Notification Programming Guide]: https://developer.apple.com/library/mac/#documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1
[Azure portal]: https://portal.azure.com
