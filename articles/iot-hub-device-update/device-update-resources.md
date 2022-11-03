---
title: Understand Device Update for Azure IoT Hub resources | Microsoft Docs
description: Understand Device Update for Azure IoT Hub resources
author: vimeht
ms.author: vimeht
ms.date: 11/02/2022
ms.topic: conceptual
ms.service: iot-hub-device-update
---


# Device update resources

To use Device Update for IoT Hub, you need to create a Device Update account and instance.

## Device Update account

A Device Update account is a resource that is created within your Azure subscription. At the Device Update account level,
you can select the region where your Device Update account will be created. You can also set permissions to authorize users that have access to Device Update.

## Device update instance

After an account has been created, you need to create a Device Update instance. An instance is a logical container that contains
updates and deployments associated with a specific IoT hub. Device Update uses IoT Hub as a device directory and a communication channel with devices.

During public preview, two Device update accounts can be created per subscription. Additionally, two device update instance can be created per account.

## Configure the linked IoT hub

In order for Device Update to receive change notifications from IoT Hub, Device Update integrates with the built-in Event Hubs. The IoT Hub will be configured automatically as part of the resource creation process with the required message routes, consumer groups, and access policy required to communicate with IoT devices.

### Message Routing

The following Message Routes are automatically configured in your linked IoT hub to enable Device Update:

|   Route Name    | Data Source | Routing Query  | Endpoint | Description  |
| :--------- | :---- |:---- |:---- |:---- |
|  DeviceUpdate.DeviceTwinChanges| TwinChangeEvents | (opType = 'updateTwin' OR opType = 'replaceTwin') AND IS_DEFINED($body.tags.ADUGroup) | events | Listens for new Device Update groups |
|  DeviceUpdate.DigitalTwinChanges | DigitalTwinChangeEvents | true | events | Listens for Digital Twin change events  |
|  DeviceUpdate.DeviceLifecycle | DeviceLifecycleEvents | opType = 'deleteDeviceIdentity' OR opType = 'deleteModuleIdentity'  | events | Listens for devices that have been deleted |
| DeviceUpdate.DeviceConnectionState | DeviceConnectionStateEvents | true | events | Listens for changes to device connection states |

> [!NOTE]
> You can change the names of these routes if it makes sense for your solution. The rest of the route properties should stay configured as they are in the table for Device Update to work properly.

### Consumer group

 The IoT hub also creates an event hub consumer group called **adum** that is required by the Device Update management services. This should be added automatically as aprt of the resource creation process. 

:::image type="content" source="media/device-update-resources/consumer-group.png" alt-text="Screenshot of consumer groups." lightbox="media/device-update-resources/consumer-group.png":::

### Configuring access for Azure Device Update service principal in the IoT Hub

Device Update for IoT Hub communicates with the IoT Hub for deployments and manage updates at scale. In order to enable Device Update to do this, users need to set IoT Hub Data Contributor access for Azure Device Update Service Principal in the IoT Hub permissions. 

Deployment, device and update management and diagnostic actions will not be allowed if these permissions are not set. Operations that will be blocked will include:
* Create Deployment
* Cancel Deployment
* Retry Deployment 
* Get Device

The permission can be set from IoT Hub Access Control (IAM). Refer to [Configure Access for Azure Device update service principal in linked IoT hub](configure-access-control-device-update.md#configure-access-for-azure-device-update-service-principal-in-linked-iot-hub)

## Next steps

[Create device update resources](./create-device-update-account.md)
