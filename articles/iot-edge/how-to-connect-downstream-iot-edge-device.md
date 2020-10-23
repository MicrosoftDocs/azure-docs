---
title: Connect downstream IoT Edge devices - Azure IoT Edge | Microsoft Docs
description: How to configure an IoT Edge device to connect to Azure IoT Edge gateway devices. 
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 10/15/2020
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom:  [amqp, mqtt]
monikerRange: '>= iotedge-1.2'
---

# Connect a downstream IoT Edge device to an Azure IoT Edge gateway

This article provides instructions for establishing a trusted connection between an IoT Edge device and an IoT Edge gateway.

In a gateway scenario, an IoT Edge device can be both a gateway and a downstream device. Multiple IoT Edge gateways can link together to create a hierarchy of devices. Only the top IoT Edge device in a hierarchy can connect to IoT Hub. All IoT Edge devices in lower layers of a hierarchy can only communicate with their gateway (or parent) device and any downstream (or child) devices.

This article focuses on configuring an IoT Edge device for a lower level of a gateway hierarchy. This device is downstream of an IoT Edge gateway, but may also be a gateway itself for downstream IoT or IoT Edge devices. These steps are similar to the steps in [Configure an IoT Edge device to act as a transparent gateway](how-to-create-transparent-gateway.md), but some important differences are required to make sure the device communicates through its gateway for any cloud connections.