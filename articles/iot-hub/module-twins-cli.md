---
title: Get started with module identity and module twins (CLI)
titleSuffix: Azure IoT Hub
description: Learn how to create Azure IoT Hub module identities and update module twin properties using the Azure CLI.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.date: 02/17/2023
ms.devlang: azurecli
ms.topic: how-to
ms.custom: mqtt, devx-track-azurecli
---

# Get started with IoT Hub module identities and module twins using Azure CLI

[!INCLUDE [iot-hub-selector-module-twin-getstarted](../../includes/iot-hub-selector-module-twin-getstarted.md)]

[Module identities and module twins](iot-hub-devguide-module-twins.md) are similar to Azure IoT Hub device identities and device twins, but provide finer granularity. Just as Azure IoT Hub device identities and device twins enable a back-end application to configure a device and provide visibility on the device's conditions, module identities and module twins provide these capabilities for the individual components of a device. On capable devices with multiple components, such as operating system devices or firmware devices, module identities and module twins allow for isolated configuration and conditions for each component.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

This article shows you how to create an Azure CLI session in which you:

* Create a device identity, then create a module identity for that device.

* Update a set of desired properties for the module twin associated with the module identity.

## Prerequisites

* Azure CLI. You can also run the commands in this article using the [Azure Cloud Shell](../cloud-shell/overview.md), an interactive CLI shell that runs in your browser or in an app such as Windows Terminal. If you use the Cloud Shell, you don't need to install anything. If you prefer to use the CLI locally, this article requires Azure CLI version 2.36 or later. Run `az --version` to find the version. To locally install or upgrade Azure CLI, see [Install Azure CLI](/cli/azure/install-azure-cli).

* An IoT hub. Create one with the [CLI](iot-hub-create-using-cli.md) or the [Azure portal](iot-hub-create-through-portal.md).

* Make sure that port 8883 is open in your firewall. The samples in this article use MQTT protocol, which communicates over port 8883. This port can be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../iot/iot-mqtt-connect-to-iot-hub.md#connecting-to-iot-hub).

## Module authentication

You can use symmetric keys or X.509 certificates to authenticate module identities. For X.509 certificate authentication, the module's certificate *must* have its common name (CN) formatted like `CN=<deviceid>/<moduleid>`. For example:

```bash
openssl req -new -key d1m1.key.pem -out d1m1.csr -subj "/CN=device01\/module01"
```

## Prepare the Cloud Shell

