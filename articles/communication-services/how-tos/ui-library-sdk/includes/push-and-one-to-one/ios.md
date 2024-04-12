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

A mobile push notification is the pop-up notification that you get in the mobile device. For calling, this article focuses on voice over Internet Protocol (VoIP) push notifications.

The following sections describe how to register for, handle, and unregister push notifications. Before you start those tasks, complete these prerequisites:

1. In Xcode, go to **Signing & Capabilities**. Add a capability by selecting **+ Capability**, and then select **Push Notifications**.
2. Add another capability by selecting **+ Capability**, and then select **Background Modes**.
3. Under **Background Modes**, select the **Voice over IP** and **Remote notifications** checkboxes.

### Register for push notifications

To register for push notifications, the application needs to call `registerPushNotification()` on a `CallComposite` instance with a device registration token.

To avoid current limitations, you can skip `registerPushNotification` by using Azure Event Grid for push notifications. For more information, see [Connect calling native push notifications with Azure Event Grid](/azure/communication-services/tutorials/add-voip-push-notifications-event-grid).

```swift
    let deviceToken: Data = pushRegistry?.pushToken(for: PKPushType.voIP)
    let displayName = "DISPLAY_NAME"
    let notificationOptions = CallCompositePushNotificationOptions(
        deviceToken: deviceToken,
        credential: credential,
        displayName: displayName,
        callKitOptions: callKitOptions) // CallKit options
    try await callComposite.registerPushNotification(notificationOptions: notificationOptions)

```

### Handle push notifications

To receive push notifications for incoming calls, call `handlePushNotification()` on a `CallComposite` instance with a dictionary payload.

When you use `handlePushNotification()`, you get a CallKit notification to accept or decline calls.

```swift
    // App is in the background
    let pushNotificationInfo = CallCompositePushNotificationInfo(pushNotificationInfo: dictionaryPayload)
    let cxHandle = CXHandle(type: .generic, value: "\(pushNotificationInfo.callId)")
    let cxProvider = CallCompositeCallKitOption.getDefaultCXProviderConfiguration()
    let remoteInfo = CallCompositeCallKitRemoteInfo(displayName: pushNotificationInfo.fromDisplayName,
                                                    cxHandle: cxHandle)
    let callKitOptions = CallCompositeCallKitOption(cxProvideConfig: cxProvider,
                                                    isCallHoldSupported: true,
                                                    remoteInfo: remoteInfo)
    CallComposite.reportIncomingCall(callKitOptions: callKitOptions,
                                        callNotification: pushNotificationInfo) { result in
        if case .success() = result {
            DispatchQueue.global().async {
                // Handle push notification
                // You don't need to wait for a Communication Services token to handle the push because 
                // Communication Services commonly receives a callback function to get the token
            }
        }
    }

    // App is in the foreground
    let pushNotificationInfo = CallCompositePushNotificationInfo(pushNotificationInfo: dictionaryPayload)
    let displayName = "display name"
    let remoteOptions = RemoteOptions(for: pushNotificationInfo,
                                        credential: credential,
                                        displayName: displayName,
                                        callKitOptions: callKitOptions)
    try await callComposite.handlePushNotification(remoteOptions: remoteOptions)
```

### Register for incoming call notifications

To receive incoming call notifications after `handlePushNotification`, subscribe to `IncomingCallEvent` and `IncomingCallEndEvent`.

```swift
    let onIncomingCall: (CallCompositeIncomingCallInfo) -> Void = { [] _ in
        // Incoming call
    }
    let onIncomingCallEnded: (CallCompositeIncomingCallEndedInfo) -> Void = { [] _ in
        // Incoming call ended
    }

    callComposite.events.onIncomingCall = onIncomingCall
    callComposite.events.onIncomingCallEnded = onIncomingCallEnded
```

### Dial other participants

To start calls with other participants, create `CallCompositeStartCallOptions` with participants' raw IDs from `CommunicationIdentity` and `launch`.

```swift
    let startCallOptions = CallCompositeStartCallOptions(participants: <list of participant IDs>)
    let remoteOptions = RemoteOptions(for: startCallOptions,
                                        credential: credential,
                                        displayName: "DISPLAY_NAME",
                                        callKitOptions: callKitOptions)
    callComposite.launch(remoteOptions: remoteOptions,
                         localOptions: localOptions)
```
