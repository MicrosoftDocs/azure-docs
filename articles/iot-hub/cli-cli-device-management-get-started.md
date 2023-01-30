---
title: Get started with Azure IoT Hub device management (.NET/.NET) | Microsoft Docs
description: How to use Azure IoT Hub device management to initiate a remote device reboot. You use the Azure CLI to implement a simulated device and invoke a direct method from that device.
author: kgremban

ms.service: iot-hub
services: iot-hub
ms.devlang: csharp
ms.topic: conceptual
ms.date: 08/20/2019
ms.author: kgremban
ms.custom:  "mqtt, devx-track-csharp"
---

# Get started with device management (.NET)

[!INCLUDE [iot-hub-selector-dm-getstarted](../../includes/iot-hub-selector-dm-getstarted.md)]

Back-end apps can use Azure IoT Hub primitives, such as [device twins](../articles/iot-hub/iot-hub-devguide-device-twins.md) and [direct methods](../articles/iot-hub/iot-hub-devguide-direct-methods.md), to remotely start and monitor device management actions on devices. This article shows you how Azure CLI and a device can work together to initiate and monitor a remote device reboot using IoT Hub.

[!INCLUDE [iot-hub-basic](iot-hub-basic-whole.md)]

Use a direct method to initiate device management actions (such as reboot, factory reset, and firmware update) from an Azure CLI session. The device is responsible for:

* Handling the method request sent from IoT Hub.

* Initiating the corresponding device-specific action on the device.

* Providing status updates through *reported properties* to IoT Hub.

You can use Azure CLI to run device twin queries to report on the progress of your device management actions.

This article shows you how to create two Azure CLI sessions:

* A session that creates a simulated device. The simulated device is configured to return a status code and JSON payload when any direct method is invoked.

* A session that creates two scheduled jobs. The first job invokes a direct method and the second job updates a desired device twin property on the simulated device created in the other session.

## Prerequisites

* Azure CLI. You can also run the commands in this article using the [Azure Cloud Shell](/azure/cloud-shell/overview), an interactive CLI shell that runs in your browser or in an app such as Windows Terminal. If you use the Cloud Shell, you don't need to install anything. If you prefer to use the CLI locally, this article requires Azure CLI version 2.36 or later. Run `az --version` to find the version. To locally install or upgrade Azure CLI, see [Install Azure CLI](/cli/azure/install-azure-cli).

* An IoT Hub. Create one with the [CLI](iot-hub-create-using-cli.md) or the [Azure portal](iot-hub-create-through-portal.md).

