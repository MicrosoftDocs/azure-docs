---
title: Architectural concepts in Azure IoT Central - Energy | Microsoft Docs
description: This article introduces key concepts relating the architecture of Azure IoT Central
author: op-ravi
ms.author: omravi
ms.date: 10/22/2019
ms.topic: overview
ms.service: iot-central
services: iot-central
manager: abjork
---

# Azure IoT Central - solar panel app architecture

## Architecture

This article provides an overview of the Solar Panel Monitoring App template architecture. This diagram shows a commonly used architecture for solar panel app on Azure using IoT Central platform.

[!div class="mx-imgBorder"]
![smart meter architecture](media/concept-iot-central-solar-panel/solar-panel-app-architecture.png)

This architecture consists of the following components. Some applications may not require every component listed here.

### Solar panels and connectivity 

Solar panels are one of the significant sources of renewable energy. Depending on the solar panel type and set up, you can connect it either via gateways or via other intermediate devices and proprietary systems. You might need to build IoT Central device bridge to connect devices, which can’t be connected directly. The IoT Central device bridge is an open-source solution and you can find the complete details [here](https://docs.microsoft.com/en-us/azure/iot-central/howto-build-iotc-device-bridge) 



### IoT Central platform

IoT Central is a platform to build your IoT solutions and allows partners to extend and customize for their specific needs. After you connect your solar panels to IoT Central platform, it provides device management, including command and control. In the solar panel app, we use the operational data store that comes with Central for warm path scenario such as monitor, analyze, and visualize meter data in near real time.

### Extensibility options to build with IoT Central
The IoT Central platform provides two extensibility options: Continuous Data Export (CDE) and APIs. You can choose between these options based on your requirements. For example, one of the partners configured CDE with Azure Data Lake Storage (ADLS). They're using ADLS for long-term data retention and other cold path storage scenarios, such batch processing, auditing, and reporting purposes. 

## Next steps

* Now that you've learned about the architecture, [create solar panel app for free](https://apps.azureiotcentral.com/build/new/smart-panel-monitoring)
