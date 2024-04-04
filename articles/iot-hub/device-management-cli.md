---
title: Device management using direct methods (CLI)
titleSuffix: Azure IoT Hub
description: How to use Azure IoT Hub direct methods with the Azure CLI for device management tasks including invoking a remote device reboot.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.devlang: azurecli
ms.topic: how-to
ms.date: 01/30/2023
ms.custom:  "mqtt, devx-track-azurecli"
---

# Get started with device management (Azure CLI)

[!INCLUDE [iot-hub-selector-dm-getstarted](../../includes/iot-hub-selector-dm-getstarted.md)]

Back-end apps can use Azure IoT Hub primitives, such as [device twins](iot-hub-devguide-device-twins.md) and [direct methods](iot-hub-devguide-direct-methods.md), to remotely start and monitor device management actions on devices. This article shows you how Azure CLI and a device can work together to invoke a direct method for a device using IoT Hub.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

Use a direct method to initiate device management actions (such as reboot, factory reset, and firmware update) from an Azure CLI session. The device is responsible for:

* Handling the method request sent from IoT Hub.

* Initiating the corresponding device-specific action on the device.

* Providing status updates through *reported properties* to IoT Hub.

You can use Azure CLI to run device twin queries to report on the progress of your device management actions. For more information about using direct methods, see [Cloud-to-device communication guidance](iot-hub-devguide-c2d-guidance.md).

This article shows you how to create two Azure CLI sessions:

* A session that creates a simulated device. The simulated device is configured to return a status code and JSON payload when any direct method is invoked.

* A session that invokes a direct method on the simulated device created in the other session.

## Prerequisites

* Azure CLI. You can also run the commands in this article using the [Azure Cloud Shell](../cloud-shell/overview.md), an interactive CLI shell that runs in your browser or in an app such as Windows Terminal. If you use the Cloud Shell, you don't need to install anything. If you prefer to use the CLI locally, this article requires Azure CLI version 2.36 or later. Run `az --version` to find the version. To locally install or upgrade Azure CLI, see [Install Azure CLI](/cli/azure/install-azure-cli).

* An IoT hub. Create one with the [CLI](iot-hub-create-using-cli.md) or the [Azure portal](iot-hub-create-through-portal.md).

* Make sure that port 8883 is open in your firewall. The device sample in this article uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../iot/iot-mqtt-connect-to-iot-hub.md#connecting-to-iot-hub).

## Prepare the Cloud Shell

