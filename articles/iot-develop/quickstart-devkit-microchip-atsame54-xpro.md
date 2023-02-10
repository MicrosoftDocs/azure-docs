---
title: Connect a Microchip ATSAME54-XPro to Azure IoT Central quickstart
description: Use Azure RTOS embedded software to connect a Microchip ATSAME54-XPro device to Azure IoT and send telemetry.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.devlang: c
ms.topic: quickstart
ms.date: 10/21/2022
ms.custom: engagement-fy23
zone_pivot_groups: iot-develop-toolset
#- id: iot-develop-toolset
## Owner: timlt
#  title: IoT Devices
#  prompt: Choose a build environment
#  - id: iot-toolset-mplab
#    title: MPLAB
#Customer intent: As a device builder, I want to see a working IoT device sample connecting to IoT Hub and sending properties and telemetry, and responding to commands. As a solution builder, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Quickstart: Connect a Microchip ATSAME54-XPro Evaluation kit to IoT Central

**Applies to**: [Embedded device development](about-iot-develop.md#embedded-device-development)<br>
**Total completion time**:  45 minutes

:::zone pivot="iot-toolset-cmake"
[![Browse code](media/common/browse-code.svg)](https://github.com/azure-rtos/getting-started/tree/master/Microchip/ATSAME54-XPRO)
:::zone-end
:::zone pivot="iot-toolset-iar-ewarm, iot-toolset-mplab"
[![Browse code](media/common/browse-code.svg)](https://github.com/azure-rtos/samples/)
:::zone-end

In this quickstart, you use Azure RTOS to connect the Microchip ATSAME54-XPro (from now on, the Microchip E54) to Azure IoT.

You'll complete the following tasks:

* Install a set of embedded development tools for programming a Microchip E54 in C
* Build an image and flash it onto the Microchip E54
* Use Azure IoT Central to create cloud components, view properties, view device telemetry, and call direct commands

:::zone pivot="iot-toolset-cmake"

## Prerequisites

* A PC running Windows 10
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
>
> * [CMake](https://cmake.org): Build
> * [ARM GCC](https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm): Compile
> * [Termite](https://www.compuphase.com/software_termite.htm): Monitor serial port output for connected devices

To install the tools:

1. From File Explorer, navigate to the following path in the repo and run the setup script named ***get-toolchain.bat***:

    *getting-started\tools\get-toolchain.bat*

1. After the installation, open a new console window to recognize the configuration changes made by the setup script. Use this console to complete the remaining programming tasks in the quickstart. You can use Windows CMD, PowerShell, or Git Bash for Windows.
1. Run the following code to confirm that CMake version 3.14 or later is installed.

    ```shell
    cmake --version
    ```

1. Install [Microchip Studio for AVR&reg; and SAM devices](https://www.microchip.com/en-us/development-tools-tools-and-software/microchip-studio-for-avr-and-sam-devices#). Microchip Studio is a device development environment that includes the tools to program and flash the Microchip E54. For this tutorial, you use Microchip Studio only to flash the Microchip E54. The installation takes several minutes, and prompts you several times to approve the installation of components.

[!INCLUDE [iot-develop-embedded-create-central-app-with-device](../../includes/iot-develop-embedded-create-central-app-with-device.md)]

## Prepare the device

To connect the Microchip E54 to Azure, you'll modify a configuration file for Azure IoT settings, rebuild the image, and flash the image to the device.

### Add configuration

1. Open the following file in a text editor:

    *getting-started\Microchip\ATSAME54-XPRO\app\azure_config.h*

1. Set the Azure IoT device information constants to the values that you saved after you created Azure resources.

    |Constant name|Value|
    |-------------|-----|
    | `IOT_DPS_ID_SCOPE` | {*Your ID scope value*} |
    | `IOT_DPS_REGISTRATION_ID` | {*Your Device ID value*} |
    | `IOT_DEVICE_SAS_KEY` | {*Your Primary key value*} |

1. Save and close the file.

### Connect the device

1. On the Microchip E54, locate the **Reset** button, the **Ethernet** port, and the Micro USB port, which is labeled **Debug USB**. Each component is highlighted in the following picture:

    ![Locate key components on the Microchip E54 evaluation kit board](media/quickstart-devkit-microchip-atsame54-xpro/microchip-xpro-board.png)

1. Connect the Micro USB cable to the **Debug USB** port on the Microchip E54, and then connect it to your computer.

    > [!NOTE]
    > Optionally, for more information about setting up and getting started with the Microchip E54, see [SAM E54 Xplained Pro User's Guide](http://ww1.microchip.com/downloads/en/DeviceDoc/70005321A.pdf).

1. Use the Ethernet cable to connect the Microchip E54 to an Ethernet port.

### Optional: Install a weather sensor

If you have the Weather Click sensor and the mikroBUS Xplained Pro adapter, follow the steps in this section; otherwise, skip to [Build the image](#build-the-image). You can complete this quickstart even if you don't have a sensor. The sample code for the device returns simulated data if a real sensor isn't present.

1. If you have the Weather Click sensor and the mikroBUS Xplained Pro adapter, install them on the Microchip E54 as shown in the following photo:

    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro/sam-e54-sensor.png" alt-text="Install Weather Click sensor and mikroBUS Xplained Pro adapter on the Microchip ES4":::

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
    > If you have issues getting your device to initialize or connect after flashing, seeTroubleshooting](troubleshoot-embedded-device-quickstarts.md) for additional steps.

1. Select **Settings**.

1. In the **Serial port settings** dialog, check the following settings and update if needed:
    * **Baud rate**: 115,200
    * **Port**: The port that your Microchip E54 is connected to. If there are multiple port options in the dropdown, you can find the correct port to use. Open Windows **Device Manager**, and view **Ports** to identify which port to use.
    * **Flow control**: DTR/DSR

    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro/termite-settings.png" alt-text="Screenshot of serial port settings in the Termite app":::

1. Select **OK**.

1. Press the **Reset** button on the device. The button is labeled on the device and located near the Micro USB connector.

1. In the **Termite** app, confirm the following checkpoint values to verify that the device is initialized and connected to Azure IoT.

    ```output
    Starting Azure thread

    Initializing DHCP
        IP address: 192.168.0.21
        Mask: 255.255.255.0
        Gateway: 192.168.0.1
    SUCCESS: DHCP initialized

    Initializing DNS client
        DNS address: 75.75.75.75
    SUCCESS: DNS client initialized

    Initializing SNTP client
        SNTP server 0.pool.ntp.org
        SNTP IP address: 45.55.58.103
        SNTP time update: Jun 5, 2021 20:2:46.32 UTC 
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

* A PC running Windows 10

* Hardware

  * The [Microchip ATSAME54-XPro](https://www.microchip.com/developmenttools/productdetails/atsame54-xpro) (Microchip E54)
  * USB 2.0 A male to Micro USB male cable
  * Wired Ethernet access
  * Ethernet cable

* [Termite](https://www.compuphase.com/software_termite.htm). On the web page, under **Downloads and license**, choose the complete setup. Termite is an RS232 terminal that you'll use to monitor output for your device.

* IAR Embedded Workbench for ARM (EW for ARM). You can download and install a  [14-day free trial of IAR EW for ARM](https://www.iar.com/products/architectures/arm/iar-embedded-workbench-for-arm/).

* Download the Microchip ATSAME54-XPRO IAR sample from [Azure RTOS samples](https://github.com/azure-rtos/samples/), and unzip it to a working directory. 
    > [!IMPORTANT]
    > Choose a directory with a short path to avoid compiler errors when you build. For example, use *C:\atsame54*.  

[!INCLUDE [iot-develop-embedded-create-central-app-with-device](../../includes/iot-develop-embedded-create-central-app-with-device.md)]

## Prepare the device

To connect the Microchip E54 to Azure, you'll connect the Microchip E54 to your computer, modify a configuration file for Azure IoT settings, build the image, and flash the image to the device.

### Connect the device

1. On the Microchip E54, locate the **Reset** button, the **Ethernet** port, and the Micro USB port, which is labeled **Debug USB**. Each component is highlighted in the following picture:

    ![Locate key components on the Microchip E54 evaluation kit board](media/quickstart-devkit-microchip-atsame54-xpro/microchip-xpro-board.png)

1. Connect the Micro USB cable to the **Debug USB** port on the Microchip E54, and then connect it to your computer.

    > [!NOTE]
    > Optionally, for more information about setting up and getting started with the Microchip E54, see [SAM E54 Xplained Pro User's Guide](http://ww1.microchip.com/downloads/en/DeviceDoc/70005321A.pdf).

1. Use the Ethernet cable to connect the Microchip E54 to an Ethernet port.

### Configure Termite

You'll use the **Termite** app to monitor communication and confirm that your device is set up correctly. In this section, you configure **Termite** to monitor the serial port of your device.

1. Start **Termite**.

1. Select **Settings**.

1. In the **Serial port settings** dialog, check the following settings and update if needed:
    * **Baud rate**: 115,200
    * **Port**: The port that your Microchip E54 is connected to. If there are multiple port options in the dropdown, you can find the correct port to use. Open Windows **Device Manager**, and view **Ports** to identify which port to use.
    * **Flow control**: DTR/DSR

    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro/termite-settings.png" alt-text="Screenshot of serial port settings in the Termite app":::

1. Select **OK**.

Termite is now ready to receive output from the Microchip E54.

### Configure, build, flash, and run the image

1. Open the **IAR EW for ARM** app on your computer.

1. Select **File > Open workspace**, navigate to the **same54Xpro\iar** folder off the working folder where you extracted the zip file, and open the ***azure_rtos.eww*** EWARM Workspace.

    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro/open-project-iar.png" alt-text="Open the IAR workspace":::

1. Right-click the **sample_azure_iot_embedded_sdk_pnp** project in the left **Workspace** pane and select **Set as active**.

1. Expand the sample, then expand the **Sample** folder and open the sample_config.h file.

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

### Confirm device connection details

In the **Termite** app, confirm the following checkpoint values to verify that the device is initialized and connected to Azure IoT.

```output
DHCP In Progress...
IP address: 192.168.0.22
Mask: 255.255.255.0
Gateway: 192.168.0.1
DNS Server address: 75.75.75.75
SNTP Time Sync...
SNTP Time Sync successfully.
[INFO] Azure IoT Security Module has been enabled, status=0
Start Provisioning Client...
[INFO] IoTProvisioning client connect pending
Registered Device Successfully.
IoTHub Host Name: iotc-********-****-****-****-************.azure-devices.net; Device ID: mydevice.
Connected to IoTHub.
Telemetry message send: {"temperature":22}.
Receive twin properties: {"desired":{"$version":1},"reported":{"maxTempSinceLastReboot":22,"$version":8}}
Failed to parse value
Telemetry message send: {"temperature":22}.
Telemetry message send: {"temperature":22}.
```

Keep Termite open to monitor device output in the following steps.

:::zone-end
:::zone pivot="iot-toolset-mplab"

## Prerequisites

* A PC running Windows 10

* Hardware

  * The [Microchip ATSAME54-XPro](https://www.microchip.com/developmenttools/productdetails/atsame54-xpro) (Microchip E54)
  * USB 2.0 A male to Micro USB male cable
  * Wired Ethernet access
  * Ethernet cable

* [Termite](https://www.compuphase.com/software_termite.htm). On the web page, under **Downloads and license**, choose the complete setup. Termite is an RS232 terminal that you'll use to monitor output for your device.

* [MPLAB X IDE 5.35](https://www.microchip.com/mplab/mplab-x-ide).

* [MPLAB XC32/32++ Compiler 2.4.0 or later](https://www.microchip.com/mplab/compilers).

* Download the Microchip ATSAME54-XPRO MPLab sample from [Azure RTOS samples](https://github.com/azure-rtos/samples/), and unzip it to a working directory.
    > [!IMPORTANT]
    > Choose a directory with a short path to avoid compiler errors when you build. For example, use *C:\atsame54*.  

[!INCLUDE [iot-develop-embedded-create-central-app-with-device](../../includes/iot-develop-embedded-create-central-app-with-device.md)]

## Prepare the device

To connect the Microchip E54 to Azure, you'll connect the Microchip E54 to your computer, modify a configuration file for Azure IoT settings, build the image, and flash the image to the device.

### Connect the device

1. On the Microchip E54, locate the **Reset** button, the **Ethernet** port, and the Micro USB port, which is labeled **Debug USB**. Each component is highlighted in the following picture:

    ![Locate key components on the Microchip E54 evaluation kit board](media/quickstart-devkit-microchip-atsame54-xpro/microchip-xpro-board.png)

1. Connect the Micro USB cable to the **Debug USB** port on the Microchip E54, and then connect it to your computer.

    > [!NOTE]
    > Optionally, for more information about setting up and getting started with the Microchip E54, see [SAM E54 Xplained Pro User's Guide](http://ww1.microchip.com/downloads/en/DeviceDoc/70005321A.pdf).

1. Use the Ethernet cable to connect the Microchip E54 to an Ethernet port.

### Configure Termite

You'll use the **Termite** app to monitor communication and confirm that your device is set up correctly. In this section, you configure **Termite** to monitor the serial port of your device.

1. Start **Termite**.

1. Select **Settings**.

1. In the **Serial port settings** dialog, check the following settings and update if needed:
    * **Baud rate**: 115,200
    * **Port**: The port that your Microchip E54 is connected to. If there are multiple port options in the dropdown, you can find the correct port to use. Open Windows **Device Manager**, and view **Ports** to identify which port to use.
    * **Flow control**: DTR/DSR

    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro/termite-settings.png" alt-text="Screenshot of serial port settings in the Termite app":::

1. Select **OK**.

Termite is now ready to receive output from the Microchip E54.

### Configure, build, flash, and run the image

1. Open **MPLAB X IDE**  on your computer.

1. Select **File > Open project**. In the open project dialog, navigate to the **same54Xpro\mplab** folder off the working folder where you extracted the zip file. Select all of the projects (don't select **common_hardware_code** or **docs** folders), and then select **Open Project**.

    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro/open-project-mplab.png" alt-text="Open projects in the MPLab IDE":::

1. Right-click the **sample_azure_iot_embedded_sdk_pnp** project in the left **Projects** pane and select **Set as Main Project**.

1. Expand the **sample_azure_iot_embedded_sdk_pnp** project, then expand the **Header Files** folder and open the sample_config.h file.

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

1. Before you can build the sample, you must build the **sample_azure_iot_embedded_pnp** project's dependent libraries: **threadx**, **netxduo**, and **same54_lib**. To build each library, right-click its project in the **Projects** pane and select **Build**. Wait for each build to complete before moving to the next library.

1. After all prerequisite libraries have been successfully built, right-click the **sample_azure_iot_embedded_pnp** project and select **Build**.

1. Select **Debug > Debug Main Project** from the top menu to download and start the program.

1. If a **Tool not Found** dialog appears, select **connect SAM E54 board**, and then select **OK**.

1. It may take a few minutes for the program to download and start running. Once the program has successfully downloaded and is running, you'll see the following status in the MPLAB X IDE **Output** pane.

    ```output
    Programming complete
    
    Running
    ```

### Confirm device connection details

In the **Termite** app, confirm the following checkpoint values to verify that the device is initialized and connected to Azure IoT.

```output
DHCP In Progress...
IP address: 192.168.0.22
Mask: 255.255.255.0
Gateway: 192.168.0.1
DNS Server address: 75.75.75.75
SNTP Time Sync...
SNTP Time Sync successfully.
[INFO] Azure IoT Security Module has been enabled, status=0
Start Provisioning Client...
[INFO] IoTProvisioning client connect pending
Registered Device Successfully.
IoTHub Host Name: iotc-********-****-****-****-************.azure-devices.net; Device ID: mydevice.
Connected to IoTHub.
Telemetry message send: {"temperature":22}.
Receive twin properties: {"desired":{"$version":1},"reported":{"maxTempSinceLastReboot":22,"$version":8}}
Failed to parse value
Telemetry message send: {"temperature":22}.
Telemetry message send: {"temperature":22}.
```

Keep Termite open to monitor device output in the following steps.

:::zone-end

## Verify the device status

To view the device status in IoT Central portal:

:::zone pivot="iot-toolset-cmake"
1. From the application dashboard, select **Devices** on the side navigation menu.
1. Confirm that the **Device status** is updated to *Provisioned*.
1. Confirm that the **Device template** is updated to *Getting Started Guide*.

    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro/iot-central-device-view-status.png" alt-text="Screenshot of device status in IoT Central":::
:::zone-end
:::zone pivot="iot-toolset-iar-ewarm, iot-toolset-mplab"
1. From the application dashboard, select **Devices** on the side navigation menu.
1. Confirm that the **Device status** is updated to *Provisioned*.
1. Confirm that the **Device template** is updated to *Thermostat*.

    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro/iot-central-device-view-status-iar.png" alt-text="Screenshot of device status in IoT Central":::
:::zone-end

## View telemetry

With IoT Central, you can view the flow of telemetry from your device to the cloud.

To view telemetry in IoT Central portal:

1. From the application dashboard, select **Devices** on the side navigation menu.
1. Select the device from the device list.
1. View the telemetry as the device sends messages to the cloud in the **Overview** tab.

    :::zone pivot="iot-toolset-cmake"
    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro/iot-central-device-telemetry.png" alt-text="Screenshot of device telemetry in IoT Central":::
    :::zone-end
    :::zone pivot="iot-toolset-iar-ewarm, iot-toolset-mplab"
    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro/iot-central-device-telemetry-iar.png" alt-text="Screenshot of device telemetry in IoT Central":::
    :::zone-end

    > [!NOTE]
    > You can also monitor telemetry from the device by using the Termite app.

## Call a direct method on the device

You can also use IoT Central to call a direct method that you've implemented on your device. Direct methods have a name, and can optionally have a JSON payload, configurable connection, and method timeout. In this section, you call a method that enables you to turn an LED on or off.

To call a method in IoT Central portal:
:::zone pivot="iot-toolset-cmake"

1. Select the **Command** tab from the device page.

1. In the **State** dropdown, select **True**, and then select **Run**.  The LED light should turn on.

    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro/iot-central-invoke-method.png" alt-text="Screenshot of calling a direct method on a device in IoT Central":::

1. In the **State** dropdown, select **False**, and then select **Run**. The LED light should turn off.
:::zone-end
:::zone pivot="iot-toolset-iar-ewarm, iot-toolset-mplab"

1. Select the **Command** tab from the device page.

1. In the **Since** field, use the date picker and time selectors to set a time, then select **Run**.

    :::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro/iot-central-invoke-method-iar.png" alt-text="Screenshot of calling a direct method on a device in IoT Central":::

1. You can see the command invocation in Termite:

    ```output
    Receive method call: getMaxMinReport, with payload:"2021-10-14T17:45:00.000Z"
    ```

    > [!NOTE]
    > You can also view the command invocation and response on the **Raw data** tab on the device page in IoT Central.
:::zone-end

## View device information

You can view the device information from IoT Central.

Select **About** tab from the device page.

:::zone pivot="iot-toolset-cmake"
:::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro/iot-central-device-about.png" alt-text="Screenshot of device information in IoT Central":::
:::zone-end
:::zone pivot="iot-toolset-iar-ewarm, iot-toolset-mplab"
:::image type="content" source="media/quickstart-devkit-microchip-atsame54-xpro/iot-central-device-about-iar.png" alt-text="Screenshot of device information in IoT Central":::
:::zone-end

> [!TIP]
> To customize these views, edit the [device template](../iot-central/core/howto-edit-device-template.md).

## Troubleshoot and debug

If you experience issues building the device code, flashing the device, or connecting, see [Troubleshooting](troubleshoot-embedded-device-quickstarts.md).

:::zone pivot="iot-toolset-cmake"
For debugging the application, see [Debugging with Visual Studio Code](https://github.com/azure-rtos/getting-started/blob/master/docs/debugging.md).
:::zone-end
:::zone pivot="iot-toolset-iar-ewarm"
For help with debugging the application, see the selections under **Help** in **IAR EW for ARM**.  
:::zone-end
:::zone pivot="iot-toolset-mplab"
For help with debugging the application, see the selections under **Help** in **MPLAB X IDE**.  
:::zone-end

## Clean up resources

If you no longer need the Azure resources created in this quickstart, you can delete them from the IoT Central portal.

To remove the entire Azure IoT Central sample application and all its devices and resources:

1. Select **Administration** > **Your application**.
1. Select **Delete**.

## Next steps

In this quickstart, you built a custom image that contains Azure RTOS sample code, and then flashed the image to the Microchip E54 device. You also used the IoT Central portal to create Azure resources, connect the Microchip E54 securely to Azure, view telemetry, and send messages.

As a next step, explore the following articles to learn more about using the IoT device SDKs to connect devices to Azure IoT. 

> [!div class="nextstepaction"]
> [Connect a simulated device to IoT Central](quickstart-send-telemetry-central.md)
> [!div class="nextstepaction"]
> [Connect a simulated device to IoT Hub](quickstart-send-telemetry-iot-hub.md)

> [!IMPORTANT]
> Azure RTOS provides OEMs with components to secure communication and to create code and data isolation using underlying MCU/MPU hardware protection mechanisms. However, each OEM is ultimately responsible for ensuring that their device meets evolving security requirements.
