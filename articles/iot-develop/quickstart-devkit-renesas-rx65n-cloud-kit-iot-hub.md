---
title: Connect a Renesas RX65N Cloud Kit to Azure IoT Hub quickstart
description: Use Azure RTOS embedded software to connect a Renesas RX65N Cloud Kit to Azure IoT Hub and send telemetry.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.devlang: c
ms.topic: quickstart
ms.date: 06/27/2023
---

# Quickstart: Connect a Renesas RX65N Cloud Kit to IoT Hub

**Applies to**: [Embedded device development](about-iot-develop.md#embedded-device-development)<br>
**Total completion time**:  30 minutes

:::image type="content" source="media/common/browse-code.svg" alt-text="An icon that links to GitHub source code."  link="https://github.com/azure-rtos/getting-started/tree/master/Renesas/RX65N_Cloud_Kit":::

In this quickstart, you use Azure RTOS to connect the Renesas RX65N Cloud Kit (from now on, the Renesas RX65N) to Azure IoT.

You complete the following tasks:

* Install a set of embedded development tools for programming the Renesas RX65N in C
* Build an image and flash it onto the Renesas RX65N
* Use Azure CLI to create and manage an Azure IoT hub that the Renesas RX65N securely connects to
* Use Azure IoT Explorer to register a device with your IoT hub, view device properties, view device telemetry, and call direct commands on the device

## Prerequisites

* A PC running Windows 10 or Windows 11.
* An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* [Git](https://git-scm.com/downloads) for cloning the repository
* Azure CLI. You have two options for running Azure CLI commands in this quickstart:
    * Use the Azure Cloud Shell, an interactive shell that runs CLI commands in your browser. This option is recommended because you don't need to install anything. If you're using Cloud Shell for the first time, sign in to the [Azure portal](https://portal.azure.com). Follow the steps in [Cloud Shell quickstart](../cloud-shell/quickstart.md) to **Start Cloud Shell** and **Select the Bash environment**.
    * Optionally, run Azure CLI on your local machine. If Azure CLI is already installed, run `az upgrade` to upgrade the CLI and extensions to the current version. To install Azure CLI, see [Install Azure CLI](/cli/azure/install-azure-cli).

* Hardware

    * The [Renesas RX65N Cloud Kit](https://www.renesas.com/products/microcontrollers-microprocessors/rx-32-bit-performance-efficiency-mcus/rx65n-cloud-kit-renesas-rx65n-cloud-kit) (Renesas RX65N)
    * Two USB 2.0 A male to Mini USB male cables
    * WiFi 2.4 GHz

## Prepare the development environment

To set up your development environment, first you clone a GitHub repo that contains all the assets you need for the quickstart. Then you install a set of programming tools.

### Clone the repo for the quickstart

Clone the following repo to download all sample device code, setup scripts, and offline versions of the documentation. If you previously cloned this repo in another quickstart, you don't need to do it again.

To clone the repo, run the following command:

```shell
git clone --recursive https://github.com/azure-rtos/getting-started/
```

### Install the tools

The cloned repo contains a setup script that installs and configures the required tools. If you installed these tools in another embedded device quickstart, you don't need to do it again.

> [!NOTE]
> The setup script installs the following tools:
> * [CMake](https://cmake.org): Build
> * [ARM GCC](https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm): Compile
> * [Termite](https://www.compuphase.com/software_termite.htm): Monitor serial port output for connected devices

To install the tools:

1. From File Explorer, navigate to the following path in the repo and run the setup script named *get-toolchain-rx.bat*:

    *getting-started\tools\get-toolchain-rx.bat*

1. Add the RX compiler to the Windows Path:

   *%USERPROFILE%\AppData\Roaming\GCC for Renesas RX 8.3.0.202004-GNURX-ELF\rx-elf\rx-elf\bin*

1. After the installation, open a new console window to recognize the configuration changes made by the setup script. Use this console to complete the remaining programming tasks in the quickstart. You can use Windows CMD, PowerShell, or Git Bash for Windows.
1. Run the following commands to confirm that CMake version 3.14 or later is installed. Make certain that the RX compiler path is set up correctly.

   ```shell
   cmake --version
   rx-elf-gcc --version
   ```
To install the remaining tools:

* Install [Renesas Flash Programmer](https://www.renesas.com/software-tool/renesas-flash-programmer-programming-gui) for Windows. The Renesas Flash Programmer development environment includes drivers and tools needed to flash the Renesas RX65N.

[!INCLUDE [iot-develop-create-cloud-components](../../includes/iot-develop-create-cloud-components.md)]

## Prepare the device

To connect the Renesas RX65N to Azure, you modify a configuration file for Wi-Fi and Azure IoT settings, build the image, and flash the image to the device.

### Add Wi-Fi configuration

1. Open the following file in a text editor:

    *getting-started\Renesas\RX65N_Cloud_Kit\app\azure_config.h*

1. Set the Wi-Fi constants to the following values from your local environment.

    |Constant name|Value|
    |-------------|-----|
    |`WIFI_SSID` |{*Your Wi-Fi SSID*}|
    |`WIFI_PASSWORD` |{*Your Wi-Fi password*}|

1. Comment out the following line near the top of the file as shown:

   ```c
   // #define ENABLE_DPS
   ```

1. Uncomment the following two lines near the end of the file as shown:

   ```c
   #define IOT_HUB_HOSTNAME  ""
   #define IOT_HUB_DEVICE_ID ""
   ```

1. Set the Azure IoT device information constants to the values that you saved after you created Azure resources.

    |Constant name|Value|
    |-------------|-----|
    |`IOT_HUB_HOSTNAME` |{*Your Iot hub hostName value*}|
    |`IOT_HUB_DEVICE_ID` |{*Your Device ID value*}|
    |`IOT_DEVICE_SAS_KEY` |{*Your Primary key value*}|

1. Save and close the file.

### Build the image

1. In your console or in File Explorer, run the script *rebuild.bat* at the following path to build the image:

    *getting-started\Renesas\RX65N_Cloud_Kit\tools\rebuild.bat*

2. After the build completes, confirm that the binary file was created in the following path:

    *getting-started\Renesas\RX65N_Cloud_Kit\build\app\rx65n_azure_iot.hex*

### Connect the device

> [!NOTE]
> For more information about setting up and getting started with the Renesas RX65N, see [Renesas RX65N Cloud Kit Quick Start](https://www.renesas.com/document/man/quick-start-guide-renesas-rx65n-cloud-kit).

1. Complete the following steps using the following image as a reference.

    :::image type="content" source="media/quickstart-devkit-renesas-rx65n-cloud-kit-iot-hub/renesas-rx65n.jpg" alt-text="Photo of the Renesas RX65N board that shows the reset, USB, and E1/E2Lite.":::

1. Remove the **EJ2** link from the board to enable the E2 Lite debugger. The link is located underneath the **USER SW** button.
    > [!WARNING]
    > Failure to remove this link will result in being unable to flash the device.

1. Connect the **WiFi module** to the **Cloud Option Board**

1. Using the first Mini USB cable, connect the **USB Serial** on the Renesas RX65N to your computer.

1. Using the second Mini USB cable, connect the **USB E2 Lite** on the Renesas RX65N to your computer.

### Flash the image

1. Launch the *Renesas Flash Programmer* application from the Start menu.

2. Select *New Project...* from the *File* menu, and enter the following settings:
    * **Microcontroller**: RX65x
    * **Project Name**: RX65N
    * **Tool**: E2 emulator Lite
    * **Interface**: FINE

    :::image type="content" source="media/quickstart-devkit-renesas-rx65n-cloud-kit-iot-hub/rfp-new.png" alt-text="Screenshot of Renesas Flash Programmer, New Project.":::

3. Select the *Tool Details* button, and navigate to the *Reset Settings* tab.

4. Select *Reset Pin as Hi-Z* and press the *OK* button.

    :::image type="content" source="media/quickstart-devkit-renesas-rx65n-cloud-kit-iot-hub/rfp-reset.png" alt-text="Screenshot of Renesas Flash Programmer, Reset Settings.":::

5. Press the *Connect* button and, when prompted, check the *Auto Authentication* checkbox and then press *OK*.

    :::image type="content" source="media/quickstart-devkit-renesas-rx65n-cloud-kit-iot-hub/rfp-auth.png" alt-text="Screenshot of Renesas Flash Programmer, Authentication.":::

6. Select the *Connect Settings* tab, select the *Speed* dropdown, and set the speed to 1,000,000 bps.
    > [!IMPORTANT]
    > If there are errors when you try to flash the board, you might need to lower the speed in this setting to 750,000 bps or lower.


6. Select the *Operation* tab, then select the *Browse...* button and locate the *rx65n_azure_iot.hex* file created in the previous section.

7. Press *Start* to begin flashing. This process takes less than a minute.

### Confirm device connection details

You can use the **Termite** app to monitor communication and confirm that your device is set up correctly.
> [!TIP]
> If you have issues getting your device to initialize or connect after flashing, see [Troubleshooting](troubleshoot-embedded-device-quickstarts.md).

1. Start **Termite**.
1. Select **Settings**.
1. In the **Serial port settings** dialog, check the following settings and update if needed:
    * **Baud rate**: 115,200
    * **Port**: The port that your Renesas RX65N is connected to. If there are multiple port options in the dropdown, you can find the correct port to use. Open Windows **Device Manager**, and view **Ports** to identify which port to use.

    :::image type="content" source="media/quickstart-devkit-renesas-rx65n-cloud-kit-iot-hub/termite-settings.png" alt-text="Screenshot of serial port settings in the Termite app.":::

1. Select OK.
1. Press the **Reset** button on the device.
1. In the **Termite** app, check the following checkpoint values to confirm that the device is initialized and connected to Azure IoT.

   ```output
    Starting Azure thread


    Initializing WiFi
        MAC address: ****************
        Firmware version 0.14
    SUCCESS: WiFi initialized

    Connecting WiFi
        Connecting to SSID '*********'
        Attempt 1...
    SUCCESS: WiFi connected

    Initializing DHCP
        IP address: 192.168.0.31
        Mask: 255.255.255.0
        Gateway: 192.168.0.1
    SUCCESS: DHCP initialized

    Initializing DNS client
        DNS address: 192.168.0.1
    SUCCESS: DNS client initialized

    Initializing SNTP time sync
        SNTP server 0.pool.ntp.org
        SNTP server 1.pool.ntp.org
        SNTP time update: May 19, 2023 20:40:56.472 UTC
    SUCCESS: SNTP initialized

    Initializing Azure IoT Hub client
        Hub hostname: ******.azure-devices.net
        Device id: mydevice
        Model id: dtmi:azurertos:devkit:gsgrx65ncloud;1
    SUCCESS: Connected to IoT Hub

    Receive properties: {"desired":{"$version":1},"reported":{"$version":1}}
    Sending property: $iothub/twin/PATCH/properties/reported/?$rid=3{"deviceInformation":{"__t":"c","manufacturer":"Renesas","model":"RX65N Cloud Kit","swVersion":"1.0.0","osName":"Azure RTOS","processorArchitecture":"RX65N","processorManufacturer":"Renesas","totalStorage":2048,"totalMemory":640}}
    Sending property: $iothub/twin/PATCH/properties/reported/?$rid=5{"ledState":false}
    Sending property: $iothub/twin/PATCH/properties/reported/?$rid=7{"telemetryInterval":{"ac":200,"av":1,"value":10}}

    Starting Main loop
    Telemetry message sent: {"humidity":0,"temperature":0,"pressure":0,"gasResistance":0}.
    Telemetry message sent: {"accelerometerX":-632,"accelerometerY":62,"accelerometerZ":8283}.
    Telemetry message sent: {"gyroscopeX":2,"gyroscopeY":0,"gyroscopeZ":8}.
    Telemetry message sent: {"illuminance":107.17}.
   ```

Keep Termite open to monitor device output in the following steps.

## View device properties

You can use Azure IoT Explorer to view and manage the properties of your devices. In the following sections, you use the Plug and Play capabilities that are visible in IoT Explorer to manage and interact with the Renesas RX65N. These capabilities rely on the device model published for the Renesas RX65N in the public model repository. You configured IoT Explorer to search this repository for device models earlier in this quickstart. In many cases, you can perform the same action without using plug and play by selecting IoT Explorer menu options. However, using plug and play often provides an enhanced experience. IoT Explorer can read the device model specified by a plug and play device and present information specific to that device.

To access IoT Plug and Play components for the device in IoT Explorer:

1. From the home view in IoT Explorer, select **IoT hubs**, then select **View devices in this hub**.
1. Select your device.
1. Select **IoT Plug and Play components**.
1. Select **Default component**. IoT Explorer displays the IoT Plug and Play components that are implemented on your device.

    :::image type="content" source="media/quickstart-devkit-renesas-rx65n-cloud-kit-iot-hub/iot-explorer-default-component-view.png" alt-text="Screenshot of the device default component in IoT Explorer.":::

1. On the **Interface** tab, view the JSON content in the device model **Description**. The JSON contains configuration details for each of the IoT Plug and Play components in the device model.

    > [!NOTE]
    > The name and description for the default component refer to the Renesas RX65N board.

    Each tab in IoT Explorer corresponds to one of the IoT Plug and Play components in the device model.

    | Tab | Type | Name | Description |
    |---|---|---|---|
    | **Interface** | Interface | `RX65N Cloud Kit Getting Started Guide` | Example model for the Azure RTOS RX65N Cloud Kit Getting Started Guide |
    | **Properties (read-only)** | Property | `ledState` | Whether the led is on or off |
    | **Properties (writable)** | Property | `telemetryInterval` | The interval that the device sends telemetry |
    | **Commands** | Command | `setLedState` | Turn the LED on or off |

To view device properties using Azure IoT Explorer:

1. Select the **Properties (read-only)** tab. There's a single read-only property to indicate whether the led is on or off.
1. Select the **Properties (writable)** tab. It displays the interval that telemetry is sent.
1. Change the `telemetryInterval` to *5*, and then select **Update desired value**. Your device now uses this interval to send telemetry.

    :::image type="content" source="media/quickstart-devkit-renesas-rx65n-cloud-kit-iot-hub/iot-explorer-set-telemetry-interval.png" alt-text="Screenshot of setting telemetry interval on the device in IoT Explorer.":::

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

    :::image type="content" source="media/quickstart-devkit-renesas-rx65n-cloud-kit-iot-hub/iot-explorer-device-telemetry.png" alt-text="Screenshot of device telemetry in IoT Explorer.":::

    > [!NOTE]
    > You can also monitor telemetry from the device by using the Termite app.

1. Select the **Show modeled events** checkbox to view the events in the data format specified by the device model.

    :::image type="content" source="media/quickstart-devkit-renesas-rx65n-cloud-kit-iot-hub/iot-explorer-show-modeled-events.png" alt-text="Screenshot of modeled telemetry events in IoT Explorer.":::

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
            "interface": "dtmi:azurertos:devkit:gsgrx65ncloud;1",
            "component": "",
            "payload": {
                "gyroscopeX": 1,
                "gyroscopeY": -2,
                "gyroscopeZ": 5
            }
        }
    }
   ```

1. Select CTRL+C to end monitoring.


## Call a direct method on the device

You can also use Azure IoT Explorer to call a direct method that you've implemented on your device. Direct methods have a name, and can optionally have a JSON payload, configurable connection, and method timeout. In this section, you call a method that turns an LED on or off. Optionally, you can do the same task using Azure CLI.

To call a method in Azure IoT Explorer:

1. From the **IoT Plug and Play components** (Default Component) pane for your device in IoT Explorer, select the **Commands** tab.
1. For the **setLedState** command, set the **state** to **Yes**.
1. Select **Send command**. You should see a notification in IoT Explorer, and the red LED light on the device should turn on.

    :::image type="content" source="media/quickstart-devkit-renesas-rx65n-cloud-kit-iot-hub/iot-explorer-invoke-method.png" alt-text="Screenshot of calling the setLedState method in IoT Explorer.":::

1. Set the **state** to  **No**, and then select **Send command**. The LED should turn off.
1. Optionally, you can view the output in Termite to monitor the status of the methods.

To use Azure CLI to call a method:

1. Run the [az iot hub invoke-device-method](/cli/azure/iot/hub#az-iot-hub-invoke-device-method) command, and specify the method name and payload. For this method, setting `method-payload` to `true` turns on the LED, and setting it to `false` turns it off.

   ```azurecli
   az iot hub invoke-device-method --device-id mydevice --method-name setLedState --method-payload true --hub-name {YourIoTHubName}
   ```

   The CLI console shows the status of your method call on the device, where `200` indicates success.

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
    Sending property: $iothub/twin/PATCH/properties/reported/?$rid=23{"ledState":true}
   ```

## Troubleshoot and debug

If you experience issues building the device code, flashing the device, or connecting, see [Troubleshooting](troubleshoot-embedded-device-quickstarts.md).

For debugging the application, see [Debugging with Visual Studio Code](https://github.com/azure-rtos/getting-started/blob/master/docs/debugging.md).

[!INCLUDE [iot-develop-cleanup-resources](../../includes/iot-develop-cleanup-resources.md)]

## Next steps

In this quickstart, you built a custom image that contains Azure RTOS sample code, and then flashed the image to the Renesas RX65N device. You connected the Renesas RX65N to Azure, and carried out tasks such as viewing telemetry and calling a method on the device.

As a next step, explore the following articles to learn more about using the IoT device SDKs, or Azure RTOS to connect devices to Azure IoT.

> [!div class="nextstepaction"]
> [Connect a general simulated device to IoT Hub](quickstart-send-telemetry-iot-hub.md)
> [!div class="nextstepaction"]
> [Learn more about connecting embedded devices using C SDK and Embedded C SDK](concepts-using-c-sdk-and-embedded-c-sdk.md)

> [!IMPORTANT]
> Azure RTOS provides OEMs with components to secure communication and to create code and data isolation using underlying MCU/MPU hardware protection mechanisms. However, each OEM is ultimately responsible for ensuring that their device meets evolving security requirements.
