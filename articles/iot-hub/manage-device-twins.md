---
title: How to manage devices and modules using twins
titleSuffix: Azure IoT Hub
description: Use the Azure portal and Azure CLI to query and update device twins and module twins in your Azure IoT hub.
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: how-to
ms.date: 11/01/2022
ms.author: kgremban 
ms.custom: devx-track-portal, devx-track-azurecli
---

# How to view and update devices based on device twin properties

Use the Azure portal and Azure CLI to manage devices through device twins and module twins. This article focuses on device twins for simplicity, but all of the concepts and processes work in a similar way for module twins.

This article describes that actions that you can take from the Azure portal or Azure CLI to manage device twins remotely. For information about developing device applications to handle device twin changes, see [Get started with device twins](./device-twins-dotnet.md).

In IoT Hub, a *device twin* is a JSON document that stores state information. Every *device identity* is automatically associated with a device twin when it's created. A backend app or user can update two elements of a device twin:

* *Desired properties*: Desired properties are half of a linked set of state information. A backend app or user can update the desired properties on a twin to communicate a desired state change, while a device can update the *reported properties* to communicate its current state.
* *Tags*: You can use device twin tags to organize and manage devices in your IoT solutions. You can set tags for any meaningful category, like device type, location, or function.

For more information, see [Understand and use device twins in IoT Hub](./iot-hub-devguide-device-twins.md) or [Understand and use module twins in IoT Hub](./iot-hub-devguide-module-twins.md).

## Prerequisites

### [Azure portal](#tab/portal)

* An IoT hub in your Azure subscription. If you don't have a hub yet, follow the steps in [Create an IoT hub](create-hub.md).

* A device registered in your IoT hub. If you don't have a device in your IoT hub, follow the steps in [Register a device](create-connect-device.md#register-a-device).

### [Azure CLI](#tab/cli)

* Azure CLI. You can also run the commands in this article using the [Azure Cloud Shell](../cloud-shell/overview.md), an interactive CLI shell that runs in your browser or in an app such as Windows Terminal. If you use the Cloud Shell, you don't need to install anything. If you prefer to use the CLI locally, this article requires Azure CLI version 2.36 or later. Run `az --version` to find the version. To locally install or upgrade Azure CLI, see [Install Azure CLI](/cli/azure/install-azure-cli).

* An IoT hub in your Azure subscription. If you don't have a hub yet, follow the steps in [Create an IoT hub](create-hub.md).

* A device registered in your IoT hub. If you don't have a device in your IoT hub, follow the steps in [Register a device](create-connect-device.md#register-a-device).

---

## Update a device twin

Once a device identity is created, a device twin is implicitly created in IoT Hub. You can use the Azure portal or Azure CLI to add, edit, or remove desired properties and tags.

### [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.
1. In your IoT hub, select **Devices** from the **Device management** section of the navigation menu.
1. Select the name of the device that you want to update.

   >[!TIP]
   >If you're updating tags, you can select multiple devices then select **Assign tags**

### [Azure CLI](#tab/cli)

