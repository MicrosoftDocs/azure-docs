---
title: Understanding cameraStoppedUnexpectedly UFD - User Facing Diagnostics
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview and detailed reference of cameraStoppedUnexpectedly UFD.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 03/27/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# cameraStoppedUnexpectedly UFD
The `cameraStoppedUnexpectedly` UFD event with a `true` value occurs when the SDK detects that the camera track was muted.

Keep in mind that this event relates to the camera track's `mute` event triggered by an external source.
The event can be triggered on mobile browsers when the browser goes to background.
Additionally, in some browser implementations, the browser sends black frames when the video input track is muted.

| cameraStoppedUnexpectedly             | Details                |
| --------------------------------------|------------------------|
| UFD type                              | MediaDiagnostics       |
| value type                            | DiagnosticFlag         |
| possible values                       | true, false            |

## Example
```typescript
call.feature(Features.UserFacingDiagnostics).media.on('diagnosticChanged', (diagnosticInfo) => {
    if (diagnosticInfo.diagnostic === 'cameraStoppedUnexpectedly') {
       if (diagnosticInfo.value === true) {
           // show a warning message on UI
       } else {
           // The cameraStoppedUnexpectedly UFD recovered, notify the user
       }
    }
});
```
## How to mitigate or resolve
Your application should subscribe to events from the User Facing Diagnostics and display a message on the user interface to alert users of any camera state changes.
This way ensures that users are aware of camera stopped issues and aren't surprised if other participants can't see the video.

## Next steps
* Learn more about [User Facing Diagnostics feature](../../../../../concepts/voice-video-calling/user-facing-diagnostics.md?pivots=platform-web).
