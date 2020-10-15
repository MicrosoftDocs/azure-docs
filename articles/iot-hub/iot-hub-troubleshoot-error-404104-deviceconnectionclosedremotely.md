---
title: Troubleshooting Azure IoT Hub error 404104 DeviceConnectionClosedRemotely
description: Understand how to fix error 404104 DeviceConnectionClosedRemotely 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 01/30/2020
ms.author: jlian
ms.custom: mqtt
# As a developer or operator for Azure IoT Hub, I want to resolve 404104 DeviceConnectionClosedRemotely errors.
---

# 404104 DeviceConnectionClosedRemotely

This article describes the causes and solutions for **404104 DeviceConnectionClosedRemotely** errors.

## Symptoms

### Symptom 1

Devices disconnect at a regular interval (every 65 minutes, for example) and you see **404104 DeviceConnectionClosedRemotely** in IoT Hub diagnostic logs. Sometimes, you also see **401003 IoTHubUnauthorized** and a successful device connection event less than a minute later.

### Symptom 2

Devices disconnect randomly, and you see **404104 DeviceConnectionClosedRemotely** in IoT Hub diagnostic logs.

### Symptom 3

Many devices disconnect at once, you see a dip in the [connected devices metric](iot-hub-metrics.md), and there are more **404104 DeviceConnectionClosedRemotely** and [500xxx Internal errors](iot-hub-troubleshoot-error-500xxx-internal-errors.md) in diagnostic logs than usual.

## Causes

### Cause 1

The [SAS token used to connect to IoT Hub](iot-hub-devguide-security.md#security-tokens) expired, which causes IoT Hub to disconnect the device. The connection is re-established when the token is refreshed by the device. For example, [the SAS token expires every hour by default for C SDK](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/connection_and_messaging_reliability.md#connection-authentication), which can lead to regular disconnects.

To learn more, see [401003 IoTHubUnauthorized cause](iot-hub-troubleshoot-error-401003-iothubunauthorized.md#cause-1).

### Cause 2

Some possibilities include:

- The device lost underlying network connectivity longer than the [MQTT keep-alive](iot-hub-mqtt-support.md#default-keep-alive-timeout), resulting in a remote idle timeout. The MQTT keep-alive setting can be different per device.

- The device sent a TCP/IP-level reset but didn't send an application-level `MQTT DISCONNECT`. Basically, the device abruptly closed the underlying socket connection. Sometimes, this issue is caused by bugs in older versions of the Azure IoT SDK.

- The device side application crashed.

### Cause 3

IoT Hub might be experiencing a transient issue. See [IoT Hub internal server error cause](iot-hub-troubleshoot-error-500xxx-internal-errors.md#cause).

## Solutions

### Solution 1

See [401003 IoTHubUnauthorized solution 1](iot-hub-troubleshoot-error-401003-iothubunauthorized.md#solution-1)

### Solution 2

- Make sure the device has good connectivity to IoT Hub by [testing the connection](tutorial-connectivity.md). If the network is unreliable or intermittent, we don't recommend increasing the keep-alive value because it could result in detection (via Azure Monitor alerts, for example) taking longer. 

- Use the latest versions of the [IoT SDKs](iot-hub-devguide-sdks.md).

### Solution 3

See [solutions to IoT Hub internal server errors](iot-hub-troubleshoot-error-500xxx-internal-errors.md#solution).

## Next steps

We recommend using Azure IoT device SDKs to manage connections reliably. To learn more, see [Manage connectivity and reliable messaging by using Azure IoT Hub device SDKs](iot-hub-reliability-features-in-sdks.md)