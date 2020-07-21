---
title: Introduction to the Azure Internet of Things (IoT)
description: Introduction explaining the fundamentals of Azure IoT and the IoT services, including examples that help illustrate the use of IoT.
author: dominicbetts
ms.service: iot-fundamentals
services: iot-fundamentals
ms.topic: overview
ms.date: 01/15/2020
ms.author: dobett
ms.custom:  [amqp, mqtt]
#Customer intent: As a newcomer to IoT, I want to understand what IoT is, what services are available, and examples of business cases so I can figure out where to start.
---

# What is Azure Internet of Things (IoT)?

The Azure Internet of Things (IoT) is a collection of Microsoft-managed cloud services that connect, monitor, and control billions of IoT assets. In simpler terms, an IoT solution is made up of one or more IoT devices that communicate with one or more back-end services hosted in the cloud. 

## IoT devices

An IoT device is typically made up of a circuit board with sensors attached that use WiFi to connect to the internet. For example:

* A pressure sensor on a remote oil pump.
* Temperature and humidity sensors in an air-conditioning unit.
* An accelerometer in an elevator.
* Presence sensors in a room.

There's a wide variety of devices available from different manufacturers to build your solution. For a list of devices certified to work with Azure IoT Hub, see the [Azure Certified for IoT device catalog](https://catalog.azureiotsolutions.com/alldevices). For prototyping, you can use devices such as an [MXChip IoT DevKit](https://microsoft.github.io/azure-iot-developer-kit/) or a [Raspberry Pi](https://www.raspberrypi.org/). The Devkit has built-in sensors for temperature, pressure, humidity, and a gyroscope, accelerometer, and magnetometer. The Raspberry Pi lets you attach many different types of sensor. 

Microsoft provides open-source [Device SDKs](../iot-hub/iot-hub-devguide-sdks.md) that you can use to build the apps that run on your devices. These [SDKs simplify and accelerate](https://azure.microsoft.com/blog/benefits-of-using-the-azure-iot-sdks-in-your-azure-iot-solution/) the development of your IoT solutions.

## Communication

Typically, IoT devices send telemetry from the sensors to back-end services in the cloud. However, other types of communication are possible such as a back-end service sending commands to your devices. The following are some examples of device-to-cloud and cloud-to-device communication:

* A mobile refrigeration truck sends temperature every 5 minutes to an IoT Hub. 

* The back-end service sends a command to a device to change the frequency at which it sends telemetry to help diagnose a problem. 

* A device sends alerts based on the values read from its sensors. For example, a device monitoring a batch reactor in a chemical plant, sends an alert when the temperature exceeds a certain value.

* Your devices send information to display on a dashboard for viewing by human operators. For example, a control room in a refinery may show the temperature, pressure, and flow volumes in each pipe, enabling operators to monitor the facility. 

The [IoT Device SDKs](../iot-hub/iot-hub-devguide-sdks.md) and IoT Hub support common [communication protocols](../iot-hub/iot-hub-devguide-protocols.md) such as HTTP, MQTT, and AMQP.

IoT devices have different characteristics when compared to other clients such as browsers and mobile apps. The device SDKs help you address the challenges of connecting devices securely and reliably to your back-end service.  Specifically, IoT devices:

* Are often embedded systems with no human operator (unlike a phone).
* Can be deployed in remote locations, where physical access is expensive.
* May only be reachable through the solution back end.
* May have limited power and processing resources.
* May have intermittent, slow, or expensive network connectivity.
* May need to use proprietary, custom, or industry-specific application protocols.

## Back-end services 

In an IoT solution, the back-end service provides functionality such as:

* Receiving telemetry at scale from your devices, and determining how to process and store that data.
* Analyzing the telemetry to provide insights, either in real time or after the fact.
* Sending commands from the cloud to a specific device. 
* Provisioning devices and controlling which devices can connect to your infrastructure.
* Controlling the state of your devices and monitoring their activities.
* Managing the firmware installed on your devices.

For example, in a remote monitoring solution for an oil pumping station, the cloud back end uses telemetry from the pumps to identify anomalous behavior. When the back-end service identifies an anomaly, it can automatically send a command back to the device to take a corrective action. This process generates an automated feedback loop between the device and the cloud that greatly increases the solution efficiency.

## Azure IoT examples

For real-life examples of how organizations use Azure IoT, see [Microsoft Technical Case Studies for IoT](https://microsoft.github.io/techcasestudies/#technology=IoT&sortBy=featured). 

## Next steps

For some actual business cases and the architecture used, see the [Microsoft Azure IoT Technical Case Studies](https://microsoft.github.io/techcasestudies/#technology=IoT&sortBy=featured).

For some sample projects that you can try out with an IoT DevKit, see the [IoT DevKit Project Catalog](https://microsoft.github.io/azure-iot-developer-kit/docs/projects/). 

For a more comprehensive explanation of the different services and how they're used, see [Azure IoT services and technologies](iot-services-and-technologies.md).

For an in-depth discussion of IoT architecture, see the [Microsoft Azure IoT Reference Architecture](https://aka.ms/iotrefarchitecture).
