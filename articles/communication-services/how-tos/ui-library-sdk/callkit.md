---
title: CallKit for the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services UI Library for Mobile native to integrate CallKit
author: iaulakh
ms.author: iaulakh
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 12/19/2023
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios
---

# CallKit Integration

UI Library will provide out of the box support for CallKit. Developers can provide their own configuration for CallKit to be used for the UI Library.

Learn how to set up the CallKit correctly using the UI Library in your application.

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../quickstarts/identity/access-tokens.md)
- Optional: Complete the quickstart for [getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md)

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-ios) for iOS and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-calling)

### CallKit Integration 

CallKit Integration, supported by Azure Communication Service native iOS calling native SDK can be enabled in UI Libraries by configuring instance of `CallCompositeCallKitOption`. [more info](https://learn.microsoft.com/azure/communication-services/how-tos/calling-sdk/callkit-integration#callkit-integration-within-sdk)

### Specify call recipient info for incoming/outgoing calls

To specify call recipient info, create an instance of `CallCompositeCallKitRemoteInfo`.

Assign value for `displayName` to customize display name for call recipients and configure `CXHandle` value. This value specified in `displayName` is exactly how it shows up in the last dialed call log in the last dialed call log. 

Assign the cxHandle value is what the application receives when, user calls back on that contact.

```swift
let cxHandle = CXHandle(type: .generic, value: "VALUE_TO_CXHANDLE")
var displayName = "DISPLAY_NAME"
let callKitRemoteInfo = CallCompositeCallKitRemoteInfo(displayName: displayName, cxHandle: cxHandle)
```

If `CallCompositeCallKitRemoteInfo` isn't provided, by default participant identifier raw value is displayed.

### CXProviderConfiguration

A provider `CallCompositeCallKitRemoteInfo` instance should be provided to `CallCompositeCallKitOption` as per requirements. UI Library also provides a default provider `CallCompositeCallKitOption.getDefaultCXProviderConfiguration()`. [more info](https://developer.apple.com/documentation/callkit/cxproviderconfiguration)

```swift
let cxProvider = CallCompositeCallKitOption.getDefaultCXProviderConfiguration()
```

### Configure audio session

Configure audio session will be called before placing or accepting incoming call and before resuming the call after call put on hold. [more info](https://developer.apple.com/documentation/avfaudio/avaudiosession)

```swift
public func configureAudioSession() -> Error? {
    let audioSession = AVAudioSession.sharedInstance()
    var configError: Error?
    do {
        try audioSession.setCategory(.playAndRecord)
    } catch {
        configError = error
    }
    return configError
}
```

### Enabling CallKit

To enable CallKit, create instance of `CallCompositeCallKitOption` and provide to `RemoteOptions`

```swift
let isCallHoldSupported = true // enable call hold (default is true)
let callKitOptions = CallCompositeCallKitOption(
    cxProvideConfig: cxProvider,
    isCallHoldSupported: isCallHoldSupported,
    remoteInfo: callKitRemoteInfo,
    configureAudioSession: configureAudioSession
)

let remoteOptions = RemoteOptions(
    ..., // Other options for Azure Communication Service
    callKitOptions: callKitOptions
)
```

## Next steps

- [Learn more about UI Library](../../concepts/ui-library/ui-library-overview.md)