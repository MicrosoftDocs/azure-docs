---
title: Understanding cameraStartFailed UFD - User Facing Diagnostics
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview and detailed reference of cameraStartFailed UFD
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 03/27/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# cameraStartFailed UFD
The `cameraStartFailed` UFD event with a `true` value occurs when the SDK is unable to acquire the camera stream because the source is unavailable.
This error typically happens when the specified video device is being used by another process.
For example, the user may see this `cameraStartFailed` UFD event when they attempt to join a call with video on a browser such as Chrome while another Edge browser has been using the same camera.

| cameraStartFailed                     | Details                |
| --------------------------------------|------------------------|
| UFD type                              | MediaDiagnostics       |
| value type                            | DiagnosticFlag         |
| possible values                       | true, false            |

## Example
```typescript
call.feature(Features.UserFacingDiagnostics).media.on('diagnosticChanged', (diagnosticInfo) => {
    if (diagnosticInfo.diagnostic === 'cameraStartFailed') {
       if (diagnosticInfo.value === true) {
           // show a warning message on UI
       } else {
           // cameraStartFailed UFD recovered, notify the user
       }
    }
});
```
## How to mitigate or resolve
The `cameraStartFailed` UFD event is due to external reasons, so your application should subscribe to events from the User Facing Diagnostics and display a message on the UI to alert users of camera start failures. To resolve this issue, users can check if there are other processes using the same camera and close them if necessary.

## Next steps
* Learn more about [User Facing Diagnostics feature](../../../../../concepts/voice-video-calling/user-facing-diagnostics.md?pivots=platform-web).
