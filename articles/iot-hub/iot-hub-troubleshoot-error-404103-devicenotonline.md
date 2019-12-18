---
title: Troubleshooting Azure IoT Hub error 404103 DeviceNotOnline
description: Understand how to fix error 404103 DeviceNotOnline 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 11/01/2019
ms.author: jlian
# As a developer or operator for Azure IoT Hub, I want to resolve 404103 DeviceNotOnline errors.
---

# 404103 DeviceNotOnline

This article describes the causes and solutions for **404103 DeviceNotOnline** errors.

## Symptoms

Direct method to a device fails with the error **404103 DeviceNotOnline** even if the device is online. 

## Cause

If you confirmed that the device is online and still get the error, it's likely because the direct method callback is not registered on the device.

## Solution

To configure your device properly for direct method callback, see [Handle a direct method on a device](iot-hub-devguide-direct-methods.md#handle-a-direct-method-on-a-device).

## Next steps

Include this section if there are 1 -3 concrete, highly relevant next steps the user should take. Delete if there are no next steps. This is not a place for a list of links. If you include links to next steps, make sure to include text to explain why the next steps are relevant or important.
