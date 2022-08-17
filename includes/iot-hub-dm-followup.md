---
 title: include file
 description: include file
 services: iot-hub
 ms.service: iot-hub
 author: kgremban
 ms.topic: include
 ms.date: 02/17/2019
 ms.author: kgremban
 ms.custom: include file
---

## Customize and extend the device management actions

Your IoT solutions can expand the defined set of device management patterns or enable custom patterns by using the device twin and cloud-to-device method primitives. Other examples of device management actions include factory reset, firmware update, software update, power management, network and connectivity management, and data encryption.

## Device maintenance windows

Typically, you configure devices to perform actions at a time that minimizes interruptions and downtime. Device maintenance windows are a commonly used pattern to define the time when a device should update its configuration. Your back-end solutions can use the desired properties of the device twin to define and activate a policy on your device that enables a maintenance window. When a device receives the maintenance window policy, it can use the reported property of the device twin to report the status of the policy. The back-end app can then use device twin queries to attest to compliance of devices and each policy.

## Next steps

In this article, you used a direct method to trigger a remote reboot on a device. You used the reported properties to report the last reboot time from the device, and queried the device twin to discover the last reboot time of the device from the cloud.

ToTo continue getting started with IoT Hub and device management patterns such as end-to-end image-based update in [Device Update for Azure IoT Hub article using the Raspberry Pi 3 B+ Reference Image](../articles/iot-hub-device-update/device-update-raspberry-pi.md).

To learn how to extend your IoT solution and schedule method calls on multiple devices, see [Schedule and broadcast jobs](../articles/iot-hub/iot-hub-node-node-schedule-jobs.md).