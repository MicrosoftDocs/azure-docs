---
title: Reprovision devices with DPS
titleSuffix: Azure IoT Hub Device Provisioning Service
description: Learn how to reprovision devices with your Device Provisioning Service (DPS) instance, and why you might need to do this.
author: kgremban

ms.author: kgremban
ms.date: 03/10/2023
ms.topic: how-to
ms.service: iot-dps
---

# How to reprovision devices

During the lifecycle of an IoT solution, it's common to move devices between IoT hubs. This topic is written to assist solution operators configuring reprovisioning policies.

For more a more detailed overview of reprovisioning scenarios, see [IoT Hub Device reprovisioning concepts](concepts-device-reprovision.md).

## Set the reprovision policy

The following steps configure the reprovision policy for an individual enrollment or enrollment group:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Device Provisioning Service instance.

2. Select **Manage enrollments**, and then select either the **Enrollment groups** or **Individual enrollments** tabs.

3. Select the name of the enrollment group or individual enrollment that you want to configure for reprovisioning.

4. Use the dropdown menu under **Reprovision policy** to choose one of the following reprovisioning policies:

   * **Never reprovision device**.

   * **Reprovision device and reset to initial state**: This policy takes action when devices associated with the enrollment entry submit a new provisioning request. Depending on the enrollment entry configuration, the device may be reassigned to another IoT hub. If the device is changing IoT hubs, the device registration with the initial IoT hub will be removed. The initial configuration data that the provisioning service instance received when the device was provisioned is provided to the new IoT hub. During migration, the device's status will be reported as **Assigning**.

   * **Reprovision device and migrate current state**: This policy takes action when devices associated with the enrollment entry submit a new provisioning request. Depending on the enrollment entry configuration, the device may be reassigned to another IoT hub. If the device is changing IoT hubs, the device registration with the initial IoT hub will be removed. All device state information from that initial IoT hub will be migrated over to the new IoT hub. During migration, the device's status will be reported as **Assigning**

5. Select **Save** to enable the reprovisioning of the device based on your changes.

## Configure the enrollment allocation policy

The allocation policy determines how the devices associated with the enrollment will be allocated, or assigned, to an IoT hub once reprovisioned. To learn more about allocation polices, see [How to use allocation policies](how-to-use-allocation-policies.md).

The following steps configure the allocation policy for a device's enrollment:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Device Provisioning Service instance.

2. Select **Manage enrollments**, and then select either the **Enrollment groups** or **Individual enrollments** tabs.

3. Select the name of the enrollment group or individual enrollment that you want to configure for reprovisioning.

4. On the **Enrollment details** page, select the **IoT hubs** tab.

5. Select one of the following allocation policies:

    * **Static**: This policy requires a desired IoT hub be listed in the enrollment entry for a device to be provisioned. This policy allows you to designate a single IoT hub that you want to assign devices to.

    * **Evenly weighted distribution**: This policy distributes devices across IoT hubs based on the allocation weight configured on each IoT hub. IoT hubs with a higher allocation weight are more likely to be assigned. If you're provisioning devices to only one IoT Hub, we recommend this setting. This setting is the default.

    * **Lowest latency**: This policy assigns devices to the IoT hub that will result in the lowest latency communications between the device and IoT Hub. This option enables the device to communicate with the closest IoT hub based on location.

    * **Custom (use Azure Function)**: This policy uses a custom webhook hosted in Azure Functions to assign devices to one or more IoT hubs. Custom allocation policies give you more control over how devices are assigned to your IoT hubs. To learn more, see [Understand custom allocation policies](concepts-custom-allocation.md).

6. Under **Target IoT hubs**, select the linked IoT hubs that you want included in your allocation policy. Optionally, add a new linked Iot hub using the **Add link to IoT hub** button.

    * With the **Static configuration** allocation policy, select the IoT hub you want devices assigned to.

    * With the **Evenly weighted distribution** allocation policy, devices will be hashed across the IoT hubs you select based on their configured allocation weights.

    * With the **Lowest latency** allocation policy, the IoT hubs you select will be included in the latency evaluation to determine the closest IoT hub for device assignment.

    * With the **Custom** allocation policy, select the IoT hubs you want evaluated for assignment by your custom allocation webhook.

7. Select **Save**.

## Send a provisioning request from the device

In order for devices to be reprovisioned based on the configuration changes made in the preceding sections, these devices must request reprovisioning. 

How often a device submits a provisioning request depends on the scenario.  When designing your solution and defining a reprovisioning logic there are a few things to consider. For example:

* How often you expect your devices to restart
* The [DPS quotas and limits](about-iot-dps.md#quotas-and-limits)
* Expected deployment time for your fleet (phased rollout vs all at once)
* Retry capability implemented on your client code, as described on the [Retry general guidance](/azure/architecture/best-practices/transient-faults) at the Azure Architecture Center

>[!TIP]
> We recommend not provisioning on every reboot of the device, as this could hit the service throttling limits especially when reprovisioning several thousands or millions of devices at once. Instead you should attempt to use the [Device Registration Status Lookup](/rest/api/iot-dps/device/runtime-registration/device-registration-status-lookup) API and try to connect with that information to IoT Hub. If that fails, then try to reprovision as the IoT Hub information might have changed.  Keep in mind that querying for the registration state will count as a new device registration, so you should consider the [Device registration limit]( about-iot-dps.md#quotas-and-limits). Also consider implementing an appropriate retry logic, such as exponential back-off with randomization, as described on the [Retry general guidance](/azure/architecture/best-practices/transient-faults).
>In some cases, depending on the device capabilities, it’s possible to save the IoT Hub information directly on the device to connect directly to IoT Hub after the first-time provisioning using DPS occurred.  If you choose to do this, make sure you implement a fallback mechanism in case you get specific [errors from Hub occur](../iot-hub/troubleshoot-message-routing.md#common-error-codes), for example, consider the following scenarios:
>
> * Retry the Hub operation if the result code is 429 (Too Many Requests) or an error in the 5xx range. Do not retry for any other errors. 
> * For 429 errors, only retry after the time indicated in the Retry-After header. 
> * For 5xx errors, use exponential back-off, with the first retry at least 5 seconds after the response. 
> * On errors other than 429 and 5xx, re-register through DPS 
> * Ideally you should also support a [method](../iot-hub/iot-hub-devguide-direct-methods.md) to manually trigger provisioning on demand.
>
> We also recommend taking into account the service limits when planning activities like pushing updates to your fleet. For example, updating the fleet all at once could cause all devices to re-register through DPS (which could easily be above the registration quota limit) - For such scenarios, consider planning for device updates in phases instead of updating your entire fleet at the same time.

## Next steps

* To learn more Reprovisioning, see [IoT Hub Device reprovisioning concepts](concepts-device-reprovision.md).
* To learn more Deprovisioning, see [How to deprovision devices that were previously auto-provisioned](how-to-unprovision-devices.md).
