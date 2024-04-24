---
title: Understanding cameraFreeze UFD - User Facing Diagnostics
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview and details reference for understanding cameraFreeze UFD.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 03/27/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# cameraFreeze UFD
A `cameraFreeze` UFD event with a `true` value occurs when the SDK detects that the input framerate goes down to zero, causing the video output to appear frozen or not changing.

The underlying issue may suggest problems with the user's video camera, or in certain instances, the device may cease sending video frames.
For example, on certain Android device models, you may see a `cameraFreeze` UFD event when the user locks the screen or puts the browser in the background.
In this situation, the Android operating system stops sending video frames, and thus on the other end of the call a user may see a `cameraFreeze` UFD event.

| cameraFreeze                          | Details                |
| --------------------------------------|------------------------|
| UFD type                              | MediaDiagnostics       |
| value type                            | DiagnosticFlag         |
| possible values                       | true, false            |

## Example code to catch a cameraFreeze UFD event
```typescript
call.feature(Features.UserFacingDiagnostics).media.on('diagnosticChanged', (diagnosticInfo) => {
    if (diagnosticInfo.diagnostic === 'cameraFreeze') {
       if (diagnosticInfo.value === true) {
           // show a warning message on UI
       } else {
           // The cameraFreeze UFD recovered, notify the user
       }
    }
});
```

## How to mitigate or resolve
Your calling application should subscribe to events from the User Facing Diagnostics.
You should also consider displaying a message on your user interface to alert users of potential camera issues.
The user can try to stop and start the video again, switch to other cameras or switch calling devices to resolve the issue.

## Next steps
* Learn more about [User Facing Diagnostics feature](../../../../../concepts/voice-video-calling/user-facing-diagnostics.md?pivots=platform-web).
