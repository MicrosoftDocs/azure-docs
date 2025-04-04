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

A **cloud-based solution** is an integrated set of IoT devices, components, and services, that addresses a business need and that connects devices directly to the cloud. An example of a cloud-based solution is a fleet of delivery trucks that send sensor data to the cloud for analysis and visualization:

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

You can build edge-based solutions with [Azure IoT Operations](../iot-operations/overview-iot-operations.md) or [Azure IoT Edge](../iot-edge/about-iot-edge.md). Azure IoT Operations is a new offering that follows Microsoft's [adaptive cloud approach](#solution-management) to integrate cloud and edge components.

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

To learn more about the devices in your IoT solution, see [IoT asset and device development](iot-overview-device-development.md).

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

Typically, IoT devices send data from their attached sensors to cloud services in your solution. However, other types of communication are possible such as a cloud service sending commands to your devices. The following are examples of device-to-cloud and cloud-to-device communication:

- A mobile refrigeration truck sends temperature every 5 minutes to an IoT Hub.
- A cloud service sends a command to a device to change the frequency at which it sends sensor data to help diagnose a problem.

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

To learn more about processing messages sent from your assets and devices, see [Message processing in an IoT solution](iot-overview-message-processing.md).

### Device and asset comparisons

The following table summarizes current options for assets, devices, and connectivity:

