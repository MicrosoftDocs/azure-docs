---
title: Troubleshooting Azure IoT Hub error 412002 DeviceMessageLockLost
description: Understand how to fix error 412002 DeviceMessageLockLost 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 11/01/2019
ms.author: jlian
# As a developer or operator for Azure IoT Hub, I want to resolve 412002 DeviceMessageLockLost errors.
---

# 412002 DeviceMessageLockLost

This article describes the causes and solutions for **412002 DeviceMessageLockLost** errors.

## Symptoms

When trying to send a cloud-to-device message from IoT Hub to a device, the request fails with the error **412002 DeviceMessageLockLost**.

## Cause

When device receives a cloud-to-device message from queue (for example, using [`ReceiveAsync()`](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.deviceclient.receiveasync?view=azure-dotnet)) the message is locked by IoT Hub for a lock timeout duration for one minute. If the device tries to complete the message after the lock timeout duration, IoT Hub throws this exception.

## Solution

If IoT Hub doesn't get the notification within the one minute lock timeout duration, it sets the message back to *Enqueued* state. The device can attempt to receive the message again. To prevent the error from happening in the future, implement device side logic to complete the message within one minute of receiving the message.