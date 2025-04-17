---
title: Azure Device Update for IoT Hub device groups
description: Understand Azure Device Update for IoT Hub user-assigned and default device groups and subgroups based on device classes.
author: aysancag
ms.author: aysancag
ms.date: 01/23/2025
ms.topic: concept-article
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Azure Device Update for IoT Hub device groups

An Azure Device Update for IoT Hub device group is a collection of IoT devices that Device Update uses to target update deployments. All devices that have the Device Update agent installed and provisioned belong to a device group, either a default group or a user-defined group. A device can belong to only one Device Update device group at a time.

To deploy updates to your devices, you can use the default device group that Device Update provides, or you can define and assign multiple device groups to organize your devices. For example, the Contoso organization might assign the devices in its test laboratory to a "Flighting" device group and assign the devices its field team uses to an "Evaluation" device group. Contoso might also choose to group their production devices based on geographic regions, so they can update devices on a schedule that aligns with their regional timezones.

## User-defined device groups

You define device groups by using *tags*. Device Update creates user-defined groups for devices that have an `ADUGroup` tag with a user-defined value in the `"tags"` section of their device twins or module twins.

```json
"tags": {
  "ADUGroup": "<CustomTagValue>"
}
```

## Default device groups

Devices that have the Device Update agent installed and provisioned but don't have an `ADUGroup` tag in their device or module twins are automatically added to a `default` group based on their device class. Devices with the same device class are grouped together in a default group, also called a *system-assigned group*.

Users can't delete or recreate default groups, change their definitions, or add or remove devices from default groups manually. Default group names have the format `Default-<deviceClassID>`, and are reserved within an IoT solution.

Default groups help reduce the overhead of tagging and grouping devices by making it easier to deploy updates to untagged devices. All deployment features that are available for user-defined groups are also available for default, system-assigned groups.

## Example device group assignments

For the Contoso example, consider four devices with the following device IDs and tag assignments:

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

Device1 and Device2 are both assigned to the "Flighting" device group. Device3 is assigned to the "Evaluation" device group. Device4 has no `ADUGroup` tag so is assigned to the default device group.

## Subgroups

Device Update automatically categorizes all user-created and default groups into one or more subgroups. Subgroups help administrators manage heterogeneous devices in an organized and efficient manner by defining sets of devices that share compatibility properties.

Device Update adds devices to subgroups based on their compatibility properties and the Device Update PnP model ID, which together comprise a device class. Each device class within a group maps to one subgroup. A group can have one or more best available updates, one for each of its subgroups.

## Related content

- To learn how to create, view, and delete device group tags and assign and remove devices from groups, see [Manage device groups](create-update-group.md).
- To learn how to deploy updates based on device groups, see [Deploy an update](deploy-update.md).
- For more information about setting compatibility properties on the Device Update agent, see [Device Update configuration file](device-update-configuration-file.md).
