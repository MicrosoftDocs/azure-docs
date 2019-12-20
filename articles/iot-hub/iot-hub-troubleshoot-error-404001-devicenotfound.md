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

<!--- Need to understand why this is such a common error? Doesn't seem to make sense that customers are always failing to register their devices?--->

The operation failed because the device cannot be found by IoT Hub because it's not registered.

## Solution

Register the device ID that you used and try again.