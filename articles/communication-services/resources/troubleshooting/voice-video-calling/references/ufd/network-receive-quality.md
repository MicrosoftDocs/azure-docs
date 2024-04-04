---
title: Understanding networkReceiveQuality UFD - User Facing Diagnostics
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview and detiled reference of networkReceiveQuality UFD
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 03/27/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# networkReceiveQuality UFD
The `networkReceiveQuality` UFD with `Bad` value indicates the presence of network quality issues for incoming streams, as detected by the ACS Calling SDK.
This warning suggests that there may be problems with the network connection between the local endpoint and remote endpoint.
When this UFD fires with the `Bad` value, the user may experience degraded audio quality.

| networkReceiveQualityUFD | Details                |
| -------------------------|------------------------|
| UFD type                 | NetworkDiagnostics     |
| value type               | DiagnosticQuality      |
| possible values          | Good, Poor, Bad        |

## Example
```typescript
call.feature(Features.UserFacingDiagnostics).network.on('diagnosticChanged', (diagnosticInfo) => {
    if (diagnosticInfo.diagnostic === 'networkReceiveQuality') {
       if (diagnosticInfo.value === DiagnosticQuality.Bad) {
           // network receive quality bad, show a warning message on UI
       } else if (diagnosticInfo.value === DiagnosticQuality.Poor) {
           // network receive quality poor, notify the user
       } else if (diagnosticInfo.value === DiagnosticQuality.Good) {
           // network receive quality recovered, notify the user
       }
    }
});
```
## How to mitigate or resolve
From the perspective of the ACS Calling SDK, network issues are considered external problems.
To solve network issues, you need understand the network topology and identify the nodes that are causing the problem.
These parts involve network infrastructure, which is outside the scope of the ACS Calling SDK.

Your application should subscribe to events from the User Facing Diagnostics. Display a message on your user interface to inform users of network quality issues and warm them about audio quality degradation.

## Next steps
* Learn more about [User Facing Diagnostics Feature](../../../../../concepts/voice-video-calling/user-facing-diagnostics.md).
