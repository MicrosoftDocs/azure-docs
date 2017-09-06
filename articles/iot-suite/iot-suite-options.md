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
ms.date: 08/30/2017
ms.author: dobett
ms.custom: H1Hack27Feb2017

---

<!-- Differences between IoT Central and PCS
* Architecture
* Infrastructure
* Development
* Decision criteria for choosing IoT and PCS

Compare IoT solution options, replaces existing "What is IoT Suite?" article.-->

# Azure IoT options

The article Azure and Internet of Things(insert correct link) describes a typical IoT architecture with the following layers:

* Device connectivity
* Data processing and analytics
* Presentation

To implement this architecture, Azure IoT offers three options:

* **Microsoft IoT Central** is a SaaS solution that uses a model-based approach to enable you to build enterprise-grade IoT solutions.

* **Azure IoT Suite** is an enterprise-grade PaaS solution that enables you to get started quickly through a set of extensible [preconfigured solutions](iot-suite-what-are-preconfigured-solutions.md). These solutions address common IoT scenarios, such as [remote monitoring](iot-suite-remote-monitoring-explore.md), [predictive maintenance](iot-suite-predictive-overview.md), and [connected factory](iot-suite-connected-factory-overview.md). These solutions are implementations of the IoT solution architecture outlined in Azure and IoT(insert correct link).

* **Azure IoT Hub** is the core Azure IoT service that both IoT Central and IoT Suite use. It provides services such as high-volume telemetry ingestion, device management, and security to an IoT solution. You can build your own IoT solutions from scratch using the IoT Hub service.

## Compare IoT Suite, IoT Central, and IoT Hub

Choosing your Azure IoT product is a critical part of planning your IoT solution. IoT Hub offers the most flexibility, but you must implement most of the solution yourself. The following table summarizes the key differences between IoT Suite and IoT Central to help you choose the correct one for your requirements:

|                        | IoT Suite | IoT Central |
| ---------------------- | --------- | ----------- |
| Service type           | PaaS. You have access to the underlying Azure services to manage them. | SaaS. Fully managed solution, you don't need to manage the underlying Azure services. |
| Flexibility            | High. The code for the microservices is open source and you can modify it in any way you see fit. | Medium. You can use the built-in GUI tools to customize the model and aspects of the UI. |
| Skills                 | Java or .NET skills are required to customize the solution. | Modeling skills are required to customize the solution. |
| Get started experience | Preconfigured solutions implement common IoT scenarios. Can be deployed in minutes. | Templates provide pre-built models. Can be deployed in minutes. |
| Pricing                | You can fine-tune the services to control the cost. | Simple, predictable pricing structure. |

<!-- Extend table with info from Cory and Hector -->

## Next steps

Based on your chosen product and approach, the suggested next steps are:

* **IoT Suite**: [What are the Azure IoT preconfigured solutions?](iot-suite-what-are-preconfigured-solutions.md)
* **IoT Central**: [Microsoft IoT Central](https://www.microsoft.com/internet-of-things/iot-central-saas-solutions).
* **IoT Hub**: [Overview of the Azure IoT Hub service](../iot-hub/iot-hub-what-is-iot-hub.md).
