---
title: Device and permission issues - Overview
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview of device and permission issues
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 02/24/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# Overview of device and permission issues
There are two different types of permissions in general: browser permission and system permission.
When an application needs to access a user's audio or video input device, it requires permissions granted at both the browser and system level.

If an application doesn't have the required permission, it won't be able to access the device,
which means that other participants in the call won't be able to see or hear the user. 

To avoid these issues, it's important for users to grant the necessary permissions when prompted by the browser.
If a user accidentally denies permission or needs to change their permissions later, they can usually do so through the browser settings.

The permission is also necessary for the application to retrieve detailed device list information.
The application can call `DeviceManager.askDevicePermission` to trigger the permission prompt UI.
However, the browser may cache the permission result and return it without showing the permission prompt UI.
If the permission result is `denied`, the user needs to update the permission through the browser settings.

## Common issues related to the device and permission
Here are some common issues related to devices and permissions, along with their potential causes:

### The getMicrophones API returns an empty array or doesn't return detailed microphone list
* There is no microphone device available in the system.
* The microphone permission has not been granted.

### The getSpeakers API returns an empty array or doesn't return detailed speaker list
* There is no speaker device available in the system.
* The browser doesn't support speaker enumeration.
* The microphone permission has not been granted.

### No permission prompt shows when calling askDevicePermission
* The browser has cached the permission result previously and returns it without prompting the user.
* There is no microphone device available when requesting microphone permission.
* There is no camera device available when requesting camera permission.

### The askDevicePermission API takes too long
* The user doesn't grant or deny the permission prompt.
* The device driver layer responds slowly.
