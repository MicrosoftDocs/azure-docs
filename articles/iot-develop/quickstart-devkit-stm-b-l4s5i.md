---
title: Connect an STMicroelectronics B-L4S5I-IOT01A to Azure IoT Central quickstart
description: Use Azure RTOS embedded software to connect an STMicroelectronics B-L4S5I-IOT01A device to Azure IoT and send telemetry.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.devlang: c
ms.topic: quickstart
ms.date: 10/21/2022
ms.custom: mode-other, engagement-fy23
zone_pivot_groups: iot-develop-stm32-toolset

# Owner: timlt
#- id: iot-develop-stm32-toolset
#  title: IoT Devices
#  prompt: Choose a build environment
#  pivots:
#  - id: iot-toolset-cmake
#    title: CMake
#  - id: iot-toolset-iar-ewarm
#    title: IAR EWARM
#  - id: iot-toolset-stm32cube
#    title: STM32Cube IDE

---

# Quickstart: Connect an STMicroelectronics B-L4S5I-IOT01A Discovery kit to IoT Central

**Applies to**: [Embedded device development](about-iot-develop.md#embedded-device-development)<br>
**Total completion time**:  30 minutes

:::zone pivot="iot-toolset-cmake"
[![Browse code](media/common/browse-code.svg)](https://github.com/azure-rtos/getting-started/tree/master/STMicroelectronics/)
:::zone-end
:::zone pivot="iot-toolset-iar-ewarm, iot-toolset-stm32cube"
[![Browse code](media/common/browse-code.svg)](https://github.com/azure-rtos/samples/)
:::zone-end

In this quickstart, you use Azure RTOS to connect the STMicroelectronics [B-L4S5I-IOT01A](https://www.st.com/en/evaluation-tools/b-l4S5i-iot01a.html) Discovery kit (from now on, the STM DevKit) to Azure IoT.

You'll complete the following tasks:

* Install a set of embedded development tools for programming the STM DevKit in C
* Build an image and flash it onto the STM DevKit
* Use Azure IoT Central to create cloud components, view properties, view device telemetry, and call direct commands

:::zone pivot="iot-toolset-cmake"

## Prerequisites

* A PC running Windows 10
* [Git](https://git-scm.com/downloads) for cloning the repository
* Hardware

    * The [B-L4S5I-IOT01A](https://www.st.com/en/evaluation-tools/b-l4s5i-iot01a.html) (STM DevKit)
    * Wi-Fi 2.4 GHz
    * USB 2.0 A male to Micro USB male cable
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

1. From File Explorer, navigate to the following path in the repo and run the setup batch file named *get-toolchain.bat*.

    *getting-started\tools\get-toolchain.bat*
1. After the installation, open a new console window to recognize the configuration changes made by the setup batch file. Use this console to complete the remaining programming tasks in the quickstart. You can use Windows CMD, PowerShell, or Git Bash for Windows.
1. Run the following code to confirm that CMake version 3.14 or later is installed.

    ```shell
    cmake --version
    ```
[!INCLUDE [iot-develop-embedded-create-central-app-with-device](../../includes/iot-develop-embedded-create-central-app-with-device.md)]

## Prepare the device

To connect the STM DevKit to Azure, you'll modify a configuration file for Wi-Fi and Azure IoT settings, rebuild the image, and flash the image to the device.

### Add configuration

1. Open the following file in a text editor.

    *getting-started\STMicroelectronics\B-L4S5I-IOT01A\app\azure_config.h*

1. Set the Wi-Fi constants to the following values from your local environment.

    |Constant name|Value|
    |-------------|-----|
    |`WIFI_SSID` |{*Use your Wi-Fi SSID*}|
    |`WIFI_PASSWORD` |{*Use your Wi-Fi password*}|
    |`WIFI_MODE` |{*Use one of the enumerated Wi-Fi mode values in the file*}|

1. Set the Azure IoT device information constants to the values that you saved after you created Azure resources.

    |Constant name|Value|
    |-------------|-----|
    |`IOT_DPS_ID_SCOPE` |{*Use your ID scope value*}|
    |`IOT_DPS_REGISTRATION_ID` |{*Use your Device ID value*}|
    |`IOT_DEVICE_SAS_KEY` |{*Use your Primary key value*}|

1. Save and close the file.

### Build the image

1. In your console or in File Explorer, run the batch file *rebuild.bat* at the following path to build the image:

    *getting-started\STMicroelectronics\B-L4S5I-IOT01A\tools\rebuild.bat*

2. After the build completes, confirm that the binary file was created in the following path:

    *getting-started\STMicroelectronics\B-L4S5I-IOT01A\build\app\stm32l4S5_azure_iot.bin*

### Flash the image

1. On the STM DevKit MCU, locate the **Reset** button (1), the Micro USB port (2), which is labeled **USB STLink**, and the board part number (3). You'll refer to these items in the next steps. All of them are highlighted in the following picture:

    :::image type="content" source="media/quickstart-devkit-stm-b-l4s5i/stm-b-l4s5i.png" alt-text="Locate key components on the STM DevKit board":::

1. Connect the Micro USB cable to the **USB STLINK** port on the STM DevKit, and then connect it to your computer.

    > [!NOTE]
    > For detailed setup information about the STM DevKit, see the instructions on the packaging, or see [B-L4S5I-IOT01A Resources](https://www.st.com/en/evaluation-tools/b-l4s5i-iot01a.html#resource)

1. In File Explorer, find the binary files that you created in the previous section.

1. Copy the binary file named *stm32l4s5_azure_iot.bin*.

1. In File Explorer, find the STM Devkit that's connected to your computer. The device appears as a drive on your system.

1. Paste the binary file into the root folder of the STM Devkit. Flashing starts automatically and completes in a few seconds.

    > [!NOTE]
    > During the flashing process, an LED toggles between red and green on the STM DevKit.

### Confirm device connection details

You can use the **Termite** app to monitor communication and confirm that your device is set up correctly.

1. Start **Termite**.
    > [!TIP]
    > If you are unable to connect Termite to your devkit, install the [ST-LINK driver](https://www.st.com/en/development-tools/stsw-link009.html) and try again. See  [Troubleshooting](troubleshoot-embedded-device-quickstarts.md) for additional steps.
1. Select **Settings**.
1. In the **Serial port settings** dialog, check the following settings and update if needed:
    * **Baud rate**: 115,200
    * **Port**: The port that your STM DevKit is connected to. If there are multiple port options in the dropdown, you can find the correct port to use. Open Windows **Device Manager**, and view **Ports** to identify which port to use.

    :::image type="content" source="media/quickstart-devkit-stm-b-l4s5i/termite-settings.png" alt-text="Screenshot of serial port settings in the Termite app":::

1. Select OK.
1. Press the **Reset** button on the device. The button is black and is labeled on the device.
1. In the **Termite** app, check the following checkpoint values to confirm that the device is initialized and connected to Azure IoT.

    ```output
    Starting Azure thread

    Initializing WiFi
        Module: ISM43362-M3G-L44-SPI
        MAC address: C4:7F:51:8F:67:F6
        Firmware revision: C3.5.2.5.STM
        Connecting to SSID 'iot'
    SUCCESS: WiFi connected to iot

    Initializing DHCP
        IP address: 192.168.0.22
        Gateway: 192.168.0.1
    SUCCESS: DHCP initialized

    Initializing DNS client
        DNS address: 75.75.75.75
    SUCCESS: DNS client initialized

    Initializing SNTP client
        SNTP server 0.pool.ntp.org
        SNTP IP address: 108.62.122.57
        SNTP time update: May 21, 2021 22:42:8.394 UTC
    SUCCESS: SNTP initialized

    Initializing Azure IoT DPS client
        DPS endpoint: global.azure-devices-provisioning.net
        DPS ID scope: ***
        Registration ID: mydevice
    SUCCESS: Azure IoT DPS client initialized

    Initializing Azure IoT Hub client
        Hub hostname: ***.azure-devices.net
        Device id: mydevice
        Model id: dtmi:azurertos:devkit:gsgstml4s5;1
    Connected to IoT Hub
    SUCCESS: Azure IoT Hub client initialized
    ```
    > [!IMPORTANT]
    > If the DNS client initialization fails and notifies you that the Wi-Fi firmware is out of date, you'll need to update the Wi-Fi module firmware. Download and install the [Inventek ISM 43362 Wi-Fi module firmware update](https://www.st.com/resource/en/utilities/inventek_fw_updater.zip). Then press the **Reset** button on the device to recheck your connection, and continue with this quickstart.

Keep Termite open to monitor device output in the following steps.

:::zone-end

:::zone pivot="iot-toolset-iar-ewarm"
## Prerequisites

* A PC running Windows 10
* [Git](https://git-scm.com/downloads) for cloning the repository
* Hardware

    * The [B-L4S5I-IOT01A](https://www.st.com/en/evaluation-tools/b-l4s5i-iot01a.html) (STM DevKit)
    * Wi-Fi 2.4 GHz
    * USB 2.0 A male to Micro USB male cable

* IAR Embedded Workbench for ARM (IAR EW). You can download and install a [14-day free trial of IAR EW for ARM](https://www.iar.com/products/architectures/arm/iar-embedded-workbench-for-arm/).

* Download the STMicroelectronics B-L4S5I-IOT01A IAR sample from [Azure RTOS samples](https://github.com/azure-rtos/samples/), and unzip it to a working directory. Choose a directory with a short path to avoid compiler errors when you build.


[!INCLUDE [iot-develop-embedded-create-central-app-with-device](../../includes/iot-develop-embedded-create-central-app-with-device.md)]

## Prepare the device

To connect the device to Azure, you'll modify a configuration file for Azure IoT settings and IAR settings for Wi-Fi. Then you'll build and flash the image to the device.

### Add configuration

1. Open the **azure_rtos.eww** EWARM Workspace in IAR from the extracted zip file.

    :::image type="content" source="media/quickstart-devkit-stm-b-l4s5i/ewarm-workspace-in-iar.png" alt-text="EWARM workspace in IAR":::


1. Expand the project, then expand the **Sample** subfolder and open the *sample_config.h* file.

1. Near the top of the file, uncomment the `#define ENABLE_DPS_SAMPLE` directive.

    ```c
    #define ENABLE_DPS_SAMPLE
    ```

1. Set the Azure IoT device information constants to the values that you saved after you created Azure resources. The `ENDPOINT` constant is set to the global endpoint for Azure Device Provisioning Service (DPS).

    |Constant name|Value|
    |-------------|-----|
    |`ENDPOINT`| {*Use this value: "global.azure-devices-provisioning.net"*}|
    |`REGISTRATION_ID`| {*Use your Device ID value*}|
    |`ID_SCOPE`| {*Use your ID scope value*}|
    |`DEVICE_SYMMETRIC_KEY`| {*Use your Primary key value*}|

     > [!NOTE]
    > The `ENDPOINT`, `DEVICE_ID`, `ID_SCOPE`, and `DEVICE_SYMMETRIC_KEY` values are set in a `#ifndef ENABLE_DPS_SAMPLE` statement. Make sure you set the values in the `#else` statement, which will be used when the `ENABLE_DPS_SAMPLE` value is defined.

1. Save the file.

1. Select the **sample_azure_iot_embedded_sdk_pnp**, right-click on it on in the left **Workspace** pane, and select **Set as active**.
1. Right-click on the active project, select **Options > C/C++ Compiler > Preprocessor**. Replace the values for your WiFi to be used.

    |Symbol name|Value|
    |-----------|-----|
    |`WIFI_SSID` |{*Use your Wi-Fi SSID*}|
    |`WIFI_PASSWORD` |{*Use your Wi-Fi password*}|

     :::image type="content" source="media/quickstart-devkit-stm-b-l4s5i/options-for-node-sample.png" alt-text="Options for node sample":::

### Build the project

In IAR, select **Project > Batch Build** and choose **build_all** and select **Make** to build all projects. You’ll observe compilation and linking of all sample projects.

### Flash the image

1. On the STM DevKit MCU, locate the **Reset** button (1), the Micro USB port (2), which is labeled **USB STLink**, and the board part number (3). You’ll refer to these items in the next steps. All of them are highlighted in the following picture.

    :::image type="content" source="media/quickstart-devkit-stm-b-l4s5i/stm-b-l4s5i.png" alt-text="Locate key components on the STM DevKit board":::

1. Connect the Micro USB cable to the **USB STLINK** port on the STM DevKit, and then connect it to your computer.

    > [!NOTE]
    > For detailed setup information about the STM DevKit, see the instructions on the packaging, or see [B-L4S5I-IOT01A Resources](https://www.st.com/en/evaluation-tools/b-l4s5i-iot01a.html#resource).

1. In IAR, press the green **Download and Debug** button in the toolbar to download the program and run it. Then press ***Go***.
1. Check the Terminal I/O to verify that messages have been successfully sent to the Azure IoT hub.

    As the project runs, the demo displays the status information to the Terminal IO window (**View > Terminal I/O**). The demo also publishes the message to IoT Hub every few seconds.

    > [!NOTE]
    > The terminal output content varies depending on which sample you choose to build and run.

### Confirm device connection details

In the terminal window, you should see output like the following, to verify that the device is initialized and connected to Azure IoT.

```output
STM32L4XX Lib:
> CMSIS Device Version: 1.7.0.0.
> HAL Driver Version: 1.12.0.0.
> BSP Driver Version: 1.0.0.0.
ES-WIFI Firmware:
> Product Name: Inventek eS-WiFi
> Product ID: ISM43362-M3G-L44-SPI
> Firmware Version: C3.5.2.5.STM
> API Version: v3.5.2
ES-WIFI MAC Address: C4:7F:51:7:D7:73
wifi connect try 1 times
ES-WIFI Connected.
> ES-WIFI IP Address: 10.0.0.228
> ES-WIFI Gateway Address: 10.0.0.1
> ES-WIFI DNS1 Address: 75.75.75.75
> ES-WIFI DNS2 Address: 75.75.76.76
IP address: 10.0.0.228
Mask: 255.255.255.0
Gateway: 10.0.0.1
DNS Server address: 1.1.1.1
SNTP Time Sync...0.pool.ntp.org
SNTP Time Sync successfully.
[INFO] Azure IoT Security Module has been enabled, status=0
Start Provisioning Client...
Registered Device Successfully.
IoTHub Host Name: iotc-14c961cd-1779-4d1c-8739-5d2b9afa5b84.azure-devices.net; Device ID: mydevice.
Connected to IoTHub.
Sent properties request.
Telemetry message send: {"temperature":22}.
Received all properties
Telemetry message send: {"temperature":22}.
Telemetry message send: {"temperature":22}.
Telemetry message send: {"temperature":22}.
Telemetry message send: {"temperature":22}.
```

Keep the terminal open to monitor device output in the following steps.

## Verify the device status

To view the device status in IoT Central portal:
1. From the application dashboard, select **Devices** on the side navigation menu.
1. Confirm that the **Device status** is updated to **Provisioned**.
1. Confirm that the **Device template** is updated to **Thermostat**.

    :::image type="content" source="media/quickstart-devkit-stm-b-l4s5i/iot-central-device-view-status-iar.png" alt-text="Screenshot of device status in IoT Central":::

## View telemetry

With IoT Central, you can view the flow of telemetry from your device to the cloud.

To view telemetry in IoT Central portal:

1. From the application dashboard, select **Devices** on the side navigation menu.
1. Select the device from the device list.
1. View the telemetry as the device sends messages to the cloud in the **Overview** tab.

    :::image type="content" source="media/quickstart-devkit-stm-b-l4s5i/iot-central-device-telemetry-iar.png" alt-text="Screenshot of device telemetry in IoT Central":::

    > [!NOTE]
    > You can also monitor telemetry from the device by using the Termite app.


## Call a direct method on the device

You can also use IoT Central to call a direct method that you've implemented on your device. Direct methods have a name, and can optionally have a JSON payload, configurable connection, and method timeout.

To call a method in IoT Central portal:

1. Select the **Command** tab from the device page.
1. In the **Since** field, use the date picker and time selectors to set a time, then select **Run**.

    :::image type="content" source="media/quickstart-devkit-stm-b-l4s5i/iot-central-invoke-method-iar.png" alt-text="Screenshot of calling a direct method on a device in IoT Central":::

## View device information

You can view the device information from IoT Central.

Select the **About** tab from the device page.

:::image type="content" source="media/quickstart-devkit-stm-b-l4s5i/iot-central-device-about-iar.png" alt-text="Screenshot of device information in IoT Central":::

:::zone-end

:::zone pivot="iot-toolset-stm32cube"
## Prerequisites

* A PC running Windows 10
* [Git](https://git-scm.com/downloads) for cloning the repository
* Hardware

    * The [B-L4S5I-IOT01A](https://www.st.com/en/evaluation-tools/b-l4s5i-iot01a.html) (STM DevKit)
    * Wi-Fi 2.4 GHz
    * USB 2.0 A male to Micro USB male cable

## Download the STM32Cube IDE

You can download a free version of STM32Cube IDE, but you'll need to create an account. Follow the instructions on the ST website. The STM32Cube IDE can be downloaded from this website:
https://www.st.com/en/development-tools/stm32cubeide.html

The sample distribution zip file contains the following subfolders that you'll use later:

|Folder|Contents|
|-------------|-----|
|`sample_azure_iot_embedded_sdk` |{*Sample project to connect to Azure loT Hub using Azure loT Middleware for Azure RTOS*}|
|`sample_azure_iot_embedded_sdk_pnp` |{*Sample project to connect to Azure loT Hub using Azure loT Middleware for Azure RTOS via loT Plug and Play*}|

Download the STMicroelectronics B-L4S5I-IOT01A IAR sample from [Azure RTOS samples](https://github.com/azure-rtos/samples/), and unzip it to a working directory. Choose a directory with a short path to avoid compiler errors when you build.


[!INCLUDE [iot-develop-embedded-create-central-app-with-device](../../includes/iot-develop-embedded-create-central-app-with-device.md)]

## Prepare the device

To connect the device to Azure, you'll modify a configuration file for Azure IoT settings and STM32Cube IDE settings for Wi-Fi, and then build and flash the image to the device.

### Add configuration

1. Launch STM32CubeIDE, select ***File > Open Projects from File System.*** Open the **stm32cubeide** folder from inside the extracted zip file, and then select ***Finish*** to open the projects.

    :::image type="content" source="media/quickstart-devkit-stm-b-l4s5i/import-projects.png" alt-text="Import projects from distribution Zip file":::

1. Select the sample project that you want to build and run. For example, ***sample_azure_iot_embedded_sdk_pnp.***

1. Expand the ***common_hardware_code*** folder to open ***board_setup.c*** to configure the values for your WiFi to be used.

    |Symbol name|Value|
    |-----------|-----|
    |`WIFI_SSID` |{*Use your Wi-Fi SSID*}|
    |`WIFI_PASSWORD` |{*se your Wi-Fi password*}|

1. Expand the sample folder to open **sample_config.h** to set the Azure IoT device information constants to the values that you saved after you created Azure resources.

    |Constant name|Value|
    |-------------|-----|
    |`ENDPOINT` |{*Use this value: "global.azure-devices-provisioning.net"*}|
    |`REGISTRATION_ID` |{*Use your Device ID value*}|
    |`ID_SCOPE` |{*Use your ID scope value*}|
    |`DEVICE_SYMMETRIC_KEY` |{*Use your Primary key value*}|

     > [!NOTE]
    > The `ENDPOINT`, `DEVICE_ID`, `ID_SCOPE`, and `DEVICE_SYMMETRIC_KEY` values are set in a `#ifndef ENABLE_DPS_SAMPLE` statement. Make sure you set the values in the `#else` statement, which will be used when the `ENABLE_DPS_SAMPLE` value is defined.

### Build the project

In STM32CubeIDE, select ***Project > Build All*** to build sample projects and its dependent libraries. You'll observe compilation and linking of the sample project.

Download and run the project

1. On the STM DevKit MCU, locate the **Reset** button (1), the Micro USB port (2), which is labeled **USB STLink**, and the board part number (3). You'll refer to these items in the next steps. All of them are highlighted in the following picture:

    :::image type="content" source="media/quickstart-devkit-stm-b-l4s5i/stm-b-l4s5i.png" alt-text="Locate key components on the STM DevKit board":::

1. Connect the Micro USB cable to the **USB STLINK** port on the STM DevKit, and then connect it to your computer.

1. In STM32CubeIDE, Select ***Run > Debug (F11)*** or ***Debug*** on the toolbar to download the program and run it, and then select Resume. You may need to upgrade the ST-Link to make the debug work. Select ***Help > ST-Link Upgrade*** and follow the instructions.

    :::image type="content" source="media/quickstart-devkit-stm-b-l4s5i/stlink-upgrade.png" alt-text="ST-Link upgrade instructions":::

1. Verify the serial port in your OS’s device manager. It should show up as a COM port.

    :::image type="content" source="media/quickstart-devkit-stm-b-l4s5i/verify-com-port.png" alt-text="Verify the serial port":::

1. Open your favorite serial terminal program such as Termite and connect to the COM port discovered above. Configure the following values for the serial ports:
   Baud rate: ***115200***
   Data bits: ***8***
   Stop bits: ***1***

1. As the project runs, the demo displays status information to the terminal output window. The demo also publishes the message to IoT Hub every five seconds. Check the terminal output to verify that messages have been successfully sent to the Azure IoT hub.

    > [!NOTE]
    > The terminal output content varies depending on which sample you choose to build and run.

### Confirm device connection details

In the terminal window, you should see output like the following, to verify that the device is initialized and connected to Azure IoT.

```output
STM32L4XX Lib:
> CMSIS Device Version: 1.7.0.0.
> HAL Driver Version: 1.12.0.0.
> BSP Driver Version: 1.0.0.0.
ES-WIFI Firmware:
> Product Name: Inventek eS-WiFi
> Product ID: ISM43362-M3G-L44-SPI
> Firmware Version: C3.5.2.5.STM
> API Version: v3.5.2
ES-WIFI MAC Address: C4:7F:51:7:D7:73
wifi connect try 1 times
ES-WIFI Connected.
> ES-WIFI IP Address: 10.0.0.204
> ES-WIFI Gateway Address: 10.0.0.1
> ES-WIFI DNS1 Address: 75.75.75.75
> ES-WIFI DNS2 Address: 75.75.76.76
IP address: 10.0.0.204
Mask: 255.255.255.0
Gateway: 10.0.0.1
DNS Server address: 75.75.75.75
SNTP Time Sync...0.pool.ntp.org
SNTP Time Sync...1.pool.ntp.org
SNTP Time Sync successfully.
[INFO] Azure IoT Security Module has been enabled, status=0
Start Provisioning Client...
Registered Device Successfully.
IoTHub Host Name: iotc-ad97cfe1-91b4-4476-bee8-dcdb0aa2cc0a.azure-devices.net; Device ID: 51pf4yld0g.
Connected to IoTHub.
Sent properties request.
Telemetry message send: {"temperature":22}.
[INFO] Azure IoT Security Module message is empty
Received all properties
Telemetry message send: {"temperature":22}.
Telemetry message send: {"temperature":22}.
Telemetry message send: {"temperature":22}.
```

Keep the terminal open to monitor device output in the following steps.

## Verify the device status

To view the device status in IoT Central portal:
1. From the application dashboard, select **Devices** on the side navigation menu.
1. Confirm that the **Device status** is updated to **Provisioned**.
1. Confirm that the **Device template** is updated to **Thermostat**.

    :::image type="content" source="media/quickstart-devkit-stm-b-l4s5i/iot-central-device-view-status-iar.png" alt-text="Screenshot of device status in IoT Central":::

## View telemetry

With IoT Central, you can view the flow of telemetry from your device to the cloud.

To view telemetry in IoT Central portal:

1. From the application dashboard, select **Devices** on the side navigation menu.
1. Select the device from the device list.
1. View the telemetry as the device sends messages to the cloud in the **Overview** tab.

    :::image type="content" source="media/quickstart-devkit-stm-b-l4s5i/iot-central-device-telemetry-iar.png" alt-text="Screenshot of device telemetry in IoT Central":::

    > [!NOTE]
    > You can also monitor telemetry from the device by using the Termite app.


## Call a direct method on the device

You can also use IoT Central to call a direct method that you've implemented on your device. Direct methods have a name, and can optionally have a JSON payload, configurable connection, and method timeout.

To call a method in IoT Central portal:

1. Select the **Command** tab from the device page.
1. In the **Since** field, use the date picker and time selectors to set a time, then select **Run**.

    :::image type="content" source="media/quickstart-devkit-stm-b-l4s5i/iot-central-invoke-method-iar.png" alt-text="Screenshot of calling a direct method on a device in IoT Central":::

1. You can see the command invocation in the terminal. In this case, because the sample thermostat application displays a simulated temperature value, there won't be minimum or maximum values during the time range.

## View device information

You can view the device information from IoT Central.

Select the **About** tab from the device page.

:::image type="content" source="media/quickstart-devkit-stm-b-l4s5i/iot-central-device-about-iar.png" alt-text="Screenshot of device information in IoT Central":::

:::zone-end

:::zone pivot="iot-toolset-cmake"

> [!TIP]
> To customize these views, edit the [device template](../iot-central/core/howto-edit-device-template.md).

## Verify the device status

To view the device status in IoT Central portal:
1. From the application dashboard, select **Devices** on the side navigation menu.
1. Confirm that the **Device status** is updated to **Provisioned**.
1. Confirm that the **Device template** is updated to **Getting Started Guide**.

    :::image type="content" source="media/quickstart-devkit-stm-b-l4s5i/iot-central-device-view-status.png" alt-text="Screenshot of device status in IoT Central":::

## View telemetry

With IoT Central, you can view the flow of telemetry from your device to the cloud.

To view telemetry in IoT Central portal:

1. From the application dashboard, select **Devices** on the side navigation menu.
1. Select the device from the device list.
1. View the telemetry as the device sends messages to the cloud in the **Overview** tab.

    :::image type="content" source="media/quickstart-devkit-stm-b-l4s5i/iot-central-device-telemetry.png" alt-text="Screenshot of device telemetry in IoT Central":::

    > [!NOTE]
    > You can also monitor telemetry from the device by using the Termite app.

## Call a direct method on the device

You can also use IoT Central to call a direct method that you've implemented on your device. Direct methods have a name, and can optionally have a JSON payload, configurable connection, and method timeout. In this section, you call a method that enables you to turn an LED on or off.

To call a method in IoT Central portal:

1. Select the **Command** tab from the device page.
1. In the **State** dropdown, select **True**, and then select **Run**.  The LED light should turn on.

    :::image type="content" source="media/quickstart-devkit-stm-b-l4s5i/iot-central-invoke-method.png" alt-text="Screenshot of calling a direct method on a device in IoT Central":::

## View device information

You can view the device information from IoT Central.

Select the **About** tab from the device page.

:::image type="content" source="media/quickstart-devkit-stm-b-l4s5i/iot-central-device-about.png" alt-text="Screenshot of device information in IoT Central":::

:::zone-end

## Troubleshoot and debug

:::zone pivot="iot-toolset-cmake"
If you experience issues building the device code, flashing the device, or connecting, see [Troubleshooting](troubleshoot-embedded-device-quickstarts.md).

For debugging the application, see [Debugging with Visual Studio Code](https://github.com/azure-rtos/getting-started/blob/master/docs/debugging.md).
:::zone-end
:::zone pivot="iot-toolset-iar-ewarm"
For help with debugging the application, see the selections under **Help** in **IAR EW for ARM**.
:::zone-end
:::zone pivot="iot-toolset-stm32cube"
For help with debugging the application, see the selections under **Help**.
:::zone-end

## Clean up resources

If you no longer need the Azure resources created in this quickstart, you can delete them from the IoT Central portal.

To remove the entire Azure IoT Central sample application and all its devices and resources:
1. Select **Administration** > **Your application**.
1. Select **Delete**.

## Next steps

In this quickstart, you built a custom image that contains Azure RTOS sample code, and then flashed the image to the STM DevKit device. You also used the IoT Central portal to create Azure resources, connect the STM DevKit securely to Azure, view device data, and send messages.

As a next step, explore the following articles to learn more about using the IoT device SDKs to connect devices to Azure IoT.

> [!div class="nextstepaction"]
> [Connect a simulated device to IoT Central](quickstart-send-telemetry-central.md)
> [!div class="nextstepaction"]
> [Connect a simulated device to IoT Hub](quickstart-send-telemetry-iot-hub.md)

> [!IMPORTANT]
> Azure RTOS provides OEMs with components to secure communication and to create code and data isolation using underlying MCU/MPU hardware protection mechanisms. However, each OEM is ultimately responsible for ensuring that their device meets evolving security requirements.
