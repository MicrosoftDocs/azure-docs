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

To implement this architecture, Azure IoT offers several options, each appropriate for different sets of customer requirements:

* **Microsoft IoT Central** is a SaaS solution that uses a model-based approach to enable you to build enterprise-grade IoT solutions.

* **Azure IoT Suite** is an enterprise-grade collection of Platform-as-a-Service [preconfigured solutions] (iot-suite-what-are-preconfigured-solutions.md) that enable you to accelerate the development of custom IoT solutions.

* **Azure IoT Hub** is the core Azure service that both IoT Central and IoT Suite are built on top of. IoT Hub provides services such as high-volume telemetry ingestion, device management, and security in an IoT solution.

## Compare IoT Suite, IoT Central, and IoT Hub

Choosing your Azure IoT product is a critical part of planning your IoT solution. IoT Hub is an individual Azure service that doesn't, by itself, provide an end-to-end IoT solution. Starting with IoT Hub alone enables the widest possible range of customization options. Typically, you need to combine IoT Hub with other services to implement an end-to-end solution. Both IoT Suite and IoT Central use IoT Hub along with other Azure services. The following table summarizes the key differences between IoT Suite and IoT Central to help you choose the correct one for your requirements:

|                        | IoT Suite | IoT Central |
| ---------------------- | --------- | ----------- |
| Service type           | PaaS. You have access to the underlying Azure services to manage them. | SaaS. Fully managed solution, underlying services aren't exposed. |
| Flexibility            | High. The code for the microservices is open source and you can modify it in any way you see fit. Additionally, you can customize the deployment infrastructure.| Medium. You can use the built-in GUI tools to customize the solution model and aspects of the UI. The infrastructure is not customizable because the different components are not exposed.|
| Skills                 | Java or .NET skills are required to customize the solution back end. JavaScript are required to customize the visualization. | Modeling skills are required to customize the solution. |
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
