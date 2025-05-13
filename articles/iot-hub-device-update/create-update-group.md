---
title: Manage device groups for Azure Device Update for IoT Hub | Microsoft Docs
description: Learn how to configure Azure Device Update for IoT Hub device groups by using tags in the Azure portal or with Azure CLI.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 01/23/2025
ms.topic: how-to
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Manage device groups for Azure Device Update for IoT Hub

Azure Device Update for IoT Hub allows deploying updates to user-defined groups of IoT devices. Every Device Update managed device is a member of a device group, but defining device groups is optional. You can alternatively deploy to the default device group that Device Update provides.

If you create and assign user-defined Device Update tag values to devices, Device Update automatically creates groups based on the assigned tags and device compatibility properties. For each device group, Device Update can create multiple subgroups that have different device classes. Device Update places devices that have no tags in the `default` device group.

This article describes how to use the Azure portal or Azure CLI to create and manage user-defined Device Update device tags and groups. To deploy updates to user-defined or default device groups, see [Deploy a device update](deploy-update.md).

## Prerequisites

# [Azure portal](#tab/portal)

- A Standard (S1) or higher instance of [Azure IoT Hub](/azure/iot-hub/create-hub?tabs=portal) with [Device Update for IoT Hub enabled](create-device-update-account.md).
- An IoT device or simulator [provisioned for Device Update](device-update-agent-provisioning.md) within the IoT hub.
- The Device Update agent installed and started on the device either as a module- or device-level identity.
- An [imported update for the provisioned device](import-update.md).

# [Azure CLI](#tab/cli)

