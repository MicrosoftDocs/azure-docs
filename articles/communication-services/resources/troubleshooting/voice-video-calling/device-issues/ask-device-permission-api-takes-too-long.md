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
The [`askDevicePermission`](/javascript/api/%40azure/communication-react/calladapterdevicemanagement?view=azure-node-latest&preserve-view=true#@azure-communication-react-calladapterdevicemanagement-askdevicepermission) API will have the end user will be shown a browser prompt asking if they allow permission to use (camera or microphone).
If the end users aproves to use their camera or microphone then those devices will be available to be used in a call and their availability will be reflected in available device list.
If you find that this API is taking a long time to respond, it could be due to delays in the end user approving the permission prompt user interface.

Occasionally, the device list update step can take a long time.
This issue is usually because the driver layer responds late, which can happen with some virtual audio devices in particular. [Chromium Issue 1402866](https://bugs.chromium.org/p/chromium/issues/detail?id=1402866&no_tracker_redirect=1)

## How to detect using the SDK
To detect this issue, you can measure the time difference between when you call the [`askDevicePermission`](/javascript/api/%40azure/communication-react/calladapterdevicemanagement?view=azure-node-latest&preserve-view=true#@azure-communication-react-calladapterdevicemanagement-askdevicepermission) API and when the promise resolves or rejects.

## How to mitigate or resolve
If the [`askDevicePermission`](/javascript/api/%40azure/communication-react/calladapterdevicemanagement?view=azure-node-latest&preserve-view=true#@azure-communication-react-calladapterdevicemanagement-askdevicepermission) API fails due to the user not responding to the permission prompt UI,
the application can retry the API again and the user should see the permission prompt UI.

If the device list update step takes a long time, the user should check their audio device list and see if there's any device that could potentially be causing this issue.
They may need to update or remove the problematic device to resolve the issue.
