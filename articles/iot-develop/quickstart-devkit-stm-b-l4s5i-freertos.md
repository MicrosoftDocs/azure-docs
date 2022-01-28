---
title: Connect an STMicroelectronics B-L4S5I to Azure IoT Central quickstart
description: Use Azure FreeRTOS device middleware to connect an STMicroelectronics B-L4S5I-IOT01A Discovery kit to Azure IoT and send telemetry.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.devlang: c
ms.topic: quickstart
ms.date: 01/27/2022
ms.custom: mode-other
#Customer intent: As a device builder, I want to see a working IoT device sample connecting to Azure IoT, sending properties and telemetry, and responding to commands. As a solution builder, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Quickstart: Connect an STMicroelectronics B-L4S5I-IOT01A Discovery kit to Azure IoT Central

**Applies to**: [Embedded device development](about-iot-develop.md#embedded-device-development)<br>
**Total completion time**:  30 minutes

In this quickstart, you use the Azure FreeRTOS middleware to connect the STMicroelectronics B-L4S5I-IOT01A Discovery kit (from now on, the STM DevKit) to Azure IoT Central.

You'll complete the following tasks:

* Install a set of embedded development tools for programming an STM DevKit
* Build an image and flash it onto the STM DevKit
* Use Azure IoT Central to create cloud components, view properties, view device telemetry, and call direct commands

## Prerequisites

Operating system: Windows 10 or Windows 11

Hardware:
- STM [B-L475E-IOT01A](https://www.st.com/en/evaluation-tools/b-l475e-iot01a.html) devkit
- USB 2.0 A male to Micro USB male cable
- Wi-Fi 2.4 GHz

## Prepare the development environment

To set up your development environment, first you clone a GitHub repo that contains all the assets you need for the tutorial. Then you install a set of programming tools. 

### Clone the repo

Clone the following repo to download all sample device code, setup scripts, and offline versions of the documentation. If you previously cloned this repo in another tutorial, you don't need to do it again.

To clone the repo, run the following command:

```shell
git clone --recursive https://github.com/Azure-Samples/iot-middleware-freertos-samples
```

### Install Ninja

1. Download [Ninja](https://github.com/ninja-build/ninja/releases) and unzip it to your local disk.
1. Confirm that the Ninja binary is available in the `PATH` environment variable:
    ```shell
    ninja --version
    ```

### Install the tools

The cloned repo contains a setup script that installs and configures the required tools. If you installed these tools in another tutorial in the getting started guide, you don't need to do it again.

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
To connect the STM DevKit to Azure, you'll modify configuration settings, build the image, and flash the image to the device.

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

In this quickstart, you built a custom image that contains the Azure FreeRTOS middleware sample code, and then you flashed the image to the ESP32 DevKit device. You also used the IoT Central portal to create Azure resources, connect the ESP32 DevKit securely to Azure, view telemetry, and send messages.

As a next step, explore the following articles to learn more about working with embedded devices and connecting them to Azure IoT. 

> [!div class="nextstepaction"]
> [Azure FreeRTOS middleware samples](https://github.com/Azure-Samples/iot-middleware-freertos-samples)
> [!div class="nextstepaction"]
> [Azure RTOS embedded development quickstarts](quickstart-devkit-mxchip-az3166.md)
> [!div class="nextstepaction"]
> [Azure IoT device development documentation](./index.yml)