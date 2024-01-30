---
title: include file
description: include file
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.topic: include
ms.date: 09/17/2021
---

## Create an IoT hub
In this section, you use Azure CLI to create an IoT hub and a resource group.  An Azure resource group is a logical container into which Azure resources are deployed and managed. An IoT hub acts as a central message hub for bi-directional communication between your IoT application and devices.

To create an IoT hub and a resource group:

1. Launch Azure CLI: 
    - If you're using Cloud Shell, select the **Try It** button on the CLI commands to launch Cloud Shell in a split browser window. Or you can open the [Cloud Shell](https://shell.azure.com/bash) in a separate browser tab.
    - If you're using Azure CLI locally, open a console such as Windows CMD, PowerShell, or Bash and [sign in to Azure CLI](/cli/azure/authenticate-azure-cli).
    
    To run the CLI commands in the rest of this quickstart: copy the command syntax, paste it into your Cloud Shell window or CLI console, edit variable values, and press Enter.

1. Run [az extension add](/cli/azure/extension#az-extension-add) to install or upgrade the *azure-iot* extension to the current version.

    ```azurecli-interactive
    az extension add --upgrade --name azure-iot
    ```

1. Run the [az group create](/cli/azure/group#az-group-create) command to create a resource group. The following command creates a resource group named *MyResourceGroup* in the *eastus* location. 
    >[!NOTE]
    > You can optionally set an alternate location. To see available locations, run `az account list-locations`. This tutorial uses *eastus* as shown in the example command. 

    ```azurecli-interactive
    az group create --name MyResourceGroup --location eastus
    ```

1. Run the [az iot hub create](/cli/azure/iot/hub#az-iot-hub-create) command to create an IoT hub. It might take a few minutes to create an IoT hub. 

    *YourIotHubName*. Replace this placeholder and the surrounding braces in the following command, using the name you chose for your IoT hub. An IoT hub name must be globally unique in Azure. Use your IoT hub name in the rest of this quickstart wherever you see the placeholder.

    ```azurecli
    az iot hub create --resource-group MyResourceGroup --name {YourIoTHubName}
    ```
    > [!TIP]
    > After creating an IoT hub, you'll use Azure IoT Explorer to interact with your IoT hub in the rest of this quickstart. IoT Explorer is a GUI application that lets you connect to an existing IoT Hub and add, manage, and monitor devices. To learn more, see [Install and use Azure IoT explorer](../articles/iot/howto-use-iot-explorer.md). Optionally, you can continue to use CLI commands.

### Configure IoT Explorer

In the rest of this quickstart, you'll use IoT Explorer to register a device to your IoT hub and to view the device telemetry. In this section, you configure IoT Explorer to connect to the IoT hub you just created and to read plug and play models from the public model repository. 

> [!NOTE]
> You can also use the Azure CLI to register a device. Use the *[az iot hub device-identity create](/cli/azure/iot/hub/device-identity#az-iot-hub-device-identity-create) --device-id mydevice --hub-name {YourIoTHubName}* command to register a new device and the *[az iot hub device-identity connection-string show](/cli/azure/iot/hub/device-identity/connection-string#az-iot-hub-device-identity-connection-string-show) --device-id mydevice --hub-name {YourIoTHubName}* command to get the primary connection string for the device. Once you note down the device connection string, you can skip ahead to [Run the device sample](#run-the-device-sample).

To add a connection to your IoT hub:

1. Run the [az iot hub connection-string show](/cli/azure/iot/hub/connection-string#az-iot-hub-connection-string-show) command to get the connection string for your IoT hub.

    ```azurecli
    az iot hub connection-string  show --hub-name {YourIoTHubName}
    ```

1. Copy the connection string without the surrounding quotation characters.
1. In Azure IoT Explorer, select **IoT hubs** on the left menu, then select **+ Add connection**.
1. Paste the connection string into the **Connection string** box.
1. Select **Save**.

    :::image type="content" source="media/iot-hub-include-create-hub-iot-explorer/iot-explorer-add-connection.png" alt-text="Screenshot of adding a connection in IoT Explorer":::

1. If the connection succeeds, IoT Explorer switches to the **Devices** view.

To add the public model repository:

1. In IoT Explorer, select **Home** to return to the home view.
1. On the left menu, select **IoT Plug and Play Settings**, then select **+Add** and select **Public repository** from the drop-down menu.
1. An entry appears for the public model repository at `https://devicemodels.azure.com`.

    :::image type="content" source="media/iot-hub-include-create-hub-iot-explorer/iot-explorer-add-public-repository.png" alt-text="Screenshot of adding the public model repository in IoT Explorer":::

1. Select **Save**.

### Register a device

In this section, you create a new device instance and register it with the IoT hub you created. You'll use the connection information for the newly registered device to securely connect your device in a later section.

To register a device:

1. From the home view in IoT Explorer, select **IoT hubs**.
1. The connection you previously added should appear. Select **View devices in this hub** below the connection properties.
1. Select **+ New** and enter a device ID for your device; for example, *mydevice*. Leave all other properties the same.
1. Select **Create**.

    :::image type="content" source="media/iot-hub-include-create-hub-iot-explorer/iot-explorer-device-created.png" alt-text="Screenshot of Azure IoT Explorer device identity":::

1. Use the copy buttons to copy and note down the **Primary connection string** field. You'll need this connection string later.
