---
title: Choose an Azure IoT service
description: Describes the collection of services and technologies you can use to build Azure IoT cloud-based and edge-based solutions.
author: asergaz
ms.service: azure-iot
services: iot
ms.topic: product-comparison
ms.date: 03/28/2025
ms.author: sergaz
#Customer intent: As a newcomer to IoT, I want to understand what Azure IoT services are available, and which one to select based on my IoT solution.
---

# Choose an Azure IoT service

Azure IoT services and technologies provide you with options to create a wide variety of IoT solutions that enable digital transformation for your organization. This article describes Azure IoT services and technologies such as:

- Azure IoT Operations
- Azure Device Registry
- Azure IoT Operations SDKs
- Azure IoT Hub
- Azure IoT Hub Device Provisioning Service
- Azure Device Update for IoT Hub
- Azure IoT Edge
- Azure Digital Twins
- Azure IoT Central
- Azure Event Grid
- Azure IoT device and service SDKs
- Azure IoT Plug and Play
- Microsoft Defender for IoT

## Choose a solution type

The [What is Azure IoT?](iot-introduction.md) article describes two broad categories of IoT solutions:

- In a *cloud-based IoT solution*, your IoT devices connect directly to the cloud where their messages are processed and analyzed.
- In an *edge-based IoT solution*, your IoT assets connect to an edge environment that processes their messages before forwarding them to the cloud for storage and analysis.

*Hybrid IoT solutions* are also possible that combine both cloud and edge components.

Your choice of solution type determines which Azure IoT services and technologies you can use. For example, to build an edge-based solution you typically use Azure IoT Operations, for a cloud-based solution you typically use Azure IoT Hub.

The later sections describe the role of the various Azure IoT services and technologies in cloud-based, edge-based, and hybrid solutions.

## Adaptive cloud approach

Another way to categorize IoT solutions is by whether they adopt the [adaptive cloud](/azure/adaptive-cloud/) approach. The adaptive cloud approach unifies siloed teams, distributed sites, and disparate systems into a single operations, security, application, and data model. This approach enables you to use the same cloud and AI technologies to manage and monitor edge-based, cloud-based, and hybrid IoT solutions.

An example of how Azure IoT Operations uses the adaptive cloud approach is its use of [Azure Arc-enabled services](/azure/azure-arc/) to manage and monitor edge-based resources such as assets and data flows. These edge-based resources are exposed in your Azure portal as individual cloud-based resources that you can manage and monitor with standard Azure tools.

In contrast, the devices and routing definitions in IoT Hub aren't exposed as individual resources in your Azure portal but are part of the IoT Hub resource. The only way to manage and monitor these resources is through IoT Hub.

## Azure IoT Operations

> Use Azure IoT Operations to build an **edge-based IoT solution** that follows the adaptive cloud approach.

Azure IoT Operations is a unified data plane for the edge. It's a collection of modular, scalable, and highly available data services that run on Azure Arc-enabled edge Kubernetes clusters such as AKS Edge Essentials. It enables data capture from various different systems and integrates with data modeling applications such as Microsoft Fabric to help organizations deploy the industrial metaverse.

To learn more, see [What is Azure IoT Operations?](../iot-operations/overview-iot-operations.md).

### Azure Device Registry

> Currently, Azure Device Registry is typically part of an **edge-based IoT solution** that uses Azure IoT Operations and follows the adaptive cloud approach.

Azure Device Registry is a backend service that enables the management of assets and devices in your solution using Azure Resource Manager. Azure Device Registry:

 - Projects assets and devices, such as OPC servers and video cameras defined in your edge environment, as Azure resources in the cloud.
 - Manages the synchronization of asset and device definitions between the cloud and the edge.
 - Provides a single unified registry for any apps and services that need to interact with your assets and devices. 
 - Stores schemas for asset and device messages.

To learn more, see [What is asset management in Azure IoT Operations](../iot-operations/discover-manage-assets/overview-manage-assets.md).

### Azure IoT Operations SDKs (preview)

> The Azure IoT Operations SDKs enable you to build a custom **edge-based IoT solution** that uses Azure IoT Operations.

The Azure IoT Operations SDKs are a suite of tools and libraries across multiple languages designed to aid the development of applications for Azure IoT Operations. The SDKs can be used to build secure, highly available applications at the edge, that interact with Azure IoT Operations to perform operations such as asset discovery, protocol translation and data transformation.

