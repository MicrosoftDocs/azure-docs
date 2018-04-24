---
title: Azure IoT solution accelerators overview | Microsoft Docs
description: A description of the Azure IoT solution accelerators and their architecture with links to additional resources.
services: iot-suite
suite: iot-suite
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 59009f37-9ba0-4e17-a189-7ea354a858a2
ms.service: iot-suite
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 17/01/2018
ms.author: dobett

---
# What are the IoT solution accelerators?

The Azure IoT _solution accelerators_ are set of solutions that:

* Deploy in minutes
* Help you get started quickly
* You can customize to meet your specific requirements

The solution accelerators are all designed according to the same principles and goals.

The following video presents an overview of the remote monitoring solution accelerator:

>[!VIDEO https://channel9.msdn.com/Shows/Internet-of-Things-Show/Meet-the-new-Remote-Monitoring-accelerator-for-Azure-IoT/Player]

## Solution accelerators overview

A solution accelerator is open source implementation of a common IoT solution patterns that you can deploy to Azure using your subscription. Each solution accelerator combines custom code and Azure services to implement a specific IoT scenario or scenarios. You can customize any of the scenarios to meet your specific requirements. These scenarios include:

* Visualize data on a rich dashboard for deep insights and solution status.
* Configure rules and alarms over live IoT device telemetry.
* Schedule device management jobs, such as updates to software and configuration.
* Provision your own custom physical or simulated devices.
* Troubleshoot and remediate issues within your IoT device groups.

Each solution accelerator is a complete, end-to-end implementation that can use simulated or physical devices to generate telemetry. You can use the solution accelerators as solution accelerators to:

* Provide a starting point for your own IoT solutions.
* Learn about common patterns in IoT solution design and development.

Three solution accelerators  are available today:

* [Remote Monitoring](iot-suite-remote-monitoring-explore.md)
* [Predictive Maintenance](iot-suite-predictive-overview.md)
* [Connected Factory](iot-suite-connected-factory-overview.md)

The following table shows how the solutions map to specific IoT features:

| Solution | Data ingestion | Device identity | Device management | Edge processing | Command and control | Rules and actions | Predictive analytics |
| ------------------------------------------------------------ | -- | -- | -- | -- | -- | -- | -- |
| [Remote Monitoring](iot-suite-remote-monitoring-explore.md)  |Yes |Yes |Yes |-   |Yes |Yes |-   |
| [Predictive Maintenance](iot-suite-predictive-overview.md)   |Yes |Yes |-   |-   |Yes |Yes |Yes |
| [Connected Factory](iot-suite-connected-factory-overview.md) |Yes |- |- |Yes |Yes |Yes |-   |

* *Data ingestion*: Ingress of data at scale to the cloud.
* *Device identity*: Manage unique device identities and control device access to the solution.
* *Device management*: Manage device metadata and perform operations such as device reboots and firmware upgrades.
* *Command and control*: To cause the device to take an action, send messages to a device from the cloud.
* *Rules and actions*: To act on specific device-to-cloud data, the solution back end uses rules.
* *Predictive analytics*: The solution back end analyzes device-to-cloud data to predict when specific actions should take place. For example, analyzing aircraft engine telemetry to determine when engine maintenance is due.

> [!NOTE]
> To deploy a solution accelerator and learn more about how to customize them, visit [Microsoft Azure IoT solution accelerators](https://www.azureiotsuite.com/).

## Azure services

When you deploy a solution accelerator, the provisioning process configures a number of Azure services. The following table shows the services used in the solution accelerators:

|                      | Remote Monitoring  | Predictive Maintenance | Connected Factory |
| -------------------- | ------------------ | ---------------------- | ----------------- |
| IoT Hub              | Yes                | Yes                    | Yes               |
| Event Hubs           |                    | Yes                    |                   |
| Time Series Insights |                    |                        | Yes               |
| Container Services   | Yes                |                        |                   |
| Stream Analytics     |                    | Yes                    |                   |
| Web Apps             | Yes                | Yes                    | Yes               |
| Cosmos DB            | Yes                | Yes                    |                    |
| Azure Storage         |                    | Yes                    | Yes               |

> [!NOTE]
> For more information about the resources deployed in the remote monitoring solution accelerator, see this [article](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/blob/master/README.md#basic-vs-standard-deployments) on GitHub.

* [Azure IoT Hub](../iot-hub/index.md). This service provides the device-to-cloud and cloud-to-device messaging capabilities and acts as the gateway to the cloud and the other key solution accelerator services. The service enables you to receive messages from your devices at scale, and send commands to your devices. The service also enables you to [manage your devices](../iot-hub/iot-hub-device-management-overview.md). For example, you can configure, reboot, or perform a factory reset on one or more devices connected to the hub.
* [Azure Event Hubs](../event-hubs/index.md). This service provides high-volume event ingestion to the cloud. See [Comparison of Azure IoT Hub and Azure Event Hubs](../iot-hub/iot-hub-compare-event-hubs.md).
* [Azure Time Series Insights](../time-series-insights/index.yml). The solution accelerators use this service to analyze and display the telemetry data from your devices.
* [Azure Container Service](../container-service/index.yml). This service hosts and manages the microservices in the solution accelerators.
* [Azure Cosmos DB](../cosmos-db/index.yml) and [Azure Storage](../storage/index.yml) for data storage.
* [Azure Stream Analytics](../stream-analytics/index.md). The Predictive Maintenance solution accelerator uses this service to process incoming telemetry, perform aggregation, and detect events. This solution accelerator also uses stream analytics to process informational messages that contain data such as metadata or command responses from devices.
* [Azure Web Apps](../app-service/index.yml) to host the custom application code in the solution accelerators.

For an overview of the architecture of a typical IoT solution, see [Microsoft Azure and the Internet of Things (IoT)](iot-suite-what-is-azure-iot.md).

## What's new in solution accelerators?

Microsoft is updating the solution accelerators to a new microservices-based architecture. The following table shows the current status of the solution accelerators:

| Solution accelerator | Architecture  | Languages     |
| ---------------------- | ------------- | ------------- |
| Remote Monitoring      | Microservices | Java and .NET |
| Predictive Maintenance | MVC           | .NET          |
| Connected Factory      | MVC           | .NET          |

The following sections describe what's new in the microservices-based solution accelerators:

### Microservices

The new version of the remote monitoring solution accelerator uses a microservices architecture. This solution accelerator is composed of multiple microservices such as an *IoT Hub manager* and a *Storage manager*. Both Java and .NET versions of each microservice are available to download, along with related developer documentation. For more information about the microservices, see [Remote Monitoring architecture](iot-suite-remote-monitoring-sample-walkthrough.md).

This microservices architecture is a proven pattern for cloud solutions that:

* Is scalable.
* Enables extensibility.
* Is easy to understand.
* Enables individual services to be swapped out for alternatives.

> [!TIP]
> To learn more about microservice architectures, see [.NET Application Architecture](https://www.microsoft.com/net/learn/architecture) and [Microservices: An application revolution powered by the cloud](https://azure.microsoft.com/blog/microservices-an-application-revolution-powered-by-the-cloud/).

When you deploy the new version of remote monitoring, you must select one of the following deployment options:

* **Basic:** Reduced cost version for a demonstration or to test a deployment. All the microservices deploy to a single Azure virtual machine.
* **Standard:** Expanded infrastructure deployment for developing a production deployment. The Azure Container Service deploys the microservices to multiple Azure virtual machines. Kubernetes orchestrates the Docker containers that host the individual microservices.

### Language choices: Java and .NET

Implementations of each of the microservices are available in both Java and .NET. Like the .NET code, the Java source code is open source and available for you to customize to your specific requirements:

* [Remote Monitoring .NET GitHub repository](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet)
* [Remote Monitoring Java GitHub repository](https://github.com/Azure/azure-iot-pcs-remote-monitoring-java)

If you'd like to see other language implementations, add a request to [Azure IoT user voice](https://feedback.azure.com/forums/321918-azure-iot).

### React user interface framework

The UI is built using the [React](https://facebook.github.io/react/) javascript library. The source code is open source and available for you to download and customize.

## Next steps

Now that you have an overview of the IoT solution accelerators, here are suggested next steps for each of the solution accelerators:

* [Explore the Remote Monitoring solution Resource Manager deployment model](iot-suite-remote-monitoring-explore.md).
* [Predictive Maintenance solution accelerator overview](iot-suite-predictive-overview.md).
* [Get started with the Connected Factory solution accelerator](iot-suite-connected-factory-overview.md).

For more information about IoT solution architectures, see [Microsoft Azure IoT services: Reference Architecture](http://download.microsoft.com/download/A/4/D/A4DAD253-BC21-41D3-B9D9-87D2AE6F0719/Microsoft_Azure_IoT_Reference_Architecture.pdf).