* A registered device. Register one in the [Azure portal](iot-hub-create-through-portal.md#register-a-new-device-in-the-iot-hub).

* Make sure that port 8883 is open in your firewall. The device sample in this article uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](iot-hub-mqtt-support.md#connecting-to-iot-hub).

## Prepare the Cloud Shell

If you want to use the Azure Cloud Shell, you must first launch and configure it. If you use the CLI locally, skip to the [Prepare two CLI sessions](#prepare-two-cli-sessions) section.

1. Select the **Cloud Shell** icon from the page header in the Azure portal.

    :::image type="content" source="./media/quickstart-send-telemetry-cli/cloud-shell-new-session.png" alt-text="Screenshot of the global controls from the page header of the Azure portal, highlighting the Cloud Shell icon.":::

    > [!NOTE]
    > If this is the first time you've used the Cloud Shell, it prompts you to create storage, which is required to use the Cloud Shell.  Select a subscription to create a storage account and Microsoft Azure Files share.

2. Use the environment selector in the Cloud Shell toolbar to select your preferred CLI environment. This article uses the **Bash** environment. You can also use the **PowerShell** environment. 

    > [!NOTE]
    > Some commands require different syntax or formatting in the **Bash** and **PowerShell** environments.  For more information, see [Tips for using the Azure CLI successfully](/cli/azure/use-cli-effectively?tabs=bash%2Cbash2).

    :::image type="content" source="./media/quickstart-send-telemetry-cli/cloud-shell-environment.png" alt-text="Screenshot of an Azure Cloud Shell window, highlighting the environment selector in the toolbar.":::

## Prepare two CLI sessions

Next, you must prepare two Azure CLI sessions. If you're using the Cloud Shell, you'll run these sessions in separate Cloud Shell tabs. If using a local CLI client, you'll run separate CLI instances. Use the separate CLI sessions for the following tasks:
- The first session simulates an IoT device that communicates with your IoT hub. 
- The second session schedules jobs for your simulated device with your IoT hub. 

> [!NOTE]
> Azure CLI requires you to be logged into your Azure account. If you're using the Cloud Shell, you're automatically logged into your Azure account. If you're using a local CLI client, you must log into each CLI session. All communication between your Azure CLI shell session and your IoT hub is authenticated and encrypted. As a result, this article doesn't need extra authentication that you'd use with a real device, such as a connection string. For more information about logging in with Azure CLI, see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

1. In the first CLI session, run the [az extension add](/cli/azure/extension#az-extension-add) command. The command adds the Microsoft Azure IoT Extension for Azure CLI to your CLI shell. The extension adds IoT Hub, IoT Edge, and IoT Device Provisioning Service (DPS) specific commands to Azure CLI. After you install the extension, you don't need to install it again in any Cloud Shell session.

   ```azurecli
   az extension add --name azure-iot
   ```

   [!INCLUDE [iot-hub-cli-version-info](../../includes/iot-hub-cli-version-info.md)]

1. Open the second CLI session.  If you're using the Cloud Shell in a browser, select the **Open new session** icon on the toolbar of your first CLI session. If using the CLI locally, open a second CLI instance.

    :::image type="content" source="media/quickstart-send-telemetry-cli/cloud-shell-new-session.png" alt-text="Screenshot of an Azure Cloud Shell window, highlighting the Open New Session icon in the toolbar.":::

## Create and simulate a device

In this section, you create a device identity for your IoT hub in the first CLI session, and then simulate a device using that device identity. The simulated device responds to the jobs that you schedule in the second CLI session.

To create and start a simulated device:

1. In the first CLI session, run the [az iot hub device-identity create](/cli/azure/iot/hub/device-identity#az-iot-hub-device-identity-create) command, replacing the following placeholders with their corresponding values. This command creates the device identity for your simulated device.

    | Placeholder | Value |
    | --- | --- |
    |{HubName} | The name of your IoT hub. |
    |{DeviceName} | The name of your simulated device. |

    ```azurecli
    az iot hub device-identity create -d {DeviceName} -n {HubName} 
    ```

1. In the first CLI session, run the [az iot device simulate](/cli/azure/iot/device#az-iot-device-simulate) command, replacing the following placeholders with their corresponding values. This command simulates the device you created in the previous step. The simulated device is configured to return a status code and payload whenever a direct method is invoked. 

    | Placeholder | Value |
    | --- | --- |
    |{DeviceName} | The name of your simulated device. |
    |{HubName} | The name of your IoT hub. |
    
    ```azurecli
    az iot device simulate -d {DeviceName} -n {HubName} \
                           --mrc 201 --mrp '{"result":"Direct method successful"}'
    ```

    > [!TIP]
    > By default, the [az iot device simulate](/cli/azure/iot/device#az-iot-device-simulate) command sends 100 device-to-cloud messages with an interval of 3 seconds between messages. The simulation ends after all messages have been sent. If you want the simulation to run longer, you can use the `--msg-count` parameter to specify more messages or the `--msg-interval` parameter to specify a longer interval between messages. You can also run the command again to restart the simulated device. 

## Schedule a job to invoke a direct method

In this section, you schedule a job in the second CLI session to invoke a direct method on the simulated device running in the first CLI session.

1. Confirm that the simulated device in the first CLI session is running.  If not, restart it by running the [az iot device simulate](/cli/azure/iot/device#az-iot-device-simulate) command again from [Create and simulate a device](#create-and-simulate-a-device).

1. In the second CLI session, run the [az iot hub job create](/cli/azure/iot/hub/job#az-iot-hub-job-create) command, replacing the following placeholders with their corresponding values. In this example, there's no pre-existing method for the device. The command calls an example method name on the simulated device and returns a payload.

    | Placeholder | Value |
    | --- | --- |
    |{JobName} | The name of your scheduled job. Job names are unique, so choose a different job name each time you run this command.|
    |{HubName} | The name of your IoT hub. |
    |{MethodName} | The name of your direct method. The simulated device doesn't have a pre-existing method, so you can choose any name you want for this command. |
    |{DeviceName} | The name of your simulated device. |

    ```azurecli
    az iot hub job create --job-id {JobName} --jt scheduleDeviceMethod -n {HubName} \
                          --method-name {MethodName} --method-payload 1 \
                          --query-condition "deviceId = '{DeviceName}'"
    ```
1. In the first CLI session, confirm that the output shows the method invocation. In the following screenshot, we used `SampleMethod` for the `{MethodName}` placeholder in the `az iot hub job create` CLI command from the previous step. 

    :::image type="content" source="./media/cli-cli-schedule-jobs/sim-device-direct-method.png" alt-text="Screenshot of a simulated device displaying output after a method was invoked.":::

## Schedule a job to update a device twin's properties

In this section, you schedule a job in the second CLI session to update a desired device twin property on the simulated device running in the first CLI session.

1. Confirm that the simulated device in the first CLI session is running.  If not, restart it by running the [az iot device simulate](/cli/azure/iot/device#az-iot-device-simulate) command again from [Create and simulate a device](#create-and-simulate-a-device).

1. In the second CLI session, run the [az iot hub job create](/cli/azure/iot/hub/job#az-iot-hub-job-create) command, replacing the following placeholders with their corresponding values. In this example, we're scheduling a job to set the value of the desired twin property `BuildingNo` to 45 for our simulated device.

    | Placeholder | Value |
    | --- | --- |
    |{JobName} | The name of your scheduled job. Job names are unique, so choose a different job name each time you run this command.|
    |{HubName} | The name of your IoT hub. |
    |{MethodName} | The name of your direct method. The simulated device doesn't have a pre-existing method, so you can choose any name you want for this command. |
    |{DeviceName} | The name of your simulated device. |

    ```azurecli
    az iot hub job create --job-id {JobName} --jt scheduleUpdateTwin -n {HubName} \
                          --twin-patch '{"properties":{"desired": {"BuildingNo": 45}}}' \
                          --query-condition "deviceId = '{DeviceName}'"
    ```
1. In the first CLI session, confirm the output shows the update for the desired device twin property. 

    :::image type="content" source="./media/cli-cli-schedule-jobs/sim-device-update-twin.png" alt-text="Screenshot of a simulated device displaying output after a device twin property was updated.":::

[!INCLUDE [iot-hub-dm-followup](../../includes/iot-hub-dm-followup.md)]
