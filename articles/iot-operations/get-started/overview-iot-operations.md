---
title: What is Azure IoT Operations?
description: Azure IoT Operations is a unified data plane for the edge. It's composed of various data services that run on Azure Arc-enabled edge Kubernetes clusters.
author: dominicbetts
ms.author: dobett
ms.topic: conceptual
ms.custom:
  - ignite-2023
ms.date: 10/18/2023
---

# What is Azure IoT Operations?

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

_Azure IoT Operations Preview_ is a unified data plane for the edge. It's composed of a set of modular, scalable, and highly available data services that run on Azure Arc-enabled edge Kubernetes clusters. It enables data capture from various different systems and integrates with data modeling applications such as Microsoft Fabric to help organizations deploy the industrial metaverse.

Azure IoT Operations:

* Is built from ground up by using Kubernetes native applications.
* Includes an industrial-grade, edge-native MQTT broker that powers event-driven architectures.
* Is highly extensible, scalable, resilient, and secure.
* Lets you manage all edge services from the cloud by using Azure Arc.
* Can integrate customer workloads into the platform to create a unified solution.
* Supports GitOps configuration as code for deployment and updates.
* Natively integrates with [Azure Event Hubs](/azure/event-hubs/azure-event-hubs-kafka-overview), [Azure Event Grid's MQTT broker](/azure/event-grid/mqtt-overview), and [Microsoft Fabric](/fabric/) in the cloud.

## Architecture overview

:::image type="content" source="media/overview-iot-operations/azure-iot-operations-architecture.svg" alt-text="Diagram that shows the high-level architecture of Azure IoT Operations." lightbox="media/overview-iot-operations/azure-iot-operations-architecture-high-resolution.png" border="false":::

There are two core elements in the Azure IoT Operations Preview architecture:

* **Azure IoT Operations Preview**. The set of data services that run on Azure Arc-enabled edge Kubernetes clusters. It includes the following services:
  * **Azure IoT Data Processor Preview** - a configurable data processing service that can manage the complexities and diversity of industrial data. Use Data Processor to make data from disparate sources more understandable, usable, and valuable.
  * **Azure IoT MQ Preview** - an edge-native MQTT broker that powers event-driven architectures.
  * **Azure IoT OPC UA Broker Preview** - an OPC UA broker that handles the complexities of OPC UA communication with OPC UA servers and other leaf devices.
* **Azure IoT Operations Experience Preview portal**. This web UI provides a unified experience for operational technologists to manage assets and Data Processor pipelines in an Azure IoT Operations deployment.

## Deploy

Azure IoT Operations runs on Arc-enabled Kubernetes clusters on the edge. You can deploy Azure IoT Operations by using the Azure portal or the Azure CLI.

[Azure IoT Orchestrator](../deploy-custom/overview-orchestrator.md) manages the deployment, configuration, and update of the Azure IoT Operations components that run on your Arc-enabled Kubernetes cluster.

## Manage devices and assets

Azure IoT Operations can connect to various industrial devices and assets. You can use the [Azure IoT Operations portal](../manage-devices-assets/howto-manage-assets-remotely.md) to manage the devices and assets that you want to connect to.

The [OPC UA Broker Preview](../manage-devices-assets/overview-opcua-broker.md) component manages the connection to OPC UA servers and other leaf devices. The OPC UA Broker component publishes data from the OPC UA servers and the devices discovered by _Azure IoT Akri_ to Azure IoT MQ topics.

The [Azure IoT Akri Preview](../manage-devices-assets/overview-akri.md) component helps you discover and connect to other types of devices and assets.

## Publish and subscribe with MQTT

[Azure IoT MQ Preview](../manage-mqtt-connectivity/overview-iot-mq.md) is an MQTT broker that runs on the edge. It lets you publish and subscribe to MQTT topics. You can use MQ to build event-driven architectures that connect your devices and assets to the cloud.

Examples of how components in Azure IoT Operations use MQ Preview include:

* OPC UA Broker publishes data from OPC UA servers and other leaf devices to MQTT topics.
* Data Processor pipelines subscribe to MQTT topics to retrieve messages for processing.
* North-bound cloud connectors subscribe to MQTT topics to fetch messages for forwarding to cloud services.

## Process data

Message processing includes operations such as data normalization, data enrichment, and data filtering. You can use [Data Processor](../process-data/overview-data-processor.md) pipelines to process messages.

A Data Processor pipeline typically:

1. Subscribes to an MQTT topic to retrieve messages.
1. Processes the messages by using one or more configurable stages.
1. Sends the processed messages to a destination such as a Microsoft Fabric data lake for storage and analysis.

## Connect to the cloud

To connect to the cloud from Azure IoT Operations, you have the following options:

The north-bound cloud connectors let you connect MQ directly to cloud services such as:

* [MQTT brokers](../connect-to-cloud/howto-configure-mqtt-bridge.md)
* [Azure Event Hubs or Kafka](../connect-to-cloud/howto-configure-kafka.md)
* [Azure Data Lake Storage](../connect-to-cloud/howto-configure-data-lake.md)

The Data Processor pipeline destinations let you connect to cloud services such as:

* [Microsoft Fabric](../connect-to-cloud/howto-configure-destination-fabric.md)
* [Azure Data Explorer](../connect-to-cloud/howto-configure-destination-data-explorer.md)

## Visualize and analyze telemetry

To visualize and analyze telemetry from your devices and assets, you can use cloud services such as:

* [Microsoft Fabric](/fabric/get-started/fabric-trial)
* [Power BI](https://powerbi.microsoft.com/)

## Secure communication

To secure communication between devices and the cloud through isolated network environments based on the ISA-95/Purdue Network architecture, use the Azure IoT Layered Network Management Preview component.

## Validated environments

[!INCLUDE [validated-environments](../includes/validated-environments.md)]

## Next step

Try the [Quickstart: Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](quickstart-deploy.md).
