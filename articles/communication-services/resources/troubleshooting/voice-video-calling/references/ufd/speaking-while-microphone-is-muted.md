---
title: Overview of speakingWhileMicrophoneIsMuted UFD - User Facing Diagnostics
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview and detailed reference of speakingWhileMicrophoneIsMuted UFD
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 03/27/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# speakingWhileMicrophoneIsMuted UFD
The `speakingWhileMicrophoneIsMuted` UFD occurs when the SDK detects that the audio input volume isn't muted although the user has muted the microphone.
This event can remind the user who may want to speak something but has forgotten to unmute their microphone.
In this case, since the microphone state in the SDK is muted, no audio is sent.

| speakingWhileMicrophoneIsMuted        | Detail                 |
| --------------------------------------|------------------------|
| UFD type                              | MediaDiagnostics       |
| value type                            | DiagnosticFlag         |
| possible values                       | true, false            |

## Example
```typescript
call.feature(Features.UserFacingDiagnostics).media.on('diagnosticChanged', (diagnosticInfo) => {
    if (diagnosticInfo.diagnostic === 'speakingWhileMicrophoneIsMuted') {
       if (diagnosticInfo.value === true) {
           // speaking while muted, show a warning message on UI
       } else {
           // The speakingWhileMicrophoneIsMuted UFD recovered, notify the user
       }
    }
});
```
## How to mitigate or resolve
The `speakingWhileMicrophoneIsMuted` UFD isn't an error, but rather an indication of an inconsistency between the audio input volume and the microphone's muted state in the SDK.
The purpose of this UFD is for the application to show a message on your user interface as a hint, so the user can know that the microphone is muted while they're speaking.
