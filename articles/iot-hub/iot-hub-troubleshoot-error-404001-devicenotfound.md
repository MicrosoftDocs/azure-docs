---
title: Troubleshooting Azure IoT Hub error 404001 DeviceNotFound
description: Understand how to fix error 404001 DeviceNotFound 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 01/30/2020
ms.author: jlian
# As a developer or operator for Azure IoT Hub, I want to resolve 404001 DeviceNotFound errors.
---

# 404001 DeviceNotFound

This article describes the causes and solutions for **404001 DeviceNotFound** errors.

## Symptoms

During a cloud-to-device (C2D) communication, such as C2D message, twin update, or direct method, the operation fails with error **404001 DeviceNotFound**.

## Cause

The operation failed because the device cannot be found by IoT Hub. The device is either not registered or disabled.

## Solution

Register the device ID that you used, then try again.