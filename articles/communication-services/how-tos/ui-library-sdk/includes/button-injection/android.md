---
description: Learn how to customize the actions from the button bar in the Android UI Library
author: garchiro7

ms.author: jorgegarc
ms.date: 08/01/2024
ms.topic: include
ms.service: azure-communication-services
---

## Remove buttons

`CallCompositeCallScreenControlBarOptions`, allow the flexibility to customize the button bar by removing specific buttons such as camera, microphone, and audio controls. This API allows you to tailor the user interface according to their specific application requirements and user experience design. Just set the visibility to `false` to hide, the default behavior is  for `CallCompositeButtonOptions` object.

#### [Kotlin](#tab/kotlin)

```kotlin
val controlBarOptions = CallCompositeCallScreenControlBarOptions()

val cameraButton = CallCompositeButtonOptions()
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

CallCompositeButtonOptions cameraButton = new CallCompositeButtonOptions()
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

## Add custom actions

`Call composite` is using Fluent UI icons. You can download the icons directly from [the Fluent UI GitHub repository](https://github.com/microsoft/fluentui-system-icons/) and incorporate them into your project as needed. This approach guarantees visual consistency across all user interface elements, enhancing the overall user experience.

#### [Kotlin](#tab/kotlin)

```kotlin
val controlBarOptions = CallCompositeCallScreenControlBarOptions()

controlBarOptions.setCustomButtons(
    listOf(
        CallCompositeCustomButtonOptions(
            R.drawable.my_button_image,
            "My button",
            fun(it: CallCompositeCustomButtonClickEvent) {
                // Process my button onClick
            },
        )
    )
)

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

List<CallCompositeCustomButtonOptions> customButtons = new ArrayList<>();
customButtons.add(
        new CallCompositeCustomButtonOptions(
                R.drawable.my_button_image,
                "My button",
                eventArgs -> {
                    // process my button onClick
                }
        )
);

controlBarOptions.setCustomButtons(customButtons);

CallCompositeCallScreenOptions callScreenOptions = new CallCompositeCallScreenOptions()
        .setControlBarOptions(controlBarOptions);

CallCompositeLocalOptions localOptions = new CallCompositeLocalOptions()
        .setCallScreenOptions(callScreenOptions);

CallComposite callComposite = new CallCompositeBuilder()
        .build();

callComposite.launch(context, locator, localOptions);
```

-----
