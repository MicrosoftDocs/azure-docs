---
title: Manage device groups in Azure Device Update for IoT Hub | Microsoft Docs
description: Learn how to configure device groups in Azure Device Update for IoT Hub by using device twin tags in Azure CLI or the Azure portal.
author: vimeht
ms.author: vimeht
ms.date: 01/08/2025
ms.topic: how-to
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Manage device groups in Azure Device Update for IoT Hub

You can deploy updates to your IoT devices by using the default group that Azure Device Update for IoT Hub creates, or by optionally defining groups of devices to deploy to. You can assign a user-defined tag to devices. Device Update automatically creates groups based on the assigned tags and the device compatibility properties. A group can have multiple subgroups with different device classes.

This article describes how to create and use tags to manage user-defined groups in the Azure portal or with Azure CLI. To deploy to the default group instead of creating tags and user-defined groups, see [Deploy a device update](deploy-update.md).

## Prerequisites

- A Standard (S1) or higher instance of [Azure IoT Hub](/azure/iot-hub/create-hub?tabs=portal) with [Device Update for IoT Hub enabled](create-device-update-account.md).
- An IoT device or simulator [provisioned for Device Update](device-update-agent-provisioning.md) within the IoT hub. Install and start the Device Update agent on your device either as a module- or device-level identity.
- An [imported update for the provisioned device](import-update.md).

## Tag properties and limitations

Tags have the following properties and limitations:

- You can add any value to your tag except the reserved values `Uncategorized` and `$default`.
- A device can only have one tag with the name `ADUGroup`. Adding a tag with that name overrides any existing value for tag name `ADUGroup`.
- The tag value can't exceed 200 characters.
- The tag value can contain alphanumeric characters and the following special characters: `. - _ ~`.
- Tag and group names are case-sensitive.
- A device can belong to only one group.

## Add tags to your devices

To create a device group, you add a tag to the target set of devices in IoT Hub. The devices must be connected to Device Update.

Add tags to the device twin if your Device Update agent is provisioned with device identity, or to the corresponding module twin if the Device Update agent is provisioned with a module identity. For more information and examples of twin JSON syntax, see [Understand and use device twins](../iot-hub/iot-hub-devguide-device-twins.md) or [Understand and use module twins](../iot-hub/iot-hub-devguide-module-twins.md).

Device Update tags use a key-value format as shown in the following device or module twin:

```json
"etag": "",
"deviceId": "",
"deviceEtag": "",
"version": <version>,
"tags": {
   "ADUGroup": "<CustomTagValue>"
}
```

The following sections describe several ways to add and update tags.

### Add tags with SDKs

You can update the device or module twin with the appropriate tag using RegistryManager after you enroll the device with Device Update. For more information, see the following articles:

