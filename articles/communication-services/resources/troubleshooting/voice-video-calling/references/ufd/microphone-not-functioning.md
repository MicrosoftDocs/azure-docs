---
title: Understanding microphoneNotFunctioning UFD - User Facing Diagnostics
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview and detailed reference of microphoneNotFunctioning UFD
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 03/27/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# microphoneNotFunctioning UFD
The `microphoneNotFunctioning` UFD event with a `true` value occurs when the SDK detects that the microphone track was ended. The microphone track ending happens in many situations.
For example, unplugging a microphone in use triggers the browser to end the microphone track. The SDK would then fire `microphoneNotFunctioning` UFD event.
It can also occur when the user removes the microphone permission at browser or at OS level. The underlying layers, such as audio driver or media stack at OS level, may also end the session, causing the browser to end the microphone track.

| microphoneNotFunctioning              | Details                |
| --------------------------------------|------------------------|
| UFD type                              | MediaDiagnostics       |
| value type                            | DiagnosticFlag         |
| possible values                       | true, false            |

## Example
```typescript
call.feature(Features.UserFacingDiagnostics).media.on('diagnosticChanged', (diagnosticInfo) => {
    if (diagnosticInfo.diagnostic === 'microphoneNotFunctioning') {
       if (diagnosticInfo.value === true) {
           // show a warning message on UI
       } else {
           // The microphoneNotFunctioning UFD recovered, notify the user
       }
    }
});
```
## How to mitigate or resolve
The application should subscribe to events from the User Facing Diagnostics and display a message on the UI to alert users of any microphone issues.
Users can then take steps to resolve the issue on their own.
For example, they can unplug and plug in the headset device, or sometimes muting and unmuting the microphone can help as well.

## Next steps
* Learn more about [User Facing Diagnostics feature](../../../../../concepts/voice-video-calling/user-facing-diagnostics.md?pivots=platform-web).
