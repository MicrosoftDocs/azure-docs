---
title: Architectural concepts in Azure IoT Central - Energy | Microsoft Docs
description: This article introduces key concepts relating the architecture of Azure IoT Central
author: op-ravi
ms.author: omravi
ms.date: 10/23/2019
ms.topic: overview
ms.service: iot-central
services: iot-central
manager: abjork
---

# Azure IoT Central - solar panel app architecture




This article provides an overview of the solar panel monitoring app template architecture. The diagram below shows a commonly used architecture for solar panel app on Azure using IoT Central platform.

> [!div class="mx-imgBorder"]
> ![smart meter architecture](media/concept-iot-central-solar-panel/solar-panel-app-architecture.png)

This architecture consists of the following components. Some applications may not require every component listed here.

## Solar panels and connectivity 

Solar panels are one of the significant sources of renewable energy. Depending on the solar panel type and set up, you can connect it either using gateways or other intermediate devices and proprietary systems. You might need to build IoT Central device bridge to connect devices, which can't be connected directly. The IoT Central device bridge is an open-source solution and you can find the complete details [here](https://docs.microsoft.com/azure/iot-central/core/howto-build-iotc-device-bridge). 



## IoT Central platform
Azure IoT Central is a platform that simplifies building your IoT solution and helps reduce the burden and costs of IoT management, operations, and development. With IoT Central, you can easily connect, monitor, and manage your Internet of Things (IoT) assets at scale. After you connect your solar panels to IoT Central, the app template uses built-in features such as device models, commands, and dashboards. The app template also uses the IoT Central storage for warm path scenarios such as near real-time meter data monitoring, analytics, rules, and visualization.


## Extensibility options to build with IoT Central
The IoT Central platform provides two extensibility options: Continuous Data Export (CDE) and APIs. The customers and partners can choose between these options based to customize their solutions for specific needs. For example, one of our partners configured CDE with Azure Data Lake Storage (ADLS). They're using ADLS for long-term data retention and other cold path storage scenarios, such batch processing, auditing, and reporting purposes. 

## Next steps

* Now that you've learned about the architecture, [create solar panel app for free](https://apps.azureiotcentral.com/build/new/solar-panel-monitoring)
* To learn more about IoT Central, see [IoT Central overview](https://docs.microsoft.com/azure/iot-central/)