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

The Azure IoT Suite preconfigured solutions are implementations of common IoT solution patterns that you can deploy to Azure using your subscription. The preconfigured solutions are solution accelerators that you can use:

* As a starting point for your own IoT solutions.
* To learn about common patterns in IoT solution design and development.

Each preconfigured solution is a complete, end-to-end implementation that uses simulated devices to generate telemetry.

You can download the complete source code to customize and extend the solutions to meet your specific IoT requirements.

> [!NOTE]
> To deploy one of the preconfigured solutions, visit [Microsoft Azure IoT Suite](https://www.azureiotsuite.com/).

Microsoft is updating the preconfigured solutions from version 1 to the new microservices-based version 2 implementation. The following table shows the current versions of the preconfigured solutions:

| Preconfigured solution | Version | Languages     |
| ---------------------- | ------- | ------------- |
| Remote monitoring      | 2       | Java and .NET |
| Predictive maintenance | 1       | .NET          |
| Connected factory      | 1       | .NET          |

The following table shows how the solutions map to specific IoT features:

| Solution | Data ingestion | Device identity | Device management | Command and control | Rules and actions | Predictive analytics |
| --- | --- | --- | --- | --- | --- | --- |
| [Remote monitoring](todo) |Yes |Yes |Yes |Yes |Yes |- |
| [Predictive maintenance](iot-suite-predictive-overview.md) |Yes |Yes |- |Yes |Yes |Yes |
| [Connected factory](iot-suite-connected-factory-overview.md) |Yes |Yes |Yes |Yes |Yes |- |

* *Data ingestion*: Ingress of data at scale to the cloud.
* *Device identity*: Manage unique device identities and control device access to the solution.
* *Device management*: Manage device metadata and perform operations such as device reboots and firmware upgrades.
* *Command and control*: To cause the device to take an action, send messages to a device from the cloud.
* *Rules and actions*: To act on specific device-to-cloud data, the solution back end uses rules.
* *Predictive analytics*: The solution back end analyzes device-to-cloud data to predict when specific actions should take place. For example, analyzing aircraft engine telemetry to determine when engine maintenance is due.

## Microservices architecture

The version 2 preconfigured solutions use a microservices architecture. These preconfigured solutions are composed of multiple microservices such as an *IoT Hub manager* and a *Storage manager*.  Both Java and .NET versions of each microservice are available to download. For more information about the microservices, see [Remote monitoring architecture](todo).

By default, the Azure Container Service deploys these microservices to Azure Virtual Machines. Kubernetes orchestrates the Docker containers that host the individual microservices.

The benefits of this architectural approach include:

* TODO
* TODO

## Azure services

Each preconfigured solution typically uses some of the following Azure services:

* Core to Azure IoT Suite is the [Azure IoT Hub](../iot-hub/index.md) service. This service provides the device-to-cloud and cloud-to-device messaging capabilities and acts as the gateway to the cloud and the other key IoT Suite services. The service enables you to receive messages from your devices at scale, and send commands to your devices. The service also enables you to [manage your devices](../iot-hub/iot-hub-device-management-overview.md). For example, you can configure, reboot, or perform a factory reset on one or more devices connected to the hub.
* [Azure Container Service](../container-service/index.md) hosts the microservices in the version 2 preconfigured solutions.
* [Azure Stream Analytics](../stream-analytics/index.md) provides in-motion data analysis. IoT Suite uses this service to process incoming telemetry, perform aggregation, and detect events. The preconfigured solutions also use stream analytics to process informational messages that contain data such as metadata or command responses from devices. The solutions use Stream Analytics to process the messages from your devices and deliver those messages to other services.
* The version 2 preconfigured solutions use [Azure Cosmos DB](../cosmos-db/index.md) for data storage.
* The version 1 preconfigured solutions use [Azure Storage](../storage/index.md) and [Azure Cosmos DB](../cosmos-db/index.md) for data storage. These preconfigured solutions use blob storage to store telemetry and to make it available for analysis. The solutions use Cosmos DB to store device metadata and enable the device management capabilities of the solutions.
* [Azure Web Apps](../app-serice/web/index.md) and [Microsoft Power BI](https://powerbi.microsoft.com/) provide the data visualization capabilities. The flexibility of Power BI enables you to quickly build your own interactive dashboards that use IoT Suite data.

For an overview of the architecture of a typical IoT solution, see [Microsoft Azure and the Internet of Things (IoT)](iot-suite-what-is-azure-iot.md).

## Next steps

Now that you have an overview of the IoT Suite preconfigured solutions here are suggested next steps:

* [Deploy the remote monitoring preconfigured solution](todo).
* [Predictive maintenance preconfigured solution overview](iot-suite-predictive-overview.md).
* [Get started with the connected factory preconfigured solution](iot-suite-connected-factory-overview.md).

For more information about IoT solution architectures, see [Microsoft Azure IoT services: Reference Architecture](http://download.microsoft.com/download/A/4/D/A4DAD253-BC21-41D3-B9D9-87D2AE6F0719/Microsoft_Azure_IoT_Reference_Architecture.pdf).
