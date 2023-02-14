---
title: Device configuration best practices for Azure IoT Hub | Microsoft Docs 
description: Learn about best practices for using automatic device management to minimize repetitive and complex tasks involved in managing IoT devices at scale.
author: kgremban
ms.author: kgremban
ms.date: 06/28/2019
ms.topic: conceptual
ms.service: iot-hub
services: iot-hub
---

# Best practices for device configuration within an IoT solution

Automatic device management in Azure IoT Hub automates many repetitive and complex tasks of managing large device fleets over the entirety of their lifecycles. This article defines many of the best practices for the various roles involved in developing and operating an IoT solution.

* **IoT hardware manufacturer/integrator:** Manufacturers of IoT hardware, integrators assembling hardware from various manufacturers, or suppliers providing hardware for an IoT deployment manufactured or integrated by other suppliers. Involved in development and integration of firmware, embedded operating systems, and embedded software.

* **IoT solution developer:** The development of an IoT solution is typically done by a solution developer. This developer may be part of an in-house team or a system integrator specializing in this activity. The IoT solution developer can develop various components of the IoT solution from scratch, integrate various standard, or open-source components.

* **IoT solution operator:** After the IoT solution is deployed, it requires long-term operations, monitoring, upgrades, and maintenance. These tasks can be done by an in-house team that consists of information technology specialists, hardware operations and maintenance teams, and domain specialists who monitor the correct behavior of the overall IoT infrastructure.

## Understand automatic device management for configuring IoT devices at scale

Automatic device management includes the many benefits of [device twins](iot-hub-devguide-device-twins.md) and [module twins](iot-hub-devguide-module-twins.md) to synchronize desired and reported states between the cloud and devices. [Automatic device configurations](./iot-hub-automatic-device-management.md) automatically update large sets of twins and summarize progress and compliance. The following high-level steps describe how automatic device management is developed and used:

* The **IoT hardware manufacturer/integrator** implements device management features within an embedded application using [device twins](iot-hub-devguide-device-twins.md). These features could include firmware updates, software installation and update, and settings management.

* The **IoT solution developer** implements the management layer of device management operations using [device twins](iot-hub-devguide-device-twins.md) and [automatic device configurations](./iot-hub-automatic-device-management.md). The solution should include defining an operator interface to perform device management tasks.

* The **IoT solution operator** uses the IoT solution to perform device management tasks, particularly to group devices together, initiate configuration changes like firmware updates, monitor progress, and troubleshoot issues that arise.

## IoT hardware manufacturer/integrator

The following are best practices for hardware manufacturers and integrators dealing with embedded software development:

* **Implement [device twins](iot-hub-devguide-device-twins.md):** Device twins enable synchronizing desired configuration from the cloud and for reporting current configuration and device properties. The best way to implement device twins within embedded applications is through the [Azure IoT SDKs](https://github.com/Azure/azure-iot-sdks). Device twins are best suited for configuration because they:

    * Support bi-directional communication.
    * Allow for both connected and disconnected device states.
    * Follow the principle of eventual consistency.
    * Are fully queriable in the cloud.

* **Structure the device twin for device management:** The device twin should be structured such that device management properties are logically grouped together into sections. Doing so will enable configuration changes to be isolated without impacting other sections of the twin. For example, create a section within desired properties for firmware, another section for software, and a third section for network settings. 

* **Report device attributes that are useful for device management:** Attributes like physical device make and model, firmware, operating system, serial number, and other identifiers are useful for reporting and as parameters for targeting configuration changes.

* **Define the main states for reporting status and progress:** Top-level states should be enumerated so that they can be reported to the operator. For example, a firmware update would report status as Current, Downloading, Applying, In Progress, and Error. Define additional fields for more information on each state.

## IoT solution developer

The following are best practices for IoT solution developers who are building systems based in Azure:

* **Implement [device twins](iot-hub-devguide-device-twins.md):** Device twins enable synchronizing desired configuration from the cloud and for reporting current configuration and device properties. The best way to implement device twins within cloud solutions applications is through the [Azure IoT SDKs](https://github.com/Azure/azure-iot-sdks). Device twins are best suited for configuration because they:

    * Support bi-directional communication.
    * Allow for both connected and disconnected device states.
    * Follow the principle of eventual consistency.
    * Are fully queriable in the cloud.

* **Organize devices using device twin tags:** The solution should allow the operator to define quality rings or other sets of devices based on various deployment strategies such as canary. Device organization can be implemented within your solution using device twin tags and [queries](iot-hub-devguide-query-language.md). Device organization is necessary to allow for configuration roll outs safely and accurately.

* **Implement [automatic device configurations](./iot-hub-automatic-device-management.md):** Automatic device configurations deploy and monitor configuration changes to large sets of IoT devices via device twins.

   Automatic device configurations target sets of device twins via the **target condition,** which is a query on device twin tags or reported properties. The **target content** is the set of desired properties that will be set within the targeted device twins. The target content should align with the device twin structure defined by the IoT hardware manufacturer/integrator. The **metrics** are queries on device twin reported properties and should also align with the device twin structure defined by the IoT hardware manufacturer/integrator.

   Automatic device configurations run for the first time shortly after the configuration is created and then at five minute intervals. They also benefit from the IoT Hub performing device twin operations at a rate that will never exceed the [throttling limits](iot-hub-devguide-quotas-throttling.md) for device twin reads and updates.

* **Use the [Device Provisioning Service](../iot-dps/how-to-manage-enrollments.md):** Solution developers should use the Device Provisioning Service to assign device twin tags to new devices, such that they will be automatically configured by **automatic device configurations** that are targeted at twins with that tag. 

## IoT solution operator

The following are best practices for IoT solution operators who using an IoT solution built on Azure:

* **Organize devices for management:** The IoT solution should define or allow for the creation of quality rings or other sets of devices based on various deployment strategies such as canary. The sets of devices will be used to roll out configuration changes and to perform other at-scale device management operations.

* **Perform configuration changes using a phased roll out:**  A phased roll out is an overall process whereby an operator deploys changes to a broadening set of IoT devices. The goal is to make changes gradually to reduce the risk of making wide scale breaking changes.  The operator should use the solution's interface to create an [automatic device configuration](./iot-hub-automatic-device-management.md) and the targeting condition should target an initial set of devices (such as a canary group). The operator should then validate the configuration change in the initial set of devices.

   Once validation is complete, the operator will update the automatic device configuration to include a larger set of devices. The operator should also set the priority for the configuration to be higher than other configurations currently targeted to those devices. The roll out can be monitored using the metrics reported by the automatic device configuration.

* **Perform rollbacks in case of errors or misconfigurations:**  An automatic device configuration that causes errors or misconfigurations can be rolled back by changing the **targeting condition** so that the devices no longer meet the targeting condition. Ensure that another automatic device configuration of lower priority is still targeted for those devices. Verify that the rollback succeeded by viewing the metrics: The rolled-back configuration should no longer show status for untargeted devices, and the second configuration's metrics should now include counts for the devices that are still targeted.

## Next steps

* Learn about implementing device twins in [Understand and use device twins in IoT Hub](iot-hub-devguide-device-twins.md).

* Walk through the steps to create, update, or delete an automatic device configuration in [Configure and monitor IoT devices at scale](./iot-hub-automatic-device-management.md).

* Learn how to complete an end-to-end image-based update in  [Device Update for Azure IoT Hub tutorial using the Raspberry Pi 3 B+ Reference Image](../iot-hub-device-update/device-update-raspberry-pi.md).