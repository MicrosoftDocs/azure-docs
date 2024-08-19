---
title: Integrate CallKit into the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Use the Azure Communication Services UI Library to integrate CallKit.
author: iaulakh
ms.author: iaulakh
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 12/19/2023
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios
---

# Integrate CallKit into the UI Library

The Azure Communication Services UI Library provides out-of-the-box support for CallKit. Developers can provide their own configuration for CallKit to be used for the UI Library.

In this article, you learn how to set up CallKit correctly by using the UI Library in your application.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the call client. [Get a user access token](../../quickstarts/identity/access-tokens.md).
- Optional: Completion of the [QuickStart for getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md).

For more information, see the [open-source iOS UI Library](https://github.com/Azure/communication-ui-library-ios) and the [sample application code](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-calling).

### Set up CallKit integration

The Azure Communication Services Calling iOS SDK supports CallKit integration. You can enable this integration in the UI Library by configuring an instance of `CallCompositeCallKitOption`. For more information, see [Integrate with CallKit](../calling-sdk/callkit-integration.md).

### Specify call recipient info for outgoing calls

To specify outgoing call info, create an instance of `CallKitRemoteInfo`. If you don't provide `CallKitRemoteInfo`, the participant identifier's raw value is displayed by default.

Assign a value for `displayName` to customize the display name for caller. The value specified in `CallKitRemoteInfo` is exactly how it appears in the last-dialed call log.

Also assign the `cxHandle` value. It's what the application receives when the user calls back on that contact.

```swift
let cxHandle = CXHandle(type: .generic, value: "VALUE_TO_CXHANDLE")
let callKitRemoteInfo = CallKitRemoteInfo(displayName: "DISPLAY_NAME", handle: cxHandle)
callComposite.launch(..., // Locator for Azure Communication Service
                     callKitRemoteInfo: callKitRemoteInfo)
```

### Specify call recipient info for incoming calls

To specify incoming call caller info, create an instance of `CallKitOptions`. If you don't provide `CallKitOptions`, the participant identifier's raw value is displayed by default.

Assign a value for `provideRemoteInfo` to customize the display name for caller. The value specified in `CallKitRemoteInfo` is exactly how it appears in the last-dialed call log.

Also assign the `cxHandle` value. It's what the application receives when the user calls back on that contact.

```swift
public func incomingCallRemoteInfo(info: Caller) -> CallKitRemoteInfo {
    let cxHandle = CXHandle(type: .generic, value: "VALUE_TO_CXHANDLE")
    var remoteInfoDisplayName = "DISPLAY_NAME"
    let callKitRemoteInfo = CallKitRemoteInfo(displayName: remoteInfoDisplayName,
                                                            handle: cxHandle)
    return callKitRemoteInfo
}
```

### Configure providers

As required, provide a `CXProviderConfiguration` instance to `CallKitOptions`. For more information, see the [Apple developer documentation about CXProviderConfiguration](https://developer.apple.com/documentation/callkit/cxproviderconfiguration).

```swift
let providerConfig = CXProviderConfiguration()
providerConfig.supportsVideo = true
providerConfig.maximumCallGroups = 1
providerConfig.maximumCallsPerCallGroup = 1
providerConfig.includesCallsInRecents = true
providerConfig.supportedHandleTypes = [.phoneNumber, .generic]
```

### Configure an audio session

Configure an audio session to be called before placing or accepting incoming call and before resuming a call that's on hold. For more information, see the [Apple developer documentation about AVAudioSession](https://developer.apple.com/documentation/avfaudio/avaudiosession).

```swift
public func configureAudioSession() -> Error? {
    let audioSession = AVAudioSession.sharedInstance()
    let options: AVAudioSession.CategoryOptions = .allowBluetooth
    var configError: Error?
    do {
        try audioSession.setCategory(.playAndRecord)
    } catch {
        configError = error
    }
    return configError
}
```

### Enable CallKit

To enable CallKit, create an instance of `CallKitOptions` and provide it to `callCompositeOptions`.

```swift
let isCallHoldSupported = true // enable call hold (default is true)
let callKitOptions = CallKitOptions(
    providerConfig: providerConfig,
    isCallHoldSupported: isCallHoldSupported,
    provideRemoteInfo: provideRemoteInfo,
    configureAudioSession: configureAudioSession
)

let options = CallCompositeOptions(
    ..., // Other options for Azure Communication Service
    callKitOptions: callKitOptions
)
```

### Hold and Resume API for CallKit integrated in application

For CallKit integrated in application use `hold` and `resume` to manage call state.

```kotlin
    callComposite.hold() { result in
        switch result {
            case .success:
                // success
            case .failure(let error):
                // failure
        }
    }

    callComposite.resume() { result in
        switch result {
            case .success:
                // success
            case .failure(let error):
                // failure
        }
    }
```

## Next steps

- [Learn more about the UI Library](../../concepts/ui-library/ui-library-overview.md)
