---
title: Remote Monitoring solution accelerator FAQ | Microsoft Docs
description: Frequently asked questions for Remote Monitoring solution accelerator
author: dominicbetts
manager: timlt
ms.service: iot-accelerators
services: iot-accelerators
ms.topic: conceptual
ms.date: 02/15/2018
ms.author: dobett
---

# Frequently asked questions for Remote Monitoring solution accelerator

See also, the general [FAQ](iot-accelerators-faq.md).

### How much does it cost to provision the new Remote Monitoring solution?

The new solution accelerator offers two deployment options:

* A *basic* option designed for developers looking for lower development cost or customers looking to build a demo or proof of concept.
* A *standard* option designed for enterprises wanting to deploy a production-ready infrastructure.

### How can I ensure I keep my costs down while I develop my solution?

In addition to providing two differentiated deployments, the new Remote Monitoring solution has a setting to enable or disable all the simulated devices on demand. Disabling the simulation reduces the data ingested in the solution and, thus, the overall cost.

### What is the difference between the basic and standard deployment options? How do I decide between the two deployment options?

Each deployment option responds to different needs. The basic deployment is designed to get started and develop PoC and small pilots. It provides a streamlined architecture with the minimum necessary resources and a lower cost. The standard deployment is designed to build and customize a production-ready solution, and provides a deployment with the necessary elements to realize that. For reliability and scale, application microservices are built as Docker containers and deployed using an orchestrator (Kubernetes by default). The orchestrator is responsible for deployment, scaling, and management of the application. You should choose an option based on your current needs. You might use one, the other, or a combination of both depending on your project stage.

### How do I configure a dynamic map on the dashboard?

For more information, see [Upgrade map key to see devices on a dynamic map](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/wiki/Developer-Reference-Guide#upgrade-map-key-to-see-devices-on-a-dynamic-map).

### Where can I find information about the previous version of the Remote Monitoring solution?

The previous version of the Remote Monitoring solution accelerator was known as the IoT Suite Remote Monitoring preconfigured solution. You can find the archived documentation at [https://docs.microsoft.com/previous-versions/azure/iot-suite/](https://docs.microsoft.com/previous-versions/azure/iot-suite/).

### Next steps

You can also explore some of the other features and capabilities of the IoT solution accelerators:

* [Explore the capabilities of the Remote Monitoring solution accelerator](quickstart-remote-monitoring-deploy.md)
* [Predictive Maintenance solution accelerator overview](iot-accelerators-predictive-overview.md)
* [Deploy Connected Factory solution accelerator](quickstart-connected-factory-deploy.md)
* [IoT security from the ground up](/azure/iot-fundamentals/iot-security-ground-up)
