---
title: Reference architecture for connected waste management solution built with Azure IoT Central| Microsoft Docs
description: Learn concepts for a connected waste management solution built with Azure IoT Central.
author: miriambrus
ms.author: miriamb
ms.date: 07/15/2021
ms.topic: conceptual
ms.service: iot-central
services: iot-central
---


# Connected waste monitoring reference architecture 

A connected waste management solution can be built using the **Azure IoT Central app template** as a starter IoT application. This article provides high-level reference architecture guidance on building an end to end solution.

![Connected waste management architecture](./media/concepts-connectedwastemanagement-architecture/concepts-connectedwastemanagement-architecture1.png)

Concepts:

1. Devices and connectivity  
1. IoT Central
1. Extensibility and integrations
1. Business applications

This article describes the key components that typically play a part in a waste management solution.

## Devices and connectivity

Devices such as waste bins that are used in open environments may connect through low-power wide area networks (LPWAN) or through a third-party network operator. For these types of devices, use the [Azure IoT Central Device Bridge](../core/howto-build-iotc-device-bridge.md) to send your device data to your IoT application in Azure IoT Central. You can also use device gateways that are IP capable and that can connect directly to IoT Central.

## IoT Central

Azure IoT Central is an IoT App platform that helps you quickly build and deploy an IoT solution. You can brand, customize, and integrate your solution with third-party services.

When you connect your smart waste devices to IoT Central, the application provides device command and control, monitoring and alerting, a user interface with built-in RBAC, configurable dashboards, and extensibility options.

## Extensibility and integrations

You can extend your IoT application in IoT Central and optionally:

* Transform and integrate your IoT data for advanced analytics, for example training machine learning models, through continuous data export from IoT Central application.
* Automate workflows in other systems by triggering actions using Power Automate or webhooks from IoT Central application.
* Programatically access your IoT application in IoT Central through IoT Central APIs.

## Business applications

You can use IoT data to power various business applications within a waste utility. For example, in a connected waste management solution you can optimize the dispatch of trash collections trucks. The optimization can be done based on IoT sensors data from connected waste bins. In your [IoT Central connected waste management application](./tutorial-connected-waste-management.md) you can configure rules and actions, and set them to create alerts in [Connected Field Service](/dynamics365/field-service/connected-field-service). Configure Power Automate in IoT Central rules to automate workflows across applications and services. Additionally, based on service activities in Connected Field Service, information can be sent back to Azure IoT Central.

You can easily configure the following integration processes with IoT Central and Connected Field Service:

* Azure IoT Central can send information about device anomalies to Connected Field Service for diagnosis.
* Connected Field Service can create cases or work orders triggered from device anomalies.
* Connected Field Service can schedule technicians for inspection to prevent the downtime incidents.
* Azure IoT Central device dashboard can be updated with relevant service and scheduling information.

## Next steps

* Learn how to [create a connected waste management](./tutorial-connected-waste-management.md) IoT Central application
* Learn more about [IoT Central government templates](./overview-iot-central-government.md)
* To learn more about IoT Central, see [IoT Central overview](../core/overview-iot-central.md)
