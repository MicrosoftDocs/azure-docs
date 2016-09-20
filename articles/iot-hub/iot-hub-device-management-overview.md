<properties
 pageTitle="Device management overview | Microsoft Azure"
 description="Overview of Azure IoT Hub device management"
 services="iot-hub"
 documentationCenter=""
 authors="bzurcher"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="get-started-article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="09/16/2016"
 ms.author="bzurcher"/>

# Overview of Azure IoT Hub device management (preview)

A crucial part of creating a successful IoT solution is to provide a strategy for how operators handle the ongoing management of their device fleet. IoT operators require tools and applications which are both simple and reliable, and enable them to focus on the more strategic aspects of their jobs. Azure IoT Hub provides you with the building blocks to create IoT applications that facilitate the most important device management patterns.

Devices are considered to be managed by IoT Hub when they run a simple application called a device management agent that connects the device securely to the cloud. The agent code enables an operator from the application side to remotely attest device status and perform management operations such as applying network configuration changes or deploying firmware updates.

## IoT device managment principles

IoT brings with it a unique set of management challenges and a solution must account for the following IoT device management principles:

![][img-dm_principles]

- **Scale and automation**: IoT requires simple tools that can automate routine tasks and enable a relatively small operations staff to manage millions of devices. Day-to-day, operators expect to handle device operations remotely, in bulk, and to only be alerted when issues arise that require their direct attention.

- **Openness and compatibility**: The IoT device ecosystem is extraordinarily diverse. Management tools must be tailored to accommodate a multitude of device classes, platforms, and protocols. Operators must be able to support all devices, from the most constrained embedded single-process chips to powerful and fully functional computers.

- **Context awareness**: IoT environments are dynamic and ever-changing. Reliability of service is paramount. Device management operations must factor in SLA maintenance windows, network and power states, in-use conditions, and device geolocation to ensure that maintenance downtime doesn't affect critical business operations or create dangerous conditions.

- **Service many roles**: Support for the unique workflows and processes of IoT operations roles is crucial. The operations staff must also work harmoniously with the given constraints of internal IT departments, and surface relevant device operations information to supervisors and other management roles.

## IoT device lifecycle and managment patterns

Although IoT projects differ greatly, there is a set of common patterns for managing devices. In Azure IoT, these patterns are identified within the IoT device lifecycle that is comprised of five distinct stages:

![][img-device_lifecycle]

1. **Plan**: Enable operators to create a device property scheme that enables them to easily and accurately query for and target a group of devices for bulk management operations.

    *Related building blocks*: [Getting started with device twins][lnk-twins-getstarted], [How to use twin properties][lnk-twin-properties]

2. **Provision**: Securely authenticate new devices to IoT hub and enable operators to immediately discover device capabilities and current state.

    *Related building blocks*: [Getting started with IoT Hub][lnk-hub-getstarted], [How to use twin properties][lnk-twin-properties]

3. **Configure**: Facilitate bulk configuration changes and firmware updates to devices while maintaining both health and security.

    *Related building blocks*: [How to use twin properties][lnk-twin-properties], [C2D Methods][lnk-c2d-methods], [Schedule/Broadcast Jobs][lnk-jobs]

4. **Monitor**: Monitor overall device fleet health and the status of ongoing update rollouts to alert operators to issues that might require their attention.

    *Related building blocks*: [How to use twin properties][lnk-twin-properties]

5. **Retire**:  Replace or decommission devices after a failure, upgrade cycle, or at the end of the service lifetime.

    *Related building blocks*: ???



## Next Steps

Using the building blocks that Azure IoT Hub provides, developers can create IoT applications which fulfill the unique IoT operator requirements within in each device lifecycle stage.

To continue learning about the Azure IoT Hub device management features, see the [Get started with Azure IoT Hub device management][lnk-get-started] tutorial.

<!-- Images and links -->
[img-dm_principles]: media/iot-hub-device-management-overview/image4.png
[img-device_lifecycle]: media/iot-hub-device-management-overview/image5.png

[lnk-get-started]: iot-hub-device-management-get-started.md
[lnk-twins-getstarted]: iot-hub-device-management-device-twin.md
[lnk-twin-properties]: iot-hub-twin-properties.md
[lnk-hub-getstarted]: iot-hub-csharp-csharp-getstarted.md
[lnk-c2d-methods]: iot-hub-c2d-methods.md
[lnk-jobs]: iot-hub-schedule-jobs.md