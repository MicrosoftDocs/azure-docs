---
title: Introduction to the Azure Internet of Things (IoT)
description: Introduction explaining the fundamentals of Azure IoT and the IoT services, including examples that help illustrate the use of IoT.
author: dominicbetts
ms.service: iot
services: iot
ms.topic: overview
ms.date: 03/24/2023
ms.author: dobett
ms.custom:  [amqp, mqtt]
#Customer intent: As a newcomer to IoT, I want to understand what IoT is, what services are available, and examples of business cases so I can figure out where to start.
---

# What is Azure Internet of Things (IoT)?

The Azure Internet of Things (IoT) is a collection of Microsoft-managed cloud services that let you connect, monitor, and control your IoT assets at scale. In simpler terms, an IoT solution is made up of IoT devices that communicate with cloud services.

The following diagram shows a high-level view of the components in a typical IoT solution. This article focuses on the key groups of components: devices, IoT cloud services, other cloud services, and solution-wide concerns. Other articles in this section provide more detail on each of these components.

:::image type="content" source="media/iot-introduction/iot-architecture.svg" lightbox="media/iot-introduction/iot-architecture.svg" alt-text="Diagram that shows the high-level IoT solution architecture." border="false":::

## IoT devices

An IoT device is typically made up of a circuit board with sensors attached that uses WiFi to connect to the internet. For example:

* A pressure sensor on a remote oil pump.
* Temperature and humidity sensors in an air-conditioning unit.
* An accelerometer in an elevator.
* Presence sensors in a room.

There's a wide variety of devices available from different manufacturers to build your solution. For a list of devices certified to work with Azure IoT Hub, see the [Azure Certified for IoT device catalog](https://devicecatalog.azure.com). For prototyping a microprocessor device, you can use a device such as a [Raspberry Pi](https://www.raspberrypi.org/). The Raspberry Pi lets you attach many different types of sensor. For prototyping a microcontroller device, you can use devices such as the [ESPRESSIF ESP32](../iot-develop/quickstart-devkit-espressif-esp32-freertos-iot-hub.md), [STMicroelectronics B-U585I-IOT02A Discovery kit](../iot-develop/quickstart-devkit-stm-b-u585i-iot-hub.md), [STMicroelectronics B-L4S5I-IOT01A Discovery kit](../iot-develop/quickstart-devkit-stm-b-l4s5i-iot-hub.md), or [NXP MIMXRT1060-EVK Evaluation kit](../iot-develop/quickstart-devkit-nxp-mimxrt1060-evk-iot-hub.md). These boards typically have built-in sensors, such as temperature and accelerometer sensors.

Microsoft provides open-source [Device SDKs](../iot-hub/iot-hub-devguide-sdks.md) that you can use to build the apps that run on your devices.

To learn more, see [IoT device development](iot-overview-device-development.md).

## Connectivity

Typically, IoT devices send telemetry from the sensors to cloud services in your solution. However, other types of communication are possible such as a cloud service sending commands to your devices. The following are some examples of device-to-cloud and cloud-to-device communication:

* A mobile refrigeration truck sends temperature every 5 minutes to an IoT Hub.

* A cloud service sends a command to a device to change the frequency at which it sends telemetry to help diagnose a problem.

* A device sends alerts based on the values read from its sensors. For example, a device monitoring a batch reactor in a chemical plant, sends an alert when the temperature exceeds a certain value.

* Your devices send information to display on a dashboard for viewing by human operators. For example, a control room in a refinery may show the temperature, pressure, and flow volumes in each pipe, enabling operators to monitor the facility.

The [IoT Device SDKs](../iot-hub/iot-hub-devguide-sdks.md) and IoT Hub support common [communication protocols](../iot-hub/iot-hub-devguide-protocols.md) such as HTTP, MQTT, and AMQP.

IoT devices have different characteristics when compared to other clients such as browsers and mobile apps. The device SDKs help you address the challenges of connecting devices securely and reliably to your cloud services.  Specifically, IoT devices:

* Are often embedded systems with no human operator.
* Can be deployed in remote locations, where physical access is expensive.
* May only be reachable through the solution back end.
* May have limited power and processing resources.
* May have intermittent, slow, or expensive network connectivity.
* May need to use proprietary, custom, or industry-specific application protocols.

To learn more, see [Device infrastructure and connectivity](iot-overview-device-connectivity.md).

## Cloud services

In an IoT solution, the cloud services typically:

* Receive telemetry at scale from your devices, and determining how to process and store that data.
* Analyze the telemetry to provide insights, either in real time or after the fact.
* Send commands from the cloud to a specific device.
* Provision devices and controlling which devices can connect to your infrastructure.
* Control the state of your devices and monitoring their activities.
* Manage the firmware installed on your devices.

For example, in a remote monitoring solution for an oil pumping station, the services use telemetry from the pumps to identify anomalous behavior. When a cloud service identifies an anomaly, it can automatically send a command back to the device to take a corrective action. This process generates an automated feedback loop between the device and the cloud that greatly increases the solution efficiency.

Some cloud services, such as IoT Hub and the Device Provisioning Service, are IoT specific. Other cloud services can provide generic services to your solution such as storage and visualizations.

## Solution-wide concerns

Any IoT solution has to address the following solution-wide concerns:

* [Security](iot-security-best-practices.md) including physical security, authentication, authorization, and encryption
* Solution management including deployment and monitoring.
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
