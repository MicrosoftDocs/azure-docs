---
title: include file
description: include file
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.topic: include
ms.date: 01/14/2021
---

In the following sections, you set up a terminal and use Azure CLI to create an IoT hub. To configure a terminal that runs Azure CLI commands, you can either use the browser-based Azure Cloud Shell, or use a local terminal.
* To use Cloud Shell, go to the next section: [Launch the Cloud Shell](#launch-the-cloud-shell). 
* To use a local terminal, skip the next section and go to [Open a local terminal](#open-a-local-terminal).

## Launch the Cloud Shell
In this section, you create a Cloud Shell session and configure your terminal environment.

Sign in to the Azure portal at https://portal.azure.com.  

To launch the Cloud Shell:

1. Select the **Cloud Shell** button on the top-right menu bar in the Azure portal. 

    ![Azure portal Cloud Shell button](media/iot-hub-include-create-hub-cli/cloud-shell-button.png)

    > [!NOTE]
    > If this is the first time you've used the Cloud Shell, it prompts you to create storage, which is required to use the Cloud Shell.  Select a subscription to create a storage account and Microsoft Azure Files share. 

2. Select your preferred CLI environment in the **Select environment** dropdown. This quickstart uses the **Bash** environment. All the following CLI commands work in the PowerShell environment too. 

    ![Select CLI environment](media/iot-hub-include-create-hub-cli/cloud-shell-environment.png)

3. Skip the next section and go to [Install the Azure IoT Extension](#install-the-azure-iot-extension). 

## Open a local terminal
If you chose to use a local terminal rather than Cloud Shell, complete this section.  

1. Open a local terminal.
1. Run the [az login](/cli/azure/reference-index#az_login) command:

   ```azurecli
   az login
   ```

    If the CLI can open your default browser, it will do so and load an Azure sign-in page.

    Otherwise, open a browser page at https://aka.ms/devicelogin and enter the authorization code displayed in your terminal.

    If no web browser is available or the web browser fails to open, use device code flow with `az login --use-device-code`.

1. Sign in with your account credentials in the browser.

    To learn more about different authentication methods, see [Sign in with Azure CLI]( /cli/azure/authenticate-azure-cli ).

1. Go to the next section: [Install the Azure IoT Extension](#install-the-azure-iot-extension). 

## Install the Azure IoT Extension
In this section, you install the Microsoft Azure IoT Extension for Azure CLI to your CLI shell. The IOT Extension adds IoT Hub, IoT Edge, and IoT Device Provisioning Service (DPS) specific commands to Azure CLI.

> [!IMPORTANT]
> The terminal commands in the rest of this quickstart work the same in Cloud Shell or a local terminal. To run a command, select **Copy** to copy a block of code in this quickstart. Then paste it into your CLI shell and run it.

Run the [az extension add](/cli/azure/extension#az_extension_add) command. 

   ```azurecli
   az extension add --name azure-iot
   ```
[!INCLUDE [iot-hub-cli-version-info](iot-hub-cli-version-info.md)]

## Create an IoT hub
In this section, you use Azure CLI to create an IoT hub and a resource group.  An Azure resource group is a logical container into which Azure resources are deployed and managed. An IoT hub acts as a central message hub for bi-directional communication between your IoT application and the devices. 

To create an IoT hub and a resource group:

1. Run the [az group create](/cli/azure/group#az_group_create) command to create a resource group. The following command creates a resource group named *MyResourceGroup* in the *eastus* location. 
    >[!NOTE]
    > You can optionally set an alternate location. To see available locations, run `az account list-locations`. This tutorial uses *eastus* as shown in the example command. 

    ```azurecli
    az group create --name MyResourceGroup --location eastus
    ```

1. Run the [az iot hub create](/cli/azure/iot/hub#az_iot_hub_create) command to create an IoT hub. It might take a few minutes to create an IoT hub. 

    *YourIotHubName*. Replace this placeholder and the surrounding braces in the following command, using the name you chose for your IoT hub. An IoT hub name must be globally unique in Azure. Use your IoT hub name in the rest of this quickstart wherever you see the placeholder.

    ```azurecli
    az iot hub create --resource-group MyResourceGroup --name {YourIoTHubName}
    ```

## Create a simulated device
In this section, you create a simulated IoT device that is connected to your IoT hub. 

To create a simulated device:
1. Run the [az iot hub device-identity create](/cli/azure/ext/azure-iot/iot/hub/device-identity#ext-azure-iot-az-iot-hub-device-identity-create) command in your CLI shell. This creates the simulated device identity. 

    *YourIotHubName*. Replace this placeholder below with the name you chose for your IoT hub. 

    *myDevice*. You can use this name directly for the simulated device ID in the rest of this article. Optionally, use a different name. 

    ```azurecli
    az iot hub device-identity create --device-id myDevice --hub-name {YourIoTHubName} 
    ```

1.  Run the [az iot hub device-identity connection-string show](/cli/azure/ext/azure-iot/iot/hub/device-identity/connection-string#ext_azure_iot_az_iot_hub_device_identity_connection_string_show) command. 

    ```azurecli
    az iot hub device-identity connection-string show --device-id myDevice --hub-name {YourIoTHubName}
    ```

    The connection string output is in the following format:

    ```Output
    HostName=<your IoT Hub name>.azure-devices.net;DeviceId=<your device id>;SharedAccessKey=<some value>
    ```

1. Save the connection string in a secure location. 

> [!NOTE]
> Keep the CLI shell open. You'll use it in later steps.