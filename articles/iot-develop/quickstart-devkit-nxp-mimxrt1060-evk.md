---
title: Connect an NXP MIMXRT1060-EVK to Azure IoT Central quickstart
description: Use Azure RTOS embedded software to connect an NXP MIMXRT1060-EVK device to Azure IoT and send telemetry.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.devlang: c
ms.topic: quickstart
ms.date: 10/21/2022
ms.custom: mode-other, engagement-fy23
zone_pivot_groups: iot-develop-nxp-toolset

# Owner: timlt
# - id: iot-develop-nxp-toolset
#   title: IoT Devices
#   prompt: Choose a build environment
#   pivots:
#   - id: iot-toolset-mcuxpresso
#     title: MCUXpresso
#Customer intent: As a device builder, I want to see a working IoT device sample connecting to IoT Hub and sending properties and telemetry, and responding to commands. As a solution builder, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Quickstart: Connect an NXP MIMXRT1060-EVK Evaluation kit to IoT Central

**Applies to**: [Embedded device development](about-iot-develop.md#embedded-device-development)<br>
**Total completion time**:  30 minutes

:::zone pivot="iot-toolset-cmake"
[![Browse code](media/common/browse-code.svg)](https://github.com/azure-rtos/getting-started/tree/master/NXP/MIMXRT1060-EVK)
:::zone-end
:::zone pivot="iot-toolset-iar-ewarm, iot-toolset-mcuxpresso"
[![Browse code](media/common/browse-code.svg)](https://github.com/azure-rtos/samples/)
:::zone-end

In this quickstart, you use Azure RTOS to connect the NXP MIMXRT1060-EVK Evaluation kit (from now on, the NXP EVK) to Azure IoT.

You'll complete the following tasks:

* Install a set of embedded development tools for programming an NXP EVK in C
* Build an image and flash it onto the NXP EVK
* Use Azure IoT Central to create cloud components, view properties, view device telemetry, and call direct commands

:::zone pivot="iot-toolset-cmake"
## Prerequisites

* A PC running Windows 10
* [Git](https://git-scm.com/downloads) for cloning the repository
* Hardware

    * The [NXP MIMXRT1060-EVK](https://www.nxp.com/design/development-boards/i-mx-evaluation-and-development-boards/mimxrt1060-evk-i-mx-rt1060-evaluation-kit:MIMXRT1060-EVK) (NXP EVK)
    * USB 2.0 A male to Micro USB male cable
    * Wired Ethernet access
    * Ethernet cable
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

[!INCLUDE [iot-develop-embedded-create-central-app-with-device](../../includes/iot-develop-embedded-create-central-app-with-device.md)]

## Prepare the device

To connect the NXP EVK to Azure, you'll modify a configuration file for Azure IoT settings, rebuild the image, and flash the image to the device.

### Add configuration

1. Open the following file in a text editor:

    *getting-started\NXP\MIMXRT1060-EVK\app\azure_config.h*

1. Set the Azure IoT device information constants to the values that you saved after you created Azure resources.

    |Constant name|Value|
    |-------------|-----|
    |`IOT_DPS_ID_SCOPE` |{*Your ID scope value*}|
    |`IOT_DPS_REGISTRATION_ID` |{*Your Device ID value*}|
    |`IOT_DEVICE_SAS_KEY` |{*Your Primary key value*}|

1. Save and close the file.

### Build the image

1. In your console or in File Explorer, run the script *rebuild.bat* at the following path to build the image:

    *getting-started\NXP\MIMXRT1060-EVK\tools\rebuild.bat*

2. After the build completes, confirm that the binary file was created in the following path:

    *getting-started\NXP\MIMXRT1060-EVK\build\app\mimxrt1060_azure_iot.bin*

### Flash the image

1. On the NXP EVK, locate the **Reset** button, the Micro USB port, and the Ethernet port.  You use these components in the following steps. All three are highlighted in the following picture:

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk/nxp-evk-board.png" alt-text="Photo showing the NXP EVK board.":::

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

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk/termite-settings.png" alt-text="Screenshot of serial port settings in the Termite app.":::

1. Select OK.
1. Press the **Reset** button on the device. The button is labeled on the device and located near the Micro USB connector.
1. In the **Termite** app, check the following checkpoint values to confirm that the device is initialized and connected to Azure IoT.

    ```output
    Starting Azure thread

    Initializing DHCP
	    IP address: 192.168.0.19
	    Mask: 255.255.255.0
	    Gateway: 192.168.0.1
    SUCCESS: DHCP initialized

    Initializing DNS client
	    DNS address: 75.75.75.75
    SUCCESS: DNS client initialized

    Initializing SNTP client
	    SNTP server 0.pool.ntp.org
	    SNTP IP address: 108.62.122.57
	    SNTP time update: May 20, 2021 19:41:20.319 UTC 
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

:::zone-end
:::zone pivot="iot-toolset-iar-ewarm"


## Prerequisites

* A PC running Windows 10 or Windows 11

* Hardware

  * The [NXP MIMXRT1060-EVK](https://www.nxp.com/design/development-boards/i-mx-evaluation-and-development-boards/mimxrt1060-evk-i-mx-rt1060-evaluation-kit:MIMXRT1060-EVK) (NXP EVK)
  * USB 2.0 A male to Micro USB male cable
  * Wired Ethernet access
  * Ethernet cable

* IAR Embedded Workbench for ARM (IAR EW). You can download and install a [14-day free trial of IAR EW for ARM](https://www.iar.com/products/architectures/arm/iar-embedded-workbench-for-arm/).

* Download the NXP MIMXRT1060-EVK IAR sample from [Azure RTOS samples](https://github.com/azure-rtos/samples/), and unzip it to a working directory. Choose a directory with a short path to avoid compiler errors when you build.

[!INCLUDE [iot-develop-embedded-create-central-app-with-device](../../includes/iot-develop-embedded-create-central-app-with-device.md)]

## Prepare the device

In this section, you use IAR EW IDE to modify a configuration file for Azure IoT settings, build the sample client application, download and then run it on the device.

### Connect the device

1. On the NXP EVK, locate the **Reset** button, the Micro USB port, and the Ethernet port.  You use these components in the following steps. All three are highlighted in the following picture:

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk/nxp-evk-board.png" alt-text="Photo of the NXP EVK board.":::

1. Connect the Micro USB cable to the Micro USB port on the NXP EVK, and then connect it to your computer. After the device powers up, a solid green LED shows the power status.
1. Use the Ethernet cable to connect the NXP EVK to an Ethernet port.

### Configure, build, flash, and run the image

1. Open the **IAR EW** app on your computer.

1. Select **File > Open workspace**, navigate to the *mimxrt1060\iar* folder in the working folder where you extracted the zip file, and open the ***azure_rtos.eww*** workspace file. 

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk/open-project-iar.png" alt-text="Screenshot showing the open IAR workspace.":::

1. Right-click the **sample_azure_iot_embedded_sdk_pnp** project in the left **Workspace** pane and select **Set as active**.

1. Expand the project, then expand the **Sample** subfolder and open the *sample_config.h* file.

1. Near the top of the file, uncomment the `#define ENABLE_DPS_SAMPLE` directive.

    ```c
    #define ENABLE_DPS_SAMPLE
    ```

1. Set the Azure IoT device information constants to the values that you saved after you created Azure resources. The `ENDPOINT` constant is set to the global endpoint for Azure Device Provisioning Service (DPS).

    |Constant name|Value|
    |-------------|-----|
    | `ENDPOINT` | "global.azure-devices-provisioning.net" |
    | `ID_SCOPE` | {*Your ID scope value*} |
    | `REGISTRATION_ID` | {*Your Device ID value*} |
    | `DEVICE_SYMMETRIC_KEY` | {*Your Primary key value*} |

    > [!NOTE]
    > The`ENDPOINT`, `ID_SCOPE`, and `REGISTRATION_ID` values are set in a `#ifndef ENABLE_DPS_SAMPLE` statement. Make sure you set the values in the `#else` statement, which will be used when the `ENABLE_DPS_SAMPLE` value is defined.

1. Save the file.

1. Select **Project > Batch Build**. Then select **build_all** and **Make** to build all projects. You'll see build output in the **Build** pane. Confirm the successful compilation and linking of all sample projects.

1. Select the green **Download and Debug** button in the toolbar to download the program.

1. After the image has finished downloading, Select **Go** to run the sample.

1. Select **View > Terminal I/O** to open a terminal window that prints status and output messages.

### Confirm device connection details

In the terminal window, you should see output like the following, to verify that the device is initialized and connected to Azure IoT.

```output
DHCP In Progress...
IP address: 192.168.1.24
Mask: 255.255.255.0
Gateway: 192.168.1.1
DNS Server address: 192.168.1.1
SNTP Time Sync...0.pool.ntp.org
SNTP Time Sync successfully.
[INFO] Azure IoT Security Module has been enabled, status=0
Start Provisioning Client...
[INFO] IoTProvisioning client connect pending
Registered Device Successfully.
IoTHub Host Name: iotc-********-****-****-****-************.azure-devices.net; Device ID: mydevice.
Connected to IoTHub.
Sent properties request.
Telemetry message send: {"temperature":22}.
Received all properties
[INFO] Azure IoT Security Module message is empty
Telemetry message send: {"temperature":22}.
Telemetry message send: {"temperature":22}.
```

Keep the terminal open to monitor device output in the following steps.

:::zone-end 
:::zone pivot="iot-toolset-mcuxpresso"

## Prerequisites

* A PC running Windows 10 or Windows 11

* Hardware

  * The [NXP MIMXRT1060-EVK](https://www.nxp.com/design/development-boards/i-mx-evaluation-and-development-boards/mimxrt1060-evk-i-mx-rt1060-evaluation-kit:MIMXRT1060-EVK) (NXP EVK)
  * USB 2.0 A male to Micro USB male cable
  * Wired Ethernet access
  * Ethernet cable

* MCUXpresso IDE (MCUXpresso), version 11.3.1 or later. Download and install a [free copy of MCUXPresso](https://www.nxp.com/design/software/development-software/mcuxpresso-software-and-tools-/mcuxpresso-integrated-development-environment-ide:MCUXpresso-IDE).

* Download the [MIMXRT1060-EVK SDK 2.9.0 or later](https://mcuxpresso.nxp.com/en/builder). After you sign in, the website lets you build a custom SDK archive to download. After you select the EVK MIMXRT1060 board and select the option to build the SDK, you can download the zip archive.  The only SDK component to include is the preselected **SDMMC Stack**.

* Download the NXP MIMXRT1060-EVK MCUXpresso sample from [Azure RTOS samples](https://github.com/azure-rtos/samples/), and unzip it to a working directory. Choose a directory with a short path to avoid compiler errors when you build.

[!INCLUDE [iot-develop-embedded-create-central-app-with-device](../../includes/iot-develop-embedded-create-central-app-with-device.md)]

## Prepare the environment

In this section, you prepare your environment, and use MCUXpresso to build and run the sample application on the device.

### Install the device SDK

1. Open MCUXpresso, and in the Home view, select **IDE** to switch to the main IDE.

1. Make sure the **Installed SDKs** window is displayed in the IDE, then drag and drop your downloaded MIMXRT1060-EVK SDK zip archive onto the window to install it. 

    The IDE with the installed SDK looks like the following screenshot:

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk/mcu-install-sdk.png" alt-text="Screenshot showing the MIMXRT 1060 SDK installed in MCUXpresso.":::
    
### Import and configure the sample project

1. In the **Quickstart Panel** of the IDE, select **Import project(s) from file system**.

1. In the **Import Projects** dialog, select the root working folder that you extracted from the Azure RTOS sample zip file, then select **Next**. 

1. Clear the option to **Copy projects into workspace**.  Leave all check boxes in the **Projects** list selected.

1. Select **Finish**.   The project opens in MCUXpresso.

1. In **Project Explorer**, select and expand the project named **sample_azure_iot_embedded_sdk_pnp**, then open the *sample_config.h* file.

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk/mcu-load-project.png" alt-text="Screenshot showing a loaded project in MCUXpresso.":::

1. Near the top of the file, uncomment the `#define ENABLE_DPS_SAMPLE` directive.

    ```c
    #define ENABLE_DPS_SAMPLE
    ```

1. Set the Azure IoT device information constants to the values that you saved after you created Azure resources. The `ENDPOINT` constant is set to the global endpoint for Azure Device Provisioning Service (DPS).

    |Constant name|Value|
    |-------------|-----|
    | `ENDPOINT` | "global.azure-devices-provisioning.net" |
    | `ID_SCOPE` | {*Your ID scope value*} |
    | `REGISTRATION_ID` | {*Your Device ID value*} |
    | `DEVICE_SYMMETRIC_KEY` | {*Your Primary key value*} |

    > [!NOTE]
    > The`ENDPOINT`, `ID_SCOPE`, and `REGISTRATION_ID` values are set in a `#ifndef ENABLE_DPS_SAMPLE` statement. Make sure you set the values in the `#else` statement, which will be used when the `ENABLE_DPS_SAMPLE` value is defined.

1. Save and close the file.

### Build and run the sample

1. In MCUXpresso, build the project **sample_azure_iot_embedded_sdk_pnp** by selecting the **Project > Build Project** menu option, or by selecting the **Build 'Debug' for [project name]** toolbar button.

1. On the NXP EVK, locate the **Reset** button, the Micro USB port, and the Ethernet port.  You use these components in the following steps. All three are highlighted in the following picture:

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk/nxp-evk-board.png" alt-text="Photo showing components on the NXP EVK board.":::

1. Connect the Micro USB cable to the Micro USB port on the NXP EVK, and then connect it to your computer. After the device powers up, a solid green LED shows the power status.
1. Use the Ethernet cable to connect the NXP EVK to an Ethernet port.
1. Open Windows **Device Manager**, expand the **Ports (COM & LPT)** node, and confirm which COM port is being used by your connected device.  You use this information to configure a terminal in the next step.

1. In MCUXpresso, configure a terminal window by selecting **Open a Terminal** in the toolbar, or by pressing CTRL+ALT+SHIFT+T.

1. In the **Choose Terminal** dropdown, select **Serial Terminal**, configure the options as in the following screenshot, and select OK. In this case, the NXP EVK device is connected to the COM3 port on a local computer.

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk/mcu-configure-terminal.png" alt-text="Screenshot of configuring a serial terminal."::: 

    > [!NOTE]
    > The terminal window appears in the lower half of the IDE and might initially display garbage characters until you download and run the sample.

1. Select the **Start Debugging project [project name]** toolbar button.  This action downloads the project to the device, and runs it.

1. After the code hits a break in the IDE, select the **Resume (F8)** toolbar button.

1. In the lower half of the IDE, select your terminal window so that you can see the output. Press the RESET button on the NXP EVK to force it to reconnect. 

### Confirm device connection details

In the terminal window, you should see output like the following, to verify that the device is initialized and connected to Azure IoT.

```output
DHCP In Progress...
IP address: 192.168.1.24
Mask: 255.255.255.0
Gateway: 192.168.1.1
DNS Server address: 192.168.1.1
SNTP Time Sync...0.pool.ntp.org
SNTP Time Sync successfully.
[INFO] Azure IoT Security Module has been enabled, status=0
Start Provisioning Client...
[INFO] IoTProvisioning client connect pending
Registered Device Successfully.
IoTHub Host Name: iotc-********-****-****-****-************.azure-devices.net; Device ID: mydevice.
Connected to IoTHub.
Sent properties request.
Telemetry message send: {"temperature":22}.
Received all properties
[INFO] Azure IoT Security Module message is empty
Telemetry message send: {"temperature":22}.
Telemetry message send: {"temperature":22}.
```

Keep the terminal open to monitor device output in the following steps.

:::zone-end

## Verify the device status

To view the device status in IoT Central portal:
1. From the application dashboard, select **Devices** on the side navigation menu.
1. Confirm that the **Device status** is updated to **Provisioned**.
1. Confirm that the **Device template** value is updated to a named template.

    :::zone pivot="iot-toolset-cmake"
    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk/iot-central-device-view-status.png" alt-text="Screenshot of device status in IoT Central.":::
    :::zone-end
    :::zone pivot="iot-toolset-iar-ewarm, iot-toolset-mcuxpresso" 
    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk/iot-central-device-view-iar-status.png" alt-text="Screenshot of NXP device status in IoT Central."::: 
    :::zone-end

## View telemetry

With IoT Central, you can view the flow of telemetry from your device to the cloud.

To view telemetry in IoT Central portal:

1. From the application dashboard, select **Devices** on the side navigation menu.
1. Select the device from the device list.
1. View the telemetry as the device sends messages to the cloud in the **Overview** tab.
1. The temperature is measured from the MCU wafer.

    :::zone pivot="iot-toolset-cmake"
    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk/iot-central-device-telemetry.png" alt-text="Screenshot of device telemetry in IoT Central.":::
    :::zone-end
    :::zone pivot="iot-toolset-iar-ewarm, iot-toolset-mcuxpresso"
    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk/iot-central-device-telemetry-iar.png" alt-text="Screenshot of NXP device telemetry in IoT Central.":::
    :::zone-end

## Call a direct method on the device

You can also use IoT Central to call a direct method that you've implemented on your device. Direct methods have a name, and can optionally have a JSON payload, configurable connection, and method timeout. 

To call a method in IoT Central portal:
:::zone pivot="iot-toolset-cmake"

1. Select the **Command** tab from the device page.
1. In the **State** dropdown, select **True**, and then select **Run**. There will be no change on the device as there isn't an available LED to toggle. However, you can view the output in Termite to monitor the status of the methods.

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk/iot-central-invoke-method.png" alt-text="Screenshot of calling a direct method on a device in IoT Central.":::

1. In the **State** dropdown, select **False**, and then select **Run**.
:::zone-end
:::zone pivot="iot-toolset-iar-ewarm, iot-toolset-mcuxpresso"

1. Select the **Command** tab from the device page.

1. In the **Since** field, use the date picker and time selectors to set a time, then select **Run**.

    :::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk/iot-central-invoke-method-iar.png" alt-text="Screenshot of calling a direct method on an NXP device in IoT Central.":::

1. You can see the command invocation in the terminal. In this case, because the sample thermostat application prints a simulated temperature value, there won't be minimum or maximum values during the time range.

    ```output
    Received command: getMaxMinReport
    ```

    > [!NOTE]
    > You can also view the command invocation and response on the **Raw data** tab on the device page in IoT Central.

:::zone-end

## View device information

You can view the device information from IoT Central.

Select **About** tab from the device page.

:::zone pivot="iot-toolset-cmake"
:::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk/iot-central-device-about.png" alt-text="Screenshot of device information in IoT Central.":::
:::zone-end
:::zone pivot="iot-toolset-iar-ewarm, iot-toolset-mcuxpresso"
:::image type="content" source="media/quickstart-devkit-nxp-mimxrt1060-evk/iot-central-device-about-iar.png" alt-text="Screenshot of NXP device information in IoT Central.":::
:::zone-end

> [!TIP]
> To customize these views, edit the [device template](../iot-central/core/howto-edit-device-template.md).

## Troubleshoot and debug

If you experience issues building the device code, flashing the device, or connecting, see [Troubleshooting](troubleshoot-embedded-device-quickstarts.md).

:::zone pivot="iot-toolset-cmake"
For debugging the application, see [Debugging with Visual Studio Code](https://github.com/azure-rtos/getting-started/blob/master/docs/debugging.md).
:::zone-end
:::zone pivot="iot-toolset-iar-ewarm"
If you need help with debugging the application, see the selections under **Help** in **IAR EW for ARM**.  
:::zone-end
:::zone pivot="iot-toolset-iar-ewarm"
If you need help with debugging the application, in MCUXpresso open the **Help > MCUXPresso IDE User Guide** and see the content on Azure RTOS debugging. 
:::zone-end

## Clean up resources

If you no longer need the Azure resources created in this quickstart, you can delete them from the IoT Central portal.

To remove the entire Azure IoT Central sample application and all its devices and resources:
1. Select **Administration** > **Your application**.
1. Select **Delete**.

## Next steps

In this quickstart, you built a custom image that contains Azure RTOS sample code, and then flashed the image to the NXP EVK device. You also used the IoT Central portal to create Azure resources, connect the NXP EVK securely to Azure, view telemetry, and send messages.

As a next step, explore the following articles to learn more about using the IoT device SDKs to connect devices to Azure IoT. 

> [!div class="nextstepaction"]
> [Connect a device to IoT Central](quickstart-send-telemetry-central.md)
> [!div class="nextstepaction"]
> [Connect a device to IoT Hub](quickstart-send-telemetry-iot-hub.md)

> [!IMPORTANT]
> Azure RTOS provides OEMs with components to secure communication and to create code and data isolation using underlying MCU/MPU hardware protection mechanisms. However, each OEM is ultimately responsible for ensuring that their device meets evolving security requirements.