- [Learn how to add tags using a sample .NET app.](../iot-hub/iot-hub-csharp-csharp-twin-getstarted.md).
- [Learn about tag properties and formats](../iot-hub/iot-hub-devguide-device-twins.md#tags-and-properties-format).

### Add tags using jobs

You can schedule a job on multiple devices to add or update Device Update tags. For examples of job operations, see [Schedule jobs on multiple devices](../iot-hub/iot-hub-devguide-jobs.md). You can update either device twins or module twins using jobs, depending on whether the Device Update agent is provisioned with a device or module identity. For more information, see [Schedule and broadcast jobs](../iot-hub/iot-hub-csharp-csharp-schedule-jobs.md).

> [!NOTE]
> This action counts against your IoT Hub messages quota. If you change 50,000 or more device or module twin tags at a time, you might exceed your daily IoT Hub message quota and need to buy more IoT Hub units. For more information, see [Quotas and throttling](../iot-hub/iot-hub-devguide-quotas-throttling.md).

### Add tags by updating twins

You can also add or update tags directly in device or module twins.

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.
1. Select **Devices** under **Device management** in the left navigation pane. If you have an IoT Edge device, select **IoT Edge** instead.
1. On the **Devices** page, select your device.
1. On the device page, either select **Device twin** from the top menu, or select the module identity under **Module identities** and then select the module twin.
1. In the twin, delete any existing Device Update tag value by setting it to `null`, and then select **Save**.
1. Add a new Device Update tag value as follows:

   ```JSON
       "tags": {
               "ADUGroup": "<CustomTagValue>"
               }
   ```
1. Select **Save**.

# [Azure CLI](#tab/cli)

You can use the Bash environment in [Azure Cloud Shell](/azure/cloud-shell/quickstart) to run the Azure CLI commands. Select **Launch Cloud Shell** to open Cloud Shell, or select the Cloud Shell icon in the top toolbar of the Azure portal.

:::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to launch the Azure Cloud Shell." border="false" link="https://shell.azure.com":::

>[!NOTE]
>If you prefer, you can run the Azure CLI commands locally:
>
>1. [Install Azure CLI](/cli/azure/install-azure-cli). Run [az version](/cli/azure/reference-index#az-version) to see the installed Azure CLI version and dependent libraries, and run [az upgrade](/cli/azure/reference-index#az-upgrade) to install the latest version.
>1. Sign in to Azure by running [az login](/cli/azure/reference-index#az-login).
>1. Install the `azure-iot` extension when prompted on first use. To make sure you're using the latest version of the extension, run `az extension update --name azure-iot`.

Use [az iot hub device-twin update](/cli/azure/iot/hub/device-twin#az-iot-hub-device-twin-update) or [az iot hub module-twin update](/cli/azure/iot/hub/module-twin#az-iot-hub-module-twin-update) to add the tag to the device or module twin.

For both `update` commands, the `--tags` argument accepts either inline JSON or a path to a JSON file.

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

1. Once you create a group, the compliance chart and group list update. The Device Update compliance chart shows the count of devices in various states of compliance: **On latest update**, **New updates available**, and **Updates in progress**. For more information, see [Device Update compliance.](device-update-compliance.md).

   :::image type="content" source="media/create-update-group/updated-view.png" alt-text="Screenshot of update compliance view." lightbox="media/create-update-group/updated-view.png":::

You should see existing groups and any available updates for the devices in those groups in the group list. If there are devices that don't meet the device class requirements of the group, they appear in a corresponding invalid group. You can deploy the best available update to a group from this view by selecting the **Deploy** button next to the group.

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

1. The **Group details** shows the list of devices that are part of the group along with their device update properties. You can also see the update compliance information for all devices that are members of the group. The compliance chart shows the count of devices in various states of compliance.

   :::image type="content" source="media/create-update-group/group-details.png" alt-text="Screenshot of device group details view." lightbox="media/create-update-group/group-details.png":::

1. Select an individual device within a group to go to the device details page in IoT Hub.

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
```

---

## Remove a device from a device group

To remove a device from a device group, change the group tag value to `null` in the twin, and select **Save**.

```JSON
    "tags": {
            "ADUGroup": "null"
            }
```
This action deletes the group tag from the device twin and removes the device from its device group.

## Delete a device group

Device Update automatically creates device groups, but it retains groups, device classes, and deployments for historical records or other user needs, and doesn't automatically clean them up. You can delete device groups through the Azure portal by individually selecting and deleting the desired groups, or by calling the [`az iot du device group delete`](/cli/azure/iot/du/device/group#az-iot-du-device-group-delete) API on the group.

To be deleted, a group must meet the following requirements:

- Must not be a `default` group.
- Must have no member devices. That is, no device provisioned in the Device Update instance should have a `ADUGroup` tag with a value matching the group's name.
- Must have no associated active or canceled deployments.

> [!NOTE]
> If you're unable to delete a group that meets the preceding requirements, check whether you have any *unhealthy* devices tagged as part of the group. Unhealthy devices can't receive a deployment, so they don't appear directly in the list of member devices in a group.
> 
> To check whether you have any unhealthy devices:
> 1. In the Azure portal, navigate to your IoT hub.
> 1. Select **Updates** from the left navigation and then select the **Diagnostics** tab.
> 1. Expand the **Find missing devices** section.
> 
> If you have unhealthy devices tagged as part of the group, you need to modify the tag value or delete the device before you can delete your group.

If a device is ever assigned to this deleted group name again, the group is automatically recreated, but there's no associated device or deployment history.

## Related content

- [Device groups](device-update-groups.md)
- [Device Update compliance](device-update-compliance.md)
- [Deploy an update](deploy-update.md)
