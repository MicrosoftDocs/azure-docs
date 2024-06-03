---
title: Device Update for Azure IoT Hub agent check | Microsoft Docs
description: Device Update for IoT Hub uses Agent Check to find and diagnose missing devices.
author: vimeht
ms.author: vimeht
ms.date: 10/31/2022
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Find and fix devices missing from Device Update for IoT Hub using agent check

Learn how to use the **agent check** feature to find, diagnose, and fix devices missing from your Device Update for IoT Hub instance.

## Prerequisites

* Access to [an IoT Hub with Device Update for IoT Hub enabled](create-device-update-account.md).
* An IoT device (or simulator) [provisioned for Device Update](device-update-agent-provisioning.md) and reporting a compatible Plug and Play (PnP) model ID.

> [!NOTE]
> The agent check feature can only perform validation checks on devices that have the Device Update agent installed and are reporting a PnP model ID that matches those compatible with Device Update for IoT Hub.

# [Azure portal](#tab/portal)

Supported browsers:

* [Microsoft Edge](https://www.microsoft.com/edge)
* Google Chrome

# [Azure CLI](#tab/cli)

An Azure CLI environment:

* Use the Bash environment in [Azure Cloud Shell](../cloud-shell/quickstart.md).

  :::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to launch the Azure Cloud Shell." border="false" link="https://shell.azure.com":::

* Or, if you prefer to run CLI reference commands locally, [install the Azure CLI](/cli/azure/install-azure-cli)

  1. Sign in to the Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.
  2. Run [az version](/cli/azure/reference-index#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index#az-upgrade).
  3. When prompted, install Azure CLI extensions on first use. The commands in this article use the **azure-iot** extension. Run `az extension update --name azure-iot` to make sure you're using the latest version of the extension.

---

## Validation checks supported by agent check

The agent check feature currently performs the following validation checks on all devices that meet the above pre-requisites.

| Validation check | Criteria |
|---|---|
| PnP model ID | The PnP model ID is a string that is reported by the Device Update agent to the device twin that describes what PnP model should be used for device/cloud communication. This string must be a valid digital twin model identifier (DTMI) that supports the Device Update interface. |
| Interface ID | The interface ID is a string that is reported by the Device Update agent to the device twin that describes what Device Update interface version should be used for device/cloud communication. This string must be a valid DTMI that supports the Device Update interface. |
| Compatibility property names | `CompatPropertyNames` is a field reported by the Device Update agent to the device twin that describes what `deviceProperties` fields should be used to determine the device’s compatibility with a given deployment. This field's value must be a string of comma-delimited names. The string must contain at least one and no more than five names. Each name must be <32 characters. |
| Compatibility property values | Compatibility property values are the field:value pairs specified by the `compatPropertyNames` field and reported by the Device Update agent to the device twin as `deviceProperties`. Every name defined in compatibility property names must have a corresponding field:value pair reported. The value for each pair is limited to 64 characters. |
| ADU group | The ADU Group tag is an optional tag that is defined in the device’s device twin and determines what device group the device belongs to. If specified, the tag string is limited to 255 characters and may only contain alphanumeric characters and the following special characters: "." "-" "_" "~" |

If a device fails any of these criteria, it may not show up properly in Device Update. Correcting the invalid value to meet the specified criteria should cause the device to properly appear in Device Update. If the device doesn't show up in Device Update **nor** in agent check, you may need to run device sync to resolve the issue.

## View agent check results

# [Azure portal](#tab/portal)

The results of agent check can be found in the diagnostics tab of Device Update.

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.
1. Select **Updates** from the navigation menu, then select the **Diagnostics** tab.
1. Expand the **Find missing devices** section.

# [Azure CLI](#tab/cli)

Use [az iot du device health list](/cli/azure/iot/du/device/health#az-iot-du-device-health-list) to view the health of your devices.

The `device health list` command takes the following arguments:

* `--account`: The name of the Device Update account.
* `--instance`: The name of the Device Update instance.
* `--filter`: A device health filter, either filtering on device state or device ID. For example:
  * To list all healthy devices, filter by `state eq 'Healthy'`
  * To list all unhealthy devices, filter by `state eq 'Unhealthy'`
  * To show the health state of a target device, filter by `deviceId eq '<device_name>'` or `deviceId eq '<device_name>' and moduleId eq '<module_name>'`

```azurecli
az iot du device health list --account <Device Update account name> --instance <Device Update instance name> --filter "<filter query>"
```

---

## Initiate a device sync operation

Device sync should be triggered if a device has been registered in IoT hub but isn't showing up in Device Update nor in agent check results.

Only one device sync operation may be active at a time for each Device Update instance.

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.
1. Select **Updates** from the navigation menu, then select the **Diagnostics** tab.
1. Expand the **View device health section**.
1. Select **Start a device sync**.

# [Azure CLI](#tab/cli)

Use [az iot du device import](/cli/azure/iot/du/device#az-iot-du-device-import) to import devices and modules to the Device Update instance from a linked IoT hub.

```azurecli
az iot du device import --account <Device Update account name> --instance <Device Update instance name>
```

---

## Next steps

To learn more about Device Update's diagnostic capabilities, see [Device update diagnostic feature overview](device-update-diagnostics.md)
