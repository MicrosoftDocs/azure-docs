---
title: Understanding screenshareRecordingDisabled UFD - User Facing Diagnostics
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview and detailed reference of screenshareRecordingDisabled UFD.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 03/27/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# screenshareRecordingDisabled UFD
The `screenshareRecordingDisabled` UFD event with a `true` value occurs when the SDK detects that the screen sharing permission was denied in the browser or OS settings on macOS.

| screenshareRecordingDisabled          | Details                |
| --------------------------------------|------------------------|
| UFD type                              | MediaDiagnostics       |
| value type                            | DiagnosticFlag         |
| possible values                       | true, false            |

## Example
```typescript
call.feature(Features.UserFacingDiagnostics).media.on('diagnosticChanged', (diagnosticInfo) => {
    if (diagnosticInfo.diagnostic === 'screenshareRecordingDisabled') {
       if (diagnosticInfo.value === true) {
           // show a warning message on UI
       } else {
           // The screenshareRecordingDisabled UFD recovered, notify the user
       }
    }
});
```
## How to mitigate or resolve
Your application should subscribe to events from the User Facing Diagnostics and display a message on the user interface to alert users of any screen sharing permission issues.
Users can then take steps to resolve the issue on their own.

Users should also check if they disabled the screen sharing permission from OS settings.

## Next steps
* Learn more about [User Facing Diagnostics feature](../../../../../concepts/voice-video-calling/user-facing-diagnostics.md?pivots=platform-web).
