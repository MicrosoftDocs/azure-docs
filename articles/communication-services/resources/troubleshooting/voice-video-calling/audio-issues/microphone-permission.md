---
title: Audio issues - The speaking participant doesn't grant the microphone permission
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot one-way audio issue when the speaking doesn't grant the microphone permission.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 04/09/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The speaking participant doesn't grant the microphone permission
When the speaking participant doesn't grant microphone permission, it can result in a one-way audio issue in the call.
This issue occurs if the user denies permission at the browser level or doesn't grant access at the operating system level.

## How to detect using the SDK
When an application requests microphone permission but the permission is denied,
the `DeviceManager.askDevicePermission` API returns `{ audio: false }`.

To detect this permission issue, the application can register a listener callback through the [User Facing Diagnostics API](../../../../concepts/voice-video-calling/user-facing-diagnostics.md).
The listener should check for events with the value of `microphonePermissionDenied`.

It's important to note that if the user revokes access permission during the call, this `microphonePermissionDenied`  event also fires.

## How to mitigate or resolve
Your application should always call the `askDevicePermission` API after the `CallClient` is initialized.
This way gives the user a chance to grant the device permission if they didn't do so before or if the permission state is `prompt`.

It's also important to listen for the `microphonePermissionDenied` event. Display a warning message if the user revokes the permission during the call. By doing so, the user is aware of the issue and can adjust their browser or system settings accordingly.


