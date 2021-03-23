---
title: Connect an MXCHIP AZ3166 to Azure IoT Central quickstart
description: Use Azure RTOS embedded software to connect an MXCHIP AZ3166 device to Azure IoT and send telemetry.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.devlang: c
ms.topic: quickstart
ms.date: 03/17/2021
---

# Quickstart: Connect an MXCHIP AZ3166 devkit to IoT Central

**Applies to**: [Embedded device development](about-iot-develop.md#embedded-device-development)
**Total completion time**:  30 minutes

In this tutorial you use Azure RTOS to connect the MXCHIP AZ3166 IoT DevKit (hereafter, the MXChip DevKit) to Azure IoT. The article is part of the series [Getting started with Azure IoT embedded device development](quickstart-device-development.md). The series introduces device developers to Azure RTOS, and shows how to connect several device evaluation kits to Azure IoT.

You will complete the following tasks:

* Install a set of embedded development tools for programming the MXChip DevKit in C
* Build an image and flash it onto the MXCHIP DevKit
* Use Azure IoT Central to create cloud components, view properties, view device telemetry, and call direct commands

> [!NOTE]
> If you prefer to only view the code and not complete this article, see the sample at [Readme: Sample for MXCHIP AZ3166](https://github.com/azure-rtos/getting-started/tree/master/MXChip/AZ3166). If you plan to complete this article, you'll clone the GitHub repo in a later step.

## Prerequisites

* A PC running Microsoft Windows 10
* [Git](https://git-scm.com/downloads) for cloning the repository
* Hardware

    > * The [MXCHIP AZ3166 IoT DevKit](https://aka.ms/iot-devkit) (MXCHIP DevKit)
    > * Wi-Fi 2.4 GHz
    > * USB 2.0 A male to Micro USB male cable

## Prepare the development environment

To set up your development environment, first you clone a GitHub repo that contains all the assets you need for the tutorial. Then you install a set of programming tools.

### Clone the repo for the tutorial

Clone the following repo to download all sample device code, setup scripts, and offline versions of the documentation. If you previously cloned this repo in another tutorial, you don't need to do it again.

To clone the repo, run the following command:

```shell
git clone --recursive https://github.com/azure-rtos/getting-started.git
```

### Install the tools

The cloned repo contains a setup script that installs and configures the required tools. If you installed these tools in another tutorial in the getting started guide, you don't need to do it again.

> [!NOTE]
> The setup script installs the following tools:
> * [CMake](https://cmake.org): Build
> * [ARM GCC](https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm): Compile
> * [Termite](https://www.compuphase.com/software_termite.htm): Monitor serial port output for connected devices

To install the tools:

1. From File Explorer, navigate to the following path in the repo and run the setup script named *get-toolchain.bat*:

    > *getting-started\tools\get-toolchain.bat*

1. After the installation, open a new console window to recognize the configuration changes made by the setup script. Use this console to complete the remaining programming tasks in the tutorial. You can use Windows CMD, PowerShell, or Git Bash for Windows.
1. Run the following code to confirm that CMake version 3.14 or later is installed.

    ```shell
    cmake --version
    ```

## Create the cloud components

### Create the IoT Central Application

There are several ways to connect devices to Azure IoT. In this section, you learn how to connect a device by using Azure IoT Central. IoT Central is an IoT application platform that reduces the cost and complexity of creating and managing IoT solutions.

To create a new application:
1. From [Azure IoT Central portal](https://apps.azureiotcentral.com/), select **My apps** on the side navigation menu.
1. Select **+ New application**.
1. Select **Custom apps**.
1. Add Application Name and a URL.
1. Choose the **Free** Pricing plan to activate a 7-day trial.
    :::image type="content" source="media/quickstart-devkit-mxchip-az3166/iot-central-create-custom.png" alt-text="Create a custom app in Azure IoT Central":::

1. Select **Create**.

    After IoT Central provisions the application, it redirects you automatically to the new application dashboard.

    > [!NOTE]
    > If you have an existing IoT Central application, you can use it to complete the steps in this article rather than create a new application.

### Create a new device

In this section, you use the IoT Central application dashboard to create a new device. You will use the connection information for the newly created device to securely connect your physical device in a later section.

To create a device:
1. From the application dashboard, select **Devices** on the side navigation menu.
1. Select **+ New** to open the **Create a new device** window.
1. Leave Device template as **Unassigned**.
1. Fill in the desired Device name and Device ID.
    :::image type="content" source="media/quickstart-devkit-mxchip-az3166/iot-central-create-device.png" alt-text="Create a device in Azure IoT Central":::
1. Select the **Create** button.
1. The newly created device will appear in the **All devices** list.  Select on the device name to show details.
1. Select **Connect** in the top right menu bar to display the connection information used to configure the device in the next section.
    :::image type="content" source="media/quickstart-devkit-mxchip-az3166/iot-central-device-connection-info.png" alt-text="View device connection details":::

1. Note the connection values for the following connection string parameters displayed in **Connect** dialog. You'll add these values to a configuration file in the next step:

    > * `ID scope`
    > * `Device ID`
    > * `Primary key`

## Prepare the device

To connect the STM DevKit to Azure, you'll modify a configuration file for Wi-Fi and Azure IoT settings, rebuild the image, and flash the image to the device.

### Add configuration

1. Open the following file in a text editor:

    > *getting-started\MXChip\AZ3166\app\azure_config.h*

1. Set the Wi-Fi constants to the following values from your local environment.

    |Constant name|Value|
    |-------------|-----|
    |`WIFI_SSID` |{*Your Wi-Fi ssid*}|
    |`WIFI_PASSWORD` |{*Your Wi-Fi password*}|
    |`WIFI_MODE` |{*One of the enumerated Wi-Fi mode values in the file*}|

1. Set the Azure IoT device information constants to the values that you saved after you created Azure resources.

    |Constant name|Value|
    |-------------|-----|
    |`IOT_DPS_ID_SCOPE` |{*Your ID scope value*}|
    |`IOT_DPS_REGISTRATION_ID` |{*Your Device ID value*}|
    |`IOT_DEVICE_SAS_KEY` |{*Your Primary key value*}|

1. Save and close the file.

### Build the image

In your console or in File Explorer, run the script *rebuild.bat* at the following path to build the image:

> *getting-started\MXChip\AZ3166\tools\rebuild.bat*

After the build completes, confirm that the binary file was created in the following path:

> *getting-started\MXChip\AZ3166\build\app\mxchip_azure_iot.bin*

### Flash the image

1. On the MXCHIP DevKit, locate the **Reset** button, and the Micro USB port. You use these components in the following steps. Both are highlighted in the following picture:
    :::image type="content" source="media/quickstart-devkit-mxchip-az3166/mxchip-iot-devkit.png" alt-text="Locate key components on the MXChip devkit board":::

1. Connect the Micro USB cable to the Micro USB port on the MXCHIP DevKit, and then connect it to your computer.
1. In File Explorer, find the binary file that you created in the previous section.

1. Copy the binary file *mxchip_azure_iot.bin*.

1. In File Explorer, find the MXCHIP DevKit device connected to your computer. The device appears as a drive on your system with the drive label **AZ3166**.

1. Paste the binary file into the root folder of the MXCHIP Devkit. Flashing starts automatically and completes in a few seconds.

    > Note: During the flashing process, a green LED toggles on MXCHIP DevKit.

### Confirm device connection details

You can use the **Termite** utility to monitor communication and confirm that your device is set up correctly.

1. Start **Termite**.
    > [!TIP]
    > If you are unable to connect Termite to your devkit, install the [ST-LINK driver](https://my.st.com/content/ccc/resource/technical/software/driver/files/stsw-link009.zip) and try again. See  [Troubleshooting](https://github.com/azure-rtos/getting-started/blob/master/docs/troubleshooting.md) for additional steps.
1. Select **Settings**.
1. In the **Serial port settings** dialog, check the following settings and update if needed:
    * **Baud rate**: 115,200
    * **Port**: The port that your STM DevKit is connected to. If there are multiple port options in the dropdown, you can find the correct port to use. Open Windows **Device Manager**, and view **Ports** to identify which port to use.

    :::image type="content" source="media/quickstart-devkit-mxchip-az3166/termite-settings.png" alt-text="Confirm settings in the Termite utility":::

1. Select OK.
1. Press the **Reset** button on the device. The button is labeled on the device and located near the Micro USB connector.
1. In the **Termite** console, check the following checkpoint values to confirm that the device is initialized and connected to Azure IoT.

    ```output
    Starting Azure thread

    Initializing WiFi
    	Connecting to SSID 'iot'
    SUCCESS: WiFi connected to iot

    Initializing DHCP
    	IP address: 10.0.0.123
    	Mask: 255.255.255.0
    	Gateway: 10.0.0.1
    SUCCESS: DHCP initialized

    Initializing DNS client
    	DNS address: 10.0.0.1
    SUCCESS: DNS client initialized

    Initializing SNTP client
    	SNTP server 0.pool.ntp.org
    	SNTP IP address: 185.242.56.3
    	SNTP time update: Nov 16, 2020 23:47:35.385 UTC 
    SUCCESS: SNTP initialized

    Initializing Azure IoT DPS client
    	DPS endpoint: global.azure-devices-provisioning.net
    	DPS ID scope: ***
    	Registration ID: ***
    SUCCESS: Azure IoT DPS client initialized

    Initializing Azure IoT Hub client
    	Hub hostname: ***
    	Device id: ***
    	Model id: dtmi:azurertos:devkit:gsgmxchip;1
    Connected to IoTHub
    SUCCESS: Azure IoT Hub client initialized

    Starting Main loop
    ```

Keep Termite open to monitor device output in the following steps.

## Verify the device status

To view the device status in IoT Central portal:
1. From the application dashboard, select **Devices** on the side navigation menu.
1. Confirm that the **Device status** is updated to **Provisioned**.
1. Confirm that the **Device template** is updated to **Getting Started Guide**.
    :::image type="content" source="media/quickstart-devkit-mxchip-az3166/iot-central-device-view-status.png" alt-text="View device status in IoT Central":::

## View telemetry

With IoT Central, you can view the flow of telemetry from your device to the cloud.

To view telemetry in IoT Central portal:

1. From the application dashboard, select **Devices** on the side navigation menu.
1. Select the device from the device list.
1. View the telemetry as the device sends messages to the cloud in the **Overview** tab.
    :::image type="content" source="media/quickstart-devkit-mxchip-az3166/iot-central-device-telemetry.png" alt-text="View device telemetry in IoT Central":::

    > [!NOTE]
    > You can also monitor telemetry from the device by using the Termite terminal.

## Call a direct method on the device

You can also use IoT Central to call a direct method that you have implemented on your device. Direct methods have a name, and can optionally have a JSON payload, configurable connection, and method timeout. In this section, you call a method that enables you to turn an LED on or off.

To call a method in IoT Central portal:

1. Select the **Command** tab from the device page.
1. Select **State** and select **Run**.  The LED light should turn on.
    :::image type="content" source="media/quickstart-devkit-mxchip-az3166/iot-central-invoke-method.png" alt-text="Call a direct method on a device":::

1. Unselect **State** and select **Run**. The LED light should turn off.

## View device information

You can view the device information from IoT Central.

Select **About** tab from the device page.
:::image type="content" source="media/quickstart-devkit-mxchip-az3166/iot-central-device-about.png" alt-text="View information about the device in IoT Central":::

## Debugging

For debugging the application, see [Debugging with Visual Studio Code](https://github.com/azure-rtos/getting-started/blob/master/docs/debugging.md).

## Clean up resources

If you no longer need the Azure resources created in this tutorial, you can delete them from the IoT Central portal. Optionally, if you continue to another tutorial in this Getting Started guide, you can keep the resources you've already created and reuse them.

To remove the entire Azure IoT Central sample application and all its devices and resources:
1. Select **Administration** > **Your application**.
1. Select **Delete**.

## Next Steps

In this tutorial you built a custom image that contains Azure RTOS sample code, and then flashed the image to the MXCHIP DevKit device. You also used the IoT Central portal to create Azure resources, connect the MXCHIP DevKit securely to Azure, view telemetry, and send messages.

* For device developers, the suggested next step is to see the other tutorials in the series [Getting started with Azure IoT embedded device development](quickstart-device-development.md).
* If you have issues getting your device to initialize or connect after following the steps in this guide, see [Troubleshooting](https://github.com/azure-rtos/getting-started/blob/master/docs/troubleshooting.md).
* To learn more about how Azure RTOS components are used in the sample code for this tutorial, see [Using Azure RTOS in the Getting Started guide](https://github.com/azure-rtos/getting-started/blob/master/docs/using-azure-rtos.md).

    > [!IMPORTANT]
    > Azure RTOS provides OEMs with components to secure communication and to create code and data isolation using underlying MCU/MPU hardware protection mechanisms. However, each OEM is ultimately responsible for ensuring that their device meets evolving security requirements.