- A Standard (S1) or higher instance of [Azure IoT Hub](/azure/iot-hub/create-hub?tabs=portal) with [Device Update for IoT Hub enabled](create-device-update-account.md).
- An IoT device or simulator [provisioned for Device Update](device-update-agent-provisioning.md) within the IoT hub.
- The Device Update agent installed and started on the device either as a module- or device-level identity.
- An [imported update for the provisioned device](import-update.md).
- The Bash environment in [Azure Cloud Shell](/azure/cloud-shell/quickstart) to run the Azure CLI commands. Select **Launch Cloud Shell** to open Cloud Shell, or select the Cloud Shell icon in the top toolbar of the Azure portal.

  :::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to launch the Azure Cloud Shell." border="false" link="https://shell.azure.com":::

  >[!NOTE]
  >If you prefer, you can run the Azure CLI commands locally:
  >
  >1. [Install Azure CLI](/cli/azure/install-azure-cli). Run [az version](/cli/azure/reference-index#az-version) to see the installed Azure CLI version and dependent libraries, and run [az upgrade](/cli/azure/reference-index#az-upgrade) to install the latest version.
  >1. Sign in to Azure by running [az login](/cli/azure/reference-index#az-login).
  >1. Install the `azure-iot` extension when prompted on first use. To make sure you're using the latest version of the extension, run `az extension update --name azure-iot`.

---

## Add tags to your devices

To assign a Device Update device group, you add the `ADUGroup` tag to a target set of Device Update connected devices in IoT Hub. Add the tag to the device twin if your Device Update agent is provisioned with device identity, or to the corresponding module twin if the Device Update agent is provisioned with a module identity.

The Device Update `ADUGroup` tag uses a key-value format, as shown in the following device or module twin example:

```json
"etag": "",
"deviceId": "",
"deviceEtag": "",
"version": <version>,
"tags": {
   "ADUGroup": "<CustomTagValue>"
}
```

 For more information and examples of twin JSON syntax, see [Understand and use device twins](../iot-hub/iot-hub-devguide-device-twins.md) or [Understand and use module twins](../iot-hub/iot-hub-devguide-module-twins.md).
 
 The `ADUGroup` tag has the following properties and limitations:

- A device can only have one `ADUGroup` tag and belong to only one Device Update group at a time. Adding another tag named `ADUGroup` overrides the existing `ADUGroup` value.
- You can use any value for the tag except the reserved values `Uncategorized` and `$default`.
- The tag value can't exceed 200 characters.
- The tag value can contain alphanumeric characters and the following special characters: `. - _ ~`.
- The `ADUGroup` tag name and group name values are case-sensitive.

The following sections describe several ways to add and update the tag.

### Add tags with SDKs

You can update the device or module twin with the appropriate tag using RegistryManager after you enroll the device with Device Update. For more information, see the following articles:

- [Get started with device twins using .NET](../iot-hub/iot-hub-csharp-csharp-twin-getstarted.md)
- [Understand tags and properties format](../iot-hub/iot-hub-devguide-device-twins.md#tags-and-properties-format)

### Add tags using jobs

You can schedule jobs to add or update Device Update tags on multiple devices. For examples of job operations, see [Schedule jobs on multiple devices](../iot-hub/iot-hub-devguide-jobs.md). You can update either device twins or module twins using jobs, depending on whether the Device Update agent is provisioned with a device or module identity. For more information, see [Schedule and broadcast jobs](../iot-hub/iot-hub-csharp-csharp-schedule-jobs.md).

> [!NOTE]
> This operation counts against your IoT Hub messages quota. If you change 50,000 or more device or module twin tags at a time, you might exceed your daily IoT Hub message quota and need to buy more IoT Hub units. For more information, see [Quotas and throttling](../iot-hub/iot-hub-devguide-quotas-throttling.md).

### Add tags by updating twins

You can also add or update the `ADUGroup` tag directly in the device or module twin.

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.
1. Select **Devices** under **Device management** in the left navigation pane. If you have an IoT Edge device, select **IoT Edge** instead.
1. On the **Devices** page, select your device.
1. On the device page, either select **Device twin** from the top menu, or select the module identity under **Module identities** and then select the module twin.
1. In the twin, add the `ADUGroup` tag with a user-defined value, as follows. To update an existing `ADUGroup` tag value, overwrite it with a different user-defined value.

   ```JSON
       "tags": {
               "ADUGroup": "<CustomTagValue>"
               }
   ```
1. Select **Save**.

# [Azure CLI](#tab/cli)

Use [az iot hub device-twin update](/cli/azure/iot/hub/device-twin#az-iot-hub-device-twin-update) or [az iot hub module-twin update](/cli/azure/iot/hub/module-twin#az-iot-hub-module-twin-update) to add the `ADUGroup` tag to the device or module twin with an appropriate value. For both `update` commands, the `--tags` argument accepts either inline JSON or a path to a JSON file.

For example:

```azurecli
az iot hub module-twin update \
    --hub-name <IoT hub name> \
    --device-id <device name> \
    --module-id <module name> \
    --tags '{"ADUGroup": "<custom_tag_value"}'
```

---

## View device groups

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to the IoT hub connected to your Device Update instance.
1. Select the **Updates** option under **Device Management** in the left navigation.
1. Select the **Groups and Deployments** tab.

   :::image type="content" source="media/create-update-group/ungrouped-devices.png" alt-text="Screenshot of ungrouped devices." lightbox="media/create-update-group/ungrouped-devices.png":::

Once you create a group, the compliance chart and group list update. The Device Update compliance chart shows the count of devices in various states of compliance: **On latest update**, **New updates available**, and **Updates in progress**. For more information, see [Device Update compliance](device-update-compliance.md).

Existing Device Update groups and any available updates for the devices in those groups appear in the group list. Any devices that don't meet the device class requirements of the group appear in a corresponding invalid group. You can deploy the best available update to a group from this view by selecting **Deploy** next to the group.

:::image type="content" source="media/create-update-group/updated-view.png" alt-text="Screenshot of update compliance view." lightbox="media/create-update-group/updated-view.png":::

# [Azure CLI](#tab/cli)

Use [az iot du device group list](/cli/azure/iot/du/device/group#az-iot-du-device-group-list) to view all the device groups in a Device Update instance.

```azurecli
az iot du device group list \
    --account <Device Update account name> \
    --instance <Device Update instance name>
```

You can use the `--order-by` argument to order the returned list by aspects like group ID, count of devices, or count of subgroups with new updates available.

---

## View device details for a group

# [Azure portal](#tab/portal)

1. From the **Groups and Deployments** tab, select the name of the group.

   The **Group details** page shows the update compliance chart with the count of group member devices in various states of compliance, and the list of group member devices with their device update properties.

   :::image type="content" source="media/create-update-group/group-details.png" alt-text="Screenshot of device group details view." lightbox="media/create-update-group/group-details.png":::

1. Select an individual device within a group to go to its device details page in IoT Hub.

   :::image type="content" source="media/create-update-group/device-details.png" alt-text="Screenshot of device details view." lightbox="media/create-update-group/device-details.png":::

   :::image type="content" source="media/create-update-group/device-details-2.png" alt-text="Screenshot of device details view in IoT hub." lightbox="media/create-update-group/device-details-2.png":::

# [Azure CLI](#tab/cli)

Use [az iot du device group show](/cli/azure/iot/du/device/group#az-iot-du-device-group-show) to view details of a specific device group.

- The optional `--best-updates` flag returns a list of the best available updates for the device group, including a count of how many devices need each update.

- The optional `--update-compliance` flag returns compliance information for the device group, including how many devices are on their latest update, need new updates, or have updates in progress.

```azurecli
az iot du device group show \
    --account <Device Update account name> \
    --instance <Device Update instance name> \
    --group-id <value of the ADUGroup tag for this group>
    --best-updates
    --update-compliance
```

---

## Remove a device from a device group

To remove a device from a device group, change the `ADUGroup` tag value to `null` in the twin, and select **Save**.

```JSON
    "tags": {
            "ADUGroup": "null"
            }
```
This action deletes the group tag from the device twin and removes the device from the device group.

## Delete a device group

Device Update automatically creates device groups, and it retains device groups, device classes, and deployments for historical records or other user needs, rather than automatically cleaning them up. You can delete device groups through the Azure portal by individually selecting and deleting the groups, or by calling the [`az iot du device group delete`](/cli/azure/iot/du/device/group#az-iot-du-device-group-delete) Azure CLI command on the group.

To be deleted, a group must meet the following requirements:

- Must not be a `default` group.
- Must have no member devices. That is, no device provisioned in the Device Update instance can have an `ADUGroup` tag with a value matching the group's name.
- Must have no associated active or canceled deployments.

>[!NOTE]
>If you're unable to delete a group that meets the preceding requirements, check whether you have any *unhealthy* devices tagged as part of the group. Unhealthy devices can't receive a deployment, so they don't appear directly in the list of member devices in a group.
>
>To check whether you have any unhealthy devices:
>1. In the Azure portal, navigate to your IoT hub.
>1. Select **Updates** from the left navigation and then select the **Diagnostics** tab.
>1. Expand the **Find missing devices** section.
>   
>   If you have unhealthy devices tagged as part of the group, you must change the tag value or delete the device before you can delete the group.

If a device is ever assigned to a deleted group name again, Device Update automatically recreates the group, but there's no associated device or deployment history.

## Related content

- [Device groups](device-update-groups.md)
- [Device Update compliance](device-update-compliance.md)
- [Deploy an update](deploy-update.md)
