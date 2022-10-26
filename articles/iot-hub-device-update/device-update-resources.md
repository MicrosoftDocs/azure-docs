---
title: Understand Device Update for Azure IoT Hub resources | Microsoft Docs
description: Understand Device Update for Azure IoT Hub resources
author: vimeht
ms.author: vimeht
ms.date: 06/14/2022
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

In order for Device Update to receive change notifications from IoT Hub, Device Update integrates with the built-in Event Hubs. Clicking the "Configure IoT Hub" button within your instance configures the required message routes, consumer groups, and access policy required to communicate with IoT devices.

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

Configuring the IoT hub also creates an event hub consumer group called **adum** that is required by the Device Update management services.

:::image type="content" source="media/device-update-resources/consumer-group.png" alt-text="Screenshot of consumer groups." lightbox="media/device-update-resources/consumer-group.png":::

### Access policy

A shared access policy named **deviceupdateservice** is used by the Device Update Management services to query for update-capable devices. The **deviceupdateservice** policy is created and given the following permissions as part of configuring the IoT Hub:

- Registry read
- Service connect
- Device connect

:::image type="content" source="media/device-update-resources/access-policy.png" alt-text="Screenshot of access policy." lightbox="media/device-update-resources/access-policy.png":::

## Next steps

[Create device update resources](./create-device-update-account.md)
