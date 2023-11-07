---
title: Connect an NXP MIMXRT1060-EVK to Azure IoT Hub quickstart
description: Use Azure RTOS embedded software to connect an NXP MIMXRT1060-EVK device to Azure IoT Hub and send telemetry.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.devlang: c
ms.topic: quickstart
ms.date: 06/27/2023
---

# Quickstart: Connect an NXP MIMXRT1060-EVK Evaluation kit to IoT Hub

**Applies to**: [Embedded device development](about-iot-develop.md#embedded-device-development)<br>
**Total completion time**:  45 minutes

[![Browse code](media/common/browse-code.svg)](https://github.com/azure-rtos/getting-started/tree/master/NXP/MIMXRT1060-EVK)

In this quickstart, you use Azure RTOS to connect the NXP MIMXRT1060-EVK evaluation kit (from now on, the NXP EVK) to Azure IoT.

You complete the following tasks:

* Install a set of embedded development tools for programming the NXP EVK in C
* Build an image and flash it onto the NXP EVK
* Use Azure CLI to create and manage an Azure IoT hub that the NXP EVK securely connects to
* Use Azure IoT Explorer to register a device with your IoT hub, view device properties, view device telemetry, and call direct commands on the device

## Prerequisites

* A PC running Windows 10 or Windows 11
* An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* [Git](https://git-scm.com/downloads) for cloning the repository
* Hardware
    * The [NXP MIMXRT1060-EVK](https://www.nxp.com/design/development-boards/i-mx-evaluation-and-development-boards/mimxrt1060-evk-i-mx-rt1060-evaluation-kit:MIMXRT1060-EVK) (NXP EVK)
    * USB 2.0 A male to Micro USB male cable
    * Wired Ethernet access
    * Ethernet cable

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

[!INCLUDE [iot-develop-create-cloud-components](../../includes/iot-develop-create-cloud-components.md)]

## Prepare the device

To connect the NXP EVK to Azure, you modify a configuration file for Azure IoT settings, rebuild the image, and flash the image to the device.

### Add configuration

1. Open the following file in a text editor:

    *getting-started\NXP\MIMXRT1060-EVK\app\azure_config.h*

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

### Build the image

1. In your console or in File Explorer, run the script *rebuild.bat* at the following path to build the image:

    *getting-started\NXP\MIMXRT1060-EVK\tools\rebuild.bat*

2. After the build completes, confirm that the binary file was created in the following path:

    *getting-started\NXP\MIMXRT1060-EVK\build\app\mimxrt1060_azure_iot.bin*

### Flash the image

1. On the NXP EVK, locate the **Reset** button, the Micro USB port, and the Ethernet port.  You use these components in the following steps. All three are highlighted in the following picture:

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk-iot-hub/nxp-evk-board.png" alt-text="Photo showing the NXP EVK board.":::

1. Connect the Micro USB cable to the Micro USB port on the NXP EVK, and then connect it to your computer. After the device powers up, a solid green LED shows the power status.
1. Use the Ethernet cable to connect the NXP EVK to an Ethernet port.
1. In File Explorer, find the binary file that you created in the previous section.
1. Copy the binary file *mimxrt1060_azure_iot.bin*
1. In File Explorer, find the NXP EVK device connected to your computer. The device appears as a drive on your system with the drive label **RT1060-EVK**.
1. Paste the binary file into the root folder of the NXP EVK. Flashing starts automatically and completes in a few seconds.

    > [!NOTE]
    > During the flashing process, a red LED blinks rapidly on the NXP EVK.

### Confirm device connection details

You can use the **Termite** app to monitor communication and confirm that your device is set up correctly.

1. Start **Termite**.
    > [!TIP]
    > If you have issues getting your device to initialize or connect after flashing, see [Troubleshooting](troubleshoot-embedded-device-quickstarts.md).
1. Select **Settings**.
1. In the **Serial port settings** dialog, check the following settings and update if needed:
    * **Baud rate**: 115,200
    * **Port**: The port that your NXP EVK is connected to. If there are multiple port options in the dropdown, you can find the correct port to use. Open Windows **Device Manager**, and view **Ports** to identify which port to use.

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk-iot-hub/termite-settings.png" alt-text="Screenshot of serial port settings in the Termite app.":::

1. Select OK.
1. Press the **Reset** button on the device. The button is labeled on the device and located near the Micro USB connector.
1. In the **Termite** app, check the following checkpoint values to confirm that the device is initialized and connected to Azure IoT.

   ```output
    Initializing DHCP
        MAC: **************
        IP address: 192.168.0.56
        Mask: 255.255.255.0
        Gateway: 192.168.0.1
    SUCCESS: DHCP initialized

    Initializing DNS client
        DNS address: 192.168.0.1
    SUCCESS: DNS client initialized

    Initializing SNTP time sync
        SNTP server 0.pool.ntp.org
        SNTP time update: Jan 11, 2023 20:37:37.90 UTC
    SUCCESS: SNTP initialized

    Initializing Azure IoT Hub client
        Hub hostname: **************.azure-devices.net
        Device id: mydevice
        Model id: dtmi:azurertos:devkit:gsg;2
    SUCCESS: Connected to IoT Hub

    Receive properties: {"desired":{"$version":1},"reported":{"$version":1}}
    Sending property: $iothub/twin/PATCH/properties/reported/?$rid=3{"deviceInformation":{"__t":"c","manufacturer":"NXP","model":"MIMXRT1060-EVK","swVersion":"1.0.0","osName":"Azure RTOS","processorArchitecture":"Arm Cortex M7","processorManufacturer":"NXP","totalStorage":8192,"totalMemory":768}}
    Sending property: $iothub/twin/PATCH/properties/reported/?$rid=5{"ledState":false}
    Sending property: $iothub/twin/PATCH/properties/reported/?$rid=7{"telemetryInterval":{"ac":200,"av":1,"value":10}}

    Starting Main loop
    Telemetry message sent: {"temperature":40.61}.
   ```

Keep Termite open to monitor device output in the following steps.

## View device properties

You can use Azure IoT Explorer to view and manage the properties of your devices. In the following sections, you use the Plug and Play capabilities that are visible in IoT Explorer to manage and interact with the NXP EVK. These capabilities rely on the device model published for the NXP EVK in the public model repository. You configured IoT Explorer to search this repository for device models earlier in this quickstart. In many cases, you can perform the same action without using plug and play by selecting IoT Explorer menu options. However, using plug and play often provides an enhanced experience. IoT Explorer can read the device model specified by a plug and play device and present information specific to that device.

To access IoT Plug and Play components for the device in IoT Explorer:

1. From the home view in IoT Explorer, select **IoT hubs**, then select **View devices in this hub**.
1. Select your device.
1. Select **IoT Plug and Play components**.
1. Select **Default component**. IoT Explorer displays the IoT Plug and Play components that are implemented on your device.

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk-iot-hub/iot-explorer-default-component-view.png" alt-text="Screenshot of the device's default component in IoT Explorer.":::

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

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk-iot-hub/iot-explorer-set-telemetry-interval.png" alt-text="Screenshot of setting telemetry interval on the device in IoT Explorer.":::

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

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk-iot-hub/iot-explorer-device-telemetry.png" alt-text="Screenshot of device telemetry in IoT Explorer.":::

    > [!NOTE]
    > You can also monitor telemetry from the device by using the Termite app.

1. Select the **Show modeled events** checkbox to view the events in the data format specified by the device model.

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk-iot-hub/iot-explorer-show-modeled-events.png" alt-text="Screenshot of modeled telemetry events in IoT Explorer.":::

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
                "temperature": 41.77
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
1. Select **Send command**. You should see a notification in IoT Explorer. There's no change on the device as there isn't an available LED to toggle. However, you can view the output in Termite to monitor the status of the methods.

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk-iot-hub/iot-explorer-invoke-method.png" alt-text="Screenshot of calling the setLedState method in IoT Explorer.":::

1. Set the **state** to  **false**, and then select **Send command**. The LED should turn off.
1. Optionally, you can view the output in Termite to monitor the status of the methods.

To use Azure CLI to call a method:

1. Run the [az iot hub invoke-device-method](/cli/azure/iot/hub#az-iot-hub-invoke-device-method) command, and specify the method name and payload. For this method, setting `method-payload` to `true` would turn on an LED. There's no change on the device as there isn't an available LED to toggle. However, you can view the output in Termite to monitor the status of the methods.


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

[!INCLUDE [iot-develop-cleanup-resources](../../includes/iot-develop-cleanup-resources.md)]

## Next steps

In this quickstart, you built a custom image that contains Azure RTOS sample code, and then flashed the image to the NXP EVK device. You connected the NXP EVK to Azure IoT Hub, and carried out tasks such as viewing telemetry and calling a method on the device.

As a next step, explore the following articles to learn more about using the IoT device SDKs, or Azure RTOS to connect devices to Azure IoT.

> [!div class="nextstepaction"]
> [Connect a simulated device to IoT Hub](quickstart-send-telemetry-iot-hub.md)
> [!div class="nextstepaction"]
> [Learn more about connecting embedded devices using C SDK and Embedded C SDK](concepts-using-c-sdk-and-embedded-c-sdk.md)

> [!IMPORTANT]
> Azure RTOS provides OEMs with components to secure communication and to create code and data isolation using underlying MCU/MPU hardware protection mechanisms. However, each OEM is ultimately responsible for ensuring that their device meets evolving security requirements.