If you want to use the Azure Cloud Shell, you must first launch and configure it. If you use the CLI locally, skip to the [Prepare two CLI sessions](#prepare-two-cli-sessions) section.

1. Select the **Cloud Shell** icon from the page header in the Azure portal.

    :::image type="content" source="./media/device-management-cli/cloud-shell-button.png" alt-text="Screenshot of the global controls from the page header of the Azure portal, highlighting the Cloud Shell icon.":::

    > [!NOTE]
    > If this is the first time you've used the Cloud Shell, it prompts you to create storage, which is required to use the Cloud Shell.  Select a subscription to create a storage account and Microsoft Azure Files share.

2. Use the environment selector in the Cloud Shell toolbar to select your preferred CLI environment. This article uses the **Bash** environment. You can also use the **PowerShell** environment. 

    > [!NOTE]
    > Some commands require different syntax or formatting in the **Bash** and **PowerShell** environments.  For more information, see [Tips for using the Azure CLI successfully](/cli/azure/use-cli-effectively?tabs=bash%2Cbash2).

    :::image type="content" source="./media/device-management-cli/cloud-shell-environment.png" alt-text="Screenshot of an Azure Cloud Shell window, highlighting the environment selector in the toolbar.":::

## Prepare two CLI sessions

Next, you must prepare two Azure CLI sessions. If you're using the Cloud Shell, you run these sessions in separate Cloud Shell tabs. If using a local CLI client, you run separate CLI instances. Use the separate CLI sessions for the following tasks:
- The first session simulates an IoT device that communicates with your IoT hub. 
- The second session invokes a direct method from your simulated device using your IoT hub. 

> [!NOTE]
> Azure CLI requires you to be logged into your Azure account. If you're using the Cloud Shell, you're automatically logged into your Azure account. If you're using a local CLI client, you must log into each CLI session. All communication between your Azure CLI shell session and your IoT hub is authenticated and encrypted. As a result, this article doesn't need extra authentication that you'd use with a real device, such as a connection string. For more information about logging in with Azure CLI, see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

1. In the first CLI session, run the [az extension add](/cli/azure/extension#az-extension-add) command. The command adds the Microsoft Azure IoT Extension for Azure CLI to your CLI shell. The extension adds IoT Hub, IoT Edge, and IoT Device Provisioning Service (DPS) specific commands to Azure CLI. After you install the extension, you don't need to install it again in any Cloud Shell session.

   ```azurecli
   az extension add --name azure-iot
   ```

   [!INCLUDE [iot-hub-cli-version-info](../../includes/iot-hub-cli-version-info.md)]

1. Open the second CLI session.  If you're using the Cloud Shell in a browser, select the **Open new session** icon on the toolbar of your first CLI session. If using the CLI locally, open a second CLI instance.

    :::image type="content" source="media/device-management-cli/cloud-shell-new-session.png" alt-text="Screenshot of an Azure Cloud Shell window, highlighting the Open New Session icon in the toolbar.":::

## Create and simulate a device

In this section, you create a device identity for your IoT hub in the first CLI session, and then simulate a device using that device identity. The simulated device responds to the direct methods that you invoke in the second CLI session.

To create and start a simulated device:

1. In the first CLI session, run the [az iot hub device-identity create](/cli/azure/iot/hub/device-identity#az-iot-hub-device-identity-create) command, replacing the following placeholders with their corresponding values. This command creates the device identity for your simulated device.

    *{DeviceName}*. The name of your simulated device.

    *{HubName}*. The name of your IoT hub.

    ```azurecli
    az iot hub device-identity create --device-id {DeviceName} --hub-name {HubName} 
    ```

1. In the first CLI session, run the [az iot device simulate](/cli/azure/iot/device#az-iot-device-simulate) command, replacing the following placeholders with their corresponding values. This command simulates a device using the device identity that you created in the previous step. The simulated device is configured to return a status code and payload whenever a direct method is invoked. 

    *{DeviceName}*. The name of your simulated device.

    *{HubName}*. The name of your IoT hub.
    
    ```azurecli
    az iot device simulate --device-id {DeviceName} --hub-name {HubName} \
                           --method-response-code 201 \
                           --method-response-payload '{"result":"Direct method successful"}'
    ```

    > [!TIP]
    > By default, the [az iot device simulate](/cli/azure/iot/device#az-iot-device-simulate) command sends 100 device-to-cloud messages with an interval of 3 seconds between messages. The simulation ends after all messages have been sent. If you want the simulation to run longer, you can use the `--msg-count` parameter to specify more messages or the `--msg-interval` parameter to specify a longer interval between messages. You can also run the command again to restart the simulated device. 

## Invoke a direct method

In this section, you use the second CLI session to invoke a direct method on the simulated device running in the first CLI session.

1. Confirm that the simulated device in the first CLI session is running.  If not, restart it by running the [az iot device simulate](/cli/azure/iot/device#az-iot-device-simulate) command again from [Create and simulate a device](#create-and-simulate-a-device).

1. In the second CLI session, run the [az iot hub invoke-device-method](/cli/azure/iot/hub#az-iot-hub-invoke-device-method) command, replacing the following placeholders with their corresponding values. In this example, there's no pre-existing method for the device. The command calls an example method name on the simulated device. The method provides a status code and payload in its response.

    *{DeviceName}*. The name of your simulated device.

    *{HubName}*. The name of your IoT hub.

    *{MethodName}*. The name of your direct method. The simulated device doesn't have a pre-existing method, so you can choose any name you want for this command.

    ```azurecli
    az iot hub invoke-device-method --device-id {DeviceName} --hub-name {HubName} \
                                    --method-name {MethodName}
    ```
    
1. In the first CLI session, confirm that the output shows the method invocation. In the following screenshot, we used `SampleDevice` and `SampleMethod` for the `{DeviceName}` and `{MethodName}` placeholders, respectively, in the `az iot hub invoke-device-method` CLI command. 

    :::image type="content" source="./media/cli-cli-device-management-get-started/direct-method-receive-invocation.png" alt-text="Screenshot of a simulated device displaying output after a method was invoked.":::

1. In the second CLI session, confirm that the output shows the status code and payload received from the invoked method. 

    :::image type="content" source="./media/cli-cli-device-management-get-started/direct-method-receive-payload.png" alt-text="Screenshot of an Azure Cloud Shell window displaying the status code and payload of an invoked direct method.":::

## Invoke a direct method with a payload

In this section, you use the second CLI session to invoke a direct method and provide a payload to the simulated device running in the first CLI session. 

1. Confirm that the simulated device in the first CLI session is running.  If not, restart it by running the [az iot device simulate](/cli/azure/iot/device#az-iot-device-simulate) command again from [Create and simulate a device](#create-and-simulate-a-device).

1. In the second CLI session, run the [az iot hub invoke-device-method](/cli/azure/iot/hub#az-iot-hub-invoke-device-method) command, replacing the following placeholders with their corresponding values. In this example, there's no pre-existing method for the device. The command calls an example method name on the simulated device and provides a payload for that method. The method provides a status code and payload in its response.

    *{DeviceName}*. The name of your simulated device.

    *{HubName}*. The name of your IoT hub.

    *{MethodName}*. The name of your direct method. The simulated device doesn't have a pre-existing method, so you can choose any name you want for this command.
    
    ```azurecli
    az iot hub invoke-device-method --device-id {DeviceName} --hub-name {HubName} \
                                    --method-name {MethodName} \
                                    --method-payload '{ "SamplePayload": "PayloadValue" }'
    ```

1. In the first CLI session, confirm that the output shows the method invocation. In the following screenshot, we used `SampleDevice` and `SampleMethod` for the `{DeviceName}` and `{MethodName}` placeholders, respectively, in the `az iot hub invoke-device-method` CLI command. 

    :::image type="content" source="./media/cli-cli-device-management-get-started/direct-method-receive-invocation-payload.png" alt-text="Screenshot of a simulated device displaying output after a method was invoked with a payload.":::

1. In the second CLI session, confirm that the output shows the status code and payload received from the invoked method. 

    :::image type="content" source="./media/cli-cli-device-management-get-started/direct-method-receive-payload.png" alt-text="Screenshot of an Azure Cloud Shell window displaying the status code and payload of an invoked direct method.":::

## Next steps

To learn how to use Azure CLI to extend your IoT solution and schedule method invocations on devices, see [Schedule and broadcast jobs](schedule-jobs-cli.md).

To continue getting started with IoT Hub and device management patterns, such as end-to-end image-based update, see [Device Update for Azure IoT Hub article using the Raspberry Pi 3 B+ Reference Image](../iot-hub-device-update/device-update-raspberry-pi.md).