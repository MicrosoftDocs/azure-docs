---
title: Overview of device management with Azure IoT Hub | Microsoft Docs
description: Overview of device management in Azure IoT Hu -- enterprise device lifecycle and device management patterns such as, reboot, factory reset, firmware update, configuration, device twins, queries, jobs.
author: bzurcher
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 08/24/2017
ms.author: briz
---

# Overview of device management with IoT Hub

Azure IoT Hub provides the features and an extensibility model that enable device and back-end developers to build robust device management solutions. Devices range from constrained sensors and single purpose microcontrollers, to powerful gateways that route communications for groups of devices.  In addition, the use cases and requirements for IoT operators vary significantly across industries.  Despite this variation, device management with IoT Hub provides the capabilities, patterns, and code libraries to cater to a diverse set of devices and end users.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

A crucial part of creating a successful enterprise IoT solution is to provide a strategy for how operators handle the ongoing management of their collection of devices. IoT operators require simple and reliable tools and applications that enable them to focus on the more strategic aspects of their jobs. This article provides:

* A brief overview of Azure IoT Hub approach to device management.
* A description of common device management principles.
* A description of the device lifecycle.
* An overview of common device management patterns.

## Device management principles

IoT brings with it a unique set of device management challenges and every enterprise-class solution must address the following principles:

![Device management principles graphic](media/iot-hub-device-management-overview/image4.png)

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

![The five Azure IoT device lifecycle phases: plan, provision, configure, monitor, retire](./media/iot-hub-device-management-overview/image5.png)

Within each of these five stages, there are several device operator requirements that should be fulfilled to provide a complete solution:

* **Plan**: Enable operators to create a device metadata scheme that enables them to easily and accurately query for, and target a group of devices for bulk management operations. You can use the device twin to store this device metadata in the form of tags and properties.
  
    *Further reading*: 
    * [Get started with device twins](iot-hub-node-node-twin-getstarted.md)
    * [Understand device twins](iot-hub-devguide-device-twins.md)
    * [How to use device twin properties](tutorial-device-twins.md)
    * [Best practices for device configuration within an IoT solution](iot-hub-configuration-best-practices.md)

* **Provision**: Securely provision new devices to IoT Hub and enable operators to immediately discover device capabilities.  Use the IoT Hub identity registry to create flexible device identities and credentials, and perform this operation in bulk by using a job. Build devices to report their capabilities and conditions through device properties in the device twin.
  
    *Further reading*: 
    * [Manage device identities](iot-hub-devguide-identity-registry.md)
    * [Bulk management of device identities](iot-hub-bulk-identity-mgmt.md)
    * [How to use device twin properties](tutorial-device-twins.md)
    * [Best practices for device configuration within an IoT solution](iot-hub-configuration-best-practices.md)
    * [Azure IoT Hub Device Provisioning Service](https://azure.microsoft.com/documentation/services/iot-dps)

* **Configure**: Facilitate bulk configuration changes and firmware updates to devices while maintaining both health and security. Perform these device management operations in bulk by using desired properties or with direct methods and broadcast jobs.
  
    *Further reading*:
    * [How to use device twin properties](tutorial-device-twins.md)
    * [Configure and monitor IoT devices at scale](iot-hub-auto-device-config.md)
    * [Best practices for device configuration within an IoT solution](iot-hub-configuration-best-practices.md)

* **Monitor**: Monitor overall device collection health, the status of ongoing operations, and alert operators to issues that might require their attention.  Apply the device twin to allow devices to report realtime operating conditions and status of update operations. Build powerful dashboard reports that surface the most immediate issues by using device twin queries.
  
    *Further reading*: 
    * [How to use device twin properties](tutorial-device-twins.md)
    * [IoT Hub query language for device twins, jobs, and message routing](iot-hub-devguide-query-language.md)
    * [Configure and monitor IoT devices at scale](iot-hub-auto-device-config.md)
    * [Best practices for device configuration within an IoT solution](iot-hub-configuration-best-practices.md)

* **Retire**: Replace or decommission devices after a failure, upgrade cycle, or at the end of the service lifetime.  Use the device twin to maintain device info if the physical device is being replaced, or archived if being retired. Use the IoT Hub identity registry for securely revoking device identities and credentials.
  
    *Further reading*: 
    * [How to use device twin properties](tutorial-device-twins.md)
    * [Manage device identities](iot-hub-devguide-identity-registry.md)

## Device management patterns

IoT Hub enables the following set of device management patterns. The [device management tutorials](iot-hub-node-node-device-management-get-started.md) show you in more detail how to extend these patterns to fit your exact scenario and how to design new patterns based on these core templates.

* **Reboot**: The back-end app informs the device through a direct method that it has initiated a reboot.  The device uses the reported properties to update the reboot status of the device.
  
    ![Device management reboot pattern graphic](./media/iot-hub-device-management-overview/reboot-pattern.png)

* **Factory Reset**: The back-end app informs the device through a direct method that it has initiated a factory reset. The device uses the reported properties to update the factory reset status of the device.
  
    ![Device management factory reset pattern graphic](./media/iot-hub-device-management-overview/facreset-pattern.png)

* **Configuration**: The back-end app uses the desired properties to configure software running on the device. The device uses the reported properties to update configuration status of the device.
  
    ![Device management configuration pattern graphic](./media/iot-hub-device-management-overview/configuration-pattern.png)

* **Firmware Update**: The back-end app uses an automatic device management configuration to select the devices to receive the update, to tell the devices where to find the update, and to monitor the update process. The device initiates a multistep process to download, verify, and apply the firmware image, and then reboot the device before reconnecting to the IoT Hub service. Throughout the multistep process, the device uses the reported properties to update the progress and status of the device.
  
    ![Device management firmware update pattern graphic](media/iot-hub-device-management-overview/fwupdate-pattern.png)

* **Reporting progress and status**: The solution back end runs device twin queries, across a set of devices, to report on the status and progress of actions running on the devices.
  
    ![Device management reporting progress and status pattern graphic](./media/iot-hub-device-management-overview/report-progress-pattern.png)

## Next Steps

The capabilities, patterns, and code libraries that IoT Hub provides for device management, enable you to create IoT applications that fulfill enterprise IoT operator requirements within each device lifecycle stage.

To continue learning about the device management features in IoT Hub, see the [Get started with device management](iot-hub-node-node-device-management-get-started.md) tutorial.