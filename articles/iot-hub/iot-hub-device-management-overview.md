---
title: Device management with Azure IoT Hub | Microsoft Docs
description: 'Overview of device management in Azure IoT Hub: enterprise device lifecycle and device management patterns such as, reboot, factory reset, firmware update, configuration, device twins, queries, jobs.'
services: iot-hub
documentationcenter: ''
author: bzurcher
manager: timlt
editor: ''

ms.assetid: a367e715-55f6-4593-bd68-7863cbf0eb81
ms.service: iot-hub
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/09/2017
ms.author: briz

---
# Overview of device management with IoT Hub
## Introduction
Azure IoT Hub provides the features and an extensibility model that enable device and back-end developers to build robust device management solutions. Devices range from constrained sensors and single purpose microcontrollers, to powerful gateways that route communications for groups of devices.  In addition, the use cases and requirements for IoT operators vary significantly across industries.  Despite this variation, device management with IoT Hub provides the capabilities, patterns, and code libraries to cater to a diverse set of devices and end users.

A crucial part of creating a successful enterprise IoT solution is to provide a strategy for how operators handle the ongoing management of their collection of devices. IoT operators require simple and reliable tools and applications that enable them to focus on the more strategic aspects of their jobs. This article provides:

* A brief overview of Azure IoT Hub approach to device management.
* A description of common device management principles.
* A description of the device lifecycle.
* An overview of common device management patterns.

## Device management principles
IoT brings with it a unique set of device management challenges and every enterprise-class solution must address the following principles:

![Device management principles graphic][img-dm_principles]

* **Scale and automation**: IoT solutions require simple tools that can automate routine tasks and enable a relatively small operations staff to manage millions of devices. Day-to-day, operators expect to handle device operations remotely, in bulk, and to only be alerted when issues arise that require their direct attention.
* **Openness and compatibility**: The device ecosystem is extraordinarily diverse. Management tools must be tailored to accommodate a multitude of device classes, platforms, and protocols. Operators must be able to support many types of devices, from the most constrained embedded single-process chips, to powerful and fully functional computers.
* **Context awareness**: IoT environments are dynamic and ever-changing. Service reliability is paramount. Device management operations must take into account the following factors to ensure that maintenance downtime doesn't affect critical business operations or create dangerous conditions:
    * SLA maintenance windows
    * Network and power states
    * In-use conditions
    * Device geolocation
* **Service many roles**: Support for the unique workflows and processes of IoT operations roles is crucial. The operations staff must work harmoniously with the given constraints of internal IT departments.  They must also find sustainable ways to surface realtime device operations information to supervisors and other business managerial roles.

## Device lifecycle
There is a set of general device management stages that are common to all enterprise IoT projects. In Azure IoT, there are five stages within the device lifecycle:

![The five Azure IoT device lifecycle phases: plan, provision, configure, monitor, retire][img-device_lifecycle]

Within each of these five stages, there are several device operator requirements that should be fulfilled to provide a complete solution:

* **Plan**: Enable operators to create a device metadata scheme that enables them to easily and accurately query for, and target a group of devices for bulk management operations. You can use the device twin to store this device metadata in the form of tags and properties.
  
    *Further reading*: [Get started with device twins][lnk-twins-getstarted], [Understand device twins][lnk-twins-devguide], [How to use device twin properties][lnk-twin-properties].
* **Provision**: Securely provision new devices to IoT Hub and enable operators to immediately discover device capabilities.  Use the IoT Hub identity registry to create flexible device identities and credentials, and perform this operation in bulk by using a job. Build devices to report their capabilities and conditions through device properties in the device twin.
  
    *Further reading*: [Manage device identities][lnk-identity-registry], [Bulk management of device identities][lnk-bulk-identity], [How to use device twin properties][lnk-twin-properties].
* **Configure**: Facilitate bulk configuration changes and firmware updates to devices while maintaining both health and security. Perform these device management operations in bulk by using desired properties or with direct methods and broadcast jobs.
  
    *Further reading*:  [Use direct methods][lnk-c2d-methods], [Invoke a direct method on a device][lnk-methods-devguide], [How to use device twin properties][lnk-twin-properties], [Schedule and broadcast jobs][lnk-jobs], [Schedule jobs on multiple devices][lnk-jobs-devguide].
