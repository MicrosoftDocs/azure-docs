---
title: Overview of speakingWhileMicrophoneIsMuted UFD
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview and detaild reference of speakingWhileMicrophoneIsMuted UFD
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 03/27/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# speakingWhileMicrophoneIsMuted UFD
The `speakingWhileMicrophoneIsMuted` UFD occurs when the SDK detects that the audio input volume is not muted although the user has muted the microphone. This may indicate that the user is wanting to speak something but forgot to unmute their microphone. Since the microphone state in the SDK is muted, no audio will be sent in this case.


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
The `speakingWhileMicrophoneIsMuted` UFD is not an error, but rather an indication of an inconsistency between the audio input volume and the microphone's muted state in the SDK. The purpose of this UFD is for the application to show a message your user interface as a hint so the user can be aware that the microphone is muted if they intending to speak.
