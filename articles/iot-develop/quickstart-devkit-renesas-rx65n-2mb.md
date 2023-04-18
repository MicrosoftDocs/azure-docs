---
title: Connect a Renesas RX65N-2MB to Azure IoT Central quickstart
description: Use Azure RTOS embedded software to connect a Renesas RX65N-2MB device to Azure IoT and send telemetry.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.devlang: c
ms.topic: quickstart
ms.date: 10/21/2022
ms.custom: mode-other, engagement-fy23
---

# Quickstart: Connect a Renesas Starter Kit+ for RX65N-2MB to IoT Central

**Applies to**: [Embedded device development](about-iot-develop.md#embedded-device-development)<br>
**Total completion time**:  30 minutes

[![Browse code](media/common/browse-code.svg)](https://github.com/azure-rtos/getting-started/tree/master/Renesas/RSK_RX65N_2MB)

In this quickstart, you use Azure RTOS to connect the Renesas Starter Kit+ for RX65N-2MB (hereafter, the Renesas RX65N) to Azure IoT.

You will complete the following tasks:

* Install a set of embedded development tools for programming a Renesas RX65N in C
* Build an image and flash it onto the Renesas RX65N
* Use Azure IoT Central to create cloud components, view properties, view device telemetry, and call direct commands

## Prerequisites

* A PC running Windows 10
* [Git](https://git-scm.com/downloads) for cloning the repository
* Hardware

    * The [Renesas Starter Kit+ for RX65N-2MB](https://www.renesas.com/products/microcontrollers-microprocessors/rx-32-bit-performance-efficiency-mcus/rx65n-2mb-starter-kit-plus-renesas-starter-kit-rx65n-2mb) (Renesas RX65N)
    * The [Renesas E2 emulator Lite](https://www.renesas.com/software-tool/e2-emulator-lite-rte0t0002lkce00000r)
    * 2 USB 2.0 A male to Mini USB male cables
    * The included 5V power supply
    * Ethernet cable
    * Wired Ethernet access
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
> * [RX GCC](http://gcc-renesas.com/downloads/get.php?f=rx/8.3.0.202004-gnurx/gcc-8.3.0.202004-GNURX-ELF.exe): Compile
> * [Termite](https://www.compuphase.com/software_termite.htm): Monitor serial port output for connected devices

To install the tools:

1. From File Explorer, navigate to the following path in the repo and run the setup script named *get-toolchain.bat*:

    *getting-started\tools\get-toolchain-rx.bat*

1. Add the RX compiler to the Windows Path:

    *%USERPROFILE%\AppData\Roaming\GCC for Renesas RX 8.3.0.202004-GNURX-ELF\rx-elf\rx-elf\bin*

1. After the installation, open a new console window to recognize the configuration changes made by the setup script. Use this console to complete the remaining programming tasks in the quickstart. You can use Windows CMD, PowerShell, or Git Bash for Windows.
1. Run the following commands to confirm that CMake version 3.14 or later is installed and the RX compiler path is set up correctly.

    ```shell
    cmake --version
    rx-elf-gcc
    ```
To install the remaining tools:

* Install [Renesas Flash Programmer](https://www.renesas.com/software-tool/renesas-flash-programmer-programming-gui). The Renesas Flash Programmer contains the drivers and tools needed to flash the Renesas RX65N via the Renesas E2 Lite.

[!INCLUDE [iot-develop-embedded-create-central-app-with-device](../../includes/iot-develop-embedded-create-central-app-with-device.md)]

## Prepare the device

To connect the Renesas RX65N to Azure, you'll modify a configuration file for Wi-Fi and Azure IoT settings, rebuild the image, and flash the image to the device.

### Add configuration

1. Open the following file in a text editor:

    *getting-started\Renesas\RSK_RX65N_2MB\app\azure_config.h*

1. Set the Azure IoT device information constants to the values that you saved after you created Azure resources.

    |Constant name|Value|
    |-------------|-----|
    |`IOT_DPS_ID_SCOPE` |{*Your ID scope value*}|
    |`IOT_DPS_REGISTRATION_ID` |{*Your Device ID value*}|
    |`IOT_DEVICE_SAS_KEY` |{*Your Primary key value*}|

1. Save and close the file.

### Build the image

1. In your console or in File Explorer, run the script *rebuild.bat* at the following path to build the image:

    *getting-started\Renesas\RSK_RX65N_2MB\tools\rebuild.bat*

2. After the build completes, confirm that the binary file was created in the following path:

    *getting-started\Renesas\RSK_RX65N_2MB\build\app\rx65n_azure_iot.hex*

### Connect the device

> [!NOTE]
> For more information about setting up and getting started with the Renesas RX65N, see [Renesas Starter Kit+ for RX65N-2MB Quick Start](https://www.renesas.com/document/man/e2studio-renesas-starter-kit-rx65n-2mb-quick-start-guide).

1. Complete the following steps using the following image as a reference.
    
    :::image type="content" source="media/quickstart-devkit-renesas-rx65n-2mb/renesas-rx65n.jpg" alt-text="Locate reset, power, ethernet, USB, and E1/E2Lite on the Renesas RX65N board":::

1. Using the 5V power supply, connect the **Power Input** on the Renesas RX65N to an electrical outlet.

1. Using the Ethernet cable, connect the  **Ethernet** on the Renesas RX65N to your router.

1. Using the first Mini USB cable, connect the **USB Serial** on the Renesas RX65N to your computer.

1. Using the second Mini USB cable, connect the **E2 Lite USB Serial** on the Renesas E2 Lite to your computer.

1. Using the supplied ribbon cable, connect the **E1/E2Lite** on the Renesas RX65N to the Renesas E2 Lite.

### Flash the image

1. Launch the *Renesas Flash Programmer* application from the Start menu.

2. Select *New Project...* from the *File* menu, and enter the following settings:
    * **Microcontroller**: RX65x
    * **Project Name**: RX65N
    * **Tool**: E2 emulator Lite

    :::image type="content" source="media/quickstart-devkit-renesas-rx65n-2mb/rfp-new.png" alt-text="Screenshot of Renesas Flash Programmer, New Project":::

3. Select the *Tool Details* button, and navigate to the *Reset Settings* tab.

4. Select *Reset Pin as Hi-Z* and press the *OK* button.

    :::image type="content" source="media/quickstart-devkit-renesas-rx65n-2mb/rfp-reset.png" alt-text="Screenshot of Renesas Flash Programmer, Reset Settings":::

5. Press the *Connect* button and when prompted, check the *Auto Authentication* checkbox and then press *OK*.

    :::image type="content" source="media/quickstart-devkit-renesas-rx65n-2mb/rfp-auth.png" alt-text="Screenshot of Renesas Flash Programmer, Authentication":::

6. Select the *Browse...* button and locate the *rx65n_azure_iot.hex* file created in the previous section.

7. Press *Start* to begin flashing. This process will take approximately 10 seconds.

### Confirm device connection details

You can use the **Termite** app to monitor communication and confirm that your device is set up correctly.
> [!TIP]
> If you have issues getting your device to initialize or connect after flashing, see [Troubleshooting](troubleshoot-embedded-device-quickstarts.md).

1. Start **Termite**.
1. Select **Settings**.
1. In the **Serial port settings** dialog, check the following settings and update if needed:
    * **Baud rate**: 115,200
    * **Port**: The port that your Renesas RX65N is connected to. If there are multiple port options in the dropdown, you can find the correct port to use. Open Windows **Device Manager**, and view **Ports** to identify which port to use.

    :::image type="content" source="media/quickstart-devkit-renesas-rx65n-2mb/termite-settings.png" alt-text="Screenshot of serial port settings in the Termite app":::

1. Select OK.
1. Press the **Reset** button on the device.
1. In the **Termite** app, check the following checkpoint values to confirm that the device is initialized and connected to Azure IoT.

    ```output
    Starting Azure thread

    Initializing DHCP
        IP address: 10.0.0.81
        Mask: 255.255.255.0
        Gateway: 10.0.0.1
    SUCCESS: DHCP initialized

    Initializing DNS client
        DNS address: 10.0.0.1
    SUCCESS: DNS client initialized

    Initializing SNTP client
        SNTP server 0.pool.ntp.org
        SNTP IP address: 104.194.242.237
        SNTP time update: May 28, 2021 22:53:27.54 UTC 
    SUCCESS: SNTP initialized

    Initializing Azure IoT DPS client
        DPS endpoint: global.azure-devices-provisioning.net
        DPS ID scope: ***
        Registration ID: mydevice
    SUCCESS: Azure IoT DPS client initialized

    Initializing Azure IoT Hub client
        Hub hostname: ***.azure-devices.net
        Device id: mydevice
        Model id: dtmi:azurertos:devkit:gsg;1
    Connected to IoT Hub
    SUCCESS: Azure IoT Hub client initialized
    ```

Keep Termite open to monitor device output in the following steps.

## Verify the device status

To view the device status in IoT Central portal:
1. From the application dashboard, select **Devices** on the side navigation menu.
1. Confirm that the **Device status** is updated to **Provisioned**.
1. Confirm that the **Device template** is updated to **Getting Started Guide**.

    :::image type="content" source="media/quickstart-devkit-renesas-rx65n-2mb/iot-central-device-view-status.png" alt-text="Screenshot of device status in IoT Central":::

## View telemetry

With IoT Central, you can view the flow of telemetry from your device to the cloud.

To view telemetry in IoT Central portal:

1. From the application dashboard, select **Devices** on the side navigation menu.
1. Select the device from the device list.
1. View the telemetry as the device sends messages to the cloud in the **Overview** tab.

    :::image type="content" source="media/quickstart-devkit-renesas-rx65n-2mb/iot-central-device-telemetry.png" alt-text="Screenshot of device telemetry in IoT Central":::

    > [!NOTE]
    > You can also monitor telemetry from the device by using the Termite app.

## Call a direct method on the device

You can also use IoT Central to call a direct method that you've implemented on your device. Direct methods have a name, and can optionally have a JSON payload, configurable connection, and method timeout. In this section, you call a method that enables you to turn an LED on or off.

To call a method in IoT Central portal:

1. Select the **Command** tab from the device page.
1. In the **State** dropdown, select **True**, and then select **Run**.  The LED light should turn on.

    :::image type="content" source="media/quickstart-devkit-renesas-rx65n-2mb/iot-central-invoke-method.png" alt-text="Screenshot of calling a direct method on a device in IoT Central":::

1. In the **State** dropdown, select **False**, and then select **Run**. The LED light should turn off.

## View device information

You can view the device information from IoT Central.

Select **About** tab from the device page.

:::image type="content" source="media/quickstart-devkit-renesas-rx65n-2mb/iot-central-device-about.png" alt-text="Screenshot of device information in IoT Central":::

> [!TIP]
> To customize these views, edit the [device template](../iot-central/core/howto-edit-device-template.md).

## Troubleshoot

If you experience issues building the device code, flashing the device, or connecting, see [Troubleshooting](troubleshoot-embedded-device-quickstarts.md).

## Clean up resources

If you no longer need the Azure resources created in this quickstart, you can delete them from the IoT Central portal.

To remove the entire Azure IoT Central sample application and all its devices and resources:
1. Select **Administration** > **Your application**.
1. Select **Delete**.

## Next steps

In this quickstart, you built a custom image that contains Azure RTOS sample code, and then flashed the image to the Renesas RX65N device. You also used the IoT Central portal to create Azure resources, connect the Renesas RX65N securely to Azure, view telemetry, and send messages.

As a next step, explore the following articles to learn more about using the IoT device SDKs to connect devices to Azure IoT. 

> [!div class="nextstepaction"]
> [Connect a simulated device to IoT Central](quickstart-send-telemetry-central.md)
> [!div class="nextstepaction"]
> [Connect a simulated device to IoT Hub](quickstart-send-telemetry-iot-hub.md)

> [!IMPORTANT]
> Azure RTOS provides OEMs with components to secure communication and to create code and data isolation using underlying MCU/MPU hardware protection mechanisms. However, each OEM is ultimately responsible for ensuring that their device meets evolving security requirements.
