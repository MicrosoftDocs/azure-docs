---
title: Introduction to the Azure Internet of Things (IoT)
description: Introduction explaining the fundamentals of Azure IoT and the IoT services, including examples that help illustrate the use of IoT, and how they relate to adaptive cloud.
author: dominicbetts
ms.service: azure-iot
services: iot
ms.topic: overview
ms.date: 11/08/2024
ms.author: dobett
ms.custom:  [amqp, mqtt]
#Customer intent: As a newcomer to IoT, I want to understand what IoT is, what services are available, and examples of business cases so I can figure out where to start.
---

# What is Azure Internet of Things (IoT)?

The Azure Internet of Things (IoT) is a collection of Microsoft-managed cloud services, edge components, and SDKs that let you connect, monitor, and control your IoT devices and assets at scale. In simpler terms, an IoT solution is made up of IoT devices or assets that communicate with cloud services.

A key decision when you design an IoT solution is whether to use a cloud-based or edge-based solution:

- In a cloud-based solution, your IoT devices connect directly to the cloud where their messages are processed and analyzed. You monitor and control your devices directly from the cloud.
- In an edge-based solution, your IoT assets connect to an edge environment that processes their messages before forwarding them to the cloud for storage and analysis. You typically monitor and control your assets from the cloud, through the edge runtime environment. It's also possible to monitor and control your assets directly from the edge.

The following two sections give a high-level view of the components in typical cloud-based and edge-based IoT solutions. This article focuses on the key groups of components: devices, assets, IoT cloud services, edge runtime environment, other cloud services, and solution-wide concerns. Other articles in this section provide more detail on each of these components.

A **cloud-based solution** is an integrated set of IoT devices, components, and services, that addresses a business need and that connects devices directly to the cloud. An example of a cloud-based solution is a fleet of delivery trucks that send telemetry data to the cloud for analysis and visualization:

:::image type="content" source="media/iot-introduction/iot-architecture.svg" alt-text="Diagram that shows the high-level IoT solution architecture for cloud-based solutions." border="false":::

You can build cloud-based solutions with services such as [IoT Hub](../iot-hub/iot-concepts-and-iot-hub.md), [Device Provisioning Service](../iot-dps/about-iot-dps.md), and [Azure Digital Twins](../digital-twins/overview.md).

An **edge-based solution** is an integrated set of IoT assets, components, and services, that meets a business need and that connects assets to nearby edge services. An example of an edge-based solution is a factory where your industrial IoT assets connect to on-premises services because either:

- The assets communicate using local network protocols such as OPC UA.
- Security concerns mean that you mustn't connect the assets directly to the public internet.

An edge-based solution can still forward data from your assets to the cloud for further processing such as analysis and visualization:

:::image type="content" source="media/iot-introduction/iot-architecture-aio.svg" alt-text="Diagram that shows the high-level IoT solution architecture for edge-based solutions." border="false":::

You can build edge-based solutions with [Azure IoT Operations](../iot-operations/overview-iot-operations.md) or [Azure IoT Edge](../iot-edge/about-iot-edge.md). Azure IoT Operations is a new offering that follows Microsoft's [adaptive cloud approach](#solution-management) to integrate cloud and edge components.

To evaluate whether to build an edge-based or cloud-based solution, review the comparisons between the two approaches in the following sections. Each section lists details from current offerings for cloud-based and edge-based solutions.

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

To learn more device connectivity and gateways, see [Device infrastructure and connectivity](iot-overview-device-connectivity.md).

### Connectivity in an edge-based solution

In an edge-based solution, IoT assets connect to an edge environment that processes their messages before forwarding them to the cloud for storage and analysis. Assets might use network communication protocols and standards such as:

