---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2021
ms.author: rifox
---
## Considerations for mobile push notifications

Mobile push notifications are the pop-up notifications that appear on mobile devices. For calling, this article focuses on voice over Internet Protocol (VoIP) push notifications. For a guide on CallKit integration in your iOS application, see [Integrate with CallKit](../../callkit-integration.md).

> [!NOTE]
> When the application registers for push notifications and handles the incoming push notifications for a Teams user, the APIs are the same. The APIs that this article describes can also be invoked on the `CommonCallAgent` or `TeamsCallAgent` class.

[!INCLUDE [Install SDK](../install-sdk/install-sdk-ios.md)]

### Set up push notifications

Before you start the tasks of registering for, handling, and unregistering push notifications, complete this setup task:

1. In Xcode, go to **Signing & Capabilities**. Add a capability by selecting **+ Capability**, and then select **Push Notifications**.
2. Add another capability by selecting **+ Capability**, and then select **Background Modes**.
3. Under **Background Modes**, select the **Voice over IP** and **Remote notifications** checkboxes.

:::image type="content" source="../../../../quickstarts/voice-video-calling/media/ios/xcode-push-notification.png" alt-text="Screenshot that shows how to add capabilities in Xcode." lightbox="../../../../quickstarts/voice-video-calling/media/ios/xcode-push-notification.png":::

## Register for push notifications

To register for push notifications, call `registerPushNotification()` on a `CallAgent` instance by using a device registration token.

Registration for push notifications needs to happen after successful initialization. When the `callAgent` object is destroyed, `logout` is called, which automatically unregisters push notifications.

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

To receive push notifications for incoming calls, call `handlePushNotification()` on a `CallAgent` instance with a dictionary payload:

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

Applications can unregister push notification at any time. To unregister, call the `unregisterPushNotification` method on `CallAgent`.

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

## Disable internal push notifications for an incoming call

The push payload of an incoming call can be delivered to the callee in two ways:

- Using Apple Push Notification service (APNS) and registering the device token with the API mentioned earlier, `registerPushNotification` on `CallAgent` or `TeamsCallAgent`
- Registering the SDK with an internal service upon creation of `CallAgent` or `TeamsCallAgent` to get the push payload delivered

By using the property `disableInternalPushForIncomingCall` in `CallAgentOptions` or `TeamsCallAgentOptions`, it's possible to instruct the SDK to disable the delivery of the push payload via the internal push service:

```swift
let options = CallAgentOptions()
options.disableInternalPushForIncomingCall = true
```
