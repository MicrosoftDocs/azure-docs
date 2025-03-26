---
title: Introduction to the Azure Internet of Things (IoT)
description: Introduction explaining the fundamentals of Azure IoT and the IoT services, including examples that help illustrate the use of IoT, and how they relate to adaptive cloud.
author: dominicbetts
ms.service: azure-iot
services: iot
ms.topic: overview
ms.date: 03/26/2025
ms.author: dobett
#Customer intent: As a newcomer to IoT, I want to understand what IoT is, what services are available, and examples of business cases so I can figure out where to start.
---

# What is Azure Internet of Things (IoT)?

The Azure Internet of Things (IoT) is a collection of Microsoft-managed cloud services, edge components, and SDKs that let you connect, monitor, and control your IoT devices and assets at scale. In simpler terms, an IoT solution is made up of IoT devices or assets that communicate with cloud services.

A key decision when you design an IoT solution is whether to use a cloud-based or edge-based solution:

- In a cloud-based solution, your IoT devices connect directly to the cloud where their messages are processed and analyzed. You monitor and control your devices directly from the cloud.
- In an edge-based solution, your IoT assets connect to an edge environment that processes their messages before forwarding them to the cloud for storage and analysis. You typically monitor and control your assets from the cloud, through the edge runtime environment. It's also possible to monitor and control your assets directly from the edge.

The following sections give a high-level view of the components in typical cloud-based and edge-based IoT solutions. This article focuses on the key groups of components: devices, assets, IoT cloud services, edge runtime environment, other cloud services, and solution-wide concerns. Other articles in this section provide more detail on each of these components.

## Cloud-based solution

A **cloud-based solution** is an integrated set of IoT devices, components, and services, that addresses a business need and that connects devices directly to the cloud. An example of a cloud-based solution is a fleet of delivery trucks that send telemetry data to the cloud for analysis and visualization:

<!-- Art Library Source# ConceptArt-0-000-025 -->

:::image type="content" source="media/iot-introduction/iot-cloud-architecture.svg" alt-text="Diagram that shows the high-level IoT solution architecture for cloud-based solutions." border="false":::

You can build cloud-based solutions with services such as [IoT Hub](../iot-hub/iot-concepts-and-iot-hub.md), [Device Provisioning Service](../iot-dps/about-iot-dps.md), and [Azure Digital Twins](../digital-twins/overview.md).

## Edge-based solution

An **edge-based solution** is an integrated set of IoT assets, components, and services, that meets a business need and that connects assets to nearby edge services. An example of an edge-based solution is a factory where your industrial IoT assets connect to on-premises services because either:

- The assets communicate using local network protocols such as OPC UA.
- Security concerns mean that you mustn't connect the assets directly to the public internet.

An edge-based solution can still forward data from your assets to the cloud for further processing such as analysis and visualization:

<!-- Art Library Source# ConceptArt-0-000-025 -->

:::image type="content" source="media/iot-introduction/iot-edge-architecture.svg" alt-text="Diagram that shows the high-level IoT solution architecture for edge-based solutions." border="false":::

You can build edge-based solutions with [Azure IoT Operations](../iot-operations/overview-iot-operations.md) or [Azure IoT Edge](../iot-edge/about-iot-edge.md). Azure IoT Operations is a new offering that follows Microsoft's [adaptive cloud approach](iot-services-and-technologies.md#choose-adaptive-cloud) to integrate cloud and edge components.

## Devices, assets, and connectivity

Both cloud-based and edge-based solutions have *devices* or *assets* that collect data from which you want to derive business insights. The following sections describe the devices and assets in an IoT solution, and how they connect to the cloud.

### IoT devices

An IoT device is typically made up of a circuit board with sensors that collect data. IoT devices often connect directly to the internet but in some cases rely on a local gateway for connectivity to the cloud. The following items are examples of IoT devices:

- A pressure sensor on a remote oil pump.
- Temperature and humidity sensors in an air-conditioning unit.
- An accelerometer in an elevator.
- Presence sensors in a room.

There's a wide variety of devices available from different manufacturers to build your solution. For prototyping a microprocessor device, you can use a device such as a [Raspberry Pi](https://www.raspberrypi.org/). The Raspberry Pi lets you attach many different types of sensor. For prototyping a microcontroller device, use devices such as the [ESPRESSIF ESP32](./tutorial-devkit-espressif-esp32-freertos-iot-hub.md), or [STMicroelectronics B-L475E-IOT01A Discovery kit to IoT Hub](tutorial-devkit-stm-b-l475e-iot-hub.md). These boards typically have built-in sensors, such as temperature and accelerometer sensors.

Microsoft provides open-source [Device SDKs](../iot-hub/iot-hub-devguide-sdks.md) that you can use to build the apps that run on your devices.

To learn more about the devices in your IoT solution, see [IoT device development](iot-overview-device-development.md).

### IoT assets

An IoT asset is a broader concept than an IoT device and refers to any item of value that you want to manage, monitor, and collect data from. An asset can be a machine, a device, a software component, an entire system, or a physical object. Assets are typically in a location that you control, such as a factory, and might not be able to connect directly to the public internet. The following items are examples of IoT assets:

- Robotic arms, conveyor belts, and elevators.
- Industrial CNC machines, lathes, saws, and drills.
- Medical diagnostic imaging machines.
- Security video cameras.
- Software or software components
- Programmable logic controllers.
- Buildings.
- Agricultural crops.

