---
title: Azure IoT Suite preconfigured solutions overview | Microsoft Docs
description: A description of the Azure IoT Suite  preconfigured solutions and their architecture with links to additional resources.
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
# What is Azure IoT Suite?

Azure IoT Suite is a set *preconfigured solutions* that deploy in minutes and help customers get started quickly and then customize to meet their needs. Microsoft uses IoT Suite to refer to the collection because all the preconfigured solutions are designed withe same principles and goals.

## Preconfigured solutions overview

A preconfigured solution is open source implementation of a common IoT solution patterns that you can deploy to Azure using your subscription. Each preconfigured solution combines custom code and Azure services to implement a specific IoT scenario or scenarios that can be customized to tailor different needs. These scenarios include:

* Visualize data on a rich dashboard for deep insights and solution status
* Configure rules and alarms over live IoT device telemetry 
* Schedule device management jobs, including updates to software and configuration 
* Provision your own custom physical or simulated devices
* Troubleshoot and remediate issues within your IoT device groups 

Each preconfigured solution is a complete, end-to-end implementation that can use simulated of physical devices to generate telemetry. You can use the preconfigured solutions as solution accelerators to:

* Provide a starting point for your own IoT solutions.
* Learn about common patterns in IoT solution design and development.

There are three preconfigured solutions available today: 

* Remote monitoring <!-- insert links to each PCS overview-->
* Predictive maintenance
* Connected factory

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

> [!NOTE]
> To deploy one of the preconfigured solutions and learn more about how to customize them, visit [Microsoft Azure IoT Suite](https://www.azureiotsuite.com/).

## Azure services

When you deploy a preconfigured solution, the provisioning process configures a number of Azure services. The following table shows the services used in the preconfigured solutions:

|                      | Remote monitoring  | Predictive maintenance | Connected factory |
| -------------------- | ------------------ | ---------------------- | ----------------- |
| IoT Hub              | Yes                |                        | Yes               |
| Event Hubs           |                    | Yes                    |                   |
| Time Series Insights |                    |                        | Yes               |
| Container Services   | Yes                |                        | Yes               |
| Stream Analytics     |                    | Yes                    |                   |
| Web Apps             |     Yes               | Yes                    | Yes               |
| Cosmos DB               | Yes                | Yes                    | Yes               | <!-- Pending confirmation for PM and CF-->
| Azure Tables         |                    | Yes                    | Yes               |

* [Azure IoT Hub](../iot-hub/index.md). This service provides the device-to-cloud and cloud-to-device messaging capabilities and acts as the gateway to the cloud and the other key IoT Suite services. The service enables you to receive messages from your devices at scale, and send commands to your devices. The service also enables you to [manage your devices](../iot-hub/iot-hub-device-management-overview.md). For example, you can configure, reboot, or perform a factory reset on one or more devices connected to the hub.
* [Azure Event Hubs](../event-hubs/index.md). This service provides high-volume event ingestion to the cloud. See [Comparison of Azure IoT Hub and Azure Event Hubs](../iot-hub/iot-hub-compare-event-hubs.md).
* [Azure Time Series Insights](../time-series-insights/index.md). The preconfigured solutions use this service to analyze and display the telemetry data from your devices.
* [Azure Container Service](../container-service/index.yml). This service hosts and manages the microservices in the preconfigured solutions.
* [Azure Cosmos DB](../cosmos-db/index.yml) and [Azure Storage](../storage/index.md) for data storage.
* [Azure Stream Analytics](../stream-analytics/index.md). The predictive maintenance preconfigured solution uses this service to process incoming telemetry, perform aggregation, and detect events. This preconfigured solution also uses stream analytics to process informational messages that contain data such as metadata or command responses from devices.
* [Azure Web Apps](../app-service-web/index.yml) to host the custom application code in the preconfigured solutions.

For an overview of the architecture of a typical IoT solution, see [Microsoft Azure and the Internet of Things (IoT)](iot-suite-what-is-azure-iot.md).

## What's new in preconfigured solutions?

Microsoft is updating the preconfigured solutions to a new microservices-based architecture. The following table shows the current status of the preconfigured solutions:

| Preconfigured solution | Architecture  | Languages     |
| ---------------------- | ------------- | ------------- |
| Remote monitoring      | Microservices | Java and .NET |
| Predictive maintenance | MVC           | .NET          |
| Connected factory      | MVC           | .NET          |

The following sections describe what's new in the microservices-based preconfigured solutions:

### Microservices

The new version of the Remote monitoring preconfigured solution uses a microservices architecture. This preconfigured solution is composed of multiple microservices such as an *IoT Hub manager* and a *Storage manager*.  Both Java and .NET versions of each microservice are available to download, along with related developer documentation. For more information about the microservices, see [Remote monitoring architecture](iot-suite-remote-monitoring-sample-walkthrough.md).

This microservices architecture is a proven pattern for cloud solutions that:

* Is scalable.
* Enables extensibility.
* Is easy to understand.
* Enables individual services to be swapped out for alternatives.

When you deploy the new version of remote monitoring, you must select one of the following deployment options:

* **Basic:** Reduced cost version geared for demonstration or test a deployment. All the microservices deploy to a single Azure virtual machine.
* **Enterprise:** Expanded infrastructure deployment geared towards developing a production deployment.The Azure Container Service deploys the microservices to multiple Azure virtual machines. Kubernetes orchestrates the Docker containers that host the individual microservices.

### Language choices: Java and .Net

Implementations of each of the microservices is available in Java as well as .NET. Like the .NET code, the Java source code is open source and available for your to customize to your specific requirements.
<!--Insert links to repos to RM Java and .Net-->

### React user interface framework

The UI is built using the [React](https://facebook.github.io/react/) javascript library. The source code is open source and available for you to download and customize. 

## Next steps

Now that you have an overview of the IoT Suite preconfigured solutions, here are suggested next steps for each of the preconfigured solutions:

* [Explore the Azure IoT Suite remote monitoring solution Resource Manager deployment model](iot-suite-remote-monitoring-explore.md).
* [Predictive maintenance preconfigured solution overview](iot-suite-predictive-overview.md).
* [Get started with the connected factory preconfigured solution](iot-suite-connected-factory-overview.md).

For more information about IoT solution architectures, see [Microsoft Azure IoT services: Reference Architecture](http://download.microsoft.com/download/A/4/D/A4DAD253-BC21-41D3-B9D9-87D2AE6F0719/Microsoft_Azure_IoT_Reference_Architecture.pdf).
