---
title: Device and permission issues - askDevicePermission API takes too long
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot when askDevicePermission API takes too long.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 03/29/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The askDevicePermission API takes too long
The [`askDevicePermission`](/javascript/api/%40azure/communication-react/calladapterdevicemanagement?view=azure-node-latest&preserve-view=true#@azure-communication-react-calladapterdevicemanagement-askdevicepermission) API prompts the end user via the browser asking if they allow permission to use camera or microphone.
If the end user approves camera or microphone usage, then those devices are available to be used in a call. The devices availability is reflected in available device list.

User taking a long time to approve the permission can cause delay in the API response.

Occasionally, the device list update step can take a long time.
A delay in the driver layer is usually the cause of the issue. The issue can happen with some virtual audio devices in particular. [Chromium Issue 1402866](https://bugs.chromium.org/p/chromium/issues/detail?id=1402866&no_tracker_redirect=1)

## How to detect using the SDK
To detect this issue, you can measure the time difference between when you call the [`askDevicePermission`](/javascript/api/%40azure/communication-react/calladapterdevicemanagement?view=azure-node-latest&preserve-view=true#@azure-communication-react-calladapterdevicemanagement-askdevicepermission) API and when the promise resolves or rejects.

## How to mitigate or resolve
If the [`askDevicePermission`](/javascript/api/%40azure/communication-react/calladapterdevicemanagement?view=azure-node-latest&preserve-view=true#@azure-communication-react-calladapterdevicemanagement-askdevicepermission) API fails due to the user not responding to the UI permission prompt,
the application can retry the API again and the user should see the UI permission prompt.

As for other reasons, such as the device list updating taking too long to complete, the user should check their devices and see if there's any device that could potentially be causing this issue.
They may need to update or remove the problematic device to resolve the issue.
