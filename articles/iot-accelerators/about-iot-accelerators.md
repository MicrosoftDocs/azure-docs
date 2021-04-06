---
title: Introduction to IoT solution accelerators - Azure | Microsoft Docs
description: Learn about the Azure IoT solution accelerators. IoT solution accelerators are complete, end-to-end, ready to deploy IoT solutions.
author: dominicbetts
ms.author: dobett
ms.date: 03/09/2019
ms.topic: overview
ms.custom: mvc
ms.service: iot-accelerators
services: iot-accelerators
manager: timlt
# Customer intent: As a developer or IT Pro, I need to know what the IoT solution accelerators do, so I can understand if they can help me to build and manage my IoT solution.
---

# What are Azure IoT solution accelerators?

A cloud-based IoT solution typically uses custom code and cloud services to manage device connectivity, data processing and analytics, and presentation.

The IoT solution accelerators are complete, ready-to-deploy IoT solutions that implement common IoT scenarios. The scenarios include connected factory and device simulation. When you deploy a solution accelerator, the deployment includes all the required cloud-based services along with any required application code.

The solution accelerators are starting points for your own IoT solutions. The source code for all the solution accelerators is open source and is available in GitHub. You're encouraged to download and customize the solution accelerators to meet your requirements.

You can also use the solution accelerators as learning tools before building a custom IoT solution from scratch. The solution accelerators implement proven practices for cloud-based IoT solutions for you to follow.

The application code in each solution accelerator includes a web app that lets you manage the solution accelerator.

> [!NOTE]
> The remote monitoring and predictive maintenance solutions have been removed from the [Azure IoT solution accelerators](https://www.azureiotsolutions.com/Accelerators) site. To learn more, see [What are Azure IoT solution accelerators? (previous version)](/previous-versions/azure/iot-accelerators/about-iot-accelerators).

## Supported IoT scenarios

Currently, there are two solution accelerators available for you to deploy:

### Connected Factory

Use the [Connected Factory solution accelerator](iot-accelerators-connected-factory-features.md) to collect telemetry from industrial assets with an [OPC Unified Architecture](https://opcfoundation.org/about/opc-technologies/opc-ua/) interface and to control them. Industrial assets might include assembly and test stations on a factory production line.

You can use the connected factory dashboard to monitor and manage your industrial devices:

:::image type="content" source="./media/about-iot-accelerators/cf-dashboard-inline.png" alt-text="Screenshot that shows the Connected factory solution dashboard." lightbox="./media/about-iot-accelerators/cf-dashboard-expanded.png":::

### Device Simulation

Use the [Device Simulation solution accelerator](iot-accelerators-device-simulation-overview.md) to run simulated devices that generate realistic telemetry. You can use this solution accelerator to test the behavior of the other solution accelerators or to test your own custom IoT solutions.

You can use the device simulation web app to configure and run simulations:

:::image type="content" source="./media/about-iot-accelerators/ds-dashboard-inline.png" alt-text="Screenshot that shows the device simulation solution dashboard." lightbox="./media/about-iot-accelerators/ds-dashboard-expanded.png":::

## Design principles

All the solution accelerators follow the same design principles and goals. They're designed to be:

* **Scalable**, letting you connect and manage millions of connected devices.
* **Extensible**, enabling you to customize them to meet your requirements.
* **Comprehensible**, enabling you to understand how they work and how they're implemented.
* **Modular**, letting you swap out services for alternatives.
* **Secure**, combining Azure security with built-in connectivity and device security features.

## Architectures and languages

The original solution accelerators were written using .NET using a model-view-controller (MVC) architecture. Microsoft is updating the solution accelerators to a new microservices architecture. The following table shows the current status of the solution accelerators with links to the GitHub repositories:

| Solution accelerator   | Architecture  | Languages     |
| ---------------------- | ------------- | ------------- |
| Connected Factory      | MVC           | [.NET](https://github.com/Azure/azure-iot-connected-factory)          |
| Device Simulation      | Microservices | [.NET](https://github.com/Azure/azure-iot-pcs-device-simulation)          |

To learn more about the microservices architecture, see [Introduction to the Azure IoT reference architecture](/azure/architecture/reference-architectures/iot/).

## Deployment options

You can deploy the solution accelerators from the [Microsoft Azure IoT Solution Accelerators](https://www.azureiotsolutions.com/Accelerators#) site or using the command line.

The cost of running a solution accelerator is the combined [cost of running the underlying Azure services](https://azure.microsoft.com/pricing). You see details of the Azure services used when you choose your deployment options.

## Next steps

To try out one of the IoT solution accelerators, check out the quickstart [Try a connected factory solution](quickstart-connected-factory-deploy.md).
