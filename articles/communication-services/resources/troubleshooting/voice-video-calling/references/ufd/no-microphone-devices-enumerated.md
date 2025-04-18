---
title: Understanding noMicrophoneDevicesEnumerated UFD - User Facing Diagnostics
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview and detailed reference of noMicrophoneDevicesEnumerated UFD
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 03/27/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# noMicrophoneDevicesEnumerated UFD
The `noMicrophoneDevicesEnumerated` UFD event with a `true` value occurs when the browser API `navigator.mediaDevices.enumerateDevices` doesn't include any audio input devices.
This means that there are no microphones available on the user's machine. This issue is caused by the user unplugging or disabling the microphone.

> [!NOTE]
> This UFD event is unrelated to the a user allowing microphone permission.

Even if a user doesn't grant the microphone permission at the browser level, the `DeviceManager.getMicrophones` API still returns a microphone device info with an empty name, which indicates the presence of a microphone device on the user's machine.

| noMicrophoneDevicesEnumeratedUFD      | Details                |
| --------------------------------------|------------------------|
| UFD type                              | MediaDiagnostics       |
| value type                            | DiagnosticFlag         |
| possible values                       | true, false            |

## Example
```typescript
call.feature(Features.UserFacingDiagnostics).media.on('diagnosticChanged', (diagnosticInfo) => {
    if (diagnosticInfo.diagnostic === 'noMicrophoneDevicesEnumerated') {
       if (diagnosticInfo.value === true) {
           // show a warning message on UI
       } else {
           // The noSpeakerDevicesEnumerated UFD recovered, notify the user
       }
    }
});
```
## How to mitigate or resolve
Your application should subscribe to events from the User Facing Diagnostics and display a message on the user interface to alert users of any device setup issues. Users can then take steps to resolve the issue on their own, such as plugging in a headset or checking whether they disabled the microphone devices.

## Next steps
* Learn more about [User Facing Diagnostics feature](../../../../../concepts/voice-video-calling/user-facing-diagnostics.md?pivots=platform-web).
