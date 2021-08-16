---
title: Operate devices offline - Azure IoT Edge | Microsoft Docs 
description: Understand how IoT Edge devices and modules can operate without internet connection for extended periods of time, and how IoT Edge can enable regular IoT devices to operate offline too.
author: kgremban
ms.author: kgremban
ms.date: 11/22/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Understand extended offline capabilities for IoT Edge devices, modules, and child devices

[!INCLUDE [iot-edge-version-all-supported](../../includes/iot-edge-version-all-supported.md)]

Azure IoT Edge supports extended offline operations on your IoT Edge devices, and enables offline operations on child devices too. As long as an IoT Edge device has had one opportunity to connect to IoT Hub, that device and any child devices can continue to function with intermittent or no internet connection.

## How it works

When an IoT Edge device goes into offline mode, the IoT Edge hub takes on three roles. First, it stores any messages that would go upstream and saves them until the device reconnects. Second, it acts on behalf of IoT Hub to authenticate modules and child devices so that they can continue to operate. Third, it enables communication between child devices that normally would go through IoT Hub.

The following example shows how an IoT Edge scenario operates in offline mode:

1. **Configure devices**

   IoT Edge devices automatically have offline capabilities enabled. To extend that capability to other devices, you need to configure the child devices to trust their assigned parent device and route the device-to-cloud communications through the parent as a gateway.

2. **Sync with IoT Hub**

   At least once after installation of the IoT Edge runtime, the IoT Edge device needs to be online to sync with IoT Hub. In this sync, the IoT Edge device gets details about any child devices assigned to it. The IoT Edge device also securely updates its local cache to enable offline operations and retrieves settings for local storage of telemetry messages.

3. **Go offline**

   While disconnected from IoT Hub, the IoT Edge device, its deployed modules, and any child devices can operate indefinitely. Modules and child devices can start and restart by authenticating with the IoT Edge hub while offline. Telemetry bound upstream to IoT Hub is stored locally. Communication between modules or between child devices is maintained through direct methods or messages.

4. **Reconnect and resync with IoT Hub**

   Once the connection with IoT Hub is restored, the IoT Edge device syncs again. Locally stored messages are delivered to the IoT Hub right away, but are dependent on the speed of the connection, IoT Hub latency, and related factors. They are delivered in the same order in which they were stored.

   Any differences between the desired and reported properties of the modules and devices are reconciled. The IoT Edge device updates any changes to its set of assigned child devices.

## Restrictions and limits

The extended offline capabilities described in this article are available in [IoT Edge version 1.0.7 or higher](https://github.com/Azure/azure-iotedge/releases). Earlier versions have a subset of offline features. Existing IoT Edge devices that don't have extended offline capabilities can't be upgraded by changing the runtime version, but must be reconfigured with a new IoT Edge device identity to gain these features.

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"

Only non-IoT Edge devices can be added as child devices.

:::moniker-end
<!-- end 1.1 -->

IoT Edge devices and their assigned child devices can function indefinitely offline after the initial, one-time sync. However, storage of messages depends on the time to live (TTL) setting and the available disk space for storing the messages.

## Set up parent and child devices

Parent devices can have multiple child devices, but a child device only has one parent.

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"

Child devices can be any non-IoT Edge device registered to the same IoT Hub.

:::moniker-end
<!-- end 1.1 -->

<!-- 1.2 -->
:::moniker range="iotedge-2020-11"

Child devices can be any device, IoT Edge or non-IoT Edge, registered to the same IoT Hub.

:::moniker-end
<!-- end 1.2 -->

If you're unfamiliar with creating a parent-child relationship between an IoT Edge device and an IoT device, see [Authenticate a downstream device to Azure IoT Hub](how-to-authenticate-downstream-device.md). The symmetric key, self-signed X.509, and CA-signed X.509 sections show examples of how to use the Azure portal and Azure CLI to define the parent-child relationships when creating devices. For existing devices, you can declare the relationship from the device details page of either the parent or child device.

<!-- 1.2 -->
:::moniker range="iotedge-2020-11"

If you're unfamiliar with creating a parent-child relationship between two IoT Edge devices, see [Connect a downstream IoT Edge device to an Azure IoT Edge gateway](how-to-connect-downstream-iot-edge-device.md).

:::moniker-end
<!-- end 1.2 -->

### Set up the parent device as a gateway

You can think of a parent/child relationship as a transparent gateway, where the child device has its own identity in IoT Hub but communicates through the cloud via its parent. For secure communication, the child device needs to be able to verify that the parent device comes from a trusted source. Otherwise, third-parties could set up malicious devices to impersonate parents and intercept communications.

One way to create this trust relationship is described in detail in the following articles:

* [Configure an IoT Edge device to act as a transparent gateway](how-to-create-transparent-gateway.md)
* [Connect a downstream (child) device to an Azure IoT Edge gateway](how-to-connect-downstream-device.md)

## Specify DNS servers

To improve robustness, it is highly recommended you specify the DNS server addresses used in your environment. To set your DNS server for IoT Edge, see the resolution for [Edge Agent module continually reports 'empty config file' and no modules start on device](troubleshoot-common-errors.md#edge-agent-module-reports-empty-config-file-and-no-modules-start-on-the-device) in the troubleshooting article.

## Optional offline settings

If your devices go offline, the IoT Edge parent device stores all device-to-cloud messages until the connection is reestablished. The IoT Edge hub module manages the storage and forwarding of offline messages. For devices that may go offline for extended periods of time, optimize performance by configuring two IoT Edge hub settings.

First, increase the time to live setting so that the IoT Edge hub will keep messages long enough for your device to reconnect. Then, add additional disk space for message storage.

### Time to live

The time to live setting is the amount of time (in seconds) that a message can wait to be delivered before it expires. The default is 7200 seconds (two hours). The maximum value is only limited by the maximum value of an integer variable, which is around 2 billion.

This setting is a desired property of the IoT Edge hub, which is stored in the module twin. You can configure it in the Azure portal or directly in the deployment manifest.

```json
"$edgeHub": {
    "properties.desired": {
        "schemaVersion": "1.0",
        "routes": {},
        "storeAndForwardConfiguration": {
            "timeToLiveSecs": 7200
        }
    }
}
```

### Host storage for system modules

Messages and module state information are stored in the IoT Edge hub's local container filesystem by default. For improved reliability, especially when operating offline, you can also dedicate storage on the host IoT Edge device. For more information, see [Give modules access to a device's local storage](how-to-access-host-storage-from-module.md)

## Next steps

Learn more about how to set up a transparent gateway for your parent/child device connections:

* [Configure an IoT Edge device to act as a transparent gateway](how-to-create-transparent-gateway.md)
* [Authenticate a downstream device to Azure IoT Hub](how-to-authenticate-downstream-device.md)
* [Connect a downstream device to an Azure IoT Edge gateway](how-to-connect-downstream-device.md)
