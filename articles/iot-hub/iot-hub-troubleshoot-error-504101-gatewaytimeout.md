---
title: Troubleshooting Azure IoT Hub error 504101 GatewayTimeout
description: Understand how to fix error 504101 GatewayTimeout 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 01/30/2020
ms.author: jlian
ms.custom: amqp
# As a developer or operator for Azure IoT Hub, I want to resolve 504101 GatewayTimeout errors.
---

# 504101 GatewayTimeout

This article describes the causes and solutions for **504101 GatewayTimeout** errors.

## Symptoms

When trying to invoke a direct method from IoT Hub to a device, the request fails with the error **504101 GatewayTimeout**.

## Cause

### Cause 1

IoT Hub encountered an error and couldn't confirm if the direct method completed before timing out.

### Cause 2

When using an earlier version of the Azure IoT C# SDK (<1.19.0), the AMQP link between the device and IoT Hub can be dropped silently because of a bug.

## Solution

### Solution 1

Issue a retry.

### Solution 2

Upgrade to the latest version of the Azure IOT C# SDK.