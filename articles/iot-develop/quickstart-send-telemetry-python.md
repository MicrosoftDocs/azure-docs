---
title: Send telemetry from a device to Azure IoT cloud (Python) quickstart
description: In this quickstart, you use the Azure IoT Hub Device SDK for Python to send telemetry from a device to an Iot hub.
author: elhorton
ms.author: elhorton
ms.service: iot-develop
ms.devlang: python
ms.topic: quickstart
ms.date: 01/11/2021
---

# Quickstart: Send telemetry from a device to an IoT hub (Python)

In this quickstart, you learn a basic Azure IoT application workflow for securely connecting a device to the cloud and sending device-to-cloud telemetry. You use the Azure CLI to create an IoT hub and a simulated device, then you use the Azure IoT Python SDK to access the device and send telemetry to the hub. You also use the Azure portal to visualize device metrics.

## Prerequisites
- If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Azure CLI. You can run all commands in this quickstart using the Azure Cloud Shell, an interactive CLI shell that runs in your browser. If you use the Cloud Shell, you don't need to install anything. If you prefer to use the CLI locally, this quickstart requires Azure CLI version 2.0.76 or later. Run az --version to find the version. To install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).
- [Python 3.7+](https://www.python.org/downloads/). For other versions of Python supported, see [Azure IoT Device Features](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device#azure-iot-device-features).
    - **Note that this sample is configured for Python 3.7+.** To ensure that your Python version is up to date, run `python --version`. If you have both Python 2 and Python 3 installed (and are using a Python 3 environment for this SDK), then install all libraries using `pip3` as opposed to `pip`. This ensures that the libraries are installed to your Python 3 runtime. 
- Port 8883 open in your firewall. The device sample in this quickstart uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](iot-hub-mqtt-support.md#connecting-to-iot-hub).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Sign in to the Azure portal
Sign in to the Azure portal at https://portal.azure.com.

Regardless whether you run the CLI locally or in the Cloud Shell, keep the portal open in your browser.  You use it later in this quickstart.

## Launch the Cloud Shell
In this section, you launch an instance of the Azure Cloud Shell. If you use the CLI locally, skip to the section [Prepare a CLI session](#prepare-a-cli-session).

To launch the Cloud Shell:

1. Select the **Cloud Shell** button on the top-right menu bar in the Azure portal. 

    ![Azure portal Cloud Shell button](media/quickstart-send-telemetry-cli/cloud-shell-button.png)

    > [!NOTE]
    > If this is the first time you've used the Cloud Shell, it prompts you to create storage, which is required to use the Cloud Shell.  Select a subscription to create a storage account and Microsoft Azure Files share. 

2. Select your preferred CLI environment in the **Select environment** dropdown. This quickstart uses the **Bash** environment. All the following CLI commands work in the Powershell environment too. 

    ![Select CLI environment](media/quickstart-send-telemetry-cli/cloud-shell-environment.png)

## Prepare a CLI session

In this section, you prepare an Azure CLI session. You'll use this CLI session to quickly and easily create an IoT Hub and monitor your device. To run a command, select **Copy** to copy a block of code in this quickstart, paste it into your shell session, and run it.

Azure CLI requires you to be logged into your Azure account. All communication between your Azure CLI shell session and your IoT hub is authenticated and encrypted. As a result, this quickstart does not need additional authentication that you'd use with a real device, such as a connection string.

*  Run the [az extension add](https://docs.microsoft.com/cli/azure/extension?view=azure-cli-latest#az-extension-add) command to add the Microsoft Azure IoT Extension for Azure CLI to your CLI shell. The IOT Extension adds IoT Hub, IoT Edge, and IoT Device Provisioning Service (DPS) specific commands to Azure CLI.

   ```azurecli
   az extension add --name azure-iot
   ```
   
   After you install the Azure IOT extension, you don't need to install it again in any Cloud Shell session. 

   [!INCLUDE [iot-hub-cli-version-info](../../includes/iot-hub-cli-version-info.md)]


## Create an IoT hub
In this section, you use the Azure CLI or Cloud Shell instance to create a resource group and an IoT Hub.  An Azure resource group is a logical container into which Azure resources are deployed and managed. An IoT Hub acts as a central message hub for bi-directional communication between your IoT application and the devices. 

> [!TIP]
> Optionally, you can create an Azure resource group, an IoT Hub, and other resources by using the [Azure portal](iot-hub-create-through-portal.md), [Visual Studio Code](iot-hub-create-use-iot-toolkit.md), or other programmatic methods.  

1. Run the [az group create](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az-group-create) command to create a resource group. The following command creates a resource group named *MyResourceGroup* in the *eastus* location. 
>[!NOTE]
> You can optionally set an alternate location. To see available locations, run az account list-locations. For this tutorial we are using *eastus* shown in the example CLI command. 

    ```azurecli
    az group create --name MyResourceGroup --location eastus
    ```

1. Run the [az iot hub create](https://docs.microsoft.com/cli/azure/iot/hub?view=azure-cli-latest#az-iot-hub-create) command to create an IoT hub. It might take a few minutes to create an IoT hub. 

    *YourIotHubName*. Replace this placeholder below with the name you chose for your IoT hub. An IoT hub name must be globally unique in Azure. This placeholder is used in the rest of this quickstart to represent your IoT hub name.

    ```azurecli
    az iot hub create --resource-group MyResourceGroup --name {YourIoTHubName}
    ```

## Create and monitor a device
In this section, you create a simulated device in your CLI or Cloud Shell session. This is the simulated device that will use the Python SDK to send telemetry and receive messages from the IoT Hub. 

To create a simulated device:
1. Run the [az iot hub device-identity create](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/hub/device-identity?view=azure-cli-latest#ext-azure-iot-az-iot-hub-device-identity-create) command in your CLI or Cloud Shell session. This creates the simulated device identity. 

    *YourIotHubName*. Replace this placeholder below with the name you chose for your IoT hub. 

    *myPythonDevice*. You can use this name directly for the simulated device in the rest of this quickstart. Optionally, use a different name. 

    ```azurecli
    az iot hub device-identity create --device-id myPythonDevice --hub-name {YourIoTHubName} 
    ```

1.  [Retrieve your Device Connection String](https://docs.microsoft.com/en-us/cli/azure/ext/azure-cli-iot-ext/iot/hub/device-identity?view=azure-cli-latest#ext-azure-cli-iot-ext-az-iot-hub-device-identity-show-connection-string) using the Azure CLI

    ```bash
    az iot hub device-identity show-connection-string --device-id <your device id> --hub-name <your IoT Hub name>
    ```

    The connection string output is in the following format:

    ```Text
    HostName=<your IoT Hub name>.azure-devices.net;DeviceId=<your device id>;SharedAccessKey=<some value>
    ```

    Save the connection string in a secur location for use in the next section. 

1. [Begin monitoring for telemetry](https://docs.microsoft.com/en-us/cli/azure/ext/azure-cli-iot-ext/iot/hub?view=azure-cli-latest#ext-azure-cli-iot-ext-az-iot-hub-monitor-events) on your IoT Hub using the Azure CLI

    ```bash
    az iot hub monitor-events --hub-name <your IoT Hub name> --output table
    ```

    ![Cloud Shell monitor events](media/quickstart-send-telemetry-cli/cloud-shell-monitor.png)

    After you start sending messages using the Python SDK in the next section, you will see messages appearing in this window. 

## Use the Python SDK to send messages
In this section, you will use the Python SDK to send messages from your simulated device to your IoT Hub. 

1. Open a terminal window. You will use this to install the Python SDK and work with the samples code.

1. Copy the [Azure IoT Python SDK device samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples) to your local machine:

    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-sdk-python
    ```

    and navigating to the `azure-iot-sdk-python/azure-iot-device/samples` directory:

    ```cmd/sh
    cd azure-iot-sdk-python/azure-iot-device/samples
    ```
1. Install the Azure IoT Python SDK:

    ```cmd/sh
    pip install azure-iot-device
    ```
1. Set the Device Connection String as an enviornment variable called `IOTHUB_DEVICE_CONNECTION_STRING`. This is the string you obtained in the previous section after creating your simulated Python device. 

    **Windows (cmd)**

    ```cmd
    set IOTHUB_DEVICE_CONNECTION_STRING=<your connection string here>
    ```

    * Note that there are **NO** quotation marks around the connection string.

    **Linux (bash)**

    ```bash
    export IOTHUB_DEVICE_CONNECTION_STRING="<your connection string here>"
    ```

1. Run the following code from [simple_send_message.py](simple_send_message.py) on your device from the terminal or your IDE:
    ```cmd
    python ./simple_send_message.py
    ```


    ```python
    import os
    import asyncio
    from azure.iot.device.aio import IoTHubDeviceClient


    async def main():
        # Fetch the connection string from an environment variable
        conn_str = os.getenv("IOTHUB_DEVICE_CONNECTION_STRING")

        # Create instance of the device client using the authentication provider
        device_client = IoTHubDeviceClient.create_from_connection_string(conn_str)

        # Connect the device client.
        await device_client.connect()

        # Send a single message
        print("Sending message...")
        await device_client.send_message("This is a message that is being sent")
        print("Message successfully sent!")

        # finally, disconnect
        await device_client.disconnect()


    if __name__ == "__main__":
        asyncio.run(main())
    ```

You should see the message appear in the CLI or Cloud Shell session that is running your events monitor:
    ```bash
    Starting event monitor, use ctrl-c to stop...
    event:
      origin: <your Device name>
      payload: This is a message that is being sent
    ```
Your device is now securely connected and sending telemetry to Azure IoT Hub.

## View messaging metrics in the portal
The Azure portal enables you to manage all aspects of your IoT Hub and devices. In a typical IoT Hub application that ingests telemetry from devices, you might want to monitor devices or view metrics on device telemetry. 

To visualize messaging metrics in the Azure portal:
1. In the left navigation menu on the portal, select **All Resources**. This lists all resources in your subscription, including the IoT hub you created. 

1. Select the link on the IoT hub you created. The portal displays the overview page for the hub.

1. Select **Metrics** in the left pane of your IoT Hub. 

    ![IoT Hub messaging metrics](media/quickstart-send-telemetry-cli/iot-hub-portal-metrics.png)

1. Enter your IoT hub name in **Scope**.

2. Select *Iot Hub Standard Metrics* in **Metric Namespace**.

3. Select *Total number of messages used* in **Metric**. 

4. Hover your mouse pointer over the area of the timeline in which your device sent messages. The total number of messages at a point in time appears in the lower left corner of the timeline.

    ![View Azure IoT Hub metrics](media/quickstart-send-telemetry-cli/iot-hub-portal-view-metrics.png)

5. Optionally, use the **Metric** dropdown to display other metrics on your simulated device. For example, *C2d message deliveries completed* or *Total devices (preview)*. 

## Clean up resources
If you no longer need the Azure resources created in this quickstart, you can use the Azure CLI to delete them.

If you continue to the next recommended article, you can keep the resources you've already created and reuse them. 

> [!IMPORTANT]
> Deleting a resource group is irreversible. The resource group and all the resources contained in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. 

To delete a resource group by name:
1. Run the [az group delete](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az-group-delete) command. This removes the resource group, the IoT Hub, and the device registration you created.

    ```azurecli
    az group delete --name MyResourceGroup
    ```
1. Run the [az group list](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az-group-list) command to confirm the resource group is deleted.  

    ```azurecli
    az group list
    ```

## Next steps

In this quickstart, you learned a basic Azure IoT application workflow for securely connecting a device to the cloud and sending device-to-cloud telemetry. You used the Azure CLI to create an IoT hub and a simulated device, then you used the Azure IoT Python SDK to access the device and send telemetry to the hub. You also used the Azure portal to visualize device metrics.

As a next step, explore the Azure IoT Python SDK through application samples.

- [Asynchronous Samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples/async-hub-scenarios): This directory contains Python samples for additional IoT Hub scenarios, coded asychronously
- [Synchronous Samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples/sync-samples): This directory contains Python samples intended for use with Python 2.7 or synchronous compatibility scenarios for Python 3.5+
- [IoT Edge samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples/async-edge-scenarios): This directory contains Python samples for working with Edge modules and downstream devices