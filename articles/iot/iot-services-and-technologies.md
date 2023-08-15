---
title: Azure Internet of Things (IoT) technologies and solutions
description: Describes the collection of technologies and services you can use to build Azure IoT PaaS and aPaaS solutions.
author: dominicbetts
ms.service: iot
services: iot
ms.topic: conceptual
ms.date: 06/02/2023
ms.author: dobett
---

# What Azure technologies and services can you use to create IoT solutions?

Azure IoT technologies and services provide you with options to create a wide variety of IoT solutions that enable digital transformation for your organization. For example, you can:

* Use [Azure IoT Central](https://apps.azureiotcentral.com), a managed IoT application platform, to evaluate your IoT solution.
* Use Azure IoT platform services such as [Azure IoT Hub](../iot-hub/about-iot-hub.md) and the [Device Provisioning Service](../iot-dps/about-iot-dps.md) to build a custom IoT solution from scratch.

## Devices and device SDKs

You can choose a device to use from the [Azure Certified for IoT device catalog](https://devicecatalog.azure.com). You can implement your own embedded code using the open-source [device SDKs](./iot-sdks.md). The device SDKs support multiple operating systems, such as Linux, Windows, and real-time operating systems. There are SDKs for multiple programming languages, such as [C](https://github.com/Azure/azure-iot-sdk-c), [Node.js](https://github.com/Azure/azure-iot-sdk-node), [Java](https://github.com/Azure/azure-iot-sdk-java), [.NET](https://github.com/Azure/azure-iot-sdk-csharp), and [Python](https://github.com/Azure/azure-iot-sdk-python).

You can further simplify how you create the embedded code for your devices by following the [IoT Plug and Play](../iot-develop/overview-iot-plug-and-play.md) conventions. IoT Plug and Play enables solution developers to integrate devices with their solutions without writing any embedded code. At the core of IoT Plug and Play, is a _device capability model_ schema that describes device capabilities. Use the device capability model to configure a cloud-based solution such as an IoT Central application.

[Azure IoT Edge](../iot-edge/about-iot-edge.md) lets you offload parts of your IoT workload from your Azure cloud services to your devices. IoT Edge can reduce latency in your solution, reduce the amount of data your devices exchange with the cloud, and enable off-line scenarios. You can manage IoT Edge devices from IoT Central.

[Azure Sphere](/azure-sphere/product-overview/what-is-azure-sphere) is a secured, high-level application platform with built-in communication and security features for internet-connected devices. It includes a secured  microcontroller unit, a custom Linux-based operating system, and a cloud-based security service that provides continuous, renewable security.

> [!IMPORTANT]
> Because IoT Central uses IoT Hub internally, any device that can connect to an IoT Central application can also connect to an IoT hub.

To learn more, see [Azure IoT device and application development](../iot-develop/about-iot-develop.md).

## Azure IoT Central

[IoT Central](https://apps.azureiotcentral.com) is a managed app platform that reduces the burden and cost of developing, managing, and maintaining IoT solutions. Use IoT Central to quickly evaluate your IoT scenario and assess the opportunities it can create for your business. IoT Central streamlines the development of a complex and continually evolving IoT infrastructure by letting you to focus on determining the business impact you can create with your IoT data.

The web UI lets you quickly connect devices, monitor device conditions, create rules, and manage devices and their data throughout their life cycle. Furthermore, it enables you to act on device insights by extending IoT intelligence into line-of-business applications. After you've used IoT Central to evaluate your IoT scenario, you can then build your enterprise-ready Azure IoT solution.  

As a fully managed app platform, IoT Central has a simple, predictable pricing model.

## Custom solutions

To build an IoT solution from scratch, use one or more of the following Azure IoT technologies and services:

### Cloud connectivity

The [Azure IoT Hub](../iot-hub/about-iot-hub.md) service enables reliable and secure bidirectional communications between millions of IoT devices and a cloud-based solution. [Azure IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md) is a helper service for IoT Hub. The service provides zero-touch, just-in-time provisioning of devices to the right IoT hub without requiring human intervention. These capabilities enable customers to provision millions of devices in a secure and scalable manner.

IoT Hub is a core component and you can use it to meet IoT implementation challenges such as:

* High-volume device connectivity and management.
* High-volume telemetry ingestion.
* Command and control of devices.
* Device security enforcement.

### Bridging the gap between the physical and digital worlds

[Azure Digital Twins](../digital-twins/overview.md) is an IoT service that enables you to model a physical environment. It uses a spatial intelligence graph to model the relationships between people, spaces, and devices. By corelating data across the digital and physical worlds you can create contextually aware solutions.

IoT Central uses digital twins to synchronize devices and data in the real world with the digital models that enable users to monitor and manage those connected devices.

### Data and analytics

IoT devices typically generate large amounts of time series data, such as temperature readings from sensors. [Azure Data Explorer](/azure/data-explorer/ingest-data-iot-hub-overview) can connect to an IoT hub, read the telemetry stream from your devices, store that data, and enable you to query and visualize it.

[Azure Maps](../azure-maps/index.yml) is a collection of geospatial services that use fresh mapping data to provide accurate geographic context to web and mobile applications. You can use a REST API, a web-based JavaScript control, or an Android SDK to build your applications.

### Actions and notifications

A solution may required automated actions based on device data. For example, you may want to send an email or text message when a device reports a critical condition.

[Azure Functions](../azure-functions/functions-overview.md) is a serverless compute service that enables you to run code on-demand without having to explicitly provision or manage infrastructure. Use Azure Functions to create event-driven, serverless apps that can run actions in response to conditions identified in telemetry streams.

## Next steps

For a hands-on experience, try one of the quickstarts:

- [Create an Azure IoT Central application](../iot-central/core/quick-deploy-iot-central.md)
- [Send telemetry from a device to an IoT hub](../iot-hub/quickstart-send-telemetry-cli.md)
