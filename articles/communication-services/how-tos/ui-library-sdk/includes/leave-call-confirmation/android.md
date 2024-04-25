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