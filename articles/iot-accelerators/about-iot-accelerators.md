---
title: Introduction to Azure IoT solution accelerators | Microsoft Docs
description: Learn about the Azure IoT solution accelerators. IoT solution accelerators are complete, end-to-end, ready to deploy IoT solutions.
author: dominicbetts
ms.author: dobett
ms.date: 06/07/2018
ms.topic: overview
ms.custom: mvc
ms.service: iot-accelerators
services: iot-accelerators
manager: timlt


# Intent: As a developer or IT Pro, I need to know what the IoT solution accelerators do, so I can understand if they can help me to build and manage my IoT solution.
---

# What are Azure IoT solution accelerators?

A cloud-based IoT solution typically uses custom code and multiple cloud services to manage device connectivity, data processing and analytics, and presentation.

The IoT solution accelerators are a collection of complete, open source, ready-to-deploy, IoT solutions that implement common IoT scenarios such as _remote monitoring_, _predictive maintenance_, and _connected factory_. When you deploy a solution accelerator, the deployment includes all the required cloud-based services along with any required application code.

The application code in each solution accelerator includes a solution-specific dashboard that enables you to manage the solution accelerator. For example, you can use a dashboard to view the telemetry from your connected devices, provision new devices, or upgrade the firmware on your connected devices:

[![Solution dashboard](./media/about-iot-accelerators/dashboard-inline.png)](./media/about-iot-accelerators/dashboard-expanded.png#lightbox)

## IoT scenarios

Currently, there are four solution accelerators available for you to deploy:

### Remote Monitoring

Use the Remote Monitoring solution accelerator to collect telemetry from multiple remote devices and to control those devices. Example devices include cooling systems installed on your customers' premises or valves installed in remote pump stations.

### Connected Factory

Use the Connected Factory solution accelerator to collect telemetry from industrial assets with an [OPC Unified Architecture](https://opcfoundation.org/about/opc-technologies/opc-ua/) interface and to control those assets. Industrial assets might include assembly and test stations on a factory production line.

### Predictive Maintenance

Use the Predictive Maintenance solution accelerator to predict when a remote device is expected to fail so that you can carry out maintenance in advance of the predicted failure. The Predictive Maintenance solution accelerator uses machine learning algorithms to predict failures from device telemetry. Example devices might be airplane engines or elevators.

### Device Simulation

Use the Device Simulation solution accelerator to run multiple simulated devices that generate realistic telemetry. You can use this solution accelerator to test the behavior of the other solution accelerators or to test your own custom IoT solutions.

## How to use the solution accelerators

The solution accelerators are intended as starting points for your own IoT solutions. The source code for all the solution accelerators is open source and is available in GitHub. You're encouraged to download and [customize](iot-accelerators-remote-monitoring-customize.md) the solution accelerators to meet your specific requirements.

You can also use the solution accelerators as learning tools before building a custom IoT solution from scratch. The solution accelerators implement proven practices for cloud-based IoT solutions for you to follow.

## Design principles

All the solution accelerators follow the same design principles and goals.

The solution accelerators are designed to be:

* _Scalable_, enabling you to connect and manage millions of connected devices.
* _Extensible_, enabling you to customize them to meet your specific requirements.
* _Comprehensible_, enabling you to understand how they work and how they are implemented.
* _Modular_, enabling you to swap out services for alternatives.

## Architectures and languages

The original solution accelerators were written using .NET using a model-view-controller (MVC) architecture. Microsoft is updating the solution accelerators to a new microservices-based architecture. Both [Java](https://github.com/Azure/azure-iot-pcs-remote-monitoring-java) and [.NET](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet) versions of each microservice are available in GitHub. The following table shows the current status of the solution accelerators:

| Solution accelerator   | Architecture  | Languages     |
| ---------------------- | ------------- | ------------- |
| Remote Monitoring      | Microservices | Java and .NET |
| Predictive Maintenance | MVC           | .NET          |
| Connected Factory      | MVC           | .NET          |

To learn more about microservice architectures, see [.NET Application Architecture](https://www.microsoft.com/net/learn/architecture) and [Microservices: An application revolution powered by the cloud](https://azure.microsoft.com/blog/microservices-an-application-revolution-powered-by-the-cloud/).

## Deployment options

You can deploy the microservice-based solution accelerators in the following configurations:

* **Standard:** Expanded infrastructure deployment for developing a production deployment. The Azure Container Service deploys the microservices to multiple Azure virtual machines. Kubernetes orchestrates the Docker containers that host the individual microservices.
* **Basic:** Reduced cost version for a demonstration or to test a deployment. All the microservices deploy to a single Azure virtual machine.
* **Local:** Local machine deployment for testing and development. This approach deploys the microservices to a local Docker container and connects to IoT Hub, Azure Cosmos DB, and Azure storage services in the cloud.

## Next steps

To try out an IoT solution accelerator, check out the solution accelerator quickstart:

* [Deploy a cloud-based remote monitoring solution](quickstart-remote-monitoring-deploy.md)
