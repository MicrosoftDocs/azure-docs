---
title: Device Update for IoT Hub network requirements
description: Device Update for IoT Hub uses a variety of network ports for different purposes.
author: vimeht
ms.author: vimeht
ms.date: 1/11/2021
ms.topic: concept-article
ms.service: iot-hub-device-update
---

# Ports used with Device Update for IoT Hub

Device Update for IoT Hub uses a variety of network ports for different purposes.

## Default Ports

Purpose|Port Number |
---|---
Download from networks/CDNs  | 80 (HTTP protocol)
Download from MCC/CDNs | 80 (HTTP protocol)
Device Update agent connection to IoT Hub  | 8883 (MQTT protocol)

## Use IoT Hub supported protocols

The Device Update agent can be modified to use any of the supported Azure IoT Hub protocols.

For more information, see [Choose a device communication protocol](../iot-hub/iot-hub-devguide-protocols.md).
