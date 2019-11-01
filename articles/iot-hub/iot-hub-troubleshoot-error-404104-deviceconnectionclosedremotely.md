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

Devices seem to disconnect randomly and logs 404104 DeviceConnectionClosedRemotely in IoT Hub diagnostic logs. Typically, this is also accompanied by a device connection event less than a minute later.

## Cause

The connection was closed by the device, but IoT Hub doesn't know why. Common causes include MQTT/AMQP timeout and internet connectivity loss.

## Solution

Make sure the device can connect to IoT Hub by [testing the connection](tutorial-connectivity.md). If the connection is good, but the device disconnects intermittently, make sure to implement proper keep alive device logic for your choice of protocol (MQTT/AMPQ).

## Next steps

Include this section if there are 1 -3 concrete, highly relevant next steps the user should take. Delete if there are no next steps. This is not a place for a list of links. If you include links to next steps, make sure to include text to explain why the next steps are relevant or important.
