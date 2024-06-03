---
title: Understanding microphoneMuteUnexpectedly UFD - User Facing Diagnostics
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview and detailed reference of microphoneMuteUnexpectedly UFD
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 03/27/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# microphoneMuteUnexpectedly UFD
The `microphoneMuteUnexpectedly` UFD event with a `true` value occurs when the SDK detects that the microphone track was muted. Keep in mind, that the event is related to the `mute` event of the microphone track, when it's triggered by an external source rather than by the SDK mute API. The underlying layer triggers the event, such as the audio stack muting the audio input session. The hardware mute button of some headset models can also trigger the `microphoneMuteUnexpectedly` UFD. Additionally, some browser platforms, such as iOS Safari browser, may mute the microphone when certain interruptions occur, such as an incoming phone call.

| microphoneMuteUnexpectedly            | Details                |
| --------------------------------------|------------------------|
| UFD type                              | MediaDiagnostics       |
| value type                            | DiagnosticFlag         |
| possible values                       | true, false            |

## Example
```typescript
call.feature(Features.UserFacingDiagnostics).media.on('diagnosticChanged', (diagnosticInfo) => {
    if (diagnosticInfo.diagnostic === 'microphoneMuteUnexpectedly') {
       if (diagnosticInfo.value === true) {
           // show a warning message on UI
       } else {
           // The microphoneMuteUnexpectedly UFD recovered, notify the user
       }
    }
});
```

## How to mitigate or resolve
Your application should subscribe to events from the User Facing Diagnostics and display an alert message to users of any microphone state changes. By doing so, users are aware of muted issues and aren't surprised if they found other participants can't hear their audio during a call.

## Next steps
* Learn more about [User Facing Diagnostics feature](../../../../../concepts/voice-video-calling/user-facing-diagnostics.md?pivots=platform-web).
