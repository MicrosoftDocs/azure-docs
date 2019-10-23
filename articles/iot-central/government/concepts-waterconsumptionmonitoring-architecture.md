---
title: Create a water quality monitoring app with Azure IoT Central | Microsoft Docs
description: Learn to build Create a water quality monitoring application using Azure IoT Central application templates.
author: miriambrus
ms.author: miriamb
ms.date: 09/24/2019
ms.topic: tutorial
ms.service: iot-central
services: iot-central
manager: aabjork
---

# Water consumption monitoring reference architecture 

Water consumption monitoring solutions can be built with the **Azure IoT Central app template** as a kick starter IoT application. This article provides a high-level reference architecture guidance on building an end to end solution. 

[!div class="mx-imgBorder"] 
![Water consumption monitoring architecture](./media/concepts-waterconsumptionmonitoring-architecture/concepts-waterconsumptionmonitoring-architecture1.png)

Concepts:

1. Devices and connectivity  
1. IoT Central 
2. Extensibility and integrations
3. Business applications

Let's take a look at key components that generally play a part in a water consumption monitoring solution.

In this page, we will refer to devices used for smart water solutions, such as water quality monitoring or water consumption monitoring, generally as smart water devices. Smart water devices can be flow meters, water quality monitors, smart valves, leak detectors etc.

## Devices and connectivity 
Devices used in smart water solutions will generally be connected through low power wide area networks (LPWAN), via a third-party network operator. For these types of devices, you can leverage the [Azure IoT Central Device Bridge](https://docs.microsoft.com/en-us/azure/iot-central/howto-build-iotc-device-bridge) to send your device data to your IoT application in Azure IoT Central. Alternatively, you may have device gateways that are IP capable and can connect directly to IoT Central.

## IoT Central 
Azure IoT Central is an IoT App platform which gets you started up and running on your IoT solution quickly. You can brand, customize, and integrate your solution with third-party services.
After you connect your smart water devices to IoT Central, you get out of the box device command and control, monitoring and alerting, user interface with built in RBAC, configurable insights dashboards, and extensibility options. 


## Extensibility and integrations 
You can extend your IoT application in IoT Central and optionally:
* transform and integrate your IoT data for advanced analytics, for example training machine learning models, through continuous data export from IoT Central application
* automate workflows in other systems by triggering actions via Microsoft Flow or webhooks from IoT Central application
* programatically access your IoT application in IoT Central through IoT Central APIs

## Business Applications 
The IoT data can be used to power a variety of business applications within a water utility, to visualize business insights and take meaningful actions. To learn how to connect your IoT Central water consumption monitoring application with field services, follow the tutorial on [how to integrate with Dynamics 365 Field Services](./how-to-configure-connected-field-services.md) 


## Next steps
* Learn how to [create a water consumption](./tutorial-water-consumption-monitoring.m) IoT Central application
* Learn more about [IoT Central government templates](./overview-iot-central-government.md)
* To learn more about IoT Central, see [IoT Central overview](https://docs.microsoft.com/en-us/azure/iot-central/overview-iot-central)
