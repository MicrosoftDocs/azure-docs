---
title: Device and permission issues - getMicrophones API doesn't return detailed microphone list
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot when getMicrophones API doesn't return detailed microphone list
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 02/24/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The getMicrophones API doesn't return detailed microphone list
If a user reports that they cannot see the detailed microphone list,
it is likely because the browser has not been granted permission to access the microphone.
When the permission state is `prompt` or `denied`, the browser will not provide detailed information about the microphone devices.
In this scenario, the `DeviceManager.getMicrophones` API returns an array with one object, where the id is set to `microphone:` and the name is set to an empty string.

It's important to note that this scenario is different from the scenario where a user does not have any microphone device.
In the latter case, the `DeviceManager.getMicrophones` API only returns an empty array, indicating that there is no available microphone device in the user's system.

## How to detect
### SDK
`DeviceManager.getMicrophones` API returns an empty array or an array with an object, where  the id is set to `microphone:` and the name is set to an empty string.

Additionally, to detect the scenario where the user removes the microphone during the call and there are no available microphones in the system,
the application can listen to the `noMicrophoneDevicesEnumerated` bad event in the [User Facing Diagnostics Feature](../../../concepts/voice-video-calling/user-facing-diagnostics.md).
This event can help the application understand the current situation, and show the warning message on its UI accordingly.

## How to monitor
### Azure log
...
### CDC
...

## How to mitigate or resolve
The application should always call the `DeviceManager.askDevicePermission` API to ensure that the required permissions are granted.
If the user doesn't grant the microphone permission, the application should show a warning on its UI.

The application should also check whether the microphone list is empty and show a warning accordingly. 
Additionally, the application should listen to the `noMicrophoneDevicesEnumerated` UFD event and show a message when there are no available microphone devices.
This will help the user understand what is happening.
