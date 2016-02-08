<properties
   pageTitle="Connect a device using C on Windows | Microsoft Azure"
   description="Describes how to connect a device to the Azure IoT Suite preconfigured remote monitoring solution using an application written in C running on Windows."
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
   ms.date="02/04/2016"
   ms.author="dobett"/>


# Connect your device to the IoT Suite remote monitoring preconfigured solution

[AZURE.INCLUDE [iot-suite-selector-connecting](../../includes/iot-suite-selector-connecting.md)]

## Build and run the C sample solution on Windows

1. To clone the *Microsoft Azure IoT SDKs* GitHub repository and install the *Microsoft Azure IoT device SDK for C* in your Windows desktop environment, follow the [Setting up a Windows development environment][lnk-setup-windows] instructions.

2. In Visual Studio 2015, open the **remote_monitoring.sln** solution in the **c\\serializer\\samples\\remote_monitoring\\windows** folder in your local copy of the repository.

3. In **Solution Explorer**, in the **remote_monitoring** project, open the **remote_monitoring.c** file.

4. Locate the following code in the file:

    ```
    static const char* deviceId = "[Device Id]";
    static const char* deviceKey = "[Device Key]";
    static const char* hubName = "[IoTHub Name]";
    static const char* hubSuffix = "[IoTHub Suffix, i.e. azure-devices.net]";
    ```

5. Replace **[Device Id]** and **[Device Key]** with values for your device from the remote monitoring solution dashboard.

6. Use the **IoT Hub Hostname** from the dashboard to replace **[IoTHub Name]** and **[IoTHub Suffix, i.e. azure-devices.net]**. For example, if your **IoT Hub Hostname** is **contoso.azure-devices.net**, replace **[IoTHub Name]** with **contoso** and replace **[IoTHub Suffix, i.e. azure-devices.net]** with **azure-devices.net** as shown below:

    ```
    static const char* deviceId = "mydevice";
    static const char* deviceKey = "mykey";
    static const char* hubName = "contoso";
    static const char* hubSuffix = "azure-devices.net";
    ```

7. In **Solution Explorer**, right-click the **remote_monitoring** project, click **Debug**, and then click **Start new instance** to build and run the sample. The console displays messages as the application sends sample telemetry to IoT Hub.

[AZURE.INCLUDE [iot-suite-visualize-connecting](../../includes/iot-suite-visualize-connecting.md)]

[lnk-setup-windows]: https://github.com/azure/azure-iot-sdks/blob/develop/c/doc/devbox_setup.md#windows