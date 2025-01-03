---
title: Understanding noNetwork UFD - User Facing Diagnostics
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview and detailed reference of noNetwork UFD
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 03/27/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# noNetwork UFD
The `noNetwork` UFD event with a `true` value occurs when there's no network available for ICE candidates being gathered, which means there are network setup issues in the local environment, such as a disconnected Wi-Fi or Ethernet cable.
Additionally, if the adapter fails to acquire an IP address and there are no other networks available, this situation can also result in `noNetwork` UFD event.

| noNetwork UFD        | Details                 |
| ---------------------|------------------------|
| UFD type             | NetworkDiagnostics     |
| value type           | DiagnosticFlag         |
| possible values      | true, false            |

## Example
```typescript
call.feature(Features.UserFacingDiagnostics).network.on('diagnosticChanged', (diagnosticInfo) => {
    if (diagnosticInfo.diagnostic === 'noNetwork') {
       if (diagnosticInfo.value === true) {
           // show a warning message on UI
       } else {
           // noNetwork UFD recovered, notify the user
       }
    }
});
```
## How to mitigate or resolve
Your application should subscribe to events from the User Facing Diagnostics and display a message in your user interface to alert users of any network setup issues.
Users can then take steps to resolve the issue on their own.

Users should also check if they disabled the network adapters or whether they have an available network.

## Next steps
* Learn more about [User Facing Diagnostics feature](../../../../../concepts/voice-video-calling/user-facing-diagnostics.md?pivots=platform-web).