- [OPC UA](https://opcfoundation.org/about/opc-technologies/opc-ua/) in industrial environments.
- [ONVIF](https://www.onvif.org/) for managing and monitoring video devices.
- [MQTT](https://mqtt.org/) as a standard messaging protocol for IoT assets and devices.

In the edge-based solution diagram shown previously, the *southbound connectors* represent the protocols and standards that assets use to connect to the edge environment.

### Device and asset comparisons

The following table summarizes current options for assets, devices, and connectivity:

| Current offerings (GA)          | Cloud-based solution | Edge-based solution |
|---------------------------------|----------------------|---------------------|
| Connected object types          | IoT devices                                          | IoT devices, and assets (a broader set of physical or virtual entities that includes IoT devices)                                     |
| Device connectivity protocols   | HTTP, AMQP, MQTT v3.1.1                              | HTTP, AMQP, MQTT v3.1.1, MQTT v5. In [Azure IoT Operations](../iot-operations/overview-iot-operations.md), connectors enable other protocols. Azure IoT Operations includes OPC UA connector, media connector, and ONVIF connector. Custom connectors are possible.                          |
| Device implementation           | Microsoft IoT device SDKs and embedded device SDKs   | Microsoft IoT device SDKs and embedded device SDKs |
| Device management               | [IoT DPS](../iot-dps/index.yml), [Device Update](../iot-hub-device-update/index.yml), [IoT Central](../iot-central/index.yml)  | In Azure IoT Operations, use [Azure Device Registry](../iot-operations/discover-manage-assets/overview-manage-assets.md). Use Akri to enable automated asset/device discovery with native protocols. In [IoT Edge](../iot-edge/index.yml), use [IoT DPS](../iot-dps/index.yml) for large-scale device management.|

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

### IoT services comparisons

The following table summarizes current service and edge application options:

| Current offerings (GA)    | Cloud-based solution | Edge-based solution |
|---------------------------|----------------------|---------------------|
| Services                  | [IoT Hub](../iot-hub/index.yml), [IoT DPS](../iot-dps/index.yml), [IoT Hub Device Update](../iot-hub-device-update/index.yml), [Azure Digital Twins](../digital-twins/index.yml) | [Azure IoT Operations](../iot-operations/overview-iot-operations.md), with [Azure Device Registry](../iot-operations/discover-manage-assets/overview-manage-assets.md). You can also use [IoT Edge](../iot-edge/index.yml).  |
| Edge applications options | None                                                  | [DAPR](../iot-operations/create-edge-apps/howto-deploy-dapr.md) (distributed application runtime apps). With [IoT Edge](../iot-edge/index.yml), you can use IoT Edge modules.           |

### Deployment comparisons

The following table summarizes current deployment options:

| Current offerings (GA) | Cloud-based solution | Edge-based solution |
|------------------------|----------------------|---------------------|
| Topology               | Devices connect directly to cloud messaging services such as [IoT Hub](../iot-hub/index.yml). Managed in the cloud using Azure Resource Manager (ARM) or IoT service SDKs.  | [Azure IoT Operations](../iot-operations/overview-iot-operations.md) provides a way to connect assets to an on-premises Kubernetes cluster. Assets connect to the Azure IoT Operations MQTT broker, either directly over standard networking protocols, or through intermediate devices. Managed in the cloud using Azure Arc-enabled services. You can also use [IoT Edge](../iot-edge/index.yml), which runs on a gateway device like an industrial PC, and provides cloud connectivity for devices by connecting to [IoT Hub](../iot-hub/index.yml). |
| Infrastructure         | Cloud services like [IoT Hub](../iot-hub/index.yml), and standard computing devices that contain a CPU/MPU, or constrained and embedded devices that contain an MCU. | [Azure IoT Operations](../iot-operations/overview-iot-operations.md), which runs on a Kubernetes cluster, and assets or devices that connect to the cluster. You can also use [IoT Edge](../iot-edge/index.yml), which runs on a gateway device like a Raspberry Pi or an industrial PC, and devices that connect to the gateway device. Devices can include standard computing devices that contain a CPU/MPU, or constrained and embedded devices that contain an MCU. |

## Solution-wide concerns

Any IoT solution must address the following solution-wide concerns:

- [Solution management](iot-overview-solution-management.md) including deployment and monitoring.
- [Security](iot-overview-security.md) including physical security, authentication, authorization, and encryption.
- High availability and disaster recovery for all the components in your solution.
- Scalability for all the services in your solution.

### Solution management

The [adaptive cloud approach](/collections/5pq5hojn6xzogr) unifies siloed teams, distributed sites, and disparate systems into a single operations, security, application, and data model. This approach enables you to use the same cloud and AI technologies to manage and monitor edge-based, cloud-based, and hybrid IoT solutions.

Solutions based on IoT Hub, IoT Central, and IoT Edge offer limited support for an adaptive cloud approach. Although IoT Hub, IoT Central, and IoT Edge instances are themselves Azure resources, they don't natively expose capabilities, such as device management and data transformation, as resources you can manage as standard Azure resources.

In contrast, solutions based on Azure IoT Operations provide a unified management experience for all the components in your solution. Azure IoT Operations uses Azure Arc-enabled services to manage and monitor your edge-based solution as if it were a cloud-based solution. For example, assets and data transformations running on the edge are exposed as cloud resources in Azure. This approach enables you to use standard Azure technologies to manage and monitor your entire edge-based solution.

### Security comparisons

The following table summarizes current security options:

| Current offerings (GA)  | Cloud-based solution | Edge-based solution |
|-------------------------|----------------------|---------------------|
| Authentication          | SAS, X.509                                                                         | SAS, X.509, and SAT (security account tokens) for on-cluster authentication |
| Authorization           | Proprietary within current service offerings like [IoT Hub](../iot-hub/index.yml)  | Azure IoT Operations uses [Microsoft Entra ID](/entra/fundamentals/whatis) identity for role-based access control (RBAC). [IoT Edge](../iot-edge/index.yml) uses a proprietary authorization scheme that communicates with [IoT Hub](../iot-hub/index.yml) but handles authorization locally. |

## Next steps

Suggested next steps to explore Azure IoT further include:

- [IoT device development](iot-overview-device-development.md)
- [Device infrastructure and connectivity](iot-overview-device-connectivity.md)
- [Azure IoT services and technologies](iot-services-and-technologies.md)

To learn more about Azure IoT architecture, see:

- [Well-architected framework: overview of IoT workloads](/azure/architecture/framework/iot/iot-overview)
- [Azure IoT reference architecture](/azure/architecture/reference-architectures/iot)
- [Industry specific Azure IoT reference architectures](/azure/architecture/reference-architectures/iot/industry-iot-hub-page)