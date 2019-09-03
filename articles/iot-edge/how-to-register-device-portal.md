---
title: Register a new device from Azure portal - Azure IoT Edge | Microsoft Docs 
description: Use the Azure portal to register a new IoT Edge device and retrieve the connection string
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 06/03/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom: seodec18
---

# Register a new Azure IoT Edge device from the Azure portal

Before you can use your IoT devices with Azure IoT Edge, you need to register them with your IoT hub. Once you register a device, you receive a connection string that can be used to set up your device for IoT Edge workloads.

This article shows how to register a new IoT Edge device using the Azure portal.

## Prerequisites

A free for standard [IoT hub](../iot-hub/iot-hub-create-through-portal.md) in your Azure subscription.

## Create a device

In the Azure portal, IoT Edge devices are created and managed separately from devices that connect to your IoT hub but aren't edge-enabled.

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your IoT hub.
2. Select **IoT Edge** from the menu.
3. Select **Add an IoT Edge device**.
4. Provide a descriptive device ID. Use the default settings to auto-generate authentication keys and connect the new device to your hub.
5. Select **Save**.

## View all devices

All the edge-enabled devices that connect to your IoT hub are listed on the **IoT Edge** page.

## Retrieve the connection string

When you're ready to set up your device, you need the connection string that links your physical device with its identity in the IoT hub.

1. From the **IoT Edge** page in the portal, click on the device ID from the list of IoT Edge devices.
2. Copy the value of either **Connection string (primary key)** or **Connection string (secondary key)**.

## Next steps

Learn how to [Deploy modules to a device with the Azure portal](how-to-deploy-modules-portal.md).
