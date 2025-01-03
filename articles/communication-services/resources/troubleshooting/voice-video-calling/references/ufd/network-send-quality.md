---
title: Understanding networkSendQuality UFD - User Facing Diagnostics
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview and detailed reference of networkSendQuality UFD
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 03/27/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# networkSendQuality UFD
The `networkSendQuality` UFD event with a `Bad` value indicates that there are network quality issues for outgoing streams, such as packet loss, as detected by the ACS Calling SDK.
This event suggests that there may be problems with the network quality issues between the local endpoint and remote endpoint.


| networkSendQualityUFD | Details                |
| ----------------------|------------------------|
| UFD type              | NetworkDiagnostics     |
| value type            | DiagnosticQuality      |
| possible values       | Good, Bad              |

## Example
```typescript
call.feature(Features.UserFacingDiagnostics).network.on('diagnosticChanged', (diagnosticInfo) => {
    if (diagnosticInfo.diagnostic === 'networkSendQuality') {
       if (diagnosticInfo.value === DiagnosticQuality.Bad) {
           // network send quality bad, show a warning message on UI
       } else if (diagnosticInfo.value === DiagnosticQuality.Good) {
           // network send quality recovered, notify the user
       }
    }
});
```
## How to mitigate or resolve
From the perspective of the ACS Calling SDK, network issues are considered external problems.
To solve network issues, it's typically necessary to have an understanding of the network topology and the nodes that are causing the problem.
These parts involve network infrastructure, which is outside the scope of the ACS Calling SDK.

Your application should subscribe to events from the User Facing Diagnostics and display a message on the user interface, so that users are aware of network quality issues. While these issues are often temporary and recover soon, frequent occurrences of the `networkSendQuality` UFD event for a particular user may require further investigation.
For example, users should check their network equipment or check with their internet service provider (ISP).

## Next steps
* Learn more about [User Facing Diagnostics feature](../../../../../concepts/voice-video-calling/user-facing-diagnostics.md?pivots=platform-web).
