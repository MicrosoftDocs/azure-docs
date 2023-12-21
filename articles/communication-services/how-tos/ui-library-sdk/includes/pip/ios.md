---
description: In this tutorial how to use the Calling composite on iOS.
author: pavelprystinka

ms.author: pavelprystinka
ms.date: 12/12/2023
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-android) for Android and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-calling)

### Picture-In-Picture Setup

To enable multitasking and Picture-in-Picture use `CallCompositeOptions` constructor parameters `enableMultitasking` and `enableSystemPiPWhenMultitasking`.

> [!NOTE]
> Apps that have a deployment target earlier than iOS 16 require the `com.apple.developer.avfoundation multitasking-camera-access` entitlement to use the camera in PiP mode.

```swift
let callCompositeOptions = CallCompositeOptions(
            enableMultitasking: true,
            enableSystemPiPWhenMultitasking: true)

let callComposite = CallComposite(withOptions: callCompositeOptions)
```

The Back button is displayed when, `enableMultitasking` is set to true:

:::image type="content" source="media/ios-call-screen.png" alt-text="Screenshot of the iOS call screen with back button visible.":::


To open Call UI user opens Call activity by clicking on the top bar notification or programmatically. To re-open UI programmatically app have to preserve a reference to the `CallComposite` and execute  `displayCallCompositeIfWasHidden` method:

```swift
callComposite.displayCallCompositeIfWasHidden(context)
```

To enter multitasking programmatically user `hide` method:

```swift
callComposite.hide()
```