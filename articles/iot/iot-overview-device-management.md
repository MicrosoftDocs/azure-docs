---
title: Device management and control
titleSuffix: Azure IoT
description: An overview of device management and control options in an Azure IoT solution including device updates.
ms.service: iot-fundamentals
services: iot-fundamentals
author: dominicbetts
ms.author: dobett
ms.topic: overview
ms.date: 03/10/2023
ms.custom: template-overview

# As a solution builder or device developer I want a high-level overview of the issues around device management and control so that I can easily find relevant content.
---

# Device management and control

This overview introduces some of the key concepts around managing and controlling devices in a typical Azure IoT solution. Each section includes links to content that provides further detail and guidance.

IoT Central applications use the IoT Hub and the Device Provisioning Service (DPS) services internally. Therefore, the concepts in this article apply whether you're using IoT Central to explore an IoT scenario or building your solution by using IoT Hub and DPS.

:::image type="content" source="media/iot-overview-device-management/iot-architecture.svg" alt-text="High-level IoT solution architecture diagram that highlights device connectivity areas" border="false":::

In Azure IoT, device management refers to the processes such as provisioning and updating devices. Device management includes the following tasks:

- Device registration
- Device provisioning
- Device deployment
- Device updates
- Device key management and rotation
- Device monitoring
- Enabling and disabling devices

In Azure IoT, command and control refers to the processes that let you send commands to devices and receive responses from them. For example, you can send a command to a device to:

- Set a target temperature.
- Request maximum and minimum temperature values for the last two hours.
- Set the telemetry interval to 10 seconds.

## Primitives

Azure IoT solutions can use the following primitives for both device management and command and control:

- *Device twins* to share and synchronize state data with the cloud. For example, a device can use the device twin to report the current state of a valve it controls to the cloud and to receive a desired target temperature from the cloud.
- *Digital twins* to represent a device in the digital world. For example, a digital twin can represent a device's physical location, its capabilities, and its relationships with other devices.
- *Direct methods* to receive commands from the cloud. A direct method can have parameters and return a response. For example, the cloud can call a direct method to request the device to reboot in 30 seconds.
- *Cloud-to-device* messages receive one-way notifications from the cloud. For example, a notification that an update is ready to download.

## Device registration

Before a device can connect to an IoT hub, it must be registered. Device registration is the process of creating a device identity in the cloud. Each IoT hub has its own internal device registry. The device identity is used to authenticate the device when it connects to Azure IoT. Device registration entry includes the following properties:

- A unique device ID.
- Authentication information such as symmetric keys or X.509 certificates.
- The type of device. Is it an IoT Edge device or not?

If you think a device has been compromised or isn't functioning correctly, you can disable it in the device registry to prevent it from connecting to the cloud. To allow a device to connect back to a cloud after the issue is resolved, you can re-enable it in the device registry. You can also permanently remove a device from the device registry to completely prevent it from connecting to the cloud.

To lean more, see [Understand the identity registry in your IoT hub](../iot-hub/iot-hub-devguide-identity-registry.md).

## Device provisioning

You must configure each device in your solution with the details of the IoT hub it should connect to. You can manually configure each device in your solution, but this may not be practical for a large number of devices. To get around this problem, you can use the Device Provisioning Service (DPS) to automatically register each device with an IoT hub and then provision each device with the required connection information. If your IoT solution uses multiple IoT hubs, you can use DPS to provision devices to a hub based on criteria such as which is the closest hub to the device.

If your IoT solution uses IoT Hub, then using DPS is optional. If you're using IoT Central, then your solution automatically uses a DPS instance that's managed by IoT Central.

To learn more, see [Device provisioning service overview](../iot-dps/about-iot-dps.md).

## Device deployment

In Azure IoT, device deployment typically refers to the process of installing software on an IoT Edge device. When an IoT Edge device connects to an IoT hub, it receives a *deployment manifest* that contains details of the modules to run on the device. The deployment manifest also contains configuration information for the modules. There are a number of standard modules that are available for IoT Edge devices. You can also create your own custom modules.

To learn more, see [What is Azure IoT Edge?](../iot-edge/about-iot-edge.md)

## Device updates

Typically, your IoT solution must include a way to update device software. In the case of an IoT Edge device, you can update the modules that run on the device by updating the deployment manifest.

In the case of a non-IoT Edge device, you need to have a way to update the device firmware. This could be a process that uses a cloud-to-device message to notify the device that a firmware update is available. Then the device runs custom code to download and install the update.

The Device Update for IoT Hub service provides a managed solution for updating devices. It enables you to upload firmware updates to the cloud and then distribute them to devices. It also lets your monitor the update process and roll back to a previous version if the update fails.

To learn more, see [What is Device Update for IoT Hub?](../iot-hub-device-update/understand-device-update.md)

## Device key management and rotation

During the lifecycle of your IoT solution you may need to roll over the keys used to authenticate devices. For example, you may need to do this if you suspect that a key has been compromised or if a certificate expires:

- [Roll over the keys used to authenticate devices in IoT Hub and DPS](../iot-dps/how-to-roll-certificates.md#roll-x509-device-certificates)
- [Roll over the keys used to authenticate devices in IoT Central](../iot-central/core/how-to-connect-devices-x509.md#roll-x509-device-certificates)

## Device monitoring

As part of overall solution monitoring, you may want to monitor the health of your devices. For example, you may want to monitor the health of your devices or detect when a device is no longer connected to the cloud. Options for monitoring devices include:

- Devices use the device twin to report its current state to the cloud. For example, a device can report its current internal temperature or its current battery level.
- Devices can raise alerts by sending telemetry messages to the cloud.
- IoT Hub can raise events when devices connect or disconnect from the cloud.
- Use machine learning tools to analyze device telemetry streams to identify anomalies that indicate a problem with the device.

## Device migration

If you need to migrate a device from IoT Central to IoT Hub, you can use the Device Migration tool. To learn more, see [Migrate devices from IoT Central to IoT Hub](../iot-central/core/howto-migrate-to-iothub.md).

## Command and control

To send commands to your devices to control their behavior, use:

- *Direct methods* for communications that require immediate confirmation of the result. Direct methods are often used for interactive control of devices such as turning on a fan.

- Device twin *desired properties* for long-running commands intended to put the device into a certain desired state. For example, set the telemetry send interval to 30 minutes.

- *Cloud-to-device messages* for one-way notifications to the device.

To learn more, see [Cloud-to-device communications guidance](../iot-hub/iot-hub-devguide-c2d-guidance.md).

## Jobs

You can use direct methods, desired properties, and cloud-to-device messages to send commands to individual devices. If you need to send commands to multiple devices, you can use jobs. Jobs let you to schedule and send commands and desired property updates to multiple devices at the same time. You can also use jobs to monitor the progress of the commands and to roll back to a previous state if the commands fail.

To learn more, see:

- [Schedule jobs on multiple devices (IoT Hub)](../iot-hub/iot-hub-devguide-jobs.md)
- [Manage devices in bulk in your Azure IoT Central application](../iot-central/core/howto-manage-devices-in-bulk.md)

## Next steps

Now that you've seen an overview of device management and control in Azure IoT solutions, some suggested next steps include

- [Device infrastructure and connectivity](iot-overview-connectivity.md).
