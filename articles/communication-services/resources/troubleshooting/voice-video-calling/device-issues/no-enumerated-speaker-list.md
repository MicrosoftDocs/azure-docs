---
title: Device and permission issues - getSpeakers API doesn't return detailed speaker list
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot when getSpeakers API doesn't return detailed speaker list.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 03/28/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The getSpeakers API doesn't return detailed speaker list
If a user reports that they can't see the detailed speaker list, it could be because the application doesn't have permission to access the microphone.
Alternatively, the platform may not support speaker enumeration.

The way browsers currently work may seem counterintuitive, as the permission to access the microphone can interfere with the enumeration of speakers.
The speaker and microphone enumeration shares the same permission information.

When the microphone permission state is `prompt` or `denied`, the browser doesn't provide detailed information about the microphone devices and speaker devices.
In this scenario, [`DeviceManager.getSpeakers`](/javascript/api/azure-communication-services/@azure/communication-calling/devicemanager?view=azure-communication-services-js&preserve-view=true#@azure-communication-calling-devicemanager-getspeakers) API returns an array with one object, where the `id` is set to `speaker:` and the name is set to an empty string.

Some platforms, such as iOS Safari, macOS Safari, or earlier versions of Firefox don't support speaker enumeration.

It's important to note that this scenario is different from the scenario where a user doesn't have any audio output device.
In the latter case, the [`DeviceManager.getSpeakers`](/javascript/api/azure-communication-services/@azure/communication-calling/devicemanager?view=azure-communication-services-js&preserve-view=true#@azure-communication-calling-devicemanager-getspeakers) API only returns an empty array, indicating that there's no available audio output device in the user's system.

## How to detect using the SDK
[`DeviceManager.getSpeakers`](/javascript/api/azure-communication-services/@azure/communication-calling/devicemanager?view=azure-communication-services-js&preserve-view=true#@azure-communication-calling-devicemanager-getspeakers) API returns an empty array or an array with an object, where  the `id` is set to `speaker:` and the name is set to an empty string.

Additionally, to detect the scenario where the user removes the speaker during the call and there are no available audio output devices in the system, the application can listen to the `noSpeakerDevicesEnumerated` event being raised to true in the [User Facing Diagnostics Feature](../../../../concepts/voice-video-calling/user-facing-diagnostics.md). This event can help the application understand the current situation, and show the warning message on its UI accordingly.

For the platform that doesn't support speaker enumeration, you get an error when calling [`DeviceManager.getSpeakers`](/javascript/api/azure-communication-services/@azure/communication-calling/devicemanager?view=azure-communication-services-js&preserve-view=true#@azure-communication-calling-devicemanager-getspeakers) API.

The error code/subcode is

| error            | Details                                               |
|------------------|-------------------------------------------------------|
| code             | 405 (Method Not Allowed)                              |
| subcode          | 40606                                                 |
| message          | This device doesn't support speaker enumeration.     |
| resultCategories | Expected                                              |

## How to mitigate or resolve
The application should always call the `DeviceManager.askDevicePermission` API to ensure that the required permissions are granted.
If the user doesn't grant the microphone permission, the application should show a warning on its user interface, so the user knows that they aren't able to see the speaker device list.

The application should also check whether the speaker list is empty or handle the error when calling [`DeviceManager.getSpeakers`](/javascript/api/azure-communication-services/@azure/communication-calling/devicemanager?view=azure-communication-services-js&preserve-view=true#@azure-communication-calling-devicemanager-getspeakers) API, and show a warning accordingly.
Additionally, the application should listen to the `noSpeakerDevicesEnumerated` event and show a message when there are no available speaker devices.
