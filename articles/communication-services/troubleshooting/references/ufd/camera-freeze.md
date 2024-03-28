---
title: Understanding cameraFreeze UFD
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview and details reference for understanding cameraFreeze UFD
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 03/27/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# cameraFreeze UFD
A `cameraFreeze` UFD event with a `true` value occurs when the SDK detects that the input framerate goes down to 0 frames per second, causing the video output to appear frozen or not changing.

The underlying issue may indicate issues with a users video camera, or in some cases, the device stops sending video frames For example, on certain Android device models, the browser may trigger the `cameraFreeze` UFD when the user locks the screen or puts the browser in the background. In this situation the Android operating system will stop sending video frames, and thus on the other end of the call a user will likly see a `cameraFreeze` UFD event.

| cameraFreeze                          | Details                  |
| --------------------------------------|------------------------|
| UFD type                              | MediaDiagnostics       |
| value type                            | DiagnosticFlag         |
| possible values                       | true, false            |

## Example code to trap a camera freeze UFD event
```typescript
call.feature(Features.UserFacingDiagnostics).media.on('diagnosticChanged', (diagnosticInfo) => {
    if (diagnosticInfo.diagnostic === 'cameraFreeze') {
       if (diagnosticInfo.value === true) {
           // cameraFreeze UFD, show a warning message on UI
       } else {
           // The cameraFreeze UFD recovered, notify the user
       }
    }
});
```
## How to mitigate or resolve
Your calling application should subscribe to events from the User Facing Diagnostics feature. You should also consider displaying a message on your user interface to alert users of potential camera issues. This will enable your end users can then take steps to resolve the issue on their own, such as stopping and starting the video again, or switching to other cameras or calling devices.