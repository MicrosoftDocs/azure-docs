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
The application can also show a warning message if the user denies the permission, so the user can fix it before joining a call.

It's also important to listen for the `microphonePermissionDenied` event. Display a warning message if the user revokes the permission during the call. By doing so, the user is aware of the issue and can adjust their browser or system settings accordingly.

## References
### Troubleshooting process
If a user cannot hear sound during a call, one possibility is that the speaking participant has not granted microphone permission.
If the speaking participant is using your application, you can follow this flow diagram to troubleshoot the issue.

:::image type="content" source="./media/permission-issue-troubleshooting.svg" alt-text="Diagram of troubleshooting the permission issue.":::

1. Check if there is a `microphonePermissionDenied` Bad UFD event for the speaking participant. This usually indicates that the user has denied the permission or that the permission is not requested.
2. If a `microphonePermissionDenied` Bad UFD event occurs, verify whether the app has called `askDevicePermission` API.
3. The app must call `askDevicePermission` if the API has not been called before the user joins the call. The app can determine the state of the permission and display a message if the user needs to adjust their permissions.
4. If the app has called `askDevicePermission` API, but the user still gets a `microphonePermissionDenied` Bad UFD event. The user has to reset or grant the microphone permission in the browser. If they have confirmed that the permission is granted in the browser, they should check if the OS is blocking mic access to the browser.
5. If there is no `microphonePermissionDenied` Bad UFD, we need to consider other possiblities. For the speaking participant, there might be other potential reasons for issues with outgoing audio, such as network reconnection, or device issues.
6. If there is a `networkReconnect` Bad UFD, the outgoing audio may be temporarily lost due to a network disconnection. Please see [There's a network issue in the call](./network-issue) for detailed information.
7. If no `networkReconnect` Bad UFD occurs, there might be a problem on the speaking participant's microphone. Please see [The speaking participant's microphone has a problem](./microphone-issue) for detiled information.

### Links
* [askDevicePermission](/javascript/api/azure-communication-services/@azure/communication-calling/devicemanager?view=azure-communication-services-js#@azure-communication-calling-devicemanager-askdevicepermission)
* [microphonePermissionDenied UFD](../references/ufd/microphone-permission-denied)