To learn more, see [Azure IoT Operations SDKs](https://github.com/Azure/iot-operations-sdks/tree/main).

## Azure IoT Hub

> Use Azure IoT Hub to build a **cloud-based IoT solution**. IoT Hub does not follow the adaptive cloud approach.

Azure IoT Hub is a managed service hosted in the cloud that acts as a central message hub for communication between an IoT application and its attached devices. Several messaging patterns are supported, including device-to-cloud messages, uploading files from devices, and request-reply methods to control your devices from the cloud. IoT Hub can route messages from devices to other cloud services for storage, analysis, or processing. IoT Hub also supports monitoring to help you track device creation, device connections, and device failures.

To learn more, see [What is Azure IoT Hub?](../iot-hub/iot-concepts-and-iot-hub.md).

### Azure IoT Hub Device Provisioning Service (DPS)

> DPS is typically part of a **cloud-based IoT solution** that uses IoT Hub or IoT Central.

DPS is a helper service for IoT Hub that enables zero-touch, just-in-time provisioning of IoT devices to an IoT hub without requiring human intervention. Many of the manual steps traditionally involved in provisioning are automated with DPS to reduce the time to deploy IoT devices and lower the risk of manual error. DPS can provision devices that use X.509 certificates and trusted platform modules. IoT Central applications use an internal DPS instance to manage device connections.

To learn more, see [What is Azure IoT Hub Device Provisioning Service?](../iot-dps/about-iot-dps.md).

### Azure Device Update for IoT Hub

> Device Update for IoT Hub is typically part of a **cloud-based IoT solution** that uses IoT Hub.

Azure Device Update for IoT Hub is a service that enables you to deploy over-the-air updates for your IoT devices, including Azure IoT Edge devices. Device Update offers optimized update deployment and streamlined operations through integration with Azure IoT Hub, making it easy to adopt on any existing IoT Hub-based solution.

To learn more, see [What is Device Update for IoT Hub?](../iot-hub-device-update/understand-device-update.md).

### Azure IoT Edge

> IoT Edge is typically part of a **hybrid IoT solution** that uses IoT Hub or IoT Central.

Azure IoT Edge is a device-focused runtime that enables you to deploy, run, and monitor containerized Linux workloads at the edge, bringing analytics closer to your devices for faster insights and offline decision-making. IoT Edge can also act as a gateway for devices with no internet connectivity and protocol translation. IoT Edge is a feature of Azure IoT Hub and also integrates with Azure IoT Central.

To learn more, see [What is Azure IoT Edge](../iot-edge/about-iot-edge.md).

## Azure Digital Twins

> The Azure Digital Twins service is typically part of a **cloud-based IoT solution** that uses IoT Hub.

Azure Digital Twins is a platform as a service (PaaS) offering that enables the creation of twin graphs based on digital models of entire environments, which could be buildings, factories, farms, energy networks, railways, stadiums, and more—even entire cities. Azure Digital Twins can be used to design a digital twin architecture that represents actual IoT devices in a wider cloud solution, and which connects to IoT Hub device twins to send and receive live data.

To learn more, see [What is Azure Digital Twins?](../digital-twins/overview.md).

## Azure IoT Central

> Use Azure IoT Central to build a **cloud-based IoT solution**. IoT Central does not follow the adaptive cloud approach.

IoT Central is an IoT application platform as a service (aPaaS) that reduces the burden and cost of developing, managing, and maintaining IoT solutions. To streamline the development of a complex and continually evolving IoT infrastructure, IoT Central lets you focus your efforts on determining the business impact you can create with the IoT data stream. The web UI lets you quickly connect devices, monitor device conditions, create rules, manage devices and their data throughout their life cycle, and optionally route device messages to other cloud services for storage, analysis, or processing.

To learn more, see [What is Azure IoT Central?](../iot-central/core/overview-iot-central.md).

## Azure Event Grid

> Currently, Azure Event Grid is typically part of a **hybrid IoT solution** that uses Azure IoT Operations, IoT Hub, or IoT Central.

Azure Event Grid is a highly scalable, fully managed Pub Sub message distribution service that offers flexible message consumption patterns using the MQTT and HTTP protocols. With Azure Event Grid, you can build data pipelines with device data, integrate applications, and build event-driven serverless architectures. Event Grid enables clients to publish and subscribe to messages over the MQTT v3.1.1 and v5.0 protocols to support IoT solutions. Through HTTP, Event Grid enables you to build event-driven solutions where a publisher service announces its system state changes (events) to subscriber applications.

Azure IoT Operations allows you to connect to Event Grid and other cloud-based MQTT brokers. For example, you can set up a [bi-directional MQTT bridge between an Azure IoT Operations MQTT broker and Azure Event Grid](../iot-operations/connect-to-cloud/tutorial-mqtt-bridge.md).

IoT Hub and IoT Central can integrate with Azure Event Grid to enable your business to react quickly to critical events. For example you can [react to IoT Hub events by using Event Grid to trigger actions](../iot-hub/iot-hub-event-grid.md).

To learn more, see [What is Azure Event Grid?](../event-grid/overview.md)

## Azure IoT device and service SDKs

> The Azure IoT device and service SDKs enables you to build a custom **cloud-based IoT solution** that uses IoT Hub or IoT Central.

- The [Azure IoT device SDKs](iot-sdks.md#device-sdks) help you address the challenges of connecting devices securely and reliably to your IoT Hub or IoT Central using protocols such as MQTT and AMQP.
- The [Azure IoT service SDKs](iot-sdks.md#iot-hub-service-sdks) contain code to facilitate building applications that interact directly with IoT Hub to manage devices and security.
- The [IoT Hub management SDKs](iot-sdks.md#iot-hub-management-sdks) help you build backend applications that manage the IoT hubs in your Azure subscription.
- The [DPS device SDKs](iot-sdks.md#dps-device-sdks) provide implementations of the Register API and others that devices call to provision through DPS in IoT Hub or IoT Central.
- The [DPS service SDKs](iot-sdks.md#dps-service-sdks) help you build backend applications to manage enrollments and registration records in DPS instances.
- The [DPS management SDKs](iot-sdks.md#dps-management-sdks) help you build backend applications that manage the DPS instances and their metadata in your Azure subscription.

To learn more, see [Azure IoT device and service SDKs](iot-sdks.md).

## Azure IoT Plug and Play

> Azure IoT Plug and Play is a programming model that enables you to build a **cloud-based IoT solution** that uses IoT Hub or IoT Central.

IoT Plug and Play enables solution builders to integrate IoT devices with their solutions without any manual configuration. At the core of IoT Plug and Play, is a device _model_ that a device uses to advertise its capabilities to an IoT Plug and Play-enabled service such as IoT Central or Azure Digital Twins. You define IoT Plug and Play models and interfaces using the [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/README.md).

To learn more, see [What is IoT Plug and Play?](overview-iot-plug-and-play.md).

## Microsoft Defender for IoT

> Microsoft Defender for IoT is a unified security solution that helps you secure **cloud-based, edge-based and hybrid IoT solutions**.

Microsoft Defender for IoT is a unified security solution built specifically to identify threats and vulnerabilities in your IoT and operational technology (OT) infrastructure. Use Defender for IoT to secure your entire IoT/OT environment, including existing devices that might not have built-in security agents.

Defender for IoT provides agentless, network layer monitoring, and integrates with both industrial equipment and security operation center (SOC) tools.

To learn more, see [What is Microsoft Defender for IoT?](../defender-for-iot/organizations/overview.md).

## Other cloud services

Both cloud-based and edge-based solutions can use other cloud services to provide more functionality to your solution. For example, you can use:

- Azure storage services to store collected data.
- Azure Stream Analytics to process sensor data in real time.
- Azure Functions to respond to device events.
- Azure Logic Apps to automate business processes.
- Azure Machine Learning to add machine learning and AI models to your solution.
- Microsoft Fabric to store and analyze sensor data.
- Microsoft Power BI to visualize sensor data.

To learn more, see:

- [Extend your IoT solution](iot-overview-solution-extensibility.md)
- [Analyze and visualize your IoT data](iot-overview-analyze-visualize.md)

## Next steps

For a hands-on experience, try one of the quickstarts:

- [Quickstart: Run Azure IoT Operations in GitHub Codespaces with K3s](../iot-operations/get-started-end-to-end-sample/quickstart-deploy.md)
- [Quickstart: Send telemetry from a device to an IoT hub and monitor it with the Azure CLI](../iot-hub/quickstart-send-telemetry-cli.md)
- [Quickstart: Use your smartphone as a device to send telemetry to an IoT Central application](../iot-central/core/quick-deploy-iot-central.md)

