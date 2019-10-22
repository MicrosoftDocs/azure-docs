---
title: Architectural concepts in Azure IoT Central -Energy | Microsoft Docs
description: This article introduces key concepts relating the architecture of Azure IoT Central
author: op-ravi
ms.author: omravi
ms.date: 10/22/2019
ms.topic: overview
ms.service: iot-central
services: iot-central
manager: abjork
---

# Azure IoT Central - smart meter app architecture

## Architecture

This article provides an overview of the Smart Meter Monitoring App template architecture. This diagram shows a commonly used architecture for smart meter app on Azure using IoT Central platform.

[!div class="mx-imgBorder"]
![smart meter architecture](media/concept-iot-central-smart-meter/smart-meter-app-architecture.png)

This architecture consists of the following components. Some applications may not require every component listed here.

### Smart meter and connectivity 

A smart meter is one of the most important devices among the energy devises. It records and communicates energy consumption data to utilities for monitoring and other use cases, such as billing and demand response. Based on the meter type, it can connect to IoT Central either via gateways or via other intermediate devices or systems, such edge devices and head-end systems. Build IoT Central device bridge to connect devices, which can’t be connected directly. The IoT Central device bridge is an open-source solution and to learn more about can find the complete details [here](https://docs.microsoft.com/en-us/azure/iot-central/howto-build-iotc-device-bridge) 


### IoT Central Platform

IoT Central is a platform to build your IoT solutions and allows partners to extend and customize for their specific needs. After you connect your smart meters to IoT Central platform, it provides device management, including command and control. In the smart meter app, we use the IoT Central storage for warm path scenarios such as monitor, analyze, and visualize meter data in near real time.

### Extensibility options to build with IoT Central
The IoT Central platform provides two extensibility options: Continuous Data Export (CDE) and APIs. You can choose between these options based on your requirements. For example, one of the partners configured CDE with Azure Data Lake Storage (ADLS). They're using ADLS for long-term data retention and other cold path storage scenarios, such batch processing, auditing and reporting purposes. 

## Next steps

* Now that you've learned about the architecture, [create smart meter app for free](https://apps.azureiotcentral.com/build/new/smart-meter-monitoring)

