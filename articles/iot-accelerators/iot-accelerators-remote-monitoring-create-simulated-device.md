---
title: Device simulation with IoT remote monitoring - Azure | Microsoft Docs
description: This how-to guide shows you how to use the device simulator with the remote monitoring solution accelerator.
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 09/28/2018
ms.topic: conceptual

# As a developer, I want to know how to create and test a new simulated device before I deploy it to the cloud.
---

# Create and test a new simulated device

The Remote Monitoring solution accelerator lets you define your own simulated devices. This article shows you how to define a new simulated lightbulb device and then test it locally. The solution accelerator includes simulated devices such as chillers and trucks. However, you can define your own simulated devices to test your IoT solutions before you deploy real devices.

This how-to guide shows you how to customize the device simulation microservice. This microservice is part of the Remote Monitoring solution accelerator. To show the device simulation capabilities, this how-to guide uses two scenarios in the Contoso IoT application:

[!INCLUDE [iot-solution-accelerators-create-device](../../includes/iot-solution-accelerators-create-device.md)]

## Next steps

This guide showed you how to create a custom simulated device types and test them by running the device simulation microservice locally.

The suggested next step is to learn how to deploy your custom simulated device types to the [Remote Monitoring solution accelerator](iot-accelerators-remote-monitoring-deploy-simulated-device.md).
