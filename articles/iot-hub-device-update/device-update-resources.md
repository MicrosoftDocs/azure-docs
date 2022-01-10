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

In order for Device Update to receive change notifications from IoT Hub, Device Update integrates with the "Built-In" Event Hub. Clicking the "Configure IoT Hub" button within your instance configures the required message routes, consumer groups and access policy required to communicate with IoT devices. 

### Message Routing

The following Message Routes are configured for Device Update:

|   Route Name    | Data Source | Routing Query  | Endpoint | Description  |
| :--------- | :---- |:---- |:---- |:---- |
|  DeviceUpdate.DigitalTwinChanges | DigitalTwinChangeEvents | true | events | Listens for Digital Twin Changes Events  |
|  DeviceUpdate.DeviceLifecycle | DeviceLifecycleEvents | opType = 'deleteDeviceIdentity' OR opType = 'deleteModuleIdentity'  | events | Listens for Devices that have been deleted |
|  DeviceUpdate.DeviceTwinEvents| TwinChangeEvents | (opType = 'updateTwin' OR opType = 'replaceTwin') AND IS_DEFINED($body.tags.ADUGroup) | events | Listens for new Device Update Groups |

> [!NOTE]
> Route names don't really matter when configuring these routes. We are including DeviceUpdate as a prefix to make the names consistent and easily identifiable that they are being used for Device Update. The rest of the route properties should be configured as they are in the table below for the Device Update to work properly. 

### Consumer Group

Configuring the IoT Hub also creates an event hub consumer group that is required by the Device Update Management services. 

:::image type="content" source="media/device-update-resources/consumer-group.png" alt-text="Screenshot of consumer groups." lightbox="media/device-update-resources/consumer-group.png":::

### Access Policy

A shared access policy named "deviceupdateservice" is required by the Device Update Management services to query for update-capable devices. The "deviceupdateservice" policy is created and given the following permissions as part of configuring the IoT Hub:
- Registry Read
- Service Connect
- Device Connect

:::image type="content" source="media/device-update-resources/access-policy.png" alt-text="Screenshot of access policy." lightbox="media/device-update-resources/access-policy.png":::

## Next steps

[Create device update resources](./create-device-update-account.md)
