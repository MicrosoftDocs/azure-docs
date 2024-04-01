---
title: Overview of  networkRelaysNotReachable UFD
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview and detailed reference of networkRelaysNotReachable UFD
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 03/27/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# networkRelaysNotReachable UFD
The `networkRelaysNotReachable` UFD with `true` value occurs when the media connection fails to establish and no relay candidates are available. This issue usually happens when the firewall policy blocks connections between the local client and relay servers.

When users see the `networkRelaysNotReachable` UFD, it also indicates that the local client is not able to make a direction connection to the remote endpoint.

| networkRelaysNotReachable UFD | Details                |
| ------------------------------|------------------------|
| UFD type                      | NetworkDiagnostics     |
| value type                    | DiagnosticFlag         |
| possible values               | true, false            |

## Example
```typescript
call.feature(Features.UserFacingDiagnostics).network.on('diagnosticChanged', (diagnosticInfo) => {
    if (diagnosticInfo.diagnostic === 'networkRelaysNotReachable') {
       if (diagnosticInfo.value === true) {
           // networkRelaysNotReachable UFD, show a warning message on UI
       } else {
           // The networkRelaysNotReachable UFD recovered, notify the user
       }
    }
});
```
## How to mitigate or resolve
Your application should subscribe to events from the User Facing Diagnostics and display a message on your user interface to alert users of any network setup issues.
Users should follow the *Firewall Configuration* guideline mentioned in the [Network recommendations](../../../../../concepts/voice-video-calling/network-requirements.md) document. It is also recommended that the user also checks their NAT settings or whether their firewall policy blocks UDP packets.

If the organization policy doesn't allow users to connect to Microsoft TURN relay servers, custom TURN servers can be configured to avoid connection failures. See [Force calling traffic to be proxied across your own server](../../../../../tutorials/proxy-calling-support-tutorial.md) tutorial document for more information.

