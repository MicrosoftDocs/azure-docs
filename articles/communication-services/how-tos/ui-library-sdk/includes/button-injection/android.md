---
description: Learn how to customize the actions from the button bar in the Android UI Library
author: garchiro7

ms.author: jorgegarc
ms.date: 08/01/2024
ms.topic: include
ms.service: azure-communication-services
---

## Remove buttons

`CallCompositeCallScreenControlBarOptions`, allow the flexibility to customize buttons by removing specific buttons such as camera, microphone, and audio controls. This API allows you to tailor the user interface according to their specific application requirements and user experience design. Just set the `visible` or `enabled` to `false` for the `CallCompositeButtonViewData` to hide or disable button.

:::image type="content" source="../../media/remove-button-experience.png" alt-text="Screenshot that shows the experience removing buttons in the UI Library.":::

#### [Kotlin](#tab/kotlin)
```kotlin
val controlBarOptions = CallCompositeCallScreenControlBarOptions()

val cameraButton = CallCompositeButtonViewData()
    .setVisible(false)

controlBarOptions.setCameraButton(cameraButton)

val callScreenOptions = CallCompositeCallScreenOptions()
    .setControlBarOptions(controlBarOptions)

val localOptions = CallCompositeLocalOptions()
    .setCallScreenOptions(callScreenOptions)

val callComposite = CallCompositeBuilder()
    .build()

callComposite.launch(context, locator, localOptions)
```

#### [Java](#tab/java)
```java
CallCompositeCallScreenControlBarOptions controlBarOptions = new CallCompositeCallScreenControlBarOptions();

CallCompositeButtonOptions cameraButton = new CallCompositeButtonViewData()
        .setVisible(false);

controlBarOptions.setCameraButton(cameraButton);

CallCompositeCallScreenOptions callScreenOptions = new CallCompositeCallScreenOptions()
        .setControlBarOptions(controlBarOptions);

CallCompositeLocalOptions localOptions = new CallCompositeLocalOptions()
        .setCallScreenOptions(callScreenOptions);

CallComposite callComposite = new CallCompositeBuilder()
        .build();

callComposite.launch(context, locator, localOptions);
```
-----
Button can be updated after launching call composite.

#### [Kotlin](#tab/kotlin)
```kotlin
cameraButton.setVisible(true)
```

#### [Java](#tab/java)
```java
cameraButton.setVisible(true);
```

-----

## Add custom actions

`Call composite` is using Fluent UI icons. You can download the icons directly from [the Fluent UI GitHub repository](https://github.com/microsoft/fluentui-system-icons/) and incorporate them into your project as needed. This approach guarantees visual consistency across all user interface elements, enhancing the overall user experience.

:::image type="content" source="../../media/add-button-experience.png" alt-text="Screenshot that shows the experienc when you add a new button the UI Library.":::

#### [Kotlin](#tab/kotlin)
```kotlin

// Custom header button
val headerCustomButton =
    CallCompositeCustomButtonViewData(
        "headerCustomButton",
        R.drawable.my_header_button_icon,
        "My header button",
        fun(it: CallCompositeCustomButtonClickEvent) {
            // process my button onClick
        }
    )

val headerOptions = CallCompositeCallScreenHeaderViewData()
    .setCustomButtons(listOf(headerCustomButton))

// Custom control bar button
val controlBarOptions = CallCompositeCallScreenControlBarOptions()

controlBarOptions.setCustomButtons(
    listOf(
        CallCompositeCustomButtonViewData(
            "customButtonId",
            R.drawable.my_button_image,
            "My button",
            fun(it: CallCompositeCustomButtonClickEvent) {
                // Process my button onClick
            },
        )
    )
)

val callScreenOptions = CallCompositeCallScreenOptions()
    .setHeaderViewData(headerOptions)
    .setControlBarOptions(controlBarOptions)

val localOptions = CallCompositeLocalOptions()
    .setCallScreenOptions(callScreenOptions)

val callComposite = CallCompositeBuilder()
    .build()

callComposite.launch(context, locator, localOptions)
```

#### [Java](#tab/java)
```java
// Custom header button
List<CallCompositeCustomButtonViewData> headerCustomButtons = new ArrayList<>();
headerCustomButtons.add(
        new CallCompositeCustomButtonViewData(
                "headerCustomButton",
                R.drawable.my_header_button_icon,
                "My header button",
                eventArgs -> {
                    // process my button onClick
                }
        )
);
CallCompositeCallScreenHeaderViewData headerOptions = new CallCompositeCallScreenHeaderViewData()
        .setCustomButtons(headerCustomButtons);

// Custom control bar button
CallCompositeCallScreenControlBarOptions controlBarOptions = new CallCompositeCallScreenControlBarOptions();

List<CallCompositeCustomButtonViewData> customButtons = new ArrayList<>();
customButtons.add(
        new CallCompositeCustomButtonViewData(
                "customButtonId",
                R.drawable.my_button_image,
                "My button",
                eventArgs -> {
                    // process my button onClick
                }
        )
);

controlBarOptions.setCustomButtons(customButtons);

CallCompositeCallScreenOptions callScreenOptions = new CallCompositeCallScreenOptions()
        .setHeaderViewData(headerOptions)
        .setControlBarOptions(controlBarOptions);

CallCompositeLocalOptions localOptions = new CallCompositeLocalOptions()
        .setCallScreenOptions(callScreenOptions);

CallComposite callComposite = new CallCompositeBuilder()
        .build();

callComposite.launch(context, locator, localOptions);
```

-----

Similar to `Call composite` provided buttons, custom buttons are updatable after the launch.



#### [Kotlin](#tab/kotlin)

```kotlin
customButton.setVisible(true)
```

#### [Java](#tab/java)
```java
customButton.setVisible(true);
```