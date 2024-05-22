---
title: Device and permission issues - no permission prompt after calling askDevicePermission 
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn why there's no permission prompt after calling askDevicePermission.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 03/29/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# No permission prompt shows when calling askDevicePermission
If a user reports that they don't see any permission prompts, it may be because they previously granted or denied permission and the browser caches the result.

Not showing the permission prompt isn't a problem if the browser has the required permission.
However, if the user can't see the device list, it could be because they denied permission before.

Another possible reason for the lack of a permission prompt is that the user's system doesn't have any microphone or camera devices available,
causing the browser to skip the prompt even if the permission state is set to `prompt`.

## How to detect using the SDK
We can't detect whether the permission prompt actually shows or not, as this browser behavior can't be detected at JavaScript layer.

## How to mitigate or resolve
The application should check the result of [`DeviceManager.askDevicePermission`](/javascript/api/%40azure/communication-react/calladapterdevicemanagement?view=azure-node-latest&preserve-view=true#@azure-communication-react-calladapterdevicemanagement-askdevicepermission) API.
If the result is false, it may indicate that user denied the permission now or previously.

The application should show a warning message and ask the user to check their browser settings to ensure that correct permissions were granted.
They also need to verify that their system has the necessary devices installed and configured properly.
