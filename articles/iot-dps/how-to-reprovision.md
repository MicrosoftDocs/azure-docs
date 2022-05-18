---
title: Reprovision devices in Azure IoT Hub Device Provisioning Service
description: Learn how to reprovision devices with your Device Provisioning Service (DPS) instance, and why you might need to do this.
author: kgremban
ms.author: kgremban
ms.date: 01/25/2021
ms.topic: conceptual
ms.service: iot-dps
services: iot-dps
---

# How to reprovision devices

During the lifecycle of an IoT solution, it is common to move devices between IoT hubs. This topic is written to assist solution operators configuring reprovisioning policies.

For more a more detailed overview of reprovisioning scenarios, see [IoT Hub Device reprovisioning concepts](concepts-device-reprovision.md).


## Configure the enrollment allocation policy

The allocation policy determines how the devices associated with the enrollment will be allocated, or assigned, to an IoT hub once reprovisioned.

The following steps configure the allocation policy for a device's enrollment:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Device Provisioning Service instance.

2. Click **Manage enrollments**, and click the enrollment group or individual enrollment that you want to configure for reprovisioning. 

3. Under **Select how you want to assign devices to hubs**, select one of the following allocation policies:

    * **Lowest latency**: This policy assigns devices to the linked IoT Hub that will result in the lowest latency communications between device and IoT Hub. This option enables the device to communicate with the closest IoT hub based on location. 
    
    * **Evenly weighted distribution**: This policy distributes devices across the linked IoT Hubs based on the allocation weight assigned to each linked IoT hub. This policy allows you to load balance devices across a group of linked hubs based on the allocation weights set on those hubs. If you are provisioning devices to only one IoT Hub, we recommend this setting. This setting is the default. 
    
    * **Static configuration**: This policy requires a desired IoT Hub be listed in the enrollment entry for a device to be provisioned. This policy allows you to designate a single specific IoT hub that you want to assign devices to.

4. Under **Select the IoT hubs this group can be assigned to**, select the linked IoT hubs that you want included with your allocation policy. Optionally, add a new linked Iot hub using the **Link a new IoT Hub** button.

    With the **Lowest latency** allocation policy, the hubs you select will be included in the latency evaluation to determine the closest hub for device assignment.

    With the **Evenly weighted distribution** allocation policy, devices will be load balanced across the hubs you select based on their configured allocation weights and their current device load.

    With the **Static configuration** allocation policy, select the IoT hub you want devices assigned to.

4. Click **Save**, or proceed to the next section to set the reprovisioning policy.

    ![Select enrollment allocation policy](./media/how-to-reprovision/enrollment-allocation-policy.png)



## Set the reprovisioning policy

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Device Provisioning Service instance.

2. Click **Manage enrollments**, and click the enrollment group or individual enrollment that you want to configure for reprovisioning.

3. Under **Select how you want device data to be handled on re-provision to a different IoT hub**, choose one of the following reprovisioning policies:

    * **Re-provision and migrate data**: This policy takes action when devices associated with the enrollment entry submit a new provisioning request. Depending on the enrollment entry configuration, the device may be reassigned to another IoT hub. If the device is changing IoT hubs, the device registration with the initial IoT hub will be removed. All device state information from that initial IoT hub will be migrated over to the new IoT hub. During migration, the device's status will be reported as **Assigning**

    * **Re-provision and reset to initial config**: This policy takes action when devices associated with the enrollment entry submit a new provisioning request. Depending on the enrollment entry configuration, the device may be reassigned to another IoT hub. If the device is changing IoT hubs, the device registration with the initial IoT hub will be removed. The initial configuration data that the provisioning service instance received when the device was provisioned is provided to the new IoT hub. During migration, the device's status will be reported as **Assigning**.

4. Click **Save** to enable the reprovisioning of the device based on your changes.

    ![Screenshot that highlights the changes you've made and the Save button.](./media/how-to-reprovision/reprovisioning-policy.png)



## Send a provisioning request from the device

In order for devices to be reprovisioned based on the configuration changes made in the preceding sections, these devices must request reprovisioning. 

How often a device submits a provisioning request depends on the scenario.  When designing your solution and defining a reprovisioning logic there are a few things to consider. For example:

* How often you expect your devices to restart
* The [DPS quotas and limits](about-iot-dps.md#quotas-and-limits)
* Expected deployment time for your fleet (phased rollout vs all at once)
* Retry capability implemented on your client code, as described on the [Retry general guidance](/azure/architecture/best-practices/transient-faults) at the Azure Architecture Center

>[!TIP]
> We recommend not provisioning on every reboot of the device, as this could cause some issues when reprovisioning several thousands or millions of devices at once. Instead you should attempt to use the [Device Registration Status Lookup](/rest/api/iot-dps/device/runtime-registration/device-registration-status-lookup) API and try to connect with that information to IoT Hub. If that fails, then try to reprovision as the IoT Hub information might have changed.  Keep in mind that querying for the registration state will count as a new device registration, so you should consider the [Device registration limit]( about-iot-dps.md#quotas-and-limits). Also consider implementing an appropriate retry logic, such as exponential back-off with randomization, as described on the [Retry general guidance](/azure/architecture/best-practices/transient-faults).
>In some cases, depending on the device capabilities, it’s possible to save the IoT Hub information directly on the device to connect directly to IoT Hub after the first-time provisioning using DPS occurred.  If you choose to do this, make sure you implement a fallback mechanism in case you get specific [errors from Hub occur](../iot-hub/troubleshoot-message-routing.md#common-error-codes), for example, consider the following scenarios:
> * Retry the Hub operation if the result code is 429 (Too Many Requests) or an error in the 5xx range. Do not retry for any other errors. 
> * For 429 errors, only retry after the time indicated in the Retry-After header. 
> * For 5xx errors, use exponential back-off, with the first retry at least 5 seconds after the response. 
> * On errors other than 429 and 5xx, re-register through DPS 
> * Ideally you should also support a [method](../iot-hub/iot-hub-devguide-direct-methods.md) to manually trigger provisioning on demand.
> 
> We also recommend taking into account the service limits when planning activities like pushing updates to your fleet. For example, updating the fleet all at once could cause all devices to re-register through DPS (which could easily be above the registration quota limit) - For such scenarios, consider planning for device updates in phases instead of updating your entire fleet at the same time.


## Next steps

- To learn more Reprovisioning, see [IoT Hub Device reprovisioning concepts](concepts-device-reprovision.md) 
- To learn more Deprovisioning, see [How to deprovision devices that were previously auto-provisioned](how-to-unprovision-devices.md) 
