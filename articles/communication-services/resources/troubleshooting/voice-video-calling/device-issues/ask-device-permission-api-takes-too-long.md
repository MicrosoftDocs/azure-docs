---
title: Device and permission issues - askDevicePermission API takes too long
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot when askDevicePermission API takes too long.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 03/27/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The askDevicePermission API takes too long
The `askDevicePermission` API triggers the permission prompt and updates the device list internally.
If you find that this API is taking a long time, it could be due to delays in either step.
If the browser shows the permission prompt UI and the user doesn't respond for a while,
the ACS Web Calling SDK resolves the promise and returns the permission result.

Occasionally, the device list update step can take a long time.
This issue is usually because the driver layer responds late, which can happen with some virtual audio devices in particular. [Chromium Issue 1402866](https://bugs.chromium.org/p/chromium/issues/detail?id=1402866&no_tracker_redirect=1)

## How to detect
### SDK
To detect this issue, you can measure the time difference between when you call the `askDevicePermission` API and when the promise resolves or rejects.

## How to mitigate or resolve
If the `askDevicePermission` API fails due to the user not responding to the permission prompt UI,
the application can retry the API again and the user should see the permission prompt UI.

If the device list update step takes a long time, the user should check their audio device list and see if there's any device that could potentially be causing this issue.
They may need to update or remove the problematic device to resolve the issue.
