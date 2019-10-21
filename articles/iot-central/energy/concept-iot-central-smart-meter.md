---
title: Architectural concepts in Azure IoT Central -Energy | Microsoft Docs
description: This article introduces key concepts relating the architecture of Azure IoT Central
author: op-ravi
ms.author: omravi
ms.date: 10/14/2019
ms.topic: overview
ms.service: iot-central
services: iot-central
manager: abjork
---

# Azure IoT Central - Smart Meter App architecture

## Architecture

This article provides an overview of the Smart Meter Monitoring App template architecture. This diagram shows a commonly used architecture for smart meter app on Azure using IoT Central platform.

![Top-level architecture](media/concept-iot-central-smart-meter/smart-meter-app-architecture.png)

This architecture consists of the following components. Some applications may not require every component listed here.

### Smart Meter Devices

Smart Meters exchange data with your Azure IoT Central application. Based on smart meter type, it can  connect to IoT Central either via gateways or other intermediate devices or systems such as gateways, edge devices, head-end systems.


To learn more about how devices connect to your Azure IoT Central application, see [Device connectivity](concepts-connectivity.md).

### IoT Central 


### Extensibility



## Next steps

Now that you've learned about the architecture ...