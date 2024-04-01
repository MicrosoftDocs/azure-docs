---
title: Understanding cameraPermissionDenied UFD
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview and details reference for understanding cameraPermissionDenied UFD.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 03/27/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# cameraPermissionDenied UFD
The `cameraPermissionDenied UFD` event with a `true` value occurs when the SDK detects that the camera permission has been denied either at browser layer or at OS level.

| cameraPermissionDenied                | Details                |
| --------------------------------------|------------------------|
| UFD type                              | MediaDiagnostics       |
| value type                            | DiagnosticFlag         |
| possible values                       | true, false            |

## Example code to trap a cameraPermissionDenided UFD event
```typescript
call.feature(Features.UserFacingDiagnostics).media.on('diagnosticChanged', (diagnosticInfo) => {
    if (diagnosticInfo.diagnostic === 'cameraPermissionDenied') {
       if (diagnosticInfo.value === true) {
           // camera permission denied, show a warning message on UI
       } else {
           // The cameraPermissionDenied UFD recovered, notify the user
       }
    }
});
```
## How to mitigate or resolve
Your application should invoke `DeviceManager.askDevicePermission` before the call starts to check whether the permission has been granted or not.
If the permission to use the camera is denied, the application should display a message on your user interface.
Additionally, your application should acquire camera browser permission before listing the available camera devices.
If there's no permission granted, the application is unable to get the detailed information of the camera devices on the user's system.

The camera permission can also be revoked during a call, so your application should also subscribe to events from the User Facing Diagnostics events to display a message on the user interface.
The end users can then take steps to resolve the issue on their own, such as enabling the browser permission or checking whether they have disabled the camera access at OS level.

> [!NOTE]
> Some browser platforms will cache the permission results.

If a user has denied the permission at browser layer previously, invoking `askDevicePermission` API won't trigger the permission UI prompt, but it can know the permission has been denied.
Your application should show instructions and ask the user to reset or grant the browser camera permission manually.
