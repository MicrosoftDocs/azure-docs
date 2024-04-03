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
The `networkReconnect` UFD with Bad value occurs when the ICE transport state on the connection is `failed`.
This event indicates that there may be network issues between the two endpoints, such as packet loss or firewall issues.
The connection failure is typically detected by the ICE consent freshness mechanism implemented in the browser.

When an endpoint doesn't receive a reply after a certain period, the ICE transport state will transition to `disconnected`.
If there's still no response received, the state then becomes `failed`.

Since the endpoint didn't receive a reply for a period of time, it's possible that incoming packets weren't received or outgoing packets didn't reach to the other users.
This situation may result in the user complaining that they couldn't hear or see the other party.


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
To solve network issues, it's usually necessary to understand the network topology and the nodes causing the problem.
These parts involve network infrastructure, which is outside the scope of the ACS Calling SDK.

Internally, the ACS Calling SDK will trigger reconnection after a `networkReconnect` Bad UFD is fired. If the connection recovers, `networkReconnect` Good UFD is fired.

It's important for your application to subscribe to events from the User Facing Diagnostics and display a message in your user interface,
so that the users are aware of any network issues and aren't surprised if they experience audio loss during a call.

