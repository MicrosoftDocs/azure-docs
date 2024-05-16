---
title: Understanding noSpeakerDevicesEnumerated UFD - User Facing Diagnostics
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview and detailed reference of noSpeakerDevicesEnumerated UFD
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 03/27/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# noSpeakerDevicesEnumerated UFD
The `noSpeakerDevicesEnumerated` UFD event with a `true` value occurs when there's no speaker device presented in the device list returned by the browser API. This issue occurs when the `navigator.mediaDevices.enumerateDevices` browser API doesn't include any audio output devices. This event indicates that there are no speakers available on the user's machine, which could be because the user unplugged or disabled the speaker.

On some platforms such as iOS, the browser doesn't provide the audio output devices in the device list. In this case, the SDK considers it as expected behavior and doesn't fire `noSpeakerDevicesEnumerated` UFD event.

| noSpeakerDevicesEnumerated UFD        | Details                |
| --------------------------------------|------------------------|
| UFD type                              | MediaDiagnostics       |
| value type                            | DiagnosticFlag         |
| possible values                       | true, false            |

## Example
```typescript
call.feature(Features.UserFacingDiagnostics).media.on('diagnosticChanged', (diagnosticInfo) => {
    if (diagnosticInfo.diagnostic === 'noSpeakerDevicesEnumerated') {
       if (diagnosticInfo.value === true) {
           // show a warning message on UI
       } else {
           // The noSpeakerDevicesEnumerated UFD recovered, notify the user
       }
    }
});
```
## How to mitigate or resolve
Your application should subscribe to events from the User Facing Diagnostics and display a message on your user interface to alert users of any device setup issues.
Users can then take steps to resolve the issue on their own, such as plugging in a headset or checking whether they disabled the speaker devices.

## Next steps
* Learn more about [User Facing Diagnostics feature](../../../../../concepts/voice-video-calling/user-facing-diagnostics.md?pivots=platform-web).
