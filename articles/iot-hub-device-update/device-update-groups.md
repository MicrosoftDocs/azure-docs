---
title: Azure Device Update for IoT Hub device groups
description: Understand Azure Device Update for IoT Hub user-assigned and default device groups and subgroups based on device classes.
author: aysancag
ms.author: aysancag
ms.date: 01/07/2025
ms.topic: concept-article
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Azure Device Update for IoT Hub device groups

An Azure Device Update for IoT Hub device group is a collection of IoT devices that provides a way to target deployments. Any device that has the Device Update agent installed and provisioned belongs to a device group.

You can use the default device group that Device Update assigns, or you can create and assign multiple device groups to organize your devices. For example, the Contoso organization might use a "Flighting" device group for the devices in its test laboratory and the "Evaluation" device group for the devices its field team uses in the operations center. Contoso might also choose to group their production devices based on geographic regions, so they can update devices on a schedule that aligns with their regional timezones.

## User-defined device groups

You use *tags* to group devices. An `ADUGroup` key with a user-defined value in the `"tags"` section of the device twin or module twin specifies a user-defined device group.

```json
"tags": {
  "ADUGroup": "<CustomTagValue>"
}
```

## Default device groups

Devices that have the Device Update agent installed and provisioned but don't have an `ADUGroup` tag in their device or module twins are automatically added to a `default` group based on their device class. Devices with the same device class are grouped together in the default groups, also called *system-assigned groups*.

Users can't delete or recreate default groups, change their definitions, or add or remove devices from default groups manually. Default group names have the format `Default-<deviceClassID>`, and are reserved within an IoT solution.

The default groups help reduce the overhead of tagging and grouping devices, to make it easier to deploy updates to untagged devices. All deployment features that are available for user-defined groups are also available for default, system-assigned groups.

## Example device group assignments

For the Contoso example, consider four devices with the following device twins:

```json
"deviceId": "Device1",
"tags": {
  "ADUGroup": "Flighting"
}
```

```json
"deviceId": "Device2",
"tags": {
  "ADUGroup": "Flighting"
}
```

```json
"deviceId": "Device3",
"tags": {
  "ADUGroup": "Evaluation"
}
```

```json
"deviceId": "Device4",
```

Device1 and Device2 are both assigned to the "Flighting" device group. Device3 is assigned to the "Evaluation" device group. Device4 has no tags so is assigned to the default device group.

## Subgroups

Device Update automatically categorizes all user-created and default groups into one or more subgroups. Subgroups help administrators manage heterogeneous devices in an organized and efficient manner by updating sets of devices that share compatibility properties.

Device Update adds devices to subgroups based on their compatibility properties and the Device Update PnP model ID, which together comprise a device class. Each device class within a group maps to one subgroup. A group can have one or more best available updates, one for each of its subgroups.

## Related content

- To learn how to create, view, and delete device group tags and assign and remove devices from groups, see [Manage device groups](create-update-group.md).
- For more information about about setting compatibility properties on the Device Update agent, see [Device Update configuration file](device-update-configuration-file.md).
