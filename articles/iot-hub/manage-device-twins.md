---
title: How to manage devices and modules using twins
titleSuffix: Azure IoT Hub
description: Use the Azure portal and Azure CLI to query and update device twins and module twins in your Azure IoT hub.
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: how-to
ms.date: 08/13/2024
ms.author: kgremban 
ms.custom: devx-track-portal, devx-track-azurecli
---

# How to view and update devices based on device twin properties

Use the Azure portal and Azure CLI to manage devices through device twins and module twins. This article focuses on device twins for simplicity, but all of the concepts and processes work in a similar way for module twins.

This article describes device twin management tasks available in the Azure portal or Azure CLI to manage device twins remotely. For information about developing device applications to handle device twin changes, see [Get started with device twins](./device-twins-dotnet.md).

In IoT Hub, a *device twin* is a JSON document that stores state information. Every *device identity* is automatically associated with a device twin when it's created. A backend app or user can update two elements of a device twin:

* *Desired properties*: Desired properties are half of a linked set of state information. A backend app or user can update the desired properties on a twin to communicate a desired state change, while a device can update the *reported properties* to communicate its current state.
* *Tags*: You can use device twin tags to organize and manage devices in your IoT solutions. You can set tags for any meaningful category, like device type, location, or function.

For more information, see [Understand and use device twins in IoT Hub](./iot-hub-devguide-device-twins.md) or [Understand and use module twins in IoT Hub](./iot-hub-devguide-module-twins.md).

[!INCLUDE [iot-hub-basic](iot-hub-basic-whole.md)]

## Prerequisites

Prepare the following prerequisites before you begin.

### [Azure portal](#tab/portal)

* An IoT hub in your Azure subscription. If you don't have a hub yet, follow the steps in [Create an IoT hub](create-hub.md).

* A device registered in your IoT hub. If you don't have a device in your IoT hub, follow the steps in [Register a device](create-connect-device.md#register-a-device).

### [Azure CLI](#tab/cli)

* The Azure CLI, version 2.36 or later. To find the version, run `az --version`. To install or upgrade the Azure CLI, see [Install Azure CLI](/cli/azure/install-azure-cli).

  You can also run the commands in this article using the [Azure Cloud Shell](../cloud-shell/overview.md), an interactive CLI shell that runs in your browser or in an app such as Windows Terminal. If you use the Cloud Shell, you don't need to install anything.

* An IoT hub in your Azure subscription. If you don't have a hub yet, follow the steps in [Create an IoT hub](create-hub.md).

* A device registered in your IoT hub. If you don't have a device in your IoT hub, follow the steps in [Register a device](create-connect-device.md#register-a-device).

---

## Understand tags for device organization

Device twin tags can be used as a powerful tool to help you organize your devices. This is especially important when you have multiple kinds of devices within your IoT solutions, you can use tags to set types, locations etc. For example:

```json
{
  "deviceId": "mydevice1",
  "status": "enabled",
  "connectionState": "Connected",
  "cloudToDeviceMessageCount": 0,
  "authenticationType": "sas",
  "tags": {
    "deploymentLocation": {
      "building": "43",
      "floor": "1"
    },
    "deviceType":"HDCamera"
  },
  "properties": {
    ...
  }
}
```

## View and update device twins

Once a device identity is created, a device twin is implicitly created in IoT Hub. You can use the Azure portal or Azure CLI to retrieve the device twin of a given device. You can also add, edit, or remove tags and desired properties.

### [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.

1. In your IoT hub, select **Devices** from the **Device management** section of the navigation menu.

   On the **Devices** page, you see a list of all devices registered in your IoT hub. If any of the devices already have tags in their device twins, those are shown in the **Tags** column.

1. Select the name of the device that you want to manage.

   >[!TIP]
   >If you're updating tags, you can select multiple devices then select **Assign tags** to manage them as a group.
   >
   >:::image type="content" source="./media/manage-device-twins/multi-select-assign-tags.png" alt-text="A screenshot that shows selecting multiple devices in the Azure portal to assign tags as a group.":::

1. The device details page displays any current tags for the selected device. Select **edit** next to the **Tags** parameter to add, update, or remove tags.

   :::image type="content" source="./media/manage-device-twins/edit-tags.png" alt-text="A screenshot that shows opening the tags editing option in the Azure portal.":::

   >[!TIP]
   >To add or update nested tags, select the **Advanced** tab and provide the JSON.
   >
   >:::image type="content" source="./media/manage-device-twins/edit-tags-advanced.png" alt-text="A screenshot that shows using the advanced tags editor to provide JSON text.":::

