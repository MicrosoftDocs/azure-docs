---
title: Azure Internet of Things (IoT) technologies and solutions
description: Describes the collection of technologies and services you can use to build an Azure IoT solution.
author: dominicbetts
ms.service: iot-fundamentals
services: iot-fundamentals
ms.topic: conceptual
ms.date: 08/25/2022
ms.author: dobett
---

# What Azure technologies and services can you use to create IoT solutions?

Azure IoT technologies and services provide you with options to create a wide variety of IoT solutions that enable digital transformation for your organization. For example:

- For simple onboarding, start as high as you can with Azure IoT Central, an application platform as a service (aPaaS). Starting here simplifies connectivity and management of IoT devices, and extensibility features help you integrate your IoT data into business applications to deliver proof of value.

- If your requirements go beyond IoT Central's capabilities, the Azure portfolio supports you to go lower in the stack. Customizable platform as a service (PaaS) offerings such as [Azure IoT Hub](../iot-hub/iot-concepts-and-iot-hub.md) and the [Azure IoT device SDKs](../iot-hub/iot-hub-devguide-sdks.md) enable custom IoT solutions from scratch.

:::image type="content" source="media/iot-services-and-technologies/iot-options.svg" alt-text="Diagram that shows Azure IoT onboarding options." border="false" lightbox="media/iot-services-and-technologies/iot-options.svg":::

## Azure IoT Central (aPaaS)

The [IoT Central application platform](https://apps.azureiotcentral.com/) is a ready-made environment for IoT solution development. Built on trusted Azure PaaS services it reduces the burden and cost of developing, managing, and maintaining enterprise-grade IoT solutions. It delivers built-in disaster recovery, multitenancy, global availability, and a predictable cost structure.

IoT Central's customizable web UI and API surface let you monitor and manage millions of devices and their data throughout their life cycle. Get started exploring IoT Central in minutes [using your phone as an IoT device](../iot-central/core/quick-deploy-iot-central.md) – see live telemetry, create rules, run commands from the cloud, and export your data for business analytics.

Choose devices from the [Azure Certified for IoT device catalog](https://devicecatalog.azure.com/) to quickly connect to your solution, or develop a custom device using IoT Central's [device templates](../iot-central/core/howto-set-up-template.md).

## Custom solutions (PaaS)

To build an IoT solution from scratch, or extend one created using IoT Central, you can use the following Azure IoT technologies and services:

:::image type="content" source="media/iot-services-and-technologies/iot-stack.svg" alt-text="Diagram that shows Azure IoT technology and services stack." border="false" lightbox="media/iot-services-and-technologies/iot-stack.svg":::

### Devices

Develop your IoT devices using a starter kit such as the [Azure MXChip IoT DevKit](/samples/azure-samples/mxchip-iot-devkit-pnp-get-started/sample/) or choose a device from the [Azure Certified for IoT device catalog](https://devicecatalog.azure.com/). Implement your embedded code using the open-source [device SDKs](../iot-hub/iot-hub-devguide-sdks.md). The device SDKs support multiple operating systems, such as Linux, Windows, and real-time operating systems. There are SDKs for multiple programming languages, such as [C](https://github.com/Azure/azure-iot-sdk-c), [Node.js](https://github.com/Azure/azure-iot-sdk-node), [Java](https://github.com/Azure/azure-iot-sdk-java), [.NET](https://github.com/Azure/azure-iot-sdk-csharp), and [Python](https://github.com/Azure/azure-iot-sdk-python).

To further simplify how you create the embedded code for your devices, follow the [IoT Plug and Play](../iot-develop/overview-iot-plug-and-play.md) conventions. At the core of IoT Plug and Play, is a *device capability model* schema that describes device capabilities. Use the device capability model to configure a cloud-based solution such as an IoT Central application.

[Azure IoT Edge](../iot-edge/about-iot-edge.md) lets you offload parts of your IoT workload from your Azure cloud services to your devices. IoT Edge can reduce latency in your solution, reduce the amount of data your devices exchange with the cloud, and enable off-line scenarios. You can manage IoT Edge devices from IoT Central.

[Azure Sphere](/azure-sphere/product-overview/what-is-azure-sphere) is a secured, high-level application platform with built-in communication and security features for internet-connected devices. It includes a secured microcontroller unit, a custom Linux-based operating system, and a cloud-based security service that provides continuous, renewable security.

### Cloud connectivity

The [Azure IoT Hub](../iot-hub/iot-concepts-and-iot-hub.md) service enables reliable and secure bidirectional communications between millions of IoT devices and a cloud-based solution. [Azure IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md) is a helper service for IoT Hub. The service provides zero-touch, just-in-time provisioning of devices to the right IoT hub without requiring human intervention. These capabilities enable customers to provision millions of devices in a secure and scalable manner.

IoT Hub is a core component, and you can use it to meet IoT implementation challenges such as:

- High-volume device connectivity and management.
- High-volume telemetry ingestion.
- Command and control of devices.
- Device security enforcement.

### Bridge the gap between the physical and digital worlds

[Azure Digital Twins](../digital-twins/overview.md) is an IoT service that enables you to model a physical environment. It uses a spatial intelligence graph to model the relationships between people, spaces, and devices. By corelating data across the digital and physical worlds you can create contextually aware solutions.

IoT Central uses digital twins to synchronize devices and data in the real world with the digital models that enable users to monitor and manage those connected devices.

### Data and analytics

IoT devices typically generate large amounts of time series data, such as temperature readings from sensors. [Azure Time Series Insights](../time-series-insights/time-series-insights-overview.md) can connect to an IoT hub, read the telemetry stream from your devices, store that data, and enable you to query and visualize it.

[Azure Maps](../azure-maps/about-azure-maps.md) is a collection of geospatial services that use fresh mapping data to provide accurate geographic context to web and mobile applications. You can use a REST API, a web-based JavaScript control, or an Android SDK to build your applications.

## Next steps

For a hands-on experience, try one of the quickstarts:

- [Connect your first device to IoT Central](../iot-central/core/quick-deploy-iot-central.md)

- [Send telemetry from a device to an IoT hub](../iot-hub/quickstart-send-telemetry-cli.md)
