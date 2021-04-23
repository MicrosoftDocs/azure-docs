---
title: Understand Device Update for Azure IoT Hub resources | Microsoft Docs
description: Understand Device Update for Azure IoT Hub resources
author: vimeht
ms.author: vimeht
ms.date: 2/11/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---


# Device update resources

To use Device Update for IoT Hub, you need to create a device update account and instance resource. 

## Device update account

A Device Update account is a resource that is created within your Azure subscription. At the Device Update account level,
you can select the region where your Device Update account will be created. You can also set permissions to authorize users that 
will have access to Device Update.


## Device update instance
After an account has been created, you need to create a Device Update instance. An instance is a logical container that contains
updates and deployments associated with a specific IoT hub. Device Update uses IoT hub as a device directory, and a communication channel with devices. 

During public preview, two Device update accounts can be created per subscription. Additionally, two device update instance can be created per account.

## Configuring Device update linked IoT Hub 

In order for Device Update to receive change notifications from IoT Hub, Device Update integrates with the "Built-In" Event Hub. Clicking the "Configure IoT Hub" button within your instance configures the required message routes and access policy required to communicate with IoT devices. 

The following Message Routes are configured for Device Update:

|   Route Name    | Routing Query  | Description  |
| :--------- | :---- |:---- |
|  DeviceUpdate.DigitalTwinChanges | true |Listens for Digital Twin Changes Events  |
|  DeviceUpdate.DeviceLifeCycle | opType = 'deleteDeviceIdentity'  | Listens for Devices that have been deleted |
|  DeviceUpdate.TelemetryModelInformation | iothub-interface-id = "urn:azureiot:ModelDiscovery:ModelInformation:1 | Listens for new devices types |
|  DeviceUpdate.DeviceTwinEvents| (opType = 'updateTwin' OR opType = 'replaceTwin') AND IS_DEFINED($body.tags.ADUGroup) | Listens for new Device Update Groups |

## Next steps

[Create device update resources](./create-device-update-account.md)
