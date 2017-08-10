---
title: Microsoft Azure IoT Suite overview | Microsoft Docs
description: IoT Suite is a collection of customizable preconfigured solutions you can deploy to Azure, such as remote monitoring and predictive maintenance.
services: ''
suite: iot-suite
author: dominicbetts
manager: timlt

ms.assetid: 2d38d08a-4133-4e5c-8b28-f93cadb5df05
ms.service: iot-suite
ms.topic: get-started-article
ms.date: 07/24/2017
ms.author: dobett
ms.custom: H1Hack27Feb2017

---

<!-- Differences between IoT Central and PCS
* Architecture
* Infrastructure
* Development
* Decision criteria for choosing IoT and PCS

Compare IoT solution options, replaces existing "What is IoT Suite?" article.-->

# What is Azure IoT Suite?

Azure IoT Suite is a collection of preconfigured IoT solutions that you can deploy to your Azure subscription. Each *preconfigured solution* is a base implementation of a common IoT solution pattern such as remote monitoring or predictive maintenance. You can customize and extend these solutions to meet your specific requirements. You can also use these solutions as examples or templates when you develop new IoT solutions.

Azure IoT Suite is a collection of enterprise-grade preconfigured solutions that enable you to get started quickly with IoT. Preconfigured solutions are open source, and you can customize and extended them to meet your specific requirements. The preconfigured solutions:

* Implement common IoT patterns to accelerate your solution development.
* Deploy into your Azure subscription in a matter of minutes.

## Compare IoT Suite, IoT Central, and IoT Hub

You can use IoT Suite, IoT Central, or IoT Hub to build your IoT solution. [IoT Hub provides core IoT services](../iot-hub/iot-hub-what-is-iot-hub.md) such as high-volume telemetry ingestion, device management, and security. The IoT Suite preconfigured solutions and IoT Central both use IoT Hub, and both offer enterprise-grade end-to-end solutions. If you are building an IoT solution from scratch, you can use IoT Hub as a core building block in your solution.

The following table summarizes the key differences between IoT Suite and IoT Central to help you choose the correct one to meet your requirements:

|              | IoT Suite | IoT Central |
| ------------ | --------- | ----------- |
| Service type | PaaS. You have access to the underlying Azure services to manage them. | SaaS. Fully managed solution, you don't need to manage the underlying Azure services. |
| Flexibility | High. The code for the microservices is open source and you can modify it in any way you see fit. | Medium. You can use the built-in GUI tools to customize the model and aspects of the UI. |
| Skills | Java or .NET skills are required to customize the solution. | Modelling skills are required to customize the solution. |
| Get started experience | Preconfigured solutions implement common IoT scenarios. Can be deployed in minutes. | Templates provide pre-built models. Can be deployed in minutes. |

<!-- Extend table with info from Cory and Hector -->

## Use preconfigured solutions

The IoT Suite preconfigured solutions implement common IoT patterns, such as:

* Remote monitoring
* Predictive maintenance
* Connected factory

The preconfigured solutions implement a number of core IoT capabilities. These enterprise-grade solutions deliver services such as:

* Collect data from devices
* Analyze data streams in-motion
* Store and query large data sets
* Visualize both real-time and historical data
* Integrate with back-office systems
* Manage your devices

To deliver these capabilities, Azure IoT Suite packages together multiple Azure services with custom code as preconfigured solutions.

<!-- Do we have anything more up to date? -->
The following video provides an introduction to Azure IoT Suite:

> [!VIDEO https://channel9.msdn.com/Events/Microsoft-Azure/AzureCon-2015/ACON309/player]

## Next steps

Now that you have an overview of IoT Suite, the suggested next step is to learn more about the IoT Suite preconfigured solutions, see [What are the Azure IoT preconfigured solutions?](iot-suite-what-are-preconfigured-solutions.md)
