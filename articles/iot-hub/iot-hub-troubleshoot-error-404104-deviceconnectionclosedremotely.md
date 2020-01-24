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

### Symptom 1

Devices disconnect a regular interval (every 65 minutes, for example) and log **404104 DeviceConnectionClosedRemotely** in IoT Hub diagnostic logs. Sometimes, this is also accompanied by a `401003 IoTHubUnauthorized` and successful device connection event less than a minute later.

### Symptom 2

Devices disconnect randomly, and log **404104 DeviceConnectionClosedRemotely** in IoT Hub diagnostic logs. Typically, this is also accompanied by a device connection event less than a minute later.

### Symptom 3

Many devices disconnect at once, you see a dip in the [connected devices metric](iot-hub-metrics.md), and there are increased **404104 DeviceConnectionClosedRemotely** and [500xxx Internal errors](iot-hub-troubleshoot-error-500xxx-internal-errors.md) in diagnostic logs.

## Causes

### Cause 1

The [SAS token used to connect to IoT Hub](iot-hub-devguide-security.md#security-tokens) expired, which causes IoT Hub to disconnect the device. The connection is re-established when the token is refreshed by the device. This is the likely cause in the case of a regular disconnect because the SAS token expires every hour by default.

To learn more, see [401003 IoTHubUnauthorized cause](iot-hub-troubleshoot-error-401003-iothubunauthorized.md#cause-1).

### Cause 2

Some possibilities include:

- The device lost underlying network connectivity for a period longer than the [MQTT keep-alive](iot-hub-mqtt-support.md) setting and was not able to communicate with IoT Hub resulting in a remote idle timeout. The MQTT keep-alive setting can be different per device.

- The device sent a TCP/IP-level reset but didn't send an application-level `MQTT DISCONNECT`. Basically, the device abruptly closed the underlying socket connection. Sometimes, this is caused by bugs in older versions of the Azure IoT SDK.

- The device side application crashed.

### Cause 3

IoT Hub might be experiencing a transient issue. See [IoT Hub internal server error cause](iot-hub-troubleshoot-error-500xxx-internal-errors.md#cause).

## Solutions

### Solution 1

See [401003 IoTHubUnauthorized solution 1](iot-hub-troubleshoot-error-401003-iothubunauthorized.md#solution-1)

### Solution 2

- Make sure the device can connect to IoT Hub by [testing the connection](tutorial-connectivity.md). 
- Some IoT SDKs let you to configure higher keep-alive timeout via API call which could help with flaky networks. Max is 29:45 minutes for MQTT.
- Use the latest versions of the [device SDKs](iot-hub-devguide-sdks.md)

### Solution 3

See [solutions to IoT Hub internal server errors](iot-hub-troubleshoot-error-500xxx-internal-errors.md#solution).

## Next steps

We recommend using Azure IoT device SDKs to manage connections reliably. To learn more, see [Manage connectivity and reliable messaging by using Azure IoT Hub device SDKs](iot-hub-reliability-features-in-sdks.md)