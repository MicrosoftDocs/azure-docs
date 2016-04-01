<properties
   pageTitle="Connect a device using C on mbed | Microsoft Azure"
   description="Describes how to connect a device to the Azure IoT Suite preconfigured remote monitoring solution using an application written in C running on an mbed device."
   services=""
   suite="iot-suite"
   documentationCenter="na"
   authors="dominicbetts"
   manager="timlt"
   editor=""/>

<tags
   ms.service="iot-suite"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="02/05/2016"
   ms.author="dobett"/>


# Connect your device to the IoT Suite remote monitoring preconfigured solution

[AZURE.INCLUDE [iot-suite-selector-connecting](../../includes/iot-suite-selector-connecting.md)]

## Build and run the C sample solution on mbed

The following instructions describe the steps for connecting an [mbed-enabled Freescale FRDM-K64F][lnk-mbed-home] device to the remote monitoring solution.

### Connect the device to your network and desktop machine

1. Connect the mbed device to your network using an Ethernet cable. This step is necessary because the sample application requires internet access.

2. See [Getting Started with mbed][lnk-mbed-getstarted] to connect your mbed device to your desktop PC.

3. If your desktop PC is running Windows, see [PC Configuration][lnk-mbed-pcconnect] to configure serial port access to your mbed device.

### Create an mbed project and import the sample code

1. In your web browser, go to the mbed.org [developer site](https://developer.mbed.org/). If you haven't signed up, you will see an option to create a new account (it's free). Otherwise, log in with your account credentials. Then click **Compiler** in the upper right-hand corner of the page. This should bring you to the Workspace Management interface.

2. Make sure the hardware platform you're using appears in the upper right-hand corner of the window, or click the icon in the right-hand corner to select your hardware platform.

3. Click **Import** on the main menu. Then click the **Click here** to import from URL link next to the mbed globe logo.

    ![][6]

4. In the pop-up window, enter the link for the sample code https://developer.mbed.org/users/AzureIoTClient/code/remote_monitoring/ then click **Import**.

    ![][7]

5. You can see in the mbed compiler window that importing this project imported various libraries. Some are provided and maintained by the Azure IoT team ([azureiot_common](https://developer.mbed.org/users/AzureIoTClient/code/azureiot_common/), [iothub_client](https://developer.mbed.org/users/AzureIoTClient/code/iothub_client/), [iothub_amqp_transport](https://developer.mbed.org/users/AzureIoTClient/code/iothub_amqp_transport/), [proton-c-mbed](https://developer.mbed.org/users/AzureIoTClient/code/proton-c-mbed/)), while others are third-party libraries available in the mbed libraries catalog.

    ![][8]

6. Open the remote_monitoring\remote_monitoring.c file and locate the following code in the file:

    ```
    static const char* deviceId = "[Device Id]";
    static const char* deviceKey = "[Device Key]";
    static const char* hubName = "[IoTHub Name]";
    static const char* hubSuffix = "[IoTHub Suffix, i.e. azure-devices.net]";
    ```

7. Replace [Device Id] and [Device Key], with your device data. Use the IoT Hub Hostname to replace the [IoTHub Name] and [IoTHub Suffix, i.e. azure-devices.net] placeholders. For example, if your IoT Hub Hostname is contoso.azure-devices.net, contoso is the **hubName** and everything after it is the **hubSuffix**:

    ```
    static const char* deviceId = "mydevice";
    static const char* deviceKey = "mykey";
    static const char* hubName = "contoso";
    static const char* hubSuffix = "azure-devices.net";
    ```

    ![][9]

### Build and run the program

1. Click **Compile** to build the program. You can safely ignore any warnings, but if the build generates errors, fix them before proceeding.

2. If the build is successful, the mbed compiler website generates a .bin file with the name of your project and downloads it to your local machine. Copy the .bin file to the device. Saving the .bin file to the device causes the device to restart and run the program contained in the .bin file. You can manually restart the program at any time by pressing the reset button on the mbed device.

3. Connect to the device using an SSH client application, such as PuTTY. You can determine which serial port your device uses by checking Windows Device Manager.

    ![][11]

4. In PuTTY, click the **Serial** connection type. The device typically connects at 115200 baud, so enter 115200 in the **Speed** box. Then click **Open**.

5. The program starts executing. You may have to reset the board (press CTRL+Break or press on the board's reset button) if the program does not start automatically when you connect.

    ![][10]

[AZURE.INCLUDE [iot-suite-visualize-connecting](../../includes/iot-suite-visualize-connecting.md)]


[6]: ./media/iot-suite-connecting-devices-mbed/mbed1.png
[7]: ./media/iot-suite-connecting-devices-mbed/mbed2a.png
[8]: ./media/iot-suite-connecting-devices-mbed/mbed3a.png
[9]: ./media/iot-suite-connecting-devices-mbed/suite6.png
[10]: ./media/iot-suite-connecting-devices-mbed/putty.png
[11]: ./media/iot-suite-connecting-devices-mbed/mbed6.png

[lnk-mbed-home]: https://developer.mbed.org/platforms/FRDM-K64F/
[lnk-mbed-getstarted]: https://developer.mbed.org/platforms/FRDM-K64F/#getting-started-with-mbed
[lnk-mbed-pcconnect]: https://developer.mbed.org/platforms/FRDM-K64F/#pc-configuration

