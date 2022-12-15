---
title: Understand Device Update for Azure IoT Hub device groups | Microsoft Docs
description: Understand how device groups are used.
author: aysancag
ms.author: aysancag
ms.date: 2/09/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Device groups

A device group is a collection of devices. Device groups provide a way to scale deployments to many devices. Each device belongs to exactly one device group at a time.

You may choose to create multiple device groups to organize your devices. For example, Contoso might use the "Flighting" device group for the devices in its test laboratory and the "Evaluation" device group for the devices that its field team uses in the operations center. Further, Contoso might choose to group their production devices based on their geographic regions, so that they can update devices on a schedule that aligns with their regional timezones.

## Create device groups using device or module twin tags

Tags enable users to group devices. Devices need to have a ADUGroup key and a value in their device or module twin to allow them to be grouped.

### Device or module twin tag format

```json
"tags": {
  "ADUGroup": "<CustomTagValue>"
}
```

## Default device group

Any device that has the Device Update agent installed and provisioned, but doesn't have the ADUGroup tag added to its device or module twin, will be added to a default group. Default groups, also called system-assigned groups, help reduce the overhead of tagging and grouping devices, so customers can easily deploy updates to them. Default groups can't be deleted or re-created by customers. Customers can't change the definition or add/remove devices from a default group manually. Devices with the same device class are grouped together in a default group. Default group names are reserved within an IOT solution. Default groups will be named in the format `Default-<deviceClassID>`. All deployment features that are available for user-defined groups are also available for default, system-assigned groups.

For example consider the devices with their device twin tags below:

```json
"deviceId": "Device1",
"tags": {
  "ADUGroup": "Group1"
}
```

```json
"deviceId": "Device2",
"tags": {
  "ADUGroup": "Group1"
}
```

```json
"deviceId": "Device3",
"tags": {
  "ADUGroup": "Group2"
}
```

```json
"deviceId": "Device4",
```

Below are the devices and the possible groups that can be created for them.

| Device  | Group                         |
|---------|-------------------------------|
| Device1 | Group1                        |
| Device2 | Group1                        |
| Device3 | Group2                        |
| Device4 | DefaultGroup1-(deviceClassId) |

## Deleting device groups

While device groups are automatically created, groups, device classes and deployments are not automatically cleaned up so as to retain them for historic records or other user needs. Device groups can be deleted through Azure Portal by individually selecting and deleting the desired groups, or by calling the DELETE API on the group. [Learn more](https://learn.microsoft.com/rest/api/deviceupdate/2022-10-01/device-management/delete-group?tabs=HTTP)

If a device is ever connected again for this group after the group is deleted, while the group will be automatically re-created but there will be no associated device or deployment history. 

To a delete a group, a group must meet the following requirements: 
* The group must have NO member devices. This means that no device provisioned in the Device Update instance should have a ADUGroup tag with a value matching the selected group's name. 
* The group must NOT be a default group. 
* The group must have NO active or cancelled deployments associated with it. 

> [!NOTE]
> If you are still unable to delete a group after meeting the above requirements, then validate whether you have any Unhealthy devices that are tagged as part of the group. Unhealthy devices are devices that cannot receive a deployment, and as a result don't show up directly in the list of member devices within a group. You can validate whether you have any unhealthy devices by going to "Find missing devices" within the Diagnostics tab in the Device Update Portal experience. In case you have Unhealthy devices that are tagged as part of the group, you will need to modify the tag value or delete the device entirely before attempting to delete your group. 

## Next steps

[Create a device group](./create-update-group.md)
