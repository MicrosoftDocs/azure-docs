---
title: Understanding networkReconnect UFD - User Facing Diagnostics
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview and detailed reference of networkReconnect UFD
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 03/27/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# networkReconnect UFD
The `networkReconnect` UFD event with a `Bad` value occurs when the Interactive Connectivity Establishment (ICE) transport state on the connection is `failed`.
This event indicates that there may be network issues between the two endpoints, such as packet loss or firewall issues.
The connection failure is detected by the ICE consent freshness mechanism implemented in the browser.

When an endpoint doesn't receive a reply after a certain period, the ICE transport state will transition to `disconnected`.
If there's still no response received, the state then becomes `failed`.

Since the endpoint didn't receive a reply for a period of time, it's possible that incoming packets weren't received or outgoing packets didn't reach to the other users.
This situation may result in the user not hearing or seeing the other party.

| networkReconnect UFD | Details                |
| ---------------------|------------------------|
| UFD type             | NetworkDiagnostics     |
| value type           | DiagnosticQuality      |
| possible values      | Good, Bad              |

## Example
```typescript
call.feature(Features.UserFacingDiagnostics).network.on('diagnosticChanged', (diagnosticInfo) => {
    if (diagnosticInfo.diagnostic === 'networkReconnect') {
       if (diagnosticInfo.value === DiagnosticQuality.Bad) {
           // media transport disconnected, show a warning message on UI
       } else if (diagnosticInfo.value === DiagnosticQuality.Good) {
           // media transport recovered, notify the user
       }
    }
});
```
## How to mitigate or resolve
From the perspective of the ACS Calling SDK, network issues are considered external problems.
To solve network issues, you need to understand the network topology and identify the nodes that are causing the problem.
These parts involve network infrastructure, which is outside the scope of the ACS Calling SDK.

Internally, the ACS Calling SDK will trigger reconnection after a `networkReconnect` UFD event with a `Bad` value is fired. If the connection recovers, `networkReconnect` UFD event with a `Good` value is fired.

Your application should subscribe to events from the User Facing Diagnostics.
Display a message on your user interface that informs users of network connection issues and potential audio loss.

## Next steps
* Learn more about [User Facing Diagnostics feature](../../../../../concepts/voice-video-calling/user-facing-diagnostics.md?pivots=platform-web).
