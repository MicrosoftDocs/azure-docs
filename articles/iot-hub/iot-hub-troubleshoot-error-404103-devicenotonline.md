---
title: Troubleshooting Azure IoT Hub error 404103 DeviceNotOnline
description: Understand how to fix error 404103 DeviceNotOnline 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 01/30/2020
ms.author: jlian
# As a developer or operator for Azure IoT Hub, I want to resolve 404103 DeviceNotOnline errors.
---

# 404103 DeviceNotOnline

This article describes the causes and solutions for **404103 DeviceNotOnline** errors.

## Symptoms

A direct method to a device fails with the error **404103 DeviceNotOnline** even if the device is online. 

## Cause

If you know that the device is online and still get the error, it's likely because the direct method callback isn't registered on the device.

## Solution

To configure your device properly for direct method callbacks, see [Handle a direct method on a device](iot-hub-devguide-direct-methods.md#handle-a-direct-method-on-a-device).