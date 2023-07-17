---
title: Introduction to the Azure Internet of Things (IoT)
description: Introduction explaining the fundamentals of Azure IoT and the IoT services, including examples that help illustrate the use of IoT.
author: dominicbetts
ms.service: iot
services: iot
ms.topic: overview
ms.date: 05/02/2023
ms.author: dobett
ms.custom:  [amqp, mqtt]
#Customer intent: As a newcomer to IoT, I want to understand what IoT is, what services are available, and examples of business cases so I can figure out where to start.
---

# What is Azure Internet of Things (IoT)?

The Azure Internet of Things (IoT) is a collection of Microsoft-managed cloud services, edge components, and SDKs that let you connect, monitor, and control your IoT assets at scale. In simpler terms, an IoT solution is made up of IoT devices that communicate with cloud services.

The following diagram shows a high-level view of the components in a typical IoT solution. This article focuses on the key groups of components: devices, IoT cloud services, other cloud services, and solution-wide concerns. Other articles in this section provide more detail on each of these components.

:::image type="content" source="media/iot-introduction/iot-architecture.svg" alt-text="Diagram that shows the high-level IoT solution architecture." border="false":::

## Solution options

To build an IoT solution for your business, you typically evaluate your solution by using the *managed app platform* approach. You can build your enterprise solution by using either the *platform services* or the *managed app platform* approach.

A managed app platform lets you quickly evaluate your IoT solution by reducing the number of decisions needed to achieve results. The managed app platform takes care of most infrastructure elements in your solution, letting you focus on adding industry knowledge and evaluating the solution. Azure IoT Central is a managed app platform.

Platform services provide all the building blocks for customized and flexible IoT applications. You have more options to choose and code when you connect your devices, and ingest, store, and analyze your data. Azure IoT platform services include Azure IoT Hub, Device Provisioning Service, and Azure Digital Twins. Other platform services that may be part of your IoT solution include Azure Data Explorer, Azure Storage platform, and Azure Functions.

| Managed app platform | Platform services |
|----------------------|-------------------|
| Take advantage of a platform that handles the security and management of your IoT applications and devices. | Have full control over the underlying services in your solution. For example: </br> Scaling and securing services to meet your needs. </br> Using in-house or partner expertise to onboard devices and provision services. |
| Customize branding, dashboards, user roles, devices, and telemetry. However, you can't customize the underlying IoT services. | Fully customize and control your IoT solution. |
| Has a simple, predictable pricing structure. | Let you fine-tune services to control overall costs. |
| Solution can be a single Azure service. | Solution is a collection of Azure services such as Azure IoT Hub, Device Provisioning Service, Azure Digital Twins, Azure Data Explorer, Azure Storage platform, and Azure Function. |

To learn more, see [What Azure technologies and services can you use to create IoT solutions?](iot-services-and-technologies.md).

## IoT devices

An IoT device is typically made up of a circuit board with sensors attached that uses WiFi to connect to the internet. For example:

* A pressure sensor on a remote oil pump.
* Temperature and humidity sensors in an air-conditioning unit.
* An accelerometer in an elevator.
* Presence sensors in a room.

There's a wide variety of devices available from different manufacturers to build your solution. For a list of devices certified to work with Azure IoT Hub, see the [Azure Certified for IoT device catalog](https://devicecatalog.azure.com). For prototyping a microprocessor device, you can use a device such as a [Raspberry Pi](https://www.raspberrypi.org/). The Raspberry Pi lets you attach many different types of sensor. For prototyping a microcontroller device, you can use devices such as the [ESPRESSIF ESP32](../iot-develop/quickstart-devkit-espressif-esp32-freertos-iot-hub.md), [STMicroelectronics B-U585I-IOT02A Discovery kit](../iot-develop/quickstart-devkit-stm-b-u585i-iot-hub.md), [STMicroelectronics B-L4S5I-IOT01A Discovery kit](../iot-develop/quickstart-devkit-stm-b-l4s5i-iot-hub.md), or [NXP MIMXRT1060-EVK Evaluation kit](../iot-develop/quickstart-devkit-nxp-mimxrt1060-evk-iot-hub.md). These boards typically have built-in sensors, such as temperature and accelerometer sensors.

