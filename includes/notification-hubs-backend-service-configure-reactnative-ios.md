---
 author: alexeystrakh
 ms.author: alstrakh
 ms.date: 06/11/2020
 ms.service: notification-hubs
 ms.topic: include
---


### Configure required iOS packages

The package is [automatically linked](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) when building the app. All you need to do is to install the native pods:

```bash
npx pod-install
```

### Configure Info.plist and Entitlements.plist

1. Go into your "PushDemo/ios" folder and open "PushDemo.xcworkspace" workspace, select the top project "PushDemo" and select the "Signing & Capabilities" tab.

1. Update Bundle Identifier to match the value used in the provisioning profile.

1. Add two new Capabilities using the - "+" button:

    - Background Mode capability and tick Remote Notifications.
    - Push Notifications capability

### Handle push notifications for iOS

1. Open "AppDelegate.h" and add the following import:

    ```objective-c
    #import <UserNotifications/UNUserNotificationCenter.h>
    ```

1. Update list of protocols, supported by the "AppDelegate", by adding `UNUserNotificationCenterDelegate`:

    ```objective-c
    @interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>
    ```

1. Open "AppDelegate.m" and configure all the required iOS callbacks:

    ```objective-c
    #import <UserNotifications/UserNotifications.h>
    #import <RNCPushNotificationIOS.h>

    ...

    // Required to register for notifications
    - (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
    {
     [RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];
    }

    // Required for the register event.
    - (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
    {
     [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
    }

    // Required for the notification event. You must call the completion handler after handling the remote notification.
    - (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
    fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
    {
      [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
    }

    // Required for the registrationError event.
    - (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
    {
     [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
    }

    // IOS 10+ Required for localNotification event
    - (void)userNotificationCenter:(UNUserNotificationCenter *)center
    didReceiveNotificationResponse:(UNNotificationResponse *)response
             withCompletionHandler:(void (^)(void))completionHandler
    {
      [RNCPushNotificationIOS didReceiveNotificationResponse:response];
      completionHandler();
    }

    // IOS 4-10 Required for the localNotification event.
    - (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
    {
     [RNCPushNotificationIOS didReceiveLocalNotification:notification];
    }

    //Called when a notification is delivered to a foreground app.
    -(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
    {
      completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
    }
    ```
