---
title: include file
description: include file
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.topic: include
ms.date: 01/14/2021
---

## Create an IoT hub
In this section, you use Azure CLI to create an IoT hub and a resource group.  An Azure resource group is a logical container into which Azure resources are deployed and managed. An IoT hub acts as a central message hub for bi-directional communication between your IoT application and the devices.

To create an IoT hub and a resource group:

1. Launch your CLI app.  To run the CLI commands in the rest of this quickstart, copy the command syntax, paste it into your CLI app, edit variable values, and press Enter.
    - If you're using Cloud Shell, select the **Try It** button on the CLI commands to launch Cloud Shell in a split browser window. Or you can open the [Cloud Shell](https://shell.azure.com/bash) in a separate browser tab.
    - If you're using Azure CLI locally, start your CLI console app and sign in to Azure CLI.

1. Run [az extension add](/cli/azure/extension#az_extension_add) to install or upgrade the *azure-iot* extension to the current version.

    ```azurecli-interactive
    az extension add --upgrade --name azure-iot
    ```

1. In your CLI app, run the [az group create](/cli/azure/group#az_group_create) command to create a resource group. The following command creates a resource group named *MyResourceGroup* in the *eastus* location. 
    >[!NOTE]
    > You can optionally set an alternate location. To see available locations, run `az account list-locations`. This tutorial uses *eastus* as shown in the example command. 

    ```azurecli-interactive
    az group create --name MyResourceGroup --location eastus
    ```

1. Run the [az iot hub create](/cli/azure/iot/hub#az_iot_hub_create) command to create an IoT hub. It might take a few minutes to create an IoT hub. 

    *YourIotHubName*. Replace this placeholder and the surrounding braces in the following command, using the name you chose for your IoT hub. An IoT hub name must be globally unique in Azure. Use your IoT hub name in the rest of this quickstart wherever you see the placeholder.

    ```azurecli-interactive
    az iot hub create --resource-group MyResourceGroup --name {YourIoTHubName}
    ```
    > [!TIP]
    > After creating an IoT hub, in the rest of this quickstart you can continue to use CLI commands to interact with the hub. Optionally, you could use Azure IoT Explorer in place of the CLI commands. IoT Explorer is a GUI application that lets you connect to an existing IoT Hub and add, manage, and monitor devices. To learn more, see [Install and use Azure IoT explorer](../articles/iot-fundamentals/howto-use-iot-explorer.md).

## Create a simulated device
In this section, you create a simulated IoT device that is connected to your IoT hub. 

To create a simulated device:
1. Run the [az iot hub device-identity create](/cli/azure/iot/hub/device-identity#az_iot_hub_device_identity_create) command in your CLI shell. This creates the simulated device identity. 

    *YourIotHubName*. Replace this placeholder below with the name you chose for your IoT hub. 

    *myDevice*. You can use this name directly for the simulated device ID in the rest of this article. Optionally, use a different name. 

    ```azurecli-interactive
    az iot hub device-identity create --device-id myDevice --hub-name {YourIoTHubName} 
    ```

1.  Run the [az iot hub device-identity connection-string show](/cli/azure/iot/hub/device-identity/connection-string#az_iot_hub_device_identity_connection_string_show) command. 

    ```azurecli-interactive
    az iot hub device-identity connection-string show --device-id myDevice --hub-name {YourIoTHubName}
    ```

    The connection string output is in the following format:

    ```Output
    HostName=<your IoT Hub name>.azure-devices.net;DeviceId=<your device id>;SharedAccessKey=<some value>
    ```

1. Save the connection string in a secure location. 

> [!NOTE]
> Keep your CLI app open. You'll use it in later steps.