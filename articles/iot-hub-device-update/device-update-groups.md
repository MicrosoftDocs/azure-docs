---
title: Understand Device Update for Azure IoT Hub device groups
description: Understand how device groups are used.
author: aysancag
ms.author: aysancag
ms.date: 2/09/2021
ms.topic: concept-article
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
| Device4 | DefaultGroup                  |


## Subgroups

All user-created groups as well as default groups are automatically sub-categorized into one or more subgroups to allow administrators to manage heterogeneous devices in an organized and efficient manner, by providing a way to perform updates on a set of devices that share compatibility properties. Each device class within a group maps to one subgroup. Devices are added to a subgroup based on their compatibility properties and the Device Update PnP model ID, which together comprise a device class. 

A group can have one or more best available update, one for each subgroup it contains. 

[Learn more](./device-update-configuration-file.md) about setting compatibility properties on the Device Update agent

## Next steps

[Create a device group](./create-update-group.md)
