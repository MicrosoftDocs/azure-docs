---
description: Learn how to customize the actions from the button bar in the iOS UI Library
author: garchiro7

ms.author: jorgegarc
ms.date: 08/01/2024
ms.topic: include
ms.service: azure-communication-services
---


## Remove buttons

`CallScreenControlBarOptions`, allow the flexibility to customize the button bar by removing specific buttons such as camera, microphone, and audio controls. This API allows you to tailor the user interface according to their specific application requirements and user experience design. Just set the visibility to `false` to hide, the default behavior is  for `ButtonOptions` object.

```swift
let cameraButton = ButtonOptions(visible: false)

let callScreenControlBarOptions = CallScreenControlBarOptions(
    cameraButton: cameraButton
)

let callScreenOptions = CallScreenOptions(controlBarOptions: callScreenControlBarOptions)
let localOptions = LocalOptions(callScreenOptions: callScreenOptions)

let callComposite = CallComposite(credential: credential)
callComposite.launch(locator: .roomCall(roomId: "..."), localOptions: localOptions)
```

## Add custom actions

`Call composite` is using Fluent UI icons. You can download the icons directly from [the Fluent UI GitHub repository](https://github.com/microsoft/fluentui-system-icons/) and incorporate them into your project as needed. This approach guarantees visual consistency across all user interface elements, enhancing the overall user experience.

```swift
let customButton = CustomButtonOptions(image: UIImage(named: "...")!,
                                       title: "My button") {_ in
    // Process my button onClick
}

let callScreenControlBarOptions = CallScreenControlBarOptions(
    customButtons: [customButton]
)

let callScreenOptions = CallScreenOptions(controlBarOptions: callScreenControlBarOptions)
let localOptions = LocalOptions(callScreenOptions: callScreenOptions)

let callComposite = CallComposite(credential: credential)
callComposite.launch(locator: .roomCall(roomId: "..."), localOptions: localOptions)
```