| Current offerings (GA)          | Cloud-based solution | Edge-based solution |
|---------------------------------|----------------------|---------------------|
| Connected object types          | IoT devices                                          | IoT devices, and assets (a broader set of physical or virtual entities that includes IoT devices)                                     |
| Device connectivity protocols   | HTTP, AMQP, MQTT v3.1.1                              | HTTP, AMQP, MQTT v3.1.1, MQTT v5. In [Azure IoT Operations](../iot-operations/overview-iot-operations.md), connectors enable other protocols. Azure IoT Operations includes connector for OPC UA, media connector, and connector for ONVIF. Custom connectors are possible.                          |
| Device implementation           | Microsoft Azure IoT [device SDKs](iot-sdks.md#device-sdks) and [embedded device SDKs](iot-sdks.md#embedded-device-sdks)   | Microsoft Azure IoT [device SDKs](iot-sdks.md#device-sdks) and [embedded device SDKs](iot-sdks.md#embedded-device-sdks) |
| Device management               | [IoT DPS](../iot-dps/index.yml), [Device Update](../iot-hub-device-update/index.yml), [IoT Central](../iot-central/index.yml)  | In Azure IoT Operations, use [Azure Device Registry](../iot-operations/discover-manage-assets/overview-manage-assets.md). Use Akri to enable automated asset/device discovery with native protocols. <br><br> In [IoT Edge](../iot-edge/index.yml), use [IoT DPS](../iot-dps/index.yml) for large-scale device management.|

## Services and applications

In a cloud-based solution, IoT-specific cloud services provide the infrastructure to connect, monitor, and control your devices. In an edge-based solution, the edge runtime environment hosts the services to connect, monitor, and control your assets. Other cloud services provide generic services such as storage, analysis, and visualizations to your solution.

### IoT cloud services

In a cloud-based IoT solution, the IoT cloud services typically:

- Receive sensor data at scale from your devices, and determine how to process and store that data.
- Send commands from the cloud to specific devices.
- Provision devices and control which devices can connect to your infrastructure.
- Control the state of your devices and monitor their activities.
- Manage the firmware installed on your devices.

For example, in a remote monitoring solution for an oil pumping station, the services use sensor data from the pumps to identify anomalous behavior. When a cloud service identifies an anomaly, it can automatically send a command to the device to take a corrective action. This process implements an automated feedback loop between the device and the cloud that greatly increases the solution efficiency.

To learn more about key concepts around managing and controlling assets and devices, see [IoT asset and device management and control](iot-overview-device-management.md).

### Edge runtime

In an edge-based IoT solution, the on-premises services hosted in the edge runtime environment typically:

- Manage the connectivity to your assets through the southbound connectors
- Receive data at scale from your assets, and determine where to route the messages for further processing.
- Forward commands from the cloud to specific assets.
- Perform some local message processing. In Azure IoT Operations, this processing takes place in the northbound connectors

### Other cloud services

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

### IoT services comparisons

The following table summarizes current service and edge application options:

| Current offerings (GA)    | Cloud-based solution | Edge-based solution |
|---------------------------|----------------------|---------------------|
| Services                  | [IoT Hub](../iot-hub/index.yml), [IoT DPS](../iot-dps/index.yml), [IoT Hub Device Update](../iot-hub-device-update/index.yml), [Azure Digital Twins](../digital-twins/index.yml) | [Azure IoT Operations](../iot-operations/overview-iot-operations.md), with [Azure Device Registry](../iot-operations/discover-manage-assets/overview-manage-assets.md). <br><br> You can also use [IoT Edge](../iot-edge/index.yml).  |
| Edge applications options | None                                                  | With [Azure IoT Operations](../iot-operations/overview-iot-operations.md), you can use [DAPR](../iot-operations/create-edge-apps/howto-deploy-dapr.md) (distributed application runtime apps). <br><br> With [IoT Edge](../iot-edge/index.yml), you can use IoT Edge modules.           |

### Deployment comparisons

The following table summarizes current deployment options:

| Current offerings (GA) | Cloud-based solution | Edge-based solution |
|------------------------|----------------------|---------------------|
| Topology               | Devices connect directly to cloud messaging services such as [IoT Hub](../iot-hub/index.yml). Managed in the cloud using Azure Resource Manager (ARM) or [IoT Hub service SDKs](iot-sdks.md#iot-hub-service-sdks).  | [Azure IoT Operations](../iot-operations/overview-iot-operations.md) provides a way to connect assets to an on-premises Kubernetes cluster. Assets connect to the Azure IoT Operations MQTT broker, either directly over standard networking protocols, or through intermediate devices. Managed in the cloud using Azure Arc-enabled services. <br><br> You can also use [IoT Edge](../iot-edge/index.yml).  IoT Edge is a device-focused runtime that enables you to deploy, run, and monitor containerized Linux workloads at the edge, bringing analytics closer to your devices for faster insights and offline decision-making. IoT Edge is a feature of [IoT Hub](../iot-hub/index.yml). |
| Infrastructure         | Cloud services like [IoT Hub](../iot-hub/index.yml), and standard computing devices that contain a CPU/MPU, or constrained and embedded devices that contain an MCU. | [Azure IoT Operations](../iot-operations/overview-iot-operations.md), which runs on a Kubernetes cluster, and assets or devices that connect to the cluster. <br><br> You can also use [IoT Edge](../iot-edge/index.yml), which runs on a gateway device like a Raspberry Pi or an industrial PC, and devices that connect to the gateway device.<br><br> Devices that connect to Azure IoT Operations or IoT Edge, can include standard computing devices that contain a CPU/MPU, or constrained and embedded devices that contain an MCU. |

## Solution-wide concerns

Any IoT solution must address the following solution-wide concerns:

- [Solution management](iot-overview-solution-management.md) including deployment and monitoring.
- [Security](iot-overview-security.md) including physical security, authentication, authorization, and encryption.
- [Scalability, high availability and disaster recovery](iot-overview-scalability-high-availability.md) for all the components in your solution.

### Solution management

The [adaptive cloud](/azure/adaptive-cloud/) approach unifies siloed teams, distributed sites, and disparate systems into a single operations, security, application, and data model. This approach enables you to use the same cloud and AI technologies to manage and monitor edge-based, cloud-based, and hybrid IoT solutions.

Solutions based on IoT Hub, IoT Central, and IoT Edge offer limited support for an adaptive cloud approach. Although IoT Hub, IoT Central, and IoT Edge instances are themselves Azure resources, they don't natively expose capabilities, such as device management and data transformation, as resources you can manage as standard Azure resources.

In contrast, solutions based on Azure IoT Operations provide a unified management experience for all the components in your solution. Azure IoT Operations uses Azure Arc-enabled services to manage and monitor your edge-based solution as if it were a cloud-based solution. For example, assets and data transformations running on the edge are exposed as cloud resources in Azure. This approach enables you to use standard Azure technologies to manage and monitor your entire edge-based solution.

### Security comparisons

The following table summarizes current security options:

| Current offerings (GA)  | Cloud-based solution | Edge-based solution |
|-------------------------|----------------------|---------------------|
| Authentication          | Shared Access Signatures (SAS), X.509                                                                         | [Azure IoT Operations](../iot-operations/overview-iot-operations.md) uses [User-assigned and system-assigned managed identities](/entra/identity/managed-identities-azure-resources/overview), Service Account Tokens (SAT), SAS and X.509 for on-cluster authentication. <br><br> [IoT Edge](../iot-edge/index.yml) uses [certificate-based authentication](../iot-edge/iot-edge-certs.md). |
| Authorization           | Proprietary within current service offerings like [IoT Hub](../iot-hub/index.yml)  | [Azure IoT Operations](../iot-operations/overview-iot-operations.md) uses [Microsoft Entra ID](/entra/fundamentals/whatis) identity for role-based access control (RBAC). <br><br> [IoT Edge](../iot-edge/index.yml) uses a proprietary authorization scheme that communicates with [IoT Hub](../iot-hub/index.yml) but handles authorization locally. |

## Next steps

Suggested next steps to explore Azure IoT further include:

- [IoT asset and device development](iot-overview-device-development.md)
- [Message processing in an IoT solution](iot-overview-message-processing.md)
- [Manage your IoT solution](iot-overview-solution-management.md)
- [Choose an Azure IoT service](iot-services-and-technologies.md)

To learn more about Azure IoT architectures, see:

- [Architecture best practices for Azure IoT Hub](/azure/well-architected/service-guides/azure-iot-hub)
- [IoT Architectures in Azure Architecture Center](/azure/architecture/browse/?terms=iot)