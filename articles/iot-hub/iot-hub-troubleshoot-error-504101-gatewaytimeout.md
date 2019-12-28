---
title: Troubleshooting Azure IoT Hub error 504101 GatewayTimeout
description: Understand how to fix error 504101 GatewayTimeout 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 11/01/2019
ms.author: jlian
# As a developer or operator for Azure IoT Hub, I want to resolve 504101 GatewayTimeout errors.
---

# 504101 GatewayTimeout

This article describes the causes and solutions for **504101 GatewayTimeout** errors.

## Symptoms

When trying to invoke a direct method from IoT Hub to a device, the request fails with the error **504101 GatewayTimeout**.

## Cause

### Cause 1

IoT Hub gateway timed out waiting for the device to respond to the direct method.

### Cause 2

When using an earlier version of the Azure IoT C# SDK (<1.19.0), AMQP link between the device and IoT Hub can be dropped silently due to a bug.

## Solution

### Solution 1

Ensure the device is online and capable of receiving direct methods, then issue a retry

### Solution 2

Upgrade to the latest version of the Azure IOT C# SDK.