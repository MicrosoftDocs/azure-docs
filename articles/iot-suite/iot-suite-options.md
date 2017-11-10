---
title: Microsoft Azure IoT options | Microsoft Docs
description: Choose how to implement your Azure IoT solution using IoT Suite, IoT Central, or IoT Hub.
services: ''
suite: iot-suite
author: dominicbetts
manager: timlt

ms.assetid: 2d38d08a-4133-4e5c-8b28-f93cadb5df05
ms.service: iot-suite
ms.topic: get-started-article
ms.date: 11/10/2017
ms.author: dobett
ms.custom: H1Hack27Feb2017

---

# Compare Azure IoT options

The article [Azure and the Internet of Things](iot-suite-what-is-azure-iot.md) describes a typical IoT solution architecture with the following layers:

* Device connectivity and management
* Data processing and analytics
* Presentation and business integration

To implement this architecture, Azure IoT offers several options, each appropriate for different sets of customer requirements:

* [Azure IoT Suite](index.md) is an enterprise-grade collection of [preconfigured solutions](iot-suite-what-are-preconfigured-solutions.md) built on Azure Platform-as-a-Service that enable you to accelerate the development of custom IoT solutions.

* [Microsoft IoT Central](https://www.microsoft.com/internet-of-things/iot-central-saas-solutions) is a SaaS solution that uses a model-based approach to enable you to build enterprise-grade IoT solutions without requiring cloud solution development expertise.

## Azure IoT Hub

Azure IoT Hub is the core Azure Platform-as-a-Service that both IoT Central and IoT Suite make use of. IoT Hub enables reliable and securely bidirectional communications between millions of IoT devices and a cloud solution. IoT Hub helps you meet IoT implementation challenges such as:

* High-volume device connectivity and management.
* High-volume telemetry ingestion.
* Command and control of devices.
* Device security enforcement.

## Compare IoT Suite and IoT Central

Choosing your Azure IoT product is a critical part of planning your IoT solution. IoT Hub is an individual Azure service that doesn't, by itself, provide an end-to-end IoT solution. IoT Hub can be used as a starting point for any IoT solution, and you don’t need to use Azure IoT Suite or Microsoft IoT Central to use it. Both IoT Suite and IoT Central use IoT Hub along with other Azure services. The following table summarizes the key differences between IoT Suite and IoT Central to help you choose the correct one for your requirements:

|                        | IoT Suite | IoT Central |
| ---------------------- | --------- | ----------- |
| Primary usage | To accelerate development of a custom IoT solution that needs maximum flexibility. | To accelerate time to market for straightforward IoT solutions that don’t require deep service customization. |
| Access to underlying PaaS services          | You have access to the underlying Azure services to manage them, or replace them as needed. | SaaS. Fully managed solution, the underlying services aren't exposed. |
| Flexibility            | High. The code for the microservices is open source and you can modify it in any way you see fit. Additionally, you can customize the deployment infrastructure.| Medium. You can use the built-in browser-based user experience to customize the solution model and aspects of the UI. The infrastructure is not customizable because the different components are not exposed.|
| Skill level                 | Medium-High. You need Java or .NET skills to customize the solution back end. You need JavaScript skills to customize the visualization. | Low. You need modeling skills to customize the solution. No coding skills are required. |
| Get started experience | Preconfigured solutions implement common IoT scenarios. Can be deployed in minutes. | Templates provide pre-built models. Can be deployed in minutes. |
| Pricing                | You can fine-tune the services to control the cost. | Simple, predictable pricing structure. |

The decision of which product to use to build your IoT solution is ultimately determined by:

* Your business requirements.
* The type of solution you want to build
* Your organization's skill set for building and maintaining the solution in the long term.

## Next steps

Based on your chosen product and approach, the suggested next steps are:

* **IoT Suite**: [What are the Azure IoT preconfigured solutions?](iot-suite-what-are-preconfigured-solutions.md)
* **IoT Central**: [Microsoft IoT Central](https://www.microsoft.com/internet-of-things/iot-central-saas-solutions).
* **IoT Hub**: [Overview of the Azure IoT Hub service](../iot-hub/iot-hub-what-is-iot-hub.md).
