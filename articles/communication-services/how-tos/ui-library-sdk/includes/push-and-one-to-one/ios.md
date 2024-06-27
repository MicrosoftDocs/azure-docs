---
description: Learn how to use the Calling composite on iOS.
author: iaulakh

ms.author: iaulakh
ms.date: 12/19/2023
ms.topic: include
ms.service: azure-communication-services
---

For more information, see the [open-source iOS UI Library](https://github.com/Azure/communication-ui-library-ios) and the [sample application code](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-calling).

### Set up push notifications

A mobile push notification is the pop-up notification that you get in the mobile device. This article focuses on voice over Internet Protocol (VoIP) push notifications.

The following sections describe how to register for, handle, and unregister push notifications. Before you start those tasks, complete these prerequisites:

1. In Xcode, go to **Signing & Capabilities**. Add a capability by selecting **+ Capability**, and then select **Push Notifications**.
2. Add another capability by selecting **+ Capability**, and then select **Background Modes**.
3. Under **Background Modes**, select the **Voice over IP** and **Remote notifications** checkboxes.

### Add incoming notifications to your mobile app

Azure Communication Services integrates with [Azure Event Grid](../../../../../event-grid/overview.md) and [Azure Notification Hubs](../../../../../notification-hubs/notification-hubs-push-notification-overview.md), so you can [add push notifications](../../../../concepts/notifications.md) to your apps in Azure. 

### Register/unregister for notification hub push notifications

To register for push notifications, the application needs to call `registerPushNotifications()` on a `CallComposite` instance with a device registration token.

```swift
    // to register
    let deviceToken: Data = pushRegistry?.pushToken(for: PKPushType.voIP)
    callComposite.registerPushNotifications(
        deviceRegistrationToken: deviceToken) { result in
        switch result {
            case .success:
                // success
            case .failure(let error):
                // failure
        }
    }

    // to unregister
    callComposite.unregisterPushNotification()
```

### Handle push notifications received from Event Grid or notification hub

To receive push notifications for incoming calls, call `handlePushNotification()` on a `CallComposite` instance with a dictionary payload.

When you use `handlePushNotification()` and CallKit options are set, you get a CallKit notification to accept or decline calls.

```swift
    // App is in the background
    // push notification contains from/to communication identifiers and event type
    let pushNotification = PushNotification(data: payload.dictionaryPayload)
    let callKitOptions = CallKitOptions(...//CallKit options)
    CallComposite.reportIncomingCall(pushNotification: pushNotification,
                                    callKitOptions: callKitOptions) { result in
        if case .success() = result {
            DispatchQueue.global().async {
                // You don't need to wait for a Communication Services token to handle the push because 
                // Communication Services common receives a callback function to get the token with refresh options
                // create call composite and handle push notification
                callComposite.handlePushNotification(pushNotification: pushNotification)
            }
        }
    }

    // App is in the foreground
    let pushNotification = PushNotification(data: dictionaryPayload)
    callComposite.handlePushNotification(pushNotification: pushNotification) { result in
        switch result {
            case .success:
                // success
            case .failure(let error):
                // failure
        }
    }
```

### Register for incoming call notifications on handle push

To receive incoming call notifications after `handlePushNotification`, subscribe to `onIncomingCall` and `onIncomingCallCancelled`. `IncomingCall` contains the incoming callId and caller information. `IncomingCallCancelled` contains callId and call cancellation code [Troubleshooting in Azure Communication Services](../../../../concepts/troubleshooting-info.md#calling-sdk-error-codes).

```swift
    let onIncomingCall: (IncomingCall) -> Void = { [] incomingCall in
        // Incoming call id and caller info
    }
    let onIncomingCallEnded: (IncomingCallCancelled) -> Void = { [] incomingCallCancelled in
        // Incoming call cancelled code with callId
    }
    callComposite.events.onIncomingCall = onIncomingCall
    callComposite.events.onIncomingCallEnded = onIncomingCallEnded
```

### Disable internal push for incoming call

To receive push notifications only from `EventGrid` and `APNS` set `disableInternalPushForIncomingCall` to true in `CallCompositeOptions`. If `disableInternalPushForIncomingCall` is true, push notification event from ui library received only when `handlePushNotification` will be called. The option `disableInternalPushForIncomingCall` helps to stop receiving notifications from `CallComposite` in foreground mode. This setting doesn't control `EventGrid` and `NotificationHub` settings.

```swift
    let options = CallCompositeOptions(disableInternalPushForIncomingCall: true)
```

### Launch composite on incoming call accepted from calling SDK CallKit
The Azure Communication Services Calling iOS SDK supports CallKit integration. You can enable this integration in the UI Library by configuring an instance of `CallCompositeCallKitOption`. For more information, see [Integrate with CallKit](../../../calling-sdk/callkit-integration.md).

Subscribe to `onIncomingCallAcceptedFromCallKit` if CallKit from calling SDK is enabled. On call accepted, launch `callComposite` with call ID.

```swift
    let onIncomingCallAcceptedFromCallKit: (callId) -> Void = { [] callId in
        // Incoming call accepted call id
    }
    
    callComposite.events.onIncomingCallAcceptedFromCallKit = onIncomingCallAcceptedFromCallKit

    // launch composite with/without local options
    // Note: as call is already accepted, setup screen will not be displayed
    callComposite.launch(callIdAcceptedFromCallKit: callId)
```

### Handle calls with CallComposite 

To accept calls, make a call to `accept`. To decline calls, make a call to `reject`.

```swift
// Accept call
callComposite.accept(incomingCallId, 
                     ... // CallKit and local options
                     )

// Decline call
callComposite.reject(incomingCallId)
```

### Dial other participants

To start calls with other participants, launch `callComposite` with participants' list of `CommunicationIdentifier`.

```swift
    // [CommunicationIdentifier]
    // use createCommunicationIdentifier(fromRawId: "raw id")
    callComposite.launch(participants: <list of CommunicationIdentifier>,
                         localOptions: localOptions)
```
