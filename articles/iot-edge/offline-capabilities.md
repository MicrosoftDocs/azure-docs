---
title: Azure IoT Edge offline capabilities | Microsoft Docs 
description: Understand how IoT Edge devices and modules can operate offline for extended periods of time, and how IoT Edge can enable regular IoT devices to operate offline too.
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 09/20/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Understand extended offline capabilities for IoT Edge devices, modules, and child devices (preview)

Azure IoT Edge supports offline operations on your IoT Edge devices, and enables offline operations on non-Edge child devices too. As long as an IoT Edge device has had one opportunity to connect to IoT Hub, it and any child devices can continue to function with intermittent or no internet connection. 

Offline support is available in all regions where IoT Hub is available, except East US and West Europe. 

>[!NOTE]
>Offline support for IoT Edge is in [public preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## How it works

When an IoT Edge device goes into offline mode, the Edge hub takes on three roles. First, it stores any messages that would go upstream and saves them until the device reconnects. Second, it acts on behalf of IoT Hub to authenticate modules and child devices so that they can continue to operate. Third, it enables communication between child devices that normally would go through IoT Hub. 

The following example shows how an IoT Edge scenario operates in offline mode:

1. Configure an IoT Edge device. 

   Modules deployed to an IoT Edge device automatically have offline capability. To extend that capability to other IoT devices, you need to declare a parent-child relationship between the devices in IoT Hub. 

2. Sync with IoT Hub.

   At least once after installation of the IoT Edge runtime, the IoT Edge device needs to be online to sync with IoT Hub. In this sync, the IoT Edge device gets details about any child devices assigned to it. The IoT Edge device also securely updates its local cache to enable offline operations and retrieves settings for local storage of telemetry messages. 

3. Go offline. 

   While disconnected from IoT Hub, the IoT Edge device, its deployed modules, and any children IoT devices can operate indefinitely. Telemetry bound upstream to IoT Hub is stored locally. Communication between modules or between child IoT devices is maintained through direct methods or messages. 

4. Reconnect and re-sync with IoT Hub.

   Once the connection with IoT Hub is restored, the IoT Edge device syncs again. Locally stored messages are delivered in the same order in which they were stored. Any differences between the desired and reported properties of the modules and devices are reconciled. The IoT Edge device updates any changes to its set of assigned child IoT devices.

## Restrictions and limits

The offline capabilities described in this article are available in [IoT Edge version 1.0.2 or higher](https://github.com/Azure/azure-iotedge/releases). Earlier versions have a subset of offline features, not including authentication abilities or support for child devices.  

Currently, the Edge hub module must use MQTT for extended offline capabilities. Set this in the Edge hub configuration as an environment variable in the Azure portal or deployment manifest. 

   ```json
    "env": {
        "UpstreamProtocol": {
            "value": "MQTT"
        }
    }
    ```

Only non-Edge IoT devices can be added as child devices. 

IoT Edge devices and their assigned child devices can function indefinitely offline after the initial, one-time sync. However, storage of messages depends on the time to live (TTL) setting and the available disk space for storing the messages. 

## Configure offline settings

For an IoT Edge device on its own, or with downstream devices that don't have IoT Hub identities, you don't need to explicitly enable offline capabilities. However, you may want to change the time to live setting and add additional disk space for message storage. 

For an IoT Edge device with non-Edge child devices assigned to it, you need to declare the parent-child relationships in the Azure portal in addition to the time to live and storage configurations. 

### Time to live

The time to live setting is the amount of time (in seconds) that a message can wait to be delivered before it expires. The default is 7200 seconds (two hours). 

This setting is a desired property of the Edge hub, which is stored in the module twin. You can configure it in the Azure portal, in the **Configure advanced Edge Runtime settings** section, or directly in the deployment manifest. 

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

### Additional offline storage

By default, messages are stored in the Edge hub's container filesystem. If that amount of storage isn't sufficient for your offline needs, you can dedicate local storage on the IoT Edge device. You need to create an environment variable for the Edge hub that points to a storage folder in the container. Then, use the create options to bind that storage folder to a folder on the host machine. 

You can configure environment variables and the create options for the Edge hub module in the Azure portal in the **Configure advanced Edge Runtime settings** section. Or, you can configure it directly in the deployment manifest. 

```json
"edgeHub": {
    "type": "docker",
    "settings": {
        "image": "mcr.microsoft.com/azureiotedge-hub:1.0",
        "createOptions": "{\"HostConfig\":{\"Binds\":[\"C:\\\\HostStoragePath:C:\\\\ModuleStoragePath\"],\"PortBindings\":{\"8883/tcp\":[{\"HostPort\":\"8883\"}],\"443/tcp\":[{\"HostPort\":\"443\"}],\"5671/tcp\":[{\"HostPort\":\"5671\"}]}}}"
    },
    "env": {
        "storageFolder": {
            "value": "C:\\\\ModuleStoragePath"
        }
    },
    "status": "running",
    "restartPolicy": "always"
}
```

### Child devices

Child devices can be any non-Edge device registered to the same IoT Hub. You can manage the parent-child relationship on creating a new device, or from the device details page of either the parent IoT Edge device or the child IoT device. 

Parent devices can have multiple child devices, but a child device can only have one parent. 

## Next steps

Enable extended offline operations in your transparent gateway scenarios for [Linux](how-to-create-transparent-gateway-linux.md) or [Windows](how-to-create-transparent-gateway-windows.md) devices. 