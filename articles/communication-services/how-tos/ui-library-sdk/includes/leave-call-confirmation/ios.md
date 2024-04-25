### Disabling Leave Call Confirmation

To disable the leave call confirmation prompt triggered by clicking the end call button, utilize the `CallScreenOptions` class to configure the `CallScreenControlBarOptions`. Set the `LeaveCallConfirmationMode` parameter to `alwaysDisabled`. By default, the UI library enables `LeaveCallConfirmationMode` as `alwaysEnabled`.

```swift
let callCompositeOptions = CallCompositeOptions(
    callScreenOptions: CallScreenOptions(
        controlBarOptions: CallScreenControlBarOptions(
            leaveCallConfirmationMode: LeaveCallConfirmationMode.alwaysDisabled
        )
    )
)

let callComposite = CallComposite(withOptions: callCompositeOptions)
```

This setup ensures that the leave call confirmation prompt is disabled when the end call button is clicked.