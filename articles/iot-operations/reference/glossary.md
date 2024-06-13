---
title: "Glossary for Azure IoT Operations"
description: "List of terms with definitions and usage guidance related to Azure IoT Operations - enabled by Azure Arc."
author: dominicbetts
ms.author: dobett
ms.service: iot-operations
ms.topic: glossary #Don't change
ms.date: 01/10/2024

# Customer intent: As a user of Azure IoT Operations, I want learn about the terminology associated with Azure IoT Operations so that I can use the terminology correctly.

---

# Glossary for Azure IoT Operations Preview - enabled by Azure Arc

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

This article lists and defines some of the key terms associated with Azure IoT Operations. The article includes usage guidance to help you use the terms correctly if you're talking or writing about Azure IoT Operations.

## Service and component names

This section lists the names of the services and components that make up Azure IoT Operations.

### Azure IoT Operations Preview - enabled by Azure Arc

A unified data plane for the edge. It's a collection of modular, scalable, and highly available data services that run on Azure Arc-enabled edge Kubernetes clusters. It enables data capture from various different systems and integrates with data modeling applications such as Microsoft Fabric to help organizations deploy the industrial metaverse.

On first mention in an article, use _Azure IoT Operations Preview - enabled by Azure Arc_. On subsequent mentions, you can use _Azure IoT Operations_. Never use an acronym.

### Azure IoT Akri Preview

This component helps you discover and connect to devices and assets.

On first mention in an article, use _Azure IoT Akri Preview_. On subsequent mentions, you can use _Azure IoT Akri_. Never use an acronym.

### Azure IoT Data Processor Preview

This component lets you aggregate, enrich, normalize, and filter the data from your devices and assets. Data Processor is a pipeline-based data processing engine that lets you process data at the edge before you send it to the other services either at the edge or in the cloud

On first mention in an article, use _Azure IoT Data Processor Preview_. On subsequent mentions, you can use _Data Processor_. Never use an acronym.

### Azure IoT Layered Network Management Preview

This component lets you secure communication between devices and the cloud through isolated network environments based on the ISA-95/Purdue Network architecture.

On first mention in an article, use _Azure IoT Layered Network Management Preview_. On subsequent mentions, you can use _Layered Network Management_. Never use an acronym.

### Azure IoT MQ Preview

An MQTT broker that runs on the edge. The component lets you publish and subscribe to MQTT topics. You can use MQ to build event-driven architectures that connect your devices and assets to the cloud.

On first mention in an article, use _Azure IoT MQ Preview_. On subsequent mentions, you can use _MQ_.

### Azure IoT OPC UA Broker Preview

This component manages the connection to OPC UA servers and other leaf devices. The OPC UA Broker component publishes data from the OPC UA servers and the devices discovered by _Azure IoT Akri_ to Azure IoT MQ topics.

On first mention in an article, use _Azure IoT OPC UA Broker Preview_. On subsequent mentions, you can use _OPC UA Broker_. Never use an acronym.

### Azure IoT Orchestrator Preview

This component manages the deployment, configuration, and update of the Azure IoT Operations components that run on your Arc-enabled Kubernetes cluster.

On first mention in an article, use _Azure IoT Orchestrator Preview_. On subsequent mentions, you can use _Orchestrator_. Never use an acronym.

### Azure IoT Operations (preview) portal

This web UI provides a unified experience for operational technologists to manage assets and Data Processor pipelines in an Azure IoT Operations deployment.

On first mention in an article, use _Azure IoT Operations (preview) portal_. On subsequent mentions, you can use _Operations portal_. Never use an acronym.

### Azure Device Registry Preview

This component provides a single centralized registry for devices and assets that are projected as Azure resources.

On first mention in an article, use _Azure Device Registry Preview_. On subsequent mentions, you can use _Device Registry_. Never use an acronym.

## Related content

- [What is Azure IoT Operations Preview?](../get-started/overview-iot-operations.md)
- [Connect industrial assets using Azure IoT OPC UA Broker Preview](../manage-devices-assets/overview-opcua-broker.md)
- [Publish and subscribe MQTT messages using Azure IoT MQ Preview](../manage-mqtt-connectivity/overview-iot-mq.md)
