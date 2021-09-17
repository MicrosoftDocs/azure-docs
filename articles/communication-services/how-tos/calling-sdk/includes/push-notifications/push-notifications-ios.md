---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2021
ms.author: rifox
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-ios.md)]

## Set up push notifications

A mobile push notification is the pop-up notification that you get in the mobile device. For calling, we'll focus on VoIP (voice over Internet Protocol) push notifications. 

The following sections describe how to register for, handle, and unregister push notifications. Before you start those tasks, complete these prerequisites:

1. In Xcode, go to **Signing & Capabilities**. Add a capability by selecting **+ Capability**, and then select **Push Notifications**.
2. Add another capability by selecting **+ Capability**, and then select **Background Modes**.
3. Under **Background Modes**, select the **Voice over IP** and **Remote notifications** checkboxes.

:::image type="content" source="../../../../quickstarts/voice-video-calling/media/ios/xcode-push-notification.png" alt-text="Screenshot that shows how to add capabilities in Xcode." lightbox="../../../../quickstarts/voice-video-calling/media/ios/xcode-push-notification.png":::

### Register for push notifications

To register for push notifications, call `registerPushNotification()` on a `CallAgent` instance with a device registration token.

Registration for push notifications needs to happen after successful initialization. When the `callAgent` object is destroyed, `logout` will be called, which will automatically unregister push notifications.

```swift
let deviceToken: Data = pushRegistry?.pushToken(for: PKPushType.voIP)
callAgent.registerPushNotifications(deviceToken: deviceToken!) { (error) in
    if(error == nil) {
        print("Successfully registered to push notification.")
    } else {
        print("Failed to register push notification.")
    }
}
```

## Handle push notifications
To receive push notifications for incoming calls, call `handlePushNotification()` on a `CallAgent` instance with a dictionary payload.

```swift
let callNotification = PushNotificationInfo.fromDictionary(pushPayload.dictionaryPayload)

callAgent.handlePush(notification: callNotification) { (error) in
    if (error == nil) {
        print("Handling of push notification was successful")
    } else {
        print("Handling of push notification failed")
    }
}
```
## Unregister push notifications

Applications can unregister push notification at any time. Simply call the `unregisterPushNotification` method on `CallAgent`.

> [!NOTE]
> Applications are not automatically unregistered from push notifications on logout.

```swift
callAgent.unregisterPushNotification { (error) in
    if (error == nil) {
        print("Unregister of push notification was successful")
    } else {
       print("Unregister of push notification failed, please try again")
    }
}
```