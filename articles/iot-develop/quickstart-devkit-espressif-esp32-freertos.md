---
title: Connect an ESPRESSIF ESP-32 to Azure IoT Central quickstart
description: Use Azure IoT middleware for FreeRTOS to connect an ESPRESSIF ESP32-Azure IoT Kit device to Azure IoT and send telemetry.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.devlang: c
ms.topic: quickstart
ms.date: 11/29/2022
ms.custom: 
#Customer intent: As a device builder, I want to see a working IoT device sample connecting to Azure IoT, sending properties and telemetry, and responding to commands. As a solution builder, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Quickstart: Connect an ESPRESSIF ESP32-Azure IoT Kit to IoT Central

**Applies to**: [Embedded device development](about-iot-develop.md#embedded-device-development)<br>
**Total completion time**:  30 minutes

In this quickstart, you use the Azure IoT middleware for FreeRTOS to connect the ESPRESSIF ESP32-Azure IoT Kit (from now on, the ESP32 DevKit) to Azure IoT.

You'll complete the following tasks:

* Install a set of embedded development tools for programming an ESP32 DevKit
* Build an image and flash it onto the ESP32 DevKit
* Use Azure IoT Central to create cloud components, view properties, view device telemetry, and call direct commands

## Prerequisites

Operating system: Windows 10 or Windows 11

Hardware:
- ESPRESSIF [ESP32-Azure IoT Kit](https://www.espressif.com/products/devkits/esp32-azure-kit/overview)
- USB 2.0 A male to Micro USB male cable
- Wi-Fi 2.4 GHz
- An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prepare the development environment

To set up your development environment, first you install the ESPRESSIF ESP-IDF build environment. The installer includes all the tools required to clone, build, flash, and monitor your device.

To install the ESP-IDF tools:
1. Download and launch the [ESP-IDF Online installer](https://dl.espressif.com/dl/esp-idf).
1. When the installer prompts for a version, select version ESP-IDF v4.3.
1. When the installer prompts for the components to install, select all components. 

[!INCLUDE [iot-develop-embedded-create-central-app-with-device](../../includes/iot-develop-embedded-create-central-app-with-device.md)]

## Prepare the device
To connect the ESP32 DevKit to Azure, you'll modify configuration settings, build the image, and flash the image to the device. You can run all the commands in this section within the ESP-IDF command line.

### Set up the environment
To start the ESP-IDF PowerShell and clone the repo:
1. Select Windows **Start**, and launch **ESP-IDF PowerShell**. 
1. Navigate to a working folder where you want to clone the repo.
1. Clone the repo. This repo contains the Azure FreeRTOS middleware and sample code that you'll use to build an image for the ESP32 DevKit. 

    ```shell 
    git clone --recursive https://github.com/Azure-Samples/iot-middleware-freertos-samples
    ```

To launch the ESP-IDF configuration settings:
1. In **ESP-IDF PowerShell**, navigate to the *iot-middleware-freertos-samples* directory that you cloned previously.
1. Navigate to the ESP32-Azure IoT Kit project directory *demos\projects\ESPRESSIF\aziotkit*.
1. Run the following command to launch the configuration menu:

    ```shell
    idf.py menuconfig
    ```

### Add configuration

To add configuration to connect to Azure IoT Central:
1. In **ESP-IDF PowerShell**, select **Azure IoT middleware for FreeRTOS Main Task Configuration --->**, and press Enter.
1. Select **Enable Device Provisioning Sample**, and press Enter to enable it.
1. Set the following Azure IoT configuration settings to the values that you saved after you created Azure resources.

    |Setting|Value|
    |-------------|-----|
    |**Azure IoT Device Symmetric Key** |{*Your primary key value*}|
    |**Azure Device Provisioning Service Registration ID** |{*Your Device ID value*}|
    |**Azure Device Provisioning Service ID Scope** |{*Your ID scope value*}|

1. Press Esc to return to the previous menu.

To add wireless network configuration:
1. Select **Azure IoT middleware for FreeRTOS Sample Configuration --->**, and press Enter.
1. Set the following configuration settings using your local wireless network credentials.

    |Setting|Value|
    |-------------|-----|
    |**WiFi SSID** |{*Your Wi-Fi SSID*}|
    |**WiFi Password** |{*Your Wi-Fi password*}|

1. Press Esc to return to the previous menu.

To save the configuration:
1. Press **S** to open the save options, then press Enter to save the configuration.
1. Press Enter to dismiss the acknowledgment message.
1. Press **Q** to quit the configuration menu.


### Build and flash the image
In this section, you use the ESP-IDF tools to build, flash, and monitor the ESP32 DevKit as it connects to Azure IoT.  

> [!NOTE]
> In the following commands in this section, use a short build output path near your root directory. Specify the build path after the `-B` parameter in each command that requires it. The short path helps to avoid a current issue in the ESPRESSIF ESP-IDF tools that can cause errors with long build path names.  The following commands use a local path *C:\espbuild* as an example.

To build the image:
1. In **ESP-IDF PowerShell**, from the *iot-middleware-freertos-samples\demos\projects\ESPRESSIF\aziotkit* directory, run the following command to build the image.

    ```shell
    idf.py --no-ccache -B "C:\espbuild" build 
    ```

1. After the build completes, confirm that the binary image file was created in the build path that you specified previously.

    *C:\espbuild\azure_iot_freertos_esp32.bin*

To flash the image:
1. On the ESP32 DevKit, locate the Micro USB port, which is highlighted in the following image:

    :::image type="content" source="media/quickstart-devkit-espressif-esp32/esp-azure-iot-kit.png" alt-text="Photo of the ESP32-Azure IoT Kit board.":::

1. Connect the Micro USB cable to the Micro USB port on the ESP32 DevKit, and then connect it to your computer.
1. Open Windows **Device Manager**, and view **Ports** to find out which COM port the ESP32 DevKit is connected to.

    :::image type="content" source="media/quickstart-devkit-espressif-esp32/esp-device-manager.png" alt-text="Screenshot of Windows Device Manager displaying COM port for a connected device.":::

1. In **ESP-IDF PowerShell**, run the following command, replacing the *\<Your-COM-port\>* placeholder and brackets with the correct COM port from the previous step. For example, replace the placeholder with `COM3`. 

    ```shell
    idf.py --no-ccache -B "C:\espbuild" -p <Your-COM-port> flash
    ```

1. Confirm that the output completes with the following text for a successful flash:

    ```output
    Hash of data verified
    
    Leaving...
    Hard resetting via RTS pin...
    Done
    ```

To confirm that the device connects to Azure IoT Central:
1. In **ESP-IDF PowerShell**, run the following command to start the monitoring tool. As you did in a previous command, replace the \<Your-COM-port\> placeholder, and brackets with the COM port that the device is connected to.

    ```shell
    idf.py -B "C:\espbuild" -p <Your-COM-port> monitor
    ```

1. Check for repeating blocks of output similar to the following example. This output confirms that the device connects to Azure IoT and sends telemetry.

    ```output
    I (50807) AZ IOT: Successfully sent telemetry message
    I (50807) AZ IOT: Attempt to receive publish message from IoT Hub.
    
    I (51057) MQTT: Packet received. ReceivedBytes=2.
    I (51057) MQTT: Ack packet deserialized with result: MQTTSuccess.
    I (51057) MQTT: State record updated. New state=MQTTPublishDone.
    I (51067) AZ IOT: Puback received for packet id: 0x00000008
    I (53067) AZ IOT: Keeping Connection Idle...
    ```

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

> [!TIP]
> To customize these views, edit the [device template](../iot-central/core/howto-edit-device-template.md).

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

In this quickstart, you built a custom image that contains the Azure IoT middleware for FreeRTOS sample code, and then you flashed the image to the ESP32 DevKit device. You also used the IoT Central portal to create Azure resources, connect the ESP32 DevKit securely to Azure, view telemetry, and send messages.

As a next step, explore the following articles to learn more about working with embedded devices and connecting them to Azure IoT. 

> [!div class="nextstepaction"]
> [Azure IoT middleware for FreeRTOS samples](https://github.com/Azure-Samples/iot-middleware-freertos-samples)
> [!div class="nextstepaction"]
> [Azure RTOS embedded development quickstarts](quickstart-devkit-mxchip-az3166.md)
> [!div class="nextstepaction"]
> [Azure IoT device development documentation](./index.yml)