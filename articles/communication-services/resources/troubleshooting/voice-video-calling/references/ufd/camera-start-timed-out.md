---
title: Understanding cameraStartTimedOut UFD - User Facing Diagnostics
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview and detailed reference of cameraStartTimedOut UFD
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 03/27/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# cameraStartTimedOut UFD
The `cameraStartTimedOut` UFD event with a `true` value occurs when the SDK is unable to acquire the camera stream because the promise returned by `getUserMedia` browser method doesn't resolve within a certain period of time.
This issue can happen when the user starts a call with video enabled, but the browser displays a UI permission prompt and the user doesn't respond to it.

| cameraStartTimedOut                   | Details                |
| --------------------------------------|------------------------|
| UFD type                              | MediaDiagnostics       |
| value type                            | DiagnosticFlag         |
| possible values                       | true, false            |

## Example
```typescript
call.feature(Features.UserFacingDiagnostics).media.on('diagnosticChanged', (diagnosticInfo) => {
    if (diagnosticInfo.diagnostic === 'cameraStartTimedOut') {
       if (diagnosticInfo.value === true) {
           // show a warning message on UI
       } else {
           // The cameraStartTimedOut UFD recovered, notify the user
       }
    }
});
```
## How to mitigate or resolve
The application should invoke `DeviceManager.askDevicePermission` before the call starts to check whether the permission was granted or not.
Invoking `DeviceManager.askDevicePermission` also reduces the possibility that the user doesn't respond to the UI permission prompt after the call starts.

If the timeout issue is caused by hardware problems, users can try selecting a different camera device when starting the video stream.

## Next steps
* Learn more about [User Facing Diagnostics feature](../../../../../concepts/voice-video-calling/user-facing-diagnostics.md?pivots=platform-web).
