---
title: Connect a Microchip ATSAME54-XPro to Azure IoT Hub quickstart
description: Use Azure RTOS embedded software to connect a Microchip ATSAME54-XPro device to Azure IoT Hub and send telemetry.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.devlang: c
ms.topic: quickstart
ms.date: 12/5/2022

#- id: iot-develop-toolset
## Owner: timlt
#  title: IoT Devices
#  prompt: Choose a build environment
#  - id: iot-toolset-mplab
#    title: MPLAB
#Customer intent: As a device builder, I want to see a working IoT device sample connecting to IoT Hub and sending properties and telemetry, and responding to commands. As a solution builder, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Quickstart: Connect a Microchip ATSAME54-XPro Evaluation kit to IoT Hub

**Applies to**: [Embedded device development](about-iot-develop.md#embedded-device-development)<br>
**Total completion time**:  45 minutes

[![Browse code](media/common/browse-code.svg)](https://github.com/azure-rtos/getting-started/tree/master/Microchip/ATSAME54-XPRO)

In this quickstart, you use Azure RTOS to connect the Microchip ATSAME54-XPro (from now on, the Microchip E54) to Azure IoT.

You'll complete the following tasks:

* Install a set of embedded development tools for programming a Microchip E54 in C
* Build an image and flash it onto the Microchip E54
* Use Azure CLI to create and manage an Azure IoT hub that the Microchip E54 will securely connect to
* Use Azure IoT Explorer to register a device with your IoT hub, view device properties, view device telemetry, and call direct commands on the device

## Prerequisites

* A PC running Windows 10 or Windows 11
* [Git](https://git-scm.com/downloads) for cloning the repository
* Hardware

  * The [Microchip ATSAME54-XPro](https://www.microchip.com/developmenttools/productdetails/atsame54-xpro) (Microchip E54)
  * USB 2.0 A male to Micro USB male cable
  * Wired Ethernet access
  * Ethernet cable
  * Optional: [Weather Click](https://www.mikroe.com/weather-click) sensor. You can add this sensor to the device to monitor weather conditions. If you don't have this sensor, you can still complete this quickstart.
  * Optional: [mikroBUS Xplained Pro](https://www.microchip.com/Developmenttools/ProductDetails/ATMBUSADAPTER-XPRO) adapter. Use this adapter to attach the Weather Click sensor to the Microchip E54. If you don't have the sensor and this adapter, you can still complete this quickstart.
* An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prepare the development environment

To set up your development environment, first you clone a GitHub repo that contains all the assets you need for the quickstart. Then you install a set of programming tools.

### Clone the repo for the quickstart

Clone the following repo to download all sample device code, setup scripts, and offline versions of the documentation. If you previously cloned this repo in another quickstart, you don't need to do it again.

To clone the repo, run the following command:

```shell
git clone --recursive https://github.com/azure-rtos/getting-started.git
```

### Install the tools

The cloned repo contains a setup script that installs and configures the required tools. If you installed these tools in another embedded device quickstart, you don't need to do it again.

> [!NOTE]
> The setup script installs the following tools:
> * [CMake](https://cmake.org): Build
> * [ARM GCC](https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm): Compile
> * [Termite](https://www.compuphase.com/software_termite.htm): Monitor serial port output for connected devices

To install the tools:

1. From File Explorer, navigate to the following path in the repo and run the setup script named *get-toolchain.bat*:

    *getting-started\tools\get-toolchain.bat*

1. After the installation, open a new console window to recognize the configuration changes made by the setup script. Use this console to complete the remaining programming tasks in the quickstart. You can use Windows CMD, PowerShell, or Git Bash for Windows.
1. Run the following code to confirm that CMake version 3.14 or later is installed.

    ```shell
    cmake --version
    ```

1. Install [Microchip Studio for AVR&reg; and SAM devices](https://www.microchip.com/en-us/development-tools-tools-and-software/microchip-studio-for-avr-and-sam-devices#). Microchip Studio is a device development environment that includes the tools to program and flash the Microchip E54. For this tutorial, you use Microchip Studio only to flash the Microchip E54. The installation takes several minutes, and prompts you several times to approve the installation of components.

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

    *YourIotHubName*. Replace this placeholder below with the name you chose for your IoT hub. An IoT hub name must be globally unique in Azure. This placeholder is used in the rest of this quickstart to represent your unique IoT hub name.

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

    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro-iot-hub/iot-explorer-add-connection.png" alt-text="Screenshot of adding a connection in IoT Explorer.":::

If the connection succeeds, IoT Explorer switches to the **Devices** view.

To add the public model repository:

1. In IoT Explorer, select **Home** to return to the home view.
1. On the left menu, select **IoT Plug and Play Settings**, then select **+Add** and select **Public repository** from the drop-down menu.
1. An entry appears for the public model repository at `https://devicemodels.azure.com`.

    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro-iot-hub/iot-explorer-add-public-repository.png" alt-text="Screenshot of adding the public model repository in IoT Explorer.":::

1. Select **Save**.

### Register a device

In this section, you create a new device instance and register it with the IoT hub you created. You'll use the connection information for the newly registered device to securely connect your physical device in a later section.

To register a device:

1. From the home view in IoT Explorer, select **IoT hubs**.
1. The connection you previously added should appear. Select **View devices in this hub** below the connection properties.
1. Select **+ New** and enter a device ID for your device; for example, `mydevice`. Leave all other properties the same.
1. Select **Create**.

    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro-iot-hub/iot-explorer-device-created.png" alt-text="Screenshot of Azure IoT Explorer device identity.":::

1. Use the copy buttons to copy the **Device ID** and **Primary key** fields.

Before continuing to the next section, save each of the following values retrieved from earlier steps, to a safe location. You use these values in the next section to configure your device. 

* `hostName`
* `deviceId`
* `primaryKey`

## Prepare the device

To connect the Microchip E54 to Azure, you'll modify a configuration file for Azure IoT settings, rebuild the image, and flash the image to the device.

### Add configuration

1. Open the following file in a text editor:

    *getting-started\Microchip\ATSAME54-XPRO\app\azure_config.h*

1. Comment out the following line near the top of the file as shown:

    ```c
    // #define ENABLE_DPS 
    ```

1. Set the Azure IoT device information constants to the values that you saved after you created Azure resources.

    |Constant name|Value|
    |-------------|-----|
    | `IOT_HUB_HOSTNAME` | {*Your host name value*} |
    | `IOT_HUB_DEVICE_ID` | {*Your Device ID value*} |
    | `IOT_DEVICE_SAS_KEY` | {*Your Primary key value*} |

1. Save and close the file.

### Connect the device

1. On the Microchip E54, locate the **Reset** button, the **Ethernet** port, and the Micro USB port, which is labeled **Debug USB**. Each component is highlighted in the following picture:

    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro-iot-hub/microchip-xpro-board.png" alt-text="Picture of the Microchip E54 development kit board.":::

1. Connect the Micro USB cable to the **Debug USB** port on the Microchip E54, and then connect it to your computer.

    > [!NOTE]
    > Optionally, for more information about setting up and getting started with the Microchip E54, see [SAM E54 Xplained Pro User's Guide](http://ww1.microchip.com/downloads/en/DeviceDoc/70005321A.pdf).

1. Use the Ethernet cable to connect the Microchip E54 to an Ethernet port.

### Optional: Install a weather sensor

If you have the Weather Click sensor and the mikroBUS Xplained Pro adapter, follow the steps in this section; otherwise, skip to [Build the image](#build-the-image). You can complete this quickstart even if you don't have a sensor. The sample code for the device returns simulated data if a real sensor isn't present.

1. If you have the Weather Click sensor and the mikroBUS Xplained Pro adapter, install them on the Microchip E54 as shown in the following photo:

    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro-iot-hub/sam-e54-sensor.png" alt-text="Photo of the Install Weather Click sensor and mikroBUS Xplained Pro adapter on the Microchip ES4.":::

1. Reopen the configuration file you edited previously:

    *getting-started\Microchip\ATSAME54-XPRO\app\azure_config.h*

1. Set the value of the constant `__SENSOR_BME280__` to **1** as shown in the following code from the header file. Setting this value enables the device to use real sensor data from the Weather Click sensor.

    `#define __SENSOR_BME280__ 1`

1. Save and close the file.

### Build the image

1. In your console or in File Explorer, run the script ***rebuild.bat*** at the following path to build the image:

    *getting-started\Microchip\ATSAME54-XPRO\tools\rebuild.bat*

1. After the build completes, confirm that the binary file was created in the following path:

    *getting-started\Microchip\ATSAME54-XPRO\build\app\atsame54_azure_iot.bin*

### Flash the image

1. Open the **Windows Start > Microchip Studio Command Prompt** console and go to the folder of the Microchip E54 binary file that you built.

    *getting-started\Microchip\ATSAME54-XPRO\build\app*

1. Use the *atprogram* utility to flash the Microchip E54 with the binary image:

    ```shell
    atprogram --tool edbg --interface SWD --device ATSAME54P20A program --chiperase --file atsame54_azure_iot.bin --verify
    ```

    > [!NOTE]
    > For more information about using the Atmel-ICE and atprogram tools with the Microchip E54, see [Using Atmel-ICE for AVR Programming In Mass Production](http://ww1.microchip.com/downloads/en/AppNotes/00002466A.pdf).

    After the flashing process completes, the console confirms that programming was successful:

    ```output
    Firmware check OK
    Programming and verification completed successfully.
    ```

### Confirm device connection details

You can use the **Termite** app to monitor communication and confirm that your device is set up correctly.

1. Start **Termite**.

    > [!TIP]
    > If you have issues getting your device to initialize or connect after flashing, see [Troubleshooting](troubleshoot-embedded-device-quickstarts.md).

1. Select **Settings**.

1. In the **Serial port settings** dialog, check the following settings and update if needed:
    * **Baud rate**: 115,200
    * **Port**: The port that your Microchip E54 is connected to. If there are multiple port options in the dropdown, you can find the correct port to use. Open Windows **Device Manager**, and view **Ports** to identify which port to use.
    * **Flow control**: DTR/DSR

    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro-iot-hub/termite-settings.png" alt-text="Screenshot of serial port settings in the Termite app.":::

1. Select **OK**.

1. Press the **Reset** button on the device. The button is labeled on the device and located near the Micro USB connector.

1. In the **Termite** app, confirm the following checkpoint values to verify that the device is initialized and connected to Azure IoT.

    ```output
    Initializing DHCP
    	MAC: *************
    	IP address: 192.168.0.41
    	Mask: 255.255.255.0
    	Gateway: 192.168.0.1
    SUCCESS: DHCP initialized
    
    Initializing DNS client
    	DNS address: 192.168.0.1
    	DNS address: ***********
    SUCCESS: DNS client initialized
    
    Initializing SNTP time sync
    	SNTP server 0.pool.ntp.org
    	SNTP time update: Dec 3, 2022 0:5:35.572 UTC 
    SUCCESS: SNTP initialized
    
    Initializing Azure IoT Hub client
    	Hub hostname: ***************
    	Device id: mydevice
    	Model id: dtmi:azurertos:devkit:gsg;2
    SUCCESS: Connected to IoT Hub
    ```

Keep Termite open to monitor device output in the following steps.

## View device properties

You can use Azure IoT Explorer to view and manage the properties of your devices. In the following sections, you'll use the Plug and Play capabilities that are visible in IoT Explorer to manage and interact with the Microchip E54. These capabilities rely on the device model published for the Microchip E54 in the public model repository. You configured IoT Explorer to search this repository for device models earlier in this quickstart. In many cases, you can perform the same action without using plug and play by selecting IoT Explorer menu options. However, using plug and play often provides an enhanced experience. IoT Explorer can read the device model specified by a plug and play device and present information specific to that device.  

To access IoT Plug and Play components for the device in IoT Explorer:

1. From the home view in IoT Explorer, select **IoT hubs**, then select **View devices in this hub**.
1. Select your device.
1. Select **IoT Plug and Play components**.
1. Select **Default component**. IoT Explorer displays the IoT Plug and Play components that are implemented on your device.

    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro-iot-hub/iot-explorer-default-component-view.png" alt-text="Screenshot of the device's default component in IoT Explorer.":::

1. On the **Interface** tab, view the JSON content in the device model **Description**. The JSON contains configuration details for each of the IoT Plug and Play components in the device model.

    Each tab in IoT Explorer corresponds to one of the IoT Plug and Play components in the device model.

    | Tab | Type | Name | Description |
    |---|---|---|---|
    | **Interface** | Interface | `Getting Started Guide` | Example model for the Azure RTOS Getting Started Guides |
    | **Properties (read-only)** | Property | `ledState` | Whether the led is on or off |
    | **Properties (writable)** | Property | `telemetryInterval` | The interval that the device sends telemetry |
    | **Commands** | Command | `setLedState` | Turn the LED on or off |

To view device properties using Azure IoT Explorer:

1. Select the **Properties (read-only)** tab. There's a single read-only property to indicate whether the led is on or off. 
1. Select the **Properties (writable)** tab. It displays the interval that telemetry is sent.
1. Change the `telemetryInterval` to *5*, and then select **Update desired value**. Your device now uses this interval to send telemetry.

    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro-iot-hub/iot-explorer-set-telemetry-interval.png" alt-text="Screenshot of setting telemetry interval on the device in IoT Explorer.":::

1. IoT Explorer responds with a notification. You can also observe the update in Termite.
1. Set the telemetry interval back to 10.
 
To use Azure CLI to view device properties:

1. Run the [az iot hub device-twin show](/cli/azure/iot/hub/device-twin#az-iot-hub-device-twin-show) command.

    ```azurecli
    az iot hub device-twin show --device-id mydevice --hub-name {YourIoTHubName}
    ```

1. Inspect the properties for your device in the console output.

## View telemetry

With Azure IoT Explorer, you can view the flow of telemetry from your device to the cloud. Optionally, you can do the same task using Azure CLI.

To view telemetry in Azure IoT Explorer:

1. From the **IoT Plug and Play components** (Default Component) pane for your device in IoT Explorer, select the **Telemetry** tab. Confirm that **Use built-in event hub** is set to *Yes*.
1. Select **Start**.
1. View the telemetry as the device sends messages to the cloud.

    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro-iot-hub/iot-explorer-device-telemetry.png" alt-text="Screenshot of device telemetry in IoT Explorer.":::

    > [!NOTE]
    > You can also monitor telemetry from the device by using the Termite app.

1. Select the **Show modeled events** checkbox to view the events in the data format specified by the device model.

    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro-iot-hub/iot-explorer-show-modeled-events.png" alt-text="Screenshot of modeled telemetry events in IoT Explorer.":::

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
            "interface": "dtmi:azurertos:devkit:gsg;2",
            "component": "",
            "payload": {
                "humidity": 17.08,
                "temperature": 25.66,
                "pressure": 93389.22
            }
        }
    }
    ```

1. Select CTRL+C to end monitoring.


## Call a direct method on the device

You can also use Azure IoT Explorer to call a direct method that you've implemented on your device. Direct methods have a name, and can optionally have a JSON payload, configurable connection, and method timeout. In this section, you call a method that turns an LED on or off. Optionally, you can do the same task using Azure CLI.

To call a method in Azure IoT Explorer:

1. From the **IoT Plug and Play components** (Default Component) pane for your device in IoT Explorer, select the **Commands** tab.
1. For the **setLedState** command, set the **state** to **true**.
1. Select **Send command**. You should see a notification in IoT Explorer, and the green LED light on the device should turn on.

    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro-iot-hub/iot-explorer-invoke-method.png" alt-text="Screenshot of calling the setLedState method in IoT Explorer.":::

1. Set the **state** to  **false**, and then select **Send command**. The LED should turn off.
1. Optionally, you can view the output in Termite to monitor the status of the methods.

To use Azure CLI to call a method:

1. Run the [az iot hub invoke-device-method](/cli/azure/iot/hub#az-iot-hub-invoke-device-method) command, and specify the method name and payload. For this method, setting `method-payload` to `true` turns on the LED, and setting it to `false` turns it off.

    ```azurecli
    az iot hub invoke-device-method --device-id mydevice --method-name setLedState --method-payload true --hub-name {YourIoTHubName}
    ```

    The CLI console shows the status of your method call on the device, where `204` indicates success.

    ```json
    {
        "payload": {},
        "status": 200
    }    
    ```

1. Check your device to confirm the LED state.

1. View the Termite terminal to confirm the output messages:

    ```output
    Received command: setLedState
        Payload: true
        LED is turned ON
    Sending property: $iothub/twin/PATCH/properties/reported/?$rid=15{"ledState":true}
    ```

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

In this quickstart, you built a custom image that contains Azure RTOS sample code, and then flashed the image to the Microchip E54 device. You connected the Microchip E54 to Azure IoT Hub, and carried out tasks such as viewing telemetry and calling a method on the device.

As a next step, explore the following articles to learn more about using the IoT device SDKs, or Azure RTOS to connect devices to Azure IoT. 

> [!div class="nextstepaction"]
> [Connect a simulated device to IoT Hub](quickstart-send-telemetry-iot-hub.md)

> [!IMPORTANT]
> Azure RTOS provides OEMs with components to secure communication and to create code and data isolation using underlying MCU/MPU hardware protection mechanisms. However, each OEM is ultimately responsible for ensuring that their device meets evolving security requirements.
