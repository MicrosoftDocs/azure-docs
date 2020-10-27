---
title: Troubleshooting Azure IoT Hub error 409001 DeviceAlreadyExists
description: Understand how to fix error 409001 DeviceAlreadyExists 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 01/30/2020
ms.author: jlian
# As a developer or operator for Azure IoT Hub, I want to resolve 409001 DeviceAlreadyExists errors.
---

# 409001 DeviceAlreadyExists

This article describes the causes and solutions for **409001 DeviceAlreadyExists** errors.

## Symptoms

When trying to register a device in IoT Hub, the request fails with the error **409001 DeviceAlreadyExists**.

## Cause

There's already a device with the same device ID in the IoT hub. 

## Solution

Use a different device ID and try again.