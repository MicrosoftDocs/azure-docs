---
description: Learn how to use the Calling composite on iOS.
author: pavelprystinka

ms.author: pavelprystinka
ms.date: 12/12/2023
ms.topic: include
ms.service: azure-communication-services
---

For more information, see the [open-source iOS UI Library](https://github.com/Azure/communication-ui-library-ios) and the [sample application code](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-calling).

### Picture-in-picture setup

To enable multitasking and picture-in-picture, use the `CallCompositeOptions` constructor parameters `enableMultitasking` and `enableSystemPiPWhenMultitasking`.

> [!NOTE]
> Apps that have a deployment target earlier than iOS 16 require the `com.apple.developer.avfoundation multitasking-camera-access` entitlement to use the camera in picture-in-picture mode.

```swift
let callCompositeOptions = CallCompositeOptions(
            enableMultitasking: true,
            enableSystemPiPWhenMultitasking: true)

let callComposite = CallComposite(withOptions: callCompositeOptions)
```

The **Back** button appears when `enableMultitasking` is set to `true`.

:::image type="content" source="media/ios-call-screen.png" alt-text="Screenshot of the iOS call screen with the Back button visible.":::

To open the call UI, the user opens a call activity programmatically or by selecting the notification on the top bar. To reopen the UI programmatically, the app needs to preserve a reference to `CallComposite` and execute the `displayCallCompositeIfWasHidden` method.

```swift
callComposite.displayCallCompositeIfWasHidden(context)
```

To enter multitasking programmatically, call the `hide` method.

```swift
callComposite.hide()
```