1. Run the [az iot hub device-twin update](/cli/azure/iot/hub/device-twin#az-iot-hub-device-twin-update) command, replacing the following placeholders with their corresponding values. In this example, we're updating multiple tags on the device twin for the device identity we created in the previous section.

    *{DeviceName}*. The name of your device.

    *{HubName}*. The name of your IoT hub.

    ```azurecli
    az iot hub device-twin update --device-id {DeviceName} --hub-name {HubName} \
            --tags '{"location":{"region":"US","plant":"Redmond43"}}'
    ```

1. Confirm that the JSON response shows the results of the update operation. In the following JSON response example, we used `SampleDevice` for the `{DeviceName}` placeholder in the `az iot hub device-twin update` CLI command.

    ```json
    {
      "authenticationType": "sas",
      "capabilities": {
        "iotEdge": false
      },
      "cloudToDeviceMessageCount": 0,
      "connectionState": "Connected",
      "deviceEtag": "MTA2NTU1MDM2Mw==",
      "deviceId": "SampleDevice",
      "deviceScope": null,
      "etag": "AAAAAAAAAAI=",
      "lastActivityTime": "0001-01-01T00:00:00+00:00",
      "modelId": "",
      "moduleId": null,
      "parentScopes": null,
      "properties": {
        "desired": {
          "$metadata": {
            "$lastUpdated": "2023-02-21T10:40:10.5062402Z"
          },
          "$version": 1
        },
        "reported": {
          "$metadata": {
            "$lastUpdated": "2023-02-21T10:40:43.8539917Z",
            "connectivity": {
              "$lastUpdated": "2023-02-21T10:40:43.8539917Z",
              "type": {
                "$lastUpdated": "2023-02-21T10:40:43.8539917Z"
              }
            }
          },
          "$version": 2,
          "connectivity": {
            "type": "cellular"
          }
        }
      },
      "status": "enabled",
      "statusReason": null,
      "statusUpdateTime": "0001-01-01T00:00:00+00:00",
      "tags": {
        "location": {
          "plant": "Redmond43",
          "region": "US"
        }
      },
      "version": 4,
      "x509Thumbprint": {
        "primaryThumbprint": null,
        "secondaryThumbprint": null
      }
    }
    ```

---

## Query your IoT hub for device twins

IoT Hub exposes the device twins for your IoT hub as a document collection called **devices**. In this section, you execute two queries on the set of device twins for your IoT hub: the first query selects only the device twins of devices located in the **Redmond43** plant, and the second refines the query to select only the devices that are also connected through a cellular network. Both queries return only the first 100 devices in the result set. For more information about device twin queries, see [Queries for IoT Hub device and module twins](query-twins.md).


1. Run the [az iot hub query](/cli/azure/iot/hub#az-iot-hub-query) command, replacing the following placeholders with their corresponding values. In this example, we're filtering the query to return only the device twins of devices located in the **Redmond43** plant.

    *{HubName}*. The name of your IoT hub.

    ```azurecli
    az iot hub query --hub-name {HubName} \
            --query-command "SELECT * FROM devices WHERE tags.location.plant = 'Redmond43'" \
            --top 100
    ```

1. Confirm that the JSON response shows the results of the query.

    ```json
    {
      "authenticationType": "sas",
      "capabilities": {
        "iotEdge": false
      },
      "cloudToDeviceMessageCount": 0,
      "connectionState": "Connected",
      "deviceEtag": "MTA2NTU1MDM2Mw==",
      "deviceId": "SampleDevice",
      "deviceScope": null,
      "etag": "AAAAAAAAAAI=",
      "lastActivityTime": "0001-01-01T00:00:00+00:00",
      "modelId": "",
      "moduleId": null,
      "parentScopes": null,
      "properties": {
        "desired": {
          "$metadata": {
            "$lastUpdated": "2023-02-21T10:40:10.5062402Z"
          },
          "$version": 1
        },
        "reported": {
          "$metadata": {
            "$lastUpdated": "2023-02-21T10:40:43.8539917Z",
            "connectivity": {
              "$lastUpdated": "2023-02-21T10:40:43.8539917Z",
              "type": {
                "$lastUpdated": "2023-02-21T10:40:43.8539917Z"
              }
            }
          },
          "$version": 2,
          "connectivity": {
            "type": "cellular"
          }
        }
      },
      "status": "enabled",
      "statusReason": null,
      "statusUpdateTime": "0001-01-01T00:00:00+00:00",
      "tags": {
        "location": {
          "plant": "Redmond43",
          "region": "US"
        }
      },
      "version": 4,
      "x509Thumbprint": {
        "primaryThumbprint": null,
        "secondaryThumbprint": null
      }
    }
    ```

1. Run the [az iot hub query](/cli/azure/iot/hub#az-iot-hub-query) command, replacing the following placeholders with their corresponding values. In this example, we're filtering the query to return only the device twins of devices located in the **Redmond43** plant that are also connected through a cellular network.

    *{HubName}*. The name of your IoT hub.

    ```azurecli
    az iot hub query --hub-name {HubName} \
            --query-command "SELECT * FROM devices WHERE tags.location.plant = 'Redmond43' \
                    AND properties.reported.connectivity.type = 'cellular'" \
            --top 100
    ```

1. Confirm that the JSON response shows the results of the query. The results of this query should match the results of the previous query in this section.

## Use device twin tags to organize related devices

This article demonstrates how to use tags to manage IoT devices using [device twin tags](iot-hub-devguide-device-twins.md#tags-and-properties-format)

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

### Add and view device twin tags

#### [Azure portal](#tab/portal)

This section describes how to create an IoT hub using the [Azure portal](https://portal.azure.com).

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your IoT Hub.

2. Select the **Device** tab in the left navigation.

3. Select the desired devices, select **Assign Tags**.
   
   :::image type="content" source="./media/iot-hubs-manage-device-twin-tags/iot-hub-device-select-device-to-assign-tags.png" alt-text="Screenshot of selecting devices to assign tags.":::

4. In the opened view, you can see the tags the devices already have. To add a new basic tag, provide a **name** and **value** for the tag. The format for the name and value pair is found in [Tags and properties format](iot-hub-devguide-device-twins.md#tags-and-properties-format). Select **Save** to save the tag.
  
   :::image type="content" source="./media/iot-hubs-manage-device-twin-tags/iot-hub-device-add-basic-tag.png" alt-text="Screenshot of assigning tags to devices screen.":::

5. After saving, you can view the tags that were added by selecting **Assign Tags** again. 

   :::image type="content" source="./media/iot-hubs-manage-device-twin-tags/iot-hub-device-view-basic-tag.png" alt-text="Screenshot of viewing tags added to devices.":::

#### [Azure CLI](#tab/cli)

    ```azurecli
    az iot hub device-twin update -n {iothub_name} \
        -d {device_id} --tags '{"country": "USA"}'
    ```

5. Use the command on an existing tag to update the value:

    ```azurecli
    az iot hub device-twin update --name {your iot hub name} \
        -d {device_id} --tags '{"country": "Germany"}'
    ```

6. The following command removes the tag that was added by setting the value to **null**. 
    ```azurecli
    az iot hub device-twin update --name {your iot hub name} \
        -d {device_id} --tags '{"country": null}'
    ```
---

### Add and view nested tags

#### [Azure portal](#tab/portal)

1. Following the example above, you can add a nested tag by selecting the advanced tab in the **Assign Tags** and add a nested json object with two values.

   ```json
   {
	   "deploymentLocation": {
	       "building": "43",
	       "floor": "1"
	   }
   }
   ```

1. Select **Save**
   :::image type="content" source="./media/iot-hubs-manage-device-twin-tags/iot-hub-device-twin-tag-add-nested-tag.png" alt-text="Screenshot of adding nested tags to devices.":::
1. Select the devices again and select **Assign Tags** to view the newly added tags
   :::image type="content" source="./media/iot-hubs-manage-device-twin-tags/iot-hub-device-twin-tag-view-nested-tag.png" alt-text="Screenshot of viewing nested tags to devices.":::

#### [Azure CLI](#tab/cli)


4. You can add complex nested tags by importing a json file or adding json directly to the input:

    ```azurecli
    az iot hub device-twin update --name {your iot hub name} \
        -d {device_id} --tags /path/to/file
    ```

    ```azurecli
    az iot hub device-twin update --name {your iot hub name} \
        -d {device_id} --tags '{"country":{"county":"king"}}'
    ```

---

## Filter devices with device twin tags

Device twin tags is a great way to group devices by type, location etc., and you can manage your devices by filtering through device tags. 

1. Select **+ Add filter**, and select **Device Tag** as the filter type
2. Enter the desired tag name and value, select **Apply** to retrieve the list of devices that matches the criteria 
   :::image type="content" source="./media/iot-hubs-manage-device-twin-tags/iot-hub-device-twin-tag-filter.png" alt-text="Screenshot of filtering devices with tags.":::

## Update and delete device twin tags from multiple devices using the Azure portal

1. Select the two or more devices, select **Assign Tags**.
2. In the opened panel, you can update existing tags by typing the target tag name in the **Name** field, and the new string in the **Value** field.
3. To delete a tag from multiple devices, type the target tag name in the **Name** field, and the select the **Delete Tags** button. 
   :::image type="content" source="./media/iot-hubs-manage-device-twin-tags/iot-hub-device-twin-tag-bulk-delete.png" alt-text="Screenshot of marking tag for deletion.":::
4. Select **Save** to delete the tag from the devices that contains the matching tag name.
