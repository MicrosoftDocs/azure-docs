---
title: Create device group in Device Update for Azure IoT Hub | Microsoft Docs
description: Create a device group in Device Update for Azure IoT Hub
author: vimeht
ms.author: vimeht
ms.date: 8/19/2022
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Create device groups in Device Update for IoT Hub

Device Update for IoT Hub allows deploying an update to a group of IoT devices. This step is optional when deploying updates to your managed devices. You can deploy updates to your devices using the default group that is created for you. Alternatively, you can assign a user-defined tag to your devices, and they will be automatically grouped based on the tag and the device compatibility properties.

> [!NOTE]
> If you would like to deploy to a default group instead of a user-created group, continue to [How to deploy an update](deploy-update.md).

## Prerequisites

* [Access to an IoT Hub with Device Update for IoT Hub enabled](create-device-update-account.md). We recommend that you use an S1 (Standard) tier or above for your IoT Hub.
* An IoT device (or simulator) provisioned for Device Update within IoT Hub.
* Install and start the [Device Update agent](device-update-agent-provisioning.md) on your IoT device either as a module- or device-level identity.
* An [imported update for the provisioned device](import-update.md).

## Add a tag to your devices  

To create a device group, the first step is to add a tag to the target set of devices in IoT Hub. Tags can only be successfully added to your device after it has been connected to Device Update.

Device Update tags use the following format:

```json
"tags": {
   "ADUGroup": "<CustomTagValue>"
}
```

For more information and examples of twin JSON syntax, see [Understand and use device twins](../iot-hub/iot-hub-devguide-device-twins.md) or [Understand and use module twins](../iot-hub/iot-hub-devguide-module-twins.md).

The following sections describe different ways to add and update tags.

### Add tags with SDKs

You can update the device or module twin with the appropriate tag using RegistryManager after enrolling the device with Device Update. For more information, see the following articles:

* [Learn how to add tags using a sample .NET app.](../iot-hub/iot-hub-csharp-csharp-twin-getstarted.md)  
* [Learn about tag properties](../iot-hub/iot-hub-devguide-device-twins.md#tags-and-properties-format).

Add tags to the device twin if your Device Update agent is provisioned with device identity, or to the corresponding module twin if the Device Update agent is provisioned with a module identity.

### Add tags using jobs

You can schedule a job on multiple devices to add or update a Device Update tag. For examples of job operations, see [Schedule jobs on multiple devices](../iot-hub/iot-hub-devguide-jobs.md). You can update either device twins or module twins using jobs, depending on whether the Device Update agent is provisioned with a device or module identity.

For more information, see [Schedule and broadcast jobs](../iot-hub/iot-hub-csharp-csharp-schedule-jobs.md).

> [!NOTE]
> This action counts against your IoT Hub messages quota. We recommend only changing up to 50,000 device or module twin tags at a time, otherwise you may need to buy more IoT Hub units if you exceed your daily IoT Hub message quota. For more information, see [Quotas and throttling](../iot-hub/iot-hub-devguide-quotas-throttling.md#quotas-and-throttling).

### Add tags by updating twins

Tags can also be added or updated directly in device or module twins.

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.

2. From **Devices** or **IoT Edge** on the left navigation pane, find your IoT device. Either navigate to the device twin or the Device Update module and then its module twin, depending on whether the Device Update agent is provisioned with a device or module identity.

3. In the twin details, delete any existing Device Update tag value by setting them to null.

4. Add a new Device Update tag value as shown below.

   ```JSON
       "tags": {
               "ADUGroup": "<CustomTagValue>"
               }
   ```

### Limitations

* You can add any value to your tag except for `Uncategorized` and `$default`, which are reserved values.
* Tag value can't exceed 200 characters.
* Tag value can contain alphanumeric characters and the following special characters: `. - _ ~`.
* Tag and group names are case-sensitive.
* A device can only have one tag with the name ADUGroup. Any additions of a tag with that name will override the existing value for tag name ADUGroup.
* One device can only belong to one group.

## Create a device group

1. In the [Azure portal](https://portal.azure.com), navigate to the IoT hub that you previously connected to your Device Update instance.

2. Select the **Updates** option under **Device Management** from the left-hand navigation bar.

3. Select the **Groups and Deployments** tab.

   :::image type="content" source="media/create-update-group/ungrouped-devices.png" alt-text="Screenshot of ungrouped devices." lightbox="media/create-update-group/ungrouped-devices.png":::

4. Groups are automatically created based on the tags assigned as well as the compatibility properties of the devices. One group can have multiple subgroups with different device classes.

5. Once a group is created, you will see that the compliance chart and group list are updated. The Device Update compliance chart shows the count of devices in various states of compliance: **On latest update**, **New updates available**, and **Updates in progress**. For more information, see [Device Update compliance.](device-update-compliance.md)

   :::image type="content" source="media/create-update-group/updated-view.png" alt-text="Screenshot of update compliance view." lightbox="media/create-update-group/updated-view.png":::

6. You should see existing groups and any available updates for the devices in those groups in the group list. If there are devices that don't meet the device class requirements of the group, they'll show up in a corresponding invalid group. You can deploy the best available update to a group from this view by selecting the **Deploy** button next to the group.

## View device details for a group

1. From the **Groups and Deployments** tab, select the name of the group that you want to view.

2. On the group details page you can see a list of devices that are part of the group along with their device update properties. In this view, you can also see the update compliance information for all devices that are members of the group. The compliance chart shows the count of devices in various states of compliance.

   :::image type="content" source="media/create-update-group/group-details.png" alt-text="Screenshot of device group details view." lightbox="media/create-update-group/group-details.png":::

3. You can also select an individual device within a group to be redirected to the device details page in IoT Hub.

   :::image type="content" source="media/create-update-group/device-details.png" alt-text="Screenshot of device details view." lightbox="media/create-update-group/device-details.png":::

## Next Steps

* [Deploy an update](deploy-update.md)

* Learn more about [device groups](device-update-groups.md)

* Learn more about [Device Update compliance](device-update-compliance.md)
