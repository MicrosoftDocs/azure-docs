---
title: Understanding microphonePermissionDenied UFD - User Facing Diagnostics
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview and detailed reference of microphonePermissionDenied UFD.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 03/27/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# microphonePermissionDenied UFD
The `microphonePermissionDenied` UFD event with a `true` value occurs when the SDK detects that the microphone permission was denied either at browser or OS level.

| microphonePermissionDenied            | Details                |
| --------------------------------------|------------------------|
| UFD type                              | MediaDiagnostics       |
| value type                            | DiagnosticFlag         |
| possible values                       | true, false            |

## Example
```typescript
call.feature(Features.UserFacingDiagnostics).media.on('diagnosticChanged', (diagnosticInfo) => {
    if (diagnosticInfo.diagnostic === 'microphonePermissionDenied') {
       if (diagnosticInfo.value === true) {
           // show a warning message on UI
       } else {
           // The microphonePermissionDenied UFD recovered, notify the user
       }
    }
});
```
## How to mitigate or resolve
Your application should invoke `DeviceManager.askDevicePermission` before a call starts to check whether the proper permissions were granted or not.
If the permission is denied, your application should display a message in the user interface to alert about this situation.
Additionally, your application should acquire browser permission before listing the available microphone devices.
If there's no permission granted, your application is unable to get the detailed information of the microphone devices on the user's system.

The permission can also be revoked during the call.
Your application should also subscribe to events from the User Facing Diagnostics and display a message on the user interface to alert users of any permission issues.
Users can resolve the issue on their own, by enabling the browser permission or checking whether they disabled the microphone access at OS level.

> [!NOTE]
> Some browser platforms cache the permission results.

If a user denied the permission at browser layer previously, invoking `askDevicePermission` API doesn't trigger the permission UI prompt, but the method can know the permission was denied.
Your application should show instructions and ask the user to reset or grant the browser microphone permission manually.

## Next steps
* Learn more about [User Facing Diagnostics feature](../../../../../concepts/voice-video-calling/user-facing-diagnostics.md?pivots=platform-web).
