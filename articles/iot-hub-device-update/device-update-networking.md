---
title: Device Update for IoT Hub network requirements | Microsoft Docs
description: Device Update for IoT Hub uses a variety of network ports for different purposes.
author: vimeht
ms.author: vimeht
ms.date: 1/11/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Ports Used With Device Update for IoT Hub
ADU uses a variety of network ports for different purposes.

## Default Ports

Purpose|Port Number |
---|---
Download from Networks/CDNs  | 80 (HTTP Protocol)
Download from MCC/CDNs | 80 (HTTP Protocol)
ADU Agent Connection to Azure IoT Hub  | 8883 (MQTT Protocol)

## Use Azure IoT Hub supported protocols
The ADU agent can be modified to use any of the supported Azure IoT Hub protocols.

[Learn more](../iot-hub/iot-hub-devguide-protocols.md) about the current list of supported protocols.
