---
description: In this tutorial how to use the Calling composite on iOS.
author: iaulakh

ms.author: iaulakh
ms.date: 12/19/2023
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-ios) for iOS and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-calling).

## Set up push notifications

A mobile push notification is the pop-up notification that you get in the mobile device. For calling, we'll focus on VoIP (voice over Internet Protocol) push notifications. 

The following sections describe how to register for, handle, and unregister push notifications. Before you start those tasks, complete these prerequisites:

1. In Xcode, go to **Signing & Capabilities**. Add a capability by selecting **+ Capability**, and then select **Push Notifications**.
2. Add another capability by selecting **+ Capability**, and then select **Background Modes**.
3. Under **Background Modes**, select the **Voice over IP** and **Remote notifications** checkboxes.

### Register for push notification
To register for push notifications, the application needs to call `registerPushNotification()` on a `CallComposite` instance with a device registration token.

You can skip `registerPushNotification` to avoid current limitation of this by using Event Grid [Current limitations with the Push Notification model](https://learn.microsoft.com/en-us/azure/communication-services/tutorials/add-voip-push-notifications-event-grid).

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

### Handle push notification

To receive push notifications for incoming calls, call `handlePushNotification()` on a `CallComposite` instance with a dictionary payload.

On handle push, CallKit notification will be received to accept and decline call.

```swift
    // app is in background
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
                // handle push notification
                // you do not need to wait for ACS token to handle push as 
                // Communication common receives callback function to get token
            }
        }
    }

    // app is in foreground
    let pushNotificationInfo = CallCompositePushNotificationInfo(pushNotificationInfo: dictionaryPayload)
    let displayName = "display name"
    let remoteOptions = RemoteOptions(for: pushNotificationInfo,
                                        credential: credential,
                                        displayName: displayName,
                                        callKitOptions: callKitOptions)
    try await callComposite.handlePushNotification(remoteOptions: remoteOptions)
```

### Register for incoming call notification

To receive incoming call notification after `handlePushNotification` subscribe to `IncomingCallEvent` and `IncomingCallEndEvent`.

```swift
    let onIncomingCall: (CallCompositeIncomingCallInfo) -> Void = { [] _ in
        // on incoming call
    }
    let onIncomingCallEnded: (CallCompositeIncomingCallEndedInfo) -> Void = { [] _ in
        // on incoming call ended
    }

    callComposite.events.onIncomingCall = onIncomingCall
    callComposite.events.onIncomingCallEnded = onIncomingCallEnded
```

### Dial other participants

To start call with other participants, create `CallCompositeStartCallOptions` with participants raw id's from `CommunicationIdentity` and `launch`.

```swift
    let startCallOptions = CallCompositeStartCallOptions(participants: /*list of participants mri's*/)
    let remoteOptions = RemoteOptions(for: startCallOptions,
                                        credential: credential,
                                        displayName: "DISPLAY_NAME",
                                        callKitOptions: callKitOptions)
    callComposite.launch(remoteOptions: remoteOptions,
                         localOptions: localOptions)
```
