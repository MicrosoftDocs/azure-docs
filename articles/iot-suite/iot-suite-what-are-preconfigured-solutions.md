---
title: Azure IoT preconfigured solutions | Microsoft Docs
description: A description of the Azure IoT preconfigured solutions and their architecture with links to additional resources.
services: ''
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
ms.date: 07/25/2017
ms.author: dobett

---
# What are the Azure IoT Suite preconfigured solutions?

The Azure IoT Suite preconfigured solutions are open source implementations of common IoT solution patterns that you can deploy to Azure using your subscription. The preconfigured solutions are solution accelerators that you can use:

* As a starting point for your own IoT solutions.
* To learn about common patterns in IoT solution design and development.

Each preconfigured solution is a complete, end-to-end implementation that can use simulated devices to generate telemetry.

<!-- Add a GitHub link here for the source code? -->
You can download the complete source code to customize and extend the solutions to meet your specific IoT requirements.

> [!NOTE]
> To deploy one of the preconfigured solutions and learn more about how to customize them, visit [Microsoft Azure IoT Suite](https://www.azureiotsuite.com/).

Microsoft is updating the preconfigured solutions to a new microservices-based architecture. The following table shows the current versions of the preconfigured solutions:

| Preconfigured solution | Version | Architecture  | Languages     |
| ---------------------- | ------- | ------------- | ------------- |
| Remote monitoring      | 2       | Microservices | Java and .NET |
| Predictive maintenance | 1       | MVC           | .NET          |
| Connected factory      | 1       | MVC           | .NET          |

The following table shows how the solutions map to specific IoT features:

| Solution | Data ingestion | Device identity | Device management | Edge processing | Command and control | Rules and actions | Predictive analytics |
| ------------------------------------------------------------ | -- | -- | -- | -- | -- | -- | -- |
| [Remote monitoring](iot-suite-remote-monitoring-explore.md)  |Yes |Yes |Yes |-   |Yes |Yes |-   |
| [Predictive maintenance](iot-suite-predictive-overview.md)   |Yes |Yes |-   |-   |Yes |Yes |Yes |
| [Connected factory](iot-suite-connected-factory-overview.md) |Yes |Yes |Yes |Yes |Yes |Yes |-   |

* *Data ingestion*: Ingress of data at scale to the cloud.
* *Device identity*: Manage unique device identities and control device access to the solution.
* *Device management*: Manage device metadata and perform operations such as device reboots and firmware upgrades.
* *Command and control*: To cause the device to take an action, send messages to a device from the cloud.
* *Rules and actions*: To act on specific device-to-cloud data, the solution back end uses rules.
* *Predictive analytics*: The solution back end analyzes device-to-cloud data to predict when specific actions should take place. For example, analyzing aircraft engine telemetry to determine when engine maintenance is due.

## Microservices architecture

The version 2 preconfigured solutions use a microservices architecture. These preconfigured solutions are composed of multiple microservices such as an *IoT Hub manager* and a *Storage manager*.  Both Java and .NET versions of each microservice are available to download, along with related developer documentation. For more information about the microservices, see [Remote monitoring architecture](iot-suite-remote-monitoring-sample-walkthrough.md).

This microservices architecture is a proven pattern for cloud solutions that:

* Is scalable.
* Enables extensibility.
* Is easy to understand.
* Enables individual services to be swapped out for alternatives.

When you deploy a version 2 preconfigured solution, you must select one of the following deployment options:

* **Enterprise:** The Azure Container Service deploys the microservices to multiple Azure virtual machines. Kubernetes orchestrates the Docker containers that host the individual microservices.
* **Basic:** All the microservices deploy to a single Azure virtual machine. Use this option for a demonstration or test deployment to minimize costs.

## Azure services

When you deploy a preconfigured solution, the provisioning process configures a number of Azure services. The preconfigured solutions make use of different Azure services such as:

* [Azure IoT Hub](../iot-hub/index.md). This service provides the device-to-cloud and cloud-to-device messaging capabilities and acts as the gateway to the cloud and the other key IoT Suite services. The service enables you to receive messages from your devices at scale, and send commands to your devices. The service also enables you to [manage your devices](../iot-hub/iot-hub-device-management-overview.md). For example, you can configure, reboot, or perform a factory reset on one or more devices connected to the hub.
* [Azure Time Series Insights](../time-series-insights/index.md). The version 2 preconfigured solutions use this service to analyze and display the telemetry data from your devices.
* [Azure Container Service](../container-service/index.yml). This service hosts and manages the microservices in the version 2 preconfigured solutions.
* [Azure Cosmos DB](../cosmos-db/index.yml) and [Azure Storage](../storage/index.md) for data storage.
* [Azure Stream Analytics](../stream-analytics/index.md). The version 1 preconfigured solutions use this service to process incoming telemetry, perform aggregation, and detect events. These preconfigured solutions also use stream analytics to process informational messages that contain data such as metadata or command responses from devices.
* [Azure Web Apps](../app-service-web/index.yml) to host the custom application code in the version 1 preconfigured solutions.

For an overview of the architecture of a typical IoT solution, see [Microsoft Azure and the Internet of Things (IoT)](iot-suite-what-is-azure-iot.md).

## Next steps

Now that you have an overview of the IoT Suite preconfigured solutions here are suggested next steps:

* [Deploy the remote monitoring preconfigured solution](iot-suite-remote-monitoring-deploy.md).
* [Predictive maintenance preconfigured solution overview](iot-suite-predictive-overview.md).
* [Get started with the connected factory preconfigured solution](iot-suite-connected-factory-overview.md).

For more information about IoT solution architectures, see [Microsoft Azure IoT services: Reference Architecture](http://download.microsoft.com/download/A/4/D/A4DAD253-BC21-41D3-B9D9-87D2AE6F0719/Microsoft_Azure_IoT_Reference_Architecture.pdf).
