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

## Sending device data to the remote monitoring solution using node.js



-   In our azure-iot-sdks repo, locate the following files: packages.json (under /node/common) and remote_monitoring.js under node/device/samples/). Copy them to your device and put them in the same folder.

- Open the remote-monitoring.js file and look for the following variables:


   ```
   var deviceID = "[DeviceID]";
   var deviceKey = "[Device Key]";
   var hubName = "[IoT Hub Name]";
   var hubSuffix = "[IoT Hub Suffix i.e azure-devices.net]";
   ```

-  Replace "[Device Id]", "[Device Key], with the data your device data.

-  Use the IoT Hub Hostname device data to fill in IoTHub name and IoTHub Suffix. To do this, you need to split it in to like this:

   If your IoT Hub Hostname is Contoso.azure-devices.net, Contoso will be your IoTHub name and everything after it will the the Suffix. It should look like this:


   ```
   var deviceID = "mydevice";
   var deviceKey = "mykey";
   var hubName = "Contoso";
   var hubSuffix = "azure-devices.net";
   ```


- Save the file. Run the following command on the destination folder:

```
npm install
node .
```

3.  Replace each of the variables with the information you gathered in the previous step. Save the changes.


4. Open a shell (Linux) or Node.js command prompt (Windows) and navigate to the **node\\samples** folder. Then run the sample application using the following command:

    ```
    node simple_sample_remotemonitoring.js
    ```

[AZURE.INCLUDE [iot-suite-visualize-connecting](../../includes/iot-suite-visualize-connecting.md)]



[15]: ./media/iot-suite-connecting-devices/suite8a.png
[16]: ./media/iot-suite-connecting-devices/mbed4a.png
[17]: ./media/iot-suite-connecting-devices/suite9.png

