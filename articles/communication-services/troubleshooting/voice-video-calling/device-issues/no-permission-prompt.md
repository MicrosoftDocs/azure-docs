---
title: Device and permission issues - no permission prompt after calling askDevicePermission 
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn why there is no permission prompt after calling askDevicePermission
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 02/24/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# No permission prompt shows when calling askDevicePermission
If a user reports that they don't see any permission prompt, they may have granted or denied the permission previously and browser caches the result.

This is usually not an issue, however, if the user cannot see the device list, they could have denied permission before.

Another reason that can cause no permission prompt issue is that they don't have microphone or camera devices avaialble in the system,
so the browser skip the permission prompt even if the permission state is `prompt`.

If a user reports that they don't see any permission prompt, it may be because they have previously granted or denied permission and the browser has cached the result.

This is usually not a problem, but if the user cannot see the device list, it could be because they denied permission before.

Another possible reason for the lack of a permission prompt is that the user's system does not have any microphone or camera devices available,
causing the browser to skip the prompt even if the permission state is set to 'prompt'.

## How to detect
### SDK
We cannot detect whether the permission prompt actually shows or not as this is a browser behavior that cannot be detected at JavaScript layer.

## How to mitigate or resolve
The application should check the result of `DeviceManager.askDevicePermission` API.
If the result is false, it may indicate that user has denied the permission now or previously.

The application should show a warning message and ask the user to check their browser settings to ensure that the correct permissions have been granted,
and verify that their system has the necessary devices installed and configured properly.
