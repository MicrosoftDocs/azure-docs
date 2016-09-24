<properties
   pageTitle="Connect a device using Node.js | Microsoft Azure"
   description="Describes how to connect a device to the Azure IoT Suite preconfigured remote monitoring solution using an application written in Node.js."
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
   ms.date="07/14/2016"
   ms.author="dobett"/>


# Connect your device to the remote monitoring preconfigured solution (Node.js)

[AZURE.INCLUDE [iot-suite-selector-connecting](../../includes/iot-suite-selector-connecting.md)]

## Build and run the node.js sample solution

1. To clone the *Microsoft Azure IoT SDKs* GitHub repository and install the *Microsoft Azure IoT device SDK for Node.js* in your desktop environment, follow the [Prepare your development environment][lnk-github-prepare] instructions.

2. From your local copy of the [azure-iot-sdks][lnk-github-repo] repository, copy the following two files from the node/device/samples folder to a folder on your device:

  - packages.json
  - remote_monitoring.js

3. Open the remote_monitoring.js file and look for the following variable:

    ```
    var connectionString = "[IoT Hub device connection string]";
    ```

4. Replace **[IoT Hub device connection string]** with your device connection string. You can find the values for your IoT Hub hostname, device id, and device key in the remote monitoring solution dashboard. A device connection string has the following format:

    ```
    HostName={your IoT Hub hostname};DeviceId={your device id};SharedAccessKey={your device key}
    ```

    If your IoT Hub hostname is **contoso** and your device id is **mydevice**, your connection string will look like this:

    ```
    var connectionString = "HostName=contoso.azure-devices.net;DeviceId=mydevice;SharedAccessKey=2s ... =="
    ```

5. Save the file. Run the following commands at a command prompt in the folder that contains these files to install the necessary packages and then run the sample application:

    ```
    npm install
    node remote_monitoring.js
    ```

[AZURE.INCLUDE [iot-suite-visualize-connecting](../../includes/iot-suite-visualize-connecting.md)]

[lnk-github-repo]: https://github.com/azure/azure-iot-sdks
[lnk-github-prepare]: https://github.com/Azure/azure-iot-sdks/blob/master/doc/get_started/node-devbox-setup.md