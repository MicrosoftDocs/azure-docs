<properties
   pageTitle="Connect a device to a preconfigured solution | Microsoft Azure"
   description="Describes how to connect a device to the Azure IoT Suite preconfigured remote monitoring solution using an example that uses temperature and humidity data."
   services=""
   documentationCenter="na"
   authors="hegate"
   manager="timlt"
   editor=""/>

<tags
   ms.service="na"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="11/10/2015"
   ms.author="hegate"/>


# Connecting your device to the Azure IoT Suite remote monitoring solution

[AZURE.INCLUDE [iot-suite-selector-connecting](../../includes/iot-suite-selector-connecting.md)]



## Sending device data to the remote monitoring solution using C




### Running your device on mbed

The following instructions describe the steps for connecting an [mbed-enabled Freescale FRDM-K64F](https://developer.mbed.org/platforms/FRDM-K64F/) device to Azure IoT Hub.


#### Requirements

- Required hardware: [mbed-enabled Freescale K64F](https://developer.mbed.org/platforms/FRDM-K64F/) or similar.

#### Connect the device

- Connect the board to your network using an Ethernet cable. This step is required, as the sample depends on internet access.

- Plug the device into your computer using a micro-USB cable. Be sure to attach the cable to the correct USB port on the device, as pictured [here](https://developer.mbed.org/platforms/frdm-k64f/), in the "Getting started" section.

- Follow the [instructions on the mbed handbook](https://developer.mbed.org/handbook/SerialPC) to set up the serial connection with your device from your development machine. If you are on Windows, install the Windows serial port drivers located [here](http://developer.mbed.org/handbook/Windows-serial-configuration#1-download-the-mbed-windows-serial-port).

#### Create mbed project and import the sample code

- In your web browser, go to the mbed.org [developer site](https://developer.mbed.org/). If you haven't signed up, you will see an option to create a new account (it's free). Otherwise, log in with your account credentials. Then click on **Compiler** in the upper right-hand corner of the page. This should bring you to the Workspace Management interface.

- Make sure the hardware platform you're using appears in the upper right-hand corner of the window, or click the icon in the right-hand corner to select your hardware platform.

- Click **Import** on the main menu. Then click the **Click here** to import from URL link next to the mbed globe logo.

    ![][6]

- In the popup window, enter the link for the sample code https://developer.mbed.org/users/AzureIoTClient/code/remote_monitoring/

    ![][7]

- You can see in the mbed compiler that importing this project imported various libraries. Some are provided and maintained by the Azure IoT team ([azureiot_common](https://developer.mbed.org/users/AzureIoTClient/code/azureiot_common/), [iothub_client](https://developer.mbed.org/users/AzureIoTClient/code/iothub_client/), [iothub_amqp_transport](https://developer.mbed.org/users/AzureIoTClient/code/iothub_amqp_transport/), [iothub_http_transport](https://developer.mbed.org/users/AzureIoTClient/code/iothub_http_transport/), [proton-c-mbed](https://developer.mbed.org/users/AzureIoTClient/code/proton-c-mbed/)), while others are third party libraries available in the mbed libraries catalog.

    ![][8]

- Open remote_monitoring\remote_monitoring.c, locate the following code in the file:

    ```
    static const char* deviceId = "[Device Id]";
    static const char* deviceKey = "[Device Key]";
    static const char* hubName = "[IoTHub Name]";
    static const char* hubSuffix = "[IoTHub Suffix, i.e. azure-devices.net]";
    ```

3. Replace [Device Id] and [Device Key], with your device data.

4. Use the IoT Hub Hostname device data to fill in IoTHub name and IoTHub Suffix. To do this, you need to split it in to like this:

    If your IoT Hub Hostname is Contoso.azure-devices.net, Contoso will be your IoTHub name and everything after it will the the Suffix. It should look like this:

    ```
    static const char* deviceId = "mydevice";
    static const char* deviceKey = "mykey";
    static const char* hubName = "Contoso";
    static const char* hubSuffix = "azure-devices.net";
    ```

    ![][9]

#### Build and run the program

- Click **Compile** to build the program. You can safely ignore any warnings, but if the build generates errors, fix them before proceeding.

- If the build is successful, a .bin file with the name of your project is generated. Copy the .bin file to the device. Saving the .bin file to the device causes the current terminal session to the device to reset. When it reconnects, reset the terminal again manually, or start a new terminal. This enables the mbed device to reset and start executing the program.

- Connect to the device using an SSH client application, such as PuTTY. You can determine which serial port your device uses by checking the Windows Device Manager.


- In PuTTY, click the **Serial** connection type. The device most likely connects at 115200, so enter that value in the **Speed** box. Then click **Open**:

    ![][11]

The program starts executing. You may have to reset the board (press CTRL+Break or press on the board's reset button) if the program does not start automatically when you connect.

[AZURE.INCLUDE [iot-suite-visualize-connecting](../../includes/iot-suite-visualize-connecting.md)]



[13]: ./media/iot-suite-connecting-devices/suite4.png
[14]: ./media/iot-suite-connecting-devices/suite7-1.png
[15]: ./media/iot-suite-connecting-devices/suite8a.png
[16]: ./media/iot-suite-connecting-devices/mbed4a.png
[17]: ./media/iot-suite-connecting-devices/suite9.png
[18]: ./media/iot-suite-connecting-devices/suite10.png

