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


### Running your device on Linux

1. Set up your environment: if you've never used our Device SDK before,  learn  how to set up your environment on Linux [here](https://github.com/azure/azure-iot-sdks/blob/develop/c/doc/devbox_setup.md#linux).

1. Open the file **c/serializer/samples/serializer/remote_monitoring.c** in a text editor.

2. Locate the following code in the file:

    ```
    static const char* deviceId = "[Device Id]";
    static const char* deviceKey = "[Device Key]";
    static const char* hubName = "[IoTHub Name]";
    static const char* hubSuffix = "[IoTHub Suffix, i.e. azure-devices.net]";
    ```
    
3. Replace "[Device Id]", "[Device Key], with  your device data.

4. Use the IoT Hub Hostname device data to fill in IoTHub name and IoTHub Suffix. To do this, you need to split in IoTHub + IoTHubSuffix. For example: if your IoT Hub Hostname is "Contoso.azure-devices.net", "Contoso" will be your IoTHub name and the rest is the Suffix. It should look like this:

    ```
    static const char* deviceId = "mydevice";
    static const char* deviceKey = "mykey";
    static const char* hubName = "Contoso";
    static const char* hubSuffix = "azure-devices.net";
    ```

5. Save your changes and build the samples.  To build your sample you can run the the build.sh script in the **c/build_all/linux** directory.

6. Run the **c/serializer/samples/remote_monitoring/linux/remote_monitoring** sample application.

[AZURE.INCLUDE [iot-suite-visualize-connecting](../../includes/iot-suite-visualize-connecting.md)]


[15]: ./media/iot-suite-connecting-devices/suite8a.png
[16]: ./media/iot-suite-connecting-devices/mbed4a.png
[17]: ./media/iot-suite-connecting-devices/suite9.png



