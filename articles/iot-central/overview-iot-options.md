---
title: Microsoft Azure IoT options | Microsoft Docs
description: Choose how to implement your Azure IoT solution by using Azure IoT Central, IoT solution accelerators, or IoT Hub.
author: dominicbetts
ms.author: dobett
ms.date: 06/09/2019
ms.topic: overview
ms.service: iot-central
services: iot-central
ms.custom: mvc
manager: timlt
---

# Compare Azure IoT Central and Azure IoT options

Microsoft Azure IoT Central and Azure IoT offer several options for building an IoT solution. These options are appropriate for different sets of customer requirements:

* [Azure IoT Central](overview-iot-central.md) is a software as a service (SaaS) solution that uses a model-based approach to help you to build enterprise-grade IoT solutions without requiring expertise in cloud-solution development.

* [Azure IoT solution accelerators](https://docs.microsoft.com/azure/iot-accelerators/) are an enterprise-grade collection of [solution accelerators](../iot-accelerators/iot-accelerators-what-are-solution-accelerators.md) built on Azure platform as a service (PaaS) that help you accelerate the development of custom IoT solutions.

## Azure IoT Hub

Azure IoT Hub is the core Azure PaaS that both Azure IoT Central and Azure IoT solution accelerators use. IoT Hub supports reliable and secure bidirectional communications between millions of IoT devices and a cloud solution. IoT Hub helps you meet IoT implementation challenges like:

* High-volume device connectivity and management
* High-volume telemetry ingestion
* Command and control of devices
* Device security enforcement

## Compare Azure IoT Central and Azure IoT solution accelerators

Choosing your Azure IoT product is a critical part of planning your IoT solution. IoT Hub is an individual Azure service that doesn't, by itself, provide an end-to-end IoT solution. You can use IoT Hub as a starting point for any IoT solution. You also don’t need to use Azure IoT solution accelerators or Azure IoT Central to use IoT Hub. Both IoT solution accelerators and Azure IoT Central use IoT Hub along with other Azure services.

The following table summarizes the key differences between IoT solution accelerators and Azure IoT Central to help you choose the correct one for your requirements:

|     | Azure IoT Central | Azure IoT solution accelerators |
| --- | ----------- | --------- |
| Primary usage                      | To accelerate time to market for straightforward IoT solutions that don’t require deep service customization.                                                    | To accelerate development of a custom IoT solution that needs maximum flexibility.                                                                                                                             |
| Access to underlying PaaS services | SaaS. Because it is a fully managed solution, the underlying services aren't exposed.                                                                                            | You have access to the underlying Azure services to manage them, or replace them as needed.                                                                                                                    |
| Flexibility                        | Medium. You can use the built-in browser-based user experience to customize the solution model and aspects of the UI. The infrastructure isn't customizable because the different components aren't exposed. | High. The code for the microservices is open source, and you can modify it in any way you see fit. Additionally, you can customize the deployment infrastructure.                                               |
| Skill level                        | Low. You need modeling skills to customize the solution. No coding skills are required.                                                                          | Medium-high. You need Java or .NET skills to customize the solution's back end. You need JavaScript skills to customize the visualization.                                                                       |
| Getting started experience             | Application templates and device templates provide prebuilt models. Can be deployed in minutes.                                                                                                  | Preconfigured solutions implement common IoT scenarios. Can be deployed in minutes.                                                                                                                            |
| Pricing                            | Simple, predictable pricing structure.                                                                                                                           | You can fine-tune the services to control the cost.                                                                                                                                                            |

Which product to use to build your IoT solution depends on:

* Your business requirements.
* The type of solution you want to build.
* Your organization's skill set for building and maintaining the solution in the long term.

## Next steps

Based on your chosen product and approach, the suggested next steps are:

* **Azure IoT Central**: [What is Azure IoT Central?](overview-iot-central.md)
* **IoT solution accelerators**: [What are Azure IoT solution accelerators?](../iot-accelerators/iot-accelerators-what-are-solution-accelerators.md)
* **IoT Hub**: [What is Azure IoT Hub?](https://docs.microsoft.com/azure/iot-hub/iot-hub-what-is-iot-hub)