---
title: Device and permission issues - Overview
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview of device and permission issues
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 03/29/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# Overview of device and permission issues
In the WebJS calling SDK, there are two types of permissions: browser permissions and system permissions.
When an application needs to access a user's audio or video input device, it requires permissions granted at both the browser and system level.

If an application doesn't have the required permission, it can't access the device,
which means that other participants in the call are unable to see or hear the user.

To avoid these issues, it's important for users to grant the necessary permissions when prompted by the browser.
If a user accidentally denies permission or needs to change their permissions later, they can usually do so through the browser settings.

The permission is also necessary for the application to retrieve detailed device list information.
The application can call [`DeviceManager.askDevicePermission`](/javascript/api/%40azure/communication-react/calladapterdevicemanagement?view=azure-node-latest&preserve-view=true#@azure-communication-react-calladapterdevicemanagement-askdevicepermission) to trigger the permission prompt UI.
However, the browser may cache the permission result and return it without showing the permission prompt UI.
If the permission result is `denied`, the user needs to update the permission through the browser settings.

## Common issues related to the device and permission
Here are some common issues related to devices and permissions, along with their potential causes:

### The getMicrophones API returns an empty array or doesn't return detailed microphone list
* The microphone device isn't available in the system.
* The microphone permission isn't granted.

### The getSpeakers API returns an empty array or doesn't return detailed speaker list
* The speaker device isn't available in the system.
* The browser doesn't support speaker enumeration.
* The microphone permission isn't granted.

### No permission prompt shows when calling askDevicePermission
* The browser caches the permission result granted or denied previously and returns it without prompting the user.
* The microphone device isn't available when requesting microphone permission.
* The camera device isn't available when requesting camera permission.

### The askDevicePermission API takes too long
* The user doesn't grant or deny the permission prompt.
* The device driver layer responds slowly.

## Next steps

This overview article provides basic information on device and permission issues you may encounter when using the WebJS calling SDK.
For more detailed guidance, follow the links to the pages listed within the `Device and permission issues` section of this troubleshooting guide.
