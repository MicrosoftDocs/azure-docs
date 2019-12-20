---
title: Troubleshooting Azure IoT Hub error 404104 DeviceConnectionClosedRemotely
description: Understand how to fix error 404104 DeviceConnectionClosedRemotely 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 11/01/2019
ms.author: jlian
# As a developer or operator for Azure IoT Hub, I want to resolve 404104 DeviceConnectionClosedRemotely errors.
---

# 404104 DeviceConnectionClosedRemotely

This article describes the causes and solutions for **404104 DeviceConnectionClosedRemotely** errors.

## Symptoms

Devices disconnect either randomly or at a regular interval (every 65 minutes) and logs `404104 DeviceConnectionClosedRemotely` in IoT Hub diagnostic logs. Sometimes, this is also accompanied by a device connection event less than a minute later.

## Cause

### Cause 1

The device lost underlying network connectivity for a period longer than the [MQTT keep-alive](iot-hub-mqtt-support.md), which could be different per device, and was not able to communicate with IoT Hub, resulting in a remote idle timeout. 

### Cause 2

The [SAS token used to connect to IoT Hub](iot-hub-devguide-security.md#security-tokens) expired, and then the connection is re-established when the token is refreshed. This is also the likely cause of the regular disconnect because the SAS token expires every hour by default.

### Cause 3

The device sent a TCP/IP-level reset but didn't send an application-level `MQTT DISCONNECT`. Basically, the device abruptly closed the underlying socket connection.

## Solution

- Make sure the device can connect to IoT Hub by [testing the connection](tutorial-connectivity.md). 
- If your device's network connection is flaky, increase the keep-alive timeout.
- Use the latest versions of the [device SDKs](iot-hub-devguide-sdks.md)

## Next steps

We recommend using Azure IoT device SDKs to manage connection reliably. To learn more, see [Manage connectivity and reliable messaging by using Azure IoT Hub device SDKs](iot-hub-reliability-features-in-sdks.md)