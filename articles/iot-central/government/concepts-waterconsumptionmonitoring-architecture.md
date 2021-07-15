---
title: Reference architecture for water consumption monitoring solution built with Azure IoT Central| Microsoft Docs
description: Learn concepts for a water consumption monitoring solution built with Azure IoT Central.
author: miriambrus
ms.author: miriamb
ms.date: 07/15/2021
ms.topic: conceptual
ms.service: iot-central
services: iot-central
---

# Water consumption monitoring reference architecture

A water consumption monitoring solution can be built using the **Azure IoT Central app template** as a starter IoT application. This article provides high-level reference architecture guidance on building an end to end solution.

![Water consumption monitoring architecture](./media/concepts-waterconsumptionmonitoring-architecture/concepts-waterconsumptionmonitoring-architecture1.png)

Concepts:

1. Devices and connectivity  
1. IoT Central
1. Extensibility and integrations
1. Business applications

This article describes the key components that typically play a part in a water consumption monitoring solution.

## Devices and connectivity

Water management solutions use smart water devices such as flow meters, water quality monitors, smart valves, leak detectors.

Devices in smart water solutions may connect through low-power wide area networks (LPWAN) or through a third-party network operator. For these types of devices, use the [Azure IoT Central Device Bridge](../core/howto-build-iotc-device-bridge.md) to send your device data to your IoT application in Azure IoT Central. You can also use device gateways that are IP capable and that can connect directly to IoT Central.

## IoT Central

Azure IoT Central is an IoT App platform that helps you quickly build and deploy an IoT solution. You can brand, customize, and integrate your solution with third-party services.

When you connect your smart water devices to IoT Central, the application provides device command and control, monitoring and alerting, a user interface with built-in RBAC, configurable dashboards, and extensibility options.

## Extensibility and integrations

You can extend your IoT application in IoT Central and optionally:

* Transform and integrate your IoT data for advanced analytics, for example training machine learning models, through continuous data export from IoT Central application.
* Automate workflows in other systems by triggering actions using Power Automate or webhooks from IoT Central application.
* Programatically access your IoT application in IoT Central through IoT Central APIs.

## Business applications

You can use IoT data to power various business applications within a water utility. In your [IoT Central water consumption monitoring application](tutorial-water-consumption-monitoring.md) you can configure rules and actions, and set them to create alerts in [Connected Field Service](/dynamics365/field-service/connected-field-service). Configure Power Automate in IoT Central rules to automate workflows across applications and services. Additionally, based on service activities in Connected Field Service, information can be sent back to Azure IoT Central.

## Next steps

* Learn how to [create a water consumption](./tutorial-water-consumption-monitoring.md) IoT Central application
* Learn more about [IoT Central government templates](./overview-iot-central-government.md)
* To learn more about IoT Central, see [IoT Central overview](../core/overview-iot-central.md)