* **Monitor**: Monitor overall device collection health, the status of ongoing operations, and alert operators to issues that might require their attention.  Apply the device twin to allow devices to report realtime operating conditions and status of update operations. Build powerful dashboard reports that surface the most immediate issues by using device twin queries.
  
    *Further reading*: [How to use device twin properties][lnk-twin-properties], [IoT Hub query language for device twins, jobs, and message routing][lnk-query-language].
* **Retire**:  Replace or decommission devices after a failure, upgrade cycle, or at the end of the service lifetime.  Use the device twin to maintain device info if the physical device is being replaced, or archived if being retired. Use the IoT Hub identity registry for securely revoking device identities and credentials.
  
    *Further reading*: [How to use device twin properties][lnk-twin-properties], [Manage device identities][lnk-identity-registry].

## Device management patterns
IoT Hub enables the following set of device management patterns.  The [device management tutorials][lnk-get-started] show you in more detail how to extend these patterns to fit your exact scenario and how to design new patterns based on these core templates.

* **Reboot** - The back-end app informs the device through a direct method that it has initiated a reboot.  The device uses the reported properties to update the reboot status of the device.
  
    ![Device management reboot pattern graphic][img-reboot_pattern]
* **Factory Reset** - The back-end app informs the device through a direct method that it has initiated a factory reset.  The device uses the reported properties to update the factory reset status of the device.
  
    ![Device management factory reset pattern graphic][img-facreset_pattern]
* **Configuration** - The back-end app uses the desired properties to configure software running on the device.  The device uses the reported properties to update configuration status of the device.
  
    ![Device management configuration pattern graphic][img-config_pattern]
* **Firmware Update** - The back-end app informs the device through a direct method that it has initiated a firmware update.  The device initiates a multistep process to download the firmware image, apply the firmware image, and finally reconnect to the IoT Hub service.  Throughout the multistep process, the device uses the reported properties to update the progress and status of the device.
  
    ![Device management firmware update pattern graphic][img-fwupdate_pattern]
* **Reporting progress and status** - The solution back end runs device twin queries, across a set of devices, to report on the status and progress of actions running on the devices.
  
    ![Device management reporting progress and status pattern graphic][img-report_progress_pattern]

## Next Steps
The capabilities, patterns, and code libraries that IoT Hub provides for device management, enable you to create IoT applications that fulfill enterprise IoT operator requirements within in each device lifecycle stage.

To continue learning about the device management features in IoT Hub, see the [Get started with device management][lnk-get-started] tutorial.

<!-- Images and links -->
[img-dm_principles]: media/iot-hub-device-management-overview/image4.png
[img-device_lifecycle]: media/iot-hub-device-management-overview/image5.png
[img-config_pattern]: media/iot-hub-device-management-overview/configuration-pattern.png
[img-facreset_pattern]: media/iot-hub-device-management-overview/facreset-pattern.png
[img-fwupdate_pattern]: media/iot-hub-device-management-overview/fwupdate-pattern.png
[img-reboot_pattern]: media/iot-hub-device-management-overview/reboot-pattern.png
[img-report_progress_pattern]: media/iot-hub-device-management-overview/report-progress-pattern.png

[lnk-twins-devguide]: iot-hub-devguide-device-twins.md
[lnk-get-started]: iot-hub-node-node-device-management-get-started.md
[lnk-twins-getstarted]: iot-hub-node-node-twin-getstarted.md
[lnk-twin-properties]: iot-hub-node-node-twin-how-to-configure.md
[lnk-hub-getstarted]: iot-hub-csharp-csharp-getstarted.md
[lnk-identity-registry]: iot-hub-devguide-identity-registry.md
[lnk-bulk-identity]: iot-hub-bulk-identity-mgmt.md
[lnk-query-language]: iot-hub-devguide-query-language.md
[lnk-c2d-methods]: iot-hub-node-node-direct-methods.md
[lnk-methods-devguide]: iot-hub-devguide-direct-methods.md
[lnk-jobs]: iot-hub-node-node-schedule-jobs.md
[lnk-jobs-devguide]: iot-hub-devguide-jobs.md
