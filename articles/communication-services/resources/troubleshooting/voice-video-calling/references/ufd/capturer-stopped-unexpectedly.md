---
title: Overview of capturerStoppedUnexpectedly UFD
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview and detailed eference of capturerStoppedUnexpectedly UFD
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 03/26/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# capturerStoppedUnexpectedly UFD
The `capturerStoppedUnexpectedly` UFD with a `true` value occurs when the SDK detects that the screensharing track has been muted. This can happen due to external reasons and depends on the browser implementation. For example, if the user shares a window and minimize that window, the `capturerStoppedUnexpectedly` UFD may fire.

| capturerStoppedUnexpectedly | Details                |
| ----------------------------|------------------------|
| UFD type                    | MediaDiagnostics       |
| value type                  | DiagnosticFlag         |
| possible values             | true, false            |

## Example
```typescript
call.feature(Features.UserFacingDiagnostics).media.on('diagnosticChanged', (diagnosticInfo) => {
    if (diagnosticInfo.diagnostic === 'capturerStoppedUnexpectedly') {
       if (diagnosticInfo.value === true) {
           // capturerStoppedUnexpectedly UFD, show a warning message on UI
       } else {
           // The capturerStoppedUnexpectedly UFD recovered, notify the user
       }
    }
});
```
## How to mitigate or resolve
Your application should subscribe to events from the User Facing Diagnostics  and display a message on your user interface to alert users of screensharing issues.
Users can then take steps to resolve the issue on their own, such as checking whether they accidentally minimize the window being shared.
