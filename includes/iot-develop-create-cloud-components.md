---
 title: Include file to create cloud components for IoT Hub connection.
 description: Contains sections to show how to create an IoT Hub, register a device, and get the connection details. 
 author: timlt
 ms.service: iot-develop
 ms.topic: include
 ms.date: 05/10/2023
 ms.author: timlt
 ms.custom: include file
---

## Create the cloud components

### Create an IoT hub

You can use Azure CLI to create an IoT hub that handles events and messaging for your device.

To create an IoT hub:

1. Launch your CLI app. To run the CLI commands in the rest of this quickstart, copy the command syntax, paste it into your CLI app, edit variable values, and press Enter.
    - If you're using Cloud Shell, right-click the link for [Cloud Shell](https://shell.azure.com/bash), and select the option to open in a new tab.
    - If you're using Azure CLI locally, start your CLI console app and sign in to Azure CLI.

1. Run [az extension add](/cli/azure/extension#az-extension-add) to install or upgrade the *azure-iot* extension to the current version.

    ```azurecli-interactive
    az extension add --upgrade --name azure-iot
    ```

1. Run the [az group create](/cli/azure/group#az-group-create) command to create a resource group. The following command creates a resource group named *MyResourceGroup* in the *centralus* region.

    > [!NOTE] 
    > You can optionally set an alternate `location`. To see available locations, run [az account list-locations](/cli/azure/account#az-account-list-locations).

    ```azurecli
    az group create --name MyResourceGroup --location centralus
    ```

1. Run the [az iot hub create](/cli/azure/iot/hub#az-iot-hub-create) command to create an IoT hub. It might take a few minutes to create an IoT hub.

    *YourIotHubName*. Replace this placeholder in the code with the name you chose for your IoT hub. An IoT hub name must be globally unique in Azure. This placeholder is used in the rest of this quickstart to represent your unique IoT hub name.

    The `--sku F1` parameter creates the IoT hub in the Free tier. Free tier hubs have a limited feature set and are used for proof of concept applications. For more information on IoT Hub tiers, features, and pricing, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub). 

    ```azurecli
    az iot hub create --resource-group MyResourceGroup --name {YourIoTHubName} --sku F1 --partition-count 2
    ```

1. After the IoT hub is created, view the JSON output in the console, and copy the `hostName` value to use in a later step. The `hostName` value looks like the following example:

    `{Your IoT hub name}.azure-devices.net`

### Configure IoT Explorer

In the rest of this quickstart, you use IoT Explorer to register a device to your IoT hub, to view the device properties and telemetry, and to send commands to your device. In this section, you configure IoT Explorer to connect to the IoT hub you  created, and to read plug and play models from the public model repository. 


To add a connection to your IoT hub:

1. Install [Azure IoT Explorer](https://github.com/Azure/azure-iot-explorer/releases).  This tool is a cross-platform utility to monitor and manage Azure IoT resources.

1. In your CLI app, run the [az iot hub connection-string show](/cli/azure/iot/hub/connection-string#az-iot-hub-connection-string-show) command to get the connection string for your IoT hub.

    ```azurecli
    az iot hub connection-string  show --hub-name {YourIoTHubName}
    ```

1. Copy the connection string without the surrounding quotation characters.
1. In Azure IoT Explorer, select **IoT hubs** on the left menu.
1. Select **+ Add connection**. 
1. Paste the connection string into the **Connection string** box.
1. Select **Save**.

    :::image type="content" source="media/iot-develop-create-cloud-components/iot-explorer-add-connection.png" alt-text="Screenshot of adding a connection in IoT Explorer.":::

If the connection succeeds, IoT Explorer switches to the **Devices** view.

To add the public model repository:

1. In IoT Explorer, select **Home** to return to the home view.
1. On the left menu, select **IoT Plug and Play Settings**, then select **+Add** and select **Public repository** from the drop-down menu.
1. An entry appears for the public model repository at `https://devicemodels.azure.com`.

    :::image type="content" source="media/iot-develop-create-cloud-components/iot-explorer-add-public-repository.png" alt-text="Screenshot of adding the public model repository in IoT Explorer.":::

1. Select **Save**.

### Register a device

In this section, you create a new device instance and register it with the IoT hub you created. You use the connection information for the newly registered device to securely connect your physical device in a later section.

To register a device:

1. From the home view in IoT Explorer, select **IoT hubs**.
1. The connection you previously added should appear. Select **View devices in this hub** below the connection properties.
1. Select **+ New** and enter a device ID for your device; for example, `mydevice`. Leave all other properties the same.
1. Select **Create**.

    :::image type="content" source="media/iot-develop-create-cloud-components/iot-explorer-device-created.png" alt-text="Screenshot of Azure IoT Explorer device identity.":::

1. Use the copy buttons to copy the **Device ID** and **Primary key** fields.

Before continuing to the next section, save each of the following values retrieved from earlier steps, to a safe location. You use these values in the next section to configure your device. 

* `hostName`
* `deviceId`
* `primaryKey`