Microsoft provides open-source [Device SDKs](../iot-hub/iot-hub-devguide-sdks.md) that you can use to build the apps that run on your devices.

> [!IMPORTANT]
> Because IoT Central uses IoT Hub internally, any device that can connect to an IoT Central application can also connect to an IoT hub.

To learn more about the devices in your IoT solution, see [IoT device development](iot-overview-device-development.md).

## Connectivity

Typically, IoT devices send telemetry from their attached sensors to cloud services in your solution. However, other types of communication are possible such as a cloud service sending commands to your devices. The following are examples of device-to-cloud and cloud-to-device communication:

* A mobile refrigeration truck sends temperature every 5 minutes to an IoT Hub.

* A cloud service sends a command to a device to change the frequency at which it sends telemetry to help diagnose a problem.

* A device monitoring a batch reactor in a chemical plant sends an alert when the temperature exceeds a certain value.

* A thermostat reports the maximum temperature the device has reached since the last reboot.

* A cloud service sets the target temperature for a thermostat device.

The [IoT Device SDKs](../iot-hub/iot-hub-devguide-sdks.md) and IoT Hub support common [communication protocols](../iot-hub/iot-hub-devguide-protocols.md) such as HTTP, MQTT, and AMQP for device-to-cloud and cloud-to-device communication. In some scenarios, you may need a gateway to connect your IoT devices to your cloud services.

IoT devices have different characteristics when compared to other clients such as browsers and mobile apps. Specifically, IoT devices:

* Are often embedded systems with no human operator.
* Can be deployed in remote locations, where physical access is expensive.
* May only be reachable through the solution back end.
* May have limited power and processing resources.
* May have intermittent, slow, or expensive network connectivity.
* May need to use proprietary, custom, or industry-specific application protocols.

The device SDKs help you address the challenges of connecting devices securely and reliably to your cloud services.

To learn more device connectivity and gateways, see [Device infrastructure and connectivity](iot-overview-device-connectivity.md).

## Cloud services

In an IoT solution, the cloud services typically:

* Receive telemetry at scale from your devices, and determine how to process and store that data.
* Analyze the telemetry to provide insights, either in real time or after the fact.
* Send commands from the cloud to specific devices.
* Provision devices and control which devices can connect to your infrastructure.
* Control the state of your devices and monitor their activities.
* Manage the firmware installed on your devices.

For example, in a remote monitoring solution for an oil pumping station, the services use telemetry from the pumps to identify anomalous behavior. When a cloud service identifies an anomaly, it can automatically send a command to the device to take a corrective action. This process implements an automated feedback loop between the device and the cloud that greatly increases the solution efficiency.

Some cloud services, such as IoT Hub and the Device Provisioning Service, are IoT specific. Other cloud services, such as storage and visualization, provide generic services to your solution.

To learn more, see:

- [Device management and control](iot-overview-device-management.md)
- [Message processing in an IoT solution](iot-overview-message-processing.md)
- [Extend your IoT solution](iot-overview-solution-extensibility.md)
- [Analyze and visualize your IoT data](iot-overview-analyze-visualize.md)

## Solution-wide concerns

Any IoT solution must address the following solution-wide concerns:

* [Security](iot-overview-security.md) including physical security, authentication, authorization, and encryption
* [Solution management](iot-overview-solution-management.md) including deployment and monitoring.
* High availability and disaster recovery for all the components in your solution.
* Scalability for all the services in your solution.

## Next steps

Suggested next steps to explore Azure IoT further include:

* [IoT device development](iot-overview-device-development.md)
* [Device infrastructure and connectivity](iot-overview-device-connectivity.md)
* [Azure IoT services and technologies](iot-services-and-technologies.md).

To learn more about Azure IoT architecture, see:

* [Well-architected framework: overview of IoT workloads](/azure/architecture/framework/iot/iot-overview)
* [Azure IoT reference architecture](/azure/architecture/reference-architectures/iot)
* [Industry specific Azure IoT reference architectures](/azure/architecture/reference-architectures/iot/industry-iot-hub-page)
