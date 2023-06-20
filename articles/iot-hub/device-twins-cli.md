---
title: Get started with Azure IoT Hub device twins (Azure CLI)
titleSuffix: Azure IoT Hub
description: How to use Azure IoT Hub device twins and the Azure CLI to create and simulate devices, add tags to device twins, and execute IoT Hub queries. 
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.devlang: azurecli
ms.topic: how-to
ms.date: 02/17/2023
ms.custom: "mqtt, devx-track-azurecli"
---

# Get started with device twins (Azure CLI)

[!INCLUDE [iot-hub-selector-twin-get-started](../../includes/iot-hub-selector-twin-get-started.md)]

This article shows you how to:

* Use a simulated device to report its connectivity channel as a *reported property* on the device twin.

* Query devices using filters on the tags and properties previously created.

For more information about using device twin reported properties, see [Device-to-cloud communication guidance](iot-hub-devguide-d2c-guidance.md).

This article shows you how to create two Azure CLI sessions:

* A session that creates a simulated device. The simulated device reports its connectivity channel as a reported property on the device's corresponding device twin when initialized.

* A session that updates the tags of the device twin for the simulated device, then queries devices from your IoT hub. The queries use filters based on the tags and properties previously updated in both sessions.

## Prerequisites

* Azure CLI. You can also run the commands in this article using the [Azure Cloud Shell](../cloud-shell/overview.md), an interactive CLI shell that runs in your browser or in an app such as Windows Terminal. If you use the Cloud Shell, you don't need to install anything. If you prefer to use the CLI locally, this article requires Azure CLI version 2.36 or later. Run `az --version` to find the version. To locally install or upgrade Azure CLI, see [Install Azure CLI](/cli/azure/install-azure-cli).

* An IoT hub. Create one with the [CLI](iot-hub-create-using-cli.md) or the [Azure portal](iot-hub-create-through-portal.md).

* Make sure that port 8883 is open in your firewall. The samples in this article use MQTT protocol, which communicates over port 8883. This port can be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../iot/iot-mqtt-connect-to-iot-hub.md#connecting-to-iot-hub).

## Prepare the Cloud Shell

