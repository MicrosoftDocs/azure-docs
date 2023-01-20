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

> [!NOTE]
> Installation can take several minutes. 

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
To connect the ESP32 DevKit to Azure, you'll modify configuration settings, build the image, and flash the image to the device. You can run all the commands in this section within the ESP-IDF command line.

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
1. In **ESP-IDF 5.0 CMD**, select **Azure IoT middleware for FreeRTOS Sample Configuration --->**, and press Enter.
1. Set the following configuration settings using your local wireless network credentials.

    |Setting|Value|
    |-------------|-----|
    |**WiFi SSID** |{*Your Wi-Fi SSID*}|
    |**WiFi Password** |{*Your Wi-Fi password*}|

1. Select <kbd>Esc</kbd> to return to the previous menu.

To add configuration to connect to Azure IoT Hub:
1. Select **Azure IoT middleware for FreeRTOS Main Task Configuration --->**, and press Enter.
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

## Verify the device status

To view the device status in the IoT Central portal:
1. From the application dashboard, select **Devices** on the side navigation menu.
1. Confirm that the **Device status** of the device is updated to **Provisioned**.
1. Confirm that the **Device template** of the device has updated to **Espressif ESP32 Azure IoT Kit**.

    :::image type="content" source="media/quickstart-devkit-espressif-esp32/esp-device-status.png" alt-text="Screenshot of ESP32 DevKit device status in IoT Central.":::

## View telemetry

In IoT Central, you can view the flow of telemetry from your device to the cloud.

To view telemetry in IoT Central:
1. From the application dashboard, select **Devices** on the side navigation menu.
1. Select the device from the device list.
1. Select the **Overview** tab on the device page, and view the telemetry as the device sends messages to the cloud.

    :::image type="content" source="media/quickstart-devkit-espressif-esp32/esp-telemetry.png" alt-text="Screenshot of the ESP32 DevKit device sending telemetry to IoT Central.":::

## Send a command to the device

You can also use IoT Central to send a command to your device. In this section, you run commands to send a message to the screen and toggle LED lights. 

To write to the screen:
1. In IoT Central, select the **Commands** tab on the device page.
1. Locate the **Espressif ESP32 Azure IoT Kit / Display Text** command.
1. In the **Content** textbox, enter the text you want to send to the device screen.
1. Select **Run**. 
1. Confirm that the device screen updates with the text.

To toggle an LED:
1. Select the **Command** tab on the device page.
1. Locate the **Toggle LED 1** or **Toggle LED 2** commands.
1. Select **Run**.
1. Confirm that an LED light on the device toggles on or off.

    :::image type="content" source="media/quickstart-devkit-espressif-esp32/esp-direct-commands.png" alt-text="Screenshot of entering directs commands for the device in IoT Central.":::

## View device information

You can view the device information from IoT Central.

Select the **About** tab on the device page.

:::image type="content" source="media/quickstart-devkit-espressif-esp32/esp-device-info.png" alt-text="Screenshot of device information in IoT Central.":::

> [!TIP]
> To customize these views, edit the [device template](../iot-central/core/howto-edit-device-template.md).

## Clean up resources

If you no longer need the Azure resources created in this tutorial, you can delete them from the IoT Central portal. Optionally, if you continue to another article in this Getting Started content, you can keep the resources you've already created and reuse them.

To keep the Azure IoT Central sample application but remove only specific devices:

1. Select the **Devices** tab for your application.
1. Select the device from the device list.
1. Select **Delete**.

To remove the entire Azure IoT Central sample application and all its devices and resources:

1. Select **Administration** > **Your application**.
1. Select **Delete**.

## Next Steps

In this quickstart, you built a custom image that contains the Azure IoT middleware for FreeRTOS sample code, and then you flashed the image to the ESP32 DevKit device. You also used the IoT Central portal to create Azure resources, connect the ESP32 DevKit securely to Azure, view telemetry, and send messages.

As a next step, explore the following articles to learn more about working with embedded devices and connecting them to Azure IoT. 

> [!div class="nextstepaction"]
> [Azure IoT middleware for FreeRTOS samples](https://github.com/Azure-Samples/iot-middleware-freertos-samples)
> [!div class="nextstepaction"]
> [Azure RTOS embedded development quickstarts](quickstart-devkit-mxchip-az3166.md)
> [!div class="nextstepaction"]
> [Azure IoT device development documentation](./index.yml)