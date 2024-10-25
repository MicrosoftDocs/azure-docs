---
title: What is Azure IoT Operations?
description: Azure IoT Operations is a unified data plane for the edge. It's a collection of various data services that run on Azure Arc-enabled edge Kubernetes clusters.
author: dominicbetts
ms.author: dobett
ms.topic: conceptual
ms.custom:
  - ignite-2023
  - references_regions
ms.date: 07/31/2024
---

# What is Azure IoT Operations Preview?

[!INCLUDE [public-preview-note](includes/public-preview-note.md)]

_Azure IoT Operations Preview_ is a unified data plane for the edge. It's a collection of modular, scalable, and highly available data services that run on Azure Arc-enabled edge Kubernetes clusters such as [AKS Edge Essentials](#validated-environments). It enables data capture from various different systems and integrates with data modeling applications such as Microsoft Fabric to help organizations deploy the industrial metaverse.

Azure IoT Operations:

* Is built from ground up by using Kubernetes native applications.
* Includes an industrial-grade, edge-native MQTT broker that powers event-driven architectures.
* Is highly extensible, scalable, resilient, and secure.
* Lets you manage edge services and resources from the cloud by using Azure Arc.
* Can integrate customer workloads into the platform to create a unified solution.
* Supports GitOps configuration as code for deployment and updates.
* Natively integrates with [Azure Event Hubs](../event-hubs/azure-event-hubs-kafka-overview.md), [Azure Event Grid's MQTT broker](../event-grid/mqtt-overview.md), and [Microsoft Fabric](/fabric/) in the cloud.

## Architecture overview

:::image type="content" source="media/overview-iot-operations/azure-iot-operations-architecture.svg" alt-text="Diagram that shows the high-level architecture of Azure IoT Operations." lightbox="media/overview-iot-operations/azure-iot-operations-architecture-high-resolution.png" border="false":::

There are two core elements in the Azure IoT Operations Preview architecture:

* **Azure IoT Operations Preview**. The set of data services that run on Azure Arc-enabled edge Kubernetes clusters. It includes the following services:
  * The _MQTT broker_ is an edge-native MQTT broker that powers event-driven architectures.
  * The _connector for OPC UA_ handles the complexities of OPC UA communication with OPC UA servers and other leaf devices.
  * _Dataflows_ provide data transformation and data contextualization capabilities and enable you to route messages to various locations including cloud endpoints.
* The _operations experience_ is a web UI that provides a unified experience for operational technologists (OT) to manage assets and dataflows in an Azure IoT Operations deployment. An IT administrator can use [Azure Arc site manager (preview)](/azure/azure-arc/site-manager/overview) to group Azure IoT Operations instances by physical location and make it easier for OT users to find instances.

## Deploy

Azure IoT Operations runs on Arc-enabled Kubernetes clusters on the edge. You can deploy Azure IoT Operations by using the Azure portal or the Azure CLI.

> [!NOTE]
> During public preview, there's no support for upgrading an existing Azure IoT Operations deployment to a newer version. Instead, remove Azure IoT Operations from your cluster and then deploy the latest version. For more information, see [Update Azure IoT Operations](./deploy-iot-ops/howto-manage-update-uninstall.md#update).

## Manage devices and assets

Azure IoT Operations can connect to various industrial devices and assets. You can use the [operations experience](discover-manage-assets/howto-manage-assets-remotely.md?tabs=portal) or the [Azure CLI](discover-manage-assets/howto-manage-assets-remotely.md?tabs=cli) to manage the devices and assets that you want to connect to.

The [connector for OPC UA](discover-manage-assets/overview-opcua-broker.md) manages the connection to OPC UA servers and other leaf devices. The connector for OPC UA publishes data from the OPC UA servers to MQTT broker topics.

Azure IoT Operations uses the Azure Device Registry to store information about local assets in the cloud. The service enables you to [manage assets on the edge from the Azure portal or the Azure CLI](discover-manage-assets/howto-secure-assets.md). The Azure Device Registry also includes a schema registry for the assets. Dataflows use these schemas to deserialize and serialize messages.

## Automatic asset discovery

Automatic asset discovery using Akri services is not available in the current version of Azure IoT Operations. To learn more, see the [Release notes](https://github.com/Azure/azure-iot-operations/releases) for the current version.

> [!NOTE]
> Some Akri services are still deployed as part of the current Azure IoT Operations release, but they don't support any user configurable scenarios.

If you're using a previous version of Azure IoT Operations, you can find the Akri documentation on the [previous versions site](/previous-versions/azure/iot-operations/discover-manage-assets/overview-akri).

## Publish and subscribe with MQTT

The [MQTT broker](manage-mqtt-broker/overview-iot-mq.md) runs on the edge. It lets you publish and subscribe to MQTT topics. You can use the MQTT broker to build event-driven architectures that connect your devices and assets to the cloud.

Examples of how components in Azure IoT Operations use the MQTT broker include:

* The connector for OPC UA publishes data from OPC UA servers and other leaf devices to MQTT topics.
* Dataflows subscribe to MQTT topics to retrieve messages for processing before sending them to cloud endpoints.

## Connect to the cloud

To connect to the cloud from Azure IoT Operations, you can use the following dataflow destination endpoints:

* [Azure Event Grid and other cloud-based MQTT brokers](connect-to-cloud/howto-configure-mqtt-endpoint.md)
* [Azure Event Hubs or Kafka](connect-to-cloud/howto-configure-kafka-endpoint.md)
* [Azure Data Lake Storage](connect-to-cloud/howto-configure-adlsv2-endpoint.md)
* [Microsoft Fabric OneLake](connect-to-cloud/howto-configure-fabric-endpoint.md)
* [Azure Data Explorer](connect-to-cloud/howto-configure-adx-endpoint.md)

## Process data

[Dataflows](connect-to-cloud/overview-dataflow.md) provide enhanced data transformation and data contextualization capabilities within Azure IoT Operations. Dataflows can use schemas stored in the schema registry to deserialize and serialize messages.

> [!NOTE]
> If you want to continue using the data processor, you must deploy Azure IoT Operations v0.5.1 with the additional flag to include data processor component. It's not possible to deploy the data processor with Azure IoT Operations v0.6.0 or newer. The Azure IoT operations CLI extension that includes the flag for deploying the data processor is version 0.5.1b1. This version requires Azure CLI v2.46.0 or greater. The data processor documentation is currently available on the previous versions site: [Azure IoT Operations data processor](/previous-versions/azure/iot-operations/process-data/overview-data-processor).

## Visualize and analyze telemetry

To visualize and analyze telemetry from your devices and assets, you can use cloud services such as:

* [Microsoft Fabric](/fabric/get-started/fabric-trial)
* [Power BI](https://powerbi.microsoft.com/)

## Secure communication

To secure communication between devices and the cloud through isolated network environments based on the ISA-95/Purdue Network architecture, use the Azure IoT Layered Network Management Preview component.

## Validated environments

[!INCLUDE [validated-environments](includes/validated-environments.md)]

## Supported regions

In the 0.7.x public preview release, Azure IoT Operations supports clusters that are Arc-enabled in the following regions:

| Region       | CLI value   |
|--------------|-------------|
| East US      | eastus      |
| East US 2    | eastus2     |
| West US      | westus      |
| West US 2    | westus2     |
| West US 3    | westus3     |
| West Europe  | westeurope  |
| North Europe | northeurope |

This list of supported regions only applies to the region that you use when connecting your cluster to Azure Arc. This list doesn't restrict you from using your preferred Azure region for your cloud resources. Azure IoT Operations components and other resources deployed to your cluster in these supported regions can still connect to cloud resources in different regions.

## Next step

Try the [Quickstart: Get started with an end-to-end sample](get-started-end-to-end-sample/quickstart-deploy.md).
