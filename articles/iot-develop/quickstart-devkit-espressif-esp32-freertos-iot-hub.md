---
title: Connect an ESPRESSIF ESP-32 to Azure IoT Hub quickstart
description: Use Azure IoT middleware for FreeRTOS to connect an ESPRESSIF ESP32-Azure IoT Kit device to Azure IoT Hub and send telemetry.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.devlang: c
ms.topic: quickstart
ms.date: 01/20/2023
ms.custom: 
#Customer intent: As a device builder, I want to see a working IoT device sample using FreeRTOS to connect to Azure IoT Hub.  The device should be able to send telemetry and respond to commands. As a solution builder, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Quickstart: Connect an ESPRESSIF ESP32-Azure IoT Kit to IoT Hub

**Applies to**: [Embedded device development](about-iot-develop.md#embedded-device-development)<br>
**Total completion time**:  45 minutes

In this quickstart, you use the Azure IoT middleware for FreeRTOS to connect the ESPRESSIF ESP32-Azure IoT Kit (from now on, the ESP32 DevKit) to Azure IoT.

You'll complete the following tasks:

* Install a set of embedded development tools for programming an ESP32 DevKit
* Build an image and flash it onto the ESP32 DevKit
* Use Azure CLI to create and manage an Azure IoT hub that the ESP32 DevKit will securely connect to
* Use Azure IoT Explorer to register a device with your IoT hub, view device properties, view device telemetry, and call direct commands on the device

## Prerequisites

* A PC running Windows 10 or Windows 11
* [Git](https://git-scm.com/downloads) for cloning the repository
* Hardware
    * ESPRESSIF [ESP32-Azure IoT Kit](https://www.espressif.com/products/devkits/esp32-azure-kit/overview)
    * USB 2.0 A male to Micro USB male cable
    * Wi-Fi 2.4 GHz
* An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prepare the development environment

### Install the tools
To set up your development environment, first you install the ESPRESSIF ESP-IDF build environment. The installer includes all the tools required to clone, build, flash, and monitor your device.

To install the ESP-IDF tools:
1. Download and launch the [ESP-IDF v5.0 Offline-installer](https://dl.espressif.com/dl/esp-idf).
1. When the installer lists components to install, select all components and complete the installation. 


### Clone the repo

Clone the following repo to download all sample device code, setup scripts, and SDK documentation. If you previously cloned this repo, you don't need to do it again.

To clone the repo, run the following command:

```shell
git clone --recursive  https://github.com/Azure-Samples/iot-middleware-freertos-samples.git
```

For Windows 10 and 11, make sure long paths are enabled. 

1. To enable long paths, see [Enable long paths in Windows 10](/windows/win32/fileio/maximum-file-path-limitation?tabs=registry). 
1. In git, run the following command in a terminal with administrator permissions:

    ```shell
    git config --system core.longpaths true
    ```

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

In the rest of this quickstart, you'll use IoT Explorer to register a device to your IoT hub, to view the device properties and telemetry, and to send commands to your device. In this section, you configure IoT Explorer to connect to the IoT hub you  created, and to read plug and play models from the public model repository. 

To add a connection to your IoT hub:

1. In your CLI app, run the [az iot hub connection-string show](/cli/azure/iot/hub/connection-string#az-iot-hub-connection-string-show) command to get the connection string for your IoT hub.

    ```azurecli
    az iot hub connection-string  show --hub-name {YourIoTHubName}
    ```

1. Copy the connection string without the surrounding quotation characters.
1. In Azure IoT Explorer, select **IoT hubs** on the left menu.
1. Select **+ Add connection**. 
1. Paste the connection string into the **Connection string** box.
1. Select **Save**.

    :::image type="content" source="media/quickstart-devkit-espressif-esp32-iot-hub/iot-explorer-add-connection.png" alt-text="Screenshot of adding a connection in IoT Explorer.":::

If the connection succeeds, IoT Explorer switches to the **Devices** view.

To add the public model repository:

1. In IoT Explorer, select **Home** to return to the home view.
1. On the left menu, select **IoT Plug and Play Settings**, then select **+Add** and select **Public repository** from the drop-down menu.
1. An entry appears for the public model repository at `https://devicemodels.azure.com`.

    :::image type="content" source="media/quickstart-devkit-espressif-esp32-iot-hub/iot-explorer-add-public-repository.png" alt-text="Screenshot of adding the public model repository in IoT Explorer.":::

1. Select **Save**.

### Register a device

In this section, you create a new device instance and register it with the IoT hub you created. You'll use the connection information for the newly registered device to securely connect your physical device in a later section.

To register a device:

1. From the home view in IoT Explorer, select **IoT hubs**.
1. The connection you previously added should appear. Select **View devices in this hub** below the connection properties.
1. Select **+ New** and enter a device ID for your device; for example, `mydevice`. Leave all other properties the same.
1. Select **Create**.

    :::image type="content" source="media/quickstart-devkit-espressif-esp32-iot-hub/iot-explorer-device-created.png" alt-text="Screenshot of Azure IoT Explorer device identity.":::

1. Use the copy buttons to copy the **Device ID** and **Primary key** fields.

Before continuing to the next section, save each of the following values retrieved from earlier steps, to a safe location. You use these values in the next section to configure your device. 

* `hostName`
* `deviceId`
* `primaryKey`


## Prepare the device
To connect the ESP32 DevKit to Azure, you'll modify configuration settings, build the image, and flash the image to the device. 

### Set up the environment
To launch the ESP-IDF environment:
1. Select Windows **Start**, find **ESP-IDF 5.0 CMD** and run it. 
1. In **ESP-IDF 5.0 CMD**, navigate to the *iot-middleware-freertos-samples* directory that you cloned previously.
1. Navigate to the ESP32-Azure IoT Kit project directory *demos\projects\ESPRESSIF\aziotkit*.
1. Run the following command to launch the configuration menu:

    ```shell
    idf.py menuconfig
    ```

### Add configuration

To add wireless network configuration:
1. In **ESP-IDF 5.0 CMD**, select **Azure IoT middleware for FreeRTOS Sample Configuration --->**, and press <kbd>Enter</kbd>.
1. Set the following configuration settings using your local wireless network credentials.

    |Setting|Value|
    |-------------|-----|
    |**WiFi SSID** |{*Your Wi-Fi SSID*}|
    |**WiFi Password** |{*Your Wi-Fi password*}|

1. Select <kbd>Esc</kbd> to return to the previous menu.

To add configuration to connect to Azure IoT Hub:
1. Select **Azure IoT middleware for FreeRTOS Main Task Configuration --->**, and press <kbd>Enter</kbd>.
1. Set the following Azure IoT configuration settings to the values that you saved after you created Azure resources.

    |Setting|Value|
    |-------------|-----|
    |**Azure IoT Hub FQDN** |{*Your host name*}|
    |**Azure IoT Device ID** |{*Your Device ID*}|
    |**Azure IoT Device Symmetric Key** |{*Your primary key*}|

    > [!NOTE]
    > In the setting **Azure IoT Authentication Method**, confirm that the default value of *Symmetric Key* is selected. 

1. Select <kbd>Esc</kbd> to return to the previous menu.


To save the configuration:
1. Select <kbd>Shift</kbd>+<kbd>S</kbd> to open the save options. This lets you save the configuration to a file named *skconfig* in the current *.\aziotkit* directory. 
1. Select <kbd>Enter</kbd> to save the configuration.
1. Select <kbd>Enter</kbd> to dismiss the acknowledgment message.
1. Select <kbd>Q</kbd> to quit the configuration menu.


### Build and flash the image
In this section, you use the ESP-IDF tools to build, flash, and monitor the ESP32 DevKit as it connects to Azure IoT.  

> [!NOTE]
> In the following commands in this section, use a short build output path near your root directory. Specify the build path after the `-B` parameter in each command that requires it. The short path helps to avoid a current issue in the ESPRESSIF ESP-IDF tools that can cause errors with long build path names.  The following commands use a local path *C:\espbuild* as an example.

To build the image:
1. In **ESP-IDF 5.0 CMD**, from the *iot-middleware-freertos-samples\demos\projects\ESPRESSIF\aziotkit* directory, run the following command to build the image.

    ```shell
    idf.py --no-ccache -B "C:\espbuild" build 
    ```

1. After the build completes, confirm that the binary image file was created in the build path that you specified previously.

    *C:\espbuild\azure_iot_freertos_esp32.bin*

To flash the image:
1. On the ESP32 DevKit, locate the Micro USB port, which is highlighted in the following image:

    :::image type="content" source="media/quickstart-devkit-espressif-esp32-iot-hub/esp-azure-iot-kit.png" alt-text="Photo of the ESP32-Azure IoT Kit board.":::

1. Connect the Micro USB cable to the Micro USB port on the ESP32 DevKit, and then connect it to your computer.
1. Open Windows **Device Manager**, and view **Ports** to find out which COM port the ESP32 DevKit is connected to.

    :::image type="content" source="media/quickstart-devkit-espressif-esp32-iot-hub/esp-device-manager.png" alt-text="Screenshot of Windows Device Manager displaying COM port for a connected device.":::

1. In **ESP-IDF 5.0 CMD**, run the following command, replacing the *\<Your-COM-port\>* placeholder and brackets with the correct COM port from the previous step. For example, replace the placeholder with `COM3`. 

    ```shell
    idf.py --no-ccache -B "C:\espbuild" -p <Your-COM-port> flash
    ```

1. Confirm that the output completes with the following text for a successful flash:

    ```output
    Hash of data verified
    
    Leaving...
    Hard resetting via RTS pin...
    Done
    ```

To confirm that the device connects to Azure IoT Central:
1. In **ESP-IDF 5.0 CMD**, run the following command to start the monitoring tool. As you did in a previous command, replace the \<Your-COM-port\> placeholder, and brackets with the COM port that the device is connected to.

    ```shell
    idf.py -B "C:\espbuild" -p <Your-COM-port> monitor
    ```

1. Check for repeating blocks of output similar to the following example. This output confirms that the device connects to Azure IoT and sends telemetry.

    ```output
    I (50807) AZ IOT: Successfully sent telemetry message
    I (50807) AZ IOT: Attempt to receive publish message from IoT Hub.
    
    I (51057) MQTT: Packet received. ReceivedBytes=2.
    I (51057) MQTT: Ack packet deserialized with result: MQTTSuccess.
    I (51057) MQTT: State record updated. New state=MQTTPublishDone.
    I (51067) AZ IOT: Puback received for packet id: 0x00000008
    I (53067) AZ IOT: Keeping Connection Idle...
    ```

## View device properties

You can use Azure IoT Explorer to view and manage the properties of your devices. In the following sections, you'll use the Plug and Play capabilities that are visible in IoT Explorer to manage and interact with the ESP32 DevKit. These capabilities rely on the device model published for the ESP32 DevKit in the public model repository. You configured IoT Explorer to search this repository for device models earlier in this quickstart. In many cases, you can perform the same action without using plug and play by selecting IoT Explorer menu options. However, using plug and play often provides an enhanced experience. IoT Explorer can read the device model specified by a plug and play device and present information specific to that device.  

To access IoT Plug and Play components for the device in IoT Explorer:

1. From the home view in IoT Explorer, select **IoT hubs**, then select **View devices in this hub**.
1. Select your device.
1. Select **IoT Plug and Play components**.
1. Select **Default component**. IoT Explorer displays the IoT Plug and Play components that are implemented on your device.

    :::image type="content" source="media/quickstart-devkit-espressif-esp32-iot-hub/iot-explorer-default-component-view.png" alt-text="Screenshot of the device's default component in IoT Explorer.":::

1. On the **Interface** tab, view the JSON content in the device model **Description**. The JSON contains configuration details for each of the IoT Plug and Play components in the device model.

    Each tab in IoT Explorer corresponds to one of the IoT Plug and Play components in the device model.

    | Tab | Type | Name | Description |
    |---|---|---|---|
    | **Interface** | Interface | `Espressif ESP32 Azure IoT Kit` | Example device model for the ESP32 DevKit |
    | **Properties (writable)** | Property | `telemetryFrequencySecs` | The interval that the device sends telemetry |
    | **Commands** | Command | `ToggleLed1` | Turn the LED on or off |
    | **Commands** | Command | `ToggleLed2` | Turn the LED on or off |
    | **Commands** | Command | `DisplayText` | Displays sent text on the device screen |

To view and edit device properties using Azure IoT Explorer:

1. Select the **Properties (writable)** tab. It displays the interval that telemetry is sent.
1. Change the `telemetryFrequencySecs` value to *5*, and then select **Update desired value**. Your device now uses this interval to send telemetry.

    :::image type="content" source="media/quickstart-devkit-espressif-esp32-iot-hub/iot-explorer-set-telemetry-interval.png" alt-text="Screenshot of setting telemetry interval on the device in IoT Explorer.":::

1. IoT Explorer responds with a notification. 
 
To use Azure CLI to view device properties:

1. In your CLI console, run the [az iot hub device-twin show](/cli/azure/iot/hub/device-twin#az-iot-hub-device-twin-show) command.

    ```azurecli
    az iot hub device-twin show --device-id mydevice --hub-name {YourIoTHubName}
    ```

1. Inspect the properties for your device in the console output.

> [!TIP]
> You can also use Azure IoT Explorer to view device properties. In the left navigation select **Device twin**. 

## View telemetry

With Azure IoT Explorer, you can view the flow of telemetry from your device to the cloud. Optionally, you can do the same task using Azure CLI.

To view telemetry in Azure IoT Explorer:

1. From the **IoT Plug and Play components** (Default Component) pane for your device in IoT Explorer, select the **Telemetry** tab. Confirm that **Use built-in event hub** is set to *Yes*.
1. Select **Start**.
1. View the telemetry as the device sends messages to the cloud.

    :::image type="content" source="media/quickstart-devkit-espressif-esp32-iot-hub/iot-explorer-device-telemetry.png" alt-text="Screenshot of device telemetry in IoT Explorer.":::

1. Select the **Show modeled events** checkbox to view the events in the data format specified by the device model.

    :::image type="content" source="media/quickstart-devkit-espressif-esp32-iot-hub/iot-explorer-show-modeled-events.png" alt-text="Screenshot of modeled telemetry events in IoT Explorer.":::

1. Select **Stop** to end receiving events.

To use Azure CLI to view device telemetry:

1. Run the [az iot hub monitor-events](/cli/azure/iot/hub#az-iot-hub-monitor-events) command. Use the names that you created previously in Azure IoT for your device and IoT hub.

    ```azurecli
    az iot hub monitor-events --device-id mydevice --hub-name {YourIoTHubName}
    ```

1. View the JSON output in the console.

    ```json
    {
        "event": {
            "origin": "mydevice",
            "module": "",
            "interface": "dtmi:azureiot:devkit:freertos:Esp32AzureIotKit;1",
            "component": "",
            "payload": "{\"temperature\":28.6,\"humidity\":25.1,\"light\":116.66,\"pressure\":-33.69,\"altitude\":8764.9,\"magnetometerX\":1627,\"magnetometerY\":28373,\"magnetometerZ\":4232,\"pitch\":6,\"roll\":0,\"accelerometerX\":-1,\"accelerometerY\":0,\"accelerometerZ\":9}"
        }
    }
    ```

1. Select CTRL+C to end monitoring.


## Call a direct method on the device

You can also use Azure IoT Explorer to call a direct method that you've implemented on your device. Direct methods have a name, and can optionally have a JSON payload, configurable connection, and method timeout. In this section, you call a method that turns an LED on or off. Optionally, you can do the same task using Azure CLI.

To call a method in Azure IoT Explorer:

1. From the **IoT Plug and Play components** (Default Component) pane for your device in IoT Explorer, select the **Commands** tab.
1. For the **ToggleLed1** command, select **Send command**. The LED on the ESP32 DevKit toggles on or off.  You should also see a notification in IoT Explorer. 

    :::image type="content" source="media/quickstart-devkit-espressif-esp32-iot-hub/iot-explorer-invoke-method.png" alt-text="Screenshot of calling a method in IoT Explorer.":::

1. For the **DisplayText** command, enter some text in the **content** field. 
1. Select **Send command**.  The text displays on the ESP32 DevKit screen. 


To use Azure CLI to call a method:

1. Run the [az iot hub invoke-device-method](/cli/azure/iot/hub#az-iot-hub-invoke-device-method) command, and specify the method name and payload. For this method, setting `method-payload` to `true` means the LED toggles to the opposite of its current state. 


    ```azurecli
    az iot hub invoke-device-method --device-id mydevice --method-name ToggleLed2 --method-payload true --hub-name {YourIoTHubName}
    ```

    The CLI console shows the status of your method call on the device, where `200` indicates success.

    ```json
    {
      "payload": {},
      "status": 200
    } 
    ```

1. Check your device to confirm the LED state.

## Troubleshoot and debug

If you experience issues building the device code, flashing the device, or connecting, see [Troubleshooting](troubleshoot-embedded-device-quickstarts.md).

For debugging the application, see [Debugging with Visual Studio Code](https://github.com/azure-rtos/getting-started/blob/master/docs/debugging.md).

## Clean up resources

If you no longer need the Azure resources created in this quickstart, you can use the Azure CLI to delete the resource group and all of its resources.

> [!IMPORTANT] 
> Deleting a resource group is irreversible. The resource group and all the resources contained in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources.

To delete a resource group by name:

1. Run the [az group delete](/cli/azure/group#az-group-delete) command. This command removes the resource group, the IoT Hub, and the device registration you created.

    ```azurecli-interactive
    az group delete --name MyResourceGroup
    ```

1. Run the [az group list](/cli/azure/group#az-group-list) command to confirm the resource group is deleted.  

    ```azurecli-interactive
    az group list
    ```

## Next steps

In this quickstart, you built a custom image that contains the Azure IoT middleware for FreeRTOS sample code, and then you flashed the image to the ESP32 DevKit device. You connected the ESP32 DevKit to Azure IoT Hub, and carried out tasks such as viewing telemetry and calling methods on the device.

As a next step, explore the following articles to learn more about using the IoT device SDKs to connect devices to Azure IoT. 

> [!div class="nextstepaction"]
> [Connect a simulated general device to IoT Hub](quickstart-send-telemetry-iot-hub.md)
> [!div class="nextstepaction"]
> [Learn more about connecting embedded devices using C SDK and Embedded C SDK](concepts-using-c-sdk-and-embedded-c-sdk.md)
