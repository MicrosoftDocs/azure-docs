<properties
   pageTitle="Connect a device using C on Linux | Microsoft Azure"
   description="Describes how to connect a device to the Azure IoT Suite preconfigured remote monitoring solution using an application written in C running on Linux."
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
   ms.date="04/26/2016"
   ms.author="dobett"/>


# Connect your device to the remote monitoring preconfigured solution (Linux)

[AZURE.INCLUDE [iot-suite-selector-connecting](../../includes/iot-suite-selector-connecting.md)]

## Build and run the C sample solution on Linux

1. To clone the *Microsoft Azure IoT SDKs* GitHub repository and install the *Microsoft Azure IoT device SDK for C* in your Linux desktop environment, follow the [Set up a Linux development environment][lnk-setup-linux] instructions.

2. Open the file **c/serializer/samples/remote_monitoring/remote_monitoring.c** in a text editor.

3. Locate the following code in the file:

    ```
    static const char* deviceId = "[Device Id]";
    static const char* deviceKey = "[Device Key]";
    static const char* hubName = "[IoTHub Name]";
    static const char* hubSuffix = "[IoTHub Suffix, i.e. azure-devices.net]";
    ```

4. Replace **[Device Id]** and **[Device Key]** with values for your device from the remote monitoring solution dashboard.

5. Use the **IoT Hub Hostname** from the dashboard to replace **[IoTHub Name]** and **[IoTHub Suffix, i.e. azure-devices.net]**. For example, if your **IoT Hub Hostname** is **contoso.azure-devices.net**, replace **[IoTHub Name]** with **contoso** and replace **[IoTHub Suffix, i.e. azure-devices.net]** with **azure-devices.net** as shown below:

    ```
    static const char* deviceId = "mydevice";
    static const char* deviceKey = "mykey";
    static const char* hubName = "Contoso";
    static const char* hubSuffix = "azure-devices.net";
    ```

6. Save your changes and build the samples. To build your sample you can run the build.sh script in the **c/build_all/linux** directory. The build script creates a **cmake** folder to store the compiled sample programs.

7. Run the **cmake/serializer/samples/remote_monitoring/remote_monitoring** sample application.

[AZURE.INCLUDE [iot-suite-visualize-connecting](../../includes/iot-suite-visualize-connecting.md)]

[lnk-setup-linux]: https://github.com/azure/azure-iot-sdks/blob/develop/c/doc/devbox_setup.md#linux

