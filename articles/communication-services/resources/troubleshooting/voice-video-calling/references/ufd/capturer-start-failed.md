---
title: Overview of capturerStartFailed UFD
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview and detailed reference of capturerStartFailed UFD.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 03/27/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# capturerStartFailed UFD
The `capturerStartFailed` UFD with a `true` value occurs when the SDK is unable to acquire the screen sharing stream because the source is unavailable,
which can happen when the underlying layer prevents the sharing of the selected source.

| capturerStartFailed         | Details                |
| ----------------------------|------------------------|
| UFD type                    | MediaDiagnostics       |
| value type                  | DiagnosticFlag         |
| possible values             | true, false            |

## Example
```typescript
call.feature(Features.UserFacingDiagnostics).media.on('diagnosticChanged', (diagnosticInfo) => {
    if (diagnosticInfo.diagnostic === 'capturerStartFailed') {
       if (diagnosticInfo.value === true) {
           // capturerStartFailed UFD, show a warning message on UI
       } else {
           // The capturerStartFailed UFD recovered, notify the user
       }
    }
});
```
## How to mitigate or resolve
The `capturerStartFailed` is usually due to external reasons, so your application should subscribe to events from the User Facing Diagnostics and display a message on your user interface to alert users of screen sharing failures.
The end users can then take steps to resolve the issue on their own, such as checking if there are other processes causing this issue.
