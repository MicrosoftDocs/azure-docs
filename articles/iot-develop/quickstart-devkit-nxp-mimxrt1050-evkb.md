---
title: Connect an NXP MIMXRT1050-EVKB to Azure IoT Central quickstart
description: Use Azure RTOS embedded software to connect an NXP MIMXRT1050-EVKB device to Azure IoT and send telemetry.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.devlang: c
ms.topic: quickstart
ms.date: 10/21/2022
ms.custom: mode-other, engagement-fy23
---

# Quickstart: Connect an NXP MIMXRT1050-EVKB Evaluation kit to IoT Central

**Applies to**: [Embedded device development](about-iot-develop.md#embedded-device-development)<br>
**Total completion time**:  30 minutes

[![Browse code](media/common/browse-code.svg)](https://github.com/azure-rtos/getting-started/tree/master/NXP/MIMXRT1050-EVKB/)

In this quickstart, you use Azure RTOS to connect an NXP MIMXRT1050-EVKB Evaluation kit (from now on, NXP EVK) to Azure IoT.

You'll complete the following tasks:

* Install a set of embedded development tools for programming an NXP EVK in C
* Build an image and flash it onto the NXP EVK
* Use Azure IoT Central to create cloud components, view properties, view device telemetry, and call direct commands

## Prerequisites

* A PC running Windows 10
* [Git](https://git-scm.com/downloads) for cloning the repository
* Hardware

    * The [NXP MIMXRT1050-EVKB](https://www.nxp.com/design/development-boards/i-mx-evaluation-and-development-boards/i-mx-rt1050-evaluation-kit:MIMXRT1050-EVK) (NXP EVK)
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

[!INCLUDE [iot-develop-embedded-create-central-app-with-device](../../includes/iot-develop-embedded-create-central-app-with-device.md)]

## Prepare the device

To connect the NXP EVK to Azure, you'll modify a configuration file for Wi-Fi and Azure IoT settings, rebuild the image, and flash the image to the device.

### Add configuration

1. Open the following file in a text editor:

    *getting-started\NXP\MIMXRT1050-EVKB\app\azure_config.h*

1. Set the Azure IoT device information constants to the values that you saved after you created Azure resources.

    |Constant name|Value|
    |-------------|-----|
    |`IOT_DPS_ID_SCOPE` |{*Your ID scope value*}|
    |`IOT_DPS_REGISTRATION_ID` |{*Your Device ID value*}|
    |`IOT_DEVICE_SAS_KEY` |{*Your Primary key value*}|

1. Save and close the file.

### Build the image

1. In your console or in File Explorer, run the script *rebuild.bat* at the following path to build the image:

    *getting-started\NXP\MIMXRT1050-EVKB\tools\rebuild.bat*

2. After the build completes, confirm that the binary file was created in the following path:

    *getting-started\NXP\MIMXRT1050-EVKB\build\app\mimxrt1050_azure_iot.bin*

### Flash the image

1. On the NXP EVK, locate the **Reset** button, the Micro USB port, and the Ethernet port. You use these components in the following steps. All three are highlighted in the following picture:

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1050-evkb/nxp-1050-evkb-board.png" alt-text="Locate key components on the NXP EVK board":::

1. Connect the Micro USB cable to the Micro USB port on the NXP EVK, and then connect it to your computer. After the device powers up, a solid green LED shows the power status.
1. Use the Ethernet cable to connect the NXP EVK to an Ethernet port.
1. In File Explorer, find the binary file that you created in the previous section.
1. Copy the binary file *mimxrt1050_azure_iot.bin*
1. In File Explorer, find the NXP EVK device connected to your computer. The device appears as a drive on your system with the drive label **RT1050-EVK**.
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

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1050-evkb/termite-settings.png" alt-text="Screenshot of serial port settings in the Termite app":::

1. Select OK.
1. Press the **Reset** button on the device. The button is labeled on the device and located near the Micro USB connector.
1. In the **Termite** app, check the following checkpoint values to confirm that the device is initialized and connected to Azure IoT.

    ```output
    Starting Azure thread

    Initializing DHCP
        IP address: 10.0.0.77
        Mask: 255.255.255.0
        Gateway: 10.0.0.1
    SUCCESS: DHCP initialized

    Initializing DNS client
        DNS address: 10.0.0.1
    SUCCESS: DNS client initialized

    Initializing SNTP client
        SNTP server 0.pool.ntp.org
        SNTP IP address: 142.147.92.5
        SNTP time update: May 28, 2021 17:36:33.325 UTC 
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

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1050-evkb/iot-central-device-view-status.png" alt-text="Screenshot of device status in IoT Central":::

## View telemetry

With IoT Central, you can view the flow of telemetry from your device to the cloud.

To view telemetry in IoT Central portal:

1. From the application dashboard, select **Devices** on the side navigation menu.
1. Select the device from the device list.
1. View the telemetry as the device sends messages to the cloud in the **Overview** tab.
1. The temperature is measured from the MCU wafer.

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1050-evkb/iot-central-device-telemetry.png" alt-text="Screenshot of device telemetry in IoT Central":::

    > [!NOTE]
    > You can also monitor telemetry from the device by using the Termite app.

## Call a direct method on the device

You can also use IoT Central to call a direct method that you've implemented on your device. Direct methods have a name, and can optionally have a JSON payload, configurable connection, and method timeout. In this section, you call a method that enables you to turn an LED on or off.

To call a method in IoT Central portal:

1. Select the **Command** tab from the device page.
1. In the **State** dropdown, select **True**, and then select **Run**.  There will be no change on the device as there isn't an available LED to toggle. You can view the output in Termite to monitor the status of the methods.

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1050-evkb/iot-central-invoke-method.png" alt-text="Screenshot of calling a direct method on a device in IoT Central":::

1. In the **State** dropdown, select **False**, and then select **Run**.

## View device information

You can view the device information from IoT Central.

Select **About** tab from the device page.

:::image type="content" source="media/quickstart-devkit-nxp-mimxrt1050-evkb/iot-central-device-about.png" alt-text="Screenshot of device information in IoT Central":::

> [!TIP]
> To customize these views, edit the [device template](../iot-central/core/howto-edit-device-template.md).

## Troubleshoot and debug

If you experience issues building the device code, flashing the device, or connecting, see [Troubleshooting](troubleshoot-embedded-device-quickstarts.md).

For debugging the application, see [Debugging with Visual Studio Code](https://github.com/azure-rtos/getting-started/blob/master/docs/debugging.md).

## Clean up resources

If you no longer need the Azure resources created in this quickstart, you can delete them from the IoT Central portal.

To remove the entire Azure IoT Central sample application and all its devices and resources:
1. Select **Administration** > **Your application**.
1. Select **Delete**.

## Next steps

In this quickstart, you built a custom image that contains Azure RTOS sample code, and then flashed the image to the NXP EVK device. You also used the IoT Central portal to create Azure resources, connect the NXP EVK securely to Azure, view telemetry, and send messages.

As a next step, explore the following articles to learn more about using the IoT device SDKs to connect devices to Azure IoT. 

> [!div class="nextstepaction"]
> [Connect a simulated device to IoT Central](quickstart-send-telemetry-central.md)
> [!div class="nextstepaction"]
> [Connect a simulated device to IoT Hub](quickstart-send-telemetry-iot-hub.md)

> [!IMPORTANT]
> Azure RTOS provides OEMs with components to secure communication and to create code and data isolation using underlying MCU/MPU hardware protection mechanisms. However, each OEM is ultimately responsible for ensuring that their device meets evolving security requirements.
