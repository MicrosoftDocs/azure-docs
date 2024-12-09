---
description: Learn how to customize the actions from the button bar in the iOS UI Library
author: garchiro7

ms.author: jorgegarc
ms.date: 08/01/2024
ms.topic: include
ms.service: azure-communication-services
---


## Remove or disable buttons

`CallScreenControlBarOptions`, allow the flexibility to customize buttons by removing specific buttons such as camera, microphone, and audio controls. This API allows you to tailor the user interface according to their specific application requirements and user experience design. Just set the `visible` or `enabled` to `false` for the `ButtonViewData` to hide or disable button.

:::image type="content" source="../../media/remove-button-experience.png" alt-text="Screenshot that shows the experience removing buttons in the UI Library.":::

```swift
let cameraButton = ButtonViewData(visible: false)

let callScreenControlBarOptions = CallScreenControlBarOptions(
    cameraButton: cameraButton
)

let callScreenOptions = CallScreenOptions(controlBarOptions: callScreenControlBarOptions)
let localOptions = LocalOptions(callScreenOptions: callScreenOptions)

let callComposite = CallComposite(credential: credential)
callComposite.launch(locator: .roomCall(roomId: "..."), localOptions: localOptions)
```

Button can be updated after launching call composite.

```swift
cameraButton.visible = true
```

## Add custom actions

`Call composite` is using Fluent UI icons. You can download the icons directly from [the Fluent UI GitHub repository](https://github.com/microsoft/fluentui-system-icons/) and incorporate them into your project as needed. This approach guarantees visual consistency across all user interface elements, enhancing the overall user experience.

:::image type="content" source="../../media/add-button-experience.png" alt-text="Screenshot that shows the experienc when you add a new button the UI Library.":::

```swift
// Custom header button
let headerCustomButton = CustomButtonViewData(image: UIImage(named: "...")!,
                                              title: "My header button") {_ in
    // Process my button onClick
}
let callScreenHeaderViewData = CallScreenHeaderViewData(
    customButtons: [headerCustomButton]
)

// Custom control bar button
let customButton = CustomButtonViewData(image: UIImage(named: "...")!,
                                        title: "My button") {_ in
    // Process my button onClick
}

let callScreenControlBarOptions = CallScreenControlBarOptions(
    customButtons: [customButton]
)

let callScreenOptions = CallScreenOptions(
    controlBarOptions: callScreenControlBarOptions, headerViewData: callScreenHeaderViewData)

let localOptions = LocalOptions(callScreenOptions: callScreenOptions)

let callComposite = CallComposite(credential: credential)
callComposite.launch(locator: .roomCall(roomId: "..."), localOptions: localOptions)
```

Similar to `Call composite` provided buttons, custom buttons are updatable after the launch.

```swift
customButton.enabled = true
```
