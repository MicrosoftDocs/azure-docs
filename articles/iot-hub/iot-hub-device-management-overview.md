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

A crucial part of creating a successful IoT solution is providing a strategy for how operators will handle the ongoing management of their device fleet.  IoT operators require tools and applications which are  both simple and reliable to allow them to focus on the more strategic aspects of their jobs.  Azure IoT Hub is the platform which provides the building blocks necessary to create IoT applications which facilitate the most important device management patterns.

Devices are considered managed by Azure IoT Hub when they run a simple application called a device management agent that connects the device securely to the cloud.  The agent code will allow an operator from the application side to remotely attest device status as well as perform management operations such as applying network configuration changes or deploying firmware updates.

## IoT Device Managment Principles

IoT brings with it a unique set of management challenges and the right solution will account for the following IoT device management principles:

![][img-dm_principles]

- **Scale & Automation** - IoT requires simplistic tools which can automate routine tasks to allow a relatively small operations staff to manage up to millions of device.  Day-to-day, operators expect to handle device operations remotely, in bulk fashion, and to only be alerted when issues arise that require their direct attention.

- **Openness & Compatibility** - The IoT device ecosystem is extraordinarily diverse.  Management tools must be tailored to accommodate a multitude of device classes, platforms, and protocols.  From the most constrained embedded single-process chips to powerful and fully functional computers, operators must be empowered to support them all.

- **Context Awareness** -  IoT environments are dynamic and ever-changing.  Reliability of service is paramount.  Device management operations must factor in SLA maintenance windows, network/power states, in-use conditions, or device geolocation to assure maintenance downtime doesn't affect critical business operations or create dangerous conditions.

- **Service Many Roles** - Support for the unique workflows and processes of IoT operations roles are crucial.  The operations staff must also work harmoniously with certain constraints of internal IT departments as well and surface relevant device operations information to supervisors and other management roles.

## IoT Device Lifecycle and Managment Patterns

Although IoT projects differ greatly, when it comes to managing devices there is a set of patterns which are common for all.  In Azure IoT, these patterns are identified within the IoT Device Lifecycle which is comprised of 5 distinct stages:

![][img-device_lifecycle]

1. **Plan**  
   Enable operators to create a device property scheme which allows them to easily and accurately query for and target a group of devices for bulk management operations.  
   *Related Building Blocks*: Getting started with device twins, How to use twin properties

2. **Provision**  
   Securely authenticate new devices to the Azure IoT hub server and allow operators to immediately discover device capabilities and current state.  
   *Related Building Blocks*: Getting started with IoT Hub (anchor URL to identity section), How to use twin properties

3. **Configure**  
   Facilitate bulk configuration changes and firmware updates to assign the purpose of each device while maintaining both health and security.  
   *Related Building Blocks*:  How to use twin properties (anchor URL to desired), C2D Methods, Schedule/Broadcast Jobs

4. **Monitor**  
    Monitor overall device fleet health and the status of ongoing update campaigns to alert operators to issues which might require their attention.  
    *Related Building Blocks*: How to use twin properties (anchor URL to query state config)

5. **Retire**  
    Replace or decommission devices after a failure, upgrade cycle, or at the end of service lifetime.  
    *Related Building Blocks*: ???



## Next steps

Using the building blocks that Azure IoT Hub provides, developers can create IoT applications which fulfill the unique IoT operator requirements within in each device lifecycle stage.
To continue learning about the Azure IoT Hub device management features, see the [Get started with Azure IoT Hub device management][lnk-get-started] tutorial.

<!-- Images and links -->
[img-dm_principles]: media/iot-hub-device-management-overview/image4.png
[img-device_lifecycle]: media/iot-hub-device-management-overview/image5.png

[lnk-get-started]: iot-hub-device-management-get-started.md
[lnk-tutorial-twin]: iot-hub-device-management-device-twin.md
[lnk-apidocs]: http://azure.github.io/azure-iot-sdks/
[lnk-query-samples]: https://github.com/Azure/azure-iot-sdks/blob/dmpreview/doc/get_started/dm_queries/query-samples.md
[lnk-device-sdks]: https://github.com/Azure/azure-iot-sdks
