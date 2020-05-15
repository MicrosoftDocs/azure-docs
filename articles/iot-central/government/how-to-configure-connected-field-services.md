---
title: Connect your Azure IoT Central application with Dynamics 365 Field Services | Microsoft Docs
description: Learn how to build an end-to-end solution with Azure IoT Central and Dynamics 365 Field Service 
author: miriambrus
ms.author: miriamb
ms.date: 10/23/2019
ms.topic: how-to
ms.service: iot-central
services: iot-central
---


# Build end-to-end solution with Azure IoT Central and Dynamics 365 Field Service 



As a builder, you can enable integration of your Azure IoT Central application to other business systems. 


For example, in a connected waste management solution you can optimize the dispatch of trash collections trucks. The optimization can be done based on IoT sensors data from connected waste bins. In your [IoT Central connected waste management application](./tutorial-connected-waste-management.md) you can configure rules and actions, and set it to trigger creating alerts in Dynamics Field Service. This scenario is accomplished by using Microsoft Flow, which will be configured directly in IoT Central for automating workflows across applications and services. Additionally, based on service activities in Field Service, information can be sent back to Azure IoT Central. 

## How to connect your Azure IoT Central application with Dynamics 365 Field Services 

The below integration processes can be easily implemented based on a pure configuration experience:
* Azure IoT Central can send information about device anomalies to Connected Field Service (as an IoT Alert) for diagnosis.
* Connected Field Service can create cases or work orders triggered from device anomalies.
* Connected Field Service can schedule technicians for inspection to prevent the downtime incidents.
* Azure IoT Central device dashboard can be updated with relevant service and scheduling information.


## Next steps
* Learn more about [IoT Central government templates](./overview-iot-central-government.md)
* Learn more about [IoT Central](https://docs.microsoft.com/azure/iot-central/core/overview-iot-central)
* Learn more about [Dynamics 365 Field Services](https://docs.microsoft.com/dynamics365/field-service/cfs-iot-overview)
