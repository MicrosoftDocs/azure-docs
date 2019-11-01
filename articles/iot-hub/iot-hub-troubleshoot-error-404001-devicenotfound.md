---
title: Troubleshooting Azure IoT Hub error 404001 DeviceNotFound
description: Understand how to fix error 404001 DeviceNotFound 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 11/01/2019
ms.author: jlian
# As a developer or operator for Azure IoT Hub, I want to resolve 404001 DeviceNotFound errors.
---

# 404001 DeviceNotFound

This article describes the causes and solutions for **404001 DeviceNotFound** errors.

## Symptoms

During a cloud-to-device (C2D) communication such as C2D message, twin update, or direct methods, the operation fails with error `404001 DeviceNotFound`.

## Cause

The operation failed because the device cannot be found by IoT Hub, either because it's not registered or not online.

## Solution

Ensure the device is registered with IoT Hub by checking the list of devices. If not, register the device ID that you used. If the device is already registered, ensure that it's online by checking connectivity on the device.

## Next steps

Include this section if there are 1 -3 concrete, highly relevant next steps the user should take. Delete if there are no next steps. This is not a place for a list of links. If you include links to next steps, make sure to include text to explain why the next steps are relevant or important.
