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

## Service and feature names

This section lists the names of the services and components that make up Azure IoT Operations.

### Azure IoT Operations Preview - enabled by Azure Arc

A unified data plane for the edge. It's a collection of modular, scalable, and highly available data services that run on Azure Arc-enabled edge Kubernetes clusters. It enables data capture from various different systems and integrates with data modeling applications such as Microsoft Fabric to help organizations deploy the industrial metaverse.

On first mention in an article, use _Azure IoT Operations Preview - enabled by Azure Arc_. On subsequent mentions, you can use _Azure IoT Operations_. Never use an acronym.

### Akri services

This component helps you discover and connect to devices and assets.

### Data processor

This component lets you aggregate, enrich, normalize, and filter the data from your devices and assets. The data processor is a pipeline-based data processing engine that lets you process data at the edge before you send it to the other services either at the edge or in the cloud

### Azure IoT Layered Network Management Preview

This component lets you secure communication between devices and the cloud through isolated network environments based on the ISA-95/Purdue Network architecture.

On first mention in an article, use _Azure IoT Layered Network Management Preview_. On subsequent mentions, you can use _Layered Network Management_. Never use an acronym.

### MQTT broker

An MQTT broker that runs on the edge. The component lets you publish and subscribe to MQTT topics. You can use the MQTT broker to build event-driven architectures that connect your devices and assets to the cloud.

### Connector for OPC UA

This component manages the connection to OPC UA servers and other leaf devices. The connector for OPC UA publishes data from the OPC UA servers and the devices discovered by _Akri services_ to MQTT broker topics.

### Operations experience

This web UI provides a unified experience for operational technologists to manage assets and data processor pipelines in an Azure IoT Operations deployment.

### Azure Device Registry Preview

This component provides a single centralized registry for devices and assets that are projected as Azure resources.

On first mention in an article, use _Azure Device Registry Preview_. On subsequent mentions, you can use _Device Registry_. Never use an acronym.

## Related content

- [What is Azure IoT Operations Preview?](../overview-iot-operations.md)
- [Connect industrial assets using Azure IoT OPC UA Broker Preview](../discover-manage-assets/overview-opcua-broker.md)
- [Publish and subscribe MQTT messages using MQTT broker](../manage-mqtt-broker/overview-iot-mq.md)