If you want to use the Azure Cloud Shell, you must first launch and configure it. If you use the CLI locally, skip to the [Prepare a CLI session](#prepare-a-cli-session) section.

1. Select the **Cloud Shell** icon from the page header in the Azure portal.

    :::image type="content" source="./media/module-twins-cli/cloud-shell-button.png" alt-text="Screenshot of the global controls from the page header of the Azure portal, highlighting the Cloud Shell icon.":::

    > [!NOTE]
    > If this is the first time you've used the Cloud Shell, it prompts you to create storage, which is required to use the Cloud Shell.  Select a subscription to create a storage account and Microsoft Azure Files share.

2. Use the environment selector in the Cloud Shell toolbar to select your preferred CLI environment. This article uses the **Bash** environment. You can also use the **PowerShell** environment. 

    > [!NOTE]
    > Some commands require different syntax or formatting in the **Bash** and **PowerShell** environments.  For more information, see [Tips for using the Azure CLI successfully](/cli/azure/use-cli-effectively?tabs=bash%2Cbash2).

    :::image type="content" source="./media/module-twins-cli/cloud-shell-environment.png" alt-text="Screenshot of an Azure Cloud Shell window, highlighting the environment selector in the toolbar.":::

## Prepare a CLI session

Next, you must prepare an Azure CLI session. If you're using the Cloud Shell, you run the session in a Cloud Shell tab. If using a local CLI client, you run the session in a CLI instance. 

1. If you're using the Cloud Shell, skip to the next step. Otherwise, run the [az login](/cli/azure/reference-index#az-login) command in the CLI session to sign in to your Azure account.

   If you're using the Cloud Shell, you're automatically signed into your Azure account. All communication between your Azure CLI session and your IoT hub is authenticated and encrypted. As a result, this article doesn't need extra authentication that you'd use with a real device, such as a connection string. For more information about signing in with Azure CLI, see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

   ```azurecli
   az login
   ```

1. In the CLI session, run the [az extension add](/cli/azure/extension#az-extension-add) command. The command adds the Microsoft Azure IoT Extension for Azure CLI to your CLI shell. The extension adds IoT Hub, IoT Edge, and IoT Device Provisioning Service (DPS) specific commands to Azure CLI. After you install the extension, you don't need to install it again in any Cloud Shell session.

   ```azurecli
   az extension add --name azure-iot
   ```

   [!INCLUDE [iot-hub-cli-version-info](../../includes/iot-hub-cli-version-info.md)]

## Create a device identity and module identity

In this section, you create a device identity for your IoT hub in the CLI session, and then create a module identity using that device identity. You can create up to 50 module identities under each device identity.

To create a device identity and module identity:

1. In the CLI session, run the [az iot hub device-identity create](/cli/azure/iot/hub/device-identity#az-iot-hub-device-identity-create) command, replacing the following placeholders with their corresponding values. This command creates the device identity for your module.

    *{DeviceName}*. The name of your device.

    *{HubName}*. The name of your IoT hub.

    ```azurecli
    az iot hub device-identity create --device-id {DeviceName} --hub-name {HubName} 
    ```

1. In the CLI session, run the [az iot hub module-identity create](/cli/azure/iot/hub/module-identity#az-iot-hub-module-identity-create) command, replacing the following placeholders with their corresponding values. This command creates the module identity for your module, under the device identity you created in the previous step.

    *{DeviceName}*. The name of your device.

    *{HubName}*. The name of your IoT hub.

    *{ModuleName}*. The name of your device's module.

    ```azurecli
    az iot hub module-identity create --device-id {DeviceName} --hub-name {HubName} \
                                      --module-id {ModuleName}
    ```

## Update the module twin

Once a module identity is created, a module twin is implicitly created in IoT Hub. In this section, you use the CLI session to update a set of desired properties on the module twin associated with the module identity you created in the previous section.

1. In the CLI session, run the [az iot hub module-twin update](/cli/azure/iot/hub/module-twin#az-iot-hub-module-twin-update) command, replacing the following placeholders with their corresponding values. In this example, we're updating multiple desired properties on the module twin for the module identity we created in the previous section.

    *{DeviceName}*. The name of your device.

    *{HubName}*. The name of your IoT hub.

    *{ModuleName}*. The name of your device's module.

    ```azurecli
    az iot hub module-twin update --device-id {DeviceName} --hub-name {HubName} \
                                  --module-id {ModuleName} \
                                  --desired '{"conditions":{"temperature":{"warning":75, "critical":100}}}'
    ```

1. In the CLI session, confirm that the JSON response shows the results of the update operation. In the following JSON response example, we used `SampleDevice` and `SampleModule` for the `{DeviceName}` and `{ModuleName}` placeholders, respectively, in the `az iot hub module-twin update` CLI command. 

    ```json
    {
      "authenticationType": "sas",
      "capabilities": null,
      "cloudToDeviceMessageCount": 0,
      "connectionState": "Disconnected",
      "deviceEtag": "Mzg0OEN1NzW=",
      "deviceId": "SampleDevice",
      "deviceScope": null,
      "etag": "AAAAAAAAAAI=",
      "lastActivityTime": "0001-01-01T00:00:00+00:00",
      "modelId": "",
      "moduleId": "SampleModule",
      "parentScopes": null,
      "properties": {
        "desired": {
          "$metadata": {
            "$lastUpdated": "2023-02-17T21:26:10.5835633Z",
            "$lastUpdatedVersion": 2,
            "conditions": {
              "$lastUpdated": "2023-02-17T21:26:10.5835633Z",
              "$lastUpdatedVersion": 2,
              "temperature": {
                "$lastUpdated": "2023-02-17T21:26:10.5835633Z",
                "$lastUpdatedVersion": 2,
                "critical": {
                  "$lastUpdated": "2023-02-17T21:26:10.5835633Z",
                  "$lastUpdatedVersion": 2
                },
                "warning": {
                  "$lastUpdated": "2023-02-17T21:26:10.5835633Z",
                  "$lastUpdatedVersion": 2
                }
              }
            }
          },
          "$version": 2,
          "conditions": {
            "temperature": {
              "critical": 100,
              "warning": 75
            }
          }
        },
        "reported": {
          "$metadata": {
            "$lastUpdated": "0001-01-01T00:00:00Z"
          },
          "$version": 1
        }
      },
      "status": "enabled",
      "statusReason": null,
      "statusUpdateTime": "0001-01-01T00:00:00+00:00",
      "tags": null,
      "version": 3,
      "x509Thumbprint": {
        "primaryThumbprint": null,
        "secondaryThumbprint": null
      }
    }
    ```

## Next steps

To learn how to use Azure CLI to extend your IoT solution and schedule updates on devices, see [Schedule and broadcast jobs](schedule-jobs-cli.md).

To continue getting started with IoT Hub and device management patterns, such as end-to-end image-based update, see [Device Update for Azure IoT Hub article using the Raspberry Pi 3 B+ Reference Image](../iot-hub-device-update/device-update-raspberry-pi.md).