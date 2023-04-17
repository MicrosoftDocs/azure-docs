---
title: Connect an STMicroelectronics B-L475E to Azure IoT Central quickstart
description: Use Azure IoT middleware for FreeRTOS to connect an STMicroelectronics B-L475E-IOT01A Discovery kit to Azure IoT and send telemetry.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.devlang: c
ms.topic: quickstart
ms.date: 11/29/2022
ms.custom: 
#Customer intent: As a device builder, I want to see a working IoT device sample connecting to Azure IoT, sending properties and telemetry, and responding to commands. As a solution builder, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Quickstart: Connect an STMicroelectronics B-L475E-IOT01A Discovery kit to Azure IoT Central

**Applies to**: [Embedded device development](about-iot-develop.md#embedded-device-development)<br>
**Total completion time**:  30 minutes

In this quickstart, you use the Azure IoT middleware for FreeRTOS to connect the STMicroelectronics B-L475E-IOT01A Discovery kit (from now on, the STM DevKit) to Azure IoT Central.

You complete the following tasks:

* Install a set of embedded development tools to program an STM DevKit
* Build an image and flash it onto the STM DevKit
* Use Azure IoT Central to create cloud components, view properties, view device telemetry, and call direct commands

## Prerequisites

Operating system: Windows 10 or Windows 11

Hardware:
- STM [B-L475E-IOT01A](https://www.st.com/en/evaluation-tools/b-l475e-iot01a.html) devkit
- USB 2.0 A male to Micro USB male cable
- Wi-Fi 2.4 GHz
- An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prepare the development environment

To set up your development environment, first you clone a GitHub repo that contains all the assets you need for the tutorial. Then you install a set of programming tools. 

### Clone the repo

Clone the following repo to download all sample device code, setup scripts, and offline versions of the documentation. If you previously cloned this repo in another tutorial, you don't have to do it again.

To clone the repo, run the following command:

```shell
git clone --recursive https://github.com/Azure-Samples/iot-middleware-freertos-samples
```

### Install Ninja

Ninja is a build tool that you use to build an image for the STM DevKit. 

1. Download [Ninja](https://github.com/ninja-build/ninja/releases) and unzip it to your local disk.
1. Add the path to the Ninja executable to a PATH environment variable.
1. Open a new console to recognize the update, and confirm that the Ninja binary is available in the `PATH` environment variable:
    ```shell
    ninja --version
    ```

### Install the tools

The cloned repo contains a setup script that installs and configures the required tools. If you installed these tools in another tutorial in the getting started guide, you don't have to do it again.

> Note: The setup script installs the following tools:
> * [CMake](https://cmake.org): Build
> * [ARM GCC](https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm): Compile
> * [Termite](https://www.compuphase.com/software_termite.htm): Monitor serial port output for connected devices

To install the tools:

1. From File Explorer, navigate to the following path in the repo and run the setup script named *get-toolchain.bat*:

    > *iot-middleware-freertos-samples\tools\get-toolchain.bat*

1. After the installation, open a new console window to recognize the configuration changes made by the setup script. Use this console to complete the remaining programming tasks in the tutorial. You can use Windows CMD, PowerShell, or Git Bash for Windows.
1. Run the following code to confirm that CMake version **3.20** or later is installed.

    ```shell
    cmake --version
    ```

[!INCLUDE [iot-develop-embedded-create-central-app-with-device](../../includes/iot-develop-embedded-create-central-app-with-device.md)]

## Prepare the device
To connect the STM DevKit to Azure, modify configuration settings, build the image, and flash the image to the device.

### Add configuration

1. Open the following file in a text editor:

    *iot-middleware-freertos-samples/demos/projects/ST/b-l475e-iot01a/config/demo_config.h*

1. Set the Wi-Fi constants to the following values from your local environment.

    |Constant name|Value|
    |-------------|-----|
    |`WIFI_SSID` |{*Your Wi-Fi ssid*}|
    |`WIFI_PASSWORD` |{*Your Wi-Fi password*}|
    |`WIFI_SECURITY_TYPE` |{*One of the enumerated Wi-Fi mode values in the file*}|

1. Set the Azure IoT device information constants to the values that you saved after you created Azure resources.

    |Constant name|Value|
    |-------------|-----|
    |`democonfigID_SCOPE` |{*Your ID scope value*}|
    |`democonfigREGISTRATION_ID` |{*Your Device ID value*}|
    |`democonfigDEVICE_SYMMETRIC_KEY` |{*Your Primary key value*}|

1. Save and close the file.

### Build the image

1. In your console, run the following commands from the *iot-middleware-freertos-samples* directory to build the device image:

    ```shell
    cmake -G Ninja -DVENDOR=ST -DBOARD=b-l475e-iot01a -Bb-l475e-iot01a .
    cmake --build b-l475e-iot01a
    ```

2. After the build completes, confirm that the binary file was created in the following path:

    *iot-middleware-freertos-samples\b-l475e-iot01a\demos\projects\ST\b-l475e-iot01a\iot-middleware-sample-gsg.bin*

### Flash the image

1. On the STM DevKit board, locate the **Reset** button (1), the Micro USB port (2), which is labeled **USB STLink**, and the board part number (3). You'll refer to these items in the next steps. All of them are highlighted in the following picture:

    :::image type="content" source="media/quickstart-devkit-stm-b-l475e-freertos/stm-devkit-board-475.png" alt-text="Locate key components on the STM DevKit board":::

1. Connect the Micro USB cable to the **USB STLINK** port on the STM DevKit, and then connect it to your computer.

    > [!NOTE]
    > For detailed setup information about the STM DevKit, see the instructions on the packaging, or see [B-L475E-IOT01A Resources](https://www.st.com/en/evaluation-tools/b-l475e-iot01a.html#resource)

1. In File Explorer, find the binary file named *iot-middleware-sample-gsg.bin* that you created previously.

1. In File Explorer, find the STM Devkit board that's connected to your computer. The device appears as a drive on your system with the drive label **DIS_L4IOT**.

1. Paste the binary file into the root folder of the STM Devkit. The process to flash the board starts automatically and completes in a few seconds.

    > [!NOTE]
    > During the process, an LED toggles between red and green on the STM DevKit.

### Confirm device connection details

You can use the **Termite** app to monitor communication and confirm that your device is set up correctly.

1. Start **Termite**.
    > [!TIP]
    > If you are unable to connect Termite to your devkit, install the [ST-LINK driver](https://www.st.com/en/development-tools/stsw-link009.html) and try again. See  [Troubleshooting](troubleshoot-embedded-device-quickstarts.md) for additional steps.
1. Select **Settings**.
1. In the **Serial port settings** dialog, check the following settings and update if needed:
    * **Baud rate**: 115,200
    * **Port**: The port that your STM DevKit is connected to. If there are multiple port options in the dropdown, you can find the correct port to use. Open Windows **Device Manager**, and view **Ports** to identify which port to use.

    :::image type="content" source="media/quickstart-devkit-stm-b-l475e/termite-settings.png" alt-text="Screenshot of serial port settings in the Termite app":::

1. Select OK.
1. Press the **Reset** button on the device. The button is black and is labeled on the device.
1. In the **Termite** app, check the output to confirm that the device is initialized and connected to Azure IoT. After some initial connection details, you should begin to see your board sensors sending telemetry to Azure IoT. 

    ```output 
    Successfully sent telemetry message
    [INFO] [MQTT] [receivePacket:885] Packet received. ReceivedBytes=2.
    [INFO] [MQTT] [handlePublishAcks:1161] Ack packet deserialized with result: MQTTSuccess.
    [INFO] [MQTT] [handlePublishAcks:1174] State record updated. New state=MQTTPublishDone.
    Puback received for packet id: 0x00000003
    [INFO] [AzureIoTDemo] [ulCreateTelemetry:197] Telemetry message sent {"magnetometerX":-204,"magnetometerY":-215,"magnetometerZ":-875}
    
    Successfully sent telemetry message
    [INFO] [MQTT] [receivePacket:885] Packet received. ReceivedBytes=2.
    [INFO] [MQTT] [handlePublishAcks:1161] Ack packet deserialized with result: MQTTSuccess.
    [INFO] [MQTT] [handlePublishAcks:1174] State record updated. New state=MQTTPublishDone.
    Puback received for packet id: 0x00000004
    [INFO] [AzureIoTDemo] [ulCreateTelemetry:197] Telemetry message sent {"accelerometerX":22,"accelerometerY":4,"accelerometerZ":1005}
    
    Successfully sent telemetry message
    [INFO] [MQTT] [receivePacket:885] Packet received. ReceivedBytes=2.
    [INFO] [MQTT] [handlePublishAcks:1161] Ack packet deserialized with result: MQTTSuccess.
    [INFO] [MQTT] [handlePublishAcks:1174] State record updated. New state=MQTTPublishDone.
    Puback received for packet id: 0x00000005
    [INFO] [AzureIoTDemo] [ulCreateTelemetry:197] Telemetry message sent {"gyroscopeX":0,"gyroscopeY":-700,"gyroscopeZ":350}
    ```

    > [!IMPORTANT]
    > If the DNS client initialization fails and notifies you that the Wi-Fi firmware is out of date, you'll need to update the Wi-Fi module firmware. Download and install the [Inventek ISM 43362 Wi-Fi module firmware update](https://www.st.com/resource/en/utilities/inventek_fw_updater.zip). Then press the **Reset** button on the device to recheck your connection, and continue with this quickstart.

Keep Termite open to monitor device output in the remaining steps.

## Verify the device status

To view the device status in the IoT Central portal:
1. From the application dashboard, select **Devices** on the side navigation menu.
1. Confirm that the **Device status** of the device is updated to **Provisioned**.
1. Confirm that the **Device template** of the device has been updated to  **STM L475 FreeRTOS Getting Started Guide.**

    :::image type="content" source="media/quickstart-devkit-stm-b-l475e-freertos/iot-central-device-view-status.png" alt-text="Screenshot of device status in IoT Central":::

## View telemetry

In IoT Central, you can view the flow of telemetry from your device to the cloud.

To view telemetry in IoT Central:
1. From the application dashboard, select **Devices** on the side navigation menu.
1. Select the device from the device list.
1. Select the **Overview** tab on the device page, and view the telemetry as the device sends messages to the cloud.

    :::image type="content" source="media/quickstart-devkit-stm-b-l475e-freertos/iot-central-device-telemetry.png" alt-text="Screenshot of device telemetry in IoT Central":::

## Call a command on the device

You can also use IoT Central to call a command that you've implemented on your device. In this section, you call a method that enables you to turn an LED on or off.

To call a command in IoT Central portal:

1. Select the **Command** tab from the device page.
1. Set the **State** dropdown value to *True*, and then select **Run**. The LED light should turn on.

    :::image type="content" source="media/quickstart-devkit-stm-b-l475e-freertos/iot-central-invoke-method.png" alt-text="Screenshot of calling a direct method on a device in IoT Central":::

1. Set the **State** dropdown value to *False*, and then select **Run**. The LED light should turn off.

## View device information

You can view the device information from IoT Central.

Select **About** tab from the device page.

:::image type="content" source="media/quickstart-devkit-stm-b-l475e-freertos/iot-central-device-about.png" alt-text="Screenshot of device information in IoT Central":::

> [!TIP]
> To customize these views, edit the [device template](../iot-central/core/howto-edit-device-template.md).

## Troubleshoot and debug

If you experience issues when you build the device code, flash the device, or connect, see [Troubleshooting](troubleshoot-embedded-device-quickstarts.md).

To debug the application, see [Debugging with Visual Studio Code](https://github.com/azure-rtos/getting-started/blob/master/docs/debugging.md).

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

In this quickstart, you built a custom image that contains the Azure IoT middleware for FreeRTOS sample code. Then you flashed the image to the STM DevKit device. You also used the IoT Central portal to create Azure resources, connect the STM  DevKit securely to Azure, view telemetry, and send messages.

As a next step, explore the following articles to learn how to work with embedded devices and connect them to Azure IoT. 

> [!div class="nextstepaction"]
> [Azure IoT middleware for FreeRTOS samples](https://github.com/Azure-Samples/iot-middleware-freertos-samples)
> [!div class="nextstepaction"]
> [Azure RTOS embedded development quickstarts](quickstart-devkit-mxchip-az3166.md)
> [!div class="nextstepaction"]
> [Azure IoT device development documentation](./index.yml)