In Azure IoT Operations, the term *asset* also refers to the virtual representation of a physical asset. In an Azure IoT Operations deployment, you use [Azure Device Registry](../iot-operations/discover-manage-assets/overview-manage-assets.md) to manage your assets across both Azure and your Kubernetes cluster as a part of the adaptive cloud approach. The Azure Device Registry service stores information about your assets, such as their metadata, and their connection information and enables you to use tools such as Azure Resource Manager to manage them.

### Device connectivity

Typically, IoT devices send telemetry from their attached sensors to cloud services in your solution. However, other types of communication are possible such as a cloud service sending commands to your devices. The following are examples of device-to-cloud and cloud-to-device communication:

- A mobile refrigeration truck sends temperature every 5 minutes to an IoT Hub.

- A cloud service sends a command to a device to change the frequency at which it sends telemetry to help diagnose a problem.

The [IoT Device SDKs](../iot-hub/iot-hub-devguide-sdks.md) and IoT Hub support common [communication protocols](../iot-hub/iot-hub-devguide-protocols.md) such as HTTP, MQTT, and AMQP for device-to-cloud and cloud-to-device communication. In some scenarios, you might need a gateway to connect your IoT devices to your cloud services.

IoT devices have different characteristics when compared to other clients such as browsers and mobile apps. Specifically, IoT devices:

- Are often embedded systems with no human operator.
- Can be deployed in remote locations, where physical access is expensive.
- Might only be reachable through the solution back end.
- Might have limited power and processing resources.
- Might have intermittent, slow, or expensive network connectivity.
- Might need to use proprietary, custom, or industry-specific application protocols.

The device SDKs help you address the challenges of connecting devices securely and reliably to your cloud services.

To learn more about device connectivity and gateways, see [IoT asset and device connectivity and infrastructure](iot-overview-device-connectivity.md).

### Connectivity in an edge-based solution

In an edge-based solution, IoT assets connect to an edge environment that processes their messages before forwarding them to the cloud for storage and analysis. Assets might use network communication protocols and standards such as:

- [OPC UA](https://opcfoundation.org/about/opc-technologies/opc-ua/) in industrial environments.
- [ONVIF](https://www.onvif.org/) for managing and monitoring video devices.
- [MQTT](https://mqtt.org/) as a standard messaging protocol for IoT assets and devices.

In the edge-based solution diagram shown previously, the *southbound connectors* represent the protocols and standards that assets use to connect to the edge environment.

To learn more about device and asset comparisons, see [Device and asset comparisons](iot-services-and-technologies.md#device-and-asset-comparisons).

## Services and applications

In a cloud-based solution, IoT-specific cloud services provide the infrastructure to connect, monitor, and control your devices. In an edge-based solution, the edge runtime environment hosts the services to connect, monitor, and control your assets. Other cloud services provide generic services such as storage, analysis, and visualizations to your solution.

### IoT cloud services

In a cloud-based IoT solution, the IoT cloud services typically:

- Receive telemetry at scale from your devices, and determine how to process and store that data.
- Send commands from the cloud to specific devices.
- Provision devices and control which devices can connect to your infrastructure.
- Control the state of your devices and monitor their activities.
- Manage the firmware installed on your devices.

For example, in a remote monitoring solution for an oil pumping station, the services use telemetry from the pumps to identify anomalous behavior. When a cloud service identifies an anomaly, it can automatically send a command to the device to take a corrective action. This process implements an automated feedback loop between the device and the cloud that greatly increases the solution efficiency.

To learn more, see:

- [Device management and control](iot-overview-device-management.md)
- [Message processing in an IoT solution](iot-overview-message-processing.md)
- [Extend your IoT solution](iot-overview-solution-extensibility.md)
- [Analyze and visualize your IoT data](iot-overview-analyze-visualize.md)

### Edge runtime

In an edge-based IoT solution, the on-premises services hosted in the edge runtime environment typically:

- Manage the connectivity to your assets through the southbound connectors
- Receive telemetry at scale from your assets, and determine where to route the telemetry for further processing.
- Forward commands from the cloud to specific assets.
- Perform some local message processing. In Azure IoT Operations, this processing takes place in the northbound connectors

### Other cloud services

Both cloud-based and edge-based solutions can use other cloud services to provide more functionality to your solution. For example, you can use:

- Azure storage services to store telemetry data.
- Azure Stream Analytics to process telemetry data in real time.
- Microsoft Fabric to store and analyze telemetry data.
- Microsoft Power BI to visualize telemetry data.

To learn more about IoT services and deployment comparisons, see:

- [IoT services comparisons](iot-services-and-technologies.md#iot-services-comparisons)
- [Deployment comparisons](iot-services-and-technologies.md#deployment-comparisons)

## Solution-wide concerns

Any IoT solution must address the following solution-wide concerns:

- [Solution management](iot-overview-solution-management.md) including deployment and monitoring.
- [Security](iot-overview-security.md) including physical security, authentication, authorization, and encryption.
- [Scalability, high availability and disaster recovery](iot-overview-scalability-high-availability.md) for all the components in your solution.

To learn more about security comparisons, see [Security comparisons](iot-services-and-technologies.md#security-comparisons).

## Next steps

Suggested next steps to explore Azure IoT further include:

- [IoT asset and device development](iot-overview-device-development.md)
- [IoT asset and device connectivity and infrastructure](iot-overview-device-connectivity.md)
- [Choose an Azure IoT service](iot-services-and-technologies.md)

To learn more about Azure IoT architectures, see:

- [Architecture best practices for Azure IoT Hub](/azure/well-architected/service-guides/azure-iot-hub)
- [IoT Architectures in Azure Architecture Center](/azure/architecture/browse/?terms=iot)