1. Select **Device twin** to view and update the device twin JSON.

   You can type directly in the text box to update tags or desired properties. To remove a tag or desired property, set the value of the item to `null`.

1. Select **Save** to save your changes.

1. Back on the device details page, select **Refresh** to update the page to reflect your changes.

If your device has any module identities associated with it, those are displayed on the device details page as well. Select a module name, then select **Module identity twin** to view and update the module twin JSON.

### [Azure CLI](#tab/cli)

Use the [az iot hub device-twin](/cli/azure/iot/hub/device-twin) or [az iot hub module-twin](/cli/azure/iot/hub/module-twin) sets of commands to view and update twins.

The [az iot hub device-twin show](/cli/azure/iot/hub/device-twin#az-iot-hub-device-twin-show) command returns the device twin JSON. For example:

```azurecli-interactive
az iot hub device-twin show --device-id <DEVICE_ID> --hub-name <IOTHUB_NAME>
```

The [az iot hub device-twin update](/cli/azure/iot/hub/device-twin#az-iot-hub-device-twin-update) command patches tags or desired properties in a device twin. For example:

```azurecli-interactive
az iot hub device-twin update --device-id <DEVICE_ID> --hub-name <IOTHUB_NAME> --tags <INLINE_JSON_OR_PATH_TO_JSON_FILE>
```

The [az iot hub device-twin replace](/cli/azure/iot/hub/device-twin#az-iot-hub-device-twin-replace) command replaces an entire device twin. For example:

```azurecli-interactive
az iot hub device-twin replace --device-id <DEVICE_ID> --hub-name <IOTHUB_NAME> --json <INLINE_JSON_OR_PATH_TO_JSON_FILE>
```

>[!TIP]
>If you're using Powershell, add a backslash '\' to escape any double quotes. For example: `--tags '{\"country\":\"US\"}'`

---

## Query for device twins

IoT Hub exposes the device twins for your IoT hub as a document collection called **devices**. You can query devices based on their device twin values.

This section describes how to run twin queries in the Azure portal and Azure CLI. To learn how to write twin queries, see [Queries for IoT Hub device and module twins](./query-twins.md).

### [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.

1. In your IoT hub, select **Devices** from the **Device management** section of the navigation menu.

1. You can either use a filter or a query to find devices based on their device twin details:

   * **Find devices using a filter**:

     1. Finding devices using a filter is the default view in the Azure portal. If you don't see these fields, select **Find devices using a filter**.

     1. Select **Add filter**, and then select **Device tag** as the filter type from the drop-down menu.

     1. Enter the desired tag name and value, select **Apply** to retrieve the list of devices that matches the criteria.

        :::image type="content" source="./media/manage-device-twins/filter-device-twin-tags.png" alt-text="Screenshot of filtering devices with tags.":::

   * **Find devices using a query**:

     1. Select **Find devices using a query**.

     1. Enter your query into the text box, then select **Run query**.

        :::image type="content" source="./media/manage-device-twins/run-query.png" alt-text="Screenshot that shows using the device query filter in the Azure portal.":::

### [Azure CLI](#tab/cli)

Use the [az iot hub query](/cli/azure/iot/hub#az-iot-hub-query) command to return device information based on device twin or module twin queries.

```azurecli
az iot hub query --hub-name <IOTHUB_NAME> --query-command "SELECT * FROM devices WHERE <QUERY_TEXT>"
```

The same `query` command can query module twins by adjusting the query command.

```azurecli
az iot hub query --hub-name <IOTHUB_NAME> --query-command "SELECT * FROM devices.modules WHERE <QUERY_TEXT>"
```

---

## Update device twins using jobs

The *jobs* capability can executy device twin updates against a set of devices at a scheduled time. For more information, see [Schedule jobs on multiple devices](./iot-hub-devguide-jobs.md).

### [Azure portal](#tab/portal)

Jobs aren't supported in the Azure portal. Instead, use the Azure CLI.

### [Azure CLI](#tab/cli)

Use the [az iot hub job](/cli/azure/iot/hub/job) set of commands to create, view, or cancel jobs.

For example, the following command updates desired twin properties on a set of devices at a specific time:

```azurecli
az iot hub job create --job-id <JOB_NAME> --job-type scheduleUpdateTwin -n <IOTHUB_NAME> --twin-patch <INLINE_JSON_OR_PATH_TO_JSON_FILE> --start-time "<ISO_8601_DATETIME>" --query-condition "<QUERY_TEXT>"
```

>[!TIP]
>If you're using Powershell, add a backslash '\' to escape any double quotes. For example: `--tags '{\"country\":\"US\"}'`
