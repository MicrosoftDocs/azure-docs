---
title: Build government solutions with Azure IoT Central | Microsoft Docs
description: Learn to build government solution using Azure IoT Central application templates.
author: miriambrus
ms.author: philmea
ms.date: 09/24/2019
ms.topic: overview
ms.service: iot-central
services: iot-central
manager: miriamb
---


# How to connect your application with Dynamics 365 Field Services 

As a builder, you can enable integration of your Azure IoT Central application to other business systems. 

For example, in a connected waste management solution you can optimize the dispatch of the collections trucks based on the data from IoT sensors from connected waste bins. In your [IoT Central connected waste management application](./tutorial-connected-waste-management.md) you can configure rules and actions, and set it to trigger creating alerts in Dynamics Field Service. This scenario is accomplished by using Microsoft Flow, which you can configure directly in IoT Central for automating workflows across applications and services. Also, based on service activities in Field Service, information can be sent back to Azure IoT Central. 

The below end-to-end integration processes can be easily implemented based on a pure configuration experience:
* Azure IoT Central can send information about device anomalies to Connected Field Service (as an IoT Alert) for diagnosis.
* Connected Field Service can create cases or work orders triggered from device anomalies.
* Connected Field Service can schedule technicians for inspection to prevent the downtime incidents.
* Azure IoT Central device dashboard can be updated with relevant service and scheduling information.


## Next steps
* Learn more about [IoT Central government templates](./overview-iot-central-government.md)
* Learn more about [IoT Central](https://docs.microsoft.com/en-us/azure/iot-central/overview-iot-central)
* Learn more about [Dynamics 365 Field Services](https://docs.microsoft.com/en-us/dynamics365/field-service/cfs-iot-overview)
