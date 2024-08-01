---
description: Learn how to use the Calling composite on iOS to customize the leave call confirmation API
author: garchiro7

ms.author: jorgegarc
ms.date: 05/01/2024
ms.topic: include
ms.service: azure-communication-services
---

### Disabling Leave Call Confirmation

To disable the left call confirmation prompt triggered by clicking the end call button, utilize the `CallScreenOptions` class to configure the `CallScreenControlBarOptions`. Set the `LeaveCallConfirmationMode` parameter to `alwaysDisabled`. By default, the UI library enables `LeaveCallConfirmationMode` as `alwaysEnabled`.

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

This setup ensures that the left call confirmation prompt is disabled when the end call button is clicked.