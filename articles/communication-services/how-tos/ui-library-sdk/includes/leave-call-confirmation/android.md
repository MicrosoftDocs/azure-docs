---
description: Learn how to use the Calling composite on Android to customize the leave call confirmation API
author: garchiro7

ms.author: jorgegarc
ms.date: 05/01/2024
ms.topic: include
ms.service: azure-communication-services
---

### Disabling Leave Call Confirmation

To disable the left call confirmation prompt when clicking the end call button, utilize `CallCompositeCallScreenOptions` to configure `CallCompositeCallScreenControlBarOptions`. Set `CallCompositeLeaveCallConfirmationMode.ALWAYS_DISABLED` as the constructor parameter. By default, the UI library employs `CallCompositeLeaveCallConfirmationMode.ALWAYS_ENABLED`.

#### [Kotlin](#tab/kotlin)

```kotlin
val callScreenOptions = CallCompositeCallScreenOptions(
            CallCompositeCallScreenControlBarOptions()
                .setLeaveCallConfirmation(CallCompositeLeaveCallConfirmationMode.ALWAYS_DISABLED)
        )

val callComposite: CallComposite =
            CallCompositeBuilder()
            .callScreenOptions(callScreenOptions)
            .build()
```

#### [Java](#tab/java)

```java
CallComposite callComposite = 
    new CallCompositeBuilder()
        .callScreenOptions(new CallCompositeCallScreenOptions(
            new CallCompositeCallScreenControlBarOptions()
                .setLeaveCallConfirmation(CallCompositeLeaveCallConfirmationMode.ALWAYS_DISABLED)
        ))
        .build();
```

This setup ensures that the left call confirmation prompt is disabled upon clicking the end call button.