If you want to use the Azure Cloud Shell, you must first launch and configure it. If you use the CLI locally, skip to the [Prepare two CLI sessions](#prepare-two-cli-sessions) section.

1. Select the **Cloud Shell** icon from the page header in the Azure portal.

    :::image type="content" source="./media/device-twins-cli/cloud-shell-button.png" alt-text="Screenshot of the global controls from the page header of the Azure portal, highlighting the Cloud Shell icon.":::

    > [!NOTE]
    > If this is the first time you've used the Cloud Shell, it prompts you to create storage, which is required to use the Cloud Shell.  Select a subscription to create a storage account and Microsoft Azure Files share.

2. Use the environment selector in the Cloud Shell toolbar to select your preferred CLI environment. This article uses the **Bash** environment. You can also use the **PowerShell** environment. 

    > [!NOTE]
    > Some commands require different syntax or formatting in the **Bash** and **PowerShell** environments.  For more information, see [Tips for using the Azure CLI successfully](/cli/azure/use-cli-effectively?tabs=bash%2Cbash2).

    :::image type="content" source="./media/device-twins-cli/cloud-shell-environment.png" alt-text="Screenshot of an Azure Cloud Shell window, highlighting the environment selector in the toolbar.":::

## Prepare two CLI sessions

Next, you must prepare two Azure CLI sessions. If you're using the Cloud Shell, you run these sessions in separate Cloud Shell tabs. If using a local CLI client, you run separate CLI instances. Use the separate CLI sessions for the following tasks:
- The first session simulates an IoT device that communicates with your IoT hub. 
- The second session updates your simulated device and queries your IoT hub. 

1. If you're using the Cloud Shell, skip to the next step. Otherwise, run the [az login](/cli/azure/reference-index#az-login) command in the first CLI session to sign in to your Azure account.

   If you're using the Cloud Shell, you're automatically signed into your Azure account. All communication between your Azure CLI session and your IoT hub is authenticated and encrypted. As a result, this article doesn't need extra authentication that you'd use with a real device, such as a connection string. For more information about signing in with Azure CLI, see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

   ```azurecli
   az login
   ```

1. In the first CLI session, run the [az extension add](/cli/azure/extension#az-extension-add) command. The command adds the Microsoft Azure IoT Extension for Azure CLI to your CLI shell. The extension adds IoT Hub, IoT Edge, and IoT Device Provisioning Service (DPS) specific commands to Azure CLI. After you install the extension, you don't need to install it again in any Cloud Shell session.

   ```azurecli
   az extension add --name azure-iot
   ```

   [!INCLUDE [iot-hub-cli-version-info](../../includes/iot-hub-cli-version-info.md)]

1. Open the second CLI session.  If you're using the Cloud Shell in a browser, select the **Open new session** icon on the toolbar of your first CLI session. If using the CLI locally, open a second CLI instance.

    :::image type="content" source="media/device-twins-cli/cloud-shell-new-session.png" alt-text="Screenshot of an Azure Cloud Shell window, highlighting the Open New Session icon in the toolbar.":::

## Create and simulate a device

In this section, you create a device identity for your IoT hub in the first CLI session, and then simulate a device using that device identity. The simulated device responds to the jobs that you schedule in the second CLI session.

To create and start a simulated device:

1. In the first CLI session, run the [az iot hub device-identity create](/cli/azure/iot/hub/device-identity#az-iot-hub-device-identity-create) command, replacing the following placeholders with their corresponding values. This command creates the device identity for your simulated device.

    *{DeviceName}*. The name of your simulated device.

    *{HubName}*. The name of your IoT hub.

    ```azurecli
    az iot hub device-identity create --device-id {DeviceName} --hub-name {HubName} 
    ```

1. In the first CLI session, run the [az iot device simulate](/cli/azure/iot/device#az-iot-device-simulate) command, replacing the following placeholders with their corresponding values. This command simulates the device you created in the previous step. The command also configures the simulated device to report its connectivity channel as a reported property on the device's corresponding device twin when initialized. 

    *{DeviceName}*. The name of your simulated device.

    *{HubName}*. The name of your IoT hub.
    
    ```azurecli
    az iot device simulate --device-id {DeviceName} --hub-name {HubName} \
                           --init-reported-properties '{"connectivity":{"type": "cellular"}}'
    ```

    > [!TIP]
    > By default, the [az iot device simulate](/cli/azure/iot/device#az-iot-device-simulate) command sends 100 device-to-cloud messages with an interval of 3 seconds between messages. The simulation ends after all messages have been sent. If you want the simulation to run longer, you can use the `--msg-count` parameter to specify more messages or the `--msg-interval` parameter to specify a longer interval between messages. You can also run the command again to restart the simulated device. 

## Update the device twin 

Once a device identity is created, a device twin is implicitly created in IoT Hub. In this section, you use the second CLI session to update a set of tags on the device twin associated with the device identity you created in the previous section. You can use device twin tags to organize and manage devices in your IoT solutions. For more information about managing devices using tags, see [How to manage devices using device twin tags in Azure IoT Hub](iot-hubs-manage-device-twin-tags.md).

1. Confirm that the simulated device in the first CLI session is running.  If not, restart it by running the [az iot device simulate](/cli/azure/iot/device#az-iot-device-simulate) command again from [Create and simulate a device](#create-and-simulate-a-device).

1. In the second CLI session, run the [az iot hub device-twin update](/cli/azure/iot/hub/device-twin#az-iot-hub-device-twin-update) command, replacing the following placeholders with their corresponding values. In this example, we're updating multiple tags on the device twin for the device identity we created in the previous section.

    *{DeviceName}*. The name of your device.

    *{HubName}*. The name of your IoT hub.

    ```azurecli
    az iot hub device-twin update --device-id {DeviceName} --hub-name {HubName} \
                                  --tags '{"location":{"region":"US","plant":"Redmond43"}}'
    ```

1. In the second CLI session, confirm that the JSON response shows the results of the update operation. In the following JSON response example, we used `SampleDevice` for the `{DeviceName}` placeholder in the `az iot hub device-twin update` CLI command. 

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
    
## Query your IoT hub for device twins

IoT Hub exposes the device twins for your IoT hub as a document collection called **devices**. In this section, you use the second CLI session to execute two queries on the set of device twins for your IoT hub: the first query selects only the device twins of devices located in the **Redmond43** plant, and the second refines the query to select only the devices that are also connected through a cellular network. Both queries return only the first 100 devices in the result set. For more information about device twin queries, see [Queries for IoT Hub device and module twins](query-twins.md).

1. Confirm that the simulated device in the first CLI session is running.  If not, restart it by running the [az iot device simulate](/cli/azure/iot/device#az-iot-device-simulate) command again from [Create and simulate a device](#create-and-simulate-a-device).

1. In the second CLI session, run the [az iot hub query](/cli/azure/iot/hub#az-iot-hub-query) command, replacing the following placeholders with their corresponding values. In this example, we're filtering the query to return only the device twins of devices located in the **Redmond43** plant.

    *{HubName}*. The name of your IoT hub.

    ```azurecli
    az iot hub query --hub-name {HubName} \
                     --query-command "SELECT * FROM devices WHERE tags.location.plant = 'Redmond43'" \
                     --top 100
    ```

1. In the second CLI session, confirm that the JSON response shows the results of the query. 

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

1. In the second CLI session, run the [az iot hub query](/cli/azure/iot/hub#az-iot-hub-query) command, replacing the following placeholders with their corresponding values. In this example, we're filtering the query to return only the device twins of devices located in the **Redmond43** plant that are also connected through a cellular network.

    *{HubName}*. The name of your IoT hub.

    ```azurecli
    az iot hub query --hub-name {HubName} \
                     --query-command "SELECT * FROM devices WHERE tags.location.plant = 'Redmond43' \
                                      AND properties.reported.connectivity.type = 'cellular'" \
                     --top 100
    ```

1. In the second CLI session, confirm that the JSON response shows the results of the query. The results of this query should match the results of the previous query in this section.

In this article, you:

* Added device metadata as tags from an Azure CLI session
* Simulated a device that reported device connectivity information in the device twin
* Queried the device twin information, using SQL-like IoT Hub query language in an Azure CLI session

## Next steps

To learn how to:

* Send telemetry from devices, see [Quickstart: Send telemetry from an IoT Plug and Play device to Azure IoT Hub](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-csharp).

* Configure devices using device twin's desired properties, see [Tutorial: Configure your devices from a back-end service](tutorial-device-twins.md).

* Control devices interactively, such as turning on a fan from a user-controlled app, see [Quickstart: Control a device connected to an IoT hub](./quickstart-control-device.md?pivots=programming-language-